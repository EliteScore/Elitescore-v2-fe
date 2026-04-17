# EliteScore Auth API — Frontend Integration Guide

Base URL:
- Local: `http://localhost:8080`
- Auth production: `https://elitescore-auth-jh8f8.ondigitalocean.app`
- Challenges production (separate service): `https://elitescore-challenges-k554v.ondigitalocean.app`

This service handles auth, account lifecycle, and user profiles.

---

## Auth Model

- Protected routes require: `Authorization: Bearer <access_token>`.
- Access tokens come from `POST /auth/signup` or `POST /auth/login`.
- Token validation is server-side via Supabase Auth.
- No dev bypass is enabled for protected endpoints.

---

## Error Format

Errors use:

```json
{
  "error": "validation_error",
  "message": "Invalid request",
  "details": ["field: reason"]
}
```

`details` is optional.

Common status codes:
- `400` invalid body or validation failure
- `401` missing/invalid Bearer token
- `404` resource not found
- `409` conflict (signup collisions)
- `429` rate-limited auth calls
- `500` unexpected server error

---

## Endpoints

Path prefix: `/auth` unless stated otherwise.

### 1) Signup

`POST /auth/signup`

Request:

```json
{
  "email": "user@example.com",
  "password": "SecurePass8!",
  "full_name": "Jane Doe",
  "handle": "jane_doe"
}
```

Response:
- `201` -> `{ access_token, refresh_token, expires_in, user_id }`
- `202` -> `{ "message": "Check email to confirm signup." }` (if email confirm enabled)
- `409` -> `email_exists` or `handle_taken`

---

### 2) Login

`POST /auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "SecurePass8!"
}
```

Response:
- `200` -> `{ access_token, refresh_token, expires_in, user_id }`
- `401` -> `invalid_credentials`

---

### 3) Current User

`GET /auth/me` (Bearer required)

Response:

```json
{
  "user_id": "uuid",
  "email": "user@example.com"
}
```

---

### 4) Forgot Password (public) — Magic Link

`POST /auth/forgot-password`

Request:

```json
{
  "email": "user@example.com"
}
```

Response (always generic to prevent account enumeration):

```json
{
  "message": "If the account exists, a login link has been sent."
}
```

Notes:
- Endpoint now sends a **magic login link** (Supabase), not a reset-token link.
- Clicking the link logs the user in and redirects to `GET /auth/callback` on the FE, where tokens are read from `window.location.hash` and stored.
- After arriving, FE should prompt the user to set a new password via `POST /auth/set-password`.
- Endpoint is rate-limited.

---

### 5) Reset Password by Token (public)

`POST /auth/reset-password`

Request:

```json
{
  "token": "reset-token-from-email",
  "new_password": "NewSecurePass9!"
}
```

Response:
- `200` -> `{ "message": "Password updated successfully." }`
- `400` -> `invalid_reset_token` or validation error

---

### 6) Change Password While Logged In

`POST /auth/password-reset` (Bearer required)

Request:

```json
{
  "old_password": "OldSecurePass8!",
  "new_password": "NewSecurePass9!"
}
```

Response:
- `200` -> password changed
- `400` -> `same_password`
- `401` -> `invalid_old_password` or unauthorized

---

### 6b) Set Password While Logged In (no old password)

`POST /auth/set-password` (Bearer required)

Used after magic-link login to set a new password without providing an old one.

Request:

```json
{
  "new_password": "NewStrongPass123!"
}
```

Response:
- `200` -> `{ "message": "Password updated successfully." }`
- `400` -> validation error
- `401` -> unauthorized

---

### 7) Logout

`POST /auth/logout` (Bearer required)

Response:

```json
{
  "message": "Logged out successfully."
}
```

---

### 8) Delete Account

`DELETE /auth/delete-account` (Bearer required)

Response:

```json
{
  "message": "Account deleted successfully."
}
```

Frontend confirmation (typing a phrase) should be handled in UI before calling this endpoint.

---

### 9) Reset Password Page (public HTML) — legacy

`GET /reset-password?token=...`

Legacy token-based reset page (still served by backend). With the new magic-link flow this is no longer the primary path; prefer the magic link + `/auth/callback` + `/auth/set-password` flow.

### 10) FE Auth Callback (magic link landing)

`GET /auth/callback` (FE route)

Behavior:
- Parses `window.location.hash` for `access_token`, `refresh_token`, `expires_in`, `token_type`, `type`.
- Stores tokens in local storage (same keys as normal login).
- Clears the hash from the URL.
- If `type=magiclink` (or `recovery`), sets a one-time flag so `/profile` can show a banner prompting the user to set a new password.
- Redirects to `/profile` (magic-link flow) or `/home` otherwise.

---

## User Profile Endpoints

### GET /users/me (Bearer required)

Returns authenticated user's profile + challenge history:
- `name`, `elitescore`, `streak`, `global_rank`
- `bio`, `avatar_url`, `linkedin_url`, `github_url`
- `challenge_history` (array)

### PATCH /users/me (Bearer required)

Allowed fields:
- `full_name`
- `timezone`
- `bio`
- `avatar_url`
- `linkedin_url`
- `github_url`

Returns updated profile object (same shape as `GET /users/me`).

---

## Public Profile Endpoint

### GET /profiles/{handle}

No auth required.

Returns:
- `name`, `handle`, `elitescore`, `streak`, `global_rank`
- `bio`, `avatar_url`, `linkedin_url`, `github_url`
- `challenge_history`

---

## Health Endpoints

- `GET /health`
- `GET /actuator/health`

---

## FE Integration Sequence (Recommended)

1. Login/signup -> store `access_token` and `refresh_token`.
2. For protected calls, send:
   - `Authorization: Bearer <access_token>`
3. For forgot-password (magic link):
   - call `POST /auth/forgot-password`
   - user opens emailed magic link -> lands on FE `/auth/callback`
   - FE stores tokens from URL hash, redirects to `/profile`
   - user sets a new password via `POST /auth/set-password`
4. For in-session password update:
   - call `POST /auth/password-reset` (requires old password)
   - or `POST /auth/set-password` (no old password — used after magic link)
5. For logout:
   - call `POST /auth/logout`
   - clear local tokens
6. For account deletion:
   - UI confirmation in FE
   - call `DELETE /auth/delete-account`

---

## Environment Variables

Required:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (required for admin operations like delete-account/reset by token)
- `CORS_ORIGINS`

Password reset / email:
- `AZURE_COMM_CONNECTION_STRING`
- `AZURE_EMAIL_SENDER`
- `APP_BASE_URL` (fallback base URL for reset links)

Optional:
- `PORT`
- `SPRING_PROFILES_ACTIVE`

---

## Local Run

```cmd
.\run.cmd
```

Then use `http://localhost:8080`.

---

## Deployment Notes

- Deploy auth service from this repo to the auth domain.
- Make sure proxy forwards host/proto headers (standard on DigitalOcean App Platform).
- Ensure env vars above are set in deployed service.

---

## Scope Separation

- Auth/Profile service (this repo): auth, account lifecycle, profile endpoints.
- Challenges service: challenge templates, participation, proofs, leaderboard, etc.

