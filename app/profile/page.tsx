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
  Calendar,
  Globe,
  Github,
  Linkedin,
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
    bio: "Senior Software Engineer passionate about building scalable AI systems and mastering low-level performance optimization.",
    location: "San Francisco, CA",
    joinedDate: "Joined Jan 2024",
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
    ],
    background: {
      education: [
        { institution: "Stanford University", degree: "BS Computer Science", year: "2023", description: "Focused on Distributed Systems and Machine Learning." },
        { institution: "Harvard Extension", degree: "Certificate in AI", year: "2022", description: "Advanced studies in Neural Networks." },
      ],
      roles: [
        { company: "Vercel", position: "Senior Frontend Engineer", period: "2023 - Present", description: "Leading architecture for core platform components." },
        { company: "Google", position: "SWE Intern", period: "Summer 2022", description: "Optimized Search rankings using ML models." },
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
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        {/* Header Profile Section */}
        <section className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-3xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-brand/40 to-brand-2/40 p-1 shadow-2xl transition-transform group-hover:scale-[1.02]">
                <div className="w-full h-full rounded-[1.4rem] bg-background flex items-center justify-center text-4xl md:text-5xl font-bold text-foreground">
                  AC
                </div>
              </div>
              {userData.verificationBadge && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-brand flex items-center justify-center border-4 border-background shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{userData.name}</h1>
                  <Badge variant="secondary" className="bg-brand/15 text-foreground hover:bg-brand/20 border-0 px-3 py-1">
                    Level {userData.level}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {userData.location}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {userData.joinedDate}</span>
                </div>
              </div>

              <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
                {userData.bio}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <Button size="sm" variant="outline" className="rounded-xl border-border/60 bg-background/50 backdrop-blur">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl border-border/60 bg-background/50 backdrop-blur">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Connect
                </Button>
                <Button size="sm" variant="ghost" className="rounded-xl" onClick={() => setShowSettings(!showSettings)}>
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {showSettings && (
            <div className="mt-8 pt-8 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <Button variant="outline" className="rounded-xl justify-start">
                <Lock className="w-4 h-4 mr-3" /> Password & Privacy
              </Button>
              <Button variant="outline" className="rounded-xl justify-start">
                <LogOut className="w-4 h-4 mr-3" /> Sign Out
              </Button>
              <Button variant="outline" className="rounded-xl justify-start border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 className="w-4 h-4 mr-3" /> Delete Data
              </Button>
            </div>
          )}
        </section>

        {/* Vital Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">EliteScore</p>
              <div className="mt-1 flex items-baseline gap-2">
                <h2 className="text-4xl font-bold tracking-tight text-foreground">{userData.eliteScore.toLocaleString()}</h2>
                <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-brand/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-foreground" />
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Streak</p>
              <div className="mt-1 flex items-baseline gap-2">
                <h2 className="text-4xl font-bold tracking-tight text-foreground">{userData.currentStreak}</h2>
                <span className="text-xs font-semibold text-orange-500">Days</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Flame className="w-6 h-6 text-foreground" />
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Global Rank</p>
              <div className="mt-1 flex items-baseline gap-2">
                <h2 className="text-4xl font-bold tracking-tight text-foreground">{userData.rankPercentile}</h2>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-brand-2/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-foreground" />
            </div>
          </div>
        </div>

        {/* Experience & History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Background / Bio Section */}
            <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-foreground">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">Experience</h3>
                </div>
                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-border/60">
                  {userData.background.roles.map((role, i) => (
                    <div key={i} className="relative pl-12">
                      <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-background border border-border/60 flex items-center justify-center z-10">
                        <div className="w-2 h-2 rounded-full bg-brand" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-bold text-foreground">{role.position}</h4>
                          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg border border-border/40">{role.period}</span>
                        </div>
                        <p className="text-sm font-semibold text-brand/80">{role.company}</p>
                        <p className="text-sm text-muted-foreground pt-1">{role.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-2/10 flex items-center justify-center text-foreground">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold">Education</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {userData.background.education.map((edu, i) => (
                    <div key={i} className="rounded-2xl border border-border/60 bg-background/40 p-5 space-y-2 hover:bg-background/60 transition-colors cursor-default">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-foreground text-sm leading-tight">{edu.degree}</h4>
                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{edu.year}</span>
                      </div>
                      <p className="text-xs font-semibold text-brand-2/80 tracking-wide">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Snapshot */}
            <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-foreground">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Challenge Progress</h3>
                    <p className="text-xs text-muted-foreground">Historical consistency metrics</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="rounded-xl text-xs">View All</Button>
              </div>

              <div className="space-y-4">
                {userData.challengeHistory.map((challenge) => (
                  <div key={challenge.id} className="group rounded-2xl border border-border/40 bg-background/20 p-4 transition-all hover:bg-background/40">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-[1.1rem] flex items-center justify-center ${challenge.status === 'completed' ? 'bg-emerald-500/15' : 'bg-red-500/15'
                          }`}>
                          {challenge.status === 'completed' ? (
                            <Check className={`w-6 h-6 ${challenge.status === 'completed' ? 'text-emerald-500' : 'text-red-500'}`} />
                          ) : (
                            <X className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-foreground group-hover:text-brand transition-colors">{challenge.name}</h4>
                          <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
                            <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Difficulty {challenge.difficulty}/5</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {challenge.duration} Days</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="flex-1 sm:flex-none text-right">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">{challenge.status === 'completed' ? 'Finished' : 'Ended'}</p>
                          <p className="text-xs font-bold text-foreground">{challenge.status === 'completed' ? challenge.completionDate : challenge.failureDate}</p>
                        </div>
                        <Badge variant="outline" className={`rounded-xl px-3 py-1 border-0 ${challenge.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                          {challenge.status === 'completed' ? 'Success' : 'Failed'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Score & Progression */}
            <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 space-y-6">
              <h3 className="font-bold text-sm">Level Progression</h3>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Level</p>
                    <p className="text-3xl font-black text-brand">{userData.level}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total XP</p>
                    <p className="text-lg font-bold text-foreground">{userData.currentXP.toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand to-brand-2 rounded-full shadow-[0_0_12px_rgba(14,165,233,0.3)] transition-all duration-1000"
                      style={{ width: `${(userData.currentXP / userData.xpToNextLevel) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                    <span>PROGRESS TO LEVEL {userData.level + 1}</span>
                    <span>{Math.round((userData.currentXP / userData.xpToNextLevel) * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/40 bg-background/40 p-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Consistency</p>
                  <p className="text-lg font-bold text-foreground">{userData.stats.consistencyRate}%</p>
                </div>
                <div className="rounded-xl border border-border/40 bg-background/40 p-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Max Diff.</p>
                  <p className="text-lg font-bold text-foreground">{userData.stats.highestDifficulty}/5</p>
                </div>
              </div>
            </div>

            {/* Certifications & Skills */}
            <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 space-y-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand" />
                <h3 className="font-bold text-sm tracking-tight">Verified Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {userData.background.certifications.map((cert) => (
                  <Badge
                    key={cert}
                    variant="secondary"
                    className="rounded-lg bg-emerald-500/5 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Connect / Links */}
            <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 space-y-6">
              <h3 className="font-bold text-sm">Professional Links</h3>
              <div className="space-y-2">
                <a href={`https://${userData.links.github}`} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/40 hover:bg-background/80 hover:border-brand/40 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                      <Github className="w-4 h-4 text-foreground" />
                    </div>
                    <span className="text-sm font-bold text-foreground opacity-80 group-hover:opacity-100 transition-opacity">GitHub</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-brand transition-colors" />
                </a>
                <a href={`https://${userData.links.linkedin}`} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/40 hover:bg-background/80 hover:border-brand/40 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0077b5]/10 flex items-center justify-center">
                      <Linkedin className="w-4 h-4 text-[#0077b5]" />
                    </div>
                    <span className="text-sm font-bold text-foreground opacity-80 group-hover:opacity-100 transition-opacity">LinkedIn</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-brand transition-colors" />
                </a>
                <a href={`https://${userData.links.portfolio}`} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/40 hover:bg-background/80 hover:border-brand/40 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-brand" />
                    </div>
                    <span className="text-sm font-bold text-foreground opacity-80 group-hover:opacity-100 transition-opacity">Portfolio</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-brand transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="glass-card rounded-3xl border border-destructive/30 bg-card/95 p-8 max-w-sm w-full space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
              <Trash2 className="w-8 h-8" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">Delete Account?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This action is irreversible. All your EliteScore progress, history, and rankings will be wiped forever.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="rounded-xl font-bold" onClick={() => setShowDeleteConfirm(false)}>
                Go Back
              </Button>
              <Button className="rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold" onClick={() => setShowDeleteConfirm(false)}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

