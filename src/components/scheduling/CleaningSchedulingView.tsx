'use client';

import React, { useState, useEffect } from 'react';
import { useCompany } from '@/lib/company/company-context';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  SmartCleaningEngine,
  SmartCleaningBooking,
  ServicePackageTemplate,
} from '@/lib/scheduling/smart-cleaning-engine';
import { ClientEntity, WorkerEntity, EntityDirectoryEngine } from '@/lib/directory/entity-directory-engine';
import { NewSmartCleaningModal } from './NewSmartCleaningModal';
import { ServiceCatalogModal } from './ServiceCatalogModal';
import { TimesheetApprovalView } from './TimesheetApprovalView';
import { CalendarSyncView } from './CalendarSyncView';
import { SchedulingView } from './SchedulingView';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
  DollarSign,
  MapPin,
  Plus,
  ShieldCheck,
  Zap,
  Gift,
  Package,
  Clock,
  CheckSquare,
  Layers,
  CalendarDays,
} from 'lucide-react';

interface CleaningSchedulingViewProps {
  onPostJobAccounting?: (entry: any) => void;
  clients?: ClientEntity[];
  workers?: WorkerEntity[];
}

export function CleaningSchedulingView({
  onPostJobAccounting,
  clients: initialClients,
  workers: initialWorkers,
}: CleaningSchedulingViewProps) {
  const { locale, t } = useI18n();
  const { activeCompany } = useCompany();

  const companyId = activeCompany?.id || 'cmp-milla-maid-ga';
  const companyName = activeCompany?.legalName || 'Milla Maid Services LLC';

  const [activeClients, setActiveClients] = useState<ClientEntity[]>(() =>
    initialClients || EntityDirectoryEngine.getClientsForCompany(companyId, companyName)
  );
  const [activeWorkers, setActiveWorkers] = useState<WorkerEntity[]>(() =>
    initialWorkers || EntityDirectoryEngine.getWorkersForCompany(companyId, companyName)
  );

  useEffect(() => {
    setActiveClients(EntityDirectoryEngine.getClientsForCompany(companyId, companyName));
    setActiveWorkers(EntityDirectoryEngine.getWorkersForCompany(companyId, companyName));
  }, [companyId, companyName]);

  // Internal Sub-tabs for the Unified Operations Module
  const [activeOperationsTab, setActiveOperationsTab] = useState<'dispatch' | 'timesheets' | 'calendar' | 'retainers'>('dispatch');

  // Modals state
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [packages, setPackages] = useState<ServicePackageTemplate[]>(SmartCleaningEngine.DEFAULT_PACKAGES);

  // Initial Bookings
  const [bookings, setBookings] = useState<SmartCleaningBooking[]>([
    {
      id: 'CLN-849102',
      clientId: 'cnt-acme',
      clientName: 'Austin Tech Hub Suites',
      clientEmail: 'facilities@austintechhub.io',
      clientPhone: '(512) 555-0192',
      propertyAddress: '401 Congress Ave, Suite 1200',
      city: 'Austin',
      stateCode: 'TX',
      zipCode: '78701',
      servicePackageId: 'pkg-commercial-janitorial',
      servicePackageName: 'Manutenção Comercial Corporativa',
      isCommercial: true,
      cleanerId: 'cln-1',
      cleanerName: 'Maria Santos & Carlos Gomez',
      cleanerPayRate: 110.00,
      scheduledDate: '2026-08-21',
      startTime: '18:00',
      durationHours: 3.5,
      endTime: '21:30',
      tasks: SmartCleaningEngine.DEFAULT_TASKS.filter((t) => ['trash', 'vacuum', 'restrooms', 'carpet', 'mopping', 'sanitization'].includes(t.id)),
      referralDiscountApplied: 0,
      referrerBonusEarned: 0,
      grossPrice: 450.00,
      finalBilledPrice: 450.00,
      laborCost: 110.00,
      suppliesCost: 35.00,
      estimatedMarginAmount: 305.00,
      estimatedMarginPercent: 67.8,
      salesTaxRate: 0.0825, // Texas 8.25%
      salesTaxAmount: 37.13,
      totalInvoiceAmountWithTax: 487.13,
      status: 'AGENDADO',
    },
    {
      id: 'CLN-849103',
      clientId: 'cnt-fintech',
      clientName: 'Brickell Financial Group',
      clientEmail: 'ops@brickellfintech.com',
      clientPhone: '(305) 555-0144',
      propertyAddress: '1101 Brickell Ave, Tower B',
      city: 'Miami',
      stateCode: 'FL',
      zipCode: '33131',
      servicePackageId: 'pkg-standard-turnover',
      servicePackageName: 'Limpeza Residencial & Turnover Padrão',
      isCommercial: false,
      cleanerId: 'cln-3',
      cleanerName: 'Ana Silva',
      cleanerPayRate: 110.00,
      scheduledDate: '2026-08-21',
      startTime: '09:00',
      durationHours: 4.0,
      endTime: '13:00',
      tasks: SmartCleaningEngine.DEFAULT_TASKS.filter((t) => ['trash', 'vacuum', 'restrooms', 'carpet', 'mopping', 'dust'].includes(t.id)),
      referralDiscountApplied: 20.00, // Member-Get-Member Welcome Discount
      referrerBonusEarned: 20.00,
      referredByClientId: 'cnt-soho',
      referredByClientName: 'SoHo Design Agency',
      grossPrice: 310.00,
      finalBilledPrice: 290.00,
      laborCost: 110.00,
      suppliesCost: 25.00,
      estimatedMarginAmount: 155.00,
      estimatedMarginPercent: 53.4,
      salesTaxRate: 0, // FL Residential is exempt
      salesTaxAmount: 0,
      totalInvoiceAmountWithTax: 290.00,
      status: 'AGENDADO',
    },
    {
      id: 'CLN-849104',
      clientId: 'cnt-soho',
      clientName: 'SoHo Design Agency',
      clientEmail: 'admin@sohodesign.ny',
      clientPhone: '(212) 555-8831',
      propertyAddress: '540 Broadway, 3rd Floor',
      city: 'New York',
      stateCode: 'NY',
      zipCode: '10012',
      servicePackageId: 'pkg-movein-out',
      servicePackageName: 'Pacote Move-In / Move-Out Premium',
      isCommercial: false,
      cleanerId: 'cln-1',
      cleanerName: 'Maria Santos',
      cleanerPayRate: 140.00,
      scheduledDate: '2026-08-20',
      startTime: '08:30',
      durationHours: 5.0,
      endTime: '13:30',
      tasks: SmartCleaningEngine.DEFAULT_TASKS.filter((t) => ['trash', 'vacuum', 'restrooms', 'oven', 'windows', 'mopping', 'sanitization'].includes(t.id)),
      referralDiscountApplied: 0,
      referrerBonusEarned: 0,
      grossPrice: 380.00,
      finalBilledPrice: 380.00,
      laborCost: 140.00,
      suppliesCost: 30.00,
      estimatedMarginAmount: 210.00,
      estimatedMarginPercent: 55.3,
      salesTaxRate: 0.08875, // NYC 8.875%
      salesTaxAmount: 33.73,
      totalInvoiceAmountWithTax: 413.73,
      status: 'CONCLUIDO_FATURADO',
      invoiceNumber: 'INV-CLN-849104',
      journalEntryId: 'JE-CLN-849104',
    },
  ]);

  const [postMessage, setPostMessage] = useState<string | null>(null);

  const handleBookingCreated = (newBooking: SmartCleaningBooking) => {
    setBookings([newBooking, ...bookings]);
    setPostMessage(
      `Novo agendamento inteligente criado: ${newBooking.id} para ${newBooking.clientName} (${newBooking.servicePackageName}) em ${newBooking.scheduledDate} das ${newBooking.startTime} às ${newBooking.endTime}!`
    );
  };

  const handleCompleteAndPost = (booking: SmartCleaningBooking) => {
    const result = SmartCleaningEngine.executeBookingCompletion(
      '11111111-1111-1111-1111-111111111111',
      booking,
      new Date().toISOString().split('T')[0]
    );

    setBookings(bookings.map((b) => (b.id === booking.id ? result.completedBooking : b)));

    if (onPostJobAccounting) {
      onPostJobAccounting(result.journalEntry);
    }

    let extraMsg = '';
    if (result.updatedReferrerWallet) {
      extraMsg = ` Padrinho (${result.updatedReferrerWallet.clientName}) recebeu +$${result.updatedReferrerWallet.accumulatedCreditBalance} em créditos de indicação!`;
    }

    setPostMessage(
      `Serviço ${booking.id} concluído com sucesso! Fatura #${result.invoice.invoiceNumber} emitida ($${booking.totalInvoiceAmountWithTax.toFixed(2)}) e Razão US GAAP atualizado com partidas dobradas (Receita, Sales Tax, Repasse Mão de Obra e Insumos).${extraMsg}`
    );
  };

  const scheduledCount = bookings.filter((b) => b.status === 'AGENDADO').length;
  const totalGrossRev = bookings.reduce((acc, b) => acc + b.finalBilledPrice, 0);
  const totalTaxAccrued = bookings.reduce((acc, b) => acc + b.salesTaxAmount, 0);
  const totalLaborPayout = bookings.reduce((acc, b) => acc + b.laborCost, 0);

  return (
    <div className="space-y-6">
      {/* Unified Module Header & Sub-Tabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            Central de Agendamento, Despacho & Apontamento de Horas
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestão unificada de ordens de serviço, despacho de equipes, timesheets e sincronização de calendários
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveOperationsTab('dispatch')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              activeOperationsTab === 'dispatch'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Despacho & Limpeza
          </button>
          <button
            onClick={() => setActiveOperationsTab('timesheets')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              activeOperationsTab === 'timesheets'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Apontamento de Horas
          </button>
          <button
            onClick={() => setActiveOperationsTab('calendar')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              activeOperationsTab === 'calendar'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Sincronização iCal/Google
          </button>
          <button
            onClick={() => setActiveOperationsTab('retainers')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              activeOperationsTab === 'retainers'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Retainers & Horas
          </button>
        </div>
      </div>

      {/* Render Sub-Tab: Timesheets */}
      {activeOperationsTab === 'timesheets' && (
        <div className="animate-in fade-in space-y-6">
          <TimesheetApprovalView />
        </div>
      )}

      {/* Render Sub-Tab: Calendar Sync */}
      {activeOperationsTab === 'calendar' && (
        <div className="animate-in fade-in space-y-6">
          <CalendarSyncView />
        </div>
      )}

      {/* Render Sub-Tab: Retainers & Hours */}
      {activeOperationsTab === 'retainers' && (
        <div className="animate-in fade-in space-y-6">
          <SchedulingView />
        </div>
      )}

      {/* Render Sub-Tab: Dispatch & Cleaning Operations */}
      {activeOperationsTab === 'dispatch' && (
        <div className="animate-in fade-in space-y-6">
          {/* Top Banner & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-slate-900 border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Agendamentos Ativos</span>
              <span className="text-xl font-mono font-bold text-white mt-1 block">
                {scheduledCount} Prontos para Execução
              </span>
              <span className="text-[10px] text-slate-500">Texas, Flórida & New York</span>
            </Card>

            <Card className="p-4 bg-slate-900 border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Faturamento Previsto</span>
              <span className="text-xl font-mono font-bold text-emerald-400 mt-1 block">
                {formatCurrency(totalGrossRev, 'USD', locale)}
              </span>
              <span className="text-[10px] text-slate-500">Residencial & Janitorial Corporativo</span>
            </Card>

            <Card className="p-4 bg-slate-900 border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sales Tax Auto-Apurado</span>
              <span className="text-xl font-mono font-bold text-sky-400 mt-1 block">
                {formatCurrency(totalTaxAccrued, 'USD', locale)}
              </span>
              <span className="text-[10px] text-slate-500">TX 8.25% • NY 8.875% • FL 7.0%</span>
            </Card>

            <Card className="p-4 bg-slate-900 border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Repasse da Folha (Mão de Obra)</span>
              <span className="text-xl font-mono font-bold text-amber-400 mt-1 block">
                {formatCurrency(totalLaborPayout, 'USD', locale)}
              </span>
              <span className="text-[10px] text-slate-500">Integrado ao Módulo de DP</span>
            </Card>
          </div>

          {/* Main Dispatch & Scheduling Board */}
          <Card className="border-emerald-500/20 bg-slate-950">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle>Painel Operacional de Despacho, Execução, Fiscal & Contábil</CardTitle>
                    <CardDescription>
                      Conclusão de Serviços com Geração Instantânea de Fatura Fiscal, Sales Tax e Razão US GAAP
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setIsCatalogOpen(true)}>
                    <Package className="w-3.5 h-3.5 mr-1" />
                    Catálogo & Indicações
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => setIsNewBookingOpen(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Novo Agendamento Inteligente
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Notification Banner */}
            {postMessage && (
              <div className="m-4 p-4 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{postMessage}</span>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setPostMessage(null)}>
                  Fechar
                </Button>
              </div>
            )}

            <div className="p-4 space-y-4">
              {bookings.map((booking) => {
                const isCompleted = booking.status === 'CONCLUIDO_FATURADO';

                return (
                  <div
                    key={booking.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-slate-900/60 border-slate-800'
                        : 'bg-slate-900 border-slate-700/80 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Job Info & Location */}
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-emerald-400">{booking.id}</span>
                          <span className="text-sm font-bold text-white">{booking.clientName}</span>
                          <Badge variant={booking.isCommercial ? 'info' : 'outline'} className="text-[10px]">
                            {booking.isCommercial ? 'Comercial Janitorial' : 'Residencial Turnover'}
                          </Badge>
                          <Badge variant={isCompleted ? 'success' : 'warning'} className="text-[10px]">
                            {isCompleted ? '✓ Concluído & Faturado' : '⏳ Agendado / Em Execução'}
                          </Badge>
                          {booking.referralDiscountApplied > 0 && (
                            <Badge variant="success" className="text-[10px] bg-purple-950 text-purple-300 border-purple-800">
                              <Gift className="w-3 h-3 mr-1 inline" /> Desconto Indicação (-${booking.referralDiscountApplied})
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            {booking.scheduledDate} ({booking.startTime} - {booking.endTime} • {booking.durationHours}h)
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {booking.propertyAddress}, {booking.city}, {booking.stateCode} {booking.zipCode}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-500" />
                            Equipe: <strong className="text-slate-200">{booking.cleanerName}</strong> (${booking.cleanerPayRate} payout)
                          </span>
                        </div>

                        {/* Checklist Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">Checklist:</span>
                          {booking.tasks.map((task) => (
                            <span
                              key={task.id}
                              className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-slate-300"
                            >
                              ✓ {task.namePt}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Financial & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:self-center shrink-0">
                        <div className="text-right sm:border-r border-slate-800 sm:pr-4">
                          <div className="text-xs text-slate-400">Total com Sales Tax ({booking.stateCode})</div>
                          <div className="text-base font-mono font-bold text-emerald-400">
                            {formatCurrency(booking.totalInvoiceAmountWithTax, 'USD', locale)}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Margem Est.: <strong className="text-emerald-400">${booking.estimatedMarginAmount.toFixed(2)}</strong> ({booking.estimatedMarginPercent}%)
                          </div>
                        </div>

                        <div>
                          {isCompleted ? (
                            <div className="text-xs text-right space-y-1">
                              <div className="text-emerald-400 font-semibold flex items-center justify-end gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" /> Faturado & Contabilizado
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                Fatura: {booking.invoiceNumber} | JE: {booking.journalEntryId}
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="primary"
                              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/30"
                              onClick={() => handleCompleteAndPost(booking)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1.5" />
                              Concluir Serviço & Faturar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Modals */}
      <NewSmartCleaningModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onBookingCreated={handleBookingCreated}
        packages={packages}
        clients={activeClients}
        workers={activeWorkers}
      />

      <ServiceCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        packages={packages}
        onUpdatePackages={(newPkgs: ServicePackageTemplate[]) => setPackages(newPkgs)}
      />
    </div>
  );
}
