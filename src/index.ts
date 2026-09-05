/** Host loader entry for plugin-market settings, profile actions, and its browser implementation. */

import { spawn, type ChildProcess } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { realpathSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createRequire } from 'node:module'
import satisfies from 'semver/functions/satisfies.js'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-settings'
import {
  bundleDelta, bundleEntries, hotMount, hotUnmount, readBundles, readDependencies,
  resolveProfileDir, type LoaderLike,
} from './hot-mount.ts'
import { verifyLoadable } from './load-check.ts'
import { clearVerdicts, readVerdicts, recordVerdict } from './load-report.ts'
import { resolveRepositorySpec } from './repo-install.ts'
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

/** Browser route reporting how a candidate package fits the running harness. */
export const COMPATIBILITY_PATH = '/plugin-marketplace/compatibility'

const OUTPUT_LIMIT = 16_384

/**
 * The scope of the compatibility check. The harness ships these packages inside
 * its own installation instead of the profile, so pnpm reports them as merely
 * `missing peer` and cannot tell a satisfied range from a violated one.
 */
const HARNESS_SCOPE = '@deepseek-ai/'

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
  /** `owner/repository` of the row the action came from, for the row marks. */
  fullName?: unknown
}

interface PluginActionResult {
  ok: boolean
  exitCode: number
  command: string
  error?: string
  /** True when the change already took effect without rebooting the launcher. */
  hotMounted?: boolean
  /** Why a restart is still needed, when the change could not be mounted live. */
  hotMountNote?: string
  /**
   * Set when the package installed but could not be linked. True when the
   * install was undone, false when undoing it failed and the profile is still
   * carrying a package that will abort the next boot.
   */
  rolledBack?: boolean
  /** True when the installed package registered no plugin at all. */
  notPlugin?: boolean
  /** True when the repository has to be installed the way its README documents. */
  needsManual?: boolean
}

interface CompatibilityRequest {
  token?: unknown
  spec?: unknown
}

/** One harness package the candidate declares a range the installation violates. */
interface PeerMismatch {
  name: string
  /** The range the candidate's `peerDependencies` declares. */
  expected: string
  /** The version this harness installation actually ships. */
  actual: string
}

