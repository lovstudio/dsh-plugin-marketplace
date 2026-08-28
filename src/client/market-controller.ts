/**
 * Marketplace controller: query projection between the local provider
 * repository and the shared view store. Constructed once in `apply` (the
 * store instance is created here too); every register's inject face closes
 * over it, so all three surfaces read and mutate one state source.
 */

import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import type { MarketApi, MarketCategoryFacet } from './api.ts'
import {
  accepts, compareMarketPlugins, mergeAndRank, parseMarketQuery, planSearch, SEARCH_TERM_FETCH_SIZE,
} from './search.ts'
import {
  createMarketViewState, MARKET_PAGE_SIZE, type MarketInstallAction, type MarketViewState,
} from './market-store.ts'
import type { MarketFilters, MarketOrder, MarketRequest, MarketSort } from './types.ts'

/** How often the open restart confirmation re-reads agent activity. */
const RESTART_STATUS_POLL_MS = 1500

/** The outcome of one profile plugin operation (mirrors the wire type). */
export interface PluginActionOutcome {
  ok: boolean
  exitCode: number
  /** The `dsh plugin` command a user can re-run to reproduce the operation,
   * when the profile manager reported one. */
  command?: string
  /** The specific failure text (bounded pnpm output or remote error), when the operation failed. */
  error?: string
  /** Package names pnpm refused to build, so the banner can offer approval. */
  ignoredBuilds?: string[]
}

/** The outcome of approving ignored build scripts (mirrors the wire type). */
export interface ApproveBuildsOutcome {
  /** Whether every named package was written into `allowBuilds`. */
  ok: boolean
  /** The failure text when the workspace file could not be updated. */
  error?: string
}

/** Agent activity as the restart guard reads it (mirrors the wire type). */
export interface RestartActivity {
  /** Whether at least one agent loop is mid-turn. */
  running: boolean
  /** Number of concurrently running agent loops. */
  active: number
}

/** External reads and mutations the controller needs (injectable for tests). */
export interface MarketPorts {
  /** The selected provider's local repository and synchronization operations. */
  api: MarketApi
  /** Read the installed plugin module names from the Host inventory remote. */
  installed: () => Promise<readonly string[]>
  /** Install one package into the managed profile. */
  install: (packageName: string) => Promise<PluginActionOutcome>
  /** Uninstall one package from the managed profile. */
  uninstall: (packageName: string) => Promise<PluginActionOutcome>
  /** Allow the named packages' build scripts in the managed profile. */
  approveBuilds: (packageNames: readonly string[]) => Promise<ApproveBuildsOutcome>
  /** Current agent activity; the restart guard reads it before re-booting. */
  status: () => Promise<RestartActivity>
  /** Re-boot the application tree in place (new plugins load after restart). */
  restart: () => Promise<void>
}

/** Whether a parsed query needs the multi-request merge pipeline. */
function needsMerge(parsed: ReturnType<typeof parseMarketQuery>): boolean {
  return parsed.positive.length > 1
}

/**
 * The controller: one store instance plus the complete operation set of the
 * marketplace surfaces. Stale responses are dropped by a monotonic sequence
 * taken at request start — a later search, filter, or sort invalidates every
 * in-flight list request.
 */
export class MarketController {
  /** The uSES-safe state source bound into every register's `useView`. */
  readonly store: SnapshotStore<MarketViewState> = createSnapshotStore(createMarketViewState())

  private seq = 0
  private detailSeq = 0
  private facetPromise: Promise<readonly MarketCategoryFacet[]> | null = null
  private syncQueued = false
  /** The query the last reload resolved; paging reuses it without re-converting. */
  private queryCache = ''

  /**
   * @param ports - the catalog API and the installed-name reader.
   */
  constructor(private readonly ports: MarketPorts) {}

  /** Open the shell-overlay marketplace. */
  open(): void {
    this.store.update((state) => { state.overlayOpen = true })
  }

  /** Close the shell-overlay marketplace. */
  close(): void {
    this.store.update((state) => { state.overlayOpen = false })
  }

