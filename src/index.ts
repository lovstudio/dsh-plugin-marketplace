/** Host loader entry for plugin-market settings and its browser implementation. */

import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { MARKET_SETTINGS_NAMESPACE, MarketSettingsSchema } from './market-settings.ts'

export {
  DEFAULT_MARKET_PROVIDER, MARKET_PROVIDER_IDS, MARKET_SETTINGS_NAMESPACE,
  type MarketProviderId, type MarketSettings,
} from './market-settings.ts'

/** Register the marketplace preference section when settings are composed. */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(settingsNamespace(MARKET_SETTINGS_NAMESPACE), MarketSettingsSchema)
  })
}
