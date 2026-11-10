import React, { useState, useRef } from 'react';
import { X, Sparkles, Trophy, Gift, RotateCcw, Zap, Check } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  onActivateFeverBonus?: () => void;
}

const SECTORS = [
  { label: '+150 Coins', value: 150, type: 'coins', color: '#f43f5e' },
  { label: '3X Fever Rage', value: 0, type: 'fever', color: '#f59e0b' },
  { label: '+300 Coins', value: 300, type: 'coins', color: '#10b981' },
  { label: 'Mystery Gift', value: 200, type: 'coins', color: '#0ea5e9' },
  { label: '+500 Coins', value: 500, type: 'coins', color: '#8b5cf6' },
  { label: '2X Score Perk', value: 0, type: 'fever', color: '#ec4899' },
  { label: '+1,000 JACKPOT', value: 1000, type: 'jackpot', color: '#facc15' },
  { label: '+250 Coins', value: 250, type: 'coins', color: '#14b8a6' },
];

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  isOpen,
  onClose,
  coins,
  setCoins,
  onActivateFeverBonus,
}) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [spinsLeft, setSpinsLeft] = useState<number>(() => {
    const saved = localStorage.getItem('smashchill_daily_spins');
    return saved !== null ? parseInt(saved, 10) : 3;
  });

  const tickTimerRef = useRef<NodeJS.Timeout | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setWonPrize(null);
    setSpinsLeft((s) => {
      const next = s - 1;
      localStorage.setItem('smashchill_daily_spins', next.toString());
      return next;
    });

    // Random sector (0 to 7)
    const pickedIdx = Math.floor(Math.random() * SECTORS.length);
    const sectorAngle = 360 / SECTORS.length;
    // Calculate final rotation (min 5 full rotations + offset)
    const targetDeg = rotationDeg + 360 * 6 + (360 - pickedIdx * sectorAngle - sectorAngle / 2);

    setRotationDeg(targetDeg);

    // Play rapid ticks during spin
    let tickCount = 0;
    tickTimerRef.current = setInterval(() => {
      sound.playSpinTick();
      tickCount++;
      if (tickCount > 28) {
        if (tickTimerRef.current) clearInterval(tickTimerRef.current);
      }
    }, 120);

    // Stop after 4.2 seconds
    setTimeout(() => {
      if (tickTimerRef.current) clearInterval(tickTimerRef.current);
      setIsSpinning(false);
      const sector = SECTORS[pickedIdx];
      setWonPrize(sector.label);

      if (sector.type === 'coins' || sector.type === 'jackpot') {
        setCoins((c) => c + sector.value);
      } else if (sector.type === 'fever') {
        onActivateFeverBonus?.();
      }

      sound.playFanfare();
      confetti({
        particleCount: 75,
        spread: 85,
        origin: { y: 0.5 },
        colors: ['#facc15', '#f59e0b', '#f43f5e', '#38bdf8'],
      });
    }, 4200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg p-6 md:p-8 rounded-3xl bg-slate-900 border-2 border-amber-500/50 shadow-2xl flex flex-col items-center text-center text-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-1 mb-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Lucky Wheel</span>
          </div>
          <h3 className="text-2xl font-black text-white">LUCKY ZEN SPIN</h3>
          <p className="text-xs text-slate-400">
            Spin the wheel for massive Zen Coin jackpots, fever boosts, and powerups!
          </p>
        </div>

        {/* Wheel Container with Pointer Arrow */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-3 flex items-center justify-center">
          {/* Top Fixed Needle Pointer */}
          <div className="absolute -top-3 z-30 flex flex-col items-center">
            <div className="w-6 h-6 bg-amber-400 rotate-45 border-2 border-slate-950 shadow-xl" />
          </div>

          {/* The Spinning Wheel */}
          <div
            className="w-full h-full rounded-full border-8 border-slate-800 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative overflow-hidden transition-transform ease-out"
            style={{
              transform: `rotate(${rotationDeg}deg)`,
              transitionDuration: isSpinning ? '4200ms' : '0ms',
            }}
          >
            {SECTORS.map((sec, idx) => {
              const angle = (360 / SECTORS.length) * idx;
              return (
                <div
                  key={idx}
                  className="absolute inset-0 flex items-start justify-center pt-3 text-xs font-black text-white"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: '50% 50%',
                  }}
                >
                  <div
                    className="absolute inset-0 -z-10"
                    style={{
                      background: `conic-gradient(from -22.5deg at 50% 50%, ${sec.color} 45deg, transparent 45deg)`,
                      transform: 'rotate(-22.5deg)',
                    }}
                  />
                  <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">
                    {sec.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Golden Center Hub */}
          <div className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border-4 border-slate-900 shadow-2xl flex items-center justify-center text-lg font-black text-slate-950 z-20">
            🎯
          </div>
        </div>

        {/* Won Prize Announcement */}
        {wonPrize && (
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-sm font-black my-2 animate-bounce flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>YOU WON: {wonPrize}! 🎉</span>
          </div>
        )}

        {/* Action Button & Spins Counter */}
        <div className="w-full mt-3 flex flex-col items-center gap-2">
          <button
            onClick={handleSpin}
            disabled={isSpinning || spinsLeft <= 0}
            className={`w-full max-w-xs py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
              isSpinning || spinsLeft <= 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-70'
                : 'bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:brightness-110 text-white hover:scale-105 active:scale-95 shadow-amber-500/20'
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'SPINNING...' : `SPIN WHEEL (${spinsLeft} LEFT)`}</span>
          </button>

          <span className="text-[11px] text-slate-400">
            {spinsLeft > 0
              ? `You have ${spinsLeft} free spins remaining today!`
              : 'All daily spins used. Come back tomorrow for 3 more!'}
          </span>
        </div>
      </div>
    </div>
  );
};
