"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Flame,
  Trophy,
  Target,
  Check,
  X,
  TrendingUp,
  Share2,
  LinkIcon,
  ExternalLink,
} from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0]?.slice(0, 2) ?? "?").toUpperCase()
}

type PublicProfileData = {
  name: string
  rank: number
  score: number
  streak: number
  isActive: boolean
  avatarUrl?: string | null
  stats: { totalCompleted: number; highestDifficulty: number; longestStreak: number; consistencyRate: number }
  challengeHistory: Array<{
    id: number
    name: string
    difficulty: number
    duration: number
    status: "completed" | "failed"
    completionDate?: string
    failureDate?: string
    proofCount: number
  }>
  links?: { linkedin?: string; github?: string; portfolio?: string }
}

const mockProfiles: Record<string, PublicProfileData> = {
  "1": {
    name: "Emma W.",
    rank: 1,
    score: 1247,
    streak: 45,
    isActive: true,
    stats: { totalCompleted: 28, highestDifficulty: 5, longestStreak: 89, consistencyRate: 92 },
    challengeHistory: [
      { id: 1, name: "30-Day Coding Sprint", difficulty: 5, duration: 30, status: "completed", completionDate: "2024-12-15", proofCount: 30 },
      { id: 2, name: "Morning Routine", difficulty: 3, duration: 21, status: "completed", completionDate: "2024-11-30", proofCount: 21 },
      { id: 3, name: "Read 5 Books", difficulty: 4, duration: 60, status: "failed", failureDate: "2024-10-20", proofCount: 12 },
    ],
    links: { linkedin: "linkedin.com/in/emmaw", github: "github.com/emmaw" },
  },
  "2": {
    name: "James L.",
    rank: 2,
    score: 1189,
    streak: 38,
    isActive: true,
    stats: { totalCompleted: 22, highestDifficulty: 5, longestStreak: 56, consistencyRate: 85 },
    challengeHistory: [
      { id: 1, name: "Python Mastery", difficulty: 4, duration: 30, status: "completed", completionDate: "2024-12-01", proofCount: 28 },
      { id: 2, name: "No Social Media", difficulty: 5, duration: 30, status: "failed", failureDate: "2024-11-10", proofCount: 18 },
    ],
    links: { linkedin: "linkedin.com/in/jamesl" },
  },
  "3": {
    name: "Sofia R.",
    rank: 3,
    score: 1156,
    streak: 41,
    isActive: true,
    stats: { totalCompleted: 25, highestDifficulty: 4, longestStreak: 72, consistencyRate: 88 },
    challengeHistory: [
      { id: 1, name: "21-Day Fitness", difficulty: 3, duration: 21, status: "completed", completionDate: "2024-12-20", proofCount: 21 },
      { id: 2, name: "LinkedIn Growth", difficulty: 4, duration: 14, status: "completed", completionDate: "2024-11-15", proofCount: 14 },
    ],
  },
  "24": {
    name: "Alex M.",
    rank: 24,
    score: 843,
    streak: 9,
    isActive: true,
    stats: { totalCompleted: 8, highestDifficulty: 4, longestStreak: 21, consistencyRate: 72 },
    challengeHistory: [
      { id: 1, name: "14-Day SQL", difficulty: 3, duration: 14, status: "completed", completionDate: "2024-12-10", proofCount: 14 },
    ],
  },
}

