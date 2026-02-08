'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, Search as SearchIcon, LogOut, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';

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
    <motion.nav
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/search"
            className="flex items-center gap-2 group"
          >
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/40"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Film className="w-5 h-5 text-primary" />
            </motion.div>
            <motion.h1
              className="text-xl sm:text-2xl font-bold text-primary"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              MovieTrack
            </motion.h1>
          </Link>

          {user && (
            <motion.div
              className="flex items-center gap-2 sm:gap-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Link href="/search">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-foreground hover:text-primary hover:bg-secondary/50 relative ${pathname === '/search' ? 'bg-secondary/50 text-primary' : ''}`}
                  >
                    <SearchIcon className="w-5 h-5 sm:mr-2" />
                    <span className="hidden sm:inline">Search</span>
                    {pathname === '/search' && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        layoutId="activeNav"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Button>
                </motion.div>
              </Link>

              <Link href="/watchlist">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-foreground hover:text-primary hover:bg-secondary/50 relative ${pathname === '/watchlist' ? 'bg-secondary/50 text-primary' : ''}`}
                  >
                    <motion.div
                      animate={pathname === '/watchlist' ? {
                        scale: [1, 1.2, 1],
                      } : {}}
                      transition={{ repeat: pathname === '/watchlist' ? Infinity : 0, duration: 2 }}
                    >
                      <Heart className="w-5 h-5 sm:mr-2" />
                    </motion.div>
                    <span className="hidden sm:inline">Watchlist</span>
                    {pathname === '/watchlist' && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        layoutId="activeNav"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Button>
                </motion.div>
              </Link>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-foreground hover:text-destructive hover:bg-secondary/50"
                >
                  <LogOut className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
