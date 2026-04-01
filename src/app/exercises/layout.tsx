'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function ExercisesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
