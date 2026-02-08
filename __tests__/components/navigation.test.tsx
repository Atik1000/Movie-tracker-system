import { render, screen } from '@testing-library/react';
import { Navigation } from '@/components/navigation';
import { useAuth } from '@/contexts/auth-context';
import { usePathname } from 'next/navigation';

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('Navigation Component', () => {
  const mockLogout = jest.fn();
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
  const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render nothing on login page', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: jest.fn(),
      signup: jest.fn(),
      logout: mockLogout,
    });

    const { container } = render(<Navigation />);
    expect(container.firstChild).toBeNull();
  });

  it('should render navigation for authenticated user', () => {
    mockUsePathname.mockReturnValue('/search');
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
      login: jest.fn(),
      signup: jest.fn(),
      logout: mockLogout,
    });

    render(<Navigation />);

    expect(screen.getByText('MovieTrack')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Watchlist')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should not render navigation links when user is not authenticated', () => {
    mockUsePathname.mockReturnValue('/search');
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: jest.fn(),
      signup: jest.fn(),
      logout: mockLogout,
    });

    render(<Navigation />);

    expect(screen.getByText('MovieTrack')).toBeInTheDocument();
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
    expect(screen.queryByText('Watchlist')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('should highlight active page', () => {
    mockUsePathname.mockReturnValue('/search');
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
      login: jest.fn(),
      signup: jest.fn(),
      logout: mockLogout,
    });

    render(<Navigation />);

    const searchButton = screen.getByText('Search').closest('button');
    expect(searchButton).toHaveClass('bg-secondary/50', 'text-primary');
  });
});
