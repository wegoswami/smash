import React from 'react';
import { GameMode } from './Header';
import { sound } from '../utils/audio';

interface MoodMatcherProps {
  activeMode: GameMode;
  onSelectGame: (mode: GameMode) => void;
  onRewardCoins?: (amount: number) => void;
}

interface MoodOption {
  mood: string;
  emoji: string;
  label: string;
  desc: string;
  targetGame: GameMode;
  color: string;
}

export const MoodMatcher: React.FC<MoodMatcherProps> = ({
  activeMode,
  onSelectGame,
  onRewardCoins,
}) => {
  const moods: MoodOption[] = [
    {
      mood: 'rage',
      emoji: '😡',
      label: 'High Rage / Anger',
      desc: 'Whack alarms & demolish PCs',
      targetGame: 'whack',
      color: 'from-rose-500/20 to-red-600/20 border-rose-500/40 text-rose-300 hover:border-rose-400',
    },
    {
      mood: 'crush',
      emoji: '🚜',
      label: 'Crush & Squash',
      desc: 'Hydraulic Press 10,000 PSI',
      targetGame: 'press',
      color: 'from-amber-500/20 to-orange-600/20 border-amber-500/40 text-amber-300 hover:border-amber-400',
    },
    {
      mood: 'fidget',
      emoji: '🫧',
      label: 'Restless & Fidgety',
      desc: 'Pop-It 3D & Bubble Wrap',
      targetGame: 'popit',
      color: 'from-pink-500/20 to-purple-600/20 border-pink-500/40 text-pink-300 hover:border-pink-400',
    },
    {
      mood: 'asmr',
      emoji: '🏖️',
      label: 'Tactile ASMR Slicing',
      desc: 'Kinetic Sand & Soap Carver',
      targetGame: 'sand',
      color: 'from-teal-500/20 to-emerald-600/20 border-teal-500/40 text-teal-300 hover:border-teal-400',
    },
    {
      mood: 'zen',
      emoji: '🌸',
      label: 'Exhausted & Burned Out',
      desc: 'Zen Koi Pond & Bell Chimes',
      targetGame: 'zen',
      color: 'from-sky-500/20 to-blue-600/20 border-sky-500/40 text-sky-300 hover:border-sky-400',
    },
    {
      mood: 'pvp',
      emoji: '⚔️',
      label: 'Bored / Competitive',
      desc: '1v1 Smash Duel with Friends',
      targetGame: 'pvp',
      color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/40 text-purple-300 hover:border-purple-400',
    },
  ];

  const handlePickMood = (m: MoodOption) => {
    sound.playBonk();
    onSelectGame(m.targetGame);
    if (onRewardCoins) {
      onRewardCoins(15);
    }
  };

  return (
    <section
      aria-label="Mood Matcher Decompression Tool"
      className="w-full max-w-4xl mx-auto mb-4 p-3 sm:p-4 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-lg select-none"
    >
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800/80 px-1">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg">🎯</span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-200">
            Instant Mood Matcher · How are you feeling right now?
          </span>
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-amber-400 font-mono hidden sm:inline">
          1-Tap Instant Relief (+15 Coins)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 w-full">
        {moods.map((m) => {
          const isSelected = activeMode === m.targetGame;
          return (
            <button
              key={m.mood}
              onClick={() => handlePickMood(m)}
              aria-label={`Match mood ${m.label} to game ${m.targetGame}`}
              className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b ${m.color} border transition-all duration-150 cursor-pointer text-center min-w-0 ${
                isSelected
                  ? 'ring-2 ring-white scale-102 shadow-md font-bold'
                  : 'hover:scale-103 active:scale-95 opacity-90 hover:opacity-100'
              }`}
            >
              <span className="text-xl sm:text-2xl filter drop-shadow">{m.emoji}</span>
              <span className="text-[11px] font-extrabold mt-1 truncate w-full text-white">
                {m.label.split('/')[0].trim()}
              </span>
              <span className="text-[9px] text-slate-300/80 truncate w-full mt-0.5">
                {m.desc}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
