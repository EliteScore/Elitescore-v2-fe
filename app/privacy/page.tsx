"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-foreground">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This page explains what information EliteScore stores and how it is used to provide the product.
          </p>

          <div className="mt-6 space-y-4 text-sm text-muted-foreground">
            <section>
              <h2 className="text-sm font-semibold text-foreground">1. Data We Store</h2>
              <p className="mt-1">
                Account details, challenge progress, proof metadata, and leaderboard activity are stored to run core features.
              </p>
            </section>
            <section>
              <h2 className="text-sm font-semibold text-foreground">2. How Data Is Used</h2>
              <p className="mt-1">
                We use your data for challenge tracking, scoring, notifications, and product reliability.
              </p>
            </section>
            <section>
              <h2 className="text-sm font-semibold text-foreground">3. Control and Access</h2>
              <p className="mt-1">
                You can request updates or deletion of account data according to applicable platform policies.
              </p>
            </section>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/signup">Back to signup</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
