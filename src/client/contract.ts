/**
 * Marketplace slot contract: the slot keys the surfaces mount under, the
 * registrant-side injected face, and the component props compositions.
 */

import type { MarketController } from './market-controller.ts'

/** Slot keys the shared marketplace surfaces mount under (all root scope). */
export type MarketSlotKey = 'settings.plugins.tab' | 'shell.overlay' | 'sidebar.footer.action'

/** Registrant-private business face shared by the marketplace surfaces. */
export interface MarketplaceInjected {
  /** The marketplace controller (state mutations + orchestration). */
  controller: MarketController
  /** Active UI locale ('zh' for any zh-* id), for localized copy preference. */
  locale: 'zh' | 'en'
  hooks: {
    /** Controller snapshot bound by the UI renderer as `useView`. */
    view: MarketController['store']
  }
}

/** Narrower face of the sidebar entry (it only opens the overlay). */
export interface MarketEntryInjected {
  /** The marketplace controller (state mutations + orchestration). */
  controller: MarketController
}
