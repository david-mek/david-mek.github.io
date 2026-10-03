import { render, screen } from '@test-utils';
import { About } from './About';

describe('About component', () => {
  it('has correct Vite guide link', () => {
    render(<About />);
    expect(screen.getByText('this guide')).toHaveAttribute(
      'href',
      'https://mantine.dev/guides/vite/'
    );
  });
});
