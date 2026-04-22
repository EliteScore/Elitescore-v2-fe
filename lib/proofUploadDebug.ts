/**
 * Opt-in console logs for proof file upload + Supabase session.
 * Enable: NEXT_PUBLIC_DEBUG_PROOF_UPLOAD=1 (or "true") in Vercel / .env.local, then redeploy.
 * Also on automatically when NODE_ENV === "development".
 */

export function isProofUploadDebugEnabled(): boolean {
  if (typeof process === "undefined") return false
  return (
    process.env.NEXT_PUBLIC_DEBUG_PROOF_UPLOAD === "1" ||
    process.env.NEXT_PUBLIC_DEBUG_PROOF_UPLOAD === "true" ||
    process.env.NODE_ENV === "development"
  )
}

export function proofUploadDebug(...args: unknown[]): void {
  if (!isProofUploadDebugEnabled()) return
  console.log("[proof-upload]", ...args)
}

export function supabaseUrlHost(url: string): string {
  const u = (url ?? "").trim()
  if (!u) return "(empty)"
  try {
    return new URL(u).hostname
  } catch {
    return "(invalid url)"
  }
}

/** Safe for logs; do not log full user ids in shared screenshots if you need stricter redaction. */
export function shortIdForLog(id: string, visible = 8): string {
  if (!id) return "(empty)"
  if (id.length <= visible + 4) return id
  return `${id.slice(0, visible)}…${id.slice(-4)}`
}
