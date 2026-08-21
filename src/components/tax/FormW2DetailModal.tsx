'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import { FormW2Record } from '@/lib/tax/year-end-tax-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
} from 'lucide-react';

interface FormW2DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: FormW2Record | null;
}

export function FormW2DetailModal({
  isOpen,
  onClose,
  record,
}: FormW2DetailModalProps) {
  const { locale } = useI18n();

  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                IRS Form W-2 (Wage and Tax Statement)
                <Badge variant="info" className="text-[10px]">
                  Ano Base {record.taxYear}
                </Badge>
              </h3>
              <p className="text-[10px] text-slate-400">Declaração Anual de Salários e Retenções W-2 para o SSA & IRS</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Visual Reproduction of Form W-2 */}
        <div className="p-6 space-y-4 text-xs font-mono">
          <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900/60 p-4 space-y-4">
            {/* Employee & Employer */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-bold">Employer:</span>
                <div className="font-bold text-white">{record.employerName}</div>
                <div className="text-slate-300 text-[11px]">EIN: {record.employerEin}</div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-bold">Employee:</span>
                <div className="font-bold text-sky-400">{record.employeeName}</div>
                <div className="text-slate-300 text-[11px]">SSN: {record.ssn}</div>
                <div className="text-slate-400 text-[10px]">{record.address}</div>
              </div>
            </div>

            {/* Boxes 1 to 6 Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Box 1: Wages, tips, other comp.</span>
                <span className="text-base font-bold text-emerald-400 block mt-0.5">
                  {formatCurrency(record.box1WagesTips, 'USD', locale)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Box 2: Federal income tax withheld</span>
                <span className="text-base font-bold text-slate-200 block mt-0.5">
                  {formatCurrency(record.box2FederalIncomeTaxWithheld, 'USD', locale)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Box 3: Social security wages</span>
                <span className="text-base font-bold text-white block mt-0.5">
                  {formatCurrency(record.box3SocialSecurityWages, 'USD', locale)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Box 4: Social security tax withheld</span>
                <span className="text-base font-bold text-slate-300 block mt-0.5">
                  {formatCurrency(record.box4SocialSecurityTaxWithheld, 'USD', locale)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Box 5: Medicare wages and tips</span>
                <span className="text-base font-bold text-white block mt-0.5">
                  {formatCurrency(record.box5MedicareWages, 'USD', locale)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Box 6: Medicare tax withheld</span>
                <span className="text-base font-bold text-slate-300 block mt-0.5">
                  {formatCurrency(record.box6MedicareTaxWithheld, 'USD', locale)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Formatado para transmissão eletrônica à SSA (Social Security Administration).</span>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button size="sm" variant="primary" className="bg-sky-600 hover:bg-sky-500 font-bold text-xs" onClick={onClose}>
              <Printer className="w-3.5 h-3.5 mr-1" />
              Imprimir Copia B (Colaborador)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
