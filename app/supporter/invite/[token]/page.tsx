"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Users, Bell, Eye, Shield, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type InviteStatus = "pending" | "accepted" | "declined"

type InviteData = {
  inviterName: string
  challengeName: string
  challengeDuration: number
  isValid: boolean
  isExpired: boolean
  isAlreadyAccepted: boolean
}

// Mock data - in production this would come from the API based on token
const mockInviteData: InviteData = {
  inviterName: "Alex Chen",
  challengeName: "30-Day Python Mastery",
  challengeDuration: 30,
  isValid: true,
  isExpired: false,
  isAlreadyAccepted: false,
}

const getInviteStateContent = (
  type: "invalid" | "expired" | "alreadyAccepted" | "accepted" | "declined",
  inviterName: string,
  router: ReturnType<typeof useRouter>
) => {
  const baseCardClass =
    "glass-card rounded-2xl border bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-5 sm:p-6 md:p-8 shadow-xl relative overflow-hidden w-full max-w-md text-center"
  const blobClass =
    "absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 blur-[80px] rounded-full -z-10"

  if (type === "invalid" || type === "expired") {
    return (
      <div className={cn(baseCardClass, "border-red-500/20")}>
        <div className={blobClass + " bg-red-500/20"} aria-hidden="true" />
        <div
          className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4"
          aria-hidden="true"
        >
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">
          {type === "expired" ? "Expired" : "Invalid"}
        </p>
        <h1 className="text-xl font-bold text-foreground mb-2">
          {type === "expired" ? "Invite Expired" : "Invalid Invite"}
        </h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {type === "expired"
            ? "This invite link has expired. Ask your friend to send a new one."
            : "This invite link is invalid or has already been used."}
        </p>
        <Button
          onClick={() => router.push("/")}
          className="w-full min-h-[48px] sm:h-10 bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-xs sm:text-[10px] font-bold uppercase tracking-wider touch-manipulation"
          aria-label="Go to EliteScore home"
        >
          Go to EliteScore
        </Button>
      </div>
    )
  }

  if (type === "alreadyAccepted" || type === "accepted") {
    return (
      <div className={cn(baseCardClass, "border-green-500/20")}>
        <div className={blobClass + " bg-green-500/15"} aria-hidden="true" />
        <div
          className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4"
          aria-hidden="true"
        >
          <CheckCircle2 className="w-7 h-7 text-green-500" />
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">
          {type === "alreadyAccepted" ? "Already linked" : "You're in"}
        </p>
        <h1 className="text-xl font-bold text-foreground mb-2">
          {type === "alreadyAccepted" ? "Already Accepted" : "You're In!"}
        </h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {type === "alreadyAccepted"
            ? `You've already accepted this invite. You can view ${inviterName}'s progress anytime.`
            : `You're now supporting ${inviterName} on their challenge. You'll receive email updates on their progress.`}
        </p>
        <Button
          onClick={() => router.push("/supporter/view/mock-id")}
          className="w-full min-h-[48px] sm:h-10 bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-xs sm:text-[10px] font-bold uppercase tracking-wider touch-manipulation"
          aria-label={type === "alreadyAccepted" ? "View progress" : "View their progress"}
        >
          {type === "alreadyAccepted" ? "View Progress" : "View Their Progress"}
        </Button>
      </div>
    )
  }

  if (type === "declined") {
    return (
      <div className={cn(baseCardClass, "border-white/10")}>
        <div className={blobClass + " bg-muted/20"} aria-hidden="true" />
        <div
          className="w-14 h-14 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-4"
          aria-hidden="true"
        >
          <XCircle className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">
          Declined
        </p>
        <h1 className="text-xl font-bold text-foreground mb-2">Invite Declined</h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          You've declined to be a supporter. {inviterName} won't be notified of your decision.
        </p>
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="w-full min-h-[48px] sm:h-10 text-xs sm:text-[10px] font-bold uppercase tracking-wider bg-transparent border-white/20 touch-manipulation"
          aria-label="Go to EliteScore home"
        >
          Go to EliteScore
        </Button>
      </div>
    )
  }

  return null
}

