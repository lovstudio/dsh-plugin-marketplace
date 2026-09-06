/**
 * Local-first client for the dshfind plugin catalog. Only `refresh()` reads
 * the public cloud API; list, detail, suggestion, and facet operations query
 * the last complete IndexedDB snapshot after validating its durable payload.
 */

import { createMarketCatalogCache, type MarketCatalogCache } from './market-cache.ts'
import { compareMarketPlugins, matchesTerm } from './search.ts'
import type {
  GitHubMarketRepository, GitHubMarketSearchPage, GitHubMarketSearchRequest,
} from '@lovstudio/dsh-plugin-marketplace/host'
import type {
  MarketDetailInfo, MarketPageResult, MarketPluginSummary, MarketRequest, MarketSuggestion,
} from './types.ts'
import type { MarketProviderId } from '../market-settings.ts'

/** Default catalog base URL (production environment of the published contract). */
export const DEFAULT_MARKET_BASE_URL = 'https://api.dshfind.com'

/** A JSON fetch with the current RequestInit signature (injectable for tests). */
export type MarketFetch = (input: string, init?: RequestInit) => Promise<Response>

/** One queued GitHub request in a durable oldest-first crawl. */
interface GitHubSyncTask {
  from: number
  to: number
  page: number
  totalPages?: number
}

/** GitHub synchronization state committed after every successful request. */
interface GitHubSyncCheckpoint {
  replace: boolean
  runEnd: number
  total: number
  requests: number
  downloaded: number
  blockedUntil: number
  pending: readonly GitHubSyncTask[]
  rows: readonly Record<string, unknown>[]
}

/** Durable wrapper around one complete catalog and optional in-progress crawl. */
interface CachedCatalogEnvelope {
  updatedAt?: number
  catalog?: unknown
  githubSync?: GitHubSyncCheckpoint
}

/** In-memory projection of the current durable catalog. */
interface LocalCatalog {
  items: readonly MarketPluginSummary[]
  dataVersion?: string
  updatedAt?: number
  raw?: unknown
}

const EMPTY_CATALOG: LocalCatalog = { items: [] }

/** One validated plugin row (unknowns dropped, required fields enforced). */
function parsePlugin(raw: unknown): MarketPluginSummary {
  const record = (raw ?? {}) as Record<string, unknown>
  const tags = Array.isArray(record.tags)
    ? record.tags.filter((tag): tag is string => typeof tag === 'string')
    : []
  const summary: MarketPluginSummary = {
    fullName: typeof record.full_name === 'string' ? record.full_name : '',
    name: typeof record.name === 'string' ? record.name : '',
    owner: typeof record.owner === 'string' ? record.owner : '',
    repositoryUrl: typeof record.repository_url === 'string' ? record.repository_url : '',
    description: typeof record.description === 'string' ? record.description : '',
    tags,
    stars: typeof record.stars === 'number' ? record.stars : 0,
    archived: record.archived === true,
    isFeatured: record.is_featured === true,
    isOfficial: record.is_official === true,
    isInsider: record.is_insider === true,
    isRisky: record.is_risky === true,
    isPlugin: record.is_plugin === true,
  }
  if (typeof record.language === 'string') summary.language = record.language
  if (typeof record.contributors === 'number') summary.contributors = record.contributors
  if (typeof record.pushed_at === 'string') summary.pushedAt = record.pushed_at
  if (typeof record.category === 'string') summary.category = record.category
  if (typeof record.score === 'number') summary.score = record.score
  if (record.grade === 'S' || record.grade === 'A' || record.grade === 'B' || record.grade === 'C') {
    summary.grade = record.grade
  }
  if (typeof record.risk_note === 'string') summary.riskNote = record.risk_note
  const install = typeof record.install === 'object' && record.install !== null
    ? record.install as Record<string, unknown>
    // GitHub rows cached before the provider probed installs carry none.
    : typeof record._github_id === 'number' && summary.fullName.length > 0
      ? githubInstallInfo(summary.fullName)
      : undefined
  if (install !== undefined) {
    const parsed: NonNullable<MarketPluginSummary['install']> = {}
    if (typeof install.cmd === 'string') parsed.cmd = install.cmd
    if (typeof install.kind === 'string') parsed.kind = install.kind
    if (typeof install.pkg_name === 'string') parsed.pkgName = install.pkg_name
    if (typeof install.pkg_version === 'string') parsed.pkgVersion = install.pkg_version
    if (typeof install.npm_published === 'boolean') parsed.npmPublished = install.npm_published
    summary.install = parsed
  }
  return summary
}

