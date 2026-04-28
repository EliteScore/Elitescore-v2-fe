import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AppChrome } from "@/components/app-chrome"
import { MicrosoftClarity } from "@/components/microsoft-clarity"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://elitescore.com"
const SITE_TITLE = "EliteScore - Gamification Learning Platform for Self-Improvement"
const SITE_DESCRIPTION = "Join EliteScore, a gamification learning platform for career upskilling through student challenges and leaderboards."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: "EliteScore",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark overflow-x-hidden">
      <body className={`font-sans antialiased pb-20 md:pb-0 overflow-x-hidden`}>
        <AppChrome>
          <main>{children}</main>
        </AppChrome>
        <MicrosoftClarity />
        <Analytics />
      </body>
    </html>
  )
}
