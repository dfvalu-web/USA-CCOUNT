/**
 * Motor de Monitoramento em Tempo Real, Telemetria Multi-Tenant & SIEM Bancário
 * Padrão SOC 2 Type II, ISO 27001 & NIST SP 800-63B
 */

export interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'ADMIN_OWNER' | 'CPA_ACCOUNTANT' | 'STAFF_MEMBER' | 'CLIENT_B2B';
  avatarUrl: string;
  companyId: string;
  companyName: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  isCurrentSession: boolean;
  loginTimestamp: string;
  lastActiveTimestamp: string;
  currentActivity: string;
  idleMinutes: number;
  status: 'ACTIVE' | 'IDLE' | 'SUSPICIOUS';
  threatScore: number; // 0 to 100
}

export interface SecurityThreatEvent {
  id: string;
  timestamp: string;
  type:
    | 'FAILED_LOGIN'
    | 'SUSPICIOUS_IP'
    | 'BRUTE_FORCE_BLOCKED'
    | 'STEP_UP_2FA_CHALLENGE'
    | 'SESSION_KILLED'
    | 'LOCKDOWN_TRIGGERED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actor: string;
  ip: string;
  location: string;
  details: string;
  resolved: boolean;
}

export interface SystemHealthMetrics {
  uptimePercent: number;
  activeSessionsCount: number;
  activeTenantsCount: number;
  totalRequestsToday: number;
  p95LatencyMs: number;
  errorRatePercent: number;
  ledgerIntegrityScore: number;
  securityShieldStatus: 'OPTIMAL' | 'ELEVATED' | 'LOCKDOWN';
  isLockdownActive: boolean;
}

export interface LiveActivityFeedItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  companyName: string;
  actionDescription: string;
  category: 'ACCOUNTING' | 'PAYROLL' | 'TAX' | 'SECURITY' | 'BANKING';
}

const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 'sess_david_master_01',
    userId: 'usr-dfvalu-gmail-com',
    userName: 'David Ribeiro',
    userEmail: 'dfvalu@gmail.com',
    userRole: 'ADMIN_OWNER',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    companyId: 'cmp-milla-maid-ga',
    companyName: 'Milla Maid Services LLC',
    deviceName: 'Google Chrome em Windows PC',
    deviceType: 'desktop',
    browser: 'Google Chrome 128.0',
    os: 'Windows 11 Enterprise',
    ipAddress: '73.189.44.12',
    location: 'Atlanta, GA (Geórgia/US)',
    isCurrentSession: true,
    loginTimestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    lastActiveTimestamp: new Date().toISOString(),
    currentActivity: 'Cockpit Executivo • Gestão do Livro-Razão US GAAP',
    idleMinutes: 0,
    status: 'ACTIVE',
    threatScore: 0,
  },
  {
    id: 'sess_liudmila_owner_02',
    userId: 'usr-liudmilabrandao-gmail-com',
    userName: 'Liudmila Brandão',
    userEmail: 'liudmilabrandao@gmail.com',
    userRole: 'ADMIN_OWNER',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    companyId: 'cmp-milla-maid-ga',
    companyName: 'Milla Maid Services LLC',
    deviceName: 'Apple Safari em MacBook Pro & iPhone',
    deviceType: 'desktop',
    browser: 'Apple Safari 17.5',
    os: 'macOS Sonoma',
    ipAddress: '73.189.44.12',
    location: 'Atlanta, GA (Geórgia/US)',
    isCurrentSession: false,
    loginTimestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    lastActiveTimestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    currentActivity: 'Aprovação de Folha de Pagamento (Payroll) • 8 Colaboradoras',
    idleMinutes: 2,
    status: 'ACTIVE',
    threatScore: 0,
  },
  {
    id: 'sess_cpa_victoria_03',
    userId: 'usr-cpa-preparer-03',
    userName: 'Victoria Sterling (CPA)',
    userEmail: 'v.sterling.cpa@mistercontabil.com',
    userRole: 'CPA_ACCOUNTANT',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    companyId: 'cmp-apex-cleanops-tx',
    companyName: 'Apex CleanOps Commercial Services LLC',
    deviceName: 'Microsoft Edge em Windows PC',
    deviceType: 'desktop',
    browser: 'Microsoft Edge 127.0',
    os: 'Windows 11 Pro',
    ipAddress: '198.51.100.42',
    location: 'Dallas, TX (Texas/US)',
    isCurrentSession: false,
    loginTimestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    lastActiveTimestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    currentActivity: 'Auditoria de Conciliação Bancária & Form 1065 K-1',
    idleMinutes: 6,
    status: 'ACTIVE',
    threatScore: 2,
  },
  {
    id: 'sess_client_marcus_04',
    userId: 'usr-client-marcus-04',
    userName: 'Marcus Vance',
    userEmail: 'marcus@apexcommercial.com',
    userRole: 'CLIENT_B2B',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    companyId: 'cmp-apex-cleanops-tx',
    companyName: 'Apex CleanOps Commercial Services LLC',
    deviceName: 'Google Chrome em iPad Pro',
    deviceType: 'tablet',
    browser: 'Google Chrome Mobile',
    os: 'iPadOS 17.6',
    ipAddress: '172.56.21.99',
    location: 'Austin, TX (Texas/US)',
    isCurrentSession: false,
    loginTimestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    lastActiveTimestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    currentActivity: 'Visualização de Faturas B2B & Comprovante de Pagamento',
    idleMinutes: 1,
    status: 'ACTIVE',
    threatScore: 0,
  },
];

