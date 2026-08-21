import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/context';
import { FiscalPeriodProvider } from '@/lib/period/fiscal-period-context';
import { CompanyProvider } from '@/lib/company/company-context';
import { AuthProvider } from '@/lib/auth/auth-context';

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
  title: 'Mister Contábil — Inteligência Contábil & Fiscal US GAAP (4K Fintech SaaS)',
  description: 'Plataforma Oficial de Contabilidade US GAAP, Escrituração de Partidas Dobradas, Fechamento Fiscal IRS (Form 1065, K-1, 1099/W-2) e BI Financeiro.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        <AuthProvider>
          <I18nProvider>
            <CompanyProvider>
              <FiscalPeriodProvider>{children}</FiscalPeriodProvider>
            </CompanyProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

