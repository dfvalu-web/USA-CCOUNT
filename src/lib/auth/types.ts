export type UserRole =
  | 'ADMIN_OWNER' // Managing Member / Business Owner
  | 'CPA_ACCOUNTANT' // Certified Public Accountant / Tax Preparer
  | 'STAFF_MEMBER' // Operations / Team Member
  | 'CLIENT_B2B'; // External Customer in Client Portal

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  companyName: string;
  title: string;
  avatarUrl?: string;
  is2faEnabled: boolean;
  token: string;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  companyName: string;
  ein?: string;
  entityType?: string;
  role: UserRole;
  password?: string;
}

export interface DemoUserOption {
  id: string;
  label: string;
  subtitle: string;
  badge: string;
  user: UserSession;
}
