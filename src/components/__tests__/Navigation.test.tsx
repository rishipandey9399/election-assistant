import { render, screen } from '@testing-library/react';
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
});
