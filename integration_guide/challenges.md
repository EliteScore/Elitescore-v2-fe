# EliteScore Challenges — API Reference

**Base URL:** `https://elitescore-challenges-k554v.ondigitalocean.app`  
**OpenAPI / Swagger UI:** `https://elitescore-challenges-k554v.ondigitalocean.app/swagger-ui.html` · `https://elitescore-challenges-k554v.ondigitalocean.app/api-docs`

---

## Authentication

All protected endpoints require a valid JWT.

| Header | Value |
|--------|-------|
| **Authorization** | `Bearer <supabase_session_access_token>` |

The JWT is validated via Supabase JWKS. The `sub` claim (user ID) is injected internally as `X-User-Id`; clients send the bearer token only.

**Frontend:** Use `session.access_token` from Supabase Auth and send `Authorization: Bearer <token>` on every API request. To obtain the token: signup or login via the **Auth API** (see `docs/auth.endpoints`); that service is verified working without 401 when the client sends a valid Bearer token.

---

## Error Format

All errors follow [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457):

```json
{
  "type": "about:blank",
  "title": "Conflict",
  "status": 409,
  "detail": "You are already enrolled in this challenge"
}
```

| Status | When |
|--------|------|
| 401 | Missing or invalid JWT |
| 400 | Validation failure, missing header, malformed body |
| 403 | User does not own the resource |
| 404 | Entity not found |
| 409 | Invalid state transition or duplicate action |
| 410 | Resubmit window expired |
| 500 | Unexpected server error |

---

## Resource: DashboardResource  
**Path Prefix:** `/api/dashboard`

### GET /api/dashboard

**Summary:** Unified home dashboard — EliteScore, global rank, streaks, recent score gains, leaderboard preview, recommended challenges.  
**Auth:** required (User)  
**Produces:** application/json

**Headers:** `Authorization: Bearer <token>`

**Responses:**

- **200 OK** — Full dashboard payload Body: `DashboardResponse`
  - `eliteScore` (int) — user's current EliteScore
  - `globalRank` (int) — rank on global leaderboard
  - `percentile` (Double) — percentile 0–100 (you beat this % of users)
  - `streaks` — `{ streakCurrent, streakLongest, lastActiveAt }`
  - `recentScoreGains` — last 10 score events: `{ eventType, eliteScoreDelta, createdAt }[]`
  - `leaderboardPreview` — `{ title, summary, entries }` (nearby peers)
  - `recommendedChallenges` — up to 5 templates (excludes enrolled, sorted by completion rate then difficulty)
- **404 Not Found** — User not found or not in leaderboard Body: ProblemDetails
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- Single round-trip for the home view. Recommendations exclude challenges the user has enrolled in (any status); sorted by completion rate then difficulty.

---

## Resource: ChallengeResource  
**Path Prefix:** `/api/challenges`

Missed days and challenge failure are applied automatically by the backend (scheduler + resubmit flow). There are no endpoints for manually failing a challenge or penalizing a day — see **Automated Challenge Lifecycle** below.

### GET /api/challenges

**Summary:** List all active challenge templates.  
**Auth:** required (User)  
**Produces:** application/json

**Headers:** `Authorization: Bearer <token>`

**Responses:**

- **200 OK** — List of challenge templates Body: `ChallengeTemplate[]`
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- Returns templates where `active = true`.
- Fields include: `id`, `name`, `track`, `description`, `durationDays`, `dailyRewardEliteScore`, `missedDayPenalty`, `maxMissedDays`, `completionBonus`, `quitPenalty`, etc.

---

### GET /api/challenges/{templateId}/steps

**Summary:** List roadmap steps for a challenge template, ordered by `sort_order` then `day`.  
**Auth:** required (User)  
**Produces:** application/json

**Path Params:**

- `templateId` (uuid) — required

**Headers:** `Authorization: Bearer <token>`

**Responses:**

