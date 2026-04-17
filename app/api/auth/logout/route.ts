import { NextRequest, NextResponse } from "next/server"

const AUTH_BASE_URL = "https://elitescore-auth-jh8f8.ondigitalocean.app"

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing or invalid authorization" }, { status: 401 })
  }

  try {
    const res = await fetch(`${AUTH_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    })
    const resBody = await res.json().catch(() => ({}))
    return NextResponse.json(resBody, { status: res.status })
  } catch (err) {
    console.error("[api/auth/logout] proxy error", err)
    return NextResponse.json({ message: "Could not reach auth service" }, { status: 502 })
  }
}
