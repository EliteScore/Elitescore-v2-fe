"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, Bell, Menu } from "lucide-react"

const LOGO_PATH = "/gemini%20logo.png"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 md:h-16 items-center gap-4 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-sm md:px-6">
      <Link href="/home" className="flex items-center gap-2 shrink-0 md:ml-0" aria-label="EliteScore Home">
        <Image src={LOGO_PATH} alt="EliteScore" width={120} height={36} className="h-8 w-auto" priority />
      </Link>
      <div className="flex-1 flex justify-center max-w-xl mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
          <input
            type="search"
            placeholder="Find your next challenge..."
            className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            aria-label="Search challenges"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
            →
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:flex items-center gap-2 pr-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 via-orange-400 to-amber-400 flex items-center justify-center text-xs font-bold text-white">
            R
          </div>
          <span className="text-sm font-medium text-slate-700">Ryan Wong</span>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
