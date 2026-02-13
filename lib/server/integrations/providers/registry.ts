import type { LearningProvider } from "@/lib/types/integrations"
import type { LearningProviderAdapter } from "@/lib/server/integrations/providers/base"
import { courseraEnterpriseAdapter } from "@/lib/server/integrations/providers/coursera-enterprise"
import { udemyBusinessAdapter } from "@/lib/server/integrations/providers/udemy-business"

const adapters: Record<LearningProvider, LearningProviderAdapter> = {
  udemy_business: udemyBusinessAdapter,
  coursera_enterprise: courseraEnterpriseAdapter,
}

export function getProviderAdapter(provider: LearningProvider) {
  return adapters[provider]
}

export function isLearningProvider(value: string): value is LearningProvider {
  return value === "udemy_business" || value === "coursera_enterprise"
}

