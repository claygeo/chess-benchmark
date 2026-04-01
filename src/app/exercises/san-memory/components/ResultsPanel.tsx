'use client';

import React from 'react';
import { OpeningName } from '@/config/openings';

interface ResultsPanelProps {
  isMobile: boolean;
  isCorrect: boolean | null;
  moveCount: number;
  correctSequence: string;
  userInput: string;
  currentOpening: OpeningName;
  isMaxLevel: boolean;
}

export function ResultsPanel({
  isMobile,
  isCorrect,
  moveCount,
  correctSequence,
  userInput,
  currentOpening,
  isMaxLevel,
}: ResultsPanelProps) {
  if (isMobile) {
    return (
      <div className="text-center w-full">
        <div className={`text-xl font-bold mb-2 ${isCorrect ? 'text-chess-green' : 'text-chess-red'}`}>
          {isCorrect ? '\u2713 Correct!' : '\u2717 Incorrect'}
        </div>
        {isCorrect && (
          <div className="text-sm text-chess-yellow mb-1.5">
            +{moveCount * 10} points
          </div>
        )}
        <div className="mb-2">
          <div className="text-[10px] text-neutral-500 mb-1">
            Correct answer:
          </div>
          <div className="text-sm font-mono text-chess-green bg-[#1e1e1e] p-2 rounded break-words">
            {correctSequence}
          </div>
        </div>
        {!isCorrect && userInput && (
          <div className="mb-2">
            <div className="text-[10px] text-neutral-500 mb-1">
              Your answer:
            </div>
            <div className="text-sm font-mono text-chess-red bg-[#1e1e1e] p-2 rounded break-words">
              {userInput}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop
  return (
    <div className="text-center w-full max-w-[400px]">
      <div className={`text-[28px] font-bold mb-4 ${isCorrect ? 'text-chess-green' : 'text-chess-red'}`}>
        {isCorrect ? '\u2713 Correct!' : '\u2717 Incorrect'}
      </div>
      {isCorrect && (
        <div className="text-lg text-chess-yellow mb-3">
          +{moveCount * 10} points
        </div>
      )}
      <div className="mb-5">
        <div className="text-xs text-neutral-500 mb-2">
          Correct answer:
        </div>
        <div className="text-lg font-mono text-chess-green bg-[#1e1e1e] p-3 rounded">
          {correctSequence}
        </div>
      </div>
      {!isCorrect && userInput && (
        <div className="mb-5">
          <div className="text-xs text-neutral-500 mb-2">
            Your answer:
          </div>
          <div className="text-lg font-mono text-chess-red bg-[#1e1e1e] p-3 rounded">
            {userInput}
          </div>
        </div>
      )}
      {isMaxLevel && isCorrect && (
        <div className="mt-4 p-3 bg-[#2a5a2a] rounded text-sm text-chess-green">
          Completed all levels for {currentOpening}!
        </div>
      )}
    </div>
  );
}
