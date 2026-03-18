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
                        const isCurrent =
                          task.day === challenge.todayTask.day ||
                          (typeof task.day === "number" && task.day === challenge.currentDay)
                        return (
                          <li key={task.id}>
                            <div
                              className={`flex items-center gap-2.5 rounded-xl px-2 py-2 text-sm transition-colors ${
                                isCurrent
                                  ? "bg-pink-50 font-semibold text-pink-700"
                                  : "text-slate-600 hover:bg-slate-50"
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
                              <span className="min-w-0 truncate">
                                Day {task.day}: {task.title}
                              </span>
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
                      const isCurrent = task.day === challenge.todayTask.day
                      return (
                        <li key={task.id} className={`flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm ${isCurrent ? "bg-pink-50 font-semibold text-pink-700" : "text-slate-600"}`}>
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${task.completed ? "bg-emerald-500 text-white" : "border border-slate-200 bg-white"}`} aria-hidden>
                            {task.completed && <Check className="h-3 w-3" />}
                          </span>
                          <span className="truncate">{task.title}</span>
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
                onClick={() => setShowUploadProof(true)}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
                style={{ background: APP_GRADIENT }}
              >
                <Check className="h-4 w-4" aria-hidden />
                Submit &amp; Complete
              </button>
            </div>

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
                onClick={() => setShowUploadProof(true)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                style={{ background: APP_GRADIENT }}
              >
                <Upload className="h-4 w-4" aria-hidden />
                Upload Proof
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
          onClick={() => setShowUploadProof(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Submit proof
            </p>
            <h3 className="mt-0.5 text-lg font-bold text-slate-800">Upload your completion proof</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="proof-file" className="mb-1 block text-xs font-medium text-slate-700">
                  Screenshot / Photo
                </label>
                <input
                  id="proof-file"
                  type="file"
                  accept="image/*,.pdf"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 file:mr-2 file:rounded-lg file:border-0 file:bg-pink-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-pink-600 hover:file:bg-pink-100"
                />
              </div>
              <div>
                <label htmlFor="proof-desc" className="mb-1 block text-xs font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  id="proof-desc"
                  placeholder="Describe what you completed..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadProof(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadProof(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                  style={{ background: APP_GRADIENT }}
                >
                  <Upload className="h-4 w-4" aria-hidden /> Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
