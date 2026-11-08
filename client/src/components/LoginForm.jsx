import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
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

    // Input validation
    if (!email.trim()) {
      setError('Agent identity email is required.');
      cyberAudio.playError();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please provide a valid email format.');
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
      setError(err.message || 'Authentication failed. Check your credentials.');
      cyberAudio.playError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full font-mono">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-white uppercase tracking-wider">
          AGENT ACCESS TERMINAL
        </h2>
        <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">
          Enter Infiltration Credentials
        </p>
      </div>

      <AlertBanner type="error" message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5">
            Agent Comms Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent.zero@syndicate.net"
              className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-white rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5">
            Security Passcode
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-white rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-3 py-3.5 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all duration-150 active:scale-95 disabled:opacity-60"
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
