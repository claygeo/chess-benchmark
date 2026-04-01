'use client';

import React from 'react';
import { Chessboard } from 'react-chessboard';
import { formatTime } from '@/utils/chessUtils';
type GamePhase = 'selection' | 'playing' | 'feedback' | 'results';

interface GameBoardProps {
  isMobile: boolean;
  gamePhase: GamePhase;
  // Score card (mobile only, shown during active game)
  score: number;
  streak: number;
  roundDisplay: string;
  accuracy: number;
  // Timer
  timeLeft: number;
  // Board
  squareStyles: { [square: string]: React.CSSProperties };
  // Progress bar (desktop only)
  progressPercent: number;
  // Input
  userInput: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onQuit: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  // Feedback
  isCorrect: boolean | null;
  targetSquare: string;
  responseTime: number;
}

export default function GameBoard({
  isMobile,
  gamePhase,
  score,
  streak,
  roundDisplay,
  accuracy,
  timeLeft,
  squareStyles,
  progressPercent,
  userInput,
  onInputChange,
  onSubmit,
  onQuit,
  inputRef,
  isCorrect,
  targetSquare,
  responseTime,
}: GameBoardProps) {
  const boardSize = isMobile ? '360px' : '480px';
  const isActive = gamePhase !== 'selection' && gamePhase !== 'results';

  if (isMobile) {
    return (
      <>
        {/* Score Card */}
        {isActive && (
          <div className="w-full bg-chess-surface rounded-lg px-3 py-2 mb-3 shadow-chess-card">
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
                <div className="font-bold text-neutral-200 text-xs">{roundDisplay}</div>
              </div>
              <div>
                <div className="text-neutral-400 text-[9px]">Accuracy</div>
                <div className="font-bold text-neutral-200 text-xs">{accuracy}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Timer */}
        {gamePhase === 'playing' && (
          <div className="w-full mb-2 text-center">
            <div
              className="inline-block px-5 py-1.5 rounded text-base font-bold shadow-md"
              style={{
                backgroundColor: timeLeft < 1000 ? '#f44336' : '#2a2a2a',
              }}
            >
              Time: {formatTime(timeLeft)}
            </div>
          </div>
        )}

        {/* Chessboard */}
        <div
          className="border-2 border-chess-surface-light rounded-md overflow-hidden mb-4"
          style={{ width: boardSize, height: boardSize }}
        >
          <Chessboard
            id="coordinate-vision-board"
            position={'start'}
            arePiecesDraggable={false}
            customSquareStyles={squareStyles}
            animationDuration={0}
            showBoardNotation={true}
          />
        </div>

        {/* Input */}
        {gamePhase === 'playing' && (
          <div className="w-full">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSubmit();
              }}
              placeholder="Type the square (e.g., e4)"
              className="w-full p-3.5 text-base bg-chess-surface-light text-white border-2 border-[#444] rounded outline-none text-center font-mono box-border appearance-none"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              autoFocus
            />
            <div className="grid grid-cols-2 gap-2 mt-2.5">
              <button
                onClick={onSubmit}
                className="p-3 text-sm rounded bg-chess-yellow text-black border-none cursor-pointer font-semibold"
              >
                Submit
              </button>
              <button
                onClick={onQuit}
                className="p-3 text-sm rounded bg-chess-red text-white border-none cursor-pointer font-semibold"
              >
                Quit
              </button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {gamePhase === 'feedback' && (
          <div className="w-full bg-chess-surface rounded-md p-4 text-center">
            <div
              className="text-xl font-bold mb-2"
              style={{ color: isCorrect ? '#4CAF50' : '#f44336' }}
            >
              {isCorrect ? '\u2714 Correct!' : '\u2718 Incorrect'}
            </div>
            <div className="text-sm text-neutral-400">
              The square was: <span className="font-bold text-white">{targetSquare.toUpperCase()}</span>
            </div>
            {isCorrect && (
              <div className="text-xs text-chess-yellow mt-1">
                Time: {formatTime(responseTime)}
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  // DESKTOP LAYOUT - center column
  return (
    <div className="flex-1 flex flex-col items-center">
      {/* Timer */}
      {gamePhase === 'playing' && (
        <div className="mb-3">
          <div
            className="px-6 py-2 rounded text-lg font-bold shadow-md"
            style={{
              backgroundColor: timeLeft < 1000 ? '#f44336' : '#2a2a2a',
            }}
          >
            Time: {formatTime(timeLeft)}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {isActive && (
        <div className="mb-3" style={{ width: boardSize }}>
          <div className="w-full h-1.5 bg-chess-surface-light rounded-sm overflow-hidden">
            <div
              className="h-full bg-chess-yellow transition-[width] duration-300 ease-in-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Chessboard */}
      <div
        className="rounded-lg overflow-hidden mb-4 shadow-chess-card"
        style={{ width: boardSize, height: boardSize }}
      >
        <Chessboard
          id="coordinate-vision-board"
          position={'start'}
          arePiecesDraggable={false}
          customSquareStyles={squareStyles}
          animationDuration={0}
          showBoardNotation={true}
        />
      </div>

      {/* Input */}
      {gamePhase === 'playing' && (
        <div className="w-full max-w-[400px]">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSubmit();
            }}
            placeholder="Type the square name (e.g., e4)"
            className="w-full p-3.5 text-lg bg-chess-surface text-white border-2 border-chess-surface-light rounded-md outline-none text-center font-mono box-border"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <button
              onClick={onSubmit}
              className="p-3 text-sm rounded bg-chess-yellow text-black border-none cursor-pointer font-semibold"
            >
              Submit
            </button>
            <button
              onClick={onQuit}
              className="p-3 text-sm rounded bg-chess-red text-white border-none cursor-pointer font-semibold"
            >
              Quit
            </button>
          </div>
        </div>
      )}

      {/* Feedback */}
      {gamePhase === 'feedback' && (
        <div className="bg-chess-surface rounded-md p-5 text-center max-w-[400px] w-full">
          <div
            className="text-2xl font-bold mb-3"
            style={{ color: isCorrect ? '#4CAF50' : '#f44336' }}
          >
            {isCorrect ? '\u2714 Correct!' : '\u2718 Incorrect'}
          </div>
          <div className="text-base text-neutral-400">
            The square was: <span className="font-bold text-white text-lg">
              {targetSquare.toUpperCase()}
            </span>
          </div>
          {isCorrect && (
            <div className="text-sm text-chess-yellow mt-2">
              Response time: {formatTime(responseTime)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
