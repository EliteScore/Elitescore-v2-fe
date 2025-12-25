# EliteScore

A gamified self-improvement platform for Gen Z students. Turn skills, habits, and learning into quantifiable achievements through challenges, leaderboards, and competitive progress tracking.

## Features

- **Daily Challenges**: Lock into structured challenges across technical skills, career development, and personal growth
- **Live Leaderboards**: Track your rank in real-time against your cohort and see exactly where you stand
- **EliteScore System**: Quantify your progress with a single metric that matters
- **Proof-Based Progress**: Submit evidence for every achievement - no gaming the system
- **Streak Tracking**: Build consistency with streak multipliers that boost your score
- **Cohort Competition**: Compete with students from your university

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. **Download the ZIP file** from v0 and extract it to your desired location

2. **Navigate to the project directory**
   ```bash
   cd elitescore-homepage-design
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application

### Project Structure

```
elitescore-homepage-design/
├── app/
│   ├── page.tsx              # Homepage
│   ├── dashboard/
│   │   └── page.tsx         # User dashboard
│   ├── challenges/
│   │   └── page.tsx         # Challenges page
│   ├── leaderboard/
│   │   └── page.tsx         # Leaderboard page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   └── ui/                  # shadcn/ui components
├── public/
│   └── images/
│       └── logo.png         # EliteScore logo
├── package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Design System

The application uses a consistent blue-to-purple gradient color scheme matching the EliteScore brand:

- **Primary Blue**: `#2bbcff`
- **Primary Purple**: `#a855f7`
- **Typography**: Small, compact fonts for a modern Gen Z aesthetic
- **UI Style**: Glass morphism effects with backdrop blur
- **Spacing**: Generous padding and margins for clean, breathable layouts

## Key Pages

### Homepage (`/`)
- Hero section with value proposition
- Feature showcase
- How it works section
- Social proof testimonials
- CTA section

### Dashboard (`/dashboard`)
- Status snapshot with EliteScore and streak
- Primary action for daily submissions
- Active challenges with progress tracking
- Performance signals grid
- Leaderboard preview
- Improvement insights
- Recommended challenges

### Challenges (`/challenges`)
- Active challenges tab
- Challenge library with browsing
- Challenge history
- Lock-in and proof submission modals

### Leaderboard (`/leaderboard`)
- Cohort leaderboard
- Challenge-specific leaderboards
- Top 10 users display
- Current user position
- 5 users above and below
- Rank movement indicators
- Profile viewing

## Customization

### Changing Colors

Edit `app/globals.css` to modify the color scheme:

```css
@theme inline {
  /* Update these CSS variables */
  --color-primary-blue: #2bbcff;
  --color-primary-purple: #a855f7;
}
```

### Adding New Pages

1. Create a new folder in `app/` directory
2. Add a `page.tsx` file
3. Follow the existing component patterns for consistency

### Modifying Components

UI components are located in `components/ui/`. These are shadcn/ui components that can be customized as needed.

## Deployment

### Deploy to Vercel

The easiest way to deploy is using Vercel:

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and deploy

### Build for Production

```bash
npm run build
npm run start
```

## Support

For issues or questions:
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Visit [shadcn/ui Documentation](https://ui.shadcn.com)
- Review [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

© 2025 EliteScore. All rights reserved.
