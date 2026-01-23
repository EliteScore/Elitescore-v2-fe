"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Clock, TrendingUp, Flame, ChevronRight, FileText, Calendar } from "lucide-react"

const userData = {
  eliteScore: 8247,
  scoreChange: 35,
  rank: 148,
  totalUsers: 15234,
  percentile: 15,
  streak: 12,
  weeklyConsistency: 6,
  isActive: true,
  leaderboardMovement: 23,
  xp: 450,
  level: 12,
  levelProgress: 65,
}

const activeChallenges = [
  {
    id: 1,
    name: "30-Day Python Mastery",
    difficulty: "Difficulty: 4/5",
    progress: 40,
    daysRemaining: 18,
    todayTask: "Complete 3 LeetCode medium problems using Python",
  },
  {
    id: 2,
    name: "14-Day LinkedIn Growth",
    difficulty: "Difficulty: 2/5",
    progress: 50,
    daysRemaining: 7,
    todayTask: "Post a career insight and engage with 5 posts in your industry",
  },
]

const leaderboardPreview = [
  { rank: 147, name: "Jordan_Dev", score: 8289, isCurrentUser: false },
  { rank: 148, name: "You", score: 8247, isCurrentUser: true },
  { rank: 149, name: "Maria_K", score: 8201, isCurrentUser: false },
]

