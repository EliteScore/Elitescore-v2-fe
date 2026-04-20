"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { BottomNav } from "@/components/bottom-nav"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f6] font-sans text-slate-800 antialiased max-md:h-dvh max-md:min-h-0 max-md:overflow-hidden">
      <DashboardHeader />
      <main className="min-h-0 flex-1 overflow-x-hidden p-4 pb-[max(5rem,calc(4rem+env(safe-area-inset-bottom)))] md:p-6 md:pb-6 max-md:overflow-y-auto scroll-touch">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
