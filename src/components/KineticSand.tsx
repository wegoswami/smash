import React, { useState, useRef, useEffect } from 'react';
import { Scissors, Sparkles, RefreshCw, Palette, Layers, Flame, Trophy } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface KineticSandProps {
  onSandSliced?: () => void;
}

interface SandGrain {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

type CutterTool = 'flat' | 'wave' | 'grid' | 'scoop';

const SAND_PALETTES = [
  {
    name: 'Rainbow Layer',
    layers: ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#a855f7'],
  },
  {
    name: 'Ocean Sunset',
    layers: ['#f97316', '#fb7185', '#38bdf8', '#0284c7', '#1e293b'],
  },
  {
    name: 'Matcha Blossom',
    layers: ['#10b981', '#34d399', '#fbcfe8', '#f472b6', '#065f46'],
  },
  {
    name: 'Cosmic Galaxy',
    layers: ['#c084fc', '#818cf8', '#38bdf8', '#06b6d4', '#1e1b4b'],
  },
];

export const KineticSand: React.FC<KineticSandProps> = ({ onSandSliced }) => {
  const [selectedPalette, setSelectedPalette] = useState<number>(0);
  const [selectedTool, setSelectedTool] = useState<CutterTool>('wave');
  const [sliceProgress, setSliceProgress] = useState<number>(0); // 0 to 100
  const [slicesCount, setSlicesCount] = useState<number>(0);
  const [isCarving, setIsCarving] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sandParticlesRef = useRef<SandGrain[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const currentPalette = SAND_PALETTES[selectedPalette];

  // Spawn sand crumbs when cutting
  const emitSandCrumbs = (x: number, y: number, color: string) => {
    sound.playSandCrunch();
    onSandSliced?.();
    setSlicesCount((c) => c + 1);

    const count = selectedTool === 'grid' ? 18 : 12;
    for (let i = 0; i < count; i++) {
      sandParticlesRef.current.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 3.5,
        vy: 2 + Math.random() * 4,
        color,
        size: Math.random() * 4.5 + 2,
        alpha: 1,
      });
    }
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

      // Render falling sand grains
      const particles = sandParticlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.vx *= 0.98;

        // Tray floor collision
        if (p.y > canvas.height - 20) {
          p.vy = 0;
          p.vx = 0;
          p.alpha -= 0.008; // settle into pile
        }

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleSliceSwipe = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isCarving) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // Determine which color layer was sliced
    const layerIdx = Math.floor((y / rect.height) * currentPalette.layers.length);
    const color = currentPalette.layers[Math.min(layerIdx, currentPalette.layers.length - 1)];

    const canvas = canvasRef.current;
    if (canvas) {
      const cRect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / cRect.width;
      const scaleY = canvas.height / cRect.height;
      const sandX = (e.clientX - cRect.left) * scaleX;
      const sandY = (e.clientY - cRect.top) * scaleY;
      emitSandCrumbs(sandX, sandY, color);
    } else {
      emitSandCrumbs(e.clientX - rect.left, y, color);
    }

    setSliceProgress((prev) => {
      const next = prev + 2.5;
      if (next >= 100) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: currentPalette.layers,
        });
        sound.playFanfare();
        return 0; // reset brick
      }
      return next;
    });
  };

  const resetBrick = () => {
    setSliceProgress(0);
    sandParticlesRef.current = [];
    sound.playBonk();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none p-3 sm:p-5">
      {/* Header Info */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-4 sm:p-5 mb-4 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 via-emerald-500 to-amber-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
            🏖️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                KINETIC SAND CARVER ASMR
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-full">
                Kinetic Sand
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Drag your cutter across the layered rainbow sand brick for crunchy acoustic slices!
            </p>
          </div>
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-1.5 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Slices</span>
            <span className="text-base font-black font-mono text-teal-400">{slicesCount}</span>
          </div>

          <button
            onClick={resetBrick}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Reset Sand Brick"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Palette & Tool Selectors */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        {/* Layer Theme */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
          {SAND_PALETTES.map((pal, idx) => (
            <button
              key={pal.name}
              onClick={() => {
                setSelectedPalette(idx);
                sound.playBonk();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedPalette === idx
                  ? 'bg-slate-800 text-white border border-teal-400/50 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex -space-x-1">
                {pal.layers.slice(0, 3).map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-slate-900"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <span>{pal.name}</span>
            </button>
          ))}
        </div>

        {/* Cutting Tool */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-bold">
          {[
            { id: 'flat' as CutterTool, label: 'Straight Blade', icon: '🔪' },
            { id: 'wave' as CutterTool, label: 'Crinkle Knife', icon: '〰️' },
            { id: 'grid' as CutterTool, label: 'Waffle Grid', icon: '🧇' },
            { id: 'scoop' as CutterTool, label: 'Melon Scoop', icon: '🥄' },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                setSelectedTool(tool.id);
                sound.playBonk();
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                selectedTool === tool.id
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tool.icon}</span>
              <span className="hidden sm:inline">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Kinetic Sand Cutting Bed */}
      <div className="relative w-full max-w-2xl h-[420px] rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6">
        {/* Soft Ambient Light Glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-teal-500/10 blur-3xl pointer-events-none" />

        {/* Interactive Layered Sand Brick Container */}
        <div
          onPointerDown={() => setIsCarving(true)}
          onPointerUp={() => setIsCarving(false)}
          onPointerLeave={() => setIsCarving(false)}
          onPointerMove={handleSliceSwipe}
          className="relative w-72 sm:w-96 h-56 rounded-3xl border-4 border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden cursor-crosshair touch-none select-none flex flex-col transition-transform duration-100 active:scale-99"
          style={{
            transform: `scaleY(${Math.max(0.2, 1 - (sliceProgress / 100) * 0.8)})`,
            transformOrigin: 'bottom center',
          }}
        >
          {/* Sliced layers */}
          {currentPalette.layers.map((layerColor, idx) => (
            <div
              key={idx}
              className="flex-1 relative flex items-center justify-center border-b border-white/10"
              style={{
                backgroundColor: layerColor,
                backgroundImage:
                  'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '6px 6px',
              }}
            >
              {/* Subtle textured velvet grain sheen */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
            </div>
          ))}

          {/* Cutting Edge Line when carving */}
          {isCarving && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-white shadow-[0_0_12px_#ffffff] pointer-events-none animate-pulse" />
          )}
        </div>

        {/* Real-time Falling Sand Grain Particles Canvas Layer */}
        <canvas
          ref={canvasRef}
          width={700}
          height={420}
          className="absolute inset-0 pointer-events-none z-20 w-full h-full"
        />

        {/* Wooden ASMR Cutting Board / Pedestal */}
        <div className="w-80 sm:w-[420px] h-10 bg-gradient-to-t from-amber-900 via-amber-800 to-amber-700 border-2 border-amber-600 rounded-2xl shadow-2xl flex items-center justify-center -mt-1 z-10">
          <span className="text-[10px] font-mono font-bold text-amber-200/80 tracking-widest uppercase">
            JAPANESE CYPRESS CARVING BED
          </span>
        </div>

        {/* Interactive Instruction Banner */}
        <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none z-30">
          <span className="px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-teal-300 border border-teal-500/30 shadow">
            ✨ Press & drag mouse/finger across the brick to carve satisfying sand ribbons!
          </span>
        </div>
      </div>
    </div>
  );
};
