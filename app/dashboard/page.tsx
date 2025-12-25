"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Clock, Upload, TrendingUp, Flame, ChevronRight, X, FileText, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

export default function DashboardPage() {
  const [showSubmitProof, setShowSubmitProof] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")

  const handleSubmitProof = () => {
    console.log("[v0] Submitting proof:", { file, description })
    setShowSubmitProof(false)
    setFile(null)
    setDescription("")
  }

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
              <Button size="sm" variant="ghost" className="hidden sm:flex text-xs h-8" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button size="sm" variant="ghost" className="hidden sm:flex text-xs h-8" asChild>
                <Link href="/challenges">Challenges</Link>
              </Button>
              <Button size="sm" variant="ghost" className="hidden sm:flex text-xs h-8" asChild>
                <Link href="/leaderboard">Leaderboard</Link>
              </Button>
              <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-full bg-gradient-to-r from-[#2bbcff]/10 to-[#a855f7]/10 border border-[#2bbcff]/30">
                <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#2bbcff]" />
                <span className="text-[10px] md:text-xs font-bold">{userData.eliteScore}</span>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Stats */}
          <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-5 md:p-6 mb-4 md:mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="text-center md:text-left space-y-1 w-full md:w-auto">
                <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">
                  Your EliteScore
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                  {userData.eliteScore}
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start text-xs text-muted-foreground flex-wrap">
                  <Badge
                    variant="secondary"
                    className="bg-[#2bbcff]/10 text-[#2bbcff] border-[#2bbcff]/30 text-[10px] md:text-xs"
                  >
                    Top {userData.percentile}%
                  </Badge>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span className="font-medium text-[10px] md:text-xs">{userData.streak} day streak</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] md:text-xs text-muted-foreground">Active</span>
              </div>
            </div>
          </div>

          {/* Primary Action */}
          {!showSubmitProof ? (
            <div
              className="glass-card rounded-xl border border-[#2bbcff]/30 bg-gradient-to-r from-[#2bbcff]/5 to-[#a855f7]/5 backdrop-blur-sm p-5 md:p-6 mb-4 md:mb-6 cursor-pointer hover:border-[#2bbcff]/50 transition-all group"
              onClick={() => setShowSubmitProof(true)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm md:text-base font-bold mb-1 group-hover:text-[#2bbcff] transition-colors">
                    Submit Today's Progress
                  </h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Upload proof to maintain your streak</p>
                </div>
                <Upload className="w-4 h-4 md:w-5 md:h-5 text-[#2bbcff] group-hover:scale-110 transition-transform" />
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl border border-[#2bbcff]/30 bg-card/50 backdrop-blur-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold">Submit Today's Progress</h3>
                <Button size="sm" variant="ghost" onClick={() => setShowSubmitProof(false)} className="h-6 w-6 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Upload Proof</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#2bbcff]/10 file:text-[#2bbcff] hover:file:bg-[#2bbcff]/20 file:cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your achievement..."
                    className="w-full p-3 rounded-lg bg-background/50 border border-border/50 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:border-[#2bbcff]/50 focus:outline-none transition"
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmitProof}
                    disabled={!file || !description}
                    className="flex-1 bg-gradient-to-r from-[#2bbcff] to-[#a855f7] text-white border-0 text-xs h-9 disabled:opacity-50"
                  >
                    Submit Progress
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitProof(false)}
                    className="flex-1 border-border/50 text-xs h-9 bg-transparent hover:bg-muted/50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Performance Signals Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 md:mb-6">
            <div className="glass-card rounded-lg border border-green-500/20 bg-green-500/5 backdrop-blur-sm p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-muted-foreground">Score Change</span>
              </div>
              <div className="text-lg font-bold text-green-500">+{userData.scoreChange}</div>
              <div className="text-xs text-muted-foreground">Last 24 hours</div>
            </div>

            <div className="glass-card rounded-lg border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3 h-3 text-[#2bbcff]" />
                <span className="text-xs text-muted-foreground">Consistency</span>
              </div>
              <div className="text-lg font-bold">{userData.weeklyConsistency}/7</div>
              <div className="text-xs text-muted-foreground">Days active</div>
            </div>

            <div className="glass-card rounded-lg border border-[#a855f7]/20 bg-card/50 backdrop-blur-sm p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3 h-3 text-[#a855f7]" />
                <span className="text-xs text-muted-foreground">Rank Movement</span>
              </div>
              <div className="text-lg font-bold text-[#a855f7]">↑ {userData.leaderboardMovement}</div>
              <div className="text-xs text-muted-foreground">Positions up</div>
            </div>

            <div className="glass-card rounded-lg border border-orange-500/20 bg-card/50 backdrop-blur-sm p-3">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-muted-foreground">Streak Status</span>
              </div>
              <div className="text-lg font-bold text-orange-500">{userData.streak}</div>
              <div className="text-xs text-muted-foreground">Days strong</div>
            </div>
          </div>

          {/* Active Challenges */}
          <div className="mb-4 md:mb-6">
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

                  <div className="bg-[#2bbcff]/5 rounded-lg p-3 mb-4 border border-[#2bbcff]/10">
                    <p className="text-xs font-medium mb-1 text-[#2bbcff]">Today's Task:</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{challenge.todayTask}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setShowSubmitProof(true)}
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
          </div>

          {/* Leaderboard Preview */}
          <div className="mb-4 md:mb-6">
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
