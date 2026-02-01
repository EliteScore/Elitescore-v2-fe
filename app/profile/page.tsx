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

export default function ProfilePage() {
  const [showSettings, setShowSettings] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

  const weeklyInsights = [
    { label: "Proofs logged", value: "12", helper: "Verified submissions" },
    { label: "Focus time", value: "6h 40m", helper: "Tracked sessions" },
    { label: "Streak saves", value: "2", helper: "Late-day completions" },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl space-y-6">
        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-brand/30 to-brand-2/30 p-1">
                  <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center text-2xl md:text-3xl font-semibold text-foreground">
                    AC
                  </div>
                </div>
                {userData.verificationBadge && (
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-brand flex items-center justify-center border-2 border-background">
                    <ShieldCheck className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-semibold text-foreground">{userData.name}</h1>
                  <Badge variant="secondary" className="bg-brand-2/15 text-foreground border-border/60 text-xs">
                    Level {userData.level}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-foreground" aria-hidden="true" />
                    <span className="font-semibold text-foreground">{userData.eliteScore.toLocaleString()}</span>
                    EliteScore
                  </span>
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-foreground" aria-hidden="true" />
                    {userData.rankPercentile}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-foreground" aria-hidden="true" />
                    <span className="font-semibold text-foreground">{userData.currentStreak}</span> day streak
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button size="sm" variant="outline" className="border-border/60 bg-transparent">
                <Share2 className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
                Share
              </Button>
              <Button size="sm" variant="outline" className="border-border/60 bg-transparent">
                <LinkIcon className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
                Copy Link
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {showSettings && (
            <div className="border-t border-border/60 pt-6 mt-6 space-y-2">
              <h3 className="text-sm font-semibold">Settings</h3>
              <Button size="sm" variant="outline" className="w-full justify-start border-border/60 bg-transparent">
                <Lock className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
                Change Password
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start border-border/60 bg-transparent">
                <LogOut className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
                Logout
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start border-red-500/40 text-foreground hover:bg-red-500/10"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
                Delete Account
              </Button>
            </div>
          )}
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="glass-card rounded-2xl border border-red-500/30 bg-card/95 p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-2">Delete Account?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This action cannot be undone. Your EliteScore, challenge history, and all data will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button size="sm" className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => setShowDeleteConfirm(false)}>
                  Delete Permanently
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-foreground" aria-hidden="true" />
              <span className="text-sm font-semibold">Level {userData.level}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {userData.currentXP.toLocaleString()} / {userData.xpToNextLevel.toLocaleString()} XP
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand to-brand-2 rounded-full"
              style={{ width: `${(userData.currentXP / userData.xpToNextLevel) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">XP updates after proof submission.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Completed", value: userData.stats.totalCompleted, icon: Check, tone: "text-foreground" },
            { label: "Max Difficulty", value: `${userData.stats.highestDifficulty}/5`, icon: Target, tone: "text-foreground" },
            { label: "Longest Streak", value: userData.stats.longestStreak, icon: Flame, tone: "text-foreground" },
            { label: "Consistency", value: `${userData.stats.consistencyRate}%`, icon: TrendingUp, tone: "text-foreground" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl border border-border/60 bg-card/70 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <stat.icon className={`w-4 h-4 ${stat.tone}`} aria-hidden="true" />
                {stat.label}
              </div>
              <div className="text-xl font-semibold text-foreground mt-2">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-muted-foreground">This week</div>
              <div className="text-lg font-semibold text-foreground">Momentum snapshot</div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {weeklyInsights.map((item) => (
              <div key={item.label} className="rounded-xl border border-border/60 bg-card/60 p-4">
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="mt-2 text-xl font-semibold text-foreground">{item.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{item.helper}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Challenge History</h2>
              <p className="text-xs text-muted-foreground">Public and immutable.</p>
            </div>
          </div>
          <div className="space-y-3">
            {userData.challengeHistory.map((challenge) => (
              <div
                key={challenge.id}
                className={`flex items-start gap-4 p-4 rounded-xl border ${
                  challenge.status === "completed"
                    ? "border-brand/30 bg-brand/5"
                    : "border-red-500/30 bg-red-500/5"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    challenge.status === "completed" ? "bg-brand/15" : "bg-red-500/15"
                  }`}
                >
                  {challenge.status === "completed" ? (
                    <Check className="w-5 h-5 text-foreground" aria-hidden="true" />
                  ) : (
                    <X className="w-5 h-5 text-foreground" aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground">{challenge.name}</h3>
                    <Badge
                      variant="secondary"
                      className={
                        challenge.status === "completed"
                          ? "bg-brand/15 text-foreground border-border/60"
                          : "bg-red-500/10 text-foreground border-red-500/30"
                      }
                    >
                      {challenge.status === "completed" ? "Completed" : "Failed"}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>Difficulty: {challenge.difficulty}/5</span>
                    <span>{challenge.duration} days</span>
                    <span>{challenge.proofCount} proofs</span>
                    <span>{challenge.status === "completed" ? challenge.completionDate : challenge.failureDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Background</h2>
            <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground border-border">
              Not Score-Weighted
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            This information adds context but does not affect leaderboard position.
          </p>

          <div className="grid gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-foreground" aria-hidden="true" />
                <h3 className="text-sm font-semibold">Education</h3>
              </div>
              <div className="grid gap-2">
                {userData.background.education.map((edu) => (
                  <div key={edu.institution} className="rounded-xl border border-border/60 bg-card/60 p-3">
                    <p className="text-sm font-medium text-foreground">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">{edu.institution}  {edu.year}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-foreground" aria-hidden="true" />
                <h3 className="text-sm font-semibold">Past Roles</h3>
              </div>
              <div className="grid gap-2">
                {userData.background.roles.map((role) => (
                  <div key={role.company} className="rounded-xl border border-border/60 bg-card/60 p-3">
                    <p className="text-sm font-medium text-foreground">{role.position}</p>
                    <p className="text-xs text-muted-foreground">{role.company}  {role.period}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-foreground" aria-hidden="true" />
                <h3 className="text-sm font-semibold">Certifications</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {userData.background.certifications.map((cert) => (
                  <Badge
                    key={cert}
                    variant="secondary"
                    className="text-xs bg-emerald-500/10 text-foreground border-emerald-500/30"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-foreground" aria-hidden="true" />
                <h3 className="text-sm font-semibold">Major Achievements</h3>
              </div>
              <div className="space-y-2">
                {userData.background.achievements.map((achievement) => (
                  <div key={achievement} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6">
          <h2 className="text-lg font-semibold mb-4">External Links</h2>
          <div className="space-y-3">
            {userData.links.linkedin && (
              <a
                href={`https://${userData.links.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-brand/5 hover:border-brand/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand/15 flex items-center justify-center">
                    <LinkIcon className="w-4 h-4 text-foreground" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">LinkedIn</p>
                    <p className="text-xs text-muted-foreground">{userData.links.linkedin}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </a>
            )}
            {userData.links.github && (
              <a
                href={`https://${userData.links.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-brand-2/5 hover:border-brand-2/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-2/15 flex items-center justify-center">
                    <LinkIcon className="w-4 h-4 text-foreground" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">GitHub</p>
                    <p className="text-xs text-muted-foreground">{userData.links.github}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </a>
            )}
            {userData.links.portfolio && (
              <a
                href={`https://${userData.links.portfolio}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/40 hover:border-border/80 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                    <LinkIcon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Portfolio</p>
                    <p className="text-xs text-muted-foreground">{userData.links.portfolio}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
