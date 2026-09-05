/**
 * Agent-facing copy builders: the compact Markdown blocks the marketplace
 * copy actions produce. Written for a model consumer — every fact the agent
 * needs to decide or install is present, and no UI vocabulary leaks in.
 */

import type { PluginVerdict } from './plugin-actions.ts'
import type { MarketPluginSummary } from './types.ts'

/**
 * The installed module name of a plugin row, when the Host inventory carries
 * one. Providers that probe npm supply the exact package name; providers that
 * only see the repository fall back to the repository name.
 * @param plugin - the plugin row.
 * @param installed - installed module names from the Host inventory remote.
 * @returns the matching installed module name, or null.
 */
export function installedName(
  plugin: MarketPluginSummary,
  installed: readonly string[],
): string | null {
  if (installed.length === 0) return null
  // Repository names carry the owner's capitalization (`DSH-better-sidebar`)
  // while the published module is lower case, so match case-insensitively and
  // answer with the inventory's own spelling.
  const names = new Map(installed.map(name => [name.toLocaleLowerCase(), name]))
  const probed = plugin.install?.pkgName
  if (probed !== undefined && probed.length > 0) {
    const match = names.get(probed.toLocaleLowerCase())
    if (match !== undefined) return match
  }
  return names.get(plugin.name.toLocaleLowerCase()) ?? null
}

/**
 * Whether a plugin row is already installed (module-name match against the
 * Host inventory).
 * @param plugin - the plugin row.
 * @param installed - installed module names from the Host inventory remote.
 * @returns whether the package or probed npm name is installed.
 */
export function isInstalled(plugin: MarketPluginSummary, installed: readonly string[]): boolean {
  return installedName(plugin, installed) !== null
}

/**
 * What this profile already found out about a row, if anything. Matching is on
 * the repository the verdict came from, or the exact spec it used — never on
 * the module name, because npm names are global while repository names are not:
 * several unrelated rows are called `dsh-trading`, and only one of them is the
 * package that was judged.
 * @param plugin - the plugin row.
 * @param verdicts - verdicts recorded by the Host.
 * @returns the newest verdict about this row, or null.
 */
export function rowVerdict(
  plugin: MarketPluginSummary,
  verdicts: readonly PluginVerdict[],
): PluginVerdict | null {
  if (verdicts.length === 0) return null
  const spec = installSpec(plugin)
  const full = plugin.fullName.toLocaleLowerCase()
  return verdicts.find(verdict => verdict.row?.toLocaleLowerCase() === full
    || (spec !== null && verdict.spec === spec)) ?? null
}

/**
 * The documented install command of a plugin, when installable.
 * @param plugin - the plugin row.
 * @returns the exact install command, or null when the catalog probed none.
 */
export function installCommand(plugin: MarketPluginSummary): string | null {
  return plugin.install?.cmd ?? null
}

/**
 * Resolve the single package spec of an official Web-profile install command.
 * The workspace-root flag is optional in the documented command because the
 * Host always passes it.
 */
export function installSpec(plugin: MarketPluginSummary): string | null {
  const command = installCommand(plugin)
  if (command === null) return null
  const match = /^(?:dsh|npx -y @deepseek-ai\/dsh(?:@[^\s]+)?) plugin --profile web add (?:(?:-w|--workspace-root) )?([^\s]+)$/
    .exec(command)
  return match?.[1] ?? null
}

/**
 * Resolve the installed dependency name used by `dsh plugin remove`: the name
 * the Host inventory actually reports, falling back to the probed npm name.
 * @param plugin - the plugin row.
 * @param installed - installed module names from the Host inventory remote.
 * @returns the dependency name to remove, or null.
 */
export function uninstallSpec(
  plugin: MarketPluginSummary,
  installed: readonly string[] = [],
): string | null {
  const matched = installedName(plugin, installed)
  if (matched !== null) return matched
  const name = plugin.install?.pkgName
  return name === undefined || name.length === 0 ? null : name
}

/**
 * Derive the uninstall command from the documented install command: same
 * invocation with `add` replaced by `remove`. Null when no dependency name is
 * known.
 * @param plugin - the plugin row.
 * @param installed - installed module names from the Host inventory remote.
 * @returns the uninstall command, or null.
 */
export function uninstallCommand(
  plugin: MarketPluginSummary,
  installed: readonly string[] = [],
): string | null {
  const spec = uninstallSpec(plugin, installed)
  return spec === null ? null : `dsh plugin --profile web remove -w ${spec}`
}

/** One line of the per-plugin agent block: `- key: value` when the value is present. */
function line(key: string, value: string | undefined | null): string | null {
  return value === undefined || value === null || value.length === 0 ? null : `- ${key}: ${value}`
}

/**
 * The compact per-plugin Markdown block for agent consumption: identity,
 * quality assessment, metadata, install command, and source links.
 * @param plugin - the plugin row (or detail payload).
 * @param locale - `zh` keeps the description in Chinese when the row carries
 *   no localized copy; the block itself stays English for the model.
 * @returns the Markdown block.
 */
export function pluginAgentMarkdown(
  plugin: MarketPluginSummary,
  locale: 'zh' | 'en' = 'en',
): string {
  const localized = (plugin as { i18n?: Readonly<Record<string, { description?: string }>> }).i18n
  const description = localized?.[locale]?.description ?? plugin.description
  const grade = plugin.grade ?? 'ungraded'
  const score = plugin.score === undefined ? 'n/a' : String(plugin.score)
  const stars = String(plugin.stars)
  const lines: Array<string | null> = [
    `## ${plugin.fullName}`,
    line('id', plugin.fullName),
    line('name', plugin.name),
    line('owner', plugin.owner),
    line('category', plugin.category),
    line('grade', grade),
    line('score', score),
    line('stars', stars),
    line('language', plugin.language),
    line('tags', plugin.tags.join(', ')),
    line('description', description),
    line('install', installCommand(plugin)),
    line('repository', plugin.repositoryUrl),
  ]
  return lines.filter((entry): entry is string => entry !== null).join('\n')
}

/**
 * The batch block of the current visible results, for pasting an entire
 * candidate set into an agent conversation. Each plugin gets the one-line
 * summary; the full per-plugin block is available through the card action.
 * @param items - the visible (or selected) plugin rows.
 * @param total - total rows reported for the current query.
 * @param query - the search text that produced the list, when any.
 * @param locale - description-locale preference.
 * @returns the Markdown list.
 */
export function listAgentMarkdown(
  items: readonly MarketPluginSummary[],
  total: number,
  query: string,
  locale: 'zh' | 'en' = 'en',
): string {
  const count = `${String(items.length)} of ${String(total)} loaded`
  const header = query.length === 0
    ? `Plugin market results (${count})`
    : `Plugin market results for query: ${query} (${count})`
  const rows = items.map((plugin) => {
    const localized = (plugin as { i18n?: Readonly<Record<string, { description?: string }>> }).i18n
    const description = localized?.[locale]?.description ?? plugin.description
    const summary = description.length > 160 ? `${description.slice(0, 157)}…` : description
    return `- ${plugin.fullName} (${plugin.grade ?? 'ungraded'}, score ${plugin.score ?? 'n/a'}, ${String(plugin.stars)} stars): ${summary}`
  })
  return [
    header,
    '',
    ...rows,
    '',
    'Install any of these with: dsh plugin --profile web add -w <pkg>',
  ].join('\n')
}
