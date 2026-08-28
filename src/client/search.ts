/**
 * Search-query parsing and multi-projection merge/rerank pipeline.
 *
 * The local catalog query projects one keyword at a time, so a multi-keyword
 * query expands each positive token into one projection (bounded by
 * {@link MAX_SEARCH_TERM_REQUESTS}); the returned rows are
 * combined with set logic (AND terms must all match, an OR group needs one
 * member, exclusions disqualify), and the survivors are re-ranked by term
 * coverage and match quality over the catalog's own quality score.
 */

import type { MarketOrder, MarketPluginSummary, MarketSort } from './types.ts'

/** How many per-token requests one search may issue (first tokens win). */
export const MAX_SEARCH_TERM_REQUESTS = 4

/** Complete local-catalog window used by each token projection. */
export const SEARCH_TERM_FETCH_SIZE = Number.MAX_SAFE_INTEGER

/**
 * Compare two catalog rows by the active toolbar ordering.
 * @param a - the first catalog row.
 * @param b - the second catalog row.
 * @param sort - the selected catalog metric.
 * @param order - the selected direction.
 * @returns a value suitable for `Array.prototype.sort`.
 */
export function compareMarketPlugins(
  a: MarketPluginSummary,
  b: MarketPluginSummary,
  sort: MarketSort,
  order: MarketOrder,
): number {
  let result: number
  if (sort === 'name') result = a.name.localeCompare(b.name)
  else if (sort === 'updated') result = Date.parse(a.pushedAt ?? '') - Date.parse(b.pushedAt ?? '')
  else if (sort === 'score') result = (a.score ?? 0) - (b.score ?? 0)
  else result = a.stars - b.stars
  if (!Number.isFinite(result)) result = 0
  if (result === 0) result = a.fullName.localeCompare(b.fullName)
  return order === 'asc' ? result : -result
}

/** Field filters extracted from `field:value` tokens. */
export interface ParsedFieldFilters {
  category?: string
  owner?: string
  language?: string
  grade?: string
  tag?: string
  /** Minimum quality score. */
  minScore?: number
}

/** A parsed query: the constraint set and the requests it implies. */
export interface ParsedMarketQuery {
  /** Distinct positive tokens (bare terms, phrase texts, OR members) to fetch. */
  positive: readonly string[]
  /** Bare AND terms — every one must match a candidate. */
  andTerms: readonly string[]
  /** OR groups — at least one member of each group must match. */
  orGroups: readonly (readonly string[])[]
  /** Exact phrases — the lowercase text must appear verbatim. */
  phrases: readonly string[]
  /** Exclusion terms — a match anywhere disqualifies the candidate. */
  excluded: readonly string[]
  /** Field filters projected by the local provider repository. */
  apiFilters: ParsedFieldFilters
  /** Numeric gates applied after text matching. */
  starsMin?: number
  starsMax?: number
  /** Local upper bound for the quality score. */
  scoreMax?: number
  /** Whether any positive token constrains the query. */
  hasPositive: boolean
}

/** The empty parse (a browse query). */
export const EMPTY_PARSED_QUERY: ParsedMarketQuery = {
  positive: [],
  andTerms: [],
  orGroups: [],
  phrases: [],
  excluded: [],
  apiFilters: {},
  hasPositive: false,
}

const FIELD_FILTERS = new Map<string, 'category' | 'owner' | 'language' | 'grade' | 'tag'>([
  ['category', 'category'],
  ['owner', 'owner'],
  ['author', 'owner'],
  ['language', 'language'],
  ['lang', 'language'],
  ['grade', 'grade'],
  ['tag', 'tag'],
])

/** Whether a character starts a quoted phrase token. */
function isQuote(char: string | undefined): boolean {
  return char === '"' || char === '“' || char === '”'
}

/**
 * Tokenize a query on whitespace, keeping double-quoted phrases together.
 * @param text - the raw search input.
 * @returns raw tokens; quote characters stay on their token.
 */
