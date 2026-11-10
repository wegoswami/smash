import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Settings, Check } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean>(true);
  const [adsConsent, setAdsConsent] = useState<boolean>(true);

  useEffect(() => {
    const savedConsent = localStorage.getItem('smashchill_cookie_consent_v2');
    if (!savedConsent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (analytics: boolean, ads: boolean) => {
    const consentData = {
      essential: true,
      analytics,
      ads,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('smashchill_cookie_consent_v2', JSON.stringify(consentData));
    localStorage.setItem('smashchill_cookie_consent', 'true');
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    savePreferences(true, true);
  };

  const handleDeclineOptional = () => {
    savePreferences(false, false);
  };

  const handleSaveCustom = () => {
    savePreferences(analyticsConsent, adsConsent);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-6 sm:max-w-lg z-50 p-4 sm:p-5 rounded-2xl bg-slate-900/98 border-2 border-slate-700 shadow-2xl backdrop-blur-xl text-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>Cookie & Privacy Consent</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            SmashChill uses cookies and local storage to save your game progress and high scores, measure site traffic via Google Analytics, and display relevant ads through Google AdSense.
          </p>
          <div className="text-[11px] text-slate-400 pt-0.5">
            Learn more in our{' '}
            <button
              onClick={onOpenPrivacy}
              className="text-amber-400 font-bold underline hover:text-amber-300 cursor-pointer"
            >
              Privacy Policy
            </button>
            {' '}& Google Ad policies.
          </div>
        </div>
      </div>

      {showPreferences && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800">
            <div>
              <div className="font-bold text-white flex items-center gap-1">
                <span>Essential & Game Saves</span>
                <span className="text-[10px] text-emerald-400 font-mono">(Always Active)</span>
              </div>
              <div className="text-[11px] text-slate-400">Stores unlocks, weapon skins, and sound preferences.</div>
            </div>
            <Check className="w-4 h-4 text-emerald-400" />
          </div>

          <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700">
            <div>
              <div className="font-bold text-white">Google Analytics (GA4)</div>
              <div className="text-[11px] text-slate-400">Anonymous visitor counts and performance data.</div>
            </div>
            <input
              type="checkbox"
              checked={analyticsConsent}
              onChange={(e) => setAnalyticsConsent(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700">
            <div>
              <div className="font-bold text-white">Google AdSense Personalized Ads</div>
              <div className="text-[11px] text-slate-400">Enables relevant sponsored banners to keep games free.</div>
            </div>
            <input
              type="checkbox"
              checked={adsConsent}
              onChange={(e) => setAdsConsent(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </label>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => setShowPreferences(!showPreferences)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer underline transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{showPreferences ? 'Hide Settings' : 'Customize'}</span>
        </button>

        <div className="flex items-center gap-2 ml-auto">
          {showPreferences ? (
            <button
              onClick={handleSaveCustom}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Save Choices
            </button>
          ) : (
            <button
              onClick={handleDeclineOptional}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Essential Only
            </button>
          )}

          <button
            onClick={handleAcceptAll}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};