const INITIAL_THREATS: SecurityThreatEvent[] = [
  {
    id: 'threat_01',
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    type: 'BRUTE_FORCE_BLOCKED',
    severity: 'HIGH',
    actor: 'IP 45.134.22.91 (Desconhecido / Proxy Tor)',
    ip: '45.134.22.91',
    location: 'Frankfurt, Alemanha (DE)',
    details: 'WAF interceptou 5 tentativas de ataque com dicionário contra endpoint /api/auth/login. IP banido.',
    resolved: true,
  },
  {
    id: 'threat_02',
    timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    type: 'STEP_UP_2FA_CHALLENGE',
    severity: 'LOW',
    actor: 'dfvalu@gmail.com',
    ip: '73.189.44.12',
    location: 'Atlanta, GA (Geórgia/US)',
    details: 'Novo navegador detectado. Desafio Step-Up 2FA aprovado com PIN Master 849201.',
    resolved: true,
  },
  {
    id: 'threat_03',
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    type: 'FAILED_LOGIN',
    severity: 'MEDIUM',
    actor: 'unknown_admin@mistercontabil.com',
    ip: '185.220.101.5',
    location: 'Amsterdã, Holanda (NL)',
    details: 'Tentativa de login com conta inexistente bloqueada pelo WAF Zero-Trust.',
    resolved: true,
  },
];

const INITIAL_FEED: LiveActivityFeedItem[] = [
  {
    id: 'feed_01',
    timestamp: new Date().toISOString(),
    userName: 'David Ribeiro',
    userRole: 'Managing Director & Master CPA',
    companyName: 'Milla Maid Services LLC',
    actionDescription: 'Emissão e conciliação de fatura corporativa #INV-2026-041 ($4,500.00)',
    category: 'ACCOUNTING',
  },
  {
    id: 'feed_02',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    userName: 'Liudmila Brandão',
    userRole: 'Managing Partner',
    companyName: 'Milla Maid Services LLC',
    actionDescription: 'Aprovação de desembolso bancário para folha semanal de prestadoras de serviços',
    category: 'PAYROLL',
  },
  {
    id: 'feed_03',
    timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    userName: 'Victoria Sterling (CPA)',
    userRole: 'CPA Accountant',
    companyName: 'Apex CleanOps Commercial Services LLC',
    actionDescription: 'Geração de Dossiê Fiscal K-1 para fechamento anual IRS Form 1065',
    category: 'TAX',
  },
  {
    id: 'feed_04',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    userName: 'Sistema Autônomo WAF',
    userRole: 'Security Bot',
    companyName: 'Plataforma Global Mister Contábil',
    actionDescription: 'Bloqueio preventivo de tráfego malicioso e verificação de integridade Merkle Tree',
    category: 'SECURITY',
  },
  {
    id: 'feed_05',
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    userName: 'David Ribeiro',
    userRole: 'Managing Director & Master CPA',
    companyName: 'Horizon Global Tech Holdings LLC',
    actionDescription: 'Fechamento de balancete fiscal de verificação em bases Acrual & Cash',
    category: 'ACCOUNTING',
  },
];

