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
} from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

interface Supporter {
  id: string
  email: string
  name?: string
  status: "pending" | "accepted" | "declined"
}

const activeChallenges = [
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

const completedChallenges = [
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
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null)
  const [showLockInModal, setShowLockInModal] = useState(false)
  const [showProofModal, setShowProofModal] = useState(false)
  const [showQuitConfirm, setShowQuitConfirm] = useState<number | null>(null)
  
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
    // In a real app, this would remove the challenge from active challenges
    console.log("Quitting challenge:", showQuitConfirm)
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
    setLockInStep("success")
    // Auto close after showing success
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
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-12 pb-6 md:pb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2bbcff]/5 via-background to-[#a855f7]/5" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-2 md:space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance">
              Your{" "}
              <span className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                Challenge Arena
              </span>
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground px-4">
              Lock in. Submit proof. Dominate leaderboards. Every challenge brings you closer to the top.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <Tabs defaultValue="active" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-sm md:max-w-md mx-auto grid-cols-3 mb-6 md:mb-8 bg-muted/50 h-9 md:h-10">
            <TabsTrigger value="active" className="text-[10px] md:text-xs">
              Active
            </TabsTrigger>
            <TabsTrigger value="library" className="text-[10px] md:text-xs">
              Library
            </TabsTrigger>
            <TabsTrigger value="history" className="text-[10px] md:text-xs">
              History
            </TabsTrigger>
          </TabsList>

          {/* Active Challenges Tab */}
          <TabsContent value="active" className="space-y-4 md:space-y-6">
            {activeChallenges.length > 0 ? (
              <>
                {/* Active Challenge Counter */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold">Your Active Challenges</h2>
                    <p className="text-xs text-muted-foreground">
                      {activeCount}/{MAX_ACTIVE_CHALLENGES} slots used
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${
                      activeCount >= MAX_ACTIVE_CHALLENGES
                        ? "bg-orange-500/10 text-orange-500 border-orange-500/30"
                        : "bg-[#2bbcff]/10 text-[#2bbcff] border-[#2bbcff]/30"
                    }`}
                  >
                    {activeCount}/{MAX_ACTIVE_CHALLENGES} Active
                  </Badge>
                </div>

                {/* Warning when at limit */}
                {activeCount >= MAX_ACTIVE_CHALLENGES && (
                  <div className="glass-card rounded-xl border border-orange-500/30 bg-orange-500/5 backdrop-blur-sm p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-orange-500 mb-1">Maximum Active Challenges</h3>
                        <p className="text-xs text-muted-foreground">
                          You've reached the maximum of {MAX_ACTIVE_CHALLENGES} active challenges. Complete or quit one to join another.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
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
                            <span>Difficulty: {challenge.difficulty}/5</span>
                            <span>•</span>
                            <Calendar className="w-3 h-3" />
                            <span>
                              Day {challenge.currentDay}/{challenge.totalDays}
                            </span>
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

                      <div className="bg-[#2bbcff]/5 rounded-lg p-3 mb-4 border border-[#2bbcff]/10">
                        <p className="text-xs font-medium mb-1 text-[#2bbcff]">Today's Task:</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{challenge.todayTask}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          asChild
                          className="flex-1 bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-xs h-8"
                        >
                          <Link href={`/challenges/${challenge.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuitChallenge(challenge.id)
                          }}
                          className="border-red-500/50 hover:bg-red-500/10 text-red-500 text-xs h-8 bg-transparent"
                        >
                          Quit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="glass-card rounded-xl border border-orange-500/30 bg-orange-500/5 backdrop-blur-sm p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">No Active Challenges</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your EliteScore will decay without active challenges. Lock in a challenge now.
                </p>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-xs h-9"
                >
                  Browse Challenges
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Challenge Library Tab */}
          <TabsContent value="library" className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-0 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold">Challenge Library</h2>
                <p className="text-[10px] md:text-xs text-muted-foreground">Browse and lock in your next challenge</p>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-8 bg-transparent w-full sm:w-auto">
                Filter
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {challengeLibrary.map((challenge) => (
                <div
                  key={challenge.id}
                  className="glass-card rounded-xl border border-[#a855f7]/20 bg-card/50 backdrop-blur-sm p-5 hover:border-[#a855f7]/40 transition-all cursor-pointer group"
                  onClick={() => setSelectedChallenge(challenge.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold group-hover:text-[#a855f7] transition-colors">
                          {challenge.name}
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-xs border-[#a855f7]/30 text-[#a855f7]">
                        {challenge.track}
                      </Badge>
                    </div>
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Target className="w-3 h-3" />
                      <span>Difficulty: {challenge.difficulty}/5</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      <span>{challenge.duration} days</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                    {challenge.description}
                  </p>

                  <div className="space-y-2 mb-4 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Base Reward:</span>
                      <span className="font-bold text-[#a855f7]">+{challenge.reward} EliteScore</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Completion Rate:</span>
                      <span className="font-medium">{challenge.completionRate}%</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-[#a855f7] to-[#2bbcff] hover:opacity-90 text-white border-0 text-xs h-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedChallenge(challenge.id)
                    }}
                    disabled={!canJoinChallenge}
                    title={!canJoinChallenge ? `Maximum ${MAX_ACTIVE_CHALLENGES} active challenges reached` : ""}
                  >
                    View Details
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                  {!canJoinChallenge && (
                    <p className="text-[10px] text-center text-orange-500 mt-2">
                      Max challenges reached
                    </p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Challenge History Tab */}
          <TabsContent value="history" className="space-y-4 md:space-y-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Challenge History</h2>
              <p className="text-xs text-muted-foreground">Your completed and failed challenges</p>
            </div>

            <div className="space-y-3">
              {completedChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="glass-card rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 hover:border-border transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {challenge.status === "completed" ? (
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                          <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold">{challenge.name}</h3>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              challenge.status === "completed"
                                ? "border-green-500/30 text-green-500"
                                : "border-red-500/30 text-red-500"
                            }`}
                          >
                            {challenge.status === "completed" ? "Completed" : "Failed"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Target className="w-3 h-3" />
                          <span>Difficulty: {challenge.difficulty}/5</span>
                          <span>•</span>
                          <Calendar className="w-3 h-3" />
                          <span>{challenge.duration} days</span>
                          <span>•</span>
                          <History className="w-3 h-3" />
                          <span>{challenge.completedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div
                        className={`text-sm font-bold ${
                          challenge.status === "completed" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {challenge.eliteScoreImpact} EliteScore
                      </div>
                      {challenge.streakBonus !== "0" && (
                        <div className="flex items-center gap-1 text-xs text-[#2bbcff]">
                          <Flame className="w-3 h-3" />
                          <span>{challenge.streakBonus} streak bonus</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Challenge Detail Modal */}
      {selectedChallenge && !showLockInModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedChallenge(null)}
        >
          <div
            className="glass-card rounded-none sm:rounded-2xl border-0 sm:border border-[#a855f7]/30 bg-card/95 backdrop-blur-xl p-6 max-w-2xl w-full h-full sm:h-auto sm:max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedChallengeData?.name}</h2>
                <Badge variant="outline" className="text-xs border-[#a855f7]/30 text-[#a855f7]">
                  {selectedChallengeData?.track}
                </Badge>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedChallenge(null)} className="text-xs h-8">
                Close
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold mb-2">Challenge Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedChallengeData?.description}. This challenge will push you to develop consistency and
                  discipline while building skills that matter.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold mb-2">Daily Requirement</h3>
                <div className="bg-[#2bbcff]/5 rounded-lg p-4 border border-[#2bbcff]/20">
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
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Missing a single day without proof submission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Submitting invalid or incomplete proof</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>Late submissions (after 11:59 PM on challenge day)</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
                  <p className="text-sm font-bold">{selectedChallengeData?.difficulty}/5</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="text-sm font-bold">{selectedChallengeData?.duration} days</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Base Reward</p>
                  <p className="text-sm font-bold text-[#a855f7]">+{selectedChallengeData?.reward} EliteScore</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Completion Rate</p>
                  <p className="text-sm font-bold">{selectedChallengeData?.completionRate}%</p>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-[#a855f7] to-[#2bbcff] hover:opacity-90 text-white border-0 text-sm h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleLockInStart}
                disabled={!canJoinChallenge}
              >
                {canJoinChallenge 
                  ? "Lock In Challenge" 
                  : `Maximum ${MAX_ACTIVE_CHALLENGES} Active Challenges Reached`}
              </Button>
              {!canJoinChallenge && (
                <p className="text-xs text-center text-orange-500 mt-3">
                  Complete or quit an active challenge to join a new one
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lock-In Multi-Step Modal with Supporters - Advanced UI */}
      {showLockInModal && selectedChallenge && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={handleCloseLockIn}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background Glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#a855f7]/30 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#2bbcff]/30 rounded-full blur-[80px] animate-pulse" />
            
            <div className="relative glass-card rounded-3xl border border-white/10 bg-card/95 backdrop-blur-2xl overflow-hidden">
              {/* Progress Bar */}
              <div className="h-1 bg-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-[#a855f7] to-[#2bbcff] transition-all duration-500"
                  style={{ width: lockInStep === "invite" ? "33%" : lockInStep === "confirm" ? "66%" : "100%" }}
                />
              </div>

              <div className="p-6 md:p-8">
                {/* Step 1: Invite Supporters */}
                {lockInStep === "invite" && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#a855f7]/20 to-[#2bbcff]/20 flex items-center justify-center">
                            <Users className="w-4 h-4 text-[#a855f7]" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Step 1 of 2</span>
                        </div>
                        <h2 className="text-xl font-bold">Who's got your back?</h2>
                        <p className="text-sm text-muted-foreground">Add people who'll keep you accountable</p>
                      </div>
                      <button 
                        onClick={handleCloseLockIn} 
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Challenge Preview Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#a855f7]/10 to-[#2bbcff]/10 border border-white/10 p-4">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#a855f7]/20 to-transparent rounded-full blur-2xl -mr-16 -mt-16" />
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">You're locking in</p>
                          <h3 className="font-bold">{selectedChallengeData?.name}</h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-muted-foreground">{selectedChallengeData?.duration} days</span>
                            <span className="text-xs text-[#a855f7] font-medium">+{selectedChallengeData?.reward} pts</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#2bbcff] flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Why Supporters Matter */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-[#2bbcff]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">💪</span>
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
                            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 focus:bg-white/10 transition-all"
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={addSupporter}
                          disabled={supporters.length >= 3}
                          className="h-12 px-4 bg-gradient-to-r from-[#a855f7] to-[#2bbcff] hover:opacity-90 text-white border-0 rounded-xl"
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </div>
                      {emailError && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
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
                              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#a855f7]/20 to-[#2bbcff]/20 flex items-center justify-center">
                                  <span className="text-sm font-bold bg-gradient-to-r from-[#a855f7] to-[#2bbcff] bg-clip-text text-transparent">
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
                                <X className="w-3.5 h-3.5 text-red-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {supporters.length === 0 && (
                      <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                          <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">No supporters added yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Add at least one to continue</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleCloseLockIn}
                        className="flex-1 h-12 bg-transparent border-white/10 hover:bg-white/5 rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="lg"
                        onClick={handleSendInvites}
                        disabled={supporters.length === 0}
                        className="flex-1 h-12 bg-gradient-to-r from-[#a855f7] to-[#2bbcff] hover:opacity-90 text-white border-0 rounded-xl disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Confirm Lock-In */}
                {lockInStep === "confirm" && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Step 2 of 2</span>
                        </div>
                        <h2 className="text-xl font-bold">Final confirmation</h2>
                        <p className="text-sm text-muted-foreground">This is a serious commitment</p>
                      </div>
                      <button 
                        onClick={handleCloseLockIn} 
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Warning Box */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-5">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl -mr-12 -mt-12" />
                      <div className="relative space-y-3">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-bold text-orange-500">Point of no return</span>
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
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        </div>
                        <span className="text-sm font-medium text-green-500">Invites queued</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {supporters.map((supporter) => (
                          <div key={supporter.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#a855f7]/20 to-[#2bbcff]/20 flex items-center justify-center">
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
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-xs text-muted-foreground mb-1">Start</p>
                          <p className="text-sm font-medium">Today</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-xs text-muted-foreground mb-1">End</p>
                          <p className="text-sm font-medium">
                            {new Date(Date.now() + (selectedChallengeData?.duration || 0) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-xs text-muted-foreground mb-1">Duration</p>
                          <p className="text-sm font-medium">{selectedChallengeData?.duration} days</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-br from-[#a855f7]/10 to-[#2bbcff]/10 border border-[#a855f7]/20">
                          <p className="text-xs text-muted-foreground mb-1">Reward</p>
                          <p className="text-sm font-bold text-[#a855f7]">+{selectedChallengeData?.reward} pts</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setLockInStep("invite")}
                        className="flex-1 h-12 bg-transparent border-white/10 hover:bg-white/5 rounded-xl"
                      >
                        Back
                      </Button>
                      <Button
                        size="lg"
                        onClick={handleConfirmLockIn}
                        className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white border-0 rounded-xl font-bold"
                      >
                        Lock In Now
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

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                      <Users className="w-4 h-4 text-[#a855f7]" />
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

      {/* Proof Submission Modal */}
      {showProofModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowProofModal(false)}
        >
          <div
            className="glass-card rounded-2xl border border-[#2bbcff]/30 bg-card/95 backdrop-blur-xl p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Submit Daily Proof</h2>
                <p className="text-sm text-muted-foreground">
                  Upload proof of today's task completion. Submissions are timestamped and immutable.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Proof Type</label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Button size="sm" variant="outline" className="text-xs h-9 bg-transparent">
                    Image
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-9 bg-transparent">
                    Link
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-9 bg-transparent">
                    Text
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Upload Proof</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-[#2bbcff]/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
                <textarea
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#2bbcff]/50 resize-none"
                  rows={3}
                  placeholder="Add any additional context..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowProofModal(false)}
                  className="flex-1 text-sm h-10 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-sm h-10"
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
      {/* Quit Challenge Confirmation Modal */}
      {showQuitConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowQuitConfirm(null)}
        >
          <div
            className="glass-card rounded-2xl border border-red-500/30 bg-card/95 backdrop-blur-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Quit Challenge?</h3>
                <p className="text-sm text-muted-foreground">
                  Quitting will result in a failed challenge and -35 EliteScore penalty. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowQuitConfirm(null)}
                className="flex-1 border-border/50 hover:bg-muted/50 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmQuitChallenge}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0"
              >
                Quit Challenge
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
