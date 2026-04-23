"use client"

import { useState } from "react"
import Link from "next/link"
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

      const genericSuccessMessage = "If the account exists, a login link has been sent."

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
            <p className="login-mobile-signup-hint" aria-label="New user signup">
              New here?{" "}
              <Link href="/signup" className="auth-cross-link">
                Create an account
              </Link>
            </p>

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
                  <p className="login-forgot-copy">Enter your email to get a login link. You can set a new password once you&apos;re in.</p>
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

              <p className="auth-footer-text login-form-footer">
                No account yet? <Link href="/signup" className="auth-cross-link">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
