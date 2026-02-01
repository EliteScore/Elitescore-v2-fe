"use client"

import Link from "next/link"
import {
  ArrowRight,
  Check,
  Sparkles,
  Target,
  Trophy,
  Zap,
  Flame,
  Star,
  Users,
  Shield,
  Gauge,
  CalendarCheck,
  ListChecks,
  BarChart3,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

const stats = [
  { label: "Active learners", value: "15k+" },
  { label: "Challenges completed", value: "240k" },
  { label: "Avg. streak length", value: "9 days" },
  { label: "Cohorts live", value: "180+" },
]

const logos = ["Northbridge", "Lumina", "Atlas", "Keystone", "Signal", "Orchid"]

const features = [
  {
    title: "Challenges that ship habits",
    description: "Daily prompts, time boxed tasks, and proof submission keep momentum real.",
    icon: Target,
  },
  {
    title: "EliteScore built on evidence",
    description: "Progress is earned, not claimed. Proof protects the leaderboard and your credibility.",
    icon: Shield,
  },
  {
    title: "Compete with your cohort",
    description: "Rank against peers, climb weekly ladders, and celebrate wins together.",
    icon: Trophy,
  },
]

const steps = [
  {
    title: "Lock a challenge",
    description: "Pick a track and commit with a clear daily task list.",
    icon: ListChecks,
  },
  {
    title: "Submit proof",
    description: "Upload evidence each day to keep your streak alive.",
    icon: CalendarCheck,
  },
  {
    title: "Level up",
    description: "Earn EliteScore, climb the leaderboard, and unlock tougher tracks.",
    icon: BarChart3,
  },
]

const testimonials = [
  {
    quote: "The streaks made me finally stay consistent. It feels like a real game.",
    name: "Isha K.",
    role: "CS Undergrad",
  },
  {
    quote: "Proof based progress keeps everyone honest. The leaderboard feels fair.",
    name: "Marcus L.",
    role: "Data Science Cohort",
  },
  {
    quote: "I stopped drifting. Every day has a concrete task now.",
    name: "Riya S.",
    role: "Design Student",
  },
]

const faqs = [
  {
    q: "How do I keep my streak?",
    a: "Complete the daily task and submit proof before the cutoff. Miss a day and the streak resets.",
  },
  {
    q: "What counts as proof?",
    a: "Screenshots, links, or short notes. Each challenge defines acceptable proof types.",
  },
  {
    q: "Is EliteScore public?",
    a: "Your cohort sees your rank and streak. You control what profile details are visible.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute top-48 -left-20 h-72 w-72 rounded-full bg-brand-2/15 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
        </div>

        <header className="container mx-auto flex items-center justify-between px-4 py-6">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="EliteScore" className="h-10 w-10 rounded-2xl object-cover" />
            <span className="text-sm font-semibold text-foreground">EliteScore</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" className="text-sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white" asChild>
              <Link href="/app">
                Launch app
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </header>

        <section className="container mx-auto grid gap-10 px-4 pb-12 pt-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
              Gamified accountability for real life
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Turn daily progress into a streak you actually want to keep.
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              EliteScore makes habits feel like a game. Lock a challenge, submit proof, and climb the leaderboard with your cohort.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white" asChild>
                <Link href="/app">
                  Start now
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-sm font-semibold" asChild>
                <Link href="/signup">Create account</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              {stats.map((item) => (
                <div key={item.label}>
                  <div className="text-lg font-semibold text-foreground">{item.value}</div>
                  <div>{item.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current text-foreground" aria-hidden="true" />
                ))}
              </div>
              4.9 average from students
            </div>
          </div>

          <div className="relative">
            <div className="glass-card rounded-[28px] border border-border/60 bg-card/70 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Today</div>
                  <div className="text-lg font-semibold text-foreground">Your progress</div>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-foreground">Live</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>EliteScore</span>
                    <span className="font-semibold text-foreground">8,247</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 w-2/3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    +35 this week
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
                    <div className="text-xs text-muted-foreground">Streak</div>
                    <div className="text-lg font-semibold text-foreground flex items-center gap-1">
                      <Flame className="h-4 w-4 text-foreground" aria-hidden="true" />
                      12 days
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
                    <div className="text-xs text-muted-foreground">Rank</div>
                    <div className="text-lg font-semibold text-foreground">#148</div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-foreground">Today&apos;s quest</div>
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-foreground">+25 pts</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Ship a 20 minute focus session and log proof.</p>
                </div>
                <Button className="w-full text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white" asChild>
                  <Link href="/app">Open dashboard</Link>
                </Button>
              </div>
            </div>
            <div className="absolute -right-6 -top-6 hidden rounded-2xl border border-border/60 bg-background/90 p-4 shadow-md lg:block">
              <div className="text-xs text-muted-foreground">Your squad</div>
              <div className="mt-2 flex items-center gap-2">
                {["A", "M", "R"].map((letter) => (
                  <div
                    key={letter}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-foreground"
                  >
                    {letter}
                  </div>
                ))}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  +5
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="container mx-auto px-4 pb-10">
        <div className="flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-border/60 bg-card/60 px-6 py-4 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Trusted by cohorts at</span>
          {logos.map((logo) => (
            <span key={logo} className="uppercase tracking-widest">{logo}</span>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6">
              <feature.icon className="h-5 w-5 text-foreground" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14">
        <div className="glass-card rounded-3xl border border-border/60 bg-card/70 p-8 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="text-xs font-medium text-muted-foreground">Why it works</div>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">Structure that keeps you accountable.</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Every challenge is time boxed, proof based, and scored. The system keeps you honest and makes progress visible.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Gauge className="h-4 w-4 text-foreground" aria-hidden="true" />
                    Avg completion rate
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-foreground">72%</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-4 w-4 text-foreground" aria-hidden="true" />
                    Cohort retention
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-foreground">84%</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-4 rounded-2xl border border-border/60 bg-card/60 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-foreground">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <step.icon className="h-4 w-4 text-foreground" aria-hidden="true" />
                      {step.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="glass-card rounded-3xl border border-border/60 bg-card/70 p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                <Zap className="h-5 w-5 text-foreground" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Momentum</div>
                <div className="text-lg font-semibold text-foreground">Daily tasks, weekly momentum</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Know exactly what to do each day, then submit proof to keep your streak alive.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {["Daily task list", "Proof submission", "Streak multipliers"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-foreground" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-3xl border border-border/60 bg-card/70 p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-2/15">
                <Trophy className="h-5 w-5 text-foreground" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Leaderboard</div>
                <div className="text-lg font-semibold text-foreground">See where you stand</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Compete with your cohort and track movement as your score climbs.
            </p>
            <div className="mt-6 rounded-2xl border border-border/60 bg-card/60 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Your rank</span>
                <span className="font-semibold text-foreground">#148</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-muted-foreground">This week</span>
                <span className="font-semibold text-foreground">+23 positions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="glass-card rounded-2xl border border-border/60 bg-card/70 p-6">
              <div className="flex items-center gap-2 text-foreground">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <p className="mt-3 text-sm text-foreground">"{testimonial.quote}"</p>
              <div className="mt-4 text-xs text-muted-foreground">
                <div className="font-semibold text-foreground">{testimonial.name}</div>
                <div>{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="glass-card rounded-3xl border border-border/60 bg-card/70 p-8 lg:p-12">
          <h2 className="text-2xl font-semibold text-foreground">Questions, answered</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-2xl border border-border/60 bg-card/60 p-4">
                <div className="text-sm font-semibold text-foreground">{item.q}</div>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="glass-card rounded-3xl border border-border/60 bg-emerald-500/10 p-10 text-center">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="text-xs font-medium text-muted-foreground">Ready to commit?</div>
            <h2 className="text-2xl font-semibold text-foreground">Build your next streak today.</h2>
            <p className="text-sm text-muted-foreground">
              Join your cohort, lock in a challenge, and let EliteScore keep you accountable.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white" asChild>
                <Link href="/app">
                  Launch app
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-sm font-semibold" asChild>
                <Link href="/signup">Create account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-background">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground md:flex-row">
          <div> 2026 EliteScore</div>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-foreground">Sign in</Link>
            <Link href="/signup" className="hover:text-foreground">Create account</Link>
            <Link href="/app" className="hover:text-foreground">Launch app</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
