"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Crown, Medal, Flame, TrendingUp } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"cohort" | "challenge">("cohort")
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<any>(null)

  // Mock data
  const currentUser = {
    rank: 23,
    name: "You",
    score: 847,
    streak: 12,
    isActive: true,
    movement: 3,
  }

  const activeChallenges = [
    { id: 1, name: "Morning Routine Master" },
    { id: 2, name: "Book a Week" },
  ]

  const cohortLeaderboard = [
    { rank: 1, name: "Emma W.", score: 1247, streak: 45, isActive: true, movement: 0 },
    { rank: 2, name: "James L.", score: 1189, streak: 38, isActive: true, movement: 2 },
    { rank: 3, name: "Sofia R.", score: 1156, streak: 41, isActive: true, movement: -1 },
    { rank: 4, name: "Lucas M.", score: 1098, streak: 29, isActive: true, movement: 1 },
    { rank: 5, name: "Mia K.", score: 1067, streak: 35, isActive: true, movement: 0 },
    { rank: 6, name: "Noah P.", score: 1034, streak: 27, isActive: true, movement: 3 },
    { rank: 7, name: "Olivia S.", score: 1001, streak: 32, isActive: false, movement: -2 },
    { rank: 8, name: "Ethan B.", score: 978, streak: 24, isActive: true, movement: 0 },
    { rank: 9, name: "Ava C.", score: 945, streak: 30, isActive: true, movement: 1 },
    { rank: 10, name: "Liam D.", score: 923, streak: 21, isActive: true, movement: -1 },
    // Users around current user
    { rank: 18, name: "Sophie T.", score: 889, streak: 18, isActive: true, movement: 2 },
    { rank: 19, name: "Ryan H.", score: 878, streak: 16, isActive: true, movement: 0 },
    { rank: 20, name: "Emily G.", score: 867, streak: 19, isActive: true, movement: -1 },
    { rank: 21, name: "Daniel F.", score: 856, streak: 14, isActive: false, movement: -3 },
    { rank: 22, name: "Sarah K.", score: 851, streak: 15, isActive: true, movement: 1 },
    { rank: 23, name: "You", score: 847, streak: 12, isActive: true, movement: 3, isCurrentUser: true },
    { rank: 24, name: "Alex M.", score: 843, streak: 9, isActive: true, movement: -1 },
    { rank: 25, name: "Grace N.", score: 839, streak: 13, isActive: true, movement: 0 },
    { rank: 26, name: "Max V.", score: 834, streak: 11, isActive: true, movement: 2 },
    { rank: 27, name: "Lily Q.", score: 829, streak: 10, isActive: false, movement: -2 },
    { rank: 28, name: "Jack W.", score: 824, streak: 8, isActive: true, movement: 1 },
  ]

  const challengeLeaderboard = [
    { rank: 1, name: "Emma W.", score: 98, streak: 28, isActive: true, movement: 0 },
    { rank: 2, name: "You", score: 92, streak: 12, isActive: true, movement: 1, isCurrentUser: true },
    { rank: 3, name: "James L.", score: 89, streak: 15, isActive: true, movement: -1 },
  ]

  const getDisplayedUsers = () => {
    const leaderboard = activeTab === "cohort" ? cohortLeaderboard : challengeLeaderboard

    // Top 10
    const top10 = leaderboard.filter((u) => u.rank <= 10)

    // Current user
    const currentUserData = leaderboard.find((u) => u.isCurrentUser)

    // 5 above and 5 below current user
    const currentUserIndex = leaderboard.findIndex((u) => u.isCurrentUser)
    const surrounding =
      currentUserIndex !== -1 ? leaderboard.slice(Math.max(0, currentUserIndex - 5), currentUserIndex + 6) : []

    // Combine and deduplicate
    const combined = [...top10]
    surrounding.forEach((user) => {
      if (!combined.find((u) => u.rank === user.rank)) {
        combined.push(user)
      }
    })

    return combined.sort((a, b) => a.rank - b.rank)
  }

  const displayedUsers = getDisplayedUsers()

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-12 pb-6 md:pb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2bbcff]/5 via-background to-[#a855f7]/5" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-2 md:space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance">
              The{" "}
              <span className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                Leaderboard
              </span>
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground px-4">
              See where you stand against your cohort. Every rank tells a story of commitment.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="glass-card rounded-lg border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Your Rank</p>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                  #{currentUser.rank}
                </p>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </div>
            <div className="glass-card rounded-lg border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Your Score</p>
              <p className="text-3xl font-bold">{currentUser.score}</p>
            </div>
            <div className="glass-card rounded-lg border border-green-500/20 bg-card/50 backdrop-blur-sm p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">This Week</p>
              <div className="flex items-center gap-2">
                <ArrowUp className="w-5 h-5 text-green-500" />
                <p className="text-3xl font-bold text-green-500">+{currentUser.movement}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 p-1.5 bg-muted/50 rounded-full w-full sm:w-fit mx-auto overflow-x-auto">
            <Button
              onClick={() => setActiveTab("cohort")}
              size="sm"
              className={
                activeTab === "cohort"
                  ? "bg-gradient-to-r from-[#2bbcff] to-[#a855f7] text-white text-[10px] md:text-xs h-7 md:h-8 px-4 md:px-6 rounded-full whitespace-nowrap"
                  : "bg-transparent text-muted-foreground text-[10px] md:text-xs h-7 md:h-8 px-4 md:px-6 hover:text-foreground whitespace-nowrap"
              }
            >
              Cohort
            </Button>
            {activeChallenges.length > 0 && (
              <Button
                onClick={() => setActiveTab("challenge")}
                size="sm"
                className={
                  activeTab === "challenge"
                    ? "bg-gradient-to-r from-[#2bbcff] to-[#a855f7] text-white text-[10px] md:text-xs h-7 md:h-8 px-4 md:px-6 rounded-full whitespace-nowrap"
                    : "bg-transparent text-muted-foreground text-[10px] md:text-xs h-7 md:h-8 px-4 md:px-6 hover:text-foreground whitespace-nowrap"
                }
              >
                Challenge
              </Button>
            )}
          </div>

          {activeTab === "challenge" && (
            <div className="glass-card rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-4 mb-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Select Challenge</p>
              <div className="flex gap-2">
                {activeChallenges.map((challenge) => (
                  <Button
                    key={challenge.id}
                    onClick={() => setSelectedChallenge(challenge.name)}
                    size="sm"
                    className={
                      selectedChallenge === challenge.name
                        ? "bg-gradient-to-r from-[#2bbcff] to-[#a855f7] text-white border-0 text-xs h-8 px-4"
                        : "bg-transparent border-border/50 text-muted-foreground text-xs h-8 px-4 hover:bg-muted/50"
                    }
                  >
                    {challenge.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-4 md:p-6">
            {/* Table Header - hide on mobile, show simplified version */}
            <div className="hidden md:flex items-center px-4 pb-4 mb-4 border-b border-white/10">
              <div className="w-16 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Rank</p>
              </div>
              <div className="flex-1 min-w-[140px]">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Player</p>
              </div>
              <div className="w-24">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Score</p>
              </div>
              <div className="w-24">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Streak</p>
              </div>
              <div className="w-20">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</p>
              </div>
              <div className="w-20 text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Change</p>
              </div>
            </div>

            <div className="space-y-1.5">
              {displayedUsers.map((user, index) => (
                <div key={user.rank}>
                  {index > 0 && user.rank - displayedUsers[index - 1].rank > 1 && (
                    <div className="py-2 md:py-3 text-center">
                      <p className="text-xs text-muted-foreground/50">• • •</p>
                    </div>
                  )}

                  <div
                    onClick={() => !user.isCurrentUser && setSelectedProfile(user)}
                    className={`flex items-center px-3 md:px-4 py-3 md:py-3.5 rounded-xl transition-all duration-200 group ${
                      user.isCurrentUser
                        ? "bg-gradient-to-r from-[#2bbcff]/10 to-[#a855f7]/10 border-2 border-[#2bbcff]/40 shadow-lg"
                        : user.isActive
                          ? "bg-background/40 border border-white/5 hover:border-[#2bbcff]/30 hover:bg-background/60 cursor-pointer"
                          : "bg-background/20 border border-white/5 opacity-40"
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-10 md:w-16 flex justify-center">
                      {user.rank === 1 ? (
                        <div className="relative">
                          <Crown className="w-5 h-5 md:w-7 md:h-7 text-yellow-400" />
                          <div className="absolute inset-0 blur-sm">
                            <Crown className="w-5 h-5 md:w-7 md:h-7 text-yellow-400" />
                          </div>
                        </div>
                      ) : user.rank === 2 ? (
                        <Medal className="w-4 h-4 md:w-6 md:h-6 text-slate-400" />
                      ) : user.rank === 3 ? (
                        <Medal className="w-4 h-4 md:w-6 md:h-6 text-amber-600" />
                      ) : (
                        <p className="text-xs md:text-sm font-bold text-muted-foreground">#{user.rank}</p>
                      )}
                    </div>

                    {/* Name */}
                    <p
                      className={`flex-1 min-w-0 text-xs md:text-sm font-semibold truncate ${
                        user.isCurrentUser
                          ? "bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent"
                          : "text-foreground group-hover:text-[#2bbcff] transition-colors"
                      }`}
                    >
                      {user.name}
                    </p>

                    {/* Score */}
                    <div className="w-16 md:w-24">
                      <p className="text-xs md:text-sm font-bold text-[#2bbcff]">{user.score}</p>
                    </div>

                    {/* Streak - hide on smallest screens */}
                    <div className="hidden sm:flex w-16 md:w-24 items-center gap-1">
                      <Flame className="w-3 h-3 md:w-3.5 md:h-3.5 text-orange-500" />
                      <p className="text-xs md:text-sm font-bold text-foreground">{user.streak}</p>
                    </div>

                    {/* Status - hide on mobile */}
                    <div className="hidden md:flex w-20 items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${user.isActive ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-gray-500"}`}
                      />
                      <p className="text-[10px] text-muted-foreground">{user.isActive ? "Active" : "Away"}</p>
                    </div>

                    {/* Movement */}
                    <div className="w-12 md:w-20 flex justify-end">
                      {user.movement !== 0 && (
                        <div
                          className={`flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 rounded-full ${
                            user.movement > 0 ? "bg-green-500/10" : "bg-red-500/10"
                          }`}
                        >
                          {user.movement > 0 ? (
                            <>
                              <ArrowUp className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-500" />
                              <p className="text-[10px] md:text-xs font-bold text-green-500">{user.movement}</p>
                            </>
                          ) : (
                            <>
                              <ArrowDown className="w-2.5 h-2.5 md:w-3 md:h-3 text-red-500" />
                              <p className="text-[10px] md:text-xs font-bold text-red-500">{Math.abs(user.movement)}</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Profile Modal - full screen on mobile */}
      {selectedProfile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedProfile(null)}
        >
          <Card
            className="w-full max-w-md h-full sm:h-auto p-6 md:p-8 bg-card/95 backdrop-blur-xl border-0 sm:border border-white/20 shadow-2xl rounded-none sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2bbcff]/20 to-[#a855f7]/20 flex items-center justify-center mx-auto mb-4 border border-white/10">
                <p className="text-2xl font-bold bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                  {selectedProfile.name.charAt(0)}
                </p>
              </div>
              <h3 className="text-2xl font-bold text-foreground">{selectedProfile.name}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-background/60 to-background/30 border border-white/5">
                <p className="text-xs text-muted-foreground font-medium">Rank</p>
                <p className="text-xl font-bold text-foreground">#{selectedProfile.rank}</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-background/60 to-background/30 border border-white/5">
                <p className="text-xs text-muted-foreground font-medium">EliteScore</p>
                <p className="text-xl font-bold text-[#2bbcff]">{selectedProfile.score}</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-background/60 to-background/30 border border-white/5">
                <p className="text-xs text-muted-foreground font-medium">Streak</p>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <p className="text-xl font-bold text-foreground">{selectedProfile.streak} days</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-background/60 to-background/30 border border-white/5">
                <p className="text-xs text-muted-foreground font-medium">Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${selectedProfile.isActive ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-gray-500"}`}
                  />
                  <p className="text-sm text-foreground font-medium">
                    {selectedProfile.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setSelectedProfile(null)}
              className="w-full mt-6 bg-gradient-to-r from-[#2bbcff] to-[#a855f7] text-white border-0 text-sm h-11 shadow-lg shadow-[#2bbcff]/20"
            >
              Close
            </Button>
          </Card>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
