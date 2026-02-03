"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Trophy, Target, Home, CalendarCheck2, BarChart3, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/app", icon: Home },
  { name: "Planner", href: "/planner", icon: CalendarCheck2 },
  { name: "Challenges", href: "/challenges", icon: Target },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Alerts", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  // Hide navbar on login and signup pages
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/60 pb-safe">
      <div className="container mx-auto px-2">
        <div className="h-16 overflow-x-auto">
          <div className="mx-auto flex h-full min-w-max items-center gap-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex min-w-[72px] flex-col items-center justify-center gap-1 px-2 py-2 transition-all duration-200",
                  isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground",
                )}
                aria-label={item.name}
              >
                <item.icon
                  className={cn("w-5 h-5 transition-transform duration-200", isActive ? "scale-110" : "scale-100")}
                  aria-hidden="true"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
                {isActive && (
                  <div className="absolute top-0 h-1 w-1 rounded-full bg-brand" />
                )}
              </Link>
            )
          })}
          </div>
        </div>
      </div>
    </nav>
  )
}

