'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getMe, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nom: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      getMe(savedToken)
        .then((u) => { setUser(u); setToken(savedToken); })
        .catch(() => { localStorage.removeItem('token'); localStorage.removeItem('refreshToken'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    localStorage.setItem('token', res.token);
    localStorage.setItem('refreshToken', res.refreshToken);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (nom: string, email: string, password: string) => {
    const res = await apiRegister({ nom, email, password });
    localStorage.setItem('token', res.token);
    localStorage.setItem('refreshToken', res.refreshToken);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (savedToken && refreshToken) {
      await apiLogout(savedToken, refreshToken).catch(() => {});
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin: user?.role === 'admin', login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
