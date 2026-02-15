import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { BottomNav } from "@/components/bottom-nav"
import { TopHeader } from "@/components/top-header"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EliteScore - Level Up In Real Life",
  description:
    "The competitive social network where students transform learning, habits, and skills into quantifiable achievements. Join thousands leveling up across Europe.",
  generator: "v0.app",
  keywords: ["gamification", "self-improvement", "learning platform", "student challenges", "leaderboard"],
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
    <html lang="en" className="dark">
      <body className={`font-sans antialiased pb-20 md:pb-0`}>
        <TopHeader />
        <main>{children}</main>
        <BottomNav />
        <Analytics />
      </body>
    </html>
  )
}
