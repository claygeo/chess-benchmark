'use client';

import React from 'react';
import { OpeningName, verbalOpenings } from '@/config/openings';
import { verbalDifficulty, DifficultyLevel } from '@/config/difficulty';
import { sliderStyles, sliderThumbCSS } from '@/utils/styles';

interface SelectionPanelProps {
  isMobile: boolean;
  /** For mobile, render only 'openings' or 'controls' section. Ignored on desktop. */
  mobilePart?: 'openings' | 'controls';
  currentOpening: OpeningName;
  currentDifficulty: DifficultyLevel;
  customStudyTime: number;
  disabled: boolean; // true when not in SELECTION phase
  onOpeningChange: (opening: OpeningName) => void;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onStudyTimeChange: (time: number) => void;
  onStartGame: () => void;
  // Desktop info
  totalMoves: number;
  maxLevel: number;
  moveCount: number;
  // Results phase controls
  showResultControls: boolean;
  isCorrect: boolean | null;
  isMaxLevel: boolean;
  onContinue: () => void;
  onReset: () => void;
  // Session info (desktop)
  gamePhase: string;
  currentLevel: number;
}

export function SelectionPanel({
  isMobile,
  mobilePart,
  currentOpening,
  currentDifficulty,
  customStudyTime,
  disabled,
  onOpeningChange,
  onDifficultyChange,
  onStudyTimeChange,
  onStartGame,
  totalMoves,
  maxLevel,
  moveCount,
  showResultControls,
  isCorrect,
  isMaxLevel,
  onContinue,
  onReset,
  gamePhase,
  currentLevel,
}: SelectionPanelProps) {
  const openingNames = Object.keys(verbalOpenings) as OpeningName[];

  // ── Mobile: Opening Selection ──
  if (isMobile && mobilePart === 'openings') {
    return (
      <div className="w-full bg-chess-surface rounded-md p-2 mb-2">
        <h3 className="m-0 mb-1.5 text-center text-[11px] text-neutral-400">
          Select Opening
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {openingNames.map(opening => (
            <button
              key={opening}
              onClick={() => onOpeningChange(opening)}
              disabled={disabled}
              className={`px-1.5 py-2.5 text-[10px] rounded-sm border-none text-center min-h-[38px] transition-all duration-200 ${
                currentOpening === opening ? 'bg-chess-yellow text-black' : 'bg-chess-surface-light text-white'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'}`}
            >
              {opening}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Mobile: Training Controls ──
  if (isMobile && mobilePart === 'controls') {
    return (
      <div className="w-full bg-chess-surface rounded-md p-2 mt-2">
        <h3 className="m-0 mb-1.5 text-center text-[11px] text-neutral-400">
          Training Controls
        </h3>

        {/* Difficulty Presets - More compact */}
        <div className="mb-1.5">
          <div className="text-[9px] mb-1 text-neutral-400 text-center">
            Difficulty:
          </div>
          <div className="grid grid-cols-2 gap-1">
            {(Object.entries(verbalDifficulty) as [DifficultyLevel, typeof verbalDifficulty[DifficultyLevel]][]).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => onDifficultyChange(key)}
                disabled={disabled}
                className={`px-1 py-2 text-[9px] rounded-sm border-none text-center min-h-[30px] ${
                  currentDifficulty === key ? 'bg-chess-yellow text-black' : 'bg-chess-surface-light text-white'
                } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Phase-specific controls - Compact */}
        <div className="flex flex-col gap-1.5 min-h-[38px] justify-center">
          {!disabled && !showResultControls && (
            <button
              onClick={onStartGame}
              className="px-3 py-2.5 text-xs rounded border-none cursor-pointer font-semibold min-h-[38px] bg-chess-yellow text-black"
            >
              Start Training
            </button>
          )}

          {showResultControls && (
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={onContinue}
                className={`px-1.5 py-2 text-[11px] rounded-sm border-none cursor-pointer min-h-[36px] text-white ${
                  isCorrect ? 'bg-chess-green' : 'bg-chess-blue'
                }`}
              >
                {isCorrect ?
                  (isMaxLevel ? 'Complete!' : 'Next Level') :
                  'Try Again'
                }
              </button>
              <button
                onClick={onReset}
                className="px-1.5 py-2 text-[11px] rounded-sm border-none cursor-pointer min-h-[36px] text-white bg-chess-orange"
              >
                New Game
              </button>
            </div>
          )}
        </div>

        {/* Progress indicator - More compact */}
        {disabled && (
          <div className="mt-1.5 text-[9px] text-neutral-400 text-center">
            Level {currentLevel + 1} of {maxLevel + 1}
          </div>
        )}
      </div>
    );
  }

  // ── Desktop: Left panel (openings) + Right panel (controls) as fragment ──
  return (
    <>
      {/* Left Panel - Opening Selection */}
      <div className="min-w-[180px] bg-chess-surface p-4 rounded-lg flex flex-col">
        <h3 className="m-0 mb-3 text-center text-sm">Select Opening</h3>
        <div className="flex flex-col gap-2">
          {openingNames.map(opening => (
            <button
              key={opening}
              onClick={() => onOpeningChange(opening)}
              disabled={disabled}
              className={`px-3 py-2.5 text-xs rounded border-none transition-all duration-200 ${
                currentOpening === opening ? 'bg-chess-yellow text-black' : 'bg-chess-surface-light text-white'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'}`}
            >
              {opening}
            </button>
          ))}
        </div>

        <div className="mt-4 text-[11px] text-neutral-400">
          <div>Selected:</div>
          <div className="text-white mb-1 text-[10px]">{currentOpening}</div>
          <div>Total Moves: {totalMoves}</div>
          <div>Max Level: {maxLevel + 1}</div>
          <div className="mt-2 text-[10px] text-chess-yellow">
            Current: {moveCount} moves
          </div>
        </div>
      </div>

      {/* Right Panel - Training Controls */}
      <div className="min-w-[220px] bg-chess-surface p-4 rounded-lg flex flex-col">
        <style dangerouslySetInnerHTML={{ __html: sliderThumbCSS }} />
        <h3 className="m-0 mb-3 text-center text-sm">Training Controls</h3>

        {/* Difficulty Presets */}
        <div className="mb-3">
          <div className="text-xs mb-1.5 text-neutral-400">Difficulty Presets:</div>
          <div className="grid grid-cols-2 gap-1">
            {(Object.entries(verbalDifficulty) as [DifficultyLevel, typeof verbalDifficulty[DifficultyLevel]][]).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => onDifficultyChange(key)}
                disabled={disabled}
                className={`px-2 py-1.5 text-[10px] rounded-sm border-none ${
                  currentDifficulty === key ? 'bg-chess-yellow text-black' : 'bg-chess-surface-light text-white'
                } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Settings */}
        <div className="mb-3">
          <div className="text-xs mb-2 text-neutral-400">Custom Settings:</div>
          <div>
            <div className="flex justify-center text-[10px] mb-1.5">
              <span>Study Time: {customStudyTime}s</span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              value={customStudyTime}
              onChange={(e) => onStudyTimeChange(parseInt(e.target.value))}
              disabled={disabled}
              style={{
                ...sliderStyles,
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
            />
          </div>
        </div>

        {/* Phase-specific controls */}
        <div className="flex flex-col gap-2 min-h-[60px] justify-center">
          {!disabled && !showResultControls && (
            <button
              onClick={onStartGame}
              className="px-4 py-3 text-sm rounded-md border-none cursor-pointer font-semibold bg-chess-yellow text-black"
            >
              Start Training
            </button>
          )}

          {showResultControls && (
            <>
              <button
                onClick={onContinue}
                className={`px-3 py-2.5 text-xs rounded border-none cursor-pointer text-white ${
                  isCorrect ? 'bg-chess-green' : 'bg-chess-blue'
                }`}
              >
                {isCorrect ?
                  (isMaxLevel ? 'Complete!' : 'Next Level') :
                  'Try Again'
                }
              </button>
              <button
                onClick={onReset}
                className="px-3 py-2.5 text-xs rounded border-none cursor-pointer text-white bg-chess-orange"
              >
                New Game
              </button>
            </>
          )}
        </div>

        {/* Session Info */}
        <div className="mt-2 text-[11px] text-neutral-400">
          <div className="mb-1.5">
            <div>Phase: {gamePhase.charAt(0).toUpperCase() + gamePhase.slice(1)}</div>
            <div>Progress: Level {currentLevel + 1} / {maxLevel + 1}</div>
          </div>

          {gamePhase === 'study' && (
            <div className="text-chess-yellow text-sm text-center font-bold">
              Memorizing...
            </div>
          )}

          {gamePhase === 'recall' && (
            <div className="text-chess-green text-sm text-center font-bold">
              Input phase
            </div>
          )}

          {/* Instructions */}
          <div className="mt-3 p-2 bg-[#1e1e1e] rounded text-[10px]">
            <div className="font-bold mb-1">How to play:</div>
            <div>- Memorize the sequence</div>
            <div>- Type moves without numbers</div>
            <div>- Separate with spaces</div>
            <div>- Case doesn&apos;t matter</div>
          </div>
        </div>
      </div>
    </>
  );
}
