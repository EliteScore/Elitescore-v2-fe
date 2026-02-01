ï»¿"use client"

import { TrendingUp, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ScoreCategory {
  category: string
  score: number
  maxScore: number
  color: string
}

interface WeeklyChange {
  category: string
  action: string
  points: number
}

interface ScoreBreakdownProps {
  totalScore: number
  weeklyChange: number
  categories: ScoreCategory[]
  weeklyChanges: WeeklyChange[]
  quickActionText?: string
  quickActionLink?: string
}

export function ScoreBreakdown({
  totalScore,
  weeklyChange,
  categories,
  weeklyChanges,
  quickActionText,
  quickActionLink,
}: ScoreBreakdownProps) {
  return (
    <div className="space-y-3">
      {/* Compact Header */}
      <div className="glass-card rounded-xl border border-[#2563eb]/20 bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold mb-0.5">EliteScore</h2>
            <span className="text-2xl font-black bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-foreground">
              {totalScore}
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/30">
            <TrendingUp className="w-3 h-3 text-foreground" />
            <span className="text-xs font-bold text-foreground">+{weeklyChange}</span>
          </div>
        </div>

        {/* Compact Category Grid */}
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <div key={cat.category} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted-foreground">{cat.category}</span>
                <span className="text-xs font-bold" style={{ color: cat.color }}>
                  {cat.score}
                </span>
              </div>
              <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(cat.score / cat.maxScore) * 100}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compact What Moved */}
      <div className="glass-card rounded-xl border border-[#2563eb]/20 bg-card/50 backdrop-blur-sm p-3">
        <h3 className="text-xs font-bold mb-2">What moved your score this week</h3>
        <div className="space-y-1.5">
          {weeklyChanges.map((change, index) => (
            <div key={index} className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-medium text-muted-foreground">{change.category}:</span>{" "}
                <span className="text-[10px] text-foreground line-clamp-1">{change.action}</span>
              </div>
              <span className="text-xs font-bold text-foreground flex-shrink-0">+{change.points.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compact Quick Action - only when quickActionText is provided */}
      {quickActionText && (
        <div className="glass-card rounded-xl border border-[#7c3aed]/20 bg-gradient-to-r from-[#7c3aed]/5 to-[#2563eb]/5 backdrop-blur-sm p-3">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2563eb]/10 flex items-center justify-center flex-shrink-0">
              <Target className="w-3.5 h-3.5 text-[#2563eb]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[10px] font-bold mb-0.5 text-[#2563eb]">Fastest way to +5 points</h3>
              <p className="text-[10px] text-muted-foreground leading-tight mb-2 line-clamp-2">{quickActionText}</p>
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#2563eb] to-[#7c3aed] hover:opacity-90 text-white border-0 text-[10px] h-6 px-2"
                asChild
              >
                <Link href={quickActionLink ?? "/challenges"}>Start Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

