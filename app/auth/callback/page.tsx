"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import "../../auth.css"

const MAGIC_LINK_FLAG_KEY = "elitescore_magic_link_pending_password"

function parseHashParams(hash: string): Record<string, string> {
  const cleaned = hash.startsWith("#") ? hash.slice(1) : hash
  const params = new URLSearchParams(cleaned)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const hash = window.location.hash
    if (!hash || hash.length <= 1) {
      const existingToken = localStorage.getItem("elitescore_access_token")
      if (existingToken) {
        router.replace("/home")
      } else {
        setError("No session found in callback URL. Please request a new login link.")
      }
      return
    }

    const params = parseHashParams(hash)
    const errorDescription = params.error_description || params.error
    if (errorDescription) {
      setError(errorDescription.replace(/\+/g, " "))
      return
    }

    const accessToken = params.access_token
    const refreshToken = params.refresh_token
    const linkType = params.type

    if (!accessToken) {
      setError("Login link is missing an access token. Please request a new link.")
      return
    }

    try {
      localStorage.setItem("elitescore_access_token", accessToken)
      if (refreshToken) {
        localStorage.setItem("elitescore_refresh_token", refreshToken)
      }
      localStorage.setItem("elitescore_logged_in", "true")

      if (linkType === "magiclink" || linkType === "recovery") {
        localStorage.setItem(MAGIC_LINK_FLAG_KEY, "true")
      }
    } catch (storageError) {
      console.error("[auth/callback] storage error", storageError)
      setError("Could not persist session. Please try again.")
      return
    }

    try {
      window.history.replaceState(null, "", window.location.pathname)
    } catch {
      // ignore history errors
    }

    const destination = linkType === "magiclink" || linkType === "recovery" ? "/profile" : "/home"
    router.replace(destination)
  }, [router])

  return (
    <div className="auth-page">
      <main className="auth-main" style={{ minHeight: "100dvh", justifyContent: "center" }}>
        <div className="auth-card" style={{ maxWidth: 440 }}>
          <div className="auth-card-inner">
            {error ? (
              <>
                <h1 className="auth-title">Login link issue</h1>
                <p className="auth-sub" role="alert">{error}</p>
                <a href="/login" className="auth-btn auth-btn-primary" style={{ display: "inline-flex" }}>
                  Back to login
                </a>
              </>
            ) : (
              <>
                <h1 className="auth-title">Signing you in...</h1>
                <p className="auth-sub">Please wait while we finish logging you in.</p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
