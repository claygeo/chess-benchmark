'use client';

import React, { useCallback, useRef, useState } from 'react';
import { coordinateDifficulty, DifficultyLevel } from '@/config/difficulty';
import { useGameScoring } from '@/hooks/useGameScoring';
import { useMobile } from '@/hooks/useMobile';
import { useTimer } from '@/hooks/useTimer';
import { generateRandomSquare } from '@/utils/chessUtils';
import { COLORS } from '@/utils/styles';
import GameBoard from './components/GameBoard';
import ResultsPanel from './components/ResultsPanel';
import SelectionPanel from './components/SelectionPanel';

type GamePhase = 'selection' | 'playing' | 'feedback' | 'results';

const TOTAL_ROUNDS = 10;

export default function CoordinateVisionPage() {
  const { isMobile, isMounted } = useMobile();
  const { score, bestScore, streak, round, addScore, resetStreak, nextRound: advanceRound, resetScoring } = useGameScoring();
  const { timeLeft, startCountdown, clearTimer, getResponseTime } = useTimer();

  // Core game state
  const [gamePhase, setGamePhase] = useState<GamePhase>('selection');
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('beginner');

  // Square tracking
  const [targetSquare, setTargetSquare] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [responseTime, setResponseTime] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null!);  // non-null assertion for legacy ref compat

  // ---- Derived values ----

  const getAccuracy = useCallback(() => {
    if (round <= 1 && gamePhase === 'selection') return 0;
    const totalAttempted = gamePhase === 'results' ? TOTAL_ROUNDS : round;
    return Math.round((correctAnswers / totalAttempted) * 100);
  }, [round, correctAnswers, gamePhase]);

  const roundDisplay = `${round}/${TOTAL_ROUNDS}`;

  const progressPercent = (round / TOTAL_ROUNDS) * 100;

  // ---- Square highlighting ----

  const getSquareStyles = useCallback((): { [square: string]: React.CSSProperties } => {
    const styles: { [square: string]: React.CSSProperties } = {};

    if (!targetSquare || gamePhase === 'selection' || gamePhase === 'results') {
      return styles;
    }

    if (gamePhase === 'feedback') {
      styles[targetSquare] = {
        backgroundColor: isCorrect ? '#4CAF5080' : '#f4433680',
        border: `3px solid ${isCorrect ? COLORS.green : COLORS.red}`,
        borderRadius: '6px',
        boxSizing: 'border-box',
      };
    } else if (gamePhase === 'playing') {
      styles[targetSquare] = {
        backgroundColor: '#EAB308DD',
        border: `3px solid ${COLORS.yellow}`,
        borderRadius: '6px',
        boxSizing: 'border-box',
        boxShadow: '0 0 20px #EAB30880',
      };
    }

    return styles;
  }, [targetSquare, gamePhase, isCorrect]);

  // ---- Game logic ----

  // Use refs to break circular dependency between startNewRound <-> moveToNextRoundOrEnd
  const roundRef = useRef(round);
  roundRef.current = round;

  const startNewRoundRef = useRef<() => void>(() => {});

  const moveToNextRoundOrEnd = useCallback(() => {
    if (roundRef.current >= TOTAL_ROUNDS) {
      setGamePhase('results');
    } else {
      advanceRound();
      startNewRoundRef.current();
    }
  }, [advanceRound]);

  const startNewRound = useCallback(() => {
    setUserInput('');
    setIsCorrect(null);
    setGamePhase('playing');

    const newSquare = generateRandomSquare();
    setTargetSquare(newSquare);

    const timeLimit = coordinateDifficulty[currentDifficulty].timePerSquare;

    startCountdown(timeLimit, () => {
      // On expire
      setIsCorrect(false);
      resetStreak();
      setGamePhase('feedback');
      setTimeout(() => {
        moveToNextRoundOrEnd();
      }, 1500);
    });

    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  }, [currentDifficulty, startCountdown, resetStreak, moveToNextRoundOrEnd]);

  // Keep ref in sync
  startNewRoundRef.current = startNewRound;

  const handleSubmit = useCallback(() => {
    if (!userInput.trim() || gamePhase !== 'playing') return;

    clearTimer();
    const elapsed = getResponseTime();
    setResponseTime(elapsed);

    const correct = userInput.trim().toLowerCase() === targetSquare.toLowerCase();
    setIsCorrect(correct);
    setGamePhase('feedback');

    if (correct) {
      setCorrectAnswers(prev => prev + 1);

      const timeLimit = coordinateDifficulty[currentDifficulty].timePerSquare;
      const basePoints = 100;
      const timeBonus = Math.floor((timeLimit - elapsed) / 100);
      const streakBonus = streak * 10;
      const totalPoints = basePoints + timeBonus + streakBonus;

      addScore(totalPoints);
    } else {
      resetStreak();
    }

    setTimeout(() => {
      moveToNextRoundOrEnd();
    }, 1500);
  }, [userInput, targetSquare, gamePhase, currentDifficulty, streak, clearTimer, getResponseTime, addScore, resetStreak, moveToNextRoundOrEnd]);

  const startGame = useCallback(() => {
    resetScoring();
    setCorrectAnswers(0);
    startNewRound();
  }, [resetScoring, startNewRound]);

  const quitGame = useCallback(() => {
    clearTimer();
    setGamePhase('selection');
    setTargetSquare('');
    setUserInput('');
    setIsCorrect(null);
  }, [clearTimer]);

  const resetGame = useCallback(() => {
    clearTimer();
    setGamePhase('selection');
    setTargetSquare('');
    setUserInput('');
    setIsCorrect(null);
    resetScoring();
    setCorrectAnswers(0);
  }, [clearTimer, resetScoring]);

  if (!isMounted) return null;

  const isGameActive = gamePhase !== 'selection';

  return (
    <div className={`flex flex-col items-center justify-start min-h-screen bg-chess-bg text-white font-sans p-[15px] box-border ${isMobile ? 'pt-[10px]' : 'pt-[30px]'}`}>
      {isMobile ? (
        /* MOBILE LAYOUT */
        <div className="flex flex-col items-center w-full max-w-[420px] px-2">
          <GameBoard
            isMobile={true}
            gamePhase={gamePhase}
            score={score}
            streak={streak}
            roundDisplay={roundDisplay}
            accuracy={getAccuracy()}
            timeLeft={timeLeft}
            squareStyles={getSquareStyles()}
            progressPercent={progressPercent}
            userInput={userInput}
            onInputChange={setUserInput}
            onSubmit={handleSubmit}
            onQuit={quitGame}
            inputRef={inputRef}
            isCorrect={isCorrect}
            targetSquare={targetSquare}
            responseTime={responseTime}
          />

          {gamePhase === 'selection' && (
            <SelectionPanel
              isMobile={true}
              currentDifficulty={currentDifficulty}
              onSelectDifficulty={setCurrentDifficulty}
              onStart={startGame}
              isGameActive={false}
              score={score}
              bestScore={bestScore}
              streak={streak}
              accuracy={getAccuracy()}
              roundDisplay={roundDisplay}
            />
          )}

          {gamePhase === 'results' && (
            <ResultsPanel
              isMobile={true}
              score={score}
              bestScore={bestScore}
              correctAnswers={correctAnswers}
              totalRounds={TOTAL_ROUNDS}
              onPlayAgain={startGame}
              onBackToMenu={resetGame}
            />
          )}
        </div>
      ) : (
        /* DESKTOP LAYOUT */
        <div className="flex items-start gap-[25px] max-w-[900px] w-full">
          {/* Left Panel */}
          <SelectionPanel
            isMobile={false}
            currentDifficulty={currentDifficulty}
            onSelectDifficulty={setCurrentDifficulty}
            onStart={startGame}
            isGameActive={isGameActive}
            score={score}
            bestScore={bestScore}
            streak={streak}
            accuracy={getAccuracy()}
            roundDisplay={roundDisplay}
          />

          {/* Center */}
          {gamePhase === 'results' ? (
            <div className="flex-1 flex flex-col items-center">
              <ResultsPanel
                isMobile={false}
                score={score}
                bestScore={bestScore}
                correctAnswers={correctAnswers}
                totalRounds={TOTAL_ROUNDS}
                onPlayAgain={startGame}
                onBackToMenu={resetGame}
              />
            </div>
          ) : (
            <GameBoard
              isMobile={false}
              gamePhase={gamePhase}
              score={score}
              streak={streak}
              roundDisplay={roundDisplay}
              accuracy={getAccuracy()}
              timeLeft={timeLeft}
              squareStyles={getSquareStyles()}
              progressPercent={progressPercent}
              userInput={userInput}
              onInputChange={setUserInput}
              onSubmit={handleSubmit}
              onQuit={quitGame}
              inputRef={inputRef}
              isCorrect={isCorrect}
              targetSquare={targetSquare}
              responseTime={responseTime}
            />
          )}
        </div>
      )}
    </div>
  );
}
