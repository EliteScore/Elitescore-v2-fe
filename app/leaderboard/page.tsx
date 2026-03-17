"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { Flame, TrendingUp, X, Trophy } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"
import "../landing/landing-animations.css"

const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"
const CARD_BASE = "rounded-2xl border border-slate-200/80 bg-white shadow-sm"

type LeaderboardUser = {
  id: string
  rank: number
  name: string
  score: number
  streak?: number
  movement?: number
  isCurrentUser?: boolean
  avatarUrl?: string | null
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0]?.slice(0, 2) ?? "?").toUpperCase()
}

const LEADERBOARD_RAW: Omit<LeaderboardUser, "rank">[] = [
  { id: "1",       name: "Jordan_Dev",      score: 8322, streak: 34, movement: 2  },
  { id: "2",       name: "AvaCodes",         score: 8305, streak: 21, movement: 1  },
  { id: "3",       name: "RyanW",            score: 8247, streak: 12, movement: -1 },
  { id: "4",       name: "Maria_K",          score: 8219, streak: 9,  movement: 3  },
  { id: "5",       name: "NoahBuilder",      score: 8208, streak: 7,  movement: 0  },
  { id: "6",       name: "XuanVinh",         score: 8174, streak: 15, movement: -2 },
  { id: "7",       name: "MaiLinh",          score: 8103, streak: 5,  movement: 1  },
  { id: "8",       name: "DucAnh",           score: 7990, streak: 22, movement: 0  },
  { id: "9",       name: "ThuHuong",         score: 7882, streak: 4,  movement: -1 },
  { id: "10",      name: "QuangMinh",        score: 7741, streak: 8,  movement: 2  },
  { id: "current", name: "KingRom", score: 1847, streak: 6,  movement: 23, isCurrentUser: true },
]

type UseInViewOptions = { rootMargin?: string; threshold?: number }
const useInView = (options: UseInViewOptions = {}): [React.RefObject<HTMLElement | null>, boolean] => {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const { rootMargin = "0px 0px -10% 0px", threshold = 0 } = options
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin, threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [rootMargin, threshold])
  return [ref, inView]
}

function Avatar({
  name, avatarUrl, size = "md", className,
}: { name: string; avatarUrl?: string | null; size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "h-9 w-9 text-xs", md: "h-10 w-10 text-sm", lg: "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] text-xl" }
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-100 font-bold text-slate-600 shadow-sm", sizes[size], className)}
      aria-hidden
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  )
}

const MEDAL_BG: Record<number, string> = {
  1: "bg-amber-400/20 text-amber-700 border-amber-300/60",
  2: "bg-slate-200/70 text-slate-600 border-slate-300/60",
  3: "bg-orange-300/20 text-orange-700 border-orange-300/60",
}
const MEDAL_EMOJI: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" }

