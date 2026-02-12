# Chess Benchmark

An interactive chess training platform with three cognitive exercises designed to improve board visualization, opening memorization, and coordinate recognition. Built with Next.js 14, TypeScript, and chess.js — featuring animated move playback on interactive chessboards, progressive difficulty scaling, timed recall challenges, and a scoring system with streak bonuses.

## Table of Contents

- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Features](#features)
- [Exercises](#exercises)
  - [Spatial Memory](#spatial-memory)
  - [Verbal Memory](#verbal-memory)
  - [Coordinate Vision](#coordinate-vision)
  - [Piece Moves](#piece-moves)
- [Opening Library](#opening-library)
- [Scoring System](#scoring-system)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Deployment](#deployment)
- [Client Work Disclaimer](#client-work-disclaimer)

## Live Demo

[Train Now → chessbenchmark.netlify.app](https://chessbenchmark.netlify.app/)

## Screenshots

**Dashboard**
<img width="1892" height="897" alt="chess-11" src="https://github.com/user-attachments/assets/adfa0488-7c48-4a53-8731-a83937c262e2" />

**Spatial Memory**
<img width="1887" height="897" alt="chess-12" src="https://github.com/user-attachments/assets/38ed4bea-f8af-4cf1-8b89-0079895683fa" />

**Verbal Memory**
<img width="1895" height="900" alt="chess-13" src="https://github.com/user-attachments/assets/6f8c4112-918d-4062-aaaa-cca01a5108b4" />

**Coordinate Vision**
<img width="1888" height="896" alt="chess-14" src="https://github.com/user-attachments/assets/1f2e19e1-6b8e-4aaf-9b31-825baf045c50" />

## Features

- **Three Core Exercises**: Spatial memory (board visualization), verbal memory (SAN notation recall), and coordinate vision (square identification)
- **Four Difficulty Tiers**: Beginner, Club, Expert, and Master — each adjusting time pressure and animation speed
- **Interactive Chessboards**: Real-time piece rendering via react-chessboard with custom square highlighting, move trails, and destination flashes
- **Progressive Difficulty**: Verbal memory scales from 2-move to 20-move sequences across rounds, rewarding consistency
- **Animated Move Playback**: Spatial memory animates opening moves on the board with configurable animation speed (600ms–1200ms per move)
- **Opening Library**: Ruy Lopez, King's Indian, and Queen's Gambit with full 20-move mainlines
- **Scoring Engine**: Base points + time bonus + streak multiplier across all exercises
- **Mobile Responsive**: Dedicated mobile layouts with 900px breakpoint, touch-optimized controls, and adaptive board sizing
- **Static Export**: Pre-rendered to static HTML via `next export` for CDN deployment on Netlify
- **Firebase Auth**: Registration and Google OAuth sign-in scaffolding with email/password support

## Exercises

### Spatial Memory

Watch an opening play out move-by-move on an animated chessboard, study the resulting position, then recreate the moves from memory by dragging pieces.

**Game Flow:**

```
┌───────────┐    Auto-play    ┌───────────┐    Timer expires    ┌───────────┐
│ SELECTION │ ──────────────► │  SHOWING  │ ─────────────────► │ STUDYING  │
│           │                 │ (Animate) │                    │  (Memorize)│
│ Opening   │                 │ Moves play│                    │  Position  │
│ Difficulty│                 │ on board  │                    │  is shown  │
└───────────┘                 └───────────┘                    └─────┬─────┘
                                                                     │
                                                               Timer expires
                                                                     │
                              ┌───────────┐    All moves      ┌─────▼─────┐
                              │  RESULTS  │ ◄──────────────── │  RECALL   │
                              │           │    entered         │ Drag pieces│
                              │ Score +   │                    │ to recreate│
                              │ Accuracy  │                    │ the opening│
                              └───────────┘                    └───────────┘
```

**Visual Feedback System:**

| Element | Color | Behavior |
|---------|-------|----------|
| Piece trail (FROM squares) | `#F1C40F` bright yellow | Persists for 4 moves, then fades |
| Destination flash (TO squares) | Yellow pulse | Flashes for 1000ms on each move arrival |
| Square activity heat | Accumulated opacity | Squares touched multiple times glow brighter |

**Difficulty Settings:**

| Tier | Study Time | Animation Speed |
|------|-----------|----------------|
| Beginner | 10 seconds | 1200ms per move |
| Club | 8 seconds | 1000ms per move |
| Expert | 6 seconds | 800ms per move |
| Master | 4 seconds | 600ms per move |

Both study time and animation speed are independently adjustable via custom sliders, overriding the preset values.

### Verbal Memory

Memorize the Standard Algebraic Notation (SAN) text for an opening sequence, then type it back from memory after the study timer expires.

**Game Flow:**

```
SELECTION → STUDY (see notation, timer counting down) → RECALL (type it back) → RESULTS
```

**Progressive Scaling:**

| Level | Moves to Memorize | Example (Ruy Lopez) |
|-------|------------------|---------------------|
| 0 | 2 moves | e4 e5 |
| 1 | 4 moves | e4 e5 Nf3 Nc6 |
| 2 | 6 moves | e4 e5 Nf3 Nc6 Bb5 a6 |
| 3 | 8 moves | e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 |
| ... | +2 per level | Up to 20 moves |

Each correct answer advances the level, increasing the sequence by 2 moves. Incorrect answers keep you at the same level. Maximum depth is 20 moves (10 full move pairs) per opening.

**Difficulty Settings:**

| Tier | Study Time |
|------|-----------|
| Beginner | 10 seconds |
| Club | 7 seconds |
| Expert | 5 seconds |
| Master | 3 seconds |

### Coordinate Vision

A square is highlighted on the board — type its algebraic coordinate (e.g., `e4`) before the timer runs out. Ten rounds per session.

**Game Flow:**

```
SELECTION → PLAYING (square highlighted, type answer) → FEEDBACK (correct/incorrect) → ... → RESULTS
```

**Difficulty Settings:**

| Tier | Time Per Square |
|------|----------------|
| Beginner | 5.0 seconds |
| Club | 3.0 seconds |
| Expert | 2.0 seconds |
| Master | 1.0 seconds |

**Square Highlighting:**

| Phase | Style |
|-------|-------|
| Active target | `#EAB308` yellow background, 3px solid border, 20px box shadow glow |
| Correct answer | `#4CAF50` green with 50% opacity, 3px green border |
| Incorrect / timeout | `#f44336` red with 50% opacity, 3px red border |

### Piece Moves

Given a random square, list all legal moves for a specific piece type. Currently implements knight move calculation with board-edge validation.

**Move Generation (Knight):**

```typescript
// All 8 L-shaped offsets from any square
const offsets = [
  [+1, +2], [+1, -2], [-1, +2], [-1, -2],
  [+2, +1], [+2, -1], [-2, +1], [-2, -1]
];
// Filtered to squares within a-h, 1-8
```

## Opening Library

Three classical openings with full mainline theory:

### Ruy Lopez (20 moves)
```
1. e4 e5  2. Nf3 Nc6  3. Bb5 a6  4. Ba4 Nf6  5. O-O Be7
6. Re1 b5  7. Bb3 d6  8. c3 O-O  9. h3 Nb8  10. d4 Nbd7
```

### King's Indian Defense (20 moves)
```
1. d4 Nf6  2. c4 g6  3. Nc3 Bg7  4. e4 d6  5. Nf3 O-O
6. Be2 e5  7. O-O Nc6  8. d5 Ne7  9. b4 Nh5  10. Re1 f5
```

### Queen's Gambit Declined (20 moves)
```
1. d4 d5  2. c4 e6  3. Nc3 Nf6  4. cxd5 exd5  5. Bg5 Be7
6. e3 O-O  7. Bd3 Nbd7  8. Qc2 Re8  9. Nf3 Nf8  10. O-O c6
```

Spatial memory uses the first 5–6 moves for board animation. Verbal memory uses all 20 moves for progressive SAN recall.

## Scoring System

### Coordinate Vision

```
points = 100 (base) + timeBonus + streakBonus
timeBonus = floor((timeLimit - responseTime) / 100)
streakBonus = currentStreak × 10
```

Faster responses yield higher time bonuses. Consecutive correct answers build a streak multiplier. Any miss resets the streak to zero.

### Spatial Memory

Score accumulates per correct move recalled, with streak tracking across rounds. Points scale with the opening's move count and difficulty tier.

### Verbal Memory

Score and streak persist across levels. Each correct full-sequence recall awards points and advances to the next level (+2 moves). Best score is tracked per session.

## Architecture

### State Machine Pattern

All three exercises use the same `GamePhase` enum pattern for UI state management:

```
SELECTION → active gameplay phases → RESULTS
```

Each phase controls which UI panels render, which timers are active, and which inputs are enabled. Phase transitions are managed via `useCallback` hooks with timer cleanup to prevent memory leaks.

### Timer Management

Exercises use `useRef` for timer references with explicit cleanup:

- `timerRef` — per-round countdown intervals
- `studyTimerRef` — study phase countdown
- `showingTimerRef` — move animation sequencing
- `startTimeRef` — high-precision response time via `Date.now()`

All timers are cleared on phase transitions and component unmount via `useEffect` cleanup returns.

### Board Integration

The `react-chessboard` component receives:

- `position` — FEN string from `chess.js` game state
- `customSquareStyles` — dynamic highlighting computed per frame via `useCallback`
- `arePiecesDraggable` — toggled per game phase (locked during study, enabled during recall)
- `animationDuration` — set to 0 for instant updates during feedback, configurable during playback

### Responsive Layout

Each exercise implements dual layouts selected by a `isMobile` state flag (threshold: 900px):

- **Desktop**: Side panel + center board + right controls (flex row)
- **Mobile**: Stacked vertical layout with compact score card, smaller board (360px vs 480px), and full-width controls

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2.14 (App Router) |
| Language | TypeScript 5 |
| Chess Engine | chess.js 1.0.0-beta.8 |
| Board Renderer | react-chessboard 4.7.1 |
| Styling | Tailwind CSS 3.4 + inline styles |
| Auth | Firebase 10.14 (email/password + Google OAuth) |
| Theme | next-themes 0.3 (dark mode default) |
| Icons | react-icons 5.3 (Fa, Bi, Vsc, Pi, Fc sets) |
| Font | Geist Sans + Geist Mono (local woff) |
| Build | Static export (`next export`) |
| Hosting | Netlify (static CDN) |
| Package Manager | npm / Bun |

## Project Structure

```
src/
├── app/
│   ├── exercises/
│   │   ├── coordinate-vision/
│   │   │   └── page.tsx              # Coordinate identification exercise (867 lines)
│   │   ├── game-memory/
│   │   │   └── page.tsx              # Spatial memory with animated playback (1,334 lines)
│   │   ├── san-memory/
│   │   │   └── page.tsx              # SAN notation verbal recall (1,149 lines)
│   │   └── moves/
│   │       └── [piece]/
│   │           ├── page.tsx           # Piece move calculation exercise
│   │           └── layout.tsx         # Static params for piece routes
│   ├── register/
│   │   └── page.tsx                   # Firebase auth registration page
│   ├── globals.css                    # CSS variables, forced dark theme
│   ├── layout.tsx                     # Root layout with ThemeProvider + Header
│   ├── page.tsx                       # Landing page with exercise cards
│   └── project.ts                     # App metadata constants
├── components/
│   ├── Header/
│   │   └── Header.tsx                 # Navigation bar with settings dropdown
│   ├── Home/
│   │   ├── Home.tsx                   # Home page component
│   │   └── Home.module.css            # Home styles
│   ├── Card.tsx                       # Exercise selection card with hover effects
│   ├── Chessboard.tsx                 # Reusable chessboard wrapper (dynamic import, SSR disabled)
│   ├── ExerciseList.tsx               # Exercise card grid layout
│   ├── GetStartedButton.tsx           # Quick-start navigation buttons
│   ├── GoogleButton.tsx               # Google OAuth sign-in button
│   ├── Logo.tsx                       # Theme-aware logo image
│   ├── OpeningsList.tsx               # Opening selection list
│   └── ThemeToggle.tsx                # Light/dark mode toggle
├── netlify.toml                       # Netlify build config (Node 18, SPA redirects)
├── next.config.mjs                    # Static export, unoptimized images
├── tailwind.config.ts                 # Dark mode class strategy, CSS variable colors
└── tsconfig.json                      # TypeScript configuration
```

## Setup

### Prerequisites

- Node.js 18+
- npm or Bun

### Install & Run

```bash
git clone https://github.com/claygeo/chess-benchmark.git
cd chess-benchmark

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Firebase Configuration (Optional)

To enable user registration and Google sign-in, replace the placeholder values in `src/app/register/page.tsx`:

```typescript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server with hot reload |
| `npm run build` | Static export to `out/` directory |
| `npm run start` | Serve production build locally |
| `npm run lint` | ESLint with auto-fix |

## Deployment

The app is configured for static export deployment on Netlify:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
```

`next.config.mjs` sets `output: 'export'` to generate a fully static site — no server-side rendering, no API routes, no Node.js runtime required. Deploy to any static hosting provider by pointing to the `out/` directory.

## Client Work Disclaimer

This repository represents the frontend implementation of a collaborative client project. The development responsibilities were divided as follows:

- **Frontend Development**: Complete implementation of all user interface components, training exercises, responsive design, and client-side functionality (this repository)
- **Backend Development**: Server architecture, APIs, database design, and backend logic (implemented by separate developer, not included in this repository)

All frontend code — including the training algorithms, UI/UX design, responsive layouts, and interactive features — represents original implementation work.

Special thanks to [@danmandel](https://github.com/danmandel) for the client work opportunity.

## License

Proprietary — All rights reserved.