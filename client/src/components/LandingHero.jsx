import React, { useState } from 'react';
import { LogIn, User, ChevronRight, Music } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

export default function LandingHero({ onOpenLogin, onPlayAsGuest }) {
  const [bgmPlaying, setBgmPlaying] = useState(cyberAudio.isBgmPlaying);

  // Toggle Robbery Background Music
  const handleToggleBgm = () => {
    const isPlaying = cyberAudio.toggleBgm();
    setBgmPlaying(isPlaying);
  };

  const handleLoginClick = () => {
    cyberAudio.playClick();
    onOpenLogin();
  };

  const handleGuestClick = () => {
    cyberAudio.playClick();
    cyberAudio.playSuccess();
    onPlayAsGuest();
  };

  return (
    <div className="min-h-screen w-full relative hero-bg-overlay flex flex-col justify-between p-6 sm:p-12 md:p-16 font-mono text-white selection:bg-white selection:text-black">
      {/* Top Bar (Only Robbery BGM Music Toggle, No SFX here) */}
      <header className="relative z-10 w-full flex items-center justify-end">
        <button
          onClick={handleToggleBgm}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-bold transition-all shadow-md ${
            bgmPlaying
              ? 'bg-red-600 border-red-500 text-white animate-pulse'
              : 'bg-black/85 hover:bg-zinc-900 border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white'
          }`}
          title={bgmPlaying ? 'Mute Robbery Music' : 'Play Robbery Heist Music'}
        >
          <Music className="w-4 h-4" />
          <span>{bgmPlaying ? 'BGM: PLAYING' : 'BGM: OFF'}</span>
        </button>
      </header>

      {/* Left-Aligned Clean Hero Content */}
      <main className="relative z-10 w-full max-w-xl my-auto py-8 space-y-6 animate-fadeIn">
        {/* Project Name (Clean White, Solid, Bold) */}
        <div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white leading-none drop-shadow-2xl">
            VAULT
            <span className="block text-zinc-100">
              CRACKER
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 tracking-widest font-semibold uppercase mt-3">
            THE HIGH-STAKES BANK INFILTRATION CHALLENGE
          </p>
        </div>

        {/* Short Briefing Text */}
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg font-sans">
          Infiltrate the high-security syndicate central vault. Crack the encrypted security matrix before the countdown expires.
        </p>

        {/* Action Buttons: Solid, Clean, No Yellow, No Glassmorphism */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-md">
          {/* Login Button - Solid White */}
          <button
            type="button"
            onClick={handleLoginClick}
            className="flex-1 py-4 px-7 rounded-lg bg-white hover:bg-zinc-200 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition-all duration-150 active:scale-95"
          >
            <LogIn className="w-4 h-4 text-black" />
            <span>LOGIN</span>
            <ChevronRight className="w-4 h-4 text-black" />
          </button>

          {/* Play as Guest Button - Solid Matte Black with White Border */}
          <button
            type="button"
            onClick={handleGuestClick}
            className="flex-1 py-4 px-7 rounded-lg bg-black hover:bg-zinc-900 border-2 border-zinc-600 hover:border-white text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition-all duration-150 active:scale-95"
          >
            <User className="w-4 h-4 text-white" />
            <span>PLAY AS GUEST</span>
          </button>
        </div>
      </main>

      {/* Minimal Bottom Bar */}
      <footer className="relative z-10 w-full text-[11px] text-zinc-600 flex items-center justify-between">
        <span>VAULT CRACKER // HEIST SYSTEM</span>
      </footer>
    </div>
  );
}
