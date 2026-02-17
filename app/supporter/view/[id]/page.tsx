"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Flame,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Trophy,
  Zap,
  MessageCircle,
  Heart,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type ChallengeStatus = "active" | "missed" | "failed" | "completed"

type ChallengeViewData = {
  userName: string
  userAvatar: string | null
  challengeName: string
  challengeDuration: number
  currentDay: number
  daysLeft: number
  streak: number
  status: ChallengeStatus
  lastCheckIn: string
  showTimestamp: boolean
  showProof: boolean
  proofPreview: string | null
}

// Mock data - in production this would come from the API
const mockChallengeData: ChallengeViewData = {
  userName: "Alex Chen",
  userAvatar: null,
  challengeName: "30-Day Python Mastery",
  challengeDuration: 30,
  currentDay: 12,
  daysLeft: 18,
  streak: 12,
  status: "active",
  lastCheckIn: "2025-01-22 at 9:45 PM",
  showTimestamp: true,
  showProof: false,
  proofPreview: null,
}

type StatusConfigItem = {
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: typeof CheckCircle2
}

const statusConfig: Record<ChallengeStatus, StatusConfigItem> = {
  active: {
    label: "Active",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    icon: CheckCircle2,
  },
  missed: {
    label: "Missed Today",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    icon: AlertCircle,
  },
  failed: {
    label: "Failed",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: XCircle,
  },
  completed: {
    label: "Completed",
    color: "text-[#a855f7]",
    bgColor: "bg-[#a855f7]/10",
    borderColor: "border-[#a855f7]/30",
    icon: Trophy,
  },
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0]?.slice(0, 2) ?? "?").toUpperCase()
}

