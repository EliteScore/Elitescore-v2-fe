import type { LearningProviderAdapter, ProviderProgress, ProviderTokenResponse } from "@/lib/server/integrations/providers/base"

export const courseraEnterpriseAdapter: LearningProviderAdapter = {
  provider: "coursera_enterprise",

  getAuthorizeUrl(state: string) {
    return `/api/integrations/coursera_enterprise/callback?state=${encodeURIComponent(state)}`
  },

  async exchangeCode(code: string): Promise<ProviderTokenResponse> {
    if (!code) {
      throw new Error("Missing OAuth code from Coursera Enterprise")
    }

    return {
      accessToken: `coursera_access_${Date.now()}`,
      refreshToken: `coursera_refresh_${Date.now()}`,
      scopes: ["learners.read", "course_progress.read"],
      expiresAtISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    }
  },

  async listLearnerCourses() {
    return []
  },

  async getCourseProgress(): Promise<ProviderProgress> {
    return {
      progressPercent: 0,
      completionState: "not_started",
    }
  },
}
