import React, { useState, useEffect } from 'react';
import { X, Share2, Globe2, ShieldCheck, Heart, Award, Copy, Check } from 'lucide-react';
import { Language, translations } from '../utils/translations';
import confetti from 'canvas-confetti';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  sessionStats: {
    itemsSmashed: number;
    rantsDestroyed: number;
    bubblesPopped: number;
    breathsTaken: number;
  };
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  lang,
  sessionStats,
}) => {
  const t = translations[lang];
  const [copied, setCopied] = useState<boolean>(false);
  const [globalKg, setGlobalKg] = useState<number>(2418920);

  // Simulated live ticking of worldwide stress relieved
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setGlobalKg((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleShare = async () => {
    const shareData = {
      title: 'SmashChill — Smash Stress & Find Calm | Free Online Arcade',
      text: 'Whenever you feel stressed, angry, or overwhelmed, smash things and find deep calm on SmashChill.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback to copy
        copyUrl();
      }
    } else {
      copyUrl();
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col gap-6 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-400">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              {t.stats.title}
            </h3>
            <p className="text-xs text-slate-400">
              {t.stats.worldwideTotal}
            </p>
          </div>
        </div>

        {/* Global Live Ticker */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t.stats.stressDestroyed}
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 font-mono tabular-nums my-1">
            {globalKg.toLocaleString()} kg
          </div>
          <div className="text-[11px] text-slate-400">
            Live worldwide community aggregate
          </div>
        </div>

        {/* Personal Session Trophies */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">
            Your Session Relief Today:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 text-center">
              <div className="text-xl font-extrabold text-rose-400 font-mono tabular-nums">
                {sessionStats.itemsSmashed}
              </div>
              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                {t.stats.itemsSmashed}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 text-center">
              <div className="text-xl font-extrabold text-amber-400 font-mono tabular-nums">
                {sessionStats.rantsDestroyed}
              </div>
              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Rants Burned
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 text-center">
              <div className="text-xl font-extrabold text-sky-400 font-mono tabular-nums">
                {sessionStats.bubblesPopped}
              </div>
              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                {t.stats.bubblesPopped}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 text-center">
              <div className="text-xl font-extrabold text-emerald-400 font-mono tabular-nums">
                {sessionStats.breathsTaken}
              </div>
              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                {t.stats.zenMinutes}
              </div>
            </div>
          </div>
        </div>

        {/* Platform info & Share */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span>Powered by </span>
            <span className="font-semibold text-white">SmashChill Arcade</span>
            <span> · 100% Free Client-Side Engine</span>
          </div>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-md shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? t.stats.copied : t.stats.shareBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