/** Whether a parsed row carries the minimum identity a card can render. */
function isUsablePlugin(plugin: MarketPluginSummary): boolean {
  return plugin.fullName.length > 0 && plugin.name.length > 0
}

/** Validate one `GET /v1/plugins` page envelope. */
function parsePluginList(raw: unknown): MarketPageResult {
  const record = (raw ?? {}) as Record<string, unknown>
  const items = Array.isArray(record.data)
    ? record.data.map(parsePlugin).filter(isUsablePlugin)
    : []
  const result: MarketPageResult = {
    items,
    total: typeof record.total === 'number' ? record.total : items.length,
    page: typeof record.page === 'number' ? record.page : 1,
    perPage: typeof record.per_page === 'number' ? record.per_page : items.length,
    totalPages: typeof record.total_pages === 'number' ? record.total_pages : 1,
  }
  if (typeof record.data_version === 'string') result.dataVersion = record.data_version
  return result
}

/** Validate a complete `GET /v1/catalog` response. */
function parseCatalog(raw: unknown, updatedAt?: number): LocalCatalog {
  const record = (raw ?? {}) as Record<string, unknown>
  if (!Array.isArray(record.data)) throw new Error('dshfind catalog snapshot: missing data array')
  const items = record.data.map(parsePlugin).filter(isUsablePlugin)
  const catalog: LocalCatalog = { items, raw }
  if (typeof record.data_version === 'string') catalog.dataVersion = record.data_version
  if (updatedAt !== undefined) catalog.updatedAt = updatedAt
  return catalog
}

/** Validate the IndexedDB wrapper before parsing its catalog payload. */
function parseCachedCatalog(raw: unknown): LocalCatalog {
  if (raw === null || typeof raw !== 'object') return EMPTY_CATALOG
  const envelope = raw as Partial<CachedCatalogEnvelope>
  if (typeof envelope.updatedAt !== 'number' || !Number.isFinite(envelope.updatedAt)) return EMPTY_CATALOG
  return parseCatalog(envelope.catalog, envelope.updatedAt)
}

function safeInteger(value: unknown, minimum = 0): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= minimum
}

/** Validate a durable GitHub per-request checkpoint. */
function parseGithubSyncCheckpoint(raw: unknown): GitHubSyncCheckpoint | undefined {
  if (raw === null || typeof raw !== 'object') return undefined
  const candidate = (raw as Partial<CachedCatalogEnvelope>).githubSync as Partial<GitHubSyncCheckpoint> | undefined
  if (candidate === undefined || typeof candidate.replace !== 'boolean'
    || !safeInteger(candidate.runEnd, GITHUB_EPOCH)
    || !safeInteger(candidate.total)
    || !safeInteger(candidate.requests)
    || !safeInteger(candidate.downloaded)
    || !safeInteger(candidate.blockedUntil)
    || !Array.isArray(candidate.pending)
    || !Array.isArray(candidate.rows)) return undefined
  const pending: GitHubSyncTask[] = []
  for (const rawTask of candidate.pending) {
    if (rawTask === null || typeof rawTask !== 'object') return undefined
    const task = rawTask as Partial<GitHubSyncTask>
    if (!safeInteger(task.from, GITHUB_EPOCH) || !safeInteger(task.to, task.from)
      || task.to > candidate.runEnd || !safeInteger(task.page, 1)
      || (task.totalPages !== undefined && !safeInteger(task.totalPages, task.page))) return undefined
    pending.push({
      from: task.from,
      to: task.to,
      page: task.page,
      ...task.totalPages === undefined ? {} : { totalPages: task.totalPages },
    })
  }
  const rows = candidate.rows.filter((row): row is Record<string, unknown> => (
    row !== null && typeof row === 'object' && !Array.isArray(row)
  ))
  if (rows.length !== candidate.rows.length) return undefined
  return {
    replace: candidate.replace,
    runEnd: candidate.runEnd,
    total: candidate.total,
    requests: candidate.requests,
    downloaded: candidate.downloaded,
    blockedUntil: candidate.blockedUntil,
    pending,
    rows,
  }
}

/**
 * Serialize a market request into `GET /v1/plugins` query parameters.
 * @param request - the request to serialize.
 * @returns the query string (without the leading `?`).
 */
