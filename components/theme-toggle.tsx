"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="opacity-70" aria-label="Toggle theme" disabled>
        <Sun className="h-4 w-4" aria-hidden="true" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      data-tour="theme-toggle"
      variant="ghost"
      size="icon"
      className="rounded-full border border-border/60 bg-background/60 hover:bg-accent/70"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </Button>
  )
}
