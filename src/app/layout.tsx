import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/context';
import { FiscalPeriodProvider } from '@/lib/period/fiscal-period-context';

export const metadata: Metadata = {
  title: 'UAS Accounting — Next-Gen US GAAP Financial SaaS',
  description: 'Enterprise Accounting, Multi-State Payroll & Tax Compliance for US Service-Based Businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        <I18nProvider>
          <FiscalPeriodProvider>{children}</FiscalPeriodProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
