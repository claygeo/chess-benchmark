'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-chess-bg px-4 text-white">
          <div className="w-full max-w-md rounded-lg bg-chess-surface p-8 text-center shadow-chess-card">
            <h2 className="mb-4 text-2xl font-bold text-chess-red">Something went wrong</h2>
            <p className="mb-6 text-neutral-400">
              An unexpected error occurred while loading this exercise.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="rounded-md bg-chess-yellow px-6 py-3 font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
