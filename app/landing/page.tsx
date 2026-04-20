"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import "./landing-animations.css"

const APP_GRADIENT = "linear-gradient(135deg, #db2777 0%, #ea580c 35%, #2563eb 70%, #7c3aed 100%)"

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
  { num: "1", title: "Pick a challenge", desc: "CS50, Google certs, MIT courses. Now with stakes." },
  { num: "2", title: "Submit proof", desc: "Screenshots, links. We verify. No proof, no points." },
  { num: "3", title: "Climb the board", desc: "Rank, streak, movement. All public. Game on." },
]

const CHALLENGES = [
  { title: "Harvard CS50 — Intro to CS", tag: "Harvard", level: "Beginner", url: "https://www.youtube.com/playlist?list=PLWKjhJtqVAbmGw5fN5BQlwuug-8bDmabi", videoId: null, gradient: "from-pink-500/90 to-orange-500/90" },
  { title: "Google Data Analytics", tag: "Google", level: "Beginner", url: "https://youtube.com/playlist?list=PLBgogxgQVM9tcNYUyRL2jvFNm7jsYlyPv", videoId: null, gradient: "from-blue-500/90 to-indigo-500/90" },
  { title: "Harvard CS50 AI with Python", tag: "Harvard", level: "Advanced", url: "https://youtu.be/5NgNicANyqM", videoId: "5NgNicANyqM", gradient: "from-violet-500/90 to-purple-500/90" },
  { title: "MIT 6.S191 — Deep Learning", tag: "MIT", level: "Advanced", url: "https://www.youtube.com/playlist?list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI", videoId: null, gradient: "from-pink-500/90 to-rose-500/90" },
  { title: "Google IT Automation", tag: "Google", level: "Intermediate", url: "https://www.youtube.com/playlist?list=PLTZYG7bZ1u6qck0rYNHO2Yfjzq5ZRRTCe", videoId: null, gradient: "from-amber-500/90 to-orange-500/90" },
  { title: "Harvard CS50 Cybersecurity", tag: "Harvard", level: "Intermediate", url: "https://youtu.be/9HOpanT0GRs", videoId: "9HOpanT0GRs", gradient: "from-emerald-500/90 to-teal-500/90" },
]

const getThumb = (videoId: string | null): string | null =>
  videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [waitlistEmail, setWaitlistEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const credibilityRef = useInView()
  const stepsRef = useInView()
  const challengesRef = useInView()
  const waitlistRef = useInView()

  useEffect(() => {
    const t = requestAnimationFrame(() => setTimeout(() => setHeroReady(true), 100))
    return () => cancelAnimationFrame(t)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  const handleWaitlist = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (waitlistEmail.trim()) setSubmitted(true)
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
              href="/login"
              className="landing-nav-cta inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-transform"
              style={{ background: APP_GRADIENT }}
            >
              Sign up for free
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
              Online courses.
              <br />
              Now a game.
            </h1>
            <p
              className={`mb-8 max-w-lg text-base text-white/90 transition-all duration-500 ease-out sm:text-lg ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "200ms" }}
            >
              Learn from Harvard, Google & MIT. Submit proof. Climb the leaderboard. Finish What You Start.
            </p>
            <Link
              href="/login"
              className={`landing-cta-btn inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-base font-bold text-slate-800 shadow-lg transition-[opacity,transform] duration-500 ease-out ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "350ms" }}
            >
              Sign up for free
            </Link>
          </div>
        </section>

        {/* Credibility – staggered fade-in up when in view */}
        <section ref={credibilityRef[0]} className="pt-16">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">Learn from the best</p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {CREDIBILITY.map((item, i) => (
              <div
                key={item.name}
                className={`landing-fade-up flex flex-col items-center rounded-xl border border-slate-200/80 bg-white px-6 py-4 shadow-sm ${credibilityRef[1] ? "landing-fade-up-visible" : ""}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="text-sm font-bold text-slate-800">{item.name}</span>
                <span className="text-xs text-slate-500">{item.sub}</span>
              </div>
            ))}
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
                <span className="mb-3 block text-2xl font-bold text-slate-800">{step.num}</span>
                <h3 className="mb-2 text-lg font-semibold text-slate-800">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Challenges – scroll-in + staggered cards, hover lift + pink shadow + play scale */}
        <section id="challenges" ref={challengesRef[0]} className={`pt-20 landing-scroll-in ${challengesRef[1] ? "landing-scroll-in-visible" : ""}`}>
          <h2 className="mb-2 text-center text-2xl font-bold text-slate-800 sm:text-3xl">Challenges with stakes</h2>
          <p className="mb-10 text-center text-slate-600">Harvard CS50, Google certs, MIT— compete on the popular courses. Proof required.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CHALLENGES.map((c, i) => {
              const thumb = getThumb(c.videoId)
              return (
                <a
                  key={i}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`landing-challenge-card group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm landing-fade-up ${challengesRef[1] ? "landing-fade-up-visible" : ""}`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                  aria-label={`Open ${c.title}`}
                >
                  <div className={`relative aspect-video bg-gradient-to-br ${c.gradient}`}>
                    {thumb && <img src={thumb} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />}
                    <span className="landing-play-btn absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800" aria-hidden>
                      <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                    <span className="absolute bottom-2 left-2 rounded-lg bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-700">{c.tag}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 group-hover:text-pink-600">{c.title}</h3>
                    <span className="text-xs text-slate-500">{c.level}</span>
                  </div>
                </a>
              )
            })}
          </div>
        </section>

        {/* Waitlist – scroll-in (24px up) + gradient shift on section background */}
        <section id="waitlist" ref={waitlistRef[0]} className="relative pt-20">
          <div
            className="landing-waitlist-gradient pointer-events-none absolute inset-0 top-20 rounded-2xl opacity-[0.08]"
            style={{ background: APP_GRADIENT, backgroundSize: "200% 200%" }}
            aria-hidden
          />
          <div
            className={`landing-waitlist-in relative z-10 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm sm:p-10 ${waitlistRef[1] ? "landing-waitlist-in-visible" : ""}`}
          >
            {!submitted ? (
              <>
                <h2 className="mb-2 text-center text-2xl font-bold text-slate-800 sm:text-3xl">Get on the board</h2>
                <p className="mb-8 text-center text-slate-600">Subscribe for updates.</p>
                <form onSubmit={handleWaitlist} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                    required
                    aria-label="Email for waitlist"
                  />
                  <button
                    type="submit"
                    className="landing-cta-btn rounded-xl px-6 py-3 font-semibold text-white"
                    style={{ background: APP_GRADIENT }}
                  >
                    Sign up for free
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <h2 className="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl">You&apos;re in.</h2>
                <p className="text-slate-600">Check your email. We&apos;ll see you on the board.</p>
              </div>
            )}
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
            <Link href="/login" className="text-slate-500 hover:text-slate-800">
              Sign up for free
            </Link>
          </div>
          <p className="mt-4 text-[10px] text-slate-400">© 2025 EliteScore</p>
        </footer>
      </main>
    </div>
  )
}
