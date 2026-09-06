import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PluginMarketGitHubGateway } from '../lib/host.js'
import { githubRetryAt } from '../src/host/rate-limit.ts'
import { createGithubMarketApi } from '../src/client/api.ts'

const now = Date.parse('2026-09-06T05:00:00Z')
const request = { pushedFrom: '2026-09-01T00:00:00Z', pushedTo: '2026-09-06T00:00:00Z', page: 1, perPage: 100 }
const emptyPage = { total: 0, incomplete: false, items: [], rateLimitRemaining: 20, rateLimitResetAt: now + 60_000 }
const limited = (retryAt: number) => Object.assign(new Error('rate limited'), {
  code: 'plugin-market/rate-limited', details: { retryAt },
})

test('only throttling signals trigger cooldown; reset headers alone do not', () => {
  const reset = { 'x-ratelimit-reset': String(now / 1000 + 30), 'x-ratelimit-remaining': '4' }
  assert.equal(githubRetryAt(403, new Headers(reset), 'Resource not accessible by personal access token', now), undefined)
  assert.equal(githubRetryAt(401, new Headers({ 'retry-after': '60' }), 'Bad credentials', now), undefined)
  assert.equal(githubRetryAt(403, new Headers({ ...reset, 'x-ratelimit-remaining': '0' }), '', now), now + 31_000)
  assert.equal(githubRetryAt(403, new Headers(reset), 'You have exceeded a secondary rate limit', now), now + 60_000)
  assert.equal(githubRetryAt(429, new Headers(), '', now), now + 60_000)
  assert.equal(githubRetryAt(403, new Headers({ 'retry-after': '20' }), '', now), now + 21_000)
  assert.equal(githubRetryAt(429, new Headers({ 'retry-after': new Date(now + 10_000).toUTCString() }), '', now), now + 11_000)
  assert.equal(githubRetryAt(429, new Headers({ 'retry-after': 'invalid' }), '', now), now + 60_000)
  assert.equal(githubRetryAt(403, new Headers({ ...reset, 'x-ratelimit-remaining': '0', 'retry-after': '10' }), '', now), now + 31_000)
})

test('Host sends the current credential and carries rate-limit details across the Remote boundary', async (t) => {
  t.mock.method(Date, 'now', () => now)
  let token = 'first-test-token'
  const seen: string[] = []
  t.mock.method(globalThis, 'fetch', async (_url: unknown, options: RequestInit) => {
    seen.push(new Headers(options.headers).get('authorization')!)
    return new Response(JSON.stringify({ message: 'API rate limit exceeded' }), {
      status: 403, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': String(now / 1000 + 30) },
    })
  })
  const host = { token: async () => token }
  for (const value of ['first-test-token', 'replacement-test-token']) {
    token = value
    await assert.rejects(PluginMarketGitHubGateway.prototype.search.call(host as never, request), (error: any) => {
      // Remote errors are reconstructed in another realm; JSON retains the actionable fields.
      const wire = JSON.parse(JSON.stringify(error))
      assert.equal(wire.code, 'plugin-market/rate-limited')
      assert.equal(wire.details.retryAt, now + 31_000)
      assert.equal(wire.isDSHRemoteError, true)
      assert.equal(error.message.includes(value), false)
      return true
    })
  }
  assert.deepEqual(seen, ['Bearer first-test-token', 'Bearer replacement-test-token'])
})

test('Host preserves permission diagnostics and rejects missing successful-response quota headers', async (t) => {
  const responses = [
    new Response(JSON.stringify({ message: 'Resource not accessible by personal access token' }), {
      status: 403, headers: { 'x-ratelimit-reset': String(now / 1000 + 30), 'x-ratelimit-remaining': '4' },
    }),
    new Response(JSON.stringify({ total_count: 0, incomplete_results: false, items: [] })),
  ]
  t.mock.method(globalThis, 'fetch', async () => responses.shift()!)
  const host = { token: async () => 'test-token' }
  await assert.rejects(PluginMarketGitHubGateway.prototype.search.call(host as never, request), (error: Error) => {
    assert.match(error.message, /Resource not accessible/)
    assert.doesNotMatch(error.message, /rate limit/)
    return true
  })
  await assert.rejects(PluginMarketGitHubGateway.prototype.search.call(host as never, request), /omitted valid rate-limit headers/)
})

