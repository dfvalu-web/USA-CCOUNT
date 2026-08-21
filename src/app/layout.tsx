import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/context';
import { FiscalPeriodProvider } from '@/lib/period/fiscal-period-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

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
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        <I18nProvider>
          <FiscalPeriodProvider>{children}</FiscalPeriodProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

