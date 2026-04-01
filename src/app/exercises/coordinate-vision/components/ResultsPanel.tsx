'use client';

import React from 'react';
interface ResultsPanelProps {
  isMobile: boolean;
  score: number;
  bestScore: number;
  correctAnswers: number;
  totalRounds: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export default function ResultsPanel({
  isMobile,
  score,
  bestScore,
  correctAnswers,
  totalRounds,
  onPlayAgain,
  onBackToMenu,
}: ResultsPanelProps) {
  const accuracyPercent = Math.round((correctAnswers / totalRounds) * 100);

  if (isMobile) {
    return (
      <div className="w-full bg-chess-surface rounded-md p-4 text-center">
        <div className="text-xl font-bold text-chess-green mb-3">
          Training Complete!
        </div>
        <div className="text-sm mb-4">
          <div>Final Score: {score}</div>
          <div>Accuracy: {correctAnswers}/{totalRounds} ({accuracyPercent}%)</div>
          {bestScore > 0 && <div>Best Score: {bestScore}</div>}
        </div>
        <button
          onClick={onPlayAgain}
          className="w-full p-3 text-sm rounded bg-chess-blue text-white border-none cursor-pointer font-semibold mb-2"
        >
          Play Again
        </button>
        <button
          onClick={onBackToMenu}
          className="w-full p-3 text-sm rounded bg-chess-orange text-white border-none cursor-pointer"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  // Desktop
  return (
    <div className="bg-chess-surface rounded-lg p-[30px] text-center max-w-[400px] mx-auto">
      <div className="text-[28px] font-bold text-chess-green mb-4">
        Training Complete!
      </div>
      <div className="text-base mb-5">
        <div className="mb-2">Final Score: {score}</div>
        <div className="mb-2">Accuracy: {correctAnswers}/{totalRounds} ({accuracyPercent}%)</div>
        {bestScore > 0 && <div>Best Score: {bestScore}</div>}
      </div>
      <button
        onClick={onPlayAgain}
        className="w-full p-3.5 text-base rounded-md bg-chess-blue text-white border-none cursor-pointer font-semibold mb-2.5"
      >
        Play Again
      </button>
      <button
        onClick={onBackToMenu}
        className="w-full p-3.5 text-base rounded-md bg-chess-orange text-white border-none cursor-pointer"
      >
        Back to Menu
      </button>
    </div>
  );
}
