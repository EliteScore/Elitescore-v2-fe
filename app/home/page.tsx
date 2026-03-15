"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Clock, Flame, TrendingUp, Trophy, ArrowUpRight, CheckCircle2, Upload } from "lucide-react"

const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"
const CARD_BASE = "rounded-2xl border border-slate-200/80 bg-white shadow-sm"

const ACTIVE_CHALLENGES = [
  {
    id: "python-mastery",
    title: "30-Day Python Mastery",
    tag: "Harvard",
    accentFrom: "#db2777",
    accentTo: "#ea580c",
    difficulty: 4,
    progress: 40,
    daysLeft: 18,
    deadline: "Tonight 11:59 PM",
    deadlineUrgent: true,
    weekLabel: "Week 2 · Build",
    todayTask: "Complete 3 LeetCode medium problems using Python.",
  },
  {
    id: "linkedin-growth",
    title: "14-Day LinkedIn Growth",
    tag: "Career",
    accentFrom: "#2563eb",
    accentTo: "#7c3aed",
    difficulty: 2,
    progress: 50,
    daysLeft: 7,
    deadline: "Tomorrow 11:59 PM",
    deadlineUrgent: false,
    weekLabel: "Week 1 · Foundation",
    todayTask: "Post a career insight and engage with 5 posts in your industry.",
  },
]

const LEADERBOARD_TOP5 = [
  { rank: 1, name: "Jordan_Dev", score: 8322, avatar: "J" },
  { rank: 2, name: "AvaCodes", score: 8305, avatar: "A" },
  { rank: 3, name: "RyanW", score: 8247, avatar: "R", isMe: true },
  { rank: 4, name: "Maria_K", score: 8219, avatar: "M" },
  { rank: 5, name: "NoahBuilder", score: 8208, avatar: "N" },
]

const CHALLENGE_CATEGORIES = ["Top", "AI", "Tech", "Career"]

const RECOMMENDED = [
  {
    title: "7-Day SQL Bootcamp",
    category: "Tech",
    points: 75,
    members: "16.5k",
    gradientClass: "from-blue-500/90 to-indigo-500/90",
  },
  {
    title: "Prompt Engineering Sprint",
    category: "AI",
    points: 90,
    members: "11.2k",
    gradientClass: "from-violet-500/90 to-purple-500/90",
  },
  {
    title: "Portfolio Rebuild Challenge",
    category: "Career",
    points: 60,
    members: "8.3k",
    gradientClass: "from-pink-500/90 to-rose-500/90",
  },
  {
    title: "Google Data Analytics",
    category: "Tech",
    points: 80,
    members: "22k",
    gradientClass: "from-amber-500/90 to-orange-500/90",
  },
]