export default function LeaderboardPage() {
  const [selectedProfile, setSelectedProfile] = useState<LeaderboardUser | null>(null)
  const [heroReady, setHeroReady] = useState(false)
  const podiumRef = useInView()
  const listRef = useInView()

  useEffect(() => {
    const t = requestAnimationFrame(() => setTimeout(() => setHeroReady(true), 80))
    return () => cancelAnimationFrame(t)
  }, [])

  const leaderboard = useMemo<LeaderboardUser[]>(() => {
    const others = LEADERBOARD_RAW.filter((u) => !u.isCurrentUser).sort((a, b) => b.score - a.score)
    const ranked: LeaderboardUser[] = others.map((u, i) => ({ ...u, rank: i + 1 }))
    const me = LEADERBOARD_RAW.find((u) => u.isCurrentUser)
    if (me) ranked.push({ ...me, rank: 125 })
    return ranked
  }, [])

  const top3 = useMemo(() => leaderboard.filter((u) => u.rank <= 3), [leaderboard])
  const list4to10 = useMemo(() => leaderboard.filter((u) => u.rank >= 4 && u.rank <= 10), [leaderboard])
  const me = useMemo(() => leaderboard.find((u) => u.isCurrentUser), [leaderboard])

  return (
    <div className="min-h-[100dvh] w-full bg-[#f5f5f6] font-sans text-slate-800 antialiased pb-[max(5rem,calc(4rem+env(safe-area-inset-bottom)))]">
      <div className="w-full px-3 pt-4 pb-6 sm:px-4 md:mx-auto md:max-w-lg">

        {/* Hero strip */}
        <section
          className="landing-hero-gradient relative mb-5 overflow-hidden rounded-2xl px-5 py-5 sm:px-6 sm:py-6"
          style={{ background: APP_GRADIENT, backgroundSize: "200% 200%" }}
          aria-labelledby="lb-heading"
        >
          <span className="landing-float landing-float-delay-1 pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <span className="landing-float landing-float-delay-2 pointer-events-none absolute bottom-0 left-1/4 h-24 w-24 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div
            className={`relative z-10 transition-all duration-500 ease-out ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "80ms" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Global</p>
                <h1 id="lb-heading" className="mt-0.5 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                  Leaderboard
                </h1>
                <p className="mt-1 text-sm text-white/80">Compete. Prove it. Climb.</p>
              </div>
              {me && (
                <div className="shrink-0 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-right backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Your rank</p>
                  <p className="text-2xl font-black text-white">#{me.rank}</p>
                  <p className="text-[11px] text-white/70">{me.score.toLocaleString()} pts</p>
                </div>
              )}
            </div>
            {me && (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm px-3 py-2.5">
                <Avatar name={me.name} size="sm" className="border-white/30 bg-white/20 text-white" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate">{me.name} <span className="rounded bg-white/20 px-1 text-[10px] font-bold">you</span></p>
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-300" aria-hidden />
                    {me.streak}-day streak
                  </p>
                </div>
                {(me.movement ?? 0) > 0 && (
                  <span className="flex items-center gap-0.5 rounded-lg bg-emerald-400/20 px-2 py-0.5 text-xs font-bold text-emerald-200">
                    <TrendingUp className="h-3 w-3" aria-hidden />
                    +{me.movement}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Podium #2 | #1 | #3 */}
        <section
          ref={podiumRef[0] as React.RefObject<HTMLElement>}
          className={`landing-scroll-in mb-5 ${podiumRef[1] ? "landing-scroll-in-visible" : ""}`}
          aria-label="Top 3 podium"
        >
          <div className="grid grid-cols-3 items-end gap-2">
            {/* #2 */}
            {top3[1] && (
              <button
                type="button"
                onClick={() => setSelectedProfile(top3[1]!)}
                className={`landing-fade-up flex flex-col items-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/40 active:scale-[0.97] touch-manipulation transition-transform ${podiumRef[1] ? "landing-fade-up-visible" : ""}`}
                style={{ transitionDelay: "80ms" }}
                aria-label={`${top3[1].name}, rank 2`}
              >
                <p className="mb-1 text-lg">{MEDAL_EMOJI[2]}</p>
                <div className="relative mb-3">
                  <Avatar name={top3[1].name} size="lg" className="border-2 border-white shadow-md" />
                  <span className={cn("absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full border px-2 py-0.5 text-[10px] font-black", MEDAL_BG[2])}>#2</span>
                </div>
                <div className="w-full rounded-t-xl bg-white border border-slate-200/80 border-b-0 px-2 pt-4 pb-2 text-center shadow-sm">
                  <p className="truncate text-xs font-bold text-slate-800">{top3[1].name}</p>
                  <p className="mt-0.5 text-base font-black text-pink-600">{top3[1].score.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">pts</p>
                </div>
              </button>
            )}

            {/* #1 — taller column */}
            {top3[0] && (
              <button
                type="button"
                onClick={() => setSelectedProfile(top3[0]!)}
                className={`landing-fade-up flex flex-col items-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/40 active:scale-[0.97] touch-manipulation transition-transform ${podiumRef[1] ? "landing-fade-up-visible" : ""}`}
                style={{ transitionDelay: "0ms" }}
                aria-label={`${top3[0].name}, rank 1`}
              >
                <p className="mb-1 text-2xl">{MEDAL_EMOJI[1]}</p>
                <div className="relative mb-3">
                  <Avatar name={top3[0].name} size="lg" className="border-[3px] border-amber-400 shadow-lg bg-amber-50 text-amber-800" />
                  <span className={cn("absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full border px-2 py-0.5 text-[10px] font-black", MEDAL_BG[1])}>#1</span>
                </div>
                <div
                  className="w-full rounded-t-xl px-2 pt-5 pb-3 text-center shadow-md text-white"
                  style={{ background: APP_GRADIENT }}
                >
                  <p className="truncate text-xs font-bold drop-shadow-sm">{top3[0].name}</p>
                  <p className="mt-0.5 text-xl font-black">{top3[0].score.toLocaleString()}</p>
                  <p className="text-[10px] text-white/80 font-semibold">EliteScore pts</p>
                </div>
              </button>
            )}

            {/* #3 */}
            {top3[2] && (
              <button
                type="button"
                onClick={() => setSelectedProfile(top3[2]!)}
                className={`landing-fade-up flex flex-col items-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/40 active:scale-[0.97] touch-manipulation transition-transform ${podiumRef[1] ? "landing-fade-up-visible" : ""}`}
                style={{ transitionDelay: "160ms" }}
                aria-label={`${top3[2].name}, rank 3`}
              >
                <p className="mb-1 text-lg">{MEDAL_EMOJI[3]}</p>
                <div className="relative mb-3">
                  <Avatar name={top3[2].name} size="lg" className="border-2 border-white shadow-md" />
                  <span className={cn("absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full border px-2 py-0.5 text-[10px] font-black", MEDAL_BG[3])}>#3</span>
                </div>
                <div className="w-full rounded-t-xl bg-white border border-slate-200/80 border-b-0 px-2 pt-4 pb-2 text-center shadow-sm">
                  <p className="truncate text-xs font-bold text-slate-800">{top3[2].name}</p>
                  <p className="mt-0.5 text-base font-black text-pink-600">{top3[2].score.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">pts</p>
                </div>
              </button>
            )}
          </div>
        </section>

        {/* List #4–#10 + ellipsis + current user */}
        <section
          ref={listRef[0] as React.RefObject<HTMLElement>}
          className={`landing-scroll-in ${CARD_BASE} overflow-hidden ${listRef[1] ? "landing-scroll-in-visible" : ""}`}
          aria-label="Rankings 4 to 10 and your position"
        >
          {/* Header row */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-2.5">
            <span className="w-8 shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">Rank</span>
            <span className="flex-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Player</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">EliteScore</span>
          </div>

          <div className="divide-y divide-slate-100">
            {list4to10.map((user, i) => (
              <button
                key={user.id}
                type="button"
                onClick={() => setSelectedProfile(user)}
                className={`landing-fade-up flex w-full items-center gap-3 px-4 py-3 min-h-[52px] text-left transition-colors hover:bg-slate-50 active:bg-slate-100 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pink-500/30 ${listRef[1] ? "landing-fade-up-visible" : ""}`}
                style={{ transitionDelay: `${i * 40}ms` }}
                aria-label={`${user.name}, rank ${user.rank}`}
              >
                <span className="w-8 shrink-0 text-sm font-black text-slate-400">#{user.rank}</span>
                <Avatar name={user.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
                  {user.streak && (
                    <p className="flex items-center gap-0.5 text-[10px] text-slate-400">
                      <Flame className="h-3 w-3 text-orange-400" aria-hidden />
                      {user.streak}d streak
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-800">{user.score.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">pts</p>
                </div>
                {(user.movement ?? 0) !== 0 && (
                  <span className={cn("ml-1 shrink-0 text-[10px] font-bold", (user.movement ?? 0) > 0 ? "text-emerald-600" : "text-red-400")}>
                    {(user.movement ?? 0) > 0 ? `▲${user.movement}` : `▼${Math.abs(user.movement ?? 0)}`}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Ellipsis */}
          <div className="flex items-center gap-3 border-t border-slate-100 px-4 py-2">
            <span className="w-8 shrink-0" />
            <span className="text-slate-300 text-sm tracking-widest">· · · · ·</span>
          </div>

          {/* Current user row — highlighted */}
          {me && (
            <div className="border-t border-slate-100 bg-gradient-to-r from-pink-50/60 to-purple-50/40">
              <div className="flex items-center gap-3 px-4 py-3 min-h-[52px]">
                <span className="w-8 shrink-0 text-sm font-black" style={{ backgroundImage: APP_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  #{me.rank}
                </span>
                <Avatar name={me.name} size="sm" className="border-pink-200 bg-pink-50 text-pink-700" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-bold text-slate-800">
                    {me.name}
                    <span className="rounded bg-pink-100 px-1 py-0.5 text-[10px] font-black text-pink-600">you</span>
                  </p>
                  {me.streak && (
                    <p className="flex items-center gap-0.5 text-[10px] text-slate-400">
                      <Flame className="h-3 w-3 text-orange-400" aria-hidden />
                      {me.streak}d streak
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-800">{me.score.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">pts</p>
                </div>
                {(me.movement ?? 0) > 0 && (
                  <span className="ml-1 shrink-0 text-[10px] font-bold text-emerald-600">▲{me.movement}</span>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Profile modal */}
      {selectedProfile && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-4"
          onClick={() => setSelectedProfile(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
        >
          <div
            className={cn(CARD_BASE, "w-full max-w-sm overflow-hidden shadow-2xl")}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient header strip */}
            <div className="relative flex items-center justify-between px-5 py-4" style={{ background: APP_GRADIENT }}>
              <div className="flex items-center gap-3">
                <Avatar name={selectedProfile.name} size="md" className="border-white/40 bg-white/20 text-white" />
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{selectedProfile.name}</p>
                  <p className="text-[11px] text-white/75">Rank #{selectedProfile.rank}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white hover:bg-white/25 focus:outline-none"
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="flex flex-col items-center rounded-xl bg-slate-50 p-3">
                  <Trophy className="h-4 w-4 text-pink-500 mb-1" aria-hidden />
                  <p className="text-base font-black text-slate-800">{selectedProfile.score.toLocaleString()}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">EliteScore</p>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-slate-50 p-3">
                  <span className="text-lg mb-0.5">{MEDAL_EMOJI[selectedProfile.rank] ?? "🎯"}</span>
                  <p className="text-base font-black text-slate-800">#{selectedProfile.rank}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">Global</p>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-slate-50 p-3">
                  <Flame className="h-4 w-4 text-orange-400 mb-1" aria-hidden />
                  <p className="text-base font-black text-slate-800">{selectedProfile.streak ?? 0}d</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">Streak</p>
                </div>
              </div>
              <Link
                href={`/profile/${selectedProfile.id}`}
                className="flex w-full items-center justify-center rounded-xl py-3 text-sm font-bold text-white"
                style={{ background: APP_GRADIENT }}
              >
                View full profile
              </Link>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
