"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { usePathname, useRouter } from "next/navigation"

type OnboardingState = {
  step: number
  complete: boolean
}

type OnboardingContextValue = {
  isReady: boolean
  state: OnboardingState
  setStep: (step: number) => void
  beginSetup: () => void
  markComplete: () => void
}

const PROFILE_ME_URL = "/api/profile/me"

const LS = {
  step: "elitescore_onboarding_step",
  complete: "elitescore_onboarding_complete",
  pending: "elitescore_onboarding_pending",
} as const

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

function clampStep(step: number): number {
  return Math.max(1, Math.min(3, Math.round(step)))
}

function readLocalState(): Partial<OnboardingState> {
  if (typeof window === "undefined") return {}
  const stepRaw = Number.parseInt(localStorage.getItem(LS.step) ?? "", 10)
  const completeRaw = localStorage.getItem(LS.complete)
  return {
    step: Number.isFinite(stepRaw) ? clampStep(stepRaw) : undefined,
    complete: completeRaw === "true" ? true : completeRaw === "false" ? false : undefined,
  }
}

function saveLocalState(next: OnboardingState) {
  try {
    localStorage.setItem(LS.step, String(clampStep(next.step)))
    localStorage.setItem(LS.complete, String(next.complete))
    if (next.complete) localStorage.removeItem(LS.pending)
    else localStorage.setItem(LS.pending, "true")
  } catch {
    // ignore storage errors
  }
}

function extractRemoteOnboarding(raw: unknown): Partial<OnboardingState> {
  if (!raw || typeof raw !== "object") return {}
  const obj = raw as Record<string, unknown>
  const stepRaw = obj.onboarding_step ?? obj.onboardingStep
  const completeRaw = obj.onboarding_complete ?? obj.onboardingComplete
  return {
    step: typeof stepRaw === "number" && Number.isFinite(stepRaw) ? clampStep(stepRaw) : undefined,
    complete:
      typeof completeRaw === "boolean"
        ? completeRaw
        : typeof completeRaw === "string"
          ? completeRaw === "true"
          : undefined,
  }
}

function onboardingFirstName(): string {
  if (typeof window === "undefined") return "there"
  const fullName = localStorage.getItem("elitescore_full_name")
  if (fullName && fullName.trim()) return fullName.trim().split(/\s+/)[0] || "there"
  const username = localStorage.getItem("elitescore_username")
  if (username && username.trim()) return username.trim()
  const email = localStorage.getItem("elitescore_email")
  if (email) return email.split("@")[0] || "there"
  return "there"
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isReady, setIsReady] = useState(false)
  const [state, setState] = useState<OnboardingState>({ step: 1, complete: false })

  const persistRemote = useCallback(async (next: OnboardingState) => {
    const token = localStorage.getItem("elitescore_access_token")
    if (!token) return
    try {
      await fetch(PROFILE_ME_URL, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          onboarding_step: clampStep(next.step),
          onboarding_complete: next.complete,
        }),
      })
    } catch {
      // ignore network failures
    }
  }, [])

  const commit = useCallback(
    (updater: (prev: OnboardingState) => OnboardingState) => {
      setState((prev) => {
        const next = updater(prev)
        saveLocalState(next)
        void persistRemote(next)
        return next
      })
    },
    [persistRemote],
  )

  useEffect(() => {
    let cancelled = false
    async function bootstrap() {
      const local = readLocalState()
      let remote: Partial<OnboardingState> = {}
      const token = localStorage.getItem("elitescore_access_token")
      if (token) {
        try {
          const res = await fetch(PROFILE_ME_URL, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          })
          const body = await res.json().catch(() => null)
          if (res.ok) remote = extractRemoteOnboarding(body)
        } catch {
          // ignore
        }
      }

      const complete = remote.complete ?? local.complete ?? false
      const step = complete ? 3 : remote.step ?? local.step ?? 1
      const next = { step: clampStep(step), complete }
      if (cancelled) return
      setState(next)
      saveLocalState(next)
      setIsReady(true)
    }
    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isReady || state.complete) return
    if ((state.step === 2 || state.step === 3) && pathname !== "/challenges") {
      router.replace("/challenges")
    }
  }, [isReady, state.complete, state.step, pathname, router])

  const value = useMemo<OnboardingContextValue>(
    () => ({
      isReady,
      state,
      setStep: (step) => {
        commit((prev) => ({ ...prev, step: clampStep(step), complete: false }))
      },
      beginSetup: () => {
        commit((prev) => ({ ...prev, step: 2, complete: false }))
        router.replace("/challenges")
      },
      markComplete: () => {
        commit((prev) => ({ ...prev, complete: true, step: 3 }))
        router.replace("/home")
      },
    }),
    [isReady, state, commit, router],
  )

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      <OnboardingWelcomePopup />
      <OnboardingStepPopup />
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const value = useContext(OnboardingContext)
  if (!value) throw new Error("useOnboarding must be used within OnboardingProvider")
  return value
}

function OnboardingWelcomePopup() {
  const pathname = usePathname()
  const { isReady, state, beginSetup, markComplete } = useOnboarding()
  const [firstName, setFirstName] = useState("there")

  useEffect(() => {
    if (!isReady) return
    setFirstName(onboardingFirstName())
  }, [isReady])

  if (!isReady || state.complete || state.step !== 1) return null
  if (pathname === "/login" || pathname === "/signup") return null

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 px-4"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11111a] p-8 text-center text-white shadow-2xl">
        <img src="/gemini%20logo.png" alt="EliteScore" className="mx-auto h-10 w-auto" />
        <h1 className="mt-6 text-2xl font-bold">Welcome, {firstName}.</h1>
        <p className="mt-3 text-sm text-white/80">Let&apos;s get you set up. Takes 2 minutes.</p>
        <button
          type="button"
          onClick={beginSetup}
          className="mt-7 w-full rounded-xl px-5 py-2.5 text-sm font-bold text-white"
          style={{ background: "linear-gradient(90deg, #E05433, #db2777)" }}
        >
          Get started →
        </button>
        <button
          type="button"
          onClick={markComplete}
          className="mt-3 text-xs text-white/60 transition-colors hover:text-white/85"
        >
          Skip setup
        </button>
      </div>
    </div>
  )
}

function OnboardingStepPopup() {
  const pathname = usePathname()
  const { isReady, state, markComplete } = useOnboarding()
  const [dismissedForStep, setDismissedForStep] = useState<number | null>(null)

  useEffect(() => {
    setDismissedForStep(null)
  }, [state.step])

  if (!isReady || state.complete) return null
  if (pathname !== "/challenges") return null
  if (state.step !== 2 && state.step !== 3) return null
  if (dismissedForStep === state.step) return null

  const title =
    state.step === 2
      ? "Step 1 of 2 · Join your first challenge"
      : "Step 2 of 2 · Invite an accountability partner"
  const body =
    state.step === 2
      ? "Browse the real library and join any challenge to continue."
      : "Invite a friend from the real invite flow to complete onboarding."

  return (
    <div
      className="fixed inset-0 z-[115] flex items-start justify-center bg-black/35 px-4 pt-24"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#11111a] p-4 text-white shadow-2xl">
        <p className="text-[10px] font-bold text-[#E05433]">{title}</p>
        <p className="mt-2 text-xs text-white/80">{body}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={markComplete}
            className="text-[11px] text-white/40 transition-colors hover:text-white/70"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => setDismissedForStep(state.step)}
            className="rounded-lg bg-[#E05433] px-3 py-1.5 text-xs font-semibold text-white"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
