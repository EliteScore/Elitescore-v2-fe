import { NextResponse } from "next/server"
import { requireServerUser } from "@/lib/server/auth"
import { integrationStore } from "@/lib/server/integrations/store"
import { badRequest, serverError, unauthorized } from "@/lib/server/http"

export async function GET(request: Request) {
  try {
    const { userId } = await requireServerUser()
    const url = new URL(request.url)
    const questIdsParam = url.searchParams.get("questIds")

    if (!questIdsParam) {
      return badRequest("Missing questIds")
    }

    const questIds = questIdsParam
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((value) => !Number.isNaN(value))

    const states = integrationStore.getProgressBulk(userId, questIds)
    return NextResponse.json({ states })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorized()
    }
    return serverError("Failed to fetch sync states")
  }
}

