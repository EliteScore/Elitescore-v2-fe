"use client"

import { Trophy } from "lucide-react"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="container mx-auto max-w-7xl px-4 py-6 md:py-8">
        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center" aria-hidden="true">
              <Trophy className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Leaderboard</p>
              <h1 className="text-xl font-semibold text-foreground">No ranking data yet</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Leaderboard positions will appear after users submit real progress.
          </p>
        </div>
      </section>
    </div>
  )
}
