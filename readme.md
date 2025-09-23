# Chess Benchmark

A comprehensive React-based chess training platform designed to improve cognitive chess skills through interactive exercises. The system features multiple training modules including coordinate vision, spatial memory, opening memorization, and piece movement recognition, all optimized for both desktop and mobile devices.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Training Modules](#training-modules)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Training Exercises](#training-exercises)
- [Responsive Design](#responsive-design)
- [Visuals](#visuals)
- [Development Notes](#development-notes)
- [Client Work Disclaimer](#client-work-disclaimer)

## Project Overview

Chess Benchmark is an interactive training platform designed to enhance chess players' cognitive abilities through scientifically-backed exercises. The platform focuses on core chess skills including board visualization, pattern recognition, and move calculation speed.

**⚠️ Client Project Notice**: This was a collaborative client project. The frontend implementation (this repository) was developed independently, while the backend architecture was implemented by a separate developer. This repository contains only the frontend components and related documentation.

## Features

- **Multi-Modal Training**: Four distinct cognitive training exercises
- **Responsive Design**: Optimized layouts for both desktop and mobile devices
- **Difficulty Scaling**: Progressive difficulty levels with customizable settings
- **Real-Time Feedback**: Immediate performance feedback and scoring
- **Session Tracking**: Score tracking, streaks, and performance analytics
- **Modern UI/UX**: Dark theme optimized for extended training sessions
- **Offline Capability**: Fully functional without internet connection after initial load
- **Performance Optimization**: Smooth animations and responsive controls

## Training Modules

### 1. Coordinate Vision
- **Purpose**: Rapid square identification and coordinate recognition
- **Mechanics**: Highlighted squares appear on the board, user inputs coordinates
- **Difficulty Levels**: Beginner (5s), Club (3s), Expert (2s), Master (1s)
- **Scoring**: Time-based scoring with streak bonuses

### 2. Spatial Memory
- **Purpose**: Chess opening memorization and piece movement tracking
- **Mechanics**: Watch opening sequences, then recreate them from memory
- **Features**: Enhanced trail visualization, piece movement tracking
- **Openings**: Ruy Lopez, King's Indian Defense, Queen's Gambit
- **Customization**: Adjustable study time and animation speed

### 3. SAN Memory (Algebraic Notation)
- **Purpose**: Chess notation memorization and verbal memory training
- **Mechanics**: Progressive sequence memorization (2, 4, 6+ moves)
- **Format**: Standard Algebraic Notation (SAN) input and validation
- **Progression**: Dynamic difficulty scaling based on performance

### 4. Piece Movement Recognition
- **Purpose**: Rapid identification of valid piece moves
- **Mechanics**: Given a piece and square, identify all legal moves
- **Scope**: Knight moves implemented (expandable to other pieces)
- **Input Methods**: Keyboard input with move validation

## Prerequisites

Before setting up the project, ensure you have the following:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (for optimal performance)
- **Git**: For repository management

## Setup

Follow these steps to set up the project locally:

1. **Clone the Repository**:
```bash
git clone https://github.com/your-username/chess-benchmark.git
cd chess-benchmark
```

2. **Navigate to Frontend Directory**:
```bash
cd frontend_concept
```

3. **Install Dependencies**:
```bash
npm install
# or
yarn install
```

4. **Start Development Server**:
```bash
npm run dev
# or
yarn dev
```

5. **Build for Production**:
```bash
npm run build
# or
yarn build
```

6. **Start Production Server**:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Tech Stack

### Core Technologies
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **UI Library**: React 18+ with Hooks
- **Styling**: Tailwind CSS with custom dark theme
- **Chess Logic**: Chess.js library
- **Chess Board**: React-chessboard component

### Key Libraries
- **Icons**: React Icons
- **Authentication**: Firebase Auth (configured for future use)
- **State Management**: React Context and useState
- **Routing**: Next.js App Router
- **Theme**: next-themes for dark mode support

### Development Tools
- **Package Manager**: npm/yarn
- **Type Checking**: TypeScript
- **Code Quality**: ESLint configuration
- **Build Tool**: Next.js built-in bundler

## Project Structure

```
chessbenchmark/
├── frontend_concept/          # Main frontend implementation (React/Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── coordinate-vision/
│   │   │   ├── spatial-memory/
│   │   │   ├── san-memory/
│   │   │   ├── piece-moves/
│   │   │   └── globals.css
│   │   └── components/
│   │       ├── Header/
│   │       ├── ExerciseList/
│   │       └── Card/
├── backend/                   # Backend implementation (separate developer)
├── frontend_template/         # Template/boilerplate files
└── README.md
```

## Training Exercises

### Coordinate Vision Training
- **Game Flow**: Selection → Playing → Feedback → Results
- **Input Method**: Keyboard input with real-time validation
- **Scoring System**: Base points + time bonus + streak multiplier
- **Mobile Optimization**: Touch-friendly interface with larger targets

### Spatial Memory Training  
- **Game Phases**: Selection → Showing → Studying → Recall → Results
- **Visual Features**: 
  - FROM square trails (persistent highlighting)
  - TO square flashes (temporary bright highlights)
  - Trail decay system for visual clarity
- **Customization**: Study time (4-15s), animation speed (500-1500ms)

### SAN Memory Training
- **Progressive Difficulty**: Start with 2 moves, progress to full openings
- **Input Validation**: Normalized input handling (case-insensitive, space-tolerant)
- **Sequence Display**: Formatted with visual separators for readability
- **Level System**: Complete all levels to master an opening

### Piece Movement Training
- **Current Implementation**: Knight moves
- **Extensible Architecture**: Ready for additional piece types
- **Real-time Validation**: Immediate feedback on move accuracy
- **Performance Tracking**: Score-based progression system

## Responsive Design

### Mobile Optimizations (≤900px)
- **Compressed Layouts**: Optimized spacing and component sizing
- **Touch-Friendly Controls**: Larger buttons and input areas
- **Vertical Stack**: Single-column layout for better mobile UX
- **Reduced Information Density**: Essential info only
- **Gesture Support**: Touch-optimized chessboard interactions

### Desktop Features (>900px)
- **Multi-Panel Layout**: Side panels for controls and statistics
- **Rich Information Display**: Comprehensive stats and progress tracking
- **Keyboard Shortcuts**: Enhanced keyboard navigation
- **Hover Effects**: Interactive feedback for better UX

## Visuals

Dashboard:
<img width="1892" height="897" alt="chess-11" src="https://github.com/user-attachments/assets/adfa0488-7c48-4a53-8731-a83937c262e2" />

Spatial Memory:
<img width="1887" height="897" alt="chess-12" src="https://github.com/user-attachments/assets/38ed4bea-f8af-4cf1-8b89-0079895683fa" />

Verbal Memory:
<img width="1895" height="900" alt="chess-13" src="https://github.com/user-attachments/assets/6f8c4112-918d-4062-aaaa-cca01a5108b4" />

Coordinate Vision:
<img width="1888" height="896" alt="chess-14" src="https://github.com/user-attachments/assets/1f2e19e1-6b8e-4aaf-9b31-825baf045c50" />

## Development Notes

### Frontend Architecture
- **Component Structure**: Modular React components with TypeScript
- **State Management**: Local state with React hooks, Context for global state
- **Performance**: Optimized rendering with useCallback and useMemo
- **Mobile-First**: Responsive design starting from mobile breakpoints

### Code Quality
- **TypeScript**: Full type coverage for better development experience
- **Error Handling**: Comprehensive validation and error boundaries
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Browser Compatibility**: Tested across modern browsers

### Future Enhancements
- **Additional Pieces**: Expand piece movement training to all piece types
- **Multiplayer**: Real-time training sessions with other players
- **Analytics**: Advanced performance tracking and improvement suggestions
- **Offline Sync**: Enhanced offline capability with data persistence

## Client Work Disclaimer

**Important**: This repository represents the frontend implementation of a collaborative client project. The development responsibilities were divided as follows:

- **Frontend Development**: Complete implementation of all user interface components, training exercises, responsive design, and client-side functionality (this repository)
- **Backend Development**: Server architecture, APIs, database design, and backend logic (implemented by separate developer, not included in this repository)

The frontend was developed independently based on agreed-upon specifications and interfaces. All frontend code, including the training algorithms, UI/UX design, responsive layouts, and interactive features, represents original implementation work.

For questions regarding the backend implementation or full-stack integration, please refer to the appropriate project stakeholders.

## Acknowledgments

Special thanks to [@danmandel](https://github.com/danmandel) for the client work opportunity and excellent collaboration throughout this project. Working together on this chess training platform was a great experience, and his backend expertise made the full-stack implementation possible.

---

## License

This project was developed as client work. Please refer to the project agreement for usage and licensing terms.

## Contact

For questions about the frontend implementation or technical details, please reach out through the project communication channels established with the client.
