import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

type SlapWeapon = 'hand' | 'glove' | 'fish' | 'hammer' | 'balloon';
type DummyHat = 'none' | 'crown' | 'horns' | 'glasses' | 'party' | 'helmet';

interface SlapParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  alpha: number;
}

interface SlapDummyProps {
  onSlapHit?: () => void;
}

export const SlapDummy: React.FC<SlapDummyProps> = ({ onSlapHit }) => {
  const [slapCount, setSlapCount] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [weapon, setWeapon] = useState<SlapWeapon>('hand');
  const [hat, setHat] = useState<DummyHat>('glasses');
  const [wobbleOffset, setWobbleOffset] = useState<number>(0);
  const [faceExpression, setFaceExpression] = useState<'normal' | 'hit' | 'dizzy' | 'ko'>('normal');
  const [particles, setParticles] = useState<SlapParticle[]>([]);

  const resetExpressionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (resetExpressionTimerRef.current) clearTimeout(resetExpressionTimerRef.current);
    };
  }, []);

  const weapons: { id: SlapWeapon; name: string; icon: string; sound: () => void }[] = [
    { id: 'hand', name: 'Open Slap', icon: '🖐️', sound: () => sound.playSmash('slap') },
    { id: 'glove', name: 'Boxing Glove', icon: '🥊', sound: () => sound.playBonk() },
    { id: 'fish', name: 'Rubber Fish', icon: '🐟', sound: () => sound.playBoing() },
    { id: 'hammer', name: 'Squeak Hammer', icon: '🔨', sound: () => sound.playBonk() },
    { id: 'balloon', name: 'Water Balloon', icon: '🎈', sound: () => sound.playBubblePop() },
  ];

  const handleHit = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const hitX = e.clientX - rect.left;
    const hitY = e.clientY - rect.top;

    // Pick weapon sound
    const currentWeapon = weapons.find((w) => w.id === weapon) || weapons[0];
    currentWeapon.sound();

    setSlapCount((c) => c + 1);
    setCombo((c) => c + 1);
    onSlapHit?.();

    // Bouncy spring wobble
    const direction = hitX > rect.width / 2 ? -28 : 28;
    setWobbleOffset(direction);

    // Expression update
    setFaceExpression(combo > 8 ? 'ko' : combo > 3 ? 'dizzy' : 'hit');
    if (resetExpressionTimerRef.current) clearTimeout(resetExpressionTimerRef.current);
    resetExpressionTimerRef.current = setTimeout(() => {
      setFaceExpression('normal');
      setCombo(0);
    }, 900);

    // Floating particles (coins, stars, pow!)
    const burstTexts = ['💥', '⭐', '💫', 'POW!', 'SLAP!', '✨'];
    const pId = Date.now() + Math.random();
    setParticles((prev) => [
      ...prev,
      {
        id: pId,
        x: hitX,
        y: hitY,
        vx: (Math.random() - 0.5) * 6,
        vy: -4 - Math.random() * 4,
        text: burstTexts[Math.floor(Math.random() * burstTexts.length)],
        alpha: 1,
      },
    ]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== pId));
    }, 700);
  };

  // Smooth spring bounce back to center
  useEffect(() => {
    if (wobbleOffset === 0) return;

    const interval = setInterval(() => {
      setWobbleOffset((current) => {
        if (Math.abs(current) < 1.5) return 0;
        return -current * 0.72; // damped oscillation
      });
    }, 50);

    return () => clearInterval(interval);
  }, [wobbleOffset]);

  const eyeEmoji =
    faceExpression === 'hit'
      ? '> <'
      : faceExpression === 'dizzy'
      ? '@ @'
      : faceExpression === 'ko'
      ? 'X X'
      : '• •';

  const mouthEmoji =
    faceExpression === 'hit'
      ? 'Д'
      : faceExpression === 'dizzy'
      ? 'o'
      : faceExpression === 'ko'
      ? '﹏'
      : '‿';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-5 p-4 select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border-2 border-rose-500/40 shadow-xl shadow-rose-500/5">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black text-rose-400 font-mono tabular-nums tracking-wider drop-shadow">
            {slapCount} <span className="text-xs uppercase text-slate-400 font-sans">SLAPS</span>
          </div>
          {combo >= 2 && (
            <div className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs animate-bounce shadow">
              👋 {combo}x COMBO!
            </div>
          )}
        </div>

        {/* Weapons and Hat pickers */}
        <div className="flex items-center gap-2">
          {/* Hat selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {[
              { id: 'glasses', icon: '🕶️', title: 'Cool Glasses' },
              { id: 'crown', icon: '👑', title: 'Royal Crown' },
              { id: 'horns', icon: '😈', title: 'Devil Horns' },
              { id: 'party', icon: '🥳', title: 'Party Hat' },
              { id: 'helmet', icon: '🪖', title: 'Viking Helmet' },
              { id: 'none', icon: '❌', title: 'No Hat' },
            ].map((h) => (
              <button
                key={h.id}
                onClick={() => setHat(h.id as DummyHat)}
                title={h.title}
                className={`p-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                  hat === h.id ? 'bg-amber-500 text-slate-950 scale-110 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {h.icon}
              </button>
            ))}
          </div>

          {/* Weapons picker */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            {weapons.map((w) => (
              <button
                key={w.id}
                onClick={() => setWeapon(w.id)}
                title={w.name}
                className={`p-2 rounded-lg text-lg transition-all cursor-pointer ${
                  weapon === w.id
                    ? 'bg-rose-600 text-white shadow scale-110'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {w.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Slapping Stage */}
      <div
        onClick={handleHit}
        className="relative w-full max-w-2xl h-[460px] rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-slate-800 shadow-2xl flex flex-col items-center justify-end overflow-hidden cursor-pointer active:cursor-grabbing"
      >
        {/* Floating click particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none text-2xl font-black z-30 animate-out fade-out slide-out-to-top duration-500 text-amber-300 drop-shadow"
            style={{ left: p.x, top: p.y }}
          >
            {p.text}
          </div>
        ))}

        {/* Instruction label */}
        <div className="absolute top-6 inset-x-0 text-center pointer-events-none z-10">
          <div className="text-sm font-extrabold text-slate-400">
            TAP / CLICK RAPIDLY TO SLAP & RELEASE RAGE!
          </div>
        </div>

        {/* The Ragdoll Character */}
        <div
          className="relative flex flex-col items-center mb-8 origin-bottom transition-transform duration-75"
          style={{
            transform: `rotate(${wobbleOffset}deg)`,
          }}
        >
          {/* Hat on Top */}
          {hat !== 'none' && (
            <div className="absolute -top-10 z-20 text-4xl filter drop-shadow animate-bounce">
              {hat === 'crown' && '👑'}
              {hat === 'horns' && '😈'}
              {hat === 'glasses' && '🕶️'}
              {hat === 'party' && '🥳'}
              {hat === 'helmet' && '🪖'}
            </div>
          )}

          {/* Head */}
          <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 border-4 border-amber-500 shadow-xl flex flex-col items-center justify-center p-2 z-10">
            {/* Eyes */}
            <div className="text-xl font-black tracking-widest text-slate-800 select-none">
              {eyeEmoji}
            </div>

            {/* Rosy cheeks */}
            <div className="w-full flex justify-between px-4 my-1">
              <div className="w-3.5 h-2 bg-rose-400/70 rounded-full" />
              <div className="w-3.5 h-2 bg-rose-400/70 rounded-full" />
            </div>

            {/* Mouth */}
            <div className="text-2xl font-black text-slate-800 select-none">
              {mouthEmoji}
            </div>
          </div>

          {/* Neck & Body */}
          <div className="w-16 h-28 -mt-2 bg-rose-600 rounded-2xl border-4 border-rose-700 shadow-lg flex flex-col items-center justify-center z-0">
            <span className="text-xs font-black text-white/80">STRESS</span>
          </div>

          {/* Spring base */}
          <div className="w-10 h-16 flex flex-col items-center justify-between -mt-1 py-1">
            <div className="w-12 h-2.5 bg-slate-500 rounded-full border border-slate-400" />
            <div className="w-10 h-2.5 bg-slate-500 rounded-full border border-slate-400" />
            <div className="w-12 h-2.5 bg-slate-500 rounded-full border border-slate-400" />
            <div className="w-10 h-2.5 bg-slate-500 rounded-full border border-slate-400" />
          </div>

          {/* Pedestal / Stand */}
          <div className="w-48 h-8 bg-slate-800 rounded-full border-4 border-slate-700 shadow-2xl" />
        </div>
      </div>
    </div>
  );
};
