import { NextRequest, NextResponse } from "next/server"

const AUTH_BASE_URL = "https://elitescore-auth-jh8f8.ondigitalocean.app"

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 })
  }

  try {
    const res = await fetch(`${AUTH_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const resBody = await res.json().catch(() => ({}))
    return NextResponse.json(resBody, { status: res.status })
  } catch (err) {
    console.error("[api/auth/reset-password] proxy error", err)
    return NextResponse.json({ message: "Could not reach auth service" }, { status: 502 })
  }
}
