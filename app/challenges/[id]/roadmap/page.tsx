"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Trophy } from "lucide-react"
import Link from "next/link"
import { MilestoneCard } from "@/components/roadmap/milestone-card"
import { PathTimeline } from "@/components/roadmap/path-timeline"
import { SkillsProgress } from "@/components/roadmap/skills-progress"
import { DailyTasks } from "@/components/roadmap/daily-tasks"

// Mock data - would come from API/database
const challengeData = {
  1: {
    id: 1,
    name: "30-Day Python Mastery",
    description: "Master Python fundamentals through hands-on projects and daily coding challenges",
    timeEstimate: "4 weeks",
    difficulty: 4,
    currentMilestone: 2,
    milestones: [
      {
        id: 1,
        title: "Setup Database",
        description: "Configure PostgreSQL and learn database fundamentals",
        status: "completed" as const,
        progress: 100,
        tasks: [
          { title: "Install PostgreSQL", completed: true },
          { title: "Create database schema", completed: true },
          { title: "Write initial migrations", completed: true },
          { title: "Test database connection", completed: true },
        ],
      },
      {
        id: 2,
        title: "Ship Project #1",
        description: "Build and deploy a full-stack application",
        status: "active" as const,
        progress: 60,
        tasks: [
          { title: "Setup Database", completed: true },
          { title: "Implement Auth", completed: true },
          { title: "Build Dashboard UI", completed: false },
          { title: "Deploy to Vercel", completed: false },
        ],
      },
      {
        id: 3,
        title: "Advanced Features",
        description: "Implement real-time updates and advanced functionality",
        status: "locked" as const,
        progress: 0,
        tasks: [
          { title: "WebSocket integration", completed: false },
          { title: "Caching layer", completed: false },
          { title: "Performance optimization", completed: false },
        ],
      },
    ],
    phases: [
      { id: 1, name: "Foundation", milestones: 2, status: "completed" as const },
      { id: 2, name: "Build", milestones: 2, status: "active" as const },
      { id: 3, name: "Prove", milestones: 0, status: "locked" as const },
      { id: 4, name: "Apply", milestones: 0, status: "locked" as const },
    ],
    skills: [
      { name: "TypeScript", progress: 85 },
      { name: "Node.js", progress: 40 },
      { name: "System Design", progress: 15 },
    ],
    dailyTasks: [
      {
        id: "task1",
        title: "Update LinkedIn headline",
        duration: "10 min",
        category: "Personal Branding",
        completed: false,
      },
      {
        id: "task2",
        title: "Review one teammate's project",
        duration: "15 min",
        category: "Leadership",
        completed: false,
      },
      {
        id: "task3",
        title: "Complete daily skill quiz",
        duration: "5 min",
        category: "Skills",
        completed: false,
      },
    ],
  },
  2: {
    id: 2,
    name: "14-Day LinkedIn Growth",
    description: "Build your professional brand and grow your LinkedIn presence",
    timeEstimate: "2 weeks",
    difficulty: 2,
    currentMilestone: 1,
    milestones: [
      {
        id: 1,
        title: "Profile Optimization",
        description: "Optimize your LinkedIn profile for maximum visibility",
        status: "active" as const,
        progress: 50,
        tasks: [
          { title: "Update profile photo", completed: true },
          { title: "Write compelling headline", completed: true },
          { title: "Optimize about section", completed: false },
          { title: "Add skills and endorsements", completed: false },
        ],
      },
      {
        id: 2,
        title: "Content Creation",
        description: "Create and publish engaging LinkedIn content",
        status: "locked" as const,
        progress: 0,
        tasks: [
          { title: "Write first post", completed: false },
          { title: "Engage with 10 posts", completed: false },
          { title: "Share an article", completed: false },
        ],
      },
    ],
    phases: [
      { id: 1, name: "Foundation", milestones: 1, status: "active" as const },
      { id: 2, name: "Build", milestones: 1, status: "locked" as const },
      { id: 3, name: "Prove", milestones: 0, status: "locked" as const },
      { id: 4, name: "Apply", milestones: 0, status: "locked" as const },
    ],
    skills: [
      { name: "Personal Branding", progress: 65 },
      { name: "Content Writing", progress: 30 },
      { name: "Networking", progress: 20 },
    ],
    dailyTasks: [
      {
        id: "task1",
        title: "Engage with 5 posts in your industry",
        duration: "15 min",
        category: "Networking",
        completed: false,
      },
      {
        id: "task2",
        title: "Update your profile summary",
        duration: "20 min",
        category: "Personal Branding",
        completed: false,
      },
    ],
  },
}

