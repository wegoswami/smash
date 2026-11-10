import React, { useState } from 'react';
import { Flame, Scissors, Rocket, ShieldCheck, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { Language, translations } from '../utils/translations';
import confetti from 'canvas-confetti';

interface RantShredderProps {
  lang: Language;
  onRantDestroyed: () => void;
}

type DestructionMethod = 'shred' | 'burn' | 'rocket' | 'crush';

export const RantShredder: React.FC<RantShredderProps> = ({ lang, onRantDestroyed }) => {
  const t = translations[lang];

  const [rantText, setRantText] = useState<string>('');
  const [isDestroying, setIsDestroying] = useState<boolean>(false);
  const [destructionType, setDestructionType] = useState<DestructionMethod | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePresetClick = (preset: string) => {
    setRantText(preset);
    setErrorMessage('');
  };

  const executeDestruction = (method: DestructionMethod) => {
    if (!rantText.trim()) {
      setErrorMessage(t.rant.emptyWarning);
      return;
    }

    setErrorMessage('');
    setIsDestroying(true);
    setDestructionType(method);

    // Audio triggers
    if (method === 'shred') {
      sound.playPaperShred();
    } else if (method === 'burn') {
      sound.playFireBurn();
    } else if (method === 'rocket') {
      sound.playRocketLaunch();
    } else if (method === 'crush') {
      sound.playSmash('hammer');
    }

    // Animation timeline
    setTimeout(() => {
      setIsDestroying(false);
      setIsCompleted(true);
      sound.playSingingBowl(340);
      onRantDestroyed();

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.5 },
        colors: method === 'burn' ? ['#f97316', '#ef4444', '#78716c'] : ['#38bdf8', '#818cf8', '#c084fc'],
      });
    }, 2400);
  };

  const handleReset = () => {
    setRantText('');
    setIsCompleted(false);
    setDestructionType(null);
    setIsDestroying(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4 md:p-8">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
          <span>{t.rant.title}</span>
          <span aria-hidden="true">·</span>
          <span>Emotional Cognitive Shredder</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {t.rant.title}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {t.rant.subtitle}
        </p>
      </div>

      {/* Main Destruction Area */}
      <div className="relative min-h-[460px] p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
        {!isCompleted ? (
          <>
            {/* The Paper Sheet / Document */}
            <div
              className={`relative w-full max-w-2xl mx-auto transition-all duration-700 ${
                isDestroying && destructionType === 'shred'
                  ? 'animate-pulse opacity-40 scale-95'
                  : isDestroying && destructionType === 'burn'
                  ? 'brightness-125 sepia scale-95 opacity-30'
                  : isDestroying && destructionType === 'rocket'
                  ? '-translate-y-96 scale-50 opacity-0 transition-transform duration-1000'
                  : isDestroying && destructionType === 'crush'
                  ? 'scale-y-10 scale-x-125 opacity-20'
                  : ''
              }`}
            >
              {/* Paper Visual Background */}
              <div className="relative p-6 md:p-8 rounded-xl bg-amber-50/95 text-slate-900 shadow-2xl border border-amber-200/80 font-mono">
                {/* Paper header */}
                <div className="flex items-center justify-between border-b border-amber-200 pb-3 mb-4 text-xs text-amber-800/80">
                  <span className="font-bold tracking-wider uppercase">Venting Sheet</span>
                  <span className="text-[11px] tabular-nums">CONFIDENTIAL · DISPOSABLE</span>
                </div>

                {/* Textarea */}
                <textarea
                  value={rantText}
                  onChange={(e) => {
                    setRantText(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  disabled={isDestroying}
                  rows={6}
                  placeholder={t.rant.placeholder}
                  className="w-full bg-transparent resize-none border-none outline-none text-slate-900 placeholder:text-amber-900/40 text-sm md:text-base leading-relaxed focus:ring-0"
                />

                {/* Character count & subtle lined effect */}
                <div className="flex justify-between items-center pt-3 border-t border-amber-200 text-xs text-amber-700/70">
                  <span>Pour every bitter detail here.</span>
                  <span className="tabular-nums font-mono">{rantText.length} chars</span>
                </div>

                {/* Shredding vertical slits visual */}
                {isDestroying && destructionType === 'shred' && (
                  <div className="absolute inset-0 flex justify-between pointer-events-none overflow-hidden rounded-xl">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-full bg-slate-950/20 border-r border-slate-950/30 animate-bounce"
                        style={{ animationDelay: `${i * 45}ms` }}
                      />
                    ))}
                  </div>
                )}

                {/* Burn flame visual */}
                {isDestroying && destructionType === 'burn' && (
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-red-600 via-orange-500 to-transparent opacity-85 animate-pulse rounded-b-xl flex items-end justify-center pointer-events-none">
                    <span className="text-4xl animate-bounce">🔥</span>
                  </div>
                )}
              </div>

              {/* Error callout if empty */}
              {errorMessage && (
                <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-950/50 p-2.5 rounded-lg border border-rose-900/60 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Quick Trigger Presets */}
            {!isDestroying && (
              <div className="mt-6 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400">
                  {t.rant.presetsTitle}
                </span>
                <div className="flex flex-wrap gap-2">
                  {t.rant.presets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePresetClick(preset)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition-colors text-left"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Destruction Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => executeDestruction('shred')}
                disabled={isDestroying}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all hover:border-slate-500 shadow-md disabled:opacity-50"
              >
                <Scissors className="w-4 h-4 text-sky-400" />
                <span>{t.rant.actionShred}</span>
              </button>

              <button
                onClick={() => executeDestruction('burn')}
                disabled={isDestroying}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-200 font-semibold text-xs border border-red-800/60 transition-all hover:border-red-600 shadow-md disabled:opacity-50"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>{t.rant.actionBurn}</span>
              </button>

              <button
                onClick={() => executeDestruction('rocket')}
                disabled={isDestroying}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-200 font-semibold text-xs border border-indigo-800/60 transition-all hover:border-indigo-600 shadow-md disabled:opacity-50"
              >
                <Rocket className="w-4 h-4 text-indigo-400" />
                <span>{t.rant.actionRocket}</span>
              </button>

              <button
                onClick={() => executeDestruction('crush')}
                disabled={isDestroying}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 text-amber-200 font-semibold text-xs border border-amber-800/60 transition-all hover:border-amber-600 shadow-md disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t.rant.actionCrush}</span>
              </button>
            </div>
          </>
        ) : (
          /* Completion Catharsis Screen */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center mb-4 text-emerald-400">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {t.rant.destroyedNotice}
            </h3>

            <p className="text-sm text-slate-400 mt-2 max-w-md">
              That thought had its moment and was thoroughly obliterated. It no longer holds any power over your peace.
            </p>

            <button
              onClick={handleReset}
              className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Venting Sheet (Fresh)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
