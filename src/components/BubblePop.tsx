import React, { useState } from 'react';
import { RefreshCw, Sparkles, Volume2 } from 'lucide-react';
import { sound } from '../utils/audio';
import { Language, translations } from '../utils/translations';
import confetti from 'canvas-confetti';

interface BubblePopProps {
  lang: Language;
  onBubblePopped: () => void;
}

const GRID_SIZE = 48; // 6 x 8 or 4 x 12 responsive grid

export const BubblePop: React.FC<BubblePopProps> = ({ lang, onBubblePopped }) => {
  const t = translations[lang];

  const [poppedState, setPoppedState] = useState<boolean[]>(() => Array(GRID_SIZE).fill(false));
  const [totalPoppedSession, setTotalPoppedSession] = useState<number>(0);
  const [autoReplenish, setAutoReplenish] = useState<boolean>(false);

  const handlePop = (index: number) => {
    if (poppedState[index]) return;

    sound.playBubblePop();
    onBubblePopped();
    setTotalPoppedSession((prev) => prev + 1);

    const nextState = [...poppedState];
    nextState[index] = true;
    setPoppedState(nextState);

    // If auto-replenish is active, reinflate after 2.5s
    if (autoReplenish) {
      setTimeout(() => {
        setPoppedState((current) => {
          const updated = [...current];
          updated[index] = false;
          return updated;
        });
      }, 2500);
    }

    // Milestone celebration
    const allPopped = nextState.every(Boolean);
    if (allPopped) {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#818cf8', '#a855f7'],
      });
    }
  };

  const handleResetSheet = () => {
    setPoppedState(Array(GRID_SIZE).fill(false));
    sound.playSingingBowl(440);
  };

  const handlePopAll = () => {
    // Rapid cascading popping sound effect
    poppedState.forEach((isPopped, idx) => {
      if (!isPopped) {
        setTimeout(() => {
          sound.playBubblePop();
          onBubblePopped();
        }, idx * 25);
      }
    });

    setPoppedState(Array(GRID_SIZE).fill(true));
    setTotalPoppedSession((prev) => prev + poppedState.filter((p) => !p).length);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, poppedState.length * 25);
  };

  const remainingCount = poppedState.filter((p) => !p).length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4 md:p-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1">
            <span>{t.bubble.title}</span>
            <span aria-hidden="true">·</span>
            <span>Tactile ASMR Decompression</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {t.bubble.title}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t.bubble.subtitle}
          </p>
        </div>

        {/* Counter and controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">{t.bubble.poppedCount}:</span>
            <span className="font-mono tabular-nums font-bold text-sky-400">{totalPoppedSession}</span>
          </div>

          <button
            onClick={() => setAutoReplenish(!autoReplenish)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              autoReplenish
                ? 'bg-sky-950/40 border-sky-800/60 text-sky-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {t.bubble.infiniteMode}: {autoReplenish ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Bubble Wrap Surface Box */}
      <div className="relative p-6 md:p-10 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden flex flex-col items-center">
        {/* Transparent plastic grid sheen */}
        <div className="w-full max-w-2xl grid grid-cols-6 sm:grid-cols-8 gap-3 sm:gap-4 p-5 rounded-2xl bg-sky-950/20 border border-sky-900/30 backdrop-blur-sm shadow-inner">
          {poppedState.map((isPopped, idx) => (
            <button
              key={idx}
              onClick={() => handlePop(idx)}
              className={`relative aspect-square rounded-full transition-transform active:scale-90 duration-150 focus:outline-none cursor-pointer flex items-center justify-center ${
                isPopped
                  ? 'bg-slate-950/60 border border-slate-800/80 shadow-inner scale-90 opacity-60'
                  : 'bg-gradient-to-br from-sky-400/30 via-sky-300/10 to-sky-500/20 border border-sky-300/40 shadow-lg hover:scale-105 hover:border-sky-300/70 hover:shadow-sky-500/20'
              }`}
            >
              {/* Highlight specular reflection dot */}
              {!isPopped ? (
                <>
                  <div className="absolute top-1.5 left-2 w-2 h-1 bg-white/70 rounded-full blur-[0.4px] rotate-[-30deg]" />
                  <div className="absolute bottom-1 right-2 w-1.5 h-1 bg-sky-300/30 rounded-full blur-[0.4px]" />
                </>
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80" />
              )}
            </button>
          ))}
        </div>

        {/* Action bar below grid */}
        <div className="mt-8 flex items-center justify-between w-full max-w-2xl text-xs">
          <span className="text-slate-400">
            {remainingCount} bubbles remaining on this sheet
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePopAll}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-200 font-semibold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cascading Pop</span>
            </button>

            <button
              onClick={handleResetSheet}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.bubble.resetGrid}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
