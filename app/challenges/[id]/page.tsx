"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  Download,
  Lock,
  Upload,
  Heart,
  MessageCircle,
  Bookmark,
  Play,
  Target,
  Flame,
} from "lucide-react"
import { ELITESCORE_SUPPORT_EMAIL, ELITESCORE_SUPPORT_MAILTO } from "@/lib/supportContact"
import { ensureSupabaseSession, getSupabaseBrowserClient } from "@/lib/supabaseClient"

const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"
const CARD_BASE = "rounded-2xl border border-slate-200/80 bg-white shadow-sm"

/** Parse YouTube video ID and optional start (seconds) from watch, embed, or youtu.be URLs */
function parseYouTubeUrl(url: string): { videoId: string; startSeconds?: number } | null {
  if (!url?.trim()) return null
  const s = url.trim()
  let videoId: string | null = null
  let startSeconds: number | undefined
  try {
    if (s.includes("youtube.com/watch")) {
      const u = new URL(s)
      videoId = u.searchParams.get("v") ?? null
      const t = u.searchParams.get("t")
      if (t != null) startSeconds = parseInt(t.replace(/[^0-9]/g, ""), 10) || undefined
    } else if (s.includes("youtu.be/")) {
      const u = new URL(s)
      videoId = u.pathname.slice(1).split("/")[0] || null
      const t = u.searchParams.get("t")
      if (t != null) startSeconds = parseInt(t.replace(/[^0-9]/g, ""), 10) || undefined
    } else if (s.includes("youtube.com/embed/")) {
      const u = new URL(s)
      const pathId = u.pathname.split("/embed/")[1]?.split("/")[0]
      videoId = pathId || null
      const start = u.searchParams.get("start")
      if (start != null) startSeconds = parseInt(start, 10) || undefined
    }
  } catch {
    return null
  }
  if (!videoId) return null
  return { videoId, startSeconds }
}

function buildYouTubeEmbedUrl(videoId: string, startSeconds?: number | null, endSeconds?: number | null): string {
  const u = new URL(`https://www.youtube.com/embed/${videoId}`)
  if (startSeconds != null && startSeconds > 0) u.searchParams.set("start", String(startSeconds))
  if (endSeconds != null && endSeconds > 0) u.searchParams.set("end", String(endSeconds))
  return u.toString()
}

/** Project build days in "AI with Python" — copy uses Watch + multiple Link: Name: url … then Today… */
const AI_PYTHON_PROJECT_DAYS = new Set([3, 6, 9, 12, 15, 18, 21])

function normalizeChallengeDay(day: number | string | undefined | null): number | null {
  if (day == null) return null
  const d = typeof day === "number" && Number.isFinite(day) ? day : Number.parseInt(String(day), 10)
  return Number.isFinite(d) ? d : null
}

/**
 * One UI row per submission line. Supports newline lists and single blocks with multiple "•" items
 * (e.g. cybersecurity templates pasted as one paragraph).
 */
function splitExpectedProofIntoRequirementRows(expectedProof: string | null | undefined): string[] {
  const raw = (expectedProof ?? "").replace(/\r\n/g, "\n").trim()
  if (!raw) return []

  const splitTargetLengthLine = (segment: string): string[] => {
    const s = segment.trim()
    const m = s.match(/^(.+?)(\s+Target\s+length:\s*.+)$/i)
    if (m && m[1].trim().length >= 4) return [m[1].trim(), m[2].trim()]
    return [s]
  }
  const normalizeLeadMarker = (line: string): string =>
    line
      .replace(/^\s*(?:\d+[\)\.\:\-]?\s+)/, "")
      .replace(/^\s*[•●▪◦\-]\s*/, "")
      .trim()

  // Turn inline bullets into separate lines, e.g. "Include: • x • y"
  const expandedRaw = raw.replace(/\s+[•●▪◦]\s+/g, "\n• ")
  const lines = expandedRaw.split("\n").map((s) => s.trim()).filter(Boolean)

  const startsNewItem = (line: string): boolean =>
    /^\s*(?:\d+[\)\.\:\-]?\s+|[•●▪◦\-]\s+)/.test(line)

  const grouped: string[] = []
  for (const line of lines) {
    if (startsNewItem(line)) {
      const cleaned = normalizeLeadMarker(line)
      if (cleaned) grouped.push(cleaned)
      continue
    }
    if (grouped.length === 0) {
      grouped.push(line)
    } else {
      grouped[grouped.length - 1] = `${grouped[grouped.length - 1]} ${line}`.replace(/\s+/g, " ").trim()
    }
  }

  // If no explicit markers were found, keep each newline row.
  const baseRows = grouped.length > 0 ? grouped : lines

  return baseRows
    .map((row) => normalizeLeadMarker(row))
    .filter(Boolean)
    .flatMap(splitTargetLengthLine)
}

function isAiWithPythonProjectDay(challengeName: string, day: number): boolean {
  if (!AI_PYTHON_PROJECT_DAYS.has(day)) return false
  const n = challengeName.toLowerCase()
  if (n.includes("ai with python")) return true
  if (n.includes("cs50") && n.includes("ai")) return true
  if (n.includes("ai") && n.includes("python")) return true
  return false
}

function isIntroDbSqlDayOne(challengeName: string, day: number | string, extraContext?: string): boolean {
  const dayNum = normalizeChallengeDay(day)
  if (dayNum !== 1) return false
  const n = challengeName.toLowerCase()
  const baseNameMatch =
    (n.includes("intro") && n.includes("db") && n.includes("sql")) ||
    (n.includes("introduction") && n.includes("database") && n.includes("sql"))
  if (baseNameMatch) return true

  const ctx = (extraContext ?? "").toLowerCase()
  // Fallback for starter SQL day copy where the challenge title can vary by provider.
  return (
    ctx.includes("courses_feed") ||
    ctx.includes("sqlite") ||
    ctx.includes("select and limit") ||
    ctx.includes("skillsprint") ||
    ctx.includes("first queries and your first table") ||
    ctx.includes(".sql file")
  )
}

function resolveGoogleDataAnalyticsStarterPack(
  challengeName: string,
  day: number | string,
  extraContext?: string
): { label: string; href: string; filename: string } | null {
  const dayNum = normalizeChallengeDay(day)
  if (dayNum == null) return null
  if (dayNum !== 1 && dayNum !== 9 && dayNum !== 17) return null

  const haystack = `${challengeName}\n${extraContext ?? ""}`.toLowerCase()
  const isGoogleDataAnalytics =
    ((haystack.includes("google") || haystack.includes("glowcart")) && haystack.includes("data")) ||
    haystack.includes("analytics")
  if (!isGoogleDataAnalytics) return null

  if (dayNum === 1) {
    return {
      label: "Day 1 starter pack",
      href: "/api/downloads/glowcart-day-1-8-starter-pack",
      filename: "glowcart_day_1_8_starter_pack.zip",
    }
  }
  if (dayNum === 9) {
    return {
      label: "Day 9 starter pack",
      href: "/api/downloads/glowcart-day-9-16-starter-pack",
      filename: "glowcart_day_9_16_starter_pack.zip",
    }
  }
  return {
    label: "Day 17 starter pack",
    href: "/api/downloads/glowcart-day-17-25-starter-pack",
    filename: "glowcart_day_17_25_starter_pack.zip",
  }
}

function isCs50IntroBeforeBeginDayOne(challengeName: string, day: number | string, extraContext?: string): boolean {
  const dayNum = normalizeChallengeDay(day)
  if (dayNum !== 1) return false
  const name = challengeName.toLowerCase()
  const ctx = (extraContext ?? "").toLowerCase()
  return (
    (name.includes("cs50") && (name.includes("computer science") || name.includes("introduction"))) ||
    (ctx.includes("harvard") && ctx.includes("cs50") && ctx.includes("computer science"))
  )
}

function isMitDeepLearningBeforeBeginDayOne(
  challengeName: string,
  day: number | string,
  extraContext?: string
): boolean {
  const dayNum = normalizeChallengeDay(day)
  if (dayNum !== 1) return false
  const name = challengeName.toLowerCase()
  const ctx = (extraContext ?? "").toLowerCase()
  return (
    (name.includes("mit") && name.includes("6.s191") && name.includes("deep learning")) ||
    (name.includes("mit") && name.includes("introduction") && name.includes("deep learning")) ||
    (ctx.includes("mit") && ctx.includes("6.s191") && ctx.includes("deep learning"))
  )
}

type DayDescriptionParts = {
  watchSegment: string | null
  instructions: string
  namedLinks?: { label: string; url: string }[]
}

/**
 * CS50-style project day: "Watch: Practice day Link: Knights: https://… Link: Minesweeper: https://… Today is…"
 * Splits on the first "Today" that starts the narrative (allows zero whitespace before Today after a URL).
 */
