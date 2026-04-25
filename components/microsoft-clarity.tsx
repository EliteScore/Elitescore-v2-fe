"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Clarity from "@microsoft/clarity"

const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
let hasInitialized = false

export function MicrosoftClarity() {
  const pathname = usePathname()

  useEffect(() => {
    if (!projectId?.trim() || hasInitialized) return
    hasInitialized = true
    Clarity.init(projectId)
  }, [])

  useEffect(() => {
    if (!projectId?.trim() || !pathname) return
    Clarity.setTag("path", pathname)
  }, [pathname])

  return null
}
