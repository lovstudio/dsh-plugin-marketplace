/** Authenticated Host-side GitHub Topic search for the plugin marketplace. */

import type { Context } from '@deepseek-ai/cordis'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type {
  GitHubMarketCredentialProbeRequest, GitHubMarketCredentialProbeResult,
  GitHubMarketRepository, GitHubMarketSearchPage, GitHubMarketSearchRequest,
} from './types.ts'

export type * from './types.ts'

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
    return { login: raw.login, rateLimitRemaining: remaining }
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
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
        'x-github-api-version': '2022-11-28',
      },
    })
    if (!response.ok) {
      const retryAfter = response.headers.get('retry-after')
      const reset = response.headers.get('x-ratelimit-reset')
      const suffix = retryAfter !== null
        ? `; retry after ${retryAfter}s`
        : reset !== null ? `; rate limit resets at ${reset}` : ''
      throw new Error(`GitHub repository search failed: HTTP ${String(response.status)}${suffix}`)
    }
    const remaining = Number(response.headers.get('x-ratelimit-remaining'))
    const resetSeconds = Number(response.headers.get('x-ratelimit-reset'))
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
