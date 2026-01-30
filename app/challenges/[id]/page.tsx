"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Clock,
  Trophy,
  Target,
  Check,
  Circle,
  Lock,
  Upload,
  Calendar,
  Star,
  AlertCircle,
  ListTodo,
  Map,
  FileCheck,
} from "lucide-react"
import Link from "next/link"

// Mock data
const challengeData = {
  1: {
    id: 1,
    name: "30-Day Python Mastery",
    description: "Master Python fundamentals through hands-on projects and daily coding challenges",
    difficulty: 4,
    duration: 30,
    currentDay: 12,
    daysRemaining: 18,
    progress: 40,
    reward: 450,
    requirements: [
      "Complete 3 LeetCode problems daily",
      "Build 1 project per week",
      "Submit code screenshots as proof",
      "Follow Python best practices"
    ],
    roadmap: [
      {
        id: 1,
        title: "Week 1: Python Fundamentals",
        status: "completed" as const,
        tasks: [
          { id: 1, title: "Variables & Data Types", completed: true, day: 1 },
          { id: 2, title: "Control Flow (if/else, loops)", completed: true, day: 2 },
          { id: 3, title: "Functions & Modules", completed: true, day: 3 },
          { id: 4, title: "Lists & Dictionaries", completed: true, day: 4 },
          { id: 5, title: "File Handling", completed: true, day: 5 },
          { id: 6, title: "Error Handling", completed: true, day: 6 },
          { id: 7, title: "Week 1 Project: CLI Tool", completed: true, day: 7 },
        ],
      },
      {
        id: 2,
        title: "Week 2: Data Structures & Algorithms",
        status: "in_progress" as const,
        tasks: [
          { id: 8, title: "Arrays & Strings", completed: true, day: 8 },
          { id: 9, title: "Stacks & Queues", completed: true, day: 9 },
          { id: 10, title: "Linked Lists", completed: true, day: 10 },
          { id: 11, title: "Trees & Graphs", completed: true, day: 11 },
          { id: 12, title: "Sorting Algorithms", completed: true, day: 12 },
          { id: 13, title: "Searching Algorithms", completed: false, day: 13 },
          { id: 14, title: "Week 2 Project: Data Processor", completed: false, day: 14 },
        ],
      },
      {
        id: 3,
        title: "Week 3: OOP & Design Patterns",
        status: "locked" as const,
        tasks: [
          { id: 15, title: "Classes & Objects", completed: false, day: 15 },
          { id: 16, title: "Inheritance & Polymorphism", completed: false, day: 16 },
          { id: 17, title: "Design Patterns", completed: false, day: 17 },
          { id: 18, title: "SOLID Principles", completed: false, day: 18 },
          { id: 19, title: "Testing with pytest", completed: false, day: 19 },
          { id: 20, title: "Debugging Techniques", completed: false, day: 20 },
          { id: 21, title: "Week 3 Project: OOP System", completed: false, day: 21 },
        ],
      },
      {
        id: 4,
        title: "Week 4: Real-World Application",
        status: "locked" as const,
        tasks: [
          { id: 22, title: "API Development with Flask", completed: false, day: 22 },
          { id: 23, title: "Database Integration", completed: false, day: 23 },
          { id: 24, title: "Authentication & Security", completed: false, day: 24 },
          { id: 25, title: "Deployment Setup", completed: false, day: 25 },
          { id: 26, title: "Testing & Documentation", completed: false, day: 26 },
          { id: 27, title: "Performance Optimization", completed: false, day: 27 },
          { id: 28, title: "Final Project: Full-Stack App", completed: false, day: "28-30" },
        ],
      },
    ],
    todayTask: {
      day: 12,
      title: "Sorting Algorithms",
      description: "Implement and analyze QuickSort, MergeSort, and HeapSort",
      requirements: [
        "Code all three sorting algorithms",
        "Write time complexity analysis",
        "Create comparison benchmark",
        "Upload code screenshot"
      ],
      xp: 50,
    },
  },
  2: {
    id: 2,
    name: "14-Day LinkedIn Growth",
    description: "Build your professional brand and grow your LinkedIn presence",
    difficulty: 2,
    duration: 14,
    currentDay: 7,
    daysRemaining: 7,
    progress: 50,
    reward: 140,
    requirements: [
      "Post valuable content daily",
      "Engage with 5+ posts per day",
      "Connect with 3 professionals weekly",
      "Share screenshots of activity"
    ],
    roadmap: [
      {
        id: 1,
        title: "Week 1: Profile & Content Foundation",
        status: "in_progress" as const,
        tasks: [
          { id: 1, title: "Optimize profile photo & headline", completed: true, day: 1 },
          { id: 2, title: "Write compelling about section", completed: true, day: 2 },
          { id: 3, title: "First value post", completed: true, day: 3 },
          { id: 4, title: "Share industry insight", completed: true, day: 4 },
          { id: 5, title: "Create carousel post", completed: true, day: 5 },
          { id: 6, title: "Engage with 10 posts", completed: true, day: 6 },
          { id: 7, title: "Connect with 5 professionals", completed: true, day: 7 },
        ],
      },
      {
        id: 2,
        title: "Week 2: Growth & Engagement",
        status: "locked" as const,
        tasks: [
          { id: 8, title: "Post about learning journey", completed: false, day: 8 },
          { id: 9, title: "Share a success story", completed: false, day: 9 },
          { id: 10, title: "Create video post", completed: false, day: 10 },
          { id: 11, title: "Write article on expertise", completed: false, day: 11 },
          { id: 12, title: "Host LinkedIn poll", completed: false, day: 12 },
          { id: 13, title: "Celebrate milestone", completed: false, day: 13 },
          { id: 14, title: "Reflect & plan next steps", completed: false, day: 14 },
        ],
      },
    ],
    todayTask: {
      day: 7,
      title: "Connect with 5 professionals",
      description: "Reach out to professionals in your industry with personalized messages",
      requirements: [
        "Find 5 relevant connections",
        "Write personalized connection requests",
        "Screenshot sent requests",
        "Upload proof"
      ],
      xp: 30,
    },
  },
}

