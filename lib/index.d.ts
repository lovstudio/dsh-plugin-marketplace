/** Host loader entry for plugin-market settings, profile actions, and its browser implementation. */
import type { Context } from '@deepseek-ai/cordis';
export { DEFAULT_MARKET_PROVIDER, MARKET_PROVIDER_IDS, MARKET_SETTINGS_NAMESPACE, type MarketProviderId, type MarketSettings, } from './market-settings.ts';
/** Services required by the Marketplace-owned profile action routes. */
export declare const inject: string[];
/** Browser route issuing a same-origin action token. */
export declare const ACTION_TOKEN_PATH = "/plugin-marketplace/action-token";
/** Browser route delegating one package change to the official `dsh plugin` CLI. */
export declare const ACTION_PATH = "/plugin-marketplace/action";
/** Browser route reporting how a candidate package fits the running harness. */
export declare const COMPATIBILITY_PATH = "/plugin-marketplace/compatibility";
/** Register Marketplace settings and its authenticated package-action routes. */
export declare function apply(ctx: Context): void;