export function tokenizeQuery(text: string): readonly string[] {
  const tokens: string[] = []
  let current = ''
  let inQuote = false
  for (const char of text) {
    if (isQuote(char)) {
      inQuote = !inQuote
      current += char
      continue
    }
    if (/\s/.test(char) && !inQuote) {
      if (current.length > 0) {
        tokens.push(current)
        current = ''
      }
      continue
    }
    current += char
  }
  if (current.length > 0) tokens.push(current)
  return tokens
}

/** Strip one level of matching quote characters from a token. */
function stripQuotes(token: string): string {
  if (token.length >= 2 && isQuote(token[0]) && isQuote(token[token.length - 1])) {
    return token.slice(1, -1)
  }
  return token
}

/** Whether a token is a bare `field:value` filter (no quotes, known field). */
function parseFieldToken(token: string): { field: 'category' | 'owner' | 'language' | 'grade' | 'tag'; value: string } | null {
  const colon = token.indexOf(':')
  if (colon <= 0) return null
  const field = token.slice(0, colon).toLocaleLowerCase()
  const value = token.slice(colon + 1)
  if (value.length === 0) return null
  const mapped = FIELD_FILTERS.get(field)
  if (mapped === undefined) return null
  return { field: mapped, value }
}

/**
 * Parse a numeric comparison (`stars:>=100`, `score:<60`, `stars:50`).
 * @param raw - the comparison text after the colon.
 * @returns the operator and numeric value, or null when not a number.
 */
function parseComparison(raw: string): { operator: '<=' | '>=' | '<' | '>' | '='; value: number } | null {
  const match = /^(?<op><=|>=|<|>|=)?(?<num>\d+)$/.exec(raw.trim())
  if (match?.groups === undefined) return null
  return { operator: (match.groups.op ?? '=') as '<=' | '>=' | '<' | '>' | '=', value: Number(match.groups.num) }
}

/**
 * Parse a raw search input into the constraint set and implied requests.
 * Supports the Google-style subset: bare terms (AND), `A OR B`, `-exclude`,
 * `"exact phrase"`, `field:value` filters (category/owner/author/language/
 * lang/grade/tag), and numeric `stars:`/`score:` comparisons.
 * @param text - the raw search input.
 * @returns the parsed query.
 */
export function parseMarketQuery(text: string): ParsedMarketQuery {
  const tokens = tokenizeQuery(text)
  const positive = new Set<string>()
  const terms: string[] = []
  const orGroups: string[][] = []
  const phrases: string[] = []
  const excluded: string[] = []
  const apiFilters: ParsedFieldFilters = {}
  let starsMin: number | undefined
  let starsMax: number | undefined
  let scoreMax: number | undefined

  const addTerm = (term: string): void => { if (term.length > 0) terms.push(term) }

  // Phase 1: classify tokens; `OR` joins its neighbors into one group.
  let pendingOr: string | null = null
  for (const token of tokens) {
    const quoted = token.startsWith('"') || token.startsWith('“')
    const excludedToken = token.startsWith('-')
    if (token.toLocaleUpperCase() === 'OR') {
      pendingOr = 'or'
      continue
    }
    const body = stripQuotes(excludedToken ? token.slice(1) : token).trim().toLocaleLowerCase()
    if (body.length === 0) continue
    if (excludedToken) {
      excluded.push(body)
      continue
    }
    if (quoted) {
      phrases.push(body)
      positive.add(body)
      continue
    }
    const field = parseFieldToken(body)
    if (field !== null) {
      apiFilters[field.field] = field.value
      continue
    }
    const numeric = /^(stars|score):/.exec(body)
    if (numeric !== null) {
      const field = numeric[0].endsWith(':') ? numeric[0].slice(0, -1) : 'stars'
      const comparison = parseComparison(body.slice(numeric[0].length))
      if (comparison !== null) {
        const apply = (value: number): void => {
          if (field === 'stars') {
            if (comparison.operator === '>=') starsMin = Math.max(starsMin ?? 0, value)
            else if (comparison.operator === '>') starsMin = Math.max(starsMin ?? 0, value + 1)
            else if (comparison.operator === '<=') starsMax = Math.min(starsMax ?? Infinity, value)
            else if (comparison.operator === '<') starsMax = Math.min(starsMax ?? Infinity, value - 1)
            else {
              starsMin = Math.max(starsMin ?? 0, value)
              starsMax = Math.min(starsMax ?? Infinity, value)
            }
          } else if (comparison.operator === '>=' || comparison.operator === '>') {
            apiFilters.minScore = Math.max(apiFilters.minScore ?? 0, value + (comparison.operator === '>' ? 1 : 0))
          } else if (comparison.operator === '<=' || comparison.operator === '<') {
            scoreMax = Math.min(scoreMax ?? Infinity, value - (comparison.operator === '<' ? 1 : 0))
          } else {
            apiFilters.minScore = value
            scoreMax = value
          }
        }
        apply(comparison.value)
      }
      continue
    }
    if (pendingOr === 'or') {
      const group = orGroups[orGroups.length - 1]
      if (group === undefined) {
        // The previous bare term is the group's first member.
        const previous = terms.pop()
        orGroups.push(previous === undefined ? [body] : [previous, body])
      } else {
        group.push(body)
      }
      pendingOr = null
      positive.add(body)
      continue
    }
    addTerm(body)
    positive.add(body)
    pendingOr = null
  }

  const result: ParsedMarketQuery = {
    positive: [...positive],
    andTerms: [...new Set(terms)],
    orGroups: orGroups.filter(group => group.length > 0),
    phrases: [...new Set(phrases)],
    excluded,
    apiFilters,
    hasPositive: positive.size > 0,
  }
  if (starsMin !== undefined) result.starsMin = starsMin
  if (starsMax !== undefined) result.starsMax = starsMax
  if (scoreMax !== undefined) result.scoreMax = scoreMax
  return result
}

