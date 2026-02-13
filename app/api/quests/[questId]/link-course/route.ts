import { NextResponse } from "next/server"
import { requireServerUser } from "@/lib/server/auth"
import { integrationStore } from "@/lib/server/integrations/store"
import { badRequest, serverError, unauthorized } from "@/lib/server/http"
import { isLearningProvider } from "@/lib/server/integrations/providers/registry"

export async function POST(request: Request, context: { params: Promise<{ questId: string }> }) {
  try {
    const { userId } = await requireServerUser()
    const { questId } = await context.params
    const parsedQuestId = Number(questId)

    if (Number.isNaN(parsedQuestId)) {
      return badRequest("Invalid questId")
    }

    const body = await request.json()
    const connectionId = String(body.connectionId || "")
    const providerCourseId = String(body.providerCourseId || "")
    const provider = String(body.provider || "")

    if (!connectionId || !providerCourseId || !isLearningProvider(provider)) {
      return badRequest("Invalid payload")
    }

    const connection = integrationStore.getConnection(userId, connectionId)
    if (!connection || connection.provider !== provider) {
      return badRequest("Connection not found for provider")
    }

    const link = integrationStore.upsertQuestLink(userId, {
      questId: parsedQuestId,
      connectionId,
      provider,
      providerCourseId,
    })

    return NextResponse.json({ link })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorized()
    }
    return serverError("Failed to link course")
  }
}

