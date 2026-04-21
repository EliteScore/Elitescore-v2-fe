"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { Flame, TrendingUp, X, Trophy } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"
import { ELITESCORE_SUPPORT_EMAIL, ELITESCORE_SUPPORT_MAILTO } from "@/lib/supportContact"
import "../landing/landing-animations.css"

const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"
const CARD_BASE = "rounded-2xl border border-slate-200/80 bg-white shadow-sm"
const LEADERBOARD_PAGE_SIZE = 100

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

type LeaderboardApiEntry = {
  userId: string | number
  handle?: string | null
  displayName?: string | null
  avatarUrl?: string | null
  eliteScore: number
  streakCurrent?: number | null
  rank?: number | null
}

type LeaderboardApiResponse = {
  entries?: LeaderboardApiEntry[]
  page?: number
  size?: number
  totalUsers?: number
  totalPages?: number
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0]?.slice(0, 2) ?? "?").toUpperCase()
}

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
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [heroReady, setHeroReady] = useState(false)
  const listRef = useInView()

  useEffect(() => {
    const t = requestAnimationFrame(() => setTimeout(() => setHeroReady(true), 80))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadLeaderboard() {
      setIsLoading(true)
      setLoadError(null)

      const token = localStorage.getItem("elitescore_access_token")
      if (!token) {
        if (!cancelled) {
          setLoadError("Login required to view leaderboard.")
          setLeaderboard([])
          setIsLoading(false)
        }
        return
      }

      const userId = localStorage.getItem("elitescore_user_id")
      try {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
        if (userId) {
          headers["X-User-Id"] = userId
        }

        const allEntries: LeaderboardApiEntry[] = []
        let page = 0
        let totalPages = 1

        while (page < totalPages) {
          const requestUrl = `/api/leaderboard?page=${page}&size=${LEADERBOARD_PAGE_SIZE}`
          if (process.env.NODE_ENV === "development") {
            console.debug("[leaderboard] request", {
              url: requestUrl,
              method: "GET",
              headers: {
                Authorization: "Bearer [redacted]",
                "Content-Type": headers["Content-Type"],
                "X-User-Id": headers["X-User-Id"] ?? null,
              },
            })
          }

          const res = await fetch(requestUrl, { method: "GET", headers })
          const body: LeaderboardApiResponse = await res.json().catch(() => ({}))
          if (process.env.NODE_ENV === "development") {
            console.debug("[leaderboard] response", {
              url: requestUrl,
              ok: res.ok,
              status: res.status,
              page,
              totalPagesFromApi:
                typeof body.totalPages === "number" && Number.isFinite(body.totalPages)
                  ? body.totalPages
                  : null,
              entriesCount: Array.isArray(body.entries) ? body.entries.length : 0,
              bodyPreview: body,
            })
          }

          if (!res.ok) {
            const message = typeof (body as { message?: unknown })?.message === "string"
              ? (body as { message: string }).message
              : "Could not load leaderboard."
            if (!cancelled) {
              setLoadError(message)
              setLeaderboard([])
            }
            return
          }

          const entries = Array.isArray(body.entries) ? body.entries : []
          allEntries.push(...entries)

          const parsedTotalPages =
            typeof body.totalPages === "number" && Number.isFinite(body.totalPages) && body.totalPages > 0
              ? body.totalPages
              : page + 1
          totalPages = parsedTotalPages
          page += 1

          // Safety guard in case upstream totalPages is malformed.
          if (page > 200) break
        }

        const uniqueEntries = new Map<string, LeaderboardApiEntry>()
        allEntries.forEach((entry) => {
          uniqueEntries.set(String(entry.userId), entry)
        })

        const mapped = Array.from(uniqueEntries.values())
          .map((entry, index): LeaderboardUser => {
            const rank =
              typeof entry.rank === "number" && Number.isFinite(entry.rank) && entry.rank > 0
                ? entry.rank
                : index + 1
            const id = String(entry.userId)
            const name = entry.displayName?.trim() || entry.handle?.trim() || `User #${rank}`
            return {
              id,
              rank,
              name,
              score: entry.eliteScore ?? 0,
              streak: entry.streakCurrent ?? 0,
              avatarUrl: entry.avatarUrl ?? null,
              isCurrentUser: userId != null && id === userId,
            }
          })
          .sort((a, b) => a.rank - b.rank)

        if (!cancelled) {
          if (process.env.NODE_ENV === "development") {
            console.debug("[leaderboard] mapped result", {
              uniqueUsers: mapped.length,
              meFound: mapped.some((entry) => entry.isCurrentUser),
              topRanks: mapped.slice(0, 5).map((entry) => ({
                rank: entry.rank,
                id: entry.id,
                name: entry.name,
                score: entry.score,
              })),
            })
          }
          setLeaderboard(mapped)
        }
      } catch (error) {
        if (!cancelled) {
          console.error("[leaderboard] load error", error)
          setLoadError("Could not load leaderboard.")
          setLeaderboard([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadLeaderboard()
    return () => {
      cancelled = true
    }
  }, [])

  const fullList = useMemo(() => leaderboard, [leaderboard])
  const me = useMemo(() => leaderboard.find((u) => u.isCurrentUser), [leaderboard])

  return (
    <div className="min-h-[100dvh] w-full bg-[#f5f5f6] font-sans text-slate-800 antialiased pb-[max(5rem,calc(4rem+env(safe-area-inset-bottom)))]">
      <div className="w-full space-y-5 max-md:-mx-4 max-md:w-[calc(100%+2rem)] max-md:px-0 pt-4 pb-6 md:mx-auto md:max-w-5xl md:px-6 lg:max-w-6xl">
        {/* Hero strip (edge-to-edge on small screens) */}
        <section
          className="landing-hero-gradient relative mb-5 overflow-hidden rounded-none px-4 py-5 max-md:pl-[max(1rem,env(safe-area-inset-left))] max-md:pr-[max(1rem,env(safe-area-inset-right))] sm:rounded-2xl sm:px-6 sm:py-6 md:px-6"
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

        <div className="max-md:space-y-5 max-md:px-3 max-md:pl-[max(0.75rem,env(safe-area-inset-left))] max-md:pr-[max(0.75rem,env(safe-area-inset-right))] md:contents">
        {isLoading && (
          <section className={`${CARD_BASE} mb-5 px-4 py-4`} aria-live="polite">
            <p className="text-sm text-slate-500">Loading leaderboard...</p>
          </section>
        )}

        {!isLoading && loadError && (
          <section className={`${CARD_BASE} mb-5 border-red-200 bg-red-50 px-4 py-4`} role="alert">
            <p className="text-sm text-red-700">{loadError}</p>
          </section>
        )}

        {!isLoading && !loadError && leaderboard.length === 0 && (
          <section className={`${CARD_BASE} mb-5 px-4 py-4`}>
            <p className="text-sm text-slate-500">No leaderboard entries available right now.</p>
          </section>
        )}

        {/* Full leaderboard list */}
        {fullList.length > 0 && <section
          ref={listRef[0] as React.RefObject<HTMLElement>}
          className={`${CARD_BASE} overflow-hidden`}
          aria-label="All leaderboard rankings"
        >
          {/* Header row */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-2.5">
            <span className="w-8 shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">Rank</span>
            <span className="flex-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Player</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">EliteScore</span>
          </div>

          <div className="divide-y divide-slate-100">
            {fullList.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => setSelectedProfile(user)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 min-h-[52px] text-left transition-colors active:bg-slate-100 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pink-500/30",
                  user.isCurrentUser
                    ? "bg-gradient-to-r from-pink-50/60 to-purple-50/40 hover:from-pink-50/80 hover:to-purple-50/50"
                    : "hover:bg-slate-50",
                )}
                aria-label={`${user.name}, rank ${user.rank}`}
              >
                <span
                  className={cn(
                    "w-8 shrink-0 text-sm font-black",
                    user.isCurrentUser ? "text-pink-600" : "text-slate-400",
                  )}
                >
                  #{user.rank}
                </span>
                <Avatar
                  name={user.name}
                  size="sm"
                  className={user.isCurrentUser ? "border-pink-200 bg-pink-50 text-pink-700" : undefined}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {user.name}
                    {user.isCurrentUser ? (
                      <span className="ml-1.5 rounded bg-pink-100 px-1 py-0.5 text-[10px] font-black text-pink-600">you</span>
                    ) : null}
                  </p>
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
        </section>}

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
