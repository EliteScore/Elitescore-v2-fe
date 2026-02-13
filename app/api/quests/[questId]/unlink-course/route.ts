import { NextResponse } from "next/server"
import { requireServerUser } from "@/lib/server/auth"
import { integrationStore } from "@/lib/server/integrations/store"
import { badRequest, serverError, unauthorized } from "@/lib/server/http"

export async function POST(_request: Request, context: { params: Promise<{ questId: string }> }) {
  try {
    const { userId } = await requireServerUser()
    const { questId } = await context.params
    const parsedQuestId = Number(questId)

    if (Number.isNaN(parsedQuestId)) {
      return badRequest("Invalid questId")
    }

    integrationStore.removeQuestLink(userId, parsedQuestId)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorized()
    }
    return serverError("Failed to unlink course")
  }
}

