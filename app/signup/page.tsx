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
      router.replace("/home")
    } catch (error) {
      console.error("Signup error:", error)
      setSignupError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    setSignupError(null)
    setTimeout(() => {
      localStorage.setItem("elitescore_logged_in", "true")
      router.push("/home")
    }, 1000)
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

              <div className="auth-divider signup-form-divider">
                <span>OR</span>
              </div>

              <button
                type="button"
                className="auth-btn signup-btn-ghost"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                aria-label="Sign up with Google"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: "0.4rem" }} aria-hidden>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign up with Google
              </button>
            </form>
            <p className="auth-footer-text signup-form-footer auth-form-footer-pin">
              Already have an account? <a href="/login" className="auth-cross-link">Log in</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
