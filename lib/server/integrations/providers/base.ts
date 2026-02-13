import type { LearningProvider, ProviderCourse } from "@/lib/types/integrations"

export interface ProviderTokenResponse {
  accessToken: string
  refreshToken?: string
  scopes: string[]
  expiresAtISO?: string
}

export interface ProviderProgress {
  progressPercent: number
  completionState: "not_started" | "in_progress" | "completed"
  providerCompletedAtISO?: string
}

export interface LearningProviderAdapter {
  provider: LearningProvider
  getAuthorizeUrl(state: string): string
  exchangeCode(code: string): Promise<ProviderTokenResponse>
  listLearnerCourses(params: { query?: string }): Promise<ProviderCourse[]>
  getCourseProgress(params: { providerCourseId: string }): Promise<ProviderProgress>
}

