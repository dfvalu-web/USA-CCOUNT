'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { ReceiptOcrEngine, ParsedReceiptData } from '@/lib/ai/receipt-ocr-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { UploadCloud, Sparkles, CheckCircle2, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

interface ReceiptOcrScannerProps {
  onPostSuccess?: (entry: any) => void;
}

export function ReceiptOcrScanner({ onPostSuccess }: ReceiptOcrScannerProps) {
  const { locale, t } = useI18n();

  const [isScanning, setIsScanning] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedReceiptData | null>(null);
  const [postMessage, setPostMessage] = useState<string | null>(null);

  const sampleReceipts = [
    {
      name: 'AWS Cloud Hosting Invoice (PDF)',
      text: 'AMAZON WEB SERVICES INC. INVOICE #9481023 DATE: 2026-08-15 TOTAL AMOUNT: $1,420.50 DESCRIPTION: US-EAST Dedicated Compute & S3 Storage',
    },
    {
      name: 'Figma Enterprise Subscription (EN)',
      text: 'FIGMA INC. RECEIPT #FG-44910 DATE: 2026-08-18 AMOUNT: $480.00 DESCRIPTION: 10 Designer Organization Seats',
    },
    {
      name: 'Nota Fiscal de Serviços TI (PT)',
      text: 'DELAWARE TECH CONSULTORIA LTDA. FATURA DE SERVICOS #NF-8812 DATA: 2026-08-16 VALOR TOTAL: $3,200.00 DESCRICAO: Desenvolvimento de API Node.js e React',
    },
  ];

  const handleScanReceipt = (rawText: string) => {
    setIsScanning(true);
    setPostMessage(null);
    setTimeout(() => {
      const parsed = ReceiptOcrEngine.parseReceiptText(rawText);
      setParsedData(parsed);
      setIsScanning(false);
    }, 600);
  };

  const handlePostToLedger = () => {
    if (!parsedData) return;
    const entry = ReceiptOcrEngine.generateReceiptJournalEntry(
      '11111111-1111-1111-1111-111111111111',
      parsedData
    );

    if (onPostSuccess) {
      onPostSuccess(entry);
    }

    setPostMessage(
      `Receipt from ${parsedData.vendorName} ($${parsedData.totalAmount.toFixed(2)}) successfully posted to General Ledger! (DR ${parsedData.suggestedAccountCode} / CR 2020 Credit Cards Payable)`
    );
  };

  return (
    <Card className="border-emerald-500/20 bg-slate-950">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Multimodal AI OCR Receipt Scanner (EN / PT / ES)</CardTitle>
              <CardDescription>
                Zero-Touch Document Parsing • Autonomous US GAAP Account Classification
              </CardDescription>
            </div>
          </div>
          <Badge variant="success">Multilingual Vision OCR Active</Badge>
        </div>
      </CardHeader>

      <div className="space-y-6">
        {/* Sample Document Selectors */}
        <div>
          <span className="text-xs font-semibold text-slate-300 block mb-2">
            Simulate Document Ingestion (PDF / Image / OCR Feed):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sampleReceipts.map((sr) => (
              <button
                key={sr.name}
                onClick={() => handleScanReceipt(sr.text)}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-200 group-hover:text-emerald-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{sr.name}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">{sr.text}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Scanning State */}
        {isScanning && (
          <div className="p-8 text-center rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="animate-spin text-emerald-400 text-2xl">⟳</div>
            <div className="text-xs font-medium text-white">Running Multimodal Vision OCR...</div>
            <div className="text-[11px] text-slate-400">
              Extracting entities, tax IDs, and auto-mapping to US GAAP Chart of Accounts
            </div>
          </div>
        )}

        {/* Post Success Message */}
        {postMessage && (
          <div className="p-3.5 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{postMessage}</span>
            </div>
            <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setPostMessage(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Parsed Result Display */}
        {parsedData && !isScanning && (
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {parsedData.vendorName}
                  <Badge variant="success" className="text-[10px]">
                    {parsedData.confidenceScore}% Confidence
                  </Badge>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">
                    {parsedData.languageDetected}
                  </Badge>
                </h4>
                <p className="text-xs text-slate-400">
                  Invoice #{parsedData.invoiceNumber} • Date: {parsedData.date}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Extracted Total</span>
                <span className="text-lg font-mono font-bold text-emerald-400">
                  {formatCurrency(parsedData.totalAmount, 'USD', locale)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                  AI Auto-Mapped US GAAP Account
                </span>
                <div className="text-emerald-400 font-mono font-bold mt-0.5">
                  {parsedData.suggestedAccountCode} — {parsedData.suggestedAccountName}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Classified via semantic keyword vector matching
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                  Payment Account & Offset
                </span>
                <div className="text-white font-mono font-bold mt-0.5">
                  2020 — Corporate Credit Cards Payable (Ramp / Brex)
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Automatic double-entry balancing ($\Delta = \$0.00$)
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="primary" onClick={handlePostToLedger}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Confirm & Commit to General Ledger
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
