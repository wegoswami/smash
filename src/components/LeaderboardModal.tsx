import React, { useState } from 'react';
import { Trophy, Medal, X, Globe, User, Plus, Check } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LeaderboardEntry {
  id: string;
  name: string;
  country: string;
  score: number;
  game: 'whack' | 'ninja' | 'slap';
  badge: string;
}

const DEFAULT_SCORES: LeaderboardEntry[] = [
  { id: '1', name: 'RageHammer_99', country: '🇯🇵 Japan', score: 9850, game: 'whack', badge: 'Grandmaster' },
  { id: '2', name: 'ZenMaster_Aarav', country: '🇮🇳 India', score: 9420, game: 'whack', badge: 'Zen Titan' },
  { id: '3', name: 'SlayerSam', country: '🇺🇸 USA', score: 8900, game: 'ninja', badge: 'Katana Legend' },
  { id: '4', name: 'Klaus_V', country: '🇩🇪 Germany', score: 8450, game: 'whack', badge: 'Decompressor' },
  { id: '5', name: 'Lucas_Rio', country: '🇧🇷 Brazil', score: 7920, game: 'slap', badge: 'Slap King' },
  { id: '6', name: 'Chloe_Paris', country: '🇫🇷 France', score: 7600, game: 'ninja', badge: 'Ninja Elite' },
  { id: '7', name: 'Liam_LDN', country: '🇬🇧 UK', score: 7120, game: 'whack', badge: 'Stress Destroyer' },
  { id: '8', name: 'Yuki_Osaka', country: '🇯🇵 Japan', score: 6850, game: 'slap', badge: 'Wobble Master' },
];

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userHighScore: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  userHighScore,
}) => {
  const [filter, setFilter] = useState<'all' | 'whack' | 'ninja' | 'slap'>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => {
    const saved =
      localStorage.getItem('smashchill_global_leaderboard') ||
      localStorage.getItem('catharsis_global_leaderboard');
    return saved ? JSON.parse(saved) : DEFAULT_SCORES;
  });

  const [playerName, setPlayerName] = useState<string>('');
  const [playerCountry, setPlayerCountry] = useState<string>('🇮🇳 India');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredEntries = entries
    .filter((e) => (filter === 'all' ? true : e.game === filter))
    .sort((a, b) => b.score - a.score);

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || userHighScore <= 0) return;

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: playerName.trim(),
      country: playerCountry,
      score: userHighScore,
      game: 'whack',
      badge: userHighScore > 5000 ? 'Pro Smasher' : 'Rising Star',
    };

    const updated = [newEntry, ...entries].sort((a, b) => b.score - a.score);
    setEntries(updated);
    localStorage.setItem('smashchill_global_leaderboard', JSON.stringify(updated));
    setHasSubmitted(true);
    sound.playFanfare();

    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#38bdf8'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl p-6 md:p-8 rounded-3xl bg-slate-900 border-2 border-amber-500/50 shadow-2xl flex flex-col gap-5 text-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Trophy className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>WORLDWIDE RANKINGS</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-600/30 text-rose-400 border border-rose-500/40 font-bold uppercase">
                Live
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Compete against top stress-relief players across 140 countries.
            </p>
          </div>
        </div>

        {/* Submit Your Score Banner */}
        {!hasSubmitted && userHighScore > 0 && (
          <form
            onSubmit={handleSubmitScore}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                type="text"
                placeholder="Enter Nickname..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={15}
                className="w-full sm:w-36 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
              <select
                value={playerCountry}
                onChange={(e) => setPlayerCountry(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="🇮🇳 India">🇮🇳 India</option>
                <option value="🇺🇸 USA">🇺🇸 USA</option>
                <option value="🇯🇵 Japan">🇯🇵 Japan</option>
                <option value="🇬🇧 UK">🇬🇧 UK</option>
                <option value="🇩🇪 Germany">🇩🇪 Germany</option>
                <option value="🇧🇷 Brazil">🇧🇷 Brazil</option>
                <option value="🇫🇷 France">🇫🇷 France</option>
                <option value="🇨🇦 Canada">🇨🇦 Canada</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!playerName.trim()}
              className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow"
            >
              Post Score ({userHighScore} pts)
            </button>
          </form>
        )}

        {hasSubmitted && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>Score posted to Global Leaderboard! You are now ranked!</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
              filter === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => setFilter('whack')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
              filter === 'whack' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔨 Whack
          </button>
          <button
            onClick={() => setFilter('ninja')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
              filter === 'ninja' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚔️ Ninja
          </button>
          <button
            onClick={() => setFilter('slap')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
              filter === 'slap' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🥊 Slap
          </button>
        </div>

        {/* Leaderboard Table List */}
        <div className="flex flex-col gap-2">
          {filteredEntries.slice(0, 10).map((entry, idx) => {
            const isTop3 = idx < 3;
            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  idx === 0
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                    : idx === 1
                    ? 'bg-slate-400/10 border-slate-400/30'
                    : idx === 2
                    ? 'bg-amber-700/10 border-amber-700/30'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs font-mono tabular-nums ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-950'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    #{idx + 1}
                  </div>

                  <div>
                    <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <span>{entry.name}</span>
                      <span className="text-[11px]">{entry.country.split(' ')[0]}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {entry.badge} · {entry.country.split(' ')[1]}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black font-mono tabular-nums text-amber-400">
                    {entry.score.toLocaleString()} <span className="text-[10px] text-slate-400">PTS</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
