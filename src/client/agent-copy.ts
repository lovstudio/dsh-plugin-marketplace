/**
 * Agent-facing copy builders: the compact Markdown blocks the marketplace
 * copy actions produce. Written for a model consumer — every fact the agent
 * needs to decide or install is present, and no UI vocabulary leaks in.
 */

import type { MarketPluginSummary } from './types.ts'

/**
 * Whether a plugin row is already installed (module-name match against the
 * Host inventory).
 * @param plugin - the plugin row.
 * @param installed - installed module names from the Host inventory remote.
 * @returns whether the package or probed npm name is installed.
 */
export function isInstalled(plugin: MarketPluginSummary, installed: readonly string[]): boolean {
  if (installed.length === 0) return false
  const names = new Set(installed)
  return names.has(plugin.name) || (plugin.install?.pkgName !== undefined && names.has(plugin.install.pkgName))
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
 * Derive the uninstall command from the documented install command: same
 * invocation with `add` replaced by `remove`. Null when no install command
 * exists.
 * @param plugin - the plugin row.
 * @returns the uninstall command, or null.
 */
export function uninstallCommand(plugin: MarketPluginSummary): string | null {
  const cmd = installCommand(plugin)
  if (cmd === null) return null
  return cmd.replace(/\badd\b/, 'remove')
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
    'Install any of these with: dsh plugin --profile web add <pkg>',
  ].join('\n')
}
