import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"

export const LEGAL_LAST_UPDATED = "22 April 2026"

type Props = {
  title: string
  lastUpdated?: string
  /** e.g. "Beta / Pre-registration" */
  version?: string
  children: ReactNode
}

export function LegalPageLayout({ title, lastUpdated = LEGAL_LAST_UPDATED, version, children }: Props) {
  return (
    <div className="min-h-[100dvh] w-full bg-[#f5f5f6] font-sans text-slate-800 antialiased">
      <div className="mx-auto max-w-3xl px-4 py-8 pb-24 pt-[max(1.5rem,env(safe-area-inset-top))] md:px-6 md:py-12">
        <Link
          href="/landing"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back to EliteScore
        </Link>
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: {lastUpdated}</p>
          {version ? (
            <p className="mt-1 text-sm text-slate-600">
              Version: <span className="font-medium text-slate-700">{version}</span>
            </p>
          ) : null}
        </header>
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-700 md:text-[15px] md:leading-7 [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:first:mt-0 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-800 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_a]:font-medium [&_a]:text-pink-600 [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
    </div>
  )
}
