import React, { useState } from 'react';
import { Shield, Volume2, VolumeX, Terminal, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cyberAudio } from '../utils/audio';

export default function Navbar() {
  const { agent, isAuthenticated, logout } = useAuth();
  const [audioEnabled, setAudioEnabled] = useState(cyberAudio.enabled);

  const toggleAudio = () => {
    cyberAudio.enabled = !audioEnabled;
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      cyberAudio.playClick();
    }
  };

  return (
    <header className="w-full border-b border-cyan-500/20 bg-[#080d1a]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & System Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#0f172a] border border-cyan-500/40 shadow-neon-cyan">
            <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 rounded-lg border border-cyan-400/20 animate-ping opacity-20 pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-widest text-cyan-400 uppercase text-glow-cyan font-mono">
                VAULT CRACKER
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                v1.0.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              CORE PROTOCOL ONLINE
            </p>
          </div>
        </div>

        {/* Status Indicators & Audio Control */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0f172a] border border-slate-800 text-xs text-slate-300 font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">DATABASE:</span>
            <span className="text-cyan-400 font-semibold">MYSQL CONNECTED</span>
          </div>

          <button
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#0f172a] border border-slate-700/60 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-colors"
            title={audioEnabled ? 'Disable Cyber Audio SFX' : 'Enable Cyber Audio SFX'}
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
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
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800 font-mono">
              <span className="hidden sm:inline text-xs text-slate-400">AGENT:</span>
              <span className="text-xs font-bold text-cyan-300 px-2 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 shadow-neon-cyan">
                {agent.nick_name}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
