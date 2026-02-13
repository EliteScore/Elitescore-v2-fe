"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  Flame,
  Link2,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Target,
  Trophy,
  Upload,
  XCircle,
} from "lucide-react"
import type { LearningProvider, ProviderConnection, ProviderCourse, QuestProgressSync } from "@/lib/types/integrations"

type Track = "Technical Skills" | "Career Development" | "Wellness" | "Learning"

type ActiveChallenge = {
  id: number
  name: string
  track: Track
  difficulty: number
  progress: number
  day: number
  totalDays: number
  daysRemaining: number
  reward: number
  todayTask: string
}

type LibraryChallenge = {
  id: number
  name: string
  track: Track
  difficulty: number
  duration: number
  reward: number
  completionRate: number
  description: string
}

type HistoryChallenge = {
  id: number
  name: string
  status: "completed" | "failed"
  completedDate: string
  scoreImpact: string
}

const MAX_ACTIVE_CHALLENGES = 2

const initialActiveChallenges: ActiveChallenge[] = [
  {
    id: 1,
    name: "30-Day Python Mastery",
    track: "Technical Skills",
    difficulty: 4,
    progress: 42,
    day: 13,
    totalDays: 30,
    daysRemaining: 17,
    reward: 450,
    todayTask: "Solve 3 medium Python problems and submit screenshots.",
  },
  {
    id: 2,
    name: "14-Day LinkedIn Growth",
    track: "Career Development",
    difficulty: 2,
    progress: 57,
    day: 8,
    totalDays: 14,
    daysRemaining: 6,
    reward: 140,
    todayTask: "Post one insight and engage with 5 industry posts.",
  },
]

const challengeLibrary: LibraryChallenge[] = [
  {
    id: 3,
    name: "7-Day SQL Sprint",
    track: "Technical Skills",
    difficulty: 3,
    duration: 7,
    reward: 95,
    completionRate: 78,
    description: "Daily SQL drills for querying, joins, and optimization.",
  },
  {
    id: 4,
    name: "21-Day Portfolio Builder",
    track: "Career Development",
    difficulty: 4,
    duration: 21,
    reward: 300,
    completionRate: 56,
    description: "Ship one portfolio improvement every day for 3 weeks.",
  },
  {
    id: 5,
    name: "14-Day Reading Discipline",
    track: "Learning",
    difficulty: 2,
    duration: 14,
    reward: 150,
    completionRate: 74,
    description: "Read 30 pages daily and publish one summary each week.",
  },
  {
    id: 6,
    name: "7-Day Focus Reset",
    track: "Wellness",
    difficulty: 1,
    duration: 7,
    reward: 70,
    completionRate: 83,
    description: "Morning planning + evening shutdown ritual with proof.",
  },
]

const initialHistory: HistoryChallenge[] = [
  {
    id: 101,
    name: "14-Day JavaScript Sprint",
    status: "completed",
    completedDate: "2026-01-10",
    scoreImpact: "+160",
  },
  {
    id: 102,
    name: "7-Day Cold Outreach",
    status: "failed",
    completedDate: "2025-12-28",
    scoreImpact: "-35",
  },
]

const trackFilters: Array<"All" | Track> = ["All", "Technical Skills", "Career Development", "Learning", "Wellness"]
const difficultyFilters: Array<"All" | 1 | 2 | 3 | 4 | 5> = ["All", 1, 2, 3, 4, 5]
const providerOptions: Array<{ provider: LearningProvider; label: string }> = [
  { provider: "udemy_business", label: "Udemy Business" },
  { provider: "coursera_enterprise", label: "Coursera Enterprise" },
]

function providerLabel(provider: LearningProvider) {
  return provider === "udemy_business" ? "Udemy Business" : "Coursera Enterprise"
}