export default function ChallengeRoadmapPage() {
  const params = useParams()
  const router = useRouter()
  const challengeId = parseInt(params.id as string)
  const challenge = challengeData[challengeId as keyof typeof challengeData]

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Challenge not found</h1>
          <Button asChild>
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
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl border border-[#0ea5e9]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-[#0ea5e9]/20 to-[#0f766e]/20 blur-[100px] rounded-full -z-10" aria-hidden="true" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="h-9 w-9 p-0 rounded-xl shrink-0"
                  aria-label="Back to challenges"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <nav className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1" aria-label="Breadcrumb">
                    <Link href="/challenges" className="hover:text-[#0ea5e9] transition-colors">Challenges</Link>
                    <span className="mx-1.5" aria-hidden="true">/</span>
                    <Link href={`/challenges/${challengeId}`} className="hover:text-[#0ea5e9] transition-colors">{challenge.name}</Link>
                    <span className="mx-1.5" aria-hidden="true">/</span>
                    <span className="text-foreground">Roadmap</span>
                  </nav>
                  <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-[#0ea5e9] via-[#0f766e] to-[#0ea5e9] text-foreground leading-tight">
                    {challenge.name}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xl">
                    {challenge.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mt-3">
                    <Badge variant="secondary" className="bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/30 text-[10px] font-bold uppercase tracking-wider">
                      <Clock className="w-2.5 h-2.5 mr-0.5" aria-hidden="true" />
                      {challenge.timeEstimate}
                    </Badge>
                    <Badge variant="secondary" className="bg-[#0f766e]/10 text-[#0f766e] border-[#0f766e]/30 text-[10px] font-bold uppercase tracking-wider">
                      <Trophy className="w-2.5 h-2.5 mr-0.5" aria-hidden="true" />
                      Difficulty {challenge.difficulty}/5
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-[#0ea5e9] to-[#0f766e] hover:opacity-90 text-white border-0 text-[10px] h-9 font-bold uppercase tracking-wider shrink-0"
              >
                <Link href={`/challenges/${challengeId}`} aria-label="Back to challenge details">Challenge details</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - home UI section cards */}
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Milestone - home UI style */}
              <div className="glass-card rounded-2xl border border-[#0ea5e9]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Trophy className="w-5 h-5 text-[#0ea5e9]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Active milestone</div>
                    <div className="text-base font-bold text-foreground">Current focus</div>
                  </div>
                </div>
                {challenge.milestones
                  .filter((m) => m.status === "active")
                  .map((milestone) => (
                    <MilestoneCard
                      key={milestone.id}
                      title={milestone.title}
                      description={milestone.description}
                      tasks={milestone.tasks}
                      status={milestone.status}
                      progress={milestone.progress}
                    />
                  ))}
              </div>

              {/* Path Timeline - home UI style wrapper */}
              <PathTimeline phases={challenge.phases} />

              {/* All Milestones - home UI style */}
              <div className="glass-card rounded-2xl border border-[#0ea5e9]/20 bg-gradient-to-br from-card/80 to-background backdrop-blur-md p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#0f766e]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Trophy className="w-5 h-5 text-[#0f766e]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">All milestones</div>
                    <div className="text-base font-bold text-foreground">Full path overview</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {challenge.milestones.map((milestone) => (
                    <MilestoneCard
                      key={milestone.id}
                      title={milestone.title}
                      description={milestone.description}
                      tasks={milestone.tasks}
                      status={milestone.status}
                      progress={milestone.progress}
                    />
                  ))}
                </div>
              </div>

              {/* Skills to Build - home UI style wrapper */}
              <SkillsProgress skills={challenge.skills} />
            </div>

            {/* Sidebar - Daily Tasks */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <DailyTasks tasks={challenge.dailyTasks} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
