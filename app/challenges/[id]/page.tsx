"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  Lock,
  Upload,
  Heart,
  MessageCircle,
  Bookmark,
  Play,
  Target,
  Flame,
} from "lucide-react"

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

function mapEnrollmentProgressToUiDay(progressDay: number | null | undefined, duration?: number): number {
  const mapped = Math.max(1, (progressDay ?? 0) + 1)
  return typeof duration === "number" && duration > 0 ? Math.min(mapped, duration) : mapped
}

export default function ChallengeDetailPage() {
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
  const [proofMode, setProofMode] = useState<"text" | "link">("text")
  const [proofText, setProofText] = useState("")
  const [proofLink, setProofLink] = useState("")
  const [proofNotes, setProofNotes] = useState("")
  const [proofSubmitting, setProofSubmitting] = useState(false)
  const [proofError, setProofError] = useState<string | null>(null)
  const [proofVerdict, setProofVerdict] = useState<ProofVerdict | null>(null)
  const [proofFeedback, setProofFeedback] = useState<string | null>(null)
  const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null)
  const [proofAttempt, setProofAttempt] = useState<ProofAttempt>(1)
  const [missedDayNotice, setMissedDayNotice] = useState<string | null>(null)

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
            ? steps.find((s) => s.day === requestedDay)
            : null
        const firstStep = stepForDay ?? steps[0]
        const todayDay = firstStep?.day ?? requestedDay ?? 1
        const xp = typeof firstStep?.rewardEliteScore === "number" ? firstStep.rewardEliteScore : 0
        const description = firstStep?.instructions ?? "Daily task for this challenge."
        const requirements: string[] =
          (firstStep?.expectedProof ?? "")
            .split(/\r?\n/)
            .map((s) => s.trim())
            .filter(Boolean) || []

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
          setChallengeFailedBanner(
            "This challenge has been auto-failed (max missed days reached)."
          )
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
    setProofNotes("")
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

  const buildProofBody = (): { ok: true; body: Record<string, unknown> } | { ok: false; message: string } => {
    const text = proofText.trim()
    const link = proofLink.trim()
    const notes = proofNotes.trim()

    if (!text && !link) {
      return { ok: false, message: "Add proof text or a public link before submitting." }
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

    const body: Record<string, unknown> = {}
    if (text) body.proofText = text
    if (link) body.proofLink = link
    if (notes) body.notes = notes
    return { ok: true, body }
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

    const built = buildProofBody()
    if (!built.ok) {
      setProofError(built.message)
      return
    }

    const headers = buildAuthHeaders()
    if (!headers) {
      setProofError("You are not signed in.")
      return
    }

    setProofSubmitting(true)
    try {
      if (process.env.NODE_ENV === "development") {
        console.debug("[Proof submit] request", {
          userChallengeId: enrollment.userChallengeId,
          bodyKeys: Object.keys(built.body),
        })
      }
      const res = await fetch(`/api/challenges/${enrollment.userChallengeId}/proofs`, {
        method: "POST",
        headers,
        body: JSON.stringify(built.body),
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
        const hasExistingSubmissionConflict =
          res.status === 409 &&
          /already exists|already submitted|pending|needs_review|rejected/i.test(detail)

        if (hasExistingSubmissionConflict) {
          const cachedSubmissionId = readPendingSubmissionId(enrollment.userChallengeId)
          if (cachedSubmissionId) {
            setProofAttempt(2)
            setLastSubmissionId(cachedSubmissionId)
            setProofVerdict("rejected")
            setProofFeedback(
              "A submission already exists for this day. Updating the same entry via Resubmit."
            )
          }
        } else if (res.status >= 500) {
          setProofAttempt(1)
          setLastSubmissionId(null)
        }

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
            ? "Cannot submit: a proof for this day already exists or challenge is not active."
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
        if (data.id) {
          savePendingSubmissionId(enrollment.userChallengeId, data.id)
        }
        setProofAttempt(2)
        setProofVerdict("rejected")
        setProofFeedback(feedback ?? "AI rejected this proof. Improve and resubmit within 24 hours.")
        setLastSubmissionId(data.id ?? null)
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[Proof submit] fetch error", err)
      }
      setProofAttempt(1)
      setLastSubmissionId(null)
      setProofError("Network error — could not reach the proof service.")
    } finally {
      setProofSubmitting(false)
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

    const built = buildProofBody()
    if (!built.ok) {
      setProofError(built.message)
      return
    }

    const headers = buildAuthHeaders()
    if (!headers) {
      setProofError("You are not signed in.")
      return
    }

    setProofSubmitting(true)
    try {
      if (process.env.NODE_ENV === "development") {
        console.debug("[Proof resubmit] request", {
          userChallengeId: enrollment.userChallengeId,
          submissionId: lastSubmissionId,
          bodyKeys: Object.keys(built.body),
        })
      }
      const res = await fetch(
        `/api/challenges/${enrollment.userChallengeId}/proofs/${lastSubmissionId}/resubmit`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(built.body),
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
        // Attempt 2 rejected: backend auto-applies missed-day penalty.
        const info = await fetchEnrollment()
        const newMissed = info?.missedDaysCount ?? enrollment.missedDaysCount + 1
        const isFailed = info?.status === "failed"
        if (info) setEnrollment(info)

        if (isFailed) {
          setChallengeFailedBanner(
            "This challenge has been auto-failed (max missed days reached)."
          )
          setMissedDayNotice("Challenge auto-failed after this missed day.")
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
        setProofFeedback(feedback ?? "AI rejected the resubmission.")
        clearPendingSubmissionId(enrollment.userChallengeId)
        setLastSubmissionId(null)
        setProofAttempt(1)
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[Proof resubmit] fetch error", err)
      }
      setLastSubmissionId(null)
      setProofAttempt(1)
      setProofError("Network error — could not reach the proof service.")
    } finally {
      setProofSubmitting(false)
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
  const canSubmitToday = Boolean(
    enrollment && enrollment.status === "active" && !isViewingPastDay
  )

  return (
    <div className="min-h-screen w-full bg-[#f5f5f6] font-sans text-slate-800 antialiased">
      <div className="mx-auto flex w-full max-w-7xl">
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
        <main className="min-w-0 flex-1 px-3 py-6 sm:px-4 md:px-6">
          <div className="mx-auto w-full max-w-3xl space-y-6">
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
                {isViewingPastDay ? "Already completed" : "Submit & Complete"}
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

            {/* Challenge description card — landing style */}
            <section className={`${CARD_BASE} p-5 sm:p-6`} aria-labelledby="challenge-desc-heading">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Challenge · Day {challenge.todayTask.day}
              </p>
              <h2 id="challenge-desc-heading" className="mt-1 text-lg font-bold text-slate-800">
                {challenge.todayTask.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {challenge.todayTask.description}
              </p>
            </section>

            {/* What to submit card */}
            <section className={`${CARD_BASE} p-5 sm:p-6`} aria-labelledby="submit-heading">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Submission
              </p>
              <h2 id="submit-heading" className="mt-1 text-lg font-bold text-slate-800">
                What to submit
              </h2>
              <ul className="mt-4 space-y-3">
                {challenge.todayTask.requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3"
                  >
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: APP_GRADIENT }}
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-slate-700">{req}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={openProofModal}
                disabled={!canSubmitToday}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: APP_GRADIENT }}
              >
                <Upload className="h-4 w-4" aria-hidden />
                {isViewingPastDay ? "Day already completed" : "Upload Proof"}
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
          </div>
        </main>
      </div>

      {/* Upload Proof Modal - light theme */}
      {showUploadProof && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={closeProofModal}
        >
          <div
            className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl bg-white p-6 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="proof-modal-title"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Submit proof
            </p>
            <h3 id="proof-modal-title" className="mt-0.5 text-lg font-bold text-slate-800">
              {proofVerdict === "accepted"
                ? "Proof accepted"
                : proofVerdict === "rejected"
                ? "AI feedback — please resubmit"
                : "Upload your completion proof"}
            </h3>

            {enrollmentLoading && (
              <p className="mt-2 text-xs text-slate-500">Loading your enrollment...</p>
            )}
            {!enrollmentLoading && !enrollment && (
              <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                You are not enrolled in this challenge.
              </p>
            )}

            <div className="mt-4 space-y-4">
              {proofVerdict !== "accepted" && (
                <>
                  <div>
                    <p className="mb-2 text-xs font-semibold text-slate-700">Proof type</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(["text", "link"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setProofMode(mode)}
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                            proofMode === mode
                              ? "border-pink-500/60 bg-pink-50 text-pink-600"
                              : "border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                          aria-pressed={proofMode === mode}
                        >
                          {mode === "text" ? "Text" : "Link"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {proofMode === "text" ? (
                    <div>
                      <label htmlFor="proof-text" className="mb-1 block text-xs font-medium text-slate-700">
                        Proof text <span className="text-slate-400">({proofText.length}/5000)</span>
                      </label>
                      <textarea
                        id="proof-text"
                        value={proofText}
                        onChange={(e) => setProofText(e.target.value)}
                        placeholder="Describe what you completed in detail. Include key takeaways."
                        maxLength={5000}
                        rows={5}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                        disabled={proofSubmitting}
                      />
                    </div>
                  ) : (
                    <div>
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
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                        disabled={proofSubmitting}
                      />
                      <p className="mt-1 text-[11px] text-slate-400">
                        Must start with http:// or https://
                      </p>
                    </div>
                  )}

                  <div>
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
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                      disabled={proofSubmitting}
                    />
                  </div>
                </>
              )}

              {proofVerdict === "accepted" && proofFeedback && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs leading-relaxed text-emerald-800">
                  <p className="font-semibold">AI verdict: accepted</p>
                  <p className="mt-1 whitespace-pre-wrap">{proofFeedback}</p>
                </div>
              )}
              {proofVerdict === "rejected" && proofFeedback && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-relaxed text-red-800">
                  <p className="font-semibold">AI feedback</p>
                  <p className="mt-1 whitespace-pre-wrap">{proofFeedback}</p>
                  <p className="mt-2 text-[11px] text-red-700/80">
                    You can edit your inputs above and click Resubmit. You have a 24-hour window.
                  </p>
                </div>
              )}
              {missedDayNotice && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800" role="status">
                  {missedDayNotice}
                </div>
              )}
              {proofError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700" role="alert">
                  {proofError}
                </div>
              )}

              <div className="sticky bottom-0 -mx-6 mt-2 border-t border-slate-100 bg-white px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                {proofSubmitting && (
                  <p className="mb-2 text-center text-xs text-slate-500">
                    Processing your proof. This may take up to one minute.
                  </p>
                )}
                <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeProofModal}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                  disabled={proofSubmitting}
                >
                  {proofVerdict === "accepted" ? "Close" : "Cancel"}
                </button>
                {proofVerdict === "accepted" ? (
                  <button
                    type="button"
                    onClick={closeProofModal}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                    style={{ background: APP_GRADIENT }}
                  >
                    <Check className="h-4 w-4" aria-hidden /> Continue
                  </button>
                ) : proofAttempt === 2 && lastSubmissionId ? (
                  <button
                    type="button"
                    onClick={resubmitProof}
                    disabled={proofSubmitting || !enrollment}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
                    style={{ background: APP_GRADIENT }}
                  >
                    <Upload className="h-4 w-4" aria-hidden />
                    {proofSubmitting ? "Resubmitting..." : "Resubmit"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitProof}
                    disabled={proofSubmitting || !enrollment}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
                    style={{ background: APP_GRADIENT }}
                  >
                    <Upload className="h-4 w-4" aria-hidden />
                    {proofSubmitting ? "Submitting..." : "Submit"}
                  </button>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
