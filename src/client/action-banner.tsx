/** Localized result banner shared by Marketplace cards and details. */

import type { ReactNode } from 'react'
import { IconCopyOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { useMarketCopyFeedback } from './copy-feedback.ts'
import type { MarketInstallAction } from './market-store.ts'

/**
 * Label an in-flight package operation. The CLI reports nothing before it
 * exits, so the elapsed second count carries the liveness the label cannot.
 */
export function runningLabel(
  action: MarketInstallAction,
  t: PropsLocale<'pluginMarket'>['t'],
  elapsedSeconds = 0,
): string {
  const label = action.kind === 'install' ? t('installing') : t('uninstalling')
  return elapsedSeconds <= 0 ? label : `${label} ${String(elapsedSeconds)}s`
}

/** Build the diagnostic clipboard payload of a failed action. */
function errorCopyText(action: MarketInstallAction): string {
  const what = action.message === 'restart-failed'
    ? 'Restart'
    : action.kind === 'install' ? 'Install' : 'Uninstall'
  return [
    `${what} failed: ${action.fullName}`,
    action.command === undefined ? null : `Command: ${action.command}`,
    `Status: ${action.message}`,
    action.detail === undefined ? null : `Error:\n${action.detail}`,
  ].filter((line): line is string => line !== null).join('\n')
}

/** Render one settled package action and its next step. */
export function ActionBanner({
  action, onRestart, onDismissAction, t, css,
}: {
  action: MarketInstallAction
  onRestart: () => void
  onDismissAction: () => void
  t: PropsLocale<'pluginMarket'>['t']
  css: Record<string, string>
}): ReactNode {
  const errorCopy = useMarketCopyFeedback(errorCopyText(action))
  const success = action.status === 'ok'
  const text = success
    ? action.kind === 'install' ? t('installSuccess') : t('uninstallSuccess')
    : action.message === 'not-installable'
      ? t('notInstallable')
      : action.message === 'restart-failed' ? t('restartFailed') : t('actionFailed')
  return (
    <div className={css.actionBanner} data-tone={success ? 'ok' : 'error'} role="status">
      <span className={css.actionText}>{text}</span>
      {success ? (
        <button type="button" className={css.action} onClick={onRestart}>{t('restart')}</button>
      ) : (
        <button type="button" className={css.action} onClick={errorCopy.onCopy} aria-label={t('copyError')}>
          <IconCopyOutline16 size={14} />
          {errorCopy.copied ? t('copied') : t('copyError')}
        </button>
      )}
      <button type="button" className={css.action} onClick={onDismissAction}>{t('dismiss')}</button>
      {action.detail === undefined || action.detail === '' ? null : (
        <code className={css.errorDetail}>{action.detail}</code>
      )}
    </div>
  )
}
