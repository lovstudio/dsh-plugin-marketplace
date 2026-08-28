# @lovstudio/dsh-plugin-marketplace

English | [中文](README.zh.md)

Local-first **Plugin market** for Web Settings and the sidebar. The selected provider synchronizes public repository metadata into a provider-specific IndexedDB snapshot; browsing, search, filters, sorting, paging, facets, suggestions, and detail lookup then read only that local snapshot. The browser plugin registers four contributions on one shared controller:

- a `settings.plugins.tab` tab with id `market` (order 20, after the installed-plugin inventory tab),
- a `sidebar.footer.action` destination above Settings that opens the marketplace,
- a `shell.overlay` modal hosting the same marketplace surface,
- a `settings.plugin.item` card keyed by `ui-plugin-market` for the catalog provider and startup synchronization preference.

All three surfaces share one view store, so a search, filter, or scroll position survives switching between the sidebar overlay and the Settings tab.

## Install

The package is one DSH bundle containing the Host-side GitHub provider, its strict Typert Remote descriptors, the settings registration, and the browser UI. Install it into the `web` profile:

```sh
dsh plugin --profile web add @lovstudio/dsh-plugin-marketplace
```

The bundle inserts `@lovstudio/dsh-plugin-marketplace/host` and `@lovstudio/dsh-plugin-marketplace` together. The browser half mounts its own `pluginMarketGithub` Remote contribution, so the plugin does not require an edit to the Harness-wide Remote assembly or a Web rebuild.

## Local catalog synchronization

`MarketProvider` is the provider interface: every selectable source implements complete initialization, incremental synchronization, id-based detail lookup, and local list/suggestion/facet projections. The `dshfind` provider initializes through `GET /v1/catalog`. Incremental synchronization first reads one `GET /v1/plugins` row to compare `data_version`; an unchanged version only advances the local update time, while a changed version downloads the pinned complete snapshot and atomically replaces the IndexedDB record.

The `github` provider searches `topic:dsh-plugin` through the Host-side `pluginMarketGithub` Remote. Initialization recursively bisects the full `pushed` interval whenever GitHub reports more than 1,000 matches, then pages each leaf from the older interval to the newer one. After every successful GitHub request, one IndexedDB transaction commits that response's rows together with the exact next interval/page cursor; interruption before the transaction replays that request, while interruption after it resumes at the next request. Committed staging rows immediately join the local list, detail, suggestion, and facet projections, and the active marketplace list re-runs its current local query whenever that committed row count grows. Incremental synchronization starts inclusively at the greatest `pushed_at` returned by the previous completed synchronization and upserts repositories by GitHub id; when a completed scan returns no newer row, its frozen upper bound becomes the next cursor. The catalog cursor advances only after the complete snapshot succeeds, so the last complete snapshot remains queryable while the per-request staging checkpoint resumes. The Host resolves `GITHUB_TOKEN` per request, enforces authenticated search, and never returns the token to the browser.

The marketplace card in Settings > Plugins > Plugin configuration stages `provider` and `syncOnStartup`, then writes them to the Host settings document on Save. GitHub is the default provider, so the card initially exposes a write-only token field backed by `credentials.set({ ref: 'GITHUB_TOKEN' })` plus the official GitHub token-creation link; the settings document stores no secret. After Save, the token draft clears while its configured badge and optional last four characters remain visible. Leaving the field blank keeps the stored token, and **Test** calls GitHub's authenticated `/user` endpoint with a draft token when present or the stored token otherwise. `syncOnStartup` defaults to `true` and runs one silent incremental check after each new application runtime accepts its settings. The overlay header exposes the same operation as a refresh button labeled with the complete local plugin count and relative update age; while synchronization runs, that same button replaces the summary with one completed/total counter, and a specific failure remains visible beside it. The list distinguishes an empty local catalog, an active synchronization waiting for its first committed row, and a non-empty query/filter that matches no rows instead of labeling all three as a failed search.

## Search, filters, and ranking

The keyword-only search box accepts a Google-style syntax subset: multiple keywords (AND), `A OR B`, `-exclude`, `"exact phrase"`, `field:value` filters (`category:`, `owner:`/`author:`, `language:`/`lang:`, `grade:`, `tag:`), and numeric `stars:`/`score:` comparisons (`>=`, `>`, `<=`, `<`, or exact). Field filters in the query override the toolbar selection for the same field; the filter panel displays and locks those effective values until the user edits the search text.

