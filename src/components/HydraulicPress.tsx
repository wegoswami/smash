import React, { useState, useEffect, useRef } from 'react';
import { Gauge, Sparkles, RefreshCw, Volume2, Play, Flame, Trophy, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface HydraulicPressProps {
  onItemCrushed?: (item: string) => void;
  onWatchAd?: () => void;
}

interface CrushableItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  maxPsi: number;
  color: string;
  squishColor: string;
  flavorText: string;
  debrisCount: number;
  debrisEmoji: string[];
}

const ITEMS: CrushableItem[] = [
  {
    id: 'alarm',
    name: '6:00 AM Alarm Clock',
    category: 'Work Stress',
    icon: '⏰',
    maxPsi: 3800,
    color: 'from-rose-500 to-red-600',
    squishColor: '#ef4444',
    flavorText: 'Silence Monday morning alarms forever with 4,000 PSI.',
    debrisCount: 40,
    debrisEmoji: ['⚙️', '🔔', '🔩', '⚡', '💥'],
  },
  {
    id: 'soda',
    name: 'Fizzy Energy Soda',
    category: 'Junk Food',
    icon: '🥫',
    maxPsi: 2400,
    color: 'from-amber-400 to-orange-500',
    squishColor: '#f59e0b',
    flavorText: 'Listen to the ultimate metallic crinkle and foam burst.',
    debrisCount: 35,
    debrisEmoji: ['🫧', '✨', '⚡', '🥤'],
  },
  {
    id: 'duck',
    name: 'Squeaky Rubber Duck',
    category: 'ASMR Toy',
    icon: '🦆',
    maxPsi: 1900,
    color: 'from-yellow-400 to-amber-500',
    squishColor: '#fbbf24',
    flavorText: 'Super squishy rubber that squeaks until it flattens!',
    debrisCount: 30,
    debrisEmoji: ['✨', '🐥', '⭐', '💛'],
  },
  {
    id: 'phone',
    name: 'Broken Work Phone',
    category: 'Tech Stress',
    icon: '📱',
    maxPsi: 5600,
    color: 'from-sky-500 to-indigo-600',
    squishColor: '#38bdf8',
    flavorText: 'No more "can we sync quickly?" messages or 99+ notifications.',
    debrisCount: 45,
    debrisEmoji: ['🔋', '⚡', '💫', '💥', '🔷'],
  },
  {
    id: 'watermelon',
    name: 'Giant Watermelon',
    category: 'Summer Fruit',
    icon: '🍉',
    maxPsi: 3200,
    color: 'from-emerald-500 to-red-500',
    squishColor: '#10b981',
    flavorText: 'Juicy, explosive, and ultra-satisfying red splatter!',
    debrisCount: 50,
    debrisEmoji: ['🍉', '💦', '🔴', '✨', '🌱'],
  },
  {
    id: 'diamond',
    name: 'Titan Diamond',
    category: 'Hardest Mineral',
    icon: '💎',
    maxPsi: 9800,
    color: 'from-cyan-400 to-teal-400',
    squishColor: '#06b6d4',
    flavorText: 'Can 10,000 PSI shatter the hardest stone on earth?',
    debrisCount: 60,
    debrisEmoji: ['💎', '✨', '⭐', '🔮', '💠'],
  },
];

