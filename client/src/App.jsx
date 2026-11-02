import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import LandingHero from './components/LandingHero';
import { cyberAudio } from './utils/audio';
import { LogIn, UserPlus, Shield, Loader2, ArrowLeft } from 'lucide-react';

function AuthView({ onBack }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 vault-bg-overlay font-mono">
      {/* Dark vignette backdrop overlay for maximum contrast and pop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none" />

      {/* Main Yellow & Black Auth Card */}
      <div className="relative z-10 w-full max-w-lg animate-fadeIn">
        {/* Back to Landing Screen Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              onBack();
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/90 hover:bg-zinc-900 border border-zinc-600 hover:border-white text-zinc-300 hover:text-white text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO TITLE SCREEN</span>
          </button>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black border-2 border-yellow-400 text-yellow-400 mb-2 shadow-neon-gold">
            <Shield className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-yellow-400 uppercase tracking-widest text-glow-yellow">
            VAULT CRACKER
          </h1>
          <p className="text-xs text-amber-200/80 uppercase tracking-widest mt-1">
            CYBER-HEIST INFILTRATION GATEWAY
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-black/80 border border-yellow-500/40 p-1 mb-5 backdrop-blur-md shadow-neon-gold">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setActiveTab('login');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-black shadow-neon-gold scale-[1.01]'
                : 'text-yellow-400/70 hover:text-yellow-200 hover:bg-black/60'
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
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-black shadow-neon-gold scale-[1.01]'
                : 'text-yellow-400/70 hover:text-yellow-200 hover:bg-black/60'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Identity</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="relative rounded-2xl bg-[#0c0c0e]/95 border-2 border-yellow-500/60 p-6 sm:p-8 backdrop-blur-xl shadow-vault-panel">
          {/* Decorative Gold Corner Accents */}
          <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-yellow-400 rounded-tl-md" />
          <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-yellow-400 rounded-tr-md" />
          <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-yellow-400 rounded-bl-md" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-yellow-400 rounded-br-md" />

          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const { isAuthenticated, loading, playAsGuest } = useAuth();
  const [screen, setScreen] = useState('landing'); // 'landing' | 'auth'

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white font-mono">
        <Loader2 className="w-10 h-10 animate-spin text-white mb-3" />
        <p className="text-xs uppercase tracking-widest text-zinc-400 animate-pulse">
          INITIALIZING VAULT PROTOCOLS...
        </p>
      </div>
    );
  }

  // When authenticated, show the Clean Welcome Dashboard with Navbar
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] vault-bg-overlay text-slate-100 flex flex-col justify-between selection:bg-yellow-400 selection:text-black">
        <div className="fixed inset-0 bg-black/65 backdrop-blur-[2px] pointer-events-none" />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 flex items-center justify-center">
            <Dashboard />
          </main>
        </div>
      </div>
    );
  }

  // When unauthenticated: Show Landing Hero page first as requested!
  if (screen === 'landing') {
    return (
      <LandingHero
        onOpenLogin={() => setScreen('auth')}
        onPlayAsGuest={playAsGuest}
      />
    );
  }

  // If user clicked 'LOGIN', show the Auth View (Login / Register)
  return <AuthView onBack={() => setScreen('landing')} />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
