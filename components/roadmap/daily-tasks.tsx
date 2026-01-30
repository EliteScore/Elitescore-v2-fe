"use client"

import { Clock, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DailyTask {
  id: string
  title: string
  duration: string
  xp: number
  category: string
  completed?: boolean
}

interface DailyTasksProps {
  totalXP: number
  tasks: DailyTask[]
}

export function DailyTasks({ totalXP, tasks }: DailyTasksProps) {
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

  const earnedXP = tasks
    .filter((task) => completedTasks.has(task.id))
    .reduce((sum, task) => sum + task.xp, 0)

  return (
    <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold mb-1">Today</h3>
          <p className="text-sm text-muted-foreground">
            {earnedXP} / {totalXP} XP available today
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
            {totalXP}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">XP</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {tasks.map((task) => {
          const isCompleted = completedTasks.has(task.id)
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isCompleted
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-white/10 bg-white/5 hover:border-[#2bbcff]/30 hover:bg-[#2bbcff]/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isCompleted
                      ? "bg-green-500/20 border border-green-500/30"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  {isCompleted && <Check className="w-3 h-3 text-green-500" />}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium text-sm mb-1 ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{task.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#2bbcff]" />
                      <span className="font-bold text-[#2bbcff]">{task.xp} XP</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5">{task.category}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Button className="w-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 h-10 font-bold">
        Start Challenge
      </Button>
    </div>
  )
}
