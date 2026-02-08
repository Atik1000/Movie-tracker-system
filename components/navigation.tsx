'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, Search as SearchIcon, LogOut, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/search"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/40">
              <Film className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary">
              MovieTrack
            </h1>
          </Link>

          {user && (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/search">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-foreground hover:text-primary hover:bg-secondary/50 ${pathname === '/search' ? 'bg-secondary/50 text-primary' : ''}`}
                >
                  <SearchIcon className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </Link>

              <Link href="/watchlist">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-foreground hover:text-primary hover:bg-secondary/50 ${pathname === '/watchlist' ? 'bg-secondary/50 text-primary' : ''}`}
                >
                  <Heart className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:inline">Watchlist</span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-foreground hover:text-destructive hover:bg-secondary/50"
              >
                <LogOut className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
