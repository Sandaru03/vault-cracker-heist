import React, { useState } from 'react';
import { Shield, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cyberAudio } from '../utils/audio';

export default function Navbar() {
  const { agent, isAuthenticated } = useAuth();
  const [audioEnabled, setAudioEnabled] = useState(cyberAudio.enabled);

  const toggleAudio = () => {
    cyberAudio.enabled = !audioEnabled;
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      cyberAudio.playClick();
    }
  };

  return (
    <header className="w-full border-b border-yellow-500/30 bg-[#0a0a0c]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & System Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-black border border-yellow-500/60 shadow-neon-gold">
            <Shield className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-widest text-yellow-400 uppercase text-glow-yellow font-mono">
                VAULT CRACKER
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-yellow-950/80 border border-yellow-500/50 text-yellow-300">
                v1.0.0
              </span>
            </div>
            <p className="text-[10px] text-amber-200/70 uppercase tracking-widest flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping"></span>
              HEIST PROTOCOL ONLINE
            </p>
          </div>
        </div>

        {/* Audio Control & Agent Info */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/80 border border-yellow-500/40 hover:border-yellow-400 text-yellow-200 hover:text-yellow-100 text-xs font-mono transition-colors shadow-sm"
            title={audioEnabled ? 'Disable Cyber Audio SFX' : 'Enable Cyber Audio SFX'}
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-yellow-400" />
                <span className="hidden sm:inline text-[11px]">SFX ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline text-[11px] text-slate-500">SFX OFF</span>
              </>
            )}
          </button>

          {isAuthenticated && agent && (
            <div className="flex items-center gap-2 pl-2 border-l border-yellow-500/20 font-mono">
              <span className="hidden sm:inline text-xs text-amber-200/60">AGENT:</span>
              <span className="text-xs font-bold text-black px-2.5 py-1 rounded bg-yellow-400 border border-yellow-300 shadow-neon-gold">
                {agent.nick_name}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