export function toQueryString(request: MarketRequest): string {
  const params = new URLSearchParams()
  params.set('page', String(request.page))
  params.set('per_page', String(request.perPage))
  if (request.q !== undefined && request.q.length > 0) params.set('q', request.q)
  if (request.category !== undefined && request.category.length > 0) params.set('category', request.category)
  if (request.owner !== undefined && request.owner.length > 0) params.set('owner', request.owner)
  if (request.language !== undefined && request.language.length > 0) params.set('language', request.language)
  if (request.grade !== undefined && request.grade.length > 0) params.set('grade', request.grade)
  if (request.tag !== undefined && request.tag.length > 0) params.set('tag', request.tag)
  if (request.minScore !== undefined) params.set('min_score', String(request.minScore))
  if (request.featured === true) params.set('featured', 'true')
  if (request.official === true) params.set('official', 'true')
  if (request.installable === true) params.set('is_plugin', 'true')
  params.set('sort', request.sort)
  params.set('order', request.order)
  return params.toString()
}

/** One category facet of the catalog (value + row count). */
export interface MarketCategoryFacet {
  value: string
  count: number
}

/** One live cloud-to-local synchronization update. */
export interface MarketSyncProgress {
  /** Provider-independent stage currently doing work. */
  phase: 'checking' | 'partitioning' | 'downloading' | 'waiting' | 'saving'
  /** Completed cloud requests in this synchronization. */
  requests: number
  /** Repository rows downloaded so far, before provider-side deduplication. */
  items: number
  /** Repository rows in the complete provider query; zero until known. */
  totalItems: number
  /** Current page inside the active provider query, when known. */
  page?: number
  /** Total pages inside the active provider query, when known. */
  totalPages?: number
  /** Epoch milliseconds when a provider rate-limit wait ends. */
  waitUntil?: number
}

/** Receives live synchronization progress without retaining provider secrets. */
export type MarketSyncReporter = (progress: MarketSyncProgress) => void

/**
 * Provider contract consumed by the local marketplace repository. Every data
 * source supplies full initialization, incremental synchronization, local
 * detail lookup, and the local query projections used by the UI.
 */
export interface MarketProvider {
  /** Download and replace the complete local catalog. */
  initialize(report?: MarketSyncReporter): Promise<void>
  /** Synchronize provider changes since the durable provider cursor. */
  incremental(report?: MarketSyncReporter): Promise<void>
  /** User-facing alias for incremental synchronization. */
  refresh(report?: MarketSyncReporter): Promise<void>
  /** Query one page from the local catalog. */
  list(request: MarketRequest): Promise<MarketPageResult>
  /** Resolve one plugin from the local catalog. */
  detail(fullName: string): Promise<MarketDetailInfo | null>
  /** Build suggestions from the local catalog. */
  suggest(q: string): Promise<readonly MarketSuggestion[]>
  /** Aggregate category facets from the local catalog. */
  facets(): Promise<readonly MarketCategoryFacet[]>
}

/** Backward-compatible internal name used by the marketplace controller. */
export type MarketApi = MarketProvider

/** Mutable provider selection with one stable face for the marketplace controller. */
export interface MarketProviderRouter {
  /** Stable provider face that delegates every operation to the selected id. */
  readonly provider: MarketProvider
  /** Select the provider used by subsequent operations. */
  select(id: MarketProviderId): void
  /** Return the current provider id. */
  selected(): MarketProviderId
}

/**
 * Create a checked router over every selectable provider implementation.
 * @param providers - Complete provider implementations keyed by selectable id.
 * @param initial - Provider that receives the first operation.
 * @returns one stable face whose operations follow the current selection.
 */
export function createMarketProviderRouter(
  providers: Readonly<Record<MarketProviderId, MarketProvider>>,
  initial: MarketProviderId,
): MarketProviderRouter {
  let selected = initial
  const current = (): MarketProvider => providers[selected]
  return {
    provider: {
      initialize: report => current().initialize(report),
      incremental: report => current().incremental(report),
      refresh: report => current().refresh(report),
      list: request => current().list(request),
      detail: fullName => current().detail(fullName),
      suggest: q => current().suggest(q),
      facets: () => current().facets(),
    },
    select(id) { selected = id },
    selected() { return selected },
  }
}

function same(value: string | undefined, expected: string): boolean {
  return value?.toLocaleLowerCase() === expected.toLocaleLowerCase()
}

