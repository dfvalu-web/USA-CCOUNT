'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  SandboxScenario,
  SandboxDiffItem,
  CompanySandboxEngine,
} from '@/lib/sandbox/company-sandbox-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import {
  X,
  ArrowRightLeft,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  FlaskConical,
  Upload,
} from 'lucide-react';

interface SandboxDiffReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: SandboxScenario | null;
  onPromoteToProd: (scenario: SandboxScenario) => void;
}

export function SandboxDiffReviewModal({
  isOpen,
  onClose,
  scenario,
  onPromoteToProd,
}: SandboxDiffReviewModalProps) {
  const { locale } = useI18n();
  const [isPromoting, setIsPromoting] = useState(false);

  if (!isOpen || !scenario) return null;

  const diffs: SandboxDiffItem[] = CompanySandboxEngine.calculateDiff(scenario);

  const handlePromote = () => {
    setIsPromoting(true);
    setTimeout(() => {
      setIsPromoting(false);
      onPromoteToProd(scenario);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Revisão de Diferenças (Diff): Produção vs Sandbox
                <Badge variant="outline" className="text-[10px]">
                  {scenario.name}
                </Badge>
              </h3>
              <p className="text-[10px] text-slate-400">
                Empresa: {scenario.sourceCompanyName} • {scenario.adjustingEntriesCount} Lançamentos Ajustadores Simulados
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diff Table */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Conta Contábil US GAAP</TableHead>
                <TableHead className="text-right w-32">Saldo em Produção</TableHead>
                <TableHead className="text-right w-32">Saldo no Sandbox</TableHead>
                <TableHead className="text-right w-28">Variação ($ / %)</TableHead>
                <TableHead>Justificativa do Ajuste / Simulação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diffs.map((d) => (
                <TableRow key={d.accountCode} className="hover:bg-slate-900/50">
                  <TableCell>
                    <div className="font-mono text-sky-400 text-xs font-bold">{d.accountCode}</div>
                    <div className="text-white text-xs font-medium">{d.accountName}</div>
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-slate-300">
                    {formatCurrency(d.prodBalance, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums font-bold text-emerald-400">
                    {formatCurrency(d.sandboxBalance, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-xs">
                    {d.varianceAmount !== 0 ? (
                      <div>
                        <span className={d.varianceAmount > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {d.varianceAmount > 0 ? '+' : ''}
                          {formatCurrency(d.varianceAmount, 'USD', locale)}
                        </span>
                        <div className="text-[10px] text-slate-500">({d.variancePercent > 0 ? '+' : ''}{d.variancePercent}%)</div>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-normal">$0.00</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-slate-300">{d.explanation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Simulation Notes */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white block">Notas de Auditoria do Cenário:</span>
            <div className="space-y-1 text-slate-300 text-xs">
              {scenario.notes.map((note, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>A promoção registrará um bloco criptográfico imutável na Trilha de Auditoria SOC 2.</span>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" onClick={onClose}>
              Fechar
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={isPromoting}
              className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
              onClick={handlePromote}
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              {isPromoting ? 'Promovendo...' : 'Aprovar & Promover para a Base de Produção'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
