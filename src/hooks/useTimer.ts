'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimer() {
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startCountdown = useCallback((durationMs: number, onExpire: () => void) => {
    clearTimer();
    const safeDuration = Math.max(100, durationMs);
    setTimeLeft(safeDuration);
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, safeDuration - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        timerRef.current = null;
        onExpire();
      }
    }, 100);

    timerRef.current = interval;
  }, [clearTimer]);

  const startSecondsCountdown = useCallback((seconds: number, onExpire: () => void) => {
    clearTimer();
    const safeSeconds = Math.max(1, seconds);
    setTimeLeft(safeSeconds * 1000);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          clearInterval(interval);
          timerRef.current = null;
          onExpire();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    timerRef.current = interval;
  }, [clearTimer]);

  const getResponseTime = useCallback(() => {
    return Date.now() - startTimeRef.current;
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    timeLeft,
    startCountdown,
    startSecondsCountdown,
    clearTimer,
    getResponseTime,
    timeLeftSeconds: Math.ceil(timeLeft / 1000),
  };
}
