/**
 * Marketplace view state: the shared viewing state of the three marketplace
 * surfaces (Settings tab, sidebar entry, shell overlay). The controller owns
 * one engine store instance created in `apply`; every register binds it
 * through the inject `hooks` compartment, so a search, filter, or scroll
 * position survives switching surfaces.
 */

import type {
  MarketDetailInfo, MarketFilters, MarketOrder, MarketPluginSummary, MarketSort,
} from './types.ts'
import type { MarketSyncProgress } from './api.ts'
import type { PluginVerdict } from './plugin-actions.ts'

/** Rows per local catalog page or merged-list slice. */
export const MARKET_PAGE_SIZE = 40

/** Load phases of the marketplace list. */
export type MarketListStatus = 'idle' | 'loading' | 'ready' | 'error' | 'exhausted'

/** Detail-dialog load phases. */
export type MarketDetailStatus = 'idle' | 'loading' | 'ready' | 'error'

/** Cloud-to-local catalog synchronization phase. */
export type MarketSyncStatus = 'idle' | 'syncing' | 'error'

/** How the current local list is paged: repository page or merged slice. */
export type MarketPagingMode = 'api' | 'merged'

/** One in-flight or settled install/uninstall operation. */
export interface MarketInstallAction {
  /** The `owner/repo` catalog id the operation targets. */
  fullName: string
  kind: 'install' | 'uninstall'
  status: 'running' | 'ok' | 'error'
  /** Outcome code (`installed`/`uninstalled`, CLI exit, or request failure). */
  message: string
  /** The specific CLI or request failure text. */
  detail?: string
  /** The official command that performed or can reproduce the action. */
  command?: string
  /** Epoch milliseconds the operation started, for the elapsed-time readout. */
  startedAt?: number
  /** True when the Host mounted the package live, so only the page needs a reload. */
  hotMounted?: boolean
  /** The resolved spec of this action, kept so it can be retried as it ran. */
  spec?: string
  /** Install scripts pnpm refused to run, offered to the user to allow. */
  buildKeys?: readonly string[]
}

/** An install held back until the user accepts a harness-compatibility warning. */
export interface MarketInstallWarning {
  /** The `owner/repo` catalog id the install targets. */
  fullName: string
  /** The already-resolved package spec, reused verbatim once accepted. */
  spec: string
  mismatches: readonly { name: string; expected: string; actual: string }[]
  /** Set when the candidate names itself into the harness scope from another owner. */
  scopeClaim?: { name: string; owner: string }
}

/** Marketplace store state. */
export interface MarketViewState {
  /** Raw search input (Google-style syntax). */
  search: string
  /** Toolbar filter selection. */
  filters: MarketFilters
  /** Catalog sort key. */
  sort: MarketSort
  /** Sort direction. */
  order: MarketOrder
  /** Accumulated visible rows. */
  items: readonly MarketPluginSummary[]
  /** Matching local total. */
  total: number
  /** Total rows in the complete local provider snapshot. */
  catalogTotal: number
  /** Epoch milliseconds of the latest successful cloud synchronization. */
  updatedAt: number | null
  /** Manual or startup synchronization phase. */
  syncStatus: MarketSyncStatus
  /** Latest synchronization failure detail, cleared when another synchronization starts. */
  syncError: string | null
  /** Provider-reported live progress for the active synchronization. */
  syncProgress: MarketSyncProgress | null
  status: MarketListStatus
  /** Paging mode of the current list. */
  mode: MarketPagingMode
  /** Next local repository page in api mode (1-based). */
  nextPage: number
  /** Merged+ranked cache of a multi-term search, sliced locally by page. */
  ranked: readonly MarketPluginSummary[]
  /** Full name of the plugin whose detail dialog is open, if any. */
  selected: string | null
  /** The loaded detail payload of the selection. */
  detail: MarketDetailInfo | null
  detailStatus: MarketDetailStatus
  /** Whether the shell-overlay marketplace is open. */
  overlayOpen: boolean
  /** Installed plugin module names (from the Host inventory remote). */
  installed: readonly string[]
  /** What this profile already found out about packages, for the row marks. */
  verdicts: readonly PluginVerdict[]
  /** Whether the list projects only loaded rows present in the Host inventory. */
  installedOnly: boolean
  /** The latest install/uninstall operation, or null. */
  action: MarketInstallAction | null
  /** The install awaiting the user's decision on a compatibility warning. */
  installWarning: MarketInstallWarning | null
  /** `owner/repository` of every repository the GitHub user has starred. */
  starred: readonly string[]
  /** Repositories with a star change in flight. */
  starBusy: readonly string[]
  /** Whether the configured GitHub credential can read and write stars. */
  starSupported: boolean
  /** The latest star failure, or null. */
  starError: string | null
  /** Whether the restart confirmation dialog is open. */
  restartConfirm: boolean
  /** Agent activity while restart confirmation is open. */
  restartActivity: { running: boolean; active: number } | null
  /** Whether the activity read failed. */
  restartStatusUnavailable: boolean
  /** `manual` when the launcher exposes no in-place restart service. */
  restartMode: 'service' | 'manual'
}

/**
 * Fresh initial marketplace state (one per controller instance).
 * @returns the initial state.
 */
export function createMarketViewState(): MarketViewState {
  return {
    search: '',
    filters: { category: '', owner: '', language: '', grade: '', featured: false, official: false, installable: false },
    sort: 'stars',
    order: 'desc',
    items: [],
    total: 0,
    catalogTotal: 0,
    updatedAt: null,
    syncStatus: 'idle',
    syncError: null,
    syncProgress: null,
    status: 'idle',
    mode: 'api',
    nextPage: 1,
    ranked: [],
    selected: null,
    detail: null,
    detailStatus: 'idle',
    overlayOpen: false,
    installed: [],
    verdicts: [],
    installedOnly: false,
    action: null,
    installWarning: null,
    starred: [],
    starBusy: [],
    starSupported: false,
    starError: null,
    restartConfirm: false,
    restartActivity: null,
    restartStatusUnavailable: false,
    restartMode: 'service',
  }
}
