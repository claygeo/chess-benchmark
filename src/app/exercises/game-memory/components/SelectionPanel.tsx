'use client';

import React from 'react';
import { spatialOpenings, OpeningName } from '@/config/openings';
import { spatialDifficulty, DifficultyLevel } from '@/config/difficulty';
import { sliderStyles, sliderThumbCSS } from '@/utils/styles';

export interface SelectionPanelProps {
  isMobile: boolean;
  currentOpening: OpeningName;
  currentDifficulty: DifficultyLevel;
  customStudyTime: number;
  customAnimationSpeed: number;
  openingMoves: string[];
  isLocked: boolean;
  onOpeningChange: (opening: OpeningName) => void;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onStudyTimeChange: (time: number) => void;
  onAnimationSpeedChange: (speed: number) => void;
}

// Desktop left panel: opening picker
export function DesktopOpeningPanel({
  currentOpening,
  openingMoves,
  isLocked,
  onOpeningChange,
}: Pick<SelectionPanelProps, 'currentOpening' | 'openingMoves' | 'isLocked' | 'onOpeningChange'>) {
  return (
    <div className="min-w-[180px] bg-chess-surface p-4 rounded-lg flex flex-col">
      <h3 className="m-0 mb-3 text-center text-sm">Select Opening</h3>
      <div className="flex flex-col gap-2">
        {(Object.keys(spatialOpenings) as OpeningName[]).map(opening => (
          <button
            key={opening}
            onClick={() => onOpeningChange(opening)}
            disabled={isLocked}
            className={`py-2.5 px-3 text-xs rounded border-none transition-all duration-200 ${
              currentOpening === opening
                ? 'bg-chess-yellow text-black'
                : 'bg-chess-surface-light text-white'
            } ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'}`}
          >
            {opening}
          </button>
        ))}
      </div>

      <div className="mt-4 text-[11px] text-neutral-400">
        <div>Selected Opening:</div>
        <div className="text-white mb-1 text-[10px]">{currentOpening}</div>
        <div>Total Moves: {openingMoves.length}</div>
        <div className="mt-2 text-[10px] text-chess-yellow">
          Will show all {openingMoves.length} moves
        </div>
      </div>
    </div>
  );
}

