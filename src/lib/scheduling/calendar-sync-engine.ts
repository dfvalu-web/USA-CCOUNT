import { TimeEntryDTO } from './time-tracking-engine';

export interface CalendarEventPayload {
  eventId: string;
  summary: string;
  startDateTime: string;
  endDateTime: string;
  attendeesEmails: string[];
  organizerEmail: string;
}

export class CalendarSyncEngine {
  /**
   * Parses and matches calendar events to client projects and converts into billable time entries
   */
  public static convertEventsToTimeEntries(
    events: CalendarEventPayload[],
    workerId: string,
    workerName: string,
    clientDomainMap: Record<string, { clientId: string; clientName: string; projectId: string; rate: number }>
  ): TimeEntryDTO[] {
    const entries: TimeEntryDTO[] = [];

    for (const ev of events) {
      const start = new Date(ev.startDateTime).getTime();
      const end = new Date(ev.endDateTime).getTime();
      const durationHours = Math.max(0.5, parseFloat(((end - start) / (1000 * 60 * 60)).toFixed(2)));

      // Find matching client by attendee email domain
      let matchedClient = {
        clientId: 'c-1',
        clientName: 'Acme Global Corp',
        projectId: 'p-101',
        rate: 250,
      };

      for (const email of ev.attendeesEmails) {
        const domain = email.split('@')[1]?.toLowerCase();
        if (domain && clientDomainMap[domain]) {
          matchedClient = clientDomainMap[domain];
          break;
        }
      }

      entries.push({
        id: `te-cal-${ev.eventId}`,
        clientId: matchedClient.clientId,
        clientName: matchedClient.clientName,
        projectId: matchedClient.projectId,
        projectName: 'Advisory & Architecture Consultation',
        workerId,
        workerName,
        date: ev.startDateTime.split('T')[0],
        hours: durationHours,
        hourlyRate: matchedClient.rate,
        isBillable: true,
        description: `Calendar Meeting: ${ev.summary}`,
        status: 'APPROVED',
      });
    }

    return entries;
  }
}
