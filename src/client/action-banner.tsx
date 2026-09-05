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
    : action.message === 'load-failed' || action.message === 'load-failed-stuck'
      ? 'Load'
      : action.message === 'not-plugin' || action.message === 'not-plugin-stuck'
        ? 'Install (no plugin registered)'
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
  action, restartMode, onRestart, onApproveBuilds, onDismissAction, t, css,
}: {
  action: MarketInstallAction
  /** `manual` when the launcher exposes no in-place restart. */
  restartMode: 'service' | 'manual'
  onRestart: () => void
  /** Allow the install scripts pnpm refused, then retry the install. */
  onApproveBuilds: () => void
  onDismissAction: () => void
  t: PropsLocale<'pluginMarket'>['t']
  css: Record<string, string>
}): ReactNode {
  const errorCopy = useMarketCopyFeedback(errorCopyText(action))
  // The restart reason rides along with the hint, so a pasted report says why
  // the change could not take effect live.
  const hintCopy = useMarketCopyFeedback(
    action.detail === undefined ? t('restartManualHint') : `${t('restartManualHint')}\n${action.detail}`,
  )
  const success = action.status === 'ok'
  // A hot-mounted change already took effect in the tree, so the only thing
  // still stale is this page's client bundle.
  const live = success && action.hotMounted === true
  const manual = success && !live && restartMode === 'manual'
  const text = success
    ? live
      ? action.kind === 'install' ? t('installSuccessLive') : t('uninstallSuccessLive')
      : manual
        ? action.kind === 'install' ? t('installSuccessManual') : t('uninstallSuccessManual')
        : action.kind === 'install' ? t('installSuccess') : t('uninstallSuccess')
    : action.message === 'not-installable'
      ? t('notInstallable')
      : action.message === 'restart-failed'
        ? t('restartFailed')
        : action.message === 'load-failed'
          ? t('loadFailed')
          : action.message === 'load-failed-stuck'
            ? t('loadFailedStuck')
            : action.message === 'not-plugin'
              ? t('notPlugin')
              : action.message === 'not-plugin-stuck'
                ? t('notPluginStuck')
                : action.message === 'needs-manual'
                  ? t('needsManual')
                  : action.message === 'needs-build-approval'
                    ? t('needsBuildApproval', { keys: (action.buildKeys ?? []).join(', ') })
                    : t('actionFailed')
  return (
    <div className={css.actionBanner} data-tone={success ? 'ok' : 'error'} role="status">
      <span className={css.actionText}>{text}</span>
      {live ? (
        <button type="button" className={css.action} onClick={() => { window.location.reload() }}>
          {t('reloadPage')}
        </button>
      ) : manual ? (
        <button type="button" className={css.action} onClick={hintCopy.onCopy} title={t('restartManualHint')}>
          <IconCopyOutline16 size={14} />
          {hintCopy.copied ? t('copied') : t('copyRestartHint')}
        </button>
      ) : success ? (
        <button type="button" className={css.action} onClick={onRestart}>{t('restart')}</button>
      ) : action.message === 'needs-build-approval' ? (
        <>
          <button type="button" className={css.action} onClick={onApproveBuilds}>{t('approveBuilds')}</button>
          <button type="button" className={css.action} onClick={errorCopy.onCopy} aria-label={t('copyError')}>
            <IconCopyOutline16 size={14} />
            {errorCopy.copied ? t('copied') : t('copyError')}
          </button>
        </>
      ) : (
        <button type="button" className={css.action} onClick={errorCopy.onCopy} aria-label={t('copyError')}>
          <IconCopyOutline16 size={14} />
          {errorCopy.copied ? t('copied') : t('copyError')}
        </button>
      )}
      <button type="button" className={css.action} onClick={onDismissAction}>{t('dismiss')}</button>
      {manual ? <code className={css.errorDetail}>{t('restartManualHint')}</code> : null}
      {action.detail === undefined || action.detail === '' ? null : (
        <code className={css.errorDetail}>{action.detail}</code>
      )}
    </div>
  )
}