// Desktop right panel: difficulty presets + custom sliders + phase buttons + session info
export function DesktopControlsPanel({
  currentDifficulty,
  customStudyTime,
  customAnimationSpeed,
  openingMoves,
  studyTimeSeconds,
  gamePhase,
  timeLeft,
  userMoves,
  pieceTrailCount,
  destinationFlashCount,
  hotSpotCount,
  onDifficultyChange,
  onStudyTimeChange,
  onAnimationSpeedChange,
  onStartTraining,
  onReplay,
  onConfigure,
  onGiveUp,
}: {
  currentDifficulty: DifficultyLevel;
  customStudyTime: number;
  customAnimationSpeed: number;
  openingMoves: string[];
  studyTimeSeconds: number;
  gamePhase: string;
  timeLeft: number;
  userMoves: string[];
  pieceTrailCount: number;
  destinationFlashCount: number;
  hotSpotCount: number;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onStudyTimeChange: (time: number) => void;
  onAnimationSpeedChange: (speed: number) => void;
  onStartTraining: () => void;
  onReplay: () => void;
  onConfigure: () => void;
  onGiveUp: () => void;
}) {
  return (
    <div className="min-w-[220px] bg-chess-surface p-4 rounded-lg flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: sliderThumbCSS }} />

      <h3 className="m-0 mb-3 text-center text-sm">Training Controls</h3>

      {/* Difficulty Presets */}
      <div className="mb-4">
        <div className="text-xs mb-1.5 text-neutral-400">Difficulty Presets:</div>
        <div className="grid grid-cols-2 gap-1">
          {(Object.entries(spatialDifficulty) as [DifficultyLevel, typeof spatialDifficulty[DifficultyLevel]][]).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => onDifficultyChange(key)}
              className={`py-1.5 px-2 text-[10px] rounded-sm border-none cursor-pointer ${
                currentDifficulty === key
                  ? 'bg-chess-yellow text-black'
                  : 'bg-chess-surface-light text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-neutral-500 mt-1.5 text-center">
          Affects timing, not move count
        </div>
      </div>

      {/* Custom Settings */}
      <div className="mb-4">
        <div className="text-xs mb-2 text-neutral-400">Custom Settings:</div>

        <div className="mb-2.5">
          <div className="flex justify-center text-[10px] mb-1.5">
            <span>Study Time: {customStudyTime}s</span>
          </div>
          <input
            type="range"
            min="4"
            max="15"
            value={customStudyTime}
            onChange={(e) => onStudyTimeChange(parseInt(e.target.value))}
            style={sliderStyles}
          />
        </div>

        <div>
          <div className="flex justify-center text-[10px] mb-1.5">
            <span>Animation: {customAnimationSpeed}ms</span>
          </div>
          <input
            type="range"
            min="500"
            max="1500"
            step="100"
            value={customAnimationSpeed}
            onChange={(e) => onAnimationSpeedChange(parseInt(e.target.value))}
            style={sliderStyles}
          />
        </div>
      </div>

      {/* Phase-specific controls */}
      <div className="flex flex-col gap-2 min-h-[60px] justify-center">
        {gamePhase === 'selection' && (
          <button
            onClick={onStartTraining}
            className="py-3 px-4 text-sm rounded-md bg-chess-yellow text-black border-none cursor-pointer font-semibold"
          >
            Start Training
          </button>
        )}

        {gamePhase === 'results' && (
          <>
            <button
              onClick={onReplay}
              className="py-2.5 px-3 text-xs rounded bg-chess-blue text-white border-none cursor-pointer"
            >
              Replay
            </button>
            <button
              onClick={onConfigure}
              className="py-2.5 px-3 text-xs rounded bg-chess-orange text-white border-none cursor-pointer"
            >
              Configure
            </button>
          </>
        )}

        {gamePhase === 'recall' && (
          <button
            onClick={onGiveUp}
            className="py-2.5 px-3 text-xs rounded bg-chess-red text-white border-none cursor-pointer"
          >
            Give Up
          </button>
        )}
      </div>

      {/* Enhanced Session Info */}
      <div className="mt-4 text-[11px] text-neutral-400">
        <div className="mb-2">
          <div>Phase: {gamePhase.charAt(0).toUpperCase() + gamePhase.slice(1)}</div>
          <div>Opening: {openingMoves.length} moves, {studyTimeSeconds}s study</div>
        </div>

        {gamePhase === 'studying' && (
          <div className="text-chess-yellow text-sm text-center font-bold">
            Study Time: {timeLeft}s
          </div>
        )}

        {gamePhase === 'recall' && userMoves.length > 0 && (
          <div>
            <div className="text-white mb-1 text-[10px]">Your moves:</div>
            <div className="text-[10px]">{userMoves.join(' ')}</div>
          </div>
        )}

        {(pieceTrailCount > 0 || destinationFlashCount > 0) && (gamePhase === 'showing' || gamePhase === 'studying') && (
          <div className="mt-2 text-[10px]">
            <div className="text-chess-yellow">Active trails: {pieceTrailCount}</div>
            <div className="text-neutral-500 mt-0.5">Flashes: {destinationFlashCount}</div>
            <div className="text-neutral-500 mt-0.5">Hot spots: {hotSpotCount}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mobile: Score card at top
export function MobileScoreCard({
  score,
  streak,
  round,
  movesToShow,
  currentOpening,
  statusMessage,
}: {
  score: number;
  streak: number;
  round: number;
  movesToShow: number;
  currentOpening: string;
  statusMessage: string | null;
}) {
  return (
    <div className="w-full bg-chess-surface rounded-lg py-2 px-3 mb-3 shadow-chess-card">
      <div className="grid grid-cols-4 gap-3 text-[11px] font-medium text-center">
        <div>
          <div className="text-neutral-400 text-[9px]">Score</div>
          <div className="font-bold text-neutral-200 text-xs">{score}</div>
        </div>
        <div>
          <div className="text-neutral-400 text-[9px]">Streak</div>
          <div className="font-bold text-neutral-200 text-xs">{streak}</div>
        </div>
        <div>
          <div className="text-neutral-400 text-[9px]">Round</div>
          <div className="font-bold text-neutral-200 text-xs">{round}</div>
        </div>
        <div>
          <div className="text-neutral-400 text-[9px]">Moves</div>
          <div className="font-bold text-neutral-200 text-xs">{movesToShow}</div>
        </div>
      </div>
      <div className="mt-1.5 text-center text-[10px]">
        <span className="text-white font-bold">{currentOpening}</span>
        {statusMessage && (
          <span className="text-neutral-400 ml-1.5">• {statusMessage}</span>
        )}
      </div>
    </div>
  );
}

// Mobile: Opening selection horizontal grid
export function MobileOpeningSelection({
  currentOpening,
  openingMoves,
  isLocked,
  onOpeningChange,
}: Pick<SelectionPanelProps, 'currentOpening' | 'openingMoves' | 'isLocked' | 'onOpeningChange'>) {
  return (
    <div className="w-full bg-chess-surface rounded-md p-2 mb-3">
      <h3 className="m-0 mb-1.5 text-center text-[11px] text-neutral-400">
        Select Opening
      </h3>
      <div className="grid grid-cols-3 gap-1.5">
        {(Object.keys(spatialOpenings) as OpeningName[]).map(opening => (
          <button
            key={opening}
            onClick={() => onOpeningChange(opening)}
            disabled={isLocked}
            className={`py-2 px-1.5 text-[10px] rounded-sm border-none transition-all duration-200 text-center ${
              currentOpening === opening
                ? 'bg-chess-yellow text-black'
                : 'bg-chess-surface-light text-white'
            } ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'}`}
          >
            {opening}
          </button>
        ))}
      </div>
      <div className="mt-1.5 text-[9px] text-chess-yellow text-center">
        Will show all {openingMoves.length} moves
      </div>
    </div>
  );
}

