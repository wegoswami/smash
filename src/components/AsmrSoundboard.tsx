import React, { useState } from 'react';
import { Sparkles, Play } from 'lucide-react';
import { sound } from '../utils/audio';

export const AsmrSoundboard: React.FC = () => {
  const [isPlayingCascade, setIsPlayingCascade] = useState<boolean>(false);
  const [activePadIdx, setActivePadIdx] = useState<number | null>(null);

  const pads: { label: string; icon: string; color: string; play: () => void }[] = [
    { label: 'Bubble Pop', icon: '🫧', color: 'from-sky-500/20 to-blue-600/20 border-sky-500/40 text-sky-300', play: () => sound.playBubblePop() },
    { label: 'Sledge Bonk', icon: '🔨', color: 'from-rose-500/20 to-amber-600/20 border-rose-500/40 text-rose-300', play: () => sound.playBonk() },
    { label: 'Glass Shatter', icon: '💎', color: 'from-cyan-500/20 to-teal-600/20 border-cyan-500/40 text-cyan-300', play: () => sound.playShatter() },
    { label: 'Paper Shred', icon: '📄', color: 'from-amber-500/20 to-yellow-600/20 border-amber-500/40 text-amber-300', play: () => sound.playPaperShred() },
    { label: 'Katana Slice', icon: '⚔️', color: 'from-indigo-500/20 to-purple-600/20 border-indigo-500/40 text-indigo-300', play: () => sound.playSlice() },
    { label: 'Plasma Zap', icon: '⚡', color: 'from-fuchsia-500/20 to-pink-600/20 border-fuchsia-500/40 text-fuchsia-300', play: () => sound.playSmash('laser') },
    { label: 'Tibetan Bowl', icon: '🔔', color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-300', play: () => sound.playSingingBowl(340) },
    { label: 'Water Drop', icon: '💧', color: 'from-blue-500/20 to-cyan-600/20 border-blue-500/40 text-blue-300', play: () => sound.playWaterChime(4) },
  ];

  const handlePadClick = (idx: number, playFn: () => void) => {
    setActivePadIdx(idx);
    playFn();
    setTimeout(() => {
      setActivePadIdx((current) => (current === idx ? null : current));
    }, 250);
  };

  const handlePlayCascade = () => {
    if (isPlayingCascade) return;
    setIsPlayingCascade(true);

    pads.forEach((pad, index) => {
      setTimeout(() => {
        setActivePadIdx(index);
        pad.play();
        if (index === pads.length - 1) {
          setTimeout(() => {
            setIsPlayingCascade(false);
            setActivePadIdx(null);
          }, 350);
        }
      }, index * 220);
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-5 p-3.5 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2.5 mb-3 px-1 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎧</span>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-200">
            Instant ASMR Tactile Soundboard
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
            8 Pads
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handlePlayCascade}
            disabled={isPlayingCascade}
            aria-label="Play all 8 ASMR sounds in cascade sequence"
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/50 text-violet-200 hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm"
          >
            <Play className={`w-3 h-3 ${isPlayingCascade ? 'animate-spin' : ''}`} />
            <span>{isPlayingCascade ? 'Playing...' : 'Play Cascade'}</span>
          </button>
          <span className="text-[11px] text-slate-400 font-bold hidden md:inline">
            Tap any pad for instant de-stressing
          </span>
        </div>
      </div>

      {/* Symmetrical Balanced Grid: 4 columns on Mobile & Tablet, 8 columns on Laptop & Desktop */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 sm:gap-2.5 w-full">
        {pads.map((pad, idx) => {
          const isActive = activePadIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => handlePadClick(idx, pad.play)}
              aria-label={`Play ${pad.label} ASMR Sound Effect`}
              className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b ${pad.color} border transition-all duration-100 cursor-pointer shadow-sm min-w-0 w-full ${
                isActive
                  ? 'scale-110 ring-2 ring-white shadow-xl brightness-125'
                  : 'hover:scale-105 active:scale-90'
              }`}
            >
              <span className={`text-xl sm:text-2xl filter drop-shadow transition-transform ${isActive ? 'scale-125' : ''}`}>
                {pad.icon}
              </span>
              <span className="text-[10px] sm:text-[11px] font-black mt-1 text-center truncate w-full px-1">
                {pad.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
