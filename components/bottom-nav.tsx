"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Trophy, Target, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Challenges", href: "/challenges", icon: Target },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Profile", href: "/profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  // Hide navbar on login and signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 gap-1 transition-all duration-200 py-2",
                  isActive ? "text-[#2bbcff]" : "text-foreground/70 hover:text-foreground",
                )}
                aria-label={item.name}
              >
                <item.icon
                  className={cn("w-5 h-5 transition-transform duration-200", isActive ? "scale-110" : "scale-100")}
                  aria-hidden="true"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
                {isActive && (
                  <div className="absolute top-0 w-8 h-0.5 bg-gradient-to-r from-[#2bbcff] to-[#a855f7] rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
