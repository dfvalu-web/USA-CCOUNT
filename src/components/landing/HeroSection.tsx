'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Scale,
  BookOpen,
  CheckCircle2,
  Lock,
  Landmark,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Zap,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function HeroSection() {
  const { t, formatCurrency } = useI18n();
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (bgVideoRef.current) {
      bgVideoRef.current.muted = true;
      bgVideoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, []);

  const toggleMute = () => {
    if (!bgVideoRef.current) return;
    const nextMute = !bgVideoRef.current.muted;
    bgVideoRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  const togglePlay = () => {
    if (!bgVideoRef.current) return;
    if (bgVideoRef.current.paused) {
      bgVideoRef.current.play().then(() => setIsPlaying(true));
    } else {
      bgVideoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-950 min-h-[92vh] flex flex-col justify-center">
      {/* 4K Cinematic Background Video Stream */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <video
          ref={bgVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-30 sm:opacity-40 scale-105 filter saturate-125 contrast-115 transition-opacity duration-1000"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Dynamic Luminance Gradient Overlay - Ensures 4K Video Visibility with Perfect Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/40 to-slate-950/90" />
      </div>

      {/* 4K Background Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-sky-600/15 blur-[160px] pointer-events-none rounded-full z-[1]" />
      <div className="absolute top-1/2 right-[-100px] w-[500px] h-[400px] bg-indigo-500/10 blur-[130px] pointer-events-none rounded-full z-[1]" />

      {/* Subtle Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-[2]" />

      {/* Floating Video Audio / Playback Controls in Bottom Right */}
      <div className="absolute bottom-6 right-6 z-30 hidden sm:flex items-center space-x-2 bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl px-3 py-1.5 rounded-full shadow-2xl">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[11px] font-mono text-slate-400 uppercase font-bold pr-1">
          4K Video Background
        </span>
        <button
          type="button"
          onClick={toggleMute}
          className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white transition-colors cursor-pointer"
          title={isMuted ? 'Ativar Áudio' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Audit-Ready Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-teal-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wide backdrop-blur-xl shadow-xl shadow-emerald-950/50">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{t('landing.heroBadge')}</span>
          </div>

          {/* Main 4K Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-serif leading-[1.1] drop-shadow-md">
            {t('landing.heroTitle1')}{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              {t('landing.heroTitle2')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-200 max-w-3xl mx-auto font-normal leading-relaxed drop-shadow">
            {t('landing.heroSubtitle')}
          </p>

          {/* CTAs Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-base shadow-2xl shadow-emerald-500/30 transition-all flex items-center justify-center space-x-2 group hover:scale-[1.02] cursor-pointer"
            >
              <span>{t('landing.ctaAccess')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto h-14 px-7 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{t('landing.ctaDemo')}</span>
            </Link>
          </div>

          {/* Trust Pillars */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>US GAAP ASC 205/210/606</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>IRS Form 1065 / K-1 Ready</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>SOC 2 Type II Merkle Audit Trail</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t('accounting.balancedProof')}</span>
            </div>
          </div>
        </div>

        {/* 4K Hero Card Visualizer Teaser */}
        <div className="mt-14 max-w-5xl mx-auto relative">
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-sky-500/30 blur-2xl opacity-80 pointer-events-none" />

          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl overflow-hidden p-6 sm:p-8">
            {/* Top Control Bar of Visualizer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 pl-2">
                  mistercontabil.com • Live GAAP Engine
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-semibold">{t('common.status')}:</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('accounting.balancedProof')}
                </span>
              </div>
            </div>

            {/* Metrics Highlight Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>{t('accounting.totalAssets')}</span>
                  <Scale className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {formatCurrency(320771.75)}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span>✓ 100% US GAAP Compliant</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>{t('accounting.totalLiabilitiesAndEquity')}</span>
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {formatCurrency(320771.75)}
                </div>
                <div className="text-[10px] text-sky-400 flex items-center gap-1">
                  <span>✓ {t('accounting.balanceSheetEquation')}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>{t('nav.journalEntries')}</span>
                  <BookOpen className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {formatCurrency(6577924.35)}
                </div>
                <div className="text-[10px] text-teal-300 flex items-center gap-1">
                  <span>✓ {t('accounting.ruleDebitCredit')}</span>
                </div>
              </div>
            </div>

            {/* Live Navigation Tabs Preview */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-400">
                <span className="font-semibold">{t('common.actions')}:</span>
                <Link href="/login" className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:text-emerald-300 font-medium cursor-pointer">
                  {t('nav.balanceSheet')} ➔
                </Link>
                <Link href="/login" className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:text-emerald-300 font-medium cursor-pointer">
                  {t('nav.generalLedger')} ➔
                </Link>
                <Link href="/login" className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:text-emerald-300 font-medium cursor-pointer">
                  {t('nav.incomeStatement')} ➔
                </Link>
              </div>

              <Link
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{t('landing.ctaAccess')}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