interface CompatibilityResult {
  mismatches: PeerMismatch[]
  /** False when the candidate manifest could not be read, so nothing was checked. */
  checked: boolean
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

/** Accept one `owner/repository`, the identity a marketplace row carries. */
function rowIdentity(value: unknown): string | undefined {
  return typeof value === 'string' && /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(value) ? value : undefined
}

/** Accept one shell-free package spec supported by pnpm. */
function packageSpec(value: unknown): string | null {
  if (typeof value !== 'string' || value.length === 0 || value.length > 512) return null
  return /^[A-Za-z0-9@._~^+:/#=-]+$/.test(value) ? value : null
}

/**
 * Resolve modules the way the running launcher does. The harness keeps its own
 * packages next to the launcher rather than in the profile, so the profile's
 * `node_modules` cannot answer what version is actually loaded.
 */
let harnessRequire: ReturnType<typeof createRequire> | null | undefined

/** Version of one harness package as this launcher would load it, or null. */
function harnessVersion(name: string): string | null {
  if (harnessRequire === undefined) {
    const launcher = process.argv[1]
    harnessRequire = launcher === undefined ? null : createRequire(realpathSync(launcher))
  }
  if (harnessRequire === null) return null
  try {
    const manifest = harnessRequire(`${name}/package.json`) as { version?: unknown }
    return typeof manifest.version === 'string' ? manifest.version : null
  } catch {
    // Absence is normal: the harness need not ship every package a plugin names.
    return null
  }
}

/** Keep only the string-valued peer ranges of a fetched manifest. */
function peerRanges(manifest: unknown): Record<string, string> {
  const peers = (manifest as { peerDependencies?: unknown } | null)?.peerDependencies
  if (peers === null || typeof peers !== 'object') return {}
  const ranges: Record<string, string> = {}
  for (const [name, range] of Object.entries(peers as Record<string, unknown>)) {
    if (typeof range === 'string' && range.length > 0) ranges[name] = range
  }
  return ranges
}

/** Read the peer ranges a `github:owner/repo#ref` spec would install. */
async function githubPeerRanges(spec: string): Promise<Record<string, string> | null> {
  const [path, ref] = spec.slice('github:'.length).split('#')
  const parts = (path ?? '').split('/')
  if (parts.length !== 2 || parts.some(part => part === '')) return null
  const url = `https://raw.githubusercontent.com/${parts[0]!}/${parts[1]!}/${ref ?? 'HEAD'}/package.json`
  const response = await fetch(url, { headers: { accept: 'application/json' } })
  if (!response.ok) return null
  return peerRanges(JSON.parse(await response.text()))
}

/** Read the peer ranges a published `name` or `name@version` spec would install. */
async function registryPeerRanges(spec: string): Promise<Record<string, string> | null> {
  const at = spec.lastIndexOf('@')
  const name = at > 0 ? spec.slice(0, at) : spec
  const wanted = at > 0 ? spec.slice(at + 1) : undefined
  const url = `https://registry.npmjs.org/${name.split('/').map(encodeURIComponent).join('/')}`
  const response = await fetch(url, { headers: { accept: 'application/vnd.npm.install-v1+json' } })
  if (!response.ok) return null
  const packument = JSON.parse(await response.text()) as {
    versions?: Record<string, unknown>
    'dist-tags'?: Record<string, string>
  }
  const versions = packument.versions ?? {}
  const latest = packument['dist-tags']?.latest
  const picked = wanted !== undefined && wanted in versions ? wanted : latest
  return picked === undefined ? null : peerRanges(versions[picked])
}

/**
 * Compare the harness ranges a candidate declares against what this
 * installation ships. Only declared-and-present pairs are judged: a package the
 * harness does not ship at all is an optional integration, not a conflict.
 */
async function checkCompatibility(spec: string): Promise<CompatibilityResult> {
  let ranges: Record<string, string> | null
  try {
    ranges = spec.startsWith('github:') ? await githubPeerRanges(spec) : await registryPeerRanges(spec)
  } catch {
    ranges = null
  }
  if (ranges === null) return { mismatches: [], checked: false }
  const mismatches: PeerMismatch[] = []
  for (const [name, expected] of Object.entries(ranges)) {
    if (!name.startsWith(HARNESS_SCOPE)) continue
    const actual = harnessVersion(name)
    if (actual === null) continue
    // The harness releases prereleases as its shipping versions, so excluding
    // them the way plain semver does would flag every healthy plugin.
    if (!satisfies(actual, expected, { includePrerelease: true })) {
      mismatches.push({ name, expected, actual })
    }
  }
  return { mismatches, checked: true }
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
  // A profile directory is its own pnpm workspace root, which pnpm refuses to
  // change without `-w`.
  const command = `dsh plugin --profile ${profile} ${verb} -w ${spec}`
  const launcher = process.argv[1]
  if (launcher === undefined) {
    return Promise.resolve({ ok: false, exitCode: -1, command, error: 'current dsh launcher path is unavailable' })
  }
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [...process.execArgv, launcher, 'plugin', '--profile', profile, verb, '-w', spec],
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

/** The module specifiers the profile would import for one installed package. */
function loadSpecifiers(profileDir: string, packages: readonly string[]): string[] {
  const specifiers: string[] = []
  for (const pkg of packages) {
    // A patch this cannot read still installs an entry named after the package,
    // which is what the loader imports in the common case.
    const entries = bundleEntries(profileDir, pkg)
    if (entries === null) specifiers.push(pkg)
    else for (const entry of entries) specifiers.push(entry.name)
  }
  return [...new Set(specifiers)]
}

/**
 * Reflect one settled package change in the running Loader tree.
 * @returns whether every changed package took effect, and why it did not.
 */
async function applyHotMount(
  ctx: Context,
  before: readonly string[],
): Promise<{ hotMounted: boolean; note?: string }> {
  const loader = ctx.get('loader') as LoaderLike | undefined
  const dir = resolveProfileDir(activeProfile())
  const { added, removed } = bundleDelta(before, readBundles(dir))
  if (added.length + removed.length === 0) return { hotMounted: false }
  if (loader === undefined) return { hotMounted: false, note: 'no loader service in this launcher' }
  const logger = (ctx.root as { logger?: (name: string) => { warn: (message: string) => void } })
    .logger?.('plugin-market')
  // The reason travels to the browser as well as the log: a fallback to
  // "restart the launcher" is otherwise indistinguishable from a bug.
  const notes: string[] = []
  const warn = (reason: string): void => {
    notes.push(reason)
    logger?.warn(`hot mount skipped — ${reason}`)
  }
  const results: boolean[] = []
  for (const pkg of removed) {
    const dropped = await hotUnmount(loader, pkg)
    if (!dropped) warn(`${pkg}: this launcher mounted it at boot, so only a restart drops it`)
    results.push(dropped)
  }
  for (const pkg of added) results.push(await hotMount(loader, dir, pkg, warn))
  return {
    hotMounted: results.every(Boolean),
    ...notes.length === 0 ? {} : { note: notes.join('; ') },
  }
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
        // Launchers without `appRestart` cannot reboot themselves, so the
        // client must offer manual instructions instead of a dead button.
        const restart = ctx.get('appRestart') === undefined ? 'manual' : 'service'
        // Verdicts ride along with the session so rows carry their mark from
        // the first paint, without a second round trip.
        writeJson(res, 200, { token, restart, verdicts: readVerdicts(resolveProfileDir(activeProfile())) })
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
          const dir = resolveProfileDir(activeProfile())
          const row = rowIdentity(request.fullName)
          // A repository row is not always a package: a private workspace root
          // mounts nothing, and the plugin it holds ships as a published
          // package its README names. Install that instead of the root.
          let install = spec
          if (request.action === 'install' && spec.startsWith('github:') && row !== undefined) {
            const resolution = await resolveRepositorySpec(row, spec)
            if ('unusable' in resolution) {
              recordVerdict(dir, {
                row,
                spec,
                kind: 'manual',
                reason: resolution.unusable,
                at: new Date().toISOString(),
              })
              writeJson(res, 200, {
                ok: false,
                exitCode: 0,
                command: `dsh plugin --profile ${activeProfile()} add -w ${spec}`,
                needsManual: true,
                error: resolution.unusable,
              })
              return
            }
            install = resolution.spec
          }
          const before = readBundles(dir)
          const dependenciesBefore = readDependencies(dir)
          const result = await runPluginAction(request.action, install, (next) => { child = next })
          const added = result.ok ? bundleDelta(before, readBundles(dir)).added : []
          // A package that registered no bundle is not a plugin — most often an
          // unrelated npm package that merely shares the repository's name. The
          // dependency is inert but real, so undo it rather than reporting an
          // install that changed nothing.
          const strayDependencies = result.ok && request.action === 'install' && added.length === 0
            ? bundleDelta(dependenciesBefore, readDependencies(dir)).added
            : []
          // A plugin built against an older harness installs cleanly and then
          // aborts the whole tree at ESM link time, taking the launcher down
          // with it. Undo it here, while there is still a page to say so on.
          const failure = added.length === 0 ? null : await verifyLoadable(dir, loadSpecifiers(dir, added))
          if (strayDependencies.length > 0) {
            const undone: string[] = []
            for (const pkg of strayDependencies) {
              const undo = await runPluginAction('uninstall', pkg, (next) => { child = next })
              if (!undo.ok) undone.push(`dsh plugin --profile ${activeProfile()} remove -w ${pkg}`)
            }
            result.ok = false
            result.notPlugin = true
            result.rolledBack = undone.length === 0
            recordVerdict(dir, {
              name: strayDependencies[0]!,
              ...row === undefined ? {} : { row },
              spec: install,
              kind: 'not-plugin',
              reason: `${strayDependencies.join(', ')} installed but declares no dsh.bundle.patch, so nothing was mounted`,
              at: new Date().toISOString(),
            })
            result.error = [
              `${install} installed ${strayDependencies.join(', ')}, which is not a DSH plugin:`,
              'it declares no dsh.bundle.patch, so the profile mounted nothing.',
              ...undone.length === 0 ? [] : ['', 'Removing it failed too — run this before the next start:', ...undone],
            ].join('\n')
          } else if (failure !== null) {
            const undone: string[] = []
            for (const pkg of added) {
              const undo = await runPluginAction('uninstall', pkg, (next) => { child = next })
              if (!undo.ok) undone.push(`dsh plugin --profile ${activeProfile()} remove -w ${pkg}`)
            }
            result.ok = false
            result.rolledBack = undone.length === 0
            recordVerdict(dir, {
              ...added[0] === undefined ? {} : { name: added[0] },
              ...row === undefined ? {} : { row },
              spec: install,
              kind: 'load',
              reason: `${failure.specifier}: ${failure.detail.split('\n').slice(0, 6).join('\n')}`,
              at: new Date().toISOString(),
            })
            result.error = [
              `${failure.specifier} cannot be loaded by this harness:`,
              failure.detail,
              ...undone.length === 0 ? [] : ['', 'Removing it failed too — run this before the next start:', ...undone],
            ].join('\n')
          } else if (result.ok) {
            // It installed and it loads: whatever this package was marked for
            // no longer holds.
            if (request.action === 'install') {
              clearVerdicts(dir, { spec: install, ...row === undefined ? {} : { row } })
            }
            const live = await applyHotMount(ctx, before)
            result.hotMounted = live.hotMounted
            if (live.note !== undefined) result.hotMountNote = live.note
          }
          writeJson(res, 200, result)
        } finally {
          running = false
        }
      },
    })
    const removeCompatibility = webServer.register({
      kind: 'exact',
      path: COMPATIBILITY_PATH,
      handler: async (req, res) => {
        if (req.method !== 'POST' || req.headers['content-type']?.split(';')[0] !== 'application/json') {
          writeJson(res, 405, { error: 'JSON POST required' })
          return
        }
        let request: CompatibilityRequest
        try {
          request = await readRequest(req)
        } catch (error: unknown) {
          writeJson(res, 400, { error: error instanceof Error ? error.message : String(error) })
          return
        }
        const spec = packageSpec(request.spec)
        if (request.token !== token || spec === null) {
          writeJson(res, 400, { error: 'invalid compatibility request' })
          return
        }
        const compatibility = await checkCompatibility(spec)
        if (compatibility.mismatches.length > 0) {
          recordVerdict(resolveProfileDir(activeProfile()), {
            spec,
            kind: 'peer',
            reason: compatibility.mismatches
              .map(peer => `${peer.name}: needs ${peer.expected}, harness ships ${peer.actual}`)
              .join('\n'),
            at: new Date().toISOString(),
          })
        }
        writeJson(res, 200, compatibility)
      },
    })
    return () => {
      removeToken()
      removeAction()
      removeCompatibility()
      child?.kill('SIGTERM')
      child = null
    }
  }, 'plugin-marketplace: official CLI package actions')
}
