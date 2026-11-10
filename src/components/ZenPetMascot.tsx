import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, MessageCircle, X, ChevronUp, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface ZenPetMascotProps {
  totalSmashed: number;
}

const QUOTES = [
  'Remember to unclench your jaw and drop your shoulders!',
  'Yelling at a frozen browser burns 0 calories. Slicing laptops here is better!',
  'I just ate 50 grams of your toxic workplace anxiety. Delicious!',
  'Take a slow breath in... 1, 2, 3... and let it all go.',
  'Your worth is not measured by your unread email inbox!',
  'Hydrate, stretch your wrists, and keep smashing!',
  'Need a break? Even the strongest warriors rest in the zen garden.',
];

export const ZenPetMascot: React.FC<ZenPetMascotProps> = ({ totalSmashed }) => {
  const [expression, setExpression] = useState<'happy' | 'wobble' | 'cool' | 'zen'>('happy');
  const [quote, setQuote] = useState<string>('Hey! Poke me to decompress!');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [happiness, setHappiness] = useState<number>(85);
  const [showBubble, setShowBubble] = useState<boolean>(false);

  // Level based on total smashed
  const petLevel = Math.min(10, Math.floor(totalSmashed / 10) + 1);

  const handlePoke = () => {
    sound.playPetGiggle();
    setExpression('wobble');
    setHappiness((h) => Math.min(100, h + 5));

    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
    setShowBubble(true);

    setTimeout(() => {
      setExpression(Math.random() > 0.5 ? 'cool' : 'zen');
    }, 400);

    setTimeout(() => {
      setShowBubble(false);
      setExpression('happy');
    }, 4500);
  };

  const eyeEmoji =
    expression === 'wobble'
      ? '> <'
      : expression === 'cool'
      ? '⌐■-■'
      : expression === 'zen'
      ? '˘ ˘'
      : '• •';

  const mouthEmoji =
    expression === 'wobble'
      ? 'ω'
      : expression === 'cool'
      ? '‿'
      : expression === 'zen'
      ? 'v'
      : '‿';

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        aria-label="Open Blobby Zen Companion Mascot"
        className="fixed bottom-4 right-4 z-40 p-2.5 rounded-full bg-slate-900/90 border-2 border-pink-500/50 shadow-2xl text-xl hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
        title="Open Blobby Mascot"
      >
        <span>🥟</span>
        <span className="text-[10px] font-bold text-pink-300">Blobby</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end select-none pointer-events-auto">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="mb-2 max-w-[220px] p-2.5 rounded-2xl bg-slate-900/95 border border-pink-500/40 shadow-2xl text-[11px] text-slate-200 leading-snug animate-in fade-in slide-in-from-bottom-2 relative">
          <p>{quote}</p>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 border-r border-b border-pink-500/40 rotate-45" />
        </div>
      )}

      {/* The Mascot Body */}
      <div className="relative group flex items-center gap-2">
        {/* Quick Close Button */}
        <button
          onClick={() => setIsMinimized(true)}
          aria-label="Minimize mascot"
          className="opacity-0 group-hover:opacity-100 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-opacity cursor-pointer mb-8"
          title="Minimize mascot"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Blobby character */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Poke Blobby Zen Mascot for happiness"
          onClick={handlePoke}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePoke();
            }
          }}
          className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-[2rem] bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-200 border-2 border-pink-300 shadow-[0_10px_25px_rgba(244,63,94,0.35)] flex flex-col items-center justify-center cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105 active:rotate-6 ${
            expression === 'wobble' ? 'animate-bounce' : ''
          }`}
        >
          {/* Level Crown if high level */}
          {petLevel >= 3 && (
            <span className="absolute -top-3 text-sm animate-pulse">
              {petLevel >= 5 ? '👑' : '⭐'}
            </span>
          )}

          {/* Eyes */}
          <div className="text-xs font-black text-slate-800 tracking-wider">
            {eyeEmoji}
          </div>

          {/* Cheeks */}
          <div className="w-full flex justify-between px-2.5 -my-0.5">
            <div className="w-2 h-1 bg-rose-400/80 rounded-full" />
            <div className="w-2 h-1 bg-rose-400/80 rounded-full" />
          </div>

          {/* Mouth */}
          <div className="text-xs font-black text-slate-800">
            {mouthEmoji}
          </div>

          {/* Happiness heart ping */}
          <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-slate-950/80 text-[9px] font-mono font-bold text-pink-300 border border-pink-500/40">
            Lv.{petLevel}
          </div>
        </div>
      </div>
    </div>
  );
};
