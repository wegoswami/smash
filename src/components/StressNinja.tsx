import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Trophy, Sparkles, Sword } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FlyingObject {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  icon: string;
  label: string;
  color: string;
  isSliced: boolean;
  sliceX?: number;
  sliceY?: number;
  halves?: {
    left: { x: number; y: number; vx: number; vy: number; rot: number };
    right: { x: number; y: number; vx: number; vy: number; rot: number };
  };
}

interface SlashPoint {
  x: number;
  y: number;
  time: number;
}

interface StressNinjaProps {
  onWatchAd?: () => void;
}

const ITEMS_POOL = [
  { icon: '⏰', label: 'ALARM', color: '#f43f5e' },
  { icon: '🖥️', label: 'LAGGY PC', color: '#38bdf8' },
  { icon: '☕', label: 'COLD COFFEE', color: '#f59e0b' },
  { icon: '📑', label: 'TAX BILL', color: '#10b981' },
  { icon: '📱', label: 'SPAM CALL', color: '#a855f7' },
  { icon: '🖨️', label: 'PAPER JAM', color: '#ec4899' },
  { icon: '💣', label: 'STRESS BOMB', color: '#ef4444' },
];

export const StressNinja: React.FC<StressNinjaProps> = ({ onWatchAd }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('ninja_highscore') || '0', 10);
  });
  const [timeLeft, setTimeLeft] = useState<number>(40);
  const [combo, setCombo] = useState<number>(0);

  const objectsRef = useRef<FlyingObject[]>([]);
  const slashTrailRef = useRef<SlashPoint[]>([]);
  const isMouseDownRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const nextIdRef = useRef<number>(1);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(40);
    setCombo(0);
    objectsRef.current = [];
    slashTrailRef.current = [];
    sound.playSlice();
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    objectsRef.current = [];

    sound.playFanfare();

    setHighScore((prev) => {
      const best = Math.max(prev, score);
      localStorage.setItem('ninja_highscore', best.toString());
      return best;
    });

    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.6 },
    });
  }, [score]);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, endGame]);

  // Spawning flying targets
  useEffect(() => {
    if (!isPlaying) return;

    const spawn = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const count = Math.random() < 0.4 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const template = ITEMS_POOL[Math.floor(Math.random() * ITEMS_POOL.length)];
        const startX = 100 + Math.random() * (canvas.width - 200);
        const vx = (Math.random() - 0.5) * 5;
        const vy = -(11 + Math.random() * 4); // shoot upward

        objectsRef.current.push({
          id: nextIdRef.current++,
          x: startX,
          y: canvas.height + 20,
          vx,
          vy,
          rot: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.1,
          icon: template.icon,
          label: template.label,
          color: template.color,
          isSliced: false,
        });
      }
    };

    spawnIntervalRef.current = setInterval(spawn, 900);
    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    };
  }, [isPlaying]);

  // Handle pointer tracking for slicing
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isMouseDownRef.current = true;
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    slashTrailRef.current = [{ x, y, time: Date.now() }];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    slashTrailRef.current.push({ x, y, time: Date.now() });

    // Slicing detection against active objects
    if (isMouseDownRef.current && isPlaying) {
      objectsRef.current.forEach((obj) => {
        if (!obj.isSliced) {
          const dist = Math.hypot(obj.x - x, obj.y - y);
          if (dist < 45) {
            // Sliced!
            obj.isSliced = true;
            sound.playSlice();

            setScore((s) => s + 100);
            setCombo((c) => c + 1);

            // Separate into two halves
            obj.halves = {
              left: { x: obj.x - 10, y: obj.y, vx: -3, vy: obj.vy - 2, rot: obj.rot },
              right: { x: obj.x + 10, y: obj.y, vx: 3, vy: obj.vy - 2, rot: obj.rot },
            };
          }
        }
      });
    }
  };

  const handlePointerUp = () => {
    isMouseDownRef.current = false;
  };

  // Main canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw glowing blade slash trail
      const now = Date.now();
      slashTrailRef.current = slashTrailRef.current.filter((p) => now - p.time < 160);

      if (slashTrailRef.current.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(slashTrailRef.current[0].x, slashTrailRef.current[0].y);
        for (let i = 1; i < slashTrailRef.current.length; i++) {
          ctx.lineTo(slashTrailRef.current[i].x, slashTrailRef.current[i].y);
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 12;
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Update and draw flying targets
      const objs = objectsRef.current;
      for (let i = objs.length - 1; i >= 0; i--) {
        const obj = objs[i];

        if (!obj.isSliced) {
          obj.x += obj.vx;
          obj.y += obj.vy;
          obj.vy += 0.28; // gravity
          obj.rot += obj.vRot;

          // Draw intact item
          ctx.save();
          ctx.translate(obj.x, obj.y);
          ctx.rotate(obj.rot);

          // Shadow
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.beginPath();
          ctx.arc(0, 15, 24, 0, Math.PI * 2);
          ctx.fill();

          // Big icon
          ctx.font = '48px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(obj.icon, 0, 0);

          ctx.restore();
        } else if (obj.halves) {
          // Draw sliced halves tumbling apart
          const left = obj.halves.left;
          const right = obj.halves.right;

          left.x += left.vx;
          left.y += left.vy;
          left.vy += 0.32;
          left.rot -= 0.1;

          right.x += right.vx;
          right.y += right.vy;
          right.vy += 0.32;
          right.rot += 0.1;

          ctx.save();
          ctx.translate(left.x, left.y);
          ctx.rotate(left.rot);
          ctx.font = '36px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(obj.icon, -10, 0);
          ctx.restore();

          ctx.save();
          ctx.translate(right.x, right.y);
          ctx.rotate(right.rot);
          ctx.font = '36px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(obj.icon, 10, 0);
          ctx.restore();
        }

        // Cleanup out of bounds
        if (obj.y > canvas.height + 60 && obj.vy > 0) {
          objs.splice(i, 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4 p-4 select-none">
      {/* Top Arcade HUD */}
      <div className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border-2 border-sky-500/40 shadow-xl shadow-sky-500/5">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black text-sky-400 font-mono tabular-nums tracking-wider drop-shadow">
            {score.toLocaleString()} <span className="text-xs uppercase text-slate-400 font-sans">PTS</span>
          </div>
          {combo >= 3 && (
            <div className="px-2.5 py-1 rounded-full bg-sky-600 text-white font-extrabold text-xs animate-pulse">
              ⚡ {combo} SLICES!
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">TIME</div>
          <div className={`text-2xl font-black font-mono tabular-nums ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="flex items-center gap-2 text-right">
          <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">BEST</div>
            <div className="text-sm font-bold text-yellow-400 font-mono tabular-nums">{highScore.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Slicing Arena Canvas */}
      <div className="relative w-full max-w-3xl aspect-[16/10] max-h-[500px] rounded-3xl overflow-hidden bg-slate-950 border-4 border-slate-800 shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/85 backdrop-blur-md rounded-3xl text-center">
            <span className="text-6xl mb-2 animate-bounce">⚔️</span>
            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-rose-400">
              {score > 0 ? 'SLASH TIME OVER!' : 'STRESS NINJA'}
            </h3>
            <p className="text-sm text-slate-300 mt-2 max-w-sm">
              {score > 0
                ? `Total ${score} points! You sliced through all your day's stress.`
                : 'Swipe your mouse or finger across flying alarms, bills, and bugs to slice them in half!'}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-sky-600/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{score > 0 ? 'PLAY AGAIN' : 'START SLICING!'}</span>
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
    </div>
  );
};
