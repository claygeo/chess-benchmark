'use client';

import { Chess } from 'chess.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DifficultyLevel, spatialDifficulty } from '@/config/difficulty';
import { OpeningName, spatialOpenings } from '@/config/openings';
import { useMobile } from '@/hooks/useMobile';
import GameBoard, { StatsCard } from './components/GameBoard';
import type { DestinationFlash, PieceTrail } from './components/GameBoard';
import {
  DesktopControlsPanel,
  DesktopOpeningPanel,
  MobileOpeningSelection,
  MobileScoreCard,
  MobileTrainingControls,
} from './components/SelectionPanel';

// Game phases
enum GamePhase {
  SELECTION = 'selection',
  SHOWING = 'showing',
  STUDYING = 'studying',
  RECALL = 'recall',
  RESULTS = 'results'
}

// Trail settings
const TRAIL_FADE_MOVES = 4;
const FLASH_DURATION = 1000;

export default function GameMemoryPage() {
  const { isMobile, isMounted } = useMobile(900);

  // Core game state
  const [game, setGame] = useState(new Chess());
  const [currentPosition, setCurrentPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.SELECTION);

  // Exercise configuration
  const [currentOpening, setCurrentOpening] = useState<OpeningName>('Ruy Lopez');
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('beginner');
  const [customStudyTime, setCustomStudyTime] = useState(10);
  const [customAnimationSpeed, setCustomAnimationSpeed] = useState(1200);

  // Move tracking
  const [, setCurrentMoveIndex] = useState(0);
  const [userMoves, setUserMoves] = useState<string[]>([]);
  const [openingMoves, setOpeningMoves] = useState<string[]>([...spatialOpenings['Ruy Lopez']]);

  // Trail tracking - FROM squares (persistent)
  const [pieceTrails, setPieceTrails] = useState<PieceTrail[]>([]);
  const [currentShowingMove, setCurrentShowingMove] = useState(0);
  const [squareActivity, setSquareActivity] = useState<{ [square: string]: number }>({});

  // Destination flashing - TO squares (temporary)
  const [destinationFlashes, setDestinationFlashes] = useState<DestinationFlash[]>([]);

  // Timing and feedback
  const [timeLeft, setTimeLeft] = useState(0);
  const [canMakeMove, setCanMakeMove] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null);

  // Scoring and progression
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);

  // Timers and refs
  const studyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const showingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameRef = useRef<Chess>(new Chess());
  const isShowingRef = useRef(false);

  // Cleanup function for timers
  const clearAllTimers = useCallback(() => {
    if (studyTimerRef.current) {
      clearTimeout(studyTimerRef.current);
      studyTimerRef.current = null;
    }
    if (showingTimerRef.current) {
      clearTimeout(showingTimerRef.current);
      showingTimerRef.current = null;
    }
  }, []);

  // Get current settings - always use full opening length
  const getCurrentSettings = useCallback(() => {
    return {
      movesToShow: openingMoves.length,
      studyTime: customStudyTime * 1000,
      animationSpeed: customAnimationSpeed
    };
  }, [openingMoves.length, customStudyTime, customAnimationSpeed]);

  // Reset game to starting position
  const resetGame = useCallback(() => {
    clearAllTimers();
    isShowingRef.current = false;

    const newGame = new Chess();
    gameRef.current = newGame;
    setGame(newGame);
    setCurrentPosition(newGame.fen());
    setCurrentMoveIndex(0);
    setUserMoves([]);
    setCanMakeMove(false);
    setPieceTrails([]);
    setDestinationFlashes([]);
    setCurrentShowingMove(0);
    setSquareActivity({});
  }, [clearAllTimers]);

  // Enhanced trail addition - adds both FROM trail and TO flash
  const addMoveHighlights = useCallback((fromSquare: string, toSquare: string, pieceType: string, moveNumber: number) => {
    setSquareActivity(prev => ({
      ...prev,
      [fromSquare]: (prev[fromSquare] || 0) + 1
    }));

    setPieceTrails(prev => {
      const filteredTrails = prev.filter(trail => moveNumber - trail.moveNumber < TRAIL_FADE_MOVES);
      const updatedTrails = filteredTrails.map(trail => ({
        ...trail,
        opacity: Math.max(0.3, 1 - ((moveNumber - trail.moveNumber) * 0.2))
      }));
      const newTrail: PieceTrail = {
        square: fromSquare,
        pieceType: pieceType.toLowerCase(),
        moveNumber,
        opacity: 0.8
      };
      return [...updatedTrails, newTrail];
    });

    setDestinationFlashes(prev => {
      const newFlash: DestinationFlash = {
        square: toSquare,
        moveNumber,
        timestamp: Date.now()
      };
      return [...prev, newFlash];
    });

    setTimeout(() => {
      setDestinationFlashes(prev =>
        prev.filter(flash => Date.now() - flash.timestamp < FLASH_DURATION)
      );
    }, FLASH_DURATION);
  }, []);

  // Start study phase
  const startStudyPhase = useCallback(() => {
    const settings = getCurrentSettings();
    setGamePhase(GamePhase.STUDYING);
    setTimeLeft(Math.floor(settings.studyTime / 1000));

    const studyInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(studyInterval);
          setGamePhase(GamePhase.RECALL);
          resetGame();
          setCanMakeMove(true);
          setCurrentMoveIndex(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    studyTimerRef.current = studyInterval;
  }, [resetGame, getCurrentSettings]);

  // Start a new round with current settings
  const startNewRound = useCallback(() => {
    setOpeningMoves([...spatialOpenings[currentOpening]]);
    setGamePhase(GamePhase.SHOWING);
    setLastResult(null);
    resetGame();
  }, [currentOpening, resetGame]);

  // End round and update scoring
  const endRound = useCallback((success: boolean) => {
    setGamePhase(GamePhase.RESULTS);
    setLastResult(success ? 'correct' : 'incorrect');
    setCanMakeMove(false);

    const settings = getCurrentSettings();

    if (success) {
      const points = settings.movesToShow * 10;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setRound(prev => prev + 1);
  }, [getCurrentSettings]);

  // Handle user moves during recall phase
  const makeAMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    if (!canMakeMove || gamePhase !== GamePhase.RECALL) return null;

    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);

    if (result === null) return null;

    setGame(gameCopy);
    setCurrentPosition(gameCopy.fen());
    setUserMoves(prev => [...prev, result.san]);
    setCurrentMoveIndex(prev => prev + 1);

    return result;
  }, [canMakeMove, gamePhase, game]);

  // Handle piece drops
  const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    });
    return move !== null;
  }, [makeAMove]);

  // Update settings when preset changes
  useEffect(() => {
    const preset = spatialDifficulty[currentDifficulty];
    setCustomStudyTime(preset.studyTime / 1000);
    setCustomAnimationSpeed(preset.animationSpeed);
  }, [currentDifficulty]);

  // Update opening moves when opening changes
  useEffect(() => {
    setOpeningMoves([...spatialOpenings[currentOpening]]);
  }, [currentOpening]);

  // Enhanced move animation with destination flashing
  useEffect(() => {
    if (gamePhase === GamePhase.SHOWING && !isShowingRef.current) {
      isShowingRef.current = true;
      const settings = getCurrentSettings();

      const showMoves = async () => {
        clearAllTimers();

        gameRef.current = new Chess();
        setCurrentPosition(gameRef.current.fen());
        setCurrentShowingMove(0);
        setPieceTrails([]);
        setDestinationFlashes([]);

        await new Promise(resolve => setTimeout(resolve, 200));

        for (let i = 0; i < settings.movesToShow; i++) {
          await new Promise(resolve => {
            showingTimerRef.current = setTimeout(() => {
              try {
                const moveToPlay = openingMoves[i];
                const moveDetails = gameRef.current.move(moveToPlay);
                if (moveDetails) {
                  addMoveHighlights(moveDetails.from, moveDetails.to, moveDetails.piece, i + 1);
                  setCurrentShowingMove(i + 1);
                  setCurrentPosition(gameRef.current.fen());
                  setCurrentMoveIndex(i + 1);
                }
                resolve(void 0);
              } catch {
                resolve(void 0);
              }
            }, settings.animationSpeed);
          });
        }

        setTimeout(() => {
          isShowingRef.current = false;
          startStudyPhase();
        }, 500);
      };

      showMoves();
    }

    return () => {
      if (gamePhase !== GamePhase.SHOWING) {
        isShowingRef.current = false;
      }
    };
  }, [gamePhase, openingMoves, addMoveHighlights, getCurrentSettings, clearAllTimers, startStudyPhase]);

  // Clean up expired flashes
  useEffect(() => {
    const interval = setInterval(() => {
      setDestinationFlashes(prev =>
        prev.filter(flash => Date.now() - flash.timestamp < FLASH_DURATION)
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Validate user's sequence
  useEffect(() => {
    if (gamePhase === GamePhase.RECALL && userMoves.length > 0) {
      const settings = getCurrentSettings();
      const expectedMovesSlice = openingMoves.slice(0, settings.movesToShow);
      const isCorrectSoFar = userMoves.every((move, index) => move === expectedMovesSlice[index]);

      if (!isCorrectSoFar) {
        endRound(false);
      } else if (userMoves.length === expectedMovesSlice.length) {
        endRound(true);
      }
    }
  }, [userMoves, gamePhase, openingMoves, getCurrentSettings, endRound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Get phase-specific status message
  const getStatusMessage = () => {
    const settings = getCurrentSettings();
    switch (gamePhase) {
      case GamePhase.SHOWING:
        return `Watching moves... (${currentShowingMove}/${settings.movesToShow})`;
      case GamePhase.STUDYING:
        return `Study time: ${timeLeft}s`;
      case GamePhase.RECALL:
        return `Recreating moves... (${userMoves.length}/${settings.movesToShow})`;
      case GamePhase.RESULTS:
        return lastResult === 'correct'
          ? `Correct! +${settings.movesToShow * 10} points`
          : `Incorrect! Try again`;
      default:
        return null;
    }
  };

  // Computed values
  const settings = getCurrentSettings();
  const isLocked = gamePhase === GamePhase.SHOWING || gamePhase === GamePhase.STUDYING || gamePhase === GamePhase.RECALL;
  const statusMessage = getStatusMessage();
  const boardSize = isMobile ? '390px' : '480px';
  const hotSpotCount = Object.values(squareActivity).filter(count => count > 1).length;

  // Shared callbacks for selection panels
  const handleConfigure = useCallback(() => setGamePhase(GamePhase.SELECTION), []);

  if (!isMounted) return null;

  return (
    <div
      className={`flex flex-col items-center min-h-screen bg-chess-bg text-white font-[Arial,sans-serif] p-[15px] box-border ${
        isMobile ? 'justify-center pt-[15px]' : 'justify-start pt-[45px]'
      }`}
    >
      {isMobile ? (
        /* MOBILE LAYOUT */
        <div className="flex flex-col items-center w-full max-w-[420px] px-2">
          <MobileScoreCard
            score={score}
            streak={streak}
            round={round}
            movesToShow={settings.movesToShow}
            currentOpening={currentOpening}
            statusMessage={statusMessage}
          />

          <MobileOpeningSelection
            currentOpening={currentOpening}
            openingMoves={openingMoves}
            isLocked={isLocked}
            onOpeningChange={setCurrentOpening}
          />

          <GameBoard
            isMobile={true}
            gamePhase={gamePhase}
            currentPosition={currentPosition}
            canMakeMove={canMakeMove}
            pieceTrails={pieceTrails}
            destinationFlashes={destinationFlashes}
            currentShowingMove={currentShowingMove}
            userMoves={userMoves}
            movesToShow={settings.movesToShow}
            onDrop={onDrop}
          />

          <MobileTrainingControls
            gamePhase={gamePhase}
            currentDifficulty={currentDifficulty}
            customStudyTime={customStudyTime}
            customAnimationSpeed={customAnimationSpeed}
            timeLeft={timeLeft}
            userMoves={userMoves}
            onDifficultyChange={setCurrentDifficulty}
            onStudyTimeChange={setCustomStudyTime}
            onAnimationSpeedChange={setCustomAnimationSpeed}
            onStartTraining={startNewRound}
            onReplay={startNewRound}
            onConfigure={handleConfigure}
            onGiveUp={() => endRound(false)}
          />
        </div>
      ) : (
        /* DESKTOP LAYOUT */
        <div className="flex items-start gap-[25px] max-w-[1000px] w-full">
          {/* Left Panel - Opening Selection */}
          <DesktopOpeningPanel
            currentOpening={currentOpening}
            openingMoves={openingMoves}
            isLocked={isLocked}
            onOpeningChange={setCurrentOpening}
          />

          {/* Center - Chessboard Area */}
          <div className="flex-1 flex flex-col items-center">
            <StatsCard
              boardSize={boardSize}
              score={score}
              streak={streak}
              round={round}
              movesToShow={settings.movesToShow}
              currentOpening={currentOpening}
              statusMessage={statusMessage}
            />

            <GameBoard
              isMobile={false}
              gamePhase={gamePhase}
              currentPosition={currentPosition}
              canMakeMove={canMakeMove}
              pieceTrails={pieceTrails}
              destinationFlashes={destinationFlashes}
              currentShowingMove={currentShowingMove}
              userMoves={userMoves}
              movesToShow={settings.movesToShow}
              onDrop={onDrop}
            />
          </div>

          {/* Right Panel - Training Controls */}
          <DesktopControlsPanel
            currentDifficulty={currentDifficulty}
            customStudyTime={customStudyTime}
            customAnimationSpeed={customAnimationSpeed}
            openingMoves={openingMoves}
            studyTimeSeconds={customStudyTime}
            gamePhase={gamePhase}
            timeLeft={timeLeft}
            userMoves={userMoves}
            pieceTrailCount={pieceTrails.length}
            destinationFlashCount={destinationFlashes.length}
            hotSpotCount={hotSpotCount}
            onDifficultyChange={setCurrentDifficulty}
            onStudyTimeChange={setCustomStudyTime}
            onAnimationSpeedChange={setCustomAnimationSpeed}
            onStartTraining={startNewRound}
            onReplay={startNewRound}
            onConfigure={handleConfigure}
            onGiveUp={() => endRound(false)}
          />
        </div>
      )}
    </div>
  );
}