function admits(plugin: MarketPluginSummary, request: MarketRequest): boolean {
  if (request.q !== undefined && request.q.length > 0 && !matchesTerm(plugin, request.q)) return false
  if (request.category !== undefined && !same(plugin.category, request.category)) return false
  if (request.owner !== undefined && !same(plugin.owner, request.owner)) return false
  if (request.language !== undefined && !same(plugin.language, request.language)) return false
  if (request.grade !== undefined && !same(plugin.grade, request.grade)) return false
  const requestedTag = request.tag
  if (requestedTag !== undefined && !plugin.tags.some(tag => same(tag, requestedTag))) return false
  if (request.minScore !== undefined && (plugin.score ?? 0) < request.minScore) return false
  if (request.featured === true && !plugin.isFeatured) return false
  if (request.official === true && !plugin.isOfficial) return false
  if (request.installable === true && plugin.isPlugin !== true) return false
  return true
}

/** Build the provider operations that project one durable in-memory catalog. */
function localProvider(
  current: () => Promise<LocalCatalog>,
  initialize: (report?: MarketSyncReporter) => Promise<void>,
  incremental: (report?: MarketSyncReporter) => Promise<void>,
): MarketProvider {
  let refreshPromise: Promise<void> | null = null
  return {
    initialize,
    incremental,
    async refresh(report) {
      refreshPromise ??= incremental(report).finally(() => { refreshPromise = null })
      return refreshPromise
    },
    async list(request) {
      const snapshot = await current()
      const matching = snapshot.items
        .filter(plugin => admits(plugin, request))
        .sort((a, b) => compareMarketPlugins(a, b, request.sort, request.order))
      const start = (request.page - 1) * request.perPage
      const result: MarketPageResult = {
        items: matching.slice(start, start + request.perPage),
        total: matching.length,
        page: request.page,
        perPage: request.perPage,
        totalPages: Math.ceil(matching.length / request.perPage),
        catalogTotal: snapshot.items.length,
      }
      if (snapshot.dataVersion !== undefined) result.dataVersion = snapshot.dataVersion
      if (snapshot.updatedAt !== undefined) result.updatedAt = snapshot.updatedAt
      return result
    },
    async detail(fullName) {
      const snapshot = await current()
      return snapshot.items.find(plugin => plugin.fullName === fullName) ?? null
    },
    async suggest(q) {
      const snapshot = await current()
      return snapshot.items.filter(plugin => matchesTerm(plugin, q)).slice(0, 10).map(plugin => ({
        type: 'plugin',
        id: plugin.fullName,
        label: plugin.name,
        sub: plugin.description,
        href: plugin.repositoryUrl,
        stars: plugin.stars,
        featured: plugin.isFeatured,
      }))
    },
    async facets() {
      const snapshot = await current()
      const counts = new Map<string, number>()
      for (const plugin of snapshot.items) {
        if (plugin.category === undefined || plugin.category === '') continue
        counts.set(plugin.category, (counts.get(plugin.category) ?? 0) + 1)
      }
      return [...counts].map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value))
    },
  }
}

/**
 * Create the catalog API client.
 * @param baseUrl - catalog base URL (deployment-configurable).
 * @param fetchImpl - fetch implementation (test seam; defaults to global fetch).
 * @param cache - durable snapshot cache (test seam; defaults to IndexedDB).
 * @returns the typed read face.
 */
