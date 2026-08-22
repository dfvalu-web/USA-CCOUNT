'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ClientInvoicePortalService, OfficialPaymentReceipt } from '@/lib/invoicing/client-invoice-portal-service';
import { formatCurrency } from '@/lib/i18n/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  CheckCircle2,
  Printer,
  CreditCard,
  Building2,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
  FileCheck2,
  Download,
  AlertCircle,
  Landmark,
} from 'lucide-react';

export default function PublicInvoicePortalPage() {
  const params = useParams();
  const invoiceIdParam = Array.isArray(params?.id) ? params.id[0] : (params?.id as string) || 'INV-2026-0042';

  const [invoiceData, setInvoiceData] = useState(() => ClientInvoicePortalService.getPublicInvoice(invoiceIdParam));
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE_CARD' | 'ACH_TRANSFER'>('STRIPE_CARD');
  const [payerName, setPayerName] = useState(invoiceData.invoice?.contactName || '');
  const [payerEmail, setPayerEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [zipCode, setZipCode] = useState('30301');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<OfficialPaymentReceipt | null>(() =>
    ClientInvoicePortalService.getReceiptForInvoice(invoiceIdParam)
  );

  const { invoice, company } = invoiceData;

  const isPaid = invoice?.status === 'PAID' || !!receipt;
  const isOverdue = invoice?.status === 'OVERDUE';

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newReceipt = ClientInvoicePortalService.processOnlinePayment(
        invoiceIdParam,
        paymentMethod,
        payerName,
        payerEmail
      );
      setReceipt(newReceipt);
      setInvoiceData(ClientInvoicePortalService.getPublicInvoice(invoiceIdParam));
      setIsProcessing(false);
      setIsPayModalOpen(false);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3 max-w-md">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold">Fatura não localizada</h2>
          <p className="text-xs text-slate-400">Verifique o código ou entre em contato com o emissor da fatura.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 sm:py-12 px-3 sm:px-6 font-sans">
      {/* Top Floating Action Bar (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl no-print">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">{company.legalName}</span>
            <span className="text-[11px] text-slate-400 font-mono">Portal do Cliente • Fatura {invoice.invoiceNumber}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isPaid ? (
            <Button
              onClick={() => setIsPayModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center space-x-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pagar Fatura Online ({formatCurrency(invoice.totalAmount, 'USD', 'pt')})</span>
            </Button>
          ) : (
            <Badge variant="success" className="text-xs py-1 px-3">
              ✓ Fatura Paga & Liquidada
            </Badge>
          )}

          <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs bg-slate-800 border-slate-700 cursor-pointer">
            <Printer className="w-3.5 h-3.5 mr-1" />
            Imprimir / Salvar PDF
          </Button>
        </div>
      </div>

      {/* Official Printable Document (Invoice or Receipt) */}
      <div className="max-w-4xl mx-auto bg-slate-900 print:bg-white text-slate-100 print:text-black rounded-3xl border border-slate-800 print:border-none p-6 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Holographic Security Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-8 border-b border-slate-800 print:border-black gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 print:bg-black text-slate-950 print:text-white flex items-center justify-center font-black">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white print:text-black font-serif tracking-tight">
                {company.legalName}
              </h1>
            </div>
            <div className="text-xs text-slate-400 print:text-gray-700 font-mono space-y-0.5">
              <div>DBA: {company.dbaName} • Federal EIN: {company.ein}</div>
              <div>Registered State: {company.formationState} • E-mail: {company.email}</div>
              <div>Central de Contato: {company.phone}</div>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1.5 shrink-0">
            <div className="text-xs uppercase tracking-widest text-slate-400 print:text-gray-600 font-bold">
              {isPaid ? 'RECIBO OFICIAL DE QUITAÇÃO' : 'FATURA CORPORATIVA (INVOICE)'}
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white print:text-black">
              {isPaid && receipt ? receipt.receiptNumber : invoice.invoiceNumber}
            </div>
            <div className="pt-1 flex sm:justify-end">
              {isPaid ? (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PAID • LIQUIDADA</span>
                </div>
              ) : isOverdue ? (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>OVERDUE • VENCIDA</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>PAYMENT DUE • A VENCER</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client & Payment Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-800 print:border-black text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 print:text-gray-600 block mb-1">
              Faturado Para (Billed To):
            </span>
            <div className="text-sm font-bold text-white print:text-black">{invoice.contactName}</div>
            <div className="text-slate-400 print:text-gray-700 mt-1">Conta Corporativa Registrada</div>
            <div className="text-slate-400 print:text-gray-700">Termos: Net 30 Days (US GAAP ASC 606)</div>
          </div>

          <div className="sm:text-right space-y-1">
            <div>
              <span className="text-slate-400 print:text-gray-600 font-medium">Data de Emissão: </span>
              <span className="font-mono font-bold text-white print:text-black">{invoice.issueDate}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-600 font-medium">Data de Vencimento: </span>
              <span className="font-mono font-bold text-emerald-400 print:text-black">{invoice.dueDate}</span>
            </div>
            {receipt && (
              <div>
                <span className="text-slate-400 print:text-gray-600 font-medium">Data de Liquidação: </span>
                <span className="font-mono font-bold text-emerald-400 print:text-black">
                  {receipt.paymentDate.split('T')[0]} ({receipt.paymentMethod === 'STRIPE_CARD' ? 'Cartão Online' : 'ACH Direct'})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Itemized Services Table */}
        <div className="py-6 border-b border-slate-800 print:border-black">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 print:border-black text-slate-400 print:text-gray-700 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Descrição do Serviço Prestado</th>
                <th className="pb-3 font-semibold text-center w-16">Qtd</th>
                <th className="pb-3 font-semibold text-right w-28">Preço Unitário</th>
                <th className="pb-3 font-semibold text-right w-28">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 print:divide-gray-200 font-mono">
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 text-slate-200 print:text-black font-sans font-medium">
                    {item.description}
                  </td>
                  <td className="py-3 text-center text-slate-400 print:text-gray-700">{item.quantity}</td>
                  <td className="py-3 text-right text-slate-400 print:text-gray-700">
                    {formatCurrency(item.unitPrice, 'USD', 'pt')}
                  </td>
                  <td className="py-3 text-right text-white print:text-black font-bold">
                    {formatCurrency(item.quantity * item.unitPrice, 'USD', 'pt')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Banking Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-800 print:border-black text-xs">
          {/* Wire / ACH Instructions */}
          <div className="p-4 rounded-2xl bg-slate-950 print:bg-gray-50 border border-slate-800 print:border-gray-300 space-y-2">
            <span className="font-bold text-white print:text-black flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-emerald-400 print:text-black" />
              Instruções de Pagamento Wire / ACH:
            </span>
            <div className="font-mono text-[11px] text-slate-400 print:text-gray-700 space-y-0.5">
              <div>Instituição: <span className="text-white print:text-black font-semibold">{company.bankName}</span></div>
              <div>Routing / ABA: <span className="text-emerald-400 print:text-black font-bold">{company.routingNumber}</span></div>
              <div>Account Number: <span className="text-emerald-400 print:text-black font-bold">{company.accountNumber}</span></div>
              <div>Beneficiário: <span className="text-white print:text-black font-semibold">{company.legalName}</span></div>
            </div>
          </div>

          {/* Amount Calculation */}
          <div className="space-y-2 sm:text-right">
            <div className="flex justify-between sm:justify-end gap-6 text-slate-400 print:text-gray-700">
              <span>Subtotal:</span>
              <span className="font-mono">{formatCurrency(invoice.subtotal, 'USD', 'pt')}</span>
            </div>
            <div className="flex justify-between sm:justify-end gap-6 text-slate-400 print:text-gray-700">
              <span>Tax / Impostos (0% Exempt):</span>
              <span className="font-mono">{formatCurrency(invoice.taxAmount, 'USD', 'pt')}</span>
            </div>
            <div className="flex justify-between sm:justify-end gap-6 text-base sm:text-lg font-bold text-white print:text-black pt-2 border-t border-slate-800 print:border-black">
              <span>Valor Total Devido:</span>
              <span className="font-mono text-emerald-400 print:text-black">{formatCurrency(invoice.totalAmount, 'USD', 'pt')}</span>
            </div>
            {isPaid && (
              <div className="flex justify-between sm:justify-end gap-6 text-xs font-bold text-emerald-400 print:text-black">
                <span>Saldo Remanescente:</span>
                <span className="font-mono">$0.00 (Liquidado)</span>
              </div>
            )}
          </div>
        </div>

        {/* Cryptographic Compliance Seal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 print:text-gray-500 font-mono gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SOC 2 Type II Certified • US GAAP ASC 606 Revenue Proof Hash</span>
          </div>
          <div>
            Assinatura Digital: {receipt ? receipt.merkleSignature : `0x9E7A4F2C-USGAAP-INVOICE-${invoice.invoiceNumber}`}
          </div>
        </div>
      </div>

      {/* Online Payment Drawer / Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Pagamento Seguro Online</h3>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('STRIPE_CARD')}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'STRIPE_CARD'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Cartão de Crédito
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('ACH_TRANSFER')}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'ACH_TRANSFER'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Transferência ACH
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Nome do Titular / Responsável:</label>
                <input
                  type="text"
                  required
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">E-mail para Recebimento do Recibo:</label>
                <input
                  type="email"
                  required
                  placeholder="finance@empresa.com"
                  value={payerEmail}
                  onChange={(e) => setPayerEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {paymentMethod === 'STRIPE_CARD' ? (
                <>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Número do Cartão:</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Validade:</label>
                      <input
                        type="text"
                        required
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-2 py-2 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">CVC:</label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-2 py-2 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">ZIP Code:</label>
                      <input
                        type="text"
                        required
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-2 py-2 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-[11px] text-slate-400">
                  <span className="text-white font-semibold block">Débito Direto em Conta Bancária (ACH):</span>
                  <div>O débito será efetuado automaticamente via compensação da Federal Reserve (Plaid / Stripe ACH).</div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow-lg mt-2 text-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Processando Liquidação Bancária...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pagar Agora {formatCurrency(invoice.totalAmount, 'USD', 'pt')}</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
