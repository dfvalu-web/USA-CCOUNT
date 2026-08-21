'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import { Form1099NecRecord } from '@/lib/tax/year-end-tax-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  FileText,
  Building2,
  CheckCircle2,
  Printer,
  Download,
  ShieldCheck,
} from 'lucide-react';

interface Form1099NecDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: Form1099NecRecord | null;
}

export function Form1099NecDetailModal({
  isOpen,
  onClose,
  record,
}: Form1099NecDetailModalProps) {
  const { locale } = useI18n();

  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                IRS Form 1099-NEC (Nonemployee Compensation)
                <Badge variant="warning" className="text-[10px]">
                  Ano Base {record.taxYear}
                </Badge>
              </h3>
              <p className="text-[10px] text-slate-400">Declaração Oficial de Pagamento a Prestadores Autônomos</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Visual Reproduction of IRS Form 1099-NEC */}
        <div className="p-6 space-y-4 text-xs font-mono">
          <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900/60 p-4 space-y-4">
            {/* Top Payer & Recipient Row */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-bold">PAYER'S name & address:</span>
                <div className="font-bold text-white">{record.payerName}</div>
                <div className="text-slate-300 text-[11px]">EIN: {record.payerEin}</div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-bold">RECIPIENT'S name & TIN:</span>
                <div className="font-bold text-sky-400">{record.recipientName}</div>
                <div className="text-slate-300 text-[11px]">TIN/SSN: {record.recipientTaxId}</div>
                <div className="text-slate-400 text-[10px]">{record.recipientAddress}</div>
              </div>
            </div>

            {/* Boxes Grid */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Box 1: Nonemployee comp.</span>
                <span className="text-lg font-bold text-emerald-400 block mt-1">
                  {formatCurrency(record.box1NonemployeeCompensation, 'USD', locale)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Box 4: Fed income tax withheld</span>
                <span className="text-lg font-bold text-slate-300 block mt-1">
                  {formatCurrency(record.box4FederalTaxWithheld, 'USD', locale)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Box 5: State tax withheld</span>
                <span className="text-lg font-bold text-slate-300 block mt-1">
                  {formatCurrency(record.box5StateTaxWithheld, 'USD', locale)}
                </span>
                <span className="text-[9px] text-slate-500 block">Estado: {record.state}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Formatado para transmissão eletrônica ao IRS FIRE e envio ao contratado.</span>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button size="sm" variant="primary" className="bg-amber-600 hover:bg-amber-500 font-bold text-xs" onClick={onClose}>
              <Printer className="w-3.5 h-3.5 mr-1" />
              Imprimir Copia B (Prestador)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
