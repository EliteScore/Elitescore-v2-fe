"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"

const LOGO_PATH = "/gemini%20logo.png"

function getUserDisplayName(): string {
  if (typeof window === "undefined") return "there"
  const fullName = localStorage.getItem("elitescore_full_name")
  if (fullName && fullName.trim().length > 0) return fullName
  const username = localStorage.getItem("elitescore_username")
  if (username && username.trim().length > 0) return username
  const email = localStorage.getItem("elitescore_email")
  if (email) return email.split("@")[0] || "there"
  return "there"
}

export function DashboardHeader() {
  const [displayName, setDisplayName] = useState("there")

  useEffect(() => {
    setDisplayName(getUserDisplayName())
  }, [])

  const initial = displayName.trim().charAt(0).toUpperCase() || "?"

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
            placeholder="Find your friends..."
            className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            aria-label="Search friends"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
            →
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/profile"
          className="hidden sm:flex items-center gap-2 pr-2"
          aria-label="View your profile"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 via-orange-400 to-amber-400 flex items-center justify-center text-xs font-bold text-white">
            {initial}
          </div>
          <span className="text-sm font-medium text-slate-700">{displayName}</span>
        </Link>
      </div>
    </header>
  )
}
