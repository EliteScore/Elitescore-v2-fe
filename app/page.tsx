"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Crown,
  ShieldCheck,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
  Zap,
} from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

const reveal = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
}

const featureCards = [
  {
    title: "High-Stakes Challenges",
    text: "Commit publicly, ship daily proof, and keep momentum visible.",
    icon: Swords,
  },
  {
    title: "Score Built on Evidence",
    text: "Only verified effort counts. No fake wins, no vanity metrics.",
    icon: ShieldCheck,
  },
  {
    title: "Competitive Social Loop",
    text: "Climb cohort ranks, defend your streak, and earn reputation.",
    icon: Crown,
  },
]

const missions = [
  { id: "I", name: "Lock In", detail: "Pick one challenge and define daily non-negotiables." },
  { id: "II", name: "Show Work", detail: "Submit proof before cutoff to preserve score velocity." },
  { id: "III", name: "Climb", detail: "Beat your past week, not just your peers." },
]

export default function LandingPage() {
  const [logoTapCount, setLogoTapCount] = useState(0)
  const [arcaneMode, setArcaneMode] = useState(false)
  const [constellationBurst, setConstellationBurst] = useState(false)
  const [keyBuffer, setKeyBuffer] = useState("")

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const next = `${keyBuffer}${event.key.toLowerCase()}`.slice(-5)
      setKeyBuffer(next)
      if (next === "elite") {
        setConstellationBurst(true)
        setTimeout(() => setConstellationBurst(false), 8000)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [keyBuffer])

  const stars = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        delay: `${(index % 7) * 0.25}s`,
        duration: `${6 + (index % 5)}s`,
      })),
    []
  )

  const handleLogoTap = () => {
    const next = logoTapCount + 1
    setLogoTapCount(next)
    if (next >= 5) {
      setArcaneMode((value) => !value)
      setLogoTapCount(0)
    }
  }

  return (
    <div
      className={`min-h-screen overflow-hidden transition-colors duration-700 ${
        arcaneMode ? "bg-[#050914] text-[#d6f7ff]" : "bg-background text-foreground"
      }`}
    >
      <div
        className={`absolute inset-0 -z-10 ${
          arcaneMode
            ? "bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.3),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(15,118,110,0.3),transparent_42%),linear-gradient(180deg,#071325_0%,#050914_100%)]"
            : "bg-[radial-gradient(circle_at_15%_15%,rgba(14,165,233,0.14),transparent_42%),radial-gradient(circle_at_85%_0%,rgba(15,118,110,0.16),transparent_40%),linear-gradient(180deg,#f7fbff_0%,#eef7f8_100%)]"
        }`}
      />

      {constellationBurst && (
        <div className="pointer-events-none absolute inset-0 z-20">
          {stars.map((star) => (
            <span
              key={star.id}
              className="starfall absolute h-2 w-2 rounded-full bg-cyan-300/80 shadow-[0_0_14px_rgba(34,211,238,0.9)]"
              style={{ left: star.left, animationDelay: star.delay, animationDuration: star.duration }}
            />
          ))}
        </div>
      )}

      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
        <button
          type="button"
          onClick={handleLogoTap}
          className="group flex items-center gap-3 rounded-full p-1 transition hover:bg-cyan-500/10"
          aria-label="EliteScore logo"
        >
          <img src="/logo.jpeg" alt="EliteScore" className="h-10 w-10 rounded-2xl object-cover ring-2 ring-cyan-500/25" />
          <div className="text-left">
            <div className="text-sm font-semibold tracking-wide">EliteScore</div>
            <div className="text-[11px] text-muted-foreground">Challenge ledger</div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button className="bg-cyan-600 text-white hover:bg-cyan-700" asChild>
            <Link href="/signup">
              Create account
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-20">
        <motion.section
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-8 py-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center"
        >
          <motion.div variants={reveal} className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Productive by Design
            </span>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Stop planning.
              <span className="block text-cyan-600">Start proving.</span>
            </h1>

            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              EliteScore turns your daily commitments into a public score loop. You commit, execute, submit proof, and rise.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-cyan-600 text-white hover:bg-cyan-700" asChild>
                <Link href="/signup">
                  Start your first mission
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-cyan-600/30" asChild>
                <Link href="/login">I already have an account</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div>
                <div className="text-xl font-semibold text-foreground">15k+</div>
                active learners
              </div>
              <div>
                <div className="text-xl font-semibold text-foreground">240k</div>
                proofs submitted
              </div>
              <div>
                <div className="text-xl font-semibold text-foreground">84%</div>
                weekly retention
              </div>
            </div>
          </motion.div>

          <motion.div variants={reveal} className="relative">
            <div className="glass-card rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Live Session</p>
                  <p className="text-lg font-semibold">Your Momentum Console</p>
                </div>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-600">
                  Live
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>EliteScore</span>
                    <span className="text-base font-semibold text-foreground">8247</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "73%" }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
                    <div className="text-xs text-muted-foreground">Current streak</div>
                    <div className="mt-1 flex items-center gap-1 text-lg font-semibold">
                      <Zap className="h-4 w-4 text-cyan-600" aria-hidden="true" />
                      12 days
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
                    <div className="text-xs text-muted-foreground">Global rank</div>
                    <div className="mt-1 text-lg font-semibold">#148</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">Today&apos;s mission</p>
                    <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[11px] font-semibold text-cyan-700">
                      +25 pts
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Complete a 20-minute focus sprint and submit one proof.
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="absolute -right-3 -top-3 rounded-2xl border border-cyan-500/25 bg-card/90 p-3 shadow-lg"
            >
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Squad online</div>
              <div className="mt-2 flex items-center gap-2">
                {["A", "M", "R", "+5"].map((item) => (
                  <span
                    key={item}
                    className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-cyan-500/15 px-2 text-xs font-semibold text-cyan-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-4 pb-12 lg:grid-cols-3"
        >
          {featureCards.map((item) => (
            <motion.article key={item.title} variants={reveal} className="glass-card rounded-2xl border border-border/60 bg-card/75 p-6">
              <item.icon className="h-5 w-5 text-cyan-600" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </motion.article>
          ))}
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-6 pb-14 lg:grid-cols-[1fr_1fr]"
        >
          <motion.div variants={reveal} className="glass-card rounded-3xl border border-border/60 bg-card/80 p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">How it works</p>
            <h2 className="mt-2 text-2xl font-semibold">Built for execution, not intention.</h2>
            <div className="mt-5 space-y-3">
              {missions.map((mission) => (
                <div key={mission.id} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/60 p-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-bold text-cyan-700">
                    {mission.id}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{mission.name}</div>
                    <div className="text-sm text-muted-foreground">{mission.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={reveal} className="glass-card rounded-3xl border border-border/60 bg-card/80 p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Weekly board</p>
            <h2 className="mt-2 text-2xl font-semibold">See what top performers do differently.</h2>
            <div className="mt-5 space-y-3">
              {[
                { name: "You", score: 8247, delta: "+35", current: true },
                { name: "Jordan_Dev", score: 8289, delta: "+19", current: false },
                { name: "Maria_K", score: 8201, delta: "+12", current: false },
              ].map((player) => (
                <div
                  key={player.name}
                  className={`flex items-center justify-between rounded-xl border p-3 ${
                    player.current ? "border-cyan-500/30 bg-cyan-500/10" : "border-border/60 bg-card/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-cyan-600" aria-hidden="true" />
                    <div className="text-sm font-semibold">{player.name}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-semibold">{player.score}</div>
                    <div className="text-cyan-700">{player.delta}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 border-cyan-600/30" asChild>
              <Link href="/login">
                View full leaderboard
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={reveal}
          className="rounded-3xl border border-cyan-500/25 bg-gradient-to-r from-cyan-500/10 via-card/80 to-emerald-500/10 p-10 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ready to lock in?</p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Build your reputation with proof-backed progress.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Small actions, daily evidence, and public accountability. That is the compounding loop.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-cyan-600 text-white hover:bg-cyan-700" asChild>
              <Link href="/signup">
                Join EliteScore
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-cyan-600/30" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>

          {arcaneMode && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]"
            >
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
              Arcane Mode Unlocked
            </motion.div>
          )}
        </motion.section>
      </main>

      <style jsx>{`
        .starfall {
          top: -20px;
          animation-name: starfall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          opacity: 0.85;
        }

        @keyframes starfall {
          0% {
            transform: translateY(0px) translateX(0px) scale(0.7);
            opacity: 0;
          }
          15% {
            opacity: 0.95;
          }
          100% {
            transform: translateY(105vh) translateX(-28px) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
