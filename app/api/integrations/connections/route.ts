import { NextResponse } from "next/server"
import { requireServerUser } from "@/lib/server/auth"
import { integrationStore } from "@/lib/server/integrations/store"
import { unauthorized, serverError } from "@/lib/server/http"

export async function GET() {
  try {
    const { userId } = await requireServerUser()
    const connections = integrationStore.getConnections(userId)
    return NextResponse.json({ connections })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorized()
    }
    return serverError("Failed to list connections")
  }
}

