'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { BudgetVarianceEngine, DepartmentBudgetGoal } from '@/lib/budget/budget-variance-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  Target,
  DollarSign,
  CheckCircle2,
  Building2,
} from 'lucide-react';

interface NewBudgetGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBudgetCreated: (goal: DepartmentBudgetGoal) => void;
}

export function NewBudgetGoalModal({
  isOpen,
  onClose,
  onBudgetCreated,
}: NewBudgetGoalModalProps) {
  const { locale } = useI18n();

  const accountsList = [
    { code: '5010', name: 'Direct Labor Salaries (W-2 Wages)' },
    { code: '5020', name: '1099 Independent Contractor Fees' },
    { code: '5030', name: 'Cleaning Chemicals & Field Supplies' },
    { code: '6010', name: 'Cloud Infrastructure & SaaS Software' },
    { code: '6020', name: 'Facility Lease & Office Rent' },
    { code: '6030', name: 'Commercial General Liability Insurance' },
    { code: '6040', name: 'Sales & Digital Marketing Expenses' },
    { code: '6050', name: 'Legal, CPA & Professional Advisory Fees' },
  ];

  const [departmentName, setDepartmentName] = useState('Sales & Digital Marketing');
  const [selectedAccountCode, setSelectedAccountCode] = useState(accountsList[0].code);
  const [annualBudget, setAnnualBudget] = useState<number>(60000);
  const [responsibleLeader, setResponsibleLeader] = useState('Elena Rostova (Head of Growth)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const account = accountsList.find((a) => a.code === selectedAccountCode) || accountsList[0];

    const newGoal = BudgetVarianceEngine.createBudgetGoal(
      departmentName,
      account.code,
      account.name,
      annualBudget,
      responsibleLeader
    );

    onBudgetCreated(newGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Nova Meta Orçamentária por Centro de Custo</h3>
              <p className="text-[10px] text-slate-400">Definição de Teto de Gastos Anual & Mensal</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Departamento / Centro de Custo:</label>
            <input
              type="text"
              required
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Conta de Despesa US GAAP Vinculada:</label>
            <select
              value={selectedAccountCode}
              onChange={(e) => setSelectedAccountCode(e.target.value)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
            >
              {accountsList.map((acc) => (
                <option key={acc.code} value={acc.code}>
                  {acc.code} — {acc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Orçamento Anual Aprovado ($ USD):</label>
            <input
              type="number"
              min="1000"
              step="5000"
              required
              value={annualBudget}
              onChange={(e) => setAnnualBudget(parseFloat(e.target.value) || 0)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Orçamento mensal equivalente: ${(annualBudget / 12).toFixed(2)} / mês
            </span>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Líder / Gestor Responsável:</label>
            <input
              type="text"
              required
              value={responsibleLeader}
              onChange={(e) => setResponsibleLeader(e.target.value)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-500 font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Salvar Meta Orçamentária
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
