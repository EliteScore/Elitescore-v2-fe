"use client"

import { Check, Circle, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MilestoneTask {
  title: string
  completed: boolean
}

interface MilestoneCardProps {
  title: string
  description: string
  tasks: MilestoneTask[]
  status: "completed" | "active" | "locked"
  progress: number
}

export function MilestoneCard({ title, description, tasks, status, progress }: MilestoneCardProps) {
  return (
    <div
      className={`glass-card rounded-xl border backdrop-blur-sm p-6 transition-all ${
        status === "active"
          ? "border-[#2bbcff]/30 bg-gradient-to-br from-[#2bbcff]/5 to-card/50"
          : status === "completed"
            ? "border-green-500/20 bg-card/30"
            : "border-white/5 bg-card/20 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold">{title}</h3>
            {status === "active" && (
              <Badge variant="secondary" className="bg-[#2bbcff]/10 text-[#2bbcff] border-[#2bbcff]/30 text-xs">
                ACTIVE MILESTONE
              </Badge>
            )}
            {status === "completed" && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/30 text-xs">
                COMPLETED
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="ml-4">
          {status === "completed" ? (
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-500" />
            </div>
          ) : status === "locked" ? (
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#2bbcff]/10 flex items-center justify-center">
              <Circle className="w-5 h-5 text-[#2bbcff]" />
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {status !== "locked" && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                status === "completed" ? "bg-green-500" : "bg-gradient-to-r from-[#2bbcff] to-[#a855f7]"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Task list */}
      {status !== "locked" && (
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                  task.completed ? "bg-green-500/20 border border-green-500/30" : "bg-white/5 border border-white/10"
                }`}
              >
                {task.completed && <Check className="w-3 h-3 text-green-500" />}
              </div>
              <span className={task.completed ? "text-muted-foreground line-through" : "text-foreground"}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      )}

      {status === "locked" && (
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">Complete previous milestones to unlock</p>
        </div>
      )}
    </div>
  )
}
