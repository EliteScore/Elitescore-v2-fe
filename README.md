# EliteScore Frontend

This repository contains the Next.js frontend for EliteScore, a proof-driven accountability product focused on challenge execution, streak tracking, and leaderboard visibility.

The codebase is built with the App Router and TypeScript, and it includes both:

- a public marketing/entry experience (`/`)
- an authenticated product shell (`/app`, `/challenges`, `/leaderboard`, etc.)

## Runtime and Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: Tailwind CSS v4 + shadcn/ui + Radix primitives
- Forms/validation: React Hook Form + Zod
- Motion: Framer Motion
- Icons: Lucide React
- Theme: `next-themes`
- Analytics: `@vercel/analytics`

## Project Layout

```text
app/
  layout.tsx
  globals.css
  page.tsx                     # Landing page
  app/page.tsx                 # Product home
  login/page.tsx
  signup/page.tsx
  terms-policy/page.tsx
  challenges/
  leaderboard/
  profile/
  supporter/
components/
  app-shell.tsx                # Decides when to render app chrome
  auth-gate.tsx                # Route-level auth redirect logic
  top-bar.tsx
  sidebar-nav.tsx
  wing-mark.tsx                # Shared logo mark
  ui/                          # shadcn-style component set
hooks/
lib/
public/
```

## Route Model

- Public routes:
  - `/` (landing)
  - `/login`
  - `/signup`
  - `/terms-policy`
- Protected routes:
  - `/app`
  - `/challenges`
  - `/leaderboard`
  - `/profile`
  - `/planner`
  - `/analytics`
  - `/notifications`

Protected route checks are handled client-side in `components/auth-gate.tsx`.

## Authentication Behavior (Current)

The current implementation uses local storage as a lightweight auth state:

- `elitescore_logged_in` (`"true"` / absent)
- `elitescore_email`
- `elitescore_username`

On protected pages, unauthenticated users are redirected to `/login`.

This is a frontend-only guard and should be replaced by server-backed session validation in production.

## Theming

Theme tokens are defined in `app/globals.css` using CSS variables for `:root` and `.dark`.

`ThemeProvider` is wired in `app/layout.tsx`.

## Local Development

### Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm

### Install dependencies

```bash
npm install
```

### Start dev server

```bash
npm run dev
```

Application will be available at:

- Landing: `http://localhost:3000/`
- Product shell: `http://localhost:3000/app`

### Build and run production mode

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - create production build
- `npm run start` - serve production build
- `npm run lint` - run ESLint

## Implementation Notes

- `components/app-shell.tsx` excludes full app chrome for `/terms-policy`, so legal content renders as a standalone page.
- Landing page motion and scroll transitions are implemented in `app/page.tsx` with Framer Motion.
- Shared brand mark is centralized in `components/wing-mark.tsx` and reused across public/auth/app surfaces.

## Deployment

The repository is compatible with Vercel default Next.js deployment settings.

For other platforms, ensure:

- Node runtime is compatible with Next.js 16
- `npm run build` is executed during CI
- static assets in `public/` are served correctly

## License

Copyright (c) 2026 EliteScore. All rights reserved.
