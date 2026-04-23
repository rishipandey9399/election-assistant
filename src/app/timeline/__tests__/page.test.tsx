import { render, screen } from '@testing-library/react';
import TimelinePage from '../page';
import { useAuth } from '@/context/AuthContext';

// Mock the Auth Context
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the Firestore service
jest.mock('@/lib/firestore', () => ({
  getUserProfile: jest.fn(),
  trackEvent: jest.fn(),
  untrackEvent: jest.fn(),
}));

describe('TimelinePage', () => {
  beforeEach(() => {
    (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
      user: null,
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
      loading: false,
    });
  });

  it('renders the timeline header', () => {
    render(<TimelinePage />);
    expect(screen.getByText('Your Election Timeline')).toBeInTheDocument();
  });

  it('renders all mock events', () => {
    render(<TimelinePage />);
    expect(screen.getByText('Voter Registration Deadline')).toBeInTheDocument();
    expect(screen.getByText('Election Day')).toBeInTheDocument();
  });

  it('hides track buttons when user is not logged in', () => {
    render(<TimelinePage />);
    expect(screen.queryByText('Track')).not.toBeInTheDocument();
  });

  it('shows track buttons when user is logged in', async () => {
    (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
      user: { uid: 'test-user' } as unknown as import('firebase/auth').User,
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
      loading: false,
    });
    render(<TimelinePage />);

    const trackButtons = await screen.findAllByText('Track');
    expect(trackButtons.length).toBeGreaterThan(0);
  });
});