export const HydraulicPress: React.FC<HydraulicPressProps> = ({ onItemCrushed }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [pressProgress, setPressProgress] = useState<number>(0); // 0 to 1
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [isCrushed, setIsCrushed] = useState<boolean>(false);
  const [isAutoCrush, setIsAutoCrush] = useState<boolean>(false);
  const [crushCount, setCrushCount] = useState<number>(0);
  const [screenShake, setScreenShake] = useState<boolean>(false);

  const activeItem = ITEMS[selectedIdx];
  const pressIntervalRef = useRef<number | null>(null);
  const humSoundTimerRef = useRef<number | null>(null);

  // Clean interval on unmount
  useEffect(() => {
    return () => {
      if (pressIntervalRef.current) clearInterval(pressIntervalRef.current);
      if (humSoundTimerRef.current) clearInterval(humSoundTimerRef.current);
    };
  }, []);

  // Keyboard shortcut: Spacebar to crush
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !isCrushed) {
        e.preventDefault();
        startPress();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        stopPress();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCrushed, activeItem]);

  // Pressing mechanism
  const startPress = () => {
    if (isCrushed) return;
    setIsPressing(true);
    sound.playHydraulicHum();

    // Loop hum sound periodically while holding
    if (!humSoundTimerRef.current) {
      humSoundTimerRef.current = window.setInterval(() => {
        sound.playHydraulicHum();
      }, 260);
    }

    if (pressIntervalRef.current) clearInterval(pressIntervalRef.current);
    pressIntervalRef.current = window.setInterval(() => {
      setPressProgress((prev) => {
        const next = prev + 0.04;
        if (next >= 1) {
          triggerCompleteCrush();
          return 1;
        }
        return next;
      });
    }, 40);
  };

  const stopPress = () => {
    if (isAutoCrush) return;
    setIsPressing(false);
    if (pressIntervalRef.current) {
      clearInterval(pressIntervalRef.current);
      pressIntervalRef.current = null;
    }
    if (humSoundTimerRef.current) {
      clearInterval(humSoundTimerRef.current);
      humSoundTimerRef.current = null;
    }

    // Slowly retract if not completely crushed
    if (!isCrushed) {
      pressIntervalRef.current = window.setInterval(() => {
        setPressProgress((prev) => {
          if (prev <= 0) {
            if (pressIntervalRef.current) clearInterval(pressIntervalRef.current);
            return 0;
          }
          return prev - 0.05;
        });
      }, 30);
    }
  };

  const triggerCompleteCrush = () => {
    if (pressIntervalRef.current) clearInterval(pressIntervalRef.current);
    if (humSoundTimerRef.current) clearInterval(humSoundTimerRef.current);
    setIsPressing(false);
    setIsAutoCrush(false);
    setIsCrushed(true);

    // Audio & Haptic impact
    sound.playHydraulicCrush();
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 600);

    // Confetti and debris blast
    confetti({
      particleCount: activeItem.debrisCount,
      spread: 90,
      origin: { y: 0.65 },
      colors: [activeItem.squishColor, '#f59e0b', '#ffffff', '#ef4444'],
    });

    setCrushCount((c) => c + 1);
    onItemCrushed?.(activeItem.name);
  };

  const handleNextItem = () => {
    setIsCrushed(false);
    setPressProgress(0);
    setSelectedIdx((prev) => (prev + 1) % ITEMS.length);
    sound.playBonk();
  };

  const handleResetCurrent = () => {
    setIsCrushed(false);
    setPressProgress(0);
    sound.playBonk();
  };

  // Calculated variables
  const currentPsi = Math.round(pressProgress * activeItem.maxPsi);
  const pistonHeightPct = pressProgress * 78; // moves piston down 0% to 78%
  const scaleY = Math.max(0.12, 1 - pressProgress * 0.88);
  const scaleX = 1 + pressProgress * 0.95;

  return (
    <div
      className={`w-full max-w-4xl mx-auto flex flex-col items-center select-none transition-transform duration-75 ${
        screenShake ? 'animate-bounce' : ''
      }`}
    >
      {/* Header Info */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-4 backdrop-blur shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-2xl shadow-lg shadow-rose-500/20">
            🚜
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-wide">
                HYDRAULIC PRESS CRUSHER
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded-full">
                Viral ASMR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hold the crush button or spacebar to squash items with 10,000 PSI!
            </p>
          </div>
        </div>

        {/* Live PSI Gauge readout */}
        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-amber-400" /> Hydraulic Force
            </div>
            <div className="text-xl font-black font-mono tracking-tight text-amber-400">
              {currentPsi.toLocaleString()}{' '}
              <span className="text-xs text-slate-500 font-sans">PSI</span>
            </div>
          </div>
          <div className="text-right border-l border-slate-800 pl-4">
            <div className="text-[10px] uppercase font-bold text-slate-500">Crushed</div>
            <div className="text-xl font-black font-mono text-emerald-400">{crushCount}</div>
          </div>
        </div>
      </div>

      {/* Main Hydraulic Press Chamber */}
      <div className="w-full relative bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-6 overflow-hidden shadow-2xl flex flex-col items-center">
        {/* Yellow & Black Industrial Hazard Stripes (Top & Bottom) */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_10px,#0f172a_10px,#0f172a_20px)] opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_10px,#0f172a_10px,#0f172a_20px)] opacity-80" />

        {/* Steel Guide Columns on Left and Right */}
        <div className="absolute left-6 top-8 bottom-8 w-5 rounded-full bg-gradient-to-r from-slate-700 via-slate-400 to-slate-800 shadow-inner" />
        <div className="absolute right-6 top-8 bottom-8 w-5 rounded-full bg-gradient-to-r from-slate-700 via-slate-400 to-slate-800 shadow-inner" />

        {/* Vertical Press Stage (360px high) */}
        <div className="relative w-full max-w-md h-[340px] flex flex-col items-center justify-between my-2">
          {/* Hydraulic Cylinder & Moving Piston */}
          <div
            className="w-full flex flex-col items-center transition-all ease-linear"
            style={{
              transform: `translateY(${pistonHeightPct * 2.2}px)`,
            }}
          >
            {/* Top Cylinder Rod */}
            <div className="w-10 h-24 bg-gradient-to-r from-slate-500 via-slate-200 to-slate-600 rounded-t shadow-md" />
            {/* Heavy Cast Iron Press Head */}
            <div className="w-48 sm:w-60 h-10 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-2 border-slate-600 rounded-lg flex items-center justify-center shadow-2xl relative">
              <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase">
                ⚙️ 10,000 PSI STEEL RAM
              </span>
              {/* Pressure Sparks during crushing */}
              {isPressing && pressProgress > 0.4 && (
                <span className="absolute -bottom-3 text-amber-400 animate-ping text-xs">⚡</span>
              )}
            </div>
          </div>

          {/* Target Object Stage on Steel Anvil */}
          <div className="w-full flex flex-col items-center justify-end relative z-10">
            {/* The Squashable Item */}
            <div
              className="relative flex flex-col items-center justify-center transition-transform origin-bottom"
              style={{
                transform: `scale(${scaleX}, ${scaleY})`,
                transitionDuration: isPressing ? '50ms' : '200ms',
              }}
            >
              <div className="text-7xl sm:text-8xl select-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                {activeItem.icon}
              </div>

              {/* Stress fracture overlay as pressure increases */}
              {pressProgress > 0.3 && !isCrushed && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ opacity: pressProgress }}
                >
                  <span className="text-4xl text-rose-500 animate-pulse font-black">⚡💥</span>
                </div>
              )}
            </div>

            {/* Completely Crushed Splatter / Pancake state */}
            {isCrushed && (
              <div className="absolute -bottom-2 flex items-center gap-1 animate-bounce">
                {activeItem.debrisEmoji.map((emoji, i) => (
                  <span key={i} className="text-xl">
                    {emoji}
                  </span>
                ))}
              </div>
            )}

            {/* Heavy Steel Anvil Plate */}
            <div className="w-64 sm:w-80 h-10 bg-gradient-to-t from-slate-800 via-slate-700 to-slate-600 border-2 border-slate-500 rounded-lg flex items-center justify-center shadow-2xl mt-1">
              <div className="text-[10px] font-mono font-bold text-slate-300 tracking-wider">
                TITANIUM HARDENED BASE
              </div>
            </div>
          </div>
        </div>

        {/* Item Info Banner */}
        <div className="text-center my-2">
          <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
            <span>{activeItem.name}</span>
            <span className="text-xs text-slate-400 font-normal">({activeItem.category})</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-0.5">{activeItem.flavorText}</p>
        </div>

        {/* Big Interactive Action Controls */}
        <div className="w-full max-w-md flex flex-col items-center gap-3 mt-2">
          {!isCrushed ? (
            <div className="w-full flex gap-3">
              {/* Big "HOLD TO CRUSH" Button */}
              <button
                onMouseDown={startPress}
                onMouseUp={stopPress}
                onMouseLeave={stopPress}
                onTouchStart={startPress}
                onTouchEnd={stopPress}
                onTouchCancel={stopPress}
                className={`flex-1 py-4 px-6 rounded-2xl font-black text-base sm:text-lg tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                  isPressing
                    ? 'bg-rose-600 text-white shadow-rose-600/50 scale-98 ring-4 ring-rose-400'
                    : 'bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white hover:brightness-110 shadow-rose-500/30'
                }`}
              >
                <Flame className={`w-6 h-6 ${isPressing ? 'animate-spin' : ''}`} />
                <span>{isPressing ? 'CRUSHING... HOLD!' : 'HOLD TO CRUSH!'}</span>
              </button>

              {/* Instant Auto-Crush Toggle */}
              <button
                onClick={() => {
                  setIsAutoCrush(true);
                  startPress();
                }}
                className="px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                title="Instant One-Click Full Crush"
              >
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Auto</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex gap-3 animate-fade-in">
              <button
                onClick={handleNextItem}
                className="flex-1 py-4 px-6 rounded-2xl font-black text-base tracking-wider uppercase bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span>CRUSHED! NEXT OBJECT ➡️</span>
              </button>
              <button
                onClick={handleResetCurrent}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center justify-center cursor-pointer"
                title="Crush Same Item Again"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Quick Item Picker Carousel */}
          <div className="w-full flex items-center justify-between gap-1.5 overflow-x-auto py-2 px-1">
            {ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedIdx(idx);
                  setIsCrushed(false);
                  setPressProgress(0);
                  sound.playBonk();
                }}
                className={`flex-1 min-w-[50px] py-2 px-1.5 rounded-xl border flex flex-col items-center transition-all cursor-pointer ${
                  selectedIdx === idx
                    ? 'bg-slate-800 border-amber-400 text-white scale-105 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-bold mt-0.5 truncate w-full text-center">
                  {item.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
