'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { SystemAuditEngine, SystemAuditReport } from '@/lib/audit/system-audit-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';

interface RunAnomalyScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanCompleted: (report: SystemAuditReport) => void;
}

export function RunAnomalyScanModal({
  isOpen,
  onClose,
  onScanCompleted,
}: RunAnomalyScanModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  if (!isOpen) return null;

  const handleStartScan = () => {
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 500);
    setTimeout(() => setScanStep(3), 1000);
    setTimeout(() => setScanStep(4), 1500);

    setTimeout(() => {
      const report = SystemAuditEngine.runDeepDiagnosticScan();
      setIsScanning(false);
      onScanCompleted(report);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Varredura Profunda de Auditoria & Integridade</h3>
              <p className="text-[10px] text-slate-400">Inspeção Completa de Livro-Razão, Transações, Fisco e Segurança</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {!isScanning ? (
            <div className="space-y-4">
              <p className="text-slate-300">
                A varredura profunda executará mais de 40 testes estatísticos e contábeis automatizados em toda a base operacional do UAS Accounting:
              </p>

              <div className="space-y-2">
                {[
                  '1. Validação Matemática de Balanço (Debits == Credits em todas as contas)',
                  '2. Detecção de Lançamentos Duplicados e Desvios de Fatura (>3 sigma)',
                  '3. Conformidade de Retenções Fiscais (IRS Form 1065 / 1120-S / Sales Tax Nexus)',
                  '4. Auditoria de Segregação de Funções SOX & Dual Control (Maker-Checker)',
                  '5. Validação da Árvore Criptográfica Merkle Root (SOC 2 Type II)',
                ].map((item, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <Button size="sm" variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-500 font-bold" onClick={handleStartScan}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Iniciar Auditoria Profunda
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
              <div>
                <h4 className="font-bold text-white text-sm">Executando Diagnóstico do Sistema...</h4>
                <p className="text-slate-400 text-xs mt-1">
                  {scanStep === 1 && 'Auditando equilíbrio de débitos e créditos no Livro-Razão...'}
                  {scanStep === 2 && 'Executando motor de inteligência artificial para detecção de anomalias...'}
                  {scanStep === 3 && 'Verificando nexuses fiscais estaduais e obrigações do IRS...'}
                  {scanStep === 4 && 'Consolidando Relatório de Saúde do Sistema (Health Score)...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
