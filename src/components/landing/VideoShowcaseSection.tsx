'use client';

import React, { useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export function VideoShowcaseSection() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section className="relative py-20 md:py-28 bg-slate-950 overflow-hidden border-t border-b border-slate-800/80">
      {/* 4K Background Radial Mesh Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/15 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-teal-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold backdrop-blur-xl shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('landing.videoBadge')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
            {t('landing.videoTitle')}
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {t('landing.videoSubtitle')}
          </p>
        </div>

        {/* 4K Video Showcase Container */}
        <div className="max-w-5xl mx-auto relative group">
          {/* Ambient Outer Glow */}
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-sky-500/30 blur-2xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

          {/* Player Shell */}
          <div className="relative rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-2xl">
            {/* Top Browser/Window Style Bar */}
            <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 pl-2">
                  mistercontabil.com • Apresentação Oficial 4K
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>HD • 1080p US GAAP</span>
              </div>
            </div>

            {/* Video Area */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src="/video.mp4"
                playsInline
                preload="metadata"
                loop
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Large Center Play Overlay (when paused or initial) */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-all hover:bg-black/30 group/btn"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/90 group-hover/btn:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/50 transform group-hover/btn:scale-110 transition-all">
                    <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-current ml-1" />
                  </div>
                </div>
              )}

              {/* Bottom Custom Overlay Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-white transition-opacity duration-300 opacity-90 hover:opacity-100">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-emerald-400 hover:text-white transition-colors"
                    title={isPlaying ? 'Pausar' : 'Reproduzir'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                    title={isMuted ? 'Ativar Áudio' : 'Mutar Áudio'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="text-xs font-mono text-slate-300 hidden sm:inline">
                    Mister Contábil — Visão Geral do Sistema
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Tela Cheia"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Footer Highlights Grid */}
            <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Partidas Dobradas US GAAP</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    $0.00 de variância com validação matemática em tempo real.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">IRS Tax Suite & K-1</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Preparação anual do Form 1065, 1120-S e papéis de trabalho CPA.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Auditoria SOC 2 Merkle</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Trilha criptográfica inviolável de cada lançamento e conciliação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
