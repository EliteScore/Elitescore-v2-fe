import { cn } from "@/lib/utils"

type WingMarkProps = {
  className?: string
}

export function WingMark({ className }: WingMarkProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn("h-10 w-10", className)}>
      <path
        d="M12 44c13-3 23-13 30-28 5 7 8 15 10 24-8-5-16-5-24 0 6-7 10-14 12-21-6 10-15 18-28 25z"
        fill="currentColor"
      />
      <path d="M14 46c12-1 23 1 33 6H14z" fill="currentColor" opacity="0.85" />
    </svg>
  )
}