  /**
   * Load the first list page unless a load already started. Guards double
   * mounts (the Settings tab and the overlay can both be mounted).
   */
  ensureLoaded(): void {
    if (this.store.getSnapshot().status !== 'idle') return
    void this.reload()
  }

  /**
   * Replace the search text and reload from page one.
   * @param text - the raw search input (Google-style syntax).
   */
  applySearch(text: string): void {
    this.store.update((state) => { state.search = text })
    void this.reload()
  }

  /**
   * Replace the toolbar filter selection and reload from page one.
   * @param filters - the new filter selection.
   */
  applyFilters(filters: MarketFilters): void {
    this.store.update((state) => { state.filters = filters })
    void this.reload()
  }

  /**
   * Project the loaded catalog rows by Host inventory state without reloading
   * the local catalog, which has no installed-state field.
   * @param installedOnly - whether to show installed rows only.
   */
  applyInstalledFilter(installedOnly: boolean): void {
    this.store.update((state) => { state.installedOnly = installedOnly })
  }

  /**
   * Replace the sort key and direction together, then reload from page one.
   * @param sort - the new sort key.
   * @param order - the new sort direction.
   */
  applyOrdering(sort: MarketSort, order: MarketOrder): void {
    this.store.update((state) => {
      state.sort = sort
      state.order = order
    })
    void this.reload()
  }

  /** Retry the current list after an error (same query, page one). */
  retry(): void {
    void this.reload()
  }

  /**
   * Synchronize the selected provider into its durable local snapshot, then
   * re-run the current query without discarding usable cached rows on failure.
   *
   * @param queueIfBusy - run once more after the active synchronization; used when provider or credentials change.
   * @returns settlement after the local projection or failure state publishes.
   */
  async syncCatalog(queueIfBusy = false): Promise<void> {
    if (this.store.getSnapshot().syncStatus === 'syncing') {
      if (queueIfBusy) this.syncQueued = true
      return
    }
    this.store.update((state) => {
      state.syncStatus = 'syncing'
      state.syncError = null
      state.syncProgress = { phase: 'checking', requests: 0, items: 0, totalItems: 0 }
    })
    let projectedItems = -1
    try {
      await this.ports.api.refresh((progress) => {
        this.store.update((state) => { state.syncProgress = progress })
        if (progress.items === projectedItems) return
        projectedItems = progress.items
        this.facetPromise = null
        void this.reload(true)
      })
      this.facetPromise = null
      await this.reload(true)
      this.store.update((state) => {
        state.syncStatus = 'idle'
        state.syncProgress = null
      })
    } catch (reason: unknown) {
      this.store.update((state) => {
        state.syncStatus = 'error'
        state.syncError = reason instanceof Error ? reason.message : String(reason)
        state.syncProgress = null
      })
    }
    if (this.syncQueued) {
      this.syncQueued = false
      await this.syncCatalog()
    }
  }

  /**
   * Load the next list page: a local repository page in api mode, or a local
   * slice of the merged cache. No-op while a load is in flight or the list
   * is exhausted.
   */
  loadNextPage(): void {
    const state = this.store.getSnapshot()
    if (state.status === 'loading' || state.status === 'error' || state.status === 'exhausted') return
    if (state.mode === 'merged') {
      const slice = state.ranked.slice(state.items.length, state.items.length + MARKET_PAGE_SIZE)
      /* v8 ignore next -- 'ready' merged mode always has unshown ranked rows
       * (applyMerged/mergeMore set 'exhausted' exactly at the end), so an
       * empty slice cannot occur through the public operations. */
      if (slice.length === 0) {
        this.store.update((view) => { view.status = 'exhausted' })
        return
      }
      this.store.update((view) => {
        view.items = [...view.items, ...slice]
        view.status = view.items.length >= view.ranked.length ? 'exhausted' : 'ready'
      })
      return
    }
    void this.loadApiPage(state.nextPage, false)
  }

