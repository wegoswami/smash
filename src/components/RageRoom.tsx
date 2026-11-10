import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Hammer, Zap, Sparkles, RefreshCw, Volume2, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';
import { Language, translations } from '../utils/translations';
import confetti from 'canvas-confetti';

interface RageRoomProps {
  lang: Language;
  onItemSmashed: () => void;
}

export type WeaponType = 'hammer' | 'crowbar' | 'bat' | 'slap' | 'laser' | 'lightning';

interface TargetItem {
  id: string;
  name: string;
  maxHp: number;
  icon: string;
  caption: string;
  fragility: 'glass' | 'metal' | 'plastic' | 'ceramic';
  color: string;
}

const TARGETS: TargetItem[] = [
  {
    id: 'crt_monitor',
    name: 'Laggy CRT Monitor',
    maxHp: 120,
    icon: '🖥️',
    caption: 'FATAL EXCEPTION 0x000000 — SYSTEM DOWN',
    fragility: 'glass',
    color: '#0284c7',
  },
  {
    id: 'office_printer',
    name: 'Paper Jam Printer',
    maxHp: 140,
    icon: '🖨️',
    caption: 'ERROR: LOAD TRAY 2 / OUT OF MAGENTA',
    fragility: 'plastic',
    color: '#e11d48',
  },
  {
    id: 'smartphone',
    name: '1% Battery Phone',
    maxHp: 90,
    icon: '📱',
    caption: 'INCOMING CALL: "CAN WE SYNC REAL QUICK?"',
    fragility: 'glass',
    color: '#9333ea',
  },
  {
    id: 'alarm_clock',
    name: '06:00 AM Alarm Clock',
    maxHp: 80,
    icon: '⏰',
    caption: 'BEEP! BEEP! BEEP! TIME FOR MONDAY!',
    fragility: 'plastic',
    color: '#ea580c',
  },
  {
    id: 'coffee_mug',
    name: 'Endless Meeting Mug',
    maxHp: 60,
    icon: '☕',
    caption: '"Per my previous email..."',
    fragility: 'ceramic',
    color: '#d97706',
  },
  {
    id: 'wine_glass',
    name: 'Delicate Wine Glass',
    maxHp: 40,
    icon: '🍷',
    caption: 'Pure fragility waiting to shatter',
    fragility: 'glass',
    color: '#be123c',
  },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  alpha: number;
  shape: 'shard' | 'spark' | 'smoke';
}

interface CrackPoint {
  x: number;
  y: number;
  branches: { x: number; y: number }[];
}

