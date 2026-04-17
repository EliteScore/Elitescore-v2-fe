import { NextRequest, NextResponse } from "next/server"

const CHALLENGES_BASE_URL = "https://elitescore-challenges-k554v.ondigitalocean.app"

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing or invalid authorization" }, { status: 401 })
  }

  const page = request.nextUrl.searchParams.get("page") ?? "0"
  const size = request.nextUrl.searchParams.get("size") ?? "20"

  const upstreamParams = new URLSearchParams({ page, size })
  const userId = request.headers.get("x-user-id")
  const headers: Record<string, string> = {
    Authorization: auth,
    "Content-Type": "application/json",
  }
  if (userId) {
    headers["X-User-Id"] = userId
  }

  try {
    if (process.env.NODE_ENV === "development") {
      console.debug("[api/leaderboard] proxy request", {
        upstreamUrl: `${CHALLENGES_BASE_URL}/api/leaderboard?${upstreamParams.toString()}`,
        page,
        size,
        hasAuthorization: Boolean(auth),
        userId: userId ?? null,
      })
    }

    const res = await fetch(`${CHALLENGES_BASE_URL}/api/leaderboard?${upstreamParams.toString()}`, {
      method: "GET",
      headers,
    })
    const body = await res.json().catch(() => ({}))
    if (process.env.NODE_ENV === "development") {
      console.debug("[api/leaderboard] proxy response", {
        status: res.status,
        ok: res.ok,
        entriesCount:
          body && typeof body === "object" && Array.isArray((body as { entries?: unknown[] }).entries)
            ? ((body as { entries: unknown[] }).entries.length)
            : 0,
        totalPages:
          body && typeof body === "object" && typeof (body as { totalPages?: unknown }).totalPages === "number"
            ? (body as { totalPages: number }).totalPages
            : null,
        bodyPreview: body,
      })
    }
    return NextResponse.json(body, { status: res.status })
  } catch (err) {
    console.error("[api/leaderboard] proxy error", err)
    return NextResponse.json({ message: "Could not reach leaderboard service" }, { status: 502 })
  }
}
