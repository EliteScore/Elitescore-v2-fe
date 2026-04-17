"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Flame,
  Target,
  Check,
  X,
  TrendingUp,
  LinkIcon,
  Settings,
  ExternalLink,
  Lock,
  LogOut,
  Trash2,
  ShieldCheck,
  Loader2,
} from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

const PROFILE_ME_URL = "/api/profile/me"
const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"
const CARD_BASE = "rounded-2xl border border-slate-200/80 bg-white shadow-sm"
const ACCOUNT_DELETE_CONFIRMATION = "DELETE"
const AUTH_STORAGE_KEYS = [
  "elitescore_access_token",
  "elitescore_refresh_token",
  "elitescore_user_id",
  "elitescore_logged_in",
  "elitescore_email",
  "elitescore_full_name",
  "elitescore_username",
] as const

type ChallengeTemplate = { name?: string; difficulty?: number; duration_days?: number }
type ChallengeEnrollment = {
  id: number
  status: string
  start_date?: string
  end_date?: string
  current_day?: number
  completed_at?: string | null
  failed_at?: string | null
  created_at?: string
  challenge_templates?: ChallengeTemplate | null
}

type ProfileResponse = {
  name: string
  level: number
  elitescore: number
  streak: number
  global_rank: number | null
  bio?: string | null
  avatar_url?: string | null
  linkedin_url?: string | null
  github_url?: string | null
  challenge_history?: ChallengeEnrollment[]
}

function getDisplayName(): string {
  if (typeof window === "undefined") return "Profile"
  const fullName = localStorage.getItem("elitescore_full_name")
  if (fullName && fullName.trim()) return fullName
  const username = localStorage.getItem("elitescore_username")
  if (username && username.trim()) return username
  const email = localStorage.getItem("elitescore_email")
  if (email) return email.split("@")[0] || "Profile"
  return "Profile"
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0]?.slice(0, 2) ?? "?").toUpperCase()
}

function defaultProfile(): ProfileResponse {
  return {
    name: getDisplayName(),
    level: 0,
    elitescore: 0,
    streak: 0,
    global_rank: null,
    bio: null,
    avatar_url: null,
    linkedin_url: null,
    github_url: null,
    challenge_history: [],
  }
}

function clearAuthStorage() {
  AUTH_STORAGE_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore storage errors
    }
  })
}

async function parseApiMessage(res: Response): Promise<string | null> {
  try {
    const data: unknown = await res.json()
    if (data && typeof data === "object") {
      if ("message" in data && typeof (data as { message?: unknown }).message === "string") {
        return (data as { message: string }).message
      }
      if ("error" in data && typeof (data as { error?: unknown }).error === "string") {
        return (data as { error: string }).error
      }
    }
  } catch {
    // ignore parse failures
  }
  return null
}

