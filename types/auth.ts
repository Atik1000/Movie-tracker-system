/**
 * Authentication type definitions
 */

export interface User {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
