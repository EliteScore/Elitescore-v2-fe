"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import "../auth.css"
import "./signup.css"

const AUTH_BASE_URL = "https://elitescore-auth-jh8f8.ondigitalocean.app"
const ONBOARDING_PENDING_KEY = "elitescore_onboarding_pending"
const ONBOARDING_DONE_KEY = "elitescore_onboarding_done"

const signupSchema = z
  .object({
    fullName: z.string().min(2, { message: "Name is required." }),
    email: z
      .string()
      .email({ message: "Please enter a valid email address." })
      .transform((val) => val.trim().toLowerCase()),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, { message: "One uppercase letter required." })
      .regex(/[0-9]/, { message: "One number required." }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters." })
      .regex(/^[a-z0-9_]+$/, {
        message: "Username can only contain lowercase letters, numbers, and underscores.",
      })
      .transform((val) => val.trim().toLowerCase()),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms.",
    }),
  })

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      username: "",
      agreeTerms: false,
    },
  })

  const password = form.watch("password")
  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ]

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    setSignupError(null)
    const email = data.email
    const username = data.username
    try {
      // 1) Create account (email and username already normalized by schema)
      const signupRes = await fetch(`${AUTH_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: data.password,
          full_name: data.fullName,
          handle: username,
        }),
      })

      if (!signupRes.ok) {
        let message = "Could not create account. Please try again."
        try {
          const body = await signupRes.json()
          if (typeof body?.message === "string") message = body.message
        } catch {
          // ignore parse error
        }
        setSignupError(message)
        return
      }

      // 2) Log the user in immediately
      const loginRes = await fetch(`${AUTH_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: data.password,
        }),
      })

      if (!loginRes.ok) {
        router.push("/login")
        return
      }

      const loginData = await loginRes.json()
      if (loginData?.access_token) {
        localStorage.setItem("elitescore_access_token", loginData.access_token)
      }
      if (loginData?.refresh_token) {
        localStorage.setItem("elitescore_refresh_token", loginData.refresh_token)
      }
      if (loginData?.user_id) {
        localStorage.setItem("elitescore_user_id", String(loginData.user_id))
      }
      localStorage.setItem("elitescore_logged_in", "true")
      localStorage.setItem("elitescore_full_name", data.fullName)
      localStorage.setItem("elitescore_username", username)
      localStorage.setItem("elitescore_email", email)
      localStorage.removeItem(ONBOARDING_DONE_KEY)
      localStorage.setItem(ONBOARDING_PENDING_KEY, "true")
      router.replace("/challenges?onboard=1")
    } catch (error) {
      console.error("Signup error:", error)
      setSignupError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div key={pathname} className="auth-page signup-page">
      <main className="auth-main">
        <div className="signup-split-card">
          <div className="signup-split-left">
            <p className="signup-split-label">Join the board.</p>
            <h2 className="signup-split-headline">Create account.</h2>
            <p className="signup-split-copy">Start challenges. Submit proof. Climb for real.</p>
          </div>
          <div className="signup-split-right">
            <h1 className="auth-title signup-form-title">Create your account</h1>
            <p className="auth-sub signup-form-sub">Enter your details to get started</p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form signup-form">
              {signupError && <p className="auth-error signup-form-error" role="alert">{signupError}</p>}

              <div className="auth-field">
                <label htmlFor="signup-name" className="auth-label">Full name</label>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  className="auth-input"
                  {...form.register("fullName")}
                />
                {form.formState.errors.fullName && (
                  <span className="auth-error">{form.formState.errors.fullName.message}</span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="signup-email" className="auth-label">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  className="auth-input"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <span className="auth-error">{form.formState.errors.email.message}</span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="signup-password" className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
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
                <div className="signup-requirements">
                  <p>Password requirements</p>
                  <ul style={{ margin: 0, padding: 0 }}>
                    {passwordRequirements.map((req, i) => (
                      <li key={i} className={req.met ? "met" : ""}>
                        {req.met ? <Check size={12} /> : <X size={12} />}
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="signup-username" className="auth-label">Username</label>
                <input
                  id="signup-username"
                  type="text"
                  placeholder="e.g. johndoe (lowercase only)"
                  autoComplete="username"
                  className="auth-input"
                  {...form.register("username")}
                />
                {form.formState.errors.username && (
                  <span className="auth-error">{form.formState.errors.username.message}</span>
                )}
              </div>

              <label className="auth-checkbox-wrap">
                <input type="checkbox" className="auth-checkbox" {...form.register("agreeTerms")} />
                <span className="auth-checkbox-label">
                  I agree to the{" "}
                  <Link href="/terms" className="signup-form-link">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="signup-form-link">Privacy Policy</Link>
                </span>
              </label>
              {form.formState.errors.agreeTerms && (
                <span className="auth-error">{form.formState.errors.agreeTerms.message}</span>
              )}

              <button
                type="submit"
                className="auth-btn auth-btn-primary signup-btn-primary"
                disabled={isLoading}
                aria-label={isLoading ? "Creating account" : "Create account"}
              >
                {isLoading ? (
                  <> <span className="signup-spinner" aria-hidden /> Creating... </>
                ) : (
                  "Create account"
                )}
              </button>

              <p className="auth-footer-text signup-form-footer">
                Already have an account? <a href="/login" className="auth-cross-link">Log in</a>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
