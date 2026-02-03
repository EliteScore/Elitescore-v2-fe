"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Home,
  Target,
  Trophy,
  User,
  ChevronLeft,
  ChevronRight,
  CalendarCheck2,
  BarChart3,
  Bell,
} from "lucide-react"

const navItems = [
  { name: "Home", href: "/app", icon: Home },
  { name: "Planner", href: "/planner", icon: CalendarCheck2 },
  { name: "Challenges", href: "/challenges", icon: Target },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
]

export function SidebarNav() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return null
  }

  return (
    <aside
      data-tour="sidebar"
      className={cn(
        "sticky top-0 h-screen border-r border-border/60 bg-background/95 backdrop-blur-md transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-3 py-4">
          <Link href="/app" className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="EliteScore" className="h-10 w-10 rounded-xl object-cover" />
            {!collapsed && <span className="text-base font-semibold text-foreground">EliteScore</span>}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground md:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors",
                  isActive ? "bg-brand/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="px-2 pb-4">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg border border-border/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      </div>
    </aside>
  )
}
