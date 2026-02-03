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
      className={`glass-card rounded-xl border backdrop-blur-sm p-5 transition-all ${
        status === "active"
          ? "border-[#0ea5e9]/30 bg-gradient-to-br from-[#0ea5e9]/5 to-card/50"
          : status === "completed"
            ? "border-green-500/20 bg-card/30"
            : "border-white/5 bg-card/30 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-base font-bold text-foreground leading-tight">{title}</h3>
            {status === "active" && (
              <Badge variant="secondary" className="bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/30 text-[10px] font-bold uppercase tracking-wider">
                Active
              </Badge>
            )}
            {status === "completed" && (
              <Badge variant="secondary" className="bg-green-500/10 text-foreground border-green-500/30 text-[10px] font-bold uppercase tracking-wider">
                Completed
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <div className="ml-4">
          {status === "completed" ? (
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-foreground" />
            </div>
          ) : status === "locked" ? (
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center">
              <Circle className="w-5 h-5 text-[#0ea5e9]" />
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {status !== "locked" && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] mb-1.5">
            <span className="text-muted-foreground font-bold uppercase tracking-wider">Progress</span>
            <span className="font-bold text-foreground">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                status === "completed" ? "bg-green-500" : "bg-gradient-to-r from-[#0ea5e9] to-[#0f766e]"
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
            <div key={index} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                  task.completed ? "bg-green-500/20 border border-green-500/30" : "bg-white/5 border border-white/10"
                }`}
                aria-hidden="true"
              >
                {task.completed && <Check className="w-3 h-3 text-foreground" />}
              </div>
              <span className={`text-sm leading-snug ${task.completed ? "text-muted-foreground line-through" : "text-foreground font-medium"}`}>
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