function splitAiPythonProjectDayDescription(trimmed: string): DayDescriptionParts | null {
  if (!/^Watch:/i.test(trimmed)) return null
  const bodyMatch = trimmed.match(/^(Watch:[\s\S]*?)(\s*Today\b[\s\S]*)$/i)
  if (!bodyMatch) return null
  const preamble = bodyMatch[1].trim()
  const instructions = bodyMatch[2].trim()
  if (!/^Today\b/i.test(instructions)) return null
  if (!/https?:\/\//i.test(preamble)) return null

  const namedLinks: { label: string; url: string }[] = []
  const labeledRe = /Link:\s*([^:\n]+?):\s*(https?:\/\/\S+)/gi
  let m: RegExpExecArray | null
  while ((m = labeledRe.exec(preamble)) !== null) {
    namedLinks.push({ label: m[1].trim(), url: m[2].trim() })
  }
  if (namedLinks.length === 0) {
    const plainRe = /Link:\s*(https?:\/\/\S+)/gi
    while ((m = plainRe.exec(preamble)) !== null) {
      namedLinks.push({ label: "Resource", url: m[1].trim() })
    }
  }
  if (namedLinks.length === 0) return null

  return { watchSegment: preamble, instructions, namedLinks }
}

/** Split API copy like "Watch: … Link: https://… Today is about…" into a watch row and body instructions. */
function splitDayDescription(text: string, challengeName?: string, day?: number): DayDescriptionParts {
  const trimmed = text.trim()
  if (!trimmed) return { watchSegment: null, instructions: "" }

  const dayNum = normalizeChallengeDay(day)
  const nameStr = challengeName ?? ""
  const project = splitAiPythonProjectDayDescription(trimmed)
  const hasHarvardCs50Links = /cs50\.harvard\.edu/i.test(trimmed)
  if (
    project &&
    project.namedLinks &&
    project.namedLinks.length >= 2 &&
    (hasHarvardCs50Links || (dayNum != null && isAiWithPythonProjectDay(nameStr, dayNum)))
  ) {
    return project
  }

  const multiline = trimmed.match(
    /^(Watch:\s*[^\n]+)\s*\n\s*Link:\s*(https?:\/\/[^\s]+)\s*\n+([\s\S]+)$/i
  )
  if (multiline) {
    return {
      watchSegment: `${multiline[1]} Link: ${multiline[2]}`.trim(),
      instructions: multiline[3].trim(),
    }
  }

  const singleLine = trimmed.match(
    /^(Watch:\s*.+?)\s+Link:\s+(https?:\/\/[^\s]+)\s+([\s\S]+)$/i
  )
  if (singleLine) {
    return {
      watchSegment: `${singleLine[1]} Link: ${singleLine[2]}`.trim(),
      instructions: singleLine[3].trim(),
    }
  }

  const linkAfterWatch = trimmed.match(/^Watch:\s*(.+?)\s+(https?:\/\/[^\s]+)\s+([\s\S]+)$/i)
  if (linkAfterWatch) {
    return {
      watchSegment: `Watch: ${linkAfterWatch[1]} ${linkAfterWatch[2]}`.trim(),
      instructions: linkAfterWatch[3].trim(),
    }
  }

  const watchLinkOnly = trimmed.match(/^(Watch:\s*.+?)\s+Link:\s+(https?:\/\/[^\s]+)\s*$/i)
  if (watchLinkOnly) {
    return {
      watchSegment: `${watchLinkOnly[1]} Link: ${watchLinkOnly[2]}`.trim(),
      instructions: "",
    }
  }

  return { watchSegment: null, instructions: trimmed }
}

function firstHttpUrlInString(s: string): string | null {
  const m = s.match(/(https?:\/\/[^\s]+)/i)
  return m ? m[1] : null
}

/** Text after "Watch:" and before "Link:" / URL, e.g. timing range. */
function watchTimingsLabel(watchSegment: string): string {
  const m = watchSegment.match(/^Watch:\s*(.+?)\s+Link:\s+/i)
  if (m) return m[1].trim()
  const m2 = watchSegment.match(/^Watch:\s*(.+?)\s+https?:\/\//i)
  if (m2) return m2[1].trim()
  return watchSegment.replace(/\s*https?:\/\/\S+/gi, "").replace(/^Watch:\s*/i, "").trim() || watchSegment
}

type RoadmapTask = { id: string; title: string; completed: boolean; day: number | string }
type RoadmapWeek = {
  id: string
  title: string
  status: "completed" | "in_progress" | "locked"
  tasks: RoadmapTask[]
}

type UiChallenge = {
  id: string
  name: string
  description: string
  difficulty: number
  duration: number
  currentDay: number
  daysRemaining: number
  progress: number
  reward: number
  requirements: string[]
  roadmap: RoadmapWeek[]
  todayTask: {
    day: number
    title: string
    description: string
    requirements: string[]
    xp: number
    resourceLink?: string | null
    resourceStartSeconds?: number | null
    resourceEndSeconds?: number | null
  }
}

type ChallengeTemplateApi = {
  id?: string
  name?: string
  description?: string
  difficulty?: number
  durationDays?: number
  completionBonus?: number
  dailyRewardEliteScore?: number
}

type ChallengeRoadmapStepApi = {
  id: string
  week: number | null
  day: number
  title: string
  instructions: string
  expectedProof?: string | null
  rewardEliteScore?: number | null
  resourceLink?: string | null
  resource_link?: string | null
  resourceStartSeconds?: number | null
  resource_start_seconds?: number | null
  resourceEndSeconds?: number | null
  resource_end_seconds?: number | null
}

type UserEnrollmentApi = {
  id?: string
  challengeTemplateId?: string
  challenge_template_id?: string
  status?: string
  currentDay?: number
  current_day?: number
  missedDaysCount?: number
  missed_days_count?: number
}

type EnrollmentInfo = {
  userChallengeId: string
  status: string
  currentDay: number
  missedDaysCount: number
}

type ProofVerdict = "accepted" | "rejected"
type ProofAttempt = 1 | 2

type ProofResponse = {
  id?: string
  aiVerdict?: ProofVerdict | string
  aiFeedback?: string | null
  status?: string
  challengeDay?: number
  challenge_day?: number
}

type ProblemDetails = {
  detail?: string
  title?: string
  message?: string
  status?: number
}

type DashboardApi = {
  recentScoreGains?: Array<{ eliteScoreDelta?: number | null; createdAt?: string }>
}

function pickEnrollmentForTemplate(
  enrollments: UserEnrollmentApi[],
  templateId: string
): EnrollmentInfo | null {
  const matching = enrollments.filter((e) => {
    const tplId = e.challengeTemplateId ?? e.challenge_template_id
    return tplId === templateId
  })
  if (matching.length === 0) return null
  // Prefer active, else first
  const active = matching.find((e) => (e.status ?? "").toLowerCase() === "active") ?? matching[0]
  if (!active.id) return null
  return {
    userChallengeId: active.id,
    status: (active.status ?? "active").toLowerCase(),
    currentDay: active.currentDay ?? active.current_day ?? 0,
    missedDaysCount: active.missedDaysCount ?? active.missed_days_count ?? 0,
  }
}

function extractProblemMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const obj = body as ProblemDetails & Record<string, unknown>
    if (typeof obj.detail === "string" && obj.detail.trim()) return obj.detail
    if (typeof obj.message === "string" && obj.message.trim()) return obj.message
    if (typeof obj.title === "string" && obj.title.trim()) return obj.title
  }
  return fallback
}

function readSubmissionIdFromBody(body: unknown): string | null {
  if (body && typeof body === "object" && "id" in body) {
    const id = (body as { id: unknown }).id
    if (typeof id === "string" && id.trim()) return id.trim()
  }
  return null
}

function mapEnrollmentProgressToUiDay(progressDay: number | null | undefined, duration?: number): number {
  const mapped = Math.max(1, (progressDay ?? 0) + 1)
  return typeof duration === "number" && duration > 0 ? Math.min(mapped, duration) : mapped
}

function ChallengeDetailPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f6] px-4">
      <p className="text-sm text-slate-500">Loading challenge...</p>
    </div>
  )
}

function ChallengeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawId = params.id as string
  const dayParam = searchParams.get("day")
  const requestedDay = dayParam != null ? parseInt(dayParam, 10) : null

  const [challenge, setChallenge] = useState<UiChallenge | null>(null)
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set())
  const [showUploadProof, setShowUploadProof] = useState(false)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enrollment, setEnrollment] = useState<EnrollmentInfo | null>(null)
  const [enrollmentLoading, setEnrollmentLoading] = useState(true)
  const [challengeFailedBanner, setChallengeFailedBanner] = useState<string | null>(null)
  const [dayAdvanceBanner, setDayAdvanceBanner] = useState<string | null>(null)

  // Proof modal state
  const [proofMode, setProofMode] = useState<"text" | "link" | "upload">("text")
  const [proofText, setProofText] = useState("")
  const [proofLink, setProofLink] = useState("")
  const [proofFiles, setProofFiles] = useState<File[]>([])
  const [proofNotes, setProofNotes] = useState("")
  const [proofUploading, setProofUploading] = useState(false)
  const [proofSubmitting, setProofSubmitting] = useState(false)
  const [proofError, setProofError] = useState<string | null>(null)
  const [proofVerdict, setProofVerdict] = useState<ProofVerdict | null>(null)
  const [proofFeedback, setProofFeedback] = useState<string | null>(null)
  const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null)
  const [proofAttempt, setProofAttempt] = useState<ProofAttempt>(1)
  const [missedDayNotice, setMissedDayNotice] = useState<string | null>(null)
  const [lockedProofDay, setLockedProofDay] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("elitescore_access_token") : null
      if (!token) {
        setLoading(false)
        return
      }
      const userId =
        typeof window !== "undefined" ? localStorage.getItem("elitescore_user_id") : null

      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
      if (userId) {
        ;(headers as Record<string, string>)["X-User-Id"] = userId
      }

      try {
        const tplRes = await fetch("/api/challenges", { headers })
        const tplData = await tplRes.json().catch(() => null)
        const templates: ChallengeTemplateApi[] = Array.isArray(tplData) ? tplData : []
        const tpl = templates.find((t) => t.id === rawId)

        const stepsRes = await fetch(`/api/challenges/${rawId}/steps`, { headers })
        const stepsData = await stepsRes.json().catch(() => null)
        const steps: ChallengeRoadmapStepApi[] = Array.isArray(stepsData) ? stepsData : []

        if (cancelled) return

        if (!tpl && steps.length === 0) {
          setChallenge(null)
          setLoading(false)
          return
        }

        const duration = typeof tpl?.durationDays === "number" ? tpl.durationDays : steps.length
        const reward =
          typeof tpl?.completionBonus === "number"
            ? tpl.completionBonus
            : typeof tpl?.dailyRewardEliteScore === "number" && duration > 0
            ? tpl.dailyRewardEliteScore * duration
            : 0
        const difficulty =
          typeof tpl?.difficulty === "number" && tpl.difficulty > 0 ? tpl.difficulty : 3

        const weeksMap = new Map<number, ChallengeRoadmapStepApi[]>()
        steps.forEach((s) => {
          const w = s.week ?? 1
          if (!weeksMap.has(w)) weeksMap.set(w, [])
          weeksMap.get(w)!.push(s)
        })

        const sortedWeeks = Array.from(weeksMap.entries()).sort((a, b) => a[0] - b[0])
        const roadmap: RoadmapWeek[] = sortedWeeks.map(([weekNumber, weekSteps], index) => {
          const sortedSteps = [...weekSteps].sort((a, b) => a.day - b.day)
          const isFirst = index === 0
          const tasks: RoadmapTask[] = sortedSteps.map((s) => ({
            id: s.id,
            title: s.title,
            completed: false,
            day: s.day,
          }))
          const status: RoadmapWeek["status"] = isFirst ? "in_progress" : "locked"
          return {
            id: String(weekNumber),
            title: `Week ${weekNumber}`,
            status,
            tasks,
          }
        })

        const stepForDay =
          requestedDay != null && !Number.isNaN(requestedDay)
            ? steps.find((s) => normalizeChallengeDay(s.day) === requestedDay)
            : null
        const firstStep = stepForDay ?? steps[0]
        const todayDay = normalizeChallengeDay(firstStep?.day ?? requestedDay ?? 1) ?? 1
        const xp = typeof firstStep?.rewardEliteScore === "number" ? firstStep.rewardEliteScore : 0
        const description = firstStep?.instructions ?? "Daily task for this challenge."
        const requirements: string[] = splitExpectedProofIntoRequirementRows(firstStep?.expectedProof)

        const ui: UiChallenge = {
          id: rawId,
          name: tpl?.name ?? "Challenge",
          description: tpl?.description ?? "",
          difficulty,
          duration: duration || 0,
          currentDay: todayDay,
          daysRemaining: duration > todayDay ? duration - todayDay : 0,
          progress: 0,
          reward,
          requirements,
          roadmap,
          todayTask: {
            day: todayDay,
            title: firstStep?.title ?? "Today's task",
            description,
            requirements: requirements.length ? requirements : ["Submit proof of completion."],
            xp,
            resourceLink: firstStep?.resourceLink ?? firstStep?.resource_link ?? null,
            resourceStartSeconds: firstStep?.resourceStartSeconds ?? firstStep?.resource_start_seconds ?? null,
            resourceEndSeconds: firstStep?.resourceEndSeconds ?? firstStep?.resource_end_seconds ?? null,
          },
        }

        setChallenge(ui)
        setExpandedWeeks(new Set(roadmap.map((w) => w.id)))
        setLoading(false)
      } catch (err) {
        if (!cancelled) {
          setChallenge(null)
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [rawId, requestedDay])

  const fetchEnrollment = async (): Promise<EnrollmentInfo | null> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("elitescore_access_token") : null
    if (!token) return null
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("elitescore_user_id") : null
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
    if (userId) {
      ;(headers as Record<string, string>)["X-User-Id"] = userId
    }

    try {
      const res = await fetch("/api/challenges/my", { headers })
      const data = await res.json().catch(() => null)
      if (process.env.NODE_ENV === "development") {
        console.debug("[Challenge Detail] GET /api/challenges/my", {
          status: res.status,
          ok: res.ok,
          isArray: Array.isArray(data),
          count: Array.isArray(data) ? data.length : null,
        })
      }
      if (!res.ok || !Array.isArray(data)) return null
      return pickEnrollmentForTemplate(data as UserEnrollmentApi[], rawId)
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[Challenge Detail] enrollment fetch error", err)
      }
      return null
    }
  }

  useEffect(() => {
    let cancelled = false
    setEnrollmentLoading(true)
    fetchEnrollment()
      .then((info) => {
        if (cancelled) return
        if (process.env.NODE_ENV === "development") {
          console.debug("[Challenge Detail] enrollment resolved", info)
        }
        setEnrollment(info)
        if (info?.status === "failed") {
          if (info.missedDaysCount >= 3) {
            setChallengeFailedBanner("Missed 3/3 days: you have failed the challenge.")
          } else {
            setChallengeFailedBanner("This challenge has been auto-failed (max missed days reached).")
          }
        }
      })
      .finally(() => {
        if (!cancelled) setEnrollmentLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawId])

  useEffect(() => {
    if (!challenge || !enrollment) return
    const activeUiDay = mapEnrollmentProgressToUiDay(enrollment.currentDay, challenge.duration)
    if (requestedDay == null || Number.isNaN(requestedDay) || requestedDay < activeUiDay) {
      router.replace(`/challenges/${rawId}?day=${activeUiDay}`)
    }
  }, [challenge, enrollment, requestedDay, rawId, router])

  const resetProofModalState = () => {
    setProofText("")
    setProofLink("")
    setProofFiles([])
    setProofNotes("")
    setProofUploading(false)
    setProofMode("text")
    setProofError(null)
    setProofVerdict(null)
    setProofFeedback(null)
    setLastSubmissionId(null)
    setProofAttempt(1)
    setMissedDayNotice(null)
  }

  const closeProofModal = () => {
    setShowUploadProof(false)
    resetProofModalState()
  }

  useEffect(() => {
    if (!showUploadProof) return
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = "hidden"
    body.style.overflow = "hidden"
    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
    }
  }, [showUploadProof])

  const getPendingSubmissionStorageKey = (userChallengeId: string) =>
    `elitescore_pending_submission_${userChallengeId}`

  const readPendingSubmissionId = (userChallengeId: string): string | null => {
    try {
      return localStorage.getItem(getPendingSubmissionStorageKey(userChallengeId))
    } catch {
      return null
    }
  }

  const savePendingSubmissionId = (userChallengeId: string, submissionId: string) => {
    try {
      localStorage.setItem(getPendingSubmissionStorageKey(userChallengeId), submissionId)
    } catch {
      // ignore storage errors
    }
  }

  const clearPendingSubmissionId = (userChallengeId: string) => {
    try {
      localStorage.removeItem(getPendingSubmissionStorageKey(userChallengeId))
    } catch {
      // ignore storage errors
    }
  }

  const openProofModal = () => {
    const activeUiDay = enrollment
      ? mapEnrollmentProgressToUiDay(enrollment.currentDay, challenge?.duration)
      : null
    if (activeUiDay != null && challenge && challenge.todayTask.day < activeUiDay) {
      setDayAdvanceBanner(`Day ${challenge.todayTask.day} is already completed. Continue from Day ${activeUiDay}.`)
      router.replace(`/challenges/${rawId}?day=${activeUiDay}`)
      return
    }
    if (challenge && lockedProofDay === challenge.todayTask.day) {
      setMissedDayNotice(
        `Day ${challenge.todayTask.day} is marked missed. Upload is locked for this day. Continue to the next day.`
      )
      return
    }

    setShowUploadProof(true)
    setProofError(null)
    setMissedDayNotice(null)

    if (!enrollment) return
    const cachedSubmissionId = readPendingSubmissionId(enrollment.userChallengeId)
    if (cachedSubmissionId) {
      setLastSubmissionId(cachedSubmissionId)
      setProofAttempt(2)
      setProofVerdict("rejected")
      if (!proofFeedback) {
        setProofFeedback(
          "A previous submission for this day is pending review/retry. Use Resubmit for the same submission."
        )
      }
    }
  }

  const fetchLatestEliteScoreDelta = async (): Promise<number | null> => {
    const headers = buildAuthHeaders()
    if (!headers) return null
    try {
      const res = await fetch("/api/dashboard", { method: "GET", headers })
      const data = (await res.json().catch(() => ({}))) as DashboardApi
      if (!res.ok || !Array.isArray(data.recentScoreGains)) return null
      const latestPositive = data.recentScoreGains.find(
        (entry) => typeof entry?.eliteScoreDelta === "number" && entry.eliteScoreDelta > 0
      )
      return typeof latestPositive?.eliteScoreDelta === "number"
        ? latestPositive.eliteScoreDelta
        : null
    } catch {
      return null
    }
  }

  const advanceAfterSuccess = async (completedDay: number, earnedEliteScore: number) => {
    const info = await fetchEnrollment()
    if (info) {
      setEnrollment(info)
      if (info.status === "failed") {
        setChallengeFailedBanner(
          "This challenge has been auto-failed (max missed days reached)."
        )
      }
      const nextDay = mapEnrollmentProgressToUiDay(info.currentDay, challenge?.duration)
      setDayAdvanceBanner(
        `Congrats! Day ${completedDay} complete — you got +${earnedEliteScore} EliteScore. Now on Day ${nextDay}.`
      )
      setShowUploadProof(false)
      resetProofModalState()
      // Navigating updates ?day= which triggers the existing load effect to rebuild todayTask.
      router.replace(`/challenges/${rawId}?day=${nextDay}`)
    }
  }

  const MAX_PROOF_FILES = 10
  const MAX_PROOF_FILE_SIZE_BYTES = 15 * 1024 * 1024
  const PROOF_STORAGE_BUCKET = "proofs"

  /** Remove objects we uploaded when proof was not accepted (keeps bucket aligned with “accepted only”). */
  const removeProofFilesFromSupabase = async (paths: string[]): Promise<void> => {
    if (paths.length === 0) return
    const client = getSupabaseBrowserClient()
    if (!client) return
    const session = await ensureSupabaseSession(client)
    if (session.error || !session.userId) return
    const { error } = await client.storage.from(PROOF_STORAGE_BUCKET).remove(paths)
    if (error && process.env.NODE_ENV === "development") {
      console.debug("[proof storage cleanup]", paths.length, "object(s):", error.message)
    }
  }
  const ACCEPTED_PROOF_FILE_EXTENSIONS = [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".txt",
    ".md",
    ".csv",
    ".json",
    ".py",
    ".js",
    ".ts",
    ".tsx",
    ".java",
    ".c",
    ".cpp",
    ".ipynb",
    ".zip",
  ]

  const formatBytes = (bytes: number): string => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B"
    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex += 1
    }
    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
  }

  const fileHasAcceptedExtension = (fileName: string): boolean => {
    const lower = fileName.toLowerCase()
    return ACCEPTED_PROOF_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext))
  }

  const handleProofFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return
    setProofError(null)
    setProofFiles((prev) => {
      const next = [...prev]
      for (const file of Array.from(files)) {
        const duplicate = next.some((f) => f.name === file.name && f.size === file.size && f.type === file.type)
        if (duplicate) continue
        if (next.length >= MAX_PROOF_FILES) break
        next.push(file)
      }
      return next
    })
  }

  const removeProofFileAtIndex = (idx: number) => {
    setProofFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  type ProofAttachment = { url: string; assetType: "image" | "video" | "file" }

  const detectAttachmentAssetType = (file: File): ProofAttachment["assetType"] => {
    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("video/")) return "video"
    return "file"
  }

  const validateProofInputs = ():
    | { ok: true; text: string; link: string; notes: string; files: File[] }
    | { ok: false; message: string } => {
    const text = proofText.trim()
    const link = proofLink.trim()
    const notes = proofNotes.trim()
    const files = proofFiles

    if (!text && !link && files.length === 0) {
      return {
        ok: false,
        message: "Add proof text, a public link, or at least one file before submitting.",
      }
    }
    if (link && !(link.startsWith("http://") || link.startsWith("https://"))) {
      return { ok: false, message: "Proof link must start with http:// or https://" }
    }
    if (text.length > 5000) {
      return { ok: false, message: "Proof text is too long (max 5000 characters)." }
    }
    if (link.length > 500) {
      return { ok: false, message: "Proof link is too long (max 500 characters)." }
    }
    if (notes.length > 1000) {
      return { ok: false, message: "Notes are too long (max 1000 characters)." }
    }
    if (files.length > MAX_PROOF_FILES) {
      return { ok: false, message: `Too many files. Max ${MAX_PROOF_FILES} files allowed.` }
    }
    for (const file of files) {
      if (!fileHasAcceptedExtension(file.name)) {
        return {
          ok: false,
          message:
            "One or more files have unsupported format. Use screenshots, docs, slides, PDF, text/code, CSV, JSON, notebook, or ZIP.",
        }
      }
      if (file.size > MAX_PROOF_FILE_SIZE_BYTES) {
        return {
          ok: false,
          message: `${file.name} is too large (${formatBytes(file.size)}). Max ${formatBytes(
            MAX_PROOF_FILE_SIZE_BYTES
          )} per file.`,
        }
      }
    }

    return { ok: true, text, link, notes, files }
  }

  /**
   * Uploads selected files directly to Supabase Storage (bucket "proofs") and
   * returns metadata that the backend accepts. The path is
   * `${userId}/${userChallengeId}/${timestamp}-${sanitizedName}` so Storage RLS
   * policies (which require auth.uid() as the first folder) pass.
   */
  const uploadProofFilesToStorage = async (
    files: File[],
    userChallengeId: string
  ): Promise<
    | { ok: true; attachments: ProofAttachment[]; storagePaths: string[] }
    | { ok: false; message: string }
  > => {
    if (files.length === 0) return { ok: true, attachments: [], storagePaths: [] }

    const client = getSupabaseBrowserClient()
    if (!client) {
      return {
        ok: false,
        message:
          "File upload is not configured. Please set NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      }
    }

    const session = await ensureSupabaseSession(client)
    const userId = session.userId
    if (!userId) {
      return {
        ok: false,
        message: session.error ?? "Could not confirm your Supabase session for file upload.",
      }
    }

    const uploaded: ProofAttachment[] = []
    const storagePaths: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const safeName = file.name.replace(/[^\w.\-]+/g, "_")
      const path = `${userId}/${userChallengeId}/${Date.now()}-${i}-${safeName}`
      const { error: uploadError } = await client.storage
        .from(PROOF_STORAGE_BUCKET)
        .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false })

      if (uploadError) {
        if (storagePaths.length > 0) {
          await client.storage.from(PROOF_STORAGE_BUCKET).remove(storagePaths)
        }
        const raw = uploadError.message
        const hint =
          /invalid compact jws|jwt|malformed/i.test(raw)
            ? "Your session token is missing, expired, or not valid for this site’s Supabase project. Sign out, sign in again, and retry. On localhost, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to the same Supabase project your auth service uses."
            : raw
        return {
          ok: false,
          message: `Failed to upload "${file.name}": ${hint}`,
        }
      }

      const { data: publicUrlData } = client.storage.from(PROOF_STORAGE_BUCKET).getPublicUrl(path)
      const publicUrl = publicUrlData?.publicUrl
      if (!publicUrl || !/^https?:\/\//i.test(publicUrl)) {
        await client.storage.from(PROOF_STORAGE_BUCKET).remove([path])
        if (storagePaths.length > 0) {
          await client.storage.from(PROOF_STORAGE_BUCKET).remove(storagePaths)
        }
        return {
          ok: false,
          message: `Upload succeeded but could not resolve a public URL for "${file.name}".`,
        }
      }

      storagePaths.push(path)
      uploaded.push({ url: publicUrl, assetType: detectAttachmentAssetType(file) })
    }

    return { ok: true, attachments: uploaded, storagePaths }
  }

  const buildProofBodyJson = (
    text: string,
    link: string,
    notes: string,
    attachments: ProofAttachment[]
  ): Record<string, unknown> => {
    const body: Record<string, unknown> = {}
    if (text) body.proofText = text
    if (link) body.proofLink = link
    if (notes) body.notes = notes
    if (attachments.length) body.attachments = attachments
    return body
  }

  const buildAuthHeaders = (): HeadersInit | null => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("elitescore_access_token") : null
    if (!token) return null
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("elitescore_user_id") : null
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
    if (userId) {
      ;(headers as Record<string, string>)["X-User-Id"] = userId
    }
    return headers
  }

  const submitProof = async () => {
    if (proofSubmitting) return
    setProofError(null)
    setMissedDayNotice(null)

    if (!enrollment) {
      setProofError(
        enrollmentLoading
          ? "Loading your enrollment, please retry in a moment."
          : "You are not enrolled in this challenge yet."
      )
      return
    }
    if (enrollment.status !== "active") {
      setProofError(`Challenge is not active (status: ${enrollment.status}).`)
      return
    }

    const validation = validateProofInputs()
    if (!validation.ok) {
      setProofError(validation.message)
      return
    }

    const headers = buildAuthHeaders()
    if (!headers) {
      setProofError("You are not signed in.")
      return
    }

    setProofSubmitting(true)
    let uploadedStoragePaths: string[] = []
    try {
      let attachments: ProofAttachment[] = []
      if (validation.files.length > 0) {
        setProofUploading(true)
        const uploadResult = await uploadProofFilesToStorage(
          validation.files,
          enrollment.userChallengeId
        )
        setProofUploading(false)
        if (!uploadResult.ok) {
          setProofError(uploadResult.message)
          return
        }
        attachments = uploadResult.attachments
        uploadedStoragePaths = uploadResult.storagePaths
      }

      const body = buildProofBodyJson(
        validation.text,
        validation.link,
        validation.notes,
        attachments
      )

      if (process.env.NODE_ENV === "development") {
        console.debug("[Proof submit] request", {
          userChallengeId: enrollment.userChallengeId,
          bodyKeys: Object.keys(body),
          attachmentCount: attachments.length,
        })
      }
      const res = await fetch(`/api/challenges/${enrollment.userChallengeId}/proofs`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      })
      const data = (await res.json().catch(() => ({}))) as ProofResponse & ProblemDetails
      if (process.env.NODE_ENV === "development") {
        if (!res.ok) {
          console.debug("[Proof submit] response (error)", {
            status: res.status,
            ok: res.ok,
            body: data,
          })
        } else {
          console.debug("[Proof submit] response", {
            status: res.status,
            ok: res.ok,
            aiVerdict: data.aiVerdict,
            aiFeedbackLength: typeof data.aiFeedback === "string" ? data.aiFeedback.length : 0,
            submissionId: data.id,
          })
        }
      }

      if (!res.ok) {
        const detail = typeof data.detail === "string" ? data.detail : ""
        const messageFromApi = extractProblemMessage(data, "")
        const combined = `${detail} ${messageFromApi}`.toLowerCase()
        const hasExistingSubmissionConflict =
          res.status === 409 &&
          /already exists|already submitted|pending|needs_review|rejected|duplicate/i.test(combined)

        if (hasExistingSubmissionConflict) {
          const idFromBody = readSubmissionIdFromBody(data)
          const conflictId = readPendingSubmissionId(enrollment.userChallengeId) ?? idFromBody
          if (conflictId) {
            savePendingSubmissionId(enrollment.userChallengeId, conflictId)
            await removeProofFilesFromSupabase(uploadedStoragePaths)
            setProofAttempt(2)
            setLastSubmissionId(conflictId)
            setProofVerdict("rejected")
            setProofFeedback(
              "This day already has a proof on file. Update your text or choose new files, then tap Resubmit — only an accepted proof keeps uploads in storage."
            )
            setProofError(null)
            return
          }
        }

        if (res.status >= 500) {
          setProofAttempt(1)
          setLastSubmissionId(null)
        }

        await removeProofFilesFromSupabase(uploadedStoragePaths)

        const fallback =
          res.status === 400
            ? "Proof was rejected by validation. Check inputs and try again."
            : res.status === 401
            ? "You are not signed in."
            : res.status === 403
            ? "You do not own this challenge."
            : res.status === 404
            ? "Challenge not found."
            : res.status === 409
            ? "This day already has a proof on file. Use Resubmit after updating your proof, or reload the page."
            : res.status === 502 || res.status === 503 || res.status === 504
            ? "The challenges service is temporarily unavailable. Please try again in a moment."
            : res.status >= 500
            ? "Server error while processing your proof (likely AI verification failed). Please try again."
            : "Could not submit proof. Please try again."
        setProofError(extractProblemMessage(data, fallback))
        return
      }

      const verdict = (data.aiVerdict ?? "").toString().toLowerCase()
      const feedback = typeof data.aiFeedback === "string" ? data.aiFeedback : null

      if (verdict === "accepted") {
        const completedDay = challenge?.todayTask.day ?? Math.max(1, enrollment.currentDay || 1)
        const earnedEliteScore = (await fetchLatestEliteScoreDelta()) ?? challenge?.todayTask.xp ?? 0
        setProofAttempt(1)
        setProofVerdict("accepted")
        setProofFeedback(feedback)
        setLastSubmissionId(data.id ?? null)
        clearPendingSubmissionId(enrollment.userChallengeId)
        await advanceAfterSuccess(completedDay, earnedEliteScore)
      } else {
        await removeProofFilesFromSupabase(uploadedStoragePaths)
        if (data.id) {
          savePendingSubmissionId(enrollment.userChallengeId, data.id)
        }
        setProofAttempt(2)
        setProofVerdict("rejected")
        setProofFeedback(
          feedback ??
            "AI did not accept this proof yet. Change your text or upload new files and tap Resubmit — rejected attempts are not kept in storage."
        )
        setLastSubmissionId(data.id ?? null)
        setProofError(null)
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[Proof submit] fetch error", err)
      }
      await removeProofFilesFromSupabase(uploadedStoragePaths)
      setProofAttempt(1)
      setLastSubmissionId(null)
      setProofError("Network error — could not reach the proof service.")
    } finally {
      setProofSubmitting(false)
      setProofUploading(false)
    }
  }

  const resubmitProof = async () => {
    if (proofSubmitting) return
    setProofError(null)
    setMissedDayNotice(null)

    if (!enrollment) {
      setProofError("Enrollment unavailable. Please reload the page.")
      return
    }
    if (!lastSubmissionId) {
      setProofError("Missing previous submission id; please submit again.")
      return
    }

    const validation = validateProofInputs()
    if (!validation.ok) {
      setProofError(validation.message)
      return
    }

    const headers = buildAuthHeaders()
    if (!headers) {
      setProofError("You are not signed in.")
      return
    }

    setProofSubmitting(true)
    let uploadedStoragePaths: string[] = []
    try {
      let attachments: ProofAttachment[] = []
      if (validation.files.length > 0) {
        setProofUploading(true)
        const uploadResult = await uploadProofFilesToStorage(
          validation.files,
          enrollment.userChallengeId
        )
        setProofUploading(false)
        if (!uploadResult.ok) {
          setProofError(uploadResult.message)
          return
        }
        attachments = uploadResult.attachments
        uploadedStoragePaths = uploadResult.storagePaths
      }

      const body = buildProofBodyJson(
        validation.text,
        validation.link,
        validation.notes,
        attachments
      )

      if (process.env.NODE_ENV === "development") {
        console.debug("[Proof resubmit] request", {
          userChallengeId: enrollment.userChallengeId,
          submissionId: lastSubmissionId,
          bodyKeys: Object.keys(body),
          attachmentCount: attachments.length,
        })
      }
      const res = await fetch(
        `/api/challenges/${enrollment.userChallengeId}/proofs/${lastSubmissionId}/resubmit`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        }
      )
      const data = (await res.json().catch(() => ({}))) as ProofResponse & ProblemDetails
      if (process.env.NODE_ENV === "development") {
        if (!res.ok) {
          console.debug("[Proof resubmit] response (error)", {
            status: res.status,
            ok: res.ok,
            body: data,
          })
        } else {
          console.debug("[Proof resubmit] response", {
            status: res.status,
            ok: res.ok,
            aiVerdict: data.aiVerdict,
            aiFeedbackLength: typeof data.aiFeedback === "string" ? data.aiFeedback.length : 0,
          })
        }
      }

      if (!res.ok) {
        await removeProofFilesFromSupabase(uploadedStoragePaths)
        if (res.status === 410 || res.status === 404) {
          clearPendingSubmissionId(enrollment.userChallengeId)
          setLastSubmissionId(null)
          setProofAttempt(1)
        } else if (res.status >= 500) {
          setLastSubmissionId(null)
          setProofAttempt(1)
        }
        const fallback =
          res.status === 400
            ? "Resubmission failed validation. Check inputs and try again."
            : res.status === 401
            ? "You are not signed in."
            : res.status === 403
            ? "You do not own this proof."
            : res.status === 404
            ? "Proof submission not found for this challenge."
            : res.status === 409
            ? "Proof is no longer eligible for resubmission, or challenge is not active."
            : res.status === 410
            ? "Resubmit window expired (24 hours). Backend will mark the day as missed automatically."
            : res.status === 502 || res.status === 503 || res.status === 504
            ? "The challenges service is temporarily unavailable. Please try again in a moment."
            : res.status >= 500
            ? "Server error while processing your resubmission (likely AI verification failed). Please try again."
            : "Could not resubmit proof. Please try again."
        setProofError(extractProblemMessage(data, fallback))
        return
      }

      const verdict = (data.aiVerdict ?? "").toString().toLowerCase()
      const feedback = typeof data.aiFeedback === "string" ? data.aiFeedback : null

      if (verdict === "accepted") {
        const completedDay = challenge?.todayTask.day ?? Math.max(1, enrollment.currentDay || 1)
        const earnedEliteScore = (await fetchLatestEliteScoreDelta()) ?? challenge?.todayTask.xp ?? 0
        setProofAttempt(1)
        setProofVerdict("accepted")
        setProofFeedback(feedback)
        clearPendingSubmissionId(enrollment.userChallengeId)
        await advanceAfterSuccess(completedDay, earnedEliteScore)
      } else {
        await removeProofFilesFromSupabase(uploadedStoragePaths)
        // Attempt 2 rejected: backend auto-applies missed-day penalty.
        const justMissedDay = challenge?.todayTask.day ?? null
        if (justMissedDay != null) {
          setLockedProofDay(justMissedDay)
        }
        const info = await fetchEnrollment()
        const newMissed = info?.missedDaysCount ?? enrollment.missedDaysCount + 1
        const isFailed = info?.status === "failed"
        const shouldFailChallenge = isFailed || newMissed >= 3
        if (info) {
          setEnrollment({
            ...info,
            status: shouldFailChallenge ? "failed" : info.status,
            missedDaysCount: shouldFailChallenge ? Math.max(3, info.missedDaysCount) : info.missedDaysCount,
          })
        } else {
          setEnrollment((prev) =>
            prev
              ? {
                  ...prev,
                  status: shouldFailChallenge ? "failed" : prev.status,
                  missedDaysCount: shouldFailChallenge ? Math.max(3, newMissed) : newMissed,
                }
              : prev
          )
        }

        if (shouldFailChallenge) {
          setChallengeFailedBanner("Missed 3/3 days: you have failed the challenge.")
          setMissedDayNotice("Missed 3/3 days: you have failed the challenge.")
        } else {
          setMissedDayNotice(
            `Day marked as missed (${newMissed}/3). Moving to the next day.`
          )
          // Advance to next day silently
          if (info) {
            const nextDay = mapEnrollmentProgressToUiDay(info.currentDay, challenge?.duration)
            router.replace(`/challenges/${rawId}?day=${nextDay}`)
          }
        }
        setProofVerdict("rejected")
        setProofFeedback(
          feedback ??
            "AI rejected the resubmission. Uploaded files for this attempt were removed from storage."
        )
        clearPendingSubmissionId(enrollment.userChallengeId)
        setLastSubmissionId(null)
        setProofAttempt(1)
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[Proof resubmit] fetch error", err)
      }
      await removeProofFilesFromSupabase(uploadedStoragePaths)
      setLastSubmissionId(null)
      setProofAttempt(1)
      setProofError("Network error — could not reach the proof service.")
    } finally {
      setProofSubmitting(false)
      setProofUploading(false)
    }
  }

  const handleToggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev)
      if (next.has(weekId)) next.delete(weekId)
      else next.add(weekId)
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f6] px-4">
        <p className="text-sm text-slate-500">Loading challenge...</p>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f6] px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800">Challenge not found</h1>
          <Link
            href="/challenges"
            className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            style={{ background: APP_GRADIENT }}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Challenges
          </Link>
        </div>
      </div>
    )
  }

  const activeUiDay = enrollment
    ? mapEnrollmentProgressToUiDay(enrollment.currentDay, challenge.duration)
    : null
  const displayDay = activeUiDay ?? challenge.todayTask.day
  const isViewingPastDay = activeUiDay != null && challenge.todayTask.day < activeUiDay
  const isCurrentDayLocked = lockedProofDay === challenge.todayTask.day
  const canSubmitToday = Boolean(
    enrollment && enrollment.status === "active" && !isViewingPastDay && !isCurrentDayLocked
  )

  const dayDescParts = splitDayDescription(
    challenge.todayTask.description,
    challenge.name,
    challenge.todayTask.day,
  )
  const watchUrl =
    firstHttpUrlInString(dayDescParts.watchSegment ?? "") ?? challenge.todayTask.resourceLink ?? null
  const showSqlBeforeBegin = isIntroDbSqlDayOne(
    challenge.name,
    challenge.todayTask.day,
    `${challenge.description}\n${challenge.todayTask.title}\n${challenge.todayTask.description}\n${challenge.todayTask.requirements.join("\n")}`,
  )
  const sqlStarterDownloadHref = "/api/downloads/skillsprint-sql-starter-pack"
  const googleAnalyticsStarterPack = resolveGoogleDataAnalyticsStarterPack(
    challenge.name,
    challenge.todayTask.day,
    `${challenge.description}\n${challenge.todayTask.title}\n${challenge.todayTask.description}\n${challenge.todayTask.requirements.join("\n")}`,
  )
  const showCs50BeforeBegin = isCs50IntroBeforeBeginDayOne(
    challenge.name,
    challenge.todayTask.day,
    `${challenge.description}\n${challenge.todayTask.title}\n${challenge.todayTask.description}\n${challenge.todayTask.requirements.join("\n")}`,
  )
  const showMitBeforeBegin = isMitDeepLearningBeforeBeginDayOne(
    challenge.name,
    challenge.todayTask.day,
    `${challenge.description}\n${challenge.todayTask.title}\n${challenge.todayTask.description}\n${challenge.todayTask.requirements.join("\n")}`,
  )

  return (
    <div className="min-h-screen w-full bg-[#f5f5f6] font-sans text-slate-800 antialiased">
      <div className="mx-auto flex w-full max-w-7xl max-md:mx-0 max-md:max-w-none">
        {/* ── Left sidebar: Course outline (desktop only) ── */}
        <aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-white lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <div className="border-b border-slate-100 px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Course outline
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800 leading-snug">
                {challenge.name}
              </p>
            </div>

            {challenge.roadmap.map((week) => {
              const isExpanded = expandedWeeks.has(week.id)
              const isLocked = week.status === "locked"
              const completedCount = week.tasks.filter((t) => t.completed).length

              return (
                <div key={week.id} className="border-b border-slate-100">
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between gap-2 px-5 py-3 text-left transition-colors ${
                      isLocked
                        ? "cursor-default text-slate-400"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={() => !isLocked && handleToggleWeek(week.id)}
                    aria-expanded={isExpanded}
                    disabled={isLocked}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{week.title}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {completedCount}/{week.tasks.length} completed
                      </p>
                    </div>
                    {isLocked ? (
                      <Lock className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
                    ) : isExpanded ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                    )}
                  </button>

                  {isExpanded && !isLocked && (
                    <ul className="pb-2 pl-5 pr-3">
                      {week.tasks.map((task) => {
                        const taskDayNumber =
                          typeof task.day === "number" ? task.day : Number.parseInt(String(task.day), 10)
                        const hasDayNumber = Number.isFinite(taskDayNumber)
                        const isFuture = hasDayNumber ? taskDayNumber > displayDay : false
                        const isCurrent = hasDayNumber ? taskDayNumber === displayDay : false
                        return (
                          <li key={task.id}>
                            <div
                              className={`flex items-center gap-2.5 rounded-xl px-2 py-2 text-sm transition-colors ${
                                isCurrent
                                  ? "bg-pink-50 font-semibold text-pink-700"
                                  : isFuture
                                    ? "cursor-default text-slate-400"
                                    : "cursor-default text-slate-600"
                              }`}
                            >
                              <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                                  task.completed
                                    ? "bg-emerald-500 text-white"
                                    : isCurrent
                                      ? "border-2 border-pink-500 bg-white"
                                      : "border border-slate-200 bg-white"
                                }`}
                                aria-hidden
                              >
                                {task.completed && <Check className="h-3 w-3" />}
                              </span>
                              <span className={`min-w-0 truncate ${isFuture ? "opacity-80" : ""}`}>
                                Day {task.day}: {task.title}
                              </span>
                              {isFuture ? <Lock className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden /> : null}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="min-w-0 flex-1 max-md:-mx-4 max-md:w-[calc(100%+2rem)] px-0 py-6 sm:px-4 md:px-6">
          <div className="mx-auto w-full max-w-3xl space-y-6 max-md:mx-0 max-md:max-w-none max-md:px-3 max-md:pl-[max(0.75rem,env(safe-area-inset-left))] max-md:pr-[max(0.75rem,env(safe-area-inset-right))] md:px-0">
            <Link
              href="/challenges"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
              aria-label="Back to challenges"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to challenges
            </Link>

            {/* Mobile course outline accordion */}
            <div className={`${CARD_BASE} overflow-hidden lg:hidden`}>
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                onClick={() => {
                  setExpandedWeeks((prev) => {
                    const next = new Set(prev)
                    if (next.has("-1")) next.delete("-1")
                    else next.add("-1")
                    return next
                  })
                }}
                aria-expanded={expandedWeeks.has("-1")}
              >
                <span className="text-sm font-semibold text-slate-800">Course outline</span>
                {expandedWeeks.has("-1") ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden />
                )}
              </button>
              {expandedWeeks.has("-1") && (
                <ul className="border-t border-slate-100 px-5 pb-4 pt-3 space-y-1">
                  {challenge.roadmap.flatMap((week) =>
                    week.tasks.map((task) => {
                      const taskDayNumber =
                        typeof task.day === "number" ? task.day : Number.parseInt(String(task.day), 10)
                      const hasDayNumber = Number.isFinite(taskDayNumber)
                      const isFuture = hasDayNumber ? taskDayNumber > displayDay : false
                      const isCurrent = hasDayNumber ? taskDayNumber === displayDay : false
                      return (
                        <li key={task.id} className={`flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm ${isCurrent ? "bg-pink-50 font-semibold text-pink-700" : isFuture ? "text-slate-400" : "text-slate-600"}`}>
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${task.completed ? "bg-emerald-500 text-white" : "border border-slate-200 bg-white"}`} aria-hidden>
                            {task.completed && <Check className="h-3 w-3" />}
                          </span>
                          <span className="truncate">{task.title}</span>
                          {isFuture ? <Lock className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden /> : null}
                        </li>
                      )
                    })
                  )}
                </ul>
              )}
            </div>

            {/* Lesson title + Next */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Day {challenge.todayTask.day} · {challenge.todayTask.xp} XP
                </p>
                <h1 className="mt-0.5 text-xl font-bold leading-tight text-slate-800 sm:text-2xl">
                  {challenge.todayTask.title}
                </h1>
              </div>
              <button
                type="button"
                className="flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-pink-500/40 bg-white px-4 py-2 text-sm font-semibold text-pink-600 transition-all hover:border-pink-500 hover:bg-pink-50 hover:scale-[1.02]"
              >
                Next →
              </button>
            </div>

            {/* Video block — YouTube embed when resourceLink is YouTube, else placeholder with link */}
            {(() => {
              const link = challenge.todayTask.resourceLink
              const startSec = challenge.todayTask.resourceStartSeconds
              const endSec = challenge.todayTask.resourceEndSeconds
              const parsed = link ? parseYouTubeUrl(link) : null
              const embedUrl = parsed
                ? buildYouTubeEmbedUrl(parsed.videoId, startSec ?? parsed.startSeconds, endSec)
                : null

              return (
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-lg">
                  <div className="relative flex aspect-video w-full flex-col bg-slate-900">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={`${challenge.todayTask.title} — video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    ) : (
                      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        {link ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-xl transition-transform hover:scale-105 active:scale-95"
                            aria-label="Play video (opens in new tab)"
                          >
                            <Play className="h-8 w-8 pl-1" fill="currentColor" />
                          </a>
                        ) : (
                          <div
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-xl"
                            aria-hidden
                          >
                            <Play className="h-8 w-8 pl-1" fill="currentColor" />
                          </div>
                        )}
                        {/* Mini stats overlay */}
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-6">
                          <span className="text-xs font-medium text-white/90 truncate pr-2">
                            {challenge.name}
                          </span>
                          <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm shrink-0">
                            <Flame className="h-3.5 w-3.5 text-orange-300" aria-hidden />
                            {challenge.progress}% done
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {challenge.todayTask.title}
                    </p>
                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                      >
                        {parsed ? "Open in YouTube" : "Open link"}
                        <Play className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    )}
                  </div>
                </div>
              )
            })()}

            {/* Action bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-5">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    liked ? "bg-pink-50 text-pink-600" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                  aria-pressed={liked}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} aria-hidden />
                  Like
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Comment
                </button>
                <button
                  type="button"
                  onClick={() => setSaved(!saved)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    saved ? "bg-pink-50 text-pink-600" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                  aria-pressed={saved}
                >
                  <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} aria-hidden />
                  Save
                </button>
              </div>
              <button
                type="button"
                onClick={openProofModal}
                disabled={!canSubmitToday}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: APP_GRADIENT }}
              >
                <Check className="h-4 w-4" aria-hidden />
                {isViewingPastDay
                  ? "Already completed"
                  : isCurrentDayLocked
                  ? "Day marked missed"
                  : "Submit & Complete"}
              </button>
            </div>

            {challengeFailedBanner && (
              <div
                className="mb-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {challengeFailedBanner}
              </div>
            )}
            {dayAdvanceBanner && (
              <div
                className="mb-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                role="status"
              >
                {dayAdvanceBanner}
              </div>
            )}
            {enrollment && enrollment.missedDaysCount > 0 && enrollment.status === "active" && (
              <div className="mb-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                You have {enrollment.missedDaysCount}/3 missed day
                {enrollment.missedDaysCount === 1 ? "" : "s"} on this challenge.
              </div>
            )}
            {isViewingPastDay && (
              <div className="mb-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
                Day {challenge.todayTask.day} is already completed. Submit proof on Day {activeUiDay}.
              </div>
            )}
            {isCurrentDayLocked && (
              <div className="mb-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                Day {challenge.todayTask.day} is marked missed after failed resubmission. Upload is locked for this day.
              </div>
            )}

            {showSqlBeforeBegin && (
              <section className={`${CARD_BASE} p-5 sm:p-6`} aria-labelledby="before-begin-heading">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Before you begin</p>
                <h2 id="before-begin-heading" className="mt-1 text-lg font-bold text-slate-800">
                  Intro to DB and SQL: setup
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Use one SQLite database from start to finish so your work builds naturally over time. The easiest
                  setup is SQLite Online in the browser, then load the starter schema and seed data before Day 1.
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                  <li>
                    Run <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px]">skillsprint_schema.sql</code>{" "}
                    to create the database structure.
                  </li>
                  <li>
                    Run <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px]">skillsprint_seed.sql</code> to
                    load sample data.
                  </li>
                  <li>
                    Test with{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px]">
                      SELECT * FROM courses_feed LIMIT 5;
                    </code>
                  </li>
                  <li>
                    If SQLite Online supports imports, you can try{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px]">skillsprint_starter.db</code>,
                    but schema + seed is the safer default.
                  </li>
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Day focus: Days 1-3 use <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px]">courses_feed</code>.
                  Days 4-6 use <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px]">users</code>,{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px]">courses</code>,{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px]">lessons</code>, and{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px]">enrollments</code>. Day 7 inspects{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px]">messy_courses</code>. From Day 8,
                  continue improving the same SkillSprint DB (schema, data, views, query optimization, and final
                  project).
                </p>
                <a
                  href={sqlStarterDownloadHref}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Download `skillsprint_sql_starter_pack.zip`
                </a>
              </section>
            )}

            {googleAnalyticsStarterPack && (
              <section className={`${CARD_BASE} p-5 sm:p-6`} aria-labelledby="before-begin-gda-heading">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Before you begin</p>
                <h2 id="before-begin-gda-heading" className="mt-1 text-lg font-bold text-slate-800">
                  Google Data Analytics starter pack
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Download the starter files for this milestone day before starting your task.
                </p>
                <a
                  href={googleAnalyticsStarterPack.href}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  {googleAnalyticsStarterPack.label}: `{googleAnalyticsStarterPack.filename}`
                </a>
              </section>
            )}

            {showCs50BeforeBegin && (
              <section className={`${CARD_BASE} p-5 sm:p-6`} aria-labelledby="before-begin-cs50-heading">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Before we begin</p>
                <h2 id="before-begin-cs50-heading" className="mt-1 text-lg font-bold text-slate-800">
                  CS50 setup for Day 1
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Before starting Day 1, keep the setup simple. You do not need a big starter pack or complicated
                  bundle for this challenge.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  What you do need is one coding workspace and one place to keep proof of your work. The easiest option
                  is to use CS50&apos;s browser-based environment (CS50 Sandbox or CS50.dev), so you can start coding
                  quickly without setup friction.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  If you prefer local development, use VS Code and create one main folder for the whole challenge. Keep
                  a notes document in Google Docs, Word, or Notion for reflections and writeups, and make sure your
                  GitHub account is ready for saving or sharing work.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Keep proof simple and organized each day: screenshots, short reflections, code files, or repo links
                  depending on the task. The goal is not only to watch the course, but to build, test, and submit
                  something each day.
                </p>
              </section>
            )}

            {showMitBeforeBegin && (
              <section className={`${CARD_BASE} p-5 sm:p-6`} aria-labelledby="before-begin-mit-heading">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Before we begin</p>
                <h2 id="before-begin-mit-heading" className="mt-1 text-lg font-bold text-slate-800">
                  MIT 6.S191 setup for Day 1
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Before starting Day 1, make sure you have a Google account and can open Google Colab in your browser,
                  because the MIT software labs are designed to run there.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  You do not need a heavy starter pack for this challenge, but you should be comfortable opening
                  notebooks, running Python 3 code, and saving screenshots or notes from your work.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  If your device allows it, enable GPU in Colab for the lab days, since MIT recommends it when
                  available.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Keep one folder or document for notes, reflections, diagrams, and screenshots so submissions stay
                  organized throughout the challenge.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Main resources: the MIT 6.S191 playlist and linked lab repositories on GitHub.
                </p>
              </section>
            )}

            {/* Challenge description — watch/link + instructions in separate boxes when parsable */}
            <section className={`${CARD_BASE} space-y-4 p-5 sm:p-6`} aria-labelledby="challenge-desc-heading">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Challenge · Day {challenge.todayTask.day}
                </p>
                <h2 id="challenge-desc-heading" className="mt-1 text-lg font-bold text-slate-800">
                  {challenge.todayTask.title}
                </h2>
              </div>
              {dayDescParts.watchSegment ? (
                <>
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-4 sm:p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      {dayDescParts.namedLinks && dayDescParts.namedLinks.length > 1
                        ? "Watch & project links"
                        : "Watch"}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-800">
                      {watchTimingsLabel(dayDescParts.watchSegment)}
                    </p>
                    {dayDescParts.namedLinks && dayDescParts.namedLinks.length > 0 ? (
                      <ul className="mt-3 list-none space-y-2.5 p-0">
                        {dayDescParts.namedLinks.map((row) => (
                          <li
                            key={row.url}
                            className="rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 shadow-sm"
                          >
                            <a
                              href={row.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-pink-600 underline-offset-2 hover:underline"
                            >
                              {row.label}
                            </a>
                            <p className="mt-1 break-all text-[11px] leading-snug text-slate-500">{row.url}</p>
                          </li>
                        ))}
                      </ul>
                    ) : watchUrl ? (
                      <a
                        href={watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex max-w-full items-center gap-1.5 break-all text-sm font-semibold text-pink-600 underline-offset-2 hover:underline"
                      >
                        {watchUrl}
                      </a>
                    ) : null}
                  </div>
                  {dayDescParts.instructions ? (
                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{"Today's challenge"}</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{dayDescParts.instructions}</p>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-sm leading-relaxed text-slate-600">{challenge.todayTask.description}</p>
              )}
            </section>

            {/* What to submit card */}
            <section className={`${CARD_BASE} p-5 sm:p-6`} aria-labelledby="submit-heading">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Submission
              </p>
              <h2 id="submit-heading" className="mt-1 text-lg font-bold text-slate-800">
                What to submit
              </h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <ul className="list-none divide-y divide-slate-200/80 p-0">
                  {challenge.todayTask.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm"
                        style={{ background: APP_GRADIENT }}
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 text-sm leading-relaxed text-slate-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={openProofModal}
                disabled={!canSubmitToday}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: APP_GRADIENT }}
              >
                <Upload className="h-4 w-4" aria-hidden />
                {isViewingPastDay
                  ? "Day already completed"
                  : isCurrentDayLocked
                  ? "Day marked missed"
                  : "Upload Proof"}
              </button>
            </section>

            {/* Progress stats row */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { label: "Day", value: `${challenge.currentDay} / ${challenge.duration}`, icon: Target },
                { label: "Days left", value: `${challenge.daysRemaining}`, icon: Flame },
                { label: "Reward", value: `+${challenge.reward} XP`, icon: Check, accent: true },
              ].map(({ label, value, icon: Icon, accent }) => (
                <article
                  key={label}
                  className={`${CARD_BASE} flex flex-col items-center py-5 px-4 text-center`}
                >
                  <Icon
                    className={`h-5 w-5 ${accent ? "text-pink-500" : "text-slate-400"}`}
                    aria-hidden
                  />
                  <p className={`mt-2 text-xl font-bold ${accent ? "text-pink-600" : "text-slate-800"}`}>
                    {value}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {label}
                  </p>
                </article>
              ))}
            </div>

            <p className="text-center text-[11px] leading-snug text-slate-500 sm:text-xs">
              Something wrong? Contact us at{" "}
              <a
                href={ELITESCORE_SUPPORT_MAILTO}
                className="font-medium text-pink-600 underline-offset-2 hover:underline break-all"
              >
                {ELITESCORE_SUPPORT_EMAIL}
              </a>
            </p>
          </div>
        </main>
      </div>

      {/* Upload Proof Modal - light theme (no page/overlay scroll; fits under header + bottom nav on mobile) */}
      {showUploadProof && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/40 px-3 py-2 pt-[max(0.25rem,calc(3.5rem+env(safe-area-inset-top)-0.5rem))] pb-[max(0.25rem,calc(3.75rem+env(safe-area-inset-bottom)))] backdrop-blur-sm sm:p-3 sm:pt-3 sm:pb-3"
          onClick={closeProofModal}
        >
          <div
            className="flex w-full max-w-[42rem] max-h-[calc(100svh-7.75rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[min(96svh,52rem)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="proof-modal-title"
          >
            <div className="flex min-h-0 flex-1 flex-col px-4 pb-0 pt-3 sm:px-6 sm:pt-4">
              <p className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Submit proof
              </p>
              <h3
                id="proof-modal-title"
                className="mt-0.5 shrink-0 text-base font-bold text-slate-800 sm:text-lg"
              >
                {proofVerdict === "accepted"
                  ? "Proof accepted"
                  : proofVerdict === "rejected"
                  ? "AI feedback — please resubmit"
                  : "Upload your completion proof"}
              </h3>

              {enrollmentLoading && (
                <p className="mt-2 shrink-0 text-xs text-slate-500">Loading your enrollment...</p>
              )}
              {!enrollmentLoading && !enrollment && (
                <p className="mt-2 shrink-0 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  You are not enrolled in this challenge.
                </p>
              )}

              <div className="mt-3 flex min-h-0 flex-1 flex-col gap-0 overflow-hidden sm:mt-4">
                <div
                  className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-y-contain pr-0.5 [-webkit-overflow-scrolling:touch] sm:space-y-3"
                  role="region"
                  aria-label="Proof form"
                >
                {proofVerdict !== "accepted" && (
                  <>
                    <div className="shrink-0">
                      <p className="mb-1.5 text-xs font-semibold text-slate-700 sm:mb-2">Proof type</p>
                      <div className="grid grid-cols-3 gap-2">
                        {(["text", "link", "upload"] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setProofMode(mode)}
                            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors sm:py-2 ${
                              proofMode === mode
                                ? "border-pink-500/60 bg-pink-50 text-pink-600"
                                : "border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                            aria-pressed={proofMode === mode}
                          >
                            {mode === "text" ? "Text" : mode === "link" ? "Link" : "Upload"}
                          </button>
                        ))}
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-500">
                        Supports screenshots, docs, slides, PDF, code files, GitHub/public links.
                      </p>
                    </div>

                    {proofMode === "text" ? (
                      <div className="flex min-h-0 flex-1 flex-col">
                        <label htmlFor="proof-text" className="mb-1 block text-xs font-medium text-slate-700">
                          Proof text <span className="text-slate-400">({proofText.length}/5000)</span>
                        </label>
                        <textarea
                          id="proof-text"
                          value={proofText}
                          onChange={(e) => setProofText(e.target.value)}
                          placeholder="Describe what you completed in detail. Include key takeaways."
                          maxLength={5000}
                          rows={4}
                          className="min-h-0 w-full flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 max-md:max-h-[6.5rem] sm:max-h-none sm:min-h-[9.5rem] sm:flex-none sm:px-4 sm:py-3"
                          disabled={proofSubmitting}
                        />
                      </div>
                    ) : proofMode === "link" ? (
                      <div className="shrink-0">
                        <label htmlFor="proof-link" className="mb-1 block text-xs font-medium text-slate-700">
                          Public proof URL
                        </label>
                        <input
                          id="proof-link"
                          type="url"
                          value={proofLink}
                          onChange={(e) => setProofLink(e.target.value)}
                          placeholder="https://github.com/you/project or any public URL"
                          maxLength={500}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 sm:py-2.5"
                          disabled={proofSubmitting}
                        />
                        <p className="mt-1 text-[11px] text-slate-400">Must start with http:// or https://</p>
                      </div>
                    ) : (
                      <div className="shrink-0 space-y-3">
                        <div>
                          <label htmlFor="proof-files" className="mb-1 block text-xs font-medium text-slate-700">
                            Upload files
                          </label>
                          <input
                            id="proof-files"
                            type="file"
                            multiple
                            accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.csv,.json,.py,.js,.ts,.tsx,.java,.c,.cpp,.ipynb,.zip"
                            onChange={(e) => handleProofFilesSelected(e.target.files)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                            disabled={proofSubmitting}
                          />
                          <p className="mt-1 text-[11px] text-slate-400">
                            Max {MAX_PROOF_FILES} files, {formatBytes(MAX_PROOF_FILE_SIZE_BYTES)} each.
                          </p>
                        </div>
                        {proofFiles.length > 0 && (
                          <ul className="max-h-28 overflow-y-auto rounded-xl border border-slate-200/80 bg-slate-50/60 p-2">
                            {proofFiles.map((file, idx) => (
                              <li key={`${file.name}-${idx}`} className="flex items-center justify-between gap-2 py-1 text-xs text-slate-700">
                                <span className="truncate">
                                  {file.name} <span className="text-slate-400">({formatBytes(file.size)})</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeProofFileAtIndex(idx)}
                                  className="rounded-md px-2 py-0.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                                  disabled={proofSubmitting}
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="text-[11px] text-slate-500">
                          Need to submit only a URL? Use the <span className="font-semibold">Link</span> tab.
                        </p>
                      </div>
                    )}

                    <div className="shrink-0">
                      <label htmlFor="proof-notes" className="mb-1 block text-xs font-medium text-slate-700">
                        Notes <span className="font-normal text-slate-400">(optional, {proofNotes.length}/1000)</span>
                      </label>
                      <textarea
                        id="proof-notes"
                        value={proofNotes}
                        onChange={(e) => setProofNotes(e.target.value)}
                        placeholder="Anything else the verifier should know..."
                        maxLength={1000}
                        rows={2}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs leading-snug text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 max-md:min-h-0 sm:px-4 sm:py-3 sm:text-sm sm:leading-normal"
                        disabled={proofSubmitting}
                      />
                    </div>
                  </>
                )}

                {proofVerdict === "accepted" && proofFeedback && (
                  <div className="shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs leading-relaxed text-emerald-800 sm:py-2.5">
                    <p className="font-semibold">AI verdict: accepted</p>
                    <p className="mt-1 whitespace-pre-wrap break-words max-md:line-clamp-6">{proofFeedback}</p>
                  </div>
                )}
                {proofVerdict === "rejected" && proofFeedback && (
                  <div className="min-h-0 shrink-0 overflow-hidden rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-800 sm:py-2.5">
                    <p className="font-semibold">AI feedback</p>
                    <p className="mt-1 whitespace-pre-wrap break-words max-md:line-clamp-5">{proofFeedback}</p>
                    <p className="mt-2 text-[11px] text-red-700/80 max-md:line-clamp-2">
                      You can edit your inputs above and click Resubmit. You have a 24-hour window.
                    </p>
                  </div>
                )}
                {missedDayNotice && (
                  <div
                    className="shrink-0 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 max-md:line-clamp-4 sm:py-2.5"
                    role="status"
                  >
                    {missedDayNotice}
                  </div>
                )}
                {proofError && (
                  <div
                    className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:py-2.5"
                    role="alert"
                  >
                    {proofError}
                  </div>
                )}
                </div>

                <div className="shrink-0 border-t border-slate-100 bg-white px-0 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:px-6 sm:pt-3">
                <p className="shrink-0 text-center text-[11px] leading-snug text-slate-500 sm:text-xs">
                  Something wrong? Contact us at{" "}
                  <a
                    href={ELITESCORE_SUPPORT_MAILTO}
                    className="font-medium text-pink-600 underline-offset-2 hover:underline break-all"
                  >
                    {ELITESCORE_SUPPORT_EMAIL}
                  </a>
                </p>

                <div className="mt-2 shrink-0 sm:pt-0">
                  {proofSubmitting && (
                    <p className="mb-2 text-center text-xs text-slate-500 max-md:line-clamp-2 sm:line-clamp-none">
                      {proofUploading
                        ? "Uploading files to secure storage..."
                        : "Processing your proof. This may take up to one minute."}
                    </p>
                  )}
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={closeProofModal}
                      className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 sm:py-3"
                      disabled={proofSubmitting}
                    >
                      {proofVerdict === "accepted" ? "Close" : "Cancel"}
                    </button>
                    {proofVerdict === "accepted" ? (
                      <button
                        type="button"
                        onClick={closeProofModal}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02] sm:py-3"
                        style={{ background: APP_GRADIENT }}
                      >
                        <Check className="h-4 w-4" aria-hidden /> Continue
                      </button>
                    ) : proofAttempt === 2 && lastSubmissionId ? (
                      <button
                        type="button"
                        onClick={resubmitProof}
                        disabled={proofSubmitting || !enrollment || isCurrentDayLocked}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 sm:py-3"
                        style={{ background: APP_GRADIENT }}
                      >
                        <Upload className="h-4 w-4" aria-hidden />
                        {proofUploading
                          ? "Uploading..."
                          : proofSubmitting
                          ? "Resubmitting..."
                          : "Resubmit"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={submitProof}
                        disabled={proofSubmitting || !enrollment || isCurrentDayLocked}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 sm:py-3"
                        style={{ background: APP_GRADIENT }}
                      >
                        <Upload className="h-4 w-4" aria-hidden />
                        {proofUploading
                          ? "Uploading..."
                          : proofSubmitting
                          ? "Submitting..."
                          : "Submit"}
                      </button>
                    )}
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ChallengeDetailPageRoot() {
  return (
    <Suspense fallback={<ChallengeDetailPageFallback />}>
      <ChallengeDetailPage />
    </Suspense>
  )
}
