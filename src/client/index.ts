/**
 * Plugin marketplace, browser half: registers the three marketplace surfaces
 * — the Settings Plugins tab, the sidebar region entry, the shell overlay,
 * — over shared marketplace state.
 *
 * dshfind synchronization writes one complete validated snapshot to
 * IndexedDB; every browse, search, detail, facet, sort, and paging read stays
 * local. Install and uninstall run through the loopback-pinned
 * `pluginManager` Remote (pnpm in the managed profile); the success banner
 * delegates restart to `ctx.betterRestartUi`, which reboots the Host tree and
 * reloads the browser after its replacement connection arrives. Installed-
 * state badges come from the Host pluginInventory remote and refresh after
 * each successful operation.
 */

import z from '@deepseek-ai/schemastery'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { ConnectionHandle } from '@deepseek-ai/dsh-api-remotes/client'
import pluginMarketGithubRemote from '@lovstudio/dsh-plugin-marketplace/remote'
// Type-only: the ctx.remote Context merge and the inventory snapshot type.
import type {} from '@deepseek-ai/dsh-api-remotes/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: the shared browser restart service and its Context merge.
import type {} from '@deepseek-ai/dsh-better-restart-ui/client'
// Type-only: SlotMap declarations of the settings tab, the layout overlay,
// and the sidebar region entry.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import {
  createGithubMarketApi, createMarketApi, createMarketProviderRouter, DEFAULT_MARKET_BASE_URL,
} from './api.ts'
import type { MarketplaceInjected, MarketEntryInjected } from './contract.ts'
import { MarketController } from './market-controller.ts'
import { en, zh, type PluginMarketKey } from './locales.ts'
import { MarketplaceRoot } from './MarketplaceRoot.tsx'
import { MarketOverlay } from './MarketOverlay.tsx'
import { MarketSettingsCard } from './MarketSettingsCard.tsx'
import { MarketSettingsCardController } from './market-settings-card-controller.ts'
import { SidebarMarketEntry } from './SidebarMarketEntry.tsx'
import {
  DEFAULT_MARKET_PROVIDER, MARKET_SETTINGS_NAMESPACE, type MarketSettings,
} from '../market-settings.ts'

export type { MarketplaceInjected, MarketEntryInjected } from './contract.ts'
export type { MarketplaceRootProps } from './MarketplaceRoot.tsx'
export type { MarketOverlayProps } from './MarketOverlay.tsx'
export type { MarketSettingsCardProps } from './MarketSettingsCard.tsx'
export type {
  MarketSettingsCardInjected, MarketSettingsCardState, MarketSettingsFieldState,
} from './market-settings-card-controller.ts'
export type { SidebarMarketEntryProps } from './SidebarMarketEntry.tsx'
export type { MarketController } from './market-controller.ts'
export type { MarketViewState, MarketListStatus, MarketDetailStatus, MarketPagingMode } from './market-store.ts'
export type { ParsedMarketQuery, ParsedFieldFilters } from './search.ts'
export type { MarketApi, MarketCategoryFacet, MarketProvider } from './api.ts'
export type { PluginMarketKey } from './locales.ts'
export type { MarketProviderId, MarketSettings } from '../market-settings.ts'
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Plugin marketplace surfaces copy. */
    pluginMarket: PluginMarketKey
  }
}

/** Dictionary namespace owned by this plugin. */
export const NS = 'pluginMarket'

/** Plugin config: deployment-varying marketplace endpoints. */
export interface MarketConfig {
  /** Catalog API base URL (defaults to the dshfind production environment). */
  baseUrl?: string
}

/** Config boundary: a malformed entry fails the load loudly here. */
export const Config = z.object({
  baseUrl: z.string().default(DEFAULT_MARKET_BASE_URL),
})

/** Required services (cordis fiber inject). Every `remote.<ns>` the plugin
 * touches must be declared, or the Cordis tracker rejects the access. */
export const inject = [
  'slots', 'locale', 'connection', 'remote', 'settingsScope',
  'remote.pluginInventory', 'remote.pluginManager', 'betterRestartUi',
]

/** Map a locale id onto the description-locale preference of agent copy. */
function localeOf(active: string): 'zh' | 'en' {
  return active.startsWith('zh') ? 'zh' : 'en'
}

/**
 * Mount the marketplace surfaces on one shared controller.
 * @param ctx - client root context.
 * @param config - resolved plugin config (schema defaults applied).
 */
