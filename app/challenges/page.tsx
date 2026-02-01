"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Trophy,
  Target,
  Calendar,
  Clock,
  Lock,
  Upload,
  CheckCircle2,
  XCircle,
  Flame,
  AlertTriangle,
  ChevronRight,
  History,
  Users,
  Mail,
  X,
  Check,
  Send,
  UserPlus,
  ListTodo,
  BookOpen,
  Award,
} from "lucide-react"
import Link from "next/link"

interface Supporter {
  id: string
  email: string
  name?: string
  status: "pending" | "accepted" | "declined"
}

type ActiveChallenge = {
  id: number
  name: string
  difficulty: number
  currentDay: number
  totalDays: number
  daysRemaining: number
  todayTask: string
  progress: number
  reward: number
  track: string
}

type HistoryChallenge = {
  id: number
  name: string
  difficulty: number
  duration: number
  status: "completed" | "failed"
  completedDate: string
  eliteScoreImpact: string
  streakBonus: string
}

const INITIAL_ACTIVE_CHALLENGES: ActiveChallenge[] = [
  {
    id: 1,
    name: "30-Day Python Mastery",
    difficulty: 4,
    currentDay: 12,
    totalDays: 30,
    daysRemaining: 18,
    todayTask: "Complete 3 LeetCode medium problems using Python",
    progress: 40,
    reward: 450,
    track: "Technical Skills",
  },
  {
    id: 2,
    name: "14-Day LinkedIn Growth",
    difficulty: 2,
    currentDay: 7,
    totalDays: 14,
    daysRemaining: 7,
    todayTask: "Post a career insight and engage with 5 posts in your industry",
    progress: 50,
    reward: 140,
    track: "Career Development",
  },
]

const challengeLibrary = [
  {
    id: 3,
    name: "21-Day Morning Routine",
    track: "Wellness",
    difficulty: 2,
    duration: 21,
    reward: 180,
    completionRate: 67,
    description: "Wake up at 6 AM, exercise for 20 minutes, and journal for 10 minutes",
  },
  {
    id: 4,
    name: "7-Day SQL Bootcamp",
    track: "Technical Skills",
    difficulty: 3,
    duration: 7,
    reward: 90,
    completionRate: 78,
    description: "Master SQL fundamentals with daily practice and real-world database projects",
  },
  {
    id: 5,
    name: "30-Day Public Speaking Challenge",
    track: "Career Development",
    difficulty: 5,
    duration: 30,
    reward: 600,
    completionRate: 42,
    description: "Record and share a 2-minute presentation daily on professional topics",
  },
  {
    id: 6,
    name: "14-Day Reading Sprint",
    track: "Learning",
    difficulty: 2,
    duration: 14,
    reward: 140,
    completionRate: 71,
    description: "Read 30 pages daily from career or skill development books",
  },
  {
    id: 7,
    name: "21-Day Portfolio Builder",
    track: "Career Development",
    difficulty: 4,
    duration: 21,
    reward: 280,
    completionRate: 55,
    description: "Build and deploy one project feature daily to showcase your skills",
  },
  {
    id: 8,
    name: "7-Day Meditation Mastery",
    track: "Wellness",
    difficulty: 1,
    duration: 7,
    reward: 70,
    completionRate: 82,
    description: "Complete 15 minutes of guided meditation every morning",
  },
]

