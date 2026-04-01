import { describe, it, expect } from 'vitest';
import { generateRandomSquare, formatTime, formatTimeSimple, STARTING_FEN } from '../chessUtils';

describe('generateRandomSquare', () => {
  it('returns a valid chess square', () => {
    const square = generateRandomSquare();
    expect(square).toMatch(/^[a-h][1-8]$/);
  });

  it('generates different squares over many calls', () => {
    const squares = new Set(Array.from({ length: 100 }, () => generateRandomSquare()));
    // With 64 possible squares and 100 tries, we should get at least 10 unique
    expect(squares.size).toBeGreaterThan(10);
  });

  it('only produces squares within valid file and rank ranges', () => {
    for (let i = 0; i < 200; i++) {
      const square = generateRandomSquare();
      const file = square[0];
      const rank = square[1];
      expect('abcdefgh').toContain(file);
      expect('12345678').toContain(rank);
    }
  });
});

describe('formatTime', () => {
  it('formats milliseconds to seconds with one decimal', () => {
    expect(formatTime(5000)).toBe('5.0s');
    expect(formatTime(1500)).toBe('1.5s');
    expect(formatTime(250)).toBe('0.3s');
  });

  it('handles zero', () => {
    expect(formatTime(0)).toBe('0.0s');
  });

  it('handles large values', () => {
    expect(formatTime(60000)).toBe('60.0s');
  });
});

describe('formatTimeSimple', () => {
  it('formats milliseconds to whole seconds', () => {
    expect(formatTimeSimple(5000)).toBe('5s');
    expect(formatTimeSimple(10000)).toBe('10s');
  });

  it('rounds to nearest integer', () => {
    expect(formatTimeSimple(1500)).toBe('2s');
    expect(formatTimeSimple(1400)).toBe('1s');
  });

  it('handles zero', () => {
    expect(formatTimeSimple(0)).toBe('0s');
  });
});

describe('STARTING_FEN', () => {
  it('is the standard chess starting position', () => {
    expect(STARTING_FEN).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  });
});
