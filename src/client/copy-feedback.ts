/**
 * Copy-to-clipboard-with-feedback hook shared by the marketplace controls:
 * writes the given text through the shared clipboard helper and flips a
 * transient `copied` flag for one second on success. A refused write leaves
 * the flag untouched, so a control never claims a copy the host declined.
 */

import { useCallback, useState } from 'react'
import { writeClipboard } from '@deepseek-ai/dsh-client-ui-primitives'

/** How long the `copied` flag stays true after a successful write, in ms. */
const COPIED_FEEDBACK_MS = 1000

/** The copy-feedback hook's return: the transient flag and the copy handler. */
export interface MarketCopyFeedback {
  /** True for {@link COPIED_FEEDBACK_MS} after a successful write. */
  copied: boolean
  /** Copy the hook's text; no-op while `copied` is still true, silent on a refused write. */
  onCopy: () => void
}

/**
 * Copy `text` to the clipboard with one-second success feedback.
 * @param text - the text to write on copy.
 * @returns the `copied` flag and the `onCopy` handler.
 */
export function useMarketCopyFeedback(text: string): MarketCopyFeedback {
  const [copied, setCopied] = useState(false)
  const onCopy = useCallback(() => {
    if (copied) return
    void writeClipboard(text).then((ok) => {
      if (!ok) return
      setCopied(true)
      window.setTimeout(() => { setCopied(false) }, COPIED_FEEDBACK_MS)
    })
  }, [copied, text])
  return { copied, onCopy }
}
