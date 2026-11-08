import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function AlertBanner({ type = 'error', message, onClose }) {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div
      className={`relative flex items-start gap-3 p-3.5 rounded-lg border mb-4 text-xs font-mono transition-all animate-fadeIn ${
        isError
          ? 'bg-rose-950/80 border-rose-500/80 text-rose-200'
          : 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200'
      }`}
    >
      <div className="mt-0.5 shrink-0">
        {isError ? (
          <AlertCircle className="w-4 h-4 text-rose-400" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        )}
      </div>

      <div className="flex-1 pr-4 leading-relaxed">
        <span className="font-bold tracking-wider uppercase mr-1">
          {isError ? '[ACCESS_DENIED]' : '[ACCESS_GRANTED]'}
        </span>
        {message}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors p-0.5"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
