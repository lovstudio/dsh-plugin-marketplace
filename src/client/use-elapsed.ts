/**
 * Elapsed-time readout for an operation whose only progress signal is that it
 * is still running: the `dsh plugin` CLI reports nothing until it exits, so the
 * marketplace shows how long it has been working instead of a fake percentage.
 */

import { useEffect, useState } from 'react'

/** Refresh cadence of the readout. */
const TICK_MS = 1_000

/**
 * Whole seconds since `startedAt`, refreshed once per second.
 * @param startedAt - epoch milliseconds the operation started, or undefined
 *   when nothing is running.
 * @returns elapsed whole seconds; zero when nothing is running.
 */
export function useElapsedSeconds(startedAt: number | undefined): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (startedAt === undefined) return undefined
    setNow(Date.now())
    const timer = setInterval(() => { setNow(Date.now()) }, TICK_MS)
    return () => { clearInterval(timer) }
  }, [startedAt])
  if (startedAt === undefined) return 0
  return Math.max(0, Math.floor((now - startedAt) / 1_000))
}
