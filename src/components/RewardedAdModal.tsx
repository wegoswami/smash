import React, { useState, useEffect } from 'react';
import { X, Play, Sparkles, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed: () => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onClose,
  onRewardClaimed,
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setIsFinished(false);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          sound.playCoin();
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaim = () => {
    onRewardClaimed();
    sound.playFanfare();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#10b981'],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border-2 border-amber-500/50 shadow-2xl flex flex-col items-center text-center text-slate-100">
        {/* Close Button only if finished or skip allowed */}
        {isFinished && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Sponsor Header */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sponsored Message · 2X Multiplier</span>
        </div>

        {/* Ad Video / Creative Simulation */}
        <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-slate-700/80 p-5 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
          <div className="text-5xl mb-2 animate-bounce">🎧</div>
          <h4 className="text-base font-black text-white">ZenWaves Audio: Ultra Calm</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Binaural beats, ambient rainfall, and instant cortisol reduction in your headphones.
          </p>

          {/* Progress Timer Pill */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-mono font-bold text-amber-400">
            {!isFinished ? `Ad: 00:0${countdown}s` : 'Reward Ready! ✅'}
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full mt-5">
          {isFinished ? (
            <button
              onClick={handleClaim}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>COLLECT 2X MULTIPLIER REWARD!</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400 flex items-center justify-center gap-2 py-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Reward will unlock in {countdown} seconds...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
