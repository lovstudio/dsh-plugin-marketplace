/** Marketplace card contributed to the configurable-plugins settings tab. */

import { useState } from 'react'
import clsx from 'clsx'
import { IconChevronDownOutline14 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type { MarketProviderId } from '../market-settings.ts'
import type { MarketSettingsCardInjected } from './market-settings-card-controller.ts'
import type { PluginMarketKey } from './locales.ts'
import css from './MarketSettingsCard.module.css'

/** Full props of the marketplace plugin-configuration card. */
export type MarketSettingsCardProps =
  PropsRuntime<'settings.plugin.item'>
  & PropsLocale<'pluginMarket'>
  & InjectFace<MarketSettingsCardInjected>

/** Provider choices backed by complete provider implementations. */
const PROVIDERS: readonly { id: MarketProviderId; key: PluginMarketKey }[] = [
  { id: 'dshfind', key: 'settingsProviderDshfind' },
  { id: 'github', key: 'settingsProviderGithub' },
]
const GITHUB_TOKEN_HELP_URL = 'https://github.com/settings/personal-access-tokens/new'

/** Render the marketplace's provider and startup-sync preferences as a plugin card. */
export function MarketSettingsCard(props: MarketSettingsCardProps) {
  const [open, setOpen] = useState(false)
  const state = props.useMarketSettingsCard(snapshot => snapshot)
  if (!state.available) return null
  const title = props.t('settingsTitle')
  const disabled = !state.writable || state.saving
  const githubTokenMissing = state.provider.value === 'github'
    && !state.githubToken.configured
    && state.githubToken.value.trim().length === 0
  const saveDisabled = !state.dirty || state.saving || githubTokenMissing
  return (
    <li className={clsx(css.card, open && css.cardOpen)}>
      <button
        type="button"
        className={css.header}
        aria-expanded={open}
        aria-label={`${props.t(open ? 'settingsCollapse' : 'settingsExpand')}: ${title}`}
        onClick={() => { setOpen(!open) }}
      >
        <span className={css.headText}>
          <span className={css.name}>{title}</span>
          <span className={css.description}>{props.t('settingsCardDescription')}</span>
        </span>
        {state.dirty ? <span className={css.pending}>{props.t('settingsUnsaved')}</span> : null}
        <IconChevronDownOutline14 className={clsx(css.chevron, open && css.chevronOpen)} />
      </button>
      {open ? (
        <div className={css.body}>
          {!state.writable ? <p className={css.readOnly} role="status">{props.t('settingsReadOnly')}</p> : null}
          <div className={css.field}>
            <div className={css.fieldHead}>
              <label className={css.label} htmlFor="plugin-market-provider">{props.t('settingsProvider')}</label>
              {state.provider.overridden ? (
                <span className={css.badges}>
                  <span className={css.badge}>{props.t('settingsOverridden')}</span>
                  <button
                    type="button"
                    className={css.reset}
                    disabled={disabled}
                    onClick={() => { props.resetField('provider') }}
                  >
                    {props.t('settingsReset')}
                  </button>
                </span>
              ) : null}
            </div>
            <select
              id="plugin-market-provider"
              className={css.select}
              value={state.provider.value}
              disabled={disabled}
              onChange={(event) => { props.selectProvider(event.target.value as MarketProviderId) }}
            >
              {PROVIDERS.map(provider => (
                <option key={provider.id} value={provider.id}>{props.t(provider.key)}</option>
              ))}
            </select>
            <p className={css.hint}>{props.t('settingsProviderDescription')}</p>
          </div>
          {state.provider.value === 'github' ? (
            <div className={css.field}>
              <div className={css.fieldHead}>
                <label className={css.label} htmlFor="plugin-market-github-token">
                  {props.t('settingsGithubToken')}
                </label>
                <span className={css.badge}>
                  {props.t(state.githubToken.configured
                    ? 'settingsGithubTokenConfigured'
                    : 'settingsGithubTokenMissing')}
                  {state.githubToken.suffix === undefined ? null : ` · ••••${state.githubToken.suffix}`}
                </span>
              </div>
              <div className={css.secretRow}>
                <input
                  id="plugin-market-github-token"
                  type="password"
                  autoComplete="off"
                  className={css.input}
                  value={state.githubToken.value}
                  placeholder={state.githubToken.suffix === undefined
                    ? props.t('settingsGithubTokenPlaceholder')
                    : `••••${state.githubToken.suffix}`}
                  disabled={disabled || !state.githubToken.writable}
                  onChange={(event) => { props.setGithubToken(event.target.value) }}
                />
                <button
                  type="button"
                  className={css.test}
                  disabled={disabled || state.githubToken.testStatus === 'testing'
                    || (state.githubToken.value.trim().length === 0 && !state.githubToken.configured)}
                  onClick={props.testGithubToken}
                >
                  {props.t(state.githubToken.testStatus === 'testing'
                    ? 'settingsCredentialTesting'
                    : 'settingsCredentialTest')}
                </button>
              </div>
              {state.githubToken.testStatus === 'success' ? (
                <p className={css.testSuccess} role="status">
                  {props.t('settingsCredentialValid', { account: state.githubToken.testDetail ?? '' })}
                </p>
              ) : null}
              {state.githubToken.testStatus === 'success' && state.githubToken.canStar === false ? (
                <p className={css.hint} role="status">{props.t('settingsCredentialNoStar')}</p>
              ) : null}
              {state.githubToken.testStatus === 'error' ? (
                <p className={css.testError} role="status">
                  {props.t('settingsCredentialInvalid', { reason: state.githubToken.testDetail ?? '' })}
                </p>
              ) : null}
              <p className={css.hint}>
                {props.t('settingsGithubTokenDescription')}{' '}
                <a
                  className={css.tokenHelp}
                  href={GITHUB_TOKEN_HELP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  {props.t('settingsGithubTokenHelp')}
                </a>
              </p>
            </div>
          ) : null}
          <div className={css.field}>
            <div className={css.fieldHead}>
              <label className={css.label} htmlFor="plugin-market-startup-sync">
                {props.t('settingsStartupSync')}
              </label>
              {state.syncOnStartup.overridden ? (
                <span className={css.badges}>
                  <span className={css.badge}>{props.t('settingsOverridden')}</span>
                  <button
                    type="button"
                    className={css.reset}
                    disabled={disabled}
                    onClick={() => { props.resetField('syncOnStartup') }}
                  >
                    {props.t('settingsReset')}
                  </button>
                </span>
              ) : null}
              <button
                id="plugin-market-startup-sync"
                type="button"
                role="switch"
                aria-checked={state.syncOnStartup.value}
                className={state.syncOnStartup.value ? css.switchOn : css.switchOff}
                disabled={disabled}
                onClick={() => { props.setSyncOnStartup(!state.syncOnStartup.value) }}
              >
                <span className={css.switchThumb} />
              </button>
            </div>
            <p className={css.hint}>{props.t('settingsStartupSyncDescription')}</p>
          </div>
          <div className={css.footer}>
            {state.failed ? <p className={css.failed} role="status">{props.t('settingsSaveFailed')}</p> : null}
            <button
              type="button"
              className={css.discard}
              disabled={!state.dirty || state.saving}
              onClick={props.discard}
            >
              {props.t('settingsDiscard')}
            </button>
            <button
              type="button"
              className={css.save}
              disabled={saveDisabled}
              onClick={props.save}
            >
              {props.t(state.saving ? 'settingsSaving' : 'settingsSave')}
            </button>
          </div>
        </div>
      ) : null}
    </li>
  )
}
