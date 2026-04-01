import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SanMemoryPage from '../page';

// Mock useMobile
vi.mock('@/hooks/useMobile', () => ({
  useMobile: () => ({ isMobile: false, isMounted: true }),
}));

afterEach(cleanup);

describe('SanMemoryPage', () => {
  it('renders in selection phase by default', () => {
    render(<SanMemoryPage />);
    expect(screen.getByText('Verbal Memory')).toBeInTheDocument();
    expect(screen.getByText('Start Training')).toBeInTheDocument();
  });

  it('displays all three openings as buttons', () => {
    render(<SanMemoryPage />);
    const buttons = screen.getAllByRole('button');
    const buttonTexts = buttons.map(b => b.textContent);
    expect(buttonTexts).toContain('Ruy Lopez');
    expect(buttonTexts).toContain("King's Indian");
    expect(buttonTexts).toContain("Queen's Gambit");
  });

  it('shows difficulty presets', () => {
    render(<SanMemoryPage />);
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Club')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
    expect(screen.getByText('Master')).toBeInTheDocument();
  });

  it('shows score information', () => {
    render(<SanMemoryPage />);
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
    expect(screen.getByText(/Round:/)).toBeInTheDocument();
  });

  it('shows move count info', () => {
    render(<SanMemoryPage />);
    const moveElements = screen.getAllByText(/moves/);
    expect(moveElements.length).toBeGreaterThan(0);
  });

  it('transitions to study phase when Start Training is clicked', () => {
    vi.useFakeTimers();
    render(<SanMemoryPage />);
    fireEvent.click(screen.getByText('Start Training'));
    // Study phase shows "Memorize this sequence:" and time
    expect(screen.getByText(/Memorize this sequence/i)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
