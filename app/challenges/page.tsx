"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Trophy, Target, Calendar, Clock, Lock, Upload, CheckCircle2, XCircle,
  Flame, AlertTriangle, ChevronRight, History, Users, Mail, X, Check,
  Send, UserPlus, ListTodo, BookOpen, ArrowUpRight, Sparkles,
} from "lucide-react"
import { resolveChallengeThumbnail } from "@/lib/challengeThumbnails"
import { detectChallengeProvider, providerLogoUrl } from "@/lib/challengeProvider"
import { difficultyToLabel, isFeaturedChallenge } from "@/lib/challengeDifficulty"
import { ELITESCORE_SUPPORT_EMAIL, ELITESCORE_SUPPORT_MAILTO } from "@/lib/supportContact"

const ONBOARDING_PENDING_KEY = "elitescore_onboarding_pending"
const ONBOARDING_DONE_KEY = "elitescore_onboarding_done"

// ── Types ──────────────────────────────────────────────────────────────────

interface Supporter {
  id: string
  email: string
  status: "pending" | "accepted" | "declined"
}

type ActiveChallenge = {
  id: string
  templateId: string
  name: string
  difficulty: number
  currentDay: number
  totalDays: number
  daysRemaining: number
  todayTask: string
  progress: number
  reward: number
  track: string
  weekLabel: string
  accentFrom: string
  accentTo: string
  deadline: string
  deadlineUrgent: boolean
}

/** From GET /api/challenges/my */
type UserEnrollment = {
  id: string
  userId?: string
  challengeTemplateId: string
  status: string
  startDate?: string
  endDate?: string
  currentDay?: number
  missedDaysCount?: number
  createdAt?: string
}

type LibraryChallenge = {
  id: number
  name: string
  track: string
  difficulty: number
  duration: number
  reward: number
  completionRate: number
  description: string
  gradientClass: string
  templateId?: string
  thumbnailUrl?: string
  providerName?: string
  providerLogoUrl?: string
  /** Shown as a “Featured” badge; from API or name heuristics (see isFeaturedChallenge). */
  featured?: boolean
}

type HistoryChallenge = {
  id: string | number
  name: string
  difficulty: number
  duration: number
  status: "completed" | "failed"
  completedDate: string
  eliteScoreImpact?: string
  streakBonus?: string
}

type HistoryApiItem = {
  userChallengeId?: string
  challengeTemplateId?: string
  challengeName?: string
  track?: string
  difficulty?: number
  durationDays?: number
  duration_days?: number
  status?: string
  startDate?: string
  endDate?: string
  currentDay?: number
  missedDaysCount?: number
  createdAt?: string
  completedAt?: string | null
  failedAt?: string | null
  start_date?: string
  end_date?: string
  current_day?: number
  missed_days_count?: number
  created_at?: string
  completed_at?: string | null
  failed_at?: string | null
}

type HistoryApiResponse = {
  current?: HistoryApiItem[]
  history?: HistoryApiItem[]
}

// ── Constants ──────────────────────────────────────────────────────────────

const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"
const CARD_BASE = "rounded-2xl border border-slate-200/80 bg-white shadow-sm"
const MAX_ACTIVE = 2

const TRACK_ACCENTS: Record<string, { from: string; to: string }> = {
  git: { from: "#db2777", to: "#ea580c" },
  cybersecurity: { from: "#2563eb", to: "#7c3aed" },
  sql: { from: "#0891b2", to: "#0e7490" },
  data: { from: "#059669", to: "#047857" },
  ai: { from: "#7c3aed", to: "#5b21b6" },
  default: { from: "#db2777", to: "#ea580c" },
}

const LIBRARY: LibraryChallenge[] = [
  {
    id: 3,
    name: "21-Day Morning Routine",
    track: "Wellness",
    difficulty: 2,
    duration: 21,
    reward: 180,
    completionRate: 67,
    description: "Wake up at 6 AM, exercise for 20 minutes, and journal for 10 minutes.",
    gradientClass: "from-emerald-500/90 to-teal-500/90",
  },
  {
    id: 4,
    name: "7-Day SQL Bootcamp",
    track: "Technical Skills",
    difficulty: 3,
    duration: 7,
    reward: 90,
    completionRate: 78,
    description: "Master SQL fundamentals with daily practice and real-world database projects.",
    gradientClass: "from-blue-500/90 to-indigo-500/90",
  },
  {
    id: 5,
    name: "30-Day Public Speaking",
    track: "Career Development",
    difficulty: 5,
    duration: 30,
    reward: 600,
    completionRate: 42,
    description: "Record and share a 2-minute presentation daily on professional topics.",
    gradientClass: "from-pink-500/90 to-rose-500/90",
  },
  {
    id: 6,
    name: "14-Day Reading Sprint",
    track: "Learning",
    difficulty: 2,
    duration: 14,
    reward: 140,
    completionRate: 71,
    description: "Read 30 pages daily from career or skill development books.",
    gradientClass: "from-amber-500/90 to-orange-500/90",
  },
  {
    id: 7,
    name: "21-Day Portfolio Builder",
    track: "Career Development",
    difficulty: 4,
    duration: 21,
    reward: 280,
    completionRate: 55,
    description: "Build and deploy one project feature daily to showcase your skills.",
    gradientClass: "from-violet-500/90 to-purple-500/90",
  },
  {
    id: 8,
    name: "7-Day Meditation Mastery",
    track: "Wellness",
    difficulty: 1,
    duration: 7,
    reward: 70,
    completionRate: 82,
    description: "Complete 15 minutes of guided meditation every morning.",
    gradientClass: "from-cyan-500/90 to-blue-500/90",
  },
]

const INITIAL_HISTORY: HistoryChallenge[] = []

const TABS = [
  { id: "active", label: "Active", Icon: ListTodo },
  { id: "library", label: "Library", Icon: BookOpen },
  { id: "history", label: "History", Icon: History },
]

const TRACK_FILTERS = ["All", "Technical Skills", "Career Development", "Wellness", "Learning"]

function enrichLibraryChallenge(challenge: LibraryChallenge): LibraryChallenge {
  const providerName =
    challenge.providerName ?? detectChallengeProvider(challenge.name, challenge.track, challenge.description)
  return {
    ...challenge,
    featured: isFeaturedChallenge({ name: challenge.name, featured: challenge.featured }),
    providerName,
    providerLogoUrl: challenge.providerLogoUrl ?? providerLogoUrl(providerName),
    thumbnailUrl:
      challenge.thumbnailUrl ??
      resolveChallengeThumbnail(challenge.name, challenge.track, challenge.description, providerName),
  }
}

// ── Sub-components ──────────────────────────────────────────────────────────