export async function apply(ctx: ClientContext, config?: MarketConfig): Promise<void> {
  const disposeGithubRemote = await ctx.remote.$mount(pluginMarketGithubRemote)
  ctx.effect(
    () => disposeGithubRemote,
    'ui-plugin-market: GitHub Remote contribution',
  )
  const { api: connectionApi } = ctx.get('connection') as ConnectionHandle
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-plugin-market: dictionaries')

  const providerRouter = createMarketProviderRouter({
    dshfind: createMarketApi(config?.baseUrl ?? DEFAULT_MARKET_BASE_URL),
    github: createGithubMarketApi(async (request) => {
      const response = await ctx.remote.pluginMarketGithub.search(request)
      if (!response.ok) {
        throw new Error(`pluginMarketGithub.search failed: ${response.error.code}: ${response.error.message}`)
      }
      return response.value
    }),
  }, DEFAULT_MARKET_PROVIDER)
  const controller = new MarketController({
    api: providerRouter.provider,
    installed: async () => {
      const remote = ctx.get('remote')
      /* v8 ignore next -- 'remote' is a declared injection, so the registry
       * always satisfies it before this closure can run. */
      if (remote === undefined) throw new Error('remote service unavailable')
      const result = await remote.pluginInventory.list()
      if (!result.ok) {
        throw new Error(`pluginInventory.list failed: ${result.error.code}: ${result.error.message}`)
      }
      return result.value.entries.map(entry => entry.moduleName)
    },
    install: async (packageName) => {
      const remote = ctx.get('remote')
      if (remote === undefined) throw new Error('remote service unavailable')
      const result = await remote.pluginManager.install(packageName)
      if (!result.ok) {
        return {
          ok: false,
          exitCode: -1,
          error: `${result.error.code}: ${result.error.message}`,
        }
      }
      return result.value
    },
    uninstall: async (packageName) => {
      const remote = ctx.get('remote')
      if (remote === undefined) throw new Error('remote service unavailable')
      const result = await remote.pluginManager.uninstall(packageName)
      if (!result.ok) {
        return {
          ok: false,
          exitCode: -1,
          error: `${result.error.code}: ${result.error.message}`,
        }
      }
      return result.value
    },
    approveBuilds: async (packageNames) => {
      const remote = ctx.get('remote')
      if (remote === undefined) throw new Error('remote service unavailable')
      const result = await remote.pluginManager.approveBuilds([...packageNames])
      if (!result.ok) {
        throw new Error(`pluginManager.approveBuilds failed: ${result.error.code}: ${result.error.message}`)
      }
      return result.value
    },
    status: () => ctx.betterRestartUi.status(),
    restart: () => {
      ctx.betterRestartUi.restart()
      return Promise.resolve()
    },
  })
  const settings = ctx.settingsScope.bind<MarketSettings>({ namespace: MARKET_SETTINGS_NAMESPACE })
  const settingsCard = new MarketSettingsCardController(settings, connectionApi, async (token) => {
    const response = await ctx.remote.pluginMarketGithub.probeCredential(token === undefined ? {} : { token })
    if (!response.ok) {
      throw new Error(`pluginMarketGithub.probeCredential failed: ${response.error.message}`)
    }
    return response.value
  })
  ctx.effect(
    () => () => { settingsCard.dispose() },
    'ui-plugin-market: settings card',
  )
  let startupHandled = false
  const applyStartupPreference = (): void => {
    const snapshot = settings.getSnapshot()
    if (snapshot.status !== 'ready' || snapshot.value === undefined) return
    const changed = providerRouter.selected() !== snapshot.value.provider
    providerRouter.select(snapshot.value.provider)
    if (!startupHandled) {
      startupHandled = true
      if (snapshot.value.syncOnStartup) void controller.syncCatalog()
    } else if (changed) {
      void controller.syncCatalog(true)
    }
  }
  applyStartupPreference()
  ctx.effect(
    () => settings.subscribe(applyStartupPreference),
    'ui-plugin-market: startup synchronization preference',
  )
  void controller.refreshInstalled()
  ctx.effect(
    () => ctx.on('connection/reset', () => { void controller.refreshInstalled() }),
    'ui-plugin-market: installed-name refresh',
  )
  ctx.effect(
    () => ctx.remote.$on('credentials/updated', (ref) => {
      settingsCard.refreshCredential(ref)
      if (ref === 'GITHUB_TOKEN' && providerRouter.selected() === 'github') void controller.syncCatalog(true)
    }),
    'ui-plugin-market: GitHub credential refresh',
  )

  const marketInjected = (): MarketplaceInjected => ({
    controller,
    locale: localeOf(ctx.locale.getSnapshot().active),
    hooks: { view: controller.store },
  })
  const entryInjected = (): MarketEntryInjected => ({ controller })

  // The Settings Plugins tab, ordered after the installed-plugin inventory.
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'market',
    order: 20,
    label: () => t('tab'),
    locale: NS,
    inject: marketInjected,
  }, MarketplaceRoot))

  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    key: MARKET_SETTINGS_NAMESPACE,
    locale: NS,
    inject: () => settingsCard.inject(),
  }, MarketSettingsCard))

  // The sidebar footer entry above Settings opens the overlay.
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'plugin-market',
    order: 0,
    label: () => t('sidebarEntry'),
    locale: NS,
    inject: entryInjected,
  }, SidebarMarketEntry))

  // The frame-wide overlay modal (the additive shell.overlay seat).
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'plugin-market',
    order: 0,
    locale: NS,
    inject: marketInjected,
  }, MarketOverlay))
}