- **200 OK** — List of roadmap steps Body: `ChallengeRoadmapStep[]`
- **404 Not Found** — Template not found Body: ProblemDetails
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- Each step includes: `id`, `challengeTemplateId`, `week`, `day`, `title`, `instructions`, `expectedProof`, `stepType`, `resourceLink`, `proofTypeRequired`, `requiresProof`, `submissionRequirements`, `rewardXp`, `rewardEliteScore`, `sortOrder`.

---

### GET /api/challenges/my

**Summary:** List the authenticated user's challenge enrollments.  
**Auth:** required (User)  
**Produces:** application/json

**Headers:** `Authorization: Bearer <token>`

**Responses:**

- **200 OK** — List of user's enrollments Body: `UserChallenge[]`
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- Returns enrollments for the user identified by JWT `sub`.
- Fields: `id`, `userId`, `challengeTemplateId`, `status`, `startDate`, `endDate`, `currentDay`, `missedDaysCount`, `createdAt`.

---

### POST /api/challenges/{templateId}/join

**Summary:** Join (start) a challenge. Creates a `UserChallenge` with `status=active`, `currentDay=0`, and sends invite/welcome email to `spectatorEmail`.  
**Auth:** required (User)  
**Consumes:** application/json  
**Produces:** application/json

**Path Params:**

- `templateId` (uuid) — required

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "spectatorEmail": "friend@example.com"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| spectatorEmail | string | Yes | Accountability partner's email |

**Responses:**

- **201 Created** — Challenge joined successfully Body: `UserChallenge`
- **400 Bad Request** — Missing body or required fields Body: ProblemDetails
- **404 Not Found** — Template or user not found Body: ProblemDetails
- **409 Conflict** — Already enrolled or challenge inactive Body: ProblemDetails
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- Creates spectator link for accountability.
- Sends invite/welcome email to `spectatorEmail` immediately after successful join.
- Fails if user is already enrolled in the same template.

---

### POST /api/challenges/{userChallengeId}/proofs

**Summary:** Submit daily proof for the next day of an active challenge. The proof row is saved in a short DB transaction, then OpenAI is called **outside** that transaction; a second transaction applies the verdict (so DB connections are not held during AI latency).  
**Auth:** required (User)  
**Consumes:** application/json  
**Produces:** application/json

**Path Params:**

- `userChallengeId` (uuid) — required

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "proofText": "Completed module 3. Key takeaway: normalization reduces redundancy...",
  "proofLink": "https://github.com/user/project",
  "notes": "Took extra time on the JOIN exercises",
  "attachments": [
    { "url": "https://xyz.supabase.co/storage/v1/object/public/proofs/screenshot.png", "assetType": "image" }
  ]
}
```

| Field | Type | Required | Constraints / description |
|-------|------|----------|---------------------------|
| proofText | string | No* | Max **5000** characters. Omit or blank if you use link/attachments only. |
| proofLink | string | No* | Max **500** characters. If present and non-blank, must start with **`http://`** or **`https://`**. |
| notes | string | No | Max **1000** characters. |
| attachments | AssetDto[] | No* | Max **10** elements. Each element is validated when present. |
| attachments[].url | string | Yes† | Non-blank; max **1000** chars; must match **`http://...`** or **`https://...`**. |
| attachments[].assetType | string | No | If present, must be exactly **`image`**, **`video`**, or **`file`** (default **`file`** when omitted). |

\* At least one of `proofText`, `proofLink`, or `attachments` (non-empty list) must be provided — enforced in the service after JSON validation.

† If you include an attachment object in the array, `url` is required; omit the object entirely rather than sending `{ "url": null }`.

**Validation (400):** The body is validated with Bean Validation (`@Valid`). On failure, **400** returns `ProblemDetails` whose `detail` lists field errors (e.g. `proofLink: proofLink must start with http:// or https://`). This is separate from the “empty proof” rule above.

**Responses:**

