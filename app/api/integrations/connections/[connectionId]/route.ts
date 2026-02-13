import { NextResponse } from "next/server"
import { requireServerUser } from "@/lib/server/auth"
import { integrationStore } from "@/lib/server/integrations/store"
import { unauthorized, serverError } from "@/lib/server/http"

export async function DELETE(_request: Request, context: { params: Promise<{ connectionId: string }> }) {
  try {
    const { userId } = await requireServerUser()
    const { connectionId } = await context.params
    integrationStore.deleteConnection(userId, connectionId)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorized()
    }
    return serverError("Failed to delete connection")
  }
}

