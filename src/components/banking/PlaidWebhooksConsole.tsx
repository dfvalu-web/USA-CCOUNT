'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { PlaidWebhookHandler, IngestedTransactionEvent } from '@/lib/banking/plaid-webhooks';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Radio, RefreshCw, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export function PlaidWebhooksConsole() {
  const { locale, t } = useI18n();

  const [webhookLog, setWebhookLog] = useState<IngestedTransactionEvent[]>([
    {
      transactionId: 'tx-plaid-991',
      accountId: 'acc-mercury-4912',
      date: '2026-08-20',
      amount: 15000,
      merchantName: 'STRIPE PAYOUT RET-ACME CORP',
      category: ['Transfer', 'Deposit'],
      pending: false,
      suggestedGlAccountCode: '1200',
      suggestedGlAccountName: 'Accounts Receivable (A/R)',
      reconciliationConfidence: 99,
    },
    {
      transactionId: 'tx-plaid-990',
      accountId: 'acc-mercury-4912',
      date: '2026-08-19',
      amount: -1420.50,
      merchantName: 'AMAZON WEB SERVICES US-EAST',
      category: ['Software', 'Cloud Infrastructure'],
      pending: false,
      suggestedGlAccountCode: '5030',
      suggestedGlAccountName: 'Direct Project Cloud Infrastructure',
      reconciliationConfidence: 98,
    },
    {
      transactionId: 'tx-plaid-989',
      accountId: 'acc-mercury-4912',
      date: '2026-08-18',
      amount: -4800,
      merchantName: 'GUSTO PAYROLL ACH DEBIT',
      category: ['Payroll', 'Services'],
      pending: false,
      suggestedGlAccountCode: '2210',
      suggestedGlAccountName: 'Federal Payroll Taxes & Wages Clearing',
      reconciliationConfidence: 100,
    },
  ]);

  const handleSimulateWebhook = () => {
    const newEvents = PlaidWebhookHandler.processTransactionSync([
      {
        transaction_id: `tx-plaid-${Math.floor(1000 + Math.random() * 9000)}`,
        account_id: 'acc-mercury-4912',
        date: new Date().toISOString().split('T')[0],
        amount: -480, // Plaid outflow $480
        name: 'GITHUB ENTERPRISE SEATS',
        category: ['Software', 'SaaS'],
        pending: false,
      },
    ]);

    setWebhookLog([newEvents[0], ...webhookLog]);
  };

  return (
    <Card className="border-sky-500/20 bg-slate-950">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Open Banking Real-Time Webhook Feed (Plaid / Teller)</CardTitle>
              <CardDescription>
                Zero-Latency Transaction Ingestion & Vector Account Auto-Classification
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="success" className="animate-pulse">
              ● Live Webhook Listener Active
            </Badge>
            <Button size="sm" variant="outline" onClick={handleSimulateWebhook}>
              <Zap className="w-3.5 h-3.5 mr-1" />
              Simulate Inbound Event
            </Button>
          </div>
        </div>
      </CardHeader>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-28">Timestamp</TableHead>
            <TableHead>Plaid Inbound Entity</TableHead>
            <TableHead className="text-right w-28">Amount</TableHead>
            <TableHead>Auto-Classified GL Account</TableHead>
            <TableHead className="w-28 text-center">Confidence</TableHead>
            <TableHead className="w-24 text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {webhookLog.map((tx) => (
            <TableRow key={tx.transactionId}>
              <TableCell className="font-mono text-[11px] text-slate-400">
                {formatDate(tx.date, locale)}
              </TableCell>
              <TableCell>
                <div className="font-semibold text-white">{tx.merchantName}</div>
                <div className="text-[10px] text-slate-500 font-mono">{tx.transactionId}</div>
              </TableCell>
              <TableCell
                className={`text-right font-mono tabular-nums font-bold ${
                  tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatCurrency(tx.amount, 'USD', locale)}
              </TableCell>
              <TableCell>
                <div className="font-medium text-emerald-300">
                  {tx.suggestedGlAccountCode} — {tx.suggestedGlAccountName}
                </div>
                <div className="text-[10px] text-slate-500">Auto-mapped via semantic clustering</div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="success" className="text-[10px]">
                  {tx.reconciliationConfidence}%
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-800">
                  Ingested
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
