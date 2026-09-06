/** Authenticated Host-side GitHub Topic search for the plugin marketplace. */

import type { Context } from '@deepseek-ai/cordis'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { githubRetryAt } from './rate-limit.ts'
import { declaresBundle, publishedFromRepository } from '../npm-identity.ts'
import type {
  GitHubMarketCredentialProbeRequest, GitHubMarketCredentialProbeResult,
  GitHubMarketPackageRequest, GitHubMarketPackageResult,
  GitHubMarketRepository, GitHubMarketSearchPage, GitHubMarketSearchRequest,
  GitHubMarketStarRequest, GitHubMarketStarredResult,
} from './types.ts'

export type * from './types.ts'

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface RemoteErrorDetailsMap {
    'plugin-market/rate-limited': { readonly retryAt: number }
  }
}

/** Credential reference managed by the marketplace settings card. */
export const GITHUB_MARKET_TOKEN_REF = credentialRef('GITHUB_TOKEN')

interface GitHubOwnerWire {
  login?: unknown
}

interface GitHubRepositoryWire {
  id?: unknown
  full_name?: unknown
  name?: unknown
  owner?: GitHubOwnerWire
  html_url?: unknown
  description?: unknown
  topics?: unknown
  language?: unknown
  stargazers_count?: unknown
  pushed_at?: unknown
  archived?: unknown
}

/** Pages of starred repositories one inventory read is willing to spend. */
const STARRED_PAGE_LIMIT = 20

/** Repositories per starred-inventory page (GitHub's maximum). */
const STARRED_PAGE_SIZE = 100

/** Whether a classic token's scopes cover starring a public repository. */
function grantsStarring(scopes: readonly string[]): boolean {
  // A fine-grained token reports no scopes at all; its `Starring` permission
  // is invisible here, so only a star attempt can disprove it.
  return scopes.length === 0 || scopes.includes('repo') || scopes.includes('public_repo')
}

/** Split the `x-oauth-scopes` header a classic token answers with. */
function scopesOf(header: string | null): readonly string[] {
  if (header === null) return []
  return header.split(',').map(scope => scope.trim()).filter(scope => scope.length > 0)
}

/** Accept only `owner/repository`, the shape every starring route is built from. */
function repositoryPath(fullName: string): string {
  if (!/^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(fullName)) {
    throw new Error(`GitHub repository name is invalid: ${fullName}`)
  }
  return fullName
}

/** Validate one GitHub search row at the external JSON boundary. */
function repositoryOf(raw: unknown): GitHubMarketRepository {
  const row = raw as GitHubRepositoryWire | null
  if (row === null || typeof row !== 'object'
    || typeof row.id !== 'number' || !Number.isSafeInteger(row.id)
    || typeof row.full_name !== 'string' || row.full_name.length === 0
    || typeof row.name !== 'string' || row.name.length === 0
    || row.owner === undefined || typeof row.owner.login !== 'string' || row.owner.login.length === 0
    || typeof row.html_url !== 'string' || row.html_url.length === 0
    || typeof row.stargazers_count !== 'number' || !Number.isFinite(row.stargazers_count)
    || typeof row.pushed_at !== 'string' || Number.isNaN(Date.parse(row.pushed_at))
    || typeof row.archived !== 'boolean') {
    throw new Error('GitHub repository search returned an invalid repository row')
  }
  const result: GitHubMarketRepository = {
    id: row.id,
    fullName: row.full_name,
    name: row.name,
    owner: row.owner.login,
    repositoryUrl: row.html_url,
    description: typeof row.description === 'string' ? row.description : '',
    topics: Array.isArray(row.topics)
      ? row.topics.filter((topic): topic is string => typeof topic === 'string')
      : [],
    stars: row.stargazers_count,
    pushedAt: row.pushed_at,
    archived: row.archived,
  }
  if (typeof row.language === 'string') return { ...result, language: row.language }
  return result
}

/** Remote gateway that keeps the GitHub credential out of the browser. */
export class PluginMarketGitHubGateway extends TypertRemoteService {
  static inject = ['credentials']

  constructor(ctx: Context) {
    super(ctx, 'pluginMarketGithub')
  }

