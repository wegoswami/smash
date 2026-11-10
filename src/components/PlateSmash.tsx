import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, RotateCcw, Volume2, Flame, Trophy, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CeramicItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  points: number;
  color: string;
  shardsCount: number;
}

const CERAMIC_ITEMS: CeramicItem[] = [
  {
    id: 'plate',
    name: 'Ceramic Dinner Plate',
    icon: '🍽️',
    category: 'Greek Smash',
    points: 100,
    color: '#e2e8f0',
    shardsCount: 12,
  },
  {
    id: 'teacup',
    name: 'Royal Porcelain Mug',
    icon: '☕',
    category: 'Office Rage',
    points: 120,
    color: '#38bdf8',
    shardsCount: 14,
  },
  {
    id: 'bottle',
    name: 'Vintage Glass Bottle',
    icon: '🍾',
    category: 'Bottle Break',
    points: 160,
    color: '#34d399',
    shardsCount: 16,
  },
  {
    id: 'vase',
    name: 'Antique Terracotta Vase',
    icon: '🏺',
    category: 'Museum Smash',
    points: 220,
    color: '#fb923c',
    shardsCount: 18,
  },
  {
    id: 'crystal',
    name: 'Crystal Champagne Glass',
    icon: '🥂',
    category: 'Luxury Shatter',
    points: 300,
    color: '#f43f5e',
    shardsCount: 20,
  },
];

interface Shard {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  size: number;
  color: string;
  goldGlaze?: boolean;
}

interface PlateSmashProps {
  onItemSmashed?: (points: number) => void;
  onWatchAd?: () => void;
}

