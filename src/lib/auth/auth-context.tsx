'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, UserRole, AuthCredentials, RegisterInput, DemoUserOption } from './types';

export const DEMO_USERS: DemoUserOption[] = [
  {
    id: 'demo-milla-admin',
    label: 'Milla Santos',
    subtitle: 'Managing Member • Milla Maid Services LLC',
    badge: 'Empresa / Admin',
    user: {
      id: 'usr-milla-01',
      name: 'Milla Santos',
      email: 'milla@millamaidservices.com',
      role: 'ADMIN_OWNER',
      companyId: 'cmp-milla-maid-ga',
      companyName: 'Milla Maid Services LLC',
      title: 'Managing Member / Owner',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      is2faEnabled: true,
      token: 'jwt_token_demo_milla_admin_2026',
      createdAt: '2022-01-10T08:00:00Z',
    },
  },
  {
    id: 'demo-cpa-lead',
    label: 'David Ribeiro, CPA',
    subtitle: 'Certified Public Accountant & IRS Auditor',
    badge: 'CPA / Contador',
    user: {
      id: 'usr-cpa-02',
      name: 'David Ribeiro, CPA',
      email: 'david.cpa@mistercontabil.com',
      role: 'CPA_ACCOUNTANT',
      companyId: 'cmp-milla-maid-ga',
      companyName: 'Mister Contábil CPA Alliance',
      title: 'Lead Tax Partner (CPA / EA)',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      is2faEnabled: true,
      token: 'jwt_token_demo_cpa_auditor_2026',
      createdAt: '2021-06-15T10:30:00Z',
    },
  },
  {
    id: 'demo-b2b-client',
    label: 'Robert Miller',
    subtitle: 'VP Operations • Atlanta Commercial Properties LLC',
    badge: 'Cliente B2B',
    user: {
      id: 'usr-client-03',
      name: 'Robert Miller',
      email: 'robert.miller@atlantacorpplc.com',
      role: 'CLIENT_B2B',
      companyId: 'cmp-milla-maid-ga',
      companyName: 'Atlanta Commercial Properties LLC',
      title: 'Corporate Procurement VP',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      is2faEnabled: false,
      token: 'jwt_token_demo_b2b_client_2026',
      createdAt: '2023-03-01T14:20:00Z',
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

const AUTH_STORAGE_KEY = 'mistercontabil_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Zero-Trust: Starts as null (unauthenticated) by default
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
          setUser(parsed);
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
    await new Promise((r) => setTimeout(r, 400)); // Network simulation

    const validPasswords = ['Mister@2026', 'Admin@2026', '123456', 'Milla@2026', 'David@2026'];
    const enteredPass = credentials.password ? credentials.password.trim() : '';

    if (!enteredPass || !validPasswords.includes(enteredPass)) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Senha corporativa incorreta. Digite a senha corporativa (Padrão: Mister@2026).',
      };
    }

    // Match Demo User
    const matchedDemo = DEMO_USERS.find(
      (d) => d.user.email.toLowerCase() === credentials.email.toLowerCase()
    );

    let targetUser: UserSession;

    if (matchedDemo) {
      targetUser = matchedDemo.user;
    } else if (credentials.email && credentials.email.includes('@')) {
      targetUser = {
        id: `usr-${Date.now()}`,
        name: credentials.email
          .split('@')[0]
          .replace(/[._]/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        email: credentials.email,
        role: 'ADMIN_OWNER',
        companyId: 'cmp-milla-maid-ga',
        companyName: 'Milla Maid Services LLC',
        title: 'Executive Managing Director',
        is2faEnabled: true,
        token: `jwt_token_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
    } else {
      setIsLoading(false);
      return { success: false, error: 'E-mail corporativo inválido.' };
    }

    // If 2FA is required, challenge user with 2FA step
    if (targetUser.is2faEnabled) {
      setPending2FaUser(targetUser);
      setIsLoading(false);
      return { success: true, requires2Fa: true };
    }

    // Direct session issuance for accounts without 2FA
    saveUserSession(targetUser);
    setIsLoading(false);
    return { success: true, requires2Fa: false };
  };

  const quickLoginDemo = (demoId: string) => {
    const demo = DEMO_USERS.find((d) => d.id === demoId) || DEMO_USERS[0];
    saveUserSession(demo.user);
  };

  const register = async (data: RegisterInput): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const newUser: UserSession = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role || 'ADMIN_OWNER',
      companyId: 'cmp-milla-maid-ga',
      companyName: data.companyName || 'Milla Maid Services LLC',
      title: data.role === 'CPA_ACCOUNTANT' ? 'Senior CPA Advisor' : 'Business Owner & Officer',
      is2faEnabled: true,
      token: `jwt_token_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    saveUserSession(newUser);
    setIsLoading(false);
    return { success: true };
  };

  const verify2Fa = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setIsLoading(false);

    if ((code === '123456' || code.length === 6) && pending2FaUser) {
      saveUserSession(pending2FaUser);
      setPending2FaUser(null);
      return true;
    }
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
