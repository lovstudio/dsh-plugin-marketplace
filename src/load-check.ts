/**
 * Check that a freshly installed package can actually be imported.
 *
 * A plugin compiled against an older harness fails when ESM links it, not when
 * pnpm installs it — and that failure aborts the whole plugin tree, so the next
 * `dsh web` dies before serving anything. The launcher is then unreachable, and
 * with it every UI that could undo the install. Importing the entry in a
 * throwaway child process reproduces exactly that link step, cheaply (tens of
 * milliseconds) and without touching the running tree, which lets the caller
 * roll the install back while the user is still looking at the page.
 */

import { spawn } from 'node:child_process'

/** How long one import may take before it counts as unloadable. */
const IMPORT_TIMEOUT = 30_000

/** Diagnostic tail kept from a failed import. */
const OUTPUT_LIMIT = 4096

export interface LoadFailure {
  /** The module specifier the profile would import at boot. */
  specifier: string
  /** The linker's own message, kept verbatim for the report. */
  detail: string
}

/** Import one module the way the launcher would, in a child process. */
function importOnce(profileDir: string, specifier: string): Promise<LoadFailure | null> {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      // The launcher path travels as argv[1] because plugins resolve the
      // harness installation from it; without it a plugin that reads it during
      // module evaluation would fail here but not under `dsh web`.
      ['--input-type=module', '-e', `await import(${JSON.stringify(specifier)})`, process.argv[1] ?? ''],
      { cwd: profileDir, env: process.env, stdio: ['ignore', 'ignore', 'pipe'] },
    )
    let output = ''
    child.stderr?.on('data', (chunk: Buffer) => { output = (output + chunk.toString('utf8')).slice(0, OUTPUT_LIMIT) })
    const timer = setTimeout(() => { child.kill('SIGKILL') }, IMPORT_TIMEOUT)
    timer.unref?.()
    child.once('error', (error) => {
      clearTimeout(timer)
      resolve({ specifier, detail: error.message })
    })
    child.once('close', (code, signal) => {
      clearTimeout(timer)
      if (code === 0) resolve(null)
      else if (signal === 'SIGKILL') resolve({ specifier, detail: `import did not settle within ${IMPORT_TIMEOUT / 1000}s` })
      else resolve({ specifier, detail: output.trim() === '' ? `import exited with code ${String(code)}` : output.trim() })
    })
  })
}

/** The first module that cannot be linked, or null when all of them can. */
export async function verifyLoadable(
  profileDir: string,
  specifiers: readonly string[],
): Promise<LoadFailure | null> {
  for (const specifier of specifiers) {
    const failure = await importOnce(profileDir, specifier)
    if (failure !== null) return failure
  }
  return null
}
