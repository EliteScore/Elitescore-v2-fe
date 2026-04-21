"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

import "../auth.css"
import "./reset-password.css"

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

export default function ResetPasswordPage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isTokenMissing = token.length === 0

  useEffect(() => {
    if (typeof window === "undefined") return
    const value = new URLSearchParams(window.location.search).get("token")?.trim() ?? ""
    setToken(value)
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (isTokenMissing) {
      setError("Reset token is missing. Open the reset link from your email.")
      return
    }
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Please fill in both password fields.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      })

      const apiMessage = await parseApiMessage(res)
      if (!res.ok) {
        setError(apiMessage ?? "Could not reset password. Try again.")
        return
      }

      setSuccess(apiMessage ?? "Password updated successfully.")
      setNewPassword("")
      setConfirmPassword("")
    } catch (submitError) {
      console.error("Reset password error:", submitError)
      setError("Could not reset password. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page reset-password-page">
      <main className="auth-main reset-password-main">
        <div className="auth-card reset-password-card">
          <div className="auth-card-inner">
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-sub">Enter your new password to complete account recovery.</p>

            {isTokenMissing ? (
              <p className="auth-error reset-password-error" role="alert">
                Reset token is missing. Open the reset link from your email.
              </p>
            ) : null}
            {error ? (
              <p className="auth-error reset-password-error" role="alert">
                {error}
              </p>
            ) : null}
            {success ? (
              <p className="reset-password-success" role="status">
                {success}
              </p>
            ) : null}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="reset-new-password" className="auth-label">
                  New password
                </label>
                <div className="auth-input-wrap">
                  <input
                    id="reset-new-password"
                    type={showNewPassword ? "text" : "password"}
                    className="auth-input"
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    disabled={isSubmitting || isTokenMissing}
                  />
                  <button
                    type="button"
                    className="auth-toggle-password"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    disabled={isSubmitting || isTokenMissing}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="reset-confirm-password" className="auth-label">
                  Confirm new password
                </label>
                <div className="auth-input-wrap">
                  <input
                    id="reset-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="auth-input"
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={isSubmitting || isTokenMissing}
                  />
                  <button
                    type="button"
                    className="auth-toggle-password"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    disabled={isSubmitting || isTokenMissing}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-btn auth-btn-primary" disabled={isSubmitting || isTokenMissing}>
                {isSubmitting ? "Updating..." : "Update password"}
              </button>
            </form>

            <div className="reset-password-actions">
              <Link href="/login" className="auth-link">
                Back to login
              </Link>
              {success ? (
                <button type="button" className="auth-link reset-password-link-btn" onClick={() => router.replace("/login")}>
                  Continue to login
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
