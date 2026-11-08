import React, { useState } from 'react';
import { Volume2, VolumeX, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cyberAudio } from '../utils/audio';

/**
 * Navbar Component
 * Minimalist heist header with sound control and operative status (No shield logo).
 */
export default function Navbar() {
  const { agent, isAuthenticated, logout } = useAuth();
  const [sfxEnabled, setSfxEnabled] = useState(cyberAudio.sfxEnabled);

  // Toggle game sound effects
  const toggleSfx = () => {
    cyberAudio.sfxEnabled = !sfxEnabled;
    setSfxEnabled(!sfxEnabled);
    if (!sfxEnabled) {
      cyberAudio.playClick();
    }
  };

  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Name (Clean typography, no shield logo) */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-widest text-white uppercase font-mono">
                VAULT CRACKER
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                v1.0.0
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
              INFILTRATION PROTOCOL ONLINE
            </p>
          </div>
        </div>

        {/* SFX Control & Session Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSfx}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
            title={sfxEnabled ? 'Disable SFX' : 'Enable SFX'}
          >
            {sfxEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline text-[11px] font-bold">SFX ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden sm:inline text-[11px] text-zinc-500">SFX OFF</span>
              </>
            )}
          </button>

          {isAuthenticated && (
            <button
              onClick={() => {
                cyberAudio.playClick();
                logout();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/60 border border-zinc-800 hover:border-red-800 text-zinc-400 hover:text-red-300 text-xs font-mono transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-bold">EXIT</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