export function createMarketApi(
  baseUrl: string = DEFAULT_MARKET_BASE_URL,
  fetchImpl: MarketFetch = (input, init) => fetch(input, init),
  cache?: MarketCatalogCache,
): MarketProvider {
  const base = baseUrl.replace(/\/+$/, '')
  const storage = cache ?? createMarketCatalogCache(base)
  let catalog = EMPTY_CATALOG
  const ready = storage.load()
    .then((value) => { catalog = parseCachedCatalog(value) })
    .catch(() => { catalog = EMPTY_CATALOG })

  async function fetchCatalog(dataVersion?: string, report?: MarketSyncReporter): Promise<void> {
    await ready
    report?.({ phase: 'downloading', requests: 0, items: 0, totalItems: 0 })
    const query = dataVersion === undefined ? '' : `?data_version=${encodeURIComponent(dataVersion)}`
    const response = await fetchImpl(`${base}/v1/catalog${query}`, { headers: { accept: 'application/json' } })
    if (!response.ok) {
      throw new Error(`dshfind catalog /v1/catalog: HTTP ${String(response.status)}`)
    }
    const raw = await response.json() as unknown
    const updatedAt = Date.now()
    const next = parseCatalog(raw, updatedAt)
    report?.({ phase: 'saving', requests: 1, items: next.items.length, totalItems: next.items.length })
    await storage.save({ updatedAt, catalog: raw } satisfies CachedCatalogEnvelope)
    catalog = next
  }

  async function syncIncremental(report?: MarketSyncReporter): Promise<void> {
    await ready
    if (catalog.items.length === 0 || catalog.dataVersion === undefined) {
      await fetchCatalog(undefined, report)
      return
    }
    report?.({ phase: 'checking', requests: 0, items: 0, totalItems: 0 })
    const request: MarketRequest = { page: 1, perPage: 1, sort: 'updated', order: 'desc' }
    const response = await fetchImpl(`${base}/v1/plugins?${toQueryString(request)}`, {
      headers: { accept: 'application/json' },
    })
    if (!response.ok) {
      throw new Error(`dshfind catalog /v1/plugins: HTTP ${String(response.status)}`)
    }
    const head = parsePluginList(await response.json() as unknown)
    if (head.dataVersion !== catalog.dataVersion) {
      await fetchCatalog(head.dataVersion, report)
      return
    }
    const updatedAt = Date.now()
    if (catalog.raw === undefined) throw new Error('dshfind catalog cache lost its durable response')
    report?.({ phase: 'saving', requests: 1, items: catalog.items.length, totalItems: catalog.items.length })
    await storage.save({ updatedAt, catalog: catalog.raw } satisfies CachedCatalogEnvelope)
    catalog = { ...catalog, updatedAt }
  }

  async function current(): Promise<LocalCatalog> {
    await ready
    return catalog
  }

  return localProvider(current, report => fetchCatalog(undefined, report), syncIncremental)
}

/** Host Remote operation used by the GitHub provider. */
export type GitHubMarketSearch = (request: GitHubMarketSearchRequest) => Promise<GitHubMarketSearchPage>

const GITHUB_EPOCH = Date.parse('2008-01-01T00:00:00.000Z')
const GITHUB_QUERY_LIMIT = 1_000
const GITHUB_PAGE_SIZE = 100

/**
 * The install probe of a GitHub Topic row. GitHub search carries no package
 * manifest, so the spec stays the repository itself and pnpm resolves the real
 * dependency name while installing.
 * @param fullName - `owner/repository`.
 * @returns the wire-shaped install probe.
 */
function githubInstallInfo(fullName: string): Record<string, unknown> {
  return {
    cmd: `dsh plugin --profile web add -w github:${fullName}`,
    source: 'auto',
    kind: 'git',
  }
}

/** Convert a validated GitHub row into the cache's provider-neutral wire record. */
function githubCatalogRow(repository: GitHubMarketRepository): Record<string, unknown> {
  return {
    _github_id: repository.id,
    full_name: repository.fullName,
    name: repository.name,
    owner: repository.owner,
    repository_url: repository.repositoryUrl,
    description: repository.description,
    tags: repository.topics,
    language: repository.language,
    stars: repository.stars,
    pushed_at: repository.pushedAt,
    archived: repository.archived,
    is_featured: false,
    is_official: repository.owner.toLocaleLowerCase() === 'deepseek-ai',
    is_insider: false,
    is_risky: false,
    is_plugin: true,
    install: githubInstallInfo(repository.fullName),
  }
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => { window.setTimeout(resolve, milliseconds) })
}

/** Preserve the last complete catalog beside one resumable GitHub checkpoint. */
function githubCheckpointEnvelope(
  catalog: LocalCatalog,
  githubSync: GitHubSyncCheckpoint,
): CachedCatalogEnvelope {
  return {
    ...catalog.updatedAt === undefined ? {} : { updatedAt: catalog.updatedAt },
    ...catalog.raw === undefined ? {} : { catalog: catalog.raw },
    githubSync,
  }
}

