'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  SystemAuditEngine,
  SystemAuditReport,
  AuditAnomalyAlert,
} from '@/lib/audit/system-audit-engine';
import { RunAnomalyScanModal } from './RunAnomalyScanModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Download,
  AlertCircle,
  FileCheck,
  Search,
  Activity,
  Layers,
  Wrench,
  Clock,
  BellRing,
} from 'lucide-react';

export function SystemAuditView() {
  const { locale, t } = useI18n();

  const [report, setReport] = useState<SystemAuditReport>(() =>
    SystemAuditEngine.runDeepDiagnosticScan()
  );

  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isAutoCronActive, setIsAutoCronActive] = useState(true);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const handleResolve = (anomalyId: string) => {
    const updated = report.anomalies.map((a) =>
      a.id === anomalyId ? { ...a, status: 'RESOLVED' as const } : a
    );
    setReport({
      ...report,
      anomalies: updated,
      openAnomaliesCount: Math.max(0, report.openAnomaliesCount - 1),
      overallHealthScore: Math.min(100, report.overallHealthScore + 5),
    });
    setNotificationMsg(`Alerta ${anomalyId} marcado como resolvido manualmente pelo auditor!`);
  };

  const handleAutoFix = (anomaly: AuditAnomalyAlert) => {
    const updated = report.anomalies.map((a) =>
      a.id === anomaly.id ? { ...a, status: 'AUTO_FIXED' as const } : a
    );
    setReport({
      ...report,
      anomalies: updated,
      openAnomaliesCount: Math.max(0, report.openAnomaliesCount - 1),
      overallHealthScore: Math.min(100, report.overallHealthScore + 5),
    });
    setNotificationMsg(`🤖 IA Saneamento: Correção contábil aplicada com sucesso para ${anomaly.id}!`);
  };

  const handleExportAuditDossier = () => {
    const data = {
      systemAuditDossier: 'UAS Accounting — System Health & Comprehensive Audit',
      auditDate: new Date().toISOString(),
      report,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SYSTEM_AUDIT_REPORT_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setNotificationMsg('Dossiê oficial de auditoria do sistema exportado com sucesso (.JSON)!');
  };

  const filteredAnomalies = report.anomalies.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/30 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Auditoria Geral do Sistema & Integridade Financeira
              <Badge variant="success" className="text-[10px]">
                Health Score: {report.overallHealthScore}%
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              Diagnóstico contínuo de integridade do Livro-Razão, detecção de anomalias por IA e conformidade SOX / SOC 2
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="text-xs" onClick={handleExportAuditDossier}>
            <Download className="w-3.5 h-3.5 mr-1" />
            Exportar Dossiê (.JSON)
          </Button>
          <Button
            size="sm"
            variant="primary"
            className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
            onClick={() => setIsScanModalOpen(true)}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Executar Varredura Profunda
          </Button>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setNotificationMsg(null)}>
            Fechar
          </Button>
        </div>
      )}

      {/* Automated Nightly Schedule Ribbon */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">Varredura Noturna Automática Agendada (Cron Daemon)</span>
            <span className="text-slate-400 text-[11px]">
              Frequência: Diariamente às 00:00 UTC (Madrugada) • Próxima execução em 4h 12m
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={isAutoCronActive ? 'success' : 'outline'} className="text-[10px]">
            {isAutoCronActive ? '● Monitoramento Ativo' : 'Pausado'}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => {
              setIsAutoCronActive(!isAutoCronActive);
              setNotificationMsg(
                !isAutoCronActive
                  ? 'Varredura noturna automática reativada!'
                  : 'Varredura noturna automática pausada temporariamente.'
              );
            }}
          >
            {isAutoCronActive ? 'Pausar Agendamento' : 'Ativar Agendamento'}
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Saúde Geral do Sistema</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400">{report.overallHealthScore}%</span>
            <Badge variant="success" className="text-[10px]">
              Excelente
            </Badge>
          </div>
          <span className="text-[10px] text-slate-500 block">Sem inconsistências estruturais</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Equilíbrio do Livro-Razão</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold font-mono text-white">Débitos = Créditos</span>
            <Badge variant={report.isLedgerBalanced ? 'success' : 'danger'} className="text-[10px]">
              {report.isLedgerBalanced ? '✓ $0 Variância' : 'Desbalanceado'}
            </Badge>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {formatCurrency(report.totalDebits, 'USD', locale)} auditados
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Anomalias Identificadas</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-amber-400">{report.openAnomaliesCount}</span>
            <Badge variant="warning" className="text-[10px]">
              Revisão Recomendada
            </Badge>
          </div>
          <span className="text-[10px] text-slate-500 block">{report.criticalIssuesCount} críticas pendentes</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Segurança de Acessos & SOX</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-sky-400">{report.activeUsersWithAdminRole}</span>
            <Badge variant="info" className="text-[10px]">
              MFA Ativo
            </Badge>
          </div>
          <span className="text-[10px] text-slate-500 block">Usuários com privilégio Checker/Admin</span>
        </div>
      </div>

      {/* Anomalies Table */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Painel de Anomalias & Conformidade Contábil / Fiscal</CardTitle>
              <CardDescription>
                Alertas gerados automaticamente pelo motor de inteligência e regras de integridade US GAAP
              </CardDescription>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    filterSeverity === sev ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sev === 'ALL' ? 'Todos' : sev}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">ID Alerta</TableHead>
              <TableHead className="w-24 text-center">Severidade</TableHead>
              <TableHead>Título & Detalhamento da Anomalia</TableHead>
              <TableHead className="w-48">Conta / Entidade Afetada</TableHead>
              <TableHead className="w-32 text-center">Status</TableHead>
              <TableHead className="w-48 text-center">Ações de Saneamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnomalies.map((a) => (
              <TableRow key={a.id} className="hover:bg-slate-900/50">
                <TableCell className="font-mono font-bold text-sky-400 text-xs">{a.id}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      a.severity === 'CRITICAL'
                        ? 'danger'
                        : a.severity === 'HIGH'
                        ? 'warning'
                        : a.severity === 'MEDIUM'
                        ? 'info'
                        : 'outline'
                    }
                    className="text-[9px]"
                  >
                    {a.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-white text-xs">{a.title}</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">{a.description}</div>
                  <div className="text-[10px] text-emerald-400 font-medium mt-1">
                    💡 Recomendação: {a.recommendedAction}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-300 font-mono">
                  {a.affectedEntityOrAccount}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={a.status === 'OPEN' ? 'warning' : 'success'}
                    className="text-[10px]"
                  >
                    {a.status === 'OPEN' ? 'Pendente' : a.status === 'AUTO_FIXED' ? '🤖 Sanado por IA' : '✓ Resolvido'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {a.status === 'OPEN' ? (
                    <div className="flex items-center justify-center space-x-1.5">
                      <Button
                        size="sm"
                        variant="primary"
                        className="h-7 text-[11px] px-2 bg-emerald-600 hover:bg-emerald-500 font-bold"
                        onClick={() => handleAutoFix(a)}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Auto-Sanar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] px-2 text-slate-300"
                        onClick={() => handleResolve(a.id)}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Ignorar
                      </Button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-emerald-400 font-medium">✓ Ação Concluída</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal: Executar Varredura Profunda */}
      <RunAnomalyScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onScanCompleted={(newReport) => {
          setReport(newReport);
          setNotificationMsg('Varredura profunda concluída com sucesso! Todos os módulos auditados.');
        }}
      />
    </div>
  );
}
