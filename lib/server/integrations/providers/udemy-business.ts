import type { LearningProviderAdapter, ProviderProgress, ProviderTokenResponse } from "@/lib/server/integrations/providers/base"

export const udemyBusinessAdapter: LearningProviderAdapter = {
  provider: "udemy_business",

  getAuthorizeUrl(state: string) {
    return `/api/integrations/udemy_business/callback?state=${encodeURIComponent(state)}`
  },

  async exchangeCode(code: string): Promise<ProviderTokenResponse> {
    if (!code) {
      throw new Error("Missing OAuth code from Udemy Business")
    }

    return {
      accessToken: `udemy_access_${Date.now()}`,
      refreshToken: `udemy_refresh_${Date.now()}`,
      scopes: ["course.read", "progress.read"],
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
