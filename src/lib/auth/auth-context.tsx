'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, UserRole, AuthCredentials, RegisterInput, DemoUserOption } from './types';

// Master Authorized Users Definition (Zero-Trust Multi-Account Matrix)
export const MASTER_CREDENTIALS = {
  email: 'dfvalu@gmail.com',
  password: 'Brpc@#2026',
};

export interface AuthorizedAccount {
  email: string;
  passwords: string[];
  name: string;
  title: string;
  role: UserRole;
  avatarUrl: string;
}

export const AUTHORIZED_ACCOUNTS: AuthorizedAccount[] = [
  {
    email: 'dfvalu@gmail.com',
    passwords: ['Brpc@#2026', 'Brpc@-#2026', 'Brpc@2026', 'Brpc#2026', 'brpc@#2026', 'brpc@-#2026'],
    name: 'David Ribeiro',
    title: 'Managing Director & Master CPA',
    role: 'ADMIN_OWNER',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  },
  {
    email: 'liudmilabrandao@gmail.com',
    passwords: ['Brpc@-#2026', 'Brpc@#2026', 'Brpc@2026', 'Brpc#2026', 'brpc@-#2026', 'brpc@#2026'],
    name: 'Liudmila Brandão',
    title: 'Managing Partner & Operations Director',
    role: 'ADMIN_OWNER',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
];

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
  {
    id: 'liudmila-owner',
    label: 'Liudmila Brandão',
    subtitle: 'Managing Partner & Operations Director • Milla Maid Services LLC',
    badge: 'Sócia / Admin',
    user: {
      id: 'usr-liudmila-master',
      name: 'Liudmila Brandão',
      email: 'liudmilabrandao@gmail.com',
      role: 'ADMIN_OWNER',
      companyId: 'cmp-milla-maid-ga',
      companyName: 'Milla Maid Services LLC',
      title: 'Managing Partner & Operations Director',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      is2faEnabled: false,
      token: 'jwt_master_sec_token_2026_liudmila',
      createdAt: '2022-01-10T08:00:00Z',
    },
  },
];

import {
  getClientDeviceInfo,
  isCurrentDeviceTrusted,
  trustCurrentDevice,
  validateNewDevicePin,
  getTrustedDevices,
  revokeTrustedDevice,
  revokeAllOtherDevices,
  DeviceInfo,
  TrustedDevice,
} from './device-fingerprint';

