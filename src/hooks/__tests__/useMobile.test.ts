import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMobile } from '../useMobile';

describe('useMobile', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    vi.stubGlobal('innerWidth', 1024);
  });

  afterEach(() => {
    vi.stubGlobal('innerWidth', originalInnerWidth);
    vi.restoreAllMocks();
  });

  it('returns isMounted true after mount', () => {
    const { result } = renderHook(() => useMobile());
    expect(result.current.isMounted).toBe(true);
  });

  it('detects desktop when width > breakpoint', () => {
    vi.stubGlobal('innerWidth', 1200);
    const { result } = renderHook(() => useMobile(900));
    expect(result.current.isMobile).toBe(false);
  });

  it('detects mobile when width <= breakpoint', () => {
    vi.stubGlobal('innerWidth', 800);
    const { result } = renderHook(() => useMobile(900));
    expect(result.current.isMobile).toBe(true);
  });

  it('detects mobile at exact breakpoint', () => {
    vi.stubGlobal('innerWidth', 900);
    const { result } = renderHook(() => useMobile(900));
    expect(result.current.isMobile).toBe(true);
  });

  it('responds to window resize', () => {
    vi.stubGlobal('innerWidth', 1200);
    const { result } = renderHook(() => useMobile(900));
    expect(result.current.isMobile).toBe(false);

    act(() => {
      vi.stubGlobal('innerWidth', 600);
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current.isMobile).toBe(true);
  });

  it('uses custom breakpoint', () => {
    vi.stubGlobal('innerWidth', 500);
    const { result } = renderHook(() => useMobile(400));
    expect(result.current.isMobile).toBe(false);
  });

  it('cleans up resize listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useMobile());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
