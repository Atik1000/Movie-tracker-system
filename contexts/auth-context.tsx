'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type AuthUser = {
  email: string;
};

type StoredUser = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const CURRENT_USER_KEY = 'movieTrack.currentUser';
const USERS_KEY = 'movieTrack.users';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredUser[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function setStoredUsers(users: StoredUser[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getStoredCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

function setStoredCurrentUser(user: AuthUser | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    window.localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = getStoredCurrentUser();
    if (existing) setUser(existing);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = getStoredUsers();
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!match) throw new Error('Invalid email or password');

    const authUser: AuthUser = { email: match.email };
    setUser(authUser);
    setStoredCurrentUser(authUser);
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists');
    }

    const newUser: StoredUser = { email, password };
    setStoredUsers([...users, newUser]);

    const authUser: AuthUser = { email };
    setUser(authUser);
    setStoredCurrentUser(authUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setStoredCurrentUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
