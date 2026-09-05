/**
 * Remember what this harness already learned about a package.
 *
 * A verdict is expensive to reach — an install that had to be undone, or a
 * manifest fetched from the registry — and it stays true until the package or
 * the harness changes. Keeping it next to the profile lets the marketplace mark
 * the row on every later visit, including after a restart, instead of letting
 * the user rediscover the same failure one install at a time.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/** What the marketplace found out about one package. */
export interface PackageVerdict {
  /** Installed module name, when one is known. */
  name?: string
  /** `owner/repository` of the marketplace row this came from, when known. */
  row?: string
  /** The spec the action used, which identifies rows no module name matches. */
  spec: string
  /** Why the package was marked: unloadable, stale ranges, or not a plugin at all. */
  kind: 'load' | 'peer' | 'not-plugin'
  /** The failure, verbatim where the linker produced it. */
  reason: string
  /** When this was found, ISO 8601. */
  at: string
}

/** Verdicts of one profile, keyed by spec. */
const REPORT_FILE = 'plugin-market-report.json'

/** How many verdicts to keep, newest first. */
const REPORT_LIMIT = 200

/** Read the verdicts recorded for one profile. */
export function readVerdicts(profileDir: string): PackageVerdict[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(join(profileDir, REPORT_FILE), 'utf8'))
  } catch {
    // No report yet, or one this version cannot read: nothing is known.
    return []
  }
  if (!Array.isArray(parsed)) return []
  return parsed.filter((row): row is PackageVerdict => {
    const verdict = row as Partial<PackageVerdict> | null
    return typeof verdict?.spec === 'string'
      && (verdict.kind === 'load' || verdict.kind === 'peer' || verdict.kind === 'not-plugin')
      && typeof verdict.reason === 'string'
      && typeof verdict.at === 'string'
  })
}

/** Persist verdicts, silently: a report is a convenience, never a blocker. */
function writeVerdicts(profileDir: string, verdicts: readonly PackageVerdict[]): void {
  try {
    writeFileSync(join(profileDir, REPORT_FILE), `${JSON.stringify(verdicts.slice(0, REPORT_LIMIT), null, 2)}\n`)
  } catch {
    // A read-only profile directory costs the marks, not the action.
  }
}

/**
 * Whether two verdicts describe the same subject. Module names are deliberately
 * not compared: npm names are global while repository names are not, so several
 * unrelated rows can carry the same one.
 */
function sameSubject(a: PackageVerdict, b: { spec: string; row?: string }): boolean {
  if (a.spec === b.spec) return true
  return a.row !== undefined && b.row !== undefined && a.row.toLocaleLowerCase() === b.row.toLocaleLowerCase()
}

/** Record one verdict, replacing whatever was known about that package. */
export function recordVerdict(profileDir: string, verdict: PackageVerdict): void {
  const kept = readVerdicts(profileDir).filter(row => !sameSubject(row, verdict))
  writeVerdicts(profileDir, [verdict, ...kept])
}

/** Forget every verdict about a package, after it installed and loaded. */
export function clearVerdicts(profileDir: string, subject: { spec: string; row?: string }): void {
  const before = readVerdicts(profileDir)
  const after = before.filter(verdict => !sameSubject(verdict, subject))
  if (after.length !== before.length) writeVerdicts(profileDir, after)
}
