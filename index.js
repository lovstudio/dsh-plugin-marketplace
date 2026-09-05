import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFileSync, realpathSync, writeFileSync } from "node:fs";
import satisfies from "semver/functions/satisfies.js";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { JSON_SCHEMA, Type, load } from "js-yaml";
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
* second time and abort the tree with a duplicate id. The package's declared
* entry id is still kept when the tree does not already use it, because a
* bundle patch may guard against double-mounting by naming that id.
* `Loader.write` is a no-op, so nothing reaches disk and the next boot mounts
* the package from its bundle layer exactly as if it had never run.
*/
/**
* The entry-list dialect the launcher parses bundle patches with. A `!!js`
* scalar becomes the expression node the Loader evaluates itself — lazily for
* `disabled`, at apply time for config — so these values pass through this
* module untouched instead of disqualifying the package.
*/
const entryListSchema = JSON_SCHEMA.extend(new Type("tag:yaml.org,2002:js", {
	kind: "scalar",
	resolve: (data) => typeof data === "string",
	construct: (data) => ({ __jsExpr: data })
}));
/** Entry ids the running tree already uses. */
function takenIds(loader) {
	const ids = /* @__PURE__ */ new Set();
	for (const entry of loader.entries?.() ?? []) {
		const id = entry.options?.id;
		if (typeof id === "string") ids.add(id);
	}
	return ids;
}
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
/** Dependency names the profile manifest declares. */
function readDependencies(profileDir) {
	try {
		const manifest = JSON.parse(readFileSync(join(profileDir, "package.json"), "utf8"));
		return Object.keys(manifest.dependencies ?? {});
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
		const parsed = load(readFileSync(join(packageDir, declared), "utf8"), { schema: entryListSchema });
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
			const options = item;
			if (typeof options.name !== "string" || options.name.length === 0 || options.group === true) return null;
			entries.push(options);
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
	const taken = takenIds(loader);
	try {
		for (const entry of entries) {
			const { id, ...rest } = entry;
			const options = typeof id === "string" && !taken.has(id) ? entry : rest;
			if (typeof id === "string") taken.add(id);
			ids.push(await loader.create(options));
		}
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
//#region lib/types/load-check.js
/**
* Check that a freshly installed package can actually be imported.
*
* A plugin compiled against an older harness fails when ESM links it, not when
* pnpm installs it — and that failure aborts the whole plugin tree, so the next
* `dsh web` dies before serving anything. The launcher is then unreachable, and
* with it every UI that could undo the install. Importing the entry in a
* throwaway child process reproduces exactly that link step, cheaply (tens of
* milliseconds) and without touching the running tree, which lets the caller
* roll the install back while the user is still looking at the page.
*/
/** How long one import may take before it counts as unloadable. */
const IMPORT_TIMEOUT = 3e4;
/** Diagnostic tail kept from a failed import. */
const OUTPUT_LIMIT = 4096;
/** Import one module the way the launcher would, in a child process. */
function importOnce(profileDir, specifier) {
	return new Promise((resolve) => {
		const child = spawn(process.execPath, [
			"--input-type=module",
			"-e",
			`await import(${JSON.stringify(specifier)})`,
			process.argv[1] ?? ""
		], {
			cwd: profileDir,
			env: process.env,
			stdio: [
				"ignore",
				"ignore",
				"pipe"
			]
		});
		let output = "";
		child.stderr?.on("data", (chunk) => {
			output = (output + chunk.toString("utf8")).slice(0, OUTPUT_LIMIT);
		});
		const timer = setTimeout(() => {
			child.kill("SIGKILL");
		}, IMPORT_TIMEOUT);
		timer.unref?.();
		child.once("error", (error) => {
			clearTimeout(timer);
			resolve({
				specifier,
				detail: error.message
			});
		});
		child.once("close", (code, signal) => {
			clearTimeout(timer);
			if (code === 0) resolve(null);
			else if (signal === "SIGKILL") resolve({
				specifier,
				detail: `import did not settle within ${IMPORT_TIMEOUT / 1e3}s`
			});
			else resolve({
				specifier,
				detail: output.trim() === "" ? `import exited with code ${String(code)}` : output.trim()
			});
		});
	});
}
/** The first module that cannot be linked, or null when all of them can. */
async function verifyLoadable(profileDir, specifiers) {
	for (const specifier of specifiers) {
		const failure = await importOnce(profileDir, specifier);
		if (failure !== null) return failure;
	}
	return null;
}
//#endregion
//#region lib/types/load-report.js
/**
* Remember what this harness already learned about a package.
*
* A verdict is expensive to reach — an install that had to be undone, or a
* manifest fetched from the registry — and it stays true until the package or
* the harness changes. Keeping it next to the profile lets the marketplace mark
* the row on every later visit, including after a restart, instead of letting
* the user rediscover the same failure one install at a time.
*/
/** Verdicts of one profile, keyed by spec. */
const REPORT_FILE = "plugin-market-report.json";
/** How many verdicts to keep, newest first. */
const REPORT_LIMIT = 200;
/** Read the verdicts recorded for one profile. */
function readVerdicts(profileDir) {
	let parsed;
	try {
		parsed = JSON.parse(readFileSync(join(profileDir, REPORT_FILE), "utf8"));
	} catch {
		return [];
	}
	if (!Array.isArray(parsed)) return [];
	return parsed.filter((row) => {
		const verdict = row;
		return typeof verdict?.spec === "string" && (verdict.kind === "load" || verdict.kind === "peer" || verdict.kind === "not-plugin") && typeof verdict.reason === "string" && typeof verdict.at === "string";
	});
}
/** Persist verdicts, silently: a report is a convenience, never a blocker. */
function writeVerdicts(profileDir, verdicts) {
	try {
		writeFileSync(join(profileDir, REPORT_FILE), `${JSON.stringify(verdicts.slice(0, REPORT_LIMIT), null, 2)}\n`);
	} catch {}
}
/**
* Whether two verdicts describe the same subject. Module names are deliberately
* not compared: npm names are global while repository names are not, so several
* unrelated rows can carry the same one.
*/
function sameSubject(a, b) {
	if (a.spec === b.spec) return true;
	return a.row !== void 0 && b.row !== void 0 && a.row.toLocaleLowerCase() === b.row.toLocaleLowerCase();
}
/** Record one verdict, replacing whatever was known about that package. */
function recordVerdict(profileDir, verdict) {
	writeVerdicts(profileDir, [verdict, ...readVerdicts(profileDir).filter((row) => !sameSubject(row, verdict))]);
}
/** Forget every verdict about a package, after it installed and loaded. */
function clearVerdicts(profileDir, subject) {
	const before = readVerdicts(profileDir);
	const after = before.filter((verdict) => !sameSubject(verdict, subject));
	if (after.length !== before.length) writeVerdicts(profileDir, after);
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
/** Accept one `owner/repository`, the identity a marketplace row carries. */
function rowIdentity(value) {
	return typeof value === "string" && /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(value) ? value : void 0;
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
/** The module specifiers the profile would import for one installed package. */
function loadSpecifiers(profileDir, packages) {
	const specifiers = [];
	for (const pkg of packages) {
		const entries = bundleEntries(profileDir, pkg);
		if (entries === null) specifiers.push(pkg);
		else for (const entry of entries) specifiers.push(entry.name);
	}
	return [...new Set(specifiers)];
}
/**
* Reflect one settled package change in the running Loader tree.
* @returns whether every changed package took effect, and why it did not.
*/
async function applyHotMount(ctx, before) {
	const loader = ctx.get("loader");
	const dir = resolveProfileDir(activeProfile());
	const { added, removed } = bundleDelta(before, readBundles(dir));
	if (added.length + removed.length === 0) return { hotMounted: false };
	if (loader === void 0) return {
		hotMounted: false,
		note: "no loader service in this launcher"
	};
	const logger = ctx.root.logger?.("plugin-market");
	const notes = [];
	const warn = (reason) => {
		notes.push(reason);
		logger?.warn(`hot mount skipped — ${reason}`);
	};
	const results = [];
	for (const pkg of removed) {
		const dropped = await hotUnmount(loader, pkg);
		if (!dropped) warn(`${pkg}: this launcher mounted it at boot, so only a restart drops it`);
		results.push(dropped);
	}
	for (const pkg of added) results.push(await hotMount(loader, dir, pkg, warn));
	return {
		hotMounted: results.every(Boolean),
		...notes.length === 0 ? {} : { note: notes.join("; ") }
	};
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
					restart,
					verdicts: readVerdicts(resolveProfileDir(activeProfile()))
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
					const dir = resolveProfileDir(activeProfile());
					const before = readBundles(dir);
					const dependenciesBefore = readDependencies(dir);
					const result = await runPluginAction(request.action, spec, (next) => {
						child = next;
					});
					const added = result.ok ? bundleDelta(before, readBundles(dir)).added : [];
					const strayDependencies = result.ok && request.action === "install" && added.length === 0 ? bundleDelta(dependenciesBefore, readDependencies(dir)).added : [];
					const failure = added.length === 0 ? null : await verifyLoadable(dir, loadSpecifiers(dir, added));
					if (strayDependencies.length > 0) {
						const undone = [];
						for (const pkg of strayDependencies) if (!(await runPluginAction("uninstall", pkg, (next) => {
							child = next;
						})).ok) undone.push(`dsh plugin --profile ${activeProfile()} remove -w ${pkg}`);
						result.ok = false;
						result.notPlugin = true;
						result.rolledBack = undone.length === 0;
						recordVerdict(dir, {
							name: strayDependencies[0],
							...rowIdentity(request.fullName) === void 0 ? {} : { row: rowIdentity(request.fullName) },
							spec,
							kind: "not-plugin",
							reason: `${strayDependencies.join(", ")} installed but declares no dsh.bundle.patch, so nothing was mounted`,
							at: (/* @__PURE__ */ new Date()).toISOString()
						});
						result.error = [
							`${spec} installed ${strayDependencies.join(", ")}, which is not a DSH plugin:`,
							"it declares no dsh.bundle.patch, so the profile mounted nothing.",
							...undone.length === 0 ? [] : [
								"",
								"Removing it failed too — run this before the next start:",
								...undone
							]
						].join("\n");
					} else if (failure !== null) {
						const undone = [];
						for (const pkg of added) if (!(await runPluginAction("uninstall", pkg, (next) => {
							child = next;
						})).ok) undone.push(`dsh plugin --profile ${activeProfile()} remove -w ${pkg}`);
						result.ok = false;
						result.rolledBack = undone.length === 0;
						recordVerdict(dir, {
							...added[0] === void 0 ? {} : { name: added[0] },
							...rowIdentity(request.fullName) === void 0 ? {} : { row: rowIdentity(request.fullName) },
							spec,
							kind: "load",
							reason: `${failure.specifier}: ${failure.detail.split("\n").slice(0, 6).join("\n")}`,
							at: (/* @__PURE__ */ new Date()).toISOString()
						});
						result.error = [
							`${failure.specifier} cannot be loaded by this harness:`,
							failure.detail,
							...undone.length === 0 ? [] : [
								"",
								"Removing it failed too — run this before the next start:",
								...undone
							]
						].join("\n");
					} else if (result.ok) {
						if (request.action === "install") clearVerdicts(dir, {
							spec,
							...rowIdentity(request.fullName) === void 0 ? {} : { row: rowIdentity(request.fullName) }
						});
						const live = await applyHotMount(ctx, before);
						result.hotMounted = live.hotMounted;
						if (live.note !== void 0) result.hotMountNote = live.note;
					}
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
				const compatibility = await checkCompatibility(spec);
				if (compatibility.mismatches.length > 0) recordVerdict(resolveProfileDir(activeProfile()), {
					spec,
					kind: "peer",
					reason: compatibility.mismatches.map((peer) => `${peer.name}: needs ${peer.expected}, harness ships ${peer.actual}`).join("\n"),
					at: (/* @__PURE__ */ new Date()).toISOString()
				});
				writeJson(res, 200, compatibility);
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
