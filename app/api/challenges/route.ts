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
    const res = await fetch(`${CHALLENGES_BASE_URL}/api/challenges`, {
      method: "GET",
      headers: upstreamHeaders,
    })
    const body = await res.json().catch(() => ({}))
    if (process.env.NODE_ENV === "development") {
      console.debug("[api/challenges] upstream", {
        status: res.status,
        ok: res.ok,
        isArray: Array.isArray(body),
        count: Array.isArray(body) ? body.length : undefined,
      })
    }
    return NextResponse.json(body, { status: res.status })
  } catch (err) {
    console.error("[api/challenges] proxy error", err)
    return NextResponse.json(
      { message: "Could not reach challenges service" },
      { status: 502 }
    )
  }
}