const INITIAL_HISTORY_CHALLENGES: HistoryChallenge[] = [
  {
    id: 101,
    name: "14-Day JavaScript Sprint",
    difficulty: 3,
    duration: 14,
    status: "completed",
    completedDate: "2025-01-10",
    eliteScoreImpact: "+140",
    streakBonus: "+20",
  },
  {
    id: 102,
    name: "7-Day Cold Outreach",
    difficulty: 2,
    duration: 7,
    status: "failed",
    completedDate: "2024-12-28",
    eliteScoreImpact: "-35",
    streakBonus: "0",
  },
]

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState<string>("active")
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null)
  const [showLockInModal, setShowLockInModal] = useState(false)
  const [showProofModal, setShowProofModal] = useState(false)
  const [showQuitConfirm, setShowQuitConfirm] = useState<number | null>(null)

  const [activeChallenges, setActiveChallenges] = useState<ActiveChallenge[]>(INITIAL_ACTIVE_CHALLENGES)
  const [historyChallenges, setHistoryChallenges] = useState<HistoryChallenge[]>(INITIAL_HISTORY_CHALLENGES)

  // Supporter lock-in flow state
  const [lockInStep, setLockInStep] = useState<"invite" | "confirm" | "success">("invite")
  const [supporters, setSupporters] = useState<Supporter[]>([])
  const [newSupporterEmail, setNewSupporterEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  // Max 2 active challenges limit
  const MAX_ACTIVE_CHALLENGES = 2
  const activeCount = activeChallenges.length
  const canJoinChallenge = activeCount < MAX_ACTIVE_CHALLENGES

  const selectedChallengeData = challengeLibrary.find((c) => c.id === selectedChallenge)
  const isAlreadyEnrolled =
    selectedChallenge !== null && activeChallenges.some((c) => c.id === selectedChallenge)

  // Daily tasks / upcoming assignments from active challenges (for "Today" section)
  const dailyTasksFromChallenges = activeChallenges.map((c) => ({
    id: c.id,
    challengeName: c.name,
    todayTask: c.todayTask,
    daysRemaining: c.daysRemaining,
    progress: c.progress,
  }))

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const addSupporter = () => {
    if (!newSupporterEmail.trim()) {
      setEmailError("Email is required")
      return
    }
    if (!validateEmail(newSupporterEmail)) {
      setEmailError("Please enter a valid email")
      return
    }
    if (supporters.length >= 3) {
      setEmailError("Maximum 3 supporters allowed")
      return
    }
    if (supporters.some(s => s.email.toLowerCase() === newSupporterEmail.toLowerCase())) {
      setEmailError("This email is already added")
      return
    }
    
    setSupporters([...supporters, {
      id: Date.now().toString(),
      email: newSupporterEmail,
      status: "pending"
    }])
    setNewSupporterEmail("")
    setEmailError("")
  }

  const removeSupporter = (id: string) => {
    setSupporters(supporters.filter(s => s.id !== id))
  }

  const handleLockInStart = () => {
    if (!canJoinChallenge) {
      return // Don't allow joining if at max capacity
    }
    setLockInStep("invite")
    setSupporters([])
    setNewSupporterEmail("")
    setEmailError("")
    setShowLockInModal(true)
  }

  const handleQuitChallenge = (challengeId: number) => {
    setShowQuitConfirm(challengeId)
  }

  const confirmQuitChallenge = () => {
    if (showQuitConfirm === null) return
    const quitChallenge = activeChallenges.find((c) => c.id === showQuitConfirm)
    if (quitChallenge) {
      setActiveChallenges((prev) => prev.filter((c) => c.id !== showQuitConfirm))
      setHistoryChallenges((prev) => [
        {
          id: Date.now(),
          name: quitChallenge.name,
          difficulty: quitChallenge.difficulty,
          duration: quitChallenge.totalDays,
          status: "failed",
          completedDate: new Date().toISOString().slice(0, 10),
          eliteScoreImpact: "-35",
          streakBonus: "0",
        },
        ...prev,
      ])
    }
    setShowQuitConfirm(null)
  }

  const handleSendInvites = () => {
    if (supporters.length === 0) {
      setEmailError("Add at least one supporter to continue")
      return
    }
    // Simulate sending invites (frontend only)
    setLockInStep("confirm")
  }

  const handleConfirmLockIn = () => {
    if (!selectedChallengeData) return
    const alreadyEnrolled = activeChallenges.some((c) => c.id === selectedChallengeData.id)
    if (!alreadyEnrolled) {
      const newActive: ActiveChallenge = {
        id: selectedChallengeData.id,
        name: selectedChallengeData.name,
        difficulty: selectedChallengeData.difficulty,
        currentDay: 1,
        totalDays: selectedChallengeData.duration,
        daysRemaining: selectedChallengeData.duration - 1,
        todayTask: `Start your first day  ${selectedChallengeData.description.slice(0, 60)}...`,
        progress: 0,
        reward: selectedChallengeData.reward,
        track: selectedChallengeData.track,
      }
      setActiveChallenges((prev) => [...prev, newActive])
    }
    setLockInStep("success")
    setTimeout(() => {
      setShowLockInModal(false)
      setSelectedChallenge(null)
      setLockInStep("invite")
      setSupporters([])
    }, 2000)
  }

  const handleCloseLockIn = () => {
    setShowLockInModal(false)
    setLockInStep("invite")
    setSupporters([])
    setNewSupporterEmail("")
    setEmailError("")
  }

  return (
    <div className="min-h-[100dvh] sm:min-h-screen bg-background pb-[max(5rem,calc(5rem+env(safe-area-inset-bottom)))] pt-[env(safe-area-inset-top)] overflow-x-hidden">
      {/* Hero - mobile-first: compact, single column */}
      <section className="container mx-auto px-3 sm:px-4 pt-4 sm:pt-6 md:pt-8 pb-3 sm:pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-xl sm:rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-6 md:p-8 shadow-xl">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/15 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Challenges  Arena</div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-black text-foreground leading-tight truncate sm:truncate-none">
                    Your commitments
                  </h1>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed sm:text-right">
                Lock in. Submit proof. Every challenge brings you closer to the top.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - mobile: full width, touch-friendly tabs */}
      <section className="container mx-auto px-3 sm:px-4 pb-6 sm:pb-12 md:pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 md:mb-8 glass-card rounded-xl border border-border/60 bg-muted/50 min-h-[44px] sm:h-11 p-1">
            <TabsTrigger value="active" className="text-xs font-semibold text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg min-h-[40px] sm:min-h-0 py-2.5 sm:py-0">
              Active
            </TabsTrigger>
            <TabsTrigger value="library" className="text-xs font-semibold text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg min-h-[40px] sm:min-h-0 py-2.5 sm:py-0">
              Library
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs font-semibold text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg min-h-[40px] sm:min-h-0 py-2.5 sm:py-0">
              History
            </TabsTrigger>
          </TabsList>

          {/* Active Tab: Today's tasks first, then Enrolled challenges */}
          <TabsContent value="active" className="space-y-5 sm:space-y-8 mt-0">
            {/* 1. Today's tasks / Daily assignments */}
            <div className="glass-card rounded-xl sm:rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand/15 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <ListTodo className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Today  Daily tasks</div>
                  <div className="text-sm sm:text-base font-bold text-foreground">
                    {dailyTasksFromChallenges.length > 0
                      ? `${dailyTasksFromChallenges.length} task${dailyTasksFromChallenges.length > 1 ? "s" : ""} from your challenges`
                      : "No tasks today"}
                  </div>
                </div>
              </div>

              {dailyTasksFromChallenges.length > 0 ? (
                <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                  {dailyTasksFromChallenges.map((task) => (
                    <Link
                      key={task.id}
                      href={`/challenges/${task.id}`}
                      className="glass-card rounded-xl border border-border/60 bg-card/60 p-3.5 sm:p-4 hover:border-border/60 active:scale-[0.99] transition-all flex items-start gap-3 group block min-h-[56px] touch-manipulation"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand/15 flex items-center justify-center flex-shrink-0 group-hover:bg-[#2563eb]/20 transition-colors" aria-hidden="true">
                        <Check className="w-4 h-4 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground mb-0.5 group-hover:text-foreground transition-colors line-clamp-2">{task.todayTask}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{task.challengeName}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border/60 bg-muted/40 p-4 sm:p-6 text-center">
                  <p className="text-sm text-muted-foreground">Enroll in a challenge to see daily tasks here.</p>
                  <Button size="sm" variant="ghost" className="mt-3 min-h-[44px] text-foreground hover:bg-brand/15 touch-manipulation" onClick={() => setActiveTab("library")}>
                    Browse Library
                    <ChevronRight className="ml-0.5 h-3 w-3" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>

            {/* 2. Enrolled challenges */}
            <div className="glass-card rounded-xl sm:rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Trophy className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Enrolled  Your commitments</div>
                    <div className="text-base font-bold text-foreground">{activeCount}/{MAX_ACTIVE_CHALLENGES} slots used</div>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={activeCount >= MAX_ACTIVE_CHALLENGES ? "bg-orange-500/10 text-foreground border-orange-500/30" : "bg-brand/15 text-foreground border-border/60"}
                  aria-label={`${activeCount} of ${MAX_ACTIVE_CHALLENGES} active challenges`}
                >
                  {activeCount}/{MAX_ACTIVE_CHALLENGES} Active
                </Badge>
              </div>

              {activeCount >= MAX_ACTIVE_CHALLENGES && (
                <div className="glass-card rounded-xl border border-orange-500/20 bg-orange-500/5 backdrop-blur-sm p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-0.5">Maximum active challenges</div>
                      <p className="text-xs text-muted-foreground">
                        Complete or quit one to join another.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {activeChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="glass-card rounded-xl border border-border/60 bg-card/60 p-3.5 sm:p-4 hover:border-border/60 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2.5 sm:mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <h3 className="text-sm font-bold text-foreground truncate">{challenge.name}</h3>
                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-brand/15 text-foreground border-border/60 flex-shrink-0">
                              Active
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                            <Target className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                            {challenge.difficulty}/5
                            <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                              {challenge.track}
                            </span>
                            <Calendar className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                            Day {challenge.currentDay}/{challenge.totalDays}
                          </div>
                        </div>
                        <Trophy className="w-5 h-5 text-foreground flex-shrink-0" aria-hidden="true" />
                      </div>

                      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                        <div className="glass-card rounded-lg border border-border/60 bg-muted/40 p-2 sm:p-2.5">
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Progress</span>
                            <span className="text-xs font-bold text-foreground">{challenge.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand to-brand-2 rounded-full transition-all duration-500"
                              style={{ width: `${challenge.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                          <Clock className="w-3 h-3 text-foreground shrink-0" aria-hidden="true" />
                          {challenge.daysRemaining} days left
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Reward: <span className="font-semibold text-foreground">+{challenge.reward} pts</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Next milestone: <span className="font-semibold text-foreground">Day {challenge.currentDay + 1}</span>
                        </div>
                      </div>

                      <div className="glass-card rounded-lg border border-border/60 bg-brand/5 p-2.5 sm:p-3 mb-3 sm:mb-4">
                        <div className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-0.5">Today&apos;s task</div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{challenge.todayTask}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          size="sm"
                          className="flex-1 min-h-[44px] sm:h-8 bg-foreground hover:bg-foreground/90 text-background border-0 text-[10px] font-bold uppercase tracking-wider touch-manipulation"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowProofModal(true)
                          }}
                        >
                          Submit proof
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 min-h-[44px] sm:h-8 text-[10px] font-bold uppercase tracking-wider bg-transparent touch-manipulation"
                          asChild
                        >
                          <Link href={`/challenges/${challenge.id}`}>View details</Link>
                        </Button>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleQuitChallenge(challenge.id)
                        }}
                        className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      >
                        Quit challenge
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-xl border border-orange-500/20 bg-orange-500/5 backdrop-blur-sm p-5 sm:p-8 text-center">
                  <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-foreground mx-auto mb-2 sm:mb-3" aria-hidden="true" />
                  <div className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1">No active challenges</div>
                  <h3 className="text-base sm:text-lg font-bold mb-2">Lock in a challenge</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your credibility grows with finished work. Browse the library and commit.
                  </p>
                  <Button size="sm" className="min-h-[48px] sm:h-9 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] hover:opacity-90 text-white border-0 text-[10px] font-bold uppercase tracking-wider touch-manipulation" onClick={() => setActiveTab("library")}>
                    Browse Library
                    <ArrowRight className="ml-2 h-3 w-3" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Challenge Library Tab */}
          <TabsContent value="library" className="space-y-5 sm:space-y-8 mt-0">
            <div className="glass-card rounded-xl sm:rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-6 md:p-8 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-foreground" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Weekly boss challenge</div>
                    <div className="text-base font-semibold text-foreground">High difficulty, high reward</div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-muted text-muted-foreground border-border/60 text-xs">
                  #3 Boss
                </Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <div className="text-xs text-muted-foreground">Reward</div>
                  <div className="mt-1 text-sm font-semibold text-foreground">+600 pts</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <div className="text-xs text-muted-foreground">Difficulty</div>
                  <div className="mt-1 text-sm font-semibold text-foreground">5/5</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <div className="text-xs text-muted-foreground">Timebox</div>
                  <div className="mt-1 text-sm font-semibold text-foreground">7 days</div>
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button className="flex-1 bg-foreground hover:bg-foreground/90 text-background">
                  View boss challenge
                </Button>
                <Button variant="outline" className="flex-1">
                  Learn rules
                </Button>
              </div>
            </div>
            <div className="glass-card rounded-xl sm:rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-2/15 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Library  Browse</div>
                    <div className="text-sm sm:text-base font-bold text-foreground truncate">Lock in your next commitment</div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-[10px] min-h-[40px] h-8 font-bold uppercase tracking-wider text-foreground hover:bg-brand-2/10 px-2.5 sm:px-3 shrink-0 touch-manipulation">
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {challengeLibrary.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="glass-card rounded-xl border border-border/60 bg-card/60 p-3.5 sm:p-4 hover:border-brand-2/40 active:scale-[0.99] transition-all cursor-pointer group touch-manipulation"
                    onClick={() => setSelectedChallenge(challenge.id)}
                  >
                    <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-2/15 flex items-center justify-center flex-shrink-0 group-hover:bg-[#7c3aed]/20 transition-colors" aria-hidden="true">
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-foreground mb-0.5 group-hover:text-foreground transition-colors line-clamp-2">
                          {challenge.name}
                        </h3>
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-border/60 text-foreground">
                          {challenge.track}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 sm:mb-2">
                      <Target className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                      {challenge.difficulty}/5
                      <Calendar className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                      {challenge.duration}d
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                      {challenge.description}
                    </p>

                    <div className="glass-card rounded-lg border border-border/60 bg-muted/40 p-2 sm:p-2.5 mb-3 sm:mb-4">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground uppercase tracking-wider">Reward</span>
                        <span className="font-bold text-foreground">+{challenge.reward}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] mt-0.5">
                        <span className="text-muted-foreground uppercase tracking-wider">Completion</span>
                        <span className="font-bold text-foreground">{challenge.completionRate}%</span>
                      </div>
                      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-2/70 rounded-full"
                          style={{ width: `${challenge.completionRate}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full min-h-[44px] sm:h-8 bg-brand-2 hover:bg-brand-2/90 text-white border-0 text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedChallenge(challenge.id)
                      }}
                      disabled={!canJoinChallenge}
                      title={!canJoinChallenge ? `Maximum ${MAX_ACTIVE_CHALLENGES} active challenges reached` : ""}
                    >
                      View Details
                      <ChevronRight className="ml-0.5 h-3 w-3" aria-hidden="true" />
                    </Button>
                    {!canJoinChallenge && (
                      <p className="text-[10px] text-center text-foreground mt-2 uppercase tracking-wider">
                        Max challenges reached
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Challenge History Tab */}
          <TabsContent value="history" className="space-y-5 sm:space-y-8 mt-0">
            <div className="glass-card rounded-xl sm:rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand/15 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <History className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">History  Completed & Failed</div>
                  <div className="text-sm sm:text-base font-bold text-foreground">Your past commitments</div>
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {historyChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="glass-card rounded-xl border border-border/60 bg-card/60 p-3.5 sm:p-4 hover:border-border/60 transition-all"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
                      {challenge.status === "completed" ? (
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                          <CheckCircle2 className="w-5 h-5 text-foreground" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                          <XCircle className="w-5 h-5 text-foreground" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 order-2 sm:order-none">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h3 className="text-sm font-bold text-foreground">{challenge.name}</h3>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                              challenge.status === "completed"
                                ? "border-green-500/30 text-foreground"
                                : "border-red-500/30 text-foreground"
                            }`}
                          >
                            {challenge.status === "completed" ? "Done" : "Failed"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider flex-wrap">
                          <Target className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                          {challenge.difficulty}/5
                          <span className="mx-0.5"></span>
                          <Calendar className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                          {challenge.duration}d
                          <span className="mx-0.5"></span>
                          {challenge.completedDate}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 w-full sm:w-auto order-1 sm:order-none">
                        <div
                          className={`text-sm font-bold ${
                            challenge.status === "completed" ? "text-foreground" : "text-foreground"
                          }`}
                        >
                          {challenge.eliteScoreImpact} EliteScore
                        </div>
                        {challenge.streakBonus !== "0" && (
                          <div className="flex items-center justify-end gap-0.5 text-[10px] text-foreground uppercase tracking-wider mt-0.5">
                            <Flame className="w-2.5 h-2.5" aria-hidden="true" />
                            {challenge.streakBonus} streak bonus
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Challenge Detail Modal - full screen on mobile */}
      {selectedChallenge && !showLockInModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pt-[env(safe-area-inset-top)]"
          onClick={() => setSelectedChallenge(null)}
        >
          <div
            className="glass-card rounded-t-2xl sm:rounded-2xl border-0 sm:border border-border/60 bg-card/95 backdrop-blur-xl p-4 sm:p-6 max-w-2xl w-full max-h-[92dvh] sm:max-h-[85vh] overflow-y-auto overscroll-contain touch-manipulation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2 mb-4 pb-2 border-b border-border/60">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold mb-1 leading-tight">{selectedChallengeData?.name}</h2>
                <Badge variant="outline" className="text-[10px] sm:text-xs border-border/60 text-foreground">
                  {selectedChallengeData?.track}
                </Badge>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedChallenge(null)} className="text-xs min-h-[44px] min-w-[44px] shrink-0 touch-manipulation" aria-label="Close">
                Close
              </Button>
            </div>

            <div className="space-y-4 sm:space-y-6 pt-2">
              <div>
                <h3 className="text-sm font-bold mb-2">Challenge Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedChallengeData?.description}. This challenge will push you to develop consistency and
                  discipline while building skills that matter.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold mb-2">Daily Requirement</h3>
                <div className="bg-brand/5 rounded-lg p-4 border border-border/60">
                  <p className="text-sm font-medium leading-relaxed">{selectedChallengeData?.description}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold mb-2">Proof Type Required</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Screenshot, photo, or link showing completion of daily task. Submissions are timestamped and
                  immutable.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold mb-2">Failure Conditions</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-foreground mt-0.5"></span>
                    <span>Missing a single day without proof submission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground mt-0.5"></span>
                    <span>Submitting invalid or incomplete proof</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground mt-0.5"></span>
                    <span>Late submissions (after 11:59 PM on challenge day)</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-border/50">
                <div className="p-2 sm:p-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Difficulty</p>
                  <p className="text-sm font-bold">{selectedChallengeData?.difficulty}/5</p>
                </div>
                <div className="p-2 sm:p-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Duration</p>
                  <p className="text-sm font-bold">{selectedChallengeData?.duration} days</p>
                </div>
                <div className="p-2 sm:p-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Base Reward</p>
                  <p className="text-sm font-bold text-foreground">+{selectedChallengeData?.reward}</p>
                </div>
                <div className="p-2 sm:p-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Completion</p>
                  <p className="text-sm font-bold">{selectedChallengeData?.completionRate}%</p>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full min-h-[48px] sm:h-11 bg-gradient-to-r from-[#7c3aed] to-[#2563eb] hover:opacity-90 text-white border-0 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                onClick={handleLockInStart}
                disabled={!canJoinChallenge || isAlreadyEnrolled}
              >
                {isAlreadyEnrolled
                  ? "Already enrolled"
                  : canJoinChallenge
                    ? "Lock In Challenge"
                    : `Maximum ${MAX_ACTIVE_CHALLENGES} Active Challenges Reached`}
              </Button>
              {!canJoinChallenge && !isAlreadyEnrolled && (
                <p className="text-xs text-center text-foreground mt-3">
                  Complete or quit an active challenge to join a new one
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lock-In Multi-Step Modal - full height on mobile, scrollable */}
      {showLockInModal && selectedChallenge && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pt-[env(safe-area-inset-top)]"
          onClick={handleCloseLockIn}
        >
          <div
            className="relative w-full max-w-lg max-h-[96dvh] sm:max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background Glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#7c3aed]/30 rounded-full blur-[80px] animate-pulse pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#2563eb]/30 rounded-full blur-[80px] animate-pulse pointer-events-none" aria-hidden="true" />
            
            <div className="relative glass-card rounded-t-2xl sm:rounded-3xl border-0 sm:border border-border/60 bg-card/95 backdrop-blur-2xl overflow-hidden flex flex-col max-h-[96dvh] sm:max-h-[90vh]">
              {/* Progress Bar */}
              <div className="h-1 bg-muted/40 shrink-0" aria-hidden="true">
                <div 
                  className="h-full bg-gradient-to-r from-[#7c3aed] to-[#2563eb] transition-all duration-500"
                  style={{ width: lockInStep === "invite" ? "33%" : lockInStep === "confirm" ? "66%" : "100%" }}
                />
              </div>

              <div className="p-4 sm:p-6 md:p-8 overflow-y-auto overscroll-contain flex-1 min-h-0">
                {/* Step 1: Invite Supporters */}
                {lockInStep === "invite" && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed]/20 to-[#2563eb]/20 flex items-center justify-center">
                            <Users className="w-4 h-4 text-foreground" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Step 1 of 2</span>
                        </div>
                        <h2 className="text-xl font-bold">Who's got your back?</h2>
                        <p className="text-sm text-muted-foreground">Add people who'll keep you accountable</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCloseLockIn}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-border/60 text-foreground"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Challenge Preview Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7c3aed]/10 to-[#2563eb]/10 border border-border/60 p-4">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#7c3aed]/20 to-transparent rounded-full blur-2xl -mr-16 -mt-16" />
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">You're locking in</p>
                          <h3 className="font-bold">{selectedChallengeData?.name}</h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-muted-foreground">{selectedChallengeData?.duration} days</span>
                            <span className="text-xs text-foreground font-medium">+{selectedChallengeData?.reward} pts</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#2563eb] flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Why Supporters Matter */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border/60">
                      <div className="w-10 h-10 rounded-full bg-brand/15 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg"></span>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Accountability partners increase success by 65%</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Your supporters will receive daily updates and can send you motivation when you need it most.
                        </p>
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Add supporter email</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="email"
                            value={newSupporterEmail}
                            onChange={(e) => {
                              setNewSupporterEmail(e.target.value)
                              setEmailError("")
                            }}
                            onKeyDown={(e) => e.key === "Enter" && addSupporter()}
                            placeholder="friend@email.com"
                            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-border/60 bg-muted/40 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 focus:bg-white/10 transition-all"
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={addSupporter}
                          disabled={supporters.length >= 3}
                          className="h-12 px-4 bg-gradient-to-r from-[#7c3aed] to-[#2563eb] hover:opacity-90 text-white border-0 rounded-xl"
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </div>
                      {emailError && (
                        <p className="text-xs text-foreground flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-500" />
                          {emailError}
                        </p>
                      )}
                    </div>

                    {/* Supporters List */}
                    {supporters.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Your squad</label>
                          <span className="text-xs text-muted-foreground">{supporters.length}/3 added</span>
                        </div>
                        <div className="space-y-2">
                          {supporters.map((supporter, index) => (
                            <div
                              key={supporter.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-white/10 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7c3aed]/20 to-[#2563eb]/20 flex items-center justify-center">
                                  <span className="text-sm font-bold bg-gradient-to-r from-[#7c3aed] to-[#2563eb] text-foreground">
                                    {supporter.email.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">{supporter.email}</span>
                                  <p className="text-xs text-muted-foreground">Supporter #{index + 1}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeSupporter(supporter.id)}
                                className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-all"
                              >
                                <X className="w-3.5 h-3.5 text-foreground" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {supporters.length === 0 && (
                      <div className="text-center py-6 border border-dashed border-border/60 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mx-auto mb-3">
                          <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">No supporters added yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Add at least one to continue</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-border/60">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleCloseLockIn}
                        className="flex-1 h-12 min-h-[48px] bg-muted/40 border-white/25 text-foreground hover:bg-white/15 rounded-xl font-semibold text-sm"
                        aria-label="Cancel and close"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="lg"
                        onClick={handleSendInvites}
                        disabled={supporters.length === 0}
                        className="flex-1 h-12 min-h-[48px] bg-gradient-to-r from-[#2563eb] to-[#7c3aed] hover:opacity-95 text-white border-0 rounded-xl font-bold text-sm shadow-lg shadow-[#2563eb]/25 disabled:opacity-50 disabled:shadow-none"
                        aria-label="Continue to confirmation"
                      >
                        <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Confirm Lock-In */}
                {lockInStep === "confirm" && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-foreground" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Step 2 of 2</span>
                        </div>
                        <h2 className="text-xl font-bold">Final confirmation</h2>
                        <p className="text-sm text-muted-foreground">This is a serious commitment</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCloseLockIn}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-border/60 text-foreground"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Warning Box */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-5">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl -mr-12 -mt-12" />
                      <div className="relative space-y-3">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-foreground" />
                          <span className="text-sm font-bold text-foreground">Point of no return</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Once you lock in, there's <span className="font-bold text-foreground">no backing out</span>. 
                          Miss a day without proof and your EliteScore takes a hit. 
                          This is how we separate the serious from the casual.
                        </p>
                      </div>
                    </div>

                    {/* Supporters Confirmed */}
                    <div className="rounded-2xl bg-green-500/5 border border-green-500/20 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">Invites queued</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {supporters.map((supporter) => (
                          <div key={supporter.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/60">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#7c3aed]/20 to-[#2563eb]/20 flex items-center justify-center">
                              <span className="text-[10px] font-bold">{supporter.email.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="text-xs">{supporter.email.split("@")[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Challenge Summary */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Challenge details</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                          <p className="text-xs text-muted-foreground mb-1">Start</p>
                          <p className="text-sm font-medium">Today</p>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                          <p className="text-xs text-muted-foreground mb-1">End</p>
                          <p className="text-sm font-medium">
                            {new Date(Date.now() + (selectedChallengeData?.duration || 0) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                          <p className="text-xs text-muted-foreground mb-1">Duration</p>
                          <p className="text-sm font-medium">{selectedChallengeData?.duration} days</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-br from-[#7c3aed]/10 to-[#2563eb]/10 border border-border/60">
                          <p className="text-xs text-muted-foreground mb-1">Reward</p>
                          <p className="text-sm font-bold text-foreground">+{selectedChallengeData?.reward} pts</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - high contrast so they're always visible */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/60">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setLockInStep("invite")}
                        className="flex-1 h-12 min-h-[48px] bg-muted/40 border-white/25 text-foreground hover:bg-white/15 hover:border-white/35 rounded-xl font-semibold text-sm"
                        aria-label="Go back to invite step"
                      >
                        Back
                      </Button>
                      <Button
                        size="lg"
                        onClick={handleConfirmLockIn}
                        className="flex-1 h-12 min-h-[48px] bg-gradient-to-r from-[#2563eb] to-[#7c3aed] hover:opacity-95 text-white border-0 rounded-xl font-bold text-sm shadow-lg shadow-[#2563eb]/25"
                        aria-label="Lock in challenge now"
                      >
                        I&apos;m committed  Lock In
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Success */}
                {lockInStep === "success" && (
                  <div className="text-center py-8 space-y-6">
                    {/* Success Animation */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-green-500/20 animate-ping" />
                      </div>
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">You're locked in!</h2>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Your journey starts now. Your supporters have been notified and are ready to cheer you on.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/40 border border-border/60">
                      <Users className="w-4 h-4 text-foreground" />
                      <span className="text-sm">{supporters.length} supporter{supporters.length > 1 ? "s" : ""} watching</span>
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <span>Redirecting to your challenge</span>
                        <span className="flex gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proof Submission Modal - mobile friendly */}
      {showProofModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pt-[env(safe-area-inset-top)]"
          onClick={() => setShowProofModal(false)}
        >
          <div
            className="glass-card rounded-t-2xl sm:rounded-2xl border-0 sm:border border-border/60 bg-card/95 backdrop-blur-xl p-4 sm:p-6 max-w-lg w-full max-h-[90dvh] sm:max-h-[85vh] overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4 pb-[env(safe-area-inset-bottom)]">
              <div>
                <h2 className="text-lg sm:text-xl font-bold mb-2">Submit Daily Proof</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Upload proof of today&apos;s task completion. Submissions are timestamped and immutable.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Proof Type</label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Button size="sm" variant="outline" className="text-xs min-h-[44px] sm:h-9 bg-transparent touch-manipulation">
                    Image
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs min-h-[44px] sm:h-9 bg-transparent touch-manipulation">
                    Link
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs min-h-[44px] sm:h-9 bg-transparent touch-manipulation">
                    Text
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Upload Proof</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 sm:p-8 text-center hover:border-[#2563eb]/50 transition-colors cursor-pointer min-h-[120px] flex flex-col items-center justify-center touch-manipulation">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2 shrink-0" aria-hidden="true" />
                  <p className="text-sm font-medium mb-1">Tap to upload</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
                <textarea
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#2563eb]/50 resize-none min-h-[80px]"
                  rows={3}
                  placeholder="Add any additional context..."
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowProofModal(false)}
                  className="flex-1 min-h-[48px] sm:h-10 text-sm bg-transparent touch-manipulation"
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  className="flex-1 min-h-[48px] sm:h-10 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] hover:opacity-90 text-white border-0 text-sm touch-manipulation"
                  onClick={() => setShowProofModal(false)}
                >
                  Submit Proof
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {/* Quit Challenge Confirmation Modal - mobile friendly */}
      {showQuitConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 pt-[env(safe-area-inset-top)] pb-[max(1rem,env(safe-area-inset-bottom))]"
          onClick={() => setShowQuitConfirm(null)}
        >
          <div
            className="glass-card rounded-2xl border border-red-500/30 bg-card/95 backdrop-blur-xl p-4 sm:p-6 max-w-md w-full mx-0 sm:mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <AlertTriangle className="w-5 h-5 text-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold mb-1">Quit Challenge?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Quitting will result in a failed challenge and -35 EliteScore penalty. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={() => setShowQuitConfirm(null)}
                className="flex-1 min-h-[48px] sm:h-10 border-border/50 hover:bg-muted/50 bg-transparent touch-manipulation"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmQuitChallenge}
                className="flex-1 min-h-[48px] sm:h-10 bg-red-500 hover:bg-red-600 text-white border-0 touch-manipulation"
              >
                Quit Challenge
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

