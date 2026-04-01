'use client';

import { useCallback, useState } from 'react';

export function useGameScoring() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);

  const addScore = useCallback((points: number) => {
    setScore(prev => {
      const newScore = prev + points;
      setBestScore(current => Math.max(current, newScore));
      return newScore;
    });
    setStreak(prev => prev + 1);
  }, []);

  const resetStreak = useCallback(() => {
    setStreak(0);
  }, []);

  const nextRound = useCallback(() => {
    setRound(prev => prev + 1);
  }, []);

  const resetScoring = useCallback(() => {
    setScore(0);
    setStreak(0);
    setRound(1);
  }, []);

  return { score, bestScore, streak, round, addScore, resetStreak, nextRound, resetScoring };
}
