"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { TopBar } from "@/components/top-bar"
import { SidebarNav } from "@/components/sidebar-nav"
import { AiHelper } from "@/components/ai-helper"
import { AppTour } from "@/components/app-tour"

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isStandalonePolicyPage = pathname === "/terms-policy"

  if (isStandalonePolicyPage) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <>
      <div className="min-h-screen flex">
        <SidebarNav />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="min-w-0 flex-1" data-tour="content">
            {children}
          </main>
        </div>
      </div>
      <AiHelper />
      <AppTour />
    </>
  )
}
