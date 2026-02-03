import type {
  AnalyticsSnapshot,
  DailyPlan,
  InboxNotification,
  PlannerGoal,
  PlannerTask,
} from "@/lib/types/product"

const today = "2026-02-03"

export const plannerGoalsSeed: PlannerGoal[] = [
  {
    id: "goal-1",
    title: "Finish 5 challenge tasks this week",
    period: "weekly",
    targetCount: 5,
    completedCount: 3,
    dueDateISO: "2026-02-08",
    linkedChallengeId: 1,
    createdAtISO: "2026-01-30T08:00:00Z",
    updatedAtISO: "2026-02-03T09:30:00Z",
  },
  {
    id: "goal-2",
    title: "45 minutes of focused learning today",
    period: "daily",
    targetCount: 45,
    completedCount: 25,
    dueDateISO: today,
    createdAtISO: "2026-02-03T06:00:00Z",
    updatedAtISO: "2026-02-03T10:10:00Z",
  },
]

export const plannerTasksSeed: PlannerTask[] = [
  {
    id: "task-1",
    title: "Solve 3 LeetCode medium problems",
    status: "in_progress",
    estimateMinutes: 35,
    dueAtISO: "2026-02-03T19:00:00Z",
    category: "Skills",
    linkedGoalId: "goal-1",
    linkedChallengeId: 1,
  },
  {
    id: "task-2",
    title: "Post one LinkedIn insight",
    status: "todo",
    estimateMinutes: 15,
    dueAtISO: "2026-02-03T18:30:00Z",
    category: "Career",
    linkedChallengeId: 2,
  },
  {
    id: "task-3",
    title: "Review streak-saving rules",
    status: "done",
    estimateMinutes: 10,
    dueAtISO: "2026-02-03T16:00:00Z",
    completedAtISO: "2026-02-03T15:40:00Z",
    category: "Consistency",
  },
  {
    id: "task-4",
    title: "Portfolio refactor checklist",
    status: "missed",
    estimateMinutes: 20,
    dueAtISO: "2026-02-02T18:00:00Z",
    category: "Projects",
  },
]

export const dailyPlanSeed: DailyPlan = {
  dateISO: today,
  tasks: plannerTasksSeed,
  focusMinutesTarget: 45,
}

export const analyticsSnapshotsSeed: AnalyticsSnapshot[] = [
  { dateISO: "2026-01-28", eliteScore: 8202, streakDays: 8, completedTasks: 2, totalTasks: 3, challengeProgressAvg: 41 },
  { dateISO: "2026-01-29", eliteScore: 8228, streakDays: 9, completedTasks: 3, totalTasks: 3, challengeProgressAvg: 43 },
  { dateISO: "2026-01-30", eliteScore: 8254, streakDays: 10, completedTasks: 2, totalTasks: 3, challengeProgressAvg: 44 },
  { dateISO: "2026-01-31", eliteScore: 8274, streakDays: 11, completedTasks: 3, totalTasks: 4, challengeProgressAvg: 46 },
  { dateISO: "2026-02-01", eliteScore: 8291, streakDays: 12, completedTasks: 2, totalTasks: 3, challengeProgressAvg: 48 },
  { dateISO: "2026-02-02", eliteScore: 8306, streakDays: 13, completedTasks: 2, totalTasks: 4, challengeProgressAvg: 49 },
  { dateISO: "2026-02-03", eliteScore: 8247, streakDays: 12, completedTasks: 1, totalTasks: 3, challengeProgressAvg: 45 },
]

export const notificationsSeed: InboxNotification[] = [
  {
    id: "notif-1",
    type: "streak_risk",
    priority: "high",
    title: "Your streak is at risk today",
    body: "Complete one more task before 8:00 PM to protect your 12-day streak.",
    createdAtISO: "2026-02-03T16:10:00Z",
    read: false,
    actionLabel: "Open Planner",
    actionHref: "/planner",
  },
  {
    id: "notif-2",
    type: "leaderboard_change",
    priority: "medium",
    title: "Leaderboard movement: +3",
    body: "You climbed 3 places since yesterday. Keep momentum to hold rank.",
    createdAtISO: "2026-02-03T12:00:00Z",
    read: false,
    actionLabel: "View Leaderboard",
    actionHref: "/leaderboard",
  },
  {
    id: "notif-3",
    type: "supporter_action",
    priority: "low",
    title: "Supporter sent you hype",
    body: "Sam cheered your recent progress. Great consistency this week.",
    createdAtISO: "2026-02-02T19:40:00Z",
    read: true,
    actionLabel: "Open Challenges",
    actionHref: "/challenges",
  },
  {
    id: "notif-4",
    type: "task_missed",
    priority: "high",
    title: "Task missed yesterday",
    body: "Portfolio refactor checklist was not submitted before the cutoff.",
    createdAtISO: "2026-02-02T18:05:00Z",
    read: true,
    actionLabel: "Review Planner",
    actionHref: "/planner",
  },
]
