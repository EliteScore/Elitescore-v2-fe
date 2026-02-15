"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Users, Mail, X, Clock, Shield, ChevronDown, ChevronUp } from "lucide-react"

interface Supporter {
  email: string
  status: "pending" | "accepted"
}

interface LockInModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  challengeName: string
  onLockIn: (supporters: Supporter[]) => void
  onSkip: () => void
}

export function LockInModal({ open, onOpenChange, challengeName, onLockIn, onSkip }: LockInModalProps) {
  const [supporters, setSupporters] = useState<Supporter[]>([])
  const [email, setEmail] = useState("")
  const [showSupporters, setShowSupporters] = useState(false)
  const [error, setError] = useState("")

  const handleAddSupporter = () => {
    setError("")
    
    if (!email.trim()) {
      setError("Please enter an email address")
      return
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }
    
    if (supporters.length >= 3) {
      setError("Maximum 3 supporters allowed")
      return
    }
    
    if (supporters.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      setError("This email is already added")
      return
    }

    setSupporters([...supporters, { email: email.trim(), status: "pending" }])
    setEmail("")
  }

  const handleRemoveSupporter = (emailToRemove: string) => {
    setSupporters(supporters.filter(s => s.email !== emailToRemove))
  }

  const handleLockIn = () => {
    onLockIn(supporters)
    onOpenChange(false)
  }

  const handleSkip = () => {
    onSkip()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md bg-[#0c1525]/95 backdrop-blur-xl border-[#0ea5e9]/30 rounded-2xl p-4 sm:p-6 max-h-[90dvh] overflow-y-auto overscroll-contain">
        <DialogHeader className="space-y-1 sm:space-y-2">
          <DialogTitle className="text-base sm:text-xl font-bold leading-tight">
            Lock in your challenge
          </DialogTitle>
          <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
            You&apos;re about to start <span className="text-[#0ea5e9] font-medium">{challengeName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
          {/* Supporters toggle - clear tap target */}
          <div className="space-y-2 sm:space-y-3">
            <button
              type="button"
              onClick={() => setShowSupporters(!showSupporters)}
              className="w-full flex items-center justify-between gap-2 py-3 px-3 rounded-xl bg-[#fb923c]/10 border border-[#fb923c]/20 active:border-[#fb923c]/40 transition-all touch-manipulation min-h-[44px] text-left"
              aria-expanded={showSupporters}
              aria-controls="supporters-content"
              id="supporters-toggle"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Users className="w-4 h-4 shrink-0 text-[#fb923c]" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium truncate">Add Supporters (optional)</span>
              </div>
              {showSupporters ? (
                <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              )}
            </button>

            {showSupporters && (
              <div id="supporters-content" role="region" aria-labelledby="supporters-toggle" className="space-y-3 pl-0">
                <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
                  Invite 1–3 friends to hold you accountable. They&apos;ll get notifications on your progress.
                </p>

                {/* Email row - full-width on mobile */}
                <div className="flex gap-2">
                  <div className="relative flex-1 min-w-0">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                    <Input
                      type="email"
                      placeholder="friend@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSupporter()}
                      className="pl-9 min-h-[44px] h-11 text-[13px] sm:text-sm bg-white/[0.04] border-white/10 rounded-xl touch-manipulation placeholder:text-muted-foreground"
                      disabled={supporters.length >= 3}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddSupporter}
                    disabled={supporters.length >= 3}
                    className="min-h-[44px] h-11 px-4 bg-[#fb923c] hover:bg-[#fb923c]/90 text-white text-xs font-medium rounded-xl touch-manipulation shrink-0"
                  >
                    Invite
                  </Button>
                </div>

                {error && <p className="text-[10px] text-red-500">{error}</p>}

                {/* Invited list - wrap badges, larger remove tap */}
                {supporters.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {supporters.map((supporter) => (
                      <Badge
                        key={supporter.email}
                        variant="outline"
                        className={`text-[10px] sm:text-xs py-1.5 px-2.5 flex items-center gap-1.5 max-w-full ${
                          supporter.status === "accepted"
                            ? "border-green-500/30 bg-green-500/10 text-green-500"
                            : "border-orange-500/30 bg-orange-500/10 text-orange-500"
                        }`}
                      >
                        <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
                        <span className="min-w-0 truncate max-w-[140px] sm:max-w-[160px]">{supporter.email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSupporter(supporter.email)}
                          className="ml-0.5 p-1 -m-1 rounded min-h-[28px] min-w-[28px] flex items-center justify-center active:opacity-70 touch-manipulation"
                          aria-label={`Remove ${supporter.email}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {supporters.length === 0 && (
                  <div className="text-center py-3 sm:py-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground mx-auto mb-1.5 opacity-50" aria-hidden="true" />
                    <p className="text-[10px] text-muted-foreground">No supporters added yet</p>
                  </div>
                )}

                {/* Privacy - compact */}
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.04]">
                  <Shield className="w-3.5 h-3.5 text-[#0ea5e9] mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
                    Supporters see status only unless you allow more. You can change this later.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-1 sm:pt-2 border-t border-white/5">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            className="w-full min-h-[44px] h-11 text-xs font-medium bg-transparent border-white/10 rounded-xl touch-manipulation active:bg-white/[0.06]"
          >
            Skip for now
          </Button>
          <Button
            type="button"
            onClick={handleLockIn}
            className="w-full min-h-[44px] h-11 text-xs font-medium bg-gradient-to-r from-[#ea580c] to-[#fb923c] hover:opacity-90 text-white border-0 rounded-xl touch-manipulation"
          >
            Start Challenge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
