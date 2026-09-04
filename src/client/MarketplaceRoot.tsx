/**
 * The shared marketplace surface: search toolbar, filter panel, sort
 * controls, the infinite-scroll list, and the detail dialog. Mounted both as
 * the Settings Plugins tab and inside the shell-overlay modal; both bind the
 * same controller, so state survives switching surfaces.
 */

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import {
  Button, IconCopyOutline16, IconSearchOutline16, Modal,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { useMarketCopyFeedback } from './copy-feedback.ts'
import { isInstalled, listAgentMarkdown } from './agent-copy.ts'
import type { MarketCategoryFacet } from './api.ts'
import type { MarketplaceInjected } from './contract.ts'
import type { PluginMarketKey } from './locales.ts'
import type { MarketInstallWarning } from './market-store.ts'
import { MarketplaceCard } from './MarketplaceCard.tsx'
import { MarketplaceDetail } from './MarketplaceDetail.tsx'
import { parseMarketQuery, type ParsedFieldFilters, type ParsedMarketQuery } from './search.ts'
import {
  EMPTY_MARKET_FILTERS, type MarketFilters, type MarketOrder, type MarketSort,
} from './types.ts'
import css from './MarketplaceRoot.module.css'

/** Full component props of the marketplace surface (shared by both mounts). */
export type MarketplaceRootProps =
  PropsRuntime<'settings.plugins.tab' | 'shell.overlay'>
  & PropsLocale<'pluginMarket'>
  & InjectFace<MarketplaceInjected>

/** Search debounce before a reload starts, in ms. */
const SEARCH_DEBOUNCE_MS = 350

/** Translate-stub safe: `PropsLocale['t']` resolves through the namespace map. */
type Translate = MarketplaceRootProps['t']

const SORT_FIELDS: readonly { value: MarketSort; key: PluginMarketKey }[] = [
  { value: 'stars', key: 'sortStars' },
  { value: 'updated', key: 'sortUpdated' },
  { value: 'score', key: 'sortScore' },
  { value: 'name', key: 'sortName' },
]

const SORT_ORDERS: readonly { value: MarketOrder; key: PluginMarketKey }[] = [
  { value: 'desc', key: 'orderDesc' },
  { value: 'asc', key: 'orderAsc' },
]

/** Render sort dimension and direction as two compact selection rows. */
function SortPanel({
  id, sort, order, onChange, t,
}: {
  id: string
  sort: MarketSort
  order: MarketOrder
  onChange: (sort: MarketSort, order: MarketOrder) => void
  t: Translate
}): ReactNode {
  return (
    <div id={id} className={`${css.filters} ${css.sortPanel}`} role="region" aria-label={t('sortLabel')}>
      <div className={css.sortRow}>
        <span className={css.sortPanelLabel}>{t('sortDimension')}</span>
        <div className={css.sortChoices}>
          {SORT_FIELDS.map(option => (
            <button
              key={option.value}
              type="button"
              className={css.sortChoice}
              aria-pressed={sort === option.value}
              onClick={() => { if (sort !== option.value) onChange(option.value, order) }}
            >
              {t(option.key)}
            </button>
          ))}
        </div>
      </div>
      <div className={css.sortRow}>
        <span className={css.sortPanelLabel}>{t('sortDirection')}</span>
        <div className={css.sortChoices}>
          {SORT_ORDERS.map(option => (
            <button
              key={option.value}
              type="button"
              className={css.sortChoice}
              aria-pressed={order === option.value}
              onClick={() => { if (order !== option.value) onChange(sort, option.value) }}
            >
              {t(option.key)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Render the collapsible filter panel. */
function FilterPanel({
  id, facets, filters, installedOnly, queryFilters, searchFiltersActive, onApply,
  onInstalledOnlyChange, t,
}: {
  id: string
  facets: readonly MarketCategoryFacet[]
  filters: MarketFilters
  installedOnly: boolean
  queryFilters: ParsedFieldFilters
  searchFiltersActive: boolean
  onApply: (filters: MarketFilters) => void
  onInstalledOnlyChange: (installedOnly: boolean) => void
  t: Translate
}): ReactNode {
  const [ownerDraft, setOwnerDraft] = useState(filters.owner)
  const [languageDraft, setLanguageDraft] = useState(filters.language)
  const hintId = `${id}-query-hint`
  const category = queryFilters.category ?? filters.category
  const owner = queryFilters.owner ?? ownerDraft
  const language = queryFilters.language ?? languageDraft
  const grade = queryFilters.grade ?? filters.grade
  const hasCatalogFilters = filters.category !== '' || filters.owner !== '' || filters.language !== ''
    || filters.grade !== '' || filters.featured || filters.official || filters.installable
  const hasPanelFilters = hasCatalogFilters || installedOnly

  useEffect(() => { setOwnerDraft(filters.owner) }, [filters.owner])
  useEffect(() => { setLanguageDraft(filters.language) }, [filters.language])

  const commit = (next: Partial<MarketFilters>): void => {
    onApply({ ...filters, ...next })
  }

  const commitDraft = (
    key: 'owner' | 'language', draft: string, current: string, setDraft: (value: string) => void,
  ): void => {
    const next = draft.trim()
    setDraft(next)
    if (next !== current) commit({ [key]: next })
  }

  return (
    <div id={id} className={css.filters} role="region" aria-label={t('filterLabel')}>
      {searchFiltersActive ? (
        <p id={hintId} className={css.filterHint}>{t('searchFiltersOverride')}</p>
      ) : null}
      <div className={css.filterFields}>
        <label className={css.filterRow}>
          <span className={css.filterLabel}>{t('filterCategory')}</span>
          <select
            className={css.select}
            value={category}
            disabled={queryFilters.category !== undefined}
            aria-describedby={queryFilters.category === undefined ? undefined : hintId}
            onChange={(event) => { commit({ category: event.target.value }) }}
          >
            <option value="">—</option>
            {queryFilters.category !== undefined && !facets.some(facet => facet.value === queryFilters.category) ? (
              <option value={queryFilters.category}>{queryFilters.category}</option>
            ) : null}
            {facets.map(facet => (
              <option key={facet.value} value={facet.value}>{facet.value} ({facet.count})</option>
            ))}
          </select>
        </label>
        <label className={css.filterRow}>
          <span className={css.filterLabel}>{t('filterOwner')}</span>
          <input
            className={css.input}
            value={owner}
            placeholder="deepseek-ai"
            disabled={queryFilters.owner !== undefined}
            aria-describedby={queryFilters.owner === undefined ? undefined : hintId}
            onChange={(event) => { setOwnerDraft(event.target.value) }}
            onBlur={() => { commitDraft('owner', ownerDraft, filters.owner, setOwnerDraft) }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commitDraft('owner', ownerDraft, filters.owner, setOwnerDraft)
            }}
          />
        </label>
        <label className={css.filterRow}>
          <span className={css.filterLabel}>{t('filterLanguage')}</span>
          <input
            className={css.input}
            value={language}
            placeholder="TypeScript"
            disabled={queryFilters.language !== undefined}
            aria-describedby={queryFilters.language === undefined ? undefined : hintId}
            onChange={(event) => { setLanguageDraft(event.target.value) }}
            onBlur={() => { commitDraft('language', languageDraft, filters.language, setLanguageDraft) }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commitDraft('language', languageDraft, filters.language, setLanguageDraft)
            }}
          />
        </label>
        <label className={css.filterRow}>
          <span className={css.filterLabel}>{t('filterGrade')}</span>
          <select
            className={css.select}
            value={grade}
            disabled={queryFilters.grade !== undefined}
            aria-describedby={queryFilters.grade === undefined ? undefined : hintId}
            onChange={(event) => { commit({ grade: event.target.value }) }}
          >
            <option value="">—</option>
            {queryFilters.grade !== undefined && !['S', 'A', 'B', 'C'].includes(queryFilters.grade) ? (
              <option value={queryFilters.grade}>{queryFilters.grade}</option>
            ) : null}
            <option value="S">S</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </label>
      </div>
      <div className={css.filterFooter}>
        <div className={css.checkRow}>
          <label className={css.check}>
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={(event) => { commit({ featured: event.target.checked }) }}
            />
            {t('filterFeatured')}
          </label>
          <label className={css.check}>
            <input
              type="checkbox"
              checked={filters.official}
              onChange={(event) => { commit({ official: event.target.checked }) }}
            />
            {t('filterOfficial')}
          </label>
          <label className={css.check}>
            <input
              type="checkbox"
              checked={filters.installable}
              onChange={(event) => { commit({ installable: event.target.checked }) }}
            />
            {t('filterInstallable')}
          </label>
          <label className={css.check}>
            <input
              type="checkbox"
              checked={installedOnly}
              onChange={(event) => { onInstalledOnlyChange(event.target.checked) }}
            />
            {t('filterInstalled')}
          </label>
        </div>
        <button
          type="button"
          className={`${css.action} ${css.filterClear}`}
          disabled={!hasPanelFilters}
          onClick={() => {
            if (hasCatalogFilters) onApply(EMPTY_MARKET_FILTERS)
            if (installedOnly) onInstalledOnlyChange(false)
          }}
        >
          {t('filterClear')}
        </button>
      </div>
    </div>
  )
}

/** Count effective toolbar and query filters without double-counting overrides. */
function activeFilterCount(
  filters: MarketFilters,
  installedOnly: boolean,
  parsed: ParsedMarketQuery,
): number {
  const { apiFilters } = parsed
  let count = 0
  for (const field of ['category', 'owner', 'language', 'grade'] as const) {
    if ((apiFilters[field] ?? filters[field]) !== '') count += 1
  }
  if (apiFilters.tag !== undefined) count += 1
  if (apiFilters.minScore !== undefined || parsed.scoreMax !== undefined) count += 1
  if (parsed.starsMin !== undefined || parsed.starsMax !== undefined) count += 1
  if (filters.featured) count += 1
  if (filters.official) count += 1
  if (filters.installable) count += 1
  if (installedOnly) count += 1
  return count
}

/** Confirm an interrupting restart while Agent activity remains live. */
function RestartConfirmDialog({
  activity, unavailable, onConfirm, onCancel, t,
}: {
  activity: { running: boolean; active: number } | null
  unavailable: boolean
  onConfirm: () => void
  onCancel: () => void
  t: Translate
}): ReactNode {
  const [acknowledged, setAcknowledged] = useState(false)
  const running = activity?.running === true
  const description = unavailable
    ? t('restartUnavailable')
    : running ? t('restartRunning', { count: String(activity.active) }) : t('restartSafe')
  return (
    <Modal
      open
      onClose={onCancel}
      title={t('restartConfirmTitle')}
      description={description}
      footer={(
        <>
          <Button variant="outline" onClick={onCancel}>{t('restartCancel')}</Button>
          <Button variant="primary" disabled={running && !acknowledged} onClick={onConfirm}>
            {t('restartConfirm')}
          </Button>
        </>
      )}
    >
      {running ? (
        <label className={css.acknowledgement}>
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(event) => { setAcknowledged(event.currentTarget.checked) }}
          />
          <span>{t('restartAcknowledge')}</span>
        </label>
      ) : null}
    </Modal>
  )
}

/**
 * Warn before installing a plugin whose declared harness ranges the running
 * installation does not satisfy, and let the user proceed anyway: the ranges are
 * often stale metadata rather than a real break, so this informs instead of
 * blocking.
 */
function CompatibilityDialog({
  warning, onConfirm, onCancel, t,
}: {
  warning: MarketInstallWarning
  onConfirm: () => void
  onCancel: () => void
  t: Translate
}): ReactNode {
  const rows = warning.mismatches.map(peer => t('compatRow', peer))
  const copy = useMarketCopyFeedback([`${warning.fullName} (${warning.spec})`, ...rows].join('\n'))
  return (
    <Modal
      open
      onClose={onCancel}
      title={t('compatTitle')}
      description={t('compatSummary')}
      footer={(
        <>
          <Button variant="outline" onClick={copy.onCopy}>
            {copy.copied ? t('copied') : t('compatCopy')}
          </Button>
          <Button variant="outline" onClick={onCancel}>{t('compatCancel')}</Button>
          <Button variant="primary" onClick={onConfirm}>{t('compatConfirm')}</Button>
        </>
      )}
    >
      <ul className={css.mismatchList}>
        {warning.mismatches.map(peer => (
          <li key={peer.name}>
            <span className={css.mismatchName}>{peer.name}</span>
            <span className={css.mismatchVersions}>{t('compatVersions', peer)}</span>
          </li>
        ))}
      </ul>
    </Modal>
  )
}

/** Render the marketplace surface. */
export function MarketplaceRoot({ controller, useView, locale, t }: MarketplaceRootProps): ReactNode {
  const view = useView(state => state)
  const [input, setInput] = useState(view.search)
  const [sortOpen, setSortOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [facets, setFacets] = useState<readonly MarketCategoryFacet[]>([])
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const sortId = useId()
  const filtersId = useId()
  const parsedSearch = parseMarketQuery(view.search)
  const filterCount = activeFilterCount(view.filters, view.installedOnly, parsedSearch)
  const searchFiltersActive = Object.keys(parsedSearch.apiFilters).length > 0
    || parsedSearch.starsMin !== undefined || parsedSearch.starsMax !== undefined
    || parsedSearch.scoreMax !== undefined
  const visibleItems = view.installedOnly
    ? view.items.filter(plugin => isInstalled(plugin, view.installed))
    : view.items
  const copyLabel = t('copyLoaded', {
    loaded: String(visibleItems.length),
    total: String(view.total),
  })
  const listCopy = useMarketCopyFeedback(listAgentMarkdown(visibleItems, view.total, view.search, locale))
  const starErrorCopy = useMarketCopyFeedback(view.starError ?? '')

  useEffect(() => { controller.ensureLoaded() }, [controller])

  useEffect(() => { setInput(view.search) }, [view.search])

  useEffect(() => {
    if (input === view.search) return
    const timer = window.setTimeout(() => { controller.applySearch(input) }, SEARCH_DEBOUNCE_MS)
    return () => { window.clearTimeout(timer) }
  }, [input, view.search, controller])

  useEffect(() => {
    let current = true
    void controller.fetchFacets().then((result) => { if (current) setFacets(result) })
    return () => { current = false }
  }, [controller])

  useEffect(() => {
    const el = sentinelRef.current
    // React attaches refs before effects, so the sentinel always exists here.
    /* v8 ignore next -- unreachable defensive arm for ref-less mounts. */
    if (el === null) return
    // The explicit button remains available when an embedded webview lacks
    // IntersectionObserver, so mounting without the observer must not crash.
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) controller.loadNextPage()
    }, { rootMargin: '240px' })
    observer.observe(el)
    return () => { observer.disconnect() }
  }, [view.status, view.items.length, controller])

  const openRepository = (url: string): void => {
    window.open(url, '_blank', 'noopener')
  }

  return (
    <div className={css.root}>
      <div className={css.toolbar}>
        <label className={css.searchWrap}>
          <IconSearchOutline16 size={16} />
          <input
            className={css.search}
            type="search"
            value={input}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            onChange={(event) => { setInput(event.target.value) }}
          />
        </label>
        <div className={css.toolbarControls}>
          <button
            type="button"
            className={`${css.action} ${css.toolbarAction}`}
            data-active={filterCount > 0 ? 'true' : undefined}
            aria-expanded={filtersOpen}
            aria-controls={filtersId}
            onClick={() => {
              setFiltersOpen(open => !open)
              setSortOpen(false)
            }}
          >
            {filterCount > 0 ? t('filterActive', { count: String(filterCount) }) : t('filterLabel')}
          </button>
          <button
            type="button"
            className={`${css.action} ${css.toolbarAction}`}
            aria-expanded={sortOpen}
            aria-controls={sortId}
            onClick={() => {
              setSortOpen(open => !open)
              setFiltersOpen(false)
            }}
          >
            {t('sortLabel')}
          </button>
        </div>
      </div>

      {filtersOpen ? (
        <FilterPanel
          id={filtersId}
          facets={facets}
          filters={view.filters}
          installedOnly={view.installedOnly}
          queryFilters={parsedSearch.apiFilters}
          searchFiltersActive={searchFiltersActive}
          onApply={(filters) => { controller.applyFilters(filters) }}
          onInstalledOnlyChange={(installedOnly) => { controller.applyInstalledFilter(installedOnly) }}
          t={t}
        />
      ) : null}

      {sortOpen ? (
        <SortPanel
          id={sortId}
          sort={view.sort}
          order={view.order}
          onChange={(sort, order) => { controller.applyOrdering(sort, order) }}
          t={t}
        />
      ) : null}

      <dl className={css.help}>
        <dt>{t('searchSyntaxLabel')}</dt>
        <dd>{t('searchSyntaxHelp')}</dd>
        <dt>{t('searchFieldsLabel')}</dt>
        <dd>{t('searchFieldsHelp')}</dd>
      </dl>

      <div className={css.metaRow}>
        <div className={css.metaInfo} role="status" aria-live="polite" aria-atomic="true">
          <span className={css.total}>{t('total', { count: String(view.total) })}</span>
          <span className={css.metaSeparator} aria-hidden="true">·</span>
          <span className={css.loaded}>{t('loadedCount', { count: String(visibleItems.length) })}</span>
          {view.mode === 'merged' ? <span className={css.mergedNote}>{t('mergedNote')}</span> : null}
        </div>
        <button
          type="button"
          className={`${css.action} ${css.copyAction}`}
          disabled={visibleItems.length === 0}
          onClick={listCopy.onCopy}
          aria-label={copyLabel}
        >
          <IconCopyOutline16 size={14} />
          {listCopy.copied ? t('copied') : t('copyAgentList')}
        </button>
      </div>

      {view.starError === null ? null : (
        <div className={css.starError} role="status">
          <span className={css.starErrorText}>{t('starFailed')}</span>
          <button
            type="button"
            className={css.action}
            onClick={starErrorCopy.onCopy}
            aria-label={t('copyError')}
          >
            <IconCopyOutline16 size={14} />
            {starErrorCopy.copied ? t('copied') : t('copyError')}
          </button>
          <button
            type="button"
            className={css.action}
            onClick={() => { controller.dismissStarError() }}
          >
            {t('dismiss')}
          </button>
          <code className={css.starErrorDetail}>{view.starError}</code>
        </div>
      )}

      <div className={css.list}>
        {visibleItems.map(plugin => (
          <MarketplaceCard
            key={plugin.fullName}
            plugin={plugin}
            installed={view.installed}
            locale={locale}
            action={view.action}
            restartMode={view.restartMode}
            canStar={view.starSupported}
            starred={view.starred.some(name => name.toLocaleLowerCase() === plugin.fullName.toLocaleLowerCase())}
            starBusy={view.starBusy.includes(plugin.fullName)}
            onToggleStar={(fullName) => { controller.toggleStar(fullName) }}
            onInstall={(fullName) => { controller.install(fullName) }}
            onUninstall={(fullName) => { controller.uninstall(fullName) }}
            onRestart={() => { void controller.restart() }}
            onDismissAction={() => { controller.dismissAction() }}
            onDetails={(fullName) => { controller.openDetail(fullName) }}
            onOpenRepository={openRepository}
            t={t}
          />
        ))}

        {view.status === 'loading' && view.items.length === 0 ? (
          <p className={css.state} role="status">{t('loading')}</p>
        ) : null}
        {view.status === 'loading' && view.items.length > 0 ? (
          <p className={css.state} role="status">{t('loadingMore')}</p>
        ) : null}
        {view.status === 'error' ? (
          <div className={css.state} role="alert">
            <p>{t('error')}</p>
            <button type="button" className={css.action} onClick={() => { controller.retry() }}>{t('retry')}</button>
          </div>
        ) : null}
        {(view.status === 'ready' || view.status === 'exhausted') && visibleItems.length === 0 ? (
          <p className={css.state} role="status">
            {t(view.syncStatus === 'syncing'
              ? 'emptySyncing'
              : input.trim() === '' && filterCount === 0 ? 'emptyCatalog' : 'empty')}
          </p>
        ) : null}
        {view.status === 'exhausted' && visibleItems.length > 0 ? (
          <p className={css.state} role="status">{t('exhausted', { count: String(visibleItems.length) })}</p>
        ) : null}
      </div>

      <div ref={sentinelRef} className={css.pagination} data-testid="market-sentinel">
        {view.status === 'ready' && view.items.length > 0 ? (
          <button type="button" className={css.action} onClick={() => { controller.loadNextPage() }}>
            {t('loadMore')}
          </button>
        ) : null}
      </div>

      {view.installWarning === null ? null : (
        <CompatibilityDialog
          warning={view.installWarning}
          onConfirm={() => { controller.confirmInstallWarning() }}
          onCancel={() => { controller.dismissInstallWarning() }}
          t={t}
        />
      )}

      {view.restartConfirm ? (
        <RestartConfirmDialog
          activity={view.restartActivity}
          unavailable={view.restartStatusUnavailable}
          onConfirm={() => { controller.confirmRestart() }}
          onCancel={() => { controller.dismissRestart() }}
          t={t}
        />
      ) : null}

      {view.selected === null ? null : (
        <MarketplaceDetail
          detail={view.detail}
          status={view.detailStatus}
          locale={locale}
          installed={view.installed}
          action={view.action}
          restartMode={view.restartMode}
          canStar={view.starSupported}
          starred={view.detail !== null
            && view.starred.some(name => name.toLocaleLowerCase() === view.detail?.fullName.toLocaleLowerCase())}
          starBusy={view.detail !== null && view.starBusy.includes(view.detail.fullName)}
          onToggleStar={(fullName) => { controller.toggleStar(fullName) }}
          onInstall={(fullName) => { controller.install(fullName) }}
          onUninstall={(fullName) => { controller.uninstall(fullName) }}
          onRestart={() => { void controller.restart() }}
          onDismissAction={() => { controller.dismissAction() }}
          onClose={() => { controller.closeDetail() }}
          /* v8 ignore next -- the dialog renders only while selected is set. */
          onRetry={() => { if (view.selected !== null) controller.openDetail(view.selected) }}
          onOpenRepository={openRepository}
          t={t}
        />
      )}
    </div>
  )
}
