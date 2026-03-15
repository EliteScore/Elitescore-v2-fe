"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Users, CheckCircle2 } from "lucide-react"

const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"

function SpectatorJoinForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const challengeName = searchParams.get("challenge") ?? "a challenge"
  const inviterName = searchParams.get("from") ?? "Someone"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!name.trim()) {
      setError("Name is required")
      return
    }
    if (!email.trim()) {
      setError("Email is required")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    if (!agree) {
      setError("Please agree to receive updates")
      return
    }
    setSubmitted(true)
    // Frontend only: in production you would POST to link this spectator to the invite
    setTimeout(() => {
      router.push("/home")
    }, 2500)
  }

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600" aria-hidden>
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">You&apos;re in</p>
          <h2 className="mt-1 text-lg font-bold text-slate-800">You&apos;re now a spectator</h2>
          <p className="mt-2 text-sm text-slate-600">
            You&apos;ll receive updates on their progress. Redirecting you to EliteScore…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ background: APP_GRADIENT }} aria-hidden>
          <Users className="h-6 w-6" />
        </div>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Spectator invite</p>
        <h1 className="mt-1 text-lg font-bold text-slate-800 sm:text-xl">You&apos;re invited to be a spectator</h1>
        <p className="mt-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">{inviterName}</span> is locking in and wants you to have their back. Enter your details below to get linked.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Challenge</p>
        <p className="mt-0.5 text-sm font-bold text-slate-800">{challengeName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="spectator-name" className="block text-xs font-semibold text-slate-800 sm:text-sm">
            Name
          </label>
          <input
            id="spectator-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
          />
        </div>
        <div>
          <label htmlFor="spectator-email" className="block text-xs font-semibold text-slate-800 sm:text-sm">
            Email
          </label>
          <input
            id="spectator-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
          />
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/30 p-3">
          <input
            id="spectator-agree"
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-pink-500 focus:ring-pink-500/20"
            aria-describedby="agree-desc"
          />
          <label id="agree-desc" htmlFor="spectator-agree" className="cursor-pointer text-xs text-slate-600 sm:text-sm">
            I agree to be linked as a spectator and to receive updates on their challenge progress. I can unsubscribe at any time.
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded-xl py-3 text-sm font-bold text-white transition-transform active:scale-[0.98] min-h-[48px] touch-manipulation"
          style={{ background: APP_GRADIENT }}
        >
          I Agree — Join as spectator
        </button>
      </form>

      <p className="mt-6 text-center text-[10px] text-slate-500">
        <Link href="/home" className="underline hover:text-slate-700">
          Back to EliteScore
        </Link>
      </p>
    </div>
  )
}

export default function SpectatorJoinPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f6] px-4 py-8 sm:py-12">
      <Suspense fallback={<div className="mx-auto max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 text-center text-slate-500">Loading…</div>}>
        <SpectatorJoinForm />
      </Suspense>
    </div>
  )
}
