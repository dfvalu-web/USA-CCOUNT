'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  OfficerMemberProfile,
  CompanyTaxProfile,
  CompanyProfileEngine,
} from '@/lib/company/company-profile-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import {
  X,
  Printer,
  Download,
  FileCheck,
  Building2,
  Users,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface PartnerK1ModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: OfficerMemberProfile | null;
  company: CompanyTaxProfile;
}

export function PartnerK1Modal({ isOpen, onClose, partner, company }: PartnerK1ModalProps) {
  const { locale } = useI18n();

  if (!isOpen || !partner) return null;

  const estimatedCompanyNetIncome = 245000; // Sample current year net income for demo
  const k1Calculation = CompanyProfileEngine.calculatePartnerK1(partner, estimatedCompanyNetIncome);

  const isPartnership = company.entityType.includes('LLC') || company.entityType.includes('PARTNERSHIP');
  const is1120S = company.entityType === 'S_CORP_1120S';
  const formTitle = isPartnership ? 'Schedule K-1 (Form 1065)' : is1120S ? 'Schedule K-1 (Form 1120-S)' : 'Schedule E / K-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                IRS {formTitle} — Partner's Share of Income, Deductions, Credits
              </h3>
              <p className="text-[10px] text-slate-400">
                Ano Fiscal 2026 • {company.legalName} • EIN: {company.ein}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Part I & Part II Header Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Part I: Information About the Partnership / Corporation */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 uppercase text-[11px] block border-b border-slate-800 pb-1">
                Part I: Informações da Sociedade (Partnership / S-Corp)
              </span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">A. Federal EIN:</span>
                  <span className="font-mono text-emerald-400 font-bold">{company.ein}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">B. Razão Social:</span>
                  <span className="font-medium text-white">{company.legalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">C. IRS Center:</span>
                  <span>Ogden, UT / Austin, TX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">D. Método Contábil:</span>
                  <span className="font-medium text-emerald-400">{company.taxAccountingMethod}</span>
                </div>
              </div>
            </div>

            {/* Part II: Information About the Partner / Shareholder */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-purple-400 uppercase text-[11px] block border-b border-slate-800 pb-1">
                Part II: Informações do Sócio (Partner / Shareholder)
              </span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">E. SSN / ITIN do Sócio:</span>
                  <span className="font-mono text-emerald-400 font-bold">{partner.ssnOrItinMasked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">F. Nome Legal do Sócio:</span>
                  <span className="font-bold text-white">{partner.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">G. Tipo de Sócio:</span>
                  <Badge variant="outline" className="text-[10px]">
                    {partner.memberType?.replace(/_/g, ' ') || 'MANAGING MEMBER'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">H. Status Fiscal:</span>
                  <Badge
                    variant={partner.taxClassification === 'FOREIGN_NATIONAL_NRA' ? 'warning' : 'success'}
                    className="text-[10px]"
                  >
                    {partner.taxClassification === 'FOREIGN_NATIONAL_NRA' ? 'Estrangeiro (W-8BEN)' : 'US Person (W-9)'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Part II Box J: Percentages & Box L: Capital Account Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box J: Percentages */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 uppercase text-[11px] block border-b border-slate-800 pb-1">
                Box J: Percentuais Societários (IRC § 704(b))
              </span>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Lucros (Profit)</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {(partner.profitSharingPercentage ?? partner.ownershipPercentage).toFixed(1)}%
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Perdas (Loss)</span>
                  <span className="text-base font-bold font-mono text-rose-400">
                    {(partner.lossSharingPercentage ?? partner.ownershipPercentage).toFixed(1)}%
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Capital (Equity)</span>
                  <span className="text-base font-bold font-mono text-sky-400">
                    {partner.ownershipPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Box L: Partner's Capital Account Analysis (Book Basis) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 uppercase text-[11px] block border-b border-slate-800 pb-1">
                Box L: Análise da Conta de Capital (IRC § 704(b))
              </span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">1. Saldo Inicial de Capital:</span>
                  <span className="font-mono">{formatCurrency(partner.beginningCapitalAccount || 0, 'USD', locale)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">2. Aporte de Capital no Ano (+):</span>
                  <span className="font-mono text-emerald-400">+{formatCurrency(partner.capitalContributedYear || 0, 'USD', locale)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">3. Retiradas / Distribuições (-):</span>
                  <span className="font-mono text-rose-400">-{formatCurrency(partner.currentYearDistributions || 0, 'USD', locale)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-800 pt-1 text-white">
                  <span>Saldo Final de Capital:</span>
                  <span className="font-mono text-emerald-400">{formatCurrency(partner.endingCapitalAccount || 0, 'USD', locale)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Part III: Partner's Share of Current Year Income & Deductions */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="font-bold text-white uppercase text-[11px] block border-b border-slate-800 pb-1">
              Part III: Rendimentos Repassados ao Sócio no Ano (Pass-Through Allocations)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Box 1: Lucro Operacional Repassado</span>
                <span className="text-lg font-bold font-mono text-emerald-400 block mt-1">
                  {formatCurrency(k1Calculation.k1Box1OrdinaryBusinessIncome, 'USD', locale)}
                </span>
                <span className="text-[9px] text-slate-500">{(partner.ownershipPercentage).toFixed(1)}% do lucro societário</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Box 4: Pagamentos Garantidos (707c)</span>
                <span className="text-lg font-bold font-mono text-sky-400 block mt-1">
                  {formatCurrency(k1Calculation.k1Box4GuaranteedPayments, 'USD', locale)}
                </span>
                <span className="text-[9px] text-slate-500">Dedutível no Form 1065</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Box 19: Distribuições de Lucros</span>
                <span className="text-lg font-bold font-mono text-purple-400 block mt-1">
                  {formatCurrency(k1Calculation.k1Box19Distributions, 'USD', locale)}
                </span>
                <span className="text-[9px] text-slate-500">Isento de BIT até limite de basis</span>
              </div>
            </div>

            {/* Foreign Withholding Banner if Applicable */}
            {k1Calculation.isForeignPartner && (
              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-slate-300 text-xs">
                  <div className="font-bold text-amber-300">
                    Retenção Obrigatória de Sócio Estrangeiro (IRC § 1446 Withholding):
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Alíquota de <strong>{(k1Calculation.section1446WithholdingRate * 100).toFixed(0)}%</strong> aplicada sobre o lucro operacional repassado.
                    Valor retido na fonte pela sociedade: <strong className="text-amber-400 font-mono">{formatCurrency(k1Calculation.section1446WithholdingAmount, 'USD', locale)}</strong> (Recolhido via Form 8804 / 8805).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>IRS Ready • Form 1065 / 1120-S Compliant</span>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.print()}
              className="text-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              Imprimir K-1
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
