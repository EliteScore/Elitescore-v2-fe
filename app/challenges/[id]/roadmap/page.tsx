"use client"

import { useState } from "react"
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
        xp: 40,
        category: "Personal Branding",
        completed: false,
      },
      {
        id: "task2",
        title: "Review one teammate's project",
        duration: "15 min",
        xp: 30,
        category: "Leadership",
        completed: false,
      },
      {
        id: "task3",
        title: "Complete daily skill quiz",
        duration: "5 min",
        xp: 50,
        category: "Skills",
        completed: false,
      },
    ],
    totalDailyXP: 120,
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
        xp: 30,
        category: "Networking",
        completed: false,
      },
      {
        id: "task2",
        title: "Update your profile summary",
        duration: "20 min",
        xp: 50,
        category: "Personal Branding",
        completed: false,
      },
    ],
    totalDailyXP: 80,
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
      {/* Header */}
      <section className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/challenges" className="hover:text-foreground transition-colors">
                Challenges
              </Link>
              <span>/</span>
              <span className="text-foreground">{challenge.name}</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black mb-2">{challenge.name}</h1>
              <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="secondary" className="bg-[#2bbcff]/10 text-[#2bbcff] border-[#2bbcff]/30">
                  <Clock className="w-3 h-3 mr-1" />
                  {challenge.timeEstimate}
                </Badge>
                <Badge variant="secondary" className="bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30">
                  <Trophy className="w-3 h-3 mr-1" />
                  Difficulty {challenge.difficulty}/5
                </Badge>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 h-11 font-bold"
            >
              Continue Path
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Milestone */}
              <div>
                <h2 className="text-xl font-bold mb-4">Active Milestone</h2>
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

              {/* Path Timeline */}
              <PathTimeline phases={challenge.phases} />

              {/* All Milestones */}
              <div>
                <h2 className="text-xl font-bold mb-4">All Milestones</h2>
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

              {/* Skills to Build */}
              <SkillsProgress skills={challenge.skills} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <DailyTasks totalXP={challenge.totalDailyXP} tasks={challenge.dailyTasks} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
