"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Mail, 
  X, 
  RefreshCw, 
  Bell, 
  Eye, 
  EyeOff, 
  Check,
  Clock,
  Shield,
  AlertCircle
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface Supporter {
  id: string
  email: string
  name?: string
  status: "pending" | "accepted" | "declined"
  invitedAt: string
}

type NotificationIntensity = "soft" | "medium" | "hard"
type PrivacyLevel = "status" | "status_timestamp" | "status_proof"

interface SupportersPanelProps {
  supporters: Supporter[]
  notificationIntensity: NotificationIntensity
  privacyLevel: PrivacyLevel
  onResendInvite: (supporterId: string) => void
  onRemoveSupporter: (supporterId: string) => void
  onAddSupporter: (email: string) => void
  onUpdateSettings: (intensity: NotificationIntensity, privacy: PrivacyLevel) => void
}

export function SupportersPanel({
  supporters,
  notificationIntensity,
  privacyLevel,
  onResendInvite,
  onRemoveSupporter,
  onAddSupporter,
  onUpdateSettings,
}: SupportersPanelProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [localIntensity, setLocalIntensity] = useState(notificationIntensity)
  const [localPrivacy, setLocalPrivacy] = useState(privacyLevel)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null)
  const [showSaved, setShowSaved] = useState(false)

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

    onAddSupporter(email.trim())
    setEmail("")
  }

  const handleSaveSettings = () => {
    onUpdateSettings(localIntensity, localPrivacy)
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 2000)
  }

  const intensityOptions: { value: NotificationIntensity; label: string; description: string }[] = [
    { value: "soft", label: "Soft", description: "Final outcome only" },
    { value: "medium", label: "Medium", description: "Missed deadlines + final" },
    { value: "hard", label: "Hard", description: "Daily + missed + final" },
  ]

  const privacyOptions: { value: PrivacyLevel; label: string; icon: React.ReactNode }[] = [
    { value: "status", label: "Status only", icon: <Eye className="w-3 h-3" /> },
    { value: "status_timestamp", label: "Status + timestamp", icon: <Clock className="w-3 h-3" /> },
    { value: "status_proof", label: "Status + proof preview", icon: <EyeOff className="w-3 h-3" /> },
  ]

  return (
    <div className="rounded-xl bg-white/[0.04] p-3 sm:p-4 md:p-5">
      {/* Header - compact, single line */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Users className="w-4 h-4 shrink-0 text-[#fb923c]" aria-hidden="true" />
        <h3 className="text-xs sm:text-sm font-bold truncate">Supporters</h3>
        <Badge variant="outline" className="text-[10px] border-[#fb923c]/30 text-[#fb923c] shrink-0">
          {supporters.length}/3
        </Badge>
      </div>

      {/* Supporters List - compact rows */}
      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
        {supporters.length === 0 ? (
          <div className="text-center py-4 sm:py-5 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground mx-auto mb-1.5 opacity-30" aria-hidden="true" />
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-0.5">No supporters yet</p>
            <p className="text-[10px] text-muted-foreground/80">Add friends to hold you accountable</p>
          </div>
        ) : (
          supporters.map((supporter) => (
            <div
              key={supporter.id}
              className="flex items-center justify-between gap-2 py-2.5 px-3 rounded-xl bg-white/[0.04] min-h-[44px] touch-manipulation"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-[#0ea5e9]/20 to-[#fb923c]/20 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-bold">
                    {supporter.name?.charAt(0) || supporter.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs font-medium truncate">{supporter.name || supporter.email}</p>
                  <Badge
                    variant="outline"
                    className={`text-[9px] sm:text-[10px] mt-0.5 shrink-0 ${
                      supporter.status === "accepted"
                        ? "border-green-500/30 text-green-500"
                        : supporter.status === "declined"
                        ? "border-red-500/30 text-red-500"
                        : "border-orange-500/30 text-orange-500"
                    }`}
                  >
                    {supporter.status === "accepted" ? "Accepted" : supporter.status === "declined" ? "Declined" : "Pending"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {supporter.status === "pending" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onResendInvite(supporter.id)}
                    className="h-10 w-10 min-h-[44px] min-w-[44px] p-0 hover:bg-[#0ea5e9]/10 touch-manipulation rounded-lg"
                    aria-label="Resend invite"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#0ea5e9]" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowRemoveConfirm(supporter.id)}
                  className="h-10 w-10 min-h-[44px] min-w-[44px] p-0 hover:bg-red-500/10 touch-manipulation rounded-lg"
                  aria-label="Remove supporter"
                >
                  <X className="w-3.5 h-3.5 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Supporter - full-width input + button row */}
      {supporters.length < 3 && (
        <div className="space-y-1.5 mb-4 sm:mb-5">
          <div className="flex gap-2">
            <div className="relative flex-1 min-w-0">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSupporter()}
                className="pl-9 min-h-[44px] h-11 text-[13px] sm:text-sm bg-white/[0.04] border-white/10 placeholder:text-muted-foreground rounded-xl touch-manipulation"
              />
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleAddSupporter}
              className="min-h-[44px] h-11 px-4 bg-[#fb923c] hover:bg-[#fb923c]/90 text-white text-xs font-medium rounded-xl touch-manipulation shrink-0"
            >
              Invite
            </Button>
          </div>
          {error && <p className="text-[10px] text-red-500 px-0.5">{error}</p>}
        </div>
      )}

      {/* Notification Settings - compact sections */}
      <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-white/5">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
            <Bell className="w-3.5 h-3.5 shrink-0 text-[#0ea5e9]" aria-hidden="true" />
            <span className="text-[11px] sm:text-xs font-medium">Notification Intensity</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {intensityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLocalIntensity(option.value)}
                className={`py-2.5 px-1.5 sm:px-2 rounded-xl text-center transition-all touch-manipulation min-h-[44px] flex flex-col items-center justify-center gap-0.5 ${
                  localIntensity === option.value
                    ? "bg-[#0ea5e9]/10 border border-[#0ea5e9]/30"
                    : "bg-white/[0.04] border border-white/5 active:bg-white/[0.06]"
                }`}
              >
                <span className="text-[10px] font-medium leading-tight">{option.label}</span>
                <span className="text-[9px] text-muted-foreground leading-tight line-clamp-2">{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
            <Shield className="w-3.5 h-3.5 shrink-0 text-[#fb923c]" aria-hidden="true" />
            <span className="text-[11px] sm:text-xs font-medium">Privacy Level</span>
          </div>
          <div className="space-y-1.5">
            {privacyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLocalPrivacy(option.value)}
                className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2 transition-all touch-manipulation min-h-[44px] text-left ${
                  localPrivacy === option.value
                    ? "bg-[#fb923c]/10 border border-[#fb923c]/30"
                    : "bg-white/[0.04] border border-white/5 active:bg-white/[0.06]"
                }`}
              >
                {option.icon}
                <span className="text-[11px] sm:text-xs truncate">{option.label}</span>
                {localPrivacy === option.value && <Check className="w-3.5 h-3.5 text-[#fb923c] ml-auto shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSaveSettings}
          className="w-full min-h-[44px] h-11 text-xs font-medium bg-gradient-to-r from-[#ea580c] to-[#fb923c] hover:opacity-90 text-white border-0 rounded-xl touch-manipulation"
        >
          {showSaved ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Saved
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>

      {/* Remove Confirmation Dialog - mobile-friendly */}
      <Dialog open={!!showRemoveConfirm} onOpenChange={() => setShowRemoveConfirm(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-sm bg-[#0c1525]/95 backdrop-blur-xl border-red-500/30 rounded-2xl p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" aria-hidden="true" />
              Remove Supporter
            </DialogTitle>
            <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
              They will no longer receive updates about your challenge.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRemoveConfirm(null)}
              className="w-full min-h-[44px] text-xs font-medium bg-transparent border-white/10 rounded-xl touch-manipulation"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (showRemoveConfirm) {
                  onRemoveSupporter(showRemoveConfirm)
                  setShowRemoveConfirm(null)
                }
              }}
              className="w-full min-h-[44px] text-xs font-medium bg-red-500 hover:bg-red-600 text-white border-0 rounded-xl touch-manipulation"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
