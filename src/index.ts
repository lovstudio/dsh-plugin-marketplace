/** Host loader entry for plugin-market settings, profile actions, and its browser implementation. */

import { spawn, type ChildProcess } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-settings'
import { MARKET_SETTINGS_NAMESPACE, MarketSettingsSchema } from './market-settings.ts'

export {
  DEFAULT_MARKET_PROVIDER, MARKET_PROVIDER_IDS, MARKET_SETTINGS_NAMESPACE,
  type MarketProviderId, type MarketSettings,
} from './market-settings.ts'

/** Services required by the Marketplace-owned profile action routes. */
export const inject = ['webServer']

/** Browser route issuing a same-origin action token. */
export const ACTION_TOKEN_PATH = '/plugin-marketplace/action-token'

/** Browser route delegating one package change to the official `dsh plugin` CLI. */
export const ACTION_PATH = '/plugin-marketplace/action'

const OUTPUT_LIMIT = 16_384

interface WebServerLike {
  register(route: {
    kind: 'exact'
    path: string
    handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>
  }): () => void
}

interface SettingsRegistry {
  register(ns: string, schema: typeof MarketSettingsSchema): unknown
}

interface PluginActionRequest {
  token?: unknown
  action?: unknown
  spec?: unknown
}

interface PluginActionResult {
  ok: boolean
  exitCode: number
  command: string
  error?: string
}

/** Keep only the diagnostic tail returned to the browser. */
function appendTail(current: string, chunk: Buffer): string {
  return (current + chunk.toString('utf8')).slice(-OUTPUT_LIMIT)
}

/** Resolve the profile selected by the current launcher invocation. */
function activeProfile(): string {
  const args = process.argv.slice(2)
  if (args[0] === 'web') return 'web'
  const index = args.indexOf('--profile')
  return index >= 0 && args[index + 1] !== undefined ? args[index + 1]! : 'web'
}

/** Accept one shell-free package spec supported by pnpm. */
function packageSpec(value: unknown): string | null {
  if (typeof value !== 'string' || value.length === 0 || value.length > 512) return null
  return /^[A-Za-z0-9@._~^+:/#=-]+$/.test(value) ? value : null
}

/** Read one small JSON request body. */
async function readRequest(req: IncomingMessage): Promise<PluginActionRequest> {
  let body = ''
  for await (const chunk of req) {
    body += String(chunk)
    if (body.length > 4096) throw new Error('request body is too large')
  }
  const parsed = JSON.parse(body) as unknown
  return parsed !== null && typeof parsed === 'object' ? parsed as PluginActionRequest : {}
}

/** Write a no-store JSON response. */
function writeJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  })
  res.end(JSON.stringify(body))
}

/** Run the current official DSH launcher in plugin-management mode. */
function runPluginAction(
  action: 'install' | 'uninstall',
  spec: string,
  setChild: (child: ChildProcess | null) => void,
): Promise<PluginActionResult> {
  const verb = action === 'install' ? 'add' : 'remove'
  const profile = activeProfile()
  const command = `dsh plugin --profile ${profile} ${verb} ${spec}`
  const launcher = process.argv[1]
  if (launcher === undefined) {
    return Promise.resolve({ ok: false, exitCode: -1, command, error: 'current dsh launcher path is unavailable' })
  }
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [...process.execArgv, launcher, 'plugin', '--profile', profile, verb, spec],
      {
        cwd: process.cwd(),
        env: { ...process.env, CI: 'true' },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    )
    setChild(child)
    let output = ''
    child.stdout?.on('data', (chunk: Buffer) => { output = appendTail(output, chunk) })
    child.stderr?.on('data', (chunk: Buffer) => { output = appendTail(output, chunk) })
    child.once('error', (error) => {
      setChild(null)
      resolve({ ok: false, exitCode: -1, command, error: error.message })
    })
    child.once('close', (code) => {
      setChild(null)
      const exitCode = code ?? -1
      resolve({
        ok: exitCode === 0,
        exitCode,
        command,
        ...exitCode === 0 || output.trim() === '' ? {} : { error: output.trim() },
      })
    })
  })
}

/** Register Marketplace settings and its authenticated package-action routes. */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    const settings = settingsCtx.get('settings') as unknown as SettingsRegistry
    settings.register(MARKET_SETTINGS_NAMESPACE, MarketSettingsSchema)
  })

  const webServer = ctx.get('webServer') as WebServerLike
  const token = randomBytes(32).toString('base64url')
  let child: ChildProcess | null = null
  let running = false
  ctx.effect(() => {
    const removeToken = webServer.register({
      kind: 'exact',
      path: ACTION_TOKEN_PATH,
      handler: async (req, res) => {
        if (req.method !== 'GET') {
          writeJson(res, 405, { error: 'method not allowed' })
          return
        }
        writeJson(res, 200, { token })
      },
    })
    const removeAction = webServer.register({
      kind: 'exact',
      path: ACTION_PATH,
      handler: async (req, res) => {
        if (req.method !== 'POST' || req.headers['content-type']?.split(';')[0] !== 'application/json') {
          writeJson(res, 405, { error: 'JSON POST required' })
          return
        }
        let request: PluginActionRequest
        try {
          request = await readRequest(req)
        } catch (error: unknown) {
          writeJson(res, 400, { error: error instanceof Error ? error.message : String(error) })
          return
        }
        const spec = packageSpec(request.spec)
        if (request.token !== token || (request.action !== 'install' && request.action !== 'uninstall') || spec === null) {
          writeJson(res, 400, { error: 'invalid plugin action' })
          return
        }
        if (running) {
          writeJson(res, 409, { error: 'another plugin action is already running' })
          return
        }
        running = true
        try {
          writeJson(res, 200, await runPluginAction(request.action, spec, (next) => { child = next }))
        } finally {
          running = false
        }
      },
    })
    return () => {
      removeToken()
      removeAction()
      child?.kill('SIGTERM')
      child = null
    }
  }, 'plugin-marketplace: official CLI package actions')
}
