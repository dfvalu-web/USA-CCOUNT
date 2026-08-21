'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  TimeTrackingEngine,
  TimeEntryDTO,
  ClientRetainerAccount,
} from '@/lib/scheduling/time-tracking-engine';
import { RetainerAmortizationEngine } from '@/lib/scheduling/retainer-amortization-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, Plus, Layers, Sparkles, CheckCircle2, Play, AlertCircle } from 'lucide-react';

export function SchedulingView() {
  const { locale, t } = useI18n();

  const [retainers, setRetainers] = useState<ClientRetainerAccount[]>([
    {
      clientId: 'c-1',
      clientName: 'Acme Global Corp',
      totalRetainerDeposited: 15000,
      unearnedBalanceRemaining: 15000,
      totalAmortizedToDate: 0,
      monthlyAllocationAmount: 15000,
      effectiveHourlyRate: 250,
    },
    {
      clientId: 'c-2',
      clientName: 'Horizon Fintech Labs',
      totalRetainerDeposited: 20000,
      unearnedBalanceRemaining: 8500,
      totalAmortizedToDate: 11500,
      monthlyAllocationAmount: 10000,
      effectiveHourlyRate: 220,
    },
  ]);

  const [timeEntries, setTimeEntries] = useState<TimeEntryDTO[]>([
    {
      id: 'te-1',
      clientId: 'c-1',
      clientName: 'Acme Global Corp',
      projectId: 'p-101',
      projectName: 'Cloud Architecture Modernization',
      workerId: 'w-1',
      workerName: 'Sarah Jenkins',
      date: '2026-08-18',
      hours: 24,
      hourlyRate: 250,
      isBillable: true,
      description: 'Terraform AWS multi-region infrastructure provisioning',
      status: 'APPROVED',
    },
    {
      id: 'te-2',
      clientId: 'c-1',
      clientName: 'Acme Global Corp',
      projectId: 'p-101',
      projectName: 'Cloud Architecture Modernization',
      workerId: 'w-2',
      workerName: 'Michael Chang',
      date: '2026-08-19',
      hours: 16,
      hourlyRate: 250,
      isBillable: true,
      description: 'Kubernetes ingress controller security hardening',
      status: 'APPROVED',
    },
    {
      id: 'te-3',
      clientId: 'c-2',
      clientName: 'Horizon Fintech Labs',
      projectId: 'p-102',
      projectName: 'Core API Integration',
      workerId: 'w-4',
      workerName: 'Elena Rostova',
      date: '2026-08-17',
      hours: 30,
      hourlyRate: 220,
      isBillable: true,
      description: 'Payment gateway webhooks and idempotency checks',
      status: 'APPROVED',
    },
    {
      id: 'te-4',
      clientId: 'c-1',
      clientName: 'Acme Global Corp',
      projectId: 'p-101',
      projectName: 'Internal Dev Sync',
      workerId: 'w-1',
      workerName: 'Sarah Jenkins',
      date: '2026-08-15',
      hours: 4,
      hourlyRate: 0,
      isBillable: false,
      description: 'Sprint planning and architecture review meeting',
      status: 'APPROVED',
    },
  ]);

  const [amortizationLog, setAmortizationLog] = useState<string | null>(null);

  const metrics = TimeTrackingEngine.calculateBillableTotal(timeEntries);

  const handleAmortizeRetainer = (clientId: string) => {
    const ret = retainers.find((r) => r.clientId === clientId);
    if (!ret) return;

    const result = RetainerAmortizationEngine.amortizeRetainerForPeriod(
      '11111111-1111-1111-1111-111111111111',
      ret,
      timeEntries,
      '2026-08-20'
    );

    // Update retainer balance
    setRetainers(
      retainers.map((r) =>
        r.clientId === clientId
          ? {
              ...r,
              unearnedBalanceRemaining: result.remainingRetainerBalance,
              totalAmortizedToDate: r.totalAmortizedToDate + result.amortizedFromRetainer,
            }
          : r
      )
    );

    // Mark time entries as amortized
    setTimeEntries(
      timeEntries.map((te) =>
        te.clientId === clientId ? { ...te, status: 'AMORTIZED_FROM_RETAINER' } : te
      )
    );

    setAmortizationLog(
      `Amortized $${result.amortizedFromRetainer.toFixed(2)} for ${ret.clientName}. GL Journal Entry posted: DR 2100 (Unearned Rev) / CR 4030 (Retainer Rev).`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-xs text-slate-400 font-semibold block">Total Logged Hours</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">
            {metrics.totalHours} hrs
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {metrics.billableHours} billable • {metrics.nonBillableHours} non-billable
          </span>
        </Card>
        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-xs text-slate-400 font-semibold block">Billable Utilization</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
            {metrics.utilizationRate}%
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">Target: &gt; 80%</span>
        </Card>
        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-xs text-slate-400 font-semibold block">Earned Service Value</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">
            {formatCurrency(metrics.totalAmount, 'USD', locale)}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">Billable hours × Hourly rate</span>
        </Card>
        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-xs text-slate-400 font-semibold block">Active Client Retainers</span>
          <span className="text-xl font-bold font-mono text-sky-400 mt-1 block">
            {formatCurrency(
              retainers.reduce((acc, r) => acc + r.unearnedBalanceRemaining, 0),
              'USD',
              locale
            )}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">Unearned revenue liability pool</span>
        </Card>
      </div>

      {/* Retainers Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Client Retainer Pools (ASC 606 Revenue Recognition)</CardTitle>
              <CardDescription>
                Automatic Amortization: Debits 2100 Unearned Revenue & Credits 4030 Retainer Revenue
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {amortizationLog && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{amortizationLog}</span>
            </div>
            <Button size="sm" variant="ghost" className="text-xs h-6 px-2" onClick={() => setAmortizationLog(null)}>
              Dismiss
            </Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Account</TableHead>
              <TableHead className="text-right w-32">Total Deposited</TableHead>
              <TableHead className="text-right w-32">Amortized to Date</TableHead>
              <TableHead className="text-right w-32">Unearned Balance</TableHead>
              <TableHead className="text-right w-32">Effective Rate</TableHead>
              <TableHead className="w-48 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {retainers.map((ret) => (
              <TableRow key={ret.clientId}>
                <TableCell>
                  <div className="font-semibold text-white">{ret.clientName}</div>
                  <div className="text-[10px] text-slate-400">Monthly Cap: ${ret.monthlyAllocationAmount.toLocaleString()}</div>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-300">
                  {formatCurrency(ret.totalRetainerDeposited, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-emerald-400">
                  {formatCurrency(ret.totalAmortizedToDate, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums font-bold text-sky-400">
                  {formatCurrency(ret.unearnedBalanceRemaining, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-300">
                  ${ret.effectiveHourlyRate}/hr
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="primary"
                    className="text-[11px] h-7 px-2"
                    onClick={() => handleAmortizeRetainer(ret.clientId)}
                    disabled={ret.unearnedBalanceRemaining <= 0}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Amortize Retainer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Logged Time Entries Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Time Tracking Feed by Project & Task</CardTitle>
              <CardDescription>Billable Engineering & Advisory Deliverables</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Log Service Time
            </Button>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Date</TableHead>
              <TableHead>Project & Client</TableHead>
              <TableHead>Team Member</TableHead>
              <TableHead className="w-20 text-right">Hours</TableHead>
              <TableHead className="w-24 text-right">Rate</TableHead>
              <TableHead className="w-28 text-right">Value ($)</TableHead>
              <TableHead className="w-36 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeEntries.map((te) => (
              <TableRow key={te.id}>
                <TableCell className="text-slate-400">{formatDate(te.date, locale)}</TableCell>
                <TableCell>
                  <div className="font-semibold text-white">{te.projectName}</div>
                  <div className="text-[10px] text-slate-400">{te.clientName} • {te.description}</div>
                </TableCell>
                <TableCell className="text-slate-300 text-xs">{te.workerName}</TableCell>
                <TableCell className="text-right font-mono tabular-nums text-white font-semibold">
                  {te.hours}h
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-400">
                  {te.hourlyRate > 0 ? `$${te.hourlyRate}/h` : '—'}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums font-bold text-emerald-400">
                  {te.isBillable ? formatCurrency(te.hours * te.hourlyRate, 'USD', locale) : '—'}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      te.status === 'AMORTIZED_FROM_RETAINER'
                        ? 'success'
                        : te.isBillable
                        ? 'info'
                        : 'outline'
                    }
                    className="text-[10px]"
                  >
                    {te.status === 'AMORTIZED_FROM_RETAINER'
                      ? 'Amortized to Rev'
                      : te.isBillable
                      ? 'Billable (Approved)'
                      : 'Non-Billable'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
