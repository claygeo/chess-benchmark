const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function generateRandomSquare(): string {
  return FILES[Math.floor(Math.random() * 8)] + RANKS[Math.floor(Math.random() * 8)];
}

export function formatTime(ms: number): string {
  return (ms / 1000).toFixed(1) + 's';
}

export function formatTimeSimple(ms: number): string {
  return (ms / 1000).toFixed(0) + 's';
}
