"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function SupporterInvitePage() {
  const params = useParams()
  const token = params.token as string

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pb-20">
      <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-8 text-center max-w-md">
        <p className="text-xs text-muted-foreground mb-2">Invite token: {token}</p>
        <h1 className="text-xl font-semibold text-foreground mb-3">Invite data unavailable</h1>
        <p className="text-sm text-muted-foreground mb-6">This route no longer uses sample invite data. Connect it to backend invite validation.</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}

