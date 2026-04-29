import { render, screen } from '@testing-library/react';

import SkipLink from '../SkipLink';

describe('SkipLink', () => {
  it('renders skip link correctly', () => {
    const { asFragment } = render(<SkipLink />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toHaveAttribute('href', '#main-content');
    expect(asFragment()).toMatchSnapshot();
  });
});
