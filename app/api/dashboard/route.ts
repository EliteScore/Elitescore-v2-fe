import { NextRequest, NextResponse } from "next/server"

const CHALLENGES_BASE_URL = "https://elitescore-challenges-k554v.ondigitalocean.app"

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization")
  const userId = request.headers.get("x-user-id")

  if (!auth || !auth.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing or invalid authorization" }, { status: 401 })
  }
  if (!userId) {
    return NextResponse.json({ message: "Missing X-User-Id header" }, { status: 400 })
  }

  // Challenges API requires both Authorization Bearer and X-User-Id
  const upstreamHeaders: Record<string, string> = {
    Authorization: auth,
    "X-User-Id": userId,
    "Content-Type": "application/json",
  }

  try {
    const res = await fetch(`${CHALLENGES_BASE_URL}/api/dashboard`, {
      method: "GET",
      headers: upstreamHeaders,
    })
    const body = await res.json().catch(() => ({}))
    if (process.env.NODE_ENV === "development") {
      console.debug("[api/dashboard] upstream", { status: res.status, ok: res.ok, keys: typeof body === "object" && body !== null ? Object.keys(body as object) : [] })
    }
    return NextResponse.json(body, { status: res.status })
  } catch (err) {
    console.error("[api/dashboard] proxy error", err)
    return NextResponse.json(
      { message: "Could not reach dashboard service" },
      { status: 502 }
    )
  }
}
