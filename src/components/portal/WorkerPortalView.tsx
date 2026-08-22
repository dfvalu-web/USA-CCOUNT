'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  WorkerPortalEngine,
  WorkerSelfServiceProfile,
  WorkerPaystub,
} from '@/lib/portal/worker-portal-engine';
import { EntityDirectoryEngine, WorkerEntity } from '@/lib/directory/entity-directory-engine';
import { RequestPtoModal } from './RequestPtoModal';
import { PaystubDetailModal } from './PaystubDetailModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  User,
  Download,
  Calendar,
  CheckCircle2,
  DollarSign,
  Clock,
  FileText,
  Building2,
  ShieldCheck,
  Eye,
  Briefcase,
} from 'lucide-react';

export function WorkerPortalView() {
  const { locale, t } = useI18n();

  // Directory Workers for switching self-service views
  const directoryWorkers = EntityDirectoryEngine.INITIAL_WORKERS;
  const [selectedWorkerId, setSelectedWorkerId] = useState('w-1');

  const [profile, setProfile] = useState<WorkerSelfServiceProfile>(
    WorkerPortalEngine.getWorkerProfile('w-1')
  );

  // Modals
  const [isPtoModalOpen, setIsPtoModalOpen] = useState(false);
  const [selectedPaystub, setSelectedPaystub] = useState<WorkerPaystub | null>(null);
  const [ptoMessage, setPtoMessage] = useState<string | null>(null);

  const handleWorkerSwitch = (workerId: string) => {
    setSelectedWorkerId(workerId);
    const selected = directoryWorkers.find((w) => w.id === workerId);
    if (selected) {
      const isW2 = selected.classification.startsWith('W2');
      const basePay = selected.payModel === 'ANNUAL_SALARY' ? selected.basePayRate / 24 : selected.basePayRate * 80;

      setProfile({
        workerId: selected.id,
        name: selected.legalName,
        email: selected.email,
        workerType: isW2 ? 'W2_EMPLOYEE' : 'CONTRACTOR_1099',
        title: selected.roleTitle,
        pto: {
          totalAccruedHours: selected.ptoBalanceHours + 40,
          usedHours: 40,
          availableHours: selected.ptoBalanceHours,
          pendingRequests: [],
        },
        paystubs: [
          {
            id: `ps-${selected.id}-01`,
            payPeriod: '2026-08-01 to 2026-08-15',
            payDate: '2026-08-15',
            grossPay: basePay,
            totalWithholdings: isW2 ? basePay * 0.23 : 0,
            netPay: isW2 ? basePay * 0.77 : basePay,
            directDepositAccountLast4: selected.bankAccountNumberMasked?.slice(-4) || '4102',
          },
          {
            id: `ps-${selected.id}-02`,
            payPeriod: '2026-07-16 to 2026-07-31',
            payDate: '2026-07-31',
            grossPay: basePay,
            totalWithholdings: isW2 ? basePay * 0.23 : 0,
            netPay: isW2 ? basePay * 0.77 : basePay,
            directDepositAccountLast4: selected.bankAccountNumberMasked?.slice(-4) || '4102',
          },
        ],
      });
    }
  };

  const handlePtoSubmitted = (startDate: string, endDate: string, hours: number, reason: string) => {
    const res = WorkerPortalEngine.requestPto(profile, startDate, endDate, hours);
    if (res.success && res.updatedProfile) {
      setProfile(res.updatedProfile);
      setPtoMessage(
        `Solicitação de ${hours} horas de folha (PTO) de ${startDate} a ${endDate} enviada com sucesso para aprovação da gerência!`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Worker Selector Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs">
          <User className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-semibold">Simular Acesso do Colaborador (Worker Self-Service):</span>
        </div>
        <select
          value={selectedWorkerId}
          onChange={(e) => handleWorkerSwitch(e.target.value)}
          className="h-8 rounded bg-slate-950 border border-slate-700 px-3 text-xs text-white font-medium"
        >
          <option value="w-1">Sarah Jenkins — Principal Cloud Architect (W-2)</option>
          {directoryWorkers.map((w) => (
            <option key={w.id} value={w.id}>
              {w.legalName} — {w.roleTitle} ({w.classification.startsWith('W2') ? 'W-2' : '1099'})
            </option>
          ))}
        </select>
      </div>

      {/* Top Profile Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold text-xl flex items-center justify-center border border-emerald-500/30">
            {profile.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {profile.name}
              <Badge variant={profile.workerType === 'W2_EMPLOYEE' ? 'success' : 'warning'} className="text-[10px]">
                {profile.workerType === 'W2_EMPLOYEE' ? 'W-2 Full-Time (CLT US)' : '1099 Independent Contractor'}
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              {profile.title} • {profile.email} • Direct Deposit ACH: ••••{profile.paystubs[0]?.directDepositAccountLast4 || '4102'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Saldo de Férias / PTO</span>
            <span className="text-base font-mono font-bold text-emerald-400">
              {profile.pto.availableHours} horas ({profile.pto.availableHours / 8} dias úteis)
            </span>
          </div>
          <Button
            size="sm"
            variant="primary"
            className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
            onClick={() => setIsPtoModalOpen(true)}
          >
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Solicitar Folga (PTO)
          </Button>
        </div>
      </div>

      {ptoMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{ptoMessage}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setPtoMessage(null)}>
            Fechar
          </Button>
        </div>
      )}

      {/* Paystubs History */}
      <Card className="border-emerald-500/20 bg-slate-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <div>
                <CardTitle className="text-sm">Histórico de Contracheques & Depósitos Diretos (Paystubs)</CardTitle>
                <CardDescription>
                  Demonstrativos Quinzenais de Remuneração Bruta, Retenções Fiscais e Depósitos ACH
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Direct Deposit NACHA: ••••{profile.paystubs[0]?.directDepositAccountLast4 || '4102'}
            </Badge>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Data do Pagamento</TableHead>
              <TableHead>Período de Competência</TableHead>
              <TableHead className="text-right w-32">Salário Bruto</TableHead>
              <TableHead className="text-right w-36">Impostos Retidos (FIT/FICA)</TableHead>
              <TableHead className="text-right w-32">Depósito Líquido</TableHead>
              <TableHead className="w-32 text-center">Demonstrativo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profile.paystubs.map((ps) => (
              <TableRow key={ps.id} className="hover:bg-slate-900/50">
                <TableCell className="font-mono text-xs text-white font-semibold">
                  {formatDate(ps.payDate, locale)}
                </TableCell>
                <TableCell className="text-xs text-slate-300">{ps.payPeriod}</TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-200">
                  {formatCurrency(ps.grossPay, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-rose-400">
                  -{formatCurrency(ps.totalWithholdings, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums font-bold text-emerald-400 text-sm">
                  {formatCurrency(ps.netPay, 'USD', locale)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] px-2 text-sky-400 hover:text-sky-300"
                      onClick={() => setSelectedPaystub(ps)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Ver Holerite
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] px-2 text-emerald-400 hover:text-emerald-300 border-emerald-500/30"
                      onClick={() => {
                        const msg = `Olá ${profile.name}, seu holerite do período ${ps.payPeriod} no valor líquido de ${formatCurrency(ps.netPay, 'USD', locale)} já está disponível no portal do colaborador!`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      title="Enviar notificação por WhatsApp"
                    >
                      📲 Notificar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* PTO History & Requests */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <div>
              <CardTitle className="text-sm">Solicitações de Folgas & Férias (PTO Requests)</CardTitle>
              <CardDescription>Acompanhamento de status de aprovação de folgas remuneradas</CardDescription>
            </div>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período Solicitado</TableHead>
              <TableHead className="w-32 text-right">Horas</TableHead>
              <TableHead className="w-36 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profile.pto.pendingRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-xs text-slate-500">
                  Nenhuma solicitação pendente no momento.
                </TableCell>
              </TableRow>
            ) : (
              profile.pto.pendingRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="text-xs text-slate-300 font-medium">
                    {formatDate(req.startDate, locale)} até {formatDate(req.endDate, locale)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-white">
                    {req.hours} horas
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={req.status === 'APPROVED' ? 'success' : 'warning'} className="text-[10px]">
                      {req.status === 'APPROVED' ? '✓ Aprovado' : 'Aguardando Gestor'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Modal: Solicitar PTO */}
      <RequestPtoModal
        isOpen={isPtoModalOpen}
        onClose={() => setIsPtoModalOpen(false)}
        availableHours={profile.pto.availableHours}
        onRequestSubmitted={handlePtoSubmitted}
      />

      {/* Modal: Detalhes do Holerite */}
      <PaystubDetailModal
        isOpen={!!selectedPaystub}
        onClose={() => setSelectedPaystub(null)}
        paystub={selectedPaystub}
        worker={profile}
      />
    </div>
  );
}
