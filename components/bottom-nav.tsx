"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Trophy, Target, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Challenges", href: "/challenges", icon: Target },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Profile", href: "/profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  if (pathname === "/login" || pathname === "/signup") {
    return null
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.06)] pb-safe"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-all duration-200",
                isActive ? "text-pink-600" : "text-slate-500 hover:text-slate-700",
              )}
              aria-label={item.name}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full"
                  style={{ background: "linear-gradient(90deg, #db2777, #ea580c)" }}
                  aria-hidden
                />
              )}
              <item.icon
                className={cn("h-5 w-5 transition-transform", isActive ? "scale-110" : "scale-100")}
                strokeWidth={isActive ? 2.25 : 2}
                aria-hidden
              />
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  isActive ? "text-pink-600" : "text-slate-500",
                )}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
