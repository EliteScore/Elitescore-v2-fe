import type { LearningProviderAdapter, ProviderProgress, ProviderTokenResponse } from "@/lib/server/integrations/providers/base"

function progressFromCourseId(providerCourseId: string): ProviderProgress {
  const seed = providerCourseId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const progressPercent = Math.min((seed % 85) + 10, 100)
  const completed = progressPercent >= 100 || progressPercent >= 92
  return {
    progressPercent: completed ? 100 : progressPercent,
    completionState: completed ? "completed" : progressPercent > 0 ? "in_progress" : "not_started",
    providerCompletedAtISO: completed ? new Date().toISOString() : undefined,
  }
}

export const udemyBusinessAdapter: LearningProviderAdapter = {
  provider: "udemy_business",

  getAuthorizeUrl(state: string) {
    return `/api/integrations/udemy_business/callback?code=mock_udemy_code&state=${encodeURIComponent(state)}`
  },

  async exchangeCode(_code: string): Promise<ProviderTokenResponse> {
    return {
      accessToken: `udemy_access_${Date.now()}`,
      refreshToken: `udemy_refresh_${Date.now()}`,
      scopes: ["course.read", "progress.read"],
      expiresAtISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    }
  },

  async listLearnerCourses({ query }) {
    const courses = [
      {
        providerCourseId: "udemy-1001",
        title: "Python for Software Engineers",
        providerUrl: "https://business.udemy.com/course/python-for-software-engineers",
        thumbnailUrl: "https://picsum.photos/seed/udemy1/128/72",
      },
      {
        providerCourseId: "udemy-1002",
        title: "Advanced SQL Performance Tuning",
        providerUrl: "https://business.udemy.com/course/advanced-sql-performance-tuning",
        thumbnailUrl: "https://picsum.photos/seed/udemy2/128/72",
      },
      {
        providerCourseId: "udemy-1003",
        title: "LinkedIn Personal Branding Masterclass",
        providerUrl: "https://business.udemy.com/course/linkedin-personal-branding",
        thumbnailUrl: "https://picsum.photos/seed/udemy3/128/72",
      },
    ]

    if (!query?.trim()) return courses
    const lowered = query.toLowerCase()
    return courses.filter((item) => item.title.toLowerCase().includes(lowered))
  },

  async getCourseProgress({ providerCourseId }) {
    return progressFromCourseId(providerCourseId)
  },
}

