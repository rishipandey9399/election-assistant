/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, fireEvent } from '@testing-library/react';

import Navigation from '@/components/Navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock Auth Context
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    user: null,
    signInWithGoogle: jest.fn(),
    logout: jest.fn(),
    loading: false,
  })),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Home: () => <div data-testid="home-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  MessageSquare: () => <div data-testid="message-square-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="x-icon" />,
  User: () => <div data-testid="user-icon" />,
}));

describe('Navigation Component', () => {
  it('renders the brand logo text', () => {
    render(<Navigation />);
    expect(screen.getByText('VoteAssist')).toBeInTheDocument();
  });

  it('renders desktop navigation links', () => {
    render(<Navigation />);

    // Check for the "Home" link specifically in the nav, avoiding the logo
    const homeLinks = screen.getAllByRole('link', { name: /Home/i });
    expect(homeLinks.length).toBeGreaterThan(0);

    expect(screen.getAllByRole('link', { name: /Timeline/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Polling Place/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /AI Assistant/i }).length).toBeGreaterThan(0);
  });

  it('renders the Sign In button', () => {
    render(<Navigation />);
    // The Sign In button should be present in the desktop nav
    const signinButtons = screen.getAllByRole('button', { name: /Sign In/i });
    expect(signinButtons.length).toBeGreaterThan(0);
  });

  it('toggles mobile menu when menu button is clicked', () => {
    const { fireEvent } = require('@testing-library/react');
    render(<Navigation />);

    const menuButton = screen.getByLabelText(/Open menu/i);

    // Open menu
    fireEvent.click(menuButton);
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();

    // Close menu
    fireEvent.click(menuButton);
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('renders user info and logout in mobile menu when authenticated', () => {
    const { useAuth } = require('@/context/AuthContext');
    useAuth.mockReturnValue({
      user: { displayName: 'John Doe', uid: '123' },
      logout: jest.fn(),
      signInWithGoogle: jest.fn(),
      loading: false,
    });

    render(<Navigation />);

    // Open mobile menu
    const menuButton = screen.getByLabelText(/Open menu/i);
    fireEvent.click(menuButton);

    expect(screen.getByText(/Signed in as John Doe/i)).toBeInTheDocument();
    // The mobile logout button has text "Sign Out"
    const signoutButtons = screen.getAllByRole('button', { name: /Sign Out/i });
    expect(signoutButtons.length).toBeGreaterThan(0);
  });

  it('calls logout and closes menu when Sign Out is clicked in mobile menu', () => {
    const logoutMock = jest.fn();
    const { useAuth } = require('@/context/AuthContext');
    useAuth.mockReturnValue({
      user: { displayName: 'John Doe', uid: '123' },
      logout: logoutMock,
      signInWithGoogle: jest.fn(),
      loading: false,
    });

    render(<Navigation />);

    const menuButton = screen.getByLabelText(/Open menu/i);
    fireEvent.click(menuButton);

    // There are two Sign Out buttons: one desktop, one mobile.
    const signoutButtons = screen.getAllByRole('button', { name: /Sign Out/i });
    fireEvent.click(signoutButtons[1]);

    expect(logoutMock).toHaveBeenCalled();
    // In mobile, it sets isOpen to false
    expect(screen.getByLabelText(/Open menu/i)).toBeInTheDocument();
  });

  it('calls signInWithGoogle and closes menu when Sign In is clicked in mobile menu', () => {
    const signInMock = jest.fn();
    const { useAuth } = require('@/context/AuthContext');
    useAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      signInWithGoogle: signInMock,
      loading: false,
    });

    render(<Navigation />);

    const menuButton = screen.getByLabelText(/Open menu/i);
    fireEvent.click(menuButton);

    const signinButtons = screen.getAllByRole('button', { name: /Sign In/i });
    fireEvent.click(signinButtons[1]);

    expect(signInMock).toHaveBeenCalled();
    expect(screen.getByLabelText(/Open menu/i)).toBeInTheDocument();
  });
});
