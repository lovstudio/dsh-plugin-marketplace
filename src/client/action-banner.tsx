/**
 * Localized state of one install/uninstall operation, shared by the card and
 * the detail dialog: the running label, the settled banner tone + text, and
 * the shared banner component that renders the settled banner with a copy
 * action for the specific failure text.
 */

import type { ReactNode } from 'react'
import { IconCopyOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { useMarketCopyFeedback } from './copy-feedback.ts'
import type { MarketInstallAction } from './market-store.ts'

/** Tone and text of a settled action banner. */
export interface ActionBannerState {
  /** Banner tone, driving the success/error background. */
  tone: 'ok' | 'error'
  /** Localized banner text. */
  text: string
  /** The specific failure text shown below the banner line, when any. */
  detail?: string
}

/** The running label of an in-flight operation.
 * @param action - the in-flight operation.
 * @param t - the marketplace dictionary translator.
 * @returns the localized installing/uninstalling label.
 */
export function runningLabel(
  action: MarketInstallAction,
  t: PropsLocale<'pluginMarket'>['t'],
): string {
  return action.kind === 'install' ? t('installing') : t('uninstalling')
}

/** The settled banner tone + text of an operation.
 * @param action - the settled operation.
 * @param t - the marketplace dictionary translator.
 * @returns the banner tone, localized text, and the specific failure text.
 */
export function actionBanner(
  action: MarketInstallAction,
  t: PropsLocale<'pluginMarket'>['t'],
): ActionBannerState {
  if (action.status === 'ok') {
    return {
      tone: 'ok',
      text: action.kind === 'install' ? t('installSuccess') : t('uninstallSuccess'),
    }
  }
  const state: ActionBannerState = {
    tone: 'error',
    text: action.message === 'not-installable' ? t('notInstallable') : t('actionFailed'),
  }
  if (action.detail !== undefined) state.detail = action.detail
  return state
}

/** The copy payload of a failed operation: the plugin, the command that ran,
 * the outcome code, and the specific failure text, in a keyed layout an
 * agent or an issue can consume directly. When the profile manager captured
 * no diagnostics, the payload says so and points at a terminal re-run.
 * @param action - the settled operation.
 * @returns the clipboard text.
 */
export function errorCopyText(action: MarketInstallAction): string {
  const lines = [
    `${action.kind === 'install' ? 'Install' : 'Uninstall'} failed: ${action.fullName}`,
  ]
  if (action.command !== undefined && action.command !== '') lines.push(`Command: ${action.command}`)
  lines.push(`Status: ${action.message}`)
  if (action.detail !== undefined && action.detail !== '') {
    lines.push(`Error:\n${action.detail}`)
  } else if (action.message !== 'not-installable') {
    lines.push('Error: no pnpm diagnostics captured; re-run the command in a terminal to see the full output.')
  }
  return lines.join('\n')
}

/** Props of the shared settled-action banner. */
export interface ActionBannerProps {
  /** The settled operation to show. */
  action: MarketInstallAction
  /** Re-boot the application tree so profile changes take effect. */
  onRestart: () => void
  /** Dismiss the settled action banner. */
  onDismissAction: () => void
  /** Approve the action's ignored build scripts and retry the install. */
  onApproveBuilds: () => void
  t: PropsLocale<'pluginMarket'>['t']
  /** CSS module class names of the host surface (card or dialog). */
  css: Record<string, string>
}

/** Render the settled install/uninstall banner: the outcome line, the
 * restart action on success, a copy action for the specific failure text and
 * an approve-build-scripts retry on error, and the dismiss action.
 * @param props - the settled action and the host-surface callbacks and styles.
 * @returns the banner element.
 */
export function ActionBanner({
  action, onRestart, onDismissAction, onApproveBuilds, t, css,
}: ActionBannerProps): ReactNode {
  const banner = actionBanner(action, t)
  const errorCopy = useMarketCopyFeedback(errorCopyText(action))
  return (
    <div className={css.actionBanner} data-tone={banner.tone} role="status">
      <span className={css.actionText}>{banner.text}</span>
      {action.status === 'ok' ? (
        <button type="button" className={css.action} onClick={onRestart}>
          {t('restart')}
        </button>
      ) : (
        <button
          type="button"
          className={css.action}
          onClick={errorCopy.onCopy}
          aria-label={t('copyError')}
        >
          <IconCopyOutline16 size={14} />
          {errorCopy.copied ? t('copied') : t('copyError')}
        </button>
      )}
      {action.status === 'error' && action.ignoredBuilds !== undefined ? (
        <button type="button" className={css.action} onClick={onApproveBuilds}>
          {t('approveBuilds')}
        </button>
      ) : null}
      <button type="button" className={css.action} onClick={onDismissAction}>
        {t('dismiss')}
      </button>
      {banner.detail === undefined || banner.detail === '' ? null : (
        <code className={css.errorDetail}>{banner.detail}</code>
      )}
    </div>
  )
}
