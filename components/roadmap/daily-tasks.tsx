"use client"

import { Clock, Check, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DailyTask {
  id: string
  title: string
  duration: string
  category: string
  completed?: boolean
}

interface DailyTasksProps {
  totalXP?: number
  tasks: DailyTask[]
}

export function DailyTasks({ tasks }: DailyTasksProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(
    new Set(tasks.filter((t) => t.completed).map((t) => t.id)),
  )

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
    <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-r from-[#2bbcff]/15 to-[#a855f7]/15 blur-[80px] rounded-full -z-10" aria-hidden="true" />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#2bbcff]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <ListTodo className="w-5 h-5 text-[#2bbcff]" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Today • Tasks</div>
          <div className="text-base font-bold text-foreground">{completedCount} / {tasks.length} completed</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
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
              className={`glass-card rounded-xl border p-3 transition-all cursor-pointer ${
                isCompleted
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-white/5 bg-card/30 backdrop-blur-sm hover:border-[#2bbcff]/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isCompleted ? "bg-green-500/20 border border-green-500/30" : "bg-white/5 border border-white/10"
                  }`}
                  aria-hidden="true"
                >
                  {isCompleted && <Check className="w-3.5 h-3.5 text-green-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold mb-0.5 leading-tight ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                      {task.duration}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5">{task.category}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Button className="w-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-[10px] h-9 font-bold uppercase tracking-wider">
        Start challenge
      </Button>
    </div>
  )
}
