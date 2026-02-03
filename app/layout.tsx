import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { TopBar } from "@/components/top-bar"
import { AiHelper } from "@/components/ai-helper"
import { SidebarNav } from "@/components/sidebar-nav"
import { AppTour } from "@/components/app-tour"
import { AuthGate } from "@/components/auth-gate"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
  title: "EliteScore - Level Up In Real Life",
  description:
    "The competitive social network where students transform learning, habits, and skills into quantifiable achievements. Join thousands leveling up across Europe.",
  generator: "v0.app",
  keywords: ["gamification", "self-improvement", "learning platform", "student challenges", "leaderboard"],
  icons: {
    icon: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_geist.variable} font-sans antialiased pb-20 md:pb-0`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthGate>
            <div className="min-h-screen flex">
              <SidebarNav />
              <div className="flex min-w-0 flex-1 flex-col">
                <TopBar />
                <main className="min-w-0 flex-1" data-tour="content">{children}</main>
              </div>
            </div>
            <AiHelper />
            <AppTour />
          </AuthGate>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
