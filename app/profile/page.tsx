"use client"

import { UserCircle2 } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="container mx-auto max-w-5xl px-4 py-8">
        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center" aria-hidden="true">
              <UserCircle2 className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Profile</p>
              <h1 className="text-xl font-semibold text-foreground">Profile data unavailable</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            This page is now API-only and no longer renders sample profile data.
          </p>
        </div>
      </section>
    </div>
  )
}

