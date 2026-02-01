"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  ArrowUp,
  ArrowDown,
  Crown,
  Medal,
  Flame,
  TrendingUp,
  Trophy,
  Target,
  Check,
} from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

type LeaderboardUser = {
  id: string
  rank: number
  name: string
  score: number
  streak: number
  isActive: boolean
  movement: number
  isCurrentUser?: boolean
  avatarUrl?: string | null
}

const getInitials = (name: string): string => {
  if (name === "You") return "Y"
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0]?.slice(0, 2) ?? "?").toUpperCase()
}

const currentUser: LeaderboardUser = {
  id: "current",
  rank: 23,
  name: "You",
  score: 847,
  streak: 12,
  isActive: true,
  movement: 3,
  isCurrentUser: true,
}

const globalLeaderboardRaw: Omit<LeaderboardUser, "rank">[] = [
  { id: "1", name: "Emma W.", score: 1247, streak: 45, isActive: true, movement: 0 },
  { id: "2", name: "James L.", score: 1189, streak: 38, isActive: true, movement: 2 },
  { id: "3", name: "Sofia R.", score: 1156, streak: 41, isActive: true, movement: -1 },
  { id: "4", name: "Lucas M.", score: 1098, streak: 29, isActive: true, movement: 1 },
  { id: "5", name: "Mia K.", score: 1067, streak: 35, isActive: true, movement: 0 },
  { id: "6", name: "Noah P.", score: 1034, streak: 27, isActive: true, movement: 3 },
  { id: "7", name: "Olivia S.", score: 1001, streak: 32, isActive: false, movement: -2 },
  { id: "8", name: "Ethan B.", score: 978, streak: 24, isActive: true, movement: 0 },
  { id: "9", name: "Ava C.", score: 945, streak: 30, isActive: true, movement: 1 },
  { id: "10", name: "Liam D.", score: 923, streak: 21, isActive: true, movement: -1 },
  { id: "18", name: "Sophie T.", score: 889, streak: 18, isActive: true, movement: 2 },
  { id: "19", name: "Ryan H.", score: 878, streak: 16, isActive: true, movement: 0 },
  { id: "20", name: "Emily G.", score: 867, streak: 19, isActive: true, movement: -1 },
  { id: "21", name: "Daniel F.", score: 856, streak: 14, isActive: false, movement: -3 },
  { id: "22", name: "Sarah K.", score: 851, streak: 15, isActive: true, movement: 1 },
  { id: "current", name: "You", score: 847, streak: 12, isActive: true, movement: 3, isCurrentUser: true },
  { id: "24", name: "Alex M.", score: 843, streak: 9, isActive: true, movement: -1 },
  { id: "25", name: "Grace N.", score: 839, streak: 13, isActive: true, movement: 0 },
  { id: "26", name: "Max V.", score: 834, streak: 11, isActive: true, movement: 2 },
  { id: "27", name: "Lily Q.", score: 829, streak: 10, isActive: false, movement: -2 },
  { id: "28", name: "Jack W.", score: 824, streak: 8, isActive: true, movement: 1 },
]

const sortByScoreThenStreak = (
  a: Omit<LeaderboardUser, "rank">,
  b: Omit<LeaderboardUser, "rank">
): number => {
  if (b.score !== a.score) return b.score - a.score
  return b.streak - a.streak
}

function ProfilePicture({
  name,
  avatarUrl,
  size = "md",
  className,
}: {
  name: string
  avatarUrl?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const sizeClasses = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-20 h-20 md:w-24 md:h-24 text-2xl md:text-3xl",
  }
  const ringClasses = {
    sm: "p-0.5",
    md: "p-0.5",
    lg: "p-1",
  }
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full bg-gradient-to-br from-[#2bbcff] to-[#a855f7]",
        ringClasses[size],
        className
      )}
      aria-hidden="true"
    >
      <Avatar className={cn("rounded-full border-2 border-background", sizeClasses[size])}>
        {avatarUrl && (
          <AvatarImage src={avatarUrl} alt="" className="object-cover" />
        )}
        <AvatarFallback className="rounded-full bg-background font-bold bg-gradient-to-br from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

