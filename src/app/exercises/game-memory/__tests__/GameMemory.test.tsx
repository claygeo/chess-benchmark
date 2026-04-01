import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GameMemoryPage from '../page';

// Mock react-chessboard
vi.mock('react-chessboard', () => ({
  Chessboard: ({ id }: { id?: string }) => <div data-testid={id || 'chessboard'}>Chessboard Mock</div>,
}));

// Mock useMobile
vi.mock('@/hooks/useMobile', () => ({
  useMobile: () => ({ isMobile: false, isMounted: true }),
}));

describe('GameMemoryPage', () => {
  it('renders in selection phase by default', () => {
    render(<GameMemoryPage />);
    expect(screen.getByText('Select Opening')).toBeInTheDocument();
    expect(screen.getByText('Start Training')).toBeInTheDocument();
  });

  it('displays all three openings as buttons', () => {
    render(<GameMemoryPage />);
    const buttons = screen.getAllByRole('button');
    const openingNames = buttons.map(b => b.textContent);
    expect(openingNames).toContain('Ruy Lopez');
    expect(openingNames).toContain("King's Indian");
    expect(openingNames).toContain("Queen's Gambit");
  });

  it('shows difficulty presets', () => {
    render(<GameMemoryPage />);
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Club')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
    expect(screen.getByText('Master')).toBeInTheDocument();
  });

  it('renders a chessboard', () => {
    render(<GameMemoryPage />);
    expect(screen.getByTestId('desktop-spatial-memory-chessboard')).toBeInTheDocument();
  });

  it('shows score and stats area', () => {
    render(<GameMemoryPage />);
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
    expect(screen.getByText(/Round:/)).toBeInTheDocument();
  });
});
