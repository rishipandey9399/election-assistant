import { render, screen } from '@testing-library/react';

import Footer from '../Footer';

describe('Footer', () => {
  it('renders footer correctly', () => {
    render(<Footer />);
    expect(screen.getAllByText(/VoteAssist/i).length).toBeGreaterThan(0);
  });
});
