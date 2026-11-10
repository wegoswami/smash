import React, { useState } from 'react';
import { X, Calendar, Gift, CheckCircle2, Trophy, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface DailyQuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  sessionStats: {
    itemsSmashed: number;
    rantsDestroyed: number;
    bubblesPopped: number;
    breathsTaken: number;
  };
}

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({
  isOpen,
  onClose,
  coins,
  setCoins,
  sessionStats,
}) => {
  const [claimedDailyStreak, setClaimedDailyStreak] = useState<boolean>(() => {
    return localStorage.getItem('smashchill_streak_claimed') === 'true';
  });

  const [claimedQuests, setClaimedQuests] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('smashchill_quests_claimed');
    return saved ? JSON.parse(saved) : {};
  });

  if (!isOpen) return null;

  const streakDays = [
    { day: 1, reward: 100, label: 'Day 1', done: true },
    { day: 2, reward: 150, label: 'Day 2', current: true },
    { day: 3, reward: 250, label: 'Day 3' },
    { day: 4, reward: 350, label: 'Day 4' },
    { day: 5, reward: 500, label: 'Day 5' },
    { day: 6, reward: 750, label: 'Day 6' },
    { day: 7, reward: 1500, label: 'Day 7 👑' },
  ];

  const quests = [
    {
      id: 'q1',
      title: 'Whack Master',
      desc: 'Smash 15 annoying notifications & alarms',
      current: Math.min(15, sessionStats.itemsSmashed),
      target: 15,
      reward: 250,
      icon: '🔨',
    },
    {
      id: 'q2',
      title: 'Blade Slicer',
      desc: 'Slice 10 flying laptops in Stress Ninja',
      current: Math.min(10, sessionStats.itemsSmashed),
      target: 10,
      reward: 200,
      icon: '⚔️',
    },
    {
      id: 'q3',
      title: 'Bubble Sensory',
      desc: 'Pop 30 tactile bubble wrap bubbles',
      current: Math.min(30, sessionStats.bubblesPopped),
      target: 30,
      reward: 150,
      icon: '🫧',
    },
  ];

  const handleClaimStreak = () => {
    if (claimedDailyStreak) return;
    setCoins((c) => c + 150);
    setClaimedDailyStreak(true);
    localStorage.setItem('smashchill_streak_claimed', 'true');
    sound.playFanfare();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#38bdf8'],
    });
  };

  const handleClaimQuest = (id: string, reward: number) => {
    if (claimedQuests[id]) return;
    setCoins((c) => c + reward);
    const updated = { ...claimedQuests, [id]: true };
    setClaimedQuests(updated);
    localStorage.setItem('smashchill_quests_claimed', JSON.stringify(updated));
    sound.playCoin();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl p-6 md:p-8 rounded-3xl bg-slate-900 border-2 border-emerald-500/50 shadow-2xl flex flex-col gap-6 text-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>DAILY STREAK & MISSIONS</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                Free Rewards
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Claim daily rewards and complete quick stress-busting missions.
            </p>
          </div>
        </div>

        {/* 7-Day Login Streak Box */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              🔥 7-Day Decompress Streak
            </span>
            <span className="text-xs text-amber-400 font-bold font-mono">Day 2 Active</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {streakDays.map((s, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-center ${
                  s.done
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : s.current
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-[10px] font-bold">{s.label}</span>
                <span className="text-sm font-black font-mono">+{s.reward}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleClaimStreak}
            disabled={claimedDailyStreak}
            className={`w-full py-2.5 rounded-xl font-black text-xs shadow-md transition-transform flex items-center justify-center gap-2 cursor-pointer ${
              claimedDailyStreak
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-105 active:scale-95'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>{claimedDailyStreak ? 'Claimed Today (Come back tomorrow)' : 'Claim Day 2: +150 Zen Coins!'}</span>
          </button>
        </div>

        {/* Daily Missions */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-slate-300">
            🎯 Today's Quick Missions
          </div>

          <div className="flex flex-col gap-2.5">
            {quests.map((q) => {
              const isComplete = q.current >= q.target;
              const isClaimed = claimedQuests[q.id];

              return (
                <div
                  key={q.id}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                      {q.icon}
                    </span>
                    <div>
                      <div className="text-xs font-extrabold text-white">{q.title}</div>
                      <div className="text-[11px] text-slate-400">{q.desc}</div>
                      <div className="w-28 sm:w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${(q.current / q.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-xs font-mono font-bold text-amber-400">
                      +{q.reward} 🪙
                    </div>
                    <button
                      onClick={() => handleClaimQuest(q.id, q.reward)}
                      disabled={!isComplete || isClaimed}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition-transform cursor-pointer shadow ${
                        isClaimed
                          ? 'bg-slate-800 text-slate-500 cursor-default'
                          : isComplete
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:scale-105 active:scale-95 animate-bounce'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {isClaimed ? 'Claimed' : isComplete ? 'Claim' : `${q.current}/${q.target}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
