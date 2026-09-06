/** Staged plugin-configuration card over the marketplace settings namespace. */

import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { SettingsScope } from '@deepseek-ai/dsh-client-ui-settings/client'
import {
  DEFAULT_MARKET_PROVIDER, type MarketProviderId, type MarketSettings,
} from '../market-settings.ts'

/** One typed field as the marketplace card renders it. */
export interface MarketSettingsFieldState<T> {
  /** Effective value, including a staged edit. */
  value: T
  /** Whether saving leaves a user-layer override for this field. */
  overridden: boolean
}

/** Marketplace plugin-card projection. */
export interface MarketSettingsCardState {
  /** Whether the Host serves the marketplace namespace. */
  available: boolean
  /** Whether the settings document accepts writes. */
  writable: boolean
  /** Whether saving would write at least one change. */
  dirty: boolean
  /** Whether a save is crossing the Host boundary. */
  saving: boolean
  /** Whether the last save did not land as staged. */
  failed: boolean
  /** Selected catalog provider. */
  provider: MarketSettingsFieldState<MarketProviderId>
  /** Startup synchronization preference. */
  syncOnStartup: MarketSettingsFieldState<boolean>
  /** Write-only GitHub credential staged outside the settings document. */
  githubToken: {
    value: string
    configured: boolean
    writable: boolean
    suffix?: string
    testStatus: 'idle' | 'testing' | 'success' | 'error'
    testDetail?: string
    /** Whether the tested token may star repositories. */
    canStar?: boolean
  }
}

/** Registration-private face for the marketplace plugin card. */
export interface MarketSettingsCardInjected {
  hooks: {
    /** Card snapshot bound by the renderer as useMarketSettingsCard. */
    marketSettingsCard: SnapshotStore<MarketSettingsCardState>
  }
  /** Stage a provider choice. */
  selectProvider(provider: MarketProviderId): void
  /** Stage the startup synchronization preference. */
  setSyncOnStartup(enabled: boolean): void
  /** Stage a replacement GitHub token. */
  setGithubToken(value: string): void
  /** Test the staged token, or the stored token while the field is blank. */
  testGithubToken(): void
  /** Stage one field's return to its composition/default value. */
  resetField(field: keyof MarketSettings): void
  /** Persist every staged edit. */
  save(): void
  /** Drop every staged edit. */
  discard(): void
}

type Draft<T> = { kind: 'set'; value: T } | { kind: 'clear' }
/**
 * The `remote.credentials` face the card reads and writes through — a
 * structural mirror of the harness namespace its own settings cards use, so
 * the plugin needs no `connection.api` surface (removed after 0.1.2-alpha).
 */
export interface CredentialRemote {
  describe(refs: readonly string[]): Promise<{
    ok: boolean
    value?: Record<string, { configured?: boolean; writable?: boolean; suffix?: string } | undefined>
  }>
  /** Remote failures resolve with `ok: false`; transport failures may reject. */
  set(ref: string, value: string): Promise<{ ok: boolean }>
}
type MarketCredentialProbe = (token?: string) => Promise<{ login: string; canStar: boolean }>

/** Owns the marketplace card's drafts and revision-fenced settings writes. */
export class MarketSettingsCardController {
  private readonly scope: SettingsScope<MarketSettings>
  private readonly credentials: CredentialRemote
  private readonly probeCredential: MarketCredentialProbe
  private readonly store: SnapshotStore<MarketSettingsCardState>
  private readonly unsubscribe: () => void
  private providerDraft: Draft<MarketProviderId> | undefined
  private syncDraft: Draft<boolean> | undefined
  private saving = false
  private failed = false
  private githubTokenDraft = ''
  private githubTokenConfigured = false
  private githubTokenWritable = true
  private githubTokenSuffix: string | undefined
  private githubTokenTestRevision = 0
  private githubTokenTest: { status: 'idle' | 'testing' | 'success' | 'error'; detail?: string; canStar?: boolean } = { status: 'idle' }

  /** @param scope - Host-backed `ui-plugin-market` settings scope. */
  constructor(
    scope: SettingsScope<MarketSettings>,
    credentials: CredentialRemote,
    probeCredential: MarketCredentialProbe,
  ) {
    this.scope = scope
    this.credentials = credentials
    this.probeCredential = probeCredential
    this.store = createSnapshotStore(this.projection())
    this.unsubscribe = scope.subscribe(() => { this.publish() })
    void this.readGithubToken()
  }

  /** Stop following the settings scope. */
  dispose(): void {
    this.unsubscribe()
  }

