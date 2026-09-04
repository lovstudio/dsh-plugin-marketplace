/**
 * Marketplace-owned glyphs. The shared primitive set carries no star, so the
 * two star states are drawn here against the same contract every `ic_ds_*`
 * icon follows: a 16-unit square viewBox, a `size` prop, and `currentColor`.
 */

import type { ReactNode } from 'react'

/** Shared props of the marketplace glyphs (mirrors the primitives' IconProps). */
export interface MarketIconProps {
  /** Square edge in px. */
  size?: number | undefined
  /** Extra class for layout placement; color rides currentColor. */
  className?: string | undefined
}

const STAR_PATH = 'M8 1.6l1.86 3.77 4.16.61-3.01 2.93.71 4.14L8 11.1l-3.72 1.95.71-4.14L1.98 5.98l4.16-.61L8 1.6z'

/** Hollow star: the repository is not starred by the authenticated user. */
export function IconStarOutline16({ size = 16, className }: MarketIconProps): ReactNode {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={STAR_PATH} stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

/** Filled star: the repository is starred by the authenticated user. */
export function IconStarFill16({ size = 16, className }: MarketIconProps): ReactNode {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={STAR_PATH} fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}
