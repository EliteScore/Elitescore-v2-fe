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
        "relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-brand/30 to-brand-2/30 p-1",
        className
      )}
      aria-hidden="true"
    >
      <Avatar className="w-full h-full rounded-2xl border-2 border-background">
        {avatarUrl && <AvatarImage src={avatarUrl} alt="" className="object-cover" />}
        <AvatarFallback className="rounded-2xl bg-background text-2xl md:text-3xl font-semibold text-foreground">
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
        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-8 text-center max-w-md">
          <p className="text-xs text-muted-foreground mb-2">Not found</p>
          <h1 className="text-xl font-semibold text-foreground mb-3">Profile not found</h1>
          <Button asChild>
            <Link href="/leaderboard" aria-label="Back to leaderboard">Back to Leaderboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl space-y-6">
        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <ProfilePicture name={profile.name} avatarUrl={profile.avatarUrl} />
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground">{profile.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-foreground" aria-hidden="true" />
                    <span className="font-semibold text-foreground">{profile.score.toLocaleString()}</span>
                    EliteScore
                  </span>
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-foreground" aria-hidden="true" />
                    Rank #{profile.rank}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-foreground" aria-hidden="true" />
                    <span className="font-semibold text-foreground">{profile.streak}</span> day streak
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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Completed", value: profile.stats.totalCompleted, icon: Check, tone: "text-foreground" },
            { label: "Max Difficulty", value: `${profile.stats.highestDifficulty}/5`, icon: Target, tone: "text-foreground" },
            { label: "Longest Streak", value: profile.stats.longestStreak, icon: Flame, tone: "text-foreground" },
            { label: "Consistency", value: `${profile.stats.consistencyRate}%`, icon: TrendingUp, tone: "text-foreground" },
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
          <h2 className="text-lg font-semibold mb-4">Challenge History</h2>
          <div className="space-y-3">
            {profile.challengeHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">No challenge history yet.</p>
            ) : (
              profile.challengeHistory.map((challenge) => (
                <div
                  key={challenge.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-xl border",
                    challenge.status === "completed"
                      ? "border-brand/30 bg-brand/5"
                      : "border-red-500/30 bg-red-500/5"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      challenge.status === "completed" ? "bg-brand/15" : "bg-red-500/15"
                    )}
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
              ))
            )}
          </div>
        </div>

        {profile.links && (profile.links.linkedin || profile.links.github || profile.links.portfolio) && (
          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6">
            <h2 className="text-lg font-semibold mb-4">External Links</h2>
            <div className="space-y-3">
              {profile.links.linkedin && (
                <a
                  href={`https://${profile.links.linkedin}`}
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
                      <p className="text-xs text-muted-foreground">{profile.links.linkedin}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                </a>
              )}
              {profile.links.github && (
                <a
                  href={`https://${profile.links.github}`}
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
                      <p className="text-xs text-muted-foreground">{profile.links.github}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                </a>
              )}
              {profile.links.portfolio && (
                <a
                  href={`https://${profile.links.portfolio}`}
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
                      <p className="text-xs text-muted-foreground">{profile.links.portfolio}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => router.back()}
          className="w-full border-border/60 bg-transparent"
          aria-label="Back to leaderboard"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Leaderboard
        </Button>
      </div>

    </div>
  )
}
