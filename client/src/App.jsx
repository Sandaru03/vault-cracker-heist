import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import LandingHero from './components/LandingHero';
import { cyberAudio } from './utils/audio';
import { LogIn, UserPlus, Loader2, ArrowLeft } from 'lucide-react';

function AuthView({ onBack }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 hero-bg-overlay font-mono">
      {/* Dark vignette backdrop overlay for clean contrast */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] pointer-events-none" />

      {/* Main Clean Heist Auth Card */}
      <div className="relative z-10 w-full max-w-lg animate-fadeIn">
        {/* Back to Landing Screen Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              onBack();
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO TITLE SCREEN</span>
          </button>
        </div>

        {/* Brand Header (No shield logo) */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            VAULT CRACKER
          </h1>
          <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">
            CYBER-HEIST INFILTRATION GATEWAY
          </p>
        </div>

        {/* Tab Switcher - Clean White & Dark Zinc */}
        <div className="flex rounded-xl bg-zinc-900 border border-zinc-800 p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setActiveTab('login');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-150 ${
              activeTab === 'login'
                ? 'bg-white text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
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
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-150 ${
              activeTab === 'register'
                ? 'bg-white text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Identity</span>
          </button>
        </div>

        {/* Card Body - Clean Matte Black */}
        <div className="rounded-2xl bg-zinc-950/95 border border-zinc-800 p-6 sm:p-8 shadow-2xl">
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
      <div className="min-h-screen bg-[#0a0a0c] vault-bg-overlay text-slate-100 flex flex-col justify-between selection:bg-white selection:text-black">
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
