"use client"

import { Check, Lock, ChevronRight } from "lucide-react"

interface TimelinePhase {
  id: number
  name: string
  milestones: number
  status: "completed" | "active" | "locked"
}

interface PathTimelineProps {
  phases: TimelinePhase[]
}

export function PathTimeline({ phases }: PathTimelineProps) {
  return (
    <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-6">
      <h3 className="text-lg font-bold mb-6">Path Timeline</h3>
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div key={phase.id}>
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:bg-white/5 ${
                phase.status === "active"
                  ? "border-[#2bbcff]/30 bg-[#2bbcff]/5"
                  : phase.status === "completed"
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-white/5 bg-card/20 opacity-60"
              }`}
            >
              {/* Phase number/icon */}
              <div className="flex-shrink-0">
                {phase.status === "completed" ? (
                  <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-500" />
                  </div>
                ) : phase.status === "locked" ? (
                  <div className="w-12 h-12 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#2bbcff]/10 border-2 border-[#2bbcff] flex items-center justify-center">
                    <span className="text-lg font-bold text-[#2bbcff]">{phase.id}</span>
                  </div>
                )}
              </div>

              {/* Phase info */}
              <div className="flex-1">
                <h4 className="font-bold text-base mb-1">{phase.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {phase.milestones} Milestone{phase.milestones !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Status badge */}
              <div className="flex-shrink-0">
                {phase.status === "completed" ? (
                  <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                    <span className="text-xs font-bold text-green-500">Completed</span>
                  </div>
                ) : phase.status === "active" ? (
                  <div className="px-3 py-1 rounded-full bg-[#2bbcff]/10 border border-[#2bbcff]/30">
                    <span className="text-xs font-bold text-[#2bbcff]">In Progress</span>
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <span className="text-xs font-bold text-muted-foreground">Locked</span>
                  </div>
                )}
              </div>

              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Connector line */}
            {index < phases.length - 1 && (
              <div className="flex justify-start ml-6 my-2">
                <div
                  className={`w-0.5 h-6 ${
                    phase.status === "completed" ? "bg-green-500/30" : "bg-white/10"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
