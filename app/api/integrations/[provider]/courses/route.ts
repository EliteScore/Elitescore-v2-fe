import { NextResponse } from "next/server"
import { requireServerUser } from "@/lib/server/auth"
import { listCourses } from "@/lib/server/integrations/service"
import { isLearningProvider } from "@/lib/server/integrations/providers/registry"
import { badRequest, serverError, unauthorized } from "@/lib/server/http"

export async function GET(request: Request, context: { params: Promise<{ provider: string }> }) {
  try {
    const { userId } = await requireServerUser()
    const { provider } = await context.params

    if (!isLearningProvider(provider)) {
      return badRequest("Unsupported provider")
    }

    const url = new URL(request.url)
    const connectionId = url.searchParams.get("connectionId")
    const query = url.searchParams.get("q") || undefined

    if (!connectionId) {
      return badRequest("Missing connectionId")
    }

    const courses = await listCourses({ userId, connectionId, query })
    return NextResponse.json({ courses })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorized()
    }
    return serverError(error instanceof Error ? error.message : "Failed to list courses")
  }
}

