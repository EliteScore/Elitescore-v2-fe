# Backend handoff: proof flow & “Invalid API key”

Short reference for debugging proof submission when users or the web app see authentication or provider-key errors.

## How traffic reaches this service

The **Next.js app proxies** API calls to the challenges service. The browser talks to Next; Next forwards to this backend (for example with the user’s `Authorization` header). **“Invalid API key” (or similar) in this flow is not a browser-only check** — it reflects what happens **server-side** in the challenges stack (this service and its outbound calls to the AI provider).

In this repository, the proxy routes are `app/api/challenges/[id]/proofs/route.ts` and `app/api/challenges/[id]/proofs/[submissionId]/resubmit/route.ts` (base URL in code points at the DigitalOcean challenges app). User-facing file upload to Supabase is separate; the JSON body to these endpoints may include public attachment URLs. For Storage path, RLS, and when **“Invalid API key”** comes from the **Supabase** client (wrong project URL/anon key / session) vs this service’s **OpenAI** key, see `docs/fe-proof-file-upload-behavior.md` (§2 and §5).

## Endpoints involved

Proof submission hits this service on:

| Method | Path |
|--------|------|
| `POST` | `/api/challenges/{userChallengeId}/proofs` |
| `POST` | `/api/challenges/{userChallengeId}/proofs/{submissionId}/resubmit` |

When reproducing, tail **application logs** for these requests and for **`OpenAiVerificationService`** (OpenAI HTTP failures are logged with the submission id).

## What to verify

1. **Provider API key in deployment**  
   This app reads **`OPENAI_API_KEY`** (mapped in `application.properties` as `openai.api-key`). Confirm it is set correctly on **DigitalOcean App Platform** (or whatever hosts this service): no typos, no expired/revoked key, correct project/org if keys are scoped.

2. **Other env**  
   Optional tuning: `OPENAI_MODEL`, confidence env vars (`OPENAI_CONF_HIGH`, etc.) — wrong model name can cause provider errors; key issues usually show up as **401** from OpenAI.

3. **JWT / user header**  
   Protected routes expect a valid Bearer token; the gateway injects **`X-User-Id`**. A bad user JWT is a separate class of errors from an **OpenAI** API key problem — distinguish 401 on **ingress** vs failures when **calling OpenAI** after the proof is accepted.

4. **Logs**  
   Correlate timestamps: `POST …/proofs` or `…/resubmit` → log lines for that submission id → OpenAI request outcome.

## Reference in repo

- Challenge controller (routes above): `src/main/java/com/elitescore/challenge/controller/ChallengeController.java`
- OpenAI integration: `src/main/java/com/elitescore/ai/OpenAiVerificationService.java`
- Public API overview: `docs/API_ENDPOINTS.md`

*(Paths under `src/` and `docs/API_ENDPOINTS.md` apply to the **challenges** backend repository, not this Next.js repo.)*