  /**
   * Open the detail dialog for one plugin and fetch its detail payload.
   * @param fullName - the `owner/repo` catalog id of the plugin.
   */
  openDetail(fullName: string): void {
    this.store.update((state) => {
      state.selected = fullName
      state.detailStatus = 'loading'
    })
    const seq = ++this.detailSeq
    void this.ports.api.detail(fullName).then(
      (detail) => {
        if (seq !== this.detailSeq) return
        if (detail === null) {
          this.store.update((state) => { state.detailStatus = 'error' })
          return
        }
        this.store.update((state) => {
          state.detail = detail
          state.detailStatus = 'ready'
        })
      },
      () => {
        if (seq !== this.detailSeq) return
        this.store.update((state) => { state.detailStatus = 'error' })
      },
    )
  }

  /** Close the detail dialog and drop its payload. */
  closeDetail(): void {
    this.store.update((state) => {
      state.selected = null
      state.detail = null
      state.detailStatus = 'idle'
    })
  }

  /** The npm package name a catalog row installs as, when installable. */
  private packageNameOf(state: MarketViewState, fullName: string): string | null {
    const row = state.items.find(plugin => plugin.fullName === fullName)
      ?? (state.detail !== null && state.detail.fullName === fullName ? state.detail : undefined)
    if (row === undefined || row.install === undefined) return null
    return row.install.pkgName ?? row.name
  }

  /**
   * Install one plugin into the managed profile; the change needs a restart.
   * @param fullName - the `owner/repo` catalog id of the plugin.
   */
  install(fullName: string): void {
    const pkg = this.packageNameOf(this.store.getSnapshot(), fullName)
    if (pkg === null) {
      this.store.update((state) => {
        state.action = { fullName, kind: 'install', status: 'error', message: 'not-installable' }
      })
      return
    }
    this.store.update((state) => {
      state.action = { fullName, kind: 'install', status: 'running', message: '' }
    })
    void this.ports.install(pkg).then(
      (result) => {
        this.store.update((state) => {
          const action: MarketInstallAction = {
            fullName,
            kind: 'install',
            status: result.ok ? 'ok' : 'error',
            message: result.ok ? 'installed' : `pnpm exit ${String(result.exitCode)}`,
          }
          if (result.command !== undefined) action.command = result.command
          if (!result.ok && result.error !== undefined) action.detail = result.error
          if (!result.ok && result.ignoredBuilds !== undefined && result.ignoredBuilds.length > 0) {
            action.ignoredBuilds = result.ignoredBuilds
          }
          state.action = action
        })
        if (result.ok) void this.refreshInstalled()
      },
      (reason: unknown) => {
        this.store.update((state) => {
          const action: MarketInstallAction = {
            fullName,
            kind: 'install',
            status: 'error',
            message: 'remote-failed',
          }
          const detail = reason instanceof Error ? reason.message : String(reason)
          if (detail !== '') action.detail = detail
          state.action = action
        })
      },
    )
  }

  /**
   * Uninstall one plugin from the managed profile; the change needs a restart.
   * @param fullName - the `owner/repo` catalog id of the plugin.
   */
  uninstall(fullName: string): void {
    const pkg = this.packageNameOf(this.store.getSnapshot(), fullName)
    if (pkg === null) {
      this.store.update((state) => {
        state.action = { fullName, kind: 'uninstall', status: 'error', message: 'not-installable' }
      })
      return
    }
    this.store.update((state) => {
      state.action = { fullName, kind: 'uninstall', status: 'running', message: '' }
    })
    void this.ports.uninstall(pkg).then(
      (result) => {
        this.store.update((state) => {
          const action: MarketInstallAction = {
            fullName,
            kind: 'uninstall',
            status: result.ok ? 'ok' : 'error',
            message: result.ok ? 'uninstalled' : `pnpm exit ${String(result.exitCode)}`,
          }
          if (result.command !== undefined) action.command = result.command
          if (!result.ok && result.error !== undefined) action.detail = result.error
          if (!result.ok && result.ignoredBuilds !== undefined && result.ignoredBuilds.length > 0) {
            action.ignoredBuilds = result.ignoredBuilds
          }
          state.action = action
        })
        if (result.ok) void this.refreshInstalled()
      },
      (reason: unknown) => {
        this.store.update((state) => {
          const action: MarketInstallAction = {
            fullName,
            kind: 'uninstall',
            status: 'error',
            message: 'remote-failed',
          }
          const detail = reason instanceof Error ? reason.message : String(reason)
          if (detail !== '') action.detail = detail
          state.action = action
        })
      },
    )
  }

