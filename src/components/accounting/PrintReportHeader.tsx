'use client';

import React from 'react';
import { useCompany } from '@/lib/company/company-context';
import { useFiscalPeriod } from '@/lib/period/fiscal-period-context';
import { useI18n } from '@/lib/i18n/context';

interface PrintReportHeaderProps {
  reportTitle: string;
  reportSubtitle?: string;
  asOfDate?: string;
}

export function PrintReportHeader({ reportTitle, reportSubtitle, asOfDate }: PrintReportHeaderProps) {
  const { activeCompany } = useCompany();
  const { fiscalYear, getFormattedPeriodLabel } = useFiscalPeriod();
  const { basis } = useI18n();

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="print-only mb-6 border-b-2 border-slate-900 pb-4 text-slate-900">
      {/* Top Corporate Letterhead */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-serif font-black tracking-wide text-slate-900 uppercase">
            {activeCompany?.legalName || 'MILLA MAID SERVICES LLC'}
          </h1>
          <div className="text-xs text-slate-700 font-mono mt-0.5 space-x-2">
            <span>EIN: {activeCompany?.ein || '88-1234567'}</span>
            <span>•</span>
            <span>{activeCompany?.businessActivityDescription || 'Commercial & Residential Cleaning Services'}</span>
            <span>•</span>
            <span>Jurisdiction: {activeCompany?.formationState || 'GA'}, USA</span>
          </div>
          <div className="text-[11px] text-slate-600">
            {activeCompany?.principalAddress
              ? `${activeCompany.principalAddress.street}${activeCompany.principalAddress.suite ? ', ' + activeCompany.principalAddress.suite : ''}, ${activeCompany.principalAddress.city}, ${activeCompany.principalAddress.state} ${activeCompany.principalAddress.zipCode}`
              : '2300 Global Forum Blvd, Suite 813 • Doraville, GA 30340'}
          </div>
        </div>

        {/* Forensic Audit Stamp */}
        <div className="text-right border border-slate-800 p-2 rounded text-[10px] bg-slate-50">
          <div className="font-bold text-slate-900 uppercase">US GAAP Audit-Ready</div>
          <div className="text-slate-600 font-mono">Basis: {basis} Standard</div>
          <div className="text-slate-500 font-mono text-[9px]">Gen: {currentDateFormatted}</div>
        </div>
      </div>

      {/* Report Title Banner */}
      <div className="mt-4 pt-3 border-t border-slate-300 text-center">
        <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
          {reportTitle}
        </h2>
        <div className="text-xs text-slate-700 font-medium mt-0.5">
          {asOfDate
            ? `As of ${asOfDate}`
            : `Fiscal Period: ${getFormattedPeriodLabel()} (${fiscalYear})`}
          {reportSubtitle && <span> • {reportSubtitle}</span>}
        </div>
      </div>
    </div>
  );
}

export function PrintReportFooter() {
  const { activeCompany } = useCompany();
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="print-only mt-8 pt-4 border-t border-slate-300 text-slate-800 text-[10px]">
      <div className="grid grid-cols-3 gap-6 pt-4 text-center">
        <div className="border-t border-slate-600 pt-1">
          <span className="font-semibold block">Prepared By</span>
          <span className="text-[9px] text-slate-500">Staff Accountant / Controller</span>
        </div>
        <div className="border-t border-slate-600 pt-1">
          <span className="font-semibold block">Reviewed & Certified By</span>
          <span className="text-[9px] text-slate-500">Certified Public Accountant (CPA) / EA</span>
        </div>
        <div className="border-t border-slate-600 pt-1">
          <span className="font-semibold block">Management Approval</span>
          <span className="text-[9px] text-slate-500">{activeCompany?.legalName || 'Authorized Signatory'}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 text-[9px] text-slate-500 font-mono">
        <span>UAS Accounting Next-Gen Fintech • Immutable Double-Entry General Ledger</span>
        <span>Printed on: {currentDateFormatted} • Confidential Financial Statement</span>
      </div>
    </div>
  );
}
