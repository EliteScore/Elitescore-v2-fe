"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
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

// Mock data
const challengeData: Record<
  number,
  {
    id: number
    name: string
    description: string
    difficulty: number
    duration: number
    currentDay: number
    daysRemaining: number
    progress: number
    reward: number
    requirements: string[]
    roadmap: {
      id: number
      title: string
      status: "completed" | "in_progress" | "locked"
      tasks: { id: number; title: string; completed: boolean; day: number | string }[]
    }[]
    todayTask: {
      day: number
      title: string
      description: string
      requirements: string[]
      xp: number
    }
  }
> = {
  1: {
    id: 1,
    name: "30-Day Python Mastery",
    description: "Master Python fundamentals through hands-on projects and daily coding challenges",
    difficulty: 4,
    duration: 30,
    currentDay: 12,
    daysRemaining: 18,
    progress: 40,
    reward: 450,
    requirements: [
      "Complete 3 LeetCode problems daily",
      "Build 1 project per week",
      "Submit code screenshots as proof",
      "Follow Python best practices",
    ],
    roadmap: [
      {
        id: 1,
        title: "Week 1: Python Fundamentals",
        status: "completed",
        tasks: [
          { id: 1, title: "Variables & Data Types", completed: true, day: 1 },
          { id: 2, title: "Control Flow (if/else, loops)", completed: true, day: 2 },
          { id: 3, title: "Functions & Modules", completed: true, day: 3 },
          { id: 4, title: "Lists & Dictionaries", completed: true, day: 4 },
          { id: 5, title: "File Handling", completed: true, day: 5 },
          { id: 6, title: "Error Handling", completed: true, day: 6 },
          { id: 7, title: "Week 1 Project: CLI Tool", completed: true, day: 7 },
        ],
      },
      {
        id: 2,
        title: "Week 2: Data Structures & Algorithms",
        status: "in_progress",
        tasks: [
          { id: 8, title: "Arrays & Strings", completed: true, day: 8 },
          { id: 9, title: "Stacks & Queues", completed: true, day: 9 },
          { id: 10, title: "Linked Lists", completed: true, day: 10 },
          { id: 11, title: "Trees & Graphs", completed: true, day: 11 },
          { id: 12, title: "Sorting Algorithms", completed: true, day: 12 },
          { id: 13, title: "Searching Algorithms", completed: false, day: 13 },
          { id: 14, title: "Week 2 Project: Data Processor", completed: false, day: 14 },
        ],
      },
      {
        id: 3,
        title: "Week 3: OOP & Design Patterns",
        status: "locked",
        tasks: [
          { id: 15, title: "Classes & Objects", completed: false, day: 15 },
          { id: 16, title: "Inheritance & Polymorphism", completed: false, day: 16 },
          { id: 17, title: "Design Patterns", completed: false, day: 17 },
          { id: 18, title: "SOLID Principles", completed: false, day: 18 },
          { id: 19, title: "Testing with pytest", completed: false, day: 19 },
          { id: 20, title: "Debugging Techniques", completed: false, day: 20 },
          { id: 21, title: "Week 3 Project: OOP System", completed: false, day: 21 },
        ],
      },
      {
        id: 4,
        title: "Week 4: Real-World Application",
        status: "locked",
        tasks: [
          { id: 22, title: "API Development with Flask", completed: false, day: 22 },
          { id: 23, title: "Database Integration", completed: false, day: 23 },
          { id: 24, title: "Authentication & Security", completed: false, day: 24 },
          { id: 25, title: "Deployment Setup", completed: false, day: 25 },
          { id: 26, title: "Testing & Documentation", completed: false, day: 26 },
          { id: 27, title: "Performance Optimization", completed: false, day: 27 },
          { id: 28, title: "Final Project: Full-Stack App", completed: false, day: "28-30" },
        ],
      },
    ],
    todayTask: {
      day: 12,
      title: "Sorting Algorithms",
      description:
        "Implement and analyze QuickSort, MergeSort, and HeapSort. Code all three sorting algorithms, write time complexity analysis, and create a comparison benchmark. Upload a code screenshot as proof of completion.",
      requirements: [
        "Code all three sorting algorithms",
        "Write time complexity analysis",
        "Create comparison benchmark",
        "Upload code screenshot",
      ],
      xp: 50,
    },
  },
  2: {
    id: 2,
    name: "14-Day LinkedIn Growth",
    description: "Build your professional brand and grow your LinkedIn presence",
    difficulty: 2,
    duration: 14,
    currentDay: 7,
    daysRemaining: 7,
    progress: 50,
    reward: 140,
    requirements: [
      "Post valuable content daily",
      "Engage with 5+ posts per day",
      "Connect with 3 professionals weekly",
      "Share screenshots of activity",
    ],
    roadmap: [
      {
        id: 1,
        title: "Week 1: Profile & Content Foundation",
        status: "in_progress",
        tasks: [
          { id: 1, title: "Optimize profile photo & headline", completed: true, day: 1 },
          { id: 2, title: "Write compelling about section", completed: true, day: 2 },
          { id: 3, title: "First value post", completed: true, day: 3 },
          { id: 4, title: "Share industry insight", completed: true, day: 4 },
          { id: 5, title: "Create carousel post", completed: true, day: 5 },
          { id: 6, title: "Engage with 10 posts", completed: true, day: 6 },
          { id: 7, title: "Connect with 5 professionals", completed: true, day: 7 },
        ],
      },
      {
        id: 2,
        title: "Week 2: Growth & Engagement",
        status: "locked",
        tasks: [
          { id: 8, title: "Post about learning journey", completed: false, day: 8 },
          { id: 9, title: "Share a success story", completed: false, day: 9 },
          { id: 10, title: "Create video post", completed: false, day: 10 },
          { id: 11, title: "Write article on expertise", completed: false, day: 11 },
          { id: 12, title: "Host LinkedIn poll", completed: false, day: 12 },
          { id: 13, title: "Celebrate milestone", completed: false, day: 13 },
          { id: 14, title: "Reflect & plan next steps", completed: false, day: 14 },
        ],
      },
    ],
    todayTask: {
      day: 7,
      title: "Connect with 5 professionals",
      description:
        "Reach out to professionals in your industry with personalized messages. Find 5 relevant connections, write personalized connection requests, and upload a screenshot of sent requests as proof.",
      requirements: [
        "Find 5 relevant connections",
        "Write personalized connection requests",
        "Screenshot sent requests",
        "Upload proof",
      ],
      xp: 30,
    },
  },
}

