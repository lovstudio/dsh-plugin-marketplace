/**
 * Marketplace controller: query projection between the local provider
 * repository and the shared view store. Constructed once in `apply` (the
 * store instance is created here too); every register's inject face closes
 * over it, so all three surfaces read and mutate one state source.
 */

import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { MarketApi, MarketCategoryFacet } from './api.ts'
import {
  accepts, compareMarketPlugins, mergeAndRank, parseMarketQuery, planSearch, SEARCH_TERM_FETCH_SIZE,
} from './search.ts'
import { installSpec, uninstallSpec } from './agent-copy.ts'
import {
  createMarketViewState, MARKET_PAGE_SIZE, type MarketInstallAction, type MarketViewState,
} from './market-store.ts'
import type { PluginActionOutcome } from './plugin-actions.ts'
import type { MarketFilters, MarketOrder, MarketRequest, MarketSort } from './types.ts'

/** How often an open restart confirmation refreshes Agent activity. */
const RESTART_STATUS_POLL_MS = 1500

/** Agent activity projected by Better Restart. */
export interface RestartActivity {
  running: boolean
  active: number
}

/** External catalog, package, and restart operations the controller needs. */
export interface MarketPorts {
  /** The selected provider's local repository and synchronization operations. */
  api: MarketApi
  /** Read the installed plugin module names from the Host inventory remote. */
  installed: () => Promise<readonly string[]>
  /** Install one package spec through the official DSH CLI. */
  install: (spec: string) => Promise<PluginActionOutcome>
  /** Uninstall one package name through the official DSH CLI. */
  uninstall: (spec: string) => Promise<PluginActionOutcome>
  /** Read active Agent count before restart. */
  status: () => Promise<RestartActivity>
  /** Re-boot the application tree. */
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

  /** Resolve the package spec for one catalog action. */
  private actionSpec(state: MarketViewState, fullName: string, kind: 'install' | 'uninstall'): string | null {
    const row = state.items.find(plugin => plugin.fullName === fullName)
      ?? (state.detail !== null && state.detail.fullName === fullName ? state.detail : undefined)
    if (row === undefined) return null
    return kind === 'install' ? installSpec(row) : uninstallSpec(row, state.installed)
  }

  /** Run one profile package action and publish its exact result. */
  private runAction(kind: 'install' | 'uninstall', fullName: string): void {
    const spec = this.actionSpec(this.store.getSnapshot(), fullName, kind)
    if (spec === null) {
      this.store.update((state) => {
        state.action = { fullName, kind, status: 'error', message: 'not-installable' }
      })
      return
    }
    this.store.update((state) => {
      state.action = { fullName, kind, status: 'running', message: '' }
    })
    const operation = kind === 'install' ? this.ports.install(spec) : this.ports.uninstall(spec)
    void operation.then(
      (result) => {
        this.store.update((state) => {
          const action: MarketInstallAction = {
            fullName,
            kind,
            status: result.ok ? 'ok' : 'error',
            message: result.ok ? `${kind}ed` : `dsh plugin exit ${String(result.exitCode)}`,
            command: result.command,
          }
          if (!result.ok && result.error !== undefined) action.detail = result.error
          state.action = action
        })
      },
      (reason: unknown) => {
        this.store.update((state) => {
          state.action = {
            fullName,
            kind,
            status: 'error',
            message: 'request-failed',
            detail: reason instanceof Error ? reason.message : String(reason),
          }
        })
      },
    )
  }

  /** Install one Marketplace package into the Web profile. */
  install(fullName: string): void {
    this.runAction('install', fullName)
  }

  /** Uninstall one Marketplace package from the Web profile. */
  uninstall(fullName: string): void {
    this.runAction('uninstall', fullName)
  }

  /** Dismiss the settled package-action banner. */
  dismissAction(): void {
    this.store.update((state) => { state.action = null })
  }

  /** Restart immediately when idle, otherwise open the live safety confirmation. */
  async restart(): Promise<void> {
    let activity: RestartActivity
    try {
      activity = await this.ports.status()
    } catch {
      this.store.update((state) => {
        state.restartConfirm = true
        state.restartActivity = null
        state.restartStatusUnavailable = true
      })
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
        () => { this.store.update((state) => { state.restartStatusUnavailable = true }) },
      )
    }, RESTART_STATUS_POLL_MS)
  }

  /** Confirm the pending restart. */
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
