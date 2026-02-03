export type GoalPeriod = "daily" | "weekly"
export type TaskStatus = "todo" | "in_progress" | "done" | "missed"
export type NotificationType =
  | "task_due"
  | "task_missed"
  | "streak_risk"
  | "challenge_update"
  | "leaderboard_change"
  | "supporter_action"
  | "system"
export type NotificationPriority = "low" | "medium" | "high"

export interface PlannerGoal {
  id: string
  title: string
  period: GoalPeriod
  targetCount: number
  completedCount: number
  dueDateISO: string
  linkedChallengeId?: number
  createdAtISO: string
  updatedAtISO: string
}

export interface PlannerTask {
  id: string
  title: string
  status: TaskStatus
  estimateMinutes?: number
  dueAtISO: string
  completedAtISO?: string
  category?: string
  linkedGoalId?: string
  linkedChallengeId?: number
  notes?: string
}

export interface DailyPlan {
  dateISO: string
  tasks: PlannerTask[]
  focusMinutesTarget?: number
}

export interface AnalyticsSnapshot {
  dateISO: string
  eliteScore: number
  streakDays: number
  completedTasks: number
  totalTasks: number
  challengeProgressAvg: number
}

export interface AnalyticsRangeSummary {
  fromISO: string
  toISO: string
  scoreDelta: number
  streakDelta: number
  completionRate: number
  consistencyRate: number
  trend: "up" | "flat" | "down"
  snapshots: AnalyticsSnapshot[]
}

export interface InboxNotification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  body: string
  createdAtISO: string
  read: boolean
  actionLabel?: string
  actionHref?: string
  relatedTaskId?: string
  relatedChallengeId?: number
}
