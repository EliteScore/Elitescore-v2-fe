"use client"

import React, { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Clock, Flame, TrendingUp, Trophy, ArrowUpRight, CheckCircle2, Upload, ChevronRight, X } from "lucide-react"

const DASHBOARD_URL = "/api/dashboard"
const CHALLENGES_MY_URL = "/api/challenges/my"
const CHALLENGES_URL = "/api/challenges"
const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"
const CARD_BASE = "rounded-2xl border border-slate-200/80 bg-white shadow-sm"
const ONBOARDING_PENDING_KEY = "elitescore_onboarding_pending"
const ONBOARDING_DONE_KEY = "elitescore_onboarding_done"

type DashboardStreaks = { streakCurrent?: number; streakLongest?: number; lastActiveAt?: string | null }
type LeaderboardSummary = { currentRank?: number; eliteScore?: number; percentile?: number }
type LeaderboardEntry = {
  userId?: string
  handle?: string
  displayName?: string
  name?: string
  avatarUrl?: string | null
  eliteScore?: number
  score?: number
  rank?: number
  isCurrentUser?: boolean
}
type LeaderboardPreview = {
  title?: string
  summary?: LeaderboardSummary
  entries?: LeaderboardEntry[]
}
type DashboardResponse = {
  eliteScore?: number
  globalRank?: number
  percentile?: number
  streaks?: DashboardStreaks
  recentScoreGains?: Array<{ eventType?: string; eliteScoreDelta?: number; createdAt?: string }>
  leaderboardPreview?: LeaderboardPreview
  [key: string]: unknown
}

type UserChallenge = {
  id: string | number
  userId?: string
  challengeTemplateId?: string | number
  status?: string
  startDate?: string
  endDate?: string
  currentDay?: number
  missedDaysCount?: number
  createdAt?: string
}

type ChallengeTemplateApi = {
  id?: string
  name?: string
  track?: string
  difficulty?: number
  durationDays?: number
  dailyRewardEliteScore?: number
  completionBonus?: number
}

type ActiveChallengeUi = {
  id: string
  templateId: string | null
  title: string
  statusLabel: string
  progress: number
  currentDay: number
  endDateLabel: string
  endDateUrgent: boolean
  missedDaysCount: number
  challengeTemplateIdLabel: string
  trackLabel: string
  difficulty: number
  durationDays: number
  rewardPoints: number
}

type OnboardingStep = {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

function parseDashboardResponse(raw: unknown): DashboardResponse | null {
  if (!raw || typeof raw !== "object") return null
  const d = raw as Record<string, unknown>
  return {
    eliteScore: typeof d.eliteScore === "number" ? d.eliteScore : undefined,
    globalRank: typeof d.globalRank === "number" ? d.globalRank : undefined,
    percentile: typeof d.percentile === "number" ? d.percentile : undefined,
    streaks: d.streaks && typeof d.streaks === "object" ? {
      streakCurrent: typeof (d.streaks as Record<string, unknown>).streakCurrent === "number" ? (d.streaks as Record<string, unknown>).streakCurrent as number : undefined,
      streakLongest: typeof (d.streaks as Record<string, unknown>).streakLongest === "number" ? (d.streaks as Record<string, unknown>).streakLongest as number : undefined,
      lastActiveAt: typeof (d.streaks as Record<string, unknown>).lastActiveAt === "string" ? (d.streaks as Record<string, unknown>).lastActiveAt as string : undefined,
    } : undefined,
    recentScoreGains: Array.isArray(d.recentScoreGains) ? d.recentScoreGains : undefined,
    leaderboardPreview: d.leaderboardPreview && typeof d.leaderboardPreview === "object" ? (() => {
      const lp = d.leaderboardPreview as Record<string, unknown>
      const sum = lp.summary && typeof lp.summary === "object" ? lp.summary as LeaderboardSummary : undefined
      return {
        title: typeof lp.title === "string" ? lp.title : undefined,
        summary: sum,
        entries: Array.isArray(lp.entries) ? lp.entries as LeaderboardEntry[] : undefined,
      }
    })() : undefined,
  }
}

function scoreThisWeekFromGains(gains: DashboardResponse["recentScoreGains"]): number {
  if (!Array.isArray(gains)) return 0
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return gains.reduce((sum, e) => {
    const delta = typeof (e as Record<string, unknown>)?.eliteScoreDelta === "number" ? (e as Record<string, unknown>).eliteScoreDelta as number : 0
    const created = (e as Record<string, unknown>)?.createdAt
    const ts = typeof created === "string" ? new Date(created).getTime() : 0
    return ts >= oneWeekAgo ? sum + delta : sum
  }, 0)
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

function getDisplayName(): string {
  if (typeof window === "undefined") return "there"
  const fullName = localStorage.getItem("elitescore_full_name")
  if (fullName?.trim()) return fullName.trim()
  const username = localStorage.getItem("elitescore_username")
  if (username) return username
  const email = localStorage.getItem("elitescore_email")
  if (email) return email.split("@")[0] || "there"
  return "there"
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0]?.slice(0, 2) ?? "?").toUpperCase()
}

