/** Durable plugin-market synchronization preferences. */

import z from '@deepseek-ai/schemastery'

/** Provider ids with complete initialization and incremental implementations. */
export const MARKET_PROVIDER_IDS = ['dshfind', 'github'] as const

/** Settings namespace owned by the plugin marketplace. */
export const MARKET_SETTINGS_NAMESPACE = 'ui-plugin-market'

/** Default catalog provider. */
export const DEFAULT_MARKET_PROVIDER: MarketProviderId = 'github'

/** Catalog provider selectable by the current product. */
export type MarketProviderId = typeof MARKET_PROVIDER_IDS[number]

/** Durable synchronization preferences. */
export interface MarketSettings {
  /** Selected catalog provider. */
  provider: MarketProviderId
  /** Whether a new application runtime silently checks for provider updates. */
  syncOnStartup: boolean
}

/** Host schema and browser wire validation for marketplace preferences. */
export const MarketSettingsSchema: z<MarketSettings> = z.object({
  provider: z.union([...MARKET_PROVIDER_IDS]).default(DEFAULT_MARKET_PROVIDER),
  syncOnStartup: z.boolean().default(true),
})
