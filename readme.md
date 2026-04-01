# Chess Benchmark

[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![CI](https://github.com/claygeo/chess-benchmark/actions/workflows/ci.yml/badge.svg)](https://github.com/claygeo/chess-benchmark/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#license)

A chess cognitive training platform with three exercises targeting board visualization, notation recall, and coordinate recognition. Features animated move playback, progressive difficulty scaling, timed challenges, and a scoring engine with streak bonuses.

**[Train Now -- chessbenchmark.netlify.app](https://chessbenchmark.netlify.app/)**

---

## Screenshots

**Dashboard**
<img width="1892" height="897" alt="chess-11" src="https://github.com/user-attachments/assets/adfa0488-7c48-4a53-8731-a83937c262e2" />

**Spatial Memory**
<img width="1887" height="897" alt="chess-12" src="https://github.com/user-attachments/assets/38ed4bea-f8af-4cf1-8b89-0079895683fa" />

**Verbal Memory**
<img width="1895" height="900" alt="chess-13" src="https://github.com/user-attachments/assets/6f8c4112-918d-4062-aaaa-cca01a5108b4" />

**Coordinate Vision**
<img width="1888" height="896" alt="chess-14" src="https://github.com/user-attachments/assets/1f2e19e1-6b8e-4aaf-9b31-825baf045c50" />

---

## Exercises

### Spatial Memory

Watch an opening play out move-by-move on an animated chessboard, study the resulting position, then recreate the moves from memory by dragging pieces.

```
SELECTION --> SHOWING (animated playback) --> STUDYING (memorize position) --> RECALL (drag pieces) --> RESULTS
```

**Visual Feedback:**

| Element | Color | Behavior |
|---------|-------|----------|
| Piece trail (FROM squares) | `#F1C40F` yellow | Persists for 4 moves, then fades |
| Destination flash (TO squares) | Yellow pulse | Flashes 1000ms on arrival |
| Square activity heat | Accumulated opacity | Repeated touches glow brighter |

**Difficulty Tiers:**

| Tier | Study Time | Animation Speed |
|------|-----------|----------------|
| Beginner | 10s | 1200ms/move |
| Club | 8s | 1000ms/move |
| Expert | 6s | 800ms/move |
| Master | 4s | 600ms/move |

Both study time and animation speed are independently adjustable via custom sliders.

### Verbal Memory

Memorize the SAN (Standard Algebraic Notation) for an opening sequence, then type it back after the timer expires. Correct answers advance the level by +2 moves (up to 20). Incorrect answers hold the current level.

```
SELECTION --> STUDY (view notation) --> RECALL (type it back) --> RESULTS
```

| Tier | Study Time |
|------|-----------|
| Beginner | 10s |
| Club | 7s |
| Expert | 5s |
| Master | 3s |

### Coordinate Vision

A square is highlighted on the board -- type its algebraic coordinate (e.g., `e4`) before time runs out. Ten rounds per session.

```
SELECTION --> PLAYING (identify square) --> FEEDBACK --> ... --> RESULTS
```

| Tier | Time Per Square |
|------|----------------|
| Beginner | 5.0s |
| Club | 3.0s |
| Expert | 2.0s |
| Master | 1.0s |

---

## Opening Library

Three classical openings with 20-move mainlines used across exercises:

- **Ruy Lopez** -- `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 ...`
- **King's Indian Defense** -- `1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 ...`
- **Queen's Gambit Declined** -- `1. d4 d5 2. c4 e6 3. Nc3 Nf6 ...`

Spatial Memory uses the first 5-6 moves for board animation. Verbal Memory uses all 20 moves for progressive recall.

---

## Scoring System

### Coordinate Vision

```
points = 100 (base) + timeBonus + streakBonus
timeBonus = floor((timeLimit - responseTime) / 100)
streakBonus = currentStreak * 10
```

Faster responses yield higher time bonuses. Consecutive correct answers build a streak multiplier. Any miss resets the streak to zero.

### Spatial Memory

Score accumulates per correct move recalled, with streak tracking across rounds. Points scale with move count and difficulty tier.

### Verbal Memory

Score and streak persist across levels. Each correct full-sequence recall awards points and advances to the next level (+2 moves). Best score tracked per session.

---

## Architecture

### State Machine Pattern

All exercises share a `GamePhase` enum that drives UI rendering:

```
SELECTION --> active gameplay phases --> RESULTS
```

Each phase controls which panels render, which timers are active, and which inputs are enabled. Transitions are managed via `useCallback` with timer cleanup to prevent memory leaks.

### Shared Hooks

| Hook | Purpose |
|------|---------|
| `useTimer` | Countdown timer with `useRef`-based interval management and automatic cleanup on unmount |
| `useGameScoring` | Score accumulation, streak tracking, round management, and best-score persistence |
| `useMobile` | Responsive breakpoint detection (900px threshold) for layout switching |

### Component Decomposition

Each exercise follows an orchestrator pattern:

```
page.tsx (orchestrator)
  --> SelectionPanel.tsx    # Opening + difficulty selection
  --> GameBoard.tsx         # Interactive chessboard with phase-aware behavior
  --> StudyPanel.tsx        # Notation display (Verbal Memory only)
  --> RecallPanel.tsx       # User input capture
  --> ResultsPanel.tsx      # Score breakdown + replay option
```

The orchestrator page owns all state and passes props downward. Components are pure renderers with no internal state management.

### Board Integration

`react-chessboard` receives:

- `position` -- FEN string from `chess.js` game state
- `customSquareStyles` -- dynamic highlighting computed per frame
- `arePiecesDraggable` -- toggled per phase (locked during study, enabled during recall)
- `animationDuration` -- 0 for instant feedback, configurable during playback

### Responsive Layout

- **Desktop**: Side panel + center board + right controls (flex row)
- **Mobile**: Stacked vertical layout with compact score card, smaller board (360px vs 480px), and full-width controls

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Chess Engine | chess.js |
| Board Renderer | react-chessboard |
| Styling | Tailwind CSS 3.4 + inline styles |
| Icons | react-icons |
| Font | Geist Sans + Geist Mono (local woff) |
| Testing | Vitest 4 + React Testing Library + jsdom |
| CI | GitHub Actions (lint, build, test) |
| Build | Static export (`next export`) |
| Hosting | Netlify (static CDN) |

---

## Project Structure

```
src/
├── app/
│   ├── exercises/
│   │   ├── layout.tsx                    # Error boundary wrapper
│   │   ├── coordinate-vision/
│   │   │   ├── page.tsx                  # Orchestrator
│   │   │   └── components/
│   │   │       ├── SelectionPanel.tsx
│   │   │       ├── GameBoard.tsx
│   │   │       └── ResultsPanel.tsx
│   │   ├── game-memory/
│   │   │   ├── page.tsx                  # Orchestrator
│   │   │   └── components/
│   │   │       ├── SelectionPanel.tsx
│   │   │       ├── GameBoard.tsx
│   │   │       └── ResultsPanel.tsx
│   │   └── san-memory/
│   │       ├── page.tsx                  # Orchestrator
│   │       └── components/
│   │           ├── SelectionPanel.tsx
│   │           ├── StudyPanel.tsx
│   │           ├── RecallPanel.tsx
│   │           └── ResultsPanel.tsx
│   ├── globals.css
│   ├── layout.tsx                        # Root layout
│   ├── page.tsx                          # Landing page
│   └── project.ts                        # App metadata
├── components/
│   ├── Card.tsx                          # Exercise card with Next.js Link
│   ├── ErrorBoundary.tsx                 # React error boundary
│   ├── ExerciseList.tsx                  # Exercise card grid
│   └── Header/Header.tsx                 # Navigation bar with logo
├── config/
│   ├── difficulty.ts                     # Centralized difficulty presets
│   └── openings.ts                       # Chess opening definitions
├── hooks/
│   ├── useMobile.ts                      # Responsive breakpoint hook
│   ├── useGameScoring.ts                 # Score/streak/round management
│   └── useTimer.ts                       # Countdown timer with cleanup
└── utils/
    ├── chessUtils.ts                     # Square generation, formatting
    └── styles.ts                         # Shared slider styles, colors
```

---

## Setup

### Prerequisites

- Node.js 20+
- npm or Bun

### Install and Run

```bash
git clone https://github.com/claygeo/chess-benchmark.git
cd chess-benchmark
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Static export to `out/` directory |
| `npm run start` | Serve production build locally |
| `npm run lint` | ESLint with auto-fix |
| `npm test` | Run unit & component tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

---

## Testing

63 tests across 10 test files covering utilities, hooks, and components.

| Layer | Framework | Files |
|-------|-----------|-------|
| Unit tests | Vitest + jsdom | `src/utils/__tests__/`, `src/hooks/__tests__/` |
| Component tests | Vitest + React Testing Library | `src/components/__tests__/`, `src/app/exercises/*/__tests__/` |

```bash
npm test              # run all tests
npm run test:watch    # watch mode
```

**CI pipeline** runs on every push and PR via GitHub Actions: lint, build, and test.

---

## Performance

Benchmarked on Netlify CDN (April 2026). Grade: **A** (8/8 budget checks passing).

| Page | Full Load | First Load JS |
|------|-----------|---------------|
| Homepage | 287ms | 97.6 KB |
| Spatial Memory | 749ms | 126 KB |
| Verbal Memory | 147ms | 92.9 KB |
| Coordinate Vision | 150ms | 118 KB |

Shared JS across all routes: 87.3 KB (React runtime + shared components). All pages statically exported to CDN with zero server-side rendering overhead.

---

## Quality

| Check | Result |
|-------|--------|
| ESLint | 0 warnings, 0 errors |
| TypeScript | Strict mode, no errors |
| Unit & Component Tests | 63/63 passing |
| Build | All 5 routes export successfully |
| QA (browser testing) | Health score: 97/100 |
| Security Audit | 0 findings (static site, no backend/auth/secrets) |

---

## Deployment

Configured for static export on Netlify. `next.config.mjs` sets `output: 'export'` to generate a fully static site -- no server-side rendering, no API routes, no Node.js runtime required.

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

Deploy to any static hosting provider by pointing to the `out/` directory.

---

## Client Work Disclaimer

This repository represents the frontend implementation of a collaborative client project. The development responsibilities were divided as follows:

- **Frontend Development**: Complete implementation of all UI components, training exercises, responsive design, and client-side functionality (this repository)
- **Backend Development**: Server architecture, APIs, database design, and backend logic (implemented by separate developer, not included in this repository)

All frontend code -- including the training algorithms, UI/UX design, responsive layouts, and interactive features -- represents original implementation work.

Special thanks to [@danmandel](https://github.com/danmandel) for the client work opportunity.

## License

Proprietary -- All rights reserved.
