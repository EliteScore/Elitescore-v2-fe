"use client"

import { BellRing } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center" aria-hidden="true">
              <BellRing className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Notifications Inbox</p>
              <h1 className="text-xl font-semibold text-foreground">No notifications yet</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            You will see account, quest, and supporter notifications here.
          </p>
        </div>
      </section>
    </div>
  )
}
