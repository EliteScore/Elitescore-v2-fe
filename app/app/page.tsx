"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Link2 } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-10 space-y-6">
        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center" aria-hidden="true">
              <Activity className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dashboard</p>
              <h1 className="text-2xl font-semibold text-foreground">No synced activity yet</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Connect a learning provider and link a course from the Challenges page to start tracking progress.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <Button asChild>
              <Link href="/challenges">
                <Link2 className="mr-2 h-4 w-4" />
                Open Challenges
              </Link>
            </Button>
            <Badge variant="outline">Awaiting live data</Badge>
          </div>
        </div>
      </section>
    </div>
  )
}
