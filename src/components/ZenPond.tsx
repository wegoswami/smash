import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Droplets, CloudRain, Heart, RefreshCw } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FoodPellet {
  id: number;
  x: number;
  y: number;
  alpha: number;
}

interface KoiFish {
  x: number;
  y: number;
  angle: number;
  speed: number;
  targetX: number;
  targetY: number;
  color: string;
  size: number;
  happiness: number;
}

interface LotusPad {
  id: number;
  x: number;
  y: number;
  bloomed: boolean;
  petalCount: number;
}

export const ZenPond: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<{ x: number; y: number; r: number; alpha: number }[]>([]);
  const foodRef = useRef<FoodPellet[]>([]);
  const koiRef = useRef<KoiFish[]>([]);
  const lotusRef = useRef<LotusPad[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const [fishFedCount, setFishFedCount] = useState<number>(0);
  const [bloomedCount, setBloomedCount] = useState<number>(0);
  const [ambientRainActive, setAmbientRainActive] = useState<boolean>(false);

  // Initialize lotus pads and koi
  useEffect(() => {
    lotusRef.current = [
      { id: 1, x: 140, y: 130, bloomed: false, petalCount: 6 },
      { id: 2, x: 620, y: 160, bloomed: false, petalCount: 8 },
      { id: 3, x: 220, y: 360, bloomed: false, petalCount: 6 },
      { id: 4, x: 580, y: 380, bloomed: false, petalCount: 8 },
      { id: 5, x: 400, y: 80, bloomed: false, petalCount: 7 },
    ];

    koiRef.current = [
      {
        x: 200,
        y: 240,
        angle: 0.5,
        speed: 1.2,
        targetX: 300,
        targetY: 260,
        color: '#f97316',
        size: 32,
        happiness: 0,
      },
      {
        x: 480,
        y: 200,
        angle: 2.1,
        speed: 1.0,
        targetX: 250,
        targetY: 340,
        color: '#ffffff',
        size: 28,
        happiness: 0,
      },
      {
        x: 360,
        y: 320,
        angle: -1.2,
        speed: 1.3,
        targetX: 520,
        targetY: 180,
        color: '#ef4444',
        size: 30,
        happiness: 0,
      },
    ];

    return () => {
      sound.toggleRain(false);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if clicked a lotus pad to bloom it
    let clickedLotus = false;
    lotusRef.current.forEach((lotus, idx) => {
      const dist = Math.hypot(lotus.x - x, lotus.y - y);
      if (dist < 40 && !lotus.bloomed) {
        lotus.bloomed = true;
        clickedLotus = true;
        sound.playWaterChime(idx * 2);
        setBloomedCount((b) => {
          const next = b + 1;
          if (next === lotusRef.current.length) {
            confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
          }
          return next;
        });
      }
    });

    if (!clickedLotus) {
      // Drop fish food pellet & create ripple
      foodRef.current.push({
        id: Date.now() + Math.random(),
        x,
        y,
        alpha: 1,
      });

      ripplesRef.current.push({ x, y, r: 4, alpha: 0.8 });
      sound.playWaterChime(Math.floor(Math.random() * 8));

      // Guide nearest fish towards the food
      koiRef.current.forEach((k) => {
        k.targetX = x + (Math.random() - 0.5) * 40;
        k.targetY = y + (Math.random() - 0.5) * 40;
        k.speed = 2.2; // swim eagerly to food
      });
    }
  };

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep calm water tone
      ctx.fillStyle = 'rgba(10, 25, 40, 0.65)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Koi fish
      koiRef.current.forEach((k) => {
        const dx = k.targetX - k.x;
        const dy = k.targetY - k.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 25) {
          k.targetX = 100 + Math.random() * (canvas.width - 200);
          k.targetY = 100 + Math.random() * (canvas.height - 200);
          k.speed = 0.9 + Math.random() * 0.4;
        }

        const targetAngle = Math.atan2(dy, dx);
        let diff = targetAngle - k.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        k.angle += diff * 0.05;

        k.x += Math.cos(k.angle) * k.speed;
        k.y += Math.sin(k.angle) * k.speed;

        // Check if ate food
        for (let i = foodRef.current.length - 1; i >= 0; i--) {
          const f = foodRef.current[i];
          if (Math.hypot(k.x - f.x, k.y - f.y) < 28) {
            foodRef.current.splice(i, 1);
            setFishFedCount((c) => c + 1);
            sound.playCoin();
          }
        }

        // Draw fish body
        ctx.save();
        ctx.translate(k.x, k.y);
        ctx.rotate(k.angle);

        ctx.fillStyle = k.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, k.size, k.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wiggling tail
        const tailWiggle = Math.sin(Date.now() * 0.008 * k.speed) * 0.4;
        ctx.save();
        ctx.translate(-k.size * 0.9, 0);
        ctx.rotate(tailWiggle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-k.size * 0.6, -k.size * 0.35);
        ctx.lineTo(-k.size * 0.45, 0);
        ctx.lineTo(-k.size * 0.6, k.size * 0.35);
        ctx.closePath();
        ctx.fillStyle = k.color;
        ctx.fill();
        ctx.restore();

        ctx.restore();
      });

      // Render Food Pellets
      foodRef.current.forEach((f) => {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(f.x, f.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Lotus Pads
      lotusRef.current.forEach((lotus) => {
        ctx.save();
        ctx.translate(lotus.x, lotus.y);

        // Lily pad
        ctx.fillStyle = 'rgba(34, 197, 94, 0.85)';
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0.3, Math.PI * 2 - 0.3);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        // Flower: closed bud vs fully bloomed
        if (lotus.bloomed) {
          ctx.fillStyle = '#f472b6';
          for (let p = 0; p < lotus.petalCount; p++) {
            const angle = (p * Math.PI * 2) / lotus.petalCount;
            ctx.beginPath();
            ctx.ellipse(Math.cos(angle) * 12, Math.sin(angle) * 12, 10, 5, angle, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Closed glowing pink bud waiting for tap
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fbcfe8';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.restore();
      });

      // Render ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.r += 1.8;
        r.alpha -= 0.015;

        if (r.alpha <= 0 || r.r > 120) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(186, 230, 253, ${r.alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const resetFlowers = () => {
    lotusRef.current.forEach((l) => (l.bloomed = false));
    setBloomedCount(0);
    sound.playSingingBowl(320);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4 p-4 select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐟</span>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">KOI FED</div>
              <div className="text-xl font-black text-emerald-400 font-mono tabular-nums">{fishFedCount}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">FLOWERS BLOOMED</div>
              <div className="text-xl font-black text-pink-400 font-mono tabular-nums">{bloomedCount} / 5</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !ambientRainActive;
              setAmbientRainActive(next);
              sound.toggleRain(next, 0.4);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
              ambientRainActive
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            🌧️ Rain: {ambientRainActive ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={resetFlowers}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Reset Flowers"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pond Arena */}
      <div className="relative w-full max-w-3xl aspect-[16/10] max-h-[500px] rounded-3xl overflow-hidden bg-cover bg-center border-4 border-slate-800 shadow-2xl flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-90"
          style={{ backgroundImage: `url('/src/assets/images/zen_garden_backdrop_1793615060431.jpg')` }}
        />

        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onPointerDown={handlePointerDown}
          className="relative z-10 w-full h-full cursor-pointer touch-none"
        />

        <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none z-20">
          <span className="px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-emerald-300 border border-emerald-500/30 shadow">
            💡 Tap water to feed fish · Tap pink buds to bloom lotus flowers!
          </span>
        </div>
      </div>
    </div>
  );
};