export default function ChallengeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const challengeId = parseInt(params.id as string)
  const challenge = challengeData[challengeId as keyof typeof challengeData]
  const [showUploadProof, setShowUploadProof] = useState(false)

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center p-4">
          <h1 className="text-xl font-bold mb-3">Challenge not found</h1>
          <Button size="sm" asChild>
            <Link href="/challenges">Back to Challenges</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero header - same style as home page */}
      <section className="container mx-auto px-4 pt-6 md:pt-8 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-[#2bbcff]/20 to-[#a855f7]/20 blur-[100px] rounded-full -z-10" aria-hidden="true" />
            <div className="flex items-start gap-3 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="h-8 w-8 p-0 rounded-lg shrink-0"
                aria-label="Back to challenges"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-1">
                  <Link href="/challenges" className="hover:text-foreground transition-colors">
                    Challenges
                  </Link>
                  <span>/</span>
                  <span className="text-foreground truncate">{challenge.name}</span>
                </div>
                <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-[#2bbcff] via-[#a855f7] to-[#2bbcff] bg-clip-text text-transparent truncate">
                  {challenge.name}
                </h1>
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  <Badge variant="secondary" className="bg-[#2bbcff]/10 text-[#2bbcff] border-[#2bbcff]/30 text-[10px] font-bold uppercase tracking-wider">
                    Day {challenge.currentDay}/{challenge.duration}
                  </Badge>
                  <Badge variant="secondary" className="bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30 text-[10px] font-bold uppercase tracking-wider">
                    <Trophy className="w-2.5 h-2.5 mr-0.5" aria-hidden="true" />
                    Difficulty {challenge.difficulty}/5
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Today's Task - home UI style, no XP */}
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2bbcff]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Star className="w-5 h-5 text-[#2bbcff]" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Today&apos;s task • Day {challenge.todayTask.day}
                </div>
                <h2 className="text-base font-bold text-foreground leading-tight">{challenge.todayTask.title}</h2>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {challenge.todayTask.description}
            </p>
            <div className="glass-card rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm p-4 mb-4">
              <div className="text-[10px] font-bold text-[#2bbcff] uppercase tracking-wider mb-2">Requirements</div>
              <ul className="space-y-2">
                {challenge.todayTask.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <Circle className="w-3 h-3 text-[#2bbcff] mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              size="sm"
              onClick={() => setShowUploadProof(true)}
              className="w-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-[10px] h-9 font-bold uppercase tracking-wider"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
              Submit proof for today
            </Button>
          </div>

          {/* Progress Overview - home UI style */}
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2bbcff]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Target className="w-5 h-5 text-[#2bbcff]" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Progress • Overview</div>
                <div className="text-base font-bold text-foreground">{challenge.progress}% complete</div>
              </div>
            </div>
            <div className="glass-card rounded-xl border border-white/5 bg-card/30 p-3 mb-4">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Progress</span>
                <span className="text-sm font-bold text-[#2bbcff]">{challenge.progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] rounded-full transition-all duration-500"
                  style={{ width: `${challenge.progress}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl border border-white/5 bg-card/30 p-3">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Days left</div>
                <div className="text-lg font-bold text-foreground">{challenge.daysRemaining}</div>
              </div>
              <div className="glass-card rounded-xl border border-[#a855f7]/20 bg-[#a855f7]/5 p-3">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Reward</div>
                <div className="text-lg font-bold text-[#a855f7]">+{challenge.reward} EliteScore</div>
              </div>
            </div>
          </div>

          {/* Roadmap - home UI style */}
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#2bbcff]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Map className="w-5 h-5 text-[#2bbcff]" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Challenge roadmap</div>
                <div className="text-base font-bold text-foreground">Week-by-week plan</div>
              </div>
            </div>
            <div className="space-y-3">
              {challenge.roadmap.map((week, index) => (
                <div key={week.id} className="glass-card rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm overflow-hidden">
                  <div
                    className={`p-4 ${
                      week.status === "in_progress"
                        ? "bg-[#2bbcff]/5 border-b border-[#2bbcff]/20"
                        : week.status === "completed"
                          ? "bg-green-500/5 border-b border-green-500/20"
                          : "border-b border-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                            week.status === "in_progress"
                              ? "bg-[#2bbcff]/20 text-[#2bbcff]"
                              : week.status === "completed"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-white/5 text-muted-foreground"
                          }`}
                          aria-hidden="true"
                        >
                          {week.status === "completed" ? <Check className="w-4 h-4" /> : index + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{week.title}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {week.tasks.filter((t) => t.completed).length}/{week.tasks.length} tasks completed
                          </p>
                        </div>
                      </div>
                      {week.status === "locked" && <Lock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />}
                    </div>
                  </div>
                  {week.status !== "locked" && (
                    <div className="p-3 space-y-2">
                      {week.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center gap-3 p-2.5 rounded-lg ${
                            task.completed ? "bg-green-500/5 border border-green-500/10" : "bg-white/5 border border-white/5"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                              task.completed ? "bg-green-500/20 border border-green-500/30" : "bg-white/5 border border-white/10"
                            }`}
                            aria-hidden="true"
                          >
                            {task.completed && <Check className="w-3 h-3 text-green-500" />}
                          </div>
                          <span
                            className={`text-sm flex-1 leading-snug ${
                              task.completed ? "line-through text-muted-foreground" : "text-foreground font-medium"
                            }`}
                          >
                            Day {task.day}: {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements - home UI style */}
          <div className="glass-card rounded-2xl border border-[#2bbcff]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2bbcff]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <FileCheck className="w-5 h-5 text-[#2bbcff]" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Challenge requirements</div>
                <div className="text-base font-bold text-foreground">What you need to follow</div>
              </div>
            </div>
            <ul className="space-y-3">
              {challenge.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <AlertCircle className="w-4 h-4 text-[#2bbcff] mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Upload Proof Modal - home UI style */}
      {showUploadProof && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowUploadProof(false)}
        >
          <div
            className="glass-card rounded-t-2xl sm:rounded-2xl border-0 sm:border border-[#2bbcff]/20 bg-card/95 backdrop-blur-xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Submit proof</div>
            <h3 className="text-lg font-bold text-foreground mb-4">Upload your completion proof</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">Upload Screenshot/Photo</label>
                <input
                  type="file"
                  className="w-full text-[10px] text-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-medium file:bg-[#2bbcff]/10 file:text-[#2bbcff] hover:file:bg-[#2bbcff]/20"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">Description</label>
                <textarea
                  placeholder="Describe what you completed..."
                  className="w-full p-2 rounded-lg bg-background/50 border border-border/50 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:border-[#2bbcff]/50 focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setShowUploadProof(false)}
                  variant="outline"
                  className="flex-1 text-[10px] h-9 font-bold uppercase tracking-wider bg-transparent border-white/10"
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white text-[10px] h-9 font-bold uppercase tracking-wider border-0">
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