A single positive token becomes one local catalog projection. A multi-token query projects the first four terms over the complete snapshot, then merges and deduplicates candidates with set logic — AND terms must all match, one OR member suffices, exclusions disqualify. The selected catalog ordering (`stars`/`updated`/`score`/`name`, ascending or descending) determines the final merged order. Paging slices local results and never contacts the provider.

The toolbar additionally supports catalog sorting (`stars`/`updated`/`score`/`name`, ascending or descending), locally aggregated category facets, author/language/grade filters, featured/official/installable toggles, and a Host-inventory-backed installed-only projection of the loaded rows. Pagination uses both automatic intersection loading and an explicit next-page action for embedded webviews and keyboard operation.

## Quality assessment and agent handoff

Each card and the detail dialog surface the catalog's quality assessment: grade (S/A/B/C), score (0-100), and risk flag with note. Copy actions produce agent-facing Markdown: the plugin id (`owner/repo`), the compact `for Agent` block (identity, assessment, metadata, install command, repository), and a batch block that states how many of the query's total rows are currently loaded and included. Install and uninstall run in place: the card and the dialog call the loopback-pinned `pluginManager` Remote, which runs the shared pnpm operation in the managed profile; the success banner notes the restart requirement and delegates its action to `ctx.betterRestartUi`, which re-boots the Host tree and reloads the page after the replacement connection arrives. The action remains gated by a confirmation dialog while agent conversations are running (live activity polling, acknowledgement required to interrupt). A failed operation shows the specific problem — the bounded pnpm output tail, the remote error, or the not-installable reason — in an error banner with a copy action that writes a keyed layout (plugin, command, status, error text) an agent can consume directly, so the failure can be pasted into an issue or an agent prompt for fixing. The installed badge derives from the Host `pluginInventory` remote (module-name match against the package or probed npm name).

Install and uninstall are direct operations through the `pluginManager` Remote; the change takes effect after the app restarts, which the success banner requests through the `better-restart-ui` client service. Enable/disable toggles are not implemented and remain guided copy only; enabling/disabling an installed plugin belongs to the profile configuration surface.

## Config

| Field | Type | Default | Meaning |
|---|---|---|---|
| `baseUrl` | `string` | `https://api.dshfind.com` | Catalog API base URL (the published contract's production environment). |

The Host settings namespace `ui-plugin-market` stores `provider` (`dshfind` or `github`, default `github`) and `syncOnStartup` (`true`). `GITHUB_TOKEN` lives in the credential provider and is required only by the GitHub source. Adding another provider id requires a complete implementation of every `MarketProvider` operation before extending the schema.

## Extension points

The Host half registers the private `pluginMarketGithub` Remote service consumed by this package's browser half. The browser half declares no child slots; other plugins can mount additional `settings.plugins.tab` tabs or `shell.overlay` entries beside the marketplace without touching it. The search pipeline (`parseMarketQuery`, `mergeAndRank`) is exported for reuse by other surfaces.

## Model Experience

None, as this package queries a local browser catalog and registers nothing model-facing; its copy actions produce Markdown for a human to paste elsewhere.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

- **Install/uninstall run host-side, restart required** — install and uninstall call the loopback-pinned `pluginManager` Remote, which runs pnpm in the managed profile (`dsh plugin` equivalent) and reconciles the profile layer list; the change takes effect only after the app restarts, so the success banner delegates the Host re-boot and post-reconnect page reload to `ctx.betterRestartUi`. Enable/disable toggles are not implemented.
- **GitHub tracks pushes, not topic-only edits** — incremental GitHub synchronization intentionally follows `pushed`; adding or removing `dsh-plugin` without another push, deleting a repository, or changing metadata without a push does not update or remove the cached row. A manual full GitHub initialization rebuilds pushed repositories but still omits repositories that have never been pushed.
- **Multi-term projection is bounded** — only the first four positive terms contribute projections; the selected catalog ordering still determines the final merged order.
- **Snapshot detail only** — detail lookup intentionally returns fields present in the complete provider snapshot. Provider-only live growth windows are not fetched when a dialog opens, because ordinary interaction must stay offline-capable.
- **Installed badge staleness** — the badge reflects the Host inventory snapshot; it refreshes after a successful install/uninstall and on `connection/reset`, so a plugin installed outside the app appears only after the next refresh.
- **No suggest dropdown** — local suggestion projection exists but is not wired into the search box.
