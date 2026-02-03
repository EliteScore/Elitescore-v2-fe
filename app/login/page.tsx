"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("elitescore_logged_in") === "true"
    if (isLoggedIn) router.replace("/app")
  }, [router])

  function onSubmit(values: LoginFormValues) {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("elitescore_logged_in", "true")
      localStorage.setItem("elitescore_email", values.email)
      router.push("/app")
    }, 700)
  }

  function handleGoogleSignIn() {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("elitescore_logged_in", "true")
      router.push("/app")
    }, 600)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md border-border/60 bg-card/90">
          <CardHeader>
            <div className="mb-2 flex items-center gap-3">
              <img src="/logo.jpeg" alt="EliteScore" className="h-10 w-10 rounded-xl object-cover" />
              <div>
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription>Sign in to continue your progress.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
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
                          autoComplete="current-password"
                          placeholder="Enter password"
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
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" disabled={isLoading} className="h-11 w-full">
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="h-11 w-full">
                  Continue with Google
                </Button>
                <div className="text-xs text-muted-foreground">
                  New here?{" "}
                  <Link href="/signup" className="font-medium text-foreground hover:underline">
                    Create account
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
