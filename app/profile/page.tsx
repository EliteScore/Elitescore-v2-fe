"use client"

import { useState, useEffect } from "react"
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

const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"
const CARD_BASE = "rounded-2xl border border-slate-200/80 bg-white shadow-sm"

export default function ProfilePage() {
  const [showSettings, setShowSettings] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleToggleSettings = () => setShowSettings((prev) => !prev)
  const handleOpenDeleteConfirm = () => setShowDeleteConfirm(true)
  const handleCloseDeleteConfirm = () => setShowDeleteConfirm(false)

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

  useEffect(() => {
    if (userData?.name) {
      try {
        localStorage.setItem("elitescore_user_name", userData.name)
      } catch {
        // ignore
      }
    }
  }, [userData.name])

  return (
    <div className="min-h-[100dvh] bg-[#f5f5f6] font-sans text-slate-800 antialiased pt-[max(1rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(5rem,calc(4rem+env(safe-area-inset-bottom)))]">
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-5xl">
        {/* Hero strip — matches home / leaderboard */}
        <section className="relative overflow-hidden rounded-2xl px-4 py-5 sm:px-6 sm:py-6 mb-4" style={{ background: APP_GRADIENT }} aria-labelledby="profile-heading">
          <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <h1 id="profile-heading" className="relative text-xl font-extrabold leading-tight text-white sm:text-2xl">Profile</h1>
          <p className="relative mt-0.5 text-sm text-white/85">Identity, performance & history.</p>
        </section>

        <div className={`${CARD_BASE} overflow-hidden`}>

          {/* Profile Header */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1" style={{ background: APP_GRADIENT }}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl sm:text-3xl font-bold text-pink-600">
                      AC
                    </div>
                  </div>
                  {userData.verificationBadge && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-pink-500 flex items-center justify-center border-2 border-white" aria-hidden="true">
                      <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-white" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 truncate max-w-full">{userData.name}</h1>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs bg-orange-50 text-orange-600 border-orange-200/80 shrink-0">
                      Level {userData.level}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] sm:text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-pink-600" aria-hidden="true" />
                      <span className="font-bold text-pink-600">{userData.eliteScore.toLocaleString()}</span>
                      <span className="hidden sm:inline">EliteScore</span>
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span>{userData.rankPercentile}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" aria-hidden="true" />
                      <span className="font-bold text-orange-500">{userData.currentStreak}</span>
                      <span>day streak</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
                <Button size="sm" variant="outline" className="bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80 hover:border-slate-300 text-[10px] sm:text-xs min-h-[44px] flex-1 sm:flex-initial touch-manipulation rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40" aria-label="Share profile">
                  <Share2 className="w-3.5 h-3.5 mr-0 sm:mr-1.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button size="sm" variant="outline" className="bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80 hover:border-slate-300 text-[10px] sm:text-xs min-h-[44px] flex-1 sm:flex-initial touch-manipulation rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40" aria-label="Copy profile link">
                  <LinkIcon className="w-3.5 h-3.5 mr-0 sm:mr-1.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Copy Link</span>
                </Button>
                <Button size="sm" variant="ghost" className="min-h-[44px] min-w-[44px] p-0 touch-manipulation rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40" onClick={handleToggleSettings} aria-label={showSettings ? "Close settings" : "Open settings"}>
                  <Settings className="w-4 h-4" aria-hidden />
                </Button>
              </div>
            </div>

            {showSettings && (
              <div className="border-t border-slate-200/80 pt-4 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Settings</h3>
                <div className="space-y-1.5">
                  <Button size="sm" variant="outline" className="w-full justify-start text-xs min-h-[44px] bg-slate-100 border-slate-200 rounded-xl touch-manipulation text-slate-700 hover:bg-slate-200/80">
                    <Lock className="w-3.5 h-3.5 mr-2" aria-hidden />
                    Change Password
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start text-xs min-h-[44px] bg-slate-100 border-slate-200 rounded-xl touch-manipulation text-slate-700 hover:bg-slate-200/80">
                    <LogOut className="w-3.5 h-3.5 mr-2" aria-hidden />
                    Logout
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start text-xs min-h-[44px] bg-transparent border-red-500/30 text-red-500 hover:bg-red-50 rounded-xl touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30" onClick={handleOpenDeleteConfirm}>
                    <Trash2 className="w-3.5 h-3.5 mr-2" aria-hidden />
                    Delete Account
                  </Button>
                </div>
              </div>
            )}

            {showDeleteConfirm && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-4" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title" onClick={handleCloseDeleteConfirm}>
                <div className={`${CARD_BASE} p-4 sm:p-6 w-full max-w-md`} onClick={(e) => e.stopPropagation()}>
                  <h3 id="delete-dialog-title" className="text-base sm:text-lg font-bold text-slate-800 mb-2">Delete Account?</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6 leading-relaxed">This cannot be undone. Your EliteScore, history, and data will be permanently deleted.</p>
                  <div className="flex gap-2 sm:gap-3">
                    <Button size="sm" variant="outline" className="flex-1 min-h-[44px] text-xs rounded-xl border-slate-200 touch-manipulation text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/30" onClick={handleCloseDeleteConfirm}>Cancel</Button>
                    <Button size="sm" className="flex-1 min-h-[44px] bg-red-500 hover:bg-red-600 text-white text-xs rounded-xl touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50" onClick={handleCloseDeleteConfirm}>Delete Permanently</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 mt-4 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">Level {userData.level}</span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-500">{userData.currentXP.toLocaleString()} / {userData.xpToNextLevel.toLocaleString()} XP</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(userData.currentXP / userData.xpToNextLevel) * 100}%`, background: APP_GRADIENT }} role="progressbar" aria-valuenow={userData.currentXP} aria-valuemin={0} aria-valuemax={userData.xpToNextLevel} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">XP shown here and after proof submission</p>
            </div>
          </div>

          {/* Credibility Stats — card grid, landing theme */}
          <div className="border-t border-slate-200/80 p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 min-h-[44px] flex flex-col justify-center shadow-sm">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Check className="w-3.5 h-3.5 text-pink-600" aria-hidden="true" />
                  <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Completed</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{userData.stats.totalCompleted}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 min-h-[44px] flex flex-col justify-center shadow-sm">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Target className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                  <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Max Difficulty</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{userData.stats.highestDifficulty}/5</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 min-h-[44px] flex flex-col justify-center shadow-sm">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                  <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Longest Streak</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{userData.stats.longestStreak}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 min-h-[44px] flex flex-col justify-center shadow-sm">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                  <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Consistency</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{userData.stats.consistencyRate}%</p>
              </div>
            </div>
          </div>

          {/* Challenge History — card list, landing theme */}
          <div className="border-t border-slate-200/80 p-4 sm:p-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 mb-1">Challenge History</h2>
              <p className="text-[10px] sm:text-xs text-slate-500 mb-3">Public & immutable — failures are visible</p>
              <div className="space-y-2">
                {userData.challengeHistory.map((challenge) => (
                  <div key={challenge.id} className={`flex items-start sm:items-center gap-3 p-3 rounded-xl border shadow-sm transition-all touch-manipulation ${challenge.status === "completed" ? "bg-pink-50/50 border-pink-200/50" : "bg-red-50/50 border-red-200/50"}`}>
                    <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center border-2 ${challenge.status === "completed" ? "bg-white border-pink-300" : "bg-white border-red-300"}`} aria-hidden="true">
                      {challenge.status === "completed" ? <Check className="w-4 h-4 text-pink-500" aria-hidden /> : <X className="w-4 h-4 text-red-500" aria-hidden />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{challenge.name}</h3>
                        <Badge variant="secondary" className={`text-[10px] shrink-0 border-0 ${challenge.status === "completed" ? "bg-pink-500 text-white hover:bg-pink-500" : "bg-red-500 text-white hover:bg-red-500"}`}>
                          {challenge.status === "completed" ? "Completed" : "Failed"}
                        </Badge>
                      </div>
                      <p className="text-[10px] sm:text-xs text-slate-600">{challenge.difficulty}/5 · {challenge.duration}d · {challenge.proofCount} proofs · {challenge.status === "completed" ? challenge.completionDate : challenge.failureDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="border-t border-slate-200/80 p-4 sm:p-6">
            <div className="rounded-xl bg-slate-50/50 border border-slate-200/80 p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-800">Background</h2>
                <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-500 border-slate-200/80">Not Score-Weighted</Badge>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mb-4">Context only — does not affect EliteScore or leaderboard.</p>
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <GraduationCap className="w-3.5 h-3.5 text-pink-600" aria-hidden="true" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Education</h3>
                  </div>
                  <div className="space-y-1.5">
                    {userData.background.education.map((edu, index) => (
                      <div key={index} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 sm:p-3">
                        <p className="text-xs sm:text-sm font-medium text-slate-800">{edu.degree}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500">{edu.institution} · {edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Briefcase className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Past Roles</h3>
                  </div>
                  <div className="space-y-1.5">
                    {userData.background.roles.map((role, index) => (
                      <div key={index} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 sm:p-3">
                        <p className="text-xs sm:text-sm font-medium text-slate-800">{role.position}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500">{role.company} · {role.period}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Award className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Certifications</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {userData.background.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="text-[10px] bg-green-50 text-green-600 border-green-200/80">{cert}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Trophy className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Major Achievements</h3>
                  </div>
                  <div className="space-y-1.5">
                    {userData.background.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" aria-hidden="true" />
                        <p className="text-[11px] sm:text-sm text-slate-600">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* External Links — subtle tints per link type, landing theme */}
          <div className="border-t border-slate-200/80 p-4 sm:p-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 mb-3">External Links</h2>
              <div className="space-y-2">
                {userData.links.linkedin && (
                  <a href={`https://${userData.links.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 p-3 rounded-xl bg-pink-50/80 min-h-[44px] touch-manipulation hover:bg-pink-100/60 transition-colors group" aria-label="Open LinkedIn profile">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 shrink-0 rounded-lg bg-pink-500 flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-white" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800">LinkedIn</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 truncate">{userData.links.linkedin}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-700 transition-colors" aria-hidden="true" />
                  </a>
                )}
                {userData.links.github && (
                  <a href={`https://${userData.links.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-50/80 min-h-[44px] touch-manipulation hover:bg-amber-100/60 transition-colors group" aria-label="Open GitHub profile">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 shrink-0 rounded-lg bg-amber-500 flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-white" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800">GitHub</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 truncate">{userData.links.github}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-700 transition-colors" aria-hidden="true" />
                  </a>
                )}
                {userData.links.portfolio && (
                  <a href={`https://${userData.links.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 p-3 rounded-xl bg-blue-50/80 min-h-[44px] touch-manipulation hover:bg-blue-100/60 transition-colors group" aria-label="Open portfolio">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-500 flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-white" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800">Portfolio</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 truncate">{userData.links.portfolio}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-700 transition-colors" aria-hidden="true" />
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