export default function ChallengesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeChallenges, setActiveChallenges] = useState<ActiveChallenge[]>(initialActiveChallenges)
  const [history, setHistory] = useState<HistoryChallenge[]>(initialHistory)
  const [query, setQuery] = useState("")
  const [track, setTrack] = useState<"All" | Track>("All")
  const [difficulty, setDifficulty] = useState<"All" | 1 | 2 | 3 | 4 | 5>("All")
  const [proofChallengeId, setProofChallengeId] = useState<number | null>(null)
  const [proofText, setProofText] = useState("")
  const [connections, setConnections] = useState<ProviderConnection[]>([])
  const [syncStates, setSyncStates] = useState<Record<number, QuestProgressSync>>({})
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isConnectingProvider, setIsConnectingProvider] = useState<LearningProvider | null>(null)
  const [loadingConnections, setLoadingConnections] = useState(false)
  const [linkChallengeId, setLinkChallengeId] = useState<number | null>(null)
  const [selectedConnectionId, setSelectedConnectionId] = useState("")
  const [courseQuery, setCourseQuery] = useState("")
  const [courses, setCourses] = useState<ProviderCourse[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [savingLink, setSavingLink] = useState(false)

  const activeCount = activeChallenges.length
  const canJoin = activeCount < MAX_ACTIVE_CHALLENGES

  const todaysTasks = activeChallenges.map((challenge) => ({
    id: challenge.id,
    name: challenge.name,
    task: challenge.todayTask,
    due: "Today",
  }))

  const loadConnections = useCallback(async () => {
    setLoadingConnections(true)
    try {
      const response = await fetch("/api/integrations/connections")
      if (!response.ok) return
      const data = (await response.json()) as { connections: ProviderConnection[] }
      setConnections(data.connections)
    } finally {
      setLoadingConnections(false)
    }
  }, [])

  const loadSyncStates = useCallback(async (questIds: number[]) => {
    if (questIds.length === 0) return
    const response = await fetch(`/api/quests/sync-states?questIds=${questIds.join(",")}`)
    if (!response.ok) return
    const data = (await response.json()) as { states: QuestProgressSync[] }
    setSyncStates((prev) => {
      const next = { ...prev }
      for (const state of data.states) {
        next[state.questId] = state
      }
      return next
    })
  }, [])

  useEffect(() => {
    void loadConnections()
    void loadSyncStates(initialActiveChallenges.map((item) => item.id))
  }, [loadConnections, loadSyncStates])

  useEffect(() => {
    const integration = searchParams.get("integration")
    if (integration === "connected") {
      setStatusMessage("Learning account connected successfully.")
      void loadConnections()
    } else if (integration === "failed") {
      setStatusMessage("Connection failed. Try again.")
    } else if (integration === "missing_code") {
      setStatusMessage("Missing provider callback code.")
    }

    if (integration) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("integration")
      router.replace(`/challenges${params.toString() ? `?${params.toString()}` : ""}`)
    }
  }, [searchParams, router, loadConnections])

  const discoverList = useMemo(() => {
    return challengeLibrary.filter((item) => {
      const byQuery =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      const byTrack = track === "All" || item.track === track
      const byDifficulty = difficulty === "All" || item.difficulty === difficulty
      return byQuery && byTrack && byDifficulty
    })
  }, [query, track, difficulty])

  const isAlreadyActive = (id: number) => activeChallenges.some((challenge) => challenge.id === id)

  const joinChallenge = (item: LibraryChallenge) => {
    if (!canJoin || isAlreadyActive(item.id)) return
    const newChallenge: ActiveChallenge = {
      id: item.id,
      name: item.name,
      track: item.track,
      difficulty: item.difficulty,
      progress: 0,
      day: 1,
      totalDays: item.duration,
      daysRemaining: item.duration - 1,
      reward: item.reward,
      todayTask: `Start strong: ${item.description.slice(0, 70)}...`,
    }
    setActiveChallenges((prev) => [...prev, newChallenge])
    void loadSyncStates([item.id])
  }

  const quitChallenge = (id: number) => {
    const target = activeChallenges.find((challenge) => challenge.id === id)
    if (!target) return
    setActiveChallenges((prev) => prev.filter((challenge) => challenge.id !== id))
    setHistory((prev) => [
      {
        id: Date.now(),
        name: target.name,
        status: "failed",
        completedDate: new Date().toISOString().slice(0, 10),
        scoreImpact: "-35",
      },
      ...prev,
    ])
  }

  const submitProof = () => {
    if (!proofChallengeId) return
    if (syncStates[proofChallengeId]?.linked) {
      setStatusMessage("This quest is linked to a provider course. Refresh provider progress instead.")
      return
    }
    setActiveChallenges((prev) =>
      prev.map((challenge) => {
        if (challenge.id !== proofChallengeId) return challenge
        return {
          ...challenge,
          progress: Math.min(challenge.progress + 7, 100),
          day: Math.min(challenge.day + 1, challenge.totalDays),
          daysRemaining: Math.max(challenge.daysRemaining - 1, 0),
        }
      })
    )
    setProofText("")
    setProofChallengeId(null)
  }

  const connectProvider = async (provider: LearningProvider) => {
    setIsConnectingProvider(provider)
    try {
      const response = await fetch(`/api/integrations/${provider}/connect`, { method: "POST" })
      const data = (await response.json()) as { authUrl?: string; error?: string }
      if (!response.ok || !data.authUrl) {
        setStatusMessage(data.error || "Unable to start provider connection.")
        return
      }
      window.location.href = data.authUrl
    } finally {
      setIsConnectingProvider(null)
    }
  }

  const refreshLinkedProgress = async (questId: number) => {
    const response = await fetch(`/api/quests/${questId}/refresh-progress`, { method: "POST" })
    const data = (await response.json()) as { progress?: QuestProgressSync; error?: string }
    if (!response.ok || !data.progress) {
      setStatusMessage(data.error || "Failed to sync progress.")
      return
    }
    setSyncStates((prev) => ({ ...prev, [questId]: data.progress! }))
    setStatusMessage("Progress synced from provider.")
  }

  const openLinkModal = (challengeId: number) => {
    setLinkChallengeId(challengeId)
    setSelectedConnectionId(connections[0]?.id || "")
    setCourseQuery("")
    setCourses([])
    setSelectedCourseId("")
  }

  const fetchCourses = useCallback(async () => {
    if (!selectedConnectionId) return
    const selectedConnection = connections.find((item) => item.id === selectedConnectionId)
    if (!selectedConnection) return

    setLoadingCourses(true)
    try {
      const queryPart = courseQuery.trim() ? `&q=${encodeURIComponent(courseQuery.trim())}` : ""
      const response = await fetch(
        `/api/integrations/${selectedConnection.provider}/courses?connectionId=${selectedConnectionId}${queryPart}`
      )
      const data = (await response.json()) as { courses?: ProviderCourse[]; error?: string }
      if (!response.ok) {
        setStatusMessage(data.error || "Failed to fetch courses.")
        return
      }
      setCourses(data.courses || [])
      if (!selectedCourseId && data.courses?.[0]) {
        setSelectedCourseId(data.courses[0].providerCourseId)
      }
    } finally {
      setLoadingCourses(false)
    }
  }, [selectedConnectionId, connections, courseQuery, selectedCourseId])

  useEffect(() => {
    if (!linkChallengeId || !selectedConnectionId) return
    void fetchCourses()
  }, [linkChallengeId, selectedConnectionId, fetchCourses])

  const linkCourseToQuest = async () => {
    if (!linkChallengeId || !selectedConnectionId || !selectedCourseId) return
    const selectedConnection = connections.find((item) => item.id === selectedConnectionId)
    if (!selectedConnection) return

    setSavingLink(true)
    try {
      const response = await fetch(`/api/quests/${linkChallengeId}/link-course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectionId: selectedConnectionId,
          provider: selectedConnection.provider,
          providerCourseId: selectedCourseId,
        }),
      })
      const data = (await response.json()) as { error?: string }
      if (!response.ok) {
        setStatusMessage(data.error || "Failed to link course.")
        return
      }
      await loadSyncStates([linkChallengeId])
      setStatusMessage("Course linked. Refresh provider progress to update quest.")
      setLinkChallengeId(null)
    } finally {
      setSavingLink(false)
    }
  }

  const unlinkCourse = async (questId: number) => {
    const response = await fetch(`/api/quests/${questId}/unlink-course`, { method: "POST" })
    if (!response.ok) {
      setStatusMessage("Failed to unlink course.")
      return
    }
    await loadSyncStates([questId])
    setStatusMessage("Course unlinked. Manual proof is enabled.")
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="container mx-auto max-w-7xl px-4 py-6 md:py-8 space-y-6">
        {statusMessage && (
          <div className="rounded-xl border border-border/60 bg-card/70 p-3 text-sm text-foreground">
            {statusMessage}
          </div>
        )}

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand/15 flex items-center justify-center" aria-hidden="true">
                <Target className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Challenge Arena</p>
                <h1 className="text-2xl font-semibold text-foreground">Commitments that move your rank</h1>
              </div>
            </div>
            <Badge variant="secondary" className={`${canJoin ? "bg-brand/15" : "bg-orange-500/10"} text-foreground`}>
              {activeCount}/{MAX_ACTIVE_CHALLENGES} active slots
            </Badge>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Active challenges</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{activeCount}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Tasks due today</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{todaysTasks.length}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Potential reward</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">
                +{activeChallenges.reduce((sum, challenge) => sum + challenge.reward, 0)}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-base font-semibold text-foreground">Learning account connections</h2>
            <Badge variant="outline">{connections.length} connected</Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {providerOptions.map((option) => (
              <Button
                key={option.provider}
                size="sm"
                variant="outline"
                onClick={() => void connectProvider(option.provider)}
                disabled={isConnectingProvider === option.provider}
              >
                <Link2 className="mr-1 h-3.5 w-3.5" />
                {isConnectingProvider === option.provider ? "Connecting..." : `Connect ${option.label}`}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            {loadingConnections ? (
              <p className="text-sm text-muted-foreground">Loading connections...</p>
            ) : connections.length === 0 ? (
              <p className="text-sm text-muted-foreground">No provider connected yet.</p>
            ) : (
              connections.map((connection) => (
                <div
                  key={connection.id}
                  className="rounded-lg border border-border/60 bg-card/60 p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{providerLabel(connection.provider)}</p>
                    <p className="text-xs text-muted-foreground">Status: {connection.status}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      await fetch(`/api/integrations/connections/${connection.id}`, { method: "DELETE" })
                      await loadConnections()
                      await loadSyncStates(activeChallenges.map((item) => item.id))
                    }}
                  >
                    Disconnect
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">Active commitments</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/planner">Open planner</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {activeChallenges.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/60 bg-muted/40 p-6 text-center">
                  <p className="text-sm text-muted-foreground">No active challenges. Join one below to begin climbing.</p>
                </div>
              ) : (
                activeChallenges.map((challenge) => {
                  const sync = syncStates[challenge.id]
                  const isLinked = Boolean(sync?.linked)
                  const displayProgress = isLinked ? sync?.progressPercent ?? challenge.progress : challenge.progress

                  return (
                  <article key={challenge.id} className="rounded-xl border border-border/60 bg-card/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{challenge.name}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{challenge.track}</span>
                          <span>•</span>
                          <span>Difficulty {challenge.difficulty}/5</span>
                          <span>•</span>
                          <span>Day {challenge.day}/{challenge.totalDays}</span>
                        </div>
                      </div>
                      <Badge variant="outline">+{challenge.reward}</Badge>
                    </div>

                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress {isLinked ? "(synced)" : "(manual)"}</span>
                        <span className="font-semibold text-foreground">{displayProgress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand to-brand-2" style={{ width: `${displayProgress}%` }} />
                      </div>
                      {isLinked && (
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Source: {sync?.syncSource ? providerLabel(sync.syncSource) : "Linked provider"}
                          {sync?.lastSyncedAtISO ? ` - Last sync: ${new Date(sync.lastSyncedAtISO).toLocaleString()}` : ""}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 rounded-lg border border-border/60 bg-muted/40 p-3">
                      <div className="text-xs font-medium text-foreground mb-1">Today&apos;s task</div>
                      <p className="text-sm text-muted-foreground">{challenge.todayTask}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {isLinked ? (
                        <Button size="sm" onClick={() => void refreshLinkedProgress(challenge.id)}>
                          <RefreshCcw className="mr-1 h-3.5 w-3.5" />
                          Refresh provider progress
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => setProofChallengeId(challenge.id)}>
                          <Upload className="mr-1 h-3.5 w-3.5" />
                          Submit proof
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void (isLinked ? unlinkCourse(challenge.id) : openLinkModal(challenge.id))}
                        disabled={!isLinked && connections.length === 0}
                      >
                        {isLinked ? "Unlink course" : connections.length === 0 ? "Connect account first" : "Link provider course"}
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/challenges/${challenge.id}`}>Details</Link>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => quitChallenge(challenge.id)}>
                        Quit
                      </Button>
                    </div>
                  </article>
                  )
                })
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="h-4 w-4 text-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Today&apos;s execution queue</h3>
              </div>
              <div className="space-y-2">
                {todaysTasks.map((task) => (
                  <div key={task.id} className="rounded-lg border border-border/60 bg-card/60 p-3">
                    <div className="text-xs font-medium text-foreground">{task.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{task.task}</div>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock3 className="h-3 w-3" />
                      {task.due}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Challenge rules</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-foreground" />
                  Max 2 active challenges for focus quality.
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 text-foreground" />
                  Missed proof can impact score and streak.
                </li>
                <li className="flex items-start gap-2">
                  <Flame className="h-4 w-4 mt-0.5 text-foreground" />
                  Consistency beats intensity over time.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-semibold text-foreground">Discover new challenges</h2>
            <div className="flex items-center gap-2">
              <div className="relative w-64 max-w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search challenges"
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              Track
            </span>
            {trackFilters.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={track === item ? "default" : "outline"}
                onClick={() => setTrack(item)}
              >
                {item}
              </Button>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Trophy className="h-3.5 w-3.5" />
              Difficulty
            </span>
            {difficultyFilters.map((item) => (
              <Button
                key={String(item)}
                size="sm"
                variant={difficulty === item ? "default" : "outline"}
                onClick={() => setDifficulty(item)}
              >
                {item === "All" ? "All" : `${item}/5`}
              </Button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {discoverList.map((item) => {
              const joined = isAlreadyActive(item.id)
              return (
                <article key={item.id} className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{item.track} • {item.duration} days • Difficulty {item.difficulty}/5</p>
                    </div>
                    <Badge variant="outline">+{item.reward}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Completion rate: {item.completionRate}%</p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => joinChallenge(item)}
                      disabled={!canJoin || joined}
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      {joined ? "Already active" : canJoin ? "Join challenge" : "Slots full"}
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/challenges/${item.id}`}>Preview</Link>
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6">
          <h2 className="text-base font-semibold text-foreground mb-3">Challenge history</h2>
          <div className="space-y-2">
            {history.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-border/60 bg-card/60 p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {entry.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 text-foreground" />
                  ) : (
                    <XCircle className="h-4 w-4 text-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{entry.completedDate}</p>
                  </div>
                </div>
                <Badge variant={entry.status === "completed" ? "secondary" : "outline"}>
                  {entry.status} • {entry.scoreImpact}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {proofChallengeId && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setProofChallengeId(null)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-border/60 bg-card p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-foreground">Submit today&apos;s proof</h3>
            <p className="mt-1 text-sm text-muted-foreground">Add a short summary and submit your evidence.</p>

            <textarea
              value={proofText}
              onChange={(event) => setProofText(event.target.value)}
              placeholder="What did you complete today?"
              className="mt-4 w-full min-h-24 rounded-xl border border-border/60 bg-background p-3 text-sm outline-none"
            />

            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setProofChallengeId(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={submitProof} disabled={!proofText.trim()}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {linkChallengeId && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setLinkChallengeId(null)}
        >
          <div
            className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-border/60 bg-card p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-foreground">Link provider course</h3>
            <p className="mt-1 text-sm text-muted-foreground">Choose one connected account and one course for this quest.</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Connected account</label>
                <select
                  className="mt-1 w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm"
                  value={selectedConnectionId}
                  onChange={(event) => setSelectedConnectionId(event.target.value)}
                >
                  <option value="">Select account</option>
                  {connections.map((connection) => (
                    <option key={connection.id} value={connection.id}>
                      {providerLabel(connection.provider)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Course search</label>
                <div className="mt-1 flex gap-2">
                  <Input value={courseQuery} onChange={(event) => setCourseQuery(event.target.value)} placeholder="Type course name" />
                  <Button type="button" variant="outline" onClick={() => void fetchCourses()} disabled={!selectedConnectionId || loadingCourses}>
                    {loadingCourses ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>

              <div className="max-h-52 overflow-auto rounded-lg border border-border/60 bg-card/40 p-2 space-y-2">
                {courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">No courses found.</p>
                ) : (
                  courses.map((course) => (
                    <button
                      key={course.providerCourseId}
                      type="button"
                      onClick={() => setSelectedCourseId(course.providerCourseId)}
                      className={`w-full text-left rounded-lg border p-2 ${
                        selectedCourseId === course.providerCourseId ? "border-brand bg-brand/10" : "border-border/60 bg-card/60"
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground">{course.title}</p>
                      <p className="text-xs text-muted-foreground break-all">{course.providerUrl}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setLinkChallengeId(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => void linkCourseToQuest()} disabled={!selectedConnectionId || !selectedCourseId || savingLink}>
                {savingLink ? "Linking..." : "Link course"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


