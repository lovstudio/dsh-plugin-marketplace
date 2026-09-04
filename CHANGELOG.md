# Changelog

## 0.1.10 - 2026-09-05

- Run a freshly installed plugin immediately, without rebooting the launcher. `dsh plugin add` only registers the package in the profile manifest, and that layer is read once at boot; the marketplace now creates the same entries in the running Loader, so the banner asks for a page reload instead of a restart. Nothing reaches disk — the next boot mounts the package from its bundle layer as usual — and a package whose bundle patch cannot be reproduced at runtime falls back to the previous restart hint.
- Warn before installing a plugin the harness cannot load. A plugin that pins a stale `@deepseek-ai/*` range fails at ESM link time and takes down every other plugin with it; pnpm only ever reports it as a benign-looking missing peer, because the harness ships those packages beside the launcher instead of in the profile.

## 0.1.7 - 2026-09-05

- Show that an install is working: the action button spins and counts the seconds it has been running, because the `dsh plugin` CLI reports nothing until it exits.
- Resolve Better Restart per call instead of once at mount. That service is published from another plugin's effect, so a marketplace that mounted first cached `undefined` and every **Restart app** click did nothing.
- Publish a restart failure on the action banner, with the reason and a copy action, instead of dropping it into an unhandled rejection. Requires `@lovstudio/dsh-better-restart` 0.1.3, which reports the launcher's missing `appRestart` service rather than answering 204 to a restart that never happens.
- Declare `@lovstudio/dsh-better-restart` as an optional peer: the marketplace still loads without it, and says so when a restart is asked for.

## 0.1.6 - 2026-09-05

- Pass `-w` to every `dsh plugin` action: a profile directory is its own pnpm workspace root, which pnpm refuses to change without it (`ERR_PNPM_ADDING_TO_ROOT`).
- Install the published npm package when the repository's manifest names one npm serves, instead of the `github:owner/repo` spec. A git-hosted spec makes pnpm run the package's `prepare` build, which it refuses until that exact build key is allowlisted (`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`).
- Star and unstar repositories as the authenticated GitHub user, from the card and the detail dialog. Reading and writing stars go through the Host gateway, so the token stays out of the browser; the actions stay hidden unless the credential can star, and the settings card's **Test** now names the scope a token is missing (`public_repo` for classic, `Starring` write for fine-grained).
- Move details, copy id, copy for agent, and open repository into an overflow menu, keeping star and install as the row's visible actions.
- Match installed plugins case-insensitively, so a repository named `DSH-better-sidebar` recognizes the installed `dsh-better-sidebar`.
- Refresh the installed inventory after a successful install or uninstall.
- Emit the shipped `lib/*.d.ts` declarations during `build`; they had drifted from the source since 0.1.3.

## 0.1.5 - 2026-09-05

- Enable install for GitHub Topic rows: the default provider carried no install probe, so every card's install button stayed disabled. Rows now document `dsh plugin --profile web add github:<owner>/<repo>`, and catalogs cached before this derive the same probe while parsing, so no re-crawl is needed.
- Uninstall the module name the Host inventory reports, falling back to the probed npm name, so GitHub rows — which have no manifest to probe a package name from — can be removed from the card.

## 0.1.4 - 2026-09-04

- Write the GitHub token through `remote.credentials`.

## 0.1.3 - 2026-09-01

- Ship prebuilt artifacts so the package installs directly from a GitHub tag, and pin the harness peers to 0.1.2-alpha.2.

## 0.1.2 - 2026-08-29

- Match the Settings footer icon size: the sidebar marketplace entry now renders a 16px glyph in the wide column, the same size as the Settings entry, instead of 14px.

## 0.1.1 - 2026-08-28

- Wait for the package-owned `remote.pluginMarketGithub` namespace before mounting marketplace consumers, preventing startup synchronization from failing with `cannot get property "remote.pluginMarketGithub" without inject`.

## 0.1.0 - 2026-08-28

- Publish the standalone local-first DSH plugin marketplace bundle.