const recommendedChallenges = [
  { id: 3, name: "7-Day SQL Bootcamp", difficulty: "Difficulty: 3/5", participants: "234 students" },
  { id: 4, name: "21-Day Morning Routine", difficulty: "Difficulty: 2/5", participants: "567 students" },
  { id: 5, name: "14-Day Portfolio Builder", difficulty: "Difficulty: 4/5", participants: "189 students" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Main Content */}
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Stats - EliteScore Focus */}
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 md:p-10 mb-6 md:mb-8 text-center shadow-2xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-[#2bbcff]/20 to-[#a855f7]/20 blur-[100px] rounded-full -z-10" />

            <div className="space-y-4">
              <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                EliteScore • Credibility
              </div>
              <div className="text-6xl md:text-8xl font-black bg-gradient-to-r from-[#2bbcff] via-[#a855f7] to-[#2bbcff] bg-clip-text text-transparent animate-gradient-x py-2 drop-shadow-sm">
                {userData.eliteScore}
              </div>
              <div className="flex flex-col items-center gap-3">
                <Badge
                  variant="secondary"
                  className="bg-white/5 text-white border-white/10 px-4 py-1 text-xs backdrop-blur-md"
                >
                  World Rank #{userData.rank}
                </Badge>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Your credibility is earned through finished work. Maintain your standing by completing your active
                  challenges.
                </p>
              </div>
            </div>
          </div>

          {/* XP & Level - Identity Track */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 glass-card rounded-xl border border-white/10 bg-card/40 backdrop-blur-sm p-6 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <div className="text-[10px] text-[#2bbcff] font-bold uppercase tracking-wider">
                    Level Progress • Identity
                  </div>
                  <h3 className="text-xl font-bold">Level {userData.level}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Next level in</div>
                  <div className="text-sm font-bold text-[#2bbcff]">{1000 - userData.xp} XP</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] rounded-full transition-all duration-1000"
                    style={{ width: `${userData.levelProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                  <span>Progress: {userData.levelProgress}%</span>
                  <span>{userData.xp} / 1000 XP</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl border border-orange-500/20 bg-orange-500/5 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center">
              <Flame className="w-8 h-8 text-orange-500 mb-2 animate-pulse" />
              <div className="text-2xl font-black text-orange-500">{userData.streak} Days</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Consistency Streak</div>
            </div>
          </div>

          {/* Performance Signals Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="glass-card rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Score Gain</span>
              </div>
              <div className="text-xl font-bold text-green-500">+{userData.scoreChange}</div>
            </div>

            <div className="glass-card rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3 h-3 text-[#2bbcff]" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                  Active Days
                </span>
              </div>
              <div className="text-xl font-bold text-foreground">{userData.weeklyConsistency}/7</div>
            </div>

            <div className="glass-card rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-3 h-3 text-[#a855f7]" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Movement</span>
              </div>
              <div className="text-xl font-bold text-[#a855f7]">↑ {userData.leaderboardMovement}</div>
            </div>

            <div className="glass-card rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-3 h-3 text-[#2bbcff]" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Percentile</span>
              </div>
              <div className="text-xl font-bold text-foreground">Top {userData.percentile}%</div>
            </div>
          </div>

          {/* Active Challenges - Daily XP Track */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-bold">Active Challenges</h2>
              <Button
                size="sm"
                variant="outline"
                className="text-[10px] md:text-xs h-7 md:h-8 bg-transparent border-border/50 hover:bg-muted/50 px-2 md:px-3"
                asChild
              >
                <Link href="/challenges">
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              {activeChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="glass-card rounded-xl border border-[#2bbcff]/30 bg-card/50 backdrop-blur-sm p-5 hover:border-[#2bbcff]/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold">{challenge.name}</h3>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-[#2bbcff]/10 text-[#2bbcff] border-[#2bbcff]/30"
                        >
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Target className="w-3 h-3" />
                        <span>{challenge.difficulty}</span>
                      </div>
                    </div>
                    <Trophy className="w-5 h-5 text-[#a855f7]" />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{challenge.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] rounded-full transition-all duration-500"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3 h-3 text-[#2bbcff]" />
                      <span className="text-muted-foreground">{challenge.daysRemaining} days remaining</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/5">
                    <p className="text-[10px] font-bold mb-1 text-[#2bbcff] uppercase tracking-wider">
                      Today's XP Quest:
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{challenge.todayTask}</p>
                    <div className="mt-2 flex items-center gap-1 text-[#2bbcff] text-[10px] font-bold">
                      <Flame className="w-3 h-3" />
                      +50 XP ON COMPLETION
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      asChild
                      className="flex-1 bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-xs h-9 font-bold tracking-tight"
                    >
                      <Link href="/challenges">Open Daily Quest</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="mb-8 md:mb-10">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-bold">Leaderboard Preview</h2>
              <Button
                size="sm"
                variant="outline"
                className="text-[10px] md:text-xs h-7 md:h-8 bg-transparent border-border/50 hover:bg-muted/50 px-2 md:px-3"
                asChild
              >
                <Link href="/leaderboard">
                  <span className="hidden sm:inline">View Full Leaderboard</span>
                  <span className="sm:hidden">Full</span>
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>

            <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm overflow-hidden">
              {leaderboardPreview.map((user) => (
                <div
                  key={user.rank}
                  className={`p-4 hover:bg-muted/30 transition-colors ${
                    user.isCurrentUser
                      ? "bg-gradient-to-r from-[#2bbcff]/10 to-[#a855f7]/10 border-y border-[#2bbcff]/30"
                      : "border-b border-border/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-muted-foreground w-8">#{user.rank}</div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2bbcff]/20 to-[#a855f7]/20 flex items-center justify-center">
                      <span className="text-sm font-bold">{user.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{user.name}</div>
                      {user.isCurrentUser && (
                        <div className="text-xs text-muted-foreground">Keep pushing to the top!</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{user.score}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Insight */}
          <div className="glass-card rounded-xl border border-[#a855f7]/20 bg-gradient-to-r from-[#a855f7]/5 to-[#2bbcff]/5 backdrop-blur-sm p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#a855f7]/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-[#a855f7]" />
              </div>
              <div>
                <h3 className="text-sm font-bold mb-1">Today's Insight</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You're on track to reach the top 10% this week. Complete 2 more challenges to boost your score by 150+
                  points.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Challenges */}
          <div>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-bold">Recommended Challenges</h2>
              <Button
                size="sm"
                variant="outline"
                className="text-[10px] md:text-xs h-7 md:h-8 bg-transparent border-border/50 hover:bg-muted/50 px-2 md:px-3"
                asChild
              >
                <Link href="/challenges">
                  <span className="hidden sm:inline">Browse All</span>
                  <span className="sm:hidden">All</span>
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recommendedChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="glass-card rounded-xl border border-[#a855f7]/20 bg-card/50 backdrop-blur-sm p-4 hover:border-[#a855f7]/40 transition-all cursor-pointer group"
                >
                  <h3 className="text-sm md:text-base font-bold mb-3 group-hover:text-[#a855f7] transition-colors">
                    {challenge.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{challenge.difficulty}</span>
                    <span className="text-[#a855f7]">{challenge.participants}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