- **201 Created** — Proof submitted; AI verdict applied. Body: `ProofSubmission`.
  - **`aiVerdict`** (present on this response): `"accepted"` \| `"rejected"` — reflects the synchronous AI outcome only (not stored in DB; omitted on other endpoints that return `ProofSubmission` without a fresh AI run).
- **400 Bad Request** — Empty proof (no text, link, or attachments), **or** request body failed Bean Validation (sizes, URL patterns, attachment rules). Body: `ProblemDetails`
- **403 Forbidden** — User does not own the user challenge Body: ProblemDetails
- **404 Not Found** — User challenge not found Body: ProblemDetails
- **409 Conflict** — Challenge not active, **or** a proof for that calendar day already exists in a terminal/pending state (`submitted`, `needs_review`, `verified`, or **`rejected`** after a missed day — you cannot start a new submission for the same day). Body: ProblemDetails
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- **AI verification is binary (accept / reject only) — no admin involvement:**
  - **Accepted** (internal AI verdict `pass`, confidence >= 0.75) → response `aiVerdict: "accepted"`, proof `verified`, score awarded, `currentDay` advanced immediately
  - **Rejected** (internal AI verdict `rejected`, or low confidence) → response `aiVerdict: "rejected"`, proof status `needs_review` (means “try again”, not a human queue), 24-hour resubmit window, `aiFeedback` from the model
- If AI is temporarily unavailable (network/rate-limit) → `aiVerdict: "rejected"` and the same 24-hr resubmit window with a retry message.
- **Data integrity:** The database enforces at most one proof row per `(user_challenge_id, challenge_day)` (unique constraint). The API checks duplicate status before insert; the constraint covers race conditions.

---

### POST /api/challenges/{userChallengeId}/proofs/{submissionId}/resubmit

**Summary:** Resubmit proof after AI feedback, within the 24-hour window. Same request body and validation rules as submit; OpenAI runs between DB transactions (same pattern as submit).  
**Auth:** required (User)  
**Consumes:** application/json  
**Produces:** application/json

**Path Params:**

- `userChallengeId` (uuid) — required — must match the enrollment that owns this proof (`submission.user_challenge_id`). A mismatch returns **404** (“Proof does not belong to this challenge”).
- `submissionId` (uuid) — required

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as `POST /api/challenges/{userChallengeId}/proofs` (including Bean Validation on sizes, URLs, and attachments).

**Responses:**

- **200 OK** — Resubmission processed. Body: `ProofSubmission` with **`aiVerdict`**: `"accepted"` if verified; `"rejected"` if the AI rejects again (missed day applied, proof may end `rejected`).
- **400 Bad Request** — Empty proof or Bean Validation failure Body: `ProblemDetails`
- **403 Forbidden** — User does not own the proof Body: ProblemDetails
- **404 Not Found** — Proof submission not found, user challenge not found, **or** `submissionId` does not belong to the given `userChallengeId` Body: ProblemDetails
- **409 Conflict** — Proof not in `needs_review`, or challenge inactive Body: ProblemDetails
- **410 Gone** — Resubmit window expired Body: ProblemDetails
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- Resubmit outcomes: AI `pass` → score awarded, day advanced; AI `rejected` (attempt 2) → immediate missed-day penalty applied automatically, no further retries.
- If `missedDaysCount` reaches `maxMissedDays` (default 3) after this missed day, the challenge is auto-failed.

---

### POST /api/challenges/{userChallengeId}/abandon

**Summary:** Abandon an active challenge. Applies the quit penalty (default -35).  
**Auth:** required (User)  
**Produces:** application/json

**Path Params:**

- `userChallengeId` (uuid) — required

**Headers:** `Authorization: Bearer <token>`

**Responses:**

