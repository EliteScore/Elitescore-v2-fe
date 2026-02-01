# EliteScore Frontend

EliteScore is a gamified self-improvement platform for students. It turns real-world habits, learning, and skill development into quantifiable progress with challenges, proof-based tracking, streaks, and competitive leaderboards.

## What This Repo Contains

- Marketing landing page at `/`
- Auth flows at `/login` and `/signup`
- Product experience under `/app` with core navigation
- Challenges, leaderboard, and profile flows

## Highlights

- Challenge-based growth with daily tasks
- Proof submission for accountability
- Streak tracking and rank movement
- Cohort and global leaderboards
- Light/dark mode
- Sidebar navigation with collapse/expand
- Guided walkthrough (first visit to `/app`)\n\n## New Features (1-3)\n\n1. Streak insurance  spend points to save a missed day.\n2. Proof quality ratings  peer upvotes can boost proof quality.\n3. Weekly boss challenge  high-difficulty, high-reward weekly quest.\n

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)

### Install

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

Open `http://localhost:3000` for the landing page. The app lives at `http://localhost:3000/app`.

## Project Structure

```text
app/
  layout.tsx
  globals.css
  page.tsx                # Landing page
  app/                    # Main app entry
  challenges/
  leaderboard/
  login/
  profile/
  signup/
  supporter/
components/
  sidebar-nav.tsx
  top-bar.tsx
  ai-helper.tsx
  app-tour.tsx
  ui/
lib/
public/
styles/
```

## Theming

Theme tokens live in `app/globals.css` under `:root` and `.dark`.

- `ThemeProvider` uses `next-themes` for system + manual toggle
- `ThemeToggle` is in the top bar and landing header

## Notes

- First-time walkthrough runs only on `/app` and is stored in `localStorage` under `elitescore_tour_seen`.
- Ask Elite lives in the bottom-right and uses the `MorphPanel` component.

## Scripts

- `npm run dev`  start development server
- `npm run build`  production build
- `npm run start`  run production server
- `npm run lint`  lint

## Deployment

Vercel is the simplest path: import the repo and deploy. For manual builds:

```bash
npm run build
npm run start
```

## License

 2026 EliteScore. All rights reserved.
