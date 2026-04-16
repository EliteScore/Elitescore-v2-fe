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

### 4) Forgot Password (public)

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
  "message": "If the account exists, a reset link has been sent."
}
```

Notes:
- Endpoint is rate-limited.
- Reset link host is derived from the incoming request host/proxy headers.
- `APP_BASE_URL` is used as fallback only.

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

### 9) Reset Password Page (public HTML)

`GET /reset-password?token=...`

Returns a simple built-in HTML reset page which:
- reads `token` from query string
- takes new password + confirmation
- calls `POST /auth/reset-password`

Use this URL in forgot-password emails.

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
3. For forgot-password:
   - call `POST /auth/forgot-password`
   - user opens emailed `/reset-password?token=...`
   - page submits `POST /auth/reset-password`
4. For in-session password update:
   - call `POST /auth/password-reset`
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

