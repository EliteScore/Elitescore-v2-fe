import { NextRequest, NextResponse } from "next/server"

const AUTH_BASE_URL = "https://elitescore-auth-jh8f8.ondigitalocean.app"

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing or invalid authorization" }, { status: 401 })
  }

  try {
    const res = await fetch(`${AUTH_BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    })
    const body = await res.json().catch(() => ({}))
    return NextResponse.json(body, { status: res.status })
  } catch (err) {
    console.error("[api/profile/me] GET proxy error", err)
    return NextResponse.json(
      { message: "Could not reach profile service" },
      { status: 502 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing or invalid authorization" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 })
  }

  try {
    const res = await fetch(`${AUTH_BASE_URL}/users/me`, {
      method: "PATCH",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const resBody = await res.json().catch(() => ({}))
    if (process.env.NODE_ENV === "development") {
      console.debug("[api/profile/me] PATCH", { status: res.status, ok: res.ok, body: resBody })
    }
    return NextResponse.json(resBody, { status: res.status })
  } catch (err) {
    console.error("[api/profile/me] PATCH proxy error", err)
    return NextResponse.json(
      { message: "Could not reach profile service" },
      { status: 502 }
    )
  }
}
