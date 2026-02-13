"use client"

import Link from "next/link"
import { Space_Grotesk, Sora } from "next/font/google"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowRight, CheckCircle2, Compass, Layers3, Trophy, Users } from "lucide-react"
import { WingMark } from "@/components/wing-mark"
import { Button } from "@/components/ui/button"

const sora = Sora({ subsets: ["latin"], weight: ["600", "700"] })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"] })

const productPillars = [
  {
    title: "Proof-First",
    body: "Progress only counts when you submit evidence. The score is earned, not claimed.",
    icon: CheckCircle2,
  },
  {
    title: "Competitive Loop",
    body: "Run against your peers every week with visible ranks, deltas, and streak pressure.",
    icon: Trophy,
  },
  {
    title: "Squad Accountability",
    body: "Keep a trusted circle that sees your targets, completions, and missed commitments.",
    icon: Users,
  },
]

const roadmap = [
  { title: "Set your mission", detail: "Define one meaningful challenge and daily minimum output." },
  { title: "Ship proof every day", detail: "Attach links, screenshots, or logs before your cutoff time." },
  { title: "Compound weekly", detail: "Review your score trend and tighten your plan for next week." },
]

export default function LandingPage() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.2 })
  const heroY = useTransform(smoothProgress, [0, 0.35], [0, -48])
  const heroOpacity = useTransform(smoothProgress, [0, 0.35], [1, 0.82])
  const gridY = useTransform(smoothProgress, [0, 1], [0, -70])
  const footerY = useTransform(smoothProgress, [0.6, 1], [28, 0])
  const navBrandColor = useTransform(smoothProgress, [0, 0.12], ["#ffffff", "#111111"])

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24, filter: reduceMotion ? "none" : "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0.2 : 0.55, ease: "easeOut" as const },
    },
  }
  const stagger = {
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0.02 : 0.12,
        delayChildren: reduceMotion ? 0 : 0.08,
      },
    },
  }

  return (
    <div className={`${spaceGrotesk.className} relative min-h-screen overflow-hidden bg-[#f6f3eb] text-[#171717]`}>
      <Link href="/" className="fixed left-4 top-4 z-50 sm:left-6 sm:top-5 lg:left-8">
        <motion.div style={{ color: navBrandColor }}>
          <WingMark className="h-10 w-10" />
        </motion.div>
      </Link>

      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute left-0 right-0 top-0 h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/landing-top-bg.jpg')" }}
        />
        <div className="absolute left-0 right-0 top-0 h-screen bg-[linear-gradient(180deg,rgba(4,10,5,0.12)_0%,rgba(7,16,9,0.2)_55%,rgba(7,16,9,0.45)_100%)]" />
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -16, 0], x: [0, 8, 0] }}
          transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#f97316]/20 blur-3xl"
        />
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 14, 0], x: [0, -10, 0] }}
          transition={reduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-10 h-80 w-80 rounded-full bg-[#0f766e]/20 blur-3xl"
        />
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
          transition={reduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-[#fb923c]/15 blur-3xl"
        />
        <motion.div
          style={{ y: reduceMotion ? undefined : gridY }}
          className="absolute inset-0 bg-[linear-gradient(rgba(23,23,23,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(23,23,23,0.06)_1px,transparent_1px)] bg-[size:42px_42px] opacity-[0.14]"
        />
      </div>

      <motion.header
        initial={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.2 : 0.45, ease: "easeOut" }}
        className="relative z-10 flex w-full items-center justify-between px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="pl-12 sm:pl-14">
          <motion.p style={{ color: navBrandColor }} className={`${sora.className} text-lg font-semibold`}>
            EliteScore
          </motion.p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-white text-[#111111] hover:bg-white/90" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button className="bg-[#171717] text-[#f6f3eb] hover:bg-[#2a2a2a]" asChild>
            <Link href="/signup">
              Start now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16">
        <motion.section
          initial="hidden"
          animate="show"
          variants={stagger}
          style={{ y: reduceMotion ? undefined : heroY, opacity: reduceMotion ? 1 : heroOpacity }}
          className="min-h-[88vh] py-6 pt-24 sm:pt-28"
        >
          <motion.div variants={fadeUp} className="mx-auto max-w-5xl space-y-6 text-center">
            <h1 className={`${sora.className} whitespace-nowrap text-[clamp(1.6rem,6.2vw,4.8rem)] font-semibold leading-[1.05] text-white`}>
              Build your week in public.
            </h1>
            <p className="mx-auto max-w-2xl text-base text-white/85 sm:text-lg">
              EliteScore turns intentions into evidence. Commit your challenge, submit proof daily, and climb a live board that rewards consistency.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="bg-[#171717] text-[#f6f3eb] hover:bg-[#2a2a2a]" asChild>
                <Link href="/signup">
                  Create your mission
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-black/20 bg-white/60 hover:bg-white" asChild>
                <Link href="/login">See dashboard</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { value: "15k+", label: "Active learners" },
                { value: "240k", label: "Proofs submitted" },
                { value: "84%", label: "Weekly retention" },
              ].map((metric) => (
                <motion.article
                  key={metric.label}
                  variants={fadeUp}
                  whileHover={reduceMotion ? undefined : { y: -3, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18 }}
                  className="rounded-2xl border border-white/35 bg-white/12 p-5 backdrop-blur-md"
                >
                  <p className={`${sora.className} text-3xl font-semibold text-white`}>{metric.value}</p>
                  <p className="mt-1 text-sm text-white/80">{metric.label}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          className="mt-14"
        >
          <motion.div variants={fadeUp} className="mb-5 flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-[#ea580c]" />
            <h2 className={`${sora.className} text-3xl font-semibold`}>Designed for real consistency</h2>
          </motion.div>
          <div className="grid gap-4 lg:grid-cols-3">
            {productPillars.map((pillar) => (
              <motion.article
                key={pillar.title}
                variants={fadeUp}
                whileHover={reduceMotion ? undefined : { y: -5 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="rounded-3xl border border-black/10 bg-white/70 p-6 backdrop-blur"
              >
                <pillar.icon className="h-5 w-5 text-[#ea580c]" />
                <p className={`${sora.className} mt-4 text-xl font-semibold`}>{pillar.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-black/65">{pillar.body}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <motion.article variants={fadeUp} className="rounded-3xl border border-black/10 bg-white/70 p-7 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">How it works</p>
            <h3 className={`${sora.className} mt-2 text-3xl font-semibold`}>Simple flow. Ruthless outcomes.</h3>
            <div className="mt-5 space-y-3">
              {roadmap.map((step, index) => (
                <div key={step.title} className="flex gap-3 rounded-xl border border-black/10 bg-[#faf7f0] p-4">
                  <span className={`${sora.className} inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#171717] text-sm text-[#f6f3eb]`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="text-sm text-black/65">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article variants={fadeUp} className="rounded-3xl border border-black/10 bg-[#171717] p-7 text-[#f6f3eb]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Weekly pulse</p>
            <h3 className={`${sora.className} mt-2 text-3xl font-semibold`}>You vs last week</h3>
            <div className="mt-5 space-y-3">
              {[
                { day: "Mon", score: "+25", tone: "text-[#fb923c]" },
                { day: "Tue", score: "+20", tone: "text-[#2dd4bf]" },
                { day: "Wed", score: "+18", tone: "text-[#fb923c]" },
                { day: "Thu", score: "+34", tone: "text-[#2dd4bf]" },
                { day: "Fri", score: "+30", tone: "text-[#2dd4bf]" },
              ].map((entry) => (
                <div key={entry.day} className="flex items-center justify-between border-b border-white/10 pb-2 text-sm">
                  <span className="text-white/70">{entry.day}</span>
                  <span className={`${sora.className} ${entry.tone} text-lg font-semibold`}>{entry.score}</span>
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full bg-[#f6f3eb] text-[#171717] hover:bg-white" asChild>
              <Link href="/leaderboard">
                Open leaderboard
                <Compass className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.article>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mt-14 rounded-[2rem] border border-black/10 bg-gradient-to-r from-[#ea580c] to-[#0f766e] p-10 text-[#fff8ef]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#fff8ef]/80">Ready to compete?</p>
          <h2 className={`${sora.className} mt-2 max-w-2xl text-4xl font-semibold leading-tight`}>
            Build a reputation from daily evidence, not motivation spikes.
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" className="bg-[#171717] text-[#f6f3eb] hover:bg-[#2a2a2a]" asChild>
              <Link href="/signup">
                Join EliteScore
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-[#fff8ef]/50 bg-transparent text-[#fff8ef] hover:bg-[#fff8ef]/15" asChild>
              <Link href="/terms-policy">Read terms</Link>
            </Button>
          </div>
        </motion.section>
      </main>

      <motion.footer
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={stagger}
        style={{ y: reduceMotion ? undefined : footerY }}
        className="relative z-10 mx-auto mb-6 w-full max-w-7xl px-4"
      >
        <div className="rounded-[2rem] border border-black/10 bg-[#171717] px-6 py-8 text-[#f6f3eb] sm:px-8">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <motion.div variants={fadeUp}>
              <div className="flex items-center gap-3">
                <WingMark className="h-9 w-9 text-[#f6f3eb]" />
                <p className={`${sora.className} text-xl font-semibold`}>EliteScore</p>
              </div>
              <p className="mt-3 max-w-sm text-sm text-[#f6f3eb]/70">
                The proof-first platform for people who want consistency, accountability, and measurable progress.
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f6f3eb]/70">Product</p>
              <div className="mt-3 space-y-2 text-sm">
                <Link href="/signup" className="block text-[#f6f3eb]/85 transition hover:text-white">Get started</Link>
                <Link href="/login" className="block text-[#f6f3eb]/85 transition hover:text-white">Dashboard</Link>
                <Link href="/leaderboard" className="block text-[#f6f3eb]/85 transition hover:text-white">Leaderboard</Link>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f6f3eb]/70">Company</p>
              <div className="mt-3 space-y-2 text-sm">
                <Link href="/terms-policy#terms" className="block text-[#f6f3eb]/85 transition hover:text-white">Terms</Link>
                <Link href="/terms-policy#privacy" className="block text-[#f6f3eb]/85 transition hover:text-white">Privacy</Link>
                <Link href="/login" className="block text-[#f6f3eb]/85 transition hover:text-white">Sign in</Link>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f6f3eb]/70">Action</p>
              <div className="mt-3 space-y-3">
                <Button className="w-full bg-[#f6f3eb] text-[#171717] hover:bg-white" asChild>
                  <Link href="/signup">Create account</Link>
                </Button>
                <Button variant="outline" className="w-full border-[#f6f3eb]/40 bg-transparent text-[#f6f3eb] hover:bg-[#f6f3eb]/15" asChild>
                  <Link href="/supporter/invite/live">Try supporter view</Link>
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="mt-8 border-t border-white/15 pt-4 text-xs text-[#f6f3eb]/65">
            Â© {new Date().getFullYear()} EliteScore. Built for execution.
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}


