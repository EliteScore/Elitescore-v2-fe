import { NextResponse } from "next/server"
import { requireServerUser } from "@/lib/server/auth"
import { getConnectionAuthUrl } from "@/lib/server/integrations/service"
import { isLearningProvider } from "@/lib/server/integrations/providers/registry"
import { badRequest, serverError, unauthorized } from "@/lib/server/http"

export async function POST(_request: Request, context: { params: Promise<{ provider: string }> }) {
  try {
    const { userId } = await requireServerUser()
    const { provider } = await context.params

    if (!isLearningProvider(provider)) {
      return badRequest("Unsupported provider")
    }

    const authUrl = getConnectionAuthUrl(provider, userId)
    return NextResponse.json({ authUrl })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorized()
    }
    return serverError("Failed to initialize provider connection")
  }
}

