import React, { useState } from 'react';
import { 
  Key, 
  ChevronRight,
  User,
  Mail,
  CheckCircle2,
  LogOut,
  Crosshair
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cyberAudio } from '../utils/audio';
import VaultGame from './VaultGame';

/**
 * Operative Dashboard Component
 * Clean Heist Theme: Matte Black & Crisp White (No shield logo).
 * Allows agent to initiate vault infiltration game engine.
 */
export default function Dashboard() {
  const { agent, logout } = useAuth();
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'game'

  // Launch the 3-Level Event-Driven Vault Game
  const handleStartHeist = () => {
    cyberAudio.playClick();
    setActiveView('game');
  };

  // Terminate current operative session
  const handleLogout = () => {
    cyberAudio.playClick();
    logout();
  };

  // If game is active, render VaultGame component
  if (activeView === 'game') {
    return <VaultGame agent={agent} onExit={() => setActiveView('overview')} />;
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 font-mono animate-fadeIn py-6">
      {/* Central Welcome Card - Clean Matte Black & Crisp White */}
      <div className="rounded-2xl bg-zinc-950/95 border border-zinc-800 p-6 sm:p-8 shadow-2xl text-center">
        {/* Welcome Header (No shield logo) */}
        <div className="space-y-1 mb-6">
          <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-bold">
            OPERATIONAL HEADQUARTERS
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Welcome Agent [{agent?.nick_name || 'OPERATIVE'}]
          </h1>
          <p className="text-xs text-zinc-400 pt-1">
            Virtual identity authenticated. Security clearance active for vault heist.
          </p>
        </div>

        {/* Agent Info Details Box */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-left space-y-3 mb-6">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" /> Operative Dossier
            </span>
            <span className="text-[10px] text-black font-black bg-white px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-black" /> ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">Full Name:</span>
              <span className="font-bold text-zinc-200">{agent?.full_name || 'Classified Agent'}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">Nick name:</span>
              <span className="font-bold text-white">[{agent?.nick_name || 'GHOST'}]</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">Signal Frequency:</span>
              <span className="font-mono text-zinc-300 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                {agent?.email || 'unregistered@heist.net'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Enter Vault & Logout */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleStartHeist}
            className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
          >
            <Key className="w-4 h-4 text-black group-hover:rotate-45 transition-transform" />
            <span>ENTER VAULT // INITIATE BREACH</span>
            <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>TERMINATE SESSION // LOGOUT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
