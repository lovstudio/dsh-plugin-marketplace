/** Same-origin browser client for Marketplace-owned profile package actions. */

/** One official CLI package-operation result returned by the Host. */
export interface PluginActionOutcome {
  ok: boolean
  exitCode: number
  command: string
  error?: string
}

const TOKEN_PATH = '/plugin-marketplace/action-token'
const ACTION_PATH = '/plugin-marketplace/action'

/** What this launcher can do once a package action changed the profile. */
export interface PluginActionSession {
  token: string
  /** `service` when the launcher provides an in-place restart, else `manual`. */
  restart: 'service' | 'manual'
}

let sessionPromise: Promise<PluginActionSession> | null = null

/** Read the current Host generation's action token and restart capability. */
export async function pluginActionSession(): Promise<PluginActionSession> {
  sessionPromise ??= fetch(TOKEN_PATH, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  }).then(async (response) => {
    if (!response.ok) throw new Error(`plugin action token failed: ${response.status} ${response.statusText}`)
    const body = await response.json() as { token?: unknown; restart?: unknown }
    if (typeof body.token !== 'string' || body.token.length === 0) {
      throw new Error('plugin action token response is invalid')
    }
    return { token: body.token, restart: body.restart === 'service' ? 'service' : 'manual' }
  })
  return sessionPromise
}

/** Drop the token after the Host generation changes. */
export function resetPluginActionToken(): void {
  sessionPromise = null
}

/** Delegate one install or uninstall to the current official DSH CLI. */
export async function runPluginAction(
  action: 'install' | 'uninstall',
  spec: string,
  retryToken = true,
): Promise<PluginActionOutcome> {
  const response = await fetch(ACTION_PATH, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: (await pluginActionSession()).token, action, spec }),
  })
  if (response.status === 400 && retryToken) {
    resetPluginActionToken()
    return runPluginAction(action, spec, false)
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
  }
}