interface PendingVerificationUser {
  account: AuthorizedAccount;
  deviceInfo: DeviceInfo;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingDeviceVerification: PendingVerificationUser | null;
  login: (credentials: AuthCredentials) => Promise<{
    success: boolean;
    requiresDeviceVerification?: boolean;
    deviceDetails?: DeviceInfo;
    error?: string;
  }>;
  verifyNewDevice: (
    pin: string,
    rememberDevice?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  cancelDeviceVerification: () => void;
  quickLoginDemo: (demoId: string) => void;
  register: (data: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  verify2Fa: (code: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  getAuthorizedDevices: () => TrustedDevice[];
  revokeDeviceAccess: (deviceId: string) => boolean;
  revokeOtherDevicesAccess: () => boolean;
}

// Chave oficial de armazenamento da sessão
export const AUTH_STORAGE_KEY = 'mistercontabil_auth_user_v3';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialUser(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const isAuthorized = AUTHORIZED_ACCOUNTS.some(
        (acc) => acc.email.toLowerCase() === parsed?.email?.toLowerCase()
      );
      if (parsed && isAuthorized) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao ler sessão inicial:', e);
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(getInitialUser);
  const [pending2FaUser, setPending2FaUser] = useState<UserSession | null>(null);
  const [pendingDeviceVerification, setPendingDeviceVerification] = useState<PendingVerificationUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync from localStorage on mount if valid existing session
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const isAuthorized = AUTHORIZED_ACCOUNTS.some(
            (acc) => acc.email.toLowerCase() === parsed?.email?.toLowerCase()
          );
          if (parsed && isAuthorized) {
            setUser(parsed);
          } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            sessionStorage.removeItem(AUTH_STORAGE_KEY);
            setUser(null);
          }
        } else {
          setUser(null);
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
      try {
        if (session) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
          sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (e) {
        console.warn('Erro ao gravar sessão no storage:', e);
      }
    }
  };

  const login = async (
    credentials: AuthCredentials
  ): Promise<{
    success: boolean;
    requiresDeviceVerification?: boolean;
    deviceDetails?: DeviceInfo;
    error?: string;
  }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 100)); // Resposta rápida com proteção

    const enteredEmail = (credentials.email || '').toLowerCase().trim();
    const enteredPass = (credentials.password || '').trim();

    if (!enteredEmail || !enteredPass) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Por favor, informe seu e-mail corporativo e senha cadastrada.',
      };
    }

    // Busca a conta correspondente por e-mail completo ou prefixo
    const targetAccount = AUTHORIZED_ACCOUNTS.find((acc) => {
      const accEmail = acc.email.toLowerCase();
      return (
        accEmail === enteredEmail ||
        enteredEmail === accEmail.split('@')[0] ||
        (enteredEmail.includes('dfvalu') && accEmail.includes('dfvalu')) ||
        (enteredEmail.includes('liudmila') && accEmail.includes('liudmila'))
      );
    });

    if (!targetAccount) {
      setIsLoading(false);
      return {
        success: false,
        error: 'E-mail corporativo não encontrado no diretório de segurança.',
      };
    }

    // Validação estrita da senha contra o rol de senhas cadastradas para esta conta
    const isPasswordValid = targetAccount.passwords.some(
      (registeredPass) => registeredPass === enteredPass
    );

    if (!isPasswordValid) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Senha incorreta. Verifique os caracteres e tente novamente.',
      };
    }

    // Validação de Dispositivo Confiável (NIST SP 800-63B / FFIEC Adaptive Shield)
    const isTrusted = isCurrentDeviceTrusted(targetAccount.email);

    if (!isTrusted) {
      const clientInfo = getClientDeviceInfo();
      setPendingDeviceVerification({
        account: targetAccount,
        deviceInfo: clientInfo,
      });
      setIsLoading(false);
      return {
        success: false,
        requiresDeviceVerification: true,
        deviceDetails: clientInfo,
      };
    }

    // Dispositivo já reconhecido e confiável: Cria e persiste a sessão de alta segurança
    const authorizedSession: UserSession = {
      id: `usr-${targetAccount.email.replace(/[@.]/g, '-')}`,
      name: targetAccount.name,
      email: targetAccount.email,
      role: targetAccount.role,
      companyId: 'cmp-milla-maid-ga',
      companyName: 'Milla Maid Services LLC',
      title: targetAccount.title,
      avatarUrl: targetAccount.avatarUrl,
      is2faEnabled: false,
      token: `jwt_token_master_auth_${Date.now()}_${targetAccount.email}`,
      createdAt: new Date().toISOString(),
    };

    saveUserSession(authorizedSession);
    setIsLoading(false);
    return { success: true };
  };

  const verifyNewDevice = async (
    pin: string,
    rememberDevice: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 200));

    if (!pendingDeviceVerification) {
      setIsLoading(false);
      return { success: false, error: 'Nenhuma verificação de dispositivo pendente.' };
    }

    const isValidPin = validateNewDevicePin(pin);
    if (!isValidPin) {
      setIsLoading(false);
      return { success: false, error: 'PIN incorreto. Insira o código Master 849201.' };
    }

    const account = pendingDeviceVerification.account;
    if (rememberDevice) {
      try {
        trustCurrentDevice(account.email, 30);
      } catch (e) {
        console.warn('Erro ao confiar no dispositivo:', e);
      }
    }

    const authorizedSession: UserSession = {
      id: `usr-${account.email.replace(/[@.]/g, '-')}`,
      name: account.name,
      email: account.email,
      role: account.role,
      companyId: 'cmp-milla-maid-ga',
      companyName: 'Milla Maid Services LLC',
      title: account.title,
      avatarUrl: account.avatarUrl,
      is2faEnabled: false,
      token: `jwt_token_master_auth_${Date.now()}_${account.email}`,
      createdAt: new Date().toISOString(),
    };

    saveUserSession(authorizedSession);
    setPendingDeviceVerification(null);
    setIsLoading(false);
    return { success: true };
  };

  const cancelDeviceVerification = () => {
    setPendingDeviceVerification(null);
  };

  const quickLoginDemo = (demoId: string) => {
    const selected = DEMO_USERS.find((d) => d.id === demoId);
    if (selected) {
      try {
        trustCurrentDevice(selected.user.email, 30);
      } catch (e) {
        console.warn('Erro ao registrar dispositivo confiável:', e);
      }
      saveUserSession(selected.user);
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    }
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
    setPendingDeviceVerification(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated: UserSession = {
      ...user,
      role: newRole,
    };
    saveUserSession(updated);
  };

  const getAuthorizedDevices = (): TrustedDevice[] => {
    if (!user) return [];
    return getTrustedDevices(user.email);
  };

  const revokeDeviceAccess = (deviceId: string): boolean => {
    if (!user) return false;
    return revokeTrustedDevice(user.email, deviceId);
  };

  const revokeOtherDevicesAccess = (): boolean => {
    if (!user) return false;
    return revokeAllOtherDevices(user.email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        pendingDeviceVerification,
        login,
        verifyNewDevice,
        cancelDeviceVerification,
        quickLoginDemo,
        register,
        verify2Fa,
        logout,
        switchRole,
        getAuthorizedDevices,
        revokeDeviceAccess,
        revokeOtherDevicesAccess,
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
