/**
 * Wire vocabulary of the dshfind plugin catalog API (https://api.dshfind.com,
 * OpenAPI contract at https://dshfind.lovstudio.ai/openapi.json). The client
 * reads the REST list/detail/suggest endpoints directly; the types below are
 * the browser-side projection of the documented responses, narrowed to the
 * fields the marketplace renders or ranks on.
 */

/** One plugin row from `GET /v1/plugins` (or the `/v1/catalog` snapshot). */
export interface MarketPluginSummary {
  /** `owner/repo` — the stable unique catalog id. */
  fullName: string
  /** Repository name (the npm package name when installable). */
  name: string
  /** Repository owner (the npm publisher handle when installable). */
  owner: string
  /** GitHub repository URL. */
  repositoryUrl: string
  /** Short one-line description (English unless localized copy exists). */
  description: string
  /** Free-form topic tags. */
  tags: readonly string[]
  /** Primary implementation language, when reported. */
  language?: string
  /** GitHub star count. */
  stars: number
  /** Distinct contributor count, when reported. */
  contributors?: number
  /** Last push timestamp (ISO 8601), when reported. */
  pushedAt?: string
  /** Whether the repository is archived upstream. */
  archived: boolean
  /** Catalog category slug (empty string when unclassified). */
  category?: string
  /** Catalog quality score 0-100, when assessed. */
  score?: number
  /** Catalog quality grade, when assessed. */
  grade?: 'S' | 'A' | 'B' | 'C'
  /** Whether the catalog marks the row as featured. */
  isFeatured: boolean
  /** Whether the repository belongs to the DeepSeek AI organization. */
  isOfficial: boolean
  /** Whether the catalog marks the row as an insider pick. */
  isInsider: boolean
  /** Whether the catalog flags the row as risky. */
  isRisky: boolean
  /** Human-readable risk note, when flagged. */
  riskNote?: string
  /** Whether the row is a DSH plugin package (vs a harness or library repo). */
  isPlugin?: boolean
  /** Install probe result, when the catalog resolved an install path. */
  install?: MarketInstallInfo
}

/** The catalog's install-probe result for one plugin. */
export interface MarketInstallInfo {
  /** The exact documented install command, when installable. */
  cmd?: string
  /** Install source kind (`npm`, `manual`, `not-installable`, ...). */
  kind?: string
  /** The npm package name to install, when installable. */
  pkgName?: string
  /** The npm package version the probe resolved, when installable. */
  pkgVersion?: string
  /** Whether the npm package is actually published. */
  npmPublished?: boolean
}

/** One page of `GET /v1/plugins`. */
export interface MarketPageResult {
  /** Rows of this page in catalog order. */
  items: readonly MarketPluginSummary[]
  /** Total matching rows across all pages. */
  total: number
  /** 1-based page index of this result. */
  page: number
  /** Rows per page. */
  perPage: number
  /** Total page count. */
  totalPages: number
  /** Catalog snapshot revision, when reported. */
  dataVersion?: string
  /** Total rows in the locally cached catalog, before query filters. */
  catalogTotal?: number
  /** Epoch milliseconds when the browser last completed a cloud refresh. */
  updatedAt?: number
}

/** Localized copy block of `GET /v1/plugins/{owner}/{repo}`. */
export interface MarketLocalizedCopy {
  description?: string
  /** Longer marketing introduction. */
  intro?: string
  /** Bullet highlights. */
  highlights?: readonly string[]
}

/** One star-history point of the detail response. */
export interface MarketSnapshotPoint {
  date: string
  stars: number
}

/** Full detail of `GET /v1/plugins/{owner}/{repo}`. */
export interface MarketDetailInfo extends MarketPluginSummary {
  /** Locale-tagged localized copy. */
  i18n?: Readonly<Record<string, MarketLocalizedCopy>>
  /** Star history window, most recent first. */
  snapshots?: readonly MarketSnapshotPoint[]
  /** Recent growth deltas over the snapshot window. */
  growth?: { windowDays?: number; stars?: number; contributors?: number }
}

/** One entry of `GET /v1/suggest`. */
export interface MarketSuggestion {
  /** Entry kind (`plugin`, ...). */
  type: string
  /** `owner/repo` when the entry is a plugin. */
  id: string
  /** Display label (usually the repo name). */
  label: string
  /** One-line rationale. */
  sub?: string
  /** Catalog-relative or absolute href, when reported. */
  href?: string
  stars: number
  featured: boolean
}

/** Catalog sort keys accepted by `GET /v1/plugins`. */
export type MarketSort = 'stars' | 'updated' | 'score' | 'name'

/** Sort direction. */
export type MarketOrder = 'asc' | 'desc'

/** One `GET /v1/plugins` request, after query parsing and filter projection. */
export interface MarketRequest {
  /** Single search keyword (one term of a parsed query), when present. */
  q?: string
  /** Category slug filter. */
  category?: string
  /** Repository owner filter. */
  owner?: string
  /** Primary language filter. */
  language?: string
  /** Quality grade filter. */
  grade?: string
  /** Tag filter. */
  tag?: string
  /** Minimum quality score. */
  minScore?: number
  /** Only featured rows. */
  featured?: boolean
  /** Only official rows. */
  official?: boolean
  /** Only installable plugin rows (`is_plugin=true`). */
  installable?: boolean
  sort: MarketSort
  order: MarketOrder
  /** 1-based page index. */
  page: number
  /** Rows per page. */
  perPage: number
}

/** Stable filter selection of the marketplace toolbar. */
export interface MarketFilters {
  /** Category slug, empty = all. */
  category: string
  /** Repository owner, empty = all. */
  owner: string
  /** Primary language, empty = all. */
  language: string
  /** Quality grade, empty = all. */
  grade: string
  /** Only featured rows. */
  featured: boolean
  /** Only official rows. */
  official: boolean
  /** Only installable plugin rows. */
  installable: boolean
}

/** The empty filter selection. */
export const EMPTY_MARKET_FILTERS: MarketFilters = {
  category: '',
  owner: '',
  language: '',
  grade: '',
  featured: false,
  official: false,
  installable: false,
}
