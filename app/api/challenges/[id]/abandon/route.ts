import { NextRequest, NextResponse } from "next/server"

const CHALLENGES_BASE_URL = "https://elitescore-challenges-k554v.ondigitalocean.app"

type RouteContext = {
  params: Promise<{ id: string }> | { id: string }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const resolvedParams = await Promise.resolve(context.params)
  const userChallengeId = resolvedParams?.id ?? ""

  const auth = request.headers.get("authorization")
  const userId = request.headers.get("x-user-id")

  if (!auth || !auth.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing or invalid authorization" }, { status: 401 })
  }

  const upstreamHeaders: Record<string, string> = {
    Authorization: auth,
    "Content-Type": "application/json",
  }
  if (userId) {
    upstreamHeaders["X-User-Id"] = userId
  }

  try {
    const res = await fetch(`${CHALLENGES_BASE_URL}/api/challenges/${userChallengeId}/abandon`, {
      method: "POST",
      headers: upstreamHeaders,
    })
    const body = await res.json().catch(() => ({}))
    if (process.env.NODE_ENV === "development") {
      console.debug("[api/challenges/[id]/abandon] upstream", {
        userChallengeId,
        status: res.status,
        ok: res.ok,
      })
    }
    return NextResponse.json(body, { status: res.status })
  } catch (err) {
    console.error("[api/challenges/[id]/abandon] proxy error", err)
    return NextResponse.json(
      { message: "Could not reach abandon challenge service" },
      { status: 502 }
    )
  }
}
