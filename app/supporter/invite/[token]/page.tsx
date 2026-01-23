"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Users, Bell, Eye, Shield, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

// Mock data - in production this would come from the API based on token
const mockInviteData = {
  inviterName: "Alex Chen",
  challengeName: "30-Day Python Mastery",
  challengeDuration: 30,
  isValid: true,
  isExpired: false,
  isAlreadyAccepted: false,
}

export default function SupporterInvitePage() {
  const router = useRouter()
  const [consent, setConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"pending" | "accepted" | "declined">("pending")

  const { inviterName, challengeName, challengeDuration, isValid, isExpired, isAlreadyAccepted } = mockInviteData

  const handleAccept = async () => {
    if (!consent) return
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus("accepted")
    setIsSubmitting(false)
  }

  const handleDecline = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setStatus("declined")
    setIsSubmitting(false)
  }

  // Error state: Invalid or expired invite
  if (!isValid || isExpired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="glass-card rounded-2xl border border-red-500/20 bg-card/50 backdrop-blur-sm p-8">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold mb-2">
              {isExpired ? "Invite Expired" : "Invalid Invite"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {isExpired
                ? "This invite link has expired. Ask your friend to send a new one."
                : "This invite link is invalid or has already been used."}
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-xs h-9"
            >
              Go to EliteScore
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Already accepted state
  if (isAlreadyAccepted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="glass-card rounded-2xl border border-green-500/20 bg-card/50 backdrop-blur-sm p-8">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-xl font-bold mb-2">Already Accepted</h1>
            <p className="text-sm text-muted-foreground mb-6">
              You've already accepted this invite. You can view {inviterName}'s progress anytime.
            </p>
            <Button
              onClick={() => router.push("/supporter/view/mock-id")}
              className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-xs h-9"
            >
              View Progress
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Accepted state
  if (status === "accepted") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="glass-card rounded-2xl border border-green-500/20 bg-card/50 backdrop-blur-sm p-8">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-xl font-bold mb-2">You're In!</h1>
            <p className="text-sm text-muted-foreground mb-6">
              You're now supporting {inviterName} on their challenge. You'll receive email updates on their progress.
            </p>
            <Button
              onClick={() => router.push("/supporter/view/mock-id")}
              className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-xs h-9"
            >
              View Their Progress
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Declined state
  if (status === "declined") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="glass-card rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-xl font-bold mb-2">Invite Declined</h1>
            <p className="text-sm text-muted-foreground mb-6">
              You've declined to be a supporter. {inviterName} won't be notified of your decision.
            </p>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="text-xs h-9 bg-transparent"
            >
              Go to EliteScore
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Main invite page
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="EliteScore"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </div>

        <div className="glass-card rounded-2xl border border-[#a855f7]/20 bg-card/50 backdrop-blur-sm p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2bbcff]/20 to-[#a855f7]/20 flex items-center justify-center mx-auto mb-3">
              <Users className="w-7 h-7 text-[#a855f7]" />
            </div>
            <h1 className="text-xl font-bold mb-2">
              <span className="text-[#2bbcff]">{inviterName}</span> invited you to be a Supporter
            </h1>
            <p className="text-xs text-muted-foreground">
              Help hold them accountable on their self-improvement journey
            </p>
          </div>

          {/* Challenge Info */}
          <div className="bg-[#2bbcff]/5 rounded-xl p-4 border border-[#2bbcff]/20 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Challenge</span>
              <Badge variant="outline" className="text-[10px] border-[#a855f7]/30 text-[#a855f7]">
                {challengeDuration} days
              </Badge>
            </div>
            <h2 className="text-sm font-bold">{challengeName}</h2>
          </div>

          {/* What You'll Receive */}
          <div className="mb-6">
            <h3 className="text-xs font-bold mb-3">What you'll receive:</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                <Bell className="w-4 h-4 text-[#2bbcff] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium">Progress Updates</p>
                  <p className="text-[10px] text-muted-foreground">
                    Email notifications when they complete or miss milestones
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                <Eye className="w-4 h-4 text-[#a855f7] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium">Status Access</p>
                  <p className="text-[10px] text-muted-foreground">
                    View their challenge status and streak progress
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium">No Sign-Up Required</p>
                  <p className="text-[10px] text-muted-foreground">
                    Support them without creating an account
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border/30 mb-6">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
              className="mt-0.5"
            />
            <label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
              I consent to receive email notifications about {inviterName}'s challenge progress. I can unsubscribe at any time.
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleAccept}
              disabled={!consent || isSubmitting}
              className="w-full h-10 text-xs bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 font-medium"
            >
              {isSubmitting ? "Processing..." : "Accept Invite"}
            </Button>
            <Button
              onClick={handleDecline}
              disabled={isSubmitting}
              variant="ghost"
              className="w-full h-9 text-xs text-muted-foreground hover:text-foreground"
            >
              Decline
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground mt-6">
          Powered by EliteScore - Turn self-improvement into a competitive sport
        </p>
      </div>
    </div>
  )
}
