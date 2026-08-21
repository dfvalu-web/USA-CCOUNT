'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface RequestPtoModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableHours: number;
  onRequestSubmitted: (startDate: string, endDate: string, hours: number, reason: string) => void;
}

export function RequestPtoModal({
  isOpen,
  onClose,
  availableHours,
  onRequestSubmitted,
}: RequestPtoModalProps) {
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-16');
  const [hours, setHours] = useState<number>(40);
  const [reason, setReason] = useState('Férias anuais programadas / Recesso');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hours > availableHours) {
      setErrorMsg(`Saldo insuficiente: Você solicitou ${hours}h, mas possui apenas ${availableHours}h disponíveis.`);
      return;
    }
    setErrorMsg(null);
    onRequestSubmitted(startDate, endDate, hours, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Solicitar Folga / Férias (PTO)</h3>
              <p className="text-[10px] text-slate-400">Saldo Disponível: {availableHours} horas ({availableHours / 8} dias úteis)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-600 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Data de Início:</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Data de Término:</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Horas a Descontar:</label>
              <input
                type="number"
                min="4"
                max={availableHours}
                step="4"
                required
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Saldo Restante Estimado:</label>
              <div className="h-8 rounded bg-slate-900 border border-slate-800 px-3 flex items-center font-mono text-slate-300">
                {Math.max(0, availableHours - hours)} horas
              </div>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Motivo / Descrição:</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-500 font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Enviar Solicitação
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
