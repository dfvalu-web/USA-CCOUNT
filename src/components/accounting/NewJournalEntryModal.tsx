'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { US_GAAP_SERVICE_CHART_OF_ACCOUNTS } from '@/lib/accounting/chart-of-accounts-template';
import { DoubleEntryLedgerEngine } from '@/lib/accounting/ledger-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { X, Plus, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/i18n/formatters';

interface NewJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (entry: unknown) => void;
}

interface LineItem {
  id: string;
  accountId: string;
  debit: string;
  credit: string;
  description: string;
}

export function NewJournalEntryModal({ isOpen, onClose, onSuccess }: NewJournalEntryModalProps) {
  const { locale, t, basis } = useI18n();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState('');
  const [lines, setLines] = useState<LineItem[]>([
    { id: '1', accountId: '1010', debit: '15000', credit: '0', description: 'Retainer deposit received from client' },
    { id: '2', accountId: '2100', debit: '0', credit: '15000', description: 'Unearned retainer liability recorded' },
  ]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalDebit = lines.reduce((acc, l) => acc + (parseFloat(l.debit) || 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + (parseFloat(l.credit) || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = totalDebit > 0 && totalCredit > 0 && Math.abs(totalDebit - totalCredit) < 0.001;

  const handleAddLine = () => {
    setLines([
      ...lines,
      {
        id: Math.random().toString(36).substring(7),
        accountId: US_GAAP_SERVICE_CHART_OF_ACCOUNTS[0].code,
        debit: '0',
        credit: '0',
        description: '',
      },
    ]);
  };

  const handleRemoveLine = (id: string) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((l) => l.id !== id));
  };

  const handleUpdateLine = (id: string, field: keyof LineItem, value: string) => {
    setLines(
      lines.map((l) => {
        if (l.id !== id) return l;
        if (field === 'debit' && parseFloat(value) > 0) {
          return { ...l, debit: value, credit: '0' };
        }
        if (field === 'credit' && parseFloat(value) > 0) {
          return { ...l, credit: value, debit: '0' };
        }
        return { ...l, [field]: value };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formattedLines = lines.map((l) => ({
      accountId: l.accountId,
      debit: parseFloat(l.debit) || 0,
      credit: parseFloat(l.credit) || 0,
      description: l.description,
    }));

    const validation = DoubleEntryLedgerEngine.validateJournalEntry({
      organizationId: '11111111-1111-1111-1111-111111111111',
      date: new Date(date),
      memo,
      basis,
      lines: formattedLines,
    });

    if (!validation.isValid) {
      setError(validation.error || 'Erro na validação do lançamento contábil.');
      return;
    }

    if (onSuccess) {
      onSuccess(validation.data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl rounded-xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {t('accounting.newEntry')}
              <Badge variant={isBalanced ? 'success' : 'danger'}>
                {isBalanced ? t('common.balanced') : t('common.unbalanced')}
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              {t('accounting.ruleDebitCredit')} (US GAAP)
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t('common.date')}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-9 rounded-md bg-slate-800 border border-slate-700 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t('accounting.memo')}
              </label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Ex: Monthly client consulting retainer deposit received"
                className="w-full h-9 rounded-md bg-slate-800 border border-slate-700 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Journal Lines (Partidas Dobradas)
              </span>
              <Button type="button" variant="outline" size="sm" onClick={handleAddLine}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Line
              </Button>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-2.5 text-left w-64">{t('accounting.accountName')}</th>
                    <th className="p-2.5 text-left">{t('accounting.memo')}</th>
                    <th className="p-2.5 text-right w-36">{t('accounting.debit')} ($)</th>
                    <th className="p-2.5 text-right w-36">{t('accounting.credit')} ($)</th>
                    <th className="p-2.5 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                  {lines.map((line) => (
                    <tr key={line.id} className="hover:bg-slate-800/40">
                      <td className="p-2">
                        <select
                          value={line.accountId}
                          onChange={(e) => handleUpdateLine(line.id, 'accountId', e.target.value)}
                          className="w-full h-8 rounded bg-slate-800 border border-slate-700 px-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        >
                          {US_GAAP_SERVICE_CHART_OF_ACCOUNTS.map((acc) => (
                            <option key={acc.code} value={acc.code}>
                              {acc.code} - {locale === 'pt' ? acc.namePt : locale === 'es' ? acc.nameEs : acc.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={line.description}
                          onChange={(e) => handleUpdateLine(line.id, 'description', e.target.value)}
                          placeholder="Line description"
                          className="w-full h-8 rounded bg-slate-800 border border-slate-700 px-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={line.debit}
                          onChange={(e) => handleUpdateLine(line.id, 'debit', e.target.value)}
                          className="w-full h-8 rounded bg-slate-800 border border-slate-700 px-2 text-right font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={line.credit}
                          onChange={(e) => handleUpdateLine(line.id, 'credit', e.target.value)}
                          className="w-full h-8 rounded bg-slate-800 border border-slate-700 px-2 text-right font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(line.id)}
                          disabled={lines.length <= 2}
                          className="text-slate-500 hover:text-rose-400 disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Balancing verification footer */}
                  <tr className="bg-slate-950 font-bold border-t border-slate-700">
                    <td colSpan={2} className="p-2.5 text-slate-300 uppercase">
                      Totals
                    </td>
                    <td className="p-2.5 text-right font-mono text-emerald-400 text-xs">
                      {formatCurrency(totalDebit, 'USD', locale)}
                    </td>
                    <td className="p-2.5 text-right font-mono text-emerald-400 text-xs">
                      {formatCurrency(totalCredit, 'USD', locale)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Validation Banner */}
          <div
            className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              isBalanced
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {isBalanced ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Balanced! Ready to post to General Ledger.</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>
                    Discrepancy: Difference of ${difference.toFixed(2)}. Debits must equal credits.
                  </span>
                </>
              )}
            </div>
            <span className="font-mono font-bold">
              {isBalanced ? '✓ Δ = $0.00' : `Δ = $${difference.toFixed(2)}`}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={!isBalanced}>
              {t('accounting.postEntry')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
