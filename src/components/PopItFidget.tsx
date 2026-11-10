import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, RotateCcw, Sparkles, Timer, Trophy, Zap, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface PopItFidgetProps {
  onPop?: () => void;
}

type ShapeType = 'square' | 'heart' | 'circle';

interface BubbleState {
  id: number;
  row: number;
  col: number;
  popped: boolean;
  color: string;
}

const ROW_COLORS = [
  { bg: 'bg-rose-500', shadow: 'shadow-rose-600/40', ring: 'ring-rose-400', hex: '#f43f5e' },
  { bg: 'bg-amber-500', shadow: 'shadow-amber-600/40', ring: 'ring-amber-400', hex: '#f59e0b' },
  { bg: 'bg-yellow-400', shadow: 'shadow-yellow-500/40', ring: 'ring-yellow-300', hex: '#facc15' },
  { bg: 'bg-emerald-500', shadow: 'shadow-emerald-600/40', ring: 'ring-emerald-400', hex: '#10b981' },
  { bg: 'bg-sky-500', shadow: 'shadow-sky-600/40', ring: 'ring-sky-400', hex: '#0ea5e9' },
  { bg: 'bg-purple-500', shadow: 'shadow-purple-600/40', ring: 'ring-purple-400', hex: '#a855f7' },
];

export const PopItFidget: React.FC<PopItFidgetProps> = ({ onPop }) => {
  const [shape, setShape] = useState<ShapeType>('square');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [popCount, setPopCount] = useState<number>(0);
  const [challengeMode, setChallengeMode] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [bestTime, setBestTime] = useState<number>(() => {
    return parseInt(localStorage.getItem('smashchill_popit_best') || '0', 10);
  });

  const timerRef = useRef<number | null>(null);

  // 6x6 Grid of bubbles (36 bubbles)
  const [bubbles, setBubbles] = useState<BubbleState[]>(() => {
    const list: BubbleState[] = [];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        list.push({
          id: r * 6 + c,
          row: r,
          col: c,
          popped: false,
          color: ROW_COLORS[r].hex,
        });
      }
    }
    return list;
  });

  // Handle speed pop challenge timer
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            sound.playBonk();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  const handlePopBubble = (id: number, row: number) => {
    const bubble = bubbles.find((b) => b.id === id);
    if (!bubble) return;

    // Toggle pop state
    sound.playPopIt(row);
    onPop?.();
    setPopCount((c) => c + 1);

    if (challengeMode && !isTimerRunning && timeLeft === 30) {
      setIsTimerRunning(true);
    }

    setBubbles((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, popped: !b.popped } : b));
      // Check if all popped in current side
      const allDone = next.every((b) => b.popped);
      if (allDone) {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ROW_COLORS.map((r) => r.hex),
        });
        sound.playFanfare();

        if (challengeMode && isTimerRunning) {
          setIsTimerRunning(false);
          const timeTaken = 30 - timeLeft;
          if (bestTime === 0 || timeTaken < bestTime) {
            setBestTime(timeTaken);
            localStorage.setItem('smashchill_popit_best', timeTaken.toString());
          }
        }
      }
      return next;
    });
  };

  const handleFlipBoard = () => {
    setIsFlipped((prev) => !prev);
    sound.playBoing();
    // After flip animation, un-pop so you can pop the other side immediately
    setTimeout(() => {
      setBubbles((prev) => prev.map((b) => ({ ...b, popped: false })));
    }, 280);
  };

  const handleResetBoard = () => {
    setBubbles((prev) => prev.map((b) => ({ ...b, popped: false })));
    setTimeLeft(30);
    setIsTimerRunning(false);
    sound.playBonk();
  };

  const poppedCount = bubbles.filter((b) => b.popped).length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {/* Title & Modes Header */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-4 backdrop-blur shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-amber-400 to-teal-400 flex items-center justify-center text-2xl shadow-lg shadow-pink-500/20">
            🌈
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-wide">3D POP-IT FIDGET TOY</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-500/20 text-pink-400 border border-pink-500/40 px-2 py-0.5 rounded-full">
                Tactile ASMR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pop satisfying rainbow bubbles, then hit Flip Board to pop again forever!
            </p>
          </div>
        </div>

        {/* Action Quick Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setChallengeMode(!challengeMode);
              handleResetBoard();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              challengeMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span>{challengeMode ? `Rush: ${timeLeft}s` : 'Speed Rush'}</span>
          </button>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Popped</span>
            <span className="text-sm font-black font-mono text-pink-400">
              {poppedCount} / 36
            </span>
          </div>
        </div>
      </div>

      {/* 3D Pop It Frame & Stage */}
      <div className="w-full relative bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
        {/* Soft Ambient Glow */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3D Silicone Board with Perspective Flip */}
        <div className="perspective-1000 my-4">
          <div
            className="p-4 sm:p-6 rounded-[2.5rem] bg-slate-800/90 border-4 border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur transition-transform duration-500 ease-out"
            style={{
              transform: isFlipped ? 'rotateY(180deg) scale(0.98)' : 'rotateY(0deg) scale(1)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* The 6x6 Rainbow Rows */}
            <div className="grid grid-cols-6 gap-2.5 sm:gap-3.5">
              {bubbles.map((b) => {
                const colorDef = ROW_COLORS[b.row];
                return (
                  <button
                    key={b.id}
                    onClick={() => handlePopBubble(b.id, b.row)}
                    className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center relative active:scale-90 ${
                      b.popped
                        ? 'scale-90 opacity-70 inset-shadow-md'
                        : 'scale-100 hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: b.color,
                      boxShadow: b.popped
                        ? 'inset 0 4px 8px rgba(0,0,0,0.6), inset 0 -2px 4px rgba(255,255,255,0.2)'
                        : '0 6px 12px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Inner 3D Dimple Ring */}
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all flex items-center justify-center ${
                        b.popped
                          ? 'bg-black/30 shadow-inner'
                          : 'bg-white/15 shadow-sm'
                      }`}
                    >
                      {/* Tactile Glare / Inward Dent */}
                      <div
                        className={`w-3 h-3 rounded-full transition-all ${
                          b.popped
                            ? 'bg-black/40 scale-75'
                            : 'bg-white/40 -translate-y-1 -translate-x-1'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Board Flip and Reset Controls */}
        <div className="w-full max-w-md flex items-center justify-center gap-3 mt-4">
          {/* Main 3D Flip Button */}
          <button
            onClick={handleFlipBoard}
            className="flex-1 py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base tracking-wide uppercase bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white hover:brightness-110 shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5 animate-spin-reverse" />
            <span>FLIP BOARD 🔁</span>
          </button>

          {/* Reset All Bubbles Button */}
          <button
            onClick={handleResetBoard}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center cursor-pointer transition-all"
            title="Reset All Bubbles"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* High Score / Best Time in Challenge */}
        {challengeMode && bestTime > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            <Trophy className="w-3.5 h-3.5" />
            <span>Best Rush Time: {bestTime}s</span>
          </div>
        )}
      </div>
    </div>
  );
};
