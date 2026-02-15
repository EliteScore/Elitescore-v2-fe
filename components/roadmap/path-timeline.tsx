"use client"

import { Check, Lock, ChevronRight, MapPin } from "lucide-react"

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
  const handlePhaseKeyDown = (e: React.KeyboardEvent, _phase: TimelinePhase) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      // Phase click could navigate or expand in future
    }
  }

  return (
    <div className="rounded-xl bg-white/[0.04] p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <MapPin className="w-5 h-5 text-[#0ea5e9]" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Path timeline</div>
          <div className="text-base font-bold text-foreground">Phases overview</div>
        </div>
      </div>
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div key={phase.id}>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handlePhaseKeyDown(e, phase)}
              aria-label={`Phase ${phase.id}: ${phase.name}, ${phase.milestones} milestone(s), ${phase.status}`}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:bg-white/[0.04] touch-manipulation min-h-[44px] ${
                phase.status === "active"
                  ? "border-[#0ea5e9]/30 bg-[#0ea5e9]/5"
                  : phase.status === "completed"
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-white/5 bg-white/[0.02] opacity-60"
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
                  <div className="w-12 h-12 rounded-full bg-[#0ea5e9]/10 border-2 border-[#0ea5e9] flex items-center justify-center">
                    <span className="text-lg font-bold text-[#0ea5e9]">{phase.id}</span>
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
                  <div className="px-3 py-1 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/30">
                    <span className="text-xs font-bold text-[#0ea5e9]">In Progress</span>
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
