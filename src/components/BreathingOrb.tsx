import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/audio';
import { Language, translations } from '../utils/translations';

interface BreathingOrbProps {
  lang: Language;
  onCycleComplete: () => void;
}

type BreathMode = '478' | 'box';
type Phase = 'inhale' | 'hold' | 'exhale' | 'holdPost';

export const BreathingOrb: React.FC<BreathingOrbProps> = ({ lang, onCycleComplete }) => {
  const t = translations[lang];

  const [mode, setMode] = useState<BreathMode>('478');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [progress, setProgress] = useState<number>(0); // 0 to 1
  const [cycleCount, setCycleCount] = useState<number>(0);

  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Phase durations in milliseconds
  const durations: Record<BreathMode, Record<Phase, number>> = {
    '478': {
      inhale: 4000,
      hold: 7000,
      exhale: 8000,
      holdPost: 0,
    },
    box: {
      inhale: 4000,
      hold: 4000,
      exhale: 4000,
      holdPost: 4000,
    },
  };

  useEffect(() => {
    if (!isActive) return;

    let isCurrent = true;
    const currentDur = durations[mode][phase];
    const startTime = Date.now();

    // Sound cue on phase transition
    if (phase === 'inhale') {
      sound.playSingingBowl(216); // Low ground tone
    } else if (phase === 'hold') {
      sound.playSingingBowl(324); // Mid harmonic
    } else if (phase === 'exhale') {
      sound.playSingingBowl(288); // Release note
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const frac = Math.min(1, elapsed / currentDur);
      setProgress(frac);

      if (frac >= 1) {
        clearInterval(interval);
        if (!isCurrent) return;

        // Transition to next phase
        if (mode === '478') {
          if (phase === 'inhale') setPhase('hold');
          else if (phase === 'hold') setPhase('exhale');
          else if (phase === 'exhale') {
            setPhase('inhale');
            setCycleCount((c) => c + 1);
            onCycleComplete();
          }
        } else {
          // Box mode
          if (phase === 'inhale') setPhase('hold');
          else if (phase === 'hold') setPhase('exhale');
          else if (phase === 'exhale') setPhase('holdPost');
          else if (phase === 'holdPost') {
            setPhase('inhale');
            setCycleCount((c) => c + 1);
            onCycleComplete();
          }
        }
      }
    }, 30);

    return () => {
      isCurrent = false;
      clearInterval(interval);
    };
  }, [isActive, phase, mode]);

  // Orb scale based on phase and progress
  let orbScale = 1;
  if (phase === 'inhale') {
    orbScale = 1 + progress * 0.75; // expand from 1 to 1.75
  } else if (phase === 'hold' || phase === 'holdPost') {
    orbScale = phase === 'hold' ? 1.75 : 1;
  } else if (phase === 'exhale') {
    orbScale = 1.75 - progress * 0.75; // shrink from 1.75 to 1
  }

  const phaseLabel =
    phase === 'inhale'
      ? t.breath.inhale
      : phase === 'hold' || phase === 'holdPost'
      ? t.breath.hold
      : t.breath.exhale;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4 md:p-8 items-center">
      {/* Title */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <span>{t.breath.title}</span>
            <span aria-hidden="true">·</span>
            <span>Autonomic Nervous Reset</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {t.breath.title}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t.breath.subtitle}
          </p>
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => {
              setMode('478');
              setPhase('inhale');
              setProgress(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === '478' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.breath.mode478}
          </button>
          <button
            onClick={() => {
              setMode('box');
              setPhase('inhale');
              setProgress(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === 'box' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.breath.modeBox}
          </button>
        </div>
      </div>

      {/* Main Breathing Center Box */}
      <div className="relative w-full min-h-[460px] rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden flex flex-col items-center justify-center p-8">
        {/* Concentric expanding breathing orb */}
        <div className="relative flex items-center justify-center w-72 h-72">
          {/* Subtle outer aura */}
          <div
            className="absolute rounded-full bg-emerald-500/10 blur-2xl transition-all duration-300"
            style={{
              width: `${orbScale * 180}px`,
              height: `${orbScale * 180}px`,
            }}
          />

          {/* Secondary harmonic ring */}
          <div
            className="absolute rounded-full border border-emerald-400/30 transition-all duration-200"
            style={{
              width: `${orbScale * 140}px`,
              height: `${orbScale * 140}px`,
            }}
          />

          {/* Primary glowing core orb */}
          <div
            className="relative rounded-full shadow-2xl flex items-center justify-center transition-all duration-150 backdrop-blur-md"
            style={{
              width: `${orbScale * 110}px`,
              height: `${orbScale * 110}px`,
              background: 'radial-gradient(circle, rgba(16,185,129,0.9) 0%, rgba(5,150,105,0.7) 60%, rgba(4,120,87,0.4) 100%)',
              boxShadow: '0 0 50px rgba(16,185,129,0.35)',
            }}
          >
            <Heart className="w-8 h-8 text-white/90 animate-pulse" />
          </div>
        </div>

        {/* Phase instruction label */}
        <div className="mt-8 text-center space-y-2">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight animate-in fade-in duration-300">
            {phaseLabel}
          </h3>

          <div className="text-xs text-slate-400">
            {t.breath.cyclesDone}: <span className="font-mono tabular-nums font-bold text-emerald-400">{cycleCount}</span>
          </div>
        </div>

        {/* Play / Pause Toggle */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isActive ? t.breath.pause : t.breath.start}</span>
          </button>

          <button
            onClick={() => {
              setPhase('inhale');
              setProgress(0);
              setCycleCount(0);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset Counter"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
