import { cookies } from "next/headers"

export async function requireServerUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("elitescore_user")?.value || cookieStore.get("elitescore_email")?.value

  if (!userId) {
    throw new Error("UNAUTHORIZED")
  }

  return { userId }
}

