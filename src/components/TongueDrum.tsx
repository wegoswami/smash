import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Music, Play, Pause, CloudRain, Volume2, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface DrumNote {
  note: string;
  name: string;
  freq: number;
  key: string;
  angle: number; // degrees around center
  color: string;
}

const DRUM_NOTES: DrumNote[] = [
  { note: 'D4', name: 'Root Earth', freq: 293.66, key: '1', angle: 270, color: 'from-amber-500/30 to-amber-600/30 border-amber-500' },
  { note: 'E4', name: 'River', freq: 329.63, key: '2', angle: 315, color: 'from-emerald-500/30 to-teal-600/30 border-emerald-500' },
  { note: 'F4', name: 'Forest', freq: 349.23, key: '3', angle: 0, color: 'from-teal-500/30 to-cyan-600/30 border-teal-500' },
  { note: 'A4', name: 'Sky', freq: 440.00, key: '4', angle: 45, color: 'from-sky-500/30 to-blue-600/30 border-sky-500' },
  { note: 'C5', name: 'Ocean', freq: 523.25, key: '5', angle: 90, color: 'from-indigo-500/30 to-purple-600/30 border-indigo-500' },
  { note: 'D5', name: 'Mountain', freq: 587.33, key: '6', angle: 135, color: 'from-purple-500/30 to-fuchsia-600/30 border-purple-500' },
  { note: 'E5', name: 'Sunlight', freq: 659.25, key: '7', angle: 180, color: 'from-pink-500/30 to-rose-600/30 border-pink-500' },
  { note: 'F5', name: 'Celestial', freq: 698.46, key: '8', angle: 225, color: 'from-rose-500/30 to-amber-600/30 border-rose-500' },
];

interface TongueDrumProps {
  onNotePlayed?: () => void;
}

export const TongueDrum: React.FC<TongueDrumProps> = ({ onNotePlayed }) => {
  const [activeNoteIdx, setActiveNoteIdx] = useState<number | null>(null);
  const [totalNotesStruck, setTotalNotesStruck] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isRainActive, setIsRainActive] = useState<boolean>(false);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const playNote = (idx: number) => {
    const item = DRUM_NOTES[idx];
    if (!item) return;

    setActiveNoteIdx(idx);
    sound.playTongueDrum(item.freq);
    setTotalNotesStruck((t) => t + 1);

    if (onNotePlayed) {
      onNotePlayed();
    }

    setTimeout(() => {
      setActiveNoteIdx((curr) => (curr === idx ? null : curr));
    }, 400);
  };

  // Keyboard controls (Keys 1-8 or A-K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const keyIndex = parseInt(e.key, 10) - 1;
      if (keyIndex >= 0 && keyIndex < DRUM_NOTES.length) {
        playNote(keyIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Zen Auto Harmony Sequence
  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    } else {
      setIsAutoPlaying(true);
      const sequence = [0, 2, 4, 1, 3, 5, 2, 6, 7, 4, 1, 0];
      let step = 0;
      autoPlayTimerRef.current = setInterval(() => {
        const nextIdx = sequence[step % sequence.length];
        playNote(nextIdx);
        step++;
      }, 700);
    }
  };

  // Ambient zen rain sound toggle
  const toggleRain = () => {
    const nextState = !isRainActive;
    setIsRainActive(nextState);
    if (nextState) {
      sound.setStation('zen');
      if (!sound.getBgmPlaying()) {
        sound.toggleBgm();
      }
    } else {
      if (sound.getBgmPlaying()) {
        sound.toggleBgm();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4 select-none p-2 sm:p-4">
      {/* Top Arcade HUD */}
      <div className="w-full flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900 border-2 border-teal-500/40 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧘</span>
          <div>
            <h2 className="text-sm sm:text-base font-black text-teal-300 tracking-wide">
              Zen Tibetan Tongue Drum
            </h2>
            <p className="text-[10px] text-slate-400">
              D-Minor Pentatonic Harmonic Tuning · Impossible to play a wrong note
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-mono font-bold text-slate-300">
            Harmonics: <span className="text-teal-400 font-black">{totalNotesStruck}</span>
          </div>
        </div>
      </div>

      {/* Interactive Steel Drum Circular Body */}
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-b from-slate-800 via-stone-900 to-slate-950 border-8 border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_4px_12px_rgba(255,255,255,0.1)] flex items-center justify-center p-4">
        {/* Center Golden Resonator Hole */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-950 border-4 border-amber-500/30 shadow-[inset_0_6px_16px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center z-10 pointer-events-none">
          <span className="text-xl sm:text-2xl animate-spin-slow">☸️</span>
          <span className="text-[9px] font-mono font-black text-amber-400/80 mt-0.5">432 Hz</span>
        </div>

        {/* 8 Steel Tongue Petals Arranged in Circle */}
        {DRUM_NOTES.map((note, idx) => {
          const isActive = activeNoteIdx === idx;
          // Calculate polar position around drum radius
          const radius = 105; // radius in pixels
          const rad = (note.angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;

          return (
            <button
              key={note.note}
              onClick={() => playNote(idx)}
              aria-label={`Play tongue drum note ${note.note} (${note.name})`}
              className={`absolute w-14 h-16 sm:w-16 sm:h-20 rounded-3xl border-2 transition-all duration-150 flex flex-col items-center justify-center cursor-pointer shadow-lg active:scale-95 ${
                isActive
                  ? 'bg-teal-500 text-slate-950 scale-110 shadow-[0_0_25px_rgba(45,212,191,0.8)] border-white font-black'
                  : 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:border-teal-400/60 hover:scale-105'
              }`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <span className="text-xs sm:text-sm font-black font-mono">{note.note}</span>
              <span className="text-[8px] sm:text-[9px] opacity-75 truncate max-w-full px-1">{note.name}</span>
              <span className="text-[8px] text-amber-400 font-mono font-bold">[{note.key}]</span>
            </button>
          );
        })}
      </div>

      {/* Control Buttons (Melody & Rain ASMR) */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <button
          onClick={toggleAutoPlay}
          aria-label={isAutoPlaying ? 'Pause Zen Harmony Melody' : 'Play Zen Harmony Melody'}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
            isAutoPlaying
              ? 'bg-teal-600 text-white border-teal-400 animate-pulse'
              : 'bg-slate-900/90 hover:bg-slate-800 text-teal-300 border-teal-500/40'
          }`}
        >
          {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isAutoPlaying ? 'Stop Melody' : 'Auto Zen Melody 🎶'}</span>
        </button>

        <button
          onClick={toggleRain}
          aria-label={isRainActive ? 'Stop gentle rain ASMR' : 'Play gentle rain ASMR'}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer active:scale-95 ${
            isRainActive
              ? 'bg-sky-600/30 border-sky-400 text-sky-200'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <CloudRain className="w-4 h-4 text-sky-400" />
          <span>{isRainActive ? 'Rain ASMR: ON 🌧️' : 'Gentle Rain'}</span>
        </button>

        <button
          onClick={() => {
            setTotalNotesStruck(0);
            sound.playBonk();
          }}
          aria-label="Reset note counter"
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
