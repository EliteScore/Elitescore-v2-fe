"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowRight, Lock } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
}

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  remember: z.boolean().default(false),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  })

  async function onSubmit(formData: LoginFormValues) {
    setIsLoading(true)
    setLoginError(null)

    // Simulate login (frontend only)
    setTimeout(() => {
      localStorage.setItem("elitescore_logged_in", "true")
      localStorage.setItem("elitescore_email", formData.email)
      router.push("/")
    }, 1000)
  }

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    setLoginError(null)
    // Simulate Google sign in (frontend only)
    setTimeout(() => {
      localStorage.setItem("elitescore_logged_in", "true")
      router.push("/")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 py-12 overflow-x-hidden">
      {/* App name at the top */}
      <div className="w-full flex justify-center pt-8 pb-4">
        <span className="text-2xl font-extrabold tracking-widest uppercase bg-gradient-to-r from-[#2bbcff] to-[#a259ff] bg-clip-text text-transparent">
          ELITESCORE
        </span>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-0 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute right-0 top-1/3 -z-10 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <motion.div
        className="w-full max-w-sm space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <h1 className="text-2xl font-extrabold tracking-widest uppercase bg-gradient-to-r from-[#2bbcff] to-[#a259ff] bg-clip-text text-transparent">
            Sign In
          </h1>
          <p className="mt-2 text-white text-sm">Sign in to continue your journey</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-2xl rounded-2xl border-0 bg-card/90 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-lg font-extrabold tracking-widest uppercase bg-gradient-to-r from-[#2bbcff] to-[#a259ff] bg-clip-text text-transparent">
                Welcome back
              </CardTitle>
              <CardDescription className="text-white text-sm">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                <CardContent className="space-y-4">
                  {loginError && (
                    <Alert variant="destructive" className="animate-shake">
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Email</FormLabel>
                        <Input
                          className="py-3 text-base rounded-xl border border-zinc-700 bg-black/60 text-white focus:ring-2 focus:ring-[#2bbcff] focus:border-[#2bbcff] transition-all lowercase"
                          placeholder="john@example.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                          onChange={(event) => {
                            field.onChange(event.target.value.trim().toLowerCase())
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-white text-sm">Password</FormLabel>
                          <Link
                            href="/forgot-password"
                            className="text-xs text-zinc-400 hover:text-[#2bbcff] transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Input
                            className="py-3 text-base rounded-xl border border-zinc-700 bg-black/60 text-white focus:ring-2 focus:ring-[#2bbcff] focus:border-[#2bbcff] transition-all pr-12"
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 text-zinc-400 hover:text-[#2bbcff] transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="rounded-md border-zinc-700 focus:ring-[#2bbcff]"
                        />
                        <div className="leading-none">
                          <FormLabel className="text-white text-xs">Remember me for 30 days</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-[#2bbcff] to-[#a259ff] text-white shadow-lg hover:scale-[1.02] transition-transform"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="relative w-full flex items-center my-2">
                    <div className="flex-grow border-t border-zinc-700" />
                    <span className="mx-2 bg-transparent px-2 text-xs text-zinc-400">OR</span>
                    <div className="flex-grow border-t border-zinc-700" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-xl border-zinc-700 text-white hover:bg-zinc-900 transition-colors bg-transparent"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Sign in with Google
                  </Button>

                  <div className="text-center text-xs text-zinc-400">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-zinc-400 hover:text-[#2bbcff] transition-colors">
                      Sign up
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </motion.div>

        <motion.div
          className="flex items-center justify-center text-xs text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Lock className="h-3 w-3 mr-1" />
          <span>Secure login - 256-bit encryption</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
