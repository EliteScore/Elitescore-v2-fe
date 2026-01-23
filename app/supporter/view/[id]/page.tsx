"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Heart
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

// Mock data - in production this would come from the API
const mockChallengeData = {
  userName: "Alex Chen",
  userAvatar: null,
  challengeName: "30-Day Python Mastery",
  challengeDuration: 30,
  currentDay: 12,
  daysLeft: 18,
  streak: 12,
  status: "active" as "active" | "missed" | "failed" | "completed",
  lastCheckIn: "2025-01-22 at 9:45 PM",
  showTimestamp: true,
  showProof: false,
  proofPreview: null,
}

const statusConfig = {
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

        <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm overflow-hidden">
          {/* User Header */}
          <div className="bg-gradient-to-br from-[#2bbcff]/10 to-[#a855f7]/10 p-6 text-center border-b border-border/30">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2bbcff] to-[#a855f7] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#a855f7]/20">
              <span className="text-2xl font-bold text-white">
                {userName.charAt(0)}
              </span>
            </div>
            <h1 className="text-lg font-bold mb-1">{userName}</h1>
            <p className="text-xs text-muted-foreground">is working on</p>
            <p className="text-sm font-medium text-[#2bbcff] mt-1">{challengeName}</p>
          </div>

          {/* Status Badge */}
          <div className="p-4 border-b border-border/30">
            <div className={`flex items-center justify-center gap-2 p-3 rounded-xl ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
              <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
              <span className={`text-sm font-bold ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 space-y-4">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">Day {currentDay} of {challengeDuration}</span>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/20 rounded-xl p-4 text-center border border-border/30">
                <Flame className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                <div className="text-xl font-bold">{streak}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Day Streak</div>
              </div>
              <div className="bg-muted/20 rounded-xl p-4 text-center border border-border/30">
                <Calendar className="w-5 h-5 text-[#2bbcff] mx-auto mb-2" />
                <div className="text-xl font-bold">{daysLeft}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Days Left</div>
              </div>
            </div>

            {/* Last Check-in */}
            {showTimestamp && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/10 border border-border/20">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Last check-in</p>
                  <p className="text-xs font-medium">{lastCheckIn}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setShowNudgeModal(true)}
                variant="outline"
                className="flex-1 h-10 text-xs bg-transparent border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Send Nudge
              </Button>
              <Button
                onClick={() => setShowHypeModal(true)}
                className="flex-1 h-10 text-xs bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0"
              >
                <Heart className="w-3.5 h-3.5 mr-1.5" />
                Send Hype
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground mt-6">
          You're supporting {userName} on EliteScore
        </p>
      </div>

      {/* Nudge Modal */}
      <Dialog open={showNudgeModal} onOpenChange={setShowNudgeModal}>
        <DialogContent className="sm:max-w-sm bg-card/95 backdrop-blur-xl border-orange-500/30">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Send a Nudge
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Give {userName} a friendly reminder to stay on track with their challenge.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
              <p className="text-xs text-center">
                <MessageCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                {userName} will receive a notification that you're checking in on their progress.
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNudgeModal(false)}
              className="w-full sm:w-auto text-xs h-8 bg-transparent"
              disabled={nudgeSent}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSendNudge}
              disabled={nudgeSent}
              className="w-full sm:w-auto text-xs h-8 bg-orange-500 hover:bg-orange-600 text-white border-0"
            >
              {nudgeSent ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Sent!
                </>
              ) : (
                "Send Nudge"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hype Modal */}
      <Dialog open={showHypeModal} onOpenChange={setShowHypeModal}>
        <DialogContent className="sm:max-w-sm bg-card/95 backdrop-blur-xl border-[#a855f7]/30">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#a855f7]" />
              Send Hype
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Cheer {userName} on and let them know you believe in them!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-[#a855f7]/5 rounded-lg p-4 border border-[#a855f7]/20">
              <p className="text-xs text-center">
                <Heart className="w-8 h-8 text-[#a855f7] mx-auto mb-2" />
                {userName} will receive an encouraging notification from you.
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowHypeModal(false)}
              className="w-full sm:w-auto text-xs h-8 bg-transparent"
              disabled={hypeSent}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSendHype}
              disabled={hypeSent}
              className="w-full sm:w-auto text-xs h-8 bg-[#a855f7] hover:bg-[#a855f7]/90 text-white border-0"
            >
              {hypeSent ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
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
