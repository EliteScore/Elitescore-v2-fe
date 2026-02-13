import type { LearningProviderAdapter, ProviderProgress, ProviderTokenResponse } from "@/lib/server/integrations/providers/base"

function progressFromCourseId(providerCourseId: string): ProviderProgress {
  const seed = providerCourseId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const progressPercent = Math.min((seed % 90) + 5, 100)
  const completed = progressPercent >= 100 || progressPercent >= 95
  return {
    progressPercent: completed ? 100 : progressPercent,
    completionState: completed ? "completed" : progressPercent > 0 ? "in_progress" : "not_started",
    providerCompletedAtISO: completed ? new Date().toISOString() : undefined,
  }
}

export const courseraEnterpriseAdapter: LearningProviderAdapter = {
  provider: "coursera_enterprise",

  getAuthorizeUrl(state: string) {
    return `/api/integrations/coursera_enterprise/callback?code=mock_coursera_code&state=${encodeURIComponent(state)}`
  },

  async exchangeCode(_code: string): Promise<ProviderTokenResponse> {
    return {
      accessToken: `coursera_access_${Date.now()}`,
      refreshToken: `coursera_refresh_${Date.now()}`,
      scopes: ["learners.read", "course_progress.read"],
      expiresAtISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    }
  },

  async listLearnerCourses({ query }) {
    const courses = [
      {
        providerCourseId: "coursera-2001",
        title: "Machine Learning Foundations",
        providerUrl: "https://www.coursera.org/learn/machine-learning-foundations",
        thumbnailUrl: "https://picsum.photos/seed/coursera1/128/72",
      },
      {
        providerCourseId: "coursera-2002",
        title: "Career Growth with LinkedIn Strategy",
        providerUrl: "https://www.coursera.org/learn/career-growth-linkedin",
        thumbnailUrl: "https://picsum.photos/seed/coursera2/128/72",
      },
      {
        providerCourseId: "coursera-2003",
        title: "SQL for Data Driven Teams",
        providerUrl: "https://www.coursera.org/learn/sql-data-driven-teams",
        thumbnailUrl: "https://picsum.photos/seed/coursera3/128/72",
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

