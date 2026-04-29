/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { useAuth } from '@/context/AuthContext';

import TimelinePage from '../page';

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

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            elections: [
              {
                id: 'reg-deadline',
                name: 'Voter Registration Deadline',
                electionDay: '2024-10-07',
                ocdDivisionId: 'ocd-division/country:us/state:ca',
              },
              {
                id: 'election-day',
                name: 'Election Day',
                electionDay: '2024-11-05',
                ocdDivisionId: 'ocd-division/country:us/state:ca',
              },
            ],
          }),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the timeline header', async () => {
    render(<TimelinePage />);
    expect(screen.getByText('Your Election Timeline')).toBeInTheDocument();
  });

  it('renders all fetched events', async () => {
    render(<TimelinePage />);
    await waitFor(() => {
      expect(screen.getByText('Voter Registration Deadline')).toBeInTheDocument();
      expect(screen.getByText('Election Day')).toBeInTheDocument();
    });
  });

  it('hides track buttons when user is not logged in', async () => {
    render(<TimelinePage />);
    await waitFor(() => {
      expect(screen.getByText('Voter Registration Deadline')).toBeInTheDocument();
    });
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

  it('toggles track status when clicked', async () => {
    const { trackEvent } = require('@/lib/firestore');
    (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
      user: { uid: 'test-user' } as any,
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
      loading: false,
    });

    render(<TimelinePage />);

    const trackButtons = await screen.findAllByText('Track');
    fireEvent.click(trackButtons[0]);

    await waitFor(() => {
      expect(trackEvent).toHaveBeenCalledWith('test-user', expect.any(String));
    });
  });
});
