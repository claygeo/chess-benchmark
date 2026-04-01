import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExerciseList } from '../ExerciseList';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('ExerciseList', () => {
  it('renders all three exercise cards', () => {
    render(<ExerciseList />);
    expect(screen.getByText('Spatial Memory')).toBeInTheDocument();
    expect(screen.getByText('Verbal Memory')).toBeInTheDocument();
    expect(screen.getByText('Coordinate Vision')).toBeInTheDocument();
  });

  it('renders correct descriptions', () => {
    render(<ExerciseList />);
    expect(screen.getByText('Memorize classical textbook openings')).toBeInTheDocument();
    expect(screen.getByText('Memorize SAN text for textbook openings')).toBeInTheDocument();
    expect(screen.getByText('Practice visualizing chess board coordinates')).toBeInTheDocument();
  });

  it('links to correct exercise routes', () => {
    render(<ExerciseList />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', '/exercises/game-memory');
    expect(links[1]).toHaveAttribute('href', '/exercises/san-memory');
    expect(links[2]).toHaveAttribute('href', '/exercises/coordinate-vision');
  });
});
