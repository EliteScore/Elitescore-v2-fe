import { NextRequest, NextResponse } from "next/server"

const CHALLENGES_BASE_URL = "https://elitescore-challenges-k554v.ondigitalocean.app"

type RouteContext = {
  params: Promise<{ id: string }> | { id: string }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const resolvedParams = await Promise.resolve(context.params)
  const templateId = resolvedParams?.id ?? ""

  const auth = request.headers.get("authorization")
  const userId = request.headers.get("x-user-id")

  if (!auth || !auth.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing or invalid authorization" }, { status: 401 })
  }

  let bodyJson: unknown
  try {
    bodyJson = await request.json()
  } catch {
    bodyJson = null
  }

  const spectatorEmail =
    bodyJson && typeof bodyJson === "object" && "spectatorEmail" in bodyJson
      ? String((bodyJson as any).spectatorEmail ?? "").trim()
      : ""

  if (!spectatorEmail) {
    return NextResponse.json(
      { message: "spectatorEmail is required" },
      { status: 400 }
    )
  }

  const upstreamHeaders: Record<string, string> = {
    Authorization: auth,
    "Content-Type": "application/json",
  }
  if (userId) {
    upstreamHeaders["X-User-Id"] = userId
  }

  try {
    const res = await fetch(`${CHALLENGES_BASE_URL}/api/challenges/${templateId}/join`, {
      method: "POST",
      headers: upstreamHeaders,
      body: JSON.stringify({ spectatorEmail }),
    })
    const body = await res.json().catch(() => ({}))
    if (process.env.NODE_ENV === "development") {
      console.debug("[api/challenges/[id]/join] upstream", {
        templateId,
        status: res.status,
        ok: res.ok,
        bodyKeys: typeof body === "object" && body !== null ? Object.keys(body as object) : [],
      })
    }
    return NextResponse.json(body, { status: res.status })
  } catch (err) {
    console.error("[api/challenges/[id]/join] proxy error", err)
    return NextResponse.json(
      { message: "Could not reach join challenge service" },
      { status: 502 }
    )
  }
}

