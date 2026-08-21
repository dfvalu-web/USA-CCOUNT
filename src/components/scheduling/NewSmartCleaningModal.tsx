'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  SmartCleaningEngine,
  SmartCleaningBooking,
  ServicePackageTemplate,
  CleaningTaskItem,
} from '@/lib/scheduling/smart-cleaning-engine';
import { ClientEntity, WorkerEntity, EntityDirectoryEngine } from '@/lib/directory/entity-directory-engine';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Gift,
  CheckSquare,
  Square,
  Sparkles,
  DollarSign,
  Users,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  UserCheck,
  Info,
} from 'lucide-react';

interface NewSmartCleaningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: (booking: SmartCleaningBooking) => void;
  onOpenCatalog?: () => void;
  packages?: ServicePackageTemplate[];
  clients?: ClientEntity[];
  workers?: WorkerEntity[];
}

export function NewSmartCleaningModal({
  isOpen,
  onClose,
  onBookingCreated,
  onOpenCatalog,
  packages = SmartCleaningEngine.DEFAULT_PACKAGES,
  clients = EntityDirectoryEngine.INITIAL_CLIENTS,
  workers = EntityDirectoryEngine.INITIAL_WORKERS,
}: NewSmartCleaningModalProps) {
  const { locale, t } = useI18n();

  // Selection states
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || 'cnt-acme');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(packages[4]?.id || 'pkg-standard-residential');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.id || 'wrk-001');

  // Form scheduling states
  const [scheduledDate, setScheduledDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [durationHours, setDurationHours] = useState<number>(2.0);
  const [selectedDiscountId, setSelectedDiscountId] = useState<string>('none');
  const [tasks, setTasks] = useState<CleaningTaskItem[]>(SmartCleaningEngine.DEFAULT_TASKS);

  // Selected Entities
  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) || clients[0],
    [clients, selectedClientId]
  );

  const selectedWorker = useMemo(
    () => workers.find((w) => w.id === selectedWorkerId) || workers[0],
    [workers, selectedWorkerId]
  );

  const currentPackage = useMemo(
    () => packages.find((p) => p.id === selectedPackageId) || packages[0],
    [packages, selectedPackageId]
  );

  // Duration Chips List
  const durationOptions = [
    { hours: 1.0, label: '1h • Leve' },
    { hours: 1.5, label: '1.5h • Padrão' },
    { hours: 2.0, label: '2h • Standard' },
    { hours: 2.5, label: '2.5h • Comercial' },
    { hours: 3.0, label: '3h • Limpeza Geral' },
    { hours: 3.5, label: '3.5h • Deep Clean' },
    { hours: 4.0, label: '4h • Meio Período' },
    { hours: 8.0, label: '8h • Full Day' },
  ];

  // Calculated End Time
  const calculatedEndTime = SmartCleaningEngine.calculateEndTime(startTime, durationHours);

  // Calculate worker labor cost based on inherited pay model
  const calculatedLaborCost = useMemo(() => {
    if (!selectedWorker) return currentPackage?.laborPayout || 50;
    if (selectedWorker.payModel === 'HOURLY') {
      return parseFloat((selectedWorker.basePayRate * durationHours).toFixed(2));
    }
    return selectedWorker.basePayRate;
  }, [selectedWorker, durationHours, currentPackage]);

  // Discount value (including client's inherited referral credit balance if applied)
  let discountVal = 0;
  if (selectedDiscountId === 'referral-20') discountVal = 20;
  else if (selectedDiscountId === 'welcome-30') discountVal = 30;
  else if (selectedDiscountId === 'client-wallet' && selectedClient?.referralCreditBalance) {
    discountVal = selectedClient.referralCreditBalance;
  }

  // Financial Calculations with fully inherited client and worker data
  const financials = useMemo(() => {
    if (!selectedClient || !currentPackage) {
      return {
        grossPrice: 150,
        discountApplied: 0,
        finalBilledPrice: 150,
        laborCost: 50,
        suppliesCost: 12,
        totalCOGS: 62,
        estimatedMarginAmount: 88,
        estimatedMarginPercent: 58.7,
        salesTaxRate: 0.0825,
        salesTaxAmount: 12.38,
        totalWithTax: 162.38,
      };
    }

    return SmartCleaningEngine.calculateBookingFinancials(
      currentPackage.billingPrice,
      calculatedLaborCost,
      currentPackage.suppliesCost,
      discountVal,
      selectedClient.stateCode,
      selectedClient.classification === 'COMMERCIAL_CORPORATE'
    );
  }, [selectedClient, currentPackage, calculatedLaborCost, discountVal]);

  if (!isOpen) return null;

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, isSelected: !t.isSelected } : t))
    );
  };

  const handlePackageChange = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    const pkg = packages.find((p) => p.id === pkgId);
    if (pkg) {
      setDurationHours(pkg.durationHours);
      setTasks(
        tasks.map((t) => ({
          ...t,
          isSelected: pkg.defaultTasks.includes(t.id),
        }))
      );
    }
  };

  const handleSaveBooking = () => {
    if (!selectedClient || !selectedWorker || !currentPackage) return;

    const booking: SmartCleaningBooking = {
      id: `CLN-${Math.floor(100000 + Math.random() * 900000)}`,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      clientPhone: selectedClient.phone,
      propertyAddress: selectedClient.serviceAddress,
      city: selectedClient.city,
      stateCode: selectedClient.stateCode,
      zipCode: selectedClient.zipCode,
      servicePackageId: currentPackage.id,
      servicePackageName: currentPackage.name,
      isCommercial: selectedClient.classification === 'COMMERCIAL_CORPORATE',
      cleanerId: selectedWorker.id,
      cleanerName: `${selectedWorker.legalName} (${selectedWorker.roleTitle})`,
      cleanerPayRate: calculatedLaborCost,
      scheduledDate,
      startTime,
      durationHours,
      endTime: calculatedEndTime,
      tasks: tasks.filter((t) => t.isSelected),
      referralDiscountApplied: discountVal,
      referrerBonusEarned: discountVal > 0 && selectedDiscountId !== 'client-wallet' ? 20 : 0,
      grossPrice: financials.grossPrice,
      finalBilledPrice: financials.finalBilledPrice,
      laborCost: financials.laborCost,
      suppliesCost: financials.suppliesCost,
      estimatedMarginAmount: financials.estimatedMarginAmount,
      estimatedMarginPercent: financials.estimatedMarginPercent,
      salesTaxRate: financials.salesTaxRate,
      salesTaxAmount: financials.salesTaxAmount,
      totalInvoiceAmountWithTax: financials.totalWithTax,
      status: 'AGENDADO',
    };

    onBookingCreated(booking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Novo Agendamento Inteligente (Herança Automática)
              </h3>
              <p className="text-xs text-slate-400">
                Puxa automaticamente dados de Clientes, Endereços, Funcionários e Repasses sem digitação manual
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-slate-950/70 text-xs">
          {/* Row 1: Escolha do Cliente com Herança Completa */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                1. Selecione o Cliente Cadastrado
              </label>
              <Badge variant="success" className="text-[10px]">
                ✓ Herança de Endereço & Impostos Ativa
              </Badge>
            </div>

            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full h-10 rounded-lg bg-slate-950 border border-slate-700 px-3 text-white focus:outline-none focus:border-emerald-500 font-semibold text-sm"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  🏢 {c.name} • {c.serviceAddress}, {c.city} ({c.stateCode}) — {c.classification === 'COMMERCIAL_CORPORATE' ? 'Comercial' : 'Residencial'}
                </option>
              ))}
            </select>

            {/* Inherited Client Details Display Card */}
            {selectedClient && (
              <div className="p-3 rounded-lg bg-slate-950/80 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Local de Atendimento:</span>
                  <div className="text-white font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{selectedClient.serviceAddress}, {selectedClient.city} ({selectedClient.stateCode})</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Contato & Faturamento:</span>
                  <div className="text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-sky-400 shrink-0" />
                    <span>{selectedClient.phone} • {selectedClient.contactPerson}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Perfil Tributário & Saldo:</span>
                  <div className="text-sky-300 font-medium mt-0.5 flex items-center gap-1.5">
                    <span>{selectedClient.stateCode} ({selectedClient.classification === 'COMMERCIAL_CORPORATE' ? 'Comercial 8.25%' : 'Residencial'})</span>
                    {selectedClient.referralCreditBalance > 0 && (
                      <Badge variant="warning" className="text-[9px]">
                        🎁 ${selectedClient.referralCreditBalance} Crédito
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Row 2: Catálogo de Serviços & Escolha do Funcionário com Herança */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Serviço */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  2. Pacote / Serviço
                </label>
                {onOpenCatalog && (
                  <button
                    type="button"
                    onClick={onOpenCatalog}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold underline"
                  >
                    + gerenciar catálogo
                  </button>
                )}
              </div>
              <select
                value={selectedPackageId}
                onChange={(e) => handlePackageChange(e.target.value)}
                className="w-full h-9 rounded-lg bg-slate-950 border border-slate-700 px-3 text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    💼 {pkg.name} (${pkg.billingPrice} • {pkg.durationHours}h)
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">{currentPackage?.description}</p>
            </div>

            {/* Funcionário */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  3. Funcionário / Equipe Alocada
                </label>
                <span className="text-[10px] text-sky-400">Taxa puxada do cadastro</span>
              </div>
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="w-full h-9 rounded-lg bg-slate-950 border border-slate-700 px-3 text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    👤 {w.legalName} ({w.roleTitle}) — {w.payModel === 'HOURLY' ? `$${w.basePayRate}/h` : `$${w.basePayRate}/job`}
                  </option>
                ))}
              </select>
              {selectedWorker && (
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Enquadramento: <strong className="text-white">{selectedWorker.classification}</strong></span>
                  <span>Repasse Calculado: <strong className="text-amber-400 font-mono">${calculatedLaborCost.toFixed(2)}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Data do Serviço & Horário de Início */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Data do Atendimento
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full h-9 rounded-lg bg-slate-900 border border-slate-800 px-3 text-white focus:outline-none focus:border-emerald-500 font-mono font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Horário de Início
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-9 rounded-lg bg-slate-900 border border-slate-800 px-3 text-white focus:outline-none focus:border-emerald-500 font-mono font-medium"
              />
            </div>
          </div>

          {/* Row 4: Duração Estimada & Quick Chips */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Duração Estimada • Banco de Horas
              </span>
              <Badge variant="success" className="font-mono text-[10px]">
                ✨ Atendimento: {startTime} ➔ {calculatedEndTime}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {durationOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.hours}
                  onClick={() => setDurationHours(opt.hours)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    durationHours === opt.hours
                      ? 'bg-emerald-600 text-white font-bold border border-emerald-400 shadow-md shadow-emerald-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {durationHours === opt.hours ? `✓ ${opt.label}` : opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 5: Programa de Descontos & Carteira de Indicação */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/20 space-y-2">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-400" />
              Programa de Descontos & Indicação (&quot;Member-Get-Member&quot;)
            </label>
            <select
              value={selectedDiscountId}
              onChange={(e) => setSelectedDiscountId(e.target.value)}
              className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="none">Nenhum Desconto Aplicado ($0.00)</option>
              {selectedClient?.referralCreditBalance ? (
                <option value="client-wallet">
                  🌟 Abater Saldo de Indicação do Cliente (-${selectedClient.referralCreditBalance.toFixed(2)})
                </option>
              ) : null}
              <option value="referral-20">
                🎁 Indicação de Amigo Novo — Desconto -$20.00
              </option>
              <option value="welcome-30">
                🎉 Cupom Promocional de Boas-Vindas — Desconto -$30.00
              </option>
            </select>
          </div>

          {/* Row 6: Tarefas a Executar (Checklist do Serviço) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Tarefas a Executar (Checklist do Serviço)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {tasks.map((task) => (
                <button
                  type="button"
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-2.5 rounded-lg border text-left flex items-center space-x-2 transition-all ${
                    task.isSelected
                      ? 'bg-emerald-950/50 border-emerald-500/60 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {task.isSelected ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <span className="text-xs truncate font-medium">
                    {locale === 'pt' ? task.namePt : locale === 'es' ? task.nameEs : task.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Live Footer Calculation Bar */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Preço Bruto:</span>
              <span className="text-white font-bold text-sm">
                {formatCurrency(financials.grossPrice, 'USD', locale)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Preço Faturado:</span>
              <span className="text-emerald-400 font-bold text-sm">
                {formatCurrency(financials.finalBilledPrice, 'USD', locale)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Mão de Obra (Repasse):</span>
              <span className="text-amber-400 font-bold text-sm">
                {formatCurrency(financials.laborCost, 'USD', locale)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Margem Estimada:</span>
              <span className="text-sky-400 font-bold text-sm">
                {formatCurrency(financials.estimatedMarginAmount, 'USD', locale)} ({financials.estimatedMarginPercent}%)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button size="sm" variant="primary" onClick={handleSaveBooking}>
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Confirmar Agendamento Inteligente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
