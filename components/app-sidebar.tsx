"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, Trophy, Users, User, Award, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Challenges", href: "/challenges", icon: Target },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Community", href: "/community", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:flex-col md:w-56 lg:w-64 md:fixed md:inset-y-0 md:left-0 z-30">
      <div className="flex flex-col flex-1 min-h-0 bg-white/70 backdrop-blur-xl border-r border-white/40 shadow-sm">
        <div className="flex flex-col flex-1 pt-6 pb-4 px-3 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-pink-500/20 via-orange-500/20 to-amber-500/20 text-slate-800 shadow-sm"
                    : "text-slate-600 hover:bg-white/50 hover:text-slate-800"
                )}
                aria-label={item.name}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-pink-600")} aria-hidden />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
        <div className="p-3 space-y-2 border-t border-white/40">
          <div className="rounded-xl bg-white/60 backdrop-blur-sm p-3 border border-white/50">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-500" aria-hidden />
              <span className="text-xs font-semibold text-slate-700">325</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">LVL 1</span>
            </div>
          </div>
          <div className="rounded-xl bg-white/60 backdrop-blur-sm p-3 border border-white/50">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" aria-hidden />
              <span className="text-xs font-semibold text-slate-700">120 XP</span>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={cn("h-1 flex-1 rounded-full", i <= 3 ? "bg-amber-400/80" : "bg-slate-200")}
                  aria-hidden
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
