"use client"

interface Skill {
  name: string
  progress: number
}

interface SkillsProgressProps {
  skills: Skill[]
}

export function SkillsProgress({ skills }: SkillsProgressProps) {
  return (
    <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-6">
      <h3 className="text-lg font-bold mb-6">Skills to Build</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="p-4 rounded-xl border border-white/10 bg-card/30 backdrop-blur-sm hover:border-[#2bbcff]/30 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm">{skill.name}</h4>
              <span className="text-lg font-bold text-[#2bbcff]">{skill.progress}%</span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] rounded-full transition-all duration-700"
                style={{ width: `${skill.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
