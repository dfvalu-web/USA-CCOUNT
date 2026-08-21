import Decimal from 'decimal.js';

export interface ClientInvoiceItem {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: 'PAID' | 'OPEN' | 'OVERDUE';
  serviceDescription: string;
  paymentMethod?: 'STRIPE_ACH' | 'CREDIT_CARD' | 'WIRE';
}

export interface ClientPortalProfile {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  activeRetainerMonthly: number;
  totalPaidYtd: number;
  totalOutstandingBalance: number;
  invoices: ClientInvoiceItem[];
}

export class ClientPortalEngine {
  public static INITIAL_PROFILES: ClientPortalProfile[] = [
    {
      id: 'cli-acme-global',
      companyName: 'Acme Global Corp',
      contactName: 'Robert Vance (VP Procurement)',
      email: 'robert.vance@acmeglobal.com',
      phone: '+1 (512) 555-0199',
      activeRetainerMonthly: 15000.0,
      totalPaidYtd: 95000.0,
      totalOutstandingBalance: 15000.0,
      invoices: [
        {
          id: 'inv-2026-088',
          invoiceNumber: 'INV-2026-088',
          clientId: 'cli-acme-global',
          clientName: 'Acme Global Corp',
          issueDate: '2026-08-01',
          dueDate: '2026-08-31',
          totalAmount: 15000.0,
          paidAmount: 0.0,
          balanceDue: 15000.0,
          status: 'OPEN',
          serviceDescription: 'Modernização de Infraestrutura Cloud & Suporte DevOps Dedicado (Agosto 2026)',
        },
        {
          id: 'inv-2026-071',
          invoiceNumber: 'INV-2026-071',
          clientId: 'cli-acme-global',
          clientName: 'Acme Global Corp',
          issueDate: '2026-07-01',
          dueDate: '2026-07-31',
          totalAmount: 15000.0,
          paidAmount: 15000.0,
          balanceDue: 0.0,
          status: 'PAID',
          serviceDescription: 'Modernização de Infraestrutura Cloud & Suporte DevOps Dedicado (Julho 2026)',
          paymentMethod: 'STRIPE_ACH',
        },
      ],
    },
    {
      id: 'cli-austin-tech',
      companyName: 'Austin Tech Hub Suites',
      contactName: 'Clara Oswald (Facilities Manager)',
      email: 'clara@austintechhub.com',
      phone: '+1 (512) 555-0244',
      activeRetainerMonthly: 18500.0,
      totalPaidYtd: 115000.0,
      totalOutstandingBalance: 0.0,
      invoices: [
        {
          id: 'inv-2026-082',
          invoiceNumber: 'INV-2026-082',
          clientId: 'cli-austin-tech',
          clientName: 'Austin Tech Hub Suites',
          issueDate: '2026-08-05',
          dueDate: '2026-08-25',
          totalAmount: 18500.0,
          paidAmount: 18500.0,
          balanceDue: 0.0,
          status: 'PAID',
          serviceDescription: 'Serviços Especializados de Limpeza Industrial & Desinfecção Noturna',
          paymentMethod: 'STRIPE_ACH',
        },
      ],
    },
  ];

  /**
   * Processes direct client self-checkout payment
   */
  public static processInvoicePayment(
    profileId: string,
    invoiceId: string,
    paymentMethod: 'STRIPE_ACH' | 'CREDIT_CARD' | 'WIRE'
  ): ClientPortalProfile[] {
    return this.INITIAL_PROFILES.map((prof) => {
      if (prof.id === profileId) {
        const updatedInvoices = prof.invoices.map((inv) => {
          if (inv.id === invoiceId) {
            return {
              ...inv,
              paidAmount: inv.totalAmount,
              balanceDue: 0,
              status: 'PAID' as const,
              paymentMethod,
            };
          }
          return inv;
        });

        const newOutstanding = updatedInvoices.reduce((acc, i) => acc + i.balanceDue, 0);
        const newPaidYtd = updatedInvoices.reduce((acc, i) => acc + i.paidAmount, 0);

        return {
          ...prof,
          totalOutstandingBalance: newOutstanding,
          totalPaidYtd: newPaidYtd,
          invoices: updatedInvoices,
        };
      }
      return prof;
    });
  }
}
