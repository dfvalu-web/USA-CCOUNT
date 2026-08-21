'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Landmark,
  FileCheck2,
  Fingerprint,
  CheckCircle2,
  Server,
  Award,
  Shield,
  KeyRound,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function TrustSecuritySection() {
  const { t } = useI18n();

  const securityPillars = [
    {
      icon: ShieldCheck,
      title: 'US GAAP & FASB Standards',
      description: 'ASC 205, ASC 210, ASC 230, and ASC 606 double-entry compliance with rigorous mathematical verification.',
      iconColor: 'text-emerald-400',
    },
    {
      icon: Landmark,
      title: 'Official IRS MeF & Form 1065',
      description: 'Structured e-File readiness for Form 1065, Partner Schedules K-1, Forms 1099-NEC, and W-2 filings.',
      iconColor: 'text-sky-400',
    },
    {
      icon: Fingerprint,
      title: 'SOC 2 Type II Merkle Audit Trail',
      description: 'SHA-256 cryptographic chaining for every posted journal transaction ensuring tamper-proof legal defense.',
      iconColor: 'text-teal-400',
    },
    {
      icon: Lock,
      title: '256-Bit Bank-Grade TLS Encryption',
      description: 'Enterprise protection for sensitive banking feeds (Truist, Chase) and federal tax identification data (EIN).',
      iconColor: 'text-indigo-400',
    },
  ];

  return (
    <section id="seguranca" className="py-28 bg-slate-950 relative overflow-hidden">
      {/* 3D Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-sky-600/10 blur-[170px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 text-emerald-300 text-xs font-bold border border-emerald-500/30 shadow-lg shadow-emerald-950/50 backdrop-blur-xl">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>US GAAP AUDIT-READY • IMMUTABLE LEDGER</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            {t('landing.securityTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('landing.securitySubtitle')}
          </p>
        </div>

        {/* 3D Holographic Security Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityPillars.map((p, idx) => {
            const Icon = p.icon;

            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-950 border border-slate-800 hover:border-emerald-500/40 space-y-4 shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(16,185,129,0.1)] backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 group-hover:via-emerald-400/60 to-transparent pointer-events-none" />

                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 group-hover:border-emerald-500/50 flex items-center justify-center ${p.iconColor} shadow-md group-hover:scale-110 transition-all`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white font-serif tracking-tight">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{p.description}</p>
              </div>
            );
          })}
        </div>

        {/* 3D Banner with CPA & Legal Quote */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-emerald-950/40 to-slate-900/90 border border-emerald-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none" />

          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white font-serif tracking-tight">
              {t('reports.notesTitle')}
            </h4>
            <p className="text-xs text-slate-300 font-medium">
              {t('accounting.balanceSheetEquation')} • {t('accounting.balancedProof')}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <span className="text-xs font-mono font-bold text-emerald-300 bg-slate-950/90 px-4 py-2 rounded-2xl border border-emerald-500/40 shadow-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>US GAAP AUDIT-READY • IMMUTABLE LEDGER</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
