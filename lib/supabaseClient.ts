import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import { proofUploadDebug, shortIdForLog, supabaseUrlHost } from "./proofUploadDebug"

let cached: { client: SupabaseClient; url: string; key: string } | null = null

function getPublicSupabaseEnv(): { url: string; key: string } {
  return {
    url: (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim(),
    key: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim(),
  }
}

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null
  const { url, key } = getPublicSupabaseEnv()
  if (!url || !key) {
    proofUploadDebug("getSupabaseBrowserClient: missing env", {
      hasUrl: Boolean(url),
      hasKey: Boolean(key),
    })
    return null
  }
  if (cached && cached.url === url && cached.key === key) return cached.client

  proofUploadDebug("getSupabaseBrowserClient: creating client", {
    host: supabaseUrlHost(url),
    anonKeyLength: key.length,
  })
  const client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
  cached = { client, url, key }
  return client
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
    proofUploadDebug("ensureSupabaseSession: no elitescore_access_token in localStorage")
    return { userId: null, error: "Not signed in (missing access token)." }
  }

  const { data: existing } = await client.auth.getUser(accessToken)
  if (existing?.user?.id) {
    proofUploadDebug("ensureSupabaseSession: getUser succeeded", {
      userId: shortIdForLog(existing.user.id),
    })
    const { error: setErr } = await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    if (setErr) {
      proofUploadDebug("ensureSupabaseSession: setSession failed after getUser", {
        message: setErr.message,
        name: (setErr as { name?: string }).name,
      })
      return { userId: null, error: setErr.message }
    }
    proofUploadDebug("ensureSupabaseSession: setSession ok (getUser path)")
    return { userId: existing.user.id, error: null }
  }

  proofUploadDebug("ensureSupabaseSession: getUser no user, trying setSession only")
  const { data: session, error: sessionError } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
  if (sessionError || !session?.user?.id) {
    // Do not fall back to storedUserId: Storage uses the JWT on the client session;
    // a failed setSession means uploads would fail with errors like "Invalid Compact JWS".
    proofUploadDebug("ensureSupabaseSession: setSession path failed", {
      message: sessionError?.message,
      hasUser: Boolean(session?.user?.id),
    })
    return {
      userId: null,
      error:
        sessionError?.message ??
        "Could not attach the EliteScore session to Supabase. File uploads may fail.",
    }
  }
  proofUploadDebug("ensureSupabaseSession: setSession ok (fallback path)", {
    userId: shortIdForLog(session.user.id),
  })
  return { userId: session.user.id, error: null }
}
