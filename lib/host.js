import { credentialRef } from "@deepseek-ai/dsh-credentials";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
//#region lib/types/npm-identity.js
/** The `owner/repository` a manifest's repository field points at. */
function publishedRepository(published) {
	const field = published.repository;
	const url = typeof field === "string" ? field : field?.url;
	if (typeof url !== "string") return null;
	const match = /github\.com[/:]([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+?)(?:\.git)?(?:[#/?].*)?$/.exec(url);
	return match === null ? null : `${match[1]}/${match[2]}`;
}
/** Whether the published package names this repository as its source. */
function publishedFromRepository(published, fullName) {
	const declared = publishedRepository(published);
	return declared !== null && declared.toLocaleLowerCase() === fullName.toLocaleLowerCase();
}
/** Whether a manifest mounts itself as a DSH bundle. */
function declaresBundle(published) {
	const patch = published.dsh?.bundle?.patch;
	return typeof patch === "string" && patch.length > 0;
}
//#endregion
//#region lib/types/host/index.js
/** Authenticated Host-side GitHub Topic search for the plugin marketplace. */
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
/** Credential reference managed by the marketplace settings card. */
const GITHUB_MARKET_TOKEN_REF = credentialRef("GITHUB_TOKEN");
/** Pages of starred repositories one inventory read is willing to spend. */
const STARRED_PAGE_LIMIT = 20;
/** Repositories per starred-inventory page (GitHub's maximum). */
const STARRED_PAGE_SIZE = 100;
/** Whether a classic token's scopes cover starring a public repository. */
function grantsStarring(scopes) {
	return scopes.length === 0 || scopes.includes("repo") || scopes.includes("public_repo");
}
/** Split the `x-oauth-scopes` header a classic token answers with. */
function scopesOf(header) {
	if (header === null) return [];
	return header.split(",").map((scope) => scope.trim()).filter((scope) => scope.length > 0);
}
/** Accept only `owner/repository`, the shape every starring route is built from. */
function repositoryPath(fullName) {
	if (!/^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(fullName)) throw new Error(`GitHub repository name is invalid: ${fullName}`);
	return fullName;
}
/** Validate one GitHub search row at the external JSON boundary. */
function repositoryOf(raw) {
	const row = raw;
	if (row === null || typeof row !== "object" || typeof row.id !== "number" || !Number.isSafeInteger(row.id) || typeof row.full_name !== "string" || row.full_name.length === 0 || typeof row.name !== "string" || row.name.length === 0 || row.owner === void 0 || typeof row.owner.login !== "string" || row.owner.login.length === 0 || typeof row.html_url !== "string" || row.html_url.length === 0 || typeof row.stargazers_count !== "number" || !Number.isFinite(row.stargazers_count) || typeof row.pushed_at !== "string" || Number.isNaN(Date.parse(row.pushed_at)) || typeof row.archived !== "boolean") throw new Error("GitHub repository search returned an invalid repository row");
	const result = {
		id: row.id,
		fullName: row.full_name,
		name: row.name,
		owner: row.owner.login,
		repositoryUrl: row.html_url,
		description: typeof row.description === "string" ? row.description : "",
		topics: Array.isArray(row.topics) ? row.topics.filter((topic) => typeof topic === "string") : [],
		stars: row.stargazers_count,
		pushedAt: row.pushed_at,
		archived: row.archived
	};
	if (typeof row.language === "string") return {
		...result,
		language: row.language
	};
	return result;
}
/** Remote gateway that keeps the GitHub credential out of the browser. */
let PluginMarketGitHubGateway = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _probeCredential_decorators;
	let _resolvePackage_decorators;
	let _listStarred_decorators;
	let _setStar_decorators;
	let _search_decorators;
	return class PluginMarketGitHubGateway extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_probeCredential_decorators = [Remote("probeCredential")];
			_resolvePackage_decorators = [Remote("resolvePackage")];
			_listStarred_decorators = [Remote("listStarred")];
			_setStar_decorators = [Remote("setStar")];
			_search_decorators = [Remote("search")];
			__esDecorate(this, null, _probeCredential_decorators, {
				kind: "method",
				name: "probeCredential",
				static: false,
				private: false,
				access: {
					has: (obj) => "probeCredential" in obj,
					get: (obj) => obj.probeCredential
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _resolvePackage_decorators, {
				kind: "method",
				name: "resolvePackage",
				static: false,
				private: false,
				access: {
					has: (obj) => "resolvePackage" in obj,
					get: (obj) => obj.resolvePackage
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _listStarred_decorators, {
				kind: "method",
				name: "listStarred",
				static: false,
				private: false,
				access: {
					has: (obj) => "listStarred" in obj,
					get: (obj) => obj.listStarred
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setStar_decorators, {
				kind: "method",
				name: "setStar",
				static: false,
				private: false,
				access: {
					has: (obj) => "setStar" in obj,
					get: (obj) => obj.setStar
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _search_decorators, {
				kind: "method",
				name: "search",
				static: false,
				private: false,
				access: {
					has: (obj) => "search" in obj,
					get: (obj) => obj.search
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static inject = ["credentials"];
		constructor(ctx) {
			super(ctx, "pluginMarketGithub");
			__runInitializers(this, _instanceExtraInitializers);
		}
		/** Resolve a one-shot draft token or the credential store's current value. */
		async token(draft) {
			if (draft !== void 0) {
				const token = draft.trim();
				if (token.length === 0) throw new Error("GitHub token is blank");
				return token;
			}
			const credential = await this.ctx.credentials.resolve(GITHUB_MARKET_TOKEN_REF);
			if (credential === void 0) throw new Error("GitHub plugin marketplace requires GITHUB_TOKEN");
			return credential.value;
		}
		/**
		* Test an unsaved or stored token against GitHub's authenticated-user endpoint.
		* @param request - Optional unsaved token; omission selects the stored reference.
		* @returns The authenticated login and remaining repository-search quota.
		*/
		async probeCredential(request) {
			const token = await this.token(request.token);
			const response = await fetch("https://api.github.com/user", { headers: {
				accept: "application/vnd.github+json",
				authorization: `Bearer ${token}`,
				"x-github-api-version": "2022-11-28"
			} });
			if (!response.ok) throw new Error(`GitHub credential test failed: HTTP ${String(response.status)}`);
			const remaining = Number(response.headers.get("x-ratelimit-remaining"));
			if (!Number.isSafeInteger(remaining) || remaining < 0) throw new Error("GitHub credential test omitted a valid rate-limit header");
			const raw = await response.json();
			if (typeof raw.login !== "string" || raw.login.length === 0) throw new Error("GitHub credential test returned an invalid authenticated user");
			const scopes = scopesOf(response.headers.get("x-oauth-scopes"));
			return {
				login: raw.login,
				rateLimitRemaining: remaining,
				scopes,
				canStar: grantsStarring(scopes)
			};
		}
		/** Authorization header set shared by every authenticated GitHub request. */
		async headers() {
			return {
				accept: "application/vnd.github+json",
				authorization: `Bearer ${await this.token()}`,
				"x-github-api-version": "2022-11-28"
			};
		}
		/**
		* Resolve the npm identity a repository declares, so an install can name the
		* published package instead of the repository. A git-hosted spec makes pnpm
		* run the package's `prepare` build, which it refuses until the exact build
		* key is allowlisted; the published package needs no build at all.
		* @param request - the repository to resolve.
		* @returns the manifest name and version, and whether npm serves that name.
		*/
		async resolvePackage(request) {
			const path = repositoryPath(request.fullName);
			const response = await fetch(`https://api.github.com/repos/${path}/contents/package.json`, { headers: {
				...await this.headers(),
				accept: "application/vnd.github.raw+json"
			} });
			if (response.status === 404) return { npmPublished: false };
			if (!response.ok) throw new Error(`GitHub manifest read failed: HTTP ${String(response.status)}`);
			let manifest;
			try {
				manifest = JSON.parse(await response.text());
			} catch {
				return { npmPublished: false };
			}
			if (typeof manifest.name !== "string" || manifest.name.length === 0) return { npmPublished: false };
			const version = typeof manifest.version === "string" ? manifest.version : void 0;
			const registry = await fetch(`https://registry.npmjs.org/${manifest.name.split("/").map(encodeURIComponent).join("/")}/latest`, { headers: { accept: "application/json" } });
			let published = null;
			if (registry.ok) try {
				published = JSON.parse(await registry.text());
			} catch {
				published = null;
			}
			return {
				pkgName: manifest.name,
				...version === void 0 ? {} : { pkgVersion: version },
				npmPublished: published !== null && publishedFromRepository(published, path) && declaresBundle(published)
			};
		}
		/**
		* Read the repositories the authenticated user has starred.
		* @returns every starred `owner/repository` read, and whether pages remained.
		*/
		async listStarred() {
			const headers = await this.headers();
			const fullNames = [];
			for (let page = 1; page <= STARRED_PAGE_LIMIT; page += 1) {
				const params = new URLSearchParams({
					per_page: String(STARRED_PAGE_SIZE),
					page: String(page)
				});
				const response = await fetch(`https://api.github.com/user/starred?${params.toString()}`, { headers });
				if (!response.ok) throw new Error(`GitHub starred read failed: HTTP ${String(response.status)}`);
				const raw = await response.json();
				if (!Array.isArray(raw)) throw new Error("GitHub starred read returned an invalid response");
				for (const row of raw) {
					const name = row?.full_name;
					if (typeof name === "string" && name.length > 0) fullNames.push(name);
				}
				if (raw.length < STARRED_PAGE_SIZE) return {
					fullNames,
					truncated: false
				};
			}
			return {
				fullNames,
				truncated: true
			};
		}
		/**
		* Star or unstar one repository as the authenticated user.
		* @param request - the repository and the target state.
		* @returns the state GitHub accepted.
		*/
		async setStar(request) {
			const path = repositoryPath(request.fullName);
			const response = await fetch(`https://api.github.com/user/starred/${path}`, {
				method: request.starred ? "PUT" : "DELETE",
				headers: {
					...await this.headers(),
					"content-length": "0"
				}
			});
			if (response.status === 403 || response.status === 404) throw new Error("GitHub refused the star: the token needs the `public_repo` scope (classic) or the `Starring` user permission with write access (fine-grained)");
			if (!response.ok) throw new Error(`GitHub star update failed: HTTP ${String(response.status)}`);
			return {
				fullName: path,
				starred: request.starred
			};
		}
		/**
		* Search one pushed-at interval. The caller serializes requests and bisects
		* intervals whose total exceeds GitHub's 1,000-result query cap.
		* @param request - inclusive UTC-second interval and page.
		* @returns validated public repository page.
		*/
		async search(request) {
			const token = await this.token();
			const params = new URLSearchParams({
				q: `topic:dsh-plugin pushed:${request.pushedFrom}..${request.pushedTo}`,
				sort: "updated",
				order: "desc",
				page: String(request.page),
				per_page: String(request.perPage)
			});
			const response = await fetch(`https://api.github.com/search/repositories?${params.toString()}`, { headers: {
				accept: "application/vnd.github+json",
				authorization: `Bearer ${token}`,
				"x-github-api-version": "2022-11-28"
			} });
			if (!response.ok) {
				const retryAfter = response.headers.get("retry-after");
				const reset = response.headers.get("x-ratelimit-reset");
				const suffix = retryAfter !== null ? `; retry after ${retryAfter}s` : reset !== null ? `; rate limit resets at ${reset}` : "";
				throw new Error(`GitHub repository search failed: HTTP ${String(response.status)}${suffix}`);
			}
			const remaining = Number(response.headers.get("x-ratelimit-remaining"));
			const resetSeconds = Number(response.headers.get("x-ratelimit-reset"));
			if (!Number.isSafeInteger(remaining) || remaining < 0 || !Number.isSafeInteger(resetSeconds) || resetSeconds < 0) throw new Error("GitHub repository search omitted valid rate-limit headers");
			const envelope = await response.json();
			if (envelope === null || typeof envelope !== "object" || typeof envelope.total_count !== "number" || !Number.isSafeInteger(envelope.total_count) || typeof envelope.incomplete_results !== "boolean" || !Array.isArray(envelope.items)) throw new Error("GitHub repository search returned an invalid response");
			return {
				total: envelope.total_count,
				incomplete: envelope.incomplete_results,
				items: envelope.items.map(repositoryOf),
				rateLimitRemaining: remaining,
				rateLimitResetAt: resetSeconds * 1e3
			};
		}
	};
})();
//#endregion
export { GITHUB_MARKET_TOKEN_REF, PluginMarketGitHubGateway, PluginMarketGitHubGateway as default };
