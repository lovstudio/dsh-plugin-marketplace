/** GitHub sends reset headers on permission errors too; they alone do not prove throttling. */
export function githubRetryAt(status: number, headers: Headers, message: string, now: number): number | undefined {
  if (status !== 403 && status !== 429) return undefined
  const remaining = headers.get('x-ratelimit-remaining')
  const retry = headers.get('retry-after')
  const primary = remaining === '0'
  if (!primary && retry === null && status !== 429 && !/rate limit|abuse detection/i.test(message)) {
    return undefined
  }
  const seconds = retry === null || retry.trim() === '' ? NaN : Number(retry)
  const retryAt = Number.isFinite(seconds) && seconds >= 0 ? now + seconds * 1_000
    : retry === null ? NaN : Date.parse(retry)
  const reset = Number(headers.get('x-ratelimit-reset') ?? NaN)
  const resetAt = primary && Number.isSafeInteger(reset) && reset > 0 ? reset * 1_000 : NaN
  const deadlines = [retryAt, resetAt].filter(Number.isFinite)
  return deadlines.length > 0 ? Math.max(now + 1_000, ...deadlines.map(value => value + 1_000)) : now + 60_000
}
