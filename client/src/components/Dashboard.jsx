import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Award, 
  Zap, 
  Lock, 
  LogOut, 
  Flame, 
  Radio, 
  Timer, 
  Key, 
  AlertOctagon,
  ChevronRight,
  Database,
  Crosshair
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cyberAudio } from '../utils/audio';

export default function Dashboard() {
  const { agent, logout } = useAuth();
  const [vaultModalOpen, setVaultModalOpen] = useState(false);

  const handleVaultClick = () => {
    cyberAudio.playClick();
    cyberAudio.playSuccess();
    setVaultModalOpen(true);
  };

  const handleLogout = () => {
    cyberAudio.playClick();
    logout();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 font-mono animate-fadeIn">
      {/* Top Banner / Welcome Agent */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-black via-[#141418] to-black border-2 border-yellow-500/50 p-6 sm:p-8 shadow-vault-panel">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-950/80 border border-yellow-400 text-yellow-300 shadow-neon-gold">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                VIRTUAL IDENTITY VERIFIED
              </span>
              <span className="text-xs text-amber-200/60">CLEARANCE: TIER 1</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-yellow-400 uppercase tracking-wider text-glow-yellow">
              Welcome Agent [{agent?.nick_name || 'OPERATIVE'}]!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Virtual identity registered into the syndicate database. Infiltration telemetry and secure session keys are active.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 hover:text-white transition-all text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>TERMINATE SESSION</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Agent Dossier + Mission Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Agent Dossier / Identity Badge */}
        <div className="lg:col-span-1 rounded-xl bg-[#0e0e12]/90 border border-yellow-500/40 p-6 backdrop-blur-md shadow-vault-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-yellow-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold tracking-widest uppercase">
                  AGENT DOSSIER
                </span>
              </div>
              <span className="text-[10px] text-black font-bold bg-yellow-400 px-2 py-0.5 rounded shadow-neon-gold">
                ID #{String(agent?.id || 1).padStart(4, '0')}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-[10px] uppercase text-amber-200/60 tracking-wider">Operative Name</p>
                <p className="text-sm font-bold text-slate-100">{agent?.full_name || 'Unknown Agent'}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase text-amber-200/60 tracking-wider">Call-Sign / Nick Name</p>
                <p className="text-base font-black text-yellow-400 tracking-wide">
                  [{agent?.nick_name || 'GHOST'}]
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase text-amber-200/60 tracking-wider">Encrypted Comms Channel</p>
                <p className="text-xs text-slate-300 truncate">{agent?.email}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-black border border-yellow-500/20">
                  <p className="text-[10px] uppercase text-slate-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Score
                  </p>
                  <p className="text-sm font-bold text-yellow-400">{agent?.score ?? 0} PTS</p>
                </div>
                <div className="p-2.5 rounded-lg bg-black border border-yellow-500/20">
                  <p className="text-[10px] uppercase text-slate-400 flex items-center gap-1">
                    <Award className="w-3 h-3 text-yellow-400" /> Badges
                  </p>
                  <p className="text-xs font-bold text-amber-300 truncate">
                    {agent?.unlocked_badges || 'NONE'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-yellow-400" /> MySQL Sync
              </span>
              <span className="text-emerald-400 font-semibold">PERSISTED</span>
            </div>
          </div>
        </div>

        {/* Right Column: Mission Status & Vault Entry Module */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mission Status Panel */}
          <div className="rounded-xl bg-[#0e0e12]/90 border border-yellow-500/40 p-6 backdrop-blur-md shadow-vault-panel">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-yellow-400">
                <Crosshair className="w-5 h-5 text-yellow-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="text-xs font-bold tracking-widest uppercase">
                  HEIST MISSION STATUS
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-black bg-yellow-400 px-2 py-0.5 rounded shadow-neon-gold">
                <Flame className="w-3 h-3 text-black" /> INFILTRATION READY
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-lg bg-black border border-yellow-500/20">
                <div className="flex items-center gap-2 text-yellow-400 mb-1">
                  <Terminal className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Target Vault</span>
                </div>
                <p className="text-[11px] text-slate-400">Sector-7 Cyber Core Vault</p>
                <div className="mt-2 text-[10px] text-yellow-400 font-mono">STATUS: LOCKED</div>
              </div>

              <div className="p-3.5 rounded-lg bg-black border border-yellow-500/20">
                <div className="flex items-center gap-2 text-yellow-400 mb-1">
                  <Timer className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase">40s Countdown</span>
                </div>
                <p className="text-[11px] text-slate-400">Event-Driven Subsystem</p>
                <div className="mt-2 text-[10px] text-amber-300 font-mono">ARMED // STANDBY</div>
              </div>

              <div className="p-3.5 rounded-lg bg-black border border-yellow-500/20">
                <div className="flex items-center gap-2 text-yellow-400 mb-1">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase">Interoperability</span>
                </div>
                <p className="text-[11px] text-slate-400">Banana REST API Gateway</p>
                <div className="mt-2 text-[10px] text-emerald-300 font-mono">UPLINK READY</div>
              </div>
            </div>

            {/* Infiltration Directives */}
            <div className="mt-5 p-4 rounded-lg bg-yellow-950/20 border border-yellow-500/30 text-xs text-slate-300 space-y-2">
              <div className="text-yellow-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Key className="w-3.5 h-3.5" /> MISSION BRIEFING // OPERATION CODE: VAULT-BREAKER
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Operative <strong className="text-yellow-300">[{agent?.nick_name}]</strong>, your virtual identity has been successfully registered. When the infiltration breach begins, you will face an encrypted keypad security matrix with a high-intensity 40-second countdown clock.
              </p>
            </div>
          </div>

          {/* Placeholder Button for Vault Entry */}
          <div className="rounded-xl bg-[#0e0e12]/90 border border-yellow-500/40 p-6 backdrop-blur-md shadow-vault-panel text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black border border-yellow-500/60 text-yellow-400 shadow-neon-gold">
                <Lock className="w-7 h-7 text-yellow-400 animate-pulse" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-100 uppercase tracking-wider">
                  HIGH-SECURITY VAULT ACCESS GATE
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Breach entry point into the cyber-heist challenge.
                </p>
              </div>

              {/* The required Vault Entry placeholder button */}
              <button
                type="button"
                onClick={handleVaultClick}
                className="w-full relative group overflow-hidden rounded-xl p-[2px] focus:outline-none transition-all duration-300 hover:scale-[1.01]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 rounded-xl animate-pulse" />
                
                <div className="relative bg-black group-hover:bg-[#121216] rounded-[10px] py-4 px-6 flex items-center justify-center gap-3 transition-colors shadow-neon-gold-lg">
                  <Key className="w-5 h-5 text-yellow-400 group-hover:rotate-45 transition-transform" />
                  <span className="text-sm font-black tracking-widest text-yellow-400 uppercase text-glow-yellow">
                    ENTER VAULT // INITIATE BREACH
                  </span>
                  <ChevronRight className="w-5 h-5 text-yellow-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <p className="text-[10px] text-slate-500 tracking-wider uppercase">
                Notice: Core Game Logic (Keypad Matrix & 40s Countdown) unlocks in Phase 2
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cyberpunk Modal for Vault Entry Placeholder Notice */}
      {vaultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0f172a] border border-yellow-400 p-6 shadow-neon-gold-lg text-left">
            <div className="flex items-center gap-3 text-yellow-400 mb-4 pb-3 border-b border-slate-800">
              <AlertOctagon className="w-6 h-6 text-yellow-400 animate-pulse" />
              <h3 className="text-base font-black tracking-wider uppercase text-glow-yellow">
                VAULT DOOR STATUS // ARMED
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Agent <strong className="text-yellow-300">[{agent?.nick_name}]</strong>, your Virtual Identity clearance has been authenticated and accepted.
              </p>
              <div className="p-3 rounded-lg bg-black border border-yellow-500/30 space-y-1.5 text-[11px]">
                <div className="text-yellow-400 font-bold uppercase">Upcoming Infiltration Modules:</div>
                <div className="text-slate-400">✦ Stage 2: Banana REST API Interoperability</div>
                <div className="text-slate-400">✦ Stage 3: Event-Driven Keypad & 40s Countdown Matrix</div>
              </div>
              <p className="text-slate-400 text-[11px]">
                The cyber vault door is primed. Core game mechanics are restricted for this stage as specified in protocol.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  cyberAudio.playClick();
                  setVaultModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black uppercase tracking-wider transition-colors shadow-neon-gold"
              >
                RETURN TO AGENT DASHBOARD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
