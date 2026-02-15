"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

// EliteScore logo (public/gemini logo.png)
const LOGO_PATH = "/gemini%20logo.png"

export function TopHeader() {
  const pathname = usePathname()

  if (pathname === "/login" || pathname === "/signup") {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#0c1525]/95 via-[#0a0a12]/95 to-[#151008]/95 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex h-14 md:h-16 items-center">
          <Link
            href="/home"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            aria-label="EliteScore Home"
          >
            <Image
              src={LOGO_PATH}
              alt="EliteScore"
              width={140}
              height={44}
              className="h-8 w-auto md:h-9"
              priority
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
