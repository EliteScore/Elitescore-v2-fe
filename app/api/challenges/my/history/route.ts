import { NextRequest, NextResponse } from "next/server"

const CHALLENGES_BASE_URL = "https://elitescore-challenges-k554v.ondigitalocean.app"

export async function GET(request: NextRequest) {
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
    if (process.env.NODE_ENV === "development") {
      console.debug("[api/challenges/my/history] proxy request", {
        hasAuth: true,
        hasUserId: Boolean(userId),
      })
    }

    const res = await fetch(`${CHALLENGES_BASE_URL}/api/challenges/my/history`, {
      method: "GET",
      headers: upstreamHeaders,
    })
    const body = await res.json().catch(() => ({}))

    if (process.env.NODE_ENV === "development") {
      const currentCount =
        body && typeof body === "object" && Array.isArray((body as { current?: unknown }).current)
          ? (body as { current: unknown[] }).current.length
          : undefined
      const historyCount =
        body && typeof body === "object" && Array.isArray((body as { history?: unknown }).history)
          ? (body as { history: unknown[] }).history.length
          : undefined
      console.debug("[api/challenges/my/history] proxy response", {
        status: res.status,
        ok: res.ok,
        currentCount,
        historyCount,
      })
    }

    return NextResponse.json(body, { status: res.status })
  } catch (err) {
    console.error("[api/challenges/my/history] proxy error", err)
    return NextResponse.json(
      { message: "Could not reach challenge history service" },
      { status: 502 }
    )
  }
}

