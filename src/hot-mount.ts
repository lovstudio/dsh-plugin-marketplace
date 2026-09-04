/**
 * Mount a freshly installed plugin without rebooting the launcher.
 *
 * `dsh plugin add` only registers the package in the profile manifest's
 * `dsh.profile.bundles`, and that layer is read once at boot, so the plugin
 * normally waits for a restart. The Loader can create the same entries at
 * runtime instead. They are created in the Loader root — a sibling of the boot
 * include, not a member of it — because the include re-applies every bundle
 * patch on each reload, and an entry living inside it would be inserted a
 * second time and abort the tree with a duplicate id. `Loader.write` is a
 * no-op, so nothing reaches disk and the next boot mounts the package from its
 * bundle layer exactly as if it had never run.
 */

import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { JSON_SCHEMA, load } from 'js-yaml'

/** One Loader entry a package's bundle patch contributes to the tree root. */
export interface BundleEntry {
  /** Module specifier of the entry, as the bundle patch declares it. */
  name: string
  config?: unknown
}

/** The Loader surface used to mount and drop entries at runtime. */
export interface LoaderLike {
  create(options: { name: string; config?: unknown }): Promise<string>
  remove(id: string): Promise<void>
}

/** Directory of one profile, resolved the way the launcher resolves its home. */
export function resolveProfileDir(profile: string): string {
  const configured = process.env.DSH_HOME
  const home = configured !== undefined && configured.trim().length > 0 ? configured : join(homedir(), '.dsh')
  const expanded = home === '~' ? homedir() : home.startsWith('~/') ? join(homedir(), home.slice(2)) : home
  return join(resolve(expanded), 'profiles', profile)
}

/** Bundle names the profile manifest declares, in application order. */
export function readBundles(profileDir: string): string[] {
  try {
    const manifest = JSON.parse(readFileSync(join(profileDir, 'package.json'), 'utf8')) as {
      dsh?: { profile?: { bundles?: unknown } }
    }
    const bundles = manifest.dsh?.profile?.bundles
    return Array.isArray(bundles) ? bundles.filter((name): name is string => typeof name === 'string') : []
  } catch {
    // An unreadable manifest means "nothing known to be registered", which
    // only makes the caller skip work.
    return []
  }
}

/** Bundle names the profile manifest gained or lost across one CLI run. */
export function bundleDelta(before: readonly string[], after: readonly string[]): {
  added: string[]
  removed: string[]
} {
  const had = new Set(before)
  const has = new Set(after)
  return {
    added: after.filter(name => !had.has(name)),
    removed: before.filter(name => !has.has(name)),
  }
}

/** Read and parse one package's declared bundle patch, or null. */
function bundlePatch(profileDir: string, pkg: string): unknown[] | null {
  const packageDir = join(profileDir, 'node_modules', ...pkg.split('/'))
  try {
    const manifest = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8')) as {
      dsh?: { bundle?: { patch?: unknown } }
    }
    const declared = manifest.dsh?.bundle?.patch
    if (typeof declared !== 'string' || declared.length === 0) return null
    // JSON_SCHEMA rejects the `!!js` expressions the launcher evaluates at boot,
    // which is the intent: an entry this cannot reproduce must fall back.
    const parsed = load(readFileSync(join(packageDir, declared), 'utf8'), { schema: JSON_SCHEMA })
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

/**
 * The root entries one installed package contributes, or null when its bundle
 * patch does something runtime creation cannot reproduce: inserting into a
 * group, overriding an entry another layer owns, or declaring a group of its
 * own. Those still need a restart, so reporting null keeps the caller honest.
 */
export function bundleEntries(profileDir: string, pkg: string): BundleEntry[] | null {
  const patch = bundlePatch(profileDir, pkg)
  if (patch === null) return null
  const entries: BundleEntry[] = []
  for (const row of patch) {
    if (row === null || typeof row !== 'object') return null
    const { id, insert, ...rest } = row as { id?: unknown; insert?: unknown }
    // An `id` selects an existing entry: a nested insert or an override of a
    // row this package does not own.
    if (id !== undefined || !Array.isArray(insert) || Object.keys(rest).length > 0) return null
    for (const item of insert) {
      if (item === null || typeof item !== 'object') return null
      const entry = item as { name?: unknown; config?: unknown; group?: unknown }
      if (typeof entry.name !== 'string' || entry.name.length === 0 || entry.group === true) return null
      entries.push(entry.config === undefined ? { name: entry.name } : { name: entry.name, config: entry.config })
    }
  }
  return entries.length === 0 ? null : entries
}

/** Loader entry ids this process created for each hot-mounted package. */
const mounted = new Map<string, string[]>()

/**
 * Create the entries of one installed package so it runs immediately.
 * @returns true when the whole package is now mounted.
 */
export async function hotMount(
  loader: LoaderLike,
  profileDir: string,
  pkg: string,
  warn: (reason: string) => void = () => {},
): Promise<boolean> {
  await hotUnmount(loader, pkg)
  const entries = bundleEntries(profileDir, pkg)
  if (entries === null) {
    warn(`${pkg}: its bundle patch cannot be reproduced at runtime`)
    return false
  }
  const ids: string[] = []
  try {
    for (const entry of entries) ids.push(await loader.create(entry))
  } catch (error: unknown) {
    // A half-mounted package is worse than none: drop what was created and let
    // the caller fall back to a restart. Re-installing a package that is
    // already running reaches this, because the second instance collides with
    // the first over the services it registers.
    for (const id of ids.reverse()) await loader.remove(id).catch(() => {})
    warn(`${pkg}: ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
  mounted.set(pkg, ids)
  return true
}

/**
 * Drop the entries this process created for one package.
 * @returns true when something was actually running and is now gone.
 */
export async function hotUnmount(loader: LoaderLike, pkg: string): Promise<boolean> {
  const ids = mounted.get(pkg)
  if (ids === undefined) return false
  mounted.delete(pkg)
  for (const id of [...ids].reverse()) await loader.remove(id).catch(() => {})
  return true
}
