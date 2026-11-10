import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Trophy,
  Music,
  Maximize,
  Minimize,
  Shield,
  Gift,
  HelpCircle,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { sound } from '../utils/audio';

export type GameMode =
  | 'whack'
  | 'pvp'
  | 'press'
  | 'popit'
  | 'ninja'
  | 'sand'
  | 'newton'
  | 'soap'
  | 'slap'
  | 'plate'
  | 'smash'
  | 'drum'
  | 'bubble'
  | 'zen'
  | 'shredder';

interface HeaderProps {
  activeMode: GameMode;
  setActiveMode: (mode: GameMode) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
  coins: number;
  onOpenArmory: () => void;
  onOpenQuests: () => void;
  onOpenWheel?: () => void;
  onOpenLeaderboard: () => void;
  onOpenStats: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenLegal?: (tab: 'about' | 'contact' | 'privacy') => void;
  onNavigateToPosts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  setActiveMode,
  isMuted,
  setIsMuted,
  isBgmPlaying,
  onToggleBgm,
  coins,
  onOpenArmory,
  onOpenQuests,
  onOpenWheel,
  onOpenLeaderboard,
  onOpenStats,
  isFullscreen,
  onToggleFullscreen,
  onOpenLegal,
  onNavigateToPosts,
}) => {
  const [isGamesDropdownOpen, setIsGamesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGamesDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsGamesDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const games: { id: GameMode; label: string; icon: string; category: string }[] = [
    { id: 'whack', label: 'Whack-A-Stress', icon: '🔨', category: 'Speed' },
    { id: 'pvp', label: '1v1 Smash Duel', icon: '⚔️', category: 'Multiplayer' },
    { id: 'press', label: 'Hydraulic Press', icon: '🚜', category: 'Crush' },
    { id: 'popit', label: '3D Pop-It Fidget', icon: '🌈', category: 'Sensory' },
    { id: 'ninja', label: 'Stress Ninja', icon: '🥷', category: 'Slice' },
    { id: 'sand', label: 'Kinetic Sand', icon: '🏖️', category: 'ASMR' },
    { id: 'newton', label: "Newton's Cradle", icon: '⚖️', category: 'Physics' },
    { id: 'soap', label: 'Soap Slicer', icon: '🧼', category: 'ASMR' },
    { id: 'slap', label: 'Slap Dummy', icon: '🥊', category: 'Ragdoll' },
    { id: 'plate', label: 'Plate Smash', icon: '🍽️', category: 'Shatter' },
    { id: 'smash', label: 'Smash Room', icon: '💥', category: 'Rage' },
    { id: 'drum', label: 'Tongue Drum', icon: '🧘', category: 'Chimes' },
    { id: 'bubble', label: 'Bubble Wrap', icon: '🫧', category: 'Relax' },
    { id: 'zen', label: 'Koi Zen Pond', icon: '🌸', category: 'Calm' },
    { id: 'shredder', label: 'Rant Shredder', icon: '📄', category: 'Vent' },
  ];

  const activeGame = games.find((g) => g.id === activeMode) || games[0];

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-clip bg-slate-950/95 backdrop-blur-md border-b-2 border-slate-800 select-none">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2.5">
        {/* Zone 1: Wordmark Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tight m-0 p-0 leading-none">
            <button
              onClick={() => {
                setActiveMode('whack');
                sound.playBonk();
              }}
              className="font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer text-base sm:text-xl md:text-2xl"
              aria-label="SmashChill Arcade — Anti-Stress Decompression Games Home"
            >
              <span>⚡ SMASHCHILL</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-600/30 text-rose-400 border border-rose-500/40 font-bold uppercase tracking-wider">
                PRO
              </span>
            </button>
          </h1>
        </div>

        {/* Zone 2: Center Navigation (Desktop & Laptop - Clean & Responsive) */}
        <nav aria-label="Arcade Navigation" className="hidden md:flex items-center gap-2">
          {/* Quick Games Dropdown Selector (Fits any screen width without overflow) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsGamesDropdownOpen(!isGamesDropdownOpen)}
              aria-expanded={isGamesDropdownOpen}
              aria-label="Select Game Mode"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-sm hover:bg-slate-850"
            >
              <span>{activeGame.icon}</span>
              <span className="font-extrabold">{activeGame.label}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isGamesDropdownOpen ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Popover */}
            {isGamesDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border-2 border-slate-700/80 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 px-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Switch Anti-Stress Game ({games.length})
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">100% Free Instant Play</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-[360px] overflow-y-auto pr-1">
                  {games.map((g) => {
                    const isSelected = activeMode === g.id;
                    return (
                      <button
                        key={g.id}
                        onClick={() => {
                          setActiveMode(g.id);
                          setIsGamesDropdownOpen(false);
                          sound.playBonk();
                        }}
                        aria-label={`Switch game to ${g.label}`}
                        className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all cursor-pointer text-xs ${
                          isSelected
                            ? 'bg-rose-600 text-white font-bold shadow'
                            : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-lg shrink-0">{g.icon}</span>
                        <div className="truncate">
                          <div className="font-bold truncate">{g.label}</div>
                          <div className="text-[9px] text-slate-400 opacity-80">{g.category}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 1v1 PvP Duel Quick Highlight */}
          <button
            onClick={() => {
              setActiveMode('pvp');
              sound.playBonk();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'pvp'
                ? 'bg-rose-600 text-white shadow scale-102'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <span>⚔️</span>
            <span>1v1 Duel</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-black">
              2P
            </span>
          </button>

          {/* Wellness Blog & Guides */}
          <a
            href="/posts"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateToPosts) {
                onNavigateToPosts();
              } else {
                document.getElementById('guides-and-faq')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            aria-label="Read SmashChill Wellness Blog and Game Guides"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/10 to-amber-500/10 hover:from-rose-500/20 hover:to-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Wellness Blog &amp; Guides</span>
            <span className="lg:hidden">Blog</span>
          </a>
        </nav>

        {/* Zone 3: Right Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Coin Wallet Button (Always Visible) */}
          <button
            onClick={onOpenArmory}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-amber-400 text-xs font-black font-mono tabular-nums transition-colors cursor-pointer shadow-inner shrink-0"
            title="Open Armory"
            aria-label={`Coin wallet with ${coins.toLocaleString()} coins. Click to open armory.`}
          >
            <span>🪙</span>
            <span>{coins >= 10000 ? `${(coins / 1000).toFixed(1)}k` : coins.toLocaleString()}</span>
          </button>

          {/* Lucky Spin Wheel (Desktop/Laptop >= 640px) */}
          {onOpenWheel && (
            <button
              onClick={onOpenWheel}
              title="Lucky Zen Spin Wheel"
              aria-label="Open Lucky Zen Spin Wheel"
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 transition-colors cursor-pointer hidden sm:flex items-center gap-1 text-xs font-bold shadow-sm"
            >
              <span className="text-sm animate-spin-slow">🎡</span>
              <span className="hidden xl:inline text-amber-300 font-black">Spin</span>
            </button>
          )}

          {/* Daily Quests (Desktop >= 1024px) */}
          <button
            onClick={onOpenQuests}
            title="Daily Quests & Streak"
            aria-label="Open Daily Quests"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer hidden lg:flex items-center gap-1 text-xs font-bold"
          >
            <Gift className="w-4 h-4 text-emerald-400" />
            <span className="hidden xl:inline">Quests</span>
          </button>

          {/* Weapon Armory (Desktop >= 1024px) */}
          <button
            onClick={onOpenArmory}
            title="Weapon Armory"
            aria-label="Open Weapon Armory"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer hidden lg:flex items-center gap-1 text-xs font-bold"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="hidden xl:inline">Gear</span>
          </button>

          {/* Lo-Fi Music BGM (Desktop >= 1180px) */}
          <button
            onClick={onToggleBgm}
            title={isBgmPlaying ? 'Pause Lo-Fi BGM' : 'Play Lo-Fi BGM'}
            aria-label={isBgmPlaying ? 'Pause Lo-Fi Background Music' : 'Play Lo-Fi Background Music'}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer hidden xl:flex items-center gap-1 ${
              isBgmPlaying
                ? 'bg-purple-600/30 border-purple-500 text-purple-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" />
            <span className="text-[11px]">{isBgmPlaying ? 'BGM ON' : 'BGM'}</span>
          </button>

          {/* Audio Sound FX Toggle (Always Accessible) */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer shrink-0"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Worldwide Leaderboard (Compact on mobile, full on desktop) */}
          <button
            onClick={onOpenLeaderboard}
            title="Worldwide Leaderboard"
            aria-label="Open Worldwide Rankings and Leaderboard"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ranks</span>
          </button>

          {/* Help & Compliance Desk (Desktop >= 1280px) */}
          {onOpenLegal && (
            <a
              href="/pages/about"
              onClick={(e) => {
                e.preventDefault();
                onOpenLegal('about');
              }}
              title="About & Help"
              aria-label="About SmashChill and Help Desk"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer hidden xl:block"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </a>
          )}

          {/* Fullscreen Pro Toggle (Desktop >= 1024px) */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen Mode' : 'Enter Fullscreen Mode'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer hidden lg:block"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Mobile & Tablet Hamburger Menu Button (Visible on screens < 768px) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Arcade Menu'}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer md:hidden flex items-center justify-center shrink-0"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Modal (Ultra-Smooth, Zero Horizontal Overflow) */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="md:hidden fixed inset-x-0 top-[53px] bottom-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 z-50 overflow-y-auto p-4 flex flex-col gap-5 animate-in fade-in slide-in-from-top-4 duration-200 select-none"
        >
          {/* Quick Tools & Modals Grid */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1">
              Arcade Features &amp; Tools
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {onOpenWheel && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenWheel();
                  }}
                  aria-label="Open Lucky Zen Spin Wheel"
                  className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-amber-300 font-bold text-xs cursor-pointer shadow-sm active:scale-95"
                >
                  <span className="text-xl">🎡</span>
                  <span>Spin Wheel</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenQuests();
                }}
                aria-label="Open Daily Quests and Achievements"
                className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 font-bold text-xs cursor-pointer active:scale-95"
              >
                <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Daily Quests</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenArmory();
                }}
                aria-label="Open Armory and Weapon Upgrades"
                className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 font-bold text-xs cursor-pointer active:scale-95"
              >
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Armory Gear</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLeaderboard();
                }}
                aria-label="Open Global Smash Leaderboards"
                className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 font-bold text-xs cursor-pointer active:scale-95"
              >
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Rankings</span>
              </button>

              <button
                onClick={onToggleBgm}
                aria-label={isBgmPlaying ? 'Pause Lo-Fi Background Music' : 'Play Lo-Fi Background Music'}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold cursor-pointer active:scale-95 ${
                  isBgmPlaying
                    ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300'
                }`}
              >
                <Music className="w-4 h-4 shrink-0" />
                <span>{isBgmPlaying ? 'BGM: ON 🎵' : 'Lo-Fi BGM'}</span>
              </button>

              <a
                href="/posts"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  if (onNavigateToPosts) {
                    onNavigateToPosts();
                  } else {
                    document.getElementById('guides-and-faq')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                aria-label="Navigate to SmashChill Wellness Blog and Stress Relief Guides"
                className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Wellness Blog</span>
              </a>

              {onOpenLegal && (
                <a
                  href="/pages/about"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    onOpenLegal('about');
                  }}
                  aria-label="View About SmashChill and Clinical Information"
                  className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 font-bold text-xs cursor-pointer active:scale-95"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>About &amp; Help</span>
                </a>
              )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onToggleFullscreen();
                }}
                aria-label={isFullscreen ? 'Exit Fullscreen Mode' : 'Enter Fullscreen Mode'}
                className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 font-bold text-xs cursor-pointer active:scale-95"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                <span>{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
              </button>
            </div>
          </div>

          {/* All 13 Games Quick Switch Section */}
          <div className="space-y-2 pb-6">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Switch Anti-Stress Game ({games.length})
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Tap to Play</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {games.map((g) => {
                const isSelected = activeMode === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      setActiveMode(g.id);
                      setIsMobileMenuOpen(false);
                      sound.playBonk();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    aria-label={`Play ${g.label} arcade game`}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-600 border-white text-white font-black shadow-lg scale-102'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{g.icon}</span>
                    <div className="truncate">
                      <div className="text-xs font-extrabold truncate">{g.label}</div>
                      <div className="text-[9px] text-slate-400 opacity-80">{g.category}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