// Mobile: Training controls below the board
export function MobileTrainingControls({
  gamePhase,
  currentDifficulty,
  customStudyTime,
  customAnimationSpeed,
  timeLeft,
  userMoves,
  onDifficultyChange,
  onStudyTimeChange,
  onAnimationSpeedChange,
  onStartTraining,
  onReplay,
  onConfigure,
  onGiveUp,
}: {
  gamePhase: string;
  currentDifficulty: DifficultyLevel;
  customStudyTime: number;
  customAnimationSpeed: number;
  timeLeft: number;
  userMoves: string[];
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onStudyTimeChange: (time: number) => void;
  onAnimationSpeedChange: (speed: number) => void;
  onStartTraining: () => void;
  onReplay: () => void;
  onConfigure: () => void;
  onGiveUp: () => void;
}) {
  return (
    <div className="w-full bg-chess-surface rounded-md p-2 mt-3">
      <style dangerouslySetInnerHTML={{ __html: sliderThumbCSS }} />

      <h3 className="m-0 mb-2 text-center text-[11px] text-neutral-400">
        Training Controls
      </h3>

      {/* Difficulty Presets */}
      <div className="mb-2">
        <div className="text-[9px] mb-1 text-neutral-400 text-center">
          Difficulty Presets:
        </div>
        <div className="grid grid-cols-4 gap-[3px]">
          {(Object.entries(spatialDifficulty) as [DifficultyLevel, typeof spatialDifficulty[DifficultyLevel]][]).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => onDifficultyChange(key)}
              className={`py-1.5 px-[3px] text-[8px] rounded-sm border-none cursor-pointer text-center ${
                currentDifficulty === key
                  ? 'bg-chess-yellow text-black'
                  : 'bg-chess-surface-light text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Settings */}
      <div className="mb-2">
        <div className="text-[9px] mb-1.5 text-neutral-400 text-center">
          Custom Settings:
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[9px] mb-1 text-center">
              Study: {customStudyTime}s
            </div>
            <input
              type="range"
              min="4"
              max="15"
              value={customStudyTime}
              onChange={(e) => onStudyTimeChange(parseInt(e.target.value))}
              style={{ ...sliderStyles, height: '6px' }}
            />
          </div>
          <div>
            <div className="text-[9px] mb-1 text-center">
              Speed: {customAnimationSpeed}ms
            </div>
            <input
              type="range"
              min="500"
              max="1500"
              step="100"
              value={customAnimationSpeed}
              onChange={(e) => onAnimationSpeedChange(parseInt(e.target.value))}
              style={{ ...sliderStyles, height: '6px' }}
            />
          </div>
        </div>
      </div>

      {/* Phase-specific controls */}
      <div className="flex flex-col gap-1.5 min-h-[44px] justify-center">
        {gamePhase === 'selection' && (
          <button
            onClick={onStartTraining}
            className="py-2.5 px-3 text-xs rounded bg-chess-yellow text-black border-none cursor-pointer font-semibold"
          >
            Start Training
          </button>
        )}

        {gamePhase === 'results' && (
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onReplay}
              className="py-2 px-2.5 text-[11px] rounded-sm bg-chess-blue text-white border-none cursor-pointer"
            >
              Replay
            </button>
            <button
              onClick={onConfigure}
              className="py-2 px-2.5 text-[11px] rounded-sm bg-chess-orange text-white border-none cursor-pointer"
            >
              Configure
            </button>
          </div>
        )}

        {gamePhase === 'recall' && (
          <button
            onClick={onGiveUp}
            className="py-2 px-2.5 text-[11px] rounded-sm bg-chess-red text-white border-none cursor-pointer"
          >
            Give Up
          </button>
        )}
      </div>

      {/* Study Timer (Mobile) */}
      {gamePhase === 'studying' && (
        <div className="mt-2 text-chess-yellow text-sm text-center font-bold">
          Study Time: {timeLeft}s
        </div>
      )}

      {/* User Moves Display (Mobile) */}
      {gamePhase === 'recall' && userMoves.length > 0 && (
        <div className="mt-2">
          <div className="text-white mb-0.5 text-[9px] text-center">
            Your moves:
          </div>
          <div className="text-[9px] text-center text-neutral-400">
            {userMoves.join(' ')}
          </div>
        </div>
      )}
    </div>
  );
}
