'use client';

import React from 'react';

// The results display in this exercise is integrated into the existing UI:
// - The status message ("Correct! +X points" / "Incorrect! Try again") appears
//   in the MobileScoreCard and desktop StatsCard via the statusMessage prop.
// - The action buttons (Replay / Configure) appear in MobileTrainingControls
//   and DesktopControlsPanel when gamePhase === 'results'.
//
// This file is a placeholder for the ResultsPanel component. If a dedicated
// results screen is needed in the future, it can be built out here.

interface ResultsPanelProps {
  lastResult: 'correct' | 'incorrect' | null;
  movesToShow: number;
  score: number;
  streak: number;
  round: number;
  onReplay: () => void;
  onConfigure: () => void;
}

export default function ResultsPanel(_props: ResultsPanelProps) {
  return null;
}