/** Merge committed crawl rows over the last complete GitHub catalog. */
function githubCheckpointRows(
  catalog: LocalCatalog,
  checkpoint: GitHubSyncCheckpoint,
): readonly Record<string, unknown>[] {
  const previous = !checkpoint.replace && catalog.raw !== undefined
    ? ((catalog.raw as { data?: unknown }).data ?? [])
    : []
  const rows = new Map<number, Record<string, unknown>>()
  if (Array.isArray(previous)) {
    for (const raw of previous) {
      if (raw !== null && typeof raw === 'object') {
        const id = (raw as Record<string, unknown>)._github_id
        if (typeof id === 'number' && Number.isSafeInteger(id)) rows.set(id, raw as Record<string, unknown>)
      }
    }
  }
  for (const row of checkpoint.rows) {
    const id = row._github_id
    if (typeof id === 'number' && Number.isSafeInteger(id)) rows.set(id, row)
  }
  return [...rows.values()]
}

/** Project every committed request immediately without promoting an incomplete snapshot. */
function githubCheckpointCatalog(catalog: LocalCatalog, checkpoint: GitHubSyncCheckpoint): LocalCatalog {
  const raw: { data: readonly Record<string, unknown>[]; data_version?: string } = {
    data: githubCheckpointRows(catalog, checkpoint),
  }
  if (catalog.dataVersion !== undefined) raw.data_version = catalog.dataVersion
  return parseCatalog(raw, catalog.updatedAt)
}

/** Select the newest returned push as the next completed-catalog cursor. */
function githubCompletionCursor(catalog: LocalCatalog, checkpoint: GitHubSyncCheckpoint): string {
  const previous = Date.parse(catalog.dataVersion ?? '')
  let latestValue: string | undefined
  let latestTime = Number.NEGATIVE_INFINITY
  for (const row of checkpoint.rows) {
    const pushedAt = row.pushed_at
    if (typeof pushedAt !== 'string') continue
    const time = Date.parse(pushedAt)
    if (Number.isFinite(time) && time > latestTime) {
      latestValue = pushedAt
      latestTime = time
    }
  }
  if (latestValue !== undefined && (!Number.isFinite(previous) || latestTime > previous)) return latestValue
  return new Date(checkpoint.runEnd).toISOString()
}

/** Execute and checkpoint every request in one inclusive pushed-at crawl. */
async function crawlGithub(
  search: GitHubMarketSearch,
  initial: GitHubSyncCheckpoint,
  persist: (checkpoint: GitHubSyncCheckpoint) => Promise<void>,
  wait: (milliseconds: number) => Promise<void>,
  clock: () => number,
  report?: MarketSyncReporter,
): Promise<GitHubSyncCheckpoint> {
  let checkpoint = initial
  let retries = 0
  while (checkpoint.pending.length > 0) {
    const [task, ...rest] = checkpoint.pending
    if (task === undefined) throw new Error('GitHub synchronization lost its next request')
    const delay = checkpoint.blockedUntil - clock()
    if (delay > 0) {
      report?.({
        phase: 'waiting',
        requests: checkpoint.requests,
        items: checkpoint.downloaded,
        totalItems: checkpoint.total,
        waitUntil: checkpoint.blockedUntil,
      })
      await wait(delay)
    }
    let result: GitHubMarketSearchPage
    try {
      result = await search({
        pushedFrom: new Date(task.from).toISOString(),
        pushedTo: new Date(task.to).toISOString(),
        page: task.page,
        perPage: GITHUB_PAGE_SIZE,
      })
    } catch (error: unknown) {
      const failure = error as { code?: unknown; details?: { retryAt?: unknown } } | null
      const retryAt = failure?.details?.retryAt
      if (failure?.code !== 'plugin-market/rate-limited'
        || typeof retryAt !== 'number' || !Number.isFinite(retryAt)) throw error
      const next = {
        ...checkpoint,
        blockedUntil: clock() + Math.max(1_000, retryAt - clock()) * 2 ** retries,
      }
      // Keep the same page and its cooldown durable, including when retries are exhausted.
      await persist(next)
      checkpoint = next
      if (retries >= 3) throw error
      retries += 1
      continue
    }
    retries = 0
    if (result.incomplete) throw new Error('GitHub repository search returned incomplete results')
    const requests = checkpoint.requests + 1
    const blockedUntil = result.rateLimitRemaining === 0 ? result.rateLimitResetAt + 1_000 : 0
    const total = checkpoint.requests === 0 ? result.total : checkpoint.total
    let nextPending: readonly GitHubSyncTask[] = rest
    let rows = checkpoint.rows
    let downloaded = checkpoint.downloaded
    let phase: MarketSyncProgress['phase'] = 'downloading'
    let totalPages: number | undefined
    if (task.page === 1 && result.total > GITHUB_QUERY_LIMIT) {
      phase = 'partitioning'
      if (task.from >= task.to) {
        throw new Error(`GitHub search interval ${new Date(task.from).toISOString()} exceeds 1,000 rows`)
      }
      const middle = Math.floor((task.from + task.to) / 2_000) * 1_000
      if (middle < task.from || middle >= task.to) {
        throw new Error(`GitHub search interval ${new Date(task.from).toISOString()} cannot be bisected`)
      }
      nextPending = [
        { from: task.from, to: middle, page: 1 },
        { from: middle + 1_000, to: task.to, page: 1 },
        ...rest,
      ]
    } else {
      totalPages = task.totalPages ?? Math.ceil(result.total / GITHUB_PAGE_SIZE)
      rows = [...rows, ...result.items.map(githubCatalogRow)]
      downloaded += result.items.length
      if (task.page < totalPages) {
        nextPending = [{ ...task, page: task.page + 1, totalPages }, ...rest]
      }
    }
    const next: GitHubSyncCheckpoint = {
      ...checkpoint,
      total,
      requests,
      downloaded,
      blockedUntil,
      pending: nextPending,
      rows,
    }
    await persist(next)
    checkpoint = next
    report?.({
      phase,
      requests,
      items: downloaded,
      totalItems: total,
      ...totalPages === undefined ? {} : { page: task.page, totalPages },
    })
  }
  return checkpoint
}

