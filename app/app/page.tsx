"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Flame,
  ChevronRight,
  Calendar,
  Zap,
  Award,
  Sparkles,
  BookOpen,
  Upload,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react"
import { TodaysTasks } from "@/components/todays-tasks"

const TIMER_SECONDS = 30 * 60

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

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

const weeklyProgress = {
  goalTasks: 5,
  completedTasks: 3,
  proofsLogged: 12,
}

const activeChallenges = [
  {
    id: 1,
    name: "30-Day Python Mastery",
    track: "Technical Skills",
    difficulty: "Difficulty: 4/5",
    progress: 40,
    daysRemaining: 18,
    todayTask: "Complete 3 LeetCode medium problems using Python",
    reward: 450,
  },
  {
    id: 2,
    name: "14-Day LinkedIn Growth",
    track: "Career Development",
    difficulty: "Difficulty: 2/5",
    progress: 50,
    daysRemaining: 7,
    todayTask: "Post a career insight and engage with 5 posts in your industry",
    reward: 140,
  },
]

const leaderboardPreview = [
  { rank: 147, name: "Jordan_Dev", score: 8289, streak: 14, delta: 2, isCurrentUser: false },
  { rank: 148, name: "You", score: 8247, streak: 12, delta: 3, isCurrentUser: true },
  { rank: 149, name: "Maria_K", score: 8201, streak: 9, delta: -1, isCurrentUser: false },
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

const quickActions = [
  {
    label: "Submit proof",
    description: "Log today's progress",
    href: "/challenges",
    icon: Upload,
  },
  {
    label: "Verify streak",
    description: "Review streak rules",
    href: "/challenges",
    icon: ShieldCheck,
  },
  {
    label: "View leaderboard",
    description: "See rank movement",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    label: "Streak insurance",
    description: "Protect a missed day",
    href: "/challenges",
    icon: ShieldCheck,
  },
]

export default function DashboardPage() {
  const nextTask = todaysTasks[0]
  const [isTiming, setIsTiming] = React.useState(false)
  const [secondsLeft, setSecondsLeft] = React.useState(TIMER_SECONDS)

  React.useEffect(() => {
    if (!isTiming) return
    if (secondsLeft <= 0) {
      setIsTiming(false)
      return
    }
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [isTiming, secondsLeft])

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="mx-auto w-full px-6 py-6 md:py-8">
        <div className="w-full space-y-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">EliteScore</div>
                  <div className="text-5xl sm:text-6xl font-semibold text-foreground tabular-nums">
                    {userData.eliteScore}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="border-border/60 bg-muted/60 text-foreground/80 px-3 py-1 text-xs"
                  aria-label={`World rank ${userData.rank}`}
                >
                  Global rank #{userData.rank}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                You are ahead of {100 - userData.percentile}% of learners this week.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <div className="text-xs text-muted-foreground">Weekly score gain</div>
                  <div className="mt-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-foreground" aria-hidden="true" />
                    <span className="text-lg font-semibold text-foreground">+{userData.scoreChange}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <div className="text-xs text-muted-foreground">Leaderboard movement</div>
                  <div className="mt-2 flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-foreground" aria-hidden="true" />
                    <span className="text-lg font-semibold text-foreground">+{userData.leaderboardMovement}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <div className="text-xs text-muted-foreground">Consistency</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-foreground" aria-hidden="true" />
                    <span className="text-lg font-semibold text-foreground">{userData.weeklyConsistency}/7 days</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <div className="text-xs text-muted-foreground">Current streak</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-foreground" aria-hidden="true" />
                    <span className="text-lg font-semibold text-foreground">{userData.streak} days</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-border/60 bg-card/60 p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Weekly goal</span>
                  <span className="font-semibold text-foreground">
                    {weeklyProgress.completedTasks}/{weeklyProgress.goalTasks} tasks
                  </span>
                </div>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground rounded-full transition-all"
                    style={{ width: `${(weeklyProgress.completedTasks / weeklyProgress.goalTasks) * 100}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Proofs logged: <span className="font-semibold text-foreground">{weeklyProgress.proofsLogged}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Next up</div>
                    <div className="text-base font-semibold text-foreground">Focus block</div>
                  </div>
                  <Badge variant="secondary" className="bg-brand/15 text-foreground border-border/60 text-xs">
                    {nextTask.duration}
                  </Badge>
                </div>
                <div className="text-sm font-semibold text-foreground">{nextTask.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{nextTask.challengeName}</div>
                <div className="mt-4 rounded-xl border border-border/60 bg-card/60 p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Focus timer</span>
                    <span className="font-semibold text-foreground">{formatTime(secondsLeft)}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full transition-all"
                      style={{ width: `${(secondsLeft / TIMER_SECONDS) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-brand hover:bg-brand/90 text-white"
                    onClick={() => setIsTiming((prev) => !prev)}
                  >
                    {isTiming ? "Pause" : "Start session"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsTiming(false)
                      setSecondsLeft(TIMER_SECONDS)
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Quick actions</div>
                    <div className="text-base font-semibold text-foreground">Keep your momentum</div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs font-semibold text-foreground hover:bg-brand/10" asChild>
                    <Link href="/challenges">
                      Open challenges
                      <ChevronRight className="ml-1 h-3 w-3" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-4 rounded-xl border border-border/60 bg-card/60 p-4 hover:border-brand/40 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center">
                        <action.icon className="w-5 h-5 text-foreground" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{action.label}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <TodaysTasks tasks={todaysTasks} />

          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground">New features</div>
                <div className="text-base font-semibold text-foreground">What is live now</div>
              </div>
              <Button size="sm" variant="ghost" className="text-xs font-semibold text-foreground hover:bg-muted/50">
                Learn more
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { n: "1", title: "Streak insurance", text: "Spend points to save a missed day." },
                { n: "2", title: "Proof ratings", text: "Peer upvotes boost proof quality." },
                { n: "3", title: "Weekly boss", text: "High difficulty, high reward challenge." },
              ].map((item) => (
                <div key={item.n} className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <div className="text-xs text-muted-foreground">#{item.n}</div>
                  <div className="mt-1 text-sm font-semibold text-foreground">{item.title}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Zap className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Week at a glance</div>
                <div className="text-sm font-semibold text-foreground">
                  <span className="text-foreground">{activeChallenges.length}</span> active challenges
                  <span className="mx-2 text-muted-foreground">|</span>
                  <span className="text-foreground">{todaysTasks.length}</span> tasks today
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs font-semibold text-foreground hover:text-foreground hover:bg-brand/10 px-3"
              asChild
            >
              <Link href="/challenges">
                View challenges
                <ChevronRight className="ml-0.5 h-3 w-3" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Target className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Active challenges</div>
                  <div className="text-base font-semibold text-foreground">{activeChallenges.length} in progress</div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs font-semibold text-foreground hover:bg-brand/10 px-3"
                asChild
              >
                <Link href="/challenges">
                  View all
                  <ChevronRight className="ml-0.5 h-3 w-3" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              {activeChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="rounded-xl border border-border/60 bg-card/60 p-4 hover:border-brand/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-semibold text-foreground truncate">{challenge.name}</h3>
                        <Badge variant="secondary" className="text-[10px] font-medium bg-brand/15 text-foreground border-brand/30 flex-shrink-0">
                          Active
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Target className="w-3 h-3" aria-hidden="true" />
                        {challenge.difficulty}
                        <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                          {challenge.track}
                        </span>
                      </div>
                    </div>
                    <Trophy className="w-5 h-5 text-foreground flex-shrink-0" aria-hidden="true" />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">Progress</span>
                        <span className="text-xs font-semibold text-foreground">{challenge.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand to-brand-2 rounded-full transition-all duration-500"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 text-foreground" aria-hidden="true" />
                      {challenge.daysRemaining} days remaining
                    </div>
                  </div>

                  <div className="rounded-lg border border-brand/15 bg-brand/5 p-3 mb-4">
                    <div className="text-xs font-medium text-foreground mb-1">Today&apos;s task</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{challenge.todayTask}</p>
                    <div className="mt-2 text-xs text-muted-foreground">Reward: +{challenge.reward} pts</div>
                  </div>

                  <Button size="sm" asChild className="w-full bg-brand hover:bg-brand/90 text-white border-0 text-xs h-8 font-semibold">
                    <Link href={`/challenges/${challenge.id}`}>View challenge</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-2/15 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Award className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Leaderboard</div>
                  <div className="text-base font-semibold text-foreground">Your rank and nearby peers</div>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-xs font-semibold text-foreground hover:bg-brand-2/10 px-3" asChild>
                <Link href="/leaderboard">
                  View full
                  <ChevronRight className="ml-0.5 h-3 w-3" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/60 overflow-hidden">
              {leaderboardPreview.map((user) => (
                <div
                  key={user.rank}
                  className={`p-4 flex items-center gap-4 transition-colors ${
                    user.isCurrentUser
                      ? "bg-brand/10 border-y border-brand/20"
                      : "border-b border-border/60 last:border-b-0"
                  }`}
                >
                  <div className="text-lg font-semibold text-muted-foreground w-8 tabular-nums">#{user.rank}</div>
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <span className="text-sm font-semibold text-foreground">{user.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground">{user.name}</div>
                    {user.isCurrentUser && (
                      <div className="text-xs text-muted-foreground">Keep pushing to the top.</div>
                    )}
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                    <Flame className="w-3 h-3 text-foreground" aria-hidden="true" />
                    <span className="font-semibold text-foreground">{user.streak}d</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-lg font-semibold text-foreground tabular-nums">{user.score}</div>
                    <span
                      className={`text-[10px] font-semibold ${
                        user.delta >= 0 ? "text-foreground" : "text-foreground"
                      }`}
                    >
                      {user.delta >= 0 ? "+" : ""}
                      {user.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-brand-2/20 bg-brand-2/5 p-5 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-2/15 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Sparkles className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-0.5">Today&apos;s insight</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You&apos;re on track to reach the top 10% this week. Complete two more challenges to boost your score by 150+ points.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-2/15 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <BookOpen className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Recommended challenges</div>
                  <div className="text-base font-semibold text-foreground">Pick your next commitment</div>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-xs font-semibold text-foreground hover:bg-brand-2/10 px-3" asChild>
                <Link href="/challenges">
                  Browse all
                  <ChevronRight className="ml-0.5 h-3 w-3" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recommendedChallenges.map((challenge) => (
                <Link
                  key={challenge.id}
                  href="/challenges"
                  className="rounded-xl border border-border/60 bg-card/60 p-4 hover:border-brand-2/40 transition-all group block"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-2/15 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <Target className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-foreground transition-colors truncate">
                        {challenge.name}
                      </h3>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-muted-foreground">{challenge.difficulty}</span>
                        <span className="font-semibold text-foreground flex-shrink-0">{challenge.participants}</span>
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
