/**
 * Shell-overlay marketplace: a frame-wide modal wrapping the shared
 * marketplace surface. Renders nothing while closed; Escape and the close
 * button close it.
 */

import { useEffect, useState, type ReactNode } from 'react'
import { IconCloseOutline16, IconRefreshOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { MarketplaceInjected } from './contract.ts'
import type { MarketSyncProgress } from './api.ts'
import { MarketplaceRoot } from './MarketplaceRoot.tsx'
import css from './MarketOverlay.module.css'

/** Full component props of the shell-overlay marketplace. */
export type MarketOverlayProps =
  PropsRuntime<'shell.overlay'>
  & PropsLocale<'pluginMarket'>
  & InjectFace<MarketplaceInjected>

/** Localized age bucket used by the refresh-button label. */
function relativeAge(updatedAt: number, now: number, t: MarketOverlayProps['t']): string {
  const minutes = Math.max(0, Math.floor((now - updatedAt) / 60_000))
  if (minutes < 1) return t('relativeMinute')
  if (minutes < 60) return t('relativeMinutes', { count: String(minutes) })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('relativeHours', { count: String(hours) })
  return t('relativeDays', { count: String(Math.floor(hours / 24)) })
}

/** Render the provider-independent completed/total synchronization counter. */
function progressLabel(progress: MarketSyncProgress, t: MarketOverlayProps['t']): string {
  return t('refreshSyncingProgress', {
    synced: String(progress.items),
    total: String(progress.totalItems),
  })
}

/** Render the marketplace overlay, or nothing while closed. */
export function MarketOverlay(props: MarketOverlayProps): ReactNode {
  const { controller, useView } = props
  const open = useView(state => state.overlayOpen)
  const catalogTotal = useView(state => state.catalogTotal)
  const updatedAt = useView(state => state.updatedAt)
  const syncStatus = useView(state => state.syncStatus)
  const syncError = useView(state => state.syncError)
  const syncProgress = useView(state => state.syncProgress)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') controller.close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown) }
  }, [open, controller])

  useEffect(() => {
    if (!open || updatedAt === null) return
    setNow(Date.now())
    const timer = window.setInterval(() => { setNow(Date.now()) }, 60_000)
    return () => { window.clearInterval(timer) }
  }, [open, updatedAt])

  if (!open) return null
  const refreshLabel = updatedAt === null
    ? props.t('refreshNever', { count: String(catalogTotal) })
    : props.t('refreshSummary', {
      count: String(catalogTotal),
      relative: relativeAge(updatedAt, now, props.t),
    })

  return (
    <div
      className={css.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) controller.close()
      }}
    >
      <section className={css.modal} role="dialog" aria-modal="true" aria-label={props.t('overlayTitle')}>
        <header className={css.header}>
          <div className={css.heading}>
            <span className={css.title}>{props.t('overlayTitle')}</span>
            <button
              type="button"
              className={css.refresh}
              disabled={syncStatus === 'syncing'}
              aria-label={props.t('refreshAction')}
              title={syncStatus === 'error' ? props.t('refreshFailed') : props.t('refreshAction')}
              onClick={() => { void controller.syncCatalog() }}
            >
              <IconRefreshOutline16 className={syncStatus === 'syncing' ? css.spinning : undefined} size={14} />
              <span role={syncStatus === 'syncing' ? 'status' : undefined}>
                {syncStatus === 'syncing'
                  ? syncProgress === null
                    ? props.t('refreshSyncingProgress', { synced: '0', total: '0' })
                    : progressLabel(syncProgress, props.t)
                  : refreshLabel}
              </span>
            </button>
            {syncStatus === 'error' && syncError !== null ? (
              <span className={css.syncError} role="status" title={syncError}>
                {props.t('refreshFailedDetail', { reason: syncError })}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            className={css.close}
            onClick={() => { controller.close() }}
            aria-label={props.t('close')}
          >
            <IconCloseOutline16 size={16} />
          </button>
        </header>
        <div className={css.body}>
          <MarketplaceRoot {...props} />
        </div>
      </section>
    </div>
  )
}
