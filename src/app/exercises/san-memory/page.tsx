'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DifficultyLevel, verbalDifficulty } from '@/config/difficulty';
import { OpeningName, verbalOpenings } from '@/config/openings';
import { useGameScoring } from '@/hooks/useGameScoring';
import { useMobile } from '@/hooks/useMobile';
import { useTimer } from '@/hooks/useTimer';
import { sliderThumbCSS } from '@/utils/styles';
import { RecallPanel } from './components/RecallPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { SelectionPanel } from './components/SelectionPanel';
import { StudyPanel } from './components/StudyPanel';

enum GamePhase {
  SELECTION = 'selection',
  STUDY = 'study',
  RECALL = 'recall',
  RESULTS = 'results'
}

export default function SanMemoryPage() {
  const { isMobile, isMounted } = useMobile();
  const { score, bestScore, streak, round, addScore, resetStreak, nextRound, resetScoring } = useGameScoring();
  const { clearTimer } = useTimer();

  // Core game state
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.SELECTION);
  const [currentOpening, setCurrentOpening] = useState<OpeningName>('Ruy Lopez');
  const [currentLevel, setCurrentLevel] = useState(0); // 0 = 2 moves, 1 = 4 moves, etc.
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('beginner');

  // Custom settings
  const [customStudyTime, setCustomStudyTime] = useState(10);

  // User input and validation
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Ref to track study timer interval (for seconds countdown display)
  const studyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [studyTimeLeft, setStudyTimeLeft] = useState(0);

  // Update settings when preset changes
  useEffect(() => {
    const preset = verbalDifficulty[currentDifficulty];
    setCustomStudyTime(preset.studyTime / 1000);
  }, [currentDifficulty]);

  // Cleanup timers
  const clearAllTimers = useCallback(() => {
    clearTimer();
    if (studyTimerRef.current) {
      clearInterval(studyTimerRef.current);
      studyTimerRef.current = null;
    }
  }, [clearTimer]);

  // Generate sequence dynamically
  const getCurrentSequence = useCallback(() => {
    const moves = verbalOpenings[currentOpening];
    const moveCount = (currentLevel + 1) * 2; // Level 0 = 2 moves, Level 1 = 4 moves, etc.
    const sequenceMoves = moves.slice(0, Math.min(moveCount, moves.length));
    return sequenceMoves.join(' ');
  }, [currentOpening, currentLevel]);

  // Get number of moves in current sequence
  const getMoveCount = useCallback(() => {
    const moves = verbalOpenings[currentOpening];
    const moveCount = (currentLevel + 1) * 2;
    return Math.min(moveCount, moves.length);
  }, [currentOpening, currentLevel]);

  // Get max level for current opening
  const getMaxLevel = useCallback(() => {
    return Math.floor(verbalOpenings[currentOpening].length / 2) - 1;
  }, [currentOpening]);

  // Format sequence for display (adds visual breaks for readability)
  const formatSequenceForDisplay = useCallback((sequence: string) => {
    const moves = sequence.split(' ');
    const formatted = [];
    for (let i = 0; i < moves.length; i += 2) {
      if (i > 0) formatted.push(' ');
      formatted.push(moves[i]);
      if (moves[i + 1]) {
        formatted.push(' ');
        formatted.push(moves[i + 1]);
      }
      if (i < moves.length - 2) formatted.push(' \u00b7'); // Visual separator
    }
    return formatted.join('');
  }, []);

  // Start study phase
  const startStudyPhase = useCallback(() => {
    setGamePhase(GamePhase.STUDY);
    setUserInput('');
    setIsCorrect(null);
    setStudyTimeLeft(customStudyTime);

    // Countdown timer using local interval (seconds-based display)
    const countdown = setInterval(() => {
      setStudyTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          studyTimerRef.current = null;
          setGamePhase(GamePhase.RECALL);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    studyTimerRef.current = countdown;
  }, [customStudyTime]);

  // Start a new game
  const startNewGame = useCallback(() => {
    clearAllTimers();
    setCurrentLevel(0);
    setUserInput('');
    setIsCorrect(null);
    resetScoring();
    startStudyPhase();
  }, [clearAllTimers, resetScoring, startStudyPhase]);

  // Handle user input submission
  const handleSubmit = useCallback(() => {
    const correctSequence = getCurrentSequence();
    const userSequence = userInput.trim();

    // Normalize: remove extra spaces, lowercase
    const normalizedCorrect = correctSequence.toLowerCase().replace(/\s+/g, ' ');
    const normalizedUser = userSequence.toLowerCase().replace(/\s+/g, ' ');

    const correct = normalizedUser === normalizedCorrect;
    setIsCorrect(correct);
    setGamePhase(GamePhase.RESULTS);

    if (correct) {
      const points = getMoveCount() * 10;
      addScore(points);
    } else {
      resetStreak();
    }

    nextRound();
  }, [userInput, getCurrentSequence, getMoveCount, addScore, resetStreak, nextRound]);

  // Continue to next level
  const continueGame = useCallback(() => {
    if (isCorrect) {
      const maxLevel = getMaxLevel();
      if (currentLevel < maxLevel) {
        setCurrentLevel(prev => prev + 1);
        startStudyPhase();
      } else {
        // Completed all levels for this opening!
        setGamePhase(GamePhase.SELECTION);
      }
    } else {
      // Game over - restart from beginning
      setCurrentLevel(0);
      resetScoring();
      setGamePhase(GamePhase.SELECTION);
    }
  }, [isCorrect, currentLevel, getMaxLevel, startStudyPhase, resetScoring]);

  // Reset to selection
  const resetToSelection = useCallback(() => {
    clearAllTimers();
    setGamePhase(GamePhase.SELECTION);
    setCurrentLevel(0);
    setUserInput('');
    setIsCorrect(null);
  }, [clearAllTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Derived values
  const moveCount = getMoveCount();
  const maxLevel = getMaxLevel();
  const totalMoves = verbalOpenings[currentOpening].length;
  const currentSequence = getCurrentSequence();
  const formattedSequence = formatSequenceForDisplay(currentSequence);
  const isMaxLevel = currentLevel >= maxLevel;
  const isSelectionPhase = gamePhase === GamePhase.SELECTION;

  // Score card component (shared between mobile and desktop)
  const ScoreCard = () => {
    if (isMobile) {
      return (
        <div className="w-full bg-chess-surface rounded-md px-2.5 py-1.5 mb-2 shadow-chess-card">
          <div className="grid grid-cols-4 gap-2.5 text-[10px] font-medium text-center">
            <div>
              <div className="text-neutral-400 text-[8px]">Score</div>
              <div className="font-bold text-neutral-200 text-[11px]">{score}</div>
            </div>
            <div>
              <div className="text-neutral-400 text-[8px]">Best</div>
              <div className="font-bold text-neutral-200 text-[11px]">{bestScore}</div>
            </div>
            <div>
              <div className="text-neutral-400 text-[8px]">Moves</div>
              <div className="font-bold text-neutral-200 text-[11px]">{moveCount}</div>
            </div>
            <div>
              <div className="text-neutral-400 text-[8px]">Round</div>
              <div className="font-bold text-neutral-200 text-[11px]">{round}</div>
            </div>
          </div>
        </div>
      );
    }

    // Desktop score card
    return (
      <div className="bg-chess-surface rounded-lg px-5 py-3 mb-3 shadow-chess-card w-full max-w-[500px]">
        <div className="flex gap-6 items-center justify-center text-[13px] font-medium">
          <span>Score: <span className="font-bold text-neutral-200">{score}</span></span>
          <span>Best: <span className="font-bold text-neutral-200">{bestScore}</span></span>
          <span>Streak: <span className="font-bold text-neutral-200">{streak}</span></span>
          <span>Moves: <span className="font-bold text-neutral-200">{moveCount}</span></span>
          <span>Round: <span className="font-bold text-neutral-200">{round}</span></span>
        </div>
      </div>
    );
  };

  // Render game area content based on phase
  const renderGameContent = () => {
    switch (gamePhase) {
      case GamePhase.SELECTION:
        if (isMobile) {
          return (
            <div className="text-center">
              <h2 className="text-lg mb-1.5">Verbal Memory</h2>
              <p className="text-xs text-neutral-400 mb-2.5">
                Memorize chess notation sequences
              </p>
              <p className="text-[11px] text-neutral-500">
                Starting with {moveCount} moves
              </p>
            </div>
          );
        }
        return (
          <div className="text-center">
            <h1 className="text-4xl mb-4">Verbal Memory</h1>
            <p className="text-base text-neutral-400 mb-6">
              Memorize progressively longer chess notation sequences
            </p>
            <p className="text-sm text-neutral-500">
              Starting with {moveCount} moves from {currentOpening}
            </p>
          </div>
        );

      case GamePhase.STUDY:
        return (
          <StudyPanel
            isMobile={isMobile}
            sequence={currentSequence}
            formattedSequence={formattedSequence}
            timeLeft={studyTimeLeft}
            totalStudyTime={customStudyTime}
          />
        );

      case GamePhase.RECALL:
        return (
          <RecallPanel
            isMobile={isMobile}
            userInput={userInput}
            onInputChange={setUserInput}
            onSubmit={handleSubmit}
          />
        );

      case GamePhase.RESULTS:
        return (
          <ResultsPanel
            isMobile={isMobile}
            isCorrect={isCorrect}
            moveCount={moveCount}
            correctSequence={currentSequence}
            userInput={userInput}
            currentOpening={currentOpening}
            isMaxLevel={isMaxLevel}
          />
        );
    }
  };

  if (!isMounted) return null;

  return (
    <div
      className={`flex flex-col items-center justify-start min-h-screen bg-chess-bg text-white font-[Arial,sans-serif] box-border ${isMobile ? 'p-2.5' : 'p-[15px] pt-[45px]'}`}
    >
      <style dangerouslySetInnerHTML={{ __html: sliderThumbCSS }} />

      {isMobile ? (
        // Mobile Layout - COMPRESSED to fit on screen
        <div className="flex flex-col items-center w-full max-w-[420px] px-1.5">
          <ScoreCard />

          <SelectionPanel
            isMobile={true}
            mobilePart="openings"
            currentOpening={currentOpening}
            currentDifficulty={currentDifficulty}
            customStudyTime={customStudyTime}
            disabled={!isSelectionPhase}
            onOpeningChange={setCurrentOpening}
            onDifficultyChange={setCurrentDifficulty}
            onStudyTimeChange={setCustomStudyTime}
            onStartGame={startNewGame}
            totalMoves={totalMoves}
            maxLevel={maxLevel}
            moveCount={moveCount}
            showResultControls={gamePhase === GamePhase.RESULTS}
            isCorrect={isCorrect}
            isMaxLevel={isMaxLevel}
            onContinue={continueGame}
            onReset={resetToSelection}
            gamePhase={gamePhase}
            currentLevel={currentLevel}
          />

          {/* Game Area - Compressed height */}
          <div className="w-full min-h-[180px] bg-chess-surface rounded-lg px-3 py-4 mb-2 flex flex-col items-center justify-center">
            {renderGameContent()}
          </div>

          <SelectionPanel
            isMobile={true}
            mobilePart="controls"
            currentOpening={currentOpening}
            currentDifficulty={currentDifficulty}
            customStudyTime={customStudyTime}
            disabled={!isSelectionPhase}
            onOpeningChange={setCurrentOpening}
            onDifficultyChange={setCurrentDifficulty}
            onStudyTimeChange={setCustomStudyTime}
            onStartGame={startNewGame}
            totalMoves={totalMoves}
            maxLevel={maxLevel}
            moveCount={moveCount}
            showResultControls={gamePhase === GamePhase.RESULTS}
            isCorrect={isCorrect}
            isMaxLevel={isMaxLevel}
            onContinue={continueGame}
            onReset={resetToSelection}
            gamePhase={gamePhase}
            currentLevel={currentLevel}
          />
        </div>
      ) : (
        // Desktop Layout - FIXED SPACING
        <div className="flex items-start gap-[25px] max-w-[1000px] w-full">
          {/* Left Panel - Opening Selection (from SelectionPanel) */}
          <SelectionPanel
            isMobile={false}
            currentOpening={currentOpening}
            currentDifficulty={currentDifficulty}
            customStudyTime={customStudyTime}
            disabled={!isSelectionPhase}
            onOpeningChange={setCurrentOpening}
            onDifficultyChange={setCurrentDifficulty}
            onStudyTimeChange={setCustomStudyTime}
            onStartGame={startNewGame}
            totalMoves={totalMoves}
            maxLevel={maxLevel}
            moveCount={moveCount}
            showResultControls={gamePhase === GamePhase.RESULTS}
            isCorrect={isCorrect}
            isMaxLevel={isMaxLevel}
            onContinue={continueGame}
            onReset={resetToSelection}
            gamePhase={gamePhase}
            currentLevel={currentLevel}
          />

          {/* Center - Game Area */}
          <div className="flex-1 flex flex-col items-center">
            <ScoreCard />

            {/* Main Game Display */}
            <div className="w-full max-w-[500px] min-h-[300px] bg-chess-surface rounded-lg p-[30px] flex flex-col items-center justify-center">
              {renderGameContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
