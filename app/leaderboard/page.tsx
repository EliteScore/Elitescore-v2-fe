"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronDown, X } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"
const CARD_BASE = "rounded-2xl border border-slate-200/80 bg-white shadow-sm"

type LeaderboardUser = {
  id: string
  rank: number
  name: string
  score: number
  streak?: number
  isCurrentUser?: boolean
  avatarUrl?: string | null
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0]?.slice(0, 2) ?? "?").toUpperCase()
}

// Mock data matching reference: Thomas Vu 92, Man Nhi 88, Hao Anh 81, then list, KingRom #123
const WEEK_OPTIONS = [
  { label: "Week 1 (23–29/4)", value: "w1" },
  { label: "Week 2 (30/4–6/5)", value: "w2" },
  { label: "Week 3 (7–13/5)", value: "w3" },
]

const LEADERBOARD_RAW: Omit<LeaderboardUser, "rank">[] = [
  { id: "1", name: "Thomas Vu", score: 92, isCurrentUser: false },
  { id: "2", name: "Man Nhi", score: 88, isCurrentUser: false },
  { id: "3", name: "Hao Anh", score: 81, isCurrentUser: false },
  { id: "4", name: "Xuan Vinh Quyen", score: 76, isCurrentUser: false },
  { id: "5", name: "Mai Linh", score: 74, isCurrentUser: false },
  { id: "6", name: "Duc Anh", score: 70, isCurrentUser: false },
  { id: "7", name: "Thu Huong", score: 68, isCurrentUser: false },
  { id: "8", name: "Quang Minh", score: 65, isCurrentUser: false },
  { id: "9", name: "Ngoc Anh", score: 62, isCurrentUser: false },
  { id: "10", name: "Hoang Nam", score: 58, isCurrentUser: false },
  { id: "current", name: "KingRom", score: 12, isCurrentUser: true },
]

