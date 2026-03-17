"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

const PROFILE_ME_URL = "/api/profile/me"
const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"
const CARD_BASE = "rounded-2xl border border-slate-200/80 bg-white shadow-sm"
const INPUT_CLASS = "w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
const LABEL_CLASS = "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"

export default function ProfileByIdPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [authChecked, setAuthChecked] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")

  const getToken = () => localStorage.getItem("elitescore_access_token")

  useEffect(() => {
    const token = localStorage.getItem("elitescore_access_token")
    const loggedIn = localStorage.getItem("elitescore_logged_in")
    if (!token && loggedIn !== "true") {
      router.replace("/login")
      return
    }
    const own = id === "me" || id === "current" || id === localStorage.getItem("elitescore_user_id")
    setIsOwnProfile(own)
    setAuthChecked(true)
  }, [id, router])

  useEffect(() => {
    if (!authChecked || !isOwnProfile) {
      setLoading(false)
      return
    }
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    let cancelled = false
    fetch(PROFILE_ME_URL, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then((res) => {
        if (cancelled) return
        if (process.env.NODE_ENV === "development") {
          console.debug("[Profile setup] GET /users/me", { status: res.status, ok: res.ok })
        }
        if (res.status === 401) {
          router.replace("/login")
          return
        }
        if (!res.ok) {
          setLoading(false)
          return
        }
        return res.json()
      })
      .then((data) => {
        if (cancelled || !data) return
        setFullName(data.full_name ?? "")
        setBio(data.bio ?? "")
        setLinkedinUrl(data.linkedin_url ?? "")
        setGithubUrl(data.github_url ?? "")
      })
      .catch((err) => {
        if (!cancelled) {
          if (process.env.NODE_ENV === "development") {
            console.debug("[Profile setup] GET error", err)
          }
          setError("Could not load profile")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [authChecked, isOwnProfile, router])

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getToken()
    if (!token) {
      router.replace("/login")
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      full_name: fullName.trim() || undefined,
      bio: bio.trim() || undefined,
      linkedin_url: linkedinUrl.trim() || undefined,
      github_url: githubUrl.trim() || undefined,
    }
    if (process.env.NODE_ENV === "development") {
      console.debug("[Profile setup] PATCH /users/me", { payload })
    }
    try {
      const res = await fetch(PROFILE_ME_URL, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const resBody = await res.json().catch(() => ({}))
      if (process.env.NODE_ENV === "development") {
        console.debug("[Profile setup] PATCH response", { status: res.status, ok: res.ok, body: resBody })
      }
      if (!res.ok) {
        const msg = typeof resBody?.message === "string" ? resBody.message : `Could not update profile (${res.status})`
        setError(msg)
        setSaving(false)
        return
      }
      if (fullName.trim()) {
        try {
          localStorage.setItem("elitescore_full_name", fullName.trim())
        } catch {
          // ignore
        }
      }
      router.replace("/profile")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      if (process.env.NODE_ENV === "development") {
        console.debug("[Profile setup] PATCH error", err)
      }
      setError(message)
      setSaving(false)
    }
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-[40vh] w-full items-center justify-center px-4">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  if (!isOwnProfile) {
    return (
      <div className="min-h-screen bg-[#f5f5f6] pb-20">
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
          <div className={`${CARD_BASE} p-6 text-center max-w-md`}>
            <h1 className="text-lg font-bold text-slate-800">Profile not found</h1>
            <p className="mt-2 text-sm text-slate-600">This profile is not available.</p>
            <Link href="/profile" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to your profile
            </Link>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" aria-hidden />
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#f5f5f6] font-sans text-slate-800 antialiased pt-[max(1rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(5rem,calc(4rem+env(safe-area-inset-bottom)))]">
      <div className="mx-auto w-full px-3 py-4 sm:px-4 sm:py-6 md:py-8 md:max-w-2xl space-y-4">
        <section className="relative overflow-hidden rounded-2xl px-4 py-5 sm:px-6 sm:py-6" style={{ background: APP_GRADIENT }} aria-labelledby="setup-heading">
          <h1 id="setup-heading" className="relative text-xl font-extrabold leading-tight text-white sm:text-2xl">Set up profile</h1>
          <p className="relative mt-0.5 text-sm text-white/85">Add your name, bio and links.</p>
        </section>

        <div className={`${CARD_BASE} overflow-hidden p-4 sm:p-6`}>
          <form onSubmit={handleSubmitProfile} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 rounded-xl bg-red-50 border border-red-200/80 px-3 py-2" role="alert">{error}</p>
            )}
            <div>
              <label htmlFor="setup-full_name" className={LABEL_CLASS}>Full name</label>
              <input id="setup-full_name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" className={INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="setup-bio" className={LABEL_CLASS}>Bio</label>
              <textarea id="setup-bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio" rows={3} className={`${INPUT_CLASS} py-2.5 min-h-[80px] resize-y`} />
            </div>
            <div>
              <label htmlFor="setup-linkedin" className={LABEL_CLASS}>LinkedIn URL</label>
              <input id="setup-linkedin" type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." className={INPUT_CLASS} />
            </div>
            <div>
              <label htmlFor="setup-github" className={LABEL_CLASS}>GitHub URL</label>
              <input id="setup-github" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className={INPUT_CLASS} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit" disabled={saving} className="flex-1 min-h-[44px] rounded-xl text-sm font-semibold text-white touch-manipulation transition-transform hover:scale-[1.01] disabled:opacity-70 disabled:pointer-events-none" style={{ background: APP_GRADIENT }}>
                {saving ? <span className="inline-flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" aria-hidden />Saving...</span> : "Save profile"}
              </button>
              <Link href="/profile" className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4" aria-hidden />Back to profile
              </Link>
            </div>
          </form>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
