ï»¿"use client"

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
    <div className="glass-card rounded-xl border border-[#7c3aed]/20 bg-card/50 backdrop-blur-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-[#7c3aed]" />
        <h3 className="text-sm font-bold">Supporters</h3>
        <Badge variant="outline" className="text-[10px] border-[#7c3aed]/30 text-[#7c3aed]">
          {supporters.length}/3
        </Badge>
      </div>

      {/* Supporters List */}
      <div className="space-y-2 mb-4">
        {supporters.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-border/50 rounded-lg">
            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-xs text-muted-foreground mb-1">No supporters yet</p>
            <p className="text-[10px] text-muted-foreground">Add friends to hold you accountable</p>
          </div>
        ) : (
          supporters.map((supporter) => (
            <div
              key={supporter.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563eb]/20 to-[#7c3aed]/20 flex items-center justify-center">
                  <span className="text-xs font-bold">
                    {supporter.name?.charAt(0) || supporter.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium">{supporter.name || supporter.email}</p>
                  <Badge
                    variant="outline"
                    className={`text-[10px] mt-0.5 ${
                      supporter.status === "accepted"
                        ? "border-green-500/30 text-foreground"
                        : supporter.status === "declined"
                        ? "border-red-500/30 text-foreground"
                        : "border-orange-500/30 text-foreground"
                    }`}
                  >
                    {supporter.status === "accepted" ? "Accepted" : supporter.status === "declined" ? "Declined" : "Pending"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {supporter.status === "pending" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onResendInvite(supporter.id)}
                    className="h-7 w-7 p-0 hover:bg-[#2563eb]/10"
                  >
                    <RefreshCw className="w-3 h-3 text-[#2563eb]" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowRemoveConfirm(supporter.id)}
                  className="h-7 w-7 p-0 hover:bg-red-500/10"
                >
                  <X className="w-3 h-3 text-foreground" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Supporter */}
      {supporters.length < 3 && (
        <div className="space-y-2 mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Add supporter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSupporter()}
                className="pl-9 h-8 text-xs bg-background/50 border-border/50"
              />
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleAddSupporter}
              className="h-8 px-3 bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-white text-xs"
            >
              Invite
            </Button>
          </div>
          {error && <p className="text-[10px] text-foreground">{error}</p>}
        </div>
      )}

      {/* Notification Settings */}
      <div className="space-y-4 pt-4 border-t border-border/30">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-3.5 h-3.5 text-[#2563eb]" />
            <span className="text-xs font-medium">Notification Intensity</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {intensityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLocalIntensity(option.value)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  localIntensity === option.value
                    ? "border-[#2563eb]/50 bg-[#2563eb]/10"
                    : "border-border/30 hover:border-border/50"
                }`}
              >
                <span className="text-[10px] font-medium block">{option.label}</span>
                <span className="text-[9px] text-muted-foreground">{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-3.5 h-3.5 text-[#7c3aed]" />
            <span className="text-xs font-medium">Privacy Level</span>
          </div>
          <div className="space-y-2">
            {privacyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLocalPrivacy(option.value)}
                className={`w-full p-2.5 rounded-lg border flex items-center gap-2 transition-all ${
                  localPrivacy === option.value
                    ? "border-[#7c3aed]/50 bg-[#7c3aed]/10"
                    : "border-border/30 hover:border-border/50"
                }`}
              >
                {option.icon}
                <span className="text-xs">{option.label}</span>
                {localPrivacy === option.value && <Check className="w-3 h-3 text-[#7c3aed] ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSaveSettings}
          className="w-full h-8 text-xs bg-gradient-to-r from-[#2563eb] to-[#7c3aed] hover:opacity-90 text-white border-0"
        >
          {showSaved ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Saved
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>

      {/* Remove Confirmation Dialog */}
      <Dialog open={!!showRemoveConfirm} onOpenChange={() => setShowRemoveConfirm(null)}>
        <DialogContent className="sm:max-w-sm bg-card/95 backdrop-blur-xl border-red-500/30">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-foreground" />
              Remove Supporter
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to remove this supporter? They will no longer receive updates about your challenge.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRemoveConfirm(null)}
              className="w-full sm:w-auto text-xs h-8 bg-transparent"
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
              className="w-full sm:w-auto text-xs h-8 bg-red-500 hover:bg-red-600 text-white border-0"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

