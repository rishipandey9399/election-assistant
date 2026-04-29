import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import PollingPlacePage from '@/app/polling-place/page';

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Navigation: () => <div data-testid="navigation-icon" />,
}));

describe('Polling Place Page', () => {
  it('renders the initial state correctly', () => {
    render(<PollingPlacePage />);

    // Check headers
    expect(screen.getByRole('heading', { name: /Find Your Polling Place/i })).toBeInTheDocument();

    // Check input exists
    expect(screen.getByLabelText(/Registered Address/i)).toBeInTheDocument();

    // Check initial map container exists
    expect(screen.getByLabelText(/Map view/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Map showing polling places/i)).toBeInTheDocument();
  });

  it('handles full polling place workflow: address -> civic API -> map render', async () => {
    // Mock the fetch API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            pollingLocations: [
              {
                locationName: 'Real Civic Polling Place',
                address: { line1: '456 API Ave', city: 'Test City', state: 'TS', zip: '12345' },
                pollingHours: '6:00 AM - 9:00 PM',
              },
            ],
          }),
      })
    ) as jest.Mock;

    render(<PollingPlacePage />);

    const input = screen.getByLabelText(/Registered Address/i);
    const searchButton = screen.getByRole('button', { name: /Find Location/i });

    // Type address
    fireEvent.change(input, { target: { value: '456 API Ave' } });

    // Submit form
    fireEvent.click(searchButton);

    // Should show searching state
    expect(screen.getByRole('button')).toHaveTextContent(/Searching.../i);

    // Wait for the result to be displayed from the mocked API
    await waitFor(() => {
      expect(screen.getAllByText('Real Civic Polling Place').length).toBeGreaterThan(0);
    });

    expect(screen.getByText('456 API Ave, Test City, TS 12345')).toBeInTheDocument();
    expect(screen.getByText('6:00 AM - 9:00 PM')).toBeInTheDocument();

    // Ensure fetch was called with the correct parameters
    expect(global.fetch).toHaveBeenCalledWith('/api/civic-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: '456 API Ave' }),
    });

    // Search button should return to normal state
    expect(screen.getByRole('button', { name: /Find Location/i })).toBeInTheDocument();
  });
});