  /**
   * Project the controller into the card registration face.
   * @returns the snapshot and actions injected into the card registration.
   */
  inject(): MarketSettingsCardInjected {
    return {
      hooks: { marketSettingsCard: this.store },
      selectProvider: (provider) => { this.stageProvider({ kind: 'set', value: provider }) },
      setSyncOnStartup: (enabled) => { this.stageSync({ kind: 'set', value: enabled }) },
      setGithubToken: (value) => {
        this.githubTokenTestRevision += 1
        this.githubTokenDraft = value
        this.githubTokenTest = { status: 'idle' }
        this.failed = false
        this.publish()
      },
      testGithubToken: () => { void this.testGithubToken() },
      resetField: (field) => {
        if (field === 'provider') this.stageProvider({ kind: 'clear' })
        else this.stageSync({ kind: 'clear' })
      },
      save: () => { void this.save() },
      discard: () => { this.discard() },
    }
  }

  private stageProvider(draft: Draft<MarketProviderId>): void {
    this.providerDraft = draft
    this.failed = false
    this.publish()
  }

  private stageSync(draft: Draft<boolean>): void {
    this.syncDraft = draft
    this.failed = false
    this.publish()
  }

  private discard(): void {
    if (this.providerDraft === undefined && this.syncDraft === undefined
      && this.githubTokenDraft.length === 0 && !this.failed) return
    this.providerDraft = undefined
    this.syncDraft = undefined
    this.githubTokenDraft = ''
    this.githubTokenTestRevision += 1
    this.githubTokenTest = { status: 'idle' }
    this.failed = false
    this.publish()
  }

  private async save(): Promise<void> {
    const plan = this.plan()
    const token = this.githubTokenDraft.trim()
    if ((plan.length === 0 && token.length === 0) || this.saving) return
    this.saving = true
    this.failed = false
    this.publish()
    let landed = true
    if (token.length > 0) {
      this.githubTokenTestRevision += 1
      try {
        const response = await this.credentials.set('GITHUB_TOKEN', token)
        landed = response.ok
      } catch (_credentialWriteFailure) {
        landed = false
      }
      const refreshed = await this.readGithubToken()
      landed = refreshed && this.githubTokenConfigured && landed
      this.githubTokenTest = { status: 'idle' }
    }
    for (const write of plan) {
      try {
        if (write.draft.kind === 'clear') {
          await this.scope.unset(write.field)
          landed = !this.stored(write.field) && landed
        } else {
          await this.scope.set(write.field, write.draft.value)
          landed = this.userLayer()?.[write.field] === write.draft.value && landed
        }
      } catch (_settingsWriteFailure) {
        landed = false
      }
    }
    if (landed) {
      this.providerDraft = undefined
      this.syncDraft = undefined
      this.githubTokenDraft = ''
    }
    this.saving = false
    this.failed = !landed
    this.publish()
  }

  private plan(): Array<
    { field: 'provider'; draft: Draft<MarketProviderId> }
    | { field: 'syncOnStartup'; draft: Draft<boolean> }
  > {
    const value = this.sectionValue()
    const plan: Array<
      { field: 'provider'; draft: Draft<MarketProviderId> }
      | { field: 'syncOnStartup'; draft: Draft<boolean> }
    > = []
    if (this.providerDraft?.kind === 'clear') {
      if (this.stored('provider')) plan.push({ field: 'provider', draft: this.providerDraft })
    } else if (this.providerDraft !== undefined && this.providerDraft.value !== value.provider) {
      plan.push({ field: 'provider', draft: this.providerDraft })
    }
    if (this.syncDraft?.kind === 'clear') {
      if (this.stored('syncOnStartup')) plan.push({ field: 'syncOnStartup', draft: this.syncDraft })
    } else if (this.syncDraft !== undefined && this.syncDraft.value !== value.syncOnStartup) {
      plan.push({ field: 'syncOnStartup', draft: this.syncDraft })
    }
    return plan
  }

