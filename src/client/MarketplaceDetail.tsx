/**
 * Detail dialog of one plugin: localized copy, quality assessment, direct
 * package action, and the same copy actions as the card. Rendered by the
 * marketplace surface as a fixed overlay; Escape and backdrop clicks close it.
 */

import { useEffect, type ReactNode } from 'react'
import {
  IconCloseOutline16, IconCopyOutline16, IconDownloadOutline16, IconRightUpOutline14,
  IconTrashOutline16, IconWarningOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { ActionBanner, runningLabel } from './action-banner.tsx'
import { useMarketCopyFeedback } from './copy-feedback.ts'
import { installCommand, installSpec, isInstalled, pluginAgentMarkdown, uninstallCommand, uninstallSpec } from './agent-copy.ts'
import type { MarketInstallAction } from './market-store.ts'
import type { MarketDetailInfo } from './types.ts'
import css from './MarketplaceDetail.module.css'

/** Render the detail dialog of one plugin. */
export interface MarketplaceDetailProps {
  /** The loaded detail payload; null while loading or after an error. */
  detail: MarketDetailInfo | null
  /** Detail load phase. */
  status: 'idle' | 'loading' | 'ready' | 'error'
  /** Description-locale preference. */
  locale: 'zh' | 'en'
  /** Installed module names (uninstall action availability). */
  installed: readonly string[]
  action: MarketInstallAction | null
  onInstall: (fullName: string) => void
  onUninstall: (fullName: string) => void
  onRestart: () => void
  onDismissAction: () => void
  /** Close the dialog. */
  onClose: () => void
  /** Retry the detail load. */
  onRetry: () => void
  /** Open the repository URL in a new tab. */
  onOpenRepository: (url: string) => void
  t: PropsLocale<'pluginMarket'>['t']
}

/** The localized copy block of a detail payload for the active locale. */
function localizedOf(detail: MarketDetailInfo, locale: 'zh' | 'en'): { intro?: string; highlights?: readonly string[] } {
  return detail.i18n?.[locale] ?? {}
}

/** Render the detail dialog. */
export function MarketplaceDetail({
  detail, status, locale, installed, action, onInstall, onUninstall, onRestart,
  onDismissAction, onClose, onRetry, onOpenRepository, t,
}: MarketplaceDetailProps): ReactNode {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown) }
  }, [onClose])

  const copy = detail === null ? undefined : localizedOf(detail, locale)
  const install = detail?.install
  const installedFlag = detail !== null && isInstalled(detail, installed)
  const command = detail === null
    ? null
    : installedFlag ? uninstallCommand(detail, installed) : installCommand(detail)
  const spec = detail === null
    ? null
    : installedFlag ? uninstallSpec(detail, installed) : installSpec(detail)
  const ownAction = action !== null && detail !== null && action.fullName === detail.fullName ? action : null
  const running = ownAction?.status === 'running'
  const agentCopy = useMarketCopyFeedback(detail === null ? '' : pluginAgentMarkdown(detail, locale))
  const idCopy = useMarketCopyFeedback(detail?.fullName ?? '')

  return (
    <div
      className={css.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className={css.dialog} role="dialog" aria-modal="true" aria-label={t('detailTitle')}>
        <header className={css.header}>
          <div className={css.heading}>
            <span className={css.name}>{detail?.name ?? '…'}</span>
            {detail?.grade === undefined ? null : (
              <span className={css.grade} data-grade={detail.grade}>{detail.grade}</span>
            )}
          </div>
          <button type="button" className={css.close} onClick={onClose} aria-label={t('detailClose')}>
            <IconCloseOutline16 size={16} />
          </button>
        </header>

        {status === 'loading' ? <p className={css.center}>{t('loading')}</p> : null}

        {status === 'error' ? (
          <div className={css.center}>
            <p className={css.error}>{t('detailError')}</p>
            <button type="button" className={css.action} onClick={onRetry}>{t('detailRetry')}</button>
          </div>
        ) : null}

        {status === 'ready' && detail !== null ? (
          <>
            <dl className={css.meta}>
              <div className={css.metaItem}>
                <dt>{t('authorLabel')}</dt>
                <dd>{detail.owner}</dd>
              </div>
              <div className={css.metaItem}>
                <dt>{t('categoryLabel')}</dt>
                <dd>{detail.category === undefined || detail.category.length === 0 ? '—' : detail.category}</dd>
              </div>
              <div className={css.metaItem}>
                <dt>{t('languageLabel')}</dt>
                <dd>{detail.language ?? t('languageUnknown')}</dd>
              </div>
              <div className={css.metaItem}>
                <dt>{t('gradeLabel')}</dt>
                <dd>{detail.grade ?? t('gradeNone')}</dd>
              </div>
              <div className={css.metaItem}>
                <dt>{t('scoreLabel')}</dt>
                <dd>{detail.score === undefined ? '—' : String(detail.score)}</dd>
              </div>
              <div className={css.metaItem}>
                <dt>{t('stars', { count: String(detail.stars) })}</dt>
                <dd>{String(detail.stars)}</dd>
              </div>
              {detail.contributors === undefined ? null : (
                <div className={css.metaItem}>
                  <dt>{t('contributorsLabel')}</dt>
                  <dd>{String(detail.contributors)}</dd>
                </div>
              )}
            </dl>

            {copy?.intro === undefined ? null : (
              <p className={css.intro}>{copy.intro}</p>
            )}
            {copy?.highlights === undefined || copy.highlights.length === 0 ? null : (
              <ul className={css.highlights}>
                {copy.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}
              </ul>
            )}
            <p className={css.description}>{detail.description}</p>

            {detail.tags.length === 0 ? null : (
              <div className={css.tags}>
                <span className={css.tagsLabel}>{t('tagsLabel')}</span>
                {detail.tags.map(tag => <span key={tag} className={css.tag}>{tag}</span>)}
              </div>
            )}

            {detail.isRisky ? (
              <p className={css.risk}>
                <IconWarningOutline16 size={14} />
                {detail.riskNote !== undefined ? detail.riskNote : t('riskyBadge')}
              </p>
            ) : null}

            <div className={css.install}>
              <span className={css.installLabel}>{t('commandLabel')}</span>
              {command === null ? (
                <span className={css.notInstallable}>{t('notInstallable')}</span>
              ) : (
                <code className={css.command}>{command}</code>
              )}
            </div>

            <div className={css.actions}>
              <button type="button" className={css.action} onClick={idCopy.onCopy}>
                <IconCopyOutline16 size={14} />
                {idCopy.copied ? t('copied') : t('copyId')}
              </button>
              <button type="button" className={css.action} onClick={agentCopy.onCopy}>
                <IconCopyOutline16 size={14} />
                {agentCopy.copied ? t('copied') : t('copyAgent')}
              </button>
              {install === undefined ? null : (
                <button
                  type="button"
                  className={css.action}
                  disabled={spec === null || running}
                  onClick={() => { if (installedFlag) onUninstall(detail.fullName); else onInstall(detail.fullName) }}
                >
                  {installedFlag ? <IconTrashOutline16 size={14} /> : <IconDownloadOutline16 size={14} />}
                  {running && ownAction !== null
                    ? runningLabel(ownAction, t)
                    : installedFlag ? t('uninstall') : t('install')}
                </button>
              )}
              <button
                type="button"
                className={css.action}
                onClick={() => { onOpenRepository(detail.repositoryUrl) }}
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
                t={t}
                css={css}
              />
            ) : null}
          </>
        ) : null}
      </section>
    </div>
  )
}
