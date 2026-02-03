"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { dailyPlanSeed, plannerGoalsSeed } from "@/lib/mock/product"
import type { PlannerTask, TaskStatus } from "@/lib/types/product"
import { CalendarCheck2, CheckCircle2, Circle, Clock3, ListTodo, PlayCircle, XCircle } from "lucide-react"

const statusOrder: TaskStatus[] = ["todo", "in_progress", "done", "missed"]

function nextStatus(current: TaskStatus): TaskStatus {
  const index = statusOrder.indexOf(current)
  return statusOrder[(index + 1) % statusOrder.length]
}

export default function PlannerPage() {
  const [tasks, setTasks] = useState<PlannerTask[]>(dailyPlanSeed.tasks)

  const completedCount = useMemo(() => tasks.filter((task) => task.status === "done").length, [tasks])
  const totalCount = tasks.length

  const totalFocusMinutes = useMemo(
    () => tasks.filter((task) => task.status === "done").reduce((sum, task) => sum + (task.estimateMinutes ?? 0), 0),
    [tasks]
  )

  const focusTarget = dailyPlanSeed.focusMinutesTarget ?? 0
  const focusProgress = focusTarget > 0 ? Math.min(Math.round((totalFocusMinutes / focusTarget) * 100), 100) : 0

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="container mx-auto px-4 py-6 md:py-8 space-y-6 max-w-6xl">
        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center" aria-hidden="true">
              <CalendarCheck2 className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Goals & Planner</p>
              <h1 className="text-xl font-semibold text-foreground">Plan your day, protect your streak</h1>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Tasks completed</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{completedCount}/{totalCount}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Focus minutes</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{totalFocusMinutes}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Focus target</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{focusProgress}%</div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <ListTodo className="w-4 h-4 text-foreground" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">Today&apos;s tasks</h2>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() =>
                  setTasks((prev) =>
                    prev.map((entry) => (entry.id === task.id ? { ...entry, status: nextStatus(entry.status) } : entry))
                  )
                }
                className="w-full rounded-xl border border-border/60 bg-card/60 p-4 text-left hover:border-brand/40 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {task.status === "done" ? (
                      <CheckCircle2 className="w-5 h-5 text-foreground mt-0.5" aria-hidden="true" />
                    ) : task.status === "in_progress" ? (
                      <PlayCircle className="w-5 h-5 text-foreground mt-0.5" aria-hidden="true" />
                    ) : task.status === "missed" ? (
                      <XCircle className="w-5 h-5 text-foreground mt-0.5" aria-hidden="true" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground mt-0.5" aria-hidden="true" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">{task.title}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        {task.category && <span>{task.category}</span>}
                        {task.estimateMinutes && (
                          <span className="flex items-center gap-1">
                            <Clock3 className="w-3 h-3" aria-hidden="true" />
                            {task.estimateMinutes} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize text-xs">
                    {task.status.replace("_", " ")}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6 shadow-lg">
          <h2 className="text-base font-semibold text-foreground mb-4">Active goals</h2>
          <div className="space-y-3">
            {plannerGoalsSeed.map((goal) => {
              const progress = Math.min(Math.round((goal.completedCount / Math.max(goal.targetCount, 1)) * 100), 100)
              return (
                <div key={goal.id} className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{goal.title}</p>
                    <Badge variant="outline" className="capitalize">{goal.period}</Badge>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {goal.completedCount}/{goal.targetCount} complete - due {goal.dueDateISO}
                  </p>
                </div>
              )
            })}
          </div>
          <Button variant="outline" className="mt-4 w-full sm:w-auto">Create Goal</Button>
        </div>
      </section>
    </div>
  )
}
