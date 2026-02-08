import { render } from '@testing-library/react';
import { MovieCardSkeleton, MovieGridSkeleton } from '@/components/movie-skeleton';

describe('Movie Skeleton Components', () => {
  describe('MovieCardSkeleton', () => {
    it('should render skeleton elements', () => {
      const { container } = render(<MovieCardSkeleton />);

      const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should have proper layout structure', () => {
      const { container } = render(<MovieCardSkeleton />);

      expect(container.querySelector('.bg-card')).toBeInTheDocument();
      expect(container.querySelector('.p-5')).toBeInTheDocument();
    });
  });

  describe('MovieGridSkeleton', () => {
    it('should render default 6 skeleton cards', () => {
      render(<MovieGridSkeleton />);

      const grid = document.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid?.children.length).toBe(6);
    });

    it('should render custom number of skeleton cards', () => {
      render(<MovieGridSkeleton count={3} />);

      const grid = document.querySelector('.grid');
      expect(grid?.children.length).toBe(3);
    });

    it('should have responsive grid classes', () => {
      const { container } = render(<MovieGridSkeleton />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass(
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3'
      );
    });
  });
});
