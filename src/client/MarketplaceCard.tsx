/**
 * One marketplace row: identity, quality assessment, description, tags, and
 * the per-plugin actions (details, copy id, copy for agent, install or
 * uninstall in place, open repository).
 */

import type { ReactNode } from 'react'
import {
  IconCopyOutline16, IconDownloadOutline16, IconListPenOutline16, IconRightUpOutline14,
  IconTrashOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { ActionBanner, runningLabel } from './action-banner.tsx'
import { useMarketCopyFeedback } from './copy-feedback.ts'
import { isInstalled, pluginAgentMarkdown } from './agent-copy.ts'
import type { MarketInstallAction } from './market-store.ts'
import type { MarketPluginSummary } from './types.ts'
import css from './MarketplaceCard.module.css'

/** Render one plugin row. */
export interface MarketplaceCardProps {
  /** The plugin row. */
  plugin: MarketPluginSummary
  /** Installed module names (badge + uninstall action). */
  installed: readonly string[]
  /** Description-locale preference for agent copy. */
  locale: 'zh' | 'en'
  /** The latest install/uninstall operation, or null. */
  action: MarketInstallAction | null
  /** Install this plugin into the managed profile. */
  onInstall: (fullName: string) => void
  /** Uninstall this plugin from the managed profile. */
  onUninstall: (fullName: string) => void
  /** Re-boot the application tree so profile changes take effect. */
  onRestart: () => void
  /** Dismiss the settled action banner. */
  onDismissAction: () => void
  /** Approve the action's ignored build scripts and retry the install. */
  onApproveBuilds: () => void
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
  plugin, installed, locale, action, onInstall, onUninstall, onRestart, onDismissAction,
  onApproveBuilds, onDetails, onOpenRepository, t,
}: MarketplaceCardProps): ReactNode {
  const idCopy = useMarketCopyFeedback(plugin.fullName)
  const agentCopy = useMarketCopyFeedback(pluginAgentMarkdown(plugin, locale))
  const badge = badgeLabel(t, plugin)
  const installedFlag = isInstalled(plugin, installed)
  const ownAction = action !== null && action.fullName === plugin.fullName ? action : null
  const running = ownAction?.status === 'running'

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
        <button type="button" className={css.action} onClick={() => { onDetails(plugin.fullName) }}>
          <IconListPenOutline16 size={14} />
          {t('details')}
        </button>
        <button
          type="button"
          className={css.action}
          onClick={idCopy.onCopy}
          aria-label={t('copyId')}
        >
          <IconCopyOutline16 size={14} />
          {idCopy.copied ? t('copied') : t('copyId')}
        </button>
        <button
          type="button"
          className={css.action}
          onClick={agentCopy.onCopy}
          aria-label={t('copyAgent')}
        >
          <IconCopyOutline16 size={14} />
          {agentCopy.copied ? t('copied') : t('copyAgent')}
        </button>
        <button
          type="button"
          className={css.action}
          disabled={running}
          onClick={() => {
            if (installedFlag) onUninstall(plugin.fullName)
            else onInstall(plugin.fullName)
          }}
          aria-label={installedFlag ? t('uninstall') : t('install')}
        >
          {installedFlag ? <IconTrashOutline16 size={14} /> : <IconDownloadOutline16 size={14} />}
          {ownAction !== null && ownAction.status === 'running'
            ? runningLabel(ownAction, t)
            : installedFlag ? t('uninstall') : t('install')}
        </button>
        <button
          type="button"
          className={css.action}
          onClick={() => { onOpenRepository(plugin.repositoryUrl) }}
          aria-label={t('openRepo')}
        >
          <IconRightUpOutline14 size={12} />
          {t('openRepo')}
        </button>
      </div>
      {ownAction !== null && ownAction.status !== 'running' ? (
        <ActionBanner
          action={ownAction}
          onRestart={onRestart}
          onDismissAction={onDismissAction}
          onApproveBuilds={onApproveBuilds}
          t={t}
          css={css}
        />
      ) : null}
    </article>
  )
}
