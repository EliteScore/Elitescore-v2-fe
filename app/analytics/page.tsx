"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { analyticsSnapshotsSeed } from "@/lib/mock/product"
import { BarChart3, Flame, Target, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type RangeKey = "7d" | "all"

export default function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("7d")

  const data = useMemo(
    () => (range === "7d" ? analyticsSnapshotsSeed.slice(-7) : analyticsSnapshotsSeed),
    [range]
  )

  const first = data[0]
  const last = data[data.length - 1]

  const summary = useMemo(() => {
    const totalCompleted = data.reduce((sum, item) => sum + item.completedTasks, 0)
    const totalTasks = data.reduce((sum, item) => sum + item.totalTasks, 0)
    const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0

    const consistentDays = data.filter((item) => item.completedTasks >= Math.max(item.totalTasks - 1, 1)).length
    const consistencyRate = data.length > 0 ? Math.round((consistentDays / data.length) * 100) : 0

    return {
      scoreDelta: last.eliteScore - first.eliteScore,
      streakDelta: last.streakDays - first.streakDays,
      completionRate,
      consistencyRate,
    }
  }, [data, first.eliteScore, last.eliteScore, first.streakDays, last.streakDays])

  const maxScore = Math.max(...data.map((item) => item.eliteScore))

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="container mx-auto px-4 py-6 md:py-8 space-y-6 max-w-6xl">
        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8 shadow-lg">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center" aria-hidden="true">
                <BarChart3 className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Progress Analytics</p>
                <h1 className="text-xl font-semibold text-foreground">Track what is actually improving</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant={range === "7d" ? "default" : "outline"} onClick={() => setRange("7d")}>7D</Button>
              <Button size="sm" variant={range === "all" ? "default" : "outline"} onClick={() => setRange("all")}>All</Button>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Score delta</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{summary.scoreDelta >= 0 ? "+" : ""}{summary.scoreDelta}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Streak delta</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{summary.streakDelta >= 0 ? "+" : ""}{summary.streakDelta}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Completion rate</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{summary.completionRate}%</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Consistency rate</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{summary.consistencyRate}%</div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-foreground" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">EliteScore trend</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-brand)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--color-brand)" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" />
                <XAxis dataKey="dateISO" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  domain={[Math.max(maxScore - 120, 0), maxScore + 10]}
                />
                <Tooltip
                  cursor={{ stroke: "var(--color-ring)", strokeWidth: 1 }}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="eliteScore"
                  stroke="var(--color-brand)"
                  strokeWidth={2}
                  fill="url(#scoreFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Flame className="w-4 h-4" aria-hidden="true" />
              Streak health
            </div>
            <p className="text-sm text-muted-foreground">Current trend: {last.streakDays >= first.streakDays ? "stable or rising" : "declining"}.</p>
          </div>
          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Target className="w-4 h-4" aria-hidden="true" />
              Task efficiency
            </div>
            <p className="text-sm text-muted-foreground">You finish {summary.completionRate}% of planned tasks in this range.</p>
          </div>
          <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5">
            <div className="text-sm font-semibold text-foreground mb-2">Recommendation</div>
            <p className="text-sm text-muted-foreground">Lock one less task per day and complete it consistently for 7 days.</p>
            <Badge className="mt-3" variant="secondary">Focus on consistency</Badge>
          </div>
        </div>
      </section>
    </div>
  )
}
