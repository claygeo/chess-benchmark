'use client';

import React from 'react';
import { coordinateDifficulty, DifficultyLevel } from '@/config/difficulty';
import { formatTimeSimple } from '@/utils/chessUtils';
interface SelectionPanelProps {
  isMobile: boolean;
  currentDifficulty: DifficultyLevel;
  onSelectDifficulty: (level: DifficultyLevel) => void;
  onStart: () => void;
  // Desktop-only: shown when game is in progress
  isGameActive: boolean;
  score: number;
  bestScore: number;
  streak: number;
  accuracy: number;
  roundDisplay: string; // e.g. "3/10"
}

export default function SelectionPanel({
  isMobile,
  currentDifficulty,
  onSelectDifficulty,
  onStart,
  isGameActive,
  score,
  bestScore,
  streak,
  accuracy,
  roundDisplay,
}: SelectionPanelProps) {
  if (isMobile) {
    // Mobile: selection panel only shown during SELECTION phase
    return (
      <div className="w-full bg-chess-surface rounded-md p-4 text-center">
        <div className="mb-3">
          <div className="text-xs mb-2 text-neutral-400">
            Select Difficulty:
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(coordinateDifficulty) as DifficultyLevel[]).map((key) => {
              const preset = coordinateDifficulty[key];
              return (
                <button
                  key={key}
                  onClick={() => onSelectDifficulty(key)}
                  className="p-2 text-[11px] rounded-sm border-none cursor-pointer"
                  style={{
                    backgroundColor: currentDifficulty === key ? '#EAB308' : '#333',
                    color: currentDifficulty === key ? '#000' : 'white',
                  }}
                >
                  {preset.label} ({formatTimeSimple(preset.timePerSquare)})
                </button>
              );
            })}
          </div>
        </div>
        <button
          onClick={onStart}
          className="w-full p-3 text-sm rounded bg-chess-yellow text-black border-none cursor-pointer font-semibold"
        >
          Start Training
        </button>
      </div>
    );
  }

  // Desktop: left sidebar panel, always visible
  return (
    <div className="min-w-[200px] bg-chess-surface p-4 rounded-lg h-fit">
      <h3 className="m-0 mb-3 text-center text-sm">
        Select Difficulty
      </h3>
      <div className="flex flex-col gap-2">
        {(Object.keys(coordinateDifficulty) as DifficultyLevel[]).map((key) => {
          const preset = coordinateDifficulty[key];
          return (
            <button
              key={key}
              onClick={() => onSelectDifficulty(key)}
              disabled={isGameActive}
              className="px-3 py-2.5 text-xs rounded border-none"
              style={{
                backgroundColor: currentDifficulty === key ? '#EAB308' : '#333',
                color: currentDifficulty === key ? '#000' : 'white',
                cursor: isGameActive ? 'not-allowed' : 'pointer',
                opacity: isGameActive ? 0.5 : 1,
              }}
            >
              <div className="font-bold">
                {preset.label} ({formatTimeSimple(preset.timePerSquare)})
              </div>
            </button>
          );
        })}
      </div>

      {/* Start Training button */}
      {!isGameActive && (
        <button
          onClick={onStart}
          className="w-full mt-4 p-3 text-sm rounded-md bg-chess-yellow text-black border-none cursor-pointer font-semibold"
        >
          Start Training
        </button>
      )}

      {/* Session Stats */}
      {isGameActive && (
        <div className="mt-4 text-[11px] text-neutral-400">
          <div className="mb-2 text-xs font-bold text-white">
            Session Stats
          </div>
          <div>Score: {score}</div>
          <div>Best: {bestScore}</div>
          <div>Streak: {streak}</div>
          <div>Accuracy: {accuracy}%</div>
          <div>Round: {roundDisplay}</div>
        </div>
      )}
    </div>
  );
}
