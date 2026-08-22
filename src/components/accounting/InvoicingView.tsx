'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { InvoiceDTO } from '@/lib/accounting/invoicing-service';
import { NewInvoiceModal } from './NewInvoiceModal';
import { StripeCheckoutModal } from '@/components/billing/StripeCheckoutModal';
import { DiamondInvoiceViewerModal } from '@/components/invoicing/DiamondInvoiceViewerModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Plus,
  Link2,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  CreditCard,
  Receipt,
  Sparkles,
  Printer,
  FileCheck2,
} from 'lucide-react';

interface InvoicingViewProps {
  onPostPaymentAccounting?: (entry: any) => void;
}

export function InvoicingView({ onPostPaymentAccounting }: InvoicingViewProps) {
  const { locale, t } = useI18n();

  const [invoices, setInvoices] = useState<InvoiceDTO[]>([
    {
      id: 'inv-101',
      organizationId: '11111111-1111-1111-1111-111111111111',
      contactId: 'c-1',
      contactName: 'Austin Tech Hub Suites',
      invoiceNumber: 'INV-2026-0089',
      issueDate: '2026-08-01',
      dueDate: '2026-08-31',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Manutenção Mensal & Janitorial Corporativo (40 hrs @ $150/hr)',
          quantity: 40,
          unitPrice: 150,
          pricingModel: 'HOURLY',
          revenueAccountCode: '4010',
        },
      ],
      subtotal: 6000,
      taxAmount: 495,
      totalAmount: 6495,
      amountPaid: 0,
      balanceDue: 6495,
      status: 'ISSUED',
      paymentLinkUrl: 'https://pay.mistercontabil.com/inv/INV-2026-0089',
    },
    {
      id: 'inv-102',
      organizationId: '11111111-1111-1111-1111-111111111111',
      contactId: 'c-2',
      contactName: 'NovaTech BioLabs Inc',
      invoiceNumber: 'INV-2026-0088',
      issueDate: '2026-07-15',
      dueDate: '2026-08-14',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Custom React & Node.js Platform Engineering',
          quantity: 1,
          unitPrice: 18500,
          pricingModel: 'FIXED_FEE',
          revenueAccountCode: '4020',
        },
      ],
      subtotal: 18500,
      taxAmount: 0,
      totalAmount: 18500,
      amountPaid: 18500,
      balanceDue: 0,
      status: 'PAID',
      paymentLinkUrl: 'https://pay.mistercontabil.com/inv/INV-2026-0088',
    },
    {
      id: 'inv-103',
      organizationId: '11111111-1111-1111-1111-111111111111',
      contactId: 'c-3',
      contactName: 'SoHo Design Agency',
      invoiceNumber: 'INV-2026-0082',
      issueDate: '2026-06-15',
      dueDate: '2026-07-15',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Monthly Engineering & Security Retainer - June',
          quantity: 1,
          unitPrice: 12000,
          pricingModel: 'RETAINER',
          revenueAccountCode: '4030',
        },
      ],
      subtotal: 12000,
      taxAmount: 1065,
      totalAmount: 13065,
      amountPaid: 0,
      balanceDue: 13065,
      status: 'OVERDUE',
      paymentLinkUrl: 'https://pay.mistercontabil.com/inv/INV-2026-0082',
      lateFeeApplied: 216, // 1.5% late fee
    },
  ]);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ISSUED' | 'PAID' | 'OVERDUE'>('ALL');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Modals
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutInvoice, setCheckoutInvoice] = useState<InvoiceDTO | null>(null);
  const [selectedDiamondInvoice, setSelectedDiamondInvoice] = useState<InvoiceDTO | null>(null);
  const [isDiamondModalOpen, setIsDiamondModalOpen] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'ALL' && inv.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.contactName.toLowerCase().includes(q) ||
        inv.totalAmount.toString().includes(q)
      );
    }
    return true;
  });

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleOpenCheckout = (inv: InvoiceDTO) => {
    setCheckoutInvoice(inv);
    setIsCheckoutOpen(true);
  };

  const handleRecordPayment = (invId: string) => {
    const inv = invoices.find((i) => i.id === invId);
    if (!inv) return;

    setInvoices(
      invoices.map((i) => {
        if (i.id === invId) {
          return {
            ...i,
            amountPaid: i.totalAmount,
            balanceDue: 0,
            status: 'PAID',
          };
        }
        return i;
      })
    );

    setNotificationMsg(
      `Pagamento de ${formatCurrency(inv.balanceDue, 'USD', locale)} registrado com sucesso para a fatura ${inv.invoiceNumber}! (DR 1010 Banco Operacional / CR 1200 Contas a Receber)`
    );
  };

  const handleInvoiceCreated = (newInv: InvoiceDTO) => {
    setInvoices([newInv, ...invoices]);
    setNotificationMsg(
      `Fatura #${newInv.invoiceNumber} no valor de ${formatCurrency(newInv.totalAmount, 'USD', locale)} emitida com sucesso para ${newInv.contactName}!`
    );
  };

  const handleExportCsv = () => {
    let csv = `Invoice Number,Client Name,Issue Date,Due Date,Payment Term,Subtotal,Tax Amount,Total Amount,Amount Paid,Balance Due,Status\n`;
    invoices.forEach((inv) => {
      csv += `"${inv.invoiceNumber}","${inv.contactName}","${inv.issueDate}","${inv.dueDate}","${inv.paymentTerm}",${inv.subtotal},${inv.taxAmount},${inv.totalAmount},${inv.amountPaid},${inv.balanceDue},"${inv.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `faturamento_invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotificationMsg('Relatório de Faturas & Contas a Receber (A/R) exportado com sucesso em CSV!');
  };

  const totalOutstanding = invoices
    .filter((i) => i.status !== 'PAID')
    .reduce((acc, i) => acc + i.balanceDue, 0);

  const totalCollected = invoices.reduce((acc, i) => acc + i.amountPaid, 0);

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total a Receber (A/R em Aberto)</span>
          <span className="text-xl font-mono font-bold text-amber-400 mt-1 block">
            {formatCurrency(totalOutstanding, 'USD', locale)}
          </span>
          <span className="text-[10px] text-slate-500">Contas a Receber (Conta 1200 US GAAP)</span>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Liquidado (Arrecadado)</span>
          <span className="text-xl font-mono font-bold text-emerald-400 mt-1 block">
            {formatCurrency(totalCollected, 'USD', locale)}
          </span>
          <span className="text-[10px] text-slate-500">Conciliado no Caixa & Cartões</span>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total de Faturas Emitidas</span>
          <span className="text-xl font-mono font-bold text-white mt-1 block">
            {invoices.length} Faturas
          </span>
          <span className="text-[10px] text-slate-500">ASC 606 Revenue Recognition</span>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>{t('nav.invoicing')} (Faturamento & Invoices)</CardTitle>
                <CardDescription>
                  Motor Autônomo de Contas a Receber (A/R) com Links de Pagamento Stripe e Checkout Instantâneo
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportCsv}>
                <Download className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                Exportar CSV
              </Button>
              <Button size="sm" variant="primary" onClick={() => setIsNewInvoiceOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Emitir Nova Fatura
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Filters and Search Bar */}
        <div className="px-6 py-3 border-y border-slate-800 bg-slate-900/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-7 rounded bg-slate-950 border border-slate-800 px-2 text-white font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Todas as Faturas ({invoices.length})</option>
              <option value="ISSUED">Aguardando Pagamento</option>
              <option value="PAID">Liquidadas / Pagas</option>
              <option value="OVERDUE">Vencidas (Overdue)</option>
            </select>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Buscar por fatura ou cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-7 rounded bg-slate-950 border border-slate-800 pl-7 pr-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Notification Banner */}
        {notificationMsg && (
          <div className="m-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
            <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setNotificationMsg(null)}>
              Fechar
            </Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">{t('accounting.entryNumber')}</TableHead>
              <TableHead>Cliente / Razão Social</TableHead>
              <TableHead className="w-28">Emissão</TableHead>
              <TableHead className="w-28">Vencimento</TableHead>
              <TableHead className="text-right w-28">Valor Total</TableHead>
              <TableHead className="text-right w-28">Saldo Devedor</TableHead>
              <TableHead className="w-24 text-center">{t('common.status')}</TableHead>
              <TableHead className="w-56 text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((inv) => (
              <TableRow key={inv.id} className="hover:bg-slate-900/50 transition-colors">
                <TableCell className="font-mono text-emerald-400 font-semibold">
                  {inv.invoiceNumber}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-white">{inv.contactName}</div>
                  <div className="text-[10px] text-slate-400">Condição: {inv.paymentTerm}</div>
                </TableCell>
                <TableCell className="text-slate-300 font-mono text-xs">{formatDate(inv.issueDate, locale)}</TableCell>
                <TableCell className="text-slate-300 font-mono text-xs">
                  <span className={inv.status === 'OVERDUE' ? 'text-rose-400 font-semibold' : ''}>
                    {formatDate(inv.dueDate, locale)}
                  </span>
                  {inv.lateFeeApplied ? (
                    <div className="text-[10px] text-rose-400 font-sans">+${inv.lateFeeApplied} Juros de Mora</div>
                  ) : null}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums font-semibold text-white">
                  {formatCurrency(inv.totalAmount, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-emerald-400 font-bold">
                  {formatCurrency(inv.balanceDue, 'USD', locale)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      inv.status === 'PAID'
                        ? 'success'
                        : inv.status === 'OVERDUE'
                        ? 'danger'
                        : 'warning'
                    }
                    className="text-[10px]"
                  >
                    {inv.status === 'PAID' ? '✓ Pago' : inv.status === 'OVERDUE' ? '⚠️ Vencido' : '⏳ Emitido'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[11px] h-7 px-2.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-600/30 font-bold flex items-center space-x-1 cursor-pointer"
                      onClick={() => {
                        setSelectedDiamondInvoice(inv);
                        setIsDiamondModalOpen(true);
                      }}
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Fatura Diamante</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[11px] h-7 px-2"
                      onClick={() => handleCopyLink(inv.paymentLinkUrl, inv.id)}
                    >
                      <Link2 className="w-3 h-3 mr-1" />
                      {copiedLink === inv.id ? 'Copiado!' : 'Link'}
                    </Button>
                    {inv.status !== 'PAID' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[11px] h-7 px-2 text-sky-400 hover:text-sky-300"
                          onClick={() => handleOpenCheckout(inv)}
                        >
                          <CreditCard className="w-3 h-3 mr-1" />
                          Pagar
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          className="text-[11px] h-7 px-2 bg-emerald-600 hover:bg-emerald-500"
                          onClick={() => handleRecordPayment(inv.id)}
                        >
                          <DollarSign className="w-3 h-3 mr-0.5" />
                          Baixar
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modals */}
      <NewInvoiceModal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        onInvoiceCreated={handleInvoiceCreated}
      />

      <DiamondInvoiceViewerModal
        isOpen={isDiamondModalOpen}
        onClose={() => {
          setIsDiamondModalOpen(false);
          setSelectedDiamondInvoice(null);
        }}
        invoice={selectedDiamondInvoice}
        onMarkAsPaid={(invId) => {
          handleRecordPayment(invId);
          if (selectedDiamondInvoice && selectedDiamondInvoice.id === invId) {
            setSelectedDiamondInvoice({
              ...selectedDiamondInvoice,
              amountPaid: selectedDiamondInvoice.totalAmount,
              balanceDue: 0,
              status: 'PAID',
            });
          }
        }}
      />

      {checkoutInvoice && (
        <StripeCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setCheckoutInvoice(null);
          }}
          invoiceNumber={checkoutInvoice.invoiceNumber}
          amount={checkoutInvoice.balanceDue}
          clientName={checkoutInvoice.contactName}
          onSuccess={() => {
            handleRecordPayment(checkoutInvoice.id);
            setIsCheckoutOpen(false);
            setCheckoutInvoice(null);
          }}
        />
      )}
    </div>
  );
}
