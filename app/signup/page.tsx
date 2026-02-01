"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowRight, Lock, Check, X } from "lucide-react"
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

// Step 1 Schema
const step1Schema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

// Step 2 Schema
const step2Schema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain a number." }),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
})

type Step1Values = z.infer<typeof step1Schema>
type Step2Values = z.infer<typeof step2Schema>

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)
  const [step1Data, setStep1Data] = useState<Step1Values | null>(null)

  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  })

  const password = step2Form.watch("password")

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ]

  function onStep1Submit(data: Step1Values) {
    setStep1Data(data)
    setStep(2)
  }

  async function onStep2Submit(data: Step2Values) {
    if (!step1Data) return

    setIsLoading(true)
    setSignupError(null)

    // Simulate signup (frontend only)
    setTimeout(() => {
      localStorage.setItem("elitescore_logged_in", "true")
      localStorage.setItem("elitescore_username", step1Data.username)
      localStorage.setItem("elitescore_email", step1Data.email)
      router.push("/")
    }, 1000)
  }

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    setSignupError(null)
    // Simulate Google sign in (frontend only)
    setTimeout(() => {
      localStorage.setItem("elitescore_logged_in", "true")
      router.push("/")
    }, 1000)
  }

  return (
    <div className="min-h-[100dvh] sm:min-h-screen flex flex-col items-center justify-center bg-background p-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] overflow-x-hidden">
      {/* App name at the top */}
      <div className="w-full flex justify-center pt-4 sm:pt-8 pb-4">\n        <img src="/logo.jpeg" alt="EliteScore" className="h-12 w-12 rounded-2xl object-cover" />\n      </div>

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-0 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute right-0 top-1/3 -z-10 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <motion.div
        className="w-full max-w-sm space-y-6 sm:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-widest uppercase bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-foreground">
            Sign Up
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">Create your account to start your journey</p>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <Card className="shadow-2xl rounded-2xl border border-[#2563eb]/20 bg-card/90 backdrop-blur-lg overflow-hidden">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-2">
              <CardTitle className="text-base sm:text-lg font-extrabold tracking-widest uppercase bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-foreground">
                Create an account
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                {step === 1 ? "Enter your basic information" : "Set up your password"}
              </CardDescription>
              {/* Progress indicator */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">Step {step} of 2</span>
                <span className="text-xs text-muted-foreground">{step === 1 ? "Basic Info" : "Security"}</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed]"
                  initial={{ width: "50%" }}
                  animate={{ width: step === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </CardHeader>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <Form {...step1Form}>
                <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-0">
                  <CardContent className="space-y-4 p-4 sm:p-6 pt-2 sm:pt-2">
                    {signupError && (
                      <Alert variant="destructive" className="animate-shake">
                        <AlertDescription>{signupError}</AlertDescription>
                      </Alert>
                    )}

                    <FormField
                      control={step1Form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm">Username</FormLabel>
                          <Input
                            className="min-h-[48px] py-3 text-base rounded-xl border border-white/10 bg-white/5 text-foreground focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-all touch-manipulation"
                            placeholder="johndoe123"
                            autoComplete="username"
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step1Form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm">Email</FormLabel>
                          <Input
                            className="min-h-[48px] py-3 text-base rounded-xl border border-white/10 bg-white/5 text-foreground focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-all lowercase touch-manipulation"
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
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-4 p-4 sm:p-6 pt-2 sm:pt-2">
                    <Button
                      type="submit"
                      className="w-full min-h-[48px] sm:h-11 py-3 rounded-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white shadow-lg hover:opacity-90 transition-opacity touch-manipulation"
                      disabled={isLoading}
                      aria-label="Continue to step 2"
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>

                    <div className="relative w-full flex items-center my-2">
                      <div className="flex-grow border-t border-white/10" />
                      <span className="mx-2 bg-transparent px-2 text-xs text-muted-foreground">OR</span>
                      <div className="flex-grow border-t border-white/10" />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full min-h-[48px] sm:h-11 rounded-xl border-white/20 text-foreground hover:bg-white/10 transition-colors bg-transparent touch-manipulation"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      aria-label="Sign up with Google"
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
                      Sign up with Google
                    </Button>

                    <div className="text-center text-xs text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/login" className="text-[#2563eb] hover:underline transition-colors min-h-[44px] inline-flex items-center touch-manipulation" aria-label="Go to log in">
                        Log in
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <Form {...step2Form}>
                <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-0">
                  <CardContent className="space-y-4 p-4 sm:p-6 pt-2 sm:pt-2">
                    {signupError && (
                      <Alert variant="destructive" className="animate-shake">
                        <AlertDescription>{signupError}</AlertDescription>
                      </Alert>
                    )}

                    <FormField
                      control={step2Form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm">Password</FormLabel>
                          <div className="relative">
                            <Input
                              className="min-h-[48px] py-3 text-base rounded-xl border border-white/10 bg-white/5 text-foreground focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-all pr-12 touch-manipulation"
                              placeholder="Create a password"
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full min-w-[48px] min-h-[48px] px-3 text-muted-foreground hover:text-[#2563eb] transition-colors touch-manipulation"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Requirements */}
                    <div className="space-y-2 p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-muted-foreground font-medium">Password requirements</p>
                      <div className="space-y-1.5">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${req.met ? "bg-green-500/20" : "bg-white/10"}`} aria-hidden="true">
                              {req.met ? (
                                <Check className="w-2.5 h-2.5 text-foreground" />
                              ) : (
                                <X className="w-2.5 h-2.5 text-muted-foreground" />
                              )}
                            </div>
                            <span className={`text-xs ${req.met ? "text-foreground" : "text-muted-foreground"}`}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <FormField
                      control={step2Form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm">Confirm Password</FormLabel>
                          <div className="relative">
                            <Input
                              className="min-h-[48px] py-3 text-base rounded-xl border border-white/10 bg-white/5 text-foreground focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-all pr-12 touch-manipulation"
                              placeholder="Confirm your password"
                              type={showConfirmPassword ? "text" : "password"}
                              autoComplete="new-password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full min-w-[48px] min-h-[48px] px-3 text-muted-foreground hover:text-[#2563eb] transition-colors touch-manipulation"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step2Form.control}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="rounded-md border-white/20 focus:ring-[#2563eb] mt-0.5"
                          />
                          <div className="leading-none">
                            <FormLabel className="text-foreground text-xs cursor-pointer">
                              I agree to the{" "}
                              <Link href="/terms" className="text-[#2563eb] hover:underline">
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link href="/privacy" className="text-[#2563eb] hover:underline">
                                Privacy Policy
                              </Link>
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-4 p-4 sm:p-6 pt-2 sm:pt-2">
                    <div className="flex gap-3 w-full">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 min-h-[48px] sm:h-11 py-3 rounded-2xl border-white/20 text-foreground hover:bg-white/10 transition-colors bg-transparent touch-manipulation"
                        onClick={() => setStep(1)}
                        aria-label="Back to step 1"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 min-h-[48px] sm:h-11 py-3 rounded-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white shadow-lg hover:opacity-90 transition-opacity touch-manipulation"
                        disabled={isLoading}
                        aria-label={isLoading ? "Creating account" : "Create account"}
                      >
                        {isLoading ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
                            Creating...
                          </>
                        ) : (
                          <>
                            Create Account <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="text-center text-xs text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/login" className="text-[#2563eb] hover:underline transition-colors min-h-[44px] inline-flex items-center touch-manipulation" aria-label="Go to log in">
                        Log in
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            )}
          </Card>
        </motion.div>

        <motion.div
          className="flex items-center justify-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          role="status"
          aria-label="Security notice"
        >
          <Lock className="h-3 w-3 mr-1" aria-hidden="true" />
          <span>Your data is secure and encrypted</span>
        </motion.div>
      </motion.div>
    </div>
  )
}

