"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Flame,
  Target,
  Check,
  X,
  Award,
  TrendingUp,
  LinkIcon,
  Share2,
  Settings,
  ExternalLink,
  Lock,
  LogOut,
  Trash2,
  ShieldCheck,
  Zap,
  Briefcase,
  GraduationCap,
} from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

export default function ProfilePage() {
  const [showSettings, setShowSettings] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Mock user data
  const userData = {
    name: "Alex Chen",
    eliteScore: 1847,
    rankPercentile: "Top 3%",
    currentStreak: 42,
    verificationBadge: true,
    level: 18,
    currentXP: 3450,
    xpToNextLevel: 5000,
    stats: {
      totalCompleted: 34,
      highestDifficulty: 5,
      longestStreak: 89,
      consistencyRate: 87,
    },
    challengeHistory: [
      {
        id: 1,
        name: "30-Day Coding Sprint",
        difficulty: 5,
        duration: 30,
        status: "completed",
        completionDate: "2024-12-15",
        proofCount: 30,
      },
      {
        id: 2,
        name: "Morning Workout",
        difficulty: 3,
        duration: 21,
        status: "completed",
        completionDate: "2024-11-30",
        proofCount: 21,
      },
      {
        id: 3,
        name: "Read 5 Books",
        difficulty: 4,
        duration: 60,
        status: "failed",
        failureDate: "2024-10-20",
        proofCount: 12,
      },
      {
        id: 4,
        name: "LinkedIn Posts Daily",
        difficulty: 4,
        duration: 14,
        status: "completed",
        completionDate: "2024-10-05",
        proofCount: 14,
      },
      {
        id: 5,
        name: "No Social Media",
        difficulty: 5,
        duration: 30,
        status: "failed",
        failureDate: "2024-09-10",
        proofCount: 18,
      },
    ],
    background: {
      education: [
        { institution: "Stanford University", degree: "BS Computer Science", year: "2023" },
        { institution: "Harvard Extension", degree: "Certificate in AI", year: "2022" },
      ],
      roles: [
        { company: "Tech Startup", position: "Software Engineer", period: "2023-Present" },
        { company: "Google", position: "SWE Intern", period: "Summer 2022" },
      ],
      certifications: ["AWS Certified Developer", "Google Cloud Professional", "Meta Frontend Certificate"],
      achievements: ["Won MIT Hackathon 2022", "Published Research on ML", "Built App with 10K+ Users"],
    },
    links: {
      linkedin: "linkedin.com/in/alexchen",
      github: "github.com/alexchen",
      portfolio: "alexchen.dev",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0c1525] via-[#0a0a12] to-[#151008] pb-20">
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-5xl">
        <div className="rounded-2xl bg-gradient-to-br from-[#0c1525]/95 via-[#0a0a12]/98 to-[#151008]/95 backdrop-blur-xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-[#ea580c]/10 via-[#fb923c]/15 to-[#facc15]/10 blur-[100px] rounded-full -z-10 pointer-events-none" aria-hidden="true" />

          {/* Profile Header */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#fb923c] p-1">
                    <div className="w-full h-full rounded-full bg-[#0c1525] flex items-center justify-center text-2xl sm:text-3xl font-bold bg-gradient-to-br from-[#0ea5e9] to-[#fb923c] bg-clip-text text-transparent">
                      AC
                    </div>
                  </div>
                  {userData.verificationBadge && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0ea5e9] flex items-center justify-center border-2 border-[#0c1525]" aria-hidden="true">
                      <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate max-w-full">{userData.name}</h1>
                    <Badge
                      variant="secondary"
                      className="text-[10px] sm:text-xs bg-[#fb923c]/10 text-[#fb923c] border-[#fb923c]/30 shrink-0"
                    >
                      Level {userData.level}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] sm:text-xs">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-[#0ea5e9]" aria-hidden="true" />
                      <span className="font-bold text-[#0ea5e9]">{userData.eliteScore.toLocaleString()}</span>
                      <span className="text-muted-foreground hidden sm:inline">EliteScore</span>
                    </span>
                    <span className="text-muted-foreground hidden sm:inline">·</span>
                    <span className="text-muted-foreground">{userData.rankPercentile}</span>
                    <span className="text-muted-foreground hidden sm:inline">·</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" aria-hidden="true" />
                      <span className="font-bold text-orange-500">{userData.currentStreak}</span>
                      <span className="text-muted-foreground">day streak</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#0ea5e9]/30 hover:bg-[#0ea5e9]/10 text-[10px] sm:text-xs min-h-[44px] flex-1 sm:flex-initial touch-manipulation rounded-xl"
                  aria-label="Share profile"
                >
                  <Share2 className="w-3.5 h-3.5 mr-0 sm:mr-1.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#0ea5e9]/30 hover:bg-[#0ea5e9]/10 text-[10px] sm:text-xs min-h-[44px] flex-1 sm:flex-initial touch-manipulation rounded-xl"
                  aria-label="Copy profile link"
                >
                  <LinkIcon className="w-3.5 h-3.5 mr-0 sm:mr-1.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Copy Link</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="min-h-[44px] min-w-[44px] p-0 touch-manipulation rounded-xl"
                  onClick={() => setShowSettings(!showSettings)}
                  aria-label={showSettings ? "Close settings" : "Open settings"}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {showSettings && (
              <div className="border-t border-white/5 pt-4 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Settings</h3>
                <div className="space-y-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start text-xs min-h-[44px] bg-white/[0.04] border-white/10 rounded-xl touch-manipulation"
                  >
                    <Lock className="w-3.5 h-3.5 mr-2" />
                    Change Password
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start text-xs min-h-[44px] bg-white/[0.04] border-white/10 rounded-xl touch-manipulation"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    Logout
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start text-xs min-h-[44px] bg-transparent border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl touch-manipulation"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            )}

            {showDeleteConfirm && (
              <div
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-dialog-title"
              >
                <div className="rounded-2xl sm:rounded-2xl border border-red-500/30 bg-[#0c1525]/95 backdrop-blur-xl p-4 sm:p-6 w-full max-w-md">
                  <h3 id="delete-dialog-title" className="text-base sm:text-lg font-bold mb-2">Delete Account?</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                    This cannot be undone. Your EliteScore, history, and data will be permanently deleted.
                  </p>
                  <div className="flex gap-2 sm:gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 min-h-[44px] text-xs rounded-xl bg-transparent border-white/10 touch-manipulation"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 min-h-[44px] bg-red-500 hover:bg-red-600 text-white text-xs rounded-xl touch-manipulation"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Delete Permanently
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl bg-white/[0.04] p-3 sm:p-4 mt-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#fb923c]" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-semibold">Level {userData.level}</span>
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  {userData.currentXP.toLocaleString()} / {userData.xpToNextLevel.toLocaleString()} XP
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#fb923c] rounded-full transition-all duration-500"
                  style={{ width: `${(userData.currentXP / userData.xpToNextLevel) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={userData.currentXP}
                  aria-valuemin={0}
                  aria-valuemax={userData.xpToNextLevel}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">XP shown here and after proof submission</p>
            </div>
          </div>

          {/* Credibility Stats */}
          <div className="border-t border-white/5 p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="rounded-xl bg-white/[0.04] p-3 sm:p-4 min-h-[44px] flex flex-col justify-center">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Check className="w-3.5 h-3.5 text-[#0ea5e9]" aria-hidden="true" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Completed</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{userData.stats.totalCompleted}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-3 sm:p-4 min-h-[44px] flex flex-col justify-center">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Target className="w-3.5 h-3.5 text-[#fb923c]" aria-hidden="true" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Max Difficulty</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{userData.stats.highestDifficulty}/5</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-3 sm:p-4 min-h-[44px] flex flex-col justify-center">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Longest Streak</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{userData.stats.longestStreak}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-3 sm:p-4 min-h-[44px] flex flex-col justify-center">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Consistency</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{userData.stats.consistencyRate}%</p>
              </div>
            </div>
          </div>

          {/* Challenge History */}
          <div className="border-t border-white/5 p-4 sm:p-6">
            <div className="rounded-xl bg-white/[0.04] p-4 sm:p-5">
              <h2 className="text-sm sm:text-base font-bold mb-1">Challenge History</h2>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-3">
                Public & immutable — failures are visible
              </p>
              <div className="space-y-2">
                {userData.challengeHistory.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`flex items-start sm:items-center gap-3 p-3 rounded-xl transition-all touch-manipulation ${
                      challenge.status === "completed"
                        ? "bg-[#0ea5e9]/10"
                        : "bg-red-500/10"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${
                        challenge.status === "completed" ? "bg-[#0ea5e9]/20" : "bg-red-500/20"
                      }`}
                      aria-hidden="true"
                    >
                      {challenge.status === "completed" ? (
                        <Check className="w-4 h-4 text-[#0ea5e9]" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <h3 className="text-xs sm:text-sm font-semibold truncate">{challenge.name}</h3>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] shrink-0 ${
                            challenge.status === "completed"
                              ? "bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/30"
                              : "bg-red-500/10 text-red-500 border-red-500/30"
                          }`}
                        >
                          {challenge.status === "completed" ? "Completed" : "Failed"}
                        </Badge>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {challenge.difficulty}/5 · {challenge.duration}d · {challenge.proofCount} proofs · {challenge.status === "completed" ? challenge.completionDate : challenge.failureDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="border-t border-white/5 p-4 sm:p-6">
            <div className="rounded-xl bg-white/[0.04] p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-sm sm:text-base font-bold">Background</h2>
                <Badge variant="secondary" className="text-[10px] bg-white/5 text-muted-foreground border-white/10">
                  Not Score-Weighted
                </Badge>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-4">
                Context only — does not affect EliteScore or leaderboard.
              </p>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#0ea5e9]" aria-hidden="true" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Education</h3>
                  </div>
                  <div className="space-y-1.5">
                    {userData.background.education.map((edu, index) => (
                      <div key={index} className="rounded-xl bg-white/[0.04] p-2.5 sm:p-3">
                        <p className="text-xs sm:text-sm font-medium">{edu.degree}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{edu.institution} · {edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Briefcase className="w-3.5 h-3.5 text-[#fb923c]" aria-hidden="true" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Past Roles</h3>
                  </div>
                  <div className="space-y-1.5">
                    {userData.background.roles.map((role, index) => (
                      <div key={index} className="rounded-xl bg-white/[0.04] p-2.5 sm:p-3">
                        <p className="text-xs sm:text-sm font-medium">{role.position}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{role.company} · {role.period}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Award className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Certifications</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {userData.background.certifications.map((cert, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-[10px] bg-green-500/10 text-green-500 border-green-500/30"
                      >
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Trophy className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Major Achievements</h3>
                  </div>
                  <div className="space-y-1.5">
                    {userData.background.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" aria-hidden="true" />
                        <p className="text-[11px] sm:text-sm text-muted-foreground">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* External Links */}
          <div className="border-t border-white/5 p-4 sm:p-6">
            <div className="rounded-xl bg-white/[0.04] p-4 sm:p-5">
              <h2 className="text-sm sm:text-base font-bold mb-3">External Links</h2>
              <div className="space-y-2">
                {userData.links.linkedin && (
                  <a
                    href={`https://${userData.links.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0ea5e9]/10 min-h-[44px] touch-manipulation active:bg-[#0ea5e9]/15 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 shrink-0 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-[#0ea5e9]" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium">LinkedIn</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{userData.links.linkedin}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-[#0ea5e9] transition-colors" aria-hidden="true" />
                  </a>
                )}
                {userData.links.github && (
                  <a
                    href={`https://${userData.links.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#fb923c]/10 min-h-[44px] touch-manipulation active:bg-[#fb923c]/15 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 shrink-0 rounded-full bg-[#fb923c]/20 flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-[#fb923c]" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium">GitHub</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{userData.links.github}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-[#fb923c] transition-colors" aria-hidden="true" />
                  </a>
                )}
                {userData.links.portfolio && (
                  <a
                    href={`https://${userData.links.portfolio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.04] min-h-[44px] touch-manipulation active:bg-white/[0.06] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 shrink-0 rounded-full bg-white/10 flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium">Portfolio</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{userData.links.portfolio}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
