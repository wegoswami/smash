import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

interface CursorSparklesProps {
  activeMode: string;
}

export const CursorSparkles: React.FC<CursorSparklesProps> = ({ activeMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const colorsByMode: Record<string, string[]> = {
    whack: ['#fbbf24', '#f59e0b', '#f43f5e', '#ffffff'],
    pvp: ['#f43f5e', '#38bdf8', '#fbbf24', '#ffffff'],
    press: ['#f59e0b', '#ef4444', '#f43f5e', '#ffffff', '#fbbf24'],
    popit: ['#f43f5e', '#f59e0b', '#10b981', '#0ea5e9', '#a855f7'],
    sand: ['#2dd4bf', '#fbbf24', '#38bdf8', '#c084fc', '#ffffff'],
    newton: ['#cbd5e1', '#94a3b8', '#38bdf8', '#ffffff'],
    ninja: ['#38bdf8', '#818cf8', '#a855f7', '#ffffff'],
    soap: ['#2dd4bf', '#14b8a6', '#5eead4', '#ffffff'],
    slap: ['#f43f5e', '#fb7185', '#fda4af', '#ffffff'],
    smash: ['#c084fc', '#f43f5e', '#f59e0b', '#ffffff'],
    bubble: ['#38bdf8', '#06b6d4', '#67e8f9', '#ffffff'],
    zen: ['#34d399', '#10b981', '#6ee7b7', '#fde047'],
    shredder: ['#f97316', '#ef4444', '#fbbf24', '#ffffff'],
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      const modeColors = colorsByMode[activeMode] || colorsByMode.whack;
      for (let i = 0; i < 2; i++) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5 - 0.6,
          size: Math.random() * 3.5 + 1.5,
          color: modeColors[Math.floor(Math.random() * modeColors.length)],
          alpha: 0.9,
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.024;
        p.size *= 0.96;

        if (p.alpha <= 0 || p.size < 0.5) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 w-full h-full"
    />
  );
};
