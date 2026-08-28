/** Durable plugin-market synchronization preferences. */
import z from '@deepseek-ai/schemastery';
/** Provider ids with complete initialization and incremental implementations. */
export declare const MARKET_PROVIDER_IDS: readonly ["dshfind", "github"];
/** Settings namespace owned by the plugin marketplace. */
export declare const MARKET_SETTINGS_NAMESPACE = "ui-plugin-market";
/** Default catalog provider. */
export declare const DEFAULT_MARKET_PROVIDER: MarketProviderId;
/** Catalog provider selectable by the current product. */
export type MarketProviderId = typeof MARKET_PROVIDER_IDS[number];
/** Durable synchronization preferences. */
export interface MarketSettings {
    /** Selected catalog provider. */
    provider: MarketProviderId;
    /** Whether a new application runtime silently checks for provider updates. */
    syncOnStartup: boolean;
}
/** Host schema and browser wire validation for marketplace preferences. */
export declare const MarketSettingsSchema: z<MarketSettings>;
