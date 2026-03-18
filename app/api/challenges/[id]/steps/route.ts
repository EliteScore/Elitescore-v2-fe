import { NextRequest, NextResponse } from "next/server"

const CHALLENGES_BASE_URL = "https://elitescore-challenges-k554v.ondigitalocean.app"

type RouteContext = {
  params: Promise<{ id: string }> | { id: string }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const resolvedParams = await Promise.resolve(context.params)
  const templateId = resolvedParams?.id ?? ""
  const auth = request.headers.get("authorization")
  const userId = request.headers.get("x-user-id")

  if (process.env.NODE_ENV === "development") {
    console.debug("[api/challenges/[id]/steps] request", {
      templateId,
      hasAuth: !!auth,
      authPrefix: auth?.slice(0, 10) ?? null,
      hasUserId: !!userId,
      userId: userId ?? null,
    })
  }

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

  const upstreamUrl = `${CHALLENGES_BASE_URL}/api/challenges/${templateId}/steps`

  try {
    if (process.env.NODE_ENV === "development") {
      console.debug("[api/challenges/[id]/steps] fetching", { upstreamUrl })
    }

    const res = await fetch(upstreamUrl, {
      method: "GET",
      headers: upstreamHeaders,
    })

    const rawText = await res.text()
    let body: unknown
    try {
      body = rawText ? JSON.parse(rawText) : {}
    } catch {
      body = { _raw: rawText?.slice(0, 500) }
    }

    if (process.env.NODE_ENV === "development") {
      console.debug("[api/challenges/[id]/steps] upstream response", {
        templateId,
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        isArray: Array.isArray(body),
        count: Array.isArray(body) ? (body as unknown[]).length : undefined,
        bodyKeys: typeof body === "object" && body !== null ? Object.keys(body as object) : [],
      })
      if (!res.ok) {
        console.warn("[api/challenges/[id]/steps] upstream error body:", JSON.stringify(body, null, 2).slice(0, 800))
      }
    }

    return NextResponse.json(body, { status: res.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    console.error("[api/challenges/[id]/steps] proxy error", { message, stack, templateId })
    return NextResponse.json(
      { message: "Could not reach challenge steps service" },
      { status: 502 }
    )
  }
}

