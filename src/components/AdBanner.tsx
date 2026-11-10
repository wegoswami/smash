import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface AdBannerProps {
  format?: 'leaderboard' | 'rectangle';
  adClient?: string;
  adSlot?: string;
  className?: string;
  onRewardClick?: () => void;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  format = 'leaderboard',
  adClient = 'ca-pub-7658190454263901',
  adSlot = '7658190454',
  className = '',
  onRewardClick,
}) => {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef<boolean>(false);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;
    let attempts = 0;

    const tryPushAd = () => {
      if (pushedRef.current) return;
      const el = insRef.current;
      if (el && el.offsetWidth > 0 && !el.getAttribute('data-adsbygoogle-status')) {
        try {
          if (typeof window !== 'undefined') {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
            pushedRef.current = true;
          }
        } catch {
          // Gracefully ignore ad blocker or script failures
        }
      } else if (!pushedRef.current && attempts < 5) {
        attempts++;
        timerId = setTimeout(tryPushAd, 800);
      }
    };

    // Wait until browser layout is settled
    rafId = requestAnimationFrame(() => {
      timerId = setTimeout(tryPushAd, 600);
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (timerId !== null) clearTimeout(timerId);
    };
  }, []);

  return (
    <aside
      aria-label="Advertisement"
      className={`w-full flex flex-col items-center justify-center my-4 select-none ${className}`}
    >
      {/* Standard Google AdSense compliance label */}
      <div className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-bold text-slate-500 mb-1.5">
        <span>Advertisement</span>
        <span aria-hidden="true">·</span>
        <span className="text-emerald-500/80 font-mono">Verified Publisher</span>
      </div>

      {format === 'leaderboard' ? (
        <div className="relative w-full max-w-[728px] rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-700/60 shadow-lg p-3 sm:px-6 overflow-hidden">
          {/* Real Google AdSense responsive ins container with visible, measurable dimensions */}
          <div className="w-full flex justify-center overflow-hidden min-h-[90px] mb-2">
            <ins
              ref={insRef}
              className="adsbygoogle"
              style={{ display: 'block', minWidth: '250px', width: '100%', minHeight: '90px' }}
              data-ad-client={adClient}
              data-ad-slot={adSlot}
              data-ad-format="horizontal"
              data-full-width-responsive="true"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80 pt-2.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-white flex items-center gap-2">
                  <span>SmashChill Sponsor · Pure Stress Relief Hub</span>
                  <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Featured
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Enjoy ad-supported, 100% free gaming worldwide on smashchill.online.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onRewardClick ? (
                <button
                  onClick={onRewardClick}
                  aria-label="Claim 2X Score Booster"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-transform hover:scale-105 active:scale-95 shadow cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Claim 2X Boost</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-[11px] text-slate-300 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google AdSense Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Rectangle Unit */
        <div className="relative w-full max-w-[320px] rounded-2xl bg-gradient-to-b from-slate-900 via-slate-800/90 to-slate-900 border border-slate-700/60 shadow-xl p-5 flex flex-col justify-between text-center overflow-hidden">
          <div className="w-full flex justify-center overflow-hidden min-h-[250px] mb-3">
            <ins
              ref={insRef}
              className="adsbygoogle"
              style={{ display: 'block', minWidth: '250px', width: '100%', minHeight: '250px' }}
              data-ad-client={adClient}
              data-ad-slot={adSlot}
              data-ad-format="rectangle"
              data-full-width-responsive="true"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span className="font-bold uppercase tracking-wider">Decompress Station</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded-full text-[9px] font-mono text-emerald-400">AD</span>
          </div>

          <div className="my-auto py-2 flex flex-col items-center">
            <span className="text-3xl mb-1 animate-bounce">⚡</span>
            <h4 className="text-sm font-black text-white">Daily Zen & Decompression</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-[240px]">
              Micro-breaks improve focus by up to 47%. Keep smashing!
            </p>
          </div>

          {onRewardClick ? (
            <button
              onClick={onRewardClick}
              aria-label="Watch Video for 2X Multiplier"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer mt-2"
            >
              Watch Video for 2X Multiplier 🎁
            </button>
          ) : (
            <div className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 mt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Google AdSense Active</span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
