'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

/** Lightweight client-side logger — wraps console to allow future swap with a monitoring service. */
const clientLogger = {
  error: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'test') console.error(...args);
  },
};

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * React Error Boundary to catch component-level crashes.
 * Ensures the app remains functional even if one part fails.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_e: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    clientLogger.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl m-4">
            <h2 className="text-xl font-bold text-red-200">Something went wrong</h2>
            <p className="text-gray-400 mt-2">
              The application encountered an error. Please try refreshing the page.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
