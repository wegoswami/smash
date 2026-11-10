import React, { useState, useRef } from 'react';
import { RefreshCw, Sparkles, Scissors } from 'lucide-react';
import { sound } from '../utils/audio';
import { Language, translations } from '../utils/translations';
import confetti from 'canvas-confetti';

interface SoapCarverProps {
  lang: Language;
  onCubeCut?: () => void;
}

const ROWS = 8;
const COLS = 12;
const TOTAL_BLOCKS = ROWS * COLS;

export const SoapCarver: React.FC<SoapCarverProps> = ({ lang, onCubeCut }) => {
  const t = translations[lang];

  const [cutCubes, setCutCubes] = useState<boolean[]>(() => Array(TOTAL_BLOCKS).fill(false));
  const isSlicingRef = useRef<boolean>(false);
  const [colorTheme, setColorTheme] = useState<'matcha' | 'lavender' | 'honey' | 'ocean'>('matcha');

  const themes = {
    matcha: {
      bg: 'from-emerald-400 to-teal-500',
      cube: 'bg-emerald-400 border-emerald-300/60 shadow-emerald-600/30',
      name: 'Matcha Green',
    },
    lavender: {
      bg: 'from-purple-400 to-indigo-500',
      cube: 'bg-purple-400 border-purple-300/60 shadow-purple-600/30',
      name: 'Lavender Mist',
    },
    honey: {
      bg: 'from-amber-400 to-yellow-500',
      cube: 'bg-amber-400 border-amber-300/60 shadow-amber-600/30',
      name: 'Golden Honey',
    },
    ocean: {
      bg: 'from-sky-400 to-cyan-500',
      cube: 'bg-sky-400 border-sky-300/60 shadow-sky-600/30',
      name: 'Ocean Breeze',
    },
  };

  const handleSliceCube = (index: number) => {
    if (cutCubes[index]) return;

    sound.playSoapSlice();
    onCubeCut?.();
    setCutCubes((prev) => {
      const next = [...prev];
      next[index] = true;

      // Check if finished
      if (next.every(Boolean)) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      return next;
    });
  };

  const handlePointerDown = (index: number) => {
    isSlicingRef.current = true;
    handleSliceCube(index);
  };

  const handlePointerEnter = (index: number) => {
    if (isSlicingRef.current) {
      handleSliceCube(index);
    }
  };

  const handlePointerUp = () => {
    isSlicingRef.current = false;
  };

  React.useEffect(() => {
    const onUp = () => {
      isSlicingRef.current = false;
    };
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const handleContainerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSlicingRef.current) return;
    const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const cubeIndex = target?.getAttribute('data-cube-index');
    if (cubeIndex !== null && cubeIndex !== undefined) {
      const idx = parseInt(cubeIndex, 10);
      if (!isNaN(idx) && !cutCubes[idx]) {
        handleSliceCube(idx);
      }
    }
  };

  const handleReset = () => {
    setCutCubes(Array(TOTAL_BLOCKS).fill(false));
    sound.playSingingBowl(480);
  };

  const remaining = cutCubes.filter((c) => !c).length;

  return (
    <div
      onPointerUp={handlePointerUp}
      className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4 md:p-8 select-none"
    >
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400 mb-1">
            <span>{t.soap.title}</span>
            <span aria-hidden="true">·</span>
            <span>ASMR Kinetic Texture Slicing</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {t.soap.title}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t.soap.subtitle}
          </p>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center gap-2">
          {(Object.keys(themes) as (keyof typeof themes)[]).map((thm) => (
            <button
              key={thm}
              onClick={() => {
                setColorTheme(thm);
                handleReset();
              }}
              className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-colors ${
                colorTheme === thm
                  ? 'bg-slate-800 border-slate-600 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {themes[thm].name}
            </button>
          ))}
        </div>
      </div>

      {/* Soap Cutting Bed */}
      <div className="relative p-6 md:p-12 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden flex flex-col items-center">
        {/* Soap Block Container */}
        <div
          onPointerMove={handleContainerPointerMove}
          className="grid grid-cols-12 gap-1.5 p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl touch-none cursor-crosshair"
          style={{ width: 'min(100%, 580px)' }}
        >
          {cutCubes.map((isCut, idx) => (
            <div
              key={idx}
              data-cube-index={idx}
              role="button"
              tabIndex={0}
              aria-label={`Soap cube ${idx + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSliceCube(idx);
                }
              }}
              onPointerDown={() => handlePointerDown(idx)}
              onPointerEnter={() => handlePointerEnter(idx)}
              className={`aspect-square rounded-sm transition-all duration-150 select-none ${
                isCut
                  ? 'opacity-0 scale-50 pointer-events-none'
                  : `${themes[colorTheme].cube} border shadow-sm hover:scale-95 active:scale-90 cursor-pointer`
              }`}
            />
          ))}
        </div>

        {/* HUD below */}
        <div className="mt-8 flex items-center justify-between w-full max-w-lg text-xs">
          <span className="text-slate-400">
            {t.soap.cubesLeft}: <span className="font-mono tabular-nums font-bold text-teal-400">{remaining}</span> / {TOTAL_BLOCKS}
          </span>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.soap.resetBar}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
