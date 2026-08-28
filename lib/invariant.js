//#region lib/types/invariant.js
/** Package-owned invariant companion. @module @lovstudio/dsh-plugin-marketplace/invariant */
const PACKAGE_NAME = "@lovstudio/dsh-plugin-marketplace";
/** Cordis companion plugin name. */
const name = "plugin-marketplace-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/** No runtime invariant: browser-local catalog state has no Host-owned runtime relationship. */
const install = () => {};
/** Register this package's invariant companion. */
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