export const PlateSmash: React.FC<PlateSmashProps> = ({ onItemSmashed }) => {
  const [selectedItem, setSelectedItem] = useState<CeramicItem>(CERAMIC_ITEMS[0]);
  const [score, setScore] = useState<number>(0);
  const [platesSmashed, setPlatesSmashed] = useState<number>(0);
  const [isThrowing, setIsThrowing] = useState<boolean>(false);
  const [isShattered, setIsShattered] = useState<boolean>(false);
  const [isKintsugiRestored, setIsKintsugiRestored] = useState<boolean>(false);
  const [shards, setShards] = useState<Shard[]>([]);
  const [combo, setCombo] = useState<number>(0);
  const [shake, setShake] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Throw and shatter ceramic item
  const handleThrow = (e?: React.MouseEvent) => {
    if (isThrowing) return;
    setIsThrowing(true);
    setIsShattered(false);
    setIsKintsugiRestored(false);

    sound.playBonk();
    sound.vibrate(20);

    // After throwing trajectory (300ms), impact the wall
    setTimeout(() => {
      triggerSmash();
    }, 280);
  };

  const triggerSmash = () => {
    setIsThrowing(false);
    setIsShattered(true);
    setShake(true);
    setTimeout(() => setShake(false), 240);

    sound.playShatter();
    sound.vibrate([30, 20, 40]);

    const newScore = score + selectedItem.points;
    setScore(newScore);
    setPlatesSmashed((p) => p + 1);
    setCombo((c) => c + 1);

    if (onItemSmashed) {
      onItemSmashed(selectedItem.points);
    }

    // Generate shattered shard physics
    const rect = containerRef.current?.getBoundingClientRect();
    const centerX = rect ? rect.width / 2 : 250;
    const centerY = rect ? rect.height / 2 : 180;

    const newShards: Shard[] = [];
    for (let i = 0; i < selectedItem.shardsCount; i++) {
      const angle = (Math.PI * 2 * i) / selectedItem.shardsCount + (Math.random() - 0.5) * 0.5;
      const speed = 4 + Math.random() * 8;
      newShards.push({
        id: Date.now() + i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 20,
        size: 14 + Math.random() * 22,
        color: selectedItem.color,
      });
    }
    setShards(newShards);
  };

  // Perform Kintsugi (Golden Repair of Shards)
  const handleKintsugi = () => {
    if (!isShattered || isKintsugiRestored) return;
    sound.playSingingBowl(320);
    sound.vibrate(30);

    setIsKintsugiRestored(true);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#ffffff'],
    });
  };

  // Shard physics animation loop
  useEffect(() => {
    if (!isShattered || isKintsugiRestored || shards.length === 0) return;

    const updatePhysics = () => {
      setShards((prev) =>
        prev.map((shard) => {
          const nextY = shard.y + shard.vy;
          const nextX = shard.x + shard.vx;
          const nextVy = shard.vy + 0.35; // gravity
          const nextVx = shard.vx * 0.98; // air friction
          const nextRot = shard.rotation + shard.vRot;

          // floor bounce bounds
          const floorY = 320;
          if (nextY >= floorY) {
            return {
              ...shard,
              y: floorY,
              vy: -shard.vy * 0.3,
              vx: shard.vx * 0.7,
              vRot: shard.vRot * 0.6,
            };
          }

          return {
            ...shard,
            x: nextX,
            y: nextY,
            vx: nextVx,
            vy: nextVy,
            rotation: nextRot,
          };
        })
      );
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isShattered, isKintsugiRestored]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4 select-none p-2 sm:p-4">
      {/* Top Arcade HUD */}
      <div className="w-full flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900 border-2 border-amber-500/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tabular-nums tracking-wider drop-shadow">
            {score.toLocaleString()} <span className="text-xs uppercase text-slate-400 font-sans">PTS</span>
          </div>
          {combo >= 2 && (
            <div className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-xs animate-bounce shadow">
              🔥 {combo}x SMASH COMBO!
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-right">
          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-xs font-mono font-bold text-slate-300">
            Smashed: <span className="text-amber-400 font-black">{platesSmashed}</span>
          </div>
        </div>
      </div>

      {/* Item Selection Strip */}
      <div className="w-full flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
        {CERAMIC_ITEMS.map((item) => {
          const isSelected = selectedItem.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedItem(item);
                setIsShattered(false);
                setIsKintsugiRestored(false);
                sound.playBonk();
              }}
              aria-label={`Select ${item.name} (+${item.points} PTS)`}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all cursor-pointer whitespace-nowrap text-xs font-bold ${
                isSelected
                  ? 'bg-rose-600 border-white text-white shadow-lg scale-103'
                  : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
              <span className="text-[10px] text-amber-300 font-mono">+{item.points}</span>
            </button>
          );
        })}
      </div>

      {/* Concrete Wall Smash Arena Canvas */}
      <div
        ref={containerRef}
        onClick={() => handleThrow()}
        className={`relative w-full max-w-2xl h-[360px] sm:h-[400px] rounded-3xl bg-gradient-to-b from-stone-900 via-neutral-900 to-stone-950 border-4 border-stone-800 shadow-2xl flex flex-col items-center justify-center overflow-hidden cursor-crosshair transition-transform ${
          shake ? 'animate-shake' : ''
        }`}
      >
        {/* Concrete Wall Grid Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Smash Target Bullseye on Wall */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-dashed border-rose-500/30 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 rounded-full border border-dashed border-rose-500/50 flex items-center justify-center">
            <span className="text-rose-500/40 text-xs font-black uppercase tracking-widest font-mono">SMASH WALL</span>
          </div>
        </div>

        {/* Flying Item Animation before Shatter */}
        {isThrowing && (
          <div className="absolute z-20 transition-all duration-300 ease-out transform scale-150 rotate-45 text-7xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            {selectedItem.icon}
          </div>
        )}

        {/* Ready Item on Pedestal when not shattered */}
        {!isThrowing && !isShattered && (
          <div className="relative z-10 flex flex-col items-center group cursor-pointer animate-in fade-in zoom-in duration-200">
            <span className="text-8xl md:text-9xl filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform">
              {selectedItem.icon}
            </span>
            <div className="mt-3 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-black tracking-wider shadow-lg flex items-center gap-1.5 animate-pulse">
              <span>🎯 Tap Wall to Fling &amp; Smash!</span>
            </div>
          </div>
        )}

        {/* Dynamic Shattered Shards Rendering */}
        {isShattered && !isKintsugiRestored && (
          <>
            {shards.map((shard) => (
              <div
                key={shard.id}
                className="absolute pointer-events-none filter drop-shadow-md rounded-xs"
                style={{
                  left: shard.x,
                  top: shard.y,
                  width: shard.size,
                  height: shard.size * 0.7,
                  backgroundColor: shard.color,
                  clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                  transform: `rotate(${shard.rotation}deg)`,
                }}
              />
            ))}
          </>
        )}

        {/* Kintsugi Reassembled Masterpiece (Gold Vein Ceramic) */}
        {isKintsugiRestored && (
          <div className="relative z-20 flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="relative">
              <span className="text-8xl md:text-9xl filter drop-shadow-[0_0_35px_rgba(251,191,36,0.6)]">
                {selectedItem.icon}
              </span>
              {/* Golden Vein Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-amber-400 font-black text-2xl animate-pulse">✨ 金継ぎ ✨</span>
              </div>
            </div>
            <div className="mt-4 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-black">
              Kintsugi Restored: Beauty in Broken Pieces! (+50 Bonus)
            </div>
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => handleThrow()}
          disabled={isThrowing}
          aria-label="Throw and smash ceramic item"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-rose-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <span>💥 THROW &amp; SMASH!</span>
        </button>

        {isShattered && !isKintsugiRestored && (
          <button
            onClick={handleKintsugi}
            aria-label="Kintsugi Golden Repair of Shards"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Kintsugi Golden Repair ✨</span>
          </button>
        )}

        {isShattered && (
          <button
            onClick={() => {
              setIsShattered(false);
              setIsKintsugiRestored(false);
              sound.playBonk();
            }}
            aria-label="Place another ceramic plate"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Next Plate</span>
          </button>
        )}
      </div>
    </div>
  );
};
