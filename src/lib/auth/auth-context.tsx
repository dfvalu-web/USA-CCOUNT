'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, UserRole, AuthCredentials, RegisterInput, DemoUserOption } from './types';

// Master Authorized User Definition (Zero-Trust)
export const MASTER_CREDENTIALS = {
  email: 'dfvalu@gmail.com',
  password: 'Brpc@#2026',
};

export const DEMO_USERS: DemoUserOption[] = [
  {
    id: 'master-owner',
    label: 'David Ribeiro',
    subtitle: 'Managing Director & Master CPA • Milla Maid Services LLC',
    badge: 'Empresa / Admin',
    user: {
      id: 'usr-dfvalu-master',
      name: 'David Ribeiro',
      email: 'dfvalu@gmail.com',
      role: 'ADMIN_OWNER',
      companyId: 'cmp-milla-maid-ga',
      companyName: 'Milla Maid Services LLC',
      title: 'Managing Director & Master CPA',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      is2faEnabled: false,
      token: 'jwt_master_sec_token_2026_dfvalu',
      createdAt: '2022-01-10T08:00:00Z',
    },
  },
];

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<{ success: boolean; requires2Fa?: boolean; error?: string }>;
  quickLoginDemo: (demoId: string) => void;
  register: (data: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  verify2Fa: (code: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage key v3 invalidates all previous sessions and test caches
const AUTH_STORAGE_KEY = 'mistercontabil_auth_user_v3';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Zero-Trust: Starts strictly null (unauthenticated) by default
  const [user, setUser] = useState<UserSession | null>(null);
  const [pending2FaUser, setPending2FaUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync from localStorage on mount if valid existing session
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.email?.toLowerCase() === MASTER_CREDENTIALS.email.toLowerCase()) {
            setUser(parsed);
          } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            setUser(null);
          }
        }
      }
    } catch (e) {
      console.warn('Error reading auth session from storage:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserSession = (session: UserSession | null) => {
    setUser(session);
    if (typeof window !== 'undefined') {
      if (session) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  };

  const login = async (credentials: AuthCredentials): Promise<{ success: boolean; requires2Fa?: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 450)); // Security timing delay

    const enteredEmail = (credentials.email || '').toLowerCase().trim();
    const enteredPass = (credentials.password || '').trim();

    // Zero-Trust Hardening: Strictly accept ONLY official master credentials
    if (
      enteredEmail === MASTER_CREDENTIALS.email.toLowerCase() &&
      enteredPass === MASTER_CREDENTIALS.password
    ) {
      const authorizedSession: UserSession = {
        id: 'usr-dfvalu-master',
        name: 'David Ribeiro',
        email: 'dfvalu@gmail.com',
        role: 'ADMIN_OWNER',
        companyId: 'cmp-milla-maid-ga',
        companyName: 'Milla Maid Services LLC',
        title: 'Managing Director & Master CPA',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        is2faEnabled: false,
        token: `jwt_token_master_auth_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      saveUserSession(authorizedSession);
      setIsLoading(false);
      return { success: true, requires2Fa: false };
    }

    // Reject all other emails, passwords, or bypass attempts
    setIsLoading(false);
    return {
      success: false,
      error: 'Credenciais inválidas. Acesso restrito ao administrador autorizado.',
    };
  };

  const quickLoginDemo = (_demoId: string) => {
    // Disabled in zero-trust production mode: must use credentials
    console.warn('Quick demo bypass disabled under Zero-Trust policy.');
  };

  const register = async (_data: RegisterInput): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: 'O cadastro público de novas contas corporativas está desativado pelo administrador.' };
  };

  const verify2Fa = async (_code: string): Promise<boolean> => {
    return false;
  };

  const logout = () => {
    saveUserSession(null);
    setPending2FaUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated: UserSession = {
      ...user,
      role: newRole,
    };
    saveUserSession(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickLoginDemo,
        register,
        verify2Fa,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
