"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Trophy, Target, Calendar, Clock, Lock, Upload, CheckCircle2, XCircle,
  Flame, AlertTriangle, ChevronRight, History, Users, Mail, X, Check,
  Send, UserPlus, ListTodo, BookOpen, ArrowUpRight,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────

interface Supporter {
  id: string
  email: string
  status: "pending" | "accepted" | "declined"
  /** True when added via "Share via WhatsApp" (invite link) instead of email */
  viaLink?: boolean
}

type ActiveChallenge = {
  id: number
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
}

type HistoryChallenge = {
  id: number
  name: string
  difficulty: number
  duration: number
  status: "completed" | "failed"
  completedDate: string
  eliteScoreImpact: string
  streakBonus: string
}

// ── Constants ──────────────────────────────────────────────────────────────

const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"
const CARD_BASE = "rounded-2xl border border-slate-200/80 bg-white shadow-sm"
const MAX_ACTIVE = 2

const INITIAL_ACTIVE: ActiveChallenge[] = [
  {
    id: 1,
    name: "30-Day Python Mastery",
    difficulty: 4,
    currentDay: 12,
    totalDays: 30,
    daysRemaining: 18,
    todayTask: "Complete 3 LeetCode medium problems using Python.",
    progress: 40,
    reward: 450,
    track: "Technical Skills",
    weekLabel: "Week 2 · Build",
    accentFrom: "#db2777",
    accentTo: "#ea580c",
    deadline: "Tonight 11:59 PM",
    deadlineUrgent: true,
  },
  {
    id: 2,
    name: "14-Day LinkedIn Growth",
    difficulty: 2,
    currentDay: 7,
    totalDays: 14,
    daysRemaining: 7,
    todayTask: "Post a career insight and engage with 5 posts in your industry.",
    progress: 50,
    reward: 140,
    track: "Career Development",
    weekLabel: "Week 1 · Foundation",
    accentFrom: "#2563eb",
    accentTo: "#7c3aed",
    deadline: "Tomorrow 11:59 PM",
    deadlineUrgent: false,
  },
]

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

const INITIAL_HISTORY: HistoryChallenge[] = [
  {
    id: 101,
    name: "14-Day JavaScript Sprint",
    difficulty: 3,
    duration: 14,
    status: "completed",
    completedDate: "2025-01-10",
    eliteScoreImpact: "+140",
    streakBonus: "+20",
  },
  {
    id: 102,
    name: "7-Day Cold Outreach",
    difficulty: 2,
    duration: 7,
    status: "failed",
    completedDate: "2024-12-28",
    eliteScoreImpact: "-60",
    streakBonus: "0",
  },
]

const TABS = [
  { id: "active", label: "Active", Icon: ListTodo },
  { id: "library", label: "Library", Icon: BookOpen },
  { id: "history", label: "History", Icon: History },
]