  /** Dismiss the settled install/uninstall action banner. */
  dismissAction(): void {
    this.store.update((state) => { state.action = null })
  }

  /**
   * Approve the ignored build scripts of the settled failed action and retry
   * the install. The user approves explicitly from the banner; pnpm ≥10
   * blocks dependency build scripts until allowed, which is the commonest
   * reason a native-dependency plugin fails to install.
   * @param fullName - the `owner/repo` catalog id of the failed action.
   */
  approveBuilds(fullName: string): void {
    const action = this.store.getSnapshot().action
    if (action === null || action.status !== 'error' || action.ignoredBuilds === undefined) return
    void this.ports.approveBuilds(action.ignoredBuilds).then(
      (result) => {
        if (!result.ok) {
          this.store.update((state) => {
            if (state.action?.fullName !== fullName) return
            state.action.detail = result.error ?? 'approve-builds failed'
          })
          return
        }
        this.install(fullName)
      },
      () => {
        this.store.update((state) => {
          if (state.action?.fullName !== fullName) return
          state.action.detail = 'approve-builds remote failed'
        })
      },
    )
  }

  /**
   * Re-boot the application tree so profile changes take effect. When an
   * agent conversation is mid-turn the reboot would interrupt it, so the
   * restart is gated behind an explicit confirmation that stays open while
   * activity is live. A failed activity read does not block the reboot — the
   * guard is a safety nicety, not a gate.
   */
  async restart(): Promise<void> {
    let activity: RestartActivity
    try {
      activity = await this.ports.status()
    } catch {
      await this.ports.restart()
      return
    }
    if (!activity.running) {
      await this.ports.restart()
      return
    }
    this.store.update((state) => {
      state.restartConfirm = true
      state.restartActivity = activity
      state.restartStatusUnavailable = false
    })
    this.restartTimer ??= setInterval(() => {
      void this.ports.status().then(
        (current) => {
          this.store.update((state) => {
            state.restartActivity = current
            state.restartStatusUnavailable = false
          })
        },
        () => {
          this.store.update((state) => { state.restartStatusUnavailable = true })
        },
      )
    }, RESTART_STATUS_POLL_MS)
  }

  /** Confirm the pending restart: re-boot the application tree in place. */
  confirmRestart(): void {
    this.stopRestartPoll()
    this.store.update((state) => { state.restartConfirm = false })
    void this.ports.restart()
  }

  /** Dismiss the pending restart confirmation. */
  dismissRestart(): void {
    this.stopRestartPoll()
    this.store.update((state) => {
      state.restartConfirm = false
      state.restartActivity = null
      state.restartStatusUnavailable = false
    })
  }

  private restartTimer: ReturnType<typeof setInterval> | null = null

  private stopRestartPoll(): void {
    if (this.restartTimer === null) return
    clearInterval(this.restartTimer)
    this.restartTimer = null
  }

  /** Refresh the installed module-name set from the Host inventory remote. */
  async refreshInstalled(): Promise<void> {
    try {
      const names = await this.ports.installed()
      this.store.update((state) => { state.installed = names })
    } catch {
      // The inventory remote is an enhancement; a failed read leaves the
      // badge absent rather than failing the marketplace.
    }
  }

  /**
   * The category facet list, fetched once per controller lifetime.
   * @returns the facet list (empty after a failed fetch).
   */
  fetchFacets(): Promise<readonly MarketCategoryFacet[]> {
    this.facetPromise ??= this.ports.api.facets().catch(() => [])
    return this.facetPromise
  }

