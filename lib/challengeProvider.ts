/**
 * Detect course issuer (company / university) from challenge text.
 * Scans description first, then title, then track — so copy like
 * "Google IT Automation with Python Professional Certificate" picks Google
 * even when the challenge title only says "Git and GitHub".
 */

type Rule = { provider: string; test: (s: string) => boolean }

/** First matching rule within a single text blob wins (most specific first). */
const RULES: Rule[] = [
  { provider: "CS50", test: (s) => /\bcs50\b/i.test(s) },
  { provider: "Harvard", test: (s) => /\bharvard\b/i.test(s) },
  { provider: "Google", test: (s) => /\bgoogle\b/i.test(s) },
  { provider: "Microsoft", test: (s) => /\bmicrosoft\b/i.test(s) },
  { provider: "IBM", test: (s) => /\bibm\b/i.test(s) },
  { provider: "Meta", test: (s) => /\bmeta\b/i.test(s) },
  {
    provider: "AWS",
    test: (s) => /\baws\b/i.test(s) || /\bamazon web services\b/i.test(s),
  },
  { provider: "Stanford", test: (s) => /\bstanford\b/i.test(s) },
  {
    provider: "MIT",
    test: (s) =>
      /\bmit\b/.test(s) ||
      /\bmissing semester\b/.test(s) ||
      /\b6\.s191\b/.test(s) ||
      /\b6s191\b/.test(s) ||
      /\bmit xpro\b/i.test(s) ||
      /\bmit opencourseware\b/i.test(s) ||
      /\bmassachusetts institute of technology\b/i.test(s) ||
      /\bintro(?:duction)? to deep learning\b/.test(s),
  },
  {
    provider: "Duke",
    test: (s) => /\bduke university\b/i.test(s) || /\bduke\b/i.test(s),
  },
]

/** Domain for high-res favicons (Google s2 service). */
const PROVIDER_BRAND_HOST: Record<string, string> = {
  google: "google.com",
  harvard: "harvard.edu",
  cs50: "harvard.edu",
  microsoft: "microsoft.com",
  ibm: "ibm.com",
  meta: "meta.com",
  aws: "aws.amazon.com",
  stanford: "stanford.edu",
  mit: "mit.edu",
  duke: "duke.edu",
}

export function detectChallengeProvider(
  name?: string,
  track?: string,
  description?: string
): string | undefined {
  const sources = [description, name, track]
  for (const raw of sources) {
    if (!raw?.trim()) continue
    const s = raw.toLowerCase()
    for (const { provider, test } of RULES) {
      if (test(s)) return provider
    }
  }
  return undefined
}

/** Brand mark via favicon (sharp at 128px, widely cacheable). */
export function providerLogoUrl(providerName?: string): string | undefined {
  if (!providerName) return undefined
  const host = PROVIDER_BRAND_HOST[providerName.toLowerCase()]
  if (!host) return undefined
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`
}
