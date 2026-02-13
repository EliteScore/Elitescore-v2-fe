import { NextResponse } from "next/server"
import { isLearningProvider } from "@/lib/server/integrations/providers/registry"
import { syncProviderForAllUsers } from "@/lib/server/integrations/service"
import { badRequest, serverError } from "@/lib/server/http"

export async function POST(request: Request, context: { params: Promise<{ provider: string }> }) {
  const secret = request.headers.get("x-internal-sync-secret")
  if (!secret || secret !== process.env.INTERNAL_SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { provider } = await context.params

    if (!isLearningProvider(provider)) {
      return badRequest("Unsupported provider")
    }

    const result = await syncProviderForAllUsers(provider)
    return NextResponse.json(result)
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Failed to sync provider")
  }
}

