import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

let cachedClient: SupabaseClient | null = null

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null
  if (cachedClient) return cachedClient

  cachedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
  return cachedClient
}

/**
 * Ensures the Supabase client session matches the EliteScore auth tokens we
 * already store in localStorage. Supabase RLS/Storage policies use
 * `auth.uid()` which maps to the access token's `sub` claim, so we must set
 * the session before any authenticated storage call.
 */
export async function ensureSupabaseSession(
  client: SupabaseClient
): Promise<{ userId: string | null; error: string | null }> {
  if (typeof window === "undefined") {
    return { userId: null, error: "Supabase session is only available on the client." }
  }

  const accessToken = localStorage.getItem("elitescore_access_token")
  const refreshToken = localStorage.getItem("elitescore_refresh_token") ?? ""

  if (!accessToken) {
    return { userId: null, error: "Not signed in (missing access token)." }
  }

  const { data: existing } = await client.auth.getUser(accessToken)
  if (existing?.user?.id) {
    const { error: setErr } = await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    if (setErr) {
      return { userId: null, error: setErr.message }
    }
    return { userId: existing.user.id, error: null }
  }

  const { data: session, error: sessionError } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
  if (sessionError || !session?.user?.id) {
    // Do not fall back to storedUserId: Storage uses the JWT on the client session;
    // a failed setSession means uploads would fail with errors like "Invalid Compact JWS".
    return {
      userId: null,
      error:
        sessionError?.message ??
        "Could not attach the EliteScore session to Supabase. File uploads may fail.",
    }
  }
  return { userId: session.user.id, error: null }
}
