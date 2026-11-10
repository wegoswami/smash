import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Flame, Zap, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface MoleItem {
  id: number;
  type: 'alarm' | 'email' | 'battery' | 'wifi' | 'boss' | 'lag' | 'star';
  label: string;
  icon: string;
  points: number;
  duration: number;
}

const MOLE_TYPES: Omit<MoleItem, 'id'>[] = [
  { type: 'alarm', label: '06:00 AM', icon: '⏰', points: 100, duration: 1100 },
  { type: 'email', label: 'Urgent Email', icon: '📧', points: 120, duration: 1000 },
  { type: 'battery', label: '1% Battery', icon: '🪫', points: 150, duration: 950 },
  { type: 'wifi', label: 'No Wi-Fi', icon: '🚫', points: 140, duration: 1050 },
  { type: 'boss', label: 'Monday Call', icon: '😤', points: 160, duration: 900 },
  { type: 'lag', label: 'Buffering...', icon: '⏳', points: 110, duration: 1150 },
  { type: 'star', label: 'Golden Peace!', icon: '⭐', points: 300, duration: 750 },
];

interface ScoreFloat {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface WhackAStressProps {
  onWatchAd?: () => void;
}

export const WhackAStress: React.FC<WhackAStressProps> = ({ onWatchAd }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('whack_highscore') || '0', 10);
  });
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [activeMoles, setActiveMoles] = useState<(MoleItem | null)[]>(Array(9).fill(null));
  const [whackedHoles, setWhackedHoles] = useState<boolean[]>(Array(9).fill(false));
  const [combo, setCombo] = useState<number>(0);
  const [floatingScores, setFloatingScores] = useState<ScoreFloat[]>([]);
  const [hammerPos, setHammerPos] = useState<{ x: number; y: number; isSwinging: boolean }>({
    x: 0,
    y: 0,
    isSwinging: false,
  });

  const nextIdRef = useRef<number>(1);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameClockRef = useRef<NodeJS.Timeout | null>(null);

  // Start game
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setActiveMoles(Array(9).fill(null));
    setWhackedHoles(Array(9).fill(false));
    sound.playBonk();
  };

  // End game
  const endGame = useCallback(() => {
    setIsPlaying(false);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (gameClockRef.current) clearInterval(gameClockRef.current);
    setActiveMoles(Array(9).fill(null));

    sound.playFanfare();

    setHighScore((prev) => {
      const best = Math.max(prev, score);
      localStorage.setItem('whack_highscore', best.toString());
      return best;
    });

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#34d399'],
    });
  }, [score]);

  // Game timer
  useEffect(() => {
    if (!isPlaying) return;

    gameClockRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (gameClockRef.current) clearInterval(gameClockRef.current);
    };
  }, [isPlaying, endGame]);

  // Mole spawning
  useEffect(() => {
    if (!isPlaying) return;

    const spawnMole = () => {
      // Find empty holes
      setActiveMoles((current) => {
        const emptyHoles = current
          .map((mole, idx) => (mole === null ? idx : null))
          .filter((v): v is number => v !== null);

        if (emptyHoles.length === 0) return current;

        // Choose random empty hole
        const chosenHole = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
        const template = MOLE_TYPES[Math.floor(Math.random() * MOLE_TYPES.length)];
        const mole: MoleItem = {
          ...template,
          id: nextIdRef.current++,
        };

        const updated = [...current];
        updated[chosenHole] = mole;

        // Auto retreat after duration
        setTimeout(() => {
          setActiveMoles((latest) => {
            if (latest[chosenHole]?.id === mole.id) {
              const cleaned = [...latest];
              cleaned[chosenHole] = null;
              return cleaned;
            }
            return latest;
          });
        }, mole.duration);

        return updated;
      });
    };

    spawnTimerRef.current = setInterval(spawnMole, 650);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [isPlaying]);

  // Whack mole
  const handleWhack = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isPlaying) return;

    const mole = activeMoles[index];
    if (!mole) {
      // Missed hit
      sound.playBonk();
      setCombo(0);
      return;
    }

    // Hit success!
    sound.playBonk();
    if (mole.type === 'star') sound.playCoin();

    // Trigger whacked animation for hole
    setWhackedHoles((prev) => {
      const u = [...prev];
      u[index] = true;
      setTimeout(() => {
        setWhackedHoles((curr) => {
          const reset = [...curr];
          reset[index] = false;
          return reset;
        });
      }, 250);
      return u;
    });

    const newCombo = combo + 1;
    setCombo(newCombo);

    const multiplier = newCombo >= 5 ? 2.5 : newCombo >= 3 ? 1.5 : 1;
    const earnedPoints = Math.round(mole.points * multiplier);
    setScore((s) => s + earnedPoints);

    // Floating score popup
    const rect = e.currentTarget.getBoundingClientRect();
    const floatId = Date.now() + Math.random();
    setFloatingScores((f) => [
      ...f,
      {
        id: floatId,
        x: rect.left + rect.width / 2,
        y: rect.top,
        text: `+${earnedPoints}${multiplier > 1 ? ` (x${multiplier})` : ''}`,
        color: mole.type === 'star' ? '#f59e0b' : '#f43f5e',
      },
    ]);

    setTimeout(() => {
      setFloatingScores((f) => f.filter((item) => item.id !== floatId));
    }, 800);

    // Remove mole immediately
    setActiveMoles((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-5 p-4 select-none">
      {/* Top Arcade HUD */}
      <div className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border-2 border-amber-500/40 shadow-xl shadow-amber-500/5">
        {/* Score */}
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black text-amber-400 font-mono tabular-nums tracking-wider drop-shadow">
            {score.toLocaleString()} <span className="text-xs uppercase text-slate-400 font-sans">PTS</span>
          </div>
          {combo >= 2 && (
            <div className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs animate-bounce shadow">
              🔥 {combo}x COMBO!
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2">
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">TIME</div>
            <div className={`text-2xl font-black font-mono tabular-nums ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* High Score */}
        <div className="flex items-center gap-2 text-right">
          <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">BEST</div>
            <div className="text-sm font-bold text-yellow-400 font-mono tabular-nums">{highScore.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* 3x3 Whack-a-Mole Field */}
      <div className="relative w-full max-w-2xl aspect-[4/3] max-h-[500px] p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-slate-800 shadow-2xl flex flex-col justify-center">
        {/* Playfield Grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 h-full items-center">
          {activeMoles.map((mole, idx) => {
            const isWhacked = whackedHoles[idx];
            return (
              <div
                key={idx}
                className="relative aspect-square flex flex-col items-center justify-end"
              >
                {/* Hole / Desk base */}
                <div className="absolute inset-x-2 bottom-1 h-12 bg-slate-900/90 rounded-full border-b-4 border-slate-800 shadow-inner flex items-center justify-center">
                  <div className="w-3/4 h-5 bg-black/60 rounded-full shadow-inner" />
                </div>

                {/* The Annoying Target / Mole */}
                <button
                  onClick={(e) => handleWhack(idx, e)}
                  disabled={!isPlaying}
                  aria-label={mole ? `Whack ${mole.label} for ${mole.points} points` : `Empty target hole ${idx + 1}`}
                  className={`relative z-10 w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all duration-150 transform ${
                    mole
                      ? 'translate-y-0 scale-100 opacity-100 animate-bounce'
                      : 'translate-y-8 scale-75 opacity-0 pointer-events-none'
                  } ${isWhacked ? 'scale-125 rotate-12 filter brightness-150' : 'hover:scale-105 active:scale-90'}`}
                >
                  {mole && (
                    <div className="flex flex-col items-center">
                      <span className="text-5xl md:text-6xl drop-shadow-lg select-none filter">
                        {mole.icon}
                      </span>
                      <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-900/90 text-white font-extrabold text-[11px] border border-slate-700 shadow whitespace-nowrap">
                        {mole.label}
                      </span>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Start Game / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/85 backdrop-blur-md rounded-3xl text-center">
            <span className="text-6xl mb-2 animate-bounce">🔨</span>
            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-500 to-yellow-400">
              {score > 0 ? 'TIME OVER!' : 'WHACK-A-STRESS!'}
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-sm">
              {score > 0
                ? `You scored ${score} PTS! All annoying notifications have been slammed down.`
                : 'Smash every alarm, unread email, low battery, and toxic message before time runs out!'}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-rose-600/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{score > 0 ? 'PLAY AGAIN' : 'START SMASHING!'}</span>
              </button>

              {score > 0 && onWatchAd && (
                <button
                  onClick={onWatchAd}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Double Score to {score * 2} (Watch 5s Ad)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating score text */}
      {floatingScores.map((f) => (
        <div
          key={f.id}
          className="fixed pointer-events-none z-50 font-black text-lg animate-out fade-out slide-out-to-top duration-700"
          style={{
            left: f.x,
            top: f.y - 20,
            color: f.color,
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          {f.text}
        </div>
      ))}
    </div>
  );
};
