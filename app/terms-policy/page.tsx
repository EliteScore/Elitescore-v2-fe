import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { WingMark } from "@/components/wing-mark"
import { Button } from "@/components/ui/button"

const termsItems = [
  {
    title: "Eligibility and Account",
    body: "You must provide accurate account details and keep your login secure. You are responsible for activity under your account.",
  },
  {
    title: "Proof and Ranking Integrity",
    body: "Submitted proof must reflect real work. Misleading or manipulated submissions may be removed and can result in score penalties or suspension.",
  },
  {
    title: "Fair Use",
    body: "Do not abuse the platform, attack system reliability, or use automation to manipulate rankings, streaks, or engagement metrics.",
  },
  {
    title: "Content Responsibility",
    body: "You keep ownership of your content, but grant EliteScore permission to process and display it for challenge tracking and product features.",
  },
  {
    title: "Connected Learning Accounts",
    body: "If you link supported learning providers, EliteScore may sync course progress and completion status to update quest progress automatically.",
  },
]

const privacyItems = [
  {
    title: "Data We Collect",
    body: "We collect account profile details, challenge activity, proof metadata, in-product interactions, and linked provider course progress required to run the experience.",
  },
  {
    title: "How Data Is Used",
    body: "Your data is used for scoring, challenge progress, notifications, supporter updates, fraud detection, and product improvement.",
  },
  {
    title: "Sharing and Access",
    body: "We do not sell personal data. Data is shared only with providers needed to operate the service or where required by law.",
  },
  {
    title: "Retention and Deletion",
    body: "We retain data for operational and compliance needs. You can request account export or deletion through support channels.",
  },
]

export default function TermsPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f6f3eb] text-[#171717]">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <WingMark className="h-10 w-10 text-[#171717]" />
            <div>
              <p className="text-lg font-semibold">EliteScore</p>
              <p className="text-xs uppercase tracking-[0.18em] text-black/55">Legal</p>
            </div>
          </Link>
          <Button variant="outline" className="border-black/20 bg-white/60 hover:bg-white" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back home
            </Link>
          </Button>
        </div>

        <section className="rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">Last updated: February 4, 2026</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">Terms and Privacy Policy</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-black/70 sm:text-base">
            These terms and policies explain how EliteScore works, what is expected from users, and how data is handled.
            By using the app, you agree to this policy framework.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-black/10 bg-[#171717] p-6 text-[#f6f3eb] sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">The EliteScore Oath</p>
          <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
            I commit to honest proof, respectful competition, and consistent effort. I will not fake progress, manipulate rankings, or misuse other members&apos; trust.
          </p>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section id="terms" className="rounded-3xl border border-black/10 bg-white/75 p-6 backdrop-blur sm:p-7">
            <h2 className="text-2xl font-semibold">Terms of Use</h2>
            <div className="mt-5 space-y-4">
              {termsItems.map((item, index) => (
                <article key={item.title} className="rounded-2xl border border-black/10 bg-[#faf7f0] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">Section {index + 1}</p>
                  <p className="mt-1 text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-black/70">{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="privacy" className="rounded-3xl border border-black/10 bg-[#171717] p-6 text-[#f6f3eb] sm:p-7">
            <h2 className="text-2xl font-semibold">Privacy Policy</h2>
            <div className="mt-5 space-y-4">
              {privacyItems.map((item, index) => (
                <article key={item.title} className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Section {index + 1}</p>
                  <p className="mt-1 text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/75">{item.body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-black/10 bg-gradient-to-r from-[#ea580c] to-[#0f766e] p-6 text-[#fff8ef] sm:p-7">
          <h3 className="text-xl font-semibold">Questions about terms or privacy?</h3>
          <p className="mt-2 text-sm text-[#fff8ef]/85">
            Contact support for data access requests, deletion requests, or policy questions.
          </p>
          <Button className="mt-4 bg-[#171717] text-[#f6f3eb] hover:bg-[#2a2a2a]" asChild>
            <Link href="mailto:support@elitescore.app">
              <Mail className="mr-2 h-4 w-4" />
              support@elitescore.app
            </Link>
          </Button>
        </section>
      </div>
    </div>
  )
}

