import React, { useState } from 'react';
import { 
  Key, 
  ChevronRight,
  Mail,
  LogOut,
  Trophy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cyberAudio } from '../utils/audio';
import VaultGame from './VaultGame';

/**
 * Operative Dashboard Component
 * Clean, minimal, modern heist theme (No unnecessary jargon or clutter).
 */
export default function Dashboard() {
  const { agent, logout } = useAuth();
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'game'

  // Launch the Vault Game
  const handleStartHeist = () => {
    if (cyberAudio?.playClick) cyberAudio.playClick();
    setActiveView('game');
  };

  // Logout session
  const handleLogout = () => {
    if (cyberAudio?.playClick) cyberAudio.playClick();
    logout();
  };

  // If game is active, render VaultGame component
  if (activeView === 'game') {
    return <VaultGame agent={agent} onExit={() => setActiveView('overview')} />;
  }

  return (
    <div className="w-full max-w-md mx-auto font-mono animate-fadeIn py-6">
      {/* Central Welcome Card */}
      <div className="rounded-2xl bg-zinc-950/95 border border-zinc-800 p-6 sm:p-8 shadow-2xl text-center">
        {/* Welcome Header */}
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>OPERATIVE ACTIVE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Welcome, {agent?.nick_name || 'Agent'}
          </h1>
        </div>

        {/* Agent Profile Box */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-left mb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">
                Operative
              </span>
              <span className="font-bold text-white text-base truncate block">
                {agent?.nick_name || 'GUEST'}
              </span>
              <span className="text-xs text-zinc-400 truncate block">
                {agent?.full_name || 'Guest Operative'}
              </span>
            </div>

            {/* Score Display (Default 0 PTS) */}
            <div className="text-right px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold flex items-center justify-end gap-1">
                <Trophy className="w-3 h-3 text-emerald-400" />
                Score
              </span>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-lg font-black text-white">
                  {agent?.score || 0}
                </span>
                <span className="text-[10px] text-zinc-400 font-bold">
                  PTS
                </span>
              </div>
            </div>
          </div>

          {/* Email and Badge */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 text-zinc-400 truncate max-w-[210px] sm:max-w-xs">
              <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">{agent?.email || 'guest@vaultcracker.internal'}</span>
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">
              {agent?.unlocked_badges === 'VAULT_BREAKER' ? 'VAULT BREAKER' : 'RECRUIT'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleStartHeist}
            className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
          >
            <Key className="w-4 h-4 text-black group-hover:rotate-45 transition-transform" />
            <span>ENTER VAULT</span>
            <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
