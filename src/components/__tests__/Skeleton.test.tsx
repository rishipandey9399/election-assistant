import { render } from '@testing-library/react';

import Skeleton from '../Skeleton';

describe('Skeleton', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
