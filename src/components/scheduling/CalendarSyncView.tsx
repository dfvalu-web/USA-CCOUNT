'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { CalendarSyncEngine, CalendarEventPayload } from '@/lib/scheduling/calendar-sync-engine';
import { TimeEntryDTO } from '@/lib/scheduling/time-tracking-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, CheckCircle2, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

interface CalendarSyncViewProps {
  onImportSuccess?: (entries: TimeEntryDTO[]) => void;
}

export function CalendarSyncView({ onImportSuccess }: CalendarSyncViewProps) {
  const { locale, t } = useI18n();

  const [events, setEvents] = useState<CalendarEventPayload[]>([
    {
      eventId: 'evt-8491',
      summary: 'Q3 Cloud Architecture Review & Terraform Sync',
      startDateTime: '2026-08-20T14:00:00Z',
      endDateTime: '2026-08-20T16:00:00Z',
      attendeesEmails: ['cto@acmeglobal.com', 'sarah.j@apexcloud.io'],
      organizerEmail: 'sarah.j@apexcloud.io',
    },
    {
      eventId: 'evt-8492',
      summary: 'Bi-Weekly Fintech Security & Webhook Audit',
      startDateTime: '2026-08-19T10:00:00Z',
      endDateTime: '2026-08-19T11:30:00Z',
      attendeesEmails: ['devs@novatechbiolabs.com', 'michael.c@apexcloud.io'],
      organizerEmail: 'michael.c@apexcloud.io',
    },
    {
      eventId: 'evt-8493',
      summary: 'Stripe ACH API Integration Session',
      startDateTime: '2026-08-18T13:00:00Z',
      endDateTime: '2026-08-18T15:00:00Z',
      attendeesEmails: ['lead@horizonfintech.com', 'elena@clouddevs.io'],
      organizerEmail: 'elena@clouddevs.io',
    },
  ]);

  const [importedStatus, setImportedStatus] = useState<string | null>(null);

  const domainMap = {
    'acmeglobal.com': { clientId: 'c-1', clientName: 'Acme Global Corp', projectId: 'p-101', rate: 250 },
    'novatechbiolabs.com': { clientId: 'c-2', clientName: 'NovaTech BioLabs Inc', projectId: 'p-102', rate: 220 },
    'horizonfintech.com': { clientId: 'c-3', clientName: 'Horizon Fintech Labs', projectId: 'p-103', rate: 220 },
  };

  const handleSyncAll = () => {
    const timeEntries = CalendarSyncEngine.convertEventsToTimeEntries(
      events,
      'w-1',
      'Sarah Jenkins',
      domainMap
    );

    if (onImportSuccess) {
      onImportSuccess(timeEntries);
    }

    const totalHours = timeEntries.reduce((acc, e) => acc + e.hours, 0);
    const totalVal = timeEntries.reduce((acc, e) => acc + e.hours * e.hourlyRate, 0);

    setImportedStatus(
      `Successfully synced ${timeEntries.length} calendar meetings (${totalHours} billable hours = $${totalVal.toLocaleString()}) into Time Tracking & Retainers!`
    );
  };

  return (
    <Card className="border-sky-500/20 bg-slate-950">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Autonomous Calendar Sync (Google Calendar & Outlook)</CardTitle>
              <CardDescription>
                Auto-Converts Client Consultations & Engineering Reviews into Billable Time
              </CardDescription>
            </div>
          </div>

          <Button size="sm" variant="primary" onClick={handleSyncAll}>
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Batch Sync ({events.length}) Meetings to Time Entries
          </Button>
        </div>
      </CardHeader>

      {importedStatus && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{importedStatus}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setImportedStatus(null)}>
            Dismiss
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-28">Meeting Date</TableHead>
            <TableHead>Calendar Event Summary</TableHead>
            <TableHead>Attendee Domain & Client</TableHead>
            <TableHead className="w-24 text-right">Duration</TableHead>
            <TableHead className="w-24 text-right">Hourly Rate</TableHead>
            <TableHead className="w-28 text-right">Billable Value</TableHead>
            <TableHead className="w-24 text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((ev) => {
            const domain = ev.attendeesEmails[0]?.split('@')[1]?.toLowerCase() || '';
            const client = domainMap[domain as keyof typeof domainMap] || {
              clientName: 'General Client',
              rate: 250,
            };
            const duration = 2.0; // 2 hours

            return (
              <TableRow key={ev.eventId}>
                <TableCell className="font-mono text-xs text-slate-400">
                  {formatDate(ev.startDateTime, locale)}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-white">{ev.summary}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {ev.attendeesEmails.join(', ')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-medium text-emerald-300">{client.clientName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">@{domain}</div>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-white">
                  {duration} hrs
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-400">
                  ${client.rate}/hr
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums font-bold text-emerald-400">
                  {formatCurrency(duration * client.rate, 'USD', locale)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="success" className="text-[10px]">
                    Ready to Sync
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