- **200 OK** — Challenge abandoned Body: `UserChallenge` (status = `"abandoned"`)
- **403 Forbidden** — User does not own the user challenge Body: ProblemDetails
- **404 Not Found** — User challenge not found Body: ProblemDetails
- **409 Conflict** — Challenge not active Body: ProblemDetails
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- Score is reduced by `quitPenalty` (default -35).
- Status transitions to `abandoned`.

---

## Automated Challenge Lifecycle

No admin manual actions. Everything happens automatically:

| Event | What triggers it | Outcome |
|-------|-----------------|---------|
| **Proof approved** | AI confidence ≥ 0.75 | API `aiVerdict: "accepted"`, score awarded, `currentDay` advances, spectators emailed |
| **Proof rejected** | AI confidence < 0.75 or insufficient proof | API `aiVerdict: "rejected"`, `needs_review` status, 24-hr resubmit window, AI feedback shown |
| **Resubmit rejected** | AI rejects attempt 2 | API `aiVerdict: "rejected"`, missed-day penalty applied immediately (-8), auto-fail if 3rd miss |
| **Resubmit window expires** | 24 hrs pass with no resubmit (MissedDayScheduler, runs every 30 min) | Missed-day penalty applied, auto-fail if 3rd miss |
| **Challenge auto-failed** | `missedDaysCount` reaches `maxMissedDays` (default 3) | Challenge `failed`, fail penalty applied (-35), spectators emailed |
| **User abandons** | User calls `POST .../abandon` | Challenge `abandoned`, quit penalty applied (-35), spectators emailed |
| **Challenge completed** | All days completed | Completion bonus (+50–100), spectators emailed |

---

## Resource: LeaderboardResource  
**Path Prefix:** `/api/leaderboard`

### GET /api/leaderboard

**Summary:** Paginated global leaderboard.  
**Auth:** required (User)  
**Produces:** application/json

**Query Params:**

- `page` (int) — default 0
- `size` (int) — default 20, max 100

**Headers:** `Authorization: Bearer <token>`

**Responses:**

- **200 OK** — Leaderboard page Body: `LeaderboardPageResponse`
  - `entries`: `{ userId, handle, displayName, avatarUrl, eliteScore, streakCurrent, rank }[]`
  - `page`, `size`, `totalUsers`, `totalPages`
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- Ranking order: `elite_score DESC` → `streak_current DESC` → `created_at ASC` → `id ASC`.

---

### GET /api/leaderboard/preview

**Summary:** Dashboard preview: your rank + 1 peer above + 1 peer below.  
**Auth:** required (User)  
**Produces:** application/json

**Headers:** `Authorization: Bearer <token>`

**Responses:**

- **200 OK** — Preview with summary and nearby entries Body: `LeaderboardPreviewResponse`
  - `title`, `summary`: `{ currentRank, eliteScore, percentile }`
  - `entries`: `{ userId, handle, displayName, avatarUrl, eliteScore, rank, isCurrentUser }[]`
- **404 Not Found** — User not found (no leaderboard entry) Body: ProblemDetails
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

---

## Resource: StreakResource  
**Path Prefix:** `/api/streaks`

### GET /api/streaks/me

**Summary:** Get the authenticated user's streak information.  
**Auth:** required (User)  
**Produces:** application/json

**Headers:** `Authorization: Bearer <token>`

**Responses:**

- **200 OK** — Streak info Body: `StreakResponse`
  - `streakCurrent`, `streakLongest`, `lastActiveAt`
- **404 Not Found** — User not found Body: ProblemDetails
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- A streak day = any UTC calendar day with at least one `verified` proof.
- Milestone bonuses: 7 days (+5), 14 days (+10), 21 days (+15), 30 days (+20).

---

## Resource: InviteResource  
**Path Prefix:** `/api/invites`

Spectator invite flow — **no authentication**. Used when a spectator clicks the accountability link (WhatsApp or email) and lands on the invite page.

### GET /api/invites/{token}

**Summary:** Get invite details by token (for the spectator landing page).  
**Auth:** none  
**Produces:** application/json

