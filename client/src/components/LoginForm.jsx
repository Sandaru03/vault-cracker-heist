import React, { useState } from 'react';
import { Mail, Lock, KeyRound, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cyberAudio } from '../utils/audio';
import AlertBanner from './AlertBanner';

export default function LoginForm() {
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
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/90 border border-yellow-500/60 text-yellow-400 mb-3 shadow-neon-gold">
          <KeyRound className="w-6 h-6 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-wider font-mono text-glow-yellow">
          AGENT ACCESS TERMINAL
        </h2>
        <p className="text-xs text-amber-200/70 uppercase tracking-widest mt-1 font-mono">
          Enter Infiltration Credentials
        </p>
      </div>

      <AlertBanner type="error" message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} className="space-y-4 font-mono">
        {/* Email Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-amber-200/90 mb-1.5 flex items-center justify-between">
            <span>Agent Comms Email</span>
            <span className="text-[10px] text-yellow-500 font-semibold">REQUIRED</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-yellow-500/70">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent.zero@syndicate.net"
              className="w-full bg-black/80 border border-yellow-500/30 focus:border-yellow-400 rounded-lg pl-10 pr-4 py-2.5 text-sm text-yellow-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 shadow-inner transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-amber-200/90 mb-1.5 flex items-center justify-between">
            <span>Security Passcode</span>
            <span className="text-[10px] text-yellow-500 font-semibold">ENCRYPTED</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-yellow-500/70">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-black/80 border border-yellow-500/30 focus:border-yellow-400 rounded-lg pl-10 pr-4 py-2.5 text-sm text-yellow-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 shadow-inner transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-neon-gold hover:shadow-neon-gold-lg transition-all duration-200 disabled:opacity-60 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 text-black animate-spin" />
              <span>AUTHENTICATING AGENT...</span>
            </>
          ) : (
            <>
              <span>AUTHENTICATE & ACCESS SYSTEM</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
