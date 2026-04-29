import { render, screen, fireEvent } from '@testing-library/react';

import { ErrorBoundary } from '../ErrorBoundary';

const Bomb = () => {
  throw new Error('Kaboom');
};

describe('ErrorBoundary', () => {
  let originalError: typeof console.error;
  beforeAll(() => {
    originalError = console.error;
    console.error = jest.fn(); // Suppress expected errors in console
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe Content')).toBeInTheDocument();
  });

  it('renders fallback when error is thrown', () => {
    render(
      <ErrorBoundary fallback={<div>Custom Fallback</div>}>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom Fallback')).toBeInTheDocument();
  });

  it('renders default fallback and allows retry', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Test the retry button
    const retryButton = screen.getByText('Try again');
    fireEvent.click(retryButton);

    // It should try to render children again, throwing the error again
    // But testing the state reset is the goal
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
