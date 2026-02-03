"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

const protectedPrefixes = ["/app", "/challenges", "/leaderboard", "/profile", "/planner", "/analytics", "/notifications"]

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(!protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)))

  const isProtectedRoute = useMemo(
    () => protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)),
    [pathname]
  )

  useEffect(() => {
    if (!isProtectedRoute) {
      setReady(true)
      return
    }

    const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("elitescore_logged_in") === "true"
    if (isLoggedIn) {
      setReady(true)
      return
    }

    setReady(false)
    router.replace("/login")
  }, [isProtectedRoute, router])

  if (!ready) {
    return <div className="min-h-screen bg-background" />
  }

  return <>{children}</>
}
