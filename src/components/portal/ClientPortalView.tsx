'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  ClientPortalEngine,
  ClientPortalProfile,
  ClientInvoiceItem,
} from '@/lib/portal/client-portal-engine';
import { ClientPayInvoiceModal } from './ClientPayInvoiceModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Globe,
  Receipt,
  CreditCard,
  Download,
  CheckCircle2,
  Building2,
  ShieldCheck,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';

export function ClientPortalView() {
  const { locale, t } = useI18n();

  const [profiles, setProfiles] = useState<ClientPortalProfile[]>(ClientPortalEngine.INITIAL_PROFILES);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(profiles[0]?.id || 'cli-acme-global');
  const currentProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];

  const [selectedInvoiceToPay, setSelectedInvoiceToPay] = useState<ClientInvoiceItem | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handlePaymentSuccess = (invoiceId: string, paymentMethod: 'STRIPE_ACH' | 'CREDIT_CARD' | 'WIRE') => {
    const updated = ClientPortalEngine.processInvoicePayment(currentProfile.id, invoiceId, paymentMethod);
    setProfiles(updated);
    setNotificationMsg(
      `🎉 Pagamento da fatura ${invoiceId} recebido e liquidado com sucesso via ${paymentMethod.replace(/_/g, ' ')}! Recibo emitido.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Portal do Cliente B2B (Autoatendimento & Faturamento)
              <Badge variant="info" className="text-[10px]">
                Magic Link Ativo
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              Área do cliente para consulta de demonstrativos de serviço, liquidação de faturas via Stripe ACH e download de recibos
            </p>
          </div>
        </div>

        {/* Client Profile Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-xs font-semibold">Visualizando como:</span>
          <select
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="h-8 rounded-xl bg-slate-900 border border-slate-700 px-3 text-xs text-white font-bold"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.companyName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setNotificationMsg(null)}>
            Fechar
          </Button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Retainer Mensal Contratado</span>
          <span className="text-2xl font-bold font-mono text-white block">
            {formatCurrency(currentProfile.activeRetainerMonthly, 'USD', locale)}
            <span className="text-xs text-slate-500 font-normal"> / mês</span>
          </span>
          <span className="text-[10px] text-emerald-400 block font-medium">● Contrato Ativo & Recorrente</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Pago no Ano (YTD)</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 block">
            {formatCurrency(currentProfile.totalPaidYtd, 'USD', locale)}
          </span>
          <span className="text-[10px] text-slate-500 block">Adimplência 100%</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Saldo em Aberto (A Pagar)</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {formatCurrency(currentProfile.totalOutstandingBalance, 'USD', locale)}
            </span>
            <Badge variant={currentProfile.totalOutstandingBalance > 0 ? 'warning' : 'success'} className="text-[10px]">
              {currentProfile.totalOutstandingBalance > 0 ? 'Fatura Pendente' : 'Quitado'}
            </Badge>
          </div>
          <span className="text-[10px] text-slate-500 block">Vencimento próximo</span>
        </div>
      </div>

      {/* Invoices Table Card */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Faturas & Demonstrativos de Cobrança</CardTitle>
              <CardDescription>
                Faturas emitidas para {currentProfile.companyName} • Contato: {currentProfile.contactName}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {currentProfile.invoices.length} Faturas Registradas
            </Badge>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Número da Fatura</TableHead>
              <TableHead>Descrição dos Serviços Prestados</TableHead>
              <TableHead className="w-28">Emissão</TableHead>
              <TableHead className="w-28">Vencimento</TableHead>
              <TableHead className="text-right w-32">Valor Total</TableHead>
              <TableHead className="w-28 text-center">Status</TableHead>
              <TableHead className="w-40 text-center">Ações de Pagamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProfile.invoices.map((inv) => (
              <TableRow key={inv.id} className="hover:bg-slate-900/50">
                <TableCell className="font-mono font-bold text-sky-400 text-xs">{inv.invoiceNumber}</TableCell>
                <TableCell>
                  <div className="text-white text-xs font-semibold">{inv.serviceDescription}</div>
                  {inv.paymentMethod && (
                    <div className="text-[10px] text-slate-400">
                      Liquidado via {inv.paymentMethod.replace(/_/g, ' ')}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-xs text-slate-300 font-mono">{formatDate(inv.issueDate, locale)}</TableCell>
                <TableCell className="text-xs text-slate-300 font-mono">{formatDate(inv.dueDate, locale)}</TableCell>
                <TableCell className="text-right font-mono font-bold text-white text-xs">
                  {formatCurrency(inv.totalAmount, 'USD', locale)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={inv.status === 'PAID' ? 'success' : 'warning'} className="text-[10px]">
                    {inv.status === 'PAID' ? '✓ Pago' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {inv.status === 'OPEN' ? (
                    <Button
                      size="sm"
                      variant="primary"
                      className="h-7 text-[11px] px-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold"
                      onClick={() => setSelectedInvoiceToPay(inv)}
                    >
                      <CreditCard className="w-3 h-3 mr-1" />
                      Pagar Agora
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="h-7 text-[11px] px-2 text-slate-300">
                      <Download className="w-3 h-3 mr-1" />
                      Recibo
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal Checkout de Fatura */}
      <ClientPayInvoiceModal
        isOpen={!!selectedInvoiceToPay}
        onClose={() => setSelectedInvoiceToPay(null)}
        invoice={selectedInvoiceToPay}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