export default function SupporterViewPage() {
  const [showNudgeModal, setShowNudgeModal] = useState(false)
  const [showHypeModal, setShowHypeModal] = useState(false)
  const [nudgeSent, setNudgeSent] = useState(false)
  const [hypeSent, setHypeSent] = useState(false)

  const {
    userName,
    challengeName,
    challengeDuration,
    currentDay,
    daysLeft,
    streak,
    status,
    lastCheckIn,
    showTimestamp,
  } = mockChallengeData

  const statusInfo = statusConfig[status]
  const StatusIcon = statusInfo.icon
  const progress = (currentDay / challengeDuration) * 100

  const handleOpenNudgeModal = () => setShowNudgeModal(true)
  const handleCloseNudgeModal = () => setShowNudgeModal(false)
  const handleOpenHypeModal = () => setShowHypeModal(true)
  const handleCloseHypeModal = () => setShowHypeModal(false)

  const handleSendNudge = () => {
    setNudgeSent(true)
    setTimeout(() => {
      setShowNudgeModal(false)
      setNudgeSent(false)
    }, 1500)
  }

  const handleSendHype = () => {
    setHypeSent(true)
    setTimeout(() => {
      setShowHypeModal(false)
      setHypeSent(false)
    }, 1500)
  }

  return (
    <div className="min-h-[100dvh] sm:min-h-screen bg-background flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] overflow-x-hidden overflow-y-auto">
      <div className="w-full max-w-md flex flex-col py-4">
        <div className="flex justify-center mb-4 sm:mb-6 shrink-0">
          <Image
            src="/gemini%20logo.png"
            alt="EliteScore"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </div>

        <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md overflow-hidden shadow-xl relative">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-[#2bbcff]/20 to-[#a855f7]/20 blur-[100px] rounded-full -z-10"
            aria-hidden="true"
          />
          <div className="p-5 sm:p-6 md:p-8 border-b border-white/10">
            <div className="flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2bbcff] to-[#a855f7] p-1 mb-4"
                aria-hidden="true"
              >
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-xl font-bold bg-gradient-to-br from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                  {getInitials(userName)}
                </div>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
                Supporter view
              </p>
              <h1 className="text-lg font-bold text-foreground mb-1">{userName}</h1>
              <p className="text-xs text-muted-foreground">is working on</p>
              <p className="text-sm font-bold text-[#2bbcff] mt-1">{challengeName}</p>
            </div>
          </div>

          <div className="p-4 border-b border-white/10">
            <div
              className={cn(
                "flex items-center justify-center gap-2 p-3 rounded-xl border",
                statusInfo.bgColor,
                statusInfo.borderColor
              )}
            >
              <StatusIcon className={cn("w-5 h-5", statusInfo.color)} aria-hidden="true" />
              <span className={cn("text-sm font-bold uppercase tracking-wider", statusInfo.color)}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
            <div>
              <div className="flex items-center justify-between text-[10px] mb-2">
                <span className="font-bold text-muted-foreground uppercase tracking-wider">
                  Progress
                </span>
                <span className="font-bold text-foreground">
                  Day {currentDay} of {challengeDuration}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={currentDay}
                  aria-valuemin={0}
                  aria-valuemax={challengeDuration}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 text-center">
                <Flame className="w-5 h-5 text-orange-500 mx-auto mb-2" aria-hidden="true" />
                <div className="text-xl font-bold text-foreground">{streak}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Day Streak
                </div>
              </div>
              <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-[#2bbcff]/5 p-4 text-center">
                <Calendar className="w-5 h-5 text-[#2bbcff] mx-auto mb-2" aria-hidden="true" />
                <div className="text-xl font-bold text-foreground">{daysLeft}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Days Left
                </div>
              </div>
            </div>

            {showTimestamp && (
              <div className="glass-card rounded-xl border border-white/5 bg-card/30 p-3 flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Last check-in
                  </p>
                  <p className="text-xs font-medium text-foreground">{lastCheckIn}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleOpenNudgeModal}
                variant="outline"
                className="flex-1 min-h-[48px] sm:h-10 text-xs sm:text-[10px] font-bold uppercase tracking-wider bg-transparent border-orange-500/30 text-orange-500 hover:bg-orange-500/10 touch-manipulation"
                aria-label="Send nudge to remind them"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                Send Nudge
              </Button>
              <Button
                onClick={handleOpenHypeModal}
                className="flex-1 min-h-[48px] sm:h-10 text-xs sm:text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 touch-manipulation"
                aria-label="Send hype to encourage them"
              >
                <Heart className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                Send Hype
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-4 sm:mt-6 uppercase tracking-wider shrink-0">
          You&apos;re supporting {userName} on EliteScore
        </p>
      </div>

      <Dialog open={showNudgeModal} onOpenChange={(open) => !open && handleCloseNudgeModal()}>
        <DialogContent
          className="w-[calc(100%-2rem)] max-w-sm max-h-[85dvh] overflow-y-auto bg-card/95 backdrop-blur-xl border border-orange-500/20 rounded-2xl mx-4 sm:mx-auto"
          aria-describedby="nudge-description"
        >
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" aria-hidden="true" />
              Send a Nudge
            </DialogTitle>
            <DialogDescription id="nudge-description" className="text-xs text-muted-foreground">
              Give {userName} a friendly reminder to stay on track with their challenge.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="glass-card rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
              <p className="text-xs text-center leading-relaxed">
                <MessageCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" aria-hidden="true" />
                {userName} will receive a notification that you&apos;re checking in on their progress.
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseNudgeModal}
              className="w-full min-h-[44px] sm:h-9 text-xs sm:text-[10px] font-bold uppercase tracking-wider bg-transparent touch-manipulation"
              disabled={nudgeSent}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSendNudge}
              disabled={nudgeSent}
              className="w-full min-h-[48px] sm:h-9 text-xs sm:text-[10px] font-bold uppercase tracking-wider bg-orange-500 hover:bg-orange-600 text-white border-0 touch-manipulation"
              aria-label={nudgeSent ? "Nudge sent" : "Send nudge"}
            >
              {nudgeSent ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" aria-hidden="true" />
                  Sent!
                </>
              ) : (
                "Send Nudge"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showHypeModal} onOpenChange={(open) => !open && handleCloseHypeModal()}>
        <DialogContent
          className="w-[calc(100%-2rem)] max-w-sm max-h-[85dvh] overflow-y-auto bg-card/95 backdrop-blur-xl border border-[#a855f7]/20 rounded-2xl mx-4 sm:mx-auto"
          aria-describedby="hype-description"
        >
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#a855f7]" aria-hidden="true" />
              Send Hype
            </DialogTitle>
            <DialogDescription id="hype-description" className="text-xs text-muted-foreground">
              Cheer {userName} on and let them know you believe in them!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="glass-card rounded-xl border border-[#a855f7]/20 bg-[#a855f7]/5 p-4">
              <p className="text-xs text-center leading-relaxed">
                <Heart className="w-8 h-8 text-[#a855f7] mx-auto mb-2" aria-hidden="true" />
                {userName} will receive an encouraging notification from you.
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseHypeModal}
              className="w-full min-h-[44px] sm:h-9 text-xs sm:text-[10px] font-bold uppercase tracking-wider bg-transparent touch-manipulation"
              disabled={hypeSent}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSendHype}
              disabled={hypeSent}
              className="w-full min-h-[48px] sm:h-9 text-xs sm:text-[10px] font-bold uppercase tracking-wider bg-[#a855f7] hover:bg-[#a855f7]/90 text-white border-0 touch-manipulation"
              aria-label={hypeSent ? "Hype sent" : "Send hype"}
            >
              {hypeSent ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" aria-hidden="true" />
                  Sent!
                </>
              ) : (
                "Send Hype"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}