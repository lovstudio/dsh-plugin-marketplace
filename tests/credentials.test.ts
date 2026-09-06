import assert from 'node:assert/strict'
import { setImmediate } from 'node:timers/promises'
import { test } from 'node:test'
import { MarketSettingsCardController } from '../src/client/market-settings-card-controller.ts'

async function fixture(t: { after: (fn: () => void) => void }, set: () => Promise<{ ok: boolean }>,
  describe = async () => ({ ok: true, value: { GITHUB_TOKEN: { configured: true, suffix: 'old1' } } }),
  probe = async (_token?: string) => ({ login: 'tester', canStar: true })) {
  const controller = new MarketSettingsCardController({
    getSnapshot: () => ({ status: 'ready', writable: true, value: { provider: 'github', syncOnStartup: true } }),
    subscribe: () => () => {},
  } as never, { set, describe }, probe)
  t.after(() => controller.dispose())
  const actions = controller.inject()
  const state = () => actions.hooks.marketSettingsCard.getSnapshot()
  await setImmediate()
  return { actions, state }
}

test('a refused replacement preserves the draft even if an older token is configured', async (t) => {
  const { actions, state } = await fixture(t, async () => ({ ok: false }))
  actions.setGithubToken('replacement-token')
  actions.testGithubToken()
  await setImmediate()
  assert.equal(state().githubToken.testStatus, 'success')
  actions.save()
  await setImmediate()
  assert.equal(state().failed, true)
  assert.equal(state().saving, false)
  assert.equal(state().dirty, true)
  assert.equal(state().githubToken.value, 'replacement-token')
  assert.equal(state().githubToken.suffix, 'old1')
  assert.equal(state().githubToken.testStatus, 'idle')
})

test('transport failures and failed readback never report a successful save', async (t) => {
  for (const failure of ['write', 'describe-result', 'describe-throw']) {
    let saving = false
    const { actions, state } = await fixture(t,
      async () => { saving = true; if (failure === 'write') throw new Error('network'); return { ok: true } },
      async () => {
        if (saving && failure === 'describe-throw') throw new Error('readback')
        return { ok: !(saving && failure === 'describe-result'), value: { GITHUB_TOKEN: { configured: true, suffix: 'old1' } } }
      })
    actions.setGithubToken('replacement-token')
    actions.save()
    await setImmediate()
    assert.equal(state().failed, true, failure)
    assert.equal(state().githubToken.value, 'replacement-token', failure)
  }
})

test('accepted writes clear the draft and the next test uses the stored credential', async (t) => {
  let saved = false
  const probes: Array<string | undefined> = []
  const { actions, state } = await fixture(t, async () => { saved = true; return { ok: true } },
    async () => ({ ok: true, value: { GITHUB_TOKEN: { configured: true, suffix: saved ? 'new1' : 'old1' } } }),
    async token => { probes.push(token); return { login: 'tester', canStar: true } })
  actions.setGithubToken('replacement-new1')
  actions.testGithubToken()
  await setImmediate()
  actions.save()
  await setImmediate()
  assert.equal(state().failed, false)
  assert.equal(state().dirty, false)
  assert.equal(state().githubToken.value, '')
  assert.equal(state().githubToken.suffix, 'new1')
  assert.equal(state().githubToken.testStatus, 'idle')
  actions.testGithubToken()
  await setImmediate()
  assert.deepEqual(probes, ['replacement-new1', undefined])
})

test('discarding a draft invalidates its in-flight credential test', async (t) => {
  let finish!: (value: { login: string; canStar: boolean }) => void
  const { actions, state } = await fixture(t, async () => ({ ok: true }), undefined,
    () => new Promise(resolve => { finish = resolve }))
  actions.setGithubToken('unsaved-token')
  actions.testGithubToken()
  actions.discard()
  finish({ login: 'unsaved-account', canStar: true })
  await setImmediate()
  assert.equal(state().githubToken.value, '')
  assert.equal(state().githubToken.testStatus, 'idle')
})
