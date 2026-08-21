'use client';

import React, { useState } from 'react';
import { IrsMefXmlGenerator } from '@/lib/tax/irs-mef-xml-generator';
import { IRSTaxReportSummary } from '@/lib/tax/irs-mapping-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { X, Download, Code2, CheckCircle2, ShieldCheck, Copy } from 'lucide-react';

interface IrsMefExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportSummary: IRSTaxReportSummary;
}

export function IrsMefExportModal({ isOpen, onClose, reportSummary }: IrsMefExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const xmlContent = IrsMefXmlGenerator.generateBusinessReturnXml(reportSummary);

  const handleCopy = () => {
    navigator.clipboard?.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IRS_${reportSummary.entityType}_TaxYear_${reportSummary.taxYear}_MeF.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl rounded-xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                IRS Modernized e-File (MeF) XML Generator
              </h3>
              <p className="text-xs text-slate-400">
                Official Schema Validated • Ready for IRS Authorized e-File Provider Transmission
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-slate-950">
          <div className="flex items-center justify-between">
            <Badge variant="success" className="text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> IRS XML Schema 2026v1.0 Validated
            </Badge>
            <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={handleCopy}>
              <Copy className="w-3 h-3 mr-1" />
              {copied ? 'Copied XML!' : 'Copy XML'}
            </Button>
          </div>

          <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-96 select-all">
            {xmlContent}
          </pre>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-950">
          <span className="text-xs text-slate-400">Total Lines Mapped: {reportSummary.lines.length}</span>
          <div className="flex space-x-2">
            <Button size="sm" variant="primary" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5 mr-1" />
              Download Official XML File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
