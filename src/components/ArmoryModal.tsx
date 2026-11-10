import React from 'react';
import { X, Lock, Check, Sparkles, Shield, Zap } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

export interface WeaponSkin {
  id: string;
  name: string;
  icon: string;
  type: 'hammer' | 'blade' | 'dummy';
  description: string;
  price: number;
  unlocked: boolean;
  effect: string;
}

interface ArmoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  equippedHammer: string;
  setEquippedHammer: (id: string) => void;
  weapons: WeaponSkin[];
  setWeapons: React.Dispatch<React.SetStateAction<WeaponSkin[]>>;
}

export const ArmoryModal: React.FC<ArmoryModalProps> = ({
  isOpen,
  onClose,
  coins,
  setCoins,
  equippedHammer,
  setEquippedHammer,
  weapons,
  setWeapons,
}) => {
  if (!isOpen) return null;

  const handleEquip = (weapon: WeaponSkin) => {
    if (!weapon.unlocked) {
      if (coins >= weapon.price) {
        // Purchase weapon
        setCoins((c) => c - weapon.price);
        setWeapons((prev) =>
          prev.map((w) => (w.id === weapon.id ? { ...w, unlocked: true } : w))
        );
        setEquippedHammer(weapon.id);
        sound.playFanfare();
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b', '#38bdf8'],
        });
      } else {
        sound.playBonk();
      }
      return;
    }

    setEquippedHammer(weapon.id);
    sound.playCoin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl p-6 md:p-8 rounded-3xl bg-slate-900 border-2 border-amber-500/50 shadow-2xl flex flex-col gap-6 text-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>PRO WEAPON ARMORY</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                  Custom Gear
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Unlock legendary weapons with Zen Coins earned by playing.
              </p>
            </div>
          </div>

          {/* Coin Wallet Display */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-400 font-black text-sm font-mono tabular-nums shadow-inner">
            <span className="text-base">🪙</span>
            <span>{coins.toLocaleString()}</span>
          </div>
        </div>

        {/* Weapon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {weapons.map((w) => {
            const isEquipped = equippedHammer === w.id;
            const canAfford = coins >= w.price;

            return (
              <div
                key={w.id}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                  isEquipped
                    ? 'bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/10'
                    : w.unlocked
                    ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-4xl p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                    {w.icon}
                  </div>
                  <div>
                    <div className="text-sm font-black text-white flex items-center gap-2">
                      <span>{w.name}</span>
                      {isEquipped && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{w.description}</div>
                    <div className="text-[11px] text-amber-400/90 font-bold mt-1">
                      ⚡ {w.effect}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-slate-400">
                    {w.unlocked ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-400">
                        🪙 {w.price.toLocaleString()} Coins
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleEquip(w)}
                    className={`px-4 py-1.5 rounded-xl font-black text-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow ${
                      isEquipped
                        ? 'bg-emerald-600 text-white'
                        : w.unlocked
                        ? 'bg-slate-800 hover:bg-slate-700 text-white'
                        : canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isEquipped
                      ? 'Equipped'
                      : w.unlocked
                      ? 'Equip'
                      : canAfford
                      ? 'Unlock'
                      : 'Locked'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
