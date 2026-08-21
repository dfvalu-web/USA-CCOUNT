'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  ImportedStatementPackage,
  SmartAccountMapping,
} from '@/lib/migration/software-migration-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import {
  X,
  ArrowRightLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

interface AccountMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: ImportedStatementPackage | null;
  onSaveMappings: (updatedPackage: ImportedStatementPackage) => void;
  onConsolidateToLedger: (pkg: ImportedStatementPackage) => void;
}

export function AccountMappingModal({
  isOpen,
  onClose,
  pkg,
  onSaveMappings,
  onConsolidateToLedger,
}: AccountMappingModalProps) {
  const { locale } = useI18n();

  const [mappings, setMappings] = useState<SmartAccountMapping[]>(pkg?.mappings || []);

  if (!isOpen || !pkg) return null;

  const targetAccountsList = [
    { code: '1010', name: 'Operating Checking Account (Cash)', type: 'ASSET' },
    { code: '1020', name: 'Treasury & Reserve Cash', type: 'ASSET' },
    { code: '1100', name: 'Accounts Receivable (A/R)', type: 'ASSET' },
    { code: '1200', name: 'Inventory & Supplies', type: 'ASSET' },
    { code: '1500', name: 'Equipment & Computers (Fixed Assets)', type: 'ASSET' },
    { code: '1510', name: 'Fleet Vehicles (Fixed Assets)', type: 'ASSET' },
    { code: '1600', name: 'Accumulated Depreciation', type: 'ASSET' },
    { code: '2010', name: 'Accounts Payable (A/P)', type: 'LIABILITY' },
    { code: '2020', name: 'Corporate Credit Card Payable', type: 'LIABILITY' },
    { code: '2100', name: 'Payroll Tax Withholdings Payable', type: 'LIABILITY' },
    { code: '2110', name: 'State Sales Tax Payable', type: 'LIABILITY' },
    { code: '2200', name: 'Deferred Retainer Revenue (ASC 606)', type: 'LIABILITY' },
    { code: '2500', name: 'Long Term Bank Loan Payable', type: 'LIABILITY' },
    { code: '3000', name: 'Retained Earnings', type: 'EQUITY' },
    { code: '3010', name: 'Common Stock & Capital Stock', type: 'EQUITY' },
    { code: '3020', name: 'Members Capital Account (IRC 704b)', type: 'EQUITY' },
    { code: '3030', name: 'Partner Distributions / Draws', type: 'EQUITY' },
    { code: '4010', name: 'Subscription & SaaS Revenue', type: 'REVENUE' },
    { code: '4020', name: 'Commercial Cleaning & Service Revenue', type: 'REVENUE' },
    { code: '4030', name: 'Engineering & Advisory Revenue', type: 'REVENUE' },
    { code: '5010', name: 'Direct Labor Salaries (W-2 Wages)', type: 'EXPENSE' },
    { code: '5020', name: '1099 Independent Contractor Fees', type: 'EXPENSE' },
    { code: '5030', name: 'Cleaning Chemicals & Field Supplies', type: 'EXPENSE' },
    { code: '6010', name: 'Cloud Infrastructure & SaaS Software', type: 'EXPENSE' },
    { code: '6020', name: 'Facility Lease & Office Rent', type: 'EXPENSE' },
    { code: '6030', name: 'Commercial General Liability Insurance', type: 'EXPENSE' },
    { code: '6040', name: 'Sales & Digital Marketing Expenses', type: 'EXPENSE' },
    { code: '6050', name: 'Legal, CPA & Professional Advisory Fees', type: 'EXPENSE' },
    { code: '6060', name: 'Depreciation Expense', type: 'EXPENSE' },
  ];

  const handleTargetChange = (sourceCode: string, newTargetCode: string) => {
    const selectedTarget = targetAccountsList.find((t) => t.code === newTargetCode);
    if (!selectedTarget) return;

    const updated = mappings.map((m) => {
      if (m.sourceAccountCode === sourceCode) {
        return {
          ...m,
          targetAccountCode: selectedTarget.code,
          targetAccountName: selectedTarget.name,
          targetAccountType: selectedTarget.type as any,
          confidenceScore: 100,
          status: 'MANUALLY_CONFIRMED' as const,
        };
      }
      return m;
    });

    setMappings(updated);
  };

  const handleSave = () => {
    const updatedPkg: ImportedStatementPackage = {
      ...pkg,
      mappings,
      status: 'READY_TO_POST',
    };
    onSaveMappings(updatedPkg);
    onClose();
  };

  const handleConsolidate = () => {
    const updatedPkg: ImportedStatementPackage = {
      ...pkg,
      mappings,
      status: 'POSTED_TO_LEDGER',
    };
    onConsolidateToLedger(updatedPkg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Mapeamento Inteligente De-Para ({pkg.companyName})
                <Badge variant="outline" className="text-[10px]">
                  Origem: {pkg.sourceSoftware.replace(/_/g, ' ')}
                </Badge>
              </h3>
              <p className="text-[10px] text-slate-400">
                Demonstrativo: {pkg.statementType.replace(/_/g, ' ')} • Total Débitos: {formatCurrency(pkg.totalDebits, 'USD', locale)} • Total Créditos: {formatCurrency(pkg.totalCredits, 'USD', locale)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Bar */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            {pkg.isBalanced ? (
              <div className="flex items-center text-emerald-400 space-x-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Balanço Equilibrado: Débitos = Créditos (Zero Variância)</span>
              </div>
            ) : (
              <div className="flex items-center text-rose-400 space-x-1 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Atenção: Desbalanceamento de {formatCurrency(pkg.varianceAmount, 'USD', locale)} no arquivo de origem!</span>
              </div>
            )}
          </div>

          <Badge variant="success" className="text-[10px]">
            {mappings.filter((m) => m.confidenceScore >= 90).length} de {mappings.length} Contas Mapeadas com Alta Precisão
          </Badge>
        </div>

        {/* Mappings Table */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Conta de Origem ({pkg.sourceSoftware.replace(/_/g, ' ')})</TableHead>
                <TableHead className="w-8 text-center">→</TableHead>
                <TableHead>Conta de Destino no UAS Accounting (US GAAP)</TableHead>
                <TableHead className="w-28 text-center">Tipo</TableHead>
                <TableHead className="w-28 text-center">Confiança IA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((m) => (
                <TableRow key={m.sourceAccountCode} className="hover:bg-slate-900/50">
                  <TableCell>
                    <div className="font-mono text-sky-400 text-xs font-bold">{m.sourceAccountCode}</div>
                    <div className="text-white text-xs font-medium">{m.sourceAccountName}</div>
                  </TableCell>
                  <TableCell className="text-center text-slate-500 font-bold">→</TableCell>
                  <TableCell>
                    <select
                      value={m.targetAccountCode}
                      onChange={(e) => handleTargetChange(m.sourceAccountCode, e.target.value)}
                      className="w-full h-8 rounded bg-slate-900 border border-slate-700 px-2 text-white text-xs font-medium focus:border-emerald-500"
                    >
                      {targetAccountsList.map((target) => (
                        <option key={target.code} value={target.code}>
                          {target.code} — {target.name} ({target.type})
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-[9px]">
                      {m.targetAccountType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={m.confidenceScore >= 95 ? 'success' : m.confidenceScore >= 80 ? 'info' : 'warning'}
                      className="text-[9px] font-mono"
                    >
                      {m.confidenceScore}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Validação de partidas dobradas e integridade do livro-razão</span>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button size="sm" variant="outline" onClick={handleSave}>
              Salvar Mapeamentos
            </Button>
            <Button
              size="sm"
              variant="primary"
              className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
              onClick={handleConsolidate}
            >
              <FileCheck className="w-4 h-4 mr-1.5" />
              Consolidar & Importar no Livro-Razão
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
