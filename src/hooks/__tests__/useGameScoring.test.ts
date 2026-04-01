import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameScoring } from '../useGameScoring';

describe('useGameScoring', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useGameScoring());
    expect(result.current.score).toBe(0);
    expect(result.current.bestScore).toBe(0);
    expect(result.current.streak).toBe(0);
    expect(result.current.round).toBe(1);
  });

  it('adds score correctly', () => {
    const { result } = renderHook(() => useGameScoring());
    act(() => result.current.addScore(10));
    expect(result.current.score).toBe(10);
  });

  it('increments streak when adding score', () => {
    const { result } = renderHook(() => useGameScoring());
    act(() => result.current.addScore(5));
    expect(result.current.streak).toBe(1);
    act(() => result.current.addScore(5));
    expect(result.current.streak).toBe(2);
  });

  it('tracks best score across multiple additions', () => {
    const { result } = renderHook(() => useGameScoring());
    act(() => result.current.addScore(10));
    act(() => result.current.addScore(5));
    expect(result.current.bestScore).toBe(15);
    expect(result.current.score).toBe(15);
  });

  it('preserves best score after reset', () => {
    const { result } = renderHook(() => useGameScoring());
    act(() => result.current.addScore(20));
    expect(result.current.bestScore).toBe(20);
    act(() => result.current.resetScoring());
    expect(result.current.score).toBe(0);
    expect(result.current.bestScore).toBe(20);
  });

  it('resets streak', () => {
    const { result } = renderHook(() => useGameScoring());
    act(() => result.current.addScore(5));
    act(() => result.current.addScore(5));
    expect(result.current.streak).toBe(2);
    act(() => result.current.resetStreak());
    expect(result.current.streak).toBe(0);
  });

  it('increments round', () => {
    const { result } = renderHook(() => useGameScoring());
    expect(result.current.round).toBe(1);
    act(() => result.current.nextRound());
    expect(result.current.round).toBe(2);
    act(() => result.current.nextRound());
    expect(result.current.round).toBe(3);
  });

  it('resetScoring resets score, streak, and round but not bestScore', () => {
    const { result } = renderHook(() => useGameScoring());
    act(() => result.current.addScore(30));
    act(() => result.current.nextRound());
    act(() => result.current.nextRound());
    act(() => result.current.resetScoring());
    expect(result.current.score).toBe(0);
    expect(result.current.streak).toBe(0);
    expect(result.current.round).toBe(1);
    expect(result.current.bestScore).toBe(30);
  });

  it('accumulates score across multiple calls', () => {
    const { result } = renderHook(() => useGameScoring());
    act(() => result.current.addScore(10));
    act(() => result.current.addScore(20));
    act(() => result.current.addScore(30));
    expect(result.current.score).toBe(60);
    expect(result.current.streak).toBe(3);
  });
});
