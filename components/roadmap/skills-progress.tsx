"use client"

import { Target } from "lucide-react"

interface Skill {
  name: string
  progress: number
}

interface SkillsProgressProps {
  skills: Skill[]
}

export function SkillsProgress({ skills }: SkillsProgressProps) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#fb923c]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <Target className="w-5 h-5 text-[#fb923c]" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Skills to build</div>
          <div className="text-base font-bold text-foreground">Track your progress</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="rounded-xl bg-white/[0.04] p-4 hover:bg-white/[0.06] transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{skill.name}</span>
              <span className="text-sm font-bold text-[#0ea5e9]">{skill.progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#fb923c] rounded-full transition-all duration-700"
                style={{ width: `${skill.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