/**
 * Create the GitHub Topic provider over Host-authenticated search and its own
 * IndexedDB snapshot.
 * @param search - Host Remote operation for one GitHub search-result page.
 * @param cache - persistent complete-catalog snapshot.
 * @param clock - current UTC time used for interval cursors and rate-limit waits.
 * @param wait - delay operation used when GitHub exhausts the search bucket.
 * @returns a local-first provider backed by the `dsh-plugin` topic.
 */
export function createGithubMarketApi(
  search: GitHubMarketSearch,
  cache: MarketCatalogCache = createMarketCatalogCache('github:topic:dsh-plugin'),
  clock: () => number = Date.now,
  wait: (milliseconds: number) => Promise<void> = sleep,
): MarketProvider {
  const storage = cache
  let catalog = EMPTY_CATALOG
  let resumable: GitHubSyncCheckpoint | undefined
  const ready = storage.load()
    .then((value) => {
      catalog = parseCachedCatalog(value)
      resumable = parseGithubSyncCheckpoint(value)
    })
    .catch(() => {
      catalog = EMPTY_CATALOG
      resumable = undefined
    })

  async function synchronize(replace: boolean, report?: MarketSyncReporter): Promise<void> {
    await ready
    if (resumable === undefined) {
      const runEnd = Math.floor(clock() / 1_000) * 1_000
      const cursor = catalog.dataVersion === undefined ? Number.NaN : Date.parse(catalog.dataVersion)
      const from = replace || !Number.isFinite(cursor)
        ? GITHUB_EPOCH
        : cursor
      resumable = {
        replace,
        runEnd,
        total: 0,
        requests: 0,
        downloaded: 0,
        blockedUntil: 0,
        pending: [{ from, to: runEnd, page: 1 }],
        rows: [],
      }
    }
    report?.({
      phase: 'checking',
      requests: resumable.requests,
      items: resumable.downloaded,
      totalItems: resumable.total,
    })
    const completed = await crawlGithub(
      search,
      resumable,
      async (checkpoint) => {
        await storage.save(githubCheckpointEnvelope(catalog, checkpoint))
        resumable = checkpoint
      },
      wait,
      clock,
      report,
    )
    const raw = {
      data: githubCheckpointRows(catalog, completed),
      data_version: githubCompletionCursor(catalog, completed),
    }
    const updatedAt = clock()
    const next = parseCatalog(raw, updatedAt)
    report?.({
      phase: 'saving',
      requests: completed.requests,
      items: completed.downloaded,
      totalItems: completed.total,
    })
    await storage.save({ updatedAt, catalog: raw } satisfies CachedCatalogEnvelope)
    catalog = next
    resumable = undefined
  }

  async function current(): Promise<LocalCatalog> {
    await ready
    return resumable === undefined ? catalog : githubCheckpointCatalog(catalog, resumable)
  }

  return localProvider(
    current,
    report => synchronize(true, report),
    async (report) => {
      await ready
      await synchronize(catalog.items.length === 0, report)
    },
  )
}
