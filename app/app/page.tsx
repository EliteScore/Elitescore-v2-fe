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
  MoreHorizontal,
  Activity,
  ArrowUp,
  Play,
  Pause,
  RotateCcw,
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
    difficulty: "4/5",
    progress: 40,
    daysRemaining: 18,
    todayTask: "Complete 3 LeetCode medium problems",
    reward: 450,
  },
  {
    id: 2,
    name: "14-Day LinkedIn Growth",
    track: "Career Development",
    difficulty: "2/5",
    progress: 50,
    daysRemaining: 7,
    todayTask: "Post a career insight and engage",
    reward: 140,
  },
]

const leaderboardPreview = [
  { rank: 147, name: "Jordan_Dev", score: 8289, streak: 14, delta: 2, isCurrentUser: false },
  { rank: 148, name: "You", score: 8247, streak: 12, delta: 3, isCurrentUser: true },
  { rank: 149, name: "Maria_K", score: 8201, streak: 9, delta: -1, isCurrentUser: false },
]

const quickActions = [
  {
    label: "Submit proof",
    description: "Verify today",
    href: "/challenges",
    icon: Upload,
    color: "bg-brand/10",
  },
  {
    label: "View Rank",
    description: "See movement",
    href: "/leaderboard",
    icon: Trophy,
    color: "bg-orange-500/10",
  },
  {
    label: "Planner",
    description: "Map tasks",
    href: "/planner",
    icon: Calendar,
    color: "bg-brand-2/10",
  },
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
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-10 space-y-8">
        {/* Hero Section: Score & Main Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12">
            <div className="glass-card rounded-[2rem] border border-border/60 bg-card/70 p-8 md:p-12 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-brand/10 transition-colors duration-700" />

              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="space-y-6 text-center md:text-left">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Current EliteScore</p>
                    <h1 className="text-7xl md:text-9xl font-black text-foreground tracking-tighter tabular-nums drop-shadow-sm">
                      {userData.eliteScore}
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <Badge variant="secondary" className="bg-brand/15 text-foreground border-0 px-4 py-1.5 text-sm font-bold rounded-xl">
                      Global Rank #{userData.rank}
                    </Badge>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" /> Top {userData.percentile}% this week
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className="rounded-3xl border border-border/60 bg-background/40 p-6 space-y-2 backdrop-blur hover:bg-background/60 transition-colors">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Streak</p>
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="text-2xl font-black text-foreground">{userData.streak}d</span>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-border/60 bg-background/40 p-6 space-y-2 backdrop-blur hover:bg-background/60 transition-colors">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Consistency</p>
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-brand" />
                      <span className="text-2xl font-black text-foreground">{userData.weeklyConsistency}/7</span>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-border/60 bg-background/40 p-6 space-y-2 backdrop-blur hover:bg-background/60 transition-colors">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Wkly Gain</p>
                    <div className="flex items-center gap-2">
                      <ArrowUp className="w-5 h-5 text-emerald-500" />
                      <span className="text-2xl font-black text-foreground">+{userData.scoreChange}</span>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-border/60 bg-background/40 p-6 space-y-2 backdrop-blur hover:bg-background/60 transition-colors">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rank Up</p>
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-5 h-5 text-brand-2" />
                      <span className="text-2xl font-black text-foreground">+{userData.leaderboardMovement}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {/* Focus Timer Section */}
            <div className="glass-card rounded-[2rem] border border-border/60 bg-card/70 p-8 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-foreground">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Deep Work Block</h3>
                    <p className="text-xs text-muted-foreground">Focus on {nextTask.title}</p>
                  </div>
                </div>
                <Badge variant="outline" className="rounded-xl px-4 py-1.5 border-border/60 font-bold">
                  {nextTask.duration}
                </Badge>
              </div>

              <div className="flex flex-col items-center justify-center space-y-8 py-4">
                <div className="relative flex items-center justify-center">
                  <svg className="w-48 h-48 -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={553} strokeDashoffset={553 - (553 * (secondsLeft / TIMER_SECONDS))} className="text-brand transition-all duration-1000 ease-linear" strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-5xl font-black tracking-tighter tabular-nums">
                    {formatTime(secondsLeft)}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full max-w-xs">
                  <Button
                    size="lg"
                    className={`flex-1 rounded-2xl font-bold h-14 ${isTiming ? 'bg-background border border-border/60 text-foreground hover:bg-muted' : 'bg-brand text-white hover:bg-brand/90 shadow-lg shadow-brand/20'}`}
                    onClick={() => setIsTiming(!isTiming)}
                  >
                    {isTiming ? <><Pause className="mr-2 w-5 h-5" /> Pause</> : <><Play className="mr-2 w-5 h-5" /> Start Focus</>}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-2xl h-14 w-14 p-0 border-border/60"
                    onClick={() => { setIsTiming(false); setSecondsLeft(TIMER_SECONDS); }}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href} className="glass-card rounded-2xl border border-border/40 bg-card/60 p-5 hover:border-brand/40 transition-all hover:-translate-y-1 block group">
                  <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h4 className="font-bold text-sm mb-1">{action.label}</h4>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Today's Agenda Preview */}
            <div className="glass-card rounded-[2rem] border border-border/60 bg-card/70 p-6 md:p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Today&apos;s Agenda</h3>
                <Button variant="ghost" size="sm" className="rounded-xl text-xs" asChild>
                  <Link href="/planner">Edit All</Link>
                </Button>
              </div>

              <div className="space-y-4 flex-1">
                {todaysTasks.map((task) => (
                  <div key={task.id} className="group rounded-2xl border border-border/40 bg-background/20 p-5 transition-all hover:bg-background/40">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <Badge variant="secondary" className="bg-brand/10 text-brand border-0 rounded-lg text-[10px] font-black uppercase px-2 py-0">
                          {task.category}
                        </Badge>
                        <h4 className="text-sm font-bold text-foreground leading-tight">{task.title}</h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{task.challengeName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{task.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl border border-dashed border-border/60 p-6 flex flex-col items-center justify-center text-center space-y-2 opacity-60">
                  <p className="text-xs font-medium text-muted-foreground">2 more tasks remaining in your master schedule</p>
                </div>
              </div>

              <Button className="w-full mt-6 rounded-2xl bg-foreground text-background font-bold h-12 hover:opacity-90">
                Complete All for +25 XP
              </Button>
            </div>
          </div>
        </div>

        {/* Active Commitments Grid */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Active Commitments</h2>
            </div>
            <Button variant="ghost" className="rounded-xl text-sm font-bold" asChild>
              <Link href="/challenges">Explore Market <ChevronRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeChallenges.map((challenge) => (
              <div key={challenge.id} className="glass-card rounded-[2rem] border border-border/60 bg-card/70 p-6 md:p-8 hover:border-brand/40 transition-all group">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-0 rounded-lg text-[10px] font-black uppercase">
                        {challenge.track}
                      </Badge>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-widest">• Difficulty {challenge.difficulty}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-brand transition-colors leading-tight">{challenge.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{challenge.todayTask}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Potential Reward</p>
                    <p className="text-xl font-black text-foreground">+{challenge.reward} pts</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                      <span>{challenge.progress}% Complete</span>
                      <span>{challenge.daysRemaining} days left</span>
                    </div>
                    <div className="h-3 w-full bg-muted/60 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-brand to-brand-2 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.4)] transition-all duration-1000"
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button size="sm" className="flex-1 rounded-xl font-bold bg-brand text-white">Log Today&apos;s Proof</Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-xl font-bold border-border/60">Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Standings & Insight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Leaderboard Snapshot */}
          <div className="lg:col-span-12">
            <div className="glass-card rounded-[2rem] border border-border/40 bg-card/70 px-8 py-8 shadow-xl">
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-foreground">
                    <Trophy className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold">World Standing</h3>
                </div>
                <Button variant="ghost" className="rounded-xl text-sm" asChild>
                  <Link href="/leaderboard">Full Leaderboard <ChevronRight className="ml-1 w-4 h-4" /></Link>
                </Button>
              </div>

              <div className="space-y-2">
                {leaderboardPreview.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-6 p-4 rounded-2xl transition-all ${user.isCurrentUser ? 'bg-brand/10 border border-brand/20 shadow-lg shadow-brand/5' : 'hover:bg-muted/30 border border-transparent'
                      }`}
                  >
                    <div className="text-xl font-black text-muted-foreground/40 w-12 tabular-nums">#{user.rank}</div>
                    <div className="w-12 h-12 rounded-2xl bg-card border border-border/60 flex items-center justify-center font-bold text-foreground overflow-hidden shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-foreground">{user.name}</h4>
                      {user.isCurrentUser && <p className="text-[10px] font-bold text-brand uppercase tracking-tighter">Your current position</p>}
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm font-bold opacity-60">
                      <Flame className="w-4 h-4 text-orange-500" /> {user.streak}d
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-foreground tabular-nums">{user.score.toLocaleString()}</p>
                      <p className={`text-[10px] font-bold ${user.delta >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {user.delta >= 0 ? '+' : ''}{user.delta} positions
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