const CHALLENGE_CATEGORIES = ["Top", "AI", "Tech", "Career"]
const GRADIENT_BY_TRACK: Record<string, string> = {
  AI: "from-violet-500/90 to-purple-500/90",
  Tech: "from-blue-500/90 to-indigo-500/90",
  Career: "from-pink-500/90 to-rose-500/90",
  default: "from-amber-500/90 to-orange-500/90",
}


function DifficultyDots({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <div className="mt-2 flex gap-1" aria-label={`Difficulty ${level} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 w-5 rounded-full"
          style={
            i < level
              ? { background: APP_GRADIENT }
              : { background: "#e2e8f0" }
          }
        />
      ))}
    </div>
  )
}

function toIsoDate(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null
  const ts = Date.parse(raw)
  if (!Number.isFinite(ts)) return null
  return new Date(ts).toISOString()
}

function parseUserChallenges(raw: unknown): UserChallenge[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {}
    return {
      id: (row.id as string | number | undefined) ?? `row-${index}`,
      userId: typeof row.userId === "string" ? row.userId : typeof row.user_id === "string" ? row.user_id : undefined,
      challengeTemplateId:
        typeof row.challengeTemplateId === "string" || typeof row.challengeTemplateId === "number"
          ? (row.challengeTemplateId as string | number)
          : typeof row.challenge_template_id === "string" || typeof row.challenge_template_id === "number"
            ? (row.challenge_template_id as string | number)
            : undefined,
      status:
        typeof row.status === "string"
          ? row.status
          : typeof row.challenge_status === "string"
            ? row.challenge_status
            : undefined,
      startDate: toIsoDate(row.startDate) ?? toIsoDate(row.start_date) ?? undefined,
      endDate: toIsoDate(row.endDate) ?? toIsoDate(row.end_date) ?? undefined,
      currentDay:
        typeof row.currentDay === "number"
          ? row.currentDay
          : typeof row.current_day === "number"
            ? row.current_day
            : undefined,
      missedDaysCount:
        typeof row.missedDaysCount === "number"
          ? row.missedDaysCount
          : typeof row.missed_days_count === "number"
            ? row.missed_days_count
            : undefined,
      createdAt: toIsoDate(row.createdAt) ?? toIsoDate(row.created_at) ?? undefined,
    }
  })
}

function parseChallengeTemplates(raw: unknown): Record<string, ChallengeTemplateApi> {
  if (!Array.isArray(raw)) return {}
  const map: Record<string, ChallengeTemplateApi> = {}
  raw.forEach((item) => {
    if (!item || typeof item !== "object") return
    const row = item as Record<string, unknown>
    const id = typeof row.id === "string" ? row.id : undefined
    if (!id) return
    map[id] = {
      id,
      name: typeof row.name === "string" ? row.name : undefined,
      track: typeof row.track === "string" ? row.track : undefined,
      difficulty: typeof row.difficulty === "number" ? row.difficulty : undefined,
      durationDays: typeof row.durationDays === "number" ? row.durationDays : undefined,
      dailyRewardEliteScore: typeof row.dailyRewardEliteScore === "number" ? row.dailyRewardEliteScore : undefined,
      completionBonus: typeof row.completionBonus === "number" ? row.completionBonus : undefined,
    }
  })
  return map
}

function shortTemplateId(value: string): string {
  if (value.length <= 8) return value
  return `${value.slice(0, 4)}...${value.slice(-4)}`
}

function mapToActiveChallengeUi(
  challenge: UserChallenge,
  templatesById: Record<string, ChallengeTemplateApi>,
): ActiveChallengeUi {
  const currentDay = Math.max(0, challenge.currentDay ?? 0)
  const templateId = challenge.challengeTemplateId != null ? String(challenge.challengeTemplateId) : "Unknown"
  const template = templateId !== "Unknown" ? templatesById[templateId] : undefined
  const durationDays = typeof template?.durationDays === "number" && template.durationDays > 0 ? template.durationDays : 0
  const progressBase = durationDays > 0 ? Math.round((currentDay / durationDays) * 100) : currentDay * 10
  const progress = Math.min(100, Math.max(0, progressBase))
  const statusLabel = (challenge.status ?? "active").replaceAll("_", " ")
  const endTs = challenge.endDate ? Date.parse(challenge.endDate) : NaN
  const endDateLabel =
    Number.isFinite(endTs) ? new Date(endTs).toLocaleDateString() : "No end date"
  const endDateUrgent = Number.isFinite(endTs) ? endTs - Date.now() <= 2 * 24 * 60 * 60 * 1000 : false
  const difficulty =
    typeof template?.difficulty === "number" && Number.isFinite(template.difficulty)
      ? Math.min(5, Math.max(1, Math.round(template.difficulty)))
      : 3
  const rewardPoints =
    typeof template?.completionBonus === "number"
      ? template.completionBonus
      : typeof template?.dailyRewardEliteScore === "number" && durationDays > 0
        ? template.dailyRewardEliteScore * durationDays
        : 0

  return {
    id: String(challenge.id),
    templateId: templateId !== "Unknown" ? templateId : null,
    title: template?.name?.trim() || "Challenge",
    statusLabel,
    progress,
    currentDay,
    endDateLabel,
    endDateUrgent,
    missedDaysCount: Math.max(0, challenge.missedDaysCount ?? 0),
    challengeTemplateIdLabel: shortTemplateId(templateId),
    trackLabel: template?.track?.trim() || "General",
    difficulty,
    durationDays,
    rewardPoints,
  }
}

export default function HomePage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [displayName, setDisplayName] = useState("there")
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [myChallenges, setMyChallenges] = useState<UserChallenge[]>([])
  const [challengeTemplatesById, setChallengeTemplatesById] = useState<Record<string, ChallengeTemplateApi>>({})
  const [challengeLibrary, setChallengeLibrary] = useState<ChallengeTemplateApi[]>([])
  const [myChallengesLoading, setMyChallengesLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("Top")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStepIndex, setOnboardingStepIndex] = useState(0)

  const onboardingSteps: OnboardingStep[] = [
    {
      title: "Join your first challenge",
      description:
        "Start in Challenges and lock in one challenge. This unlocks your daily tasks and score gains.",
      actionLabel: "Open Challenges",
      actionHref: "/challenges",
    },
    {
      title: "Add one accountability friend",
      description:
        "When you lock in, add at least one friend email. They keep you accountable and can follow your progress.",
      actionLabel: "Invite from Challenges",
      actionHref: "/challenges",
    },
    {
      title: "Open your challenge and read today's task",
      description:
        "Go to your active challenge and check the day task before you submit anything.",
      actionLabel: "View My Challenges",
      actionHref: "/challenges",
    },
    {
      title: "Submit proof correctly",
      description:
        "Proof must be valid and on time. Late, invalid, or missing proof can fail the day and hurt your streak.",
      actionLabel: "See Proof Flow",
      actionHref: "/challenges",
    },
    {
      title: "Track EliteScore and leaderboard",
      description:
        "EliteScore, streak, and weekly gains move your rank. Stay consistent to climb the leaderboard faster.",
      actionLabel: "Open Leaderboard",
      actionHref: "/leaderboard",
    },
  ]

  useEffect(() => {
    const token = localStorage.getItem("elitescore_access_token")
    const loggedIn = localStorage.getItem("elitescore_logged_in")
    const isAuthorized = Boolean(token || loggedIn === "true")
    if (!isAuthorized) {
      router.replace("/login")
      return
    }
    setDisplayName(getDisplayName())
    setAuthChecked(true)
  }, [router])

  useEffect(() => {
    if (!authChecked) return
    const onboardingPending = localStorage.getItem(ONBOARDING_PENDING_KEY) === "true"
    const onboardingDone = localStorage.getItem(ONBOARDING_DONE_KEY) === "true"
    if (onboardingPending && !onboardingDone) {
      setOnboardingStepIndex(0)
      setShowOnboarding(true)
    }
  }, [authChecked])

  useEffect(() => {
    if (!authChecked) return
    const token = localStorage.getItem("elitescore_access_token")
    const userId = localStorage.getItem("elitescore_user_id")
    if (process.env.NODE_ENV === "development") {
      console.debug("[Home Dashboard] token present:", !!token, "| userId:", userId ?? "(none)")
      if (token) console.debug("[Home Dashboard] token preview:", token.slice(0, 20) + "..." + token.slice(-8))
    }
    if (!token || !userId) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Home Dashboard] skipping fetch — missing token or userId in localStorage")
      }
      setDashboardLoading(false)
      return
    }
    let cancelled = false
    setDashboardLoading(true)
    fetch(DASHBOARD_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-User-Id": userId,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null)
        if (process.env.NODE_ENV === "development") {
          const keys = data && typeof data === "object" && data !== null ? Object.keys(data) : []
          console.debug("[Home Dashboard] GET /api/dashboard", "status:", res.status, "ok:", res.ok, "rawKeys:", keys)
          console.debug("[Home Dashboard] response body (full):", JSON.stringify(data, null, 2))
          if (res.status === 401) {
            console.warn("[Home Dashboard] 401 Unauthorized — check token and X-User-Id. Challenges API may require valid JWT or dev X-User-Id.")
          }
        }
        if (!res.ok) {
          if (!cancelled) setDashboard(null)
          return null
        }
        return data
      })
      .then((data) => {
        if (cancelled) return
        const parsed = parseDashboardResponse(data)
        if (process.env.NODE_ENV === "development" && parsed) {
          console.debug("[Home Dashboard] parsed", {
            eliteScore: parsed.eliteScore,
            globalRank: parsed.globalRank,
            percentile: parsed.percentile,
            streakCurrent: parsed.streaks?.streakCurrent,
            leaderboardEntries: parsed.leaderboardPreview?.entries?.length ?? 0,
            recentScoreGainsCount: parsed.recentScoreGains?.length ?? 0,
          })
        }
        setDashboard(parsed)
      })
      .catch((err) => {
        if (!cancelled) {
          if (process.env.NODE_ENV === "development") {
            console.debug("[Home Dashboard] fetch error", err)
          }
          setDashboard(null)
        }
      })
      .finally(() => {
        if (!cancelled) setDashboardLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [authChecked])

  useEffect(() => {
    if (!authChecked) return
    const token = localStorage.getItem("elitescore_access_token")
    if (!token) {
      setChallengeTemplatesById({})
      setChallengeLibrary([])
      setMyChallenges([])
      setMyChallengesLoading(false)
      return
    }
    const userId = localStorage.getItem("elitescore_user_id")
    let cancelled = false
    setMyChallengesLoading(true)

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
    if (userId) headers["X-User-Id"] = userId

    Promise.all([
      fetch(CHALLENGES_URL, { method: "GET", headers }).then(async (res) => {
        const body = await res.json().catch(() => null)
        if (process.env.NODE_ENV === "development") {
          console.debug("[Home Active Challenges] GET /api/challenges", {
            status: res.status,
            ok: res.ok,
            isArray: Array.isArray(body),
            count: Array.isArray(body) ? body.length : null,
            body,
          })
        }
        if (!res.ok || !Array.isArray(body)) {
          return { templatesMap: {}, templatesList: [] as ChallengeTemplateApi[] }
        }
        return {
          templatesMap: parseChallengeTemplates(body),
          templatesList: body as ChallengeTemplateApi[],
        }
      }),
      fetch(CHALLENGES_MY_URL, { method: "GET", headers }).then(async (res) => {
        const body = await res.json().catch(() => null)
        if (process.env.NODE_ENV === "development") {
          console.debug("[Home Active Challenges] GET /api/challenges/my", {
            status: res.status,
            ok: res.ok,
            isArray: Array.isArray(body),
            count: Array.isArray(body) ? body.length : null,
            body,
          })
        }
        if (!res.ok) return []
        return parseUserChallenges(body)
      }),
    ])
      .then(([templatesPayload, rows]) => {
        if (cancelled) return
        setChallengeTemplatesById(templatesPayload.templatesMap)
        setChallengeLibrary(templatesPayload.templatesList)
        setMyChallenges(rows)
      })
      .catch((err) => {
        if (cancelled) return
        if (process.env.NODE_ENV === "development") {
          console.debug("[Home Active Challenges] fetch error", err)
        }
        setChallengeTemplatesById({})
        setChallengeLibrary([])
        setMyChallenges([])
      })
      .finally(() => {
        if (!cancelled) setMyChallengesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [authChecked])

  const eliteScore = dashboard?.eliteScore ?? 0
  const globalRank = dashboard?.globalRank
  const percentile = dashboard?.percentile
  const streakCurrent = dashboard?.streaks?.streakCurrent ?? 0
  const streakLongest = dashboard?.streaks?.streakLongest ?? 0
  const recentScoreGains = dashboard?.recentScoreGains ?? []
  const scoreThisWeek = scoreThisWeekFromGains(recentScoreGains)
  const rawLeaderboardEntries = dashboard?.leaderboardPreview?.entries ?? []
  const leaderboardEntries: LeaderboardEntry[] = rawLeaderboardEntries.map((e) => ({
    userId: e.userId,
    displayName: e.displayName ?? e.name,
    handle: e.handle,
    avatarUrl: e.avatarUrl,
    eliteScore: e.eliteScore ?? e.score,
    rank: e.rank,
    isCurrentUser: e.isCurrentUser,
  }))
  const leaderboardTitle = dashboard?.leaderboardPreview?.title ?? "Leaderboard"
  const leaderboardSummary = dashboard?.leaderboardPreview?.summary
  type RecommendationUi = {
    id: string
    title: string
    category: string
    points: number
    durationDays?: number
    difficulty?: number
    members: string
    gradientClass: string
  }
  const recommendedForUi: RecommendationUi[] = useMemo(
    () =>
      challengeLibrary.map((c, index) => {
        const trackRaw = (c.track ?? "").toLowerCase()
        const category = trackRaw.includes("ai")
          ? "AI"
          : trackRaw.includes("career")
          ? "Career"
          : "Tech"
        const duration = typeof c.durationDays === "number" ? c.durationDays : undefined
        const points =
          typeof c.completionBonus === "number"
            ? c.completionBonus
            : typeof c.dailyRewardEliteScore === "number" && duration
              ? c.dailyRewardEliteScore * duration
              : c.dailyRewardEliteScore ?? 0
        return {
          id: c.id ?? `challenge-${index}`,
          title: c.name ?? "Challenge",
          category,
          points,
          durationDays: duration,
          difficulty: c.difficulty,
          members: "",
          gradientClass: GRADIENT_BY_TRACK[category] ?? GRADIENT_BY_TRACK.default,
        }
      }),
    [challengeLibrary]
  )
  const recommendationsToShow: RecommendationUi[] = useMemo(() => {
    const pool =
      activeCategory === "Top"
        ? recommendedForUi
        : recommendedForUi.filter((c) => c.category === activeCategory)
    const candidatePool = pool.length > 0 ? pool : recommendedForUi
    const shuffled = [...candidatePool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 4)
  }, [activeCategory, recommendedForUi])
  const activeChallenges = myChallenges
    .filter((challenge) => {
      const status = (challenge.status ?? "").toLowerCase()
      return status === "" || status === "active" || status === "in_progress" || status === "in progress"
    })
    .map((challenge) => mapToActiveChallengeUi(challenge, challengeTemplatesById))

  const handleCategoryClick = (cat: string) => setActiveCategory(cat)
  const onboardingStep = onboardingSteps[onboardingStepIndex]

  const closeOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem(ONBOARDING_DONE_KEY, "true")
    localStorage.removeItem(ONBOARDING_PENDING_KEY)
  }

  const handleOnboardingNext = () => {
    if (onboardingStepIndex >= onboardingSteps.length - 1) {
      closeOnboarding()
      return
    }
    setOnboardingStepIndex((current) => current + 1)
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-[40vh] w-full items-center justify-center px-4">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 pb-10 pt-2 max-md:-mx-4 max-md:w-[calc(100%+2rem)] max-md:px-0 md:mx-auto md:max-w-5xl md:px-6 lg:max-w-6xl">
      {showOnboarding && onboardingStep ? (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4"
          onClick={closeOnboarding}
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
        >
          <div
            className="w-full rounded-t-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:max-w-xl sm:rounded-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Quick onboarding · Step {onboardingStepIndex + 1} of {onboardingSteps.length}
                </p>
                <h2 id="onboarding-title" className="mt-1 text-lg font-bold text-slate-800">
                  {onboardingStep.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeOnboarding}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50"
                aria-label="Close onboarding"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">{onboardingStep.description}</p>

            {onboardingStep.actionHref && onboardingStep.actionLabel ? (
              <Link
                href={onboardingStep.actionHref}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                {onboardingStep.actionLabel}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            ) : null}

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((onboardingStepIndex + 1) / onboardingSteps.length) * 100}%`,
                  background: APP_GRADIENT,
                }}
              />
            </div>

            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={closeOnboarding}
                className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleOnboardingNext}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white"
                style={{ background: APP_GRADIENT }}
              >
                {onboardingStepIndex === onboardingSteps.length - 1 ? "Finish" : "Next"}
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Hero banner (edge-to-edge on small screens) ── */}
      <section
        className="relative overflow-hidden rounded-none px-4 py-7 max-md:pl-[max(1rem,env(safe-area-inset-left))] max-md:pr-[max(1rem,env(safe-area-inset-right))] sm:rounded-2xl sm:px-10 sm:py-10 md:px-10"
        style={{ background: APP_GRADIENT }}
        aria-labelledby="hero-heading"
      >
        {/* Decorative blobs */}
        <span className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <span className="pointer-events-none absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-white/10 blur-2xl" aria-hidden />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{getGreeting()}</p>
            <h1
              id="hero-heading"
              className="mt-1 text-2xl font-extrabold leading-tight text-white capitalize sm:text-3xl"
            >
              {displayName}
            </h1>
            <p className="mt-1.5 text-sm text-white/80">
              You&apos;re ranked{" "}
              <strong className="font-bold text-white">{globalRank != null ? `#${globalRank} globally` : "— globally"}</strong>
              — keep climbing.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/challenges"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-800 shadow-lg transition-transform hover:scale-[1.02]"
                aria-label="Resume your last challenge"
              >
                Resume Challenge
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/challenges"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:scale-[1.02]"
                aria-label="Browse all challenges"
              >
                Browse Challenges
              </Link>
            </div>
          </div>

          {/* Score badge — from dashboard */}
          <div className="w-full shrink-0 rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-center backdrop-blur-sm sm:w-auto sm:px-6 sm:py-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
              EliteScore
            </p>
            <p className="mt-0.5 text-4xl font-black text-white">{dashboardLoading ? "—" : eliteScore}</p>
            <p className="mt-1 text-xs text-white/70">World Rank {globalRank != null ? `#${globalRank}` : "—"}</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-white/80">
              <Flame className="h-3.5 w-3.5 text-orange-300" aria-hidden />
              <span>{streakCurrent}-day streak</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-md:space-y-6 max-md:px-3 max-md:pl-[max(0.75rem,env(safe-area-inset-left))] max-md:pr-[max(0.75rem,env(safe-area-inset-right))] md:contents">
      {/* ── Stats row ── */}
      <section aria-label="Key performance stats" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">

        {/* EliteScore ring — from dashboard */}
        <article className={`${CARD_BASE} flex flex-col items-center gap-2 p-4 text-center`}>
          <div
            className="relative flex h-16 w-16 items-center justify-center"
            role="progressbar"
            aria-valuenow={Math.min(100, eliteScore)}
            aria-valuemin={0}
            aria-valuemax={1000}
            aria-label="EliteScore progress"
          >
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36" aria-hidden>
              <defs>
                <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#db2777" />
                  <stop offset="50%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke="url(#ring-grad)"
                strokeWidth="3"
                strokeDasharray={`${Math.min(100, (eliteScore / 1000) * 100)} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center">
              <strong className="text-sm font-bold text-slate-800">{percentile != null ? `${Math.round(percentile)}%` : (dashboardLoading ? "—" : "0%")}</strong>
            </span>
          </div>
          <div>
            <p className="text-base font-bold text-slate-800">{dashboardLoading ? "—" : eliteScore}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">EliteScore</p>
          </div>
        </article>

        {/* Global Rank — from dashboard */}
        <article className={`${CARD_BASE} flex flex-col items-center justify-center gap-1 p-4 text-center`}>
          <Trophy className="h-5 w-5 text-amber-500" aria-hidden />
          <p className="text-2xl font-bold text-slate-800">{globalRank != null ? `#${globalRank}` : (dashboardLoading ? "—" : "—")}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Global Rank</p>
        </article>

        {/* Score this week — from recentScoreGains */}
        <article className={`${CARD_BASE} flex flex-col items-center gap-2 p-4 text-center`}>
          <TrendingUp className="h-5 w-5 text-pink-500" aria-hidden />
          <p className="text-2xl font-bold text-slate-800">{dashboardLoading ? "—" : (scoreThisWeek >= 0 ? `+${scoreThisWeek}` : scoreThisWeek)}</p>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={Math.min(100, Math.max(0, scoreThisWeek))}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Score this week"
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.max(0, scoreThisWeek))}%`, background: APP_GRADIENT }}
            />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Score This Week
          </p>
        </article>

        {/* Day Streak — from dashboard */}
        <article className={`${CARD_BASE} flex flex-col items-center justify-center gap-1 p-4 text-center`}>
          <Flame className="h-6 w-6 text-orange-500" aria-hidden />
          <p className="text-2xl font-bold text-slate-800">{dashboardLoading ? "—" : streakCurrent}</p>
          <p className="text-xs text-slate-500">consecutive days</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Day Streak</p>
        </article>
      </section>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">

        {/* Left column */}
        <div className="space-y-6 lg:col-span-8">

          {/* Active Challenges */}
          <section className={`${CARD_BASE} p-6`} aria-labelledby="active-title">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  In Progress
                </p>
                <h2
                  id="active-title"
                  className="mt-0.5 text-lg font-bold text-slate-800"
                >
                  Active Challenges
                </h2>
              </div>
              <Link
                href="/challenges"
                className="flex items-center gap-1 text-xs font-semibold text-pink-600 hover:underline"
              >
                View all <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {myChallengesLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
                  <p className="text-sm font-medium text-slate-600">Loading active challenges...</p>
                </div>
              ) : activeChallenges.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
                  <p className="text-sm font-medium text-slate-600">No active challenges yet</p>
                  <p className="mt-1 text-xs text-slate-500">Start one to track your progress here.</p>
                  <Link
                    href="/challenges"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                    style={{ background: APP_GRADIENT }}
                  >
                    Browse Challenges
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              ) : (
                activeChallenges.map((challenge) => (
                  <article
                    key={challenge.id}
                    className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div
                      className="h-1.5 w-full"
                      style={{ background: APP_GRADIENT }}
                      aria-hidden
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold leading-snug text-slate-800">
                          {challenge.title}
                        </h3>
                        <span className="shrink-0 rounded-lg bg-pink-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pink-600">
                          {challenge.statusLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        {challenge.trackLabel} · Template #{challenge.challengeTemplateIdLabel}
                      </p>
                      <DifficultyDots level={challenge.difficulty} />
                      <p className="mt-1 text-[11px] text-slate-500">
                        {challenge.durationDays > 0 ? `${challenge.durationDays} days` : "Duration —"}
                        {challenge.rewardPoints > 0 ? ` · ${challenge.rewardPoints} pts` : ""}
                      </p>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Current day</span>
                          <span className="font-semibold text-slate-700">Day {challenge.currentDay}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-semibold text-slate-700">{challenge.progress}%</span>
                        </div>
                        <div
                          className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100"
                          role="progressbar"
                          aria-valuenow={challenge.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${challenge.progress}%`, background: APP_GRADIENT }}
                          />
                        </div>
                      </div>
                      <p
                        className={`mt-2 flex items-center gap-1.5 text-xs ${
                          challenge.endDateUrgent
                            ? "font-semibold text-orange-600"
                            : "text-slate-500"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        End date: {challenge.endDateLabel}
                      </p>
                      <div className="mt-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-pink-600">
                          Enrollment details
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-700">
                          Missed days: {challenge.missedDaysCount}
                        </p>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
                          style={{ background: APP_GRADIENT }}
                          aria-label={`Submit proof for ${challenge.title}`}
                        >
                          <Upload className="h-3.5 w-3.5" aria-hidden />
                          Submit Proof
                        </button>
                        <Link
                          href={challenge.templateId ? `/challenges/${challenge.templateId}` : "/challenges"}
                          className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                          aria-label={`View details for ${challenge.title}`}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {/* Recommended Challenges */}
          <section className={`${CARD_BASE} p-6`} aria-labelledby="recommended-title">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Suggestions
                </p>
                <h2
                  id="recommended-title"
                  className="mt-0.5 text-lg font-bold text-slate-800"
                >
                  Recommended For You
                </h2>
              </div>
              <Link
                href="/challenges"
                className="flex items-center gap-1 text-xs font-semibold text-pink-600 hover:underline"
              >
                Browse all <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            {/* Category tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {CHALLENGE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition-colors ${
                    activeCategory === cat
                      ? "text-white"
                      : "border border-slate-200/80 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
                  }`}
                  style={activeCategory === cat ? { background: APP_GRADIENT } : undefined}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Cards — 4 random items from challenge library */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {recommendationsToShow.map((item) => (
                <article
                  key={item.id || item.title}
                  className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div
                    className={`relative flex h-20 items-center justify-center bg-gradient-to-br ${item.gradientClass}`}
                  >
                    <span className="absolute bottom-2 left-2 rounded-lg bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 transition-colors group-hover:text-pink-600">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.points} pts
                      {item.durationDays != null && ` · ${item.durationDays} days`}
                      {item.difficulty != null && ` · ${item.difficulty}/5 difficulty`}
                      {item.members ? ` · ${item.members} members` : ""}
                    </p>
                    <Link
                      href={item.id ? `/challenges/${item.id}` : "/challenges"}
                      className="mt-3 flex w-full items-center justify-center rounded-xl py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
                      style={{ background: APP_GRADIENT }}
                    >
                      Join Challenge
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6 lg:col-span-4">

          {/* Leaderboard preview */}
          <section className={`${CARD_BASE} p-6`} aria-labelledby="leaderboard-title">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Rankings
                </p>
                <h2
                  id="leaderboard-title"
                  className="mt-0.5 text-base font-bold text-slate-800"
                >
                  {leaderboardTitle}
                </h2>
              </div>
              <Link
                href="/leaderboard"
                className="flex items-center gap-1 text-xs font-semibold text-pink-600 hover:underline"
              >
                Full board <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            {leaderboardSummary && (leaderboardSummary.currentRank != null || leaderboardSummary.eliteScore != null) && (
              <p className="mt-3 text-xs text-slate-600">
                You: rank <strong>#{leaderboardSummary.currentRank ?? "—"}</strong>
                {leaderboardSummary.eliteScore != null && ` · ${leaderboardSummary.eliteScore} pts`}
                {leaderboardSummary.percentile != null && ` · top ${Math.round(leaderboardSummary.percentile)}%`}
              </p>
            )}

            {/* Leaderboard entries from dashboard or placeholders */}
            <ul className="mt-4 space-y-2">
              {(leaderboardEntries.length > 0 ? leaderboardEntries : [
                { displayName: "—", eliteScore: 0, rank: undefined },
                { displayName: "—", eliteScore: 0, rank: undefined },
                { displayName: "—", eliteScore: 0, rank: undefined },
                { displayName: "—", eliteScore: 0, rank: undefined },
                { displayName: "—", eliteScore: 0, rank: undefined },
              ]).slice(0, 8).map((user, index) => (
                <li
                  key={user.userId ?? index}
                  className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50/70 ${
                    user.isCurrentUser ? "ring-2 ring-pink-500/30 bg-pink-50/50" : ""
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[10px] font-bold text-slate-500">
                    #{user.rank ?? index + 1}
                  </span>
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold bg-slate-200 text-slate-600"
                      aria-hidden
                    >
                      {getInitials(String(user.displayName ?? "?"))}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {user.displayName ?? user.handle ?? "—"}
                      {user.isCurrentUser && (
                        <span className="ml-1 text-[10px] font-medium text-pink-600">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user.eliteScore != null ? `${user.eliteScore} pts` : "—"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Progress snapshot */}
          <section className={`${CARD_BASE} p-6`} aria-labelledby="snapshot-title">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Your Credentials
            </p>
            <h2
              id="snapshot-title"
              className="mt-0.5 text-base font-bold text-slate-800"
            >
              Progress Snapshot
            </h2>
            <dl className="mt-4 space-y-3">
              {[
                { label: "Consistency rate", value: "0%" },
                { label: "Challenges completed", value: "0" },
                { label: "Active days this week", value: "0 / 7" },
                { label: "Score movement", value: "—" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <dt className="text-xs text-slate-500">{item.label}</dt>
                  <dd className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Stay Consistent — gradient card like landing hero */}
          <section
            className="rounded-2xl p-5 text-center"
            style={{ background: APP_GRADIENT }}
            aria-labelledby="streak-cta-title"
          >
            <Flame className="mx-auto h-7 w-7 text-white/90" aria-hidden />
            <h2
              id="streak-cta-title"
              className="mt-2 text-base font-bold text-white"
            >
              {streakCurrent}-Day Streak
            </h2>
            <p className="mt-1 text-xs text-white/80">
              Check in today to keep it alive. Don&apos;t break the chain.
            </p>
            <Link
              href="/challenges"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Complete Today&apos;s Task
            </Link>
          </section>
        </aside>
      </div>
      </div>
    </div>
  )
}
