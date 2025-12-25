"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Trophy, Target, Flame, Users, Shield, BarChart3 } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="EliteScore" width={40} height={40} className="w-7 h-7" />
              <span className="hidden sm:inline text-lg font-bold bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                ELITESCORE
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-xs font-medium hover:text-[#2bbcff] transition-colors uppercase tracking-wide"
              >
                Features
              </a>
              <a
                href="#challenges"
                className="text-xs font-medium hover:text-[#2bbcff] transition-colors uppercase tracking-wide"
              >
                Challenges
              </a>
              <a
                href="#how-it-works"
                className="text-xs font-medium hover:text-[#2bbcff] transition-colors uppercase tracking-wide"
              >
                How It Works
              </a>
              <Button
                size="sm"
                variant="outline"
                className="border-[#2bbcff]/50 hover:bg-[#2bbcff]/10 bg-transparent text-xs h-8"
              >
                Log In
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-xs h-8"
              >
                Get Started
              </Button>
            </div>
            <div className="flex md:hidden items-center gap-2">
              <Button size="sm" variant="ghost" className="text-xs h-8 px-2">
                Log In
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-xs h-8 px-3"
              >
                Start
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-12 pb-6 md:pb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2bbcff]/5 via-background to-[#a855f7]/5" />
        <div className="relative z-10 container mx-auto px-4 pt-8 md:pt-16 pb-12 md:pb-24">
          <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6">
            <Badge className="bg-[#2bbcff]/10 text-[#2bbcff] border-[#2bbcff]/30 backdrop-blur-sm text-[10px] md:text-xs">
              Turn Self-Improvement Into Your Competitive Edge
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight px-4">
              Compete. Level Up.{" "}
              <span className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                Dominate.
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mx-auto text-balance px-4">
              The gamified platform where Gen Z students turn skills, habits, and learning into quantifiable
              achievements. Rise through leaderboards, complete challenges, and build the future you want.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center pt-2 md:pt-4 px-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-xs md:text-sm px-6 md:px-8 h-10 md:h-11 w-full sm:w-auto"
              >
                Start Competing Free
                <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#2bbcff]/50 hover:bg-[#2bbcff]/10 text-xs md:text-sm px-6 md:px-8 bg-transparent h-10 md:h-11 w-full sm:w-auto"
              >
                Watch Demo
              </Button>
            </div>

            <div className="pt-4 md:pt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 md:gap-6 text-[10px] md:text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2bbcff]" />
                <span className="text-muted-foreground">10K+ Active Competitors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
                <span className="text-muted-foreground">50+ Universities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2bbcff]" />
                <span className="text-muted-foreground">2M+ Challenges Completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-8 md:py-16 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-2 md:space-y-3 mb-8 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-balance">
              Everything You Need To{" "}
              <span className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">Win</span>
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto">
              Built for ambitious students who want to track, compete, and dominate in their self-improvement journey
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Feature 1 */}
            <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-6 hover:border-[#2bbcff]/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-[#2bbcff]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5 text-[#2bbcff]" />
              </div>
              <h3 className="text-base font-bold mb-2">Daily Challenges</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Lock in structured challenges across technical skills, career development, and personal growth.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card rounded-xl border border-[#a855f7]/20 bg-card/50 backdrop-blur-sm p-6 hover:border-[#a855f7]/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-[#a855f7]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 text-[#a855f7]" />
              </div>
              <h3 className="text-base font-bold mb-2">Live Leaderboards</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track your rank in real-time against your cohort. See exactly where you stand.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-6 hover:border-[#2bbcff]/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-[#2bbcff]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-[#2bbcff]" />
              </div>
              <h3 className="text-base font-bold mb-2">EliteScore System</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Quantify your progress with a single metric that matters. Your achievements, ranked.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card rounded-xl border border-[#a855f7]/20 bg-card/50 backdrop-blur-sm p-6 hover:border-[#a855f7]/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-[#a855f7]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-[#a855f7]" />
              </div>
              <h3 className="text-base font-bold mb-2">Proof-Based Progress</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Submit evidence for every achievement. No gaming the system, only real results.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-6 hover:border-[#2bbcff]/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-[#2bbcff]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-base font-bold mb-2">Streak Tracking</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Build consistency. Your streak multiplies your score and keeps you accountable.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card rounded-xl border border-[#a855f7]/20 bg-card/50 backdrop-blur-sm p-6 hover:border-[#a855f7]/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-[#a855f7]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-[#a855f7]" />
              </div>
              <h3 className="text-base font-bold mb-2">Cohort Competition</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Compete with students from your university. Local rivalry drives global excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-8 md:py-16 bg-gradient-to-br from-[#2bbcff]/5 to-[#a855f7]/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-2 md:space-y-3 mb-8 md:mb-12 px-4">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-balance">
                How{" "}
                <span className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                  EliteScore
                </span>{" "}
                Works
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Four simple steps to transform your self-improvement into measurable achievement
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
              {/* Step 1 */}
              <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <h3 className="text-base font-bold">Lock In a Challenge</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choose from 50+ curated challenges across coding, career, fitness, and learning. Commit for 7-30 days.
                </p>
              </div>

              {/* Step 2 */}
              <div className="glass-card rounded-xl border border-[#a855f7]/20 bg-card/50 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#a855f7] to-[#2bbcff] flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <h3 className="text-base font-bold">Submit Daily Proof</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upload screenshots, code, or documents proving you completed today's task. Real results only.
                </p>
              </div>

              {/* Step 3 */}
              <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2bbcff] to-[#a855f7] flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <h3 className="text-base font-bold">Earn EliteScore</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every submission increases your EliteScore. Streaks multiply your gains. Miss a day? Score decays.
                </p>
              </div>

              {/* Step 4 */}
              <div className="glass-card rounded-xl border border-[#a855f7]/20 bg-card/50 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#a855f7] to-[#2bbcff] flex items-center justify-center text-white text-sm font-bold">
                    4
                  </div>
                  <h3 className="text-base font-bold">Climb the Ranks</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Watch your rank rise on cohort and global leaderboards. Prove you're elite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-8 md:py-16 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-2 md:space-y-3 mb-8 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-balance">
              Join{" "}
              <span className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                10,000+
              </span>{" "}
              Elite Students
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">Students across Europe are leveling up daily</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2bbcff] to-[#a855f7]" />
                <div>
                  <div className="text-sm font-bold">Emma W.</div>
                  <div className="text-xs text-muted-foreground">Amsterdam • Rank #1</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "Increased my EliteScore by 430 points in 3 months. Landed my dream internship at Siemens because of my
                verified credentials"
              </p>
            </div>

            <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a855f7] to-[#2bbcff]" />
                <div>
                  <div className="text-sm font-bold">Javier M.</div>
                  <div className="text-xs text-muted-foreground">Barcelona • Rank #12</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "The competitive aspect is addictive. I'm learning faster than ever and my grades have never been
                better"
              </p>
            </div>

            <div className="glass-card rounded-xl border border-[#2bbcff]/20 bg-card/50 backdrop-blur-sm p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2bbcff] to-[#a855f7]" />
                <div>
                  <div className="text-sm font-bold">Sophie L.</div>
                  <div className="text-xs text-muted-foreground">Paris • Rank #8</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "Finally, self-improvement that's social and fun. The leaderboards keep me coming back every single day"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2bbcff]/10 via-background to-[#a855f7]/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-balance">
              Ready To Become{" "}
              <span className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">Elite?</span>
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Join thousands of ambitious students turning self-improvement into their competitive advantage
            </p>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center pt-2 md:pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#2bbcff] to-[#a855f7] hover:opacity-90 text-white border-0 text-xs md:text-sm px-8 md:px-10 h-10 md:h-11 w-full sm:w-auto"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              No credit card required • 7-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="EliteScore" width={28} height={28} className="w-6 h-6 md:w-7 md:h-7" />
              <span className="text-xs md:text-sm font-bold bg-gradient-to-r from-[#2bbcff] to-[#a855f7] bg-clip-text text-transparent">
                ELITESCORE
              </span>
            </div>
            <div className="flex gap-4 md:gap-6 text-[10px] md:text-xs text-muted-foreground">
              <a href="#" className="hover:text-[#2bbcff] transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-[#2bbcff] transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-[#2bbcff] transition-colors">
                Contact
              </a>
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground">© 2025 EliteScore. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
