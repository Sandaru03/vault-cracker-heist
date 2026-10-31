import React, { useState } from 'react';
import { User, ShieldAlert, Mail, Lock, Check, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cyberAudio } from '../utils/audio';
import AlertBanner from './AlertBanner';

export default function RegisterForm({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    nick_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const passwordsMatch =
    formData.password &&
    formData.confirm_password &&
    formData.password === formData.confirm_password;

  const passwordsMismatch =
    formData.confirm_password && formData.password !== formData.confirm_password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    cyberAudio.playClick();
    setError('');
    setSuccess('');

    // Form Validation Checks
    if (!formData.name.trim()) {
      setError('Agent legal identifier (Name) is required.');
      cyberAudio.playError();
      return;
    }
    if (!formData.nick_name.trim()) {
      setError('Tactical operative Call-Sign (Nick Name) is required.');
      cyberAudio.playError();
      return;
    }
    if (!formData.email.trim()) {
      setError('Agent communication email is required.');
      cyberAudio.playError();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Invalid cyber comms email format.');
      cyberAudio.playError();
      return;
    }
    if (!formData.password) {
      setError('Security passkey is required.');
      cyberAudio.playError();
      return;
    }
    if (formData.password.length < 6) {
      setError('Security passkey must be at least 6 characters in length.');
      cyberAudio.playError();
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError('Passkey verification failed: Passwords do not match.');
      cyberAudio.playError();
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        full_name: formData.name.trim(),
        nick_name: formData.nick_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirm_password: formData.confirm_password,
      });

      cyberAudio.playSuccess();
      setSuccess('Virtual Identity successfully minted! Infiltration ready.');
    } catch (err) {
      setError(err.message || 'Identity initialization failed.');
      cyberAudio.playError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#080d1a] border border-cyan-500/40 text-cyan-400 mb-3 shadow-neon-cyan">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-cyan-400 uppercase tracking-wider font-mono text-glow-cyan">
          MINT VIRTUAL IDENTITY
        </h2>
        <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-mono">
          Syndicate Operative Recruitment
        </p>
      </div>

      <AlertBanner type="error" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />

      <form onSubmit={handleSubmit} className="space-y-3.5 font-mono">
        {/* Name and Nick Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1 flex items-center justify-between">
              <span>Full Name</span>
              <span className="text-[10px] text-cyan-400/80">REQ</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alexander Vance"
                className="w-full bg-[#080d1a] border border-slate-700/80 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1 flex items-center justify-between">
              <span>Tactical Call-Sign</span>
              <span className="text-[10px] text-cyan-400/80">NICKNAME</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <span className="text-xs font-bold text-cyan-500">#</span>
              </div>
              <input
                type="text"
                name="nick_name"
                value={formData.nick_name}
                onChange={handleChange}
                placeholder="Vortex"
                className="w-full bg-[#080d1a] border border-slate-700/80 focus:border-cyan-400 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1 flex items-center justify-between">
            <span>Operative Comms Email</span>
            <span className="text-[10px] text-cyan-400/80">REQUIRED</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vortex@syndicate.internal"
              className="w-full bg-[#080d1a] border border-slate-700/80 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-inner"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1 flex items-center justify-between">
            <span>Passcode (Min 6 Characters)</span>
            <span className="text-[10px] text-cyan-400/80">ENCRYPTED</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full bg-[#080d1a] border border-slate-700/80 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 shadow-inner"
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1 flex items-center justify-between">
            <span>Confirm Passcode</span>
            {passwordsMatch && (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-3 h-3" /> MATCHED
              </span>
            )}
            {passwordsMismatch && (
              <span className="text-[10px] text-rose-400 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3 h-3" /> MISMATCH
              </span>
            )}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className={`w-full bg-[#080d1a] border rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none shadow-inner ${
                passwordsMatch
                  ? 'border-emerald-500/80 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                  : passwordsMismatch
                  ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                  : 'border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
              }`}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-3 relative group overflow-hidden rounded-lg p-[1px] focus:outline-none disabled:opacity-60"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-cyan-500 to-indigo-500 rounded-lg group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-[#0f172a] hover:bg-transparent rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 transition-all">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
                  INITIALIZING AGENT IDENTITY...
                </span>
              </>
            ) : (
              <>
                <span className="text-xs uppercase tracking-widest text-cyan-400 group-hover:text-black font-bold transition-colors">
                  MINT VIRTUAL IDENTITY
                </span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:text-black transition-colors" />
              </>
            )}
          </div>
        </button>

        {/* Switch to Login */}
        <div className="pt-3 text-center border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            Already have syndicate clearance?{' '}
            <button
              type="button"
              onClick={() => {
                cyberAudio.playClick();
                onSwitchToLogin();
              }}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 transition-colors"
            >
              AUTHENTICATE HERE
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
