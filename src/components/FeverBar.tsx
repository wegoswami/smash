import React, { useEffect } from 'react';
import { Flame, Zap, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FeverBarProps {
  feverCharge: number; // 0 to 100
  isFeverActive: boolean;
  onActivateFever: () => void;
}

export const FeverBar: React.FC<FeverBarProps> = ({
  feverCharge,
  isFeverActive,
  onActivateFever,
}) => {
  useEffect(() => {
    if (isFeverActive) {
      sound.playFanfare();
      confetti({
        particleCount: 75,
        spread: 90,
        origin: { y: 0.3 },
        colors: ['#ef4444', '#f97316', '#fbbf24', '#ffffff'],
      });
    }
  }, [isFeverActive]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-3 px-3 select-none">
      <div className="relative p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex items-center justify-between gap-3 overflow-hidden">
        {/* Label */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`p-1.5 rounded-xl border ${
              isFeverActive
                ? 'bg-rose-600 text-white border-rose-400 animate-bounce'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>{isFeverActive ? '🔥 FEVER RAGE ACTIVE!' : 'FEVER METER'}</span>
              {isFeverActive && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-extrabold animate-pulse">
                  3X SCORE
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              {isFeverActive
                ? '3X multiplier & extra coin frenzy!'
                : 'Hit, slice & pop to unleash 3X Frenzy!'}
            </div>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div
          role="progressbar"
          aria-valuenow={Math.round(feverCharge)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Fever meter charge"
          className="flex-1 max-w-xs md:max-w-md h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative"
        >
          <div
            className={`h-full transition-all duration-200 rounded-full ${
              isFeverActive
                ? 'bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-rose-500'
            }`}
            style={{ width: `${isFeverActive ? 100 : feverCharge}%` }}
          />
        </div>

        {/* Trigger Button if 100% and not active */}
        {!isFeverActive && feverCharge >= 100 ? (
          <button
            onClick={onActivateFever}
            aria-label="Unleash Fever Mode for 3X Score Frenzy"
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs shadow-lg animate-bounce transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            ⚡ UNLEASH!
          </button>
        ) : (
          <div className="text-xs font-mono font-bold text-amber-400 shrink-0">
            {isFeverActive ? 'MAX' : `${Math.round(feverCharge)}%`}
          </div>
        )}
      </div>

      {/* Screen Vignette Glow during Fever */}
      {isFeverActive && (
        <div className="fixed inset-0 pointer-events-none z-30 shadow-[inset_0_0_90px_rgba(244,63,94,0.45)] animate-pulse" />
      )}
    </div>
  );
};
