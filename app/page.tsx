"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Clock, TrendingUp, Flame, ChevronRight, Calendar, Zap, Award, Sparkles, BookOpen } from "lucide-react"
import { TodaysTasks } from "@/components/todays-tasks"

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

const todaysTasks = [
  {
    id: "task1",
    title: "Complete 3 LeetCode medium problems",
    duration: "30 min",
    category: "Skills",
    challengeName: "30-Day Python Mastery",
  },
  {
    id: "task2",
    title: "Post career insight on LinkedIn",
    duration: "15 min",
    category: "Career",
    challengeName: "14-Day LinkedIn Growth",
  },
  {
    id: "task3",
    title: "Update portfolio with new project",
    duration: "20 min",
    category: "Projects",
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Main Content */}
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero: EliteScore + Streak + Stats in one card */}
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 md:p-8 mb-6 md:mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-[#2bbcff]/20 to-[#a855f7]/20 blur-[100px] rounded-full -z-10" />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              {/* Left: EliteScore + Rank + Tagline */}
              <div className="md:col-span-6 flex flex-col items-center md:items-start justify-center text-center md:text-left">
                <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">
                  EliteScore • Credibility
                </div>
                <div className="text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-[#2bbcff] via-[#a855f7] to-[#2bbcff] bg-clip-text text-transparent animate-gradient-x py-1 drop-shadow-sm">
                  {userData.eliteScore}
                </div>
                <Badge
                  variant="secondary"
                  className="mt-3 bg-white/5 text-white border-white/10 px-4 py-1 text-xs backdrop-blur-md"
                  aria-label={`World rank ${userData.rank}`}
                >
                  World Rank #{userData.rank}
                </Badge>
                <p className="text-xs text-muted-foreground max-w-sm mt-3 leading-relaxed">
                  Your credibility is earned through finished work. Maintain your standing by completing your active
                  challenges.
                </p>
              </div>
              {/* Right: Streak + Stats grid */}
              <div className="md:col-span-6 flex flex-col gap-4">
                <div className="glass-card rounded-xl border border-orange-500/20 bg-orange-500/5 backdrop-blur-sm p-4 flex flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-orange-500">{userData.streak} Days</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Consistency Streak</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm p-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <TrendingUp className="w-3 h-3 text-green-500" aria-hidden="true" />
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Score Gain</span>
                    </div>
                    <div className="text-lg font-bold text-green-500">+{userData.scoreChange}</div>
                  </div>
                  <div className="glass-card rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm p-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Calendar className="w-3 h-3 text-[#2bbcff]" aria-hidden="true" />
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Active Days</span>
                    </div>
                    <div className="text-lg font-bold text-foreground">{userData.weeklyConsistency}/7</div>
                  </div>
                  <div className="glass-card rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm p-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Trophy className="w-3 h-3 text-[#a855f7]" aria-hidden="true" />
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Movement</span>
                    </div>
                    <div className="text-lg font-bold text-[#a855f7]">↑ {userData.leaderboardMovement}</div>
                  </div>
                  <div className="glass-card rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm p-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Target className="w-3 h-3 text-[#2bbcff]" aria-hidden="true" />
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Percentile</span>
                    </div>
                    <div className="text-lg font-bold text-foreground">Top {userData.percentile}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Tasks */}
          <TodaysTasks tasks={todaysTasks} />

          {/* Week at a glance */}
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-card/40 backdrop-blur-md p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2bbcff]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Zap className="w-5 h-5 text-[#2bbcff]" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Week at a glance</div>
                <div className="text-sm font-bold text-foreground">
                  <span className="text-[#2bbcff]">{activeChallenges.length}</span> active challenges
                  <span className="mx-1.5 text-muted-foreground">•</span>
                  <span className="text-[#a855f7]">{todaysTasks.length}</span> tasks today
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-[10px] h-8 font-bold uppercase tracking-wider text-[#2bbcff] hover:text-[#2bbcff] hover:bg-[#2bbcff]/10 px-3"
              asChild
            >
              <Link href="/challenges">
                View challenges
                <ChevronRight className="ml-0.5 h-3 w-3" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Active Challenges */}
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 md:p-8 mb-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2bbcff]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Target className="w-5 h-5 text-[#2bbcff]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Active Challenges • Your commitments</div>
                  <div className="text-base font-bold text-foreground">{activeChallenges.length} in progress</div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-[10px] h-8 font-bold uppercase tracking-wider text-[#2bbcff] hover:bg-[#2bbcff]/10 px-3"
                asChild
              >
                <Link href="/challenges">
                  View All
                  <ChevronRight className="ml-0.5 h-3 w-3" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              {activeChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="glass-card rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm p-4 hover:border-[#2bbcff]/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-foreground truncate">{challenge.name}</h3>
                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-[#2bbcff]/10 text-[#2bbcff] border-[#2bbcff]/30 flex-shrink-0">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider">
                        <Target className="w-2.5 h-2.5" aria-hidden="true" />
                        {challenge.difficulty}
                      </div>
                    </div>
                    <Trophy className="w-5 h-5 text-[#a855f7] flex-shrink-0" aria-hidden="true" />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="glass-card rounded-lg border border-white/5 bg-white/5 p-2.5">
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Progress</span>
                        <span className="text-xs font-bold text-foreground">{challenge.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] rounded-full transition-all duration-500"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                      <Clock className="w-3 h-3 text-[#2bbcff]" aria-hidden="true" />
                      {challenge.daysRemaining} days remaining
                    </div>
                  </div>

                  <div className="glass-card rounded-lg border border-[#2bbcff]/10 bg-[#2bbcff]/5 p-3 mb-4">
                    <div className="text-[10px] font-bold text-[#2bbcff] uppercase tracking-wider mb-1">Today&apos;s task</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{challenge.todayTask}</p>
                  </div>

                  <Button size="sm" asChild className="w-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-[10px] h-8 font-bold uppercase tracking-wider">
                    <Link href={`/challenges/${challenge.id}`}>View Challenge</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 md:p-8 mb-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Award className="w-5 h-5 text-[#a855f7]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Leaderboard • Preview</div>
                  <div className="text-base font-bold text-foreground">Your rank and nearby peers</div>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-[10px] h-8 font-bold uppercase tracking-wider text-[#a855f7] hover:bg-[#a855f7]/10 px-3" asChild>
                <Link href="/leaderboard">
                  View Full
                  <ChevronRight className="ml-0.5 h-3 w-3" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm overflow-hidden">
              {leaderboardPreview.map((user) => (
                <div
                  key={user.rank}
                  className={`p-4 flex items-center gap-4 transition-colors ${
                    user.isCurrentUser
                      ? "bg-gradient-to-r from-[#2bbcff]/10 to-[#a855f7]/10 border-y border-[#2bbcff]/20"
                      : "border-b border-white/5 last:border-b-0"
                  }`}
                >
                  <div className="text-lg font-bold text-muted-foreground w-8 tabular-nums">#{user.rank}</div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2bbcff]/20 to-[#a855f7]/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <span className="text-sm font-bold">{user.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-foreground">{user.name}</div>
                    {user.isCurrentUser && (
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Keep pushing to the top!</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground tabular-nums">{user.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Insight */}
          <div className="glass-card rounded-2xl border border-[#a855f7]/20 bg-gradient-to-r from-[#a855f7]/5 to-[#2bbcff]/5 backdrop-blur-md p-5 mb-8 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Sparkles className="w-5 h-5 text-[#a855f7]" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Today&apos;s Insight</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You&apos;re on track to reach the top 10% this week. Complete 2 more challenges to boost your score by 150+ points.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Challenges */}
          <div className="glass-card rounded-2xl border border-[#a855f7]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <BookOpen className="w-5 h-5 text-[#a855f7]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Recommended Challenges • For you</div>
                  <div className="text-base font-bold text-foreground">Pick your next commitment</div>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-[10px] h-8 font-bold uppercase tracking-wider text-[#a855f7] hover:bg-[#a855f7]/10 px-3" asChild>
                <Link href="/challenges">
                  Browse All
                  <ChevronRight className="ml-0.5 h-3 w-3" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recommendedChallenges.map((challenge) => (
                <Link key={challenge.id} href="/challenges" className="glass-card rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm p-4 hover:border-[#a855f7]/30 transition-all group block">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#a855f7]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#a855f7]/20 transition-colors" aria-hidden="true">
                      <Target className="w-4 h-4 text-[#a855f7]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground mb-1.5 group-hover:text-[#a855f7] transition-colors truncate">
                        {challenge.name}
                      </h3>
                      <div className="flex items-center justify-between gap-2 text-[10px]">
                        <span className="text-muted-foreground uppercase tracking-wider">{challenge.difficulty}</span>
                        <span className="font-bold text-[#a855f7] flex-shrink-0">{challenge.participants}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
