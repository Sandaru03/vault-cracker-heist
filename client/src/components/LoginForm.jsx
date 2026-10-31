import React, { useState } from 'react';
import { Mail, Lock, KeyRound, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cyberAudio } from '../utils/audio';
import AlertBanner from './AlertBanner';

export default function LoginForm({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    cyberAudio.playClick();
    setError('');

    // Comprehensive client-side validation
    if (!email.trim()) {
      setError('Agent identity email is required.');
      cyberAudio.playError();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please provide a valid operative email format.');
      cyberAudio.playError();
      return;
    }
    if (!password) {
      setError('Security clearance password is required.');
      cyberAudio.playError();
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
      cyberAudio.playSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed. Check your clearance credentials.');
      cyberAudio.playError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#080d1a] border border-cyan-500/40 text-cyan-400 mb-3 shadow-neon-cyan">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-cyan-400 uppercase tracking-wider font-mono text-glow-cyan">
          AGENT ACCESS TERMINAL
        </h2>
        <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-mono">
          Enter Infiltration Credentials
        </p>
      </div>

      <AlertBanner type="error" message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} className="space-y-4 font-mono">
        {/* Email Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Agent Comms Email</span>
            <span className="text-[10px] text-cyan-400/80 font-normal">REQUIRED</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent.zero@syndicate.net"
              className="w-full bg-[#080d1a] border border-slate-700/80 focus:border-cyan-400 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-inner transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Security Passcode</span>
            <span className="text-[10px] text-cyan-400/80 font-normal">ENCRYPTED</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#080d1a] border border-slate-700/80 focus:border-cyan-400 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-inner transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 relative group overflow-hidden rounded-lg p-[1px] focus:outline-none disabled:opacity-60"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 rounded-lg group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-[#0f172a] hover:bg-transparent rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-all">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
                  AUTHENTICATING AGENT...
                </span>
              </>
            ) : (
              <>
                <span className="text-xs uppercase tracking-widest text-cyan-400 group-hover:text-black font-bold transition-colors">
                  AUTHENTICATE & ACCESS SYSTEM
                </span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:text-black transition-colors" />
              </>
            )}
          </div>
        </button>

        {/* Switch to Register */}
        <div className="pt-4 text-center border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            Unregistered Operative?{' '}
            <button
              type="button"
              onClick={() => {
                cyberAudio.playClick();
                onSwitchToRegister();
              }}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 transition-colors"
            >
              CREATE VIRTUAL IDENTITY
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

