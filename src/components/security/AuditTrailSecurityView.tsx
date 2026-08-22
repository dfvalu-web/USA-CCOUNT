'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  CryptographicAuditTrailEngine,
  AuditLogBlock,
} from '@/lib/security/audit-trail-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Lock,
  Link2,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Plus,
  Bug,
  RefreshCw,
  Download,
  FileCheck,
  ShieldAlert,
  Smartphone,
  Laptop,
  Monitor,
  Trash2,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export function AuditTrailSecurityView() {
  const { locale, t } = useI18n();
  const { user, getAuthorizedDevices, revokeDeviceAccess, revokeOtherDevicesAccess } = useAuth();
  const [trustedDevicesList, setTrustedDevicesList] = useState(() => getAuthorizedDevices());

  const handleRevokeSingle = (deviceId: string) => {
    revokeDeviceAccess(deviceId);
    setTrustedDevicesList(getAuthorizedDevices());
    setNotificationMsg('Dispositivo revogado com sucesso. O aparelho precisará de novo PIN para entrar.');
  };

  const handleRevokeAllOthers = () => {
    revokeOtherDevicesAccess();
    setTrustedDevicesList(getAuthorizedDevices());
    setNotificationMsg('🚨 Acesso de todos os outros dispositivos revogado com sucesso! Apenas esta máquina permanece autorizada.');
  };

  const INITIAL_BLOCKS: AuditLogBlock[] = [
    CryptographicAuditTrailEngine.createAuditBlock(
      0,
      '00000000000000000000000000000000',
      'JOURNAL_ENTRY_POSTED',
      'user-cfo-01',
      'Victoria Sterling (CFO)',
      '198.51.100.42',
      'JE-2026-0001',
      'Aporte Inicial de Capital dos Sócios ($325,000.00 USD)',
      '2026-01-01T12:00:00Z'
    ),
    CryptographicAuditTrailEngine.createAuditBlock(
      1,
      'sha256_34e10b429188a102',
      'OCR_RECEIPT_PROCESSED',
      'ai-ocr-agent',
      'Multimodal AI OCR Vision',
      '10.0.4.12',
      'doc-aws-948',
      'Classificação Automática de Fatura AWS Cloud ($1,420.50) para Conta 5030',
      '2026-08-15T09:30:00Z'
    ),
    CryptographicAuditTrailEngine.createAuditBlock(
      2,
      'sha256_1189ac024d98a101',
      'DISBURSEMENT_APPROVED',
      'user-cfo-01',
      'Victoria Sterling (CFO)',
      '198.51.100.42',
      'DISB-881',
      'Aprovação Dual Control Maker-Checker para Prestador ($4,800.00)',
      '2026-08-20T14:15:00Z'
    ),
    CryptographicAuditTrailEngine.createAuditBlock(
      3,
      'sha256_7891fa1109bc4412',
      'CONTRACT_SIGNED',
      'user-md-04',
      'Marcus Vance (Managing Director)',
      '198.51.100.88',
      'SOW-2026-090',
      'Assinatura Digital de Contrato de Retainer Mensal ($120,000.00)',
      '2026-08-20T15:20:00Z'
    ),
  ];

  const [auditBlocks, setAuditBlocks] = useState<AuditLogBlock[]>(INITIAL_BLOCKS);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Live Verification
  const verification = CryptographicAuditTrailEngine.verifyChainIntegrity(auditBlocks);

  const handleAppendEvent = () => {
    const lastBlock = auditBlocks[auditBlocks.length - 1];
    const newIndex = auditBlocks.length;
    const prevHash = lastBlock.currentHash;

    const eventTypes: AuditLogBlock['eventType'][] = [
      'JOURNAL_ENTRY_POSTED',
      'DISBURSEMENT_APPROVED',
      'CONTRACT_SIGNED',
      'FX_REVALUATION',
      'OCR_RECEIPT_PROCESSED',
    ];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    const newBlock = CryptographicAuditTrailEngine.createAuditBlock(
      newIndex,
      prevHash,
      randomType,
      'user-staff-01',
      'David Silva (Staff Accountant)',
      '198.51.100.42',
      `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      `Registro Contábil Auditado em Bloco #${newIndex} — Operação Registrada via Merkle Log`
    );

    setAuditBlocks([...auditBlocks, newBlock]);
    setNotificationMsg(
      `Novo bloco #${newIndex} encadeado com sucesso na Merkle Tree! Hash gerado: ${newBlock.currentHash}`
    );
  };

  const handleSimulateTamper = () => {
    if (auditBlocks.length < 2) return;

    // Tamper Block 1 payload without recalculating its hash
    const tampered = auditBlocks.map((b, idx) => {
      if (idx === 1) {
        return {
          ...b,
          payloadSummary: '*** TENTATIVA DE FRAUDE: Modificação não autorizada de valor para $999,999.00 ***',
        };
      }
      return b;
    });

    setAuditBlocks(tampered);
    setNotificationMsg(
      '⚠️ Teste de Violação executado! O conteúdo do Bloco 1 foi adulterado para demonstrar a detecção em tempo real da Merkle Tree.'
    );
  };

  const handleRestoreIntegrity = () => {
    setAuditBlocks(INITIAL_BLOCKS);
    setNotificationMsg('✅ Integridade da cadeia criptográfica restaurada ao estado original 100% autêntico!');
  };

  const handleExportAuditReport = () => {
    const reportData = {
      auditStandard: 'SOC 2 Type II / ISO 27001 / AICPA Trust Services Criteria',
      verificationDate: new Date().toISOString(),
      merkleRootHash: verification.merkleRootHash,
      totalBlocksVerified: verification.totalBlocksVerified,
      isIntegrityIntact: verification.isIntegrityIntact,
      blocks: auditBlocks,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOC2_MERKLE_AUDIT_TRAIL_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setNotificationMsg('Dossiê Criptográfico SOC 2 exportado com sucesso para auditores independentes!');
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-500/20 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Trilha de Auditoria Criptográfica Imutável (SOC 1 / SOC 2 Type II)</CardTitle>
                <CardDescription>
                  Livro-Razão Encadeado por Hashes SHA-256 Merkle Tree • Detecção Matemática de Fraudes e Adulterações
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={handleExportAuditReport}
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Exportar Pacote SOC 2 (.JSON)
              </Button>
              <Button
                size="sm"
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
                onClick={handleAppendEvent}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                + Registrar Evento no Merkle Log
              </Button>
            </div>
          </div>
        </CardHeader>

        {notificationMsg && (
          <div
            className={`mx-6 mb-4 p-3.5 rounded-xl border text-xs flex items-center justify-between ${
              verification.isIntegrityIntact
                ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300'
                : 'bg-rose-950/70 border-rose-600 text-rose-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {verification.isIntegrityIntact ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{notificationMsg}</span>
            </div>
            <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setNotificationMsg(null)}>
              Fechar
            </Button>
          </div>
        )}

        <div className="px-6 space-y-4">
          {/* Verification Status Banner */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              verification.isIntegrityIntact
                ? 'bg-slate-900 border-emerald-500/40'
                : 'bg-rose-950/40 border-rose-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  verification.isIntegrityIntact
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {verification.isIntegrityIntact ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : (
                  <ShieldAlert className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  {verification.isIntegrityIntact ? (
                    <>
                      <span>Integridade Criptográfica do Livro-Razão Intacta (0 Violações)</span>
                      <Badge variant="success" className="text-[10px]">
                        100% Conforme
                      </Badge>
                    </>
                  ) : (
                    <>
                      <span className="text-rose-400">ALERTA DE SEGURANÇA: Quebra de Integridade no Bloco #{verification.tamperedBlockIndex}</span>
                      <Badge variant="danger" className="text-[10px]">
                        VIOLAÇÃO DETECTADA
                      </Badge>
                    </>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Merkle Root Hash: <span className="text-sky-400 font-bold">{verification.merkleRootHash}</span> • Total de Blocos Verificados: {verification.totalBlocksVerified}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {verification.isIntegrityIntact ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs text-rose-400 border-rose-800/60 hover:bg-rose-950/30"
                  onClick={handleSimulateTamper}
                >
                  <Bug className="w-3.5 h-3.5 mr-1" />
                  Testar Detecção de Fraude
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
                  onClick={handleRestoreIntegrity}
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Restaurar Cadeia Original
                </Button>
              )}
            </div>
          </div>

          {/* Audit Chain Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Bloco #</TableHead>
                <TableHead className="w-28">Tipo de Evento</TableHead>
                <TableHead>Operação & Recurso</TableHead>
                <TableHead className="w-40">Autor / IP</TableHead>
                <TableHead className="w-48 font-mono">Hash Anterior</TableHead>
                <TableHead className="w-48 font-mono">Hash do Bloco (SHA-256)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditBlocks.map((b) => (
                <TableRow
                  key={b.blockIndex}
                  className={`hover:bg-slate-900/50 ${
                    !verification.isIntegrityIntact && verification.tamperedBlockIndex === b.blockIndex
                      ? 'bg-rose-950/30 border-l-4 border-rose-500'
                      : ''
                  }`}
                >
                  <TableCell className="font-mono font-bold text-emerald-400 text-xs">
                    #{b.blockIndex}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[9px]">
                      {b.eventType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-white text-xs">{b.payloadSummary}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Ref: {b.resourceId} • {formatDate(b.timestamp, locale)}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="text-slate-200">{b.actorName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">IP: {b.actorIp}</div>
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-slate-400 truncate max-w-[140px]">
                    {b.previousHash}
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-emerald-400 font-bold truncate max-w-[140px]">
                    {b.currentHash}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dispositivos Confiáveis & Sessões Ativas (NIST SP 800-63B / Adaptive Shield) */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Dispositivos Confiáveis & Sessões Ativas (NIST SP 800-63B)</CardTitle>
                <CardDescription>
                  Aparelhos homologados para acesso contábil sem necessidade de re-autenticação OTP por 30 dias
                </CardDescription>
              </div>
            </div>

            {trustedDevicesList.length > 1 && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-rose-800/80 text-rose-300 hover:bg-rose-950/60 font-bold"
                onClick={handleRevokeAllOthers}
              >
                <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                🚨 Revogar Acesso de Todos os Outros Dispositivos
              </Button>
            )}
          </div>
        </CardHeader>

        <div className="p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trustedDevicesList.map((dev) => (
              <div
                key={dev.id}
                className={`p-4 rounded-2xl border transition-all ${
                  dev.isCurrentDevice
                    ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                      {dev.deviceType === 'mobile' ? (
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Monitor className="w-4 h-4 text-sky-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{dev.deviceName}</span>
                        {dev.isCurrentDevice && (
                          <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                            Ativo Agora
                          </Badge>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {dev.os} • {dev.browser}
                      </div>
                    </div>
                  </div>

                  {!dev.isCurrentDevice && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
                      onClick={() => handleRevokeSingle(dev.id)}
                      title="Revogar este aparelho"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                  <div>
                    <span className="text-slate-500 block">Autorizado em:</span>
                    <span>{new Date(dev.trustedAt).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Válido até:</span>
                    <span className="text-emerald-400">{new Date(dev.expiresAt).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US')}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">Localização / Hash:</span>
                    <span className="text-slate-300 truncate block">{dev.lastIpApprox} • {dev.fingerprintHash.substring(0, 14)}...</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Proteção de Zero-Trust ativada: qualquer novo aparelho que tentar acessar com sua senha será desafiado pelo <b>Step-Up 2FA</b>.
              </span>
            </div>
            <span className="font-mono text-emerald-400 font-bold text-[11px]">NIST SP 800-63B OK</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
