import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFileSync, realpathSync } from "node:fs";
import satisfies from "semver/functions/satisfies.js";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { JSON_SCHEMA, load } from "js-yaml";
import z from "@deepseek-ai/schemastery";
//#region lib/types/hot-mount.js
/**
* Mount a freshly installed plugin without rebooting the launcher.
*
* `dsh plugin add` only registers the package in the profile manifest's
* `dsh.profile.bundles`, and that layer is read once at boot, so the plugin
* normally waits for a restart. The Loader can create the same entries at
* runtime instead. They are created in the Loader root — a sibling of the boot
* include, not a member of it — because the include re-applies every bundle
* patch on each reload, and an entry living inside it would be inserted a
* second time and abort the tree with a duplicate id. `Loader.write` is a
* no-op, so nothing reaches disk and the next boot mounts the package from its
* bundle layer exactly as if it had never run.
*/
/** Directory of one profile, resolved the way the launcher resolves its home. */
function resolveProfileDir(profile) {
	const configured = process.env.DSH_HOME;
	const home = configured !== void 0 && configured.trim().length > 0 ? configured : join(homedir(), ".dsh");
	const expanded = home === "~" ? homedir() : home.startsWith("~/") ? join(homedir(), home.slice(2)) : home;
	return join(resolve(expanded), "profiles", profile);
}
/** Bundle names the profile manifest declares, in application order. */
function readBundles(profileDir) {
	try {
		const bundles = JSON.parse(readFileSync(join(profileDir, "package.json"), "utf8")).dsh?.profile?.bundles;
		return Array.isArray(bundles) ? bundles.filter((name) => typeof name === "string") : [];
	} catch {
		return [];
	}
}
/** Bundle names the profile manifest gained or lost across one CLI run. */
function bundleDelta(before, after) {
	const had = new Set(before);
	const has = new Set(after);
	return {
		added: after.filter((name) => !had.has(name)),
		removed: before.filter((name) => !has.has(name))
	};
}
/** Read and parse one package's declared bundle patch, or null. */
function bundlePatch(profileDir, pkg) {
	const packageDir = join(profileDir, "node_modules", ...pkg.split("/"));
	try {
		const declared = JSON.parse(readFileSync(join(packageDir, "package.json"), "utf8")).dsh?.bundle?.patch;
		if (typeof declared !== "string" || declared.length === 0) return null;
		const parsed = load(readFileSync(join(packageDir, declared), "utf8"), { schema: JSON_SCHEMA });
		return Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
/**
* The root entries one installed package contributes, or null when its bundle
* patch does something runtime creation cannot reproduce: inserting into a
* group, overriding an entry another layer owns, or declaring a group of its
* own. Those still need a restart, so reporting null keeps the caller honest.
*/
function bundleEntries(profileDir, pkg) {
	const patch = bundlePatch(profileDir, pkg);
	if (patch === null) return null;
	const entries = [];
	for (const row of patch) {
		if (row === null || typeof row !== "object") return null;
		const { id, insert, ...rest } = row;
		if (id !== void 0 || !Array.isArray(insert) || Object.keys(rest).length > 0) return null;
		for (const item of insert) {
			if (item === null || typeof item !== "object") return null;
			const entry = item;
			if (typeof entry.name !== "string" || entry.name.length === 0 || entry.group === true) return null;
			entries.push(entry.config === void 0 ? { name: entry.name } : {
				name: entry.name,
				config: entry.config
			});
		}
	}
	return entries.length === 0 ? null : entries;
}
/** Loader entry ids this process created for each hot-mounted package. */
const mounted = /* @__PURE__ */ new Map();
/**
* Create the entries of one installed package so it runs immediately.
* @returns true when the whole package is now mounted.
*/
async function hotMount(loader, profileDir, pkg, warn = () => {}) {
	await hotUnmount(loader, pkg);
	const entries = bundleEntries(profileDir, pkg);
	if (entries === null) {
		warn(`${pkg}: its bundle patch cannot be reproduced at runtime`);
		return false;
	}
	const ids = [];
	try {
		for (const entry of entries) ids.push(await loader.create(entry));
	} catch (error) {
		for (const id of ids.reverse()) await loader.remove(id).catch(() => {});
		warn(`${pkg}: ${error instanceof Error ? error.message : String(error)}`);
		return false;
	}
	mounted.set(pkg, ids);
	return true;
}
/**
* Drop the entries this process created for one package.
* @returns true when something was actually running and is now gone.
*/
async function hotUnmount(loader, pkg) {
	const ids = mounted.get(pkg);
	if (ids === void 0) return false;
	mounted.delete(pkg);
	for (const id of [...ids].reverse()) await loader.remove(id).catch(() => {});
	return true;
}
//#endregion
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
/** Host loader entry for plugin-market settings, profile actions, and its browser implementation. */
/** Services required by the Marketplace-owned profile action routes. */
const inject = ["webServer"];
/** Browser route issuing a same-origin action token. */
const ACTION_TOKEN_PATH = "/plugin-marketplace/action-token";
/** Browser route delegating one package change to the official `dsh plugin` CLI. */
const ACTION_PATH = "/plugin-marketplace/action";
/** Browser route reporting how a candidate package fits the running harness. */
const COMPATIBILITY_PATH = "/plugin-marketplace/compatibility";
/**
* The scope of the compatibility check. The harness ships these packages inside
* its own installation instead of the profile, so pnpm reports them as merely
* `missing peer` and cannot tell a satisfied range from a violated one.
*/
const HARNESS_SCOPE = "@deepseek-ai/";
/** Keep only the diagnostic tail returned to the browser. */
function appendTail(current, chunk) {
	return (current + chunk.toString("utf8")).slice(-16384);
}
/** Resolve the profile selected by the current launcher invocation. */
function activeProfile() {
	const args = process.argv.slice(2);
	if (args[0] === "web") return "web";
	const index = args.indexOf("--profile");
	return index >= 0 && args[index + 1] !== void 0 ? args[index + 1] : "web";
}
/** Accept one shell-free package spec supported by pnpm. */
function packageSpec(value) {
	if (typeof value !== "string" || value.length === 0 || value.length > 512) return null;
	return /^[A-Za-z0-9@._~^+:/#=-]+$/.test(value) ? value : null;
}
/**
* Resolve modules the way the running launcher does. The harness keeps its own
* packages next to the launcher rather than in the profile, so the profile's
* `node_modules` cannot answer what version is actually loaded.
*/
let harnessRequire;
/** Version of one harness package as this launcher would load it, or null. */
function harnessVersion(name) {
	if (harnessRequire === void 0) {
		const launcher = process.argv[1];
		harnessRequire = launcher === void 0 ? null : createRequire(realpathSync(launcher));
	}
	if (harnessRequire === null) return null;
	try {
		const manifest = harnessRequire(`${name}/package.json`);
		return typeof manifest.version === "string" ? manifest.version : null;
	} catch {
		return null;
	}
}
/** Keep only the string-valued peer ranges of a fetched manifest. */
function peerRanges(manifest) {
	const peers = manifest?.peerDependencies;
	if (peers === null || typeof peers !== "object") return {};
	const ranges = {};
	for (const [name, range] of Object.entries(peers)) if (typeof range === "string" && range.length > 0) ranges[name] = range;
	return ranges;
}
/** Read the peer ranges a `github:owner/repo#ref` spec would install. */
async function githubPeerRanges(spec) {
	const [path, ref] = spec.slice(7).split("#");
	const parts = (path ?? "").split("/");
	if (parts.length !== 2 || parts.some((part) => part === "")) return null;
	const url = `https://raw.githubusercontent.com/${parts[0]}/${parts[1]}/${ref ?? "HEAD"}/package.json`;
	const response = await fetch(url, { headers: { accept: "application/json" } });
	if (!response.ok) return null;
	return peerRanges(JSON.parse(await response.text()));
}
/** Read the peer ranges a published `name` or `name@version` spec would install. */
async function registryPeerRanges(spec) {
	const at = spec.lastIndexOf("@");
	const name = at > 0 ? spec.slice(0, at) : spec;
	const wanted = at > 0 ? spec.slice(at + 1) : void 0;
	const url = `https://registry.npmjs.org/${name.split("/").map(encodeURIComponent).join("/")}`;
	const response = await fetch(url, { headers: { accept: "application/vnd.npm.install-v1+json" } });
	if (!response.ok) return null;
	const packument = JSON.parse(await response.text());
	const versions = packument.versions ?? {};
	const latest = packument["dist-tags"]?.latest;
	const picked = wanted !== void 0 && wanted in versions ? wanted : latest;
	return picked === void 0 ? null : peerRanges(versions[picked]);
}
/**
* Compare the harness ranges a candidate declares against what this
* installation ships. Only declared-and-present pairs are judged: a package the
* harness does not ship at all is an optional integration, not a conflict.
*/
async function checkCompatibility(spec) {
	let ranges;
	try {
		ranges = spec.startsWith("github:") ? await githubPeerRanges(spec) : await registryPeerRanges(spec);
	} catch {
		ranges = null;
	}
	if (ranges === null) return {
		mismatches: [],
		checked: false
	};
	const mismatches = [];
	for (const [name, expected] of Object.entries(ranges)) {
		if (!name.startsWith(HARNESS_SCOPE)) continue;
		const actual = harnessVersion(name);
		if (actual === null) continue;
		if (!satisfies(actual, expected, { includePrerelease: true })) mismatches.push({
			name,
			expected,
			actual
		});
	}
	return {
		mismatches,
		checked: true
	};
}
/** Read one small JSON request body. */
async function readRequest(req) {
	let body = "";
	for await (const chunk of req) {
		body += String(chunk);
		if (body.length > 4096) throw new Error("request body is too large");
	}
	const parsed = JSON.parse(body);
	return parsed !== null && typeof parsed === "object" ? parsed : {};
}
/** Write a no-store JSON response. */
function writeJson(res, status, body) {
	res.writeHead(status, {
		"Content-Type": "application/json",
		"Cache-Control": "no-store"
	});
	res.end(JSON.stringify(body));
}
/** Run the current official DSH launcher in plugin-management mode. */
function runPluginAction(action, spec, setChild) {
	const verb = action === "install" ? "add" : "remove";
	const profile = activeProfile();
	const command = `dsh plugin --profile ${profile} ${verb} -w ${spec}`;
	const launcher = process.argv[1];
	if (launcher === void 0) return Promise.resolve({
		ok: false,
		exitCode: -1,
		command,
		error: "current dsh launcher path is unavailable"
	});
	return new Promise((resolve) => {
		const child = spawn(process.execPath, [
			...process.execArgv,
			launcher,
			"plugin",
			"--profile",
			profile,
			verb,
			"-w",
			spec
		], {
			cwd: process.cwd(),
			env: {
				...process.env,
				CI: "true"
			},
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			]
		});
		setChild(child);
		let output = "";
		child.stdout?.on("data", (chunk) => {
			output = appendTail(output, chunk);
		});
		child.stderr?.on("data", (chunk) => {
			output = appendTail(output, chunk);
		});
		child.once("error", (error) => {
			setChild(null);
			resolve({
				ok: false,
				exitCode: -1,
				command,
				error: error.message
			});
		});
		child.once("close", (code) => {
			setChild(null);
			const exitCode = code ?? -1;
			resolve({
				ok: exitCode === 0,
				exitCode,
				command,
				...exitCode === 0 || output.trim() === "" ? {} : { error: output.trim() }
			});
		});
	});
}
/**
* Reflect one settled package change in the running Loader tree.
* @returns true when every changed package took effect without a reboot.
*/
async function applyHotMount(ctx, before) {
	const loader = ctx.get("loader");
	const dir = resolveProfileDir(activeProfile());
	const { added, removed } = bundleDelta(before, readBundles(dir));
	if (loader === void 0 || added.length + removed.length === 0) return false;
	const logger = ctx.root.logger?.("plugin-market");
	const warn = (reason) => {
		logger?.warn(`hot mount skipped — ${reason}`);
	};
	const results = [];
	for (const pkg of removed) results.push(await hotUnmount(loader, pkg));
	for (const pkg of added) results.push(await hotMount(loader, dir, pkg, warn));
	return results.every(Boolean);
}
/** Register Marketplace settings and its authenticated package-action routes. */
function apply(ctx) {
	ctx.inject(["settings"], (settingsCtx) => {
		settingsCtx.get("settings").register(MARKET_SETTINGS_NAMESPACE, MarketSettingsSchema);
	});
	const webServer = ctx.get("webServer");
	const token = randomBytes(32).toString("base64url");
	let child = null;
	let running = false;
	ctx.effect(() => {
		const removeToken = webServer.register({
			kind: "exact",
			path: ACTION_TOKEN_PATH,
			handler: async (req, res) => {
				if (req.method !== "GET") {
					writeJson(res, 405, { error: "method not allowed" });
					return;
				}
				const restart = ctx.get("appRestart") === void 0 ? "manual" : "service";
				writeJson(res, 200, {
					token,
					restart
				});
			}
		});
		const removeAction = webServer.register({
			kind: "exact",
			path: ACTION_PATH,
			handler: async (req, res) => {
				if (req.method !== "POST" || req.headers["content-type"]?.split(";")[0] !== "application/json") {
					writeJson(res, 405, { error: "JSON POST required" });
					return;
				}
				let request;
				try {
					request = await readRequest(req);
				} catch (error) {
					writeJson(res, 400, { error: error instanceof Error ? error.message : String(error) });
					return;
				}
				const spec = packageSpec(request.spec);
				if (request.token !== token || request.action !== "install" && request.action !== "uninstall" || spec === null) {
					writeJson(res, 400, { error: "invalid plugin action" });
					return;
				}
				if (running) {
					writeJson(res, 409, { error: "another plugin action is already running" });
					return;
				}
				running = true;
				try {
					const before = readBundles(resolveProfileDir(activeProfile()));
					const result = await runPluginAction(request.action, spec, (next) => {
						child = next;
					});
					if (result.ok) result.hotMounted = await applyHotMount(ctx, before);
					writeJson(res, 200, result);
				} finally {
					running = false;
				}
			}
		});
		const removeCompatibility = webServer.register({
			kind: "exact",
			path: COMPATIBILITY_PATH,
			handler: async (req, res) => {
				if (req.method !== "POST" || req.headers["content-type"]?.split(";")[0] !== "application/json") {
					writeJson(res, 405, { error: "JSON POST required" });
					return;
				}
				let request;
				try {
					request = await readRequest(req);
				} catch (error) {
					writeJson(res, 400, { error: error instanceof Error ? error.message : String(error) });
					return;
				}
				const spec = packageSpec(request.spec);
				if (request.token !== token || spec === null) {
					writeJson(res, 400, { error: "invalid compatibility request" });
					return;
				}
				writeJson(res, 200, await checkCompatibility(spec));
			}
		});
		return () => {
			removeToken();
			removeAction();
			removeCompatibility();
			child?.kill("SIGTERM");
			child = null;
		};
	}, "plugin-marketplace: official CLI package actions");
}
//#endregion
export { ACTION_PATH, ACTION_TOKEN_PATH, COMPATIBILITY_PATH, DEFAULT_MARKET_PROVIDER, MARKET_PROVIDER_IDS, MARKET_SETTINGS_NAMESPACE, apply, inject };
