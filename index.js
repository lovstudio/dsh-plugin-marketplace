import { settingsNamespace } from "@deepseek-ai/dsh-settings";
import z from "@deepseek-ai/schemastery";
//#region lib/types/market-settings.js
/** Durable plugin-market synchronization preferences. */
/** Provider ids with complete initialization and incremental implementations. */
const MARKET_PROVIDER_IDS = ["dshfind", "github"];
/** Settings namespace owned by the plugin marketplace. */
const MARKET_SETTINGS_NAMESPACE = "ui-plugin-market";
/** Default catalog provider. */
const DEFAULT_MARKET_PROVIDER = "github";
/** Host schema and browser wire validation for marketplace preferences. */
const MarketSettingsSchema = z.object({
	provider: z.union([...MARKET_PROVIDER_IDS]).default(DEFAULT_MARKET_PROVIDER),
	syncOnStartup: z.boolean().default(true)
});
//#endregion
//#region lib/types/index.js
/** Host loader entry for plugin-market settings and its browser implementation. */
/** Register the marketplace preference section when settings are composed. */
function apply(ctx) {
	ctx.inject(["settings"], (settingsCtx) => {
		settingsCtx.settings.register(settingsNamespace(MARKET_SETTINGS_NAMESPACE), MarketSettingsSchema);
	});
}
//#endregion
export { DEFAULT_MARKET_PROVIDER, MARKET_PROVIDER_IDS, MARKET_SETTINGS_NAMESPACE, apply };
