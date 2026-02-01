"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

type TourStep = {
  id: string
  title: string
  body: string
  selector: string
}

const steps: TourStep[] = [
  {
    id: "sidebar",
    title: "Sidebar navigation",
    body: "Jump between Home, Challenges, Leaderboard, and Profile from here. You can collapse it anytime.",
    selector: "[data-tour='sidebar']",
  },
  {
    id: "theme",
    title: "Light and dark mode",
    body: "Toggle your theme preference here. It follows your system by default.",
    selector: "[data-tour='theme-toggle']",
  },
  {
    id: "content",
    title: "Your dashboard",
    body: "This area shows your score, streak, and what to do next. Everything is organized by priority.",
    selector: "[data-tour='content']",
  },
  {
    id: "ask-elite",
    title: "Ask Elite",
    body: "Need help or ideas? Use Ask Elite to get guidance without leaving the page.",
    selector: "[data-tour='ask-elite']",
  },
]

function getRect(selector: string) {
  const el = document.querySelector(selector) as HTMLElement | null
  if (!el) return null
  const rect = el.getBoundingClientRect()
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  }
}

export function AppTour() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [stepIndex, setStepIndex] = React.useState(0)
  const [highlight, setHighlight] = React.useState<ReturnType<typeof getRect>>(null)

  React.useEffect(() => {
    if (pathname !== "/app") {
      setOpen(false)
      return
    }
    const seen = typeof window !== "undefined" && localStorage.getItem("elitescore_tour_seen") === "true"
    if (!seen) {
      setOpen(true)
      setStepIndex(0)
    }
  }, [pathname])

  React.useEffect(() => {
    if (!open) return
    const update = () => {
      const current = steps[stepIndex]
      setHighlight(current ? getRect(current.selector) : null)
    }
    update()
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, { passive: true })
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update)
    }
  }, [open, stepIndex])

  if (!open) return null

  const step = steps[stepIndex]

  const tooltipStyle: React.CSSProperties = highlight
    ? {
        top: Math.min(highlight.top + highlight.height + 12, window.innerHeight - 180),
        left: Math.min(Math.max(highlight.left, 16), window.innerWidth - 360),
      }
    : { top: 80, left: 16 }

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" />

      {highlight && (
        <div
          className="absolute rounded-xl border-2 border-emerald-400/80"
          style={{
            top: highlight.top - 6,
            left: highlight.left - 6,
            width: highlight.width + 12,
            height: highlight.height + 12,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
          }}
        />
      )}

      <div
        className="absolute w-[320px] rounded-2xl border border-border/60 bg-background p-4 shadow-xl"
        style={tooltipStyle}
      >
        <div className="text-xs font-medium text-muted-foreground">Step {stepIndex + 1} of {steps.length}</div>
        <div className="mt-1 text-base font-semibold text-foreground">{step.title}</div>
        <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.setItem("elitescore_tour_seen", "true")
              setOpen(false)
            }}
          >
            Skip tutorial
          </Button>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
              disabled={stepIndex === 0}
            >
              Back
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (stepIndex >= steps.length - 1) {
                  localStorage.setItem("elitescore_tour_seen", "true")
                  setOpen(false)
                } else {
                  setStepIndex((prev) => prev + 1)
                }
              }}
            >
              {stepIndex >= steps.length - 1 ? "Done" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