export default function ProfilePage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [hasExistingProfile, setHasExistingProfile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [settingsError, setSettingsError] = useState<string | null>(null)
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null)
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isChangePasswordLoading, setIsChangePasswordLoading] = useState(false)
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("elitescore_access_token")
    const loggedIn = localStorage.getItem("elitescore_logged_in")
    const isAuthorized = Boolean(token || loggedIn === "true")
    if (!isAuthorized) {
      router.replace("/login")
      return
    }
    setAuthChecked(true)
  }, [router])

  useEffect(() => {
    if (!authChecked) return
    const token = localStorage.getItem("elitescore_access_token")
    if (!token) {
      setProfile(defaultProfile())
      setHasExistingProfile(false)
      setProfileLoading(false)
      return
    }
    let cancelled = false
    setProfileLoading(true)
    setProfileError(null)
    fetch(PROFILE_ME_URL, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (cancelled) return
        const status = res.status
        const body = await res.json().catch(() => null)

        if (process.env.NODE_ENV === "development") {
          console.debug("[Profile GET /users/me]", { status, ok: res.ok, body })
        }

        if (status === 401) {
          router.replace("/login")
          return
        }

        if (status === 404 || !res.ok) {
          setProfile(defaultProfile())
          setHasExistingProfile(false)
          if (status !== 404) {
            setProfileError(body?.message ?? body?.error ?? (status >= 500 ? "Server error — showing defaults" : "Could not load — showing defaults"))
          }
          return
        }

        if (body && typeof body === "object") {
          setProfile(body as ProfileResponse)
          setHasExistingProfile(true)
          if (body.name && typeof body.name === "string") {
            try {
              localStorage.setItem("elitescore_full_name", body.name)
            } catch {
              // ignore
            }
          }
        } else {
          setProfile(defaultProfile())
          setHasExistingProfile(false)
          setProfileError("Invalid response — showing defaults")
        }
      })
      .catch((err) => {
        if (cancelled) return
        if (process.env.NODE_ENV === "development") {
          const msg = err?.message ?? String(err)
          console.debug("[Profile] fetch error (showing defaults):", msg)
        }
        setProfile(defaultProfile())
        setHasExistingProfile(false)
        setProfileError("Connection issue — showing defaults")
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [authChecked, router])

  const resetSettingsMessages = () => {
    setSettingsError(null)
    setSettingsSuccess(null)
  }

  const handleToggleSettings = () => {
    resetSettingsMessages()
    setShowSettings((prev) => !prev)
  }

  const handleOpenChangePassword = () => {
    resetSettingsMessages()
    setCurrentPassword("")
    setNewPassword("")
    setConfirmNewPassword("")
    setShowChangePassword(true)
  }

  const handleCloseChangePassword = () => {
    setShowChangePassword(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmNewPassword("")
  }

  const handleOpenDeleteConfirm = () => {
    resetSettingsMessages()
    setDeleteConfirmationInput("")
    setShowDeleteConfirm(true)
  }

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false)
    setDeleteConfirmationInput("")
  }

  const handleLogout = async () => {
    if (isLogoutLoading) return
    resetSettingsMessages()
    setIsLogoutLoading(true)
    const token = localStorage.getItem("elitescore_access_token")
    try {
      if (token) {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok && res.status !== 401) {
          const apiMessage = await parseApiMessage(res)
          setSettingsError(apiMessage ?? "Could not logout right now. Please try again.")
          setIsLogoutLoading(false)
          return
        }
      }

      clearAuthStorage()
      router.replace("/login")
    } catch (error) {
      console.error("Logout error:", error)
      setSettingsError("Could not logout right now. Please try again.")
      setIsLogoutLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (isChangePasswordLoading) return
    resetSettingsMessages()

    if (!currentPassword.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
      setSettingsError("All password fields are required.")
      return
    }
    if (newPassword !== confirmNewPassword) {
      setSettingsError("New password and confirmation do not match.")
      return
    }
    if (currentPassword === newPassword) {
      setSettingsError("New password must be different from the current password.")
      return
    }

    const token = localStorage.getItem("elitescore_access_token")
    if (!token) {
      clearAuthStorage()
      router.replace("/login")
      return
    }

    setIsChangePasswordLoading(true)
    try {
      const res = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
        }),
      })

      const apiMessage = await parseApiMessage(res)
      if (!res.ok) {
        setSettingsError(apiMessage ?? "Password could not be updated.")
        return
      }

      setSettingsSuccess(apiMessage ?? "Password updated successfully.")
      handleCloseChangePassword()
    } catch (error) {
      console.error("Change password error:", error)
      setSettingsError("Password could not be updated.")
    } finally {
      setIsChangePasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (isDeleteLoading) return
    resetSettingsMessages()

    if (deleteConfirmationInput.trim().toUpperCase() !== ACCOUNT_DELETE_CONFIRMATION) {
      setSettingsError(`Type "${ACCOUNT_DELETE_CONFIRMATION}" to confirm account deletion.`)
      return
    }

    const token = localStorage.getItem("elitescore_access_token")
    if (!token) {
      clearAuthStorage()
      router.replace("/login")
      return
    }

    setIsDeleteLoading(true)
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const apiMessage = await parseApiMessage(res)
      if (!res.ok) {
        setSettingsError(apiMessage ?? "Account could not be deleted.")
        return
      }

      clearAuthStorage()
      router.replace("/login")
    } catch (error) {
      console.error("Delete account error:", error)
      setSettingsError("Account could not be deleted.")
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const displayName = profile?.name?.trim() || getDisplayName()
  const challengeHistory = profile?.challenge_history ?? []
  const totalCompleted = challengeHistory.filter((c) => c.status === "completed" || c.status === "passed").length
  const maxDifficulty = challengeHistory.reduce((max, c) => {
    const d = c.challenge_templates?.difficulty
    return typeof d === "number" && d > max ? d : max
  }, 0)

  const userData = {
    name: displayName,
    eliteScore: profile != null ? profile.elitescore : "—",
    rankPercentile: profile?.global_rank != null ? `#${profile.global_rank}` : "—",
    currentStreak: profile?.streak ?? 0,
    verificationBadge: false,
    level: profile?.level ?? 0,
    currentXP: 0,
    xpToNextLevel: 1,
    stats: {
      totalCompleted,
      highestDifficulty: maxDifficulty,
      longestStreak: profile?.streak ?? 0,
      consistencyRate: 0,
    },
    challengeHistory: challengeHistory.map((c) => {
      const t = c.challenge_templates
      const name = t?.name ?? "Challenge"
      const difficulty = typeof t?.difficulty === "number" ? t.difficulty : 0
      const duration = typeof t?.duration_days === "number" ? t.duration_days : 0
      const status = c.status === "completed" || c.status === "passed" ? "completed" : "failed"
      return {
        id: c.id,
        name,
        difficulty,
        duration,
        status,
        completionDate: c.completed_at ?? undefined,
        failureDate: c.failed_at ?? undefined,
        proofCount: 0,
      }
    }),
    background: {
      education: [] as Array<{ institution: string; degree: string; year: string }>,
      roles: [] as Array<{ company: string; position: string; period: string }>,
      certifications: [] as string[],
      achievements: [] as string[],
    },
    links: {
      linkedin: profile?.linkedin_url?.trim() ?? "",
      github: profile?.github_url?.trim() ?? "",
      portfolio: "",
    },
    bio: profile?.bio?.trim() ?? "",
    avatarUrl: profile?.avatar_url?.trim() ?? "",
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-[40vh] w-full items-center justify-center px-4">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  if (profileLoading) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#f5f5f6] flex items-center justify-center pb-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" aria-hidden />
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#f5f5f6] font-sans text-slate-800 antialiased pt-[max(1rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(5rem,calc(4rem+env(safe-area-inset-bottom)))]">
      <div className="mx-auto w-full px-3 py-4 sm:px-4 sm:py-6 md:py-8 md:max-w-5xl">
        {profileError && (
          <p className="mb-3 text-xs text-amber-700 bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-2" role="status">{profileError}</p>
        )}
        {/* Hero strip — matches home / leaderboard */}
        <section className="relative overflow-hidden rounded-2xl px-4 py-5 sm:px-6 sm:py-6 mb-4" style={{ background: APP_GRADIENT }} aria-labelledby="profile-heading">
          <h1 id="profile-heading" className="relative text-xl font-extrabold leading-tight text-white sm:text-2xl">Profile</h1>
          <p className="relative mt-0.5 text-sm text-white/85">Identity, performance & history.</p>
          <Link href="/profile/me" className="relative mt-4 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white min-h-[44px] touch-manipulation transition-transform hover:scale-[1.02] bg-white/20 border border-white/30 hover:bg-white/30" aria-label={hasExistingProfile ? "Edit your profile" : "Set up your profile"}>{hasExistingProfile ? "Edit profile" : "Set up profile"}</Link>
        </section>

        <div className={`${CARD_BASE} overflow-hidden`}>

          {/* Profile Header */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 overflow-hidden" style={{ background: APP_GRADIENT }}>
                    {userData.avatarUrl ? (
                      <img src={userData.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl sm:text-3xl font-bold text-pink-600">
                        {getInitials(userData.name)}
                      </div>
                    )}
                  </div>
                  {userData.verificationBadge && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-pink-500 flex items-center justify-center border-2 border-white" aria-hidden="true">
                      <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-white" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 truncate max-w-full">{userData.name}</h1>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs bg-orange-50 text-orange-600 border-orange-200/80 shrink-0">
                      Level {userData.level}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] sm:text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-pink-600" aria-hidden="true" />
                      <span className="font-bold text-pink-600">{typeof userData.eliteScore === "number" ? userData.eliteScore.toLocaleString() : userData.eliteScore}</span>
                      <span className="hidden sm:inline">EliteScore</span>
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span>{userData.rankPercentile}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" aria-hidden="true" />
                      <span className="font-bold text-orange-500">{userData.currentStreak}</span>
                      <span>day streak</span>
                    </span>
                  </div>
                  {userData.bio ? <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2">{userData.bio}</p> : null}
                </div>
              </div>
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
                <Button size="sm" variant="ghost" className="min-h-[44px] min-w-[44px] p-0 touch-manipulation rounded-xl border border-pink-200/80 bg-pink-50/50 text-pink-600 hover:bg-pink-100/80 hover:border-pink-300/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/50" onClick={handleToggleSettings} aria-label={showSettings ? "Close settings" : "Open settings"}>
                  <Settings className="w-4 h-4 text-pink-600" aria-hidden />
                </Button>
              </div>
            </div>

            {showSettings && (
              <div className="border-t border-slate-200/80 pt-4 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Settings</h3>
                {settingsError ? (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600" role="alert">
                    {settingsError}
                  </p>
                ) : null}
                {settingsSuccess ? (
                  <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700" role="status">
                    {settingsSuccess}
                  </p>
                ) : null}
                <div className="space-y-1.5">
                  <Button size="sm" variant="outline" className="w-full justify-start text-xs min-h-[44px] bg-slate-100 border-slate-200 rounded-xl touch-manipulation text-slate-700 hover:bg-slate-200/80" onClick={handleOpenChangePassword}>
                    <Lock className="w-3.5 h-3.5 mr-2" aria-hidden />
                    Change Password
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start text-xs min-h-[44px] bg-slate-100 border-slate-200 rounded-xl touch-manipulation text-slate-700 hover:bg-slate-200/80" onClick={handleLogout} disabled={isLogoutLoading}>
                    <LogOut className="w-3.5 h-3.5 mr-2" aria-hidden />
                    {isLogoutLoading ? "Logging out..." : "Logout"}
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start text-xs min-h-[44px] bg-transparent border-red-500/30 text-red-500 hover:bg-red-50 rounded-xl touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30" onClick={handleOpenDeleteConfirm} disabled={isDeleteLoading}>
                    <Trash2 className="w-3.5 h-3.5 mr-2" aria-hidden />
                    Delete Account
                  </Button>
                </div>
              </div>
            )}

            {showChangePassword && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="change-password-title" onClick={handleCloseChangePassword}>
                <div className={`${CARD_BASE} p-4 sm:p-6 w-full max-w-md max-h-[88dvh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
                  <h3 id="change-password-title" className="text-base sm:text-lg font-bold text-slate-800 mb-2">Change Password</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6 leading-relaxed">Use your current password and set a new one.</p>
                  <div className="space-y-3">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800"
                      placeholder="Current password"
                      autoComplete="current-password"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800"
                      placeholder="New password"
                      autoComplete="new-password"
                    />
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(event) => setConfirmNewPassword(event.target.value)}
                      className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800"
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 min-h-[40px] text-xs rounded-xl border-slate-200 touch-manipulation text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/30" onClick={handleCloseChangePassword} disabled={isChangePasswordLoading}>Cancel</Button>
                    <Button size="sm" className="flex-1 min-h-[40px] bg-pink-600 hover:bg-pink-700 text-white text-xs rounded-xl touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50" onClick={handleChangePassword} disabled={isChangePasswordLoading}>
                      {isChangePasswordLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {showDeleteConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title" onClick={handleCloseDeleteConfirm}>
                <div className={`${CARD_BASE} p-4 sm:p-6 w-full max-w-md max-h-[88dvh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
                  <h3 id="delete-dialog-title" className="text-base sm:text-lg font-bold text-slate-800 mb-2">Delete Account?</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">This cannot be undone. Your EliteScore, history, and data will be permanently deleted.</p>
                  <p className="text-xs text-slate-500 mb-3">Type <span className="font-semibold text-slate-700">{ACCOUNT_DELETE_CONFIRMATION}</span> to continue.</p>
                  <input
                    value={deleteConfirmationInput}
                    onChange={(event) => setDeleteConfirmationInput(event.target.value)}
                    className="mb-4 w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800"
                    placeholder={`Type ${ACCOUNT_DELETE_CONFIRMATION}`}
                    autoComplete="off"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 min-h-[40px] text-xs rounded-xl border-slate-200 touch-manipulation text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/30" onClick={handleCloseDeleteConfirm} disabled={isDeleteLoading}>Cancel</Button>
                    <Button size="sm" className="flex-1 min-h-[40px] bg-red-500 hover:bg-red-600 text-white text-xs rounded-xl touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50" onClick={handleDeleteAccount} disabled={isDeleteLoading}>
                      {isDeleteLoading ? "Deleting..." : "Delete Permanently"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Credibility Stats — card grid, landing theme */}
          <div className="border-t border-slate-200/80 p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 min-h-[44px] flex flex-col justify-center shadow-sm">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Check className="w-3.5 h-3.5 text-pink-600" aria-hidden="true" />
                  <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Completed</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{userData.stats.totalCompleted}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 min-h-[44px] flex flex-col justify-center shadow-sm">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Target className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                  <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Max Difficulty</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{userData.stats.highestDifficulty === 0 ? "—" : `${userData.stats.highestDifficulty}/5`}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 min-h-[44px] flex flex-col justify-center shadow-sm">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                  <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Longest Streak</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{userData.stats.longestStreak}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 min-h-[44px] flex flex-col justify-center shadow-sm">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                  <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">Consistency</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{userData.stats.consistencyRate === 0 ? "—" : `${userData.stats.consistencyRate}%`}</p>
              </div>
            </div>
          </div>

          {/* Challenge History — card list, landing theme */}
          <div className="border-t border-slate-200/80 p-4 sm:p-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 mb-1">Challenge History</h2>
              <p className="text-[10px] sm:text-xs text-slate-500 mb-3">Public & immutable — failures are visible</p>
              <div className="space-y-2">
                {userData.challengeHistory.length === 0 ? (
                  <div className="py-8 px-4 rounded-xl border border-slate-200/80 bg-slate-50/50 text-slate-500 text-sm text-center">
                    <p className="mb-1">No challenges yet</p>
                    <p className="text-xs">Completed and failed challenges will appear here.</p>
                  </div>
                ) : (
                  userData.challengeHistory.map((challenge) => (
                    <div key={challenge.id} className={`flex items-start sm:items-center gap-3 p-3 rounded-xl border shadow-sm transition-all touch-manipulation ${challenge.status === "completed" ? "bg-pink-50/50 border-pink-200/50" : "bg-red-50/50 border-red-200/50"}`}>
                      <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center border-2 ${challenge.status === "completed" ? "bg-white border-pink-300" : "bg-white border-red-300"}`} aria-hidden="true">
                        {challenge.status === "completed" ? <Check className="w-4 h-4 text-pink-500" aria-hidden /> : <X className="w-4 h-4 text-red-500" aria-hidden />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <h3 className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{challenge.name}</h3>
                          <Badge variant="secondary" className={`text-[10px] shrink-0 border-0 ${challenge.status === "completed" ? "bg-pink-500 text-white hover:bg-pink-500" : "bg-red-500 text-white hover:bg-red-500"}`}>
                            {challenge.status === "completed" ? "Completed" : "Failed"}
                          </Badge>
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-600">{challenge.difficulty}/5 · {challenge.duration}d · {challenge.proofCount} proofs · {challenge.status === "completed" ? challenge.completionDate : challenge.failureDate}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

{/* External Links — subtle tints per link type, landing theme */}
          <div className="border-t border-slate-200/80 p-4 sm:p-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 mb-3">External Links</h2>
              <div className="space-y-2">
                {!userData.links.linkedin && !userData.links.github && !userData.links.portfolio ? (
                  <div className="py-6 px-4 rounded-xl border border-slate-200/80 bg-slate-50/50 text-slate-500 text-sm text-center">
                    <p>No links added yet. Add LinkedIn, GitHub or portfolio in Set up profile.</p>
                  </div>
                ) : null}
                {userData.links.linkedin && (
                  <a href={userData.links.linkedin.startsWith("http") ? userData.links.linkedin : `https://${userData.links.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 p-3 rounded-xl bg-pink-50/80 min-h-[44px] touch-manipulation hover:bg-pink-100/60 transition-colors group" aria-label="Open LinkedIn profile">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 shrink-0 rounded-lg bg-pink-500 flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-white" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800">LinkedIn</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 truncate">{userData.links.linkedin.replace(/^https?:\/\//i, "")}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-700 transition-colors" aria-hidden="true" />
                  </a>
                )}
                {userData.links.github && (
                  <a href={userData.links.github.startsWith("http") ? userData.links.github : `https://${userData.links.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-50/80 min-h-[44px] touch-manipulation hover:bg-amber-100/60 transition-colors group" aria-label="Open GitHub profile">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 shrink-0 rounded-lg bg-amber-500 flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-white" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800">GitHub</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 truncate">{userData.links.github.replace(/^https?:\/\//i, "")}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-700 transition-colors" aria-hidden="true" />
                  </a>
                )}
                {userData.links.portfolio && (
                  <a href={userData.links.portfolio.startsWith("http") ? userData.links.portfolio : `https://${userData.links.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 p-3 rounded-xl bg-blue-50/80 min-h-[44px] touch-manipulation hover:bg-blue-100/60 transition-colors group" aria-label="Open portfolio">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-500 flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-white" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800">Portfolio</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 truncate">{userData.links.portfolio.replace(/^https?:\/\//i, "")}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-700 transition-colors" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
