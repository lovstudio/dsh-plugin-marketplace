/** Same-origin browser client for Marketplace-owned profile package actions. */

/** One official CLI package-operation result returned by the Host. */
export interface PluginActionOutcome {
  ok: boolean
  exitCode: number
  command: string
  error?: string
  /** True when the Host already mounted the package without a reboot. */
  hotMounted?: boolean
  /** Why the Host could not mount it live, when it could not. */
  hotMountNote?: string
  /**
   * Present when the package installed but could not be linked: true when the
   * Host undid the install, false when undoing it failed too.
   */
  rolledBack?: boolean
  /** True when the package installed but registered no plugin. */
  notPlugin?: boolean
  /** True when this repository installs only the way its README documents. */
  needsManual?: boolean
  /** Install scripts pnpm refused to run, for the user to allow explicitly. */
  buildKeys?: readonly string[]
}

/** A candidate naming itself into the harness scope from another owner. */
export interface PluginScopeClaim {
  /** The package name it declares, inside the harness scope. */
  name: string
  /** The GitHub owner actually publishing it. */
  owner: string
}

/** What the Host found out about a candidate before it is installed. */
export interface PluginCompatibility {
  mismatches: readonly PluginPeerMismatch[]
  scopeClaim?: PluginScopeClaim
}

/** One harness package whose installed version violates a declared peer range. */
export interface PluginPeerMismatch {
  name: string
  /** The range the candidate package declares. */
  expected: string
  /** The version this harness installation ships. */
  actual: string
}

const TOKEN_PATH = '/plugin-marketplace/action-token'
const ACTION_PATH = '/plugin-marketplace/action'
const COMPATIBILITY_PATH = '/plugin-marketplace/compatibility'

/** What the Host already found out about one package. */
export interface PluginVerdict {
  /** Installed module name, when the Host knew one. */
  name?: string
  /** `owner/repository` of the row the verdict came from, when known. */
  row?: string
  /** The spec the recorded action used. */
  spec: string
  /** Why the package was marked: unloadable, stale ranges, or not a plugin at all. */
  kind: 'load' | 'peer' | 'not-plugin' | 'manual'
  reason: string
  /** ISO 8601 timestamp of the finding. */
  at: string
}

/** What this launcher can do once a package action changed the profile. */
export interface PluginActionSession {
  token: string
  /** `service` when the launcher provides an in-place restart, else `manual`. */
  restart: 'service' | 'manual'
  /** Packages this profile already judged, for the row marks. */
  verdicts: readonly PluginVerdict[]
}

let sessionPromise: Promise<PluginActionSession> | null = null

/** Read the current Host generation's action token and restart capability. */
export async function pluginActionSession(): Promise<PluginActionSession> {
  sessionPromise ??= fetch(TOKEN_PATH, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  }).then(async (response) => {
    if (!response.ok) throw new Error(`plugin action token failed: ${response.status} ${response.statusText}`)
    const body = await response.json() as { token?: unknown; restart?: unknown; verdicts?: unknown }
    if (typeof body.token !== 'string' || body.token.length === 0) {
      throw new Error('plugin action token response is invalid')
    }
    const verdicts = Array.isArray(body.verdicts)
      ? body.verdicts.filter((row): row is PluginVerdict => {
        const verdict = row as Partial<PluginVerdict> | null
        return typeof verdict?.spec === 'string'
          && (verdict.kind === 'load' || verdict.kind === 'peer'
            || verdict.kind === 'not-plugin' || verdict.kind === 'manual')
          && typeof verdict.reason === 'string' && typeof verdict.at === 'string'
      })
      : []
    return { token: body.token, restart: body.restart === 'service' ? 'service' : 'manual', verdicts }
  })
  return sessionPromise
}

/** Drop the token after the Host generation changes. */
export function resetPluginActionToken(): void {
  sessionPromise = null
}

/**
 * Report the harness peer ranges one candidate package would violate. The check
 * is advisory: an unreachable manifest or a failed request yields no mismatch,
 * because a diagnostic must never be the reason an install cannot start.
 */
export async function checkPluginCompatibility(
  spec: string,
  retryToken = true,
): Promise<PluginCompatibility> {
  let response: Response
  try {
    response = await fetch(COMPATIBILITY_PATH, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: (await pluginActionSession()).token, spec }),
    })
  } catch {
    return { mismatches: [] }
  }
  if (response.status === 400 && retryToken) {
    resetPluginActionToken()
    return checkPluginCompatibility(spec, false)
  }
  if (!response.ok) return { mismatches: [] }
  const body = await response.json().catch(() => null) as { mismatches?: unknown; scopeClaim?: unknown } | null
  const mismatches = Array.isArray(body?.mismatches)
    ? body.mismatches.filter((row): row is PluginPeerMismatch => {
      const peer = row as Partial<PluginPeerMismatch> | null
      return typeof peer?.name === 'string' && typeof peer.expected === 'string' && typeof peer.actual === 'string'
    })
    : []
  const claim = body?.scopeClaim as Partial<PluginScopeClaim> | null | undefined
  return {
    mismatches,
    ...typeof claim?.name === 'string' && typeof claim.owner === 'string'
      ? { scopeClaim: { name: claim.name, owner: claim.owner } }
      : {},
  }
}

/** Delegate one install or uninstall to the current official DSH CLI. */
export async function runPluginAction(
  action: 'install' | 'uninstall',
  spec: string,
  fullName?: string,
  allowBuilds?: readonly string[],
  retryToken = true,
): Promise<PluginActionOutcome> {
  const response = await fetch(ACTION_PATH, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: (await pluginActionSession()).token,
      action,
      spec,
      ...fullName === undefined ? {} : { fullName },
      ...allowBuilds === undefined || allowBuilds.length === 0 ? {} : { allowBuilds },
    }),
  })
  if (response.status === 400 && retryToken) {
    resetPluginActionToken()
    return runPluginAction(action, spec, fullName, allowBuilds, false)
  }
  const body = await response.json() as Partial<PluginActionOutcome> & { error?: unknown }
  if (!response.ok) {
    throw new Error(typeof body.error === 'string' ? body.error : `plugin action failed: ${response.status}`)
  }
  if (typeof body.ok !== 'boolean' || typeof body.exitCode !== 'number' || typeof body.command !== 'string') {
    throw new Error('plugin action response is invalid')
  }
  return {
    ok: body.ok,
    exitCode: body.exitCode,
    command: body.command,
    ...typeof body.error === 'string' ? { error: body.error } : {},
    ...body.hotMounted === true ? { hotMounted: true } : {},
    ...typeof body.hotMountNote === 'string' ? { hotMountNote: body.hotMountNote } : {},
    ...typeof body.rolledBack === 'boolean' ? { rolledBack: body.rolledBack } : {},
    ...body.notPlugin === true ? { notPlugin: true } : {},
    ...body.needsManual === true ? { needsManual: true } : {},
    ...Array.isArray(body.buildKeys) && body.buildKeys.every(key => typeof key === 'string')
      ? { buildKeys: body.buildKeys as string[] }
      : {},
  }
}
