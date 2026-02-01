"use client"

import { MorphPanel } from "@/components/ui/ai-input"

export function AiHelper() {
  return (
    <div className="fixed right-3 bottom-3 z-50 flex flex-col items-end gap-2 pb-[env(safe-area-inset-bottom)]" data-tour="ask-elite">
      <MorphPanel />
    </div>
  )
}
