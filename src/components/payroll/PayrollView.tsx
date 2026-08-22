'use client';

import React, { useState, useEffect } from 'react';
import { useCompany } from '@/lib/company/company-context';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  MultiStatePayrollEngine,
  WorkerProfile,
  PaycheckCalculation,
} from '@/lib/payroll/payroll-engine';
import { TaxFormsService, FormW2Data, Form1099NECData } from '@/lib/payroll/tax-forms-service';
import { TaxFormsModal } from './TaxFormsModal';
import { OnboardingW4W9View } from './OnboardingW4W9View';
import { NewWorkerModal } from '@/components/directory/NewWorkerModal';
import { WorkerEntity } from '@/lib/directory/entity-directory-engine';
import { US_STATES_LIST } from '@/lib/company/company-profile-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Users2,
  Play,
  FileText,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Plus,
  Download,
  X,
  UserCheck,
  Building2,
  DollarSign,
  Receipt,
  Layers,
} from 'lucide-react';

interface PayrollViewProps {
  onPostPayrollAccounting?: (entry: any) => void;
}

export function PayrollView({ onPostPayrollAccounting }: PayrollViewProps) {
  const { locale, t } = useI18n();
  const { activeCompany } = useCompany();

  const companyId = activeCompany?.id || 'cmp-milla-maid-ga';
  const companyName = activeCompany?.legalName || 'Milla Maid Services LLC';

  // Internal Sub-tabs
  const [activePayrollTab, setActivePayrollTab] = useState<'payroll' | 'onboarding' | 'tax-reports'>('payroll');

  const getWorkersForPayroll = (cId: string, cName?: string): WorkerProfile[] => {
    const isMilla = cId.includes('milla') || (cName && cName.toLowerCase().includes('milla'));
    const isApexDelaware = cId.includes('003') || cId.includes('cloud') || (cName && cName.toLowerCase().includes('cloud'));

    if (isMilla) {
      return [
        {
          id: 'w-mil-1',
          name: 'Maria Santos',
          email: 'maria.s@millamaidservices.com',
          type: 'W2_EMPLOYEE',
          ssnEin: 'XXX-XX-4819',
          state: 'GA',
          filingStatus: 'SINGLE',
          salaryAnnual: 54000,
          preTaxDeductions: 200,
          is1099: false,
        },
        {
          id: 'w-mil-2',
          name: 'Carlos Gomez',
          email: 'carlos.g@millamaidservices.com',
          type: 'W2_EMPLOYEE',
          ssnEin: 'XXX-XX-6231',
          state: 'GA',
          filingStatus: 'MARRIED_FILING_JOINTLY',
          salaryAnnual: 48000,
          preTaxDeductions: 150,
          is1099: false,
        },
        {
          id: 'w-mil-3',
          name: 'Ana Silva',
          email: 'ana.silva@contractor.io',
          type: '1099_CONTRACTOR',
          ssnEin: 'XX-XXX9081',
          state: 'GA',
          filingStatus: 'SINGLE',
          hourlyRate: 35,
          is1099: true,
        },
      ];
    } else if (isApexDelaware) {
      return [
        {
          id: 'w-cld-1',
          name: 'Lucas Vance',
          email: 'lucas.v@apexcloud.io',
          type: 'W2_EMPLOYEE',
          ssnEin: 'XXX-XX-7819',
          state: 'DE',
          filingStatus: 'SINGLE',
          salaryAnnual: 165000,
          preTaxDeductions: 750,
          is1099: false,
        },
        {
          id: 'w-cld-2',
          name: 'Sofia Chen',
          email: 'sofia.c@apexcloud.io',
          type: 'W2_EMPLOYEE',
          ssnEin: 'XXX-XX-3310',
          state: 'NY',
          filingStatus: 'MARRIED_FILING_JOINTLY',
          salaryAnnual: 145000,
          preTaxDeductions: 600,
          is1099: false,
        },
      ];
    } else {
      return [
        {
          id: 'w-apx-1',
          name: 'Mateo Rodriguez',
          email: 'mateo.r@apexcleanops.com',
          type: 'W2_EMPLOYEE',
          ssnEin: 'XXX-XX-4819',
          state: 'TX',
          filingStatus: 'SINGLE',
          salaryAnnual: 56000,
          preTaxDeductions: 250,
          is1099: false,
        },
        {
          id: 'w-apx-2',
          name: 'Elena Vasquez',
          email: 'elena.v@apexcleanops.com',
          type: 'W2_EMPLOYEE',
          ssnEin: 'XXX-XX-6231',
          state: 'TX',
          filingStatus: 'SINGLE',
          salaryAnnual: 50000,
          preTaxDeductions: 180,
          is1099: false,
        },
      ];
    }
  };

  const [workers, setWorkers] = useState<WorkerProfile[]>(() =>
    getWorkersForPayroll(companyId, companyName)
  );

  useEffect(() => {
    setWorkers(getWorkersForPayroll(companyId, companyName));
  }, [companyId, companyName]);

  // Semi-monthly period calculations
  const [payPeriod] = useState({
    start: '2026-08-01',
    end: '2026-08-15',
    payDate: '2026-08-20',
  });

  const paychecks: PaycheckCalculation[] = workers.map((w) => {
    const gross = w.type === 'W2_EMPLOYEE' ? (w.salaryAnnual || 52000) / 24 : 2800; // 80 hrs @ 35
    return MultiStatePayrollEngine.calculatePaycheck(w, gross);
  });

  const totalGross = paychecks.reduce((acc, p) => acc + p.grossPay, 0);
  const totalNet = paychecks.reduce((acc, p) => acc + p.netPay, 0);
  const totalEmployeeTaxes = paychecks.reduce((acc, p) => acc + p.totalEmployeeWithholdings, 0);
  const totalEmployerTaxes = paychecks.reduce((acc, p) => acc + p.totalEmployerTaxes, 0);
  const totalPayrollCost = paychecks.reduce((acc, p) => acc + p.totalCompanyCost, 0);

  // Modals & Notifications
  const [isNewWorkerOpen, setIsNewWorkerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedW2, setSelectedW2] = useState<FormW2Data | null>(null);
  const [selected1099, setSelected1099] = useState<Form1099NECData | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handleWorkerCreated = (workerEntity: WorkerEntity) => {
    const isW2 = workerEntity.classification.startsWith('W2');
    const annualSalary =
      workerEntity.payModel === 'ANNUAL_SALARY'
        ? workerEntity.basePayRate
        : isW2
        ? workerEntity.basePayRate * 2080
        : undefined;
    const hourlyRate = workerEntity.payModel === 'HOURLY' ? workerEntity.basePayRate : undefined;

    const newWorker: WorkerProfile = {
      id: workerEntity.id,
      name: workerEntity.legalName,
      email: workerEntity.email,
      type: isW2 ? 'W2_EMPLOYEE' : '1099_CONTRACTOR',
      ssnEin: workerEntity.ssnOrTinMasked,
      state: workerEntity.workState,
      filingStatus: 'SINGLE',
      salaryAnnual: annualSalary,
      hourlyRate: hourlyRate,
      is1099: !isW2,
      preTaxDeductions: isW2 ? 250 : 0,
    };

    setWorkers([newWorker, ...workers]);
    setIsNewWorkerOpen(false);
    setNotificationMsg(
      `Colaborador ${newWorker.name} (${isW2 ? 'Funcionário W-2' : 'Contratado 1099'}) cadastrado com sucesso com formulário IRS W-4/W-9, Depósito Direto ACH e integrado à folha de pagamento!`
    );
  };

  const handleProcessPayroll = () => {
    const entry = {
      id: `JE-PAYROLL-${payPeriod.payDate}`,
      date: payPeriod.payDate,
      memo: `Folha de Pagamento Quinzenal Período ${payPeriod.start} a ${payPeriod.end}`,
      amount: totalPayrollCost,
      status: 'POSTED',
      basis: 'ACCRUAL',
    };

    if (onPostPayrollAccounting) {
      onPostPayrollAccounting(entry);
    }

    setNotificationMsg(
      `Folha de Pagamento Quinzenal processada com sucesso! Total Líquido Depositado: ${formatCurrency(totalNet, 'USD', locale)} • Impostos Retidos (FIT/FICA/SIT): ${formatCurrency(totalEmployeeTaxes + totalEmployerTaxes, 'USD', locale)} • Contabilizado no Razão US GAAP!`
    );
  };

  const handleOpenW2 = (worker: WorkerProfile) => {
    const p = paychecks.find((pc) => pc.workerId === worker.id);
    const w2 = TaxFormsService.generateW2(
      worker,
      { ein: 'XX-XXX4912', name: 'Apex CleanOps & Cloud Services LLC', address: 'Wilmington, DE' },
      p ? [p] : [],
      2026
    );
    setSelectedW2(w2);
    setSelected1099(null);
    setIsModalOpen(true);
  };

  const handleOpen1099 = (worker: WorkerProfile) => {
    const p = paychecks.find((pc) => pc.workerId === worker.id);
    const form1099 = TaxFormsService.generate1099NEC(
      worker,
      { ein: 'XX-XXX4912', name: 'Apex CleanOps & Cloud Services LLC' },
      p ? p.grossPay : 2800,
      2026
    );
    setSelected1099(form1099);
    setSelectedW2(null);
    setIsModalOpen(true);
  };

  const handleExportPayrollCsv = () => {
    let csv = `Worker Name,Type,State,Gross Pay,FIT Withheld,FICA Withheld,SIT Withheld,Net Pay,Employer Cost\n`;
    paychecks.forEach((pc) => {
      const worker = workers.find((w) => w.id === pc.workerId);
      const is1099 = worker?.type === '1099_CONTRACTOR';
      csv += `"${pc.workerName}","${is1099 ? '1099' : 'W-2'}","${pc.state}",${pc.grossPay},${pc.employeeFederalIncomeTax},${pc.employeeSocialSecurity + pc.employeeMedicare},${pc.employeeStateIncomeTax},${pc.netPay},${pc.totalCompanyCost}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payroll_run_${payPeriod.payDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotificationMsg('Resumo da Folha de Pagamento exportado com sucesso em CSV!');
  };

  return (
    <div className="space-y-6">
      {/* Module Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users2 className="w-5 h-5 text-emerald-400" />
            Departamento Pessoal, Folha de Pagamento & Formulários IRS (W-2 / 1099)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cálculo multi-estadual de impostos (FIT, FICA, SIT, FUTA/SUTA) e emissão de comprovantes
          </p>
        </div>

        <div className="flex flex-wrap bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActivePayrollTab('payroll')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              activePayrollTab === 'payroll'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Folha Quinzenal
          </button>
          <button
            onClick={() => setActivePayrollTab('onboarding')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              activePayrollTab === 'onboarding'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Admissão W-4 & W-9
          </button>
        </div>
      </div>

      {/* Render Sub-Tab: Onboarding */}
      {activePayrollTab === 'onboarding' && (
        <div className="animate-in fade-in space-y-6">
          <OnboardingW4W9View />
        </div>
      )}

      {/* Render Sub-Tab: Payroll Main */}
      {activePayrollTab === 'payroll' && (
        <div className="animate-in fade-in space-y-6">
          {/* Summary Metrics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-slate-900 border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Salários Brutos (Gross Pay)</span>
              <span className="text-xl font-mono font-bold text-white mt-1 block">
                {formatCurrency(totalGross, 'USD', locale)}
              </span>
              <span className="text-[10px] text-slate-500">{workers.length} Colaboradores Ativos</span>
            </Card>

            <Card className="p-4 bg-slate-900 border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Salário Líquido (Net Payout)</span>
              <span className="text-xl font-mono font-bold text-emerald-400 mt-1 block">
                {formatCurrency(totalNet, 'USD', locale)}
              </span>
              <span className="text-[10px] text-slate-500">Depósito Direto ACH (Conta 1020)</span>
            </Card>

            <Card className="p-4 bg-slate-900 border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Retenção de Impostos (FIT/FICA)</span>
              <span className="text-xl font-mono font-bold text-sky-400 mt-1 block">
                {formatCurrency(totalEmployeeTaxes, 'USD', locale)}
              </span>
              <span className="text-[10px] text-slate-500">Passivo Fiscal (Conta 2150)</span>
            </Card>

            <Card className="p-4 bg-slate-900 border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Custo Total da Empresa</span>
              <span className="text-xl font-mono font-bold text-amber-400 mt-1 block">
                {formatCurrency(totalPayrollCost, 'USD', locale)}
              </span>
              <span className="text-[10px] text-slate-500">Salários + Encargos Patronais</span>
            </Card>
          </div>

          {/* Main Payroll Table Card */}
          <Card className="border-slate-800 bg-slate-950">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <CardTitle>Folha de Pagamento Quinzenal (Semi-Monthly Payroll)</CardTitle>
                    <Badge variant="outline">Período: {payPeriod.start} a {payPeriod.end}</Badge>
                  </div>
                  <CardDescription>
                    Cálculo automatizado com alíquotas estaduais de CA, NY, TX e FL em conformidade IRS
                  </CardDescription>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleExportPayrollCsv}>
                    <Download className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Exportar CSV
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsNewWorkerOpen(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Novo Colaborador
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    className="bg-emerald-600 hover:bg-emerald-500 font-bold"
                    onClick={handleProcessPayroll}
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                    Processar Folha & Contabilizar
                  </Button>
                </div>
              </div>
            </CardHeader>

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
                  <TableHead>Colaborador / Contratado</TableHead>
                  <TableHead className="w-24">Tipo</TableHead>
                  <TableHead className="w-20">Estado</TableHead>
                  <TableHead className="text-right w-28">Salário Bruto</TableHead>
                  <TableHead className="text-right w-28">Impostos Federais</TableHead>
                  <TableHead className="text-right w-24">Imposto Est.</TableHead>
                  <TableHead className="text-right w-28">Salário Líquido</TableHead>
                  <TableHead className="w-36 text-right">Formulário IRS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paychecks.map((pc) => {
                  const worker = workers.find((w) => w.id === pc.workerId)!;

                  return (
                    <TableRow key={pc.workerId} className="hover:bg-slate-900/50 transition-colors">
                      <TableCell>
                        <div className="font-medium text-white">{pc.workerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{worker.ssnEin}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={worker.type === 'W2_EMPLOYEE' ? 'info' : 'warning'} className="text-[10px]">
                          {worker.type === 'W2_EMPLOYEE' ? 'W-2 CLT' : '1099 PJ'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-emerald-400 font-bold">{pc.state}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums font-semibold text-white">
                        {formatCurrency(pc.grossPay, 'USD', locale)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-rose-300">
                        {formatCurrency(pc.employeeFederalIncomeTax + pc.employeeSocialSecurity + pc.employeeMedicare, 'USD', locale)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-rose-300">
                        {pc.employeeStateIncomeTax > 0 ? formatCurrency(pc.employeeStateIncomeTax, 'USD', locale) : '0% (TX/FL)'}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums font-bold text-emerald-400">
                        {formatCurrency(pc.netPay, 'USD', locale)}
                      </TableCell>
                      <TableCell className="text-right">
                        {worker.type === 'W2_EMPLOYEE' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[11px] h-7 px-2"
                            onClick={() => handleOpenW2(worker)}
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Form W-2
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[11px] h-7 px-2 text-amber-400 hover:text-amber-300"
                            onClick={() => handleOpen1099(worker)}
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Form 1099
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Modal: Novo Colaborador (W-4 / W-9 / ACH / Pre-Tax Benefits) */}
      <NewWorkerModal
        isOpen={isNewWorkerOpen}
        onClose={() => setIsNewWorkerOpen(false)}
        onWorkerCreated={handleWorkerCreated}
      />

      {/* Tax Forms Modal (W-2 / 1099-NEC) */}
      <TaxFormsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        w2Data={selectedW2}
        necData={selected1099}
      />
    </div>
  );
}
