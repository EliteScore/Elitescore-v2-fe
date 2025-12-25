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
} from "lucide-react"
import Image from "next/image"

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

  const selectedChallengeData = challengeLibrary.find((c) => c.id === selectedChallenge)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="EliteScore" width={40} height={40} className="w-6 h-6 md:w-7 md:h-7" />
              <span className="text-base md:text-lg font-bold bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                ELITESCORE
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button size="sm" variant="ghost" className="hidden sm:flex text-xs h-8">
                Dashboard
              </Button>
              <Button size="sm" variant="ghost" className="hidden sm:flex text-xs h-8">
                Leaderboard
              </Button>
              <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-full bg-gradient-to-r from-[#2bbcff]/10 to-[#a855f7]/10 border border-[#2bbcff]/30">
                <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#2bbcff]" />
                <span className="text-[10px] md:text-xs font-bold">1,250</span>
              </div>
            </div>
          </nav>
        </div>
      </header>

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
                          onClick={() => setShowProofModal(true)}
                          className="flex-1 bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-xs h-8"
                        >
                          <Upload className="w-3 h-3 mr-1.5" />
                          Submit Proof
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#2bbcff]/50 hover:bg-[#2bbcff]/10 text-xs h-8 bg-transparent"
                        >
                          Details
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
                    className="w-full bg-gradient-to-r from-[#a855f7] to-[#2bbcff] hover:opacity-90 text-white border-0 text-xs h-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedChallenge(challenge.id)
                      setShowLockInModal(true)
                    }}
                  >
                    View Details
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
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
                className="w-full bg-gradient-to-r from-[#a855f7] to-[#2bbcff] hover:opacity-90 text-white border-0 text-sm h-11"
                onClick={() => setShowLockInModal(true)}
              >
                Lock In Challenge
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lock-In Confirmation Modal */}
      {showLockInModal && selectedChallenge && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowLockInModal(false)}
        >
          <div
            className="glass-card rounded-2xl border border-orange-500/30 bg-card/95 backdrop-blur-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2">Lock In Challenge?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This decision is <span className="font-bold text-orange-500">irreversible</span>. Once locked in, you
                  must submit proof daily or your EliteScore will decay.
                </p>
              </div>

              <div className="bg-[#2bbcff]/5 rounded-lg p-4 border border-[#2bbcff]/20 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Challenge:</span>
                  <span className="font-bold">{selectedChallengeData?.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="font-medium">Today</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">End Date:</span>
                  <span className="font-medium">
                    {new Date(
                      Date.now() + (selectedChallengeData?.duration || 0) * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-border/30">
                  <span className="text-muted-foreground">Potential Reward:</span>
                  <span className="font-bold text-[#a855f7]">+{selectedChallengeData?.reward} EliteScore</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowLockInModal(false)}
                  className="flex-1 text-sm h-10 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-[#a855f7] to-[#2bbcff] hover:opacity-90 text-white border-0 text-sm h-10"
                  onClick={() => {
                    setShowLockInModal(false)
                    setSelectedChallenge(null)
                  }}
                >
                  Confirm Lock In
                </Button>
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
    </div>
  )
}