function cacheFixture() {
  let saved: any = null
  return {
    load: async () => structuredClone(saved),
    save: async (value: unknown) => { saved = structuredClone(value) },
    value: () => saved,
  }
}

test('a throttled page persists its cursor, waits, then resumes without losing downloaded rows', async () => {
  const cache = cacheFixture()
  let clock = now
  const requests: number[] = []
  const waits: number[] = []
  const progress: string[] = []
  const row = (id: number) => ({ id, fullName: `owner/plugin-${id}`, name: `plugin-${id}`, owner: 'owner',
    repositoryUrl: `https://github.com/owner/plugin-${id}`, description: '', topics: ['dsh-plugin'], stars: 0,
    pushedAt: '2026-09-05T00:00:00Z', archived: false })
  const api = createGithubMarketApi(async (req) => {
    requests.push(req.page)
    if (requests.length === 2) throw limited(now + 15_000)
    return { ...emptyPage, total: 101, items: req.page === 1 ? Array.from({ length: 100 }, (_, i) => row(i + 1)) : [row(101)] }
  }, cache, () => clock, async (delay) => {
    waits.push(delay)
    assert.equal(cache.value().githubSync.pending[0].page, 2)
    assert.equal(cache.value().githubSync.rows.length, 100)
    assert.equal((await api.list({ page: 1, perPage: 200, sort: 'updated', order: 'desc' })).items.length, 100)
    clock += delay
  })
  await api.refresh(update => progress.push(update.phase))
  assert.deepEqual(requests, [1, 2, 2])
  assert.deepEqual(waits, [15_000])
  assert.ok(progress.includes('waiting'))
  assert.equal(cache.value().githubSync, undefined)
  assert.equal(cache.value().catalog.data.length, 101)
})

test('reloading a paused sync respects the saved cooldown and retries the same first page', async () => {
  const cache = cacheFixture()
  const api = createGithubMarketApi(async () => { throw limited(now + 20_000) }, cache, () => now,
    async () => { throw new Error('page closed') })
  await assert.rejects(api.refresh(), /page closed/)
  assert.equal(cache.value().githubSync.pending[0].page, 1)
  let clock = now + 5_000
  let calls = 0
  const resumed = createGithubMarketApi(async () => { calls += 1; return emptyPage }, cache, () => clock,
    async delay => { assert.equal(delay, 15_000); assert.equal(calls, 0); clock += delay })
  await resumed.refresh()
  assert.equal(calls, 1)
})

test('persistent throttling has bounded retries with increasing waits and keeps its checkpoint', async () => {
  const cache = cacheFixture()
  let clock = now
  let calls = 0
  const waits: number[] = []
  const api = createGithubMarketApi(async () => { calls += 1; throw limited(clock + 60_000) }, cache,
    () => clock, async delay => { waits.push(delay); clock += delay })
  await assert.rejects(api.refresh(), /rate limited/)
  assert.equal(calls, 4)
  assert.deepEqual(waits, [60_000, 120_000, 240_000])
  assert.equal(cache.value().githubSync.pending[0].page, 1)
  assert.ok(cache.value().githubSync.blockedUntil > clock)
})

test('permission errors fail immediately without retrying or promoting an empty snapshot', async () => {
  const cache = cacheFixture()
  const api = createGithubMarketApi(async () => { throw new Error('HTTP 403; permission denied') }, cache,
    () => now, async () => { assert.fail('must not retry permission failures') })
  await assert.rejects(api.refresh(), /permission denied/)
  assert.equal(cache.value(), null)
})
