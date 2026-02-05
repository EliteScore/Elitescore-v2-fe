"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { WingMark } from "@/components/wing-mark"

const signupSchema = z
  .object({
    username: z.string().min(3, { message: "Username must be at least 3 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, { message: "Add one uppercase letter." })
      .regex(/[0-9]/, { message: "Add one number." }),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine((value) => value === true, {
      message: "You must agree to continue.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  })

  const password = form.watch("password")
  const requirements = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "One uppercase", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ]

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("elitescore_logged_in") === "true"
    if (isLoggedIn) router.replace("/app")
  }, [router])

  function onSubmit(values: SignupFormValues) {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("elitescore_logged_in", "true")
      localStorage.setItem("elitescore_username", values.username)
      localStorage.setItem("elitescore_email", values.email)
      router.push("/app")
    }, 800)
  }

  function handleGoogleSignIn() {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("elitescore_logged_in", "true")
      router.push("/app")
    }, 600)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(14,116,144,0.25),_transparent_55%)]" />
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-sky-400/20 blur-[120px]" />
      <div className="relative container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <Card className="w-full max-w-lg border-border/60 bg-card/90">
          <CardHeader>
            <div className="mb-2 flex items-center gap-3">
              <WingMark className="h-10 w-10 text-foreground" />
              <div>
                <CardTitle className="text-xl">Create account</CardTitle>
                <CardDescription>Set up your profile and start your first challenge.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <Input {...field} autoComplete="username" placeholder="your_username" className="h-11" />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Input {...field} type="email" autoComplete="email" placeholder="you@example.com" className="h-11" />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Create password"
                            className="h-11 pr-11"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="mx-auto h-4 w-4" /> : <Eye className="mx-auto h-4 w-4" />}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Confirm password"
                            className="h-11 pr-11"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-foreground"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? <EyeOff className="mx-auto h-4 w-4" /> : <Eye className="mx-auto h-4 w-4" />}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-xs">
                  <div className="mb-2 font-medium text-muted-foreground">Password rules</div>
                  <div className="grid gap-1 sm:grid-cols-3">
                    {requirements.map((item) => (
                      <span key={item.label} className="inline-flex items-center gap-1 text-muted-foreground">
                        <Check className={`h-3.5 w-3.5 ${item.met ? "text-emerald-600" : "text-muted-foreground"}`} aria-hidden="true" />
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="agreeTerms"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start gap-2">
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                        <FormLabel className="text-xs leading-relaxed text-muted-foreground">
                          I agree to the{" "}
                          <Link href="/terms" className="font-medium text-foreground hover:underline">
                            Terms
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="font-medium text-foreground hover:underline">
                            Privacy Policy
                          </Link>
                          .
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" disabled={isLoading} className="h-11 w-full">
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
                <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="h-11 w-full">
                  Continue with Google
                </Button>
                <div className="text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium text-foreground hover:underline">
                    Sign in
                  </Link>
                </div>
                <div className="text-xs text-muted-foreground">
                  <Link href="/" className="inline-flex items-center gap-1 hover:underline">
                    Back to home
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