function Avatar({ name, avatarUrl, size = "md", className }: { name: string; avatarUrl?: string | null; size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-16 w-16 sm:h-20 sm:w-20 text-xl sm:text-2xl" }
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-200 font-bold text-slate-600 shadow-sm", sizeClasses[size], className)}
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

export default function LeaderboardPage() {
  const [selectedWeek, setSelectedWeek] = useState(WEEK_OPTIONS[0].value)
  const [showWeekDropdown, setShowWeekDropdown] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<LeaderboardUser | null>(null)

  const leaderboard = useMemo(() => {
    const list = [...LEADERBOARD_RAW]
    const current = list.find((u) => u.isCurrentUser)
    const others = list.filter((u) => !u.isCurrentUser).sort((a, b) => b.score - a.score)
    const withRanks: LeaderboardUser[] = others.map((u, i) => ({ ...u, rank: i + 1 }))
    if (current) withRanks.push({ ...current, rank: 123 })
    return withRanks.sort((a, b) => (a.isCurrentUser ? 1 : b.isCurrentUser ? -1 : a.rank - b.rank))
  }, [])

  const topThree = useMemo(() => leaderboard.filter((u) => u.rank <= 3), [leaderboard])
  const listFrom4To10 = useMemo(() => leaderboard.filter((u) => u.rank >= 4 && u.rank <= 10), [leaderboard])
  const currentUser = useMemo(() => leaderboard.find((u) => u.isCurrentUser), [leaderboard])

  const currentWeekLabel = WEEK_OPTIONS.find((w) => w.value === selectedWeek)?.label ?? WEEK_OPTIONS[0].label

  const handleWeekSelect = (value: string) => {
    setSelectedWeek(value)
    setShowWeekDropdown(false)
  }

  const handleToggleWeekDropdown = () => setShowWeekDropdown((prev) => !prev)

  const handleCloseProfile = () => setSelectedProfile(null)

  return (
    <div className="min-h-[100dvh] bg-[#f5f5f6] font-sans text-slate-800 antialiased pt-[max(1rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(5rem,calc(4rem+env(safe-area-inset-bottom)))]">
      <div className="mx-auto max-w-lg px-4 pt-4 pb-6">
        {/* Hero strip — matches home/challenges */}
        <section className="relative overflow-hidden rounded-2xl px-4 py-5 sm:px-6 sm:py-6 mb-4" style={{ background: APP_GRADIENT }} aria-labelledby="leaderboard-heading">
          <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <h1 id="leaderboard-heading" className="relative text-xl font-extrabold leading-tight text-white sm:text-2xl">Leaderboard</h1>
          <p className="relative mt-0.5 text-sm text-white/85">Your standing this week.</p>
        </section>

        {/* Week selector + Last updated — CARD_BASE style */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleToggleWeekDropdown}
            className={cn("flex w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-left shadow-sm", showWeekDropdown && "rounded-b-none border-b-0")}
            aria-expanded={showWeekDropdown}
            aria-haspopup="listbox"
            aria-label="Select week"
          >
            <span className="text-sm font-semibold text-pink-600">{currentWeekLabel}</span>
            <ChevronDown className={cn("h-4 w-4 text-pink-600 transition-transform", showWeekDropdown && "rotate-180")} aria-hidden />
          </button>
          {showWeekDropdown && (
            <div className="rounded-b-2xl border border-t-0 border-slate-200/80 bg-white py-1 shadow-sm" role="listbox" aria-label="Week options">
              {WEEK_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={selectedWeek === opt.value}
                  onClick={() => handleWeekSelect(opt.value)}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm font-medium transition-colors",
                    selectedWeek === opt.value ? "bg-pink-50 text-pink-600" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-slate-500">Last updated 9pm 23/4</p>
        </div>

        {/* Podium — #2 left, #1 center, #3 right; tap to view profile */}
        <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3 items-end">
          {topThree[1] && (
            <button
              type="button"
              onClick={() => setSelectedProfile(topThree[1]!)}
              className="flex flex-col items-center order-1 rounded-2xl transition-transform active:scale-[0.98] touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50"
              aria-label={`View ${topThree[1].name}, rank 2`}
            >
              <div className="relative mb-2">
                <Avatar name={topThree[1].name} avatarUrl={topThree[1].avatarUrl} size="lg" className="border-2 border-white shadow-md bg-slate-100 text-slate-700" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-white">#2</span>
              </div>
              <div className="w-full rounded-t-xl px-2 py-3 text-center shadow-sm text-white" style={{ background: APP_GRADIENT }}>
                <p className="truncate text-sm font-bold drop-shadow-sm">{topThree[1].name}</p>
                <p className="text-lg font-black text-white/95">{topThree[1].score}</p>
              </div>
            </button>
          )}
          {topThree[0] && (
            <button
              type="button"
              onClick={() => setSelectedProfile(topThree[0]!)}
              className="flex flex-col items-center order-2 rounded-2xl transition-transform active:scale-[0.98] touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50"
              aria-label={`View ${topThree[0].name}, rank 1`}
            >
              <div className="relative mb-2">
                <Avatar name={topThree[0].name} avatarUrl={topThree[0].avatarUrl} size="lg" className="border-2 border-white shadow-md bg-amber-100 text-amber-800" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-white">#1</span>
              </div>
              <div className="w-full rounded-t-xl px-2 py-4 text-center shadow-md text-white" style={{ background: APP_GRADIENT }}>
                <p className="truncate text-sm font-bold drop-shadow-sm">{topThree[0].name}</p>
                <p className="text-xl font-black text-white/95">{topThree[0].score}</p>
              </div>
            </button>
          )}
          {topThree[2] && (
            <button
              type="button"
              onClick={() => setSelectedProfile(topThree[2]!)}
              className="flex flex-col items-center order-3 rounded-2xl transition-transform active:scale-[0.98] touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50"
              aria-label={`View ${topThree[2].name}, rank 3`}
            >
              <div className="relative mb-2">
                <Avatar name={topThree[2].name} avatarUrl={topThree[2].avatarUrl} size="lg" className="border-2 border-white shadow-md bg-slate-100 text-slate-700" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-white">#3</span>
              </div>
              <div className="w-full rounded-t-xl px-2 py-3 text-center shadow-sm text-white" style={{ background: APP_GRADIENT }}>
                <p className="truncate text-sm font-bold drop-shadow-sm">{topThree[2].name}</p>
                <p className="text-lg font-black text-white/95">{topThree[2].score}</p>
              </div>
            </button>
          )}
        </div>

        {/* White card: list #4–#10, ellipsis, current user, View more — CARD_BASE */}
        <div className={cn(CARD_BASE, "p-4")}>
          <div className="space-y-1">
            {listFrom4To10.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => setSelectedProfile(user)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 min-h-[48px] text-left transition-colors hover:bg-slate-50 active:bg-slate-100 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/30"
                aria-label={`View ${user.name}, rank ${user.rank}`}
              >
                <span className="w-8 shrink-0 text-left text-xs font-bold text-slate-600">#{user.rank}</span>
                <Avatar name={user.name} avatarUrl={user.avatarUrl} size="sm" className="h-8 w-8 text-xs" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">{user.name}</span>
                <span className="shrink-0 text-sm font-bold text-pink-600">{user.score}</span>
              </button>
            ))}
            <div className="py-2 text-center">
              <span className="text-slate-400">· · ·</span>
            </div>
            {currentUser && (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200/80 px-3 py-2.5 min-h-[48px]">
                <span className="w-8 shrink-0 rounded bg-emerald-200/80 px-1.5 py-0.5 text-left text-xs font-bold text-emerald-800">#{currentUser.rank}</span>
                <Avatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size="sm" className="h-8 w-8 text-xs border-emerald-200 bg-emerald-100 text-emerald-800" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">{currentUser.name}</span>
                <span className="shrink-0 text-sm font-bold text-pink-600">{currentUser.score}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200/80 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/30"
            aria-label="View more leaderboard entries"
          >
            View more
          </button>
        </div>
      </div>

      {/* Profile modal — matches app card style */}
      {selectedProfile && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-4"
          onClick={handleCloseProfile}
          role="dialog"
          aria-modal="true"
          aria-label="Profile details"
        >
          <div
            className={cn(CARD_BASE, "w-full max-w-sm p-6 shadow-xl")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800" id="profile-modal-title">{selectedProfile.name}</h3>
              <button
                type="button"
                onClick={handleCloseProfile}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/30"
                aria-label="Close profile"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Avatar name={selectedProfile.name} avatarUrl={selectedProfile.avatarUrl} size="lg" />
              <p className="text-2xl font-black text-pink-600">{selectedProfile.score}</p>
              <p className="text-xs text-slate-500">Rank #{selectedProfile.rank}</p>
              <Link
                href={`/profile/${selectedProfile.id}`}
                className="w-full rounded-xl py-2.5 text-center text-sm font-bold text-white"
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
