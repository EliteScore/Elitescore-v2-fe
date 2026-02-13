"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link2, Target } from "lucide-react"
import type { LearningProvider, ProviderConnection } from "@/lib/types/integrations"

type ActiveChallenge = {
  id: number
  name: string
  progress: number
}

const providerOptions: Array<{ provider: LearningProvider; label: string }> = [
  { provider: "udemy_business", label: "Udemy Business" },
  { provider: "coursera_enterprise", label: "Coursera Enterprise" },
]

export default function ChallengesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [connections, setConnections] = useState<ProviderConnection[]>([])
  const [isConnectingProvider, setIsConnectingProvider] = useState<LearningProvider | null>(null)
  const [loadingConnections, setLoadingConnections] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [activeChallenges] = useState<ActiveChallenge[]>([])

  const loadConnections = useCallback(async () => {
    setLoadingConnections(true)
    try {
      const response = await fetch("/api/integrations/connections")
      if (!response.ok) return
      const data = (await response.json()) as { connections: ProviderConnection[] }
      setConnections(data.connections)
    } finally {
      setLoadingConnections(false)
    }
  }, [])

  useEffect(() => {
    void loadConnections()
  }, [loadConnections])

  useEffect(() => {
    const integration = searchParams.get("integration")
    if (integration === "connected") {
      setStatusMessage("Learning account connected successfully.")
      void loadConnections()
    }
    if (integration) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("integration")
      router.replace(`/challenges${params.toString() ? `?${params.toString()}` : ""}`)
    }
  }, [searchParams, router, loadConnections])

  const activeCount = useMemo(() => activeChallenges.length, [activeChallenges])

  const connectProvider = async (provider: LearningProvider) => {
    setIsConnectingProvider(provider)
    try {
      const response = await fetch(`/api/integrations/${provider}/connect`, { method: "POST" })
      const data = (await response.json()) as { authUrl?: string; error?: string }
      if (!response.ok || !data.authUrl) {
        setStatusMessage(data.error || "Unable to start provider connection.")
        return
      }
      window.location.href = data.authUrl
    } finally {
      setIsConnectingProvider(null)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="container mx-auto max-w-7xl px-4 py-6 md:py-8 space-y-6">
        {statusMessage && <div className="rounded-xl border border-border/60 bg-card/70 p-3 text-sm text-foreground">{statusMessage}</div>}

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand/15 flex items-center justify-center" aria-hidden="true">
              <Target className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Challenge Arena</p>
              <h1 className="text-2xl font-semibold text-foreground">No challenge data yet</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Challenge lists are now API-driven. No sample courses, progress, or history are rendered.</p>
          <div className="mt-4">
            <Badge variant="outline">{activeCount} active</Badge>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/60 bg-card/70 p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-base font-semibold text-foreground">Learning account connections</h2>
            <Badge variant="outline">{connections.length} connected</Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {providerOptions.map((option) => (
              <Button
                key={option.provider}
                size="sm"
                variant="outline"
                onClick={() => void connectProvider(option.provider)}
                disabled={isConnectingProvider === option.provider}
              >
                <Link2 className="mr-1 h-3.5 w-3.5" />
                {isConnectingProvider === option.provider ? "Connecting..." : `Connect ${option.label}`}
              </Button>
            ))}
          </div>

          {loadingConnections ? (
            <p className="text-sm text-muted-foreground">Loading connections...</p>
          ) : connections.length === 0 ? (
            <p className="text-sm text-muted-foreground">No provider connected yet.</p>
          ) : (
            <div className="space-y-2">
              {connections.map((connection) => (
                <div key={connection.id} className="rounded-lg border border-border/60 bg-card/60 p-3 flex items-center justify-between">
                  <p className="text-sm text-foreground">{connection.provider}</p>
                  <Button size="sm" variant="ghost" onClick={async () => { await fetch(`/api/integrations/connections/${connection.id}`, { method: "DELETE" }); await loadConnections() }}>
                    Disconnect
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button variant="outline" asChild>
          <Link href="/app">Back to Dashboard</Link>
        </Button>
      </section>
    </div>
  )
}

