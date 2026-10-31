import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import { cyberAudio } from './utils/audio';
import { LogIn, UserPlus, ShieldAlert, Cpu, Terminal, Radio } from 'lucide-react';

function MainContent() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono">
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
          <div className="w-12 h-12 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin" />
          <Radio className="w-5 h-5 text-cyan-400" />
        </div>
        <p className="text-xs uppercase tracking-widest text-cyan-400 animate-pulse">
          INITIALIZING CYBER PROTOCOL...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Dashboard />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center justify-center">
      {/* Central Cyber Card Container */}
      <div className="w-full max-w-lg">
        {/* Modern Tab Bar for Seamless Switching */}
        <div className="flex rounded-xl bg-[#0f172a]/90 border border-cyan-500/30 p-1 mb-6 backdrop-blur-md shadow-neon-panel font-mono">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setActiveTab('login');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'login'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/80 shadow-neon-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Agent Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setActiveTab('register');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'register'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/80 shadow-neon-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Identity</span>
          </button>
        </div>

        {/* Auth Card */}
        <div className="relative rounded-2xl bg-[#0f172a]/95 border border-cyan-500/40 p-6 sm:p-8 backdrop-blur-xl shadow-neon-cyan-lg">
          {/* Subtle Cyber Corner Accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-md" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr-md" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 rounded-bl-md" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br-md" />

          {activeTab === 'login' ? (
            <LoginForm onSwitchToRegister={() => setActiveTab('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setActiveTab('login')} />
          )}
        </div>

        {/* Quick Syndicate System Diagnostics */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 font-mono">
          <div className="p-2 rounded bg-[#0f172a]/40 border border-slate-800/60">
            <span className="block text-slate-400">ENCRYPTION</span>
            <span className="text-cyan-400">BCRYPT 10-SALT</span>
          </div>
          <div className="p-2 rounded bg-[#0f172a]/40 border border-slate-800/60">
            <span className="block text-slate-400">DATABASE</span>
            <span className="text-cyan-400">MYSQL2/PROMISE</span>
          </div>
          <div className="p-2 rounded bg-[#0f172a]/40 border border-slate-800/60">
            <span className="block text-slate-400">SESSION</span>
            <span className="text-cyan-400">JWT SIGNED</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#080d1a] cyber-grid text-slate-100 flex flex-col justify-between relative selection:bg-cyan-500 selection:text-black">
        {/* Subtle scanline overlay */}
        <div className="fixed inset-0 scanlines pointer-events-none z-40" />

        <div className="relative z-10 flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 flex flex-col justify-center">
            <MainContent />
          </div>
        </div>

        {/* Global Footer */}
        <footer className="relative z-10 border-t border-cyan-500/10 bg-[#080d1a]/90 py-4 px-6 text-center text-xs font-mono text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="text-cyan-400 font-bold">VAULT CRACKER</span> // CYBER-HEIST OPERATIONS MONOREPO
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>MODULE 1: VIRTUAL IDENTITY</span>
              <span className="text-slate-700">|</span>
              <span className="text-slate-400">BANANA API: STANDBY</span>
              <span className="text-slate-700">|</span>
              <span className="text-slate-400">40s TIMER: READY</span>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