const TRACK_FILTERS = ["All", "Technical Skills", "Career Development", "Wellness", "Learning"]

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
  const [activeTab, setActiveTab] = useState("active")
  const [trackFilter, setTrackFilter] = useState("All")
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [showLockIn, setShowLockIn] = useState(false)
  const [showProofFor, setShowProofFor] = useState<number | null>(null)
  const [showQuitFor, setShowQuitFor] = useState<number | null>(null)

  const [activeChallenges, setActiveChallenges] = useState<ActiveChallenge[]>(INITIAL_ACTIVE)
  const [history, setHistory] = useState<HistoryChallenge[]>(INITIAL_HISTORY)

  const [lockInStep, setLockInStep] = useState<"invite" | "confirm" | "success">("invite")
  const [supporters, setSupporters] = useState<Supporter[]>([])
  const [supporterEmail, setSupporterEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const activeCount = activeChallenges.length
  const canJoin = activeCount < MAX_ACTIVE
  const selectedLibrary = LIBRARY.find((c) => c.id === selectedId)
  const alreadyEnrolled = selectedId !== null && activeChallenges.some((c) => c.id === selectedId)

  const filteredLibrary =
    trackFilter === "All" ? LIBRARY : LIBRARY.filter((c) => c.track === trackFilter)

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleAddSupporter = () => {
    if (!supporterEmail.trim()) { setEmailError("Email is required"); return }
    if (!validateEmail(supporterEmail)) { setEmailError("Please enter a valid email"); return }
    if (supporters.length >= 3) { setEmailError("Maximum 3 supporters allowed"); return }
    if (supporters.some((s) => !s.viaLink && s.email.toLowerCase() === supporterEmail.toLowerCase())) {
      setEmailError("Already added"); return
    }
    setSupporters([...supporters, { id: Date.now().toString(), email: supporterEmail, status: "pending" }])
    setSupporterEmail("")
    setEmailError("")
  }

  const hasViaLinkSupporter = supporters.some((s) => s.viaLink)
  const inviterName =
    typeof window !== "undefined"
      ? (localStorage.getItem("elitescore_user_name") ?? "A friend")
      : "A friend"
  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/spectator/join?challenge=${encodeURIComponent(selectedLibrary?.name ?? "challenge")}&from=${encodeURIComponent(inviterName)}`
      : ""
  const whatsappMessage = `I'm locking in a challenge on EliteScore. Be my spectator — sign up here: ${inviteUrl}`
  const handleShareViaWhatsApp = () => {
    if (!inviteUrl) return
    const encoded = encodeURIComponent(whatsappMessage)
    try {
      navigator.clipboard.writeText(inviteUrl)
    } catch {
      // ignore
    }
    window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer")
    if (!hasViaLinkSupporter) {
      setSupporters((prev) => [...prev, { id: "via-link", email: "Via invite link", status: "pending", viaLink: true }])
    }
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
    if (supporters.length === 0) { setEmailError("Add at least one supporter to continue"); return }
    setLockInStep("confirm")
  }

  const handleConfirmLockIn = () => {
    if (!selectedLibrary || alreadyEnrolled) return
    const newChallenge: ActiveChallenge = {
      id: selectedLibrary.id,
      name: selectedLibrary.name,
      difficulty: selectedLibrary.difficulty,
      currentDay: 1,
      totalDays: selectedLibrary.duration,
      daysRemaining: selectedLibrary.duration - 1,
      todayTask: `Start your first day — ${selectedLibrary.description.slice(0, 60)}...`,
      progress: 0,
      reward: selectedLibrary.reward,
      track: selectedLibrary.track,
      weekLabel: "Week 1 · Start",
      accentFrom: "#db2777",
      accentTo: "#ea580c",
      deadline: "Tonight 11:59 PM",
      deadlineUrgent: false,
    }
    setActiveChallenges((prev) => [...prev, newChallenge])
    setLockInStep("success")
    setTimeout(() => {
      setShowLockIn(false)
      setSelectedId(null)
      setLockInStep("invite")
      setSupporters([])
    }, 2200)
  }

  const handleCloseLockIn = () => {
    setShowLockIn(false)
    setLockInStep("invite")
    setSupporters([])
    setSupporterEmail("")
    setEmailError("")
  }

  const handleConfirmQuit = () => {
    if (showQuitFor === null) return
    const quitting = activeChallenges.find((c) => c.id === showQuitFor)
    if (quitting) {
      setActiveChallenges((prev) => prev.filter((c) => c.id !== showQuitFor))
      setHistory((prev) => [
        {
          id: Date.now(),
          name: quitting.name,
          difficulty: quitting.difficulty,
          duration: quitting.totalDays,
          status: "failed",
          completedDate: new Date().toISOString().slice(0, 10),
          eliteScoreImpact: "-60",
          streakBonus: "0",
        },
        ...prev,
      ])
    }
    setShowQuitFor(null)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-10 pt-2 sm:px-6">

      {/* Hero banner */}
      <section
        className="relative overflow-hidden rounded-2xl px-6 py-8 sm:px-10"
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

          {/* Today's tasks */}
          <section className={`${CARD_BASE} p-6`} aria-labelledby="tasks-heading">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Today · Daily tasks</p>
            <h2 id="tasks-heading" className="mt-0.5 text-lg font-bold text-slate-800">
              {activeChallenges.length > 0
                ? `${activeChallenges.length} task${activeChallenges.length > 1 ? "s" : ""} due today`
                : "No tasks today"}
            </h2>

            {activeChallenges.length > 0 ? (
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
                      <button
                        type="button"
                        onClick={() => setShowProofFor(c.id)}
                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
                        style={{ background: APP_GRADIENT }}
                        aria-label={`Submit proof for ${c.name}`}
                      >
                        <Upload className="h-3.5 w-3.5" aria-hidden /> Submit Proof
                      </button>
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

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setShowProofFor(challenge.id)}
                          className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
                          style={{ background: APP_GRADIENT }}
                          aria-label={`Submit proof for ${challenge.name}`}
                        >
                          <Upload className="h-3.5 w-3.5" aria-hidden /> Submit Proof
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowQuitFor(challenge.id)}
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
                  className={`relative flex h-24 items-center justify-center bg-gradient-to-br ${challenge.gradientClass}`}
                >
                  <Lock className="h-7 w-7 text-white/50" aria-hidden />
                  <span className="absolute bottom-2 left-2 rounded-lg bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {challenge.track}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 transition-colors group-hover:text-pink-600">
                    {challenge.name}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" aria-hidden /> {challenge.duration}d
                    </span>
                    <span className="flex items-center gap-1">
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

                  <button
                    type="button"
                    onClick={() => setSelectedId(challenge.id)}
                    disabled={!canJoin}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ background: APP_GRADIENT }}
                    aria-label={`View details for ${challenge.name}`}
                  >
                    View Details <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  </button>

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
                      <p className={`text-sm font-bold ${isDone ? "text-emerald-600" : "text-red-500"}`}>
                        {item.eliteScoreImpact} pts
                      </p>
                      {item.streakBonus !== "0" && (
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

      {/* ── Challenge Detail Modal: from top to above nav on mobile, CTA text always visible ── */}
      {selectedId && !showLockIn && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/40 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-[env(safe-area-inset-bottom)]"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="flex h-full min-h-0 w-full flex-col rounded-none border-0 border-t border-slate-200/80 bg-white shadow-xl sm:h-auto sm:max-h-[85vh] sm:min-h-0 sm:w-full sm:max-w-xl sm:rounded-2xl sm:border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header — fixed height */}
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200/80 bg-white px-4 py-3 sm:px-6 sm:py-4">
              <div className="min-w-0 flex-1">
                <span className="inline-block rounded-lg bg-pink-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pink-600">
                  {selectedLibrary?.track}
                </span>
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

            {/* Scrollable body — flex-1 min-h-0 so it fills and scrolls */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6 sm:py-4">
              <div className="space-y-4 sm:space-y-5">
                <section className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal">Description</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {selectedLibrary?.description} This challenge will push you to develop consistency and discipline while building skills that matter.
                  </p>
                </section>

                <section className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal">Daily requirement</h3>
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-sm sm:rounded-2xl sm:p-4">
                    <p className="text-sm leading-relaxed text-slate-700">{selectedLibrary?.description}</p>
                  </div>
                </section>

                <section className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal">Proof required</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Screenshot, photo, or link. Submissions are timestamped and immutable.
                  </p>
                </section>

                <section className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal">Failure conditions</h3>
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
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal">Details</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Difficulty", value: `${selectedLibrary?.difficulty}/5` },
                      { label: "Duration", value: `${selectedLibrary?.duration} days` },
                      { label: "Reward", value: `+${selectedLibrary?.reward} pts`, accent: true },
                      { label: "Completion", value: `${selectedLibrary?.completionRate}%` },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 shadow-sm sm:rounded-2xl sm:p-3">
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

            {/* Sticky footer — ends above bottom nav on mobile; button text forced visible */}
            <div className="shrink-0 border-t border-slate-200/80 bg-white px-4 py-3 sm:px-6 sm:py-4">
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
            </div>
          </div>
        </div>
      )}

      {/* ── Lock-In Modal: from top to above nav on mobile, button text visible ── */}
      {showLockIn && selectedId && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/50 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-[env(safe-area-inset-bottom)]"
          onClick={handleCloseLockIn}
        >
          <div
            className={`flex h-full min-h-0 w-full flex-col overflow-hidden rounded-none border-0 border-t border-slate-200/80 bg-white shadow-xl sm:mx-auto sm:h-auto sm:max-h-[85vh] sm:min-h-0 sm:w-full sm:max-w-lg sm:rounded-2xl sm:border ${lockInStep === "success" ? "sm:max-h-[90vh]" : ""}`}
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

            {/* Step 1: Add spectators — scrollable body + sticky footer */}
            {lockInStep === "invite" && (
              <>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  <div className="flex shrink-0 items-start justify-between gap-3 px-4 pt-3 pb-2 sm:px-6 sm:pt-4">
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

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-2 sm:px-6">
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

                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">Or invite via</span>
                        <button
                          type="button"
                          onClick={handleShareViaWhatsApp}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-3 py-2 text-xs font-semibold text-[#128C7E] hover:bg-[#25D366]/20 active:scale-[0.98] touch-manipulation"
                          aria-label="Share invite link via WhatsApp"
                        >
                          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          WhatsApp
                        </button>
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
                                {s.viaLink ? (
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366]/20 text-[#128C7E]" aria-hidden>
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: APP_GRADIENT }} aria-hidden>
                                    {s.email.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <p className="truncate text-xs font-medium text-slate-800 sm:text-sm">{s.email}</p>
                              </div>
                              <button type="button" onClick={() => handleRemoveSupporter(s.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 touch-manipulation" aria-label={`Remove ${s.email}`}>
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-200/80 bg-slate-50/50 py-5 text-center sm:rounded-2xl sm:py-6">
                          <Users className="mx-auto h-8 w-8 text-slate-300" aria-hidden />
                          <p className="mt-2 text-xs font-medium text-slate-600 sm:text-sm">No spectators yet</p>
                          <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">Add at least one to continue</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 border-t border-slate-200/80 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
                  <div className="flex gap-2 sm:gap-3">
                    <button type="button" onClick={handleCloseLockIn} className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 min-h-[48px] touch-manipulation">Cancel</button>
                    <button type="button" onClick={handleSendInvites} disabled={supporters.length === 0} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-transform active:scale-[0.98] disabled:opacity-50 min-h-[48px] touch-manipulation text-white [-webkit-text-fill-color:white] [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]" style={{ background: APP_GRADIENT, color: "white" }}>
                      <Send className="h-4 w-4 shrink-0" aria-hidden /> Continue
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Confirm — scrollable body + sticky footer */}
            {lockInStep === "confirm" && (
              <>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  <div className="flex shrink-0 items-start justify-between gap-3 px-4 pt-3 pb-2 sm:px-6 sm:pt-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Step 2 of 2</p>
                      <h2 className="mt-0.5 text-lg font-bold text-slate-800 sm:text-xl">Final confirmation</h2>
                      <p className="mt-1 text-xs text-slate-600 sm:text-sm">This is a serious commitment.</p>
                    </div>
                    <button type="button" onClick={handleCloseLockIn} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 active:bg-slate-100 min-h-[44px] min-w-[44px] touch-manipulation" aria-label="Close">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-2 sm:px-6">
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
                  <div className="flex gap-2 sm:gap-3">
                    <button type="button" onClick={() => setLockInStep("invite")} className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 min-h-[48px] touch-manipulation">Back</button>
                    <button type="button" onClick={handleConfirmLockIn} className="flex flex-1 items-center justify-center rounded-xl py-3 text-sm font-bold transition-transform active:scale-[0.98] min-h-[48px] touch-manipulation text-white [-webkit-text-fill-color:white] [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]" style={{ background: APP_GRADIENT, color: "white" }}>I&apos;m committed — Lock In</button>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Success — full viewport on mobile, centered */}
            {lockInStep === "success" && (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-8 text-center sm:py-10">
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
          className="fixed inset-0 z-50 flex items-end bg-black/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setShowQuitFor(null)}
        >
          <div
            className="w-full rounded-2xl bg-white p-6 shadow-xl sm:mx-auto sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100" aria-hidden>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Quit Challenge?</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  Quitting results in a{" "}
                  <strong className="text-red-600">−60 EliteScore penalty</strong> and marks this as failed. This
                  cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowQuitFor(null)}
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
      )}
    </div>
  )
}
