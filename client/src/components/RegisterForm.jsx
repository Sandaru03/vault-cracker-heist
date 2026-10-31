import React, { useState } from 'react';
import { User, ShieldAlert, Mail, Lock, Check, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cyberAudio } from '../utils/audio';
import AlertBanner from './AlertBanner';

export default function RegisterForm() {
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
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/90 border border-yellow-500/60 text-yellow-400 mb-3 shadow-neon-gold">
          <ShieldAlert className="w-6 h-6 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-wider font-mono text-glow-yellow">
          MINT VIRTUAL IDENTITY
        </h2>
        <p className="text-xs text-amber-200/70 uppercase tracking-widest mt-1 font-mono">
          Syndicate Operative Recruitment
        </p>
      </div>

      <AlertBanner type="error" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />

      <form onSubmit={handleSubmit} className="space-y-3.5 font-mono">
        {/* Name and Nick Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-amber-200/90 mb-1 flex items-center justify-between">
              <span>Full Name</span>
              <span className="text-[10px] text-yellow-500 font-semibold">REQ</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-yellow-500/70">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alexander Vance"
                className="w-full bg-black/80 border border-yellow-500/30 focus:border-yellow-400 rounded-lg pl-9 pr-3 py-2 text-xs text-yellow-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-amber-200/90 mb-1 flex items-center justify-between">
              <span>Tactical Call-Sign</span>
              <span className="text-[10px] text-yellow-500 font-semibold">NICKNAME</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-yellow-500/70">
                <span className="text-xs font-bold text-yellow-400">#</span>
              </div>
              <input
                type="text"
                name="nick_name"
                value={formData.nick_name}
                onChange={handleChange}
                placeholder="Vortex"
                className="w-full bg-black/80 border border-yellow-500/30 focus:border-yellow-400 rounded-lg pl-8 pr-3 py-2 text-xs text-yellow-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-amber-200/90 mb-1 flex items-center justify-between">
            <span>Operative Comms Email</span>
            <span className="text-[10px] text-yellow-500 font-semibold">REQUIRED</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-yellow-500/70">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vortex@syndicate.internal"
              className="w-full bg-black/80 border border-yellow-500/30 focus:border-yellow-400 rounded-lg pl-9 pr-3 py-2 text-xs text-yellow-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 shadow-inner"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-amber-200/90 mb-1 flex items-center justify-between">
            <span>Passcode (Min 6 Characters)</span>
            <span className="text-[10px] text-yellow-500 font-semibold">ENCRYPTED</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-yellow-500/70">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full bg-black/80 border border-yellow-500/30 focus:border-yellow-400 rounded-lg pl-9 pr-3 py-2 text-xs text-yellow-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 shadow-inner"
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-amber-200/90 mb-1 flex items-center justify-between">
            <span>Confirm Passcode</span>
            {passwordsMatch && (
              <span className="text-[10px] text-yellow-400 flex items-center gap-1 font-semibold">
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-yellow-500/70">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className={`w-full bg-black/80 border rounded-lg pl-9 pr-3 py-2 text-xs text-yellow-100 placeholder-slate-600 focus:outline-none shadow-inner ${
                passwordsMatch
                  ? 'border-yellow-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400'
                  : passwordsMismatch
                  ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                  : 'border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400'
              }`}
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
              <span>INITIALIZING AGENT IDENTITY...</span>
            </>
          ) : (
            <>
              <span>MINT VIRTUAL IDENTITY</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