/** The lowercase searchable haystack of one plugin row. */
function haystack(plugin: MarketPluginSummary): string {
  return [plugin.name, plugin.owner, plugin.description, ...plugin.tags]
    .join(' ')
    .toLocaleLowerCase()
}

/**
 * Whether a bare term matches a plugin row (case-insensitive substring over
 * the haystack).
 * @param plugin - the candidate row.
 * @param term - the term to look for.
 * @returns whether the haystack contains the term.
 */
export function matchesTerm(plugin: MarketPluginSummary, term: string): boolean {
  return haystack(plugin).includes(term.toLocaleLowerCase())
}

/**
 * Whether an exact phrase appears verbatim in the haystack.
 * @param plugin - the candidate row.
 * @param phrase - the lowercase phrase to look for.
 * @returns whether the haystack contains the phrase.
 */
export function matchesPhrase(plugin: MarketPluginSummary, phrase: string): boolean {
  return haystack(plugin).includes(phrase.toLocaleLowerCase())
}

/** Whether the local numeric gates admit a plugin row. */
function passesNumericGates(plugin: MarketPluginSummary, parsed: ParsedMarketQuery): boolean {
  if (parsed.starsMin !== undefined && plugin.stars < parsed.starsMin) return false
  if (parsed.starsMax !== undefined && plugin.stars > parsed.starsMax) return false
  const score = plugin.score ?? 0
  if (parsed.scoreMax !== undefined && score > parsed.scoreMax) return false
  return true
}

/**
 * Whether a plugin row satisfies every parsed constraint. Exclusions win over
 * everything; AND terms must all match; each OR group needs at least one
 * member; phrases must appear verbatim.
 * @param plugin - the candidate row.
 * @param parsed - the parsed query.
 * @returns whether the row passes the full gate set.
 */
export function accepts(plugin: MarketPluginSummary, parsed: ParsedMarketQuery): boolean {
  if (parsed.excluded.some(term => matchesTerm(plugin, term))) return false
  if (!parsed.andTerms.every(term => matchesTerm(plugin, term))) return false
  if (!parsed.orGroups.every(group => group.some(term => matchesTerm(plugin, term)))) return false
  if (!parsed.phrases.every(phrase => matchesPhrase(plugin, phrase))) return false
  return passesNumericGates(plugin, parsed)
}

