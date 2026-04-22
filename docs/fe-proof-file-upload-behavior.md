# Frontend: document / screenshot upload for daily proof

**Use this** as context for backend, QA, Supabase admins, or another agent.

On the challenge detail page, the user opens **Submit proof** and can pick the **Upload** tab. They choose up to **10 files** (max **15 MB** each): screenshots, PDFs, docs, etc. (see the file input `accept` list in `app/challenges/[id]/page.tsx`). Files stay in **browser memory** until submit; the user can remove items before sending.

On **Submit** or **Resubmit**, the app validates, uploads to storage (if any files), then calls the challenges API through Next.js proxies. Implementation: `uploadProofFilesToStorage`, `removeProofFilesFromSupabase`, `submitProof`, `resubmitProof` in `app/challenges/[id]/page.tsx`.

---

## 1. Path shape (required for RLS)

The **first** path segment under the `proofs` bucket must be the **signed-in user’s Supabase user id** (same as `auth.uid()`), because storage policy is typically:

`bucket_id = 'proofs' AND auth.uid()::text = (storage.foldername(name))[1]`

**Use:**

`{userId}/{userChallengeId}/{uniqueFileName}`

**Do not** use `challengeId/userId/...`, and **do not** omit the user folder.

The app builds paths as:

`{userId}/${userChallengeId}/${Date.now()}-${index}-${sanitizedFileName}`

(`userId` from `ensureSupabaseSession` / session; `userChallengeId` is the enrollment id for the API.)

---

## 2. Auth on every upload

Use the **anon** key in the client plus the **user’s session** (JWT) — the same Supabase client that has run `setSession` / has a valid `supabase.auth` session. Uploads run **as that user**. Wrong project URL, wrong anon key, or no session often surfaces as **“Invalid API key”** or other **auth** errors from the client, **not** as RLS row failures (those are usually **403** on Storage).

`ensureSupabaseSession` in this codebase aligns the in-memory app token with Supabase before `storage.from(...).upload`.

---

## 3. Public URL sent to the API

`getPublicUrl` **only builds a string**; it does not grant access by itself. Whether `attachments[].url` works for the challenges service (e.g. OpenAI fetching the file) depends on **bucket** and **policies**:

- **Public** bucket: the URL should be fetchable with a plain HTTP GET (no special headers).
- **Private** bucket: a bare public URL may **403**; you may need **signed** URLs (often server-side) or read policies and an agreed access pattern.

**Align with backend:** they must be able to **HTTP GET** each `attachments[].url` you send, or the pipeline must be changed to use signed URLs / a backend proxy.

---

## 4. Cleanup on failure

After a **failed** API response, a **rejected** AI verdict, or a **network error** after upload, the client calls **`remove()`** for the same object paths so unaccepted attempts do not keep objects.

**Supabase / policy note:** RLS may allow **INSERT** only. Without a **DELETE** policy (mirroring the same “first folder = `auth.uid()`” rule as upload), `remove()` can fail with **permission** errors even when upload succeeded. The Supabase project should add **DELETE** for the same folder rule the team uses for INSERT. The app logs storage cleanup errors in **development** only; failed deletes do not block the UI, but can leave orphan objects.

---

## 5. Debugging

| Symptom | What to check |
|--------|----------------|
| “Invalid API key” / JWS from **Supabase** | Project URL, anon key, session (see §2). Compare failing request: **Storage** `.../storage/v1/...` vs **challenges** API. |
| **403** / permission on **Storage** | RLS: path first segment, policies for INSERT/DELETE. |
| Proof API fails after upload | Next proxy to challenges service; see `docs/backend-handoff-proof-flow-invalid-api-key.md` for provider keys and server logs. |

In **Network** tab, identify whether the failing call is **Supabase storage** or **`/api/challenges/.../proofs`** (or resubmit) — the fixes differ.

---

## API request shape (reminder)

After upload, the client sends JSON with optional `proofText`, `proofLink`, `notes`, and `attachments: [{ url, assetType }]` to:

- `POST /api/challenges/{userChallengeId}/proofs`
- `POST /api/challenges/{userChallengeId}/proofs/{submissionId}/resubmit`

(Proxied to the challenges service; see `app/api/challenges/.../proofs/`.)

Env: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`).

**Vercel:** Add both for **Production** and **Preview** (and **Development** if you use `vercel dev`). Values are inlined at build time: **redeploy** after any change. Avoid accidental spaces in the dashboard; the client **trims** them, but the Supabase key must be complete and match the same project as your auth.

**Debug logging:** Set `NEXT_PUBLIC_DEBUG_PROOF_UPLOAD=1` (or `true`) and redeploy. In the browser **Console**, lines prefixed with `[proof-upload]` trace session attachment, per-file `storage.upload`, public URL host, cleanup `remove`, and the proof API `fetch` / response. **Enabled automatically in `NODE_ENV === development`**, so you see logs on `next dev` without setting the variable.
