/**
 * Work out what a repository row actually installs.
 *
 * A catalog row is a repository, but a repository is not always a package. The
 * common shape that breaks is a monorepo whose root manifest is `private` and
 * whose plugin ships as one of its published packages — installing the
 * repository then either fails outright or lands a root that mounts nothing.
 * The author already wrote the right command in the README, so read it there,
 * verify the package really belongs to this repository, and install that.
 */

import { declaresBundle, fetchPublished, publishedFromRepository } from './npm-identity.ts'

/** Where a repository's README may live, in the order worth trying. */
const README_FILES = ['README.md', 'README.zh.md', 'README.zh-CN.md', 'readme.md']

/** What to install for one repository row. */
export type RepositoryResolution =
  /** Install this spec: either the repository itself or the package it documents. */
  | { spec: string; documented?: string }
  /** Nothing installable was found; the reason is written for the user. */
  | { unusable: string }

/** Read one file from a repository's default branch. */
async function readRepositoryFile(fullName: string, file: string): Promise<string | null> {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/${fullName}/HEAD/${file}`, {
      headers: { accept: 'text/plain' },
    })
    return response.ok ? await response.text() : null
  } catch {
    return null
  }
}

/** Package specs the README documents for `dsh plugin add`, in order. */
export function documentedPackages(readme: string): string[] {
  const specs: string[] = []
  const line = /dsh plugin[^\n]*?\badd\b([^\n]*)/g
  let match: RegExpExecArray | null = line.exec(readme)
  while (match !== null) {
    for (const word of (match[1] ?? '').split(/\s+/)) {
      // Local paths belong to a from-source install, and a repository spec is
      // what the caller already tried.
      if (word.length === 0 || word.startsWith('-') || word.startsWith('.')) continue
      if (word.startsWith('github:') || word.startsWith('link:') || word.startsWith('`')) continue
      const spec = word.replace(/[`'",;\\]/g, '')
      if (/^@?[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(spec) && !specs.includes(spec)) specs.push(spec)
    }
    match = line.exec(readme)
  }
  return specs
}

/**
 * Resolve what a `github:owner/repo` install should really run.
 * @param fullName - `owner/repository` of the row.
 * @param spec - the repository spec the catalog documented.
 * @returns the spec to install, or why nothing can be.
 */
export async function resolveRepositorySpec(fullName: string, spec: string): Promise<RepositoryResolution> {
  const manifest = await readRepositoryFile(fullName, 'package.json')
  if (manifest === null) return { spec }
  let root: { private?: unknown; dsh?: unknown }
  try {
    root = JSON.parse(manifest) as { private?: unknown; dsh?: unknown }
  } catch {
    return { spec }
  }
  // A public root that mounts a bundle is the package: install it as it stands.
  if (root.private !== true) return { spec }
  // A private root is not meant to be consumed as a package. It may still carry
  // a bundle patch — this repository's does — but that patch mounts workspace
  // packages a git install never brings, so prefer what the README publishes.
  for (const file of README_FILES) {
    const readme = await readRepositoryFile(fullName, file)
    if (readme === null) continue
    for (const candidate of documentedPackages(readme)) {
      const published = await fetchPublished(candidate)
      if (published === null) continue
      if (publishedFromRepository(published, fullName) && declaresBundle(published)) {
        return { spec: candidate, documented: candidate }
      }
    }
    break
  }
  // Nothing published matched, so the repository spec is the only candidate
  // left; it works for a private root that mounts only itself.
  if (declaresBundle(root)) return { spec }
  return {
    unusable: [
      `${fullName} is a private workspace root: it declares no dsh.bundle.patch, so installing the`,
      'repository mounts nothing. Its plugin ships as a published package instead, and this could not',
      'find which one — follow the install command in the repository README.',
    ].join('\n'),
  }
}
