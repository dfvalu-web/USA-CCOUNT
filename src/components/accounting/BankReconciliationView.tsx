'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  BankReconciliationEngine,
  BankTransactionItem,
  UnreconciledJournalEntry,
} from '@/lib/accounting/bank-reconciliation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Landmark, ArrowRightLeft, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

export function BankReconciliationView() {
  const { locale, t } = useI18n();

  const [bankFeed, setBankFeed] = useState<BankTransactionItem[]>([
    {
      id: 'bt-1',
      date: '2026-08-16',
      amount: 15000,
      description: 'STRIPE PAYOUT RET-ACME CORP TR-8921',
      plaidCategory: 'Income / Wire Payout',
      isReconciled: false,
    },
    {
      id: 'bt-2',
      date: '2026-08-16',
      amount: -4800,
      description: 'ACH DEBIT GUSTO CONTRACTOR 1099 ENG',
      plaidCategory: 'Payroll / Direct Contractor',
      isReconciled: false,
    },
    {
      id: 'bt-3',
      date: '2026-08-15',
      amount: -1250,
      description: 'AWS CLOUD HOSTING DEDICATED SVCS',
      plaidCategory: 'Software & Infrastructure',
      isReconciled: false,
    },
  ]);

  const [ledgerEntries] = useState<UnreconciledJournalEntry[]>([
    {
      id: 'JE-2026-0042',
      date: '2026-08-16',
      memo: 'Client Monthly Retainer - Acme Global Corp',
      amount: 15000,
      type: 'RECEIPT',
    },
    {
      id: 'JE-2026-0041',
      date: '2026-08-16',
      memo: 'Direct Contractor Engineering Fees (1099)',
      amount: 4800,
      type: 'DISBURSEMENT',
    },
    {
      id: 'JE-2026-0040',
      date: '2026-08-15',
      memo: 'AWS Dedicated Client Infrastructure Hosting',
      amount: 1250,
      type: 'DISBURSEMENT',
    },
  ]);

  const matches = BankReconciliationEngine.autoMatchTransactions(bankFeed, ledgerEntries);

  const handleReconcileMatch = (bankId: string, jeId: string) => {
    setBankFeed(
      bankFeed.map((tx) =>
        tx.id === bankId ? { ...tx, isReconciled: true, matchedJournalEntryId: jeId } : tx
      )
    );
  };

  const handleReconcileAll = () => {
    setBankFeed(
      bankFeed.map((tx) => {
        const match = matches.find((m) => m.bankTransactionId === tx.id);
        if (match) {
          return { ...tx, isReconciled: true, matchedJournalEntryId: match.journalEntryId };
        }
        return tx;
      })
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Continuous Bank Reconciliation (Plaid API Ready)</CardTitle>
              <CardDescription>
                AI Auto-Matching Engine • Mercury / Chase Checking (Acct #...4912)
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={() => {}}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Sync Bank Feed
            </Button>
            <Button size="sm" variant="primary" onClick={handleReconcileAll}>
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Auto-Reconcile ({matches.length}) Matches
            </Button>
          </div>
        </div>
      </CardHeader>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-28">Bank Date</TableHead>
            <TableHead>Bank Statement Feed</TableHead>
            <TableHead className="text-right w-32">Bank Amount</TableHead>
            <TableHead className="w-12 text-center"></TableHead>
            <TableHead>Matched General Ledger Record</TableHead>
            <TableHead className="w-28 text-center">Confidence</TableHead>
            <TableHead className="w-32 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bankFeed.map((tx) => {
            const match = matches.find((m) => m.bankTransactionId === tx.id);
            const matchedEntry = match
              ? ledgerEntries.find((e) => e.id === match.journalEntryId)
              : null;

            return (
              <TableRow key={tx.id}>
                <TableCell className="text-slate-400">{formatDate(tx.date, locale)}</TableCell>
                <TableCell>
                  <div className="font-mono text-xs text-white">{tx.description}</div>
                  <div className="text-[10px] text-slate-500">{tx.plaidCategory}</div>
                </TableCell>
                <TableCell
                  className={`text-right font-mono tabular-nums font-bold ${
                    tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrency(tx.amount, 'USD', locale)}
                </TableCell>
                <TableCell className="text-center text-slate-500">
                  <ArrowRightLeft className="w-3.5 h-3.5 mx-auto text-slate-600" />
                </TableCell>
                <TableCell>
                  {matchedEntry ? (
                    <div>
                      <div className="text-xs font-semibold text-emerald-300">
                        {matchedEntry.id}: {matchedEntry.memo}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {matchedEntry.date} • Amount: ${matchedEntry.amount.toFixed(2)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">No direct match found</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {match ? (
                    <Badge variant="success" className="text-[10px]">
                      {match.confidence}% Match
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      Unmatched
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {tx.isReconciled ? (
                    <Badge variant="success" className="text-[10px] py-1">
                      <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Reconciled
                    </Badge>
                  ) : match ? (
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-[11px] h-7 px-2"
                      onClick={() => handleReconcileMatch(tx.id, match.journalEntryId)}
                    >
                      Confirm Match
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-[11px] h-7 px-2">
                      Create Entry
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