export const RageRoom: React.FC<RageRoomProps> = ({ lang, onItemSmashed }) => {
  const t = translations[lang];

  const [selectedWeapon, setSelectedWeapon] = useState<WeaponType>('hammer');
  const [selectedTarget, setSelectedTarget] = useState<TargetItem>(TARGETS[0]);
  const [hp, setHp] = useState<number>(TARGETS[0].maxHp);
  const [isDestroyed, setIsDestroyed] = useState<boolean>(false);
  const [combo, setCombo] = useState<number>(0);
  const [lastHitTime, setLastHitTime] = useState<number>(0);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [cracks, setCracks] = useState<CrackPoint[]>([]);
  const [shakeEnabled, setShakeEnabled] = useState<boolean>(true);
  const [wobbleDeg, setWobbleDeg] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Weapon specs
  const weaponDetails: Record<WeaponType, { name: string; damage: number; icon: string }> = {
    hammer: { name: 'Sledgehammer', damage: 32, icon: '🔨' },
    crowbar: { name: 'Crowbar', damage: 24, icon: '🪛' },
    bat: { name: 'Baseball Bat', damage: 20, icon: '🏏' },
    slap: { name: 'Heavy Slap', damage: 16, icon: '🖐️' },
    laser: { name: 'Plasma Blaster', damage: 35, icon: '🔫' },
    lightning: { name: 'Thunder Bolt', damage: 45, icon: '⚡' },
  };

  // Reset target
  const resetTarget = useCallback((target = selectedTarget) => {
    setHp(target.maxHp);
    setIsDestroyed(false);
    setCracks([]);
    particlesRef.current = [];
    setWobbleDeg(0);
  }, [selectedTarget]);

  const switchTarget = (target: TargetItem) => {
    setSelectedTarget(target);
    resetTarget(target);
  };

  // Spawn debris & spark particles on impact
  const spawnParticles = (x: number, y: number, count: number, isFinisher: boolean = false) => {
    const newParticles: Particle[] = [];
    const colors = isFinisher
      ? ['#ef4444', '#f59e0b', '#fbbf24', '#ffffff', '#cbd5e1']
      : selectedWeapon === 'laser'
      ? ['#06b6d4', '#3b82f6', '#93c5fd', '#ffffff']
      : selectedWeapon === 'lightning'
      ? ['#a855f7', '#ec4899', '#fde047', '#ffffff']
      : ['#94a3b8', '#64748b', '#cbd5e1', '#f1f5f9', '#f97316'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (isFinisher ? 4 : 2) + Math.random() * (isFinisher ? 12 : 7);
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isFinisher ? 3 : 1),
        size: Math.random() * (isFinisher ? 16 : 8) + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.4,
        alpha: 1,
        shape: Math.random() > 0.4 ? 'shard' : Math.random() > 0.5 ? 'spark' : 'smoke',
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
  };

  // Hit handler
  const handleHit = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDestroyed) {
      resetTarget();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Trigger sound
    sound.playSmash(selectedWeapon);

    // Combo system
    const now = Date.now();
    if (now - lastHitTime < 1100) {
      setCombo((prev) => prev + 1);
    } else {
      setCombo(1);
    }
    setLastHitTime(now);

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setCombo(0);
    }, 1200);

    // Screen shake
    if (shakeEnabled) {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 160);
    }

    // Wobble effect
    setWobbleDeg((Math.random() - 0.5) * 14);
    setTimeout(() => setWobbleDeg(0), 120);

    // Calculate damage
    const dmg = weaponDetails[selectedWeapon].damage * (1 + (combo > 4 ? 0.35 : combo > 2 ? 0.15 : 0));
    const nextHp = Math.max(0, hp - dmg);

    // Generate crack branches
    const branchCount = Math.floor(Math.random() * 3) + 2;
    const branches: { x: number; y: number }[] = [];
    for (let b = 0; b < branchCount; b++) {
      const angle = (b * (Math.PI * 2)) / branchCount + (Math.random() - 0.5);
      const len = 25 + Math.random() * 45;
      branches.push({
        x: clickX + Math.cos(angle) * len,
        y: clickY + Math.sin(angle) * len,
      });
    }

    setCracks((prev) => [...prev, { x: clickX, y: clickY, branches }]);

    // Spawn impact particles
    spawnParticles(clickX, clickY, selectedWeapon === 'laser' || selectedWeapon === 'lightning' ? 24 : 14);

    if (nextHp <= 0) {
      // Obliterated!
      setHp(0);
      setIsDestroyed(true);
      sound.playShatter();
      spawnParticles(rect.width / 2, rect.height / 2, 75, true);
      onItemSmashed();

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f97316', '#eab308'],
      });
    } else {
      setHp(nextHp);
    }
  };

  // Canvas particle render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.vx *= 0.98; // friction
        p.rotation += p.vRot;
        p.alpha -= 0.018;

        if (p.alpha <= 0 || p.y > canvas.height + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'shard') {
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, -p.size / 2);
          ctx.lineTo(p.size / 2, -p.size / 3);
          ctx.lineTo(p.size / 3, p.size / 2);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'spark') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    };
  }, []);

  const hpPercent = Math.round((hp / selectedTarget.maxHp) * 100);

  return (
    <div className={`relative w-full max-w-6xl mx-auto flex flex-col gap-6 p-4 md:p-8 transition-transform ${screenShake ? 'animate-shake' : ''}`}>
      {/* Header bar within chamber */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-500 mb-1">
            <span>{t.rage.title}</span>
            <span aria-hidden="true">·</span>
            <span>Zero Consequence Destruction</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {t.rage.title}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t.rage.subtitle}
          </p>
        </div>

        {/* Shake toggle & Reset */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShakeEnabled(!shakeEnabled)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              shakeEnabled
                ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {t.rage.screenShake}: {shakeEnabled ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => resetTarget()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.rage.repair}</span>
          </button>
        </div>
      </div>

      {/* Main Chamber Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Target Selector & Weapon Selector */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          {/* Weapon Arsenal */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {t.rage.selectTool}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(weaponDetails) as WeaponType[]).map((weaponKey) => {
                const weapon = weaponDetails[weaponKey];
                const isCurrent = selectedWeapon === weaponKey;
                return (
                  <button
                    key={weaponKey}
                    onClick={() => {
                      setSelectedWeapon(weaponKey);
                      sound.playSmash(weaponKey);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                      isCurrent
                        ? 'bg-rose-600/20 border-rose-500 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl shrink-0">{weapon.icon}</span>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate leading-tight">{weapon.name}</div>
                      <div className="text-[10px] text-slate-400 tabular-nums">+{weapon.damage} DMG</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Targets */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {t.rage.selectTarget}
            </h3>
            <div className="flex flex-col gap-1.5">
              {TARGETS.map((target) => {
                const isCurrent = selectedTarget.id === target.id;
                return (
                  <button
                    key={target.id}
                    onClick={() => switchTarget(target)}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                      isCurrent
                        ? 'bg-slate-800 border-slate-600 text-white'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl shrink-0">{target.icon}</span>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{target.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{target.caption}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center / Right: The Arena */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Target Status HUD */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedTarget.icon}</span>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{selectedTarget.name}</span>
                  {combo > 2 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 animate-pulse">
                      {t.rage.combo} x{combo}!
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 truncate max-w-xs md:max-w-md">
                  {selectedTarget.caption}
                </div>
              </div>
            </div>

            {/* Health Meter */}
            <div className="flex flex-col items-end gap-1 shrink-0 w-36 md:w-52">
              <div className="flex justify-between w-full text-xs text-slate-400">
                <span>{t.rage.hp}</span>
                <span className="font-mono tabular-nums font-bold text-white">
                  {hp} / {selectedTarget.maxHp} ({hpPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-150 ${
                    hpPercent > 50
                      ? 'bg-emerald-500'
                      : hpPercent > 20
                      ? 'bg-amber-500'
                      : 'bg-rose-600'
                  }`}
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Smash Box */}
          <div
            onClick={handleHit}
            className="relative h-[440px] md:h-[480px] w-full rounded-2xl overflow-hidden cursor-crosshair border border-slate-800 flex items-center justify-center group shadow-2xl bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.82), rgba(15,23,42,0.92)), url('/src/assets/images/rage_room_backdrop_1793615034033.jpg')`,
            }}
          >
            {/* Particle Canvas */}
            <canvas
              ref={canvasRef}
              width={750}
              height={480}
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
            />

            {/* Interactive Target Visual Object */}
            <div
              className={`relative z-10 flex flex-col items-center justify-center transition-transform duration-100 ${
                isDestroyed ? 'scale-75 opacity-15 filter blur-xs' : ''
              }`}
              style={{
                transform: `rotate(${wobbleDeg}deg) scale(${isDestroyed ? 0.75 : 1})`,
              }}
            >
              {/* Target Graphic Container */}
              <div className="relative p-8 md:p-12 rounded-3xl bg-slate-900/80 border border-slate-700/80 shadow-2xl backdrop-blur-sm flex flex-col items-center gap-4 text-center max-w-md pointer-events-none">
                <span className="text-7xl md:text-8xl select-none filter drop-shadow-lg">
                  {selectedTarget.icon}
                </span>

                <div className="space-y-1">
                  <div className="text-lg md:text-xl font-extrabold text-white">
                    {selectedTarget.name}
                  </div>
                  <div className="text-xs font-mono text-rose-400 bg-rose-950/40 px-3 py-1 rounded-md border border-rose-900/50">
                    {selectedTarget.caption}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-medium">
                  {t.rage.clickToSmash}
                </div>

                {/* SVG Cracks Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  {cracks.map((crack, cIdx) => (
                    <g key={cIdx}>
                      {crack.branches.map((b, bIdx) => (
                        <line
                          key={bIdx}
                          x1={crack.x}
                          y1={crack.y}
                          x2={b.x}
                          y2={b.y}
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          opacity={0.85}
                          style={{ filter: 'drop-shadow(0px 0px 3px rgba(255,255,255,0.8))' }}
                        />
                      ))}
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Obliterated Banner Overlay */}
            {isDestroyed && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
                <span className="text-6xl mb-2">💥</span>
                <h3 className="text-3xl md:text-4xl font-extrabold text-rose-500 tracking-tight text-center">
                  {t.rage.smashed}
                </h3>
                <p className="text-sm text-slate-300 mt-2 text-center max-w-sm px-4">
                  {selectedTarget.name} has been thoroughly demolished. How does that feel?
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetTarget();
                  }}
                  className="mt-6 px-6 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{t.rage.repair}</span>
                </button>
              </div>
            )}

            {/* Active tool indicator watermark in bottom right */}
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
              <span>Tool:</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <span>{weaponDetails[selectedWeapon].icon}</span>
                <span>{weaponDetails[selectedWeapon].name}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
