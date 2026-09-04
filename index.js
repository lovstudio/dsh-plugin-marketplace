import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
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
/** Host loader entry for plugin-market settings, profile actions, and its browser implementation. */
/** Services required by the Marketplace-owned profile action routes. */
const inject = ["webServer"];
/** Browser route issuing a same-origin action token. */
const ACTION_TOKEN_PATH = "/plugin-marketplace/action-token";
/** Browser route delegating one package change to the official `dsh plugin` CLI. */
const ACTION_PATH = "/plugin-marketplace/action";
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
				writeJson(res, 200, { token });
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
					writeJson(res, 200, await runPluginAction(request.action, spec, (next) => {
						child = next;
					}));
				} finally {
					running = false;
				}
			}
		});
		return () => {
			removeToken();
			removeAction();
			child?.kill("SIGTERM");
			child = null;
		};
	}, "plugin-marketplace: official CLI package actions");
}
//#endregion
export { ACTION_PATH, ACTION_TOKEN_PATH, DEFAULT_MARKET_PROVIDER, MARKET_PROVIDER_IDS, MARKET_SETTINGS_NAMESPACE, apply, inject };
