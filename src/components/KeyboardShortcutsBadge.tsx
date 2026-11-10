import React, { useState } from 'react';
import { Keyboard, X, Volume2, Maximize, Play, Sparkles } from 'lucide-react';

interface KeyboardShortcutsBadgeProps {
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
}

export const KeyboardShortcutsBadge: React.FC<KeyboardShortcutsBadgeProps> = ({
  onToggleMute,
  onToggleFullscreen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Button on Desktop */}
      <div className="hidden lg:flex fixed bottom-5 left-5 z-40">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="View Keyboard Shortcuts"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 hover:border-amber-500/60 text-slate-300 hover:text-white text-xs font-bold shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Keyboard className="w-3.5 h-3.5 text-amber-400" />
          <span>Shortcuts [?]</span>
        </button>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Arcade Keyboard Shortcuts"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl text-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Keyboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Arcade Quick Controls</h3>
                  <p className="text-[11px] text-slate-400">Control SmashChill right from your keyboard</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close shortcuts dialog"
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-300 font-medium">Switch Games Instantly</span>
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400 font-bold">1</kbd>
                  <span className="text-slate-500">to</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400 font-bold">9</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-300 font-medium">Previous / Next Game</span>
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold">◀</kbd>
                  <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold">▶</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-300 font-medium">Toggle Mute / Audio</span>
                <kbd className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-sky-400 font-mono font-bold">M</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-300 font-medium">Toggle Background Ambient BGM</span>
                <kbd className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-teal-400 font-mono font-bold">B</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-300 font-medium">Toggle Fullscreen Immersion</span>
                <kbd className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-violet-400 font-mono font-bold">F</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-300 font-medium">Quick Smash / Hit Action</span>
                <kbd className="px-3 py-0.5 rounded bg-slate-800 border border-slate-700 text-rose-400 font-mono font-bold">Space</kbd>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-md"
              >
                Got It, Let&apos;s Play!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
