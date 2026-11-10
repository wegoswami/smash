import React, { useState, useEffect } from 'react';
import { Flame, Gift, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface DailyStreakBadgeProps {
  onRewardCoins: (amount: number) => void;
}

export const DailyStreakBadge: React.FC<DailyStreakBadgeProps> = ({ onRewardCoins }) => {
  const [streakDays, setStreakDays] = useState<number>(1);
  const [canClaimToday, setCanClaimToday] = useState<boolean>(false);
  const [claimedToday, setClaimedToday] = useState<boolean>(false);

  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const lastVisit = localStorage.getItem('smashchill_last_streak_date');
      const savedStreak = parseInt(localStorage.getItem('smashchill_streak_count') || '1', 10);

      if (!lastVisit) {
        // First time
        localStorage.setItem('smashchill_last_streak_date', today);
        localStorage.setItem('smashchill_streak_count', '1');
        setStreakDays(1);
        setCanClaimToday(true);
      } else if (lastVisit === today) {
        // Already visited today
        setStreakDays(savedStreak);
        const claimed = localStorage.getItem('smashchill_streak_claimed_date') === today;
        setCanClaimToday(!claimed);
        setClaimedToday(claimed);
      } else {
        // Check if yesterday
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        let newStreak = savedStreak;
        if (lastVisit === yesterday) {
          newStreak = savedStreak + 1;
        } else {
          // Missed a day
          newStreak = 1;
        }
        localStorage.setItem('smashchill_last_streak_date', today);
        localStorage.setItem('smashchill_streak_count', newStreak.toString());
        setStreakDays(newStreak);
        setCanClaimToday(true);
        setClaimedToday(false);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleClaimStreak = () => {
    if (!canClaimToday) return;
    const today = new Date().toISOString().slice(0, 10);
    const reward = Math.min(50 * streakDays, 300);

    localStorage.setItem('smashchill_streak_claimed_date', today);
    setCanClaimToday(false);
    setClaimedToday(true);
    onRewardCoins(reward);
    sound.playSingingBowl(440);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.2 },
      colors: ['#f59e0b', '#ef4444', '#10b981'],
    });
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-rose-500/20 border border-orange-500/40 text-orange-300 text-xs font-black shadow-sm">
        <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
        <span>{streakDays} Day Streak</span>
      </div>

      {canClaimToday ? (
        <button
          onClick={handleClaimStreak}
          aria-label="Claim Daily Decompression Streak Coin Bonus"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer animate-bounce"
        >
          <Gift className="w-3 h-3" />
          <span>Claim +{Math.min(50 * streakDays, 300)} Coins</span>
        </button>
      ) : (
        <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          <span>Bonus Claimed</span>
        </span>
      )}
    </div>
  );
};