**Path Params:**

- `token` (uuid) — required, invite token from the link

**Responses:**

- **200 OK** — Invite info Body: `InviteInfoResponse`
  - `token`, `inviterName`, `challengeName`, `challengeDurationDays`, `status`, `spectatorEmail` (may be null if invite was created without email)
- **404 Not Found** — Invalid or expired token Body: ProblemDetails

**Notes:**

- Used to render "Who invited you" and "Which challenge" before the spectator accepts.

---

### POST /api/invites/{token}/accept

**Summary:** Accept an invite — spectator signs up with name + email (no password).  
**Auth:** none  
**Consumes:** application/json  
**Produces:** application/json

**Path Params:**

- `token` (uuid) — required

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Spectator's display name |
| email | string | Yes | Valid email (used for notifications and unsubscribe) |

**Responses:**

- **200 OK** — Invite accepted Body: `UserChallengeInvite`
  - Invite record with `status=accepted`, `spectatorName`, `spectatorEmail` set. A welcome email is sent via Azure Communication Services.
- **400 Bad Request** — Missing/invalid name or email Body: ProblemDetails
- **404 Not Found** — Invalid or expired token Body: ProblemDetails
- **409 Conflict** — Invite already accepted Body: ProblemDetails

**Notes:**

- No password; spectator is "locked in" as accountability partner. Marketing/unsubscribe preferences stored in `notification_preferences`.

---

### GET /api/invites/{token}/unsubscribe

**Summary:** Unsubscribe from spectator emails for this invite (GDPR).  
**Auth:** none  
**Produces:** application/json

**Path Params:**

- `token` (uuid) — required

**Responses:**

- **200 OK** — Unsubscribed Body: `{ "message": "Unsubscribed successfully" }`
- **404 Not Found** — Invalid token Body: ProblemDetails

**Notes:**

- Sets `unsubscribed_at` (and opt-out) for the spectator email linked to this invite. Use this URL in email footers.

---

## Schedulers

| Scheduler | Interval | Purpose |
|-----------|----------|---------|
| MissedDayScheduler | 30 min | Detects expired resubmit deadlines; applies missed-day penalties |
| LeaderboardRefreshScheduler | 15 min | Recomputes `global_rank` and `percentile` via SQL window functions |
| MarketingEmailScheduler | 6h / Mon 9:00 UTC / Daily 10:00 UTC | Join-us CTA, weekly digest, re-engagement emails (respects unsubscribe) |

---

## AI Verification

Proof submissions are verified by OpenAI (`gpt-5-mini`) with strict JSON schema output. **No manual admin review** — two outcomes only:

| Confidence | Verdict | User Impact |
|------------|---------|-------------|
| >= 0.75 | pass | Auto-accepted, score awarded, day advanced |
| < 0.75 | rejected | 24-hr resubmit window, AI feedback shown |

If the AI service is temporarily unavailable (network, rate-limit, parse error), the user gets the same 24-hr resubmit window with a retry message so they can submit again.

---

## Environment

Set the following environment variables:

**Supabase**

- `SUPABASE_URL` — Project URL (e.g. `https://xxx.supabase.co`)
- `SUPABASE_ANON_KEY` — Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Server-only admin key (do not expose)
- `SUPABASE_JWKS_URL` — JWKS for JWT validation (e.g. `.../auth/v1/.well-known/jwks.json`)
- `SUPABASE_ISSUER` — JWT issuer (e.g. `.../auth/v1`)
- `SUPABASE_AUDIENCE` — JWT audience (default `authenticated`)

**Database (direct PostgreSQL)**

- `SUPABASE_DB_URL` — JDBC URL (e.g. `jdbc:postgresql://...pooler.supabase.com:5432/postgres`)
- `SUPABASE_DB_USERNAME` — DB user (pooler: `postgres.{projectRef}`)
- `SUPABASE_DB_PASSWORD` — DB password

**OpenAI**

