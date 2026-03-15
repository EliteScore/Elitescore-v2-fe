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
  embedded?: boolean
  theme?: "dark" | "light"
}

export function TodaysTasks({ tasks, embedded, theme = "dark" }: TodaysTasksProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const isLight = theme === "light"

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

  const content = (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={isLight ? { background: "rgba(37, 99, 235, 0.12)" } : {}}
          aria-hidden="true"
        >
          <ListTodo className={`w-5 h-5 ${isLight ? "text-[#2563eb]" : "text-[#0ea5e9]"}`} />
        </div>
        <div>
          <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isLight ? "text-slate-500" : "text-muted-foreground"}`}>
            Today • Tasks
          </div>
          <div className={`text-sm font-bold ${isLight ? "text-slate-800" : "text-foreground"}`}>
            {completedCount} / {tasks.length} completed
          </div>
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
              className={`rounded-xl p-3 transition-all cursor-pointer ${
                isCompleted
                  ? isLight
                    ? "bg-emerald-500/10"
                    : "bg-green-500/10"
                  : isLight
                    ? "bg-slate-100 hover:bg-slate-200/80"
                    : "bg-white/[0.04] hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isCompleted ? (isLight ? "bg-emerald-500/20" : "bg-green-500/20") : isLight ? "bg-white" : "bg-white/5"
                  }`}
                  aria-hidden="true"
                >
                  {isCompleted && <Check className={`w-4 h-4 ${isLight ? "text-emerald-600" : "text-green-500"}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-bold mb-0.5 ${
                      isCompleted ? "line-through" : ""
                    } ${isCompleted && isLight ? "text-slate-500" : isCompleted ? "text-muted-foreground" : isLight ? "text-slate-800" : "text-foreground"}`}
                  >
                    {task.title}
                  </h4>
                  {task.challengeName && (
                    <p className={`text-[10px] uppercase tracking-wider mb-1.5 ${isLight ? "text-slate-500" : "text-muted-foreground"}`}>
                      {task.challengeName}
                    </p>
                  )}
                  <div className={`flex items-center gap-2 text-[10px] ${isLight ? "text-slate-500" : "text-muted-foreground"}`}>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                      {task.duration}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-medium uppercase ${isLight ? "bg-slate-200/80 text-slate-600" : "bg-white/5"}`}>
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )

  if (embedded) {
    return <div className="py-6">{content}</div>
  }

  if (isLight) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 mb-8">
        {content}
      </div>
    )
  }

  return (
    <div className="glass-card rounded-2xl bg-gradient-to-br from-[#0c1525]/90 via-[#0a0a12]/95 to-[#151008]/90 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden mb-8">
      {content}
    </div>
  )
}
