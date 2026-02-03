"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export function TopBar() {
  const pathname = usePathname()

  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/terms" ||
    pathname === "/privacy" ||
    pathname === "/forgot-password"
  ) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/app" className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt="EliteScore"
            className="h-9 w-9 rounded-xl object-cover"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">EliteScore</div>
            <div className="text-[11px] text-muted-foreground">Performance dashboard</div>
          </div>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
