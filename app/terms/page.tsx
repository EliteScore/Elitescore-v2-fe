"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-foreground">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            These terms govern your use of EliteScore and its challenge, proof, and leaderboard features.
          </p>

          <div className="mt-6 space-y-4 text-sm text-muted-foreground">
            <section>
              <h2 className="text-sm font-semibold text-foreground">1. Account Responsibility</h2>
              <p className="mt-1">
                You are responsible for activity under your account and the accuracy of submitted information.
              </p>
            </section>
            <section>
              <h2 className="text-sm font-semibold text-foreground">2. Proof Integrity</h2>
              <p className="mt-1">
                Proof submissions should reflect real work. Misleading submissions may result in score penalties.
              </p>
            </section>
            <section>
              <h2 className="text-sm font-semibold text-foreground">3. Fair Use</h2>
              <p className="mt-1">
                Abuse, automation, or attempts to manipulate rankings may lead to account restrictions.
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