function DifficultyDots({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <div className="mt-2 flex gap-1" aria-label={`Difficulty ${level} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 w-4 rounded-full"
          style={i < level ? { background: APP_GRADIENT } : { background: "#e2e8f0" }}
        />
      ))}
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function ChallengesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("active")
  const [trackFilter, setTrackFilter] = useState("All")
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [showLockIn, setShowLockIn] = useState(false)
  const [showProofFor, setShowProofFor] = useState<string | null>(null)
  const [showQuitFor, setShowQuitFor] = useState<string | null>(null)
  const [quitError, setQuitError] = useState<string | null>(null)

  const [activeChallenges, setActiveChallenges] = useState<ActiveChallenge[]>([])
  const [activeLoading, setActiveLoading] = useState(true)
  const [history, setHistory] = useState<HistoryChallenge[]>(INITIAL_HISTORY)

  const [lockInStep, setLockInStep] = useState<"invite" | "confirm" | "success">("invite")
  const [supporters, setSupporters] = useState<Supporter[]>([])
  const [supporterEmail, setSupporterEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [joinInProgress, setJoinInProgress] = useState(false)

  const [libraryChallenges, setLibraryChallenges] = useState<LibraryChallenge[]>(
    () => LIBRARY.map((challenge) => enrichLibraryChallenge(challenge))
  )
  const [libraryLoading, setLibraryLoading] = useState(false)

  const [pendingOnboardSelect, setPendingOnboardSelect] = useState(false)
  const [showOnboardWelcome, setShowOnboardWelcome] = useState(false)
  const onboardUrlHandled = useRef(false)
  const autoOpenChallengeDone = useRef(false)

  type ChallengeTemplateApi = {
    id?: string
    name?: string
    track?: string
    difficulty?: number
    description?: string
    durationDays?: number
    dailyRewardEliteScore?: number
    completionBonus?: number
    completionRateCached?: number | null
    featured?: boolean
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const token = (localStorage.getItem("elitescore_access_token") ?? "").trim()
    if (!token) {
      setLibraryLoading(false)
      setActiveLoading(false)
      router.replace("/login")
      return
    }
    const userId = localStorage.getItem("elitescore_user_id")

    setLibraryLoading(true)
    setActiveLoading(true)
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
    if (userId) {
      ;(headers as Record<string, string>)["X-User-Id"] = userId
    }

    let cancelled = false

    Promise.all([
      fetch("/api/challenges", { method: "GET", headers }).then(async (res) => {
        const data = await res.json().catch(() => null)
        if (process.env.NODE_ENV === "development") {
          console.debug("[Challenges Library] GET /api/challenges", {
            status: res.status,
            ok: res.ok,
            isArray: Array.isArray(data),
            count: Array.isArray(data) ? data.length : undefined,
          })
        }
        if (res.status === 401) {
          localStorage.removeItem("elitescore_access_token")
          localStorage.removeItem("elitescore_logged_in")
          router.replace("/login")
          return null
        }
        if (!res.ok || !Array.isArray(data)) return null
        return data as ChallengeTemplateApi[]
      }),
      fetch("/api/challenges/my", { method: "GET", headers }).then(async (res) => {
        const data = await res.json().catch(() => null)
        if (process.env.NODE_ENV === "development") {
          console.debug("[Challenges Active] GET /api/challenges/my", {
            status: res.status,
            ok: res.ok,
            isArray: Array.isArray(data),
            count: Array.isArray(data) ? data.length : undefined,
          })
        }
        if (res.status === 401) {
          localStorage.removeItem("elitescore_access_token")
          localStorage.removeItem("elitescore_logged_in")
          router.replace("/login")
          return null
        }
        if (!res.ok || !Array.isArray(data)) return null
        return data as UserEnrollment[]
      }),
      fetch("/api/challenges/my/history", { method: "GET", headers }).then(async (res) => {
        const data = await res.json().catch(() => null)
        if (process.env.NODE_ENV === "development") {
          console.debug("[Challenges History] GET /api/challenges/my/history", {
            status: res.status,
            ok: res.ok,
            hasCurrent: Boolean(
              data && typeof data === "object" && Array.isArray((data as { current?: unknown }).current)
            ),
            hasHistory: Boolean(
              data && typeof data === "object" && Array.isArray((data as { history?: unknown }).history)
            ),
          })
        }
        if (res.status === 401) {
          localStorage.removeItem("elitescore_access_token")
          localStorage.removeItem("elitescore_logged_in")
          router.replace("/login")
          return null
        }
        if (!res.ok || !data || typeof data !== "object") return null
        return data as HistoryApiResponse
      }),
    ])
      .then(([templates, enrollments, historyPayload]) => {
        if (cancelled) return

        if (templates) {
          const mapped: LibraryChallenge[] = templates.map((t, index) => {
            const duration = typeof t.durationDays === "number" ? t.durationDays : 0
            const reward =
              typeof t.completionBonus === "number"
                ? t.completionBonus
                : typeof t.dailyRewardEliteScore === "number" && duration > 0
                ? t.dailyRewardEliteScore * duration
                : 0
            const completionRate =
              typeof t.completionRateCached === "number" ? Math.round(t.completionRateCached) : 0

            const track = t.track ?? "General"
            const description = t.description ?? ""
            const lowerTrack = track.toLowerCase()
            let gradientClass = "from-amber-500/90 to-orange-500/90"
            if (lowerTrack.includes("sql") || lowerTrack.includes("data")) {
              gradientClass = "from-blue-500/90 to-indigo-500/90"
            } else if (lowerTrack.includes("ai") || lowerTrack.includes("ml")) {
              gradientClass = "from-violet-500/90 to-purple-500/90"
            } else if (lowerTrack.includes("cyber") || lowerTrack.includes("security")) {
              gradientClass = "from-emerald-500/90 to-teal-500/90"
            }

            return enrichLibraryChallenge({
              id: index + 1,
              name: t.name ?? "Challenge",
              track,
              difficulty: typeof t.difficulty === "number" ? t.difficulty : 3,
              duration,
              reward,
              completionRate,
              description,
              gradientClass,
              templateId: t.id,
              featured: t.featured,
            })
          })
          if (mapped.length > 0) setLibraryChallenges(mapped)
        }

        if (enrollments && enrollments.length > 0 && templates && templates.length > 0) {
          const active: ActiveChallenge[] = enrollments
            .filter((e) => String(e.status).toLowerCase() === "active")
            .map((enrollment) => {
              const tpl = templates.find((t) => t.id === enrollment.challengeTemplateId)
              const duration =
                typeof tpl?.durationDays === "number" ? tpl.durationDays : 0
              const currentDay = typeof enrollment.currentDay === "number" ? enrollment.currentDay : 1
              const totalDays = duration || 1
              const daysRemaining = Math.max(0, totalDays - currentDay)
              const progress = totalDays > 0 ? Math.round((currentDay / totalDays) * 100) : 0
              const reward =
                typeof tpl?.completionBonus === "number"
                  ? tpl.completionBonus
                  : typeof tpl?.dailyRewardEliteScore === "number" && duration > 0
                  ? tpl.dailyRewardEliteScore * duration
                  : 0
              const track = tpl?.track ?? "General"
              const accents = TRACK_ACCENTS[track?.toLowerCase() ?? ""] ?? TRACK_ACCENTS.default
              let endDate: Date | null = null
              if (enrollment.endDate) {
                endDate = new Date(enrollment.endDate)
              }
              const isToday =
                endDate &&
                endDate.getDate() === new Date().getDate() &&
                endDate.getMonth() === new Date().getMonth() &&
                endDate.getFullYear() === new Date().getFullYear()
              const weekNum = Math.ceil(currentDay / 7) || 1
              return {
                id: enrollment.id,
                templateId: enrollment.challengeTemplateId,
                name: tpl?.name ?? "Challenge",
                difficulty: typeof tpl?.difficulty === "number" ? tpl.difficulty : 3,
                currentDay,
                totalDays,
                daysRemaining,
                todayTask: "Complete today's task — open challenge for details.",
                progress,
                reward,
                track,
                weekLabel: `Week ${weekNum}`,
                accentFrom: accents.from,
                accentTo: accents.to,
                deadline: isToday ? "Tonight 11:59 PM" : endDate ? endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—",
                deadlineUrgent: !!isToday,
              }
            })
          setActiveChallenges(active)
        }

        if (historyPayload && Array.isArray(historyPayload.history)) {
          const mappedHistory: HistoryChallenge[] = historyPayload.history.map((item, index) => {
            const rawStatus = String(item.status ?? "").toLowerCase()
            const status: HistoryChallenge["status"] = rawStatus === "completed" ? "completed" : "failed"
            const completedDateRaw =
              item.completedAt ??
              item.completed_at ??
              item.failedAt ??
              item.failed_at ??
              item.endDate ??
              item.end_date ??
              item.createdAt ??
              item.created_at
            const completedDate = completedDateRaw ? String(completedDateRaw).slice(0, 10) : "—"
            const duration =
              typeof item.durationDays === "number"
                ? item.durationDays
                : typeof item.duration_days === "number"
                ? item.duration_days
                : 0

            return {
              id: item.userChallengeId ?? `${index}-${item.challengeTemplateId ?? "history"}`,
              name: item.challengeName ?? "Challenge",
              difficulty: typeof item.difficulty === "number" ? item.difficulty : 0,
              duration,
              status,
              completedDate,
              eliteScoreImpact: undefined,
              streakBonus: undefined,
            }
          })
          setHistory(mappedHistory)
        } else if (historyPayload && process.env.NODE_ENV === "development") {
          console.debug("[Challenges History] missing history array in response", historyPayload)
        }
      })
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.debug("[Challenges] fetch error", err)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLibraryLoading(false)
          setActiveLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [router])

  useEffect(() => {
    if (onboardUrlHandled.current) return
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (params.get("onboard") !== "1") return
    onboardUrlHandled.current = true
    setActiveTab("library")
    setPendingOnboardSelect(true)
    setShowOnboardWelcome(true)
    router.replace("/challenges", { scroll: false })
  }, [router])

  useEffect(() => {
    if (!pendingOnboardSelect) return
    if (libraryLoading) return
    if (autoOpenChallengeDone.current) return
    if (libraryChallenges.length === 0) {
      setPendingOnboardSelect(false)
      return
    }
    autoOpenChallengeDone.current = true
    const pick = libraryChallenges.find((c) => c.featured) ?? libraryChallenges[0]
    setSelectedId(pick.id)
    setPendingOnboardSelect(false)
  }, [pendingOnboardSelect, libraryLoading, libraryChallenges])

  const activeCount = activeChallenges.length
  const canJoin = activeCount < MAX_ACTIVE
  const selectedLibrary = libraryChallenges.find((c) => c.id === selectedId) ?? null
  const alreadyEnrolled =
    selectedLibrary?.templateId != null &&
    activeChallenges.some((c) => c.templateId === selectedLibrary.templateId)

  useEffect(() => {
    if (selectedId == null) return
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
  }, [selectedId])

  const filteredLibrary =
    trackFilter === "All"
      ? libraryChallenges
      : libraryChallenges.filter((c) => c.track === trackFilter)

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleAddSupporter = () => {
    if (!supporterEmail.trim()) { setEmailError("Email is required"); return }
    if (!validateEmail(supporterEmail)) { setEmailError("Please enter a valid email"); return }
    if (supporters.length >= 3) { setEmailError("Maximum 3 supporters allowed"); return }
    if (supporters.some((s) => s.email.toLowerCase() === supporterEmail.toLowerCase())) {
      setEmailError("Already added"); return
    }
    setSupporters([...supporters, { id: Date.now().toString(), email: supporterEmail, status: "pending" }])
    setSupporterEmail("")
    setEmailError("")
  }

  const handleRemoveSupporter = (id: string) =>
    setSupporters((prev) => prev.filter((s) => s.id !== id))

  const handleLockInStart = () => {
    if (!canJoin) return
    setLockInStep("invite")
    setSupporters([])
    setSupporterEmail("")
    setEmailError("")
    setShowLockIn(true)
  }

  const handleSendInvites = () => {
    if (supporters.length === 0) { setEmailError("Add at least one spectator email to continue"); return }
    setLockInStep("confirm")
  }

  const handleConfirmLockIn = async () => {
    if (joinInProgress) return
    if (!selectedLibrary || alreadyEnrolled) return
    if (!selectedLibrary.templateId) {
      setEmailError("This challenge cannot be joined yet. Missing template id.")
      return
    }
    const primary = supporters[0]
    if (!primary) {
      setEmailError("Add at least one spectator email before locking in.")
      return
    }

    setJoinInProgress(true)
    setEmailError("")

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("elitescore_access_token") : null
      if (!token) {
        setEmailError("Not logged in. Please sign in again.")
        setJoinInProgress(false)
        return
      }
      const userId = typeof window !== "undefined" ? localStorage.getItem("elitescore_user_id") : null
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
      if (userId) {
        ;(headers as Record<string, string>)["X-User-Id"] = userId
      }

      const res = await fetch(`/api/challenges/${selectedLibrary.templateId}/join`, {
        method: "POST",
        headers,
        body: JSON.stringify({ spectatorEmail: primary.email }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const detail =
          (data && typeof data === "object" && "detail" in data && (data as any).detail) ||
          (data && typeof data === "object" && "message" in data && (data as any).message) ||
          "Could not join challenge."
        setEmailError(String(detail))
        setJoinInProgress(false)
        return
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[Challenges] join error", err)
      }
      setEmailError("Network error while joining. Please try again.")
      setJoinInProgress(false)
      return
    }

    setLockInStep("success")
    try {
      localStorage.setItem(ONBOARDING_DONE_KEY, "true")
      localStorage.removeItem(ONBOARDING_PENDING_KEY)
    } catch {
      // ignore storage errors
    }
    setShowOnboardWelcome(false)
    setTimeout(() => {
      setShowLockIn(false)
      setSelectedId(null)
      setLockInStep("invite")
      setSupporters([])
      setJoinInProgress(false)
      window.location.reload()
    }, 2200)
  }

  const handleCloseLockIn = () => {
    setShowLockIn(false)
    setLockInStep("invite")
    setSupporters([])
    setSupporterEmail("")
    setEmailError("")
  }

  const handleConfirmQuit = async () => {
    if (showQuitFor == null) return
    const quitting = activeChallenges.find((c) => c.id === showQuitFor)
    if (!quitting) {
      setShowQuitFor(null)
      return
    }

    const isLocal = quitting.id.startsWith("local-")
    if (!isLocal) {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("elitescore_access_token") : null
        if (!token) {
          setQuitError("Not logged in. Please sign in again.")
          return
        }
        const userId = typeof window !== "undefined" ? localStorage.getItem("elitescore_user_id") : null
        const headers: HeadersInit = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
        if (userId) {
          ;(headers as Record<string, string>)["X-User-Id"] = userId
        }
        const res = await fetch(`/api/challenges/${quitting.id}/abandon`, {
          method: "POST",
          headers,
        })
        const data = await res.json().catch(() => null)
        if (!res.ok) {
          const detail =
            (data && typeof data === "object" && "detail" in data && (data as { detail?: string }).detail) ||
            (data && typeof data === "object" && "message" in data && (data as { message?: string }).message) ||
            "Could not quit challenge."
          setQuitError(String(detail))
          return
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") console.debug("[Challenges] abandon error", err)
        setQuitError("Network error. Please try again.")
        return
      }
    }

    setQuitError(null)
    setActiveChallenges((prev) => prev.filter((c) => c.id !== showQuitFor))
    setHistory((prev) => [
      {
        id: Date.now(),
        name: quitting.name,
        difficulty: quitting.difficulty,
        duration: quitting.totalDays,
        status: "failed",
        completedDate: new Date().toISOString().slice(0, 10),
        eliteScoreImpact: "-35",
        streakBonus: "0",
      },
      ...prev,
    ])
    setShowQuitFor(null)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full space-y-6 pb-10 pt-2 max-md:-mx-4 max-md:w-[calc(100%+2rem)] max-md:px-0 md:mx-auto md:max-w-5xl md:px-6 lg:max-w-6xl">
      {/* Hero banner (edge-to-edge on small screens) */}
      <section
        className="relative overflow-hidden rounded-none px-4 py-7 max-md:pl-[max(1rem,env(safe-area-inset-left))] max-md:pr-[max(1rem,env(safe-area-inset-right))] sm:rounded-2xl sm:px-10 sm:py-8 md:px-10"
        style={{ background: APP_GRADIENT }}
        aria-labelledby="challenges-heading"
      >
        <span className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Challenges · Arena</p>
          <h1 id="challenges-heading" className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
            Your commitments
          </h1>
          <p className="mt-1.5 text-sm text-white/80">
            Lock in. Submit proof. Every challenge brings you closer to the top.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              <Trophy className="h-4 w-4 text-white/80" aria-hidden />
              <span className="text-sm font-semibold text-white">{activeCount}/{MAX_ACTIVE} active</span>
            </div>
            {canJoin && (
              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-lg transition-transform hover:scale-[1.02]"
              >
                Browse Library <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </button>
            )}
          </div>
        </div>
      </section>

      {showOnboardWelcome ? (
        <div
          className="flex flex-col gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          role="status"
        >
          <div className="min-w-0">
            <p className="text-sm font-bold text-emerald-900">Welcome to EliteScore</p>
            <p className="mt-0.5 text-xs leading-relaxed text-emerald-800/95">
              Your account is ready. We opened a challenge below — review it, add at least one spectator email, then
              lock in to start earning EliteScore and streaks.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowOnboardWelcome(false)}
            className="shrink-0 self-end rounded-xl border border-emerald-300/80 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100/50 sm:self-center"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="max-md:space-y-6 max-md:px-3 max-md:pl-[max(0.75rem,env(safe-area-inset-left))] max-md:pr-[max(0.75rem,env(safe-area-inset-right))] md:contents">
      {/* Tab nav */}
      <div
        className="flex gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-sm"
        role="tablist"
        aria-label="Challenge tabs"
      >
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === id ? "text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
            style={activeTab === id ? { background: APP_GRADIENT } : undefined}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {label}
            {id === "active" && activeCount > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === "active" ? "bg-white/20 text-white" : "bg-pink-100 text-pink-600"
                }`}
              >
                {activeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── ACTIVE TAB ── */}
      {activeTab === "active" && (
        <div className="space-y-6">

          {activeLoading && (
            <div className={`${CARD_BASE} flex items-center justify-center p-8`}>
              <p className="text-sm text-slate-500">Loading your active challenges...</p>
            </div>
          )}

          {/* Today's tasks */}
          <section className={`${CARD_BASE} p-6`} aria-labelledby="tasks-heading">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Today · Daily tasks</p>
            <h2 id="tasks-heading" className="mt-0.5 text-lg font-bold text-slate-800">
              {activeLoading
                ? "Loading..."
                : activeChallenges.length > 0
                ? `${activeChallenges.length} task${activeChallenges.length > 1 ? "s" : ""} due today`
                : "No tasks today"}
            </h2>

            {!activeLoading && activeChallenges.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {activeChallenges.map((c) => (
                  <div key={c.id} className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                    <div
                      className="h-1.5 w-full"
                      style={{ background: `linear-gradient(to right, ${c.accentFrom}, ${c.accentTo})` }}
                      aria-hidden
                    />
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{c.name}</p>
                      <p className="mt-1 text-sm font-semibold leading-snug text-slate-800">{c.todayTask}</p>
                      <p
                        className={`mt-2 flex items-center gap-1.5 text-xs ${
                          c.deadlineUrgent ? "font-semibold text-orange-600" : "text-slate-500"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        Deadline: {c.deadline}
                      </p>
                      {c.templateId ? (
                        <Link
                          href={`/challenges/${c.templateId}${c.currentDay > 0 ? `?day=${c.currentDay}` : ""}`}
                          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
                          style={{ background: APP_GRADIENT }}
                          aria-label={`View details for day ${c.currentDay} — ${c.name}`}
                        >
                          View details <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                <ListTodo className="mx-auto h-8 w-8 text-slate-300" aria-hidden />
                <p className="mt-2 text-sm text-slate-500">Enroll in a challenge to see daily tasks here.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("library")}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 hover:underline"
                >
                  Browse Library <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            )}
          </section>

          {/* Enrolled challenges */}
          <section className={`${CARD_BASE} p-6`} aria-labelledby="enrolled-heading">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Enrolled · Your commitments
                </p>
                <h2 id="enrolled-heading" className="mt-0.5 text-lg font-bold text-slate-800">
                  {activeCount}/{MAX_ACTIVE} slots used
                </h2>
              </div>
              {activeCount >= MAX_ACTIVE && (
                <span className="rounded-xl bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                  Full
                </span>
              )}
            </div>

            {activeCount >= MAX_ACTIVE && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-orange-200/60 bg-orange-50/60 p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden />
                <p className="text-xs leading-relaxed text-orange-700">
                  You&apos;ve reached the limit of {MAX_ACTIVE} active challenges. Complete or quit one to join another.
                </p>
              </div>
            )}

            {activeChallenges.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {activeChallenges.map((challenge) => (
                  <article
                    key={challenge.id}
                    className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div
                      className="h-1.5 w-full"
                      style={{ background: `linear-gradient(to right, ${challenge.accentFrom}, ${challenge.accentTo})` }}
                      aria-hidden
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold leading-snug text-slate-800">{challenge.name}</h3>
                        <span className="shrink-0 rounded-lg bg-pink-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pink-600">
                          Active
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        {challenge.weekLabel} · Day {challenge.currentDay}/{challenge.totalDays}
                      </p>
                      <DifficultyDots level={challenge.difficulty} />

                      {/* Progress */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs">
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
                          challenge.deadlineUrgent ? "font-semibold text-orange-600" : "text-slate-500"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        Deadline: {challenge.deadline}
                      </p>

                      <div className="mt-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-pink-600">Today&apos;s task</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-700">{challenge.todayTask}</p>
                      </div>

                      {challenge.templateId && (
                        <Link
                          href={`/challenges/${challenge.templateId}`}
                          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                        >
                          View course outline <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                        </Link>
                      )}

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {challenge.templateId ? (
                          <Link
                            href={`/challenges/${challenge.templateId}${challenge.currentDay > 0 ? `?day=${challenge.currentDay}` : ""}`}
                            className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
                            style={{ background: APP_GRADIENT }}
                            aria-label={`View details for day ${challenge.currentDay} — ${challenge.name}`}
                          >
                            View details <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                          </Link>
                        ) : (
                          <span className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs font-medium text-slate-400">
                            View details
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => { setQuitError(null); setShowQuitFor(challenge.id) }}
                          className="flex items-center justify-center rounded-xl border border-red-200 bg-white py-2.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                          aria-label={`Quit ${challenge.name}`}
                        >
                          Quit
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                <AlertTriangle className="mx-auto h-10 w-10 text-slate-300" aria-hidden />
                <h3 className="mt-3 text-base font-bold text-slate-800">No active challenges</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Your credibility grows with finished work. Browse the library and commit.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("library")}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
                  style={{ background: APP_GRADIENT }}
                >
                  Browse Library <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── LIBRARY TAB ── */}
      {activeTab === "library" && (
        <section className={`${CARD_BASE} p-6`} aria-labelledby="library-heading">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Library · Browse</p>
              <h2 id="library-heading" className="mt-0.5 text-lg font-bold text-slate-800">
                Lock in your next commitment
              </h2>
            </div>
          </div>

          {/* Track filter chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {TRACK_FILTERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTrackFilter(t)}
                className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition-colors ${
                  trackFilter === t
                    ? "text-white"
                    : "border border-slate-200/80 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
                }`}
                style={trackFilter === t ? { background: APP_GRADIENT } : undefined}
                aria-pressed={trackFilter === t}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLibrary.map((challenge) => (
              <article
                key={challenge.id}
                className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Gradient thumbnail — same style as landing page challenge cards */}
                <div
                  className={`relative h-24 overflow-hidden bg-gradient-to-br ${challenge.gradientClass}`}
                >
                  {challenge.thumbnailUrl ? (
                    <img
                      src={challenge.thumbnailUrl}
                      alt={`${challenge.name} cover`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/0" />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <Lock className="h-7 w-7 text-white/60" aria-hidden />
                  </div>
                  {challenge.providerName && challenge.providerLogoUrl ? (
                    <div className="absolute left-2 top-2 z-10 flex max-w-[min(100%-1rem,14rem)] items-center gap-2 rounded-xl bg-white/95 py-1.5 pl-1.5 pr-2.5 shadow-md ring-1 ring-black/10">
                      <img
                        src={challenge.providerLogoUrl}
                        alt={`${challenge.providerName} logo`}
                        className="h-8 w-8 shrink-0 object-contain"
                        width={32}
                        height={32}
                        loading="lazy"
                      />
                      <span className="truncate text-[10px] font-bold leading-tight text-slate-800">
                        {challenge.providerName}
                      </span>
                    </div>
                  ) : null}
                  {challenge.featured ? (
                    <div className="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-lg bg-amber-400/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950 shadow-md ring-1 ring-amber-500/30">
                      <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
                      Featured
                    </div>
                  ) : null}
                  <span className="absolute bottom-2 left-2 rounded-lg bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {challenge.track}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 transition-colors group-hover:text-pink-600">
                    {challenge.name}
                  </h3>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" aria-hidden /> {challenge.duration}d
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                      {difficultyToLabel(challenge.difficulty)}
                    </span>
                    <span className="flex items-center gap-1" title={`Level ${challenge.difficulty} of 5`}>
                      <Target className="h-3 w-3" aria-hidden /> {challenge.difficulty}/5
                    </span>
                  </div>

                  <DifficultyDots level={challenge.difficulty} />

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {challenge.description}
                  </p>

                  {/* Stats */}
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2.5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Reward</p>
                      <p className="text-sm font-bold text-pink-600">+{challenge.reward} pts</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Success rate</p>
                      <p className="text-sm font-bold text-slate-800">{challenge.completionRate}%</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedId(challenge.id)}
                      disabled={!canJoin}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ background: APP_GRADIENT }}
                      aria-label={`View details for ${challenge.name}`}
                    >
                      View Details <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    {challenge.templateId && (
                      <Link
                        href={`/challenges/${challenge.templateId}`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                        aria-label={`Open ${challenge.name} full details`}
                      >
                        Open
                      </Link>
                    )}
                  </div>

                  {!canJoin && (
                    <p className="mt-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-orange-600">
                      Max challenges reached
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── HISTORY TAB ── */}
      {activeTab === "history" && (
        <section className={`${CARD_BASE} p-6`} aria-labelledby="history-heading">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">History · Completed & Failed</p>
          <h2 id="history-heading" className="mt-0.5 text-lg font-bold text-slate-800">
            Your past commitments
          </h2>

          {history.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {history.map((item) => {
                const isDone = item.status === "completed"
                return (
                  <li
                    key={item.id}
                    className={`flex items-center gap-4 rounded-xl border p-4 ${
                      isDone
                        ? "border-emerald-200/60 bg-emerald-50/40"
                        : "border-red-200/60 bg-red-50/30"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isDone ? "bg-emerald-100" : "bg-red-100"
                      }`}
                      aria-hidden
                    >
                      {isDone
                        ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        : <XCircle className="h-5 w-5 text-red-500" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-800">{item.name}</h3>
                        <span
                          className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            isDone ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isDone ? "Completed" : "Failed"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {item.duration}d · Difficulty {item.difficulty}/5 · {item.completedDate}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      {item.eliteScoreImpact ? (
                        <p className={`text-sm font-bold ${isDone ? "text-emerald-600" : "text-red-500"}`}>
                          {item.eliteScoreImpact} pts
                        </p>
                      ) : null}
                      {item.streakBonus && item.streakBonus !== "0" && (
                        <div className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-orange-600">
                          <Flame className="h-3 w-3" aria-hidden />
                          <span>{item.streakBonus} streak</span>
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <History className="mx-auto h-8 w-8 text-slate-300" aria-hidden />
              <p className="mt-2 text-sm text-slate-500">No challenge history yet.</p>
            </div>
          )}
        </section>
      )}

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

      {/* ── Challenge Detail Modal: one scroll region (header + hero + copy), footer fixed in card ── */}
      {selectedId && !showLockIn && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-stretch justify-end overflow-hidden bg-black/40 backdrop-blur-sm pt-[max(0.25rem,calc(3.5rem+env(safe-area-inset-top)-0.5rem))] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] pb-[max(0.25rem,calc(3.75rem+env(safe-area-inset-bottom)))] sm:items-center sm:justify-center sm:p-4 sm:pt-4 sm:pb-4"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="flex max-h-[calc(100svh-3.5rem-4.25rem-max(0px,env(safe-area-inset-top))-max(0px,env(safe-area-inset-bottom)))] min-h-0 w-full flex-1 flex-col overflow-hidden rounded-none border-0 border-t border-slate-200/80 bg-white shadow-xl max-md:mx-auto max-md:mb-1 max-md:w-[min(36rem,calc(100%-1.5rem)))] max-md:rounded-2xl max-md:border max-md:border-slate-200/80 max-md:shadow-xl sm:max-h-[min(85svh,44rem)] sm:flex-none sm:w-full sm:max-w-xl sm:rounded-2xl sm:border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain max-md:[scrollbar-gutter:stable]">
              <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200/80 bg-white px-4 py-3 sm:px-6 sm:py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-block rounded-lg bg-pink-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pink-600">
                      {selectedLibrary?.track}
                    </span>
                    {selectedLibrary?.featured ? (
                      <span className="inline-flex items-center gap-0.5 rounded-lg bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                        <Sparkles className="h-3 w-3" aria-hidden />
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-1 text-base font-bold leading-tight text-slate-800 sm:text-xl">{selectedLibrary?.name}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 active:bg-slate-100 min-h-[44px] min-w-[44px] touch-manipulation"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {selectedLibrary?.thumbnailUrl ? (
                <div className="relative h-32 w-full shrink-0 overflow-hidden bg-slate-200 sm:h-40">
                  <img
                    src={selectedLibrary.thumbnailUrl}
                    alt={`${selectedLibrary.name} cover`}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/0" />
                  {selectedLibrary.providerName && selectedLibrary.providerLogoUrl ? (
                    <div className="absolute left-3 top-3 z-10 flex max-w-[min(calc(100%-1.5rem),16rem)] items-center gap-2.5 rounded-xl bg-white/95 py-2 pl-2 pr-3 shadow-lg ring-1 ring-black/10">
                      <img
                        src={selectedLibrary.providerLogoUrl}
                        alt={`${selectedLibrary.providerName} logo`}
                        className="h-10 w-10 shrink-0 object-contain"
                        width={40}
                        height={40}
                      />
                      <span className="truncate text-xs font-bold leading-tight text-slate-800">
                        {selectedLibrary.providerName}
                      </span>
                    </div>
                  ) : null}
                  {selectedLibrary.featured ? (
                    <div className="absolute right-3 top-3 z-10 flex items-center gap-0.5 rounded-lg bg-amber-400/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-950 shadow-md ring-1 ring-amber-500/30">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      Featured
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="px-4 py-3 sm:px-6 sm:py-4">
                <div className="space-y-4 sm:space-y-5">
                  <section className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal">
                      Description
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {selectedLibrary?.description?.trim()
                        ? selectedLibrary.description.trim()
                        : "No description yet for this challenge."}
                    </p>
                  </section>

                  <section className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal">
                      Daily requirement
                    </h3>
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-sm sm:rounded-2xl sm:p-4">
                      <p className="text-sm leading-relaxed text-slate-700">{selectedLibrary?.description}</p>
                    </div>
                  </section>

                  <section className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal">
                      Proof required
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      Screenshot, photo, or link. Submissions are timestamped and immutable.
                    </p>
                  </section>

                  <section className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal">
                      Failure conditions
                    </h3>
                    <ul className="space-y-1.5">
                      {[
                        "Missing a day without proof",
                        "Invalid or incomplete proof",
                        "Late (after 11:59 PM)",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm leading-snug text-slate-600">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal">
                      Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          label: "Level",
                          value: selectedLibrary
                            ? `${difficultyToLabel(selectedLibrary.difficulty)} (${selectedLibrary.difficulty}/5)`
                            : "—",
                        },
                        { label: "Duration", value: `${selectedLibrary?.duration} days` },
                        { label: "Reward", value: `+${selectedLibrary?.reward} pts`, accent: true },
                        { label: "Completion", value: `${selectedLibrary?.completionRate}%` },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 shadow-sm sm:rounded-2xl sm:p-3"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{item.label}</p>
                          <p className={`mt-0.5 text-sm font-bold ${item.accent ? "text-pink-600" : "text-slate-800"}`}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200/80 bg-white px-4 py-3 sm:px-6 sm:py-4">
              {selectedLibrary?.templateId && (
                <Link
                  href={`/challenges/${selectedLibrary.templateId}`}
                  className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] min-h-[44px] touch-manipulation"
                >
                  View course outline
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
                </Link>
              )}
              <button
                type="button"
                onClick={handleLockInStart}
                disabled={!canJoin || alreadyEnrolled}
                className="flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 min-h-[48px] touch-manipulation text-white [-webkit-text-fill-color:white] [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]"
                style={{ background: APP_GRADIENT, color: "white" }}
              >
                {alreadyEnrolled
                  ? "Already enrolled"
                  : canJoin
                    ? "Continue — Add spectators & lock in"
                    : `Max ${MAX_ACTIVE} active challenges`}
              </button>
              {canJoin && !alreadyEnrolled && (
                <p className="mt-2 text-center text-[11px] text-slate-500 sm:text-xs">
                  Add at least one spectator before committing.
                </p>
              )}
              {!canJoin && !alreadyEnrolled && (
                <p className="mt-2 text-center text-[11px] text-orange-600 sm:text-xs">
                  Complete or quit an active challenge to join a new one.
                </p>
              )}
              <p className="mt-3 text-center text-[11px] leading-snug text-slate-500 sm:text-xs">
                Something wrong? Contact us at{" "}
                <a
                  href={ELITESCORE_SUPPORT_MAILTO}
                  className="font-medium text-pink-600 underline-offset-2 hover:underline break-all"
                >
                  {ELITESCORE_SUPPORT_EMAIL}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Lock-In Modal: one scroll region above footer; clears header / bottom nav ── */}
      {showLockIn && selectedId && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-stretch justify-end overflow-hidden bg-black/50 backdrop-blur-sm pt-[max(0.25rem,calc(3.5rem+env(safe-area-inset-top)-0.5rem))] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] pb-[max(0.25rem,calc(3.75rem+env(safe-area-inset-bottom)))] sm:items-center sm:justify-center sm:p-4 sm:pt-4 sm:pb-4"
          onClick={handleCloseLockIn}
        >
          <div
            className={`flex max-h-[calc(100svh-3.5rem-4.25rem-max(0px,env(safe-area-inset-top))-max(0px,env(safe-area-inset-bottom)))] min-h-0 w-full flex-1 flex-col overflow-hidden rounded-none border-0 border-t border-slate-200/80 bg-white shadow-xl max-md:mx-auto max-md:mb-1 max-md:w-[min(28rem,calc(100%-1.5rem)))] max-md:rounded-2xl max-md:border max-md:border-slate-200/80 max-md:shadow-xl sm:mx-auto sm:max-h-[min(85svh,44rem)] sm:flex-none sm:w-full sm:max-w-lg sm:rounded-2xl sm:border ${lockInStep === "success" ? "sm:max-h-[min(90svh,46rem)]" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress strip */}
            <div className="h-1.5 w-full shrink-0 bg-slate-100" aria-hidden>
              <div
                className="h-full transition-all duration-500"
                style={{
                  background: APP_GRADIENT,
                  width: lockInStep === "invite" ? "33%" : lockInStep === "confirm" ? "66%" : "100%",
                }}
              />
            </div>

            {/* Step 1: Add spectators — single scroll area + sticky footer */}
            {lockInStep === "invite" && (
              <>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-2 pt-3 max-md:[scrollbar-gutter:stable] sm:px-6 sm:pt-4">
                    <div className="flex shrink-0 items-start justify-between gap-3 pb-3 sm:pb-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Step 1 of 2</p>
                        <h2 className="mt-0.5 text-lg font-bold text-slate-800 sm:text-xl">Who&apos;s got your back?</h2>
                        <p className="mt-1 text-xs text-slate-600 sm:text-sm">Add at least one spectator before you lock in.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCloseLockIn}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 active:bg-slate-100 min-h-[44px] min-w-[44px] touch-manipulation"
                        aria-label="Close"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="relative overflow-hidden rounded-xl p-3 pr-12 text-white shadow-sm sm:rounded-2xl sm:p-4 sm:pr-14" style={{ background: APP_GRADIENT }}>
                        <p className="text-[10px] font-semibold text-white/80">You&apos;re locking in</p>
                        <h3 className="mt-0.5 text-sm font-bold leading-tight sm:text-base">{selectedLibrary?.name}</h3>
                        <span className="mt-1 inline-block text-xs text-white/90">{selectedLibrary?.duration} days · +{selectedLibrary?.reward} pts</span>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 sm:right-3 sm:h-9 sm:w-9">
                          <Trophy className="h-4 w-4" aria-hidden />
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-sm sm:rounded-2xl sm:p-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className="text-lg sm:text-xl" aria-hidden>💪</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 sm:text-sm">Partners increase success by 65%</p>
                            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 sm:text-sm">Supporters get daily updates and can send motivation.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="supporter-email" className="text-xs font-semibold text-slate-800 sm:text-sm">Add spectator email</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1 min-w-0">
                            <Mail className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden />
                            <input
                              id="supporter-email"
                              type="email"
                              value={supporterEmail}
                              onChange={(e) => { setSupporterEmail(e.target.value); setEmailError("") }}
                              onKeyDown={(e) => e.key === "Enter" && handleAddSupporter()}
                              placeholder="friend@email.com"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 min-h-[44px]"
                              aria-label="Spectator email address"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleAddSupporter}
                            disabled={supporters.length >= 3}
                            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl text-white transition-transform active:scale-[0.98] disabled:opacity-50 touch-manipulation"
                            style={{ background: APP_GRADIENT }}
                            aria-label="Add spectator"
                          >
                            <UserPlus className="h-5 w-5" />
                          </button>
                        </div>
                        {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                      </div>

                      {supporters.length > 0 ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-800 sm:text-sm">Your spectators</p>
                            <p className="text-[10px] text-slate-500">{supporters.length}/3</p>
                          </div>
                          {supporters.map((s) => (
                            <div key={s.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
                              <div className="flex min-w-0 items-center gap-2">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: APP_GRADIENT }} aria-hidden>
                                  {s.email.charAt(0).toUpperCase()}
                                </div>
                                <p className="truncate text-xs font-medium text-slate-800 sm:text-sm">{s.email}</p>
                              </div>
                              <button type="button" onClick={() => handleRemoveSupporter(s.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 touch-manipulation" aria-label={`Remove ${s.email}`}>
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-200/80 bg-slate-50/50 py-4 text-center sm:rounded-2xl sm:py-6">
                          <Users className="mx-auto h-8 w-8 text-slate-300" aria-hidden />
                          <p className="mt-2 text-xs font-medium text-slate-600 sm:text-sm">No spectators yet</p>
                          <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">Add at least one to continue</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 border-t border-slate-200/80 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
                  <p className="mb-2 text-center text-[10px] leading-snug text-slate-500 sm:text-xs">
                    Something wrong? Contact us at{" "}
                    <a
                      href={ELITESCORE_SUPPORT_MAILTO}
                      className="font-medium text-pink-600 underline-offset-2 hover:underline break-all"
                    >
                      {ELITESCORE_SUPPORT_EMAIL}
                    </a>
                  </p>
                  <div className="flex gap-2 sm:gap-3">
                    <button type="button" onClick={handleCloseLockIn} className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 min-h-[48px] touch-manipulation">Cancel</button>
                    <button type="button" onClick={handleSendInvites} disabled={supporters.length === 0} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-transform active:scale-[0.98] disabled:opacity-50 min-h-[48px] touch-manipulation text-white [-webkit-text-fill-color:white] [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]" style={{ background: APP_GRADIENT, color: "white" }}>
                      <Send className="h-4 w-4 shrink-0" aria-hidden /> Continue
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Confirm — single scroll area + sticky footer */}
            {lockInStep === "confirm" && (
              <>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-2 pt-3 max-md:[scrollbar-gutter:stable] sm:px-6 sm:pt-4">
                    <div className="flex shrink-0 items-start justify-between gap-3 pb-3 sm:pb-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Step 2 of 2</p>
                        <h2 className="mt-0.5 text-lg font-bold text-slate-800 sm:text-xl">Final confirmation</h2>
                        <p className="mt-1 text-xs text-slate-600 sm:text-sm">This is a serious commitment.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCloseLockIn}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 active:bg-slate-100 min-h-[44px] min-w-[44px] touch-manipulation"
                        aria-label="Close"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="rounded-xl border border-orange-200/80 bg-orange-50/50 p-3 shadow-sm sm:rounded-2xl sm:p-4">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-orange-500" aria-hidden />
                          <span className="text-xs font-bold text-orange-600 sm:text-sm">Point of no return</span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                          Once you lock in, there&apos;s <strong className="text-slate-800">no backing out</strong>. Miss a day without proof and your EliteScore takes a <strong className="text-red-600">-60 hit</strong>.
                        </p>
                      </div>

                      <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3 shadow-sm sm:rounded-2xl sm:p-4">
                        <div className="mb-2 flex items-center gap-2 sm:mb-3">
                          <Check className="h-4 w-4 text-emerald-600" aria-hidden />
                          <span className="text-xs font-semibold text-emerald-700 sm:text-sm">Invites queued</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {supporters.map((s) => (
                            <div key={s.id} className="flex items-center gap-1 rounded-full border border-emerald-200/60 bg-white px-2.5 py-1 sm:px-3 sm:py-1.5">
                              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white sm:h-5 sm:w-5 sm:text-[10px]" style={{ background: APP_GRADIENT }} aria-hidden>{s.email.charAt(0).toUpperCase()}</div>
                              <span className="text-[10px] text-slate-700 sm:text-xs">{s.email.split("@")[0]}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 text-xs font-bold text-slate-800 sm:text-sm sm:mb-3">Challenge details</h3>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          {[
                            { label: "Start", value: "Today" },
                            { label: "End", value: new Date(Date.now() + (selectedLibrary?.duration ?? 0) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
                            { label: "Duration", value: `${selectedLibrary?.duration} days` },
                            { label: "Reward", value: `+${selectedLibrary?.reward} pts`, accent: true },
                          ].map((item) => (
                            <div key={item.label} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 shadow-sm sm:rounded-2xl sm:p-3">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{item.label}</p>
                              <p className={`mt-0.5 text-sm font-bold ${item.accent ? "text-pink-600" : "text-slate-800"}`}>{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 border-t border-slate-200/80 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
                  <p className="mb-2 text-center text-[10px] leading-snug text-slate-500 sm:text-xs">
                    Something wrong? Contact us at{" "}
                    <a
                      href={ELITESCORE_SUPPORT_MAILTO}
                      className="font-medium text-pink-600 underline-offset-2 hover:underline break-all"
                    >
                      {ELITESCORE_SUPPORT_EMAIL}
                    </a>
                  </p>
                  <div className="flex gap-2 sm:gap-3">
                    <button type="button" onClick={() => setLockInStep("invite")} className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 min-h-[48px] touch-manipulation">Back</button>
                    <button type="button" onClick={handleConfirmLockIn} disabled={joinInProgress} className="flex flex-1 items-center justify-center rounded-xl py-3 text-sm font-bold transition-transform active:scale-[0.98] min-h-[48px] touch-manipulation text-white [-webkit-text-fill-color:white] [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] disabled:opacity-70 disabled:pointer-events-none" style={{ background: APP_GRADIENT, color: "white" }}>{joinInProgress ? "Joining…" : "I'm committed — Lock In"}</button>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Success — full viewport on mobile, centered */}
            {lockInStep === "success" && (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto overscroll-contain px-4 py-8 text-center sm:py-10">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-24 w-24 animate-ping rounded-full bg-emerald-500/20" aria-hidden />
                  </div>
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full shadow-lg" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                    <CheckCircle2 className="h-10 w-10 text-white" aria-hidden />
                  </div>
                </div>
                <h2 className="mt-6 text-xl font-bold text-slate-800 sm:text-2xl">You&apos;re locked in!</h2>
                <p className="mt-2 max-w-xs text-sm text-slate-600">Your journey starts now. Your supporters have been notified.</p>
                <div className="mt-5 flex items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2.5 shadow-sm min-h-[44px]">
                  <Users className="h-4 w-4 shrink-0 text-pink-500" aria-hidden />
                  <span className="text-sm text-slate-700">{supporters.length} supporter{supporters.length > 1 ? "s" : ""} watching</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Proof Submission Modal ── */}
      {showProofFor !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setShowProofFor(null)}
        >
          <div
            className="w-full max-h-[90dvh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:mx-auto sm:max-w-lg sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Submit Daily Proof</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Upload proof of today&apos;s task. Submissions are timestamped and immutable.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProofFor(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">Proof Type</p>
                <div className="grid grid-cols-3 gap-2">
                  {["Image", "Link", "Text"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="rounded-xl border border-slate-200/80 bg-white py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-pink-500/50 hover:bg-pink-50/50 hover:text-pink-600"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">Upload Proof</p>
                <div className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-colors hover:border-pink-500/40 hover:bg-pink-50/30">
                  <Upload className="h-8 w-8 text-slate-300" aria-hidden />
                  <p className="mt-2 text-sm font-medium text-slate-700">Tap to upload</p>
                  <p className="text-xs text-slate-400">PNG, JPG, PDF up to 10 MB</p>
                </div>
              </div>

              <div>
                <label htmlFor="proof-notes" className="mb-2 block text-sm font-semibold text-slate-700">
                  Notes <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <textarea
                  id="proof-notes"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  rows={3}
                  placeholder="Add any additional context..."
                />
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProofFor(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowProofFor(null)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                  style={{ background: APP_GRADIENT }}
                >
                  <Upload className="h-4 w-4" aria-hidden /> Submit Proof
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Quit Confirmation Modal ── */}
      {showQuitFor !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => { setQuitError(null); setShowQuitFor(null) }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quit-modal-title"
          aria-describedby="quit-modal-desc"
        >
          <div
            className="flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100" aria-hidden>
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 id="quit-modal-title" className="text-lg font-bold text-slate-800">
                    Quit this challenge?
                  </h2>
                  <p id="quit-modal-desc" className="mt-2 text-sm leading-relaxed text-slate-600">
                    If you quit:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600" aria-hidden>
                    <li>Your EliteScore will be reduced by <strong className="font-semibold text-red-600">35 points</strong></li>
                    <li>This challenge will be marked as <strong className="font-semibold text-slate-700">abandoned</strong></li>
                    <li>This action <strong className="font-semibold text-slate-700">cannot be undone</strong></li>
                  </ul>
                  {quitError && (
                    <p className="mt-3 text-sm font-medium text-red-600" role="alert">{quitError}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="shrink-0 border-t border-slate-100 p-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setQuitError(null); setShowQuitFor(null) }}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmQuit}
                  className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600"
                >
                  Quit Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
