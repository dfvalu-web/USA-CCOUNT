'use client';

import React, { useRef, useState, useEffect } from 'react';
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
  RotateCcw,
} from 'lucide-react';

export function VideoShowcaseSection() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log('Autoplay muted note:', err);
            setIsPlaying(false);
          });
      }
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error('Play error:', e));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((e) => console.error(e));
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section className="relative py-16 md:py-24 bg-slate-950 overflow-hidden border-t border-b border-slate-800/80">
      {/* 4K Background Radial Mesh Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-emerald-500/15 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/4 right-5 w-[450px] h-[350px] bg-teal-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold backdrop-blur-xl shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('landing.videoBadge')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
            {t('landing.videoTitle')}
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
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
                  mistercontabil.com • Demonstração da Plataforma
                </span>
              </div>

              {/* Quick Action Pills in Header */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-emerald-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isMuted ? 'Ativar Áudio 🔊' : 'Silenciado 🔇'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Reiniciar Vídeo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Video Player Box with Native HTML5 Controls & Direct Video Stream */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                controls
                controlsList="nodownload"
                preload="auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onVolumeChange={() => {
                  if (videoRef.current) {
                    setIsMuted(videoRef.current.muted);
                  }
                }}
                onError={() => setHasError(true)}
                className="w-full h-full object-cover"
              >
                <source src="/video.mp4" type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video>

              {hasError && (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <span className="text-amber-400 font-bold text-sm">Aviso de Reprodução</span>
                  <p className="text-xs text-slate-400 max-w-md">
                    O vídeo está disponível diretamente no servidor.
                  </p>
                  <a
                    href="/video.mp4"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                  >
                    Abrir Vídeo em Nova Aba ➔
                  </a>
                </div>
              )}
            </div>

            {/* Video Footer Highlights Grid */}
            <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
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
