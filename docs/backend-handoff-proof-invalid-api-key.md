# Proof submission: “Invalid API key” (challenges service)

**Audience:** backend / DevOps for `elitescore-challenges` (DigitalOcean app).

**What the frontend does**

- The web app does **not** call your API host directly from the browser. The browser calls this Next.js app:

  - `POST /api/challenges/{userChallengeId}/proofs` (first submit)
  - `POST /api/challenges/{userChallengeId}/proofs/{submissionId}/resubmit` (resubmit)

- Those routes proxy to the upstream service with the same path under:

  `https://elitescore-challenges-k554v.ondigitalocean.app`

  and forward the user’s `Authorization: Bearer …` and optional `X-User-Id`.

**What we see in the product**

- Users sometimes get a red error in the proof modal: **`Invalid API key`** (or similar), returned in the **JSON body** of the response from the proof endpoints.

- That message is not produced by the Next.js proxy; it is passed through from the **upstream** response. So it almost certainly means something on the **challenges service** (or a dependency it calls) is using a **missing, rotated, or wrong key**—for example for an LLM/embedding provider, internal auth, or another third-party API used during proof verification.

**What to check on the challenges service**

1. Environment variables for any AI/ML or external APIs used in the proof flow (e.g. OpenAI, Anthropic, etc.): name, value, and that production/staging are not mixed up.
2. Service logs for the same timestamp as a failed `POST …/proofs` or `…/resubmit` request: stack traces or provider SDK errors mentioning API keys.
3. That the app running on DO has the same env as expected (no empty secret in the deployed app).

**If user JWT is invalid**

- You would usually return **401** with a different message. A plain “Invalid API key” in the **body** while the request reaches proof logic is still consistent with a **server-side** key used **after** the request is accepted, not the end-user’s bearer token.

**Contact**

- Frontend can add friendlier copy, but the underlying fix is **server configuration** on the challenges API side.
