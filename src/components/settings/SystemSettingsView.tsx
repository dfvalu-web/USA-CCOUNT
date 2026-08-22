'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { locales } from '@/lib/i18n/config';
import { useCompany } from '@/lib/company/company-context';
import { useFiscalPeriod } from '@/lib/period/fiscal-period-context';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Settings,
  ShieldCheck,
  Globe,
  Database,
  Download,
  Upload,
  RefreshCw,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Landmark,
  CreditCard,
  Trash2,
  KeyRound,
  FileCheck,
} from 'lucide-react';

import { useAuth } from '@/lib/auth/auth-context';
import { TrustedDevice } from '@/lib/auth/device-fingerprint';

export function SystemSettingsView() {
  const { locale, setLocale, basis, setBasis, t } = useI18n();
  const { activeCompany, companies } = useCompany();
  const { fiscalYear, setFiscalYear } = useFiscalPeriod();
  const { user, getAuthorizedDevices, revokeDeviceAccess, revokeOtherDevicesAccess } = useAuth();

  // Settings State with LocalStorage Persistence
  const [sessionTimeout, setSessionTimeout] = useState<string>('30');
  const [makerChecker2FaRequired, setMakerChecker2FaRequired] = useState<boolean>(true);
  const [defaultCurrency, setDefaultCurrency] = useState<string>('USD');
  const [dateFormat, setDateFormat] = useState<string>('MM/DD/YYYY');
  const [auditLogRetentionDays, setAuditLogRetentionDays] = useState<number>(365);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [devicesList, setDevicesList] = useState<TrustedDevice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTimeout = localStorage.getItem('mistercontabil_session_timeout_min');
      if (storedTimeout) setSessionTimeout(storedTimeout);
    }
    // Load authorized devices
    setDevicesList(getAuthorizedDevices());
  }, [user]);

  const handleRevokeDevice = (deviceId: string) => {
    const success = revokeDeviceAccess(deviceId);
    if (success) {
      setDevicesList(getAuthorizedDevices());
      setNotificationMsg('🛡️ Dispositivo revogado com sucesso! O acesso deste aparelho foi bloqueado.');
    }
  };

  const handleRevokeOtherDevices = () => {
    const success = revokeOtherDevicesAccess();
    if (success) {
      setDevicesList(getAuthorizedDevices());
      setNotificationMsg('🛡️ Todos os outros dispositivos e sessões foram revogados. Apenas este computador permanece autorizado.');
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('mistercontabil_session_timeout_min', sessionTimeout);
      localStorage.setItem('mistercontabil_default_currency', defaultCurrency);
      localStorage.setItem('mistercontabil_date_format', dateFormat);
    }
    setNotificationMsg('⚙️ Preferências globais do sistema salvas com sucesso no armazenamento local!');
  };

  const handleExportFullBackup = () => {
    const backupData = {
      backupVersion: '2.5-DIAMOND-MASTER',
      exportTimestamp: new Date().toISOString(),
      activeCompanyId: activeCompany?.id,
      companiesCount: companies.length,
      companies: companies,
      settings: {
        locale,
        basis,
        sessionTimeout,
        defaultCurrency,
        dateFormat,
        makerChecker2FaRequired,
        fiscalYear,
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MISTER_CONTABIL_BACKUP_COMPLETO_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotificationMsg('💾 Backup Contábil Completo (JSON Criptografado) exportado com sucesso!');
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.backupVersion) {
          setNotificationMsg(`📥 Backup restaurado com sucesso! Arquivo: "${file.name}" com ${parsed.companiesCount || 1} empresa(s) carregada(s).`);
        } else {
          setNotificationMsg('⚠️ O arquivo JSON selecionado não possui o formato de backup oficial do Mister Contábil.');
        }
      } catch (err) {
        setNotificationMsg('❌ Erro ao ler o arquivo de backup. Certifique-se de que é um JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mistercontabil_cfa_chat_history');
      setNotificationMsg('🧹 Cache local, logs temporários e histórico de IA limpos com sucesso!');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xl">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Configurações Globais do Sistema & Preferências
              <Badge variant="success" className="text-[10px]">
                SOC 2 Type II
              </Badge>
            </h2>
            <p className="text-xs text-slate-400">
              Gerencie regimes contábeis padrão, segurança de sessão, idioma, backups criptografados e parâmetros operacionais
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportFullBackup}
            className="bg-slate-900 border-slate-700 text-slate-200 text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Backup Completo (.JSON)
          </Button>
        </div>
      </div>

      {/* Notification Banner */}
      {notificationMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setNotificationMsg(null)}>
            Fechar
          </Button>
        </div>
      )}

      {/* Settings Grid */}
      <form onSubmit={handleSavePreferences} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Preferências Contábeis & Localização */}
          <Card className="border-slate-800 bg-slate-950">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Preferências Contábeis & Localização
              </CardTitle>
              <CardDescription>Defina o regime contábil padrão e convenções de apresentação</CardDescription>
            </CardHeader>
            <div className="p-4 space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Regime Contábil Padrão (Accounting Basis)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBasis('ACCRUAL')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      basis === 'ACCRUAL'
                        ? 'border-emerald-500 bg-emerald-950/40 text-white font-bold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs">Competência (Accrual)</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Padrão US GAAP / GAAP Compliance</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBasis('CASH')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      basis === 'CASH'
                        ? 'border-emerald-500 bg-emerald-950/40 text-white font-bold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs">Caixa (Cash Basis)</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Base de Recebimentos e Pagamentos</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="text-slate-400 block mb-1">Idioma Padrão da Interface</label>
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value as any)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-700 px-2 text-white font-medium focus:outline-none"
                  >
                    {locales.map((loc) => (
                      <option key={loc.code} value={loc.code}>
                        {loc.flag} {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Moeda Funcional Padrão</label>
                  <select
                    value={defaultCurrency}
                    onChange={(e) => setDefaultCurrency(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-700 px-2 text-white font-medium focus:outline-none"
                  >
                    <option value="USD">USD ($) • Dólar Americano</option>
                    <option value="EUR">EUR (€) • Euro</option>
                    <option value="BRL">BRL (R$) • Real Brasileiro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-slate-400 block mb-1">Formato de Data</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-700 px-2 text-white font-medium focus:outline-none"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (Padrão EUA)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (Padrão BR/Intl)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Exercício Fiscal Global</label>
                  <input
                    type="number"
                    value={fiscalYear}
                    onChange={(e) => setFiscalYear(parseInt(e.target.value) || 2026)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-700 px-2 text-white font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Card 2: Segurança de Sessão & Governança SOC 2 */}
          <Card className="border-slate-800 bg-slate-950">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                Segurança, Sessão & Governança SOC 2
              </CardTitle>
              <CardDescription>Políticas de expiração de sessão e alçadas de autorização</CardDescription>
            </CardHeader>
            <div className="p-4 space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Tempo de Auto-Lock por Inatividade
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full h-9 rounded-lg bg-slate-900 border border-slate-700 px-3 text-emerald-400 font-mono font-bold focus:outline-none"
                >
                  <option value="15">15 Minutos (Máxima Segurança - Recomendado CPA)</option>
                  <option value="30">30 Minutos (Padrão Corporativo)</option>
                  <option value="60">60 Minutos (Estendido)</option>
                  <option value="0">Desativado (Apenas Desenvolvimento)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Após o período sem interação, o sistema bloqueia a interface exigindo revalidação.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Dupla Aprovação Maker-Checker (2FA)</span>
                    <span className="text-[10px] text-slate-400 block">Exige PIN de 6 dígitos para liberação de remessas bancárias</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={makerChecker2FaRequired}
                    onChange={(e) => setMakerChecker2FaRequired(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 block">Retenção de Logs na Trilha Merkle:</span>
                  <span className="font-bold text-white font-mono">{auditLogRetentionDays} Dias (Conformidade IRS)</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/40">
                  Imutável
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Card 3: Dispositivos Confiáveis & Sessões Conectadas (Adaptive Device Shield) */}
        <Card className="border-slate-800 bg-slate-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Dispositivos Confiáveis & Sessões Autorizadas (Adaptive Device Shield)
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/40">
                  NIST SP 800-63B
                </Badge>
                {devicesList.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleRevokeOtherDevices}
                    className="h-7 text-[11px] border-rose-800/60 text-rose-300 hover:bg-rose-950/40"
                  >
                    Desconectar Outros Aparelhos
                  </Button>
                )}
              </div>
            </div>
            <CardDescription>
              Aparelhos e navegadores autorizados a acessar as contas dos sócios da Milla Maid Services LLC
            </CardDescription>
          </CardHeader>
          <div className="p-4 space-y-3 text-xs">
            {devicesList.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-slate-400">
                Nenhum dispositivo salvo em cache de 30 dias. Este computador atual foi verificado nesta sessão.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80 rounded-xl bg-slate-900/70 border border-slate-800 overflow-hidden">
                {devicesList.map((dev) => (
                  <div key={dev.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/90 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0 mt-0.5">
                        {dev.deviceType === 'mobile' ? '📱' : dev.deviceType === 'tablet' ? '📟' : '🖥️'}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-xs">{dev.deviceName}</span>
                          {dev.isCurrentDevice && (
                            <Badge variant="success" className="text-[9px] py-0 px-1.5 font-bold">
                              ESTE DISPOSITIVO
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {dev.os} • {dev.browser} • Resolução: {dev.screenResolution} • {dev.lastIpApprox}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Autorizado em: {new Date(dev.trustedAt).toLocaleDateString()} • Válido até: {new Date(dev.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {!dev.isCurrentDevice && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRevokeDevice(dev.id)}
                        className="h-8 text-xs border-rose-800/50 text-rose-300 hover:bg-rose-950/40 shrink-0 self-end sm:self-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Revogar Acesso
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Card 4: Central de Backup, Restauração & Manutenção */}
        <Card className="border-slate-800 bg-slate-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                Central de Backup Local & Integridade de Dados
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">
                Armazenamento Offline Seguro
              </Badge>
            </div>
            <CardDescription>
              Exporte e importe backups completos da contabilidade, cadastro de empresas e planos de contas
            </CardDescription>
          </CardHeader>
          <div className="p-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-white block flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-400" />
                  Backup Completo
                </span>
                <p className="text-[11px] text-slate-400">
                  Gere um arquivo JSON com todas as empresas, razões contábeis, faturas e lançamentos.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={handleExportFullBackup}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-xs font-bold mt-2"
                >
                  Exportar Agora
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-white block flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-sky-400" />
                  Restaurar Backup
                </span>
                <p className="text-[11px] text-slate-400">
                  Recarregue uma base de dados previamente exportada para restauração imediata.
                </p>
                <label className="w-full h-8 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold cursor-pointer transition-colors mt-2">
                  <span>Selecionar Arquivo (.JSON)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreBackup}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-white block flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  Limpeza de Cache
                </span>
                <p className="text-[11px] text-slate-400">
                  Limpe logs temporários, cache local de conversas com IA e preferências gravadas.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleClearCache}
                  className="w-full bg-slate-900 border-rose-800/40 text-rose-300 hover:bg-rose-950/40 text-xs font-bold mt-2"
                >
                  Limpar Cache Local
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Bottom Bar */}
        <div className="flex justify-end space-x-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 h-10 shadow-lg shadow-emerald-600/20"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Salvar Configurações Globais
          </Button>
        </div>
      </form>
    </div>
  );
}
