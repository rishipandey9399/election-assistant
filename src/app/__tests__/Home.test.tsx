import { render, screen } from '@testing-library/react';

import Home from '@/app/page';

// Mock the lucide-react icons since they might cause issues in testing
jest.mock('lucide-react', () => ({
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  ShieldCheck: () => <div data-testid="shield-check-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
}));

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);

    // Check if the main heading is present
    const heading = screen.getByRole('heading', {
      name: /Navigate Your Voting Journey With Confidence/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it('renders the core feature sections', () => {
    render(<Home />);

    expect(screen.getByText('Personalized Timeline')).toBeInTheDocument();
    expect(screen.getByText('Polling Place Locator')).toBeInTheDocument();
    expect(screen.getByText('Verified Information')).toBeInTheDocument();
  });

  it('contains the call-to-action links', () => {
    render(<Home />);

    const startTimelineLink = screen.getByRole('link', { name: /Start Your Timeline/i });
    expect(startTimelineLink).toHaveAttribute('href', '/timeline');

    const findPollingPlaceLink = screen.getByRole('link', { name: /Find Polling Place/i });
    expect(findPollingPlaceLink).toHaveAttribute('href', '/polling-place');

    const chatLink = screen.getByRole('link', { name: /Chat with AI Assistant/i });
    expect(chatLink).toHaveAttribute('href', '/assistant');
  });
});
