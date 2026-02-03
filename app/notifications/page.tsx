"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { notificationsSeed } from "@/lib/mock/product"
import type { InboxNotification } from "@/lib/types/product"
import { Bell, BellRing, CheckCheck, CircleAlert } from "lucide-react"

function priorityTone(priority: InboxNotification["priority"]) {
  if (priority === "high") return "border-red-500/30 bg-red-500/5"
  if (priority === "medium") return "border-orange-500/30 bg-orange-500/5"
  return "border-border/60 bg-card/60"
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<InboxNotification[]>(notificationsSeed)

  const unreadCount = useMemo(() => notifications.filter((entry) => !entry.read).length, [notifications])

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="container mx-auto px-4 py-6 md:py-8 space-y-6 max-w-5xl">
        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8 shadow-lg">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center" aria-hidden="true">
                <BellRing className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Notifications Inbox</p>
                <h1 className="text-xl font-semibold text-foreground">Actionable updates only</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{unreadCount} unread</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setNotifications((prev) => prev.map((entry) => ({ ...entry, read: true })))}
              >
                <CheckCheck className="w-4 h-4 mr-1" aria-hidden="true" />
                Mark all read
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {notifications.map((entry) => (
            <div
              key={entry.id}
              className={`glass-card rounded-xl border p-4 shadow-sm transition-all ${priorityTone(entry.priority)} ${!entry.read ? "ring-1 ring-brand/20" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand/15 flex items-center justify-center" aria-hidden="true">
                    {entry.priority === "high" ? (
                      <CircleAlert className="w-4 h-4 text-foreground" />
                    ) : (
                      <Bell className="w-4 h-4 text-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{entry.title}</p>
                      <Badge variant="outline" className="capitalize">{entry.priority}</Badge>
                      {!entry.read && <Badge variant="secondary">New</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{entry.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{entry.createdAtISO}</p>
                  </div>
                </div>
                {!entry.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setNotifications((prev) => prev.map((item) => (item.id === entry.id ? { ...item, read: true } : item)))}
                  >
                    Mark read
                  </Button>
                )}
              </div>
              {entry.actionHref && entry.actionLabel && (
                <div className="mt-3">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={entry.actionHref}>{entry.actionLabel}</Link>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
