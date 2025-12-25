"use client"

import { useState } from "react"
import Image from "next/image"
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
    <div className="min-h-screen bg-background">
      {/* Header - mobile responsive */}
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
                Challenges
              </Button>
              <Button size="sm" variant="ghost" className="hidden sm:flex text-xs h-8">
                Leaderboard
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        {/* Profile Header */}
        <div className="glass-card rounded-xl border border-[#2bbcff]/30 bg-card/50 backdrop-blur-sm p-5 md:p-8 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 md:gap-0 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-5 w-full sm:w-auto">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#2bbcff] to-[#a855f7] p-1">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-2xl md:text-3xl font-bold bg-gradient-to-br from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                    AC
                  </div>
                </div>
                {userData.verificationBadge && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#2bbcff] flex items-center justify-center border-2 border-background">
                    <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Identity */}
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold">{userData.name}</h1>
                  <Badge
                    variant="secondary"
                    className="text-[10px] md:text-xs bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30 px-2 py-0.5"
                  >
                    Level {userData.level}
                  </Badge>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 md:gap-4 text-xs md:text-sm">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3 h-3 md:w-4 md:h-4 text-[#2bbcff]" />
                    <span className="font-bold text-[#2bbcff]">{userData.eliteScore.toLocaleString()}</span>
                    <span className="text-muted-foreground hidden sm:inline">EliteScore</span>
                  </div>
                  <span className="text-muted-foreground hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] md:text-xs font-medium text-muted-foreground">
                      {userData.rankPercentile}
                    </span>
                  </div>
                  <span className="text-muted-foreground hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                    <span className="font-bold text-orange-500">{userData.currentStreak}</span>
                    <span className="text-muted-foreground text-[10px] md:text-xs">day streak</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <Button
                size="sm"
                variant="outline"
                className="border-[#2bbcff]/50 hover:bg-[#2bbcff]/10 text-[10px] md:text-xs h-7 md:h-8 bg-transparent flex-1 sm:flex-initial"
              >
                <Share2 className="w-3 h-3 mr-1.5" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#2bbcff]/50 hover:bg-[#2bbcff]/10 text-[10px] md:text-xs h-7 md:h-8 bg-transparent flex-1 sm:flex-initial"
              >
                <LinkIcon className="w-3 h-3 mr-1.5" />
                <span className="hidden sm:inline">Copy Link</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-7 md:h-8"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="border-t border-border/50 pt-6 space-y-3">
              <h3 className="text-sm font-semibold mb-3">Settings</h3>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs h-9 bg-transparent border-border/50"
                >
                  <Lock className="w-3.5 h-3.5 mr-2" />
                  Change Password
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs h-9 bg-transparent border-border/50"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  Logout
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs h-9 bg-transparent border-red-500/50 text-red-500 hover:bg-red-500/10"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          )}

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="glass-card rounded-xl border border-red-500/30 bg-card/95 backdrop-blur-md p-6 max-w-md mx-4">
                <h3 className="text-lg font-bold mb-2">Delete Account?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  This action cannot be undone. Your EliteScore, challenge history, and all data will be permanently
                  deleted.
                </p>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-9 bg-transparent"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs h-9"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Delete Permanently
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Level & XP */}
          <div className="bg-[#a855f7]/5 rounded-lg p-3 md:p-4 border border-[#a855f7]/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#a855f7]" />
                <span className="text-sm font-semibold">Level {userData.level}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {userData.currentXP.toLocaleString()} / {userData.xpToNextLevel.toLocaleString()} XP
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] rounded-full transition-all duration-500"
                style={{ width: `${(userData.currentXP / userData.xpToNextLevel) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">XP shown only here and after proof submission</p>
          </div>
        </div>

        {/* Credibility Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <Check className="w-4 h-4 text-[#2bbcff]" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold">{userData.stats.totalCompleted}</p>
          </div>
          <div className="glass-card rounded-xl border border-[#a855f7]/20 bg-card/50 backdrop-blur-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-[#a855f7]" />
              <span className="text-xs text-muted-foreground">Max Difficulty</span>
            </div>
            <p className="text-2xl font-bold">{userData.stats.highestDifficulty}/5</p>
          </div>
          <div className="glass-card rounded-xl border border-orange-500/20 bg-card/50 backdrop-blur-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Longest Streak</span>
            </div>
            <p className="text-2xl font-bold">{userData.stats.longestStreak}</p>
          </div>
          <div className="glass-card rounded-xl border border-green-500/20 bg-card/50 backdrop-blur-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Consistency</span>
            </div>
            <p className="text-2xl font-bold">{userData.stats.consistencyRate}%</p>
          </div>
        </div>

        {/* Challenge History */}
        <div className="glass-card rounded-xl border border-[#2bbcff]/30 bg-card/50 backdrop-blur-sm p-5 md:p-6 mb-4 md:mb-6">
          <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4">Challenge History</h2>
          <p className="text-[10px] md:text-xs text-muted-foreground mb-3 md:mb-4">
            Public & immutable — failures are visible
          </p>
          <div className="space-y-3">
            {userData.challengeHistory.map((challenge) => (
              <div
                key={challenge.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  challenge.status === "completed"
                    ? "bg-[#2bbcff]/5 border-[#2bbcff]/20 hover:border-[#2bbcff]/40"
                    : "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      challenge.status === "completed" ? "bg-[#2bbcff]/20" : "bg-red-500/20"
                    }`}
                  >
                    {challenge.status === "completed" ? (
                      <Check className="w-5 h-5 text-[#2bbcff]" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold">{challenge.name}</h3>
                      <Badge
                        variant="secondary"
                        className={`text-xs px-2 py-0.5 ${
                          challenge.status === "completed"
                            ? "bg-[#2bbcff]/10 text-[#2bbcff] border-[#2bbcff]/30"
                            : "bg-red-500/10 text-red-500 border-red-500/30"
                        }`}
                      >
                        {challenge.status === "completed" ? "Completed" : "Failed"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Difficulty: {challenge.difficulty}/5</span>
                      <span>•</span>
                      <span>{challenge.duration} days</span>
                      <span>•</span>
                      <span>{challenge.proofCount} proofs submitted</span>
                      <span>•</span>
                      <span>{challenge.status === "completed" ? challenge.completionDate : challenge.failureDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resume / Background */}
        <div className="glass-card rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold">Background</h2>
            <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground border-border px-2 py-0.5">
              Not Score-Weighted
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            This information provides context but does not affect your EliteScore or leaderboard position.
          </p>

          <div className="space-y-6">
            {/* Education */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-[#2bbcff]" />
                <h3 className="text-sm font-semibold">Education</h3>
              </div>
              <div className="space-y-2">
                {userData.background.education.map((edu, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-3 border border-border/30">
                    <p className="text-sm font-medium">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">
                      {edu.institution} • {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Roles */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-[#a855f7]" />
                <h3 className="text-sm font-semibold">Past Roles</h3>
              </div>
              <div className="space-y-2">
                {userData.background.roles.map((role, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-3 border border-border/30">
                    <p className="text-sm font-medium">{role.position}</p>
                    <p className="text-xs text-muted-foreground">
                      {role.company} • {role.period}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-green-500" />
                <h3 className="text-sm font-semibold">Certifications</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {userData.background.certifications.map((cert, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-green-500/10 text-green-500 border-green-500/30 px-3 py-1"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Major Achievements */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold">Major Achievements</h3>
              </div>
              <div className="space-y-2">
                {userData.background.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                    <p className="text-sm text-muted-foreground">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="glass-card rounded-xl border border-[#2bbcff]/30 bg-card/50 backdrop-blur-sm p-5 md:p-6">
          <h2 className="text-lg font-bold mb-4">External Links</h2>
          <div className="space-y-3">
            {userData.links.linkedin && (
              <a
                href={`https://${userData.links.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border border-[#2bbcff]/20 bg-[#2bbcff]/5 hover:border-[#2bbcff]/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2bbcff]/20 flex items-center justify-center">
                    <LinkIcon className="w-4 h-4 text-[#2bbcff]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">LinkedIn</p>
                    <p className="text-xs text-muted-foreground">{userData.links.linkedin}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[#2bbcff] transition-colors" />
              </a>
            )}
            {userData.links.github && (
              <a
                href={`https://${userData.links.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border border-[#a855f7]/20 bg-[#a855f7]/5 hover:border-[#a855f7]/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#a855f7]/20 flex items-center justify-center">
                    <LinkIcon className="w-4 h-4 text-[#a855f7]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">GitHub</p>
                    <p className="text-xs text-muted-foreground">{userData.links.github}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[#a855f7] transition-colors" />
              </a>
            )}
            {userData.links.portfolio && (
              <a
                href={`https://${userData.links.portfolio}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border border-border/20 bg-muted/30 hover:border-border/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Portfolio</p>
                    <p className="text-xs text-muted-foreground">{userData.links.portfolio}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