export default function ChallengeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const challengeId = parseInt(params.id as string)
  const challenge = challengeData[challengeId as keyof typeof challengeData]

  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1, 2]))
  const [showUploadProof, setShowUploadProof] = useState(false)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleToggleWeek = (weekId: number) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev)
      if (next.has(weekId)) next.delete(weekId)
      else next.add(weekId)
      return next
    })
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
                    if (next.has(-1)) next.delete(-1)
                    else next.add(-1)
                    return next
                  })
                }}
                aria-expanded={expandedWeeks.has(-1)}
              >
                <span className="text-sm font-semibold text-slate-800">Course outline</span>
                {expandedWeeks.has(-1) ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden />
                )}
              </button>
              {expandedWeeks.has(-1) && (
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

            {/* Video block — landing-style card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-lg">
              <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <button
                  type="button"
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-xl transition-transform hover:scale-105 active:scale-95"
                  aria-label="Play video"
                >
                  <Play className="h-8 w-8 pl-1" fill="currentColor" />
                </button>
                {/* Mini stats overlay */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-6">
                  <span className="text-xs font-medium text-white/90">
                    {challenge.name}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    <Flame className="h-3.5 w-3.5 text-orange-300" aria-hidden />
                    {challenge.progress}% done
                  </div>
                </div>
              </div>
            </div>

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
