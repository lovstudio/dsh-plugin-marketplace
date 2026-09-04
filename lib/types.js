//#region lib/types/client/types.js
/**
* Wire vocabulary of the dshfind plugin catalog API (https://api.dshfind.com,
* OpenAPI contract at https://dshfind.lovstudio.ai/openapi.json). The client
* reads the REST list/detail/suggest endpoints directly; the types below are
* the browser-side projection of the documented responses, narrowed to the
* fields the marketplace renders or ranks on.
*/
/** The empty filter selection. */
const EMPTY_MARKET_FILTERS = {
	category: "",
	owner: "",
	language: "",
	grade: "",
	featured: false,
	official: false,
	installable: false
};
//#endregion
export { EMPTY_MARKET_FILTERS };
