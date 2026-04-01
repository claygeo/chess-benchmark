import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with zero timeLeft', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.timeLeft).toBe(0);
    expect(result.current.timeLeftSeconds).toBe(0);
  });

  it('starts countdown and sets initial timeLeft', () => {
    const { result } = renderHook(() => useTimer());
    const onExpire = vi.fn();

    act(() => result.current.startCountdown(5000, onExpire));
    expect(result.current.timeLeft).toBe(5000);
  });

  it('enforces minimum duration of 100ms', () => {
    const { result } = renderHook(() => useTimer());
    const onExpire = vi.fn();

    act(() => result.current.startCountdown(10, onExpire));
    expect(result.current.timeLeft).toBe(100);
  });

  it('starts seconds countdown', () => {
    const { result } = renderHook(() => useTimer());
    const onExpire = vi.fn();

    act(() => result.current.startSecondsCountdown(5, onExpire));
    expect(result.current.timeLeft).toBe(5000);
    expect(result.current.timeLeftSeconds).toBe(5);
  });

  it('enforces minimum of 1 second for seconds countdown', () => {
    const { result } = renderHook(() => useTimer());
    const onExpire = vi.fn();

    act(() => result.current.startSecondsCountdown(0, onExpire));
    expect(result.current.timeLeft).toBe(1000);
  });

  it('counts down by seconds in seconds mode', () => {
    const { result } = renderHook(() => useTimer());
    const onExpire = vi.fn();

    act(() => result.current.startSecondsCountdown(3, onExpire));
    expect(result.current.timeLeftSeconds).toBe(3);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.timeLeftSeconds).toBe(2);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.timeLeftSeconds).toBe(1);
  });

  it('calls onExpire when seconds countdown finishes', () => {
    const { result } = renderHook(() => useTimer());
    const onExpire = vi.fn();

    act(() => result.current.startSecondsCountdown(2, onExpire));
    act(() => vi.advanceTimersByTime(2000));
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('clears timer on demand', () => {
    const { result } = renderHook(() => useTimer());
    const onExpire = vi.fn();

    act(() => result.current.startSecondsCountdown(5, onExpire));
    act(() => result.current.clearTimer());
    act(() => vi.advanceTimersByTime(10000));
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('clears previous timer when starting new one', () => {
    const { result } = renderHook(() => useTimer());
    const onExpire1 = vi.fn();
    const onExpire2 = vi.fn();

    act(() => result.current.startSecondsCountdown(5, onExpire1));
    act(() => result.current.startSecondsCountdown(2, onExpire2));
    act(() => vi.advanceTimersByTime(5000));

    expect(onExpire1).not.toHaveBeenCalled();
    expect(onExpire2).toHaveBeenCalled();
  });

  it('cleans up timer on unmount', () => {
    const { result, unmount } = renderHook(() => useTimer());
    const onExpire = vi.fn();

    act(() => result.current.startSecondsCountdown(5, onExpire));
    unmount();
    act(() => vi.advanceTimersByTime(10000));
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('getResponseTime returns elapsed time', () => {
    vi.useRealTimers();
    const { result } = renderHook(() => useTimer());
    const onExpire = vi.fn();

    act(() => result.current.startCountdown(10000, onExpire));
    const responseTime = result.current.getResponseTime();
    // Should be very small since we just started
    expect(responseTime).toBeGreaterThanOrEqual(0);
    expect(responseTime).toBeLessThan(100);
  });

  it('timeLeftSeconds rounds up correctly', () => {
    const { result } = renderHook(() => useTimer());
    const onExpire = vi.fn();

    act(() => result.current.startSecondsCountdown(3, onExpire));
    // 3000ms -> ceil(3000/1000) = 3
    expect(result.current.timeLeftSeconds).toBe(3);
  });
});