const LEADERBOARD_TABS = ["Global", "Friends", "Brintts"]

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" }

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

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Top")
  const [leaderboardTab, setLeaderboardTab] = useState("Global")

  const filteredRecommendations =
    activeCategory === "Top"
      ? RECOMMENDED
      : RECOMMENDED.filter((c) => c.category === activeCategory)

  const handleCategoryClick = (cat: string) => setActiveCategory(cat)
  const handleLeaderboardTabClick = (tab: string) => setLeaderboardTab(tab)

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-10 pt-2 sm:px-6">

      {/* ── Hero banner ── */}
      <section
        className="relative overflow-hidden rounded-2xl px-6 py-8 sm:px-10 sm:py-10"
        style={{ background: APP_GRADIENT }}
        aria-labelledby="hero-heading"
      >
        {/* Decorative blobs */}
        <span className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <span className="pointer-events-none absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-white/10 blur-2xl" aria-hidden />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Good morning</p>
            <h1
              id="hero-heading"
              className="mt-1 text-2xl font-extrabold leading-tight text-white sm:text-3xl"
            >
              Ryan Wong
            </h1>
            <p className="mt-1.5 text-sm text-white/80">
              You&apos;re ranked{" "}
              <strong className="font-bold text-white">#125 globally</strong> —
              keep climbing.
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

          {/* Score badge */}
          <div className="shrink-0 rounded-2xl border border-white/20 bg-white/10 px-6 py-5 text-center backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
              EliteScore
            </p>
            <p className="mt-0.5 text-4xl font-black text-white">8,247</p>
            <p className="mt-1 text-xs text-white/70">World Rank #148</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-white/80">
              <Flame className="h-3.5 w-3.5 text-orange-300" aria-hidden />
              <span>12-day streak</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats row ── */}
      <section aria-label="Key performance stats" className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        {/* EliteScore ring */}
        <article className={`${CARD_BASE} flex flex-col items-center gap-2 p-4 text-center`}>
          <div
            className="relative flex h-16 w-16 items-center justify-center"
            role="progressbar"
            aria-valuenow={72}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="72% toward next tier"
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
                strokeDasharray="72 100"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center">
              <strong className="text-sm font-bold text-slate-800">72%</strong>
            </span>
          </div>
          <div>
            <p className="text-base font-bold text-slate-800">8,247</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">EliteScore</p>
          </div>
        </article>

        {/* Global Rank */}
        <article className={`${CARD_BASE} flex flex-col items-center justify-center gap-1 p-4 text-center`}>
          <Trophy className="h-5 w-5 text-amber-500" aria-hidden />
          <p className="text-2xl font-bold text-slate-800">#125</p>
          <p className="text-xs font-semibold text-emerald-600">↑ +23 positions</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Global Rank</p>
        </article>

        {/* Score this week */}
        <article className={`${CARD_BASE} flex flex-col items-center gap-2 p-4 text-center`}>
          <TrendingUp className="h-5 w-5 text-pink-500" aria-hidden />
          <p className="text-2xl font-bold text-slate-800">+420</p>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={84}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="84% of weekly score goal"
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: "84%", background: APP_GRADIENT }}
            />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Score This Week
          </p>
        </article>

        {/* Day Streak */}
        <article className={`${CARD_BASE} flex flex-col items-center justify-center gap-1 p-4 text-center`}>
          <Flame className="h-6 w-6 text-orange-500" aria-hidden />
          <p className="text-2xl font-bold text-slate-800">12</p>
          <p className="text-xs text-slate-500">consecutive days</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Day Streak</p>
        </article>
      </section>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

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
              {ACTIVE_CHALLENGES.map((challenge) => (
                <article
                  key={challenge.id}
                  className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Gradient accent top strip */}
                  <div
                    className="h-1.5 w-full"
                    style={{
                      background: `linear-gradient(to right, ${challenge.accentFrom}, ${challenge.accentTo})`,
                    }}
                    aria-hidden
                  />

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-snug text-slate-800">
                        {challenge.title}
                      </h3>
                      <span className="shrink-0 rounded-lg bg-pink-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pink-600">
                        Active
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      {challenge.weekLabel}
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

                    {/* Deadline */}
                    <p
                      className={`mt-2 flex items-center gap-1.5 text-xs ${
                        challenge.deadlineUrgent
                          ? "font-semibold text-orange-600"
                          : "text-slate-500"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      Deadline: {challenge.deadline}
                    </p>

                    {/* Today's task */}
                    <div className="mt-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-pink-600">
                        Today&apos;s task
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-700">
                        {challenge.todayTask}
                      </p>
                    </div>

                    {/* Actions */}
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
                        href={`/challenges/${challenge.id}`}
                        className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                        aria-label={`View details for ${challenge.title}`}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
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

            {/* Cards — styled like landing challenge cards */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {filteredRecommendations.map((item) => (
                <article
                  key={item.title}
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
                      {item.points} pts · {item.members} members
                    </p>
                    <Link
                      href="/challenges"
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
                  Leaderboard
                </h2>
              </div>
              <Link
                href="/leaderboard"
                className="flex items-center gap-1 text-xs font-semibold text-pink-600 hover:underline"
              >
                Full board <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            {/* Tabs */}
            <div className="mt-3 flex gap-1.5">
              {LEADERBOARD_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleLeaderboardTabClick(tab)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                    leaderboardTab === tab
                      ? "text-white"
                      : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                  style={leaderboardTab === tab ? { background: APP_GRADIENT } : undefined}
                  aria-pressed={leaderboardTab === tab}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Top 5 */}
            <ul className="mt-4 space-y-2">
              {LEADERBOARD_TOP5.map((user) => (
                <li
                  key={user.rank}
                  className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors ${
                    user.isMe
                      ? "border border-pink-200/60 bg-pink-50/70"
                      : "hover:bg-slate-50/70"
                  }`}
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={
                      user.rank <= 3
                        ? { background: APP_GRADIENT, color: "white" }
                        : { background: "#e2e8f0", color: "#64748b" }
                    }
                    aria-hidden
                  >
                    {user.rank <= 3 ? user.rank : user.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-semibold ${
                        user.isMe ? "text-pink-700" : "text-slate-800"
                      }`}
                    >
                      {user.name}
                      {user.isMe && (
                        <span className="ml-1.5 rounded bg-pink-100 px-1 text-[10px] font-bold text-pink-600">
                          you
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user.score.toLocaleString()} pts
                    </p>
                  </div>
                  {MEDAL[user.rank] && (
                    <span className="text-base" aria-label={`Rank ${user.rank}`}>
                      {MEDAL[user.rank]}
                    </span>
                  )}
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
                { label: "Consistency rate", value: "94%" },
                { label: "Challenges completed", value: "7" },
                { label: "Active days this week", value: "6 / 7" },
                { label: "Score movement", value: "↑ Top 15%" },
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
              12-Day Streak!
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
  )
}
