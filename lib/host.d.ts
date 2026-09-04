/** Authenticated Host-side GitHub Topic search for the plugin marketplace. */
import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { GitHubMarketCredentialProbeRequest, GitHubMarketCredentialProbeResult, GitHubMarketPackageRequest, GitHubMarketPackageResult, GitHubMarketSearchPage, GitHubMarketSearchRequest, GitHubMarketStarRequest, GitHubMarketStarredResult } from './types.ts';
export type * from './types.ts';
/** Credential reference managed by the marketplace settings card. */
export declare const GITHUB_MARKET_TOKEN_REF: import("@deepseek-ai/dsh-credentials").CredentialRef;
/** Remote gateway that keeps the GitHub credential out of the browser. */
export declare class PluginMarketGitHubGateway extends TypertRemoteService {
    static inject: string[];
    constructor(ctx: Context);
    /** Resolve a one-shot draft token or the credential store's current value. */
    private token;
    /**
     * Test an unsaved or stored token against GitHub's authenticated-user endpoint.
     * @param request - Optional unsaved token; omission selects the stored reference.
     * @returns The authenticated login and remaining repository-search quota.
     */
    probeCredential(request: GitHubMarketCredentialProbeRequest): Promise<GitHubMarketCredentialProbeResult>;
    /** Authorization header set shared by every authenticated GitHub request. */
    private headers;
    /**
     * Resolve the npm identity a repository declares, so an install can name the
     * published package instead of the repository. A git-hosted spec makes pnpm
     * run the package's `prepare` build, which it refuses until the exact build
     * key is allowlisted; the published package needs no build at all.
     * @param request - the repository to resolve.
     * @returns the manifest name and version, and whether npm serves that name.
     */
    resolvePackage(request: GitHubMarketPackageRequest): Promise<GitHubMarketPackageResult>;
    /**
     * Read the repositories the authenticated user has starred.
     * @returns every starred `owner/repository` read, and whether pages remained.
     */
    listStarred(): Promise<GitHubMarketStarredResult>;
    /**
     * Star or unstar one repository as the authenticated user.
     * @param request - the repository and the target state.
     * @returns the state GitHub accepted.
     */
    setStar(request: GitHubMarketStarRequest): Promise<{
        fullName: string;
        starred: boolean;
    }>;
    /**
     * Search one pushed-at interval. The caller serializes requests and bisects
     * intervals whose total exceeds GitHub's 1,000-result query cap.
     * @param request - inclusive UTC-second interval and page.
     * @returns validated public repository page.
     */
    search(request: GitHubMarketSearchRequest): Promise<GitHubMarketSearchPage>;
}
export default PluginMarketGitHubGateway;
