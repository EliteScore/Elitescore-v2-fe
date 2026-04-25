"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { providerLogoUrl } from "@/lib/challengeProvider"
import { resolveChallengeThumbnail } from "@/lib/challengeThumbnails"
import "./landing-animations.css"

const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"

const HERO_PARTNERS = ["Harvard", "Google", "MIT", "Microsoft"] as const

type UseInViewOptions = { rootMargin?: string; threshold?: number }

const useInView = (options: UseInViewOptions = {}): [React.RefObject<HTMLElement | null>, boolean] => {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const { rootMargin = "0px 0px -10% 0px", threshold = 0 } = options
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin, threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold])
  return [ref, inView]
}

const CREDIBILITY = [
  { name: "Harvard", sub: "CS50" },
  { name: "Google", sub: "Certs" },
  { name: "MIT", sub: "Courses" },
  { name: "Microsoft", sub: "AI" },
]

const STEPS = [
  {
    num: "1",
    title: "Pick a course",
    desc: "Harvard CS50, MIT, Google — pick one you've been putting off.",
    icon: (
      <svg className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    num: "2",
    title: "Submit proof, weekly",
    desc: "Screenshots, code, links. We verify. No proof, no progress.",
    icon: (
      <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    num: "3",
    title: "Climb the board",
    desc: "Rank, streak, movement. All public. Game on.",
    icon: (
      <svg className="h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.5 9.75v6.906m8.25-2.847a6.003 6.003 0 00-8.25-2.847m0 0V9.75m0 0V9.75A6.003 6.003 0 0012 6.75v6.906" />
      </svg>
    ),
  },
]

type LandingChallenge = {
  title: string
  tag: string
  level: string
  slug: string
  videoId: string | null
  gradient: string
  description: string
}

const CHALLENGES: LandingChallenge[] = [
  {
    title: "Harvard CS50 — Intro to CS",
    tag: "Harvard",
    level: "Beginner",
    slug: "cs50",
    videoId: null,
    gradient: "from-pink-500/90 to-orange-500/90",
    description: "Harvard University CS50 introduction to computer science, algorithms, and programming fundamentals.",
  },
  {
    title: "Google Data Analytics",
    tag: "Google",
    level: "Beginner",
    slug: "google-data-analytics",
    videoId: null,
    gradient: "from-blue-500/90 to-indigo-500/90",
    description: "Google Career Certificate in data analytics, spreadsheets, SQL, and visualization.",
  },
  {
    title: "Harvard CS50 AI with Python",
    tag: "Harvard",
    level: "Advanced",
    slug: "cs50-ai-python",
    videoId: "5NgNicANyqM",
    gradient: "from-violet-500/90 to-purple-500/90",
    description: "Harvard CS50 artificial intelligence with Python, machine learning, and neural networks.",
  },
  {
    title: "MIT 6.S191 — Introduction to Deep Learning",
    tag: "MIT",
    level: "Advanced",
    slug: "mit-6s191",
    videoId: null,
    gradient: "from-pink-500/90 to-rose-500/90",
    description: "MIT introduction to deep learning, neural networks, and TensorFlow.",
  },
  {
    title: "MIT — The Missing Semester",
    tag: "MIT",
    level: "Intermediate",
    slug: "missing-semester",
    videoId: null,
    gradient: "from-slate-600/90 to-slate-800/90",
    description: "MIT Missing Semester — shell, editors, Git, debugging, and command-line tools for CS students.",
  },
  {
    title: "Google IT Automation",
    tag: "Google",
    level: "Intermediate",
    slug: "google-it-automation",
    videoId: null,
    gradient: "from-amber-500/90 to-orange-500/90",
    description: "Google IT Automation with Python Professional Certificate — Git, Python, and automation.",
  },
  {
    title: "Harvard CS50 Cybersecurity",
    tag: "Harvard",
    level: "Intermediate",
    slug: "cs50-cybersecurity",
    videoId: "9HOpanT0GRs",
    gradient: "from-emerald-500/90 to-teal-500/90",
    description: "Harvard CS50 cybersecurity track — threats, cryptography, and secure systems.",
  },
]

const getThumb = (videoId: string | null): string | null =>
  videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null

function challengeCoverSrc(c: LandingChallenge): string {
  const yt = getThumb(c.videoId)
  if (yt) return yt
  return resolveChallengeThumbnail(c.title, c.tag, c.description, c.tag)
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const credibilityRef = useInView()
  const stepsRef = useInView()
  const challengesRef = useInView()

  useEffect(() => {
    const t = requestAnimationFrame(() => setTimeout(() => setHeroReady(true), 100))
    return () => cancelAnimationFrame(t)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    scrollTo(id)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f6] font-sans text-slate-800 antialiased">
      {/* Light header – no black bar */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-lg font-bold tracking-tight text-slate-800 hover:opacity-90" aria-label="EliteScore Home">
            EliteScore
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
          <nav className={`absolute left-0 right-0 top-14 flex flex-col gap-2 border-b border-slate-200 bg-white px-4 py-4 md:static md:top-0 md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:py-0 ${menuOpen ? "flex" : "hidden"}`}>
            <a href="#how" onClick={(e) => handleNavClick(e, "how")} className="text-sm font-medium text-slate-600 hover:text-slate-800 md:py-2">
              How it works
            </a>
            <a href="#challenges" onClick={(e) => handleNavClick(e, "challenges")} className="text-sm font-medium text-slate-600 hover:text-slate-800 md:py-2">
              Challenges
            </a>
            <Link
              href="/signup"
              className="landing-nav-cta inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-transform"
              style={{ background: APP_GRADIENT }}
            >
              Get Started For Free
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6 sm:pb-20">
        {/* Hero – gradient card with gradientShift + floating orbs */}
        <section
          className="landing-hero-gradient relative overflow-hidden rounded-2xl shadow-xl"
          style={{ background: APP_GRADIENT, backgroundSize: "200% 200%" }}
        >
          {/* Floating orbs */}
          <span className="landing-float landing-float-delay-1 pointer-events-none absolute -left-20 top-1/4 h-40 w-40 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <span className="landing-float landing-float-delay-2 pointer-events-none absolute -right-20 bottom-1/4 h-48 w-48 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
            <h1
              className={`mb-4 max-w-2xl text-3xl font-extrabold leading-tight text-white transition-all duration-500 ease-out sm:text-4xl md:text-5xl ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "100ms" }}
            >
              You signed up for CS50.
              <br />
              You quit in week 2.
            </h1>
            <p
              className={`mb-8 max-w-lg text-base text-white/90 transition-all duration-500 ease-out sm:text-lg ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "200ms" }}
            >
              Not this time. Pick a free course from Harvard, MIT or Google. Submit proof every week. Climb a public leaderboard. Finish what you start — with everyone watching.
            </p>
            <Link
              href="/signup"
              className={`landing-cta-btn inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-base font-bold text-slate-800 shadow-lg transition-[opacity,transform] duration-500 ease-out ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "350ms" }}
            >
              Get Started For Free
            </Link>
            <p
              className={`mt-3 text-sm text-white/90 transition-all duration-500 ease-out ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "400ms" }}
            >
              Already have an account?{" "}
              <Link href="/login" className="font-medium underline decoration-white/50 underline-offset-2 hover:decoration-white">
                Log in
              </Link>
            </p>
            <div
              className={`mt-10 flex flex-wrap items-center justify-center gap-4 transition-all duration-500 ease-out sm:gap-6 ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "450ms" }}
              aria-label="Partner institutions"
            >
              {HERO_PARTNERS.map((name) => {
                const src = providerLogoUrl(name)
                if (!src) return null
                return (
                  <div
                    key={name}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 shadow-md ring-1 ring-white/40 sm:h-14 sm:w-14"
                  >
                    <img src={src} alt={`${name} logo`} className="h-8 w-8 object-contain sm:h-9 sm:w-9" width={36} height={36} />
                  </div>
                )
              })}
            </div>
            <p
              className={`mt-4 max-w-xl px-2 text-center text-[10px] leading-snug text-white/80 transition-all duration-500 ease-out ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "500ms" }}
            >
              EliteScore is not affiliated with the original publishers of the provided courses.
            </p>
          </div>
        </section>

        {/* Credibility – staggered fade-in up when in view */}
        <section ref={credibilityRef[0]} className="pt-16">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">Learn from the best</p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {CREDIBILITY.map((item, i) => {
              const logo = providerLogoUrl(item.name)
              return (
                <div
                  key={item.name}
                  className={`landing-fade-up flex flex-col items-center rounded-xl border border-slate-200/80 bg-white px-6 py-4 shadow-sm ${credibilityRef[1] ? "landing-fade-up-visible" : ""}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {logo ? (
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50">
                      <img src={logo} alt={`${item.name} logo`} className="h-8 w-8 object-contain" width={32} height={32} />
                    </div>
                  ) : null}
                  <span className="text-sm font-bold text-slate-800">{item.name}</span>
                  <span className="text-xs text-slate-500">{item.sub}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* How it works – scroll-in block + staggered step cards with hover lift */}
        <section id="how" ref={stepsRef[0]} className={`pt-20 landing-scroll-in ${stepsRef[1] ? "landing-scroll-in-visible" : ""}`}>
          <h2 className="mb-10 text-center text-2xl font-bold text-slate-800 sm:text-3xl">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <article
                key={step.num}
                className={`landing-step-card landing-fade-up rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ${stepsRef[1] ? "landing-fade-up-visible" : ""}`}
                style={{ transitionDelay: `${100 + i * 80}ms` }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50">{step.icon}</span>
                  <span className="text-2xl font-bold text-slate-800">{step.num}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-800">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Challenges – scroll-in + staggered cards, hover lift + pink shadow + play scale */}
        <section id="challenges" ref={challengesRef[0]} className={`pt-20 landing-scroll-in ${challengesRef[1] ? "landing-scroll-in-visible" : ""}`}>
          <h2 className="mb-2 text-center text-2xl font-bold text-slate-800 sm:text-3xl">Real courses. Real stakes.</h2>
          <p className="mb-10 text-center text-slate-600">Pick one. Climb the board, or fall off it. Either way, everyone sees.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CHALLENGES.map((c, i) => {
              const coverSrc = challengeCoverSrc(c)
              const brandLogo = providerLogoUrl(c.tag)
              return (
                <Link
                  key={i}
                  href={`/signup?challenge=${encodeURIComponent(c.slug)}`}
                  className={`landing-challenge-card group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm landing-fade-up ${challengesRef[1] ? "landing-fade-up-visible" : ""}`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                  aria-label={`Get started with ${c.title}`}
                >
                  <div className={`relative aspect-video bg-gradient-to-br ${c.gradient}`}>
                    <img
                      src={coverSrc}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-normal"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
                    {brandLogo ? (
                      <div className="absolute left-2 top-2 z-10 flex max-w-[min(100%-1rem,13rem)] items-center gap-2 rounded-xl bg-white/95 py-1.5 pl-1.5 pr-2.5 shadow-md ring-1 ring-black/10">
                        <img
                          src={brandLogo}
                          alt={`${c.tag} logo`}
                          className="h-8 w-8 shrink-0 object-contain"
                          width={32}
                          height={32}
                        />
                        <span className="truncate text-[10px] font-bold leading-tight text-slate-800">{c.tag}</span>
                      </div>
                    ) : null}
                    <span className="landing-play-btn absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md" aria-hidden>
                      <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                    <span className="absolute bottom-2 left-2 z-10 rounded-lg bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-700">{c.level}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 group-hover:text-pink-600">{c.title}</h3>
                    <span className="text-xs text-slate-500">{c.level}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Minimal light footer – no black */}
        <footer className="mt-20 border-t border-slate-200/80 pt-8 text-center">
          <Link href="/" className="mb-2 inline-block hover:opacity-90" aria-label="EliteScore Home">
            <Image src="/gemini%20logo.png" alt="EliteScore" width={140} height={42} className="mx-auto h-8 w-auto" />
          </Link>
          <p className="mb-4 text-xs text-slate-500">Online courses, done right. Prove it.</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <a href="#how" onClick={(e) => handleNavClick(e, "how")} className="text-slate-500 hover:text-slate-800">
              How it works
            </a>
            <a href="#challenges" onClick={(e) => handleNavClick(e, "challenges")} className="text-slate-500 hover:text-slate-800">
              Challenges
            </a>
            <Link href="/signup" className="text-slate-500 hover:text-slate-800">
              Get Started For Free
            </Link>
            <Link href="/privacy" className="text-slate-500 hover:text-slate-800">
              Privacy Policy
            </Link>
          </div>
          <p className="mt-4 text-[10px] text-slate-400">© 2026 EliteScore</p>
        </footer>
      </main>
    </div>
  )
}
