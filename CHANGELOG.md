# Changelog

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
