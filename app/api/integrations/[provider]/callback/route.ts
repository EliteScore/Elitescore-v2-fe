import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { completeConnectionFromCode } from "@/lib/server/integrations/service"
import { isLearningProvider } from "@/lib/server/integrations/providers/registry"

export async function GET(request: Request, context: { params: Promise<{ provider: string }> }) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/challenges?integration=missing_code", request.url))
  }

  const { provider } = await context.params
  if (!isLearningProvider(provider)) {
    return NextResponse.redirect(new URL("/challenges?integration=invalid_provider", request.url))
  }

  const cookieStore = await cookies()
  const userId = cookieStore.get("elitescore_user")?.value || cookieStore.get("elitescore_email")?.value
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    await completeConnectionFromCode({ userId, provider, code })
    return NextResponse.redirect(new URL("/challenges?integration=connected", request.url))
  } catch {
    return NextResponse.redirect(new URL("/challenges?integration=failed", request.url))
  }
}

