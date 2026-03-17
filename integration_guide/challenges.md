# EliteScore Challenges — API Reference

**Base URL:** `https://elitescore-challenges-k554v.ondigitalocean.app/` (dev) or your deployed domain  
**OpenAPI / Swagger UI:** `/swagger-ui.html` · `/api-docs`

---

## Authentication

| Environment | Mechanism |
|-------------|-----------|
| **Production** (`!dev` profile) | `Authorization: Bearer <token>`. JWT validated via JWKS; `sub` injected as `X-User-Id` header. |
| **Dev** (`dev` profile) | Pass `X-User-Id: <uuid>` directly. JWT validation disabled; all routes `permitAll`. |

Admin endpoints require the user to exist in the `admins` table (`ROLE_ADMIN`).

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

**Headers:** `X-User-Id` (uuid) — required in dev; set by JWT filter in prod

**Responses:**

- **200 OK** — Full dashboard payload Body: `DashboardResponse`
  - `eliteScore` (int) — user's current EliteScore
  - `globalRank` (int) — rank on global leaderboard
  - `percentile` (Double) — percentile 0–100 (you beat this % of users)
  - `streaks` — `{ streakCurrent, streakLongest, lastActiveAt }`
  - `recentScoreGains` — last 10 score events: `{ eventType, eliteScoreDelta, createdAt }[]`
  - `leaderboardPreview` — `{ title, summary, entries }` (nearby peers)
  - `recommendedChallenges` — up to 5 personalized templates (excludes enrolled, prefers user's track)
- **404 Not Found** — User not found or not in leaderboard Body: ProblemDetails
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- Single round-trip for the home view. Recommendations exclude challenges the user has enrolled in (any status); sorts by completion rate then difficulty. If user has a `track`, same-track challenges appear first.

---

## Resource: ChallengeResource  
**Path Prefix:** `/api/challenges`

### GET /api/challenges

**Summary:** List all active challenge templates.  
**Auth:** required (User)  
**Produces:** application/json

**Headers:** `X-User-Id` (dev) or `Authorization: Bearer` (prod)

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

**Headers:** `X-User-Id` (dev) or `Authorization: Bearer` (prod)

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

**Headers:** `X-User-Id` (uuid) — required in dev; set by JWT filter in prod

**Responses:**

- **200 OK** — List of user's enrollments Body: `UserChallenge[]`
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- Returns enrollments for the user identified by `X-User-Id` / JWT `sub`.
- Fields: `id`, `userId`, `challengeTemplateId`, `status`, `startDate`, `endDate`, `currentDay`, `missedDaysCount`, `createdAt`.

---

### POST /api/challenges/{templateId}/join

**Summary:** Join (start) a challenge. Creates a `UserChallenge` with `status=active` and `currentDay=0`.  
**Auth:** required (User)  
**Consumes:** application/json  
**Produces:** application/json

**Path Params:**

- `templateId` (uuid) — required

**Headers:** `X-User-Id` (uuid) — required

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
- Fails if user is already enrolled in the same template.

---

### POST /api/challenges/{userChallengeId}/proofs

**Summary:** Submit daily proof for the next day of an active challenge. AI verification runs synchronously.  
**Auth:** required (User)  
**Consumes:** application/json  
**Produces:** application/json

**Path Params:**

- `userChallengeId` (uuid) — required

**Headers:** `X-User-Id` (uuid) — required

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

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| proofText | string | No* | Free-text proof (min 20 chars recommended) |
| proofLink | string | No* | URL to external evidence (GitHub, Kaggle, etc.) |
| notes | string | No | Additional context for the verifier |
| attachments | AssetDto[] | No* | Files uploaded to Supabase Storage |
| attachments[].url | string | Yes | Public Supabase Storage URL |
| attachments[].assetType | string | No | `"image"` \| `"video"` \| `"file"` (default `"file"`) |

\* At least one of `proofText`, `proofLink`, or `attachments` must be provided.

**Responses:**

- **201 Created** — Proof submitted; AI verdict applied Body: `ProofSubmission`
- **400 Bad Request** — Empty proof (none of proofText/proofLink/attachments) Body: ProblemDetails
- **403 Forbidden** — User does not own the user challenge Body: ProblemDetails
- **404 Not Found** — User challenge or entity not found Body: ProblemDetails
- **409 Conflict** — Challenge not active or duplicate day Body: ProblemDetails
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- **AI verification outcomes:**
  - `pass` (confidence >= 0.75) → proof `verified`, score awarded, `currentDay` advanced
  - `pending_admin_review` (0.60–0.74) → queued for admin, no penalty
  - `rejected` (< 0.60) → proof `needs_review`, 24-hour resubmit window
- OpenAI failure (network, rate-limit, parse) → `pending_admin_review` (user not penalized).

---

### POST /api/challenges/{userChallengeId}/proofs/{submissionId}/resubmit

**Summary:** Resubmit proof after AI feedback, within the 24-hour window. Same request body as submit.  
**Auth:** required (User)  
**Consumes:** application/json  
**Produces:** application/json

**Path Params:**

- `userChallengeId` (uuid) — required
- `submissionId` (uuid) — required

**Headers:** `X-User-Id` (uuid) — required

**Request Body:** Same as `POST /api/challenges/{userChallengeId}/proofs`

**Responses:**

- **200 OK** — Resubmission processed Body: `ProofSubmission`
- **400 Bad Request** — Empty proof Body: ProblemDetails
- **403 Forbidden** — User does not own the user challenge Body: ProblemDetails
- **404 Not Found** — Submission or user challenge not found Body: ProblemDetails
- **409 Conflict** — Wrong status or challenge inactive Body: ProblemDetails
- **410 Gone** — Resubmit window expired Body: ProblemDetails
- **401 Unauthorized** — Missing or invalid token Body: ProblemDetails

**Notes:**

- Resubmit outcomes: `pass` → score awarded; `pending_admin_review` → escalated; `rejected` (attempt 2) → immediate missed-day penalty, no further retries.

---

### POST /api/challenges/{userChallengeId}/abandon

**Summary:** Abandon an active challenge. Applies the quit penalty (default -35).  
**Auth:** required (User)  
**Produces:** application/json

**Path Params:**

- `userChallengeId` (uuid) — required

**Headers:** `X-User-Id` (uuid) — required

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

## Resource: AdminResource  
**Path Prefix:** `/api/admin`

All admin endpoints require `ROLE_ADMIN` (user in `admins` table).

### POST /api/admin/proofs/{submissionId}/verify

**Summary:** Manually verify a proof — overrides AI decision.  
**Auth:** required (Admin)  
**Consumes:** application/json  
**Produces:** application/json

**Path Params:**

- `submissionId` (uuid) — required

**Headers:** `X-User-Id` (uuid) — required; must be admin in dev; JWT in prod

**Request Body:**

```json
{
  "verdict": "pass",
  "verifierType": "admin",
  "verifierUserId": "uuid",
  "confidence": 0.95,
  "reason": "Screenshot clearly shows completed module"
}
```

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| verdict | string | Yes | `"pass"` \| `"fail"` | Decision |
| verifierType | string | No | `"peer"` \| `"admin"` \| `"ai"` | Default `"admin"` |
| verifierUserId | uuid | No | — | Who verified |
| confidence | decimal | No | 0.0–1.0 | Confidence score |
| reason | string | No | — | Explanation |

**Responses:**

- **200 OK** — Verification applied Body: `Verification`
- **404 Not Found** — Submission not found Body: ProblemDetails
- **409 Conflict** — Proof already in terminal status (`verified`/`rejected`) Body: ProblemDetails
- **401 Unauthorized** — Not authenticated Body: ProblemDetails
- **403 Forbidden** — Not admin Body: ProblemDetails

**Notes:**

- `pass` → proof `verified`, score awarded, day advanced, streak updated.
- `fail` → proof `rejected`, no score change.

---

### POST /api/admin/challenges/{userChallengeId}/fail

**Summary:** Force-fail an active challenge. Applies the quit penalty (default -35).  
**Auth:** required (Admin)  
**Produces:** application/json

**Path Params:**

- `userChallengeId` (uuid) — required

**Headers:** `X-User-Id` (uuid) — required; must be admin

**Responses:**

- **200 OK** — Challenge failed Body: `UserChallenge` (status = `"failed"`)
- **404 Not Found** — User challenge not found Body: ProblemDetails
- **409 Conflict** — Challenge not active Body: ProblemDetails
- **401 Unauthorized** — Not authenticated Body: ProblemDetails
- **403 Forbidden** — Not admin Body: ProblemDetails

**Notes:**

- Same effect as user abandoning; applies `failPenalty` (default -35).

---

### POST /api/admin/challenges/{userChallengeId}/penalize-day/{day}

**Summary:** Apply a missed-day penalty for a specific day (default -8 score).  
**Auth:** required (Admin)  
**Produces:** (204 No Content)

**Path Params:**

- `userChallengeId` (uuid) — required
- `day` (int) — required, >= 1

**Headers:** `X-User-Id` (uuid) — required; must be admin

**Responses:**

- **204 No Content** — Penalty applied
- **400 Bad Request** — `day` < 1 Body: ProblemDetails
- **404 Not Found** — User challenge not found Body: ProblemDetails
- **401 Unauthorized** — Not authenticated Body: ProblemDetails
- **403 Forbidden** — Not admin Body: ProblemDetails

**Notes:**

- If `missedDaysCount` reaches `maxMissedDays` (default 3), challenge is auto-failed.

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

**Headers:** `X-User-Id` (dev) or `Authorization: Bearer` (prod)

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

**Headers:** `X-User-Id` (uuid) — required

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

**Headers:** `X-User-Id` (uuid) — required

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

Proof submissions are verified by OpenAI (`gpt-5-mini`) with strict JSON schema output.

| Confidence | Verdict | User Impact |
|------------|---------|-------------|
| >= 0.75 | pass | Auto-accepted, score awarded |
| 0.60–0.74 | pending_admin_review | Queued for admin, no penalty |
| < 0.60 | rejected | 24-hr resubmit window |

Any OpenAI failure (network, rate-limit, parse) → `pending_admin_review` (user not penalized).

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

- `CORS_ORIGINS` — Comma-separated origins (default `http://localhost:3000`)

**Email (Azure Communication Services)**

- `AZURE_COMM_CONNECTION_STRING` — Connection string for Azure Communication Services
- `AZURE_EMAIL_SENDER` — Verified sender address (e.g. `DoNotReply@elite-score.com`)
- `APP_BASE_URL` — Base URL for invite and unsubscribe links (default `http://localhost:8080`)

---

## Examples — cURL

Base URL: `BASE=http://localhost:8080`

**Dashboard**

```bash
curl -X GET "$BASE/api/dashboard" \
  -H "X-User-Id: <uuid>"
```

**List challenges**

```bash
curl -X GET "$BASE/api/challenges" \
  -H "X-User-Id: <uuid>"
```

**List steps for a template**

```bash
curl -X GET "$BASE/api/challenges/<templateId>/steps" \
  -H "X-User-Id: <uuid>"
```

**My enrollments**

```bash
curl -X GET "$BASE/api/challenges/my" \
  -H "X-User-Id: <uuid>"
```

**Join challenge**

```bash
curl -X POST "$BASE/api/challenges/<templateId>/join" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: <uuid>" \
  -d '{"spectatorEmail":"friend@example.com"}'
```

**Submit proof**

```bash
curl -X POST "$BASE/api/challenges/<userChallengeId>/proofs" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: <uuid>" \
  -d '{"proofText":"Completed module 3...","proofLink":"https://github.com/user/repo"}'
```

**Resubmit proof**

```bash
curl -X POST "$BASE/api/challenges/<userChallengeId>/proofs/<submissionId>/resubmit" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: <uuid>" \
  -d '{"proofText":"Updated proof with more detail..."}'
```

**Abandon challenge**

```bash
curl -X POST "$BASE/api/challenges/<userChallengeId>/abandon" \
  -H "X-User-Id: <uuid>"
```

**Admin: Verify proof**

```bash
curl -X POST "$BASE/api/admin/proofs/<submissionId>/verify" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: <admin-uuid>" \
  -d '{"verdict":"pass","reason":"Screenshot shows completed work"}'
```

**Admin: Force-fail challenge**

```bash
curl -X POST "$BASE/api/admin/challenges/<userChallengeId>/fail" \
  -H "X-User-Id: <admin-uuid>"
```

**Admin: Penalize missed day**

```bash
curl -X POST "$BASE/api/admin/challenges/<userChallengeId>/penalize-day/1" \
  -H "X-User-Id: <admin-uuid>"
```

**Leaderboard**

```bash
curl -X GET "$BASE/api/leaderboard?page=0&size=20" \
  -H "X-User-Id: <uuid>"
```

**Leaderboard preview**

```bash
curl -X GET "$BASE/api/leaderboard/preview" \
  -H "X-User-Id: <uuid>"
```

**My streaks**

```bash
curl -X GET "$BASE/api/streaks/me" \
  -H "X-User-Id: <uuid>"
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