function ProfilePicture({
  name,
  avatarUrl,
  className,
}: {
  name: string
  avatarUrl?: string | null
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#2bbcff] to-[#a855f7] p-1",
        className
      )}
      aria-hidden="true"
    >
      <Avatar className="w-full h-full rounded-full border-2 border-background">
        {avatarUrl && (
          <AvatarImage src={avatarUrl} alt="" className="object-cover" />
        )}
        <AvatarFallback className="rounded-full bg-background text-2xl md:text-3xl font-bold bg-gradient-to-br from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    if (id === "current") router.replace("/profile")
  }, [id, router])

  if (id === "current") return null

  const profile = mockProfiles[id]

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 pb-20">
        <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-8 text-center max-w-md">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Not found</p>
          <h1 className="text-xl font-bold text-foreground mb-3">Profile not found</h1>
          <Button asChild className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-[10px] h-9 font-bold uppercase tracking-wider">
            <Link href="/leaderboard" aria-label="Back to leaderboard">Back to Leaderboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        {/* Profile Header - same layout as app/profile */}
        <div className="glass-card rounded-xl border border-[#2bbcff]/30 bg-card/50 backdrop-blur-sm p-5 md:p-8 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 md:gap-0 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-5 w-full sm:w-auto">
              <ProfilePicture name={profile.name} avatarUrl={profile.avatarUrl} />
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{profile.name}</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 md:gap-4 text-xs md:text-sm">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3 h-3 md:w-4 md:h-4 text-[#2bbcff]" aria-hidden="true" />
                    <span className="font-bold text-[#2bbcff]">{profile.score.toLocaleString()}</span>
                    <span className="text-muted-foreground hidden sm:inline">EliteScore</span>
                  </span>
                  <span className="text-muted-foreground hidden sm:inline">·</span>
                  <span className="text-[10px] md:text-xs font-medium text-muted-foreground">
                    Rank #{profile.rank}
                  </span>
                  <span className="text-muted-foreground hidden sm:inline">·</span>
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3 h-3 md:w-4 md:h-4 text-orange-500" aria-hidden="true" />
                    <span className="font-bold text-orange-500">{profile.streak}</span>
                    <span className="text-muted-foreground text-[10px] md:text-xs">day streak</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <Button
                size="sm"
                variant="outline"
                className="border-[#2bbcff]/50 hover:bg-[#2bbcff]/10 text-[10px] md:text-xs h-7 md:h-8 bg-transparent flex-1 sm:flex-initial"
              >
                <Share2 className="w-3 h-3 mr-1.5" aria-hidden="true" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#2bbcff]/50 hover:bg-[#2bbcff]/10 text-[10px] md:text-xs h-7 md:h-8 bg-transparent flex-1 sm:flex-initial"
              >
                <LinkIcon className="w-3 h-3 mr-1.5" aria-hidden="true" />
                <span className="hidden sm:inline">Copy Link</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Credibility Stats - same 4 cards as app/profile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <Check className="w-4 h-4 text-[#2bbcff]" aria-hidden="true" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile.stats.totalCompleted}</p>
          </div>
          <div className="glass-card rounded-xl border border-[#a855f7]/20 bg-card/50 backdrop-blur-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-[#a855f7]" aria-hidden="true" />
              <span className="text-xs text-muted-foreground">Max Difficulty</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile.stats.highestDifficulty}/5</p>
          </div>
          <div className="glass-card rounded-xl border border-orange-500/20 bg-card/50 backdrop-blur-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" aria-hidden="true" />
              <span className="text-xs text-muted-foreground">Longest Streak</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile.stats.longestStreak}</p>
          </div>
          <div className="glass-card rounded-xl border border-green-500/20 bg-card/50 backdrop-blur-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" aria-hidden="true" />
              <span className="text-xs text-muted-foreground">Consistency</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{profile.stats.consistencyRate}%</p>
          </div>
        </div>

        {/* Challenge History - same structure as app/profile */}
        <div className="glass-card rounded-xl border border-[#2bbcff]/30 bg-card/50 backdrop-blur-sm p-5 md:p-6 mb-4 md:mb-6">
          <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4">Challenge History</h2>
          <p className="text-[10px] md:text-xs text-muted-foreground mb-3 md:mb-4">
            Public & immutable — failures are visible
          </p>
          <div className="space-y-3">
            {profile.challengeHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No challenge history yet.</p>
            ) : (
              profile.challengeHistory.map((challenge) => (
                <div
                  key={challenge.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border transition-all",
                    challenge.status === "completed"
                      ? "bg-[#2bbcff]/5 border-[#2bbcff]/20 hover:border-[#2bbcff]/40"
                      : "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        challenge.status === "completed" ? "bg-[#2bbcff]/20" : "bg-red-500/20"
                      )}
                      aria-hidden="true"
                    >
                      {challenge.status === "completed" ? (
                        <Check className="w-5 h-5 text-[#2bbcff]" aria-hidden="true" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground">{challenge.name}</h3>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs px-2 py-0.5",
                            challenge.status === "completed"
                              ? "bg-[#2bbcff]/10 text-[#2bbcff] border-[#2bbcff]/30"
                              : "bg-red-500/10 text-red-500 border-red-500/30"
                          )}
                        >
                          {challenge.status === "completed" ? "Completed" : "Failed"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span>Difficulty: {challenge.difficulty}/5</span>
                        <span>·</span>
                        <span>{challenge.duration} days</span>
                        <span>·</span>
                        <span>{challenge.proofCount} proofs</span>
                        <span>·</span>
                        <span>{challenge.status === "completed" ? challenge.completionDate : challenge.failureDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* External Links - same as app/profile when present */}
        {profile.links && (profile.links.linkedin || profile.links.github || profile.links.portfolio) && (
          <div className="glass-card rounded-xl border border-[#2bbcff]/30 bg-card/50 backdrop-blur-sm p-5 md:p-6 mb-4 md:mb-6">
            <h2 className="text-lg font-bold mb-4">External Links</h2>
            <div className="space-y-3">
              {profile.links.linkedin && (
                <a
                  href={`https://${profile.links.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-[#2bbcff]/20 bg-[#2bbcff]/5 hover:border-[#2bbcff]/40 transition-all group"
                  aria-label="Open LinkedIn profile"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2bbcff]/20 flex items-center justify-center shrink-0">
                      <LinkIcon className="w-4 h-4 text-[#2bbcff]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">LinkedIn</p>
                      <p className="text-xs text-muted-foreground">{profile.links.linkedin}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[#2bbcff] transition-colors shrink-0" aria-hidden="true" />
                </a>
              )}
              {profile.links.github && (
                <a
                  href={`https://${profile.links.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-[#a855f7]/20 bg-[#a855f7]/5 hover:border-[#a855f7]/40 transition-all group"
                  aria-label="Open GitHub profile"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#a855f7]/20 flex items-center justify-center shrink-0">
                      <LinkIcon className="w-4 h-4 text-[#a855f7]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">GitHub</p>
                      <p className="text-xs text-muted-foreground">{profile.links.github}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[#a855f7] transition-colors shrink-0" aria-hidden="true" />
                </a>
              )}
              {profile.links.portfolio && (
                <a
                  href={`https://${profile.links.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-border/20 bg-muted/30 hover:border-border/40 transition-all group"
                  aria-label="Open portfolio"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <LinkIcon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Portfolio</p>
                      <p className="text-xs text-muted-foreground">{profile.links.portfolio}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => router.back()}
          className="w-full border-[#2bbcff]/50 hover:bg-[#2bbcff]/10 text-[10px] h-10 font-bold uppercase tracking-wider"
          aria-label="Back to leaderboard"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Leaderboard
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
