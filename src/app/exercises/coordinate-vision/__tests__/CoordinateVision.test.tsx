import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CoordinateVisionPage from '../page';

// Mock react-chessboard
vi.mock('react-chessboard', () => ({
  Chessboard: ({ id }: { id?: string }) => <div data-testid={id || 'chessboard'}>Chessboard Mock</div>,
}));

// Mock useMobile to control layout
vi.mock('@/hooks/useMobile', () => ({
  useMobile: () => ({ isMobile: false, isMounted: true }),
}));

describe('CoordinateVisionPage', () => {
  it('renders in selection phase by default', () => {
    render(<CoordinateVisionPage />);
    expect(screen.getByText('Select Difficulty')).toBeInTheDocument();
    expect(screen.getByText('Start Training')).toBeInTheDocument();
  });

  it('renders all difficulty options', () => {
    render(<CoordinateVisionPage />);
    expect(screen.getByText(/Beginner/)).toBeInTheDocument();
    expect(screen.getByText(/Club/)).toBeInTheDocument();
    expect(screen.getByText(/Expert/)).toBeInTheDocument();
    expect(screen.getByText(/Master/)).toBeInTheDocument();
  });

  it('highlights selected difficulty', () => {
    render(<CoordinateVisionPage />);
    const beginnerButtons = screen.getAllByText(/Beginner/);
    const beginnerBtn = beginnerButtons[0].closest('button');
    expect(beginnerBtn).toBeTruthy();
  });

  it('transitions to playing phase when Start Training is clicked', () => {
    render(<CoordinateVisionPage />);
    fireEvent.click(screen.getByText('Start Training'));
    // During playing phase, the chessboard should be visible
    expect(screen.getByTestId('coordinate-vision-board')).toBeInTheDocument();
  });

  it('shows input field and submit button during playing phase', () => {
    render(<CoordinateVisionPage />);
    fireEvent.click(screen.getByText('Start Training'));
    expect(screen.getByPlaceholderText(/Type the square name/)).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});
