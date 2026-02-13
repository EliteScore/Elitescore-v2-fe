export type LearningProvider = "udemy_business" | "coursera_enterprise"

export type ConnectionStatus = "active" | "expired" | "error"
export type CompletionState = "not_started" | "in_progress" | "completed"

export interface ProviderConnection {
  id: string
  userId: string
  provider: LearningProvider
  status: ConnectionStatus
  scopes: string[]
  expiresAtISO?: string
  createdAtISO: string
  updatedAtISO: string
}

export interface ProviderCourse {
  providerCourseId: string
  title: string
  providerUrl: string
  thumbnailUrl?: string
}

export interface QuestCourseLink {
  questId: number
  connectionId: string
  providerCourseId: string
  provider: LearningProvider
  createdAtISO: string
}

export interface QuestProgressSync {
  questId: number
  progressPercent: number
  completionState: CompletionState
  providerCompletedAtISO?: string
  lastSyncedAtISO?: string
  syncSource?: LearningProvider
  linked?: boolean
  stale?: boolean
  connectionId?: string
  providerCourseId?: string
}

export interface SyncRun {
  id: string
  provider: LearningProvider
  startedAtISO: string
  finishedAtISO?: string
  status: "ok" | "partial" | "failed"
  processed: number
  updated: number
  failures: number
}

export interface SyncFailure {
  id: string
  runId: string
  provider: LearningProvider
  connectionId: string
  questId?: number
  message: string
  createdAtISO: string
}

