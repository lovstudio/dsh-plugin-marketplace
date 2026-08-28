/** Client-safe GitHub Topic search vocabulary. */
/** One public repository projected from GitHub repository search. */
export interface GitHubMarketRepository {
    /** Stable GitHub database id. */
    readonly id: number;
    /** `owner/repository`. */
    readonly fullName: string;
    /** Repository name. */
    readonly name: string;
    /** Repository owner login. */
    readonly owner: string;
    /** Public GitHub URL. */
    readonly repositoryUrl: string;
    /** Repository description. */
    readonly description: string;
    /** Repository topics. */
    readonly topics: readonly string[];
    /** Primary language when GitHub reports one. */
    readonly language?: string;
    /** Stargazer count. */
    readonly stars: number;
    /** Last push time. */
    readonly pushedAt: string;
    /** Whether GitHub marks the repository archived. */
    readonly archived: boolean;
}
/** One inclusive UTC-second search interval and page. */
export interface GitHubMarketSearchRequest {
    /** Inclusive lower pushed-at bound as ISO 8601. */
    readonly pushedFrom: string;
    /** Inclusive upper pushed-at bound as ISO 8601. */
    readonly pushedTo: string;
    /** One-based result page. */
    readonly page: number;
    /** Rows per page, from 1 through 100. */
    readonly perPage: number;
}
/** Validated page returned by GitHub repository search. */
export interface GitHubMarketSearchPage {
    /** Total matches in this interval before GitHub's 1,000-result cap. */
    readonly total: number;
    /** Whether GitHub reports an incomplete search index response. */
    readonly incomplete: boolean;
    /** Validated repository rows. */
    readonly items: readonly GitHubMarketRepository[];
    /** Remaining requests in GitHub's search bucket after this response. */
    readonly rateLimitRemaining: number;
    /** UTC epoch milliseconds when the search bucket resets. */
    readonly rateLimitResetAt: number;
}
/** One-shot GitHub credential probe; an omitted token tests the stored credential. */
export interface GitHubMarketCredentialProbeRequest {
    /** Unsaved token to test without storing it. */
    readonly token?: string;
}
/** Authenticated identity returned after GitHub accepts the credential. */
export interface GitHubMarketCredentialProbeResult {
    /** GitHub login authenticated by the token. */
    readonly login: string;
    /** Remaining core REST requests reported by GitHub. */
    readonly rateLimitRemaining: number;
}