  private projection(): MarketSettingsCardState {
    const snapshot = this.scope.getSnapshot()
    const value = this.sectionValue()
    const base = this.baseValue()
    return {
      available: snapshot.status === 'ready',
      writable: snapshot.writable,
      dirty: this.plan().length > 0 || this.githubTokenDraft.trim().length > 0,
      saving: this.saving,
      failed: this.failed,
      provider: {
        value: this.providerDraft?.kind === 'set'
          ? this.providerDraft.value
          : this.providerDraft?.kind === 'clear' ? base.provider : value.provider,
        overridden: this.providerDraft?.kind === 'set'
          ? true
          : this.providerDraft?.kind === 'clear' ? false : this.stored('provider'),
      },
      syncOnStartup: {
        value: this.syncDraft?.kind === 'set'
          ? this.syncDraft.value
          : this.syncDraft?.kind === 'clear' ? base.syncOnStartup : value.syncOnStartup,
        overridden: this.syncDraft?.kind === 'set'
          ? true
          : this.syncDraft?.kind === 'clear' ? false : this.stored('syncOnStartup'),
      },
      githubToken: {
        value: this.githubTokenDraft,
        configured: this.githubTokenConfigured,
        writable: this.githubTokenWritable,
        ...this.githubTokenSuffix === undefined ? {} : { suffix: this.githubTokenSuffix },
        testStatus: this.githubTokenTest.status,
        ...this.githubTokenTest.detail === undefined ? {} : { testDetail: this.githubTokenTest.detail },
        ...this.githubTokenTest.canStar === undefined ? {} : { canStar: this.githubTokenTest.canStar },
      },
    }
  }

  private sectionValue(): MarketSettings {
    return this.scope.getSnapshot().value ?? {
      provider: DEFAULT_MARKET_PROVIDER,
      syncOnStartup: true,
    }
  }

  private baseValue(): MarketSettings {
    const base = this.scope.getSnapshot().base as Partial<MarketSettings> | undefined
    return {
      provider: base?.provider ?? DEFAULT_MARKET_PROVIDER,
      syncOnStartup: base?.syncOnStartup ?? true,
    }
  }

  private userLayer(): Partial<MarketSettings> | undefined {
    return this.scope.getSnapshot().user as Partial<MarketSettings> | undefined
  }

  private stored(field: keyof MarketSettings): boolean {
    const user = this.userLayer()
    return user !== undefined && Object.hasOwn(user, field)
  }

  private publish(): void {
    const next = this.projection()
    const previous = this.store.getSnapshot()
    if (previous.available === next.available
      && previous.writable === next.writable
      && previous.dirty === next.dirty
      && previous.saving === next.saving
      && previous.failed === next.failed
      && previous.provider.value === next.provider.value
      && previous.provider.overridden === next.provider.overridden
      && previous.syncOnStartup.value === next.syncOnStartup.value
      && previous.syncOnStartup.overridden === next.syncOnStartup.overridden
      && previous.githubToken.value === next.githubToken.value
      && previous.githubToken.configured === next.githubToken.configured
      && previous.githubToken.writable === next.githubToken.writable
      && previous.githubToken.suffix === next.githubToken.suffix
      && previous.githubToken.testStatus === next.githubToken.testStatus
      && previous.githubToken.testDetail === next.githubToken.testDetail) return
    this.store.set(next)
  }

  /**
   * Re-read the write-only GitHub credential after a Host invalidation.
   * @param ref - invalidated Host credential reference.
   */
  refreshCredential(ref: string): void {
    if (ref === 'GITHUB_TOKEN') void this.readGithubToken()
  }

  private async testGithubToken(): Promise<void> {
    if (this.githubTokenTest.status === 'testing') return
    const token = this.githubTokenDraft.trim()
    const revision = ++this.githubTokenTestRevision
    if (token.length === 0 && !this.githubTokenConfigured) return
    this.githubTokenTest = { status: 'testing' }
    this.publish()
    try {
      const result = await this.probeCredential(token.length === 0 ? undefined : token)
      if (revision !== this.githubTokenTestRevision) return
      this.githubTokenTest = { status: 'success', detail: result.login, canStar: result.canStar }
    } catch (error: unknown) {
      if (revision !== this.githubTokenTestRevision) return
      this.githubTokenTest = {
        status: 'error',
        detail: error instanceof Error ? error.message : String(error),
      }
    }
    this.publish()
  }

  private async readGithubToken(): Promise<boolean> {
    try {
      const response = await this.credentials.describe(['GITHUB_TOKEN'])
      if (!response.ok) return false
      const view = response.value?.GITHUB_TOKEN
      const configured = view?.configured ?? false
      const writable = view?.writable ?? true
      const suffix = view?.suffix
      if (configured === this.githubTokenConfigured && writable === this.githubTokenWritable
        && suffix === this.githubTokenSuffix) return true
      this.githubTokenConfigured = configured
      this.githubTokenWritable = writable
      this.githubTokenSuffix = suffix
      this.publish()
      return true
    } catch (_credentialReadFailure) {
      // Settings remain usable; the Host authoritatively accepts or refuses the next write.
      return false
    }
  }
}
