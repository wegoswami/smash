import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Volume2, Sparkles, Moon, Sun, Zap, Compass } from 'lucide-react';
import { sound } from '../utils/audio';

interface NewtonCradleProps {
  onBallHit?: () => void;
}

interface BallPhysics {
  angle: number; // in radians
  angularVelocity: number;
  isDragging: boolean;
}

const BALL_RADIUS = 26;
const STRING_LENGTH = 160;
const GRAVITY = 9.81 * 0.08;

export const NewtonCradle: React.FC<NewtonCradleProps> = ({ onBallHit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ballTheme, setBallTheme] = useState<'chrome' | 'neon' | 'gold'>('chrome');
  const [gravityMode, setGravityMode] = useState<'normal' | 'low' | 'high'>('normal');
  const [clickCount, setClickCount] = useState<number>(0);
  const [soundIntensity, setSoundIntensity] = useState<number>(1);

  // 5 Pendulum balls
  const ballsRef = useRef<BallPhysics[]>([
    { angle: -0.6, angularVelocity: 0, isDragging: false }, // start with left ball pulled back
    { angle: 0, angularVelocity: 0, isDragging: false },
    { angle: 0, angularVelocity: 0, isDragging: false },
    { angle: 0, angularVelocity: 0, isDragging: false },
    { angle: 0, angularVelocity: 0, isDragging: false },
  ]);

  const draggedBallIdxRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastCollisionTimeRef = useRef<number>(0);

  // Physics simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const balls = ballsRef.current;
      const numBalls = balls.length;
      const pivotY = 50;
      const ballSpacing = BALL_RADIUS * 2;
      const centerX = canvas.width / 2;
      const startX = centerX - ((numBalls - 1) * ballSpacing) / 2;

      const gravMultiplier = gravityMode === 'low' ? 0.35 : gravityMode === 'high' ? 1.6 : 1;
      const effectiveGravity = GRAVITY * gravMultiplier;

      // 1. Update kinematics for free swinging balls
      for (let i = 0; i < numBalls; i++) {
        const b = balls[i];
        if (!b.isDragging) {
          // Pendulum differential equation: θ'' = - (g / L) * sin(θ)
          const torque = -(effectiveGravity / (STRING_LENGTH * 0.01)) * Math.sin(b.angle);
          b.angularVelocity += torque * 0.16;
          b.angularVelocity *= 0.9985; // minimal air damping
          b.angle += b.angularVelocity * 0.16;
        }
      }

      // 2. Elastic Collision Resolution between adjacent balls
      for (let i = 0; i < numBalls - 1; i++) {
        const left = balls[i];
        const right = balls[i + 1];

        // Collision occurs when left ball's angle is greater than or touches right ball's angle
        if (left.angle > right.angle) {
          // Perfect elastic momentum transfer
          const vLeft = left.angularVelocity;
          const vRight = right.angularVelocity;

          // Sound trigger if relative impact velocity is notable
          const impactSpeed = Math.abs(vLeft - vRight);
          const now = Date.now();
          if (impactSpeed > 0.015 && now - lastCollisionTimeRef.current > 75) {
            sound.playNewtonClick(Math.min(1.5, impactSpeed * 25));
            onBallHit?.();
            setClickCount((c) => c + 1);
            lastCollisionTimeRef.current = now;
          }

          // Swap velocities (elastic collision of equal mass)
          left.angularVelocity = vRight * 0.98;
          right.angularVelocity = vLeft * 0.98;

          // Prevent overlap
          const mid = (left.angle + right.angle) / 2;
          left.angle = mid - 0.0001;
          right.angle = mid + 0.0001;
        }
      }

      // 3. Render Top Frame Bar
      ctx.save();
      const frameGrad = ctx.createLinearGradient(centerX - 180, 0, centerX + 180, 0);
      frameGrad.addColorStop(0, '#334155');
      frameGrad.addColorStop(0.5, '#94a3b8');
      frameGrad.addColorStop(1, '#334155');

      ctx.fillStyle = frameGrad;
      ctx.fillRect(centerX - 160, pivotY - 12, 320, 14);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - 160, pivotY - 12, 320, 14);

      // Support Posts
      ctx.fillStyle = '#475569';
      ctx.fillRect(centerX - 155, pivotY - 12, 10, 220);
      ctx.fillRect(centerX + 145, pivotY - 12, 10, 220);
      ctx.restore();

      // 4. Render Strings & Spheres
      for (let i = 0; i < numBalls; i++) {
        const b = balls[i];
        const originX = startX + i * ballSpacing;

        const ballX = originX + STRING_LENGTH * Math.sin(b.angle);
        const ballY = pivotY + STRING_LENGTH * Math.cos(b.angle);

        // Strings
        ctx.save();
        ctx.strokeStyle = ballTheme === 'neon' ? '#38bdf8' : 'rgba(203, 213, 225, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(originX - 6, pivotY);
        ctx.lineTo(ballX, ballY);
        ctx.moveTo(originX + 6, pivotY);
        ctx.lineTo(ballX, ballY);
        ctx.stroke();
        ctx.restore();

        // Steel Ball Sphere
        ctx.save();
        const ballGrad = ctx.createRadialGradient(
          ballX - BALL_RADIUS * 0.35,
          ballY - BALL_RADIUS * 0.35,
          2,
          ballX,
          ballY,
          BALL_RADIUS
        );

        if (ballTheme === 'chrome') {
          ballGrad.addColorStop(0, '#ffffff');
          ballGrad.addColorStop(0.3, '#cbd5e1');
          ballGrad.addColorStop(0.7, '#64748b');
          ballGrad.addColorStop(1, '#1e293b');
        } else if (ballTheme === 'gold') {
          ballGrad.addColorStop(0, '#fffbeb');
          ballGrad.addColorStop(0.3, '#fde047');
          ballGrad.addColorStop(0.7, '#ca8a04');
          ballGrad.addColorStop(1, '#713f12');
        } else {
          // Neon Cyan
          ballGrad.addColorStop(0, '#ffffff');
          ballGrad.addColorStop(0.3, '#38bdf8');
          ballGrad.addColorStop(0.7, '#0284c7');
          ballGrad.addColorStop(1, '#082f49');
        }

        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Chrome specular shine
        ctx.strokeStyle = ballTheme === 'neon' ? '#00f0ff' : 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1.5;
        if (ballTheme === 'neon') {
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 14;
        }
        ctx.stroke();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [ballTheme, gravityMode]);

  // Pointer drag handling to pull spheres back
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const balls = ballsRef.current;
    const numBalls = balls.length;
    const pivotY = 50;
    const ballSpacing = BALL_RADIUS * 2;
    const centerX = canvas.width / 2;
    const startX = centerX - ((numBalls - 1) * ballSpacing) / 2;

    for (let i = 0; i < numBalls; i++) {
      const b = balls[i];
      const originX = startX + i * ballSpacing;
      const ballX = originX + STRING_LENGTH * Math.sin(b.angle);
      const ballY = pivotY + STRING_LENGTH * Math.cos(b.angle);

      const dist = Math.hypot(ballX - x, ballY - y);
      if (dist < BALL_RADIUS * 1.4) {
        draggedBallIdxRef.current = i;
        b.isDragging = true;
        b.angularVelocity = 0;
        sound.playBonk();
        break;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (draggedBallIdxRef.current === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const idx = draggedBallIdxRef.current;
    const balls = ballsRef.current;
    const ballSpacing = BALL_RADIUS * 2;
    const centerX = canvas.width / 2;
    const startX = centerX - ((balls.length - 1) * ballSpacing) / 2;
    const originX = startX + idx * ballSpacing;

    const dx = x - originX;
    const dy = Math.max(10, y - 50);
    const newAngle = Math.atan2(dx, dy);

    // Clamp angle to realistic bounds (-1.2 to 1.2 rad)
    balls[idx].angle = Math.max(-1.2, Math.min(1.2, newAngle));
  };

  const handlePointerUp = () => {
    if (draggedBallIdxRef.current !== null) {
      const idx = draggedBallIdxRef.current;
      ballsRef.current[idx].isDragging = false;
      draggedBallIdxRef.current = null;
    }
  };

  const pullLeftBall = () => {
    ballsRef.current[0].angle = -0.7;
    ballsRef.current[0].angularVelocity = 0;
    sound.playBonk();
  };

  const pullTwoBalls = () => {
    ballsRef.current[0].angle = -0.7;
    ballsRef.current[1].angle = -0.7;
    ballsRef.current[0].angularVelocity = 0;
    ballsRef.current[1].angularVelocity = 0;
    sound.playBonk();
  };

  const pullBothSides = () => {
    ballsRef.current[0].angle = -0.7;
    ballsRef.current[4].angle = 0.7;
    ballsRef.current[0].angularVelocity = 0;
    ballsRef.current[4].angularVelocity = 0;
    sound.playBonk();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none p-3 sm:p-5">
      {/* Header Info */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-4 sm:p-5 mb-4 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-400 via-slate-600 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
            ⚖️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                NEWTON'S ZEN DESK CRADLE
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full">
                Physics ASMR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Drag steel spheres back or use presets for harmonic momentum collision clicks.
            </p>
          </div>
        </div>

        {/* Clicks counter */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-1.5 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Collisions</span>
            <span className="text-base font-black font-mono text-indigo-400">{clickCount}</span>
          </div>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <button
            onClick={pullLeftBall}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            1-Ball Swing
          </button>
          <button
            onClick={pullTwoBalls}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            2-Ball Double Pulse
          </button>
          <button
            onClick={pullBothSides}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            Opposing Clash
          </button>
        </div>

        {/* Skin Picker */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setBallTheme('chrome')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              ballTheme === 'chrome' ? 'bg-slate-800 text-white shadow' : 'text-slate-400'
            }`}
          >
            🔘 Chrome
          </button>
          <button
            onClick={() => setBallTheme('neon')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              ballTheme === 'neon' ? 'bg-sky-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            ⚡ Cyber
          </button>
          <button
            onClick={() => setBallTheme('gold')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              ballTheme === 'gold' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400'
            }`}
          >
            👑 24K Gold
          </button>
        </div>
      </div>

      {/* Physics Canvas Stage */}
      <div className="relative w-full max-w-2xl h-[400px] rounded-3xl bg-slate-950 border-4 border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={650}
          height={400}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />

        {/* Tip label */}
        <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none z-20">
          <span className="px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-bold text-indigo-300 border border-indigo-500/30 shadow">
            💡 Click and drag any sphere sideways to pull back and release!
          </span>
        </div>
      </div>
    </div>
  );
};
