'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  TimesheetApprovalEngine,
  WeeklyTimesheet,
} from '@/lib/scheduling/timesheet-approval-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, CheckCircle2, DollarSign, Sparkles, TrendingUp } from 'lucide-react';

export function TimesheetApprovalView() {
  const { locale, t } = useI18n();

  const [timesheets, setTimesheets] = useState<WeeklyTimesheet[]>([
    {
      id: 'TS-2026-W34-01',
      workerId: 'w-1',
      workerName: 'Sarah Jenkins',
      workerTitle: 'Principal Cloud Architect',
      internalCostRate: 85,
      clientBillingRate: 250,
      projectId: 'p-101',
      projectName: 'Terraform Multi-Cloud Migration',
      clientName: 'Acme Global Corp',
      weekStartDate: '2026-08-17',
      weekEndDate: '2026-08-23',
      dailyHours: [
        { dayOfWeek: 'Mon', date: '2026-08-17', hours: 8 },
        { dayOfWeek: 'Tue', date: '2026-08-18', hours: 8 },
        { dayOfWeek: 'Wed', date: '2026-08-19', hours: 8 },
        { dayOfWeek: 'Thu', date: '2026-08-20', hours: 8 },
        { dayOfWeek: 'Fri', date: '2026-08-21', hours: 8 },
        { dayOfWeek: 'Sat', date: '2026-08-22', hours: 0 },
        { dayOfWeek: 'Sun', date: '2026-08-23', hours: 0 },
      ],
      totalWeeklyHours: 40,
      totalLaborCost: 3400, // 40h * $85
      totalClientRevenue: 10000, // 40h * $250
      grossMarginAmount: 6600, // $10k - $3.4k
      grossMarginPercent: 66.0,
      status: 'SUBMITTED',
    },
    {
      id: 'TS-2026-W34-02',
      workerId: 'w-2',
      workerName: 'Elena Rostova (1099)',
      workerTitle: 'Staff API Engineer',
      internalCostRate: 120,
      clientBillingRate: 220,
      projectId: 'p-102',
      projectName: 'HIPAA Cloud Security API',
      clientName: 'NovaTech BioLabs Inc',
      weekStartDate: '2026-08-17',
      weekEndDate: '2026-08-23',
      dailyHours: [
        { dayOfWeek: 'Mon', date: '2026-08-17', hours: 6 },
        { dayOfWeek: 'Tue', date: '2026-08-18', hours: 6 },
        { dayOfWeek: 'Wed', date: '2026-08-19', hours: 6 },
        { dayOfWeek: 'Thu', date: '2026-08-20', hours: 6 },
        { dayOfWeek: 'Fri', date: '2026-08-21', hours: 6 },
        { dayOfWeek: 'Sat', date: '2026-08-22', hours: 0 },
        { dayOfWeek: 'Sun', date: '2026-08-23', hours: 0 },
      ],
      totalWeeklyHours: 30,
      totalLaborCost: 3600, // 30h * $120
      totalClientRevenue: 6600, // 30h * $220
      grossMarginAmount: 3000,
      grossMarginPercent: 45.5,
      status: 'APPROVED',
      approvedByManagerName: 'Victoria Sterling',
      approvedAt: '2026-08-21T10:00:00Z',
    },
  ]);

  const [approvalMessage, setApprovalMessage] = useState<string | null>(null);

  const handleApprove = (ts: WeeklyTimesheet) => {
    const approved = TimesheetApprovalEngine.approveTimesheet(ts);
    setTimesheets(timesheets.map((t) => (t.id === ts.id ? approved : t)));
    setApprovalMessage(
      `Timesheet ${ts.id} for ${ts.workerName} approved! ${ts.totalWeeklyHours} billable hours ($${ts.totalClientRevenue.toLocaleString()}) unlocked for Retainer Amortization & Invoicing.`
    );
  };

  return (
    <Card className="border-sky-500/20 bg-slate-950">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Weekly Timesheet Review & Formal Manager Approval</CardTitle>
              <CardDescription>
                Real-Time Labor Cost vs. Client Realization • Unlocks ASC 606 Retainer Amortization
              </CardDescription>
            </div>
          </div>
          <Badge variant="success">Approval Engine Active</Badge>
        </div>
      </CardHeader>

      {approvalMessage && (
        <div className="mb-4 p-3.5 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{approvalMessage}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setApprovalMessage(null)}>
            Dismiss
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Timesheet ID</TableHead>
            <TableHead>Engineer & Project</TableHead>
            <TableHead className="text-center w-40">M • T • W • T • F • S • S</TableHead>
            <TableHead className="text-right w-24">Total Hours</TableHead>
            <TableHead className="text-right w-28">Labor Cost</TableHead>
            <TableHead className="text-right w-28">Client Value</TableHead>
            <TableHead className="text-right w-24">Margin %</TableHead>
            <TableHead className="w-28 text-center">Status / Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheets.map((ts) => (
            <TableRow key={ts.id}>
              <TableCell className="font-mono text-xs text-sky-400 font-semibold">{ts.id}</TableCell>
              <TableCell>
                <div className="font-semibold text-white">{ts.workerName}</div>
                <div className="text-[10px] text-slate-400">
                  {ts.projectName} • <span className="text-emerald-400">{ts.clientName}</span>
                </div>
              </TableCell>
              <TableCell className="text-center font-mono text-[11px] text-slate-300">
                {ts.dailyHours.map((d) => d.hours).join(' · ')}
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums font-bold text-white">
                {ts.totalWeeklyHours} hrs
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums text-slate-400">
                ${ts.totalLaborCost.toLocaleString()} (${ts.internalCostRate}/h)
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums font-bold text-emerald-400">
                ${ts.totalClientRevenue.toLocaleString()} (${ts.clientBillingRate}/h)
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums font-bold text-emerald-300">
                {ts.grossMarginPercent}%
              </TableCell>
              <TableCell className="text-center">
                {ts.status === 'SUBMITTED' ? (
                  <Button size="sm" variant="primary" className="h-7 text-xs px-2" onClick={() => handleApprove(ts)}>
                    Approve (Manager)
                  </Button>
                ) : (
                  <Badge variant="success" className="text-[10px]">
                    ✓ Approved
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
