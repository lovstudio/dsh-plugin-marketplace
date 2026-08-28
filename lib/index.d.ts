/** Host loader entry for plugin-market settings and its browser implementation. */
import type { Context } from '@deepseek-ai/cordis';
export { DEFAULT_MARKET_PROVIDER, MARKET_PROVIDER_IDS, MARKET_SETTINGS_NAMESPACE, type MarketProviderId, type MarketSettings, } from './market-settings.ts';
/** Register the marketplace preference section when settings are composed. */
export declare function apply(ctx: Context): void;
