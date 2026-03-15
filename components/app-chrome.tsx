"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { TopHeader } from "@/components/top-header"
import { DashboardLayout } from "@/components/dashboard-layout"

const AUTH_CLASS = "auth-open"

const DASHBOARD_PATHS = ["/home", "/challenges", "/leaderboard", "/community", "/profile"]

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLanding = pathname === "/landing"
  const isAuth = pathname === "/login" || pathname === "/signup"
  const isDashboard = DASHBOARD_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))

  useEffect(() => {
    if (!isAuth) return
    document.body.classList.add(AUTH_CLASS)
    document.documentElement.classList.add(AUTH_CLASS)
    return () => {
      document.body.classList.remove(AUTH_CLASS)
      document.documentElement.classList.remove(AUTH_CLASS)
    }
  }, [isAuth])

  if (isLanding || isAuth) {
    return <>{children}</>
  }

  if (isDashboard) {
    return <DashboardLayout>{children}</DashboardLayout>
  }

  return (
    <>
      <TopHeader />
      {children}
    </>
  )
}
