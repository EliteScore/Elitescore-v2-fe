import { NextResponse } from "next/server"
import { requireServerUser } from "@/lib/server/auth"
import { syncQuestProgress } from "@/lib/server/integrations/service"
import { badRequest, serverError, unauthorized } from "@/lib/server/http"

const cooldownByUserQuest = new Map<string, number>()
const COOLDOWN_MS = 60 * 1000

export async function POST(_request: Request, context: { params: Promise<{ questId: string }> }) {
  try {
    const { userId } = await requireServerUser()
    const { questId } = await context.params
    const parsedQuestId = Number(questId)

    if (Number.isNaN(parsedQuestId)) {
      return badRequest("Invalid questId")
    }

    const key = `${userId}:${parsedQuestId}`
    const now = Date.now()
    const last = cooldownByUserQuest.get(key) ?? 0
    if (now - last < COOLDOWN_MS) {
      return badRequest("Please wait before refreshing this quest again")
    }

    const progress = await syncQuestProgress({ userId, questId: parsedQuestId })
    cooldownByUserQuest.set(key, now)

    return NextResponse.json({ progress })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorized()
    }
    return serverError(error instanceof Error ? error.message : "Failed to refresh quest progress")
  }
}

