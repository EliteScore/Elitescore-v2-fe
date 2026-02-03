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
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-[#0ea5e9]/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Lock in your challenge</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            You're about to start <span className="text-[#0ea5e9] font-medium">{challengeName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Supporters Section */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowSupporters(!showSupporters)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0f766e]/5 border border-[#0f766e]/20 hover:border-[#0f766e]/40 transition-all"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0f766e]" />
                <span className="text-sm font-medium">Add Supporters (optional)</span>
              </div>
              {showSupporters ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {showSupporters && (
              <div className="space-y-3 pl-1">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Invite 1-3 friends to hold you accountable. They'll receive notifications on your progress.
                </p>

                {/* Email Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="friend@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSupporter()}
                      className="pl-9 h-9 text-xs bg-background/50 border-border/50"
                      disabled={supporters.length >= 3}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddSupporter}
                    disabled={supporters.length >= 3}
                    className="h-9 px-4 bg-[#0f766e] hover:bg-[#0f766e]/90 text-white text-xs"
                  >
                    Invite
                  </Button>
                </div>

                {error && <p className="text-[10px] text-foreground">{error}</p>}

                {/* Invited List */}
                {supporters.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {supporters.map((supporter) => (
                      <Badge
                        key={supporter.email}
                        variant="outline"
                        className={`text-xs py-1 px-2 flex items-center gap-1.5 ${
                          supporter.status === "accepted"
                            ? "border-green-500/30 bg-green-500/10 text-foreground"
                            : "border-orange-500/30 bg-orange-500/10 text-foreground"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span className="max-w-[120px] truncate">{supporter.email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSupporter(supporter.email)}
                          className="ml-1 hover:opacity-70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {supporters.length === 0 && (
                  <div className="text-center py-4 border border-dashed border-border/50 rounded-lg">
                    <Users className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-[10px] text-muted-foreground">No supporters added yet</p>
                  </div>
                )}

                {/* Privacy Notice */}
                <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                  <Shield className="w-3.5 h-3.5 text-[#0ea5e9] mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Supporters see status only (not proof) unless you allow. You can change this later.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            className="w-full sm:w-auto text-xs h-9 bg-transparent border-border/50 hover:bg-muted/50"
          >
            Skip for now
          </Button>
          <Button
            type="button"
            onClick={handleLockIn}
            className="w-full sm:w-auto text-xs h-9 bg-gradient-to-r from-[#0ea5e9] to-[#0f766e] hover:opacity-90 text-white border-0"
          >
            Start Challenge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