/** Match-quality bonus (0-3) of one unit against one row. */
function unitBonus(plugin: MarketPluginSummary, unit: string): number {
  const needle = unit.toLocaleLowerCase()
  const name = plugin.name.toLocaleLowerCase()
  const owner = plugin.owner.toLocaleLowerCase()
  const description = plugin.description.toLocaleLowerCase()
  const tags = plugin.tags.map(tag => tag.toLocaleLowerCase())
  let bonus = 0
  if (name.includes(needle) || owner.includes(needle)) bonus += 3
  if (tags.some(tag => tag.includes(needle))) bonus += 2
  if (description.includes(needle)) bonus += 1
  return Math.min(3, bonus)
}

/**
 * Positive constraint units (AND terms + phrases; OR groups count per group).
 * @param parsed - the parsed query.
 * @returns the member units of the query.
 */
export function positiveUnits(parsed: ParsedMarketQuery): readonly string[] {
  return [...parsed.andTerms, ...parsed.phrases]
}

/**
 * Rank one candidate for a parsed query: term coverage dominates, then match
 * quality, then the catalog's own quality score, then star count. An OR group
 * counts as one covered unit when any member matches.
 * @param plugin - the candidate row.
 * @param parsed - the parsed query.
 * @returns the rank; higher is better.
 */
export function rankPlugin(plugin: MarketPluginSummary, parsed: ParsedMarketQuery): number {
  const andUnits = positiveUnits(parsed)
  const groups = parsed.orGroups
  if (andUnits.length === 0 && groups.length === 0) return plugin.score ?? 0
  let covered = 0
  let bonus = 0
  for (const unit of andUnits) {
    if (matchesTerm(plugin, unit)) {
      covered += 1
      bonus += unitBonus(plugin, unit)
    }
  }
  for (const group of groups) {
    const best = Math.max(...group.map(term => matchesTerm(plugin, term) ? unitBonus(plugin, term) : 0))
    if (best > 0) {
      covered += 1
      bonus += best
    }
  }
  const total = andUnits.length + groups.length
  const coverage = covered / total
  const quality = bonus / (total * 3)
  const starsFactor = Math.min(10, Math.log2(plugin.stars + 1))
  return coverage * 1000 + quality * 100 + (plugin.score ?? 0) + starsFactor
}

/**
 * Merge per-token pages into one deduplicated, gate-filtered, relevance-ranked
 * list. Rows keep the first catalog page they appear in; ties break by stars
 * then name.
 * @param pages - one page per requested token (or the single browse page).
 * @param parsed - the parsed query whose gates filter the merge.
 * @param limit - maximum rows to return.
 * @returns the ranked slice and the total that passed the gates.
 */
export function mergeAndRank(
  pages: readonly (readonly MarketPluginSummary[])[],
  parsed: ParsedMarketQuery,
  limit: number,
): { items: readonly MarketPluginSummary[]; total: number } {
  const seen = new Set<string>()
  const candidates: MarketPluginSummary[] = []
  for (const page of pages) {
    for (const plugin of page) {
      if (seen.has(plugin.fullName)) continue
      seen.add(plugin.fullName)
      if (accepts(plugin, parsed)) candidates.push(plugin)
    }
  }
  candidates.sort((a, b) => {
    const byRank = rankPlugin(b, parsed) - rankPlugin(a, parsed)
    if (byRank !== 0) return byRank
    const byStars = b.stars - a.stars
    if (byStars !== 0) return byStars
    return a.name.localeCompare(b.name)
  })
  return { items: candidates.slice(0, limit), total: candidates.length }
}

/**
 * Decide the local projection plan for a parsed query: one bounded entry per
 * positive term, or an empty list for an unqualified browse.
 * @param parsed - the parsed query.
 * @returns the per-request keywords; an empty list means one browse request.
 */
export function planSearch(parsed: ParsedMarketQuery): readonly string[] {
  if (!parsed.hasPositive) return []
  return parsed.positive.slice(0, MAX_SEARCH_TERM_REQUESTS)
}
