import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Key, 
  ChevronRight,
  User,
  Mail,
  CheckCircle2,
  AlertOctagon
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
    <div className="w-full max-w-2xl mx-auto space-y-6 font-mono animate-fadeIn py-6">
      {/* Central Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0c0c0e]/95 border-2 border-yellow-500/60 p-6 sm:p-10 shadow-vault-panel backdrop-blur-xl text-center">
        {/* Decorative Corner Accents */}
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-yellow-400 rounded-tl-md" />
        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-yellow-400 rounded-tr-md" />
        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-yellow-400 rounded-bl-md" />
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-yellow-400 rounded-br-md" />

        {/* Shield Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black border-2 border-yellow-400 text-yellow-400 mb-4 shadow-neon-gold">
          <ShieldCheck className="w-9 h-9 text-yellow-400 animate-pulse" />
        </div>

        {/* Welcome Text with Agent Name */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-amber-200/70">
            WELCOME TO VAULT CRACKER
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-yellow-400 uppercase tracking-wider text-glow-yellow">
            Welcome Agent [{agent?.nick_name || 'OPERATIVE'}]!
          </h1>
          <p className="text-xs text-slate-300 max-w-md mx-auto pt-1">
            Virtual identity authenticated successfully. Session initialized in syndicate records.
          </p>
        </div>

        {/* Agent Info Box */}
        <div className="mt-8 p-4 rounded-xl bg-black/80 border border-yellow-500/30 text-left space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-yellow-400" /> Agent Identity Details
            </span>
            <span className="text-[10px] text-black font-bold bg-yellow-400 px-2 py-0.5 rounded shadow-neon-gold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-black" /> ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Operative Name:</span>
              <span className="font-bold text-slate-100">{agent?.full_name || 'Agent'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Tactical Call-Sign:</span>
              <span className="font-bold text-yellow-400">[{agent?.nick_name || 'GHOST'}]</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[10px] text-slate-400 uppercase block">Communication Channel:</span>
              <span className="font-mono text-slate-300 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-yellow-500" />
                {agent?.email}
              </span>
            </div>
          </div>
        </div>

        {/* Vault Entry Button */}
        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={handleVaultClick}
            className="w-full relative group overflow-hidden rounded-xl p-[2px] focus:outline-none transition-all duration-300 hover:scale-[1.01]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 rounded-xl animate-pulse" />
            <div className="relative bg-black group-hover:bg-[#121216] rounded-[10px] py-3.5 px-6 flex items-center justify-center gap-2 transition-colors shadow-neon-gold-lg">
              <Key className="w-5 h-5 text-yellow-400 group-hover:rotate-45 transition-transform" />
              <span className="text-xs sm:text-sm font-black tracking-widest text-yellow-400 uppercase text-glow-yellow">
                ENTER VAULT // INITIATE BREACH
              </span>
              <ChevronRight className="w-4 h-4 text-yellow-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 hover:border-rose-400 text-rose-300 hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>TERMINATE SESSION // LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Clean Vault Entry Notice Modal */}
      {vaultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0c0c0e] border-2 border-yellow-400 p-6 shadow-neon-gold-lg text-left font-mono">
            <div className="flex items-center gap-3 text-yellow-400 mb-4 pb-3 border-b border-slate-800">
              <AlertOctagon className="w-6 h-6 text-yellow-400 animate-pulse" />
              <h3 className="text-base font-black tracking-wider uppercase text-glow-yellow">
                VAULT DOOR STATUS // ARMED
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Agent <strong className="text-yellow-400">[{agent?.nick_name}]</strong>, your Virtual Identity clearance has been authenticated and verified.
              </p>
              <div className="p-3.5 rounded-lg bg-black border border-yellow-500/30 text-[11px] text-amber-200/90">
                Core game logic (Keypad Decryption & Countdown Timer) is scheduled for deployment in the upcoming stage.
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  cyberAudio.playClick();
                  setVaultModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-black text-xs font-black uppercase tracking-wider transition-colors shadow-neon-gold"
              >
                RETURN TO DASHBOARD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
