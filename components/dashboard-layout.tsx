"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { BottomNav } from "@/components/bottom-nav"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f6] font-sans text-slate-800 antialiased">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      <BottomNav />
    </div>
  )
}
