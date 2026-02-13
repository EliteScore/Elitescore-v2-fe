"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ChallengeRoadmapPage() {
  const params = useParams()
  const id = params.id as string

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pb-20">
      <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-8 text-center max-w-md">
        <p className="text-xs text-muted-foreground mb-2">Roadmap for challenge {id}</p>
        <h1 className="text-xl font-semibold text-foreground mb-3">No roadmap data</h1>
        <p className="text-sm text-muted-foreground mb-6">Roadmap content will render after backend challenge milestones are integrated.</p>
        <Button asChild>
          <Link href="/challenges">Back to Challenges</Link>
        </Button>
      </div>
    </div>
  )
}
