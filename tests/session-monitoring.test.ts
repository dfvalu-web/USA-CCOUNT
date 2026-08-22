import { describe, it, expect } from 'vitest';
import { SessionMonitoringEngine } from '../src/lib/monitoring/session-monitoring-engine';

describe('SessionMonitoringEngine (SOC 2 & Real-Time Multi-Tenant Telemetry)', () => {
  it('deve listar sessões ativas com isolamento e identificação do usuário atual', () => {
    const sessions = SessionMonitoringEngine.getActiveSessions('dfvalu@gmail.com');
    expect(sessions.length).toBeGreaterThanOrEqual(3);

    const davidSession = sessions.find((s) => s.userEmail === 'dfvalu@gmail.com');
    expect(davidSession).toBeDefined();
    expect(davidSession?.isCurrentSession).toBe(true);
    expect(davidSession?.userRole).toBe('ADMIN_OWNER');
    expect(davidSession?.companyName).toBe('Milla Maid Services LLC');
  });

  it('deve calcular métricas de saúde com SLA 99.99% e 100% de integridade das partidas dobradas', () => {
    const metrics = SessionMonitoringEngine.getSystemHealthMetrics();
    expect(metrics.uptimePercent).toBe(99.99);
    expect(metrics.ledgerIntegrityScore).toBe(100);
    expect(metrics.errorRatePercent).toBe(0);
    expect(metrics.activeSessionsCount).toBeGreaterThanOrEqual(2);
    expect(metrics.activeTenantsCount).toBeGreaterThanOrEqual(1);
    expect(metrics.isLockdownActive).toBe(false);
  });

  it('deve permitir desconectar forçadamente uma sessão (Kill Session) e registrar no SIEM', () => {
    const initialSessions = SessionMonitoringEngine.getActiveSessions();
    const targetSession = initialSessions.find((s) => s.userEmail === 'marcus@apexcommercial.com');
    expect(targetSession).toBeDefined();

    if (targetSession) {
      const killed = SessionMonitoringEngine.killSession(targetSession.id);
      expect(killed).toBe(true);

      const afterSessions = SessionMonitoringEngine.getActiveSessions();
      const exists = afterSessions.some((s) => s.id === targetSession.id);
      expect(exists).toBe(false);

      const threats = SessionMonitoringEngine.getSecurityThreats();
      const killThreat = threats.find((t) => t.type === 'SESSION_KILLED');
      expect(killThreat).toBeDefined();
      expect(killThreat?.actor).toContain('Marcus Vance');
    }
  });

  it('deve acionar e desativar o Modo de Emergência Bancária (Lockdown)', () => {
    SessionMonitoringEngine.triggerEmergencyLockdown();
    let metrics = SessionMonitoringEngine.getSystemHealthMetrics();
    expect(metrics.isLockdownActive).toBe(true);
    expect(metrics.securityShieldStatus).toBe('LOCKDOWN');

    // Apenas ADMIN_OWNER devem permanecer
    const activeDuringLockdown = SessionMonitoringEngine.getActiveSessions();
    expect(activeDuringLockdown.every((s) => s.userRole === 'ADMIN_OWNER')).toBe(true);

    // Cancelar lockdown
    SessionMonitoringEngine.cancelEmergencyLockdown();
    metrics = SessionMonitoringEngine.getSystemHealthMetrics();
    expect(metrics.isLockdownActive).toBe(false);
    expect(metrics.securityShieldStatus).toBe('OPTIMAL');
  });

  it('deve registrar novos eventos no feed de auditoria ao vivo', () => {
    const newLog = SessionMonitoringEngine.logLiveActivity({
      userName: 'David Ribeiro',
      userRole: 'Managing Director & Master CPA',
      companyName: 'Milla Maid Services LLC',
      actionDescription: 'Geração e conferência de conciliação bancária Chase Premier Checking',
      category: 'BANKING',
    });

    expect(newLog.id).toBeDefined();
    const feed = SessionMonitoringEngine.getLiveActivityFeed();
    expect(feed[0].actionDescription).toContain('Chase Premier Checking');
  });
});
