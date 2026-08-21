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
      {/* 4K Cinematic Background Video Stream - High Luminosity & Vivid Colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <video
          ref={bgVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-85 sm:opacity-90 scale-100 filter brightness-105 saturate-135 contrast-105 transition-opacity duration-1000"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Soft Vignette Overlay - Blends edges without darkening the video */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/85 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/20 to-slate-950/70 pointer-events-none" />
      </div>

      {/* 4K Background Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-sky-600/15 blur-[160px] pointer-events-none rounded-full z-[1]" />
      <div className="absolute top-1/2 right-[-100px] w-[500px] h-[400px] bg-indigo-500/10 blur-[130px] pointer-events-none rounded-full z-[1]" />

      {/* Floating Video Audio / Playback Controls in Bottom Right */}
      <div className="absolute bottom-6 right-6 z-30 hidden sm:flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl px-3 py-1.5 rounded-full shadow-2xl">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[11px] font-mono text-emerald-300 uppercase font-bold pr-1">
          4K Video Live
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
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-slate-950/85 border border-emerald-500/50 text-emerald-300 text-xs font-semibold tracking-wide backdrop-blur-xl shadow-2xl">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{t('landing.heroBadge')}</span>
          </div>

          {/* Main 4K Headline with High Contrast Drop Shadow */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-serif leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            {t('landing.heroTitle1')}{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 drop-shadow-[0_2px_12px_rgba(16,185,129,0.5)]">
              {t('landing.heroTitle2')}
            </span>
          </h1>

          {/* Subtitle with High Legibility Contrast */}
          <p className="text-base sm:text-xl text-slate-100 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            {t('landing.heroSubtitle')}
          </p>

          {/* CTAs Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-2xl shadow-emerald-500/40 transition-all flex items-center justify-center space-x-2 group hover:scale-[1.02] cursor-pointer"
            >
              <span>{t('landing.ctaAccess')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto h-14 px-7 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-slate-700/80 text-slate-100 hover:text-white font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center space-x-2 shadow-2xl cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{t('landing.ctaDemo')}</span>
            </Link>
          </div>

          {/* Trust Pillars */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-100 font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <div className="flex items-center space-x-1.5 bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-slate-800/90 backdrop-blur-md shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>US GAAP ASC 205/210/606</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-slate-800/90 backdrop-blur-md shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>IRS Form 1065 / K-1 Ready</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-slate-800/90 backdrop-blur-md shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>SOC 2 Type II Merkle Audit Trail</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-slate-800/90 backdrop-blur-md shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t('accounting.balancedProof')}</span>
            </div>
          </div>
        </div>

        {/* 3D 4K Hero Card Visualizer Teaser */}
        <div className="mt-14 max-w-5xl mx-auto relative">
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-emerald-500/40 via-teal-500/30 to-sky-500/40 blur-2xl opacity-90 pointer-events-none" />

          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950 border border-emerald-500/40 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(16,185,129,0.25)] backdrop-blur-2xl overflow-hidden p-6 sm:p-8 transition-transform duration-500 hover:-translate-y-1">
            {/* 3D Specular Light Top Border */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent pointer-events-none" />

            {/* Top Control Bar of Visualizer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm" />
                <span className="text-xs font-mono text-slate-300 pl-2">
                  mistercontabil.com • Live GAAP Engine
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-300 font-semibold">{t('common.status')}:</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5 shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {t('accounting.balancedProof')}
                </span>
              </div>
            </div>

            {/* Metrics Highlight Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-1 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                  <span>{t('accounting.totalAssets')}</span>
                  <Scale className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black font-mono text-white drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]">
                  {formatCurrency(320771.75)}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span>✓ 100% US GAAP Compliant</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-1 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                  <span>{t('accounting.totalLiabilitiesAndEquity')}</span>
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-black font-mono text-white drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]">
                  {formatCurrency(320771.75)}
                </div>
                <div className="text-[10px] text-sky-400 flex items-center gap-1 font-medium">
                  <span>✓ {t('accounting.balanceSheetEquation')}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-1 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                  <span>{t('nav.journalEntries')}</span>
                  <BookOpen className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400 drop-shadow-[0_2px_8px_rgba(20,184,166,0.4)]">
                  {formatCurrency(6577924.35)}
                </div>
                <div className="text-[10px] text-teal-300 flex items-center gap-1 font-medium">
                  <span>✓ {t('accounting.ruleDebitCredit')}</span>
                </div>
              </div>
            </div>

            {/* Live Navigation Tabs Preview */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="font-semibold">{t('common.actions')}:</span>
                <Link href="/login" className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-emerald-300 font-medium cursor-pointer border border-slate-800 transition-colors shadow-sm">
                  {t('nav.balanceSheet')} ➔
                </Link>
                <Link href="/login" className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-emerald-300 font-medium cursor-pointer border border-slate-800 transition-colors shadow-sm">
                  {t('nav.generalLedger')} ➔
                </Link>
                <Link href="/login" className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-emerald-300 font-medium cursor-pointer border border-slate-800 transition-colors shadow-sm">
                  {t('nav.incomeStatement')} ➔
                </Link>
              </div>

              <Link
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition-transform hover:translate-x-0.5"
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