- `OPENAI_API_KEY` — API key for proof verification
- `OPENAI_MODEL` — Model (default `gpt-5-mini`)

**CORS**

- `CORS_ORIGINS` — Comma-separated allowed origins (e.g. `https://your-frontend.vercel.app`)

**Email (Azure Communication Services)**

- `AZURE_COMM_CONNECTION_STRING` — Connection string for Azure Communication Services
- `AZURE_EMAIL_SENDER` — Verified sender address (e.g. `DoNotReply@elite-score.com`)
- `APP_BASE_URL` — Base URL for invite and unsubscribe links (e.g. `https://elitescore-challenges-k554v.ondigitalocean.app`)

---

## Examples — cURL

Base URL: `BASE=https://elitescore-challenges-k554v.ondigitalocean.app`

Replace `<token>` with the Supabase session access token (`session.access_token`).

**Dashboard**

```bash
curl -X GET "$BASE/api/dashboard" \
  -H "Authorization: Bearer <token>"
```

**List challenges**

```bash
curl -X GET "$BASE/api/challenges" \
  -H "Authorization: Bearer <token>"
```

**List steps for a template**

```bash
curl -X GET "$BASE/api/challenges/<templateId>/steps" \
  -H "Authorization: Bearer <token>"
```

**My enrollments**

```bash
curl -X GET "$BASE/api/challenges/my" \
  -H "Authorization: Bearer <token>"
```

**Join challenge**

```bash
curl -X POST "$BASE/api/challenges/<templateId>/join" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"spectatorEmail":"friend@example.com"}'
```

**Submit proof**

```bash
curl -X POST "$BASE/api/challenges/<userChallengeId>/proofs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"proofText":"Completed module 3...","proofLink":"https://github.com/user/repo"}'
```

**Resubmit proof**

```bash
curl -X POST "$BASE/api/challenges/<userChallengeId>/proofs/<submissionId>/resubmit" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"proofText":"Updated proof with more detail..."}'
```

**Abandon challenge**

```bash
curl -X POST "$BASE/api/challenges/<userChallengeId>/abandon" \
  -H "Authorization: Bearer <token>"
```

**Leaderboard**

```bash
curl -X GET "$BASE/api/leaderboard?page=0&size=20" \
  -H "Authorization: Bearer <token>"
```

**Leaderboard preview**

```bash
curl -X GET "$BASE/api/leaderboard/preview" \
  -H "Authorization: Bearer <token>"
```

**My streaks**

```bash
curl -X GET "$BASE/api/streaks/me" \
  -H "Authorization: Bearer <token>"
```

**Invites (no auth)**

```bash
# Get invite info (spectator landing page)
curl -X GET "$BASE/api/invites/<token>"

# Accept invite (name + email)
curl -X POST "$BASE/api/invites/<token>/accept" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}'

# Unsubscribe from emails for this invite
curl -X GET "$BASE/api/invites/<token>/unsubscribe"
```

### GET /api/challenges/my/history

**Summary:** List the authenticated user's challenge history grouped for UI sections (`current` and `history`).  
**Auth:** required (User)  
**Produces:** application/json

**Headers:** `Authorization: Bearer <token>`

**Responses:**

- **200 OK** — Grouped challenge payload:
  - `current`: active challenges (`status = "active"`)
  - `history`: non-active challenges (`status = "completed" | "failed" | "abandoned"`)

Response item fields include:
- `userChallengeId`, `challengeTemplateId`
- `challengeName`, `track`, `difficulty`, `durationDays`
- `status`, `startDate`, `endDate`, `currentDay`, `missedDaysCount`
- `createdAt`, `completedAt`, `failedAt`

- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- Use `current` to render "Current Commitments".
- Use `history` to render "Past commitments" (pass/fail/abandoned cards).
- `history` is sorted by terminal timestamp (`completedAt`/`failedAt`) descending; `current` by `createdAt` descending.

