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
    <div className="glass-card rounded-2xl bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 shadow-xl relative overflow-hidden mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#2bbcff]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <ListTodo className="w-5 h-5 text-[#2bbcff]" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Today • Tasks</div>
          <div className="text-sm font-bold text-foreground">{completedCount} / {tasks.length} completed</div>
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
              className={`glass-card rounded-xl p-3 transition-all cursor-pointer ${
                isCompleted ? "bg-green-500/5" : "bg-card/30 backdrop-blur-sm hover:bg-card/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isCompleted ? "bg-green-500/20" : "bg-white/5"
                  }`}
                  aria-hidden="true"
                >
                  {isCompleted && <Check className="w-4 h-4 text-green-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold mb-0.5 ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.title}
                  </h4>
                  {task.challengeName && (
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">{task.challengeName}</p>
                  )}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                      {task.duration}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] font-medium uppercase">{task.category}</span>
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
