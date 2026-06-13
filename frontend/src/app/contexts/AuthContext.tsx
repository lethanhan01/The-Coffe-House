import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 1 | 2 | 3 | 4;
  avatar?: string;
  phone?: string;
  language?: 'vn' | 'jp';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (data: Omit<User, 'id'> & { password?: string; language?: 'vn' | 'jp' }) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const SESSION_KEY = 'auth_user';

function readCachedUser(): User | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function writeCachedUser(user: User): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    // sessionStorage quota exceeded — not fatal
  }
}

function clearCachedUser(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const cachedUser = readCachedUser();
  const [user, setUser] = useState<User | null>(cachedUser);
  // Skip spinner when we have a cached user; validate token in background.
  const [isLoading, setIsLoading] = useState(cachedUser === null);

  const formatUser = (data: any): User => ({
    id: data.id.toString(),
    email: data.email,
    name: data.full_name,
    role: data.role_id,
    avatar: data.avatar_url,
    phone: data.phone_number,
    language: data.language || 'vn'
  });

  useEffect(() => {
    const controller = new AbortController();

    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        clearCachedUser();
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: controller.signal
        });

        if (response.ok) {
          const data = await response.json();
          const freshUser = formatUser(data);
          writeCachedUser(freshUser);
          setUser(freshUser);
        } else {
          // Token expired or revoked — clear state, ProtectedRoute redirects to /login
          localStorage.removeItem('token');
          clearCachedUser();
          setUser(null);
        }
      } catch (error) {
        if (!(error instanceof Error && error.name === 'AbortError')) {
          console.error('Auth token validation failed (network error):', error);
          // Keep cached user on network failure — offline-tolerant behavior.
        }
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
    return () => controller.abort();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      const formattedUser = formatUser(data.user);
      writeCachedUser(formattedUser);
      setUser(formattedUser);
      return formattedUser;
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Login failed');
  };

  const register = async (data: Omit<User, 'id'> & { password?: string; language?: 'vn' | 'jp' }): Promise<boolean> => {
    const payload = {
      email: data.email,
      password: data.password,
      full_name: data.name,
      role_id: data.role,
      phone_number: data.phone,
      language: data.language || 'vn'
    };

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return true;
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    clearCachedUser();
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user || !localStorage.getItem('token')) return; // no-op: impossible in normal flow

    const token = localStorage.getItem('token') as string;

    const payload = {
      full_name: data.name,
      phone_number: data.phone,
      email: data.email
    };

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const updatedData = await response.json();
      const updatedUser = formatUser(updatedData);
      writeCachedUser(updatedUser);
      setUser(updatedUser);
    } else {
      throw new Error('Failed to update user');
    }
  };

  const deleteAccount = async () => {
    if (!user || !localStorage.getItem('token')) return; // no-op: impossible in normal flow

    const token = localStorage.getItem('token') as string;

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      logout();
    } else {
      throw new Error('Failed to delete account');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
