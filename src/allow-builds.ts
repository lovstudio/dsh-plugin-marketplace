/**
 * Approve the install scripts a package needs, once the user has said so.
 *
 * pnpm refuses to run a dependency's build until that exact key is allowlisted,
 * which is why a git-hosted plugin can fail with nothing installed. The keys are
 * only ever taken from pnpm's own report of the run that just failed, and only
 * written after the user asks for it: running a stranger's build script is
 * exactly the decision that must stay theirs.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/** The pnpm errors that mean "a build was refused", newest name first. */
const BUILD_ERRORS = ['ERR_PNPM_IGNORED_BUILDS', 'ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED']

/** A build key as pnpm prints it: a package name, optionally with a source. */
const BUILD_KEY = /^[@A-Za-z0-9][\w.@/+-]*(?:@[^\s,]+)?$/

/** The build keys one failed run refused to run, in pnpm's own spelling. */
export function refusedBuilds(output: string): string[] {
  if (!BUILD_ERRORS.some(code => output.includes(code))) return []
  const keys: string[] = []
  const line = /Ignored build scripts:\s*([^\n]+)/g
  let match: RegExpExecArray | null = line.exec(output)
  while (match !== null) {
    for (const raw of (match[1] ?? '').split(',')) {
      const key = raw.trim().replace(/\.$/, '')
      if (BUILD_KEY.test(key) && !keys.includes(key)) keys.push(key)
    }
    match = line.exec(output)
  }
  // The older error names the package on its own line instead.
  if (keys.length === 0) {
    const named = /allowBuilds in [^\n]*\n?[^\n]*?'([^']+)'/.exec(output)?.[1]
    if (named !== undefined && BUILD_KEY.test(named)) keys.push(named)
  }
  return keys
}

/** Whether a key is safe to write into the workspace file verbatim. */
export function isBuildKey(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 512 && BUILD_KEY.test(value)
}

/**
 * Allow the given builds in a profile's pnpm workspace file.
 * @param profileDir - the profile directory.
 * @param keys - build keys, exactly as pnpm printed them.
 * @returns whether the file now allows every key.
 */
export function approveBuilds(profileDir: string, keys: readonly string[]): boolean {
  const file = join(profileDir, 'pnpm-workspace.yaml')
  let content: string
  try {
    content = readFileSync(file, 'utf8')
  } catch {
    return false
  }
  let updated = content
  for (const key of keys) {
    const quoted = `'${key.replace(/'/g, "''")}'`
    // pnpm writes the key itself with a placeholder value when it refuses a
    // build, so the common case is flipping that line rather than adding one.
    const pending = new RegExp(`^(\\s*)(?:'${escapeRegExp(key)}'|"${escapeRegExp(key)}"|${escapeRegExp(key)}):.*$`, 'm')
    if (pending.test(updated)) {
      updated = updated.replace(pending, (_row, indent: string) => `${indent}${quoted}: true`)
      continue
    }
    if (/^allowBuilds:\s*$/m.test(updated)) {
      updated = updated.replace(/^allowBuilds:\s*$/m, `allowBuilds:\n  ${quoted}: true`)
      continue
    }
    updated = `${updated.replace(/\n*$/, '\n')}allowBuilds:\n  ${quoted}: true\n`
  }
  if (updated === content) return true
  try {
    writeFileSync(file, updated)
    return true
  } catch {
    return false
  }
}

/** Escape a build key for use inside a regular expression. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
