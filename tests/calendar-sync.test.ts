import { describe, it, expect } from 'vitest';
import { CalendarSyncEngine } from '../src/lib/scheduling/calendar-sync-engine';

describe('CalendarSyncEngine (Autonomous Calendar to Billable Time Entries)', () => {
  it('should parse calendar events and calculate exact billable hours based on attendee domain match', () => {
    const events = [
      {
        eventId: 'evt-1',
        summary: 'Cloud Migration Strategy',
        startDateTime: '2026-08-20T14:00:00Z',
        endDateTime: '2026-08-20T16:00:00Z', // 2 hours
        attendeesEmails: ['cto@acmeglobal.com'],
        organizerEmail: 'sarah@apexcloud.io',
      },
    ];

    const domainMap = {
      'acmeglobal.com': { clientId: 'c-1', clientName: 'Acme Global Corp', projectId: 'p-101', rate: 250 },
    };

    const entries = CalendarSyncEngine.convertEventsToTimeEntries(events, 'w-1', 'Sarah Jenkins', domainMap);
    expect(entries.length).toBe(1);
    expect(entries[0].hours).toBe(2);
    expect(entries[0].hourlyRate).toBe(250);
    expect(entries[0].clientName).toBe('Acme Global Corp');
    expect(entries[0].isBillable).toBe(true);
  });
});
