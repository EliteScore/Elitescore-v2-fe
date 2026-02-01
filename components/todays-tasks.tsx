"use client"

import { useState } from "react"
import { Check, Clock, ListTodo } from "lucide-react"

interface Task {
  id: string
  title: string
  duration: string
  category: string
  challengeName?: string
}

interface TodaysTasksProps {
  tasks: Task[]
}

export function TodaysTasks({ tasks }: TodaysTasksProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks)
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId)
    } else {
      newCompleted.add(taskId)
    }
    setCompletedTasks(newCompleted)
  }

  const completedCount = tasks.filter((task) => completedTasks.has(task.id)).length

  return (
    <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <ListTodo className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground">Today</div>
          <div className="text-sm font-semibold text-foreground">{completedCount} of {tasks.length} completed</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {tasks.map((task) => {
          const isCompleted = completedTasks.has(task.id)
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleTask(task.id)}
              aria-label={isCompleted ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
              className={`rounded-xl border p-3 transition-all cursor-pointer ${
                isCompleted
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-border/60 bg-card/60 hover:border-brand/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isCompleted ? "bg-green-500/20 border border-green-500/30" : "bg-muted/60 border border-border/60"
                  }`}
                  aria-hidden="true"
                >
                  {isCompleted && <Check className="w-4 h-4 text-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold mb-0.5 ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.title}
                  </h4>
                  {task.challengeName && (
                    <p className="text-xs text-muted-foreground mb-1.5">{task.challengeName}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                      {task.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">{task.category}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

