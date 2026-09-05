/**
 * One marketplace row: identity, quality assessment, description, tags, and
 * the per-plugin actions (details, copy id, copy for agent, direct profile
 * install/uninstall, and open repository).
 */

import { useState, type ReactNode } from 'react'
import {
  IconCopyOutline16, IconDownloadOutline16, IconEllipsisOutline16, IconListPenOutline16,
  IconLoadingOutline16,
  IconRightUpOutline14, IconTrashOutline16, Menu, type MenuEntry,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import clsx from 'clsx'
import { ActionBanner, runningLabel } from './action-banner.tsx'
import { IconStarFill16, IconStarOutline16 } from './icons.tsx'
import { useElapsedSeconds } from './use-elapsed.ts'
import { useMarketCopyFeedback } from './copy-feedback.ts'
import { installSpec, isInstalled, pluginAgentMarkdown, rowVerdict, uninstallSpec } from './agent-copy.ts'
import type { MarketInstallAction } from './market-store.ts'
import type { PluginVerdict } from './plugin-actions.ts'
import type { MarketPluginSummary } from './types.ts'
import css from './MarketplaceCard.module.css'

/** Render one plugin row. */
export interface MarketplaceCardProps {
  /** The plugin row. */
  plugin: MarketPluginSummary
  /** Installed module names (badge + uninstall action). */
  installed: readonly string[]
  /** What this profile already found out about packages. */
  verdicts: readonly PluginVerdict[]
  /** Description-locale preference for agent copy. */
  locale: 'zh' | 'en'
  /** Latest package operation, or null. */
  action: MarketInstallAction | null
  /** `manual` when the launcher exposes no in-place restart. */
  restartMode: 'service' | 'manual'
  /** Whether the GitHub credential can read and write stars. */
  canStar: boolean
  /** Whether the authenticated GitHub user stars this repository. */
  starred: boolean
  /** Whether a star change is in flight for this repository. */
  starBusy: boolean
  onToggleStar: (fullName: string) => void
  onInstall: (fullName: string) => void
  onUninstall: (fullName: string) => void
  onRestart: () => void
  /** Allow the install scripts pnpm refused, then retry. */
  onApproveBuilds: () => void
  onDismissAction: () => void
  /** Open the detail dialog. */
  onDetails: (fullName: string) => void
  /** Open the repository URL in a new tab. */
  onOpenRepository: (url: string) => void
  t: PropsLocale<'pluginMarket'>['t']
}

/** Localized badge label of one row, when any applies. */
function badgeLabel(t: MarketplaceCardProps['t'], plugin: MarketPluginSummary): string | null {
  if (plugin.archived) return t('archivedBadge')
  if (plugin.isRisky) return t('riskyBadge')
  if (plugin.isOfficial) return t('officialBadge')
  if (plugin.isFeatured) return t('featuredBadge')
  return null
}

/** Render one marketplace card. */
export function MarketplaceCard({
  plugin, installed, verdicts, locale, action, restartMode, canStar, starred, starBusy, onToggleStar,
  onInstall, onUninstall, onRestart, onApproveBuilds, onDismissAction, onDetails, onOpenRepository, t,
}: MarketplaceCardProps): ReactNode {
  const [menuOpen, setMenuOpen] = useState(false)
  const idCopy = useMarketCopyFeedback(plugin.fullName)
  const agentCopy = useMarketCopyFeedback(pluginAgentMarkdown(plugin, locale))
  const badge = badgeLabel(t, plugin)
  const verdict = rowVerdict(plugin, verdicts)
  const installedFlag = isInstalled(plugin, installed)
  const spec = installedFlag ? uninstallSpec(plugin, installed) : installSpec(plugin)
  const ownAction = action !== null && action.fullName === plugin.fullName ? action : null
  const running = ownAction?.status === 'running'
  const elapsed = useElapsedSeconds(running ? ownAction?.startedAt : undefined)
  // Everything that is not install or star lives behind the overflow menu, so
  // one row keeps its shape as the action set grows.
  const menuItems: readonly MenuEntry[] = [
    { id: 'details', label: t('details'), icon: <IconListPenOutline16 size={14} /> },
    { id: 'copyId', label: idCopy.copied ? t('copied') : t('copyId'), icon: <IconCopyOutline16 size={14} /> },
    { id: 'copyAgent', label: agentCopy.copied ? t('copied') : t('copyAgent'), icon: <IconCopyOutline16 size={14} /> },
    { id: 'openRepo', label: t('openRepo'), icon: <IconRightUpOutline14 size={12} /> },
  ]
  const onMenuSelect = (id: string): void => {
    setMenuOpen(false)
    if (id === 'details') onDetails(plugin.fullName)
    else if (id === 'copyId') idCopy.onCopy()
    else if (id === 'copyAgent') agentCopy.onCopy()
    else if (id === 'openRepo') onOpenRepository(plugin.repositoryUrl)
  }

  return (
    <article className={css.card}>
      <button type="button" className={css.body} onClick={() => { onDetails(plugin.fullName) }}>
        <span className={css.titleRow}>
          <span className={css.name}>{plugin.name}</span>
          {plugin.grade === undefined ? null : (
            <span className={css.grade} data-grade={plugin.grade}>{plugin.grade}</span>
          )}
          {badge === null ? null : <span className={css.badge}>{badge}</span>}
          {installedFlag ? <span className={css.installed}>{t('installedBadge')}</span> : null}
          {verdict === null ? null : (
            <span
              className={css.verdict}
              title={`${verdict.reason}\n\n${new Date(verdict.at).toLocaleString()}`}
            >
              {verdict.kind === 'not-plugin'
                ? t('notPluginBadge')
                : verdict.kind === 'manual'
                  ? t('manualBadge')
                  : verdict.kind === 'peer' ? t('peerBadge') : t('unloadableBadge')}
            </span>
          )}
        </span>
        <span className={css.metaRow}>
          <span className={css.owner}>{plugin.fullName}</span>
          <span className={css.meta}>{t('stars', { count: String(plugin.stars) })}</span>
          {plugin.language === undefined ? null : <span className={css.meta}>{plugin.language}</span>}
          {plugin.score === undefined ? null : <span className={css.meta}>{t('scoreLabel')} {plugin.score}</span>}
        </span>
        <span className={css.description}>{plugin.description}</span>
        {plugin.tags.length === 0 ? null : (
          <span className={css.tagRow}>
            {plugin.tags.slice(0, 3).map(tag => (
              <span key={tag} className={css.tag}>{tag}</span>
            ))}
            {plugin.tags.length > 3
              ? <span className={css.tagMore}>{t('tagsMore', { count: String(plugin.tags.length - 3) })}</span>
              : null}
          </span>
        )}
      </button>
      <div className={css.actions}>
        {canStar ? (
          <button
            type="button"
            className={clsx(css.action, starred && css.actionOn)}
            disabled={starBusy}
            aria-pressed={starred}
            onClick={() => { onToggleStar(plugin.fullName) }}
          >
            {starred ? <IconStarFill16 size={14} /> : <IconStarOutline16 size={14} />}
            {starred ? t('starred') : t('star')}
          </button>
        ) : null}
        <button
          type="button"
          className={css.action}
          disabled={spec === null || running}
          onClick={() => { if (installedFlag) onUninstall(plugin.fullName); else onInstall(plugin.fullName) }}
          aria-label={installedFlag ? t('uninstall') : t('install')}
        >
          {running
            ? <IconLoadingOutline16 size={14} className={css.spinner} />
            : installedFlag ? <IconTrashOutline16 size={14} /> : <IconDownloadOutline16 size={14} />}
          {running && ownAction !== null
            ? runningLabel(ownAction, t, elapsed)
            : installedFlag ? t('uninstall') : t('install')}
        </button>
        <Menu
          open={menuOpen}
          anchor={(
            <button
              type="button"
              className={css.action}
              aria-label={t('moreActions')}
              onClick={() => { setMenuOpen(open => !open) }}
            >
              <IconEllipsisOutline16 size={14} />
            </button>
          )}
          items={menuItems}
          onSelect={onMenuSelect}
          onClose={() => { setMenuOpen(false) }}
          align="end"
          portal
          compact
        />
      </div>
      {ownAction !== null && ownAction.status !== 'running' ? (
        <ActionBanner
          action={ownAction}
          restartMode={restartMode}
          onRestart={onRestart}
          onApproveBuilds={onApproveBuilds}
          onDismissAction={onDismissAction}
          t={t}
          css={css}
        />
      ) : null}
    </article>
  )
}