  /** Resolve a one-shot draft token or the credential store's current value. */
  private async token(draft?: string): Promise<string> {
    if (draft !== undefined) {
      const token = draft.trim()
      if (token.length === 0) throw new Error('GitHub token is blank')
      return token
    }
    const credential = await this.ctx.credentials.resolve(GITHUB_MARKET_TOKEN_REF)
    if (credential === undefined) throw new Error('GitHub plugin marketplace requires GITHUB_TOKEN')
    return credential.value
  }

  /**
   * Test an unsaved or stored token against GitHub's authenticated-user endpoint.
   * @param request - Optional unsaved token; omission selects the stored reference.
   * @returns The authenticated login and remaining repository-search quota.
   */
  @Remote('probeCredential')
  async probeCredential(request: GitHubMarketCredentialProbeRequest): Promise<GitHubMarketCredentialProbeResult> {
    const token = await this.token(request.token)
    const response = await fetch('https://api.github.com/user', {
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
        'x-github-api-version': '2022-11-28',
      },
    })
    if (!response.ok) throw new Error(`GitHub credential test failed: HTTP ${String(response.status)}`)
    const remaining = Number(response.headers.get('x-ratelimit-remaining'))
    if (!Number.isSafeInteger(remaining) || remaining < 0) {
      throw new Error('GitHub credential test omitted a valid rate-limit header')
    }
    const raw = await response.json() as { login?: unknown }
    if (typeof raw.login !== 'string' || raw.login.length === 0) {
      throw new Error('GitHub credential test returned an invalid authenticated user')
    }
    const scopes = scopesOf(response.headers.get('x-oauth-scopes'))
    return { login: raw.login, rateLimitRemaining: remaining, scopes, canStar: grantsStarring(scopes) }
  }

  /** Authorization header set shared by every authenticated GitHub request. */
  private async headers(): Promise<Record<string, string>> {
    return {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${await this.token()}`,
      'x-github-api-version': '2022-11-28',
    }
  }

  /**
   * Resolve the npm identity a repository declares, so an install can name the
   * published package instead of the repository. A git-hosted spec makes pnpm
   * run the package's `prepare` build, which it refuses until the exact build
   * key is allowlisted; the published package needs no build at all.
   * @param request - the repository to resolve.
   * @returns the manifest name and version, and whether npm serves that name.
   */
  @Remote('resolvePackage')
  async resolvePackage(request: GitHubMarketPackageRequest): Promise<GitHubMarketPackageResult> {
    const path = repositoryPath(request.fullName)
    const response = await fetch(`https://api.github.com/repos/${path}/contents/package.json`, {
      headers: { ...await this.headers(), accept: 'application/vnd.github.raw+json' },
    })
    // A repository without a root manifest is installable only as a git spec.
    if (response.status === 404) return { npmPublished: false }
    if (!response.ok) throw new Error(`GitHub manifest read failed: HTTP ${String(response.status)}`)
    let manifest: { name?: unknown; version?: unknown }
    try {
      manifest = JSON.parse(await response.text()) as { name?: unknown; version?: unknown }
    } catch {
      return { npmPublished: false }
    }
    if (typeof manifest.name !== 'string' || manifest.name.length === 0) return { npmPublished: false }
    const version = typeof manifest.version === 'string' ? manifest.version : undefined
    // A name that merely exists on npm is not this repository's package: npm
    // names are global and first-come. Install the published package only when
    // it points back at this repository and declares a DSH bundle; anything
    // else installs from the repository itself.
    const registry = await fetch(`https://registry.npmjs.org/${manifest.name.split('/').map(encodeURIComponent).join('/')}/latest`, {
      headers: { accept: 'application/json' },
    })
    let published: { repository?: unknown; dsh?: unknown } | null = null
    if (registry.ok) {
      try {
        published = JSON.parse(await registry.text()) as { repository?: unknown; dsh?: unknown }
      } catch {
        published = null
      }
    }
    return {
      pkgName: manifest.name,
      ...version === undefined ? {} : { pkgVersion: version },
      npmPublished: published !== null && publishedFromRepository(published, path) && declaresBundle(published),
    }
  }

  /**
   * Read the repositories the authenticated user has starred.
   * @returns every starred `owner/repository` read, and whether pages remained.
   */
  @Remote('listStarred')
  async listStarred(): Promise<GitHubMarketStarredResult> {
    const headers = await this.headers()
    const fullNames: string[] = []
    for (let page = 1; page <= STARRED_PAGE_LIMIT; page += 1) {
      const params = new URLSearchParams({ per_page: String(STARRED_PAGE_SIZE), page: String(page) })
      const response = await fetch(`https://api.github.com/user/starred?${params.toString()}`, { headers })
      if (!response.ok) throw new Error(`GitHub starred read failed: HTTP ${String(response.status)}`)
      const raw = await response.json() as unknown
      if (!Array.isArray(raw)) throw new Error('GitHub starred read returned an invalid response')
      for (const row of raw) {
        const name = (row as { full_name?: unknown } | null)?.full_name
        if (typeof name === 'string' && name.length > 0) fullNames.push(name)
      }
      if (raw.length < STARRED_PAGE_SIZE) return { fullNames, truncated: false }
    }
    return { fullNames, truncated: true }
  }

  /**
   * Star or unstar one repository as the authenticated user.
   * @param request - the repository and the target state.
   * @returns the state GitHub accepted.
   */
  @Remote('setStar')
  async setStar(request: GitHubMarketStarRequest): Promise<{ fullName: string; starred: boolean }> {
    const path = repositoryPath(request.fullName)
    const response = await fetch(`https://api.github.com/user/starred/${path}`, {
      method: request.starred ? 'PUT' : 'DELETE',
      headers: { ...await this.headers(), 'content-length': '0' },
    })
    if (response.status === 403 || response.status === 404) {
      throw new Error(
        'GitHub refused the star: the token needs the `public_repo` scope (classic) '
        + 'or the `Starring` user permission with write access (fine-grained)',
      )
    }
    if (!response.ok) throw new Error(`GitHub star update failed: HTTP ${String(response.status)}`)
    return { fullName: path, starred: request.starred }
  }

  /**
   * Search one pushed-at interval. The caller serializes requests and bisects
   * intervals whose total exceeds GitHub's 1,000-result query cap.
   * @param request - inclusive UTC-second interval and page.
   * @returns validated public repository page.
   */
  @Remote('search')
  async search(request: GitHubMarketSearchRequest): Promise<GitHubMarketSearchPage> {
    const token = await this.token()
    const params = new URLSearchParams({
      q: `topic:dsh-plugin pushed:${request.pushedFrom}..${request.pushedTo}`,
      sort: 'updated',
      order: 'desc',
      page: String(request.page),
      per_page: String(request.perPage),
    })
    const response = await fetch(`https://api.github.com/search/repositories?${params.toString()}`, {
      signal: AbortSignal.timeout(30_000),
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
        'x-github-api-version': '2022-11-28',
      },
    })
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: unknown } | null
      const message = typeof body?.message === 'string' ? body.message.slice(0, 500) : ''
      const retryAt = githubRetryAt(response.status, response.headers, message, Date.now())
      if (retryAt !== undefined) {
        throw new RemoteError('plugin-market/rate-limited',
          `GitHub search rate limit reached; retry after ${new Date(retryAt).toISOString()}`,
          { retryAt })
      }
      throw new Error(`GitHub repository search failed: HTTP ${String(response.status)}${message ? `; ${message}` : ''}`)
    }
    const remaining = Number(response.headers.get('x-ratelimit-remaining') ?? NaN)
    const resetSeconds = Number(response.headers.get('x-ratelimit-reset') ?? NaN)
    if (!Number.isSafeInteger(remaining) || remaining < 0
      || !Number.isSafeInteger(resetSeconds) || resetSeconds < 0) {
      throw new Error('GitHub repository search omitted valid rate-limit headers')
    }
    const raw = await response.json() as unknown
    const envelope = raw as { total_count?: unknown; incomplete_results?: unknown; items?: unknown } | null
    if (envelope === null || typeof envelope !== 'object'
      || typeof envelope.total_count !== 'number' || !Number.isSafeInteger(envelope.total_count)
      || typeof envelope.incomplete_results !== 'boolean' || !Array.isArray(envelope.items)) {
      throw new Error('GitHub repository search returned an invalid response')
    }
    return {
      total: envelope.total_count,
      incomplete: envelope.incomplete_results,
      items: envelope.items.map(repositoryOf),
      rateLimitRemaining: remaining,
      rateLimitResetAt: resetSeconds * 1000,
    }
  }
}

export default PluginMarketGitHubGateway
