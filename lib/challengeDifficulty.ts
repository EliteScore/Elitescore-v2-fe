export type ChallengeDifficultyLabel = "Beginner" | "Intermediate" | "Advanced"

/** Map numeric 1..max (default 5) to a human-readable band. */
export function difficultyToLabel(level: number, max = 5): ChallengeDifficultyLabel {
  const n = Math.round(Number(level))
  if (!Number.isFinite(n) || n < 1) return "Beginner"
  const capped = Math.min(max, Math.max(1, n))
  if (capped <= 2) return "Beginner"
  if (capped === 3) return "Intermediate"
  return "Advanced"
}

/**
 * “Featured” when the API sets `featured`, or for known high-visibility courses (CS50, SQL sprint, etc.).
 * Backend can override by sending `featured: false` if we add that later; for now only `true` from API.
 */
export function isFeaturedChallenge(shot: {
  name?: string
  featured?: boolean
}): boolean {
  if (shot.featured === true) return true
  const name = (shot.name ?? "").toLowerCase()
  if (/\bcs50\b/.test(name)) return true
  if (/sql\s*&\s*database/.test(name)) return true
  if (/cybersecurity/.test(name) && /challenge|cs50/.test(name)) return true
  if (/artificial intelligence with python|21-day sprint/.test(name) && /harvard|cs50/.test(name)) return true
  return false
}
