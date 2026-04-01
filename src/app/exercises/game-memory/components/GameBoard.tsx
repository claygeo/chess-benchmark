'use client';

import React, { useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { COLORS } from '@/utils/styles';
// COLORS still needed for dynamic square styles with computed opacity hex codes

// Trail interface for piece movement tracking (FROM squares)
export interface PieceTrail {
  square: string;
  pieceType: string;
  moveNumber: number;
  opacity: number;
}

// Destination flash interface (TO squares)
export interface DestinationFlash {
  square: string;
  moveNumber: number;
  timestamp: number;
}

const TRAIL_YELLOW = COLORS.trail;
const FLASH_DURATION = 1000;

interface GameBoardProps {
  isMobile: boolean;
  gamePhase: string;
  currentPosition: string;
  canMakeMove: boolean;
  pieceTrails: PieceTrail[];
  destinationFlashes: DestinationFlash[];
  currentShowingMove: number;
  userMoves: string[];
  movesToShow: number;
  onDrop: (sourceSquare: string, targetSquare: string) => boolean;
}

export default function GameBoard({
  isMobile,
  gamePhase,
  currentPosition,
  canMakeMove,
  pieceTrails,
  destinationFlashes,
  currentShowingMove,
  userMoves,
  movesToShow,
  onDrop,
}: GameBoardProps) {
  const boardSize = isMobile ? '390px' : '480px';
  const boardId = isMobile ? 'mobile-spatial-memory-chessboard' : 'desktop-spatial-memory-chessboard';

  const getEnhancedSquareStyles = useCallback(() => {
    const styles: { [square: string]: React.CSSProperties } = {};

    // Destination flashes (TO squares) take priority
    destinationFlashes.forEach(flash => {
      const flashAge = Date.now() - flash.timestamp;
      if (flashAge < FLASH_DURATION) {
        styles[flash.square] = {
          backgroundColor: `${TRAIL_YELLOW}`,
          border: `3px solid ${TRAIL_YELLOW}`,
          borderRadius: '6px',
          boxSizing: 'border-box',
          boxShadow: `0 0 10px ${TRAIL_YELLOW}80`
        };
      }
    });

    // Persistent trails (FROM squares) - skip if already a destination flash
    pieceTrails.forEach(trail => {
      if (styles[trail.square]) return;

      const age = currentShowingMove - trail.moveNumber;

      if (age === 0) {
        styles[trail.square] = {
          backgroundColor: `${TRAIL_YELLOW}DD`,
          border: `2px solid ${TRAIL_YELLOW}`,
          borderRadius: '4px',
          boxSizing: 'border-box'
        };
      } else if (age === 1) {
        styles[trail.square] = {
          backgroundColor: `${TRAIL_YELLOW}BB`,
          borderRadius: '3px'
        };
      } else if (age === 2) {
        styles[trail.square] = {
          backgroundColor: `${TRAIL_YELLOW}99`,
          borderRadius: '3px'
        };
      } else {
        styles[trail.square] = {
          backgroundColor: `${TRAIL_YELLOW}66`,
          borderRadius: '2px'
        };
      }
    });

    return styles;
  }, [pieceTrails, destinationFlashes, currentShowingMove]);

  const showLegend = (gamePhase === 'showing' || gamePhase === 'studying') &&
    (pieceTrails.length > 0 || destinationFlashes.length > 0);

  return (
    <>
      {/* Trail Legend - always rendered with fixed height to prevent layout shift */}
      <div className={`flex items-center w-full ${
        isMobile ? 'min-h-[32px] mb-2' : 'min-h-[37px] mb-3'
      }`}>
        {showLegend && (
          <div className={`text-neutral-400 flex items-center bg-chess-surface rounded-md flex-wrap w-full ${
            isMobile ? 'text-[9px] gap-1.5 py-1.5 px-2.5' : 'text-[11px] gap-[15px] py-2 px-4'
          }`}>
            <span className="font-medium">Movement tracking:</span>

            <div className="flex items-center gap-1">
              <div
                className={`rounded-sm ${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'}`}
                style={{
                  backgroundColor: `${TRAIL_YELLOW}BB`,
                  border: `1px solid ${TRAIL_YELLOW}`
                }}
              />
              <span className={isMobile ? 'text-[8px]' : 'text-[10px]'}>From squares</span>
            </div>

            {destinationFlashes.length > 0 && (
              <div className="flex items-center gap-1">
                <div
                  className={`rounded-sm ${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'}`}
                  style={{
                    backgroundColor: TRAIL_YELLOW,
                    border: `2px solid ${TRAIL_YELLOW}`,
                    boxShadow: `0 0 4px ${TRAIL_YELLOW}80`
                  }}
                />
                <span className={isMobile ? 'text-[8px]' : 'text-[10px]'}>To squares</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chessboard */}
      <div
        className={`border-2 border-chess-surface-light rounded-md overflow-hidden ${
          isMobile ? 'mb-2' : 'mb-2.5'
        }`}
        style={{ width: boardSize, height: boardSize }}
      >
        <Chessboard
          id={boardId}
          position={currentPosition}
          onPieceDrop={onDrop}
          arePiecesDraggable={canMakeMove}
          customSquareStyles={getEnhancedSquareStyles()}
          animationDuration={200}
        />
      </div>

      {/* Progress indicator for recall phase */}
      {gamePhase === 'recall' && (
        <div className={`text-center ${isMobile ? 'mb-2' : ''}`} style={{ width: boardSize }}>
          <div className={`w-full bg-chess-surface-light rounded-sm overflow-hidden ${
            isMobile ? 'h-[5px] mb-1' : 'h-1.5 mb-1.5'
          }`}>
            <div
              className="h-full bg-chess-yellow transition-[width] duration-300 ease-in-out"
              style={{ width: `${(userMoves.length / movesToShow) * 100}%` }}
            />
          </div>
          <p className={`m-0 text-neutral-400 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
            Progress: {userMoves.length}/{movesToShow} moves
          </p>
        </div>
      )}
    </>
  );
}

// Desktop stats card rendered above the board
export function StatsCard({
  boardSize,
  score,
  streak,
  round,
  movesToShow,
  currentOpening,
  statusMessage,
}: {
  boardSize: string;
  score: number;
  streak: number;
  round: number;
  movesToShow: number;
  currentOpening: string;
  statusMessage: string | null;
}) {
  return (
    <div
      className="bg-chess-surface rounded-lg py-3 px-5 mb-3 shadow-chess-card w-full"
      style={{ maxWidth: boardSize }}
    >
      <div className="flex gap-6 items-center justify-center text-[13px] font-medium">
        <span>Score: <span className="font-bold text-neutral-200">{score}</span></span>
        <span>Streak: <span className="font-bold text-neutral-200">{streak}</span></span>
        <span>Round: <span className="font-bold text-neutral-200">{round}</span></span>
        <span>Moves: <span className="font-bold text-neutral-200">{movesToShow}</span></span>
      </div>
      <div className="mt-1.5 flex gap-4 items-center justify-center text-xs">
        <span>Opening: <span className="text-white font-bold">{currentOpening}</span></span>
        {statusMessage && (
          <>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-400">{statusMessage}</span>
          </>
        )}
      </div>
    </div>
  );
}
