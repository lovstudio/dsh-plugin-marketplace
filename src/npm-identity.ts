/**
 * Decide whether a published npm package really is a repository's plugin.
 *
 * npm names are global and first-come while repository names are not, so a name
 * that resolves on the registry proves nothing about who published it: the
 * repository `maddogfinance/dsh-trading` shares its name with an unrelated
 * `dsh-trading` package. Two facts settle it — the package points back at the
 * repository, and it mounts itself as a DSH bundle.
 */

/** The published manifest fields this module judges. */
export interface PublishedManifest {
  name?: unknown
  repository?: unknown
  dsh?: unknown
}

/** Read one package's published manifest at `latest`, or null. */
export async function fetchPublished(name: string): Promise<PublishedManifest | null> {
  const path = name.split('/').map(encodeURIComponent).join('/')
  try {
    const response = await fetch(`https://registry.npmjs.org/${path}/latest`, {
      headers: { accept: 'application/json' },
    })
    if (!response.ok) return null
    return JSON.parse(await response.text()) as PublishedManifest
  } catch {
    return null
  }
}

/** The `owner/repository` a manifest's repository field points at. */
export function publishedRepository(published: PublishedManifest): string | null {
  const field = published.repository
  const url = typeof field === 'string' ? field : (field as { url?: unknown } | null)?.url
  if (typeof url !== 'string') return null
  const match = /github\.com[/:]([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+?)(?:\.git)?(?:[#/?].*)?$/.exec(url)
  return match === null ? null : `${match[1]!}/${match[2]!}`
}

/** Whether the published package names this repository as its source. */
export function publishedFromRepository(published: PublishedManifest, fullName: string): boolean {
  const declared = publishedRepository(published)
  return declared !== null && declared.toLocaleLowerCase() === fullName.toLocaleLowerCase()
}

/** Whether a manifest mounts itself as a DSH bundle. */
export function declaresBundle(published: { dsh?: unknown }): boolean {
  const patch = (published.dsh as { bundle?: { patch?: unknown } } | null)?.bundle?.patch
  return typeof patch === 'string' && patch.length > 0
}
