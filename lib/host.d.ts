/** Authenticated Host-side GitHub Topic search for the plugin marketplace. */
import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { GitHubMarketCredentialProbeRequest, GitHubMarketCredentialProbeResult, GitHubMarketSearchPage, GitHubMarketSearchRequest } from './types.ts';
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
    /**
     * Search one pushed-at interval. The caller serializes requests and bisects
     * intervals whose total exceeds GitHub's 1,000-result query cap.
     * @param request - inclusive UTC-second interval and page.
     * @returns validated public repository page.
     */
    search(request: GitHubMarketSearchRequest): Promise<GitHubMarketSearchPage>;
}
export default PluginMarketGitHubGateway;
