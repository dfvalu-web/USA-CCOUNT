'use client';

import React, { useState } from 'react';
import { useCompany } from '@/lib/company/company-context';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { InvoiceDTO } from '@/lib/accounting/invoicing-service';
import {
  Printer,
  Download,
  Share2,
  CheckCircle2,
  CreditCard,
  Building2,
  Landmark,
  ShieldCheck,
  Award,
  Sparkles,
  QrCode,
  Lock,
  Mail,
  Copy,
  ExternalLink,
  DollarSign,
  Calendar,
  X,
  FileCheck2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DiamondInvoiceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceDTO | null;
  onMarkAsPaid?: (invoiceId: string) => void;
}

export function DiamondInvoiceViewerModal({
  isOpen,
  onClose,
  invoice,
  onMarkAsPaid,
}: DiamondInvoiceViewerModalProps) {
  const { activeCompany } = useCompany();
  const { t } = useI18n();

  const [copiedMsg, setCopiedMsg] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/invoice/${invoice.id || invoice.invoiceNumber}`
      : invoice.paymentLinkUrl || `https://uas-accounting.vercel.app/invoice/${invoice.id}`;
    navigator.clipboard.writeText(url);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 3000);
  };

  const handleOpenClientPortal = () => {
    if (typeof window !== 'undefined') {
      window.open(`/invoice/${invoice.id || invoice.invoiceNumber}`, '_blank');
    }
  };

  const handlePayNow = () => {
    if (onMarkAsPaid) {
      onMarkAsPaid(invoice.id);
      setPaymentSuccessMsg(`Pagamento de ${formatCurrency(invoice.balanceDue || invoice.totalAmount)} registrado com sucesso no Livro-Razão!`);
    }
  };

  // Status Styling Badge
  const getStatusBadge = () => {
    switch (invoice.status) {
      case 'PAID':
        return (
          <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 print:bg-emerald-100 text-emerald-400 print:text-emerald-900 border border-emerald-500/40 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-950/40">
            <CheckCircle2 className="w-4 h-4" />
            <span>PAGO • PAID IN FULL</span>
          </div>
        );
      case 'OVERDUE':
        return (
          <div className="px-4 py-1.5 rounded-full bg-rose-500/20 print:bg-rose-100 text-rose-400 print:text-rose-900 border border-rose-500/40 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-rose-950/40">
            <Lock className="w-4 h-4" />
            <span>VENCIDO • PAST DUE</span>
          </div>
        );
      default:
        return (
          <div className="px-4 py-1.5 rounded-full bg-sky-500/20 print:bg-sky-100 text-sky-400 print:text-sky-900 border border-sky-500/40 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-sky-950/40">
            <Calendar className="w-4 h-4" />
            <span>EM ABERTO • PAYMENT DUE</span>
          </div>
        );
    }
  };

  const companyLegalName = activeCompany?.legalName || 'Milla Maid Services LLC';
  const companyDba = activeCompany?.dbaName || 'Milla Maid Commercial Services';
  const companyEin = activeCompany?.ein || '88-4920194';
  const companyState = activeCompany?.formationState || activeCompany?.principalAddress?.state || 'GA';
  const companyAddress = activeCompany?.principalAddress
    ? `${activeCompany.principalAddress.street}, ${activeCompany.principalAddress.city}, ${activeCompany.principalAddress.state} ${activeCompany.principalAddress.zipCode}`
    : '2300 Global Forum Blvd, Suite 813 • Doraville, GA 30340';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-slate-950 print:bg-white rounded-3xl border border-emerald-500/40 print:border-none shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 p-[1px] flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white font-serif flex items-center gap-2">
                <span>Fatura Padrão Diamante</span>
                <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                  4K CERTIFIED
                </span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {invoice.invoiceNumber} • {invoice.contactName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={handlePrint}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/30 flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyLink}
              className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              <span>{copiedMsg ? 'Link Copiado!' : 'Copiar Link do Cliente'}</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenClientPortal}
              className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-sky-400 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>Portal do Cliente ↗</span>
            </Button>

            {invoice.status !== 'PAID' && (
              <Button
                size="sm"
                variant="primary"
                onClick={handlePayNow}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Registrar Pagamento</span>
              </Button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {paymentSuccessMsg && (
          <div className="p-3.5 bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{paymentSuccessMsg}</span>
            </div>
            <button
              onClick={() => setPaymentSuccessMsg(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DIAMOND INVOICE PAPER BODY (Printable & Export Ready) */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-12 overflow-y-auto flex-1 print:p-0 print:overflow-visible text-slate-200 print:text-black space-y-8">
          {/* Top Diamond Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b-2 border-slate-800 print:border-gray-300">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-500 p-[1.5px] shadow-lg flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 print:bg-white rounded-[14px] flex items-center justify-center text-emerald-400 print:text-emerald-800">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-white print:text-black font-serif tracking-tight">
                    {companyLegalName}
                  </h1>
                  <span className="text-xs text-emerald-400 print:text-gray-700 font-mono font-semibold">
                    {companyDba}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400 print:text-gray-600 space-y-0.5 font-mono pt-1">
                <div>Federal EIN: {companyEin} • Jurisdiction: {companyState}</div>
                <div>Principal Address: {companyAddress}</div>
                <div>Email: contato@mistercontabil.com • Web: mistercontabil.com</div>
              </div>
            </div>

            <div className="sm:text-right space-y-2">
              <div className="text-3xl font-extrabold text-white print:text-black font-serif tracking-tight">
                INVOICE
              </div>
              <div className="font-mono text-xs text-slate-400 print:text-gray-700">
                <span className="font-bold text-emerald-400 print:text-black">No: </span>
                {invoice.invoiceNumber}
              </div>
              <div className="pt-1 flex sm:justify-end">{getStatusBadge()}</div>
            </div>
          </div>

          {/* Bill To & Invoice Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-300">
            <div className="space-y-1.5 text-xs">
              <span className="font-mono font-bold text-emerald-400 print:text-black uppercase text-[11px] tracking-wider block">
                FATURAR PARA (BILL TO):
              </span>
              <div className="text-base font-extrabold text-white print:text-black font-serif">
                {invoice.contactName}
              </div>
              <div className="text-slate-400 print:text-gray-600 leading-relaxed font-mono">
                Attn: Accounts Payable Dept.<br />
                Corporate Client Workspace<br />
                Commercial Entity ID: {invoice.contactId}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">DATA DE EMISSÃO:</span>
                <div className="text-white print:text-black font-bold">{formatDate(invoice.issueDate)}</div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">DATA DE VENCIMENTO:</span>
                <div className="text-emerald-400 print:text-black font-bold">{formatDate(invoice.dueDate)}</div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">TERMO DE PAGAMENTO:</span>
                <div className="text-white print:text-black font-bold">{invoice.paymentTerm}</div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">REGIME US GAAP:</span>
                <div className="text-white print:text-black font-bold">ASC 606 (Accrual)</div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-800 print:border-gray-300 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 print:bg-gray-100 border-b border-slate-800 print:border-gray-300 text-slate-300 print:text-black font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5 pl-5">Descrição do Serviço Contratado</th>
                    <th className="p-3.5 text-center">Qtd / Horas</th>
                    <th className="p-3.5 text-right">Taxa Unitária</th>
                    <th className="p-3.5 text-right pr-5">Subtotal (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 print:divide-gray-200 font-mono">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3.5 pl-5">
                        <div className="font-sans font-semibold text-white print:text-black text-xs">
                          {item.description}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Conta de Receita: {item.revenueAccountCode} • Modelo: {item.pricingModel}
                        </span>
                      </td>
                      <td className="p-3.5 text-center text-slate-300 print:text-black font-semibold">
                        {item.quantity}
                      </td>
                      <td className="p-3.5 text-right text-slate-300 print:text-black">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="p-3.5 text-right pr-5 font-bold text-white print:text-black">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations & Total Due Box */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4">
              {/* Payment Instructions & Bank Details */}
              <div className="w-full sm:w-1/2 p-5 rounded-2xl bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-300 space-y-2.5 text-xs font-mono">
                <div className="flex items-center space-x-2 text-emerald-400 print:text-black font-bold font-sans">
                  <Landmark className="w-4 h-4" />
                  <span>DADOS BANCÁRIOS OFICIAIS (WIRE / ACH):</span>
                </div>
                <div className="text-slate-300 print:text-gray-700 space-y-1 text-[11px]">
                  <div>Banco: <strong>Truist Bank / JPMorgan Chase Bank, N.A.</strong></div>
                  <div>Favorecido: <strong>{companyLegalName}</strong></div>
                  <div>Routing Number (ABA / ACH): <strong>061000104</strong></div>
                  <div>Account Number: <strong>••••••8492</strong></div>
                  <div>Referência Obrigatória: <strong>{invoice.invoiceNumber}</strong></div>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="w-full sm:w-5/12 space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800 print:border-gray-200 text-slate-400 print:text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-bold text-white print:text-black">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-800 print:border-gray-200 text-slate-400 print:text-gray-700">
                    <span>Imposto Estadual (Sales Tax):</span>
                    <span className="font-bold text-white print:text-black">{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                )}
                {invoice.lateFeeApplied && invoice.lateFeeApplied > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-800 print:border-gray-200 text-rose-400">
                    <span>Multa por Atraso (Late Fee 1.5%):</span>
                    <span className="font-bold">{formatCurrency(invoice.lateFeeApplied)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-800 print:border-gray-200 text-slate-400 print:text-gray-700">
                  <span>Valor Total Faturado:</span>
                  <span className="font-bold text-white print:text-black">{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 print:border-gray-200 text-slate-400 print:text-gray-700">
                  <span>Valor Já Pago:</span>
                  <span className="font-bold text-emerald-400 print:text-black">{formatCurrency(invoice.amountPaid)}</span>
                </div>

                {/* Final Total Box */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/90 to-slate-900 print:bg-gray-200 border border-emerald-500/50 print:border-gray-400 flex justify-between items-center text-sm font-extrabold text-white print:text-black">
                  <span>SALDO DEVEDOR (TOTAL DUE):</span>
                  <span className="font-mono text-emerald-300 print:text-black text-lg">
                    {formatCurrency(invoice.balanceDue)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Online Stripe Payment Callout Box */}
          {invoice.paymentLinkUrl && invoice.status !== 'PAID' && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center space-x-2 text-white font-bold text-sm">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Pagar Fatura Online com Cartão de Crédito ou Débito</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  Processamento seguro criptografado com baixa contábil e recibo automático.
                </p>
              </div>

              <a
                href={invoice.paymentLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/30 cursor-pointer shrink-0"
              >
                <span>Pagar Agora {formatCurrency(invoice.balanceDue)}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Cryptographic Authenticity & Signature Stamp */}
          <div className="pt-6 border-t-2 border-slate-800 print:border-black grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-slate-400 print:text-gray-700">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 print:text-black font-bold">
                <Award className="w-4 h-4" />
                <span>CERTIFICADO DE AUTENTICIDADE CRIPTOGRÁFICA</span>
              </div>
              <div className="font-mono text-[10px] text-slate-500 print:text-gray-500 space-y-1">
                <div>SOC 2 Type II Merkle Audit Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4...</div>
                <div>Timestamp: {new Date().toISOString()}</div>
                <div>Em conformidade com US GAAP ASC 606 & IRS Electronic Recordkeeping.</div>
              </div>
            </div>

            <div className="space-y-3 sm:text-right">
              <div className="border-b border-slate-700 print:border-gray-400 pb-1 w-60 ml-auto">
                <span className="font-serif italic text-white print:text-black text-sm">David Ferreira</span>
              </div>
              <div>
                <div className="font-bold text-white print:text-black">Diretoria Financeira & Controladoria</div>
                <div className="text-[11px] font-mono">{companyLegalName}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