export class SessionMonitoringEngine {
  private static sessions: ActiveSession[] = [...INITIAL_SESSIONS];
  private static threats: SecurityThreatEvent[] = [...INITIAL_THREATS];
  private static feed: LiveActivityFeedItem[] = [...INITIAL_FEED];
  private static isLockdownActive = false;

  public static getActiveSessions(currentEmail?: string): ActiveSession[] {
    const normalizedEmail = (currentEmail || '').toLowerCase().trim();
    return this.sessions.map((sess) => ({
      ...sess,
      isCurrentSession: normalizedEmail ? sess.userEmail.toLowerCase() === normalizedEmail : sess.isCurrentSession,
    }));
  }

  public static killSession(sessionId: string): boolean {
    const targetIndex = this.sessions.findIndex((s) => s.id === sessionId);
    if (targetIndex === -1) return false;

    const target = this.sessions[targetIndex];
    this.sessions.splice(targetIndex, 1);

    // Registra o evento de desconexão forçada no SIEM
    this.threats.unshift({
      id: `threat_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'SESSION_KILLED',
      severity: 'MEDIUM',
      actor: `${target.userName} (${target.userEmail})`,
      ip: target.ipAddress,
      location: target.location,
      details: `Sessão de ${target.userName} foi revogada e desconectada forçadamente pelo Administrador Master.`,
      resolved: true,
    });

    this.feed.unshift({
      id: `feed_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: 'Admin Master',
      userRole: 'Managing Director',
      companyName: target.companyName,
      actionDescription: `Revogação forçada de sessão de ${target.userName} no dispositivo ${target.deviceName}`,
      category: 'SECURITY',
    });

    return true;
  }

  public static triggerEmergencyLockdown(): boolean {
    this.isLockdownActive = true;
    // Remove all non-master sessions immediately
    this.sessions = this.sessions.filter((s) => s.userRole === 'ADMIN_OWNER');

    this.threats.unshift({
      id: `threat_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'LOCKDOWN_TRIGGERED',
      severity: 'CRITICAL',
      actor: 'David Ribeiro (Master Owner)',
      ip: '73.189.44.12',
      location: 'Atlanta, GA (Geórgia/US)',
      details: '🚨 MODO DE EMERGÊNCIA BANCÁRIA ATIVADO: Todas as sessões de terceiros foram congeladas imediatamente.',
      resolved: false,
    });

    return true;
  }

  public static cancelEmergencyLockdown(): boolean {
    this.isLockdownActive = false;
    this.sessions = [...INITIAL_SESSIONS];
    return true;
  }

  public static getSecurityThreats(): SecurityThreatEvent[] {
    return [...this.threats];
  }

  public static getLiveActivityFeed(): LiveActivityFeedItem[] {
    return [...this.feed];
  }

  public static getSystemHealthMetrics(): SystemHealthMetrics {
    const uniqueTenants = new Set(this.sessions.map((s) => s.companyId)).size;

    return {
      uptimePercent: 99.99,
      activeSessionsCount: this.sessions.length,
      activeTenantsCount: uniqueTenants || 2,
      totalRequestsToday: 148920,
      p95LatencyMs: 14.2,
      errorRatePercent: 0.0,
      ledgerIntegrityScore: 100,
      securityShieldStatus: this.isLockdownActive ? 'LOCKDOWN' : 'OPTIMAL',
      isLockdownActive: this.isLockdownActive,
    };
  }

  public static logLiveActivity(item: Omit<LiveActivityFeedItem, 'id' | 'timestamp'>): LiveActivityFeedItem {
    const newItem: LiveActivityFeedItem = {
      ...item,
      id: `feed_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.feed.unshift(newItem);
    if (this.feed.length > 50) this.feed.pop();
    return newItem;
  }
}
