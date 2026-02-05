import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthGate } from "@/components/auth-gate"
import { AppShell } from "@/components/app-shell"
import "./globals.css"

const _spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
})
const _jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "EliteScore - Level Up In Real Life",
  description:
    "The competitive social network where students transform learning, habits, and skills into quantifiable achievements. Join thousands leveling up across Europe.",
  generator: "v0.app",
  keywords: ["gamification", "self-improvement", "learning platform", "student challenges", "leaderboard"],
  icons: {
    icon: "/wingmark.svg",
    apple: "/wingmark.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_spaceGrotesk.variable} ${_jetBrainsMono.variable} font-sans antialiased pb-20 md:pb-0`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthGate>
            <AppShell>{children}</AppShell>
          </AuthGate>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