export default function LeaderboardPage() {
  const [selectedProfile, setSelectedProfile] = useState<LeaderboardUser | null>(null)

  const globalLeaderboard = useMemo(() => {
    const sorted = [...globalLeaderboardRaw].sort(sortByScoreThenStreak)
    return sorted.map((u, i) => ({ ...u, rank: i + 1 })) as LeaderboardUser[]
  }, [])

  const topThree = useMemo(
    () => globalLeaderboard.filter((u) => u.rank <= 3),
    [globalLeaderboard]
  )

  const displayedUsers = useMemo(() => {
    const top10 = globalLeaderboard.filter((u) => u.rank <= 10)
    const currentIndex = globalLeaderboard.findIndex((u) => u.isCurrentUser)
    const surrounding =
      currentIndex >= 0
        ? globalLeaderboard.slice(
            Math.max(0, currentIndex - 5),
            currentIndex + 6
          )
        : []
    const combined = [...top10]
    surrounding.forEach((user) => {
      if (!combined.some((u) => u.id === user.id)) combined.push(user)
    })
    return combined.sort((a, b) => a.rank - b.rank)
  }, [globalLeaderboard])

  const handleProfileClick = (user: LeaderboardUser) => {
    if (user.isCurrentUser) return
    setSelectedProfile(user)
  }

  const handleCloseProfile = () => setSelectedProfile(null)

  const handleRowKeyDown = (e: React.KeyboardEvent, user: LeaderboardUser) => {
    if (user.isCurrentUser) return
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setSelectedProfile(user)
    }
  }

  const handlePodiumKeyDown = (e: React.KeyboardEvent, user: LeaderboardUser) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleProfileClick(user)
    }
  }

  return (
    <div className="min-h-[100dvh] sm:min-h-screen bg-background pt-[max(1rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(5rem,calc(4rem+env(safe-area-inset-bottom)))] overflow-x-hidden">
      {/* Hero - advanced: gradient mesh, strong typography */}
      <section className="container mx-auto px-4 pt-4 sm:pt-6 md:pt-8 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-5 sm:p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-r from-[#2bbcff]/25 to-[#a855f7]/25 blur-[120px] rounded-full -z-10"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 right-0 w-40 h-40 bg-[#a855f7]/10 blur-[60px] rounded-full -z-10"
              aria-hidden="true"
            />
            <div className="flex flex-col items-center text-center">
              <div
                className="w-14 h-14 rounded-2xl bg-[#2bbcff]/10 flex items-center justify-center mb-5"
                aria-hidden="true"
              >
                <Trophy className="w-7 h-7 text-[#2bbcff]" />
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-2">
                Global leaderboard
              </p>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#2bbcff] via-[#a855f7] to-[#2bbcff] bg-clip-text text-transparent leading-tight mb-3">
                Where do you stand?
              </h1>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Ranked by EliteScore, then streak when tied. Tap a player to view their profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Your standing - single card, 3 metrics */}
      <section className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-4 sm:p-5 md:p-6 shadow-xl">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 sm:mb-4">
              Your standing
            </p>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <div className="flex flex-col items-center md:items-start gap-1 rounded-xl border border-white/5 bg-white/5 p-3 sm:p-4 transition-transform hover:scale-[1.02] touch-manipulation">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rank</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                    #{currentUser.rank}
                  </span>
                  <TrendingUp className="w-4 h-4 text-green-500 shrink-0" aria-hidden="true" />
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start gap-1 rounded-xl border border-white/5 bg-white/5 p-3 sm:p-4 transition-transform hover:scale-[1.02] touch-manipulation">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">EliteScore</span>
                <span className="text-2xl md:text-3xl font-bold text-foreground">{currentUser.score}</span>
              </div>
              <div className="flex flex-col items-center md:items-start gap-1 rounded-xl border border-green-500/20 bg-green-500/5 p-3 sm:p-4 transition-transform hover:scale-[1.02] touch-manipulation">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Movement</span>
                <div className="flex items-center gap-1.5">
                  <ArrowUp className="w-5 h-5 text-green-500 shrink-0" aria-hidden="true" />
                  <span className="text-2xl md:text-3xl font-bold text-green-500">+{currentUser.movement}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Podium - top 3 with avatars */}
      <section className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-4 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 sm:mb-6 text-center">
              Top 3
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 items-end">
              {/* 2nd */}
              {topThree[1] && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleProfileClick(topThree[1])}
                  onKeyDown={(e) => handlePodiumKeyDown(e, topThree[1])}
                  aria-label={`View ${topThree[1].name}'s profile, rank 2`}
                  className="flex flex-col items-center gap-2 sm:gap-3 order-1 md:order-1 rounded-2xl border border-white/10 bg-white/5 py-4 sm:py-6 px-3 sm:px-4 transition-all hover:border-[#2bbcff]/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2bbcff]/50 cursor-pointer touch-manipulation min-h-[44px]"
                >
                  <div className="relative">
                    <ProfilePicture name={topThree[1].name} avatarUrl={topThree[1].avatarUrl} size="lg" />
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-400/90 flex items-center justify-center border-2 border-background">
                      <Medal className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground truncate w-full text-center">{topThree[1].name}</span>
                  <span className="text-lg font-black text-[#2bbcff]">{topThree[1].score}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">2nd</span>
                </div>
              )}
              {/* 1st */}
              {topThree[0] && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleProfileClick(topThree[0])}
                  onKeyDown={(e) => handlePodiumKeyDown(e, topThree[0])}
                  aria-label={`View ${topThree[0].name}'s profile, rank 1`}
                  className="flex flex-col items-center gap-2 sm:gap-3 order-2 md:order-2 rounded-2xl border-2 border-[#2bbcff]/30 bg-gradient-to-b from-[#2bbcff]/10 to-transparent py-6 sm:py-8 px-3 sm:px-4 md:-mt-4 transition-all hover:border-[#2bbcff]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2bbcff]/50 cursor-pointer touch-manipulation min-h-[44px]"
                >
                  <div className="relative">
                    <ProfilePicture name={topThree[0].name} avatarUrl={topThree[0].avatarUrl} size="lg" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center border-2 border-background">
                      <Crown className="w-4 h-4 text-background" aria-hidden="true" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground truncate w-full text-center">{topThree[0].name}</span>
                  <span className="text-xl font-black bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">{topThree[0].score}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">1st</span>
                </div>
              )}
              {/* 3rd */}
              {topThree[2] && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleProfileClick(topThree[2])}
                  onKeyDown={(e) => handlePodiumKeyDown(e, topThree[2])}
                  aria-label={`View ${topThree[2].name}'s profile, rank 3`}
                  className="flex flex-col items-center gap-2 sm:gap-3 order-3 md:order-3 rounded-2xl border border-white/10 bg-white/5 py-4 sm:py-6 px-3 sm:px-4 transition-all hover:border-[#2bbcff]/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2bbcff]/50 cursor-pointer touch-manipulation min-h-[44px]"
                >
                  <div className="relative">
                    <ProfilePicture name={topThree[2].name} avatarUrl={topThree[2].avatarUrl} size="lg" />
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-600/90 flex items-center justify-center border-2 border-background">
                      <Medal className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground truncate w-full text-center">{topThree[2].name}</span>
                  <span className="text-lg font-black text-[#2bbcff]">{topThree[2].score}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">3rd</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Full ranking table - with avatars */}
      <section className="container mx-auto px-4 pb-6 sm:pb-8 md:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-4 sm:p-5 md:p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 flex items-center justify-center shrink-0" aria-hidden="true">
                <Trophy className="w-5 h-5 text-[#a855f7]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Full ranking
                </p>
                <p className="text-base font-bold text-foreground">EliteScore → Streak tiebreak</p>
              </div>
            </div>

            <div className="hidden md:flex items-center px-3 md:px-4 pb-4 mb-4 border-b border-white/10 gap-4">
              <div className="w-14 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rank</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Player</span>
              </div>
              <div className="w-24">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">EliteScore</span>
              </div>
              <div className="w-24">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Streak</span>
              </div>
              <div className="w-20">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</span>
              </div>
              <div className="w-20 text-right">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Change</span>
              </div>
            </div>

            <div className="space-y-2">
              {displayedUsers.map((user, index) => {
                const hasGap = index > 0 && displayedUsers[index - 1] && user.rank - displayedUsers[index - 1].rank > 1
                return (
                  <div key={user.id}>
                    {hasGap && (
                      <div className="py-2 text-center" role="presentation">
                        <span className="text-xs text-muted-foreground/50">· · ·</span>
                      </div>
                    )}
                    <div
                      role={user.isCurrentUser ? "listitem" : "button"}
                      tabIndex={user.isCurrentUser ? undefined : 0}
                      onClick={() => handleProfileClick(user)}
                      onKeyDown={(e) => handleRowKeyDown(e, user)}
                      aria-label={
                        user.isCurrentUser
                          ? `You, rank ${user.rank}, EliteScore ${user.score}, streak ${user.streak}`
                          : `View ${user.name}'s profile, rank ${user.rank}`
                      }
                      className={cn(
                        "flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3.5 min-h-[48px] rounded-xl transition-all duration-200 group touch-manipulation",
                        user.isCurrentUser &&
                          "bg-gradient-to-r from-[#2bbcff]/10 to-[#a855f7]/10 border-2 border-[#2bbcff]/40 shadow-lg",
                        !user.isCurrentUser &&
                          user.isActive &&
                          "border border-white/5 hover:border-[#2bbcff]/30 hover:bg-white/5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2bbcff]/50",
                        !user.isCurrentUser &&
                          !user.isActive &&
                          "border border-white/5 bg-white/[0.02] opacity-70 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2bbcff]/50"
                      )}
                    >
                      <div className="w-10 md:w-14 flex justify-center shrink-0">
                        {user.rank === 1 ? (
                          <Crown className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" aria-hidden="true" />
                        ) : user.rank === 2 ? (
                          <Medal className="w-4 h-4 md:w-5 md:h-5 text-slate-400" aria-hidden="true" />
                        ) : user.rank === 3 ? (
                          <Medal className="w-4 h-4 md:w-5 md:h-5 text-amber-600" aria-hidden="true" />
                        ) : (
                          <span className="text-xs md:text-sm font-bold text-muted-foreground">#{user.rank}</span>
                        )}
                      </div>
                      <div className="flex flex-1 min-w-0 items-center gap-3">
                        <ProfilePicture name={user.name} avatarUrl={user.avatarUrl} size="sm" />
                        <span
                          className={cn(
                            "text-sm font-semibold truncate",
                            user.isCurrentUser && "bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent",
                            !user.isCurrentUser && "text-foreground group-hover:text-[#2bbcff] transition-colors"
                          )}
                        >
                          {user.name}
                        </span>
                      </div>
                      <div className="w-20 md:w-24 shrink-0">
                        <span className="text-sm font-bold text-[#2bbcff]">{user.score}</span>
                      </div>
                      <div className="hidden sm:flex w-16 md:w-24 items-center gap-1 shrink-0">
                        <Flame className="w-3 h-3 text-orange-500" aria-hidden="true" />
                        <span className="text-sm font-bold text-foreground">{user.streak}</span>
                      </div>
                      <div className="hidden md:flex w-20 items-center gap-2 shrink-0">
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full shrink-0",
                            user.isActive ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-gray-500"
                          )}
                          aria-hidden="true"
                        />
                        <span className="text-[10px] text-muted-foreground">{user.isActive ? "Active" : "Away"}</span>
                      </div>
                      <div className="w-12 md:w-20 flex justify-end shrink-0">
                        {user.movement !== 0 && (
                          <span
                            className={cn(
                              "flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 rounded-full",
                              user.movement > 0 ? "bg-green-500/10" : "bg-red-500/10"
                            )}
                          >
                            {user.movement > 0 ? (
                              <>
                                <ArrowUp className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-500" aria-hidden="true" />
                                <span className="text-[10px] md:text-xs font-bold text-green-500">{user.movement}</span>
                              </>
                            ) : (
                              <>
                                <ArrowDown className="w-2.5 h-2.5 md:w-3 md:h-3 text-red-500" aria-hidden="true" />
                                <span className="text-[10px] md:text-xs font-bold text-red-500">{Math.abs(user.movement)}</span>
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Profile modal - bottom-sheet on mobile, scrollable */}
      <Dialog open={!!selectedProfile} onOpenChange={(open) => !open && handleCloseProfile()}>
        <DialogContent
          className="w-full max-w-md p-0 gap-0 bg-card/95 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden max-h-[85dvh] overflow-y-auto fixed bottom-0 left-0 right-0 top-auto rounded-t-2xl translate-y-0 translate-x-0 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:pt-0 sm:pb-0 sm:top-[50%] sm:left-[50%] sm:right-auto sm:bottom-auto sm:max-h-[calc(100vh-2rem)] sm:rounded-2xl sm:translate-y-[-50%] sm:translate-x-[-50%]"
          aria-describedby={selectedProfile ? "profile-description" : undefined}
          showCloseButton={true}
        >
          {selectedProfile && (
            <>
              <DialogHeader className="p-4 sm:p-6 pb-4 border-b border-white/10 shrink-0">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full">
                  <ProfilePicture
                    name={selectedProfile.name}
                    avatarUrl={selectedProfile.avatarUrl}
                    size="lg"
                    className="shrink-0"
                  />
                  <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
                    <DialogTitle className="text-xl font-bold text-foreground">
                      {selectedProfile.name}
                    </DialogTitle>
                    <p id="profile-description" className="sr-only">
                      Profile: rank {selectedProfile.rank}, EliteScore {selectedProfile.score}, streak {selectedProfile.streak} days.
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-[#2bbcff]" aria-hidden="true" />
                        <span className="font-bold text-[#2bbcff]">{selectedProfile.score}</span>
                        <span className="text-muted-foreground">EliteScore</span>
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">Rank #{selectedProfile.rank}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                        <span className="font-bold text-orange-500">{selectedProfile.streak}</span>
                        <span className="text-muted-foreground">day streak</span>
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="px-6 py-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-[#2bbcff]/20 bg-[#2bbcff]/5 p-3">
                    <Check className="w-4 h-4 text-[#2bbcff] shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rank</p>
                      <p className="text-lg font-bold text-foreground">#{selectedProfile.rank}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-[#a855f7]/20 bg-[#a855f7]/5 p-3">
                    <Target className="w-4 h-4 text-[#a855f7] shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">EliteScore</p>
                      <p className="text-lg font-bold text-[#2bbcff]">{selectedProfile.score}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3">
                    <Flame className="w-4 h-4 text-orange-500 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Streak</p>
                      <p className="text-lg font-bold text-foreground">{selectedProfile.streak} days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
                    <span
                      className={cn(
                        "w-2.5 h-2.5 rounded-full shrink-0",
                        selectedProfile.isActive ? "bg-green-500" : "bg-gray-500"
                      )}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</p>
                      <p className="text-sm font-medium text-foreground">{selectedProfile.isActive ? "Active" : "Away"}</p>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/profile/${selectedProfile.id}`}
                  className="block"
                  aria-label={`View ${selectedProfile.name}'s full profile`}
                >
                  <Button
                    variant="outline"
                    className="w-full min-h-[48px] sm:h-10 border-[#2bbcff]/30 text-[#2bbcff] hover:bg-[#2bbcff]/10 text-[10px] font-bold uppercase tracking-wider touch-manipulation"
                  >
                    View full profile
                  </Button>
                </Link>

                <Button
                  onClick={handleCloseProfile}
                  className="w-full min-h-[48px] sm:h-10 bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-[10px] font-bold uppercase tracking-wider touch-manipulation"
                  aria-label="Close profile"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  )
}
