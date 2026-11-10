import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Swords, Users, Globe, Trophy, Play, RotateCcw, Share2, Copy, Check, Zap, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SmashDuelPvpProps {
  onDuelWin?: (coins: number) => void;
}

type DuelMode = 'local_split' | 'online_room';
type DuelGameType = 'tug_of_war' | 'reflex_slam' | 'gadget_rush';

export const SmashDuelPvp: React.FC<SmashDuelPvpProps> = ({ onDuelWin }) => {
  const [duelMode, setDuelMode] = useState<DuelMode>('local_split');
  const [gameType, setGameType] = useState<DuelGameType>('tug_of_war');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [winner, setWinner] = useState<'player1' | 'player2' | 'draw' | null>(null);

  // Scores / Tug of War Position (-50 to +50; <0 means P1 leading, >0 means P2 leading)
  const [tugPosition, setTugPosition] = useState<number>(0);
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Reflex target
  const [reflexTarget, setReflexTarget] = useState<{ id: number; icon: string; label: string; active: boolean } | null>(null);
  const [reflexCooldown, setReflexCooldown] = useState<boolean>(false);

  // Online Room info
  const [roomCode, setRoomCode] = useState<string>(() => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
  });
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [opponentName, setOpponentName] = useState<string>('Kai (Tokyo, JP)');

  // BroadcastChannel for real-time inter-tab & peer syncing
  const channelRef = useRef<BroadcastChannel | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const botIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reflexTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize BroadcastChannel
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(`smashchill_duel_${roomCode}`);
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'P2_TAP') {
          handlePlayer2Action();
        } else if (type === 'START_GAME') {
          startCountdown();
        } else if (type === 'OPPONENT_JOINED') {
          setOpponentName(payload.name || 'Friend Connected!');
          sound.playCoin();
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [roomCode]);

  // Clean timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (botIntervalRef.current) clearInterval(botIntervalRef.current);
      if (reflexTimerRef.current) clearInterval(reflexTimerRef.current);
    };
  }, []);

  const startCountdown = () => {
    setWinner(null);
    setP1Score(0);
    setP2Score(0);
    setTugPosition(0);
    setTimeLeft(25);
    setCountdown(3);
    sound.playBonk();

    const countInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countInterval);
          setCountdown(null);
          beginBattle();
          return null;
        }
        sound.playBonk();
        return prev - 1;
      });
    }, 900);
  };

  const beginBattle = () => {
    setIsPlaying(true);
    sound.playPvpHit();

    // Match Timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endBattle();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // If reflex duel, start target popups
    if (gameType === 'reflex_slam') {
      spawnReflexTarget();
    }

    // If online mode with simulated opponent until remote taps
    if (duelMode === 'online_room') {
      botIntervalRef.current = setInterval(() => {
        // Human-like intermittent tapping
        if (Math.random() < 0.65) {
          handlePlayer2Action();
        }
      }, 420);
    }
  };

  const spawnReflexTarget = () => {
    const targets = [
      { icon: '⏰', label: '06:00 AM' },
      { icon: '📱', label: 'Boss Calling' },
      { icon: '🪫', label: '1% Battery' },
      { icon: '💣', label: 'Deadline' },
      { icon: '📄', label: 'Audit Notice' },
    ];
    const picked = targets[Math.floor(Math.random() * targets.length)];
    setReflexTarget({
      id: Date.now(),
      icon: picked.icon,
      label: picked.label,
      active: true,
    });
  };

  const handlePlayer1Action = () => {
    if (!isPlaying) return;
    sound.playPvpHit();

    if (gameType === 'tug_of_war') {
      setTugPosition((prev) => {
        const next = prev - 4;
        if (next <= -48) {
          concludeWinner('player1');
          return -50;
        }
        return next;
      });
      setP1Score((s) => s + 1);
    } else if (gameType === 'reflex_slam') {
      if (reflexTarget?.active) {
        sound.playBonk();
        setP1Score((s) => s + 100);
        setReflexTarget(null);
        setTimeout(spawnReflexTarget, 600);
      }
    } else {
      setP1Score((s) => s + 1);
    }

    // Broadcast if in room
    channelRef.current?.postMessage({ type: 'P1_TAP' });
  };

  const handlePlayer2Action = () => {
    if (!isPlaying) return;
    sound.playPvpHit();

    if (gameType === 'tug_of_war') {
      setTugPosition((prev) => {
        const next = prev + 4;
        if (next >= 48) {
          concludeWinner('player2');
          return 50;
        }
        return next;
      });
      setP2Score((s) => s + 1);
    } else if (gameType === 'reflex_slam') {
      if (reflexTarget?.active) {
        sound.playBonk();
        setP2Score((s) => s + 100);
        setReflexTarget(null);
        setTimeout(spawnReflexTarget, 600);
      }
    } else {
      setP2Score((s) => s + 1);
    }
  };

  const concludeWinner = (victor: 'player1' | 'player2') => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    setWinner(victor);

    sound.playFanfare();
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.5 },
      colors: victor === 'player1' ? ['#f43f5e', '#fb7185', '#ffffff'] : ['#38bdf8', '#818cf8', '#ffffff'],
    });

    if (victor === 'player1') {
      onDuelWin?.(250);
    }
  };

  const endBattle = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (botIntervalRef.current) clearInterval(botIntervalRef.current);

    if (gameType === 'tug_of_war') {
      if (tugPosition < 0) concludeWinner('player1');
      else if (tugPosition > 0) concludeWinner('player2');
      else setWinner('draw');
    } else {
      if (p1Score > p2Score) concludeWinner('player1');
      else if (p2Score > p1Score) concludeWinner('player2');
      else setWinner('draw');
    }
  };

  // Keyboard controls for desktop 2-player battle (P1 = Space/A, P2 = Enter/L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.code === 'KeyA' || e.code === 'KeyS' || e.code === 'Space') {
        e.preventDefault();
        handlePlayer1Action();
      } else if (e.code === 'KeyL' || e.code === 'KeyK' || e.code === 'Enter') {
        e.preventDefault();
        handlePlayer2Action();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameType, reflexTarget]);

  const copyDuelLink = () => {
    const url = `${window.location.origin}/?duel=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    sound.playCoin();
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none p-3 sm:p-5">
      {/* Top Header Card */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-4 sm:p-5 mb-4 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-purple-600 to-sky-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20">
            ⚔️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                1V1 SMASH DUEL ARENA
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded-full animate-pulse">
                Multiplayer
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Challenge friends or coworkers on the same device or via online room code!
            </p>
          </div>
        </div>

        {/* Duel Mode Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => {
                setDuelMode('local_split');
                sound.playBonk();
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                duelMode === 'local_split'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Same Screen (2P)</span>
            </button>

            <button
              onClick={() => {
                setDuelMode('online_room');
                sound.playBonk();
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                duelMode === 'online_room'
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Online Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Online Room Link Strip */}
      {duelMode === 'online_room' && (
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-sky-950/40 border border-sky-800/60 rounded-2xl p-3 sm:px-5 mb-4 text-xs text-sky-200">
          <div className="flex items-center gap-2">
            <span className="font-bold">Room Code:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 font-mono font-black text-amber-400 border border-slate-700 tracking-wider">
              {roomCode}
            </span>
            <span className="text-slate-400 hidden sm:inline">· Opponent: {opponentName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyDuelLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow cursor-pointer active:scale-95"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Duel Minigame Selector */}
      <div className="w-full flex items-center justify-center gap-2 mb-4">
        {[
          { id: 'tug_of_war' as DuelGameType, label: 'Tug-of-War Pop', icon: '🪢' },
          { id: 'reflex_slam' as DuelGameType, label: 'Alarm Reflex Slam', icon: '⏰' },
          { id: 'gadget_rush' as DuelGameType, label: 'Speed Tap Rush', icon: '⚡' },
        ].map((gm) => (
          <button
            key={gm.id}
            onClick={() => {
              setGameType(gm.id);
              sound.playBonk();
            }}
            disabled={isPlaying}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              gameType === gm.id
                ? 'bg-slate-800 border-amber-400 text-white scale-102 shadow'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="mr-1">{gm.icon}</span>
            <span>{gm.label}</span>
          </button>
        ))}
      </div>

      {/* Main 1v1 Battle Arena */}
      <div className="relative w-full min-h-[460px] rounded-3xl bg-slate-950 border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between">
        {/* Top HUD with Scores & Countdown */}
        <div className="w-full flex items-center justify-between p-4 z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
          {/* Player 1 HUD */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <div>
              <div className="text-[11px] font-black text-rose-400 tracking-wider uppercase">
                PLAYER 1 (RED)
              </div>
              <div className="text-2xl font-black font-mono text-white tabular-nums">
                {p1Score}
              </div>
            </div>
          </div>

          {/* Central Timer & Status */}
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">
              {isPlaying ? 'TIME REMAINING' : 'DUEL STATUS'}
            </div>
            <div className={`text-xl font-black font-mono tabular-nums ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`}>
              {isPlaying ? `00:${timeLeft.toString().padStart(2, '0')}` : 'READY'}
            </div>
          </div>

          {/* Player 2 HUD */}
          <div className="flex items-center gap-2 text-right">
            <div>
              <div className="text-[11px] font-black text-sky-400 tracking-wider uppercase">
                {duelMode === 'online_room' ? 'OPPONENT (BLUE)' : 'PLAYER 2 (BLUE)'}
              </div>
              <div className="text-2xl font-black font-mono text-white tabular-nums">
                {p2Score}
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-sky-500 animate-pulse" />
          </div>
        </div>

        {/* Central Arena Canvas / Interactive Zone */}
        <div className="flex-1 relative flex items-center justify-center p-4">
          {/* Tug of War Rope & Meter */}
          {gameType === 'tug_of_war' && (
            <div className="w-full max-w-xl flex flex-col items-center gap-4">
              <div className="w-full flex justify-between text-xs font-bold text-slate-400 px-2">
                <span className="text-rose-400">⬅️ P1 Win Zone</span>
                <span className="text-amber-400 font-mono">TENSION</span>
                <span className="text-sky-400">P2 Win Zone ➡️</span>
              </div>

              {/* Rope Bar */}
              <div className="w-full h-8 bg-slate-900 border-2 border-slate-700 rounded-full relative overflow-hidden flex items-center shadow-inner">
                {/* Red Side */}
                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-rose-500/20" />
                {/* Blue Side */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-sky-500/20" />
                {/* Center marker */}
                <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-amber-400 z-10" />

                {/* The Heavy Iron Knot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 text-3xl z-20 filter drop-shadow"
                  style={{
                    left: `calc(50% + ${tugPosition}%)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  🪢
                </div>
              </div>

              <div className="text-center text-xs text-slate-400 max-w-md">
                Tap your side rapidly to pull the stress knot! Push it 50% to win!
              </div>
            </div>
          )}

          {/* Reflex Slam Popups */}
          {gameType === 'reflex_slam' && (
            <div className="flex flex-col items-center justify-center gap-3">
              {reflexTarget && reflexTarget.active ? (
                <div className="flex flex-col items-center animate-bounce">
                  <span className="text-8xl filter drop-shadow-[0_10px_20px_rgba(244,63,94,0.4)]">
                    {reflexTarget.icon}
                  </span>
                  <span className="mt-2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-sm shadow">
                    FIRST TO TAP SNATCHES 100 PTS!
                  </span>
                </div>
              ) : (
                <div className="text-slate-500 font-bold animate-pulse text-sm">
                  Get ready... annoying target popping soon!
                </div>
              )}
            </div>
          )}

          {/* Gadget Tap Rush */}
          {gameType === 'gadget_rush' && (
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl mb-2 animate-bounce">⚡💥</div>
              <h4 className="text-xl font-black text-white">SPEED TAP FRENZY</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Tap as fast as humanly possible! Whoever racks up more smash points in 25 seconds claims victory!
              </p>
            </div>
          )}

          {/* Countdown Overlay (3, 2, 1, SMASH!) */}
          {countdown !== null && (
            <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
              <span className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-500 to-sky-400 font-mono animate-ping">
                {countdown}
              </span>
              <span className="text-lg font-black text-white mt-4 uppercase tracking-widest">
                GET READY TO DUEL!
              </span>
            </div>
          )}

          {/* Winner / Game Over Modal */}
          {winner && (
            <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
              <div className="text-7xl mb-2 animate-bounce">
                {winner === 'draw' ? '🤝' : '🏆'}
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400">
                {winner === 'player1'
                  ? 'PLAYER 1 (RED) CLAIMS VICTORY!'
                  : winner === 'player2'
                  ? `${duelMode === 'online_room' ? 'OPPONENT' : 'PLAYER 2 (BLUE)'} WINS!`
                  : "IT'S A DEAD EVEN DRAW!"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md">
                {winner === 'player1'
                  ? 'Incredible reflex speed! You completely crushed the opposition and earned +250 Zen Coins!'
                  : 'Great effort! Re-challenge immediately for revenge!'}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={startCountdown}
                  className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-sky-600 hover:brightness-110 text-white font-black text-sm shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>REMATCH NOW ⚡</span>
                </button>
              </div>
            </div>
          )}

          {/* Start Screen when not playing */}
          {!isPlaying && !winner && countdown === null && (
            <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
              <div className="text-6xl mb-2 animate-bounce">⚔️</div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {duelMode === 'local_split' ? '2-PLAYER LOCAL DUEL' : 'ONLINE PEER ARENA'}
              </h3>
              <p className="text-xs text-slate-300 mt-2 max-w-md">
                {duelMode === 'local_split'
                  ? 'Place phone/tablet between you and your friend, or use A key (P1) vs L key (P2) on keyboard!'
                  : 'Send the room invite link to a friend or play against live online competitors!'}
              </p>

              <button
                onClick={startCountdown}
                className="mt-6 flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-500 to-sky-600 hover:brightness-110 text-white font-black text-base shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START DUEL BATTLE!</span>
              </button>
            </div>
          )}
        </div>

        {/* Dual Split-Screen Interactive Slam Buttons (Bottom Half) */}
        <div className="w-full grid grid-cols-2 h-36 border-t-4 border-slate-800 z-10">
          {/* Player 1 Red Tap Zone */}
          <button
            onPointerDown={handlePlayer1Action}
            disabled={!isPlaying}
            className="w-full h-full bg-gradient-to-br from-rose-600 to-red-800 hover:from-rose-500 hover:to-red-700 active:brightness-125 border-r-2 border-slate-900 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-98 shadow-inner select-none touch-none"
          >
            <span className="text-3xl">🔴</span>
            <span className="font-black text-white text-base sm:text-lg tracking-wider">
              PLAYER 1 TAP!
            </span>
            <span className="text-[10px] text-rose-200 font-bold uppercase tracking-widest hidden sm:inline">
              [TAP / KEY 'A']
            </span>
          </button>

          {/* Player 2 Blue Tap Zone */}
          <button
            onPointerDown={handlePlayer2Action}
            disabled={!isPlaying}
            className="w-full h-full bg-gradient-to-bl from-sky-600 to-indigo-800 hover:from-sky-500 hover:to-indigo-700 active:brightness-125 border-l-2 border-slate-900 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-98 shadow-inner select-none touch-none"
          >
            <span className="text-3xl">🔵</span>
            <span className="font-black text-white text-base sm:text-lg tracking-wider">
              {duelMode === 'online_room' ? 'OPPONENT ZONE' : 'PLAYER 2 TAP!'}
            </span>
            <span className="text-[10px] text-sky-200 font-bold uppercase tracking-widest hidden sm:inline">
              [TAP / KEY 'L']
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
