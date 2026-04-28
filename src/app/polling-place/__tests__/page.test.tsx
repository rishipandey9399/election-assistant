import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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

  it('handles address search and displays mock results', async () => {
    // Use fake timers to speed up the setTimeout in the component
    jest.useFakeTimers();

    render(<PollingPlacePage />);

    const input = screen.getByLabelText(/Registered Address/i);
    const searchButton = screen.getByRole('button', { name: /Find Location/i });

    // Type address
    fireEvent.change(input, { target: { value: '123 Fake Street' } });

    // Submit form
    fireEvent.click(searchButton);

    // Should show searching state
    expect(screen.getByRole('button')).toHaveTextContent(/Searching.../i);

    // Fast-forward timers to trigger setTimeout inside act
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Wait for the result to be displayed
    await waitFor(() => {
      expect(screen.getAllByText('Community Center Gymnasium').length).toBeGreaterThan(0);
    });

    expect(screen.getByText('123 Main Street, Anytown, CA 90210')).toBeInTheDocument();
    expect(screen.getByText('7:00 AM - 8:00 PM')).toBeInTheDocument();

    // Search button should return to normal state
    expect(screen.getByRole('button', { name: /Find Location/i })).toBeInTheDocument();

    jest.useRealTimers();
  });
});
