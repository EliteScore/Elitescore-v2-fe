/**
 * Curated cover images for challenge library cards.
 * Uses fixed Unsplash (hotlink-friendly) and Wikimedia URLs — no random redirects.
 */

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1200&q=80`

/** Topic imagery — chosen to match common EliteScore templates */
const TOPIC = {
  git: unsplash("photo-1618401471353-b98afee0b2eb"),
  sql: unsplash("photo-1544383835-bda2bc66a55d"),
  cybersecurity: unsplash("photo-1550751827-4bd374c3f58b"),
  ai: unsplash("photo-1677442136019-21780ecad995"),
  cloud: unsplash("photo-1451187580459-43490279c0fa"),
  data: unsplash("photo-1551288049-bebda4e38f71"),
  publicSpeaking: unsplash("photo-1475721027785-f74eccf44e57"),
  reading: unsplash("photo-1512820790803-83ca734da794"),
  meditation: unsplash("photo-1506126613408-eca07ce68773"),
  routine: unsplash("photo-1490645935967-10de6ba17061"),
  portfolio: unsplash("photo-1547658719-da2b51169166"),
  networking: unsplash("photo-1522071820081-009f0129c71c"),
  default: unsplash("photo-1523240795612-9a054b0db644"),
} as const

/**
 * When a template is clearly tied to an institution but topic keywords did not match,
 * use a recognizable campus / workplace photo.
 */
const PROVIDER_HERO: Record<string, string> = {
  google: unsplash("photo-1521737711867-e3b97375f902"),
  harvard: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Harvard_Widener_Library.jpg/1280px-Harvard_Widener_Library.jpg",
  cs50: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Harvard_Widener_Library.jpg/1280px-Harvard_Widener_Library.jpg",
  mit: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_Building_10_and_the_Great_Dome%2C_Cambridge_MA.jpg/1280px-MIT_Building_10_and_the_Great_Dome%2C_Cambridge_MA.jpg",
  microsoft: unsplash("photo-1633419461186-7d40a38105ec"),
  ibm: unsplash("photo-1517430816045-df4b7de11d1d"),
  meta: unsplash("photo-1611162617474-5b21e879641f"),
  aws: unsplash("photo-1451187580459-43490279c0fa"),
}

function topicFromHaystack(haystack: string): string | undefined {
  if (haystack.includes("git") || haystack.includes("github")) return TOPIC.git
  if (haystack.includes("sql") || haystack.includes("database") || haystack.includes("postgres") || haystack.includes("mysql"))
    return TOPIC.sql
  if (
    haystack.includes("cyber") ||
    haystack.includes("security") ||
    haystack.includes("infosec") ||
    haystack.includes("penetration")
  )
    return TOPIC.cybersecurity
  if (
    haystack.includes("machine learning") ||
    haystack.includes("deep learning") ||
    haystack.includes("neural net") ||
    /\bartificial intelligence\b/.test(haystack) ||
    /\bgenerative ai\b/.test(haystack) ||
    /\bllm\b/.test(haystack)
  )
    return TOPIC.ai
  if (haystack.includes("aws") || haystack.includes("amazon web services") || haystack.includes("azure") || haystack.includes("gcp"))
    return TOPIC.cloud
  if (
    haystack.includes("data analytic") ||
    haystack.includes("analytics") ||
    haystack.includes("data science") ||
    haystack.includes("visualization") ||
    haystack.includes("business intelligence")
  )
    return TOPIC.data
  if (haystack.includes("public speaking") || haystack.includes("presentation") || haystack.includes("pitch "))
    return TOPIC.publicSpeaking
  if (haystack.includes("read") && (haystack.includes("book") || haystack.includes("page"))) return TOPIC.reading
  if (haystack.includes("meditation") || haystack.includes("mindful")) return TOPIC.meditation
  if (haystack.includes("routine") || haystack.includes("morning ") || haystack.includes("wake up")) return TOPIC.routine
  if (haystack.includes("portfolio")) return TOPIC.portfolio
  if (haystack.includes("network") && (haystack.includes("tcp") || haystack.includes("cisco") || haystack.includes("routing")))
    return TOPIC.networking
  return undefined
}

function providerHero(providerName?: string): string | undefined {
  if (!providerName) return undefined
  const key = providerName.toLowerCase()
  return PROVIDER_HERO[key]
}

function trackFallback(track: string): string {
  const t = track.toLowerCase()
  if (t.includes("wellness")) return TOPIC.meditation
  if (t.includes("career")) return TOPIC.publicSpeaking
  if (t.includes("learning")) return TOPIC.reading
  if (t.includes("technical") || t.includes("skill")) return TOPIC.default
  return TOPIC.default
}

/**
 * Returns a stable image URL for a challenge card. Topic keywords take precedence so
 * e.g. a Google-sponsored Git sprint still shows Git imagery; provider campus/office
 * imagery is used when the text is institution-first and no topic matched.
 */
export function resolveChallengeThumbnail(
  name: string,
  track: string,
  description: string,
  providerName?: string
): string {
  const haystack = `${name} ${track} ${description}`.toLowerCase()
  const topicUrl = topicFromHaystack(haystack)
  if (topicUrl) return topicUrl

  const institutionFirst =
    /\b(certificate|certification|professional certificate|specialization)\b/i.test(haystack) ||
    /\b(cs50|it automation|google career|ibm data|meta front|aws cloud practitioner)\b/i.test(haystack)

  if (institutionFirst) {
    const hero = providerHero(providerName)
    if (hero) return hero
  }

  const hero = providerHero(providerName)
  if (hero) return hero

  return trackFallback(track)
}
