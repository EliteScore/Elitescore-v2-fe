/**
 * EliteScore rules per challenge template (from API; may be snake_case or camelCase).
 */
export type ChallengeScoring = {
  dailyRewardEliteScore?: number
  missedDayPenalty?: number
  failPenalty?: number
  quitPenalty?: number
  completionBonus?: number
  maxMissedDays?: number
}

const DEFAULT_MAX_MISSED_DAYS = 3

/**
 * Formats a signed EliteScore delta for display, e.g. +15, -8, +0
 */
export function formatElitePoints(n: number): string {
  if (n > 0) return `+${n}`
  if (n < 0) return String(n)
  return "0"
}

/**
 * Read scoring fields from a single template or API object (snake_case and camelCase).
 */
export function parseChallengeScoringFromRow(row: Record<string, unknown>): ChallengeScoring {
  const num = (camel: string, snake: string): number | undefined => {
    const a = row[camel]
    const b = row[snake]
    if (typeof a === "number" && Number.isFinite(a)) return a
    if (typeof b === "number" && Number.isFinite(b)) return b
    return undefined
  }

  return {
    dailyRewardEliteScore: num("dailyRewardEliteScore", "daily_reward_elite_score"),
    missedDayPenalty: num("missedDayPenalty", "missed_day_penalty"),
    failPenalty: num("failPenalty", "fail_penalty"),
    quitPenalty: num("quitPenalty", "quit_penalty"),
    completionBonus: num("completionBonus", "completion_bonus"),
    maxMissedDays: num("maxMissedDays", "max_missed_days"),
  }
}

/**
 * Template length in days from list/detail payload (snake_case or camelCase).
 */
export function readDurationDaysFromRow(row: Record<string, unknown>): number | undefined {
  const a = row.durationDays
  const b = row.duration_days
  if (typeof a === "number" && Number.isFinite(a) && a > 0) return Math.floor(a)
  if (typeof b === "number" && Number.isFinite(b) && b > 0) return Math.floor(b)
  return undefined
}

/**
 * Returns max missed days for UI and client-side copy, with a safe default.
 */
export function effectiveMaxMissedDays(scoring: ChallengeScoring | null | undefined): number {
  const m = scoring?.maxMissedDays
  if (typeof m === "number" && m > 0 && Number.isFinite(m)) return Math.floor(m)
  return DEFAULT_MAX_MISSED_DAYS
}

export function hasChallengeScoringFields(s: ChallengeScoring | null | undefined): boolean {
  if (!s) return false
  return [
    s.dailyRewardEliteScore,
    s.missedDayPenalty,
    s.failPenalty,
    s.quitPenalty,
    s.completionBonus,
    s.maxMissedDays,
  ].some((v) => typeof v === "number" && Number.isFinite(v))
}