export default function SupporterInvitePage() {
  const router = useRouter()
  const [consent, setConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<InviteStatus>("pending")

  const { inviterName, challengeName, challengeDuration, isValid, isExpired, isAlreadyAccepted } =
    mockInviteData

  const handleAccept = async () => {
    if (!consent) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus("accepted")
    setIsSubmitting(false)
  }

  const handleDecline = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setStatus("declined")
    setIsSubmitting(false)
  }

  if (!isValid || isExpired) {
    return (
      <div className="min-h-[100dvh] sm:min-h-screen bg-background flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] overflow-x-hidden">
        {getInviteStateContent(isExpired ? "expired" : "invalid", inviterName, router)}
      </div>
    )
  }

  if (isAlreadyAccepted) {
    return (
      <div className="min-h-[100dvh] sm:min-h-screen bg-background flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] overflow-x-hidden">
        {getInviteStateContent("alreadyAccepted", inviterName, router)}
      </div>
    )
  }

  if (status === "accepted") {
    return (
      <div className="min-h-[100dvh] sm:min-h-screen bg-background flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] overflow-x-hidden">
        {getInviteStateContent("accepted", inviterName, router)}
      </div>
    )
  }

  if (status === "declined") {
    return (
      <div className="min-h-[100dvh] sm:min-h-screen bg-background flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] overflow-x-hidden">
        {getInviteStateContent("declined", inviterName, router)}
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] sm:min-h-screen bg-background flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] overflow-x-hidden overflow-y-auto">
      <div className="w-full max-w-md flex flex-col flex-1 py-4">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="EliteScore"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </div>

        <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-5 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-[#2bbcff]/20 to-[#a855f7]/20 blur-[100px] rounded-full -z-10"
            aria-hidden="true"
          />
          <div className="text-center mb-5 sm:mb-6">
            <div
              className="w-12 h-12 rounded-xl bg-[#2bbcff]/10 flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <Users className="w-6 h-6 text-[#2bbcff]" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">
              Supporter invite
            </p>
            <h1 className="text-lg sm:text-xl font-bold mb-2 leading-tight">
              <span className="text-[#2bbcff]">{inviterName}</span> invited you to be a Supporter
            </h1>
            <p className="text-sm sm:text-xs text-muted-foreground leading-relaxed">
              Help hold them accountable on their self-improvement journey
            </p>
          </div>

          <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-[#2bbcff]/5 p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Challenge
              </span>
              <Badge
                variant="outline"
                className="text-[10px] border-[#a855f7]/30 text-[#a855f7] font-bold uppercase tracking-wider"
              >
                {challengeDuration} days
              </Badge>
            </div>
            <h2 className="text-sm font-bold text-foreground">{challengeName}</h2>
          </div>

          <div className="mb-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">
              What you&apos;ll receive
            </p>
            <div className="space-y-3">
              <div className="glass-card rounded-xl border border-white/5 bg-card/30 p-3 flex items-start gap-3">
                <Bell className="w-4 h-4 text-[#2bbcff] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold text-foreground">Progress Updates</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Email notifications when they complete or miss milestones
                  </p>
                </div>
              </div>
              <div className="glass-card rounded-xl border border-white/5 bg-card/30 p-3 flex items-start gap-3">
                <Eye className="w-4 h-4 text-[#a855f7] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold text-foreground">Status Access</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    View their challenge status and streak progress
                  </p>
                </div>
              </div>
              <div className="glass-card rounded-xl border border-white/5 bg-card/30 p-3 flex items-start gap-3">
                <Shield className="w-4 h-4 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold text-foreground">No Sign-Up Required</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Support them without creating an account
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/5 mb-5 sm:mb-6 min-h-[44px] touch-manipulation">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
              className="mt-0.5 size-5 shrink-0"
              aria-describedby="consent-description"
            />
            <label
              id="consent-description"
              htmlFor="consent"
              className="text-sm sm:text-xs text-muted-foreground leading-relaxed cursor-pointer select-none flex-1"
            >
              I consent to receive email notifications about {inviterName}&apos;s challenge progress.
              I can unsubscribe at any time.
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleAccept}
              disabled={!consent || isSubmitting}
              className="w-full min-h-[48px] sm:h-10 text-xs sm:text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 touch-manipulation"
              aria-label={isSubmitting ? "Processing" : "Accept invite"}
            >
              {isSubmitting ? "Processing..." : "Accept Invite"}
            </Button>
            <Button
              onClick={handleDecline}
              disabled={isSubmitting}
              variant="ghost"
              className="w-full min-h-[44px] sm:h-9 text-xs sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground touch-manipulation"
              aria-label="Decline invite"
            >
              Decline
            </Button>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-4 sm:mt-6 uppercase tracking-wider shrink-0">
          Powered by EliteScore
        </p>
      </div>
    </div>
  )
}
