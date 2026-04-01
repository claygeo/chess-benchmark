import { render, screen } from '@testing-library/react';
import { FaChess } from 'react-icons/fa';
import { describe, expect, it, vi } from 'vitest';
import { Card } from '../Card';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('Card', () => {
  it('renders title and description', () => {
    render(
      <Card
        icon={FaChess}
        title="Test Exercise"
        description="A test description"
        route="/test"
      />
    );
    expect(screen.getByText('Test Exercise')).toBeInTheDocument();
    expect(screen.getByText('A test description')).toBeInTheDocument();
  });

  it('links to the correct route', () => {
    render(
      <Card
        icon={FaChess}
        title="Test"
        description="Desc"
        route="/exercises/test"
      />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/exercises/test');
  });
});
