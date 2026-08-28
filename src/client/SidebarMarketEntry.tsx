/**
 * Sidebar footer entry of the plugin market: a secondary destination above
 * Settings that opens the marketplace overlay. Renders the full row in the
 * wide column and a plain icon on the collapsed rail.
 */

import type { ReactNode } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { MarketEntryInjected } from './contract.ts'
import css from './SidebarMarketEntry.module.css'

/** Isometric sandbox glyph for the plugin-discovery destination. */
function MarketplaceIcon({ size }: { size: number }): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 1.45703L14.0898 4.88281L8 8.30859L1.91016 4.88281L8 1.45703Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.91016 4.88281V11.1172L8 14.543L14.0898 11.1172V4.88281M8 8.30859V14.543"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Full component props of the sidebar market entry. */
export type SidebarMarketEntryProps =
  PropsRuntime<'sidebar.footer.action'>
  & PropsLocale<'pluginMarket'>
  & MarketEntryInjected

/** Render the sidebar plugin-market entry. */
export function SidebarMarketEntry({ controller, wide, t }: SidebarMarketEntryProps): ReactNode {
  return (
    <button
      type="button"
      className={css.entry}
      data-wide={wide ? 'true' : undefined}
      aria-label={t('sidebarEntry')}
      title={wide ? undefined : t('sidebarEntry')}
      onClick={() => { controller.open() }}
    >
      <MarketplaceIcon size={wide ? 14 : 18} />
      {wide ? <span className={css.label}>{t('sidebarEntry')}</span> : null}
    </button>
  )
}
