import { NextRequest, NextResponse } from "next/server"

const CHALLENGES_BASE_URL = "https://elitescore-challenges-k554v.ondigitalocean.app"

type RouteContext = {
  params: Promise<{ id: string; submissionId: string }> | { id: string; submissionId: string }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const resolvedParams = await Promise.resolve(context.params)
  const userChallengeId = resolvedParams?.id ?? ""
  const submissionId = resolvedParams?.submissionId ?? ""

  const auth = request.headers.get("authorization")
  const userId = request.headers.get("x-user-id")

  if (!auth || !auth.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing or invalid authorization" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 })
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
      const bodyKeys =
        body && typeof body === "object" ? Object.keys(body as Record<string, unknown>) : []
      console.debug("[api/challenges/[id]/proofs/[submissionId]/resubmit] proxy request", {
        userChallengeId,
        submissionId,
        bodyKeys,
      })
    }

    const res = await fetch(
      `${CHALLENGES_BASE_URL}/api/challenges/${userChallengeId}/proofs/${submissionId}/resubmit`,
      {
        method: "POST",
        headers: upstreamHeaders,
        body: JSON.stringify(body),
      }
    )
    const rawText = await res.text()
    let resBody: unknown = {}
    try {
      resBody = rawText ? JSON.parse(rawText) : {}
    } catch {
      resBody = { message: rawText || "Upstream returned a non-JSON response" }
    }

    if (process.env.NODE_ENV === "development") {
      const aiVerdict =
        resBody && typeof resBody === "object" && "aiVerdict" in resBody
          ? (resBody as { aiVerdict?: unknown }).aiVerdict
          : undefined
      const baseLog = {
        userChallengeId,
        submissionId,
        status: res.status,
        ok: res.ok,
        aiVerdict,
      }
      if (!res.ok) {
        console.debug("[api/challenges/[id]/proofs/[submissionId]/resubmit] proxy response (error)", {
          ...baseLog,
          rawBody: rawText.slice(0, 2000),
        })
      } else {
        console.debug("[api/challenges/[id]/proofs/[submissionId]/resubmit] proxy response", baseLog)
      }
    }

    return NextResponse.json(resBody, { status: res.status })
  } catch (err) {
    console.error("[api/challenges/[id]/proofs/[submissionId]/resubmit] proxy error", err)
    return NextResponse.json(
      { message: "Could not reach proof resubmission service" },
      { status: 502 }
    )
  }
}
