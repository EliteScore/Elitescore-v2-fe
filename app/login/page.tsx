"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import "../auth.css"
import "./login.css"

const AUTH_BASE_URL = "https://elitescore-auth-jh8f8.ondigitalocean.app"

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .transform((val) => val.trim().toLowerCase()),
  password: z.string().min(1, { message: "Password is required." }),
  remember: z.boolean().default(false),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null)
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<string | null>(null)
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  })

  async function onSubmit(formData: LoginFormValues) {
    setIsLoading(true)
    setLoginError(null)
    try {
      const email = formData.email
      const res = await fetch(`${AUTH_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: formData.password,
        }),
      })

      if (!res.ok) {
        let message = "Invalid email or password."
        try {
          const data = await res.json()
          if (typeof data?.message === "string") message = data.message
        } catch {
          // ignore parse error
        }
        setLoginError(message)
        return
      }

      const data = await res.json()
      if (data?.access_token) {
        localStorage.setItem("elitescore_access_token", data.access_token)
      }
      if (data?.refresh_token) {
        localStorage.setItem("elitescore_refresh_token", data.refresh_token)
      }
      if (data?.user_id) {
        localStorage.setItem("elitescore_user_id", String(data.user_id))
      }
      localStorage.setItem("elitescore_logged_in", "true")
      localStorage.setItem("elitescore_email", email)
      router.replace("/home")
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    setLoginError(null)
    setTimeout(() => {
      localStorage.setItem("elitescore_logged_in", "true")
      router.push("/home")
    }, 1000)
  }

  async function handleForgotPasswordSubmit() {
    setForgotPasswordError(null)
    setForgotPasswordSuccess(null)

    const normalizedEmail = forgotEmail.trim().toLowerCase()
    const parsedEmail = z.string().email({ message: "Please enter a valid email address." }).safeParse(normalizedEmail)
    if (!parsedEmail.success) {
      setForgotPasswordError(parsedEmail.error.issues[0]?.message ?? "Please enter a valid email address.")
      return
    }

    setIsForgotPasswordLoading(true)
    const forgotPasswordUrl = `${AUTH_BASE_URL}/auth/forgot-password`
    const requestBody = { email: normalizedEmail }

    try {
      if (process.env.NODE_ENV === "development") {
        console.debug("[elitescore][forgot-password] request", {
          url: forgotPasswordUrl,
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: requestBody,
        })
      }

      const res = await fetch(forgotPasswordUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const rawBody = await res.text()

      if (process.env.NODE_ENV === "development") {
        console.debug("[elitescore][forgot-password] response", {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText,
          bodyLength: rawBody.length,
          bodyPreview: rawBody.slice(0, 400),
        })
      }

      const genericSuccessMessage = "If the account exists, a reset link has been sent."

      let jsonOk = false
      let data: unknown = null
      try {
        data = rawBody ? JSON.parse(rawBody) : null
        jsonOk = true
      } catch {
        // non-JSON body (e.g. load balancer HTML)
      }

      if (process.env.NODE_ENV === "development") {
        if (jsonOk) {
          console.debug("[elitescore][forgot-password] parsed JSON", data)
        } else {
          console.warn("[elitescore][forgot-password] response was not JSON", {
            bodyPreview: rawBody.slice(0, 400),
          })
        }
      }

      const apiMessage =
        jsonOk &&
        data &&
        typeof data === "object" &&
        "message" in data &&
        typeof (data as { message: unknown }).message === "string"
          ? (data as { message: string }).message.trim() || null
          : null

      if (!res.ok) {
        const fallback =
          res.status === 502 || res.status === 504
            ? "The auth service timed out or is temporarily unavailable. Please try again in a few minutes."
            : res.status === 503
              ? "The auth service is temporarily unavailable. Please try again later."
              : res.status === 429
                ? "Too many reset attempts. Please wait and try again."
                : "The password reset request could not be completed. Please try again."
        setForgotPasswordError(apiMessage ?? fallback)
        return
      }

      if (!jsonOk) {
        setForgotPasswordError(
          "Received an unexpected response from the auth service. Please try again, or contact support if this continues.",
        )
        return
      }

      setForgotPasswordSuccess(apiMessage ?? genericSuccessMessage)
    } catch (error) {
      console.error("Forgot password error:", error)
      setForgotPasswordError("Something went wrong. Please try again.")
    } finally {
      setIsForgotPasswordLoading(false)
    }
  }

  return (
    <div key={pathname} className="auth-page login-page">
      <main className="auth-main">
        <div className="login-split-card">
          <div className="login-split-left">
            <p className="login-split-label">Back to the board.</p>
            <h2 className="login-split-headline">Log in.</h2>
            <p className="login-split-copy">Your streak, rank, and receipts are waiting.</p>
          </div>
          <div className="login-split-right">
            <h1 className="auth-title login-form-title">Welcome back</h1>
            <p className="auth-sub login-form-sub">Enter your email and password to access your account</p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form login-form">
              {loginError && <p className="auth-error login-form-error" role="alert">{loginError}</p>}

              <div className="auth-field">
                <label htmlFor="login-email" className="auth-label">Email</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="auth-input"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <span className="auth-error">{form.formState.errors.email.message}</span>
                )}
              </div>

              <div className="auth-field">
                <div className="auth-field-row">
                  <label htmlFor="login-password" className="auth-label">Password</label>
                  <button
                    type="button"
                    className="auth-link login-form-link login-forgot-toggle"
                    onClick={() => {
                      setShowForgotPassword((previous) => !previous)
                      setForgotPasswordError(null)
                      setForgotPasswordSuccess(null)
                      if (!showForgotPassword) {
                        setForgotEmail(form.getValues("email").trim().toLowerCase())
                      }
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="auth-input-wrap">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="auth-input"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    className="auth-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <span className="auth-error">{form.formState.errors.password.message}</span>
                )}
              </div>

              {showForgotPassword && (
                <div className="login-forgot-panel">
                  <p className="login-forgot-copy">Enter your email to get a reset link.</p>
                  <div className="auth-form login-forgot-form">
                    <div className="auth-field">
                      <label htmlFor="forgot-email" className="auth-label">Email</label>
                      <input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        className="auth-input"
                        value={forgotEmail}
                        onChange={(event) => setForgotEmail(event.target.value)}
                      />
                    </div>
                    {forgotPasswordError && <p className="auth-error login-form-error" role="alert">{forgotPasswordError}</p>}
                    {forgotPasswordSuccess && <p className="login-form-success" role="status">{forgotPasswordSuccess}</p>}
                    <button
                      type="button"
                      className="auth-btn login-btn-ghost"
                      onClick={handleForgotPasswordSubmit}
                      disabled={isForgotPasswordLoading || isLoading}
                      aria-label={isForgotPasswordLoading ? "Sending reset link" : "Send reset link"}
                    >
                      {isForgotPasswordLoading ? "Sending..." : "Send reset link"}
                    </button>
                  </div>
                </div>
              )}

              <label className="auth-checkbox-wrap">
                <input type="checkbox" className="auth-checkbox" {...form.register("remember")} />
                <span className="auth-checkbox-label">Remember me</span>
              </label>

              <button
                type="submit"
                className="auth-btn auth-btn-primary login-btn-primary"
                disabled={isLoading}
                aria-label={isLoading ? "Signing in" : "Sign in"}
              >
                {isLoading ? (
                  <> <span className="login-spinner" aria-hidden /> Signing in... </>
                ) : (
                  "Sign in"
                )}
              </button>

              <div className="auth-divider login-form-divider">
                <span>OR</span>
              </div>

              <button
                type="button"
                className="auth-btn login-btn-ghost"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                aria-label="Sign in with Google"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: "0.4rem" }} aria-hidden>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </button>
            </form>
            <p className="auth-footer-text login-form-footer auth-form-footer-pin">
              No account yet? <a href="/signup" className="auth-cross-link">Sign up</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