  private requestFor(
    state: MarketViewState,
    q: string | undefined,
    page: number,
    perPage: number,
  ): MarketRequest {
    const parsed = parseMarketQuery(this.queryCache)
    const { apiFilters } = parsed
    // A field filter in the query overrides the toolbar selection for that
    // field (the query is the more specific constraint).
    const request: MarketRequest = {
      sort: state.sort,
      order: state.order,
      page,
      perPage,
    }
    if (q !== undefined) request.q = q
    const category = (apiFilters.category ?? state.filters.category) || undefined
    if (category !== undefined) request.category = category
    const owner = (apiFilters.owner ?? state.filters.owner) || undefined
    if (owner !== undefined) request.owner = owner
    const language = (apiFilters.language ?? state.filters.language) || undefined
    if (language !== undefined) request.language = language
    const grade = (apiFilters.grade ?? state.filters.grade) || undefined
    if (grade !== undefined) request.grade = grade
    if (apiFilters.tag !== undefined) request.tag = apiFilters.tag
    if (apiFilters.minScore !== undefined) request.minScore = apiFilters.minScore
    if (state.filters.featured) request.featured = true
    if (state.filters.official) request.official = true
    if (state.filters.installable) request.installable = true
    return request
  }

  private async reload(preserveItems = false): Promise<void> {
    const state = this.store.getSnapshot()
    const seq = ++this.seq
    // Set the loading state synchronously before the first await so a second
    // `ensureLoaded` call from a double mount sees it and returns early.
    if (!preserveItems) {
      this.store.update((view) => {
        view.items = []
        view.ranked = []
        view.total = 0
        view.status = 'loading'
      })
    }
    const query = state.search
    if (seq !== this.seq) return
    this.queryCache = query
    const parsed = parseMarketQuery(query)
    const merged = needsMerge(parsed)
    this.store.update((view) => {
      view.mode = merged ? 'merged' : 'api'
      view.nextPage = 1
    })
    try {
      if (merged) {
        const base = this.requestFor(state, undefined, 1, SEARCH_TERM_FETCH_SIZE)
        const pages = await Promise.all(planSearch(parsed).map(term => this.ports.api.list({ ...base, q: term })))
        const result = mergeAndRank(pages.map(page => page.items), parsed, Number.MAX_SAFE_INTEGER)
        const ordered = [...result.items]
          .sort((a, b) => compareMarketPlugins(a, b, state.sort, state.order))
        if (seq !== this.seq) return
        this.store.update((view) => {
          view.ranked = ordered
          view.total = result.total
          const metadata = pages[0]
          if (metadata?.catalogTotal !== undefined) view.catalogTotal = metadata.catalogTotal
          if (metadata?.updatedAt !== undefined) view.updatedAt = metadata.updatedAt
          view.items = ordered.slice(0, MARKET_PAGE_SIZE)
          view.status = ordered.length > 0 && ordered.length <= MARKET_PAGE_SIZE
            ? 'exhausted'
            : 'ready'
        })
      } else {
        await this.loadApiPage(1, true, seq)
      }
    } catch {
      if (seq !== this.seq) return
      this.store.update((view) => { view.status = 'error' })
    }
  }

  private async loadApiPage(page: number, fromReload: boolean, pinnedSeq?: number): Promise<void> {
    const state = this.store.getSnapshot()
    const parsed = parseMarketQuery(this.queryCache)
    const seq = pinnedSeq ?? ++this.seq
    if (!fromReload) {
      this.store.update((view) => { view.status = 'loading' })
    }
    try {
      const result = await this.ports.api.list(
        this.requestFor(state, parsed.positive[0], page, MARKET_PAGE_SIZE),
      )
      if (seq !== this.seq) return
      const items = result.items.filter(plugin => accepts(plugin, parsed))
      this.store.update((view) => {
        view.items = fromReload ? items : [...view.items, ...items]
        view.total = result.total
        if (result.catalogTotal !== undefined) view.catalogTotal = result.catalogTotal
        if (result.updatedAt !== undefined) view.updatedAt = result.updatedAt
        view.nextPage = page + 1
        view.status = view.items.length >= result.total ? 'exhausted' : 'ready'
        view.mode = 'api'
      })
    } catch {
      if (seq !== this.seq) return
      this.store.update((view) => { view.status = 'error' })
    }
  }
}
