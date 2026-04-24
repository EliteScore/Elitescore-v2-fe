import type { ChallengeScoring } from "@/lib/challengeScoring"
import { formatElitePoints, hasChallengeScoringFields } from "@/lib/challengeScoring"

const row = (label: string, value: string) => (
  <div
    key={label}
    className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 shadow-sm sm:rounded-2xl sm:p-3"
  >
    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
    <p className="mt-0.5 text-sm font-bold text-slate-800">{value}</p>
  </div>
)

type Props = {
  scoring: ChallengeScoring | null | undefined
  /** One line, small type — for cards */
  variant: "inline" | "grid"
  className?: string
}

/**
 * Renders per-challenge EliteScore rules. If no fields are set, returns null.
 */
export function ChallengeScoringDisplay({ scoring, variant, className = "" }: Props) {
  if (!hasChallengeScoringFields(scoring)) return null

  if (variant === "inline") {
    const parts: string[] = []
    if (typeof scoring!.dailyRewardEliteScore === "number")
      parts.push(`Daily ${formatElitePoints(scoring!.dailyRewardEliteScore)}`)
    if (typeof scoring!.missedDayPenalty === "number")
      parts.push(`Missed day ${formatElitePoints(scoring!.missedDayPenalty)}`)
    if (typeof scoring!.failPenalty === "number")
      parts.push(`Fail ${formatElitePoints(scoring!.failPenalty)}`)
    if (typeof scoring!.quitPenalty === "number")
      parts.push(`Quit ${formatElitePoints(scoring!.quitPenalty)}`)
    if (typeof scoring!.completionBonus === "number")
      parts.push(`Complete ${formatElitePoints(scoring!.completionBonus)}`)
    if (typeof scoring!.maxMissedDays === "number")
      parts.push(`Max missed ${scoring!.maxMissedDays}`)
    if (parts.length === 0) return null
    return (
      <p
        className={`text-[10px] leading-snug text-slate-600 ${className}`.trim()}
        role="group"
        aria-label="EliteScore rules for this challenge"
      >
        {parts.join(" · ")}
      </p>
    )
  }

  const items: { label: string; value: string }[] = []
  if (typeof scoring?.dailyRewardEliteScore === "number")
    items.push({ label: "Daily reward", value: formatElitePoints(scoring.dailyRewardEliteScore) + " pts" })
  if (typeof scoring?.missedDayPenalty === "number")
    items.push({ label: "Missed day", value: formatElitePoints(scoring.missedDayPenalty) + " pts" })
  if (typeof scoring?.failPenalty === "number")
    items.push({ label: "Fail", value: formatElitePoints(scoring.failPenalty) + " pts" })
  if (typeof scoring?.quitPenalty === "number")
    items.push({ label: "Quit", value: formatElitePoints(scoring.quitPenalty) + " pts" })
  if (typeof scoring?.completionBonus === "number")
    items.push({ label: "Completion bonus", value: formatElitePoints(scoring.completionBonus) + " pts" })
  if (typeof scoring?.maxMissedDays === "number")
    items.push({ label: "Max missed days", value: String(scoring.maxMissedDays) })

  if (items.length === 0) return null

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item) => row(item.label, item.value))}
      </div>
    </div>
  )
}
