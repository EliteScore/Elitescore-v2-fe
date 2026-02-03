"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowDown, ArrowUp, Crown, Flame, Search, Target, Trophy, Users } from "lucide-react"

type LeaderboardUser = {
  id: string
  name: string
  score: number
  streak: number
  movement: number
  isActive: boolean
  isCurrentUser?: boolean
}

const usersSeed: LeaderboardUser[] = [
  { id: "u1", name: "Emma W.", score: 1247, streak: 45, movement: 0, isActive: true },
  { id: "u2", name: "James L.", score: 1189, streak: 38, movement: 2, isActive: true },
  { id: "u3", name: "Sofia R.", score: 1156, streak: 41, movement: -1, isActive: true },
  { id: "u4", name: "Lucas M.", score: 1098, streak: 29, movement: 1, isActive: true },
  { id: "u5", name: "Mia K.", score: 1067, streak: 35, movement: 0, isActive: true },
  { id: "u6", name: "Noah P.", score: 1034, streak: 27, movement: 3, isActive: true },
  { id: "u7", name: "Olivia S.", score: 1001, streak: 32, movement: -2, isActive: false },
  { id: "u8", name: "Ethan B.", score: 978, streak: 24, movement: 0, isActive: true },
  { id: "u9", name: "Ava C.", score: 945, streak: 30, movement: 1, isActive: true },
  { id: "u10", name: "Liam D.", score: 923, streak: 21, movement: -1, isActive: true },
  { id: "u18", name: "Sophie T.", score: 889, streak: 18, movement: 2, isActive: true },
  { id: "u19", name: "Ryan H.", score: 878, streak: 16, movement: 0, isActive: true },
  { id: "u20", name: "Emily G.", score: 867, streak: 19, movement: -1, isActive: true },
  { id: "u21", name: "Daniel F.", score: 856, streak: 14, movement: -3, isActive: false },
  { id: "u22", name: "Sarah K.", score: 851, streak: 15, movement: 1, isActive: true },
  { id: "current", name: "You", score: 847, streak: 12, movement: 3, isActive: true, isCurrentUser: true },
  { id: "u24", name: "Alex M.", score: 843, streak: 9, movement: -1, isActive: true },
  { id: "u25", name: "Grace N.", score: 839, streak: 13, movement: 0, isActive: true },
  { id: "u26", name: "Max V.", score: 834, streak: 11, movement: 2, isActive: true },
  { id: "u27", name: "Lily Q.", score: 829, streak: 10, movement: -2, isActive: false },
  { id: "u28", name: "Jack W.", score: 824, streak: 8, movement: 1, isActive: true },
]

function sortByScoreThenStreak(a: LeaderboardUser, b: LeaderboardUser) {
  if (b.score !== a.score) return b.score - a.score
  return b.streak - a.streak
}

function movementBadge(value: number) {
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700">
        <ArrowUp className="h-3 w-3" />
        {value}
      </span>
    )
  }
  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-700">
        <ArrowDown className="h-3 w-3" />
        {Math.abs(value)}
      </span>
    )
  }
  return <span className="text-xs text-muted-foreground">-</span>
}

export default function LeaderboardPage() {
  const [query, setQuery] = useState("")
  const [showOnlyActive, setShowOnlyActive] = useState(false)

  const ranked = useMemo(() => {
    const sorted = [...usersSeed].sort(sortByScoreThenStreak)
    return sorted.map((user, index) => ({ ...user, rank: index + 1 }))
  }, [])

  const currentUser = ranked.find((user) => user.isCurrentUser)
  const topThree = ranked.slice(0, 3)

  const neighborhood = useMemo(() => {
    const idx = ranked.findIndex((user) => user.isCurrentUser)
    if (idx < 0) return []
    return ranked.slice(Math.max(0, idx - 2), Math.min(ranked.length, idx + 3))
  }, [ranked])

  const tableRows = useMemo(() => {
    return ranked.filter((user) => {
      const matchesQuery = user.name.toLowerCase().includes(query.toLowerCase())
      const matchesActive = !showOnlyActive || user.isActive
      return matchesQuery && matchesActive
    })
  }, [query, ranked, showOnlyActive])

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="container mx-auto max-w-7xl px-4 py-6 md:py-8 space-y-6">
        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand/15 flex items-center justify-center" aria-hidden="true">
                <Trophy className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Global Leaderboard</p>
                <h1 className="text-2xl font-semibold text-foreground">Scoreboard by proof-backed progress</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-brand/15 text-foreground">
              {ranked.length.toLocaleString()} competitors
            </Badge>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Your rank</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">#{currentUser?.rank ?? "-"}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">EliteScore</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{currentUser?.score ?? "-"}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Current streak</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{currentUser?.streak ?? "-"}d</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Rank movement</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">
                {currentUser && currentUser.movement >= 0 ? "+" : ""}
                {currentUser?.movement ?? 0}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6">
            <h2 className="text-base font-semibold text-foreground mb-4">Top performers</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {topThree.map((user, index) => (
                <article key={user.id} className={`rounded-xl border p-4 ${index === 0 ? "border-brand/30 bg-brand/10" : "border-border/60 bg-card/60"}`}>
                  <div className="flex items-center justify-between">
                    <Badge variant={index === 0 ? "default" : "outline"}>
                      #{user.rank}
                    </Badge>
                    {index === 0 && <Crown className="h-4 w-4 text-foreground" />}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">{user.name}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Score <span className="font-semibold text-foreground">{user.score}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Streak <span className="font-semibold text-foreground">{user.streak}d</span>
                  </div>
                  <div className="mt-2">{movementBadge(user.movement)}</div>
                </article>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">Your neighborhood</h2>
            <div className="space-y-2">
              {neighborhood.map((user) => (
                <div key={user.id} className={`rounded-lg border p-3 flex items-center justify-between ${user.isCurrentUser ? "border-brand/30 bg-brand/10" : "border-border/60 bg-card/60"}`}>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      #{user.rank} • {user.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.score} pts • {user.streak} day streak
                    </div>
                  </div>
                  {movementBadge(user.movement)}
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full sm:w-auto" asChild>
              <Link href="/profile">
                <Target className="mr-1 h-4 w-4" />
                Improve your stats
              </Link>
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-semibold text-foreground">Full ranking table</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search players"
                  className="pl-8"
                />
              </div>
              <Button
                size="sm"
                variant={showOnlyActive ? "default" : "outline"}
                onClick={() => setShowOnlyActive((prev) => !prev)}
              >
                <Users className="mr-1 h-3.5 w-3.5" />
                Active only
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {tableRows.map((user) => (
              <article
                key={user.id}
                className={`rounded-lg border p-3 ${
                  user.isCurrentUser ? "border-brand/30 bg-brand/10" : "border-border/60 bg-card/60"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">
                      #{user.rank} • {user.name}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{user.score} pts</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {user.streak}d streak
                      </span>
                      <span>•</span>
                      <span>{user.isActive ? "Active" : "Away"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {movementBadge(user.movement)}
                    {!user.isCurrentUser && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/profile/${user.id}`}>Profile</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
