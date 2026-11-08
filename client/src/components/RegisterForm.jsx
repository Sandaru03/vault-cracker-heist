import React, { useState } from 'react';
import { User, Mail, Lock, Check, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
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

    // Input validation
    if (!formData.name.trim()) {
      setError('Agent full name is required.');
      cyberAudio.playError();
      return;
    }
    if (!formData.nick_name.trim()) {
      setError('Nick name is required.');
      cyberAudio.playError();
      return;
    }
    if (!formData.email.trim()) {
      setError('Agent communication email is required.');
      cyberAudio.playError();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Invalid email format.');
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
    <div className="w-full font-mono">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-white uppercase tracking-wider">
          MINT VIRTUAL IDENTITY
        </h2>
        <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">
          Syndicate Operative Recruitment
        </p>
      </div>

      <AlertBanner type="error" message={error} onClose={() => setError('')} />
      <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Name and Nick Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alexander Vance"
                className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-white rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1">
              Nick name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <span className="text-xs font-bold text-zinc-400">#</span>
              </div>
              <input
                type="text"
                name="nick_name"
                value={formData.nick_name}
                onChange={handleChange}
                placeholder="Vortex"
                className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-white rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1">
            Operative Comms Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vortex@syndicate.internal"
              className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-white rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1">
            Passcode (Min 6 Characters)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full bg-zinc-900/90 border border-zinc-700 focus:border-white rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white transition-colors"
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1 flex items-center justify-between">
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className={`w-full bg-zinc-900/90 border rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                passwordsMatch
                  ? 'border-emerald-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                  : passwordsMismatch
                  ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                  : 'border-zinc-700 focus:border-white focus:ring-1 focus:ring-white'
              }`}
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
