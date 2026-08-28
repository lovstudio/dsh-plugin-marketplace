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
  /** Outcome code (`installed`/`uninstalled`, `pnpm exit <n>`, or a remote failure). */
  message: string
  /** The specific failure text (bounded pnpm output tail or remote error), when the operation failed. */
  detail?: string
  /** The `dsh plugin --profile <name> <verb> <package>` command a user can
   * re-run to reproduce the operation, when the profile manager reported one. */
  command?: string
  /** Package names pnpm refused to build, so the banner can offer explicit approval. */
  ignoredBuilds?: string[]
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
  /** Whether the list projects only loaded rows present in the Host inventory. */
  installedOnly: boolean
  /** The latest install/uninstall operation, or null. */
  action: MarketInstallAction | null
  /** Whether the restart confirmation dialog is open (agents are running). */
  restartConfirm: boolean
  /** Agent activity snapshot while the restart confirmation is open. */
  restartActivity: { running: boolean; active: number } | null
  /** Whether the activity read failed while the confirmation is open. */
  restartStatusUnavailable: boolean
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
    installedOnly: false,
    action: null,
    restartConfirm: false,
    restartActivity: null,
    restartStatusUnavailable: false,
  }
}
