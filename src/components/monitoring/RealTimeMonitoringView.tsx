'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/auth-context';
import {
  SessionMonitoringEngine,
  ActiveSession,
  SecurityThreatEvent,
  SystemHealthMetrics,
  LiveActivityFeedItem,
} from '@/lib/monitoring/session-monitoring-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Activity,
  Users,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Radio,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Trash2,
  Lock,
  Download,
  Building2,
  Clock,
  Sparkles,
  Zap,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export function RealTimeMonitoringView() {
  const { locale } = useI18n();
  const { user } = useAuth();

  const [sessions, setSessions] = useState<ActiveSession[]>(() =>
    SessionMonitoringEngine.getActiveSessions(user?.email)
  );
  const [threats, setThreats] = useState<SecurityThreatEvent[]>(() =>
    SessionMonitoringEngine.getSecurityThreats()
  );
  const [feed, setFeed] = useState<LiveActivityFeedItem[]>(() =>
    SessionMonitoringEngine.getLiveActivityFeed()
  );
  const [metrics, setMetrics] = useState<SystemHealthMetrics>(() =>
    SessionMonitoringEngine.getSystemHealthMetrics()
  );

  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('ALL');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Periodic simulated live pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions(SessionMonitoringEngine.getActiveSessions(user?.email));
      setMetrics(SessionMonitoringEngine.getSystemHealthMetrics());
      setFeed(SessionMonitoringEngine.getLiveActivityFeed());
    }, 10000);
    return () => clearInterval(interval);
  }, [user?.email]);

  const handleKillSession = (session: ActiveSession) => {
    if (session.isCurrentSession) {
      alert('Você não pode desconectar sua própria sessão atual por este botão.');
      return;
    }

    const success = SessionMonitoringEngine.killSession(session.id);
    if (success) {
      setSessions(SessionMonitoringEngine.getActiveSessions(user?.email));
      setThreats(SessionMonitoringEngine.getSecurityThreats());
      setFeed(SessionMonitoringEngine.getLiveActivityFeed());
      setMetrics(SessionMonitoringEngine.getSystemHealthMetrics());
      setNotificationMsg(
        `🚨 Sessão de ${session.userName} (${session.userEmail}) revogada e desconectada com sucesso em tempo real.`
      );
    }
  };

  const handleToggleLockdown = () => {
    if (metrics.isLockdownActive) {
      SessionMonitoringEngine.cancelEmergencyLockdown();
      setNotificationMsg('✅ Modo de Emergência Bancária desativado. Conexões normais restauradas.');
    } else {
      const confirm = window.confirm(
        '⚠️ ATENÇÃO: Deseja ativar o Modo de Emergência Bancária? Todas as sessões de clientes e colaboradores serão desconectadas imediatamente, mantendo apenas os sócios Master.'
      );
      if (!confirm) return;
      SessionMonitoringEngine.triggerEmergencyLockdown();
      setNotificationMsg('🚨 MODO DE EMERGÊNCIA ATIVADO: Sessões de terceiros congeladas.');
    }
    setSessions(SessionMonitoringEngine.getActiveSessions(user?.email));
    setThreats(SessionMonitoringEngine.getSecurityThreats());
    setMetrics(SessionMonitoringEngine.getSystemHealthMetrics());
  };

  const handleExportAuditDossier = () => {
    const dossier = {
      reportType: 'Multi-Tenant Real-Time Telemetry & SOC 2 Active Session Audit',
      generatedAt: new Date().toISOString(),
      generatedBy: user ? `${user.name} (${user.email})` : 'Master CPA Administrator',
      systemHealth: metrics,
      activeSessions: sessions,
      securityThreats: threats,
      liveActivityStream: feed,
      complianceStandard: 'SOC 2 Type II / ISO 27001 / FFIEC / NIST SP 800-63B',
    };

    const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOC2_SESSION_MONITORING_DOSSIER_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setNotificationMsg('Dossiê de Monitoramento e Auditoria SOC 2 exportado com sucesso (.JSON)!');
  };

  const filteredSessions = sessions.filter((s) => {
    if (selectedRoleFilter !== 'ALL' && s.userRole !== selectedRoleFilter) return false;
    if (selectedCompanyFilter !== 'ALL' && s.companyId !== selectedCompanyFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <Card className="border-emerald-500/30 bg-slate-950/90 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-bold text-white tracking-tight">
                    Centro de Comando & Monitoramento em Tempo Real
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                    SOC 2 SIEM • AO VIVO
                  </Badge>
                </div>
                <CardDescription className="text-xs text-slate-400 mt-0.5">
                  Observabilidade multi-tenant, rastreamento de conexões concorrentes, telemetria de integridade e defesa ativa contra ameaças
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportAuditDossier}
                className="text-xs border-slate-800 text-slate-300 hover:bg-slate-850 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Exportar Dossiê SOC 2
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleToggleLockdown}
                className={`text-xs font-bold transition-all cursor-pointer ${
                  metrics.isLockdownActive
                    ? 'bg-rose-600 text-white border-rose-500 hover:bg-rose-500 animate-pulse'
                    : 'border-rose-800/60 text-rose-300 hover:bg-rose-950/40'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                {metrics.isLockdownActive ? '🚨 Desativar Lockdown' : 'Modo de Emergência Bancária'}
              </Button>
            </div>
          </div>
        </CardHeader>

        {notificationMsg && (
          <div className="mx-6 mb-4 p-3.5 rounded-xl border border-emerald-700 bg-emerald-950/80 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
            <Button size="sm" variant="ghost" className="h-6 text-xs px-2 text-emerald-400 hover:text-white" onClick={() => setNotificationMsg(null)}>
              ✕
            </Button>
          </div>
        )}

        {/* 4 Key Metrics Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 pt-0">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Sessões Concorrentes</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
              <span>{metrics.activeSessionsCount}</span>
              <span className="text-[11px] font-sans font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                🟢 Ativos Agora
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Presença simultânea multi-empresa</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Tenants Monitorados</span>
              <Building2 className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
              <span>{metrics.activeTenantsCount}</span>
              <span className="text-[11px] font-sans font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
                Isolamento Total
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Milla Maid, Apex & Holdings</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Integridade do Livro-Razão</span>
              <ShieldCheck className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
              <span>{metrics.ledgerIntegrityScore}%</span>
              <span className="text-[11px] font-sans font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
                Partidas Dobradas
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Débitos = Créditos matemáticos</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>SLA de Disponibilidade</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
              <span>{metrics.uptimePercent}%</span>
              <span className="text-[11px] font-sans font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                p95: {metrics.p95LatencyMs}ms
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">0 erros em 148,920 requisições</p>
          </div>
        </div>
      </Card>

      {/* Main Grid: Active Sessions Table & Live Stream Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Concurrent Sessions Table (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border-slate-800 bg-slate-950">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Sessões Ativas em Tempo Real ({filteredSessions.length})</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Usuários atualmente autenticados com tokens válidos de sessão
                  </CardDescription>
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-2 text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedRoleFilter}
                    onChange={(e) => setSelectedRoleFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">Todos os Cargos</option>
                    <option value="ADMIN_OWNER">Sócios (Admin Owner)</option>
                    <option value="CPA_ACCOUNTANT">Contador CPA</option>
                    <option value="CLIENT_B2B">Clientes B2B</option>
                  </select>
                </div>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-xs">Usuário & Cargo</TableHead>
                    <TableHead className="text-xs">Empresa Ativa</TableHead>
                    <TableHead className="text-xs">Dispositivo & IP</TableHead>
                    <TableHead className="text-xs">Atividade Atual</TableHead>
                    <TableHead className="text-xs text-right">Controle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((s) => (
                    <TableRow key={s.id} className="border-slate-800/80 hover:bg-slate-900/60 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={s.avatarUrl}
                            alt={s.userName}
                            className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-1.5">
                              <span>{s.userName}</span>
                              {s.isCurrentSession && (
                                <Badge variant="outline" className="text-[8px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-1.5 py-0">
                                  Você
                                </Badge>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {s.userEmail} •{' '}
                              <span className={s.userRole === 'ADMIN_OWNER' ? 'text-amber-400 font-bold' : 'text-sky-400'}>
                                {s.userRole}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-xs font-semibold text-slate-200 truncate max-w-[150px]">
                          {s.companyName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">ID: {s.companyId}</div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                          {s.deviceType === 'mobile' ? (
                            <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : s.deviceType === 'tablet' ? (
                            <Tablet className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          ) : (
                            <Laptop className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          )}
                          <span className="truncate max-w-[140px]">{s.deviceName}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">
                          {s.ipAddress} • {s.location}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-xs text-emerald-400 font-medium truncate max-w-[180px]">
                          {s.currentActivity}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {s.idleMinutes === 0 ? '🟢 Ativo agora' : `🟡 Ocioso há ${s.idleMinutes} min`}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        {!s.isCurrentSession ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleKillSession(s)}
                            className="h-8 px-2.5 text-xs text-rose-400 hover:text-rose-200 hover:bg-rose-950/50 font-semibold border border-rose-900/40 cursor-pointer"
                            title="Desconectar este usuário imediatamente"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Kill
                          </Button>
                        ) : (
                          <Badge variant="outline" className="text-[9px] bg-slate-900 text-slate-400 border-slate-800">
                            Sessão Atual
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Threat Intelligence / WAF Defense Log */}
          <Card className="border-slate-800 bg-slate-950">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <CardTitle className="text-base font-bold text-white">
                  Inteligência de Ameaças & Defesa WAF (Zero-Trust SIEM)
                </CardTitle>
              </div>
            </CardHeader>
            <div className="p-6 pt-0 space-y-3">
              {threats.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold ${
                          t.severity === 'CRITICAL' || t.severity === 'HIGH'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : t.severity === 'MEDIUM'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {t.type}
                      </Badge>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(t.timestamp).toLocaleTimeString(locale === 'pt' ? 'pt-BR' : 'en-US')} • {t.location}
                      </span>
                    </div>
                    <p className="text-slate-300">{t.details}</p>
                    <div className="text-[10px] text-slate-500 font-mono">Origem: {t.actor} • IP: {t.ip}</div>
                  </div>
                  <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shrink-0">
                    Bloqueado / Resolvido
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Live Activity Stream & Architecture Telemetry (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-800 bg-slate-950">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <CardTitle className="text-sm font-bold text-white">
                  Feed de Atividades ao Vivo (Audit Stream)
                </CardTitle>
              </div>
            </CardHeader>
            <div className="p-6 pt-0 space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
              {feed.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-bold text-white truncate max-w-[130px]">{item.userName}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString(locale === 'pt' ? 'pt-BR' : 'en-US')}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{item.actionDescription}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                    <span className="truncate max-w-[140px] font-mono">{item.companyName}</span>
                    <Badge variant="outline" className="text-[8px] uppercase">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Infrastructure Health Guard Card */}
          <Card className="border-slate-800 bg-slate-950 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Criptografia & Isolamento:
              </span>
              <span className="font-mono text-white font-semibold">AES-256 GCM / TLS 1.3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                Região Primária de Dados:
              </span>
              <span className="font-mono text-slate-200">US-East (Atlanta, GA)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Compliance Fiscal:
              </span>
              <span className="font-mono text-emerald-400 font-bold">IRS e-File / US GAAP</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
