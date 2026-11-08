import React, { useState, useEffect, useRef } from 'react';
import { 
  Key, 
  RotateCcw, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Unlock, 
  Siren, 
  Timer as TimerIcon 
} from 'lucide-react';
import { cyberAudio } from '../utils/audio';

/**
 * Event-Driven Vault Game Component
 * Features:
 * - 3 Progressive security levels (Clear all 3 to crack vault)
 * - Simple arithmetic decryption puzzles
 * - 60-second countdown timer per puzzle
 * - 3-Alert Security System:
 *     Alert 1: Warning + new puzzle + 60s reset
 *     Alert 2: Level demotion (-1 level) + Warning Modal (1 chance left!) + 60s reset
 *     Alert 3: Maximum breach -> Operative Arrested
 */
export default function VaultGame({ agent, onExit }) {
  // Game state
  const [level, setLevel] = useState(1);
  const [alertCount, setAlertCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [enteredCode, setEnteredCode] = useState('');
  const [puzzle, setPuzzle] = useState({ question: '', hint: '' });
  const [internalSolution, setInternalSolution] = useState('');
  
  // Modals and status states
  const [loading, setLoading] = useState(true);
  const [showDemotionModal, setShowDemotionModal] = useState(false);
  const [isArrested, setIsArrested] = useState(false);
  const [isVaultCracked, setIsVaultCracked] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const timerRef = useRef(null);

  // Viva comment: Initialize new game mission from backend API
  const startNewGame = async () => {
    try {
      setLoading(true);
      setIsArrested(false);
      setIsVaultCracked(false);
      setShowDemotionModal(false);
      setEnteredCode('');
      setAlertCount(0);

      const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent?.id || 9999 })
      });

      const data = await response.json();
      if (data.success) {
        setLevel(data.level);
        setPuzzle(data.puzzle);
        setInternalSolution(data._internalSolution);
        setTimeLeft(data.timer || 60);
        setStatusMessage('INFILTRATION ONLINE. CRACK THE CODE.');
      }
    } catch (err) {
      console.error('Failed to start game:', err);
      // Fallback offline puzzle if backend fails
      setLevel(1);
      setPuzzle({ question: '4 + 3 = ?', hint: 'Basic addition' });
      setInternalSolution('7');
      setTimeLeft(60);
    } finally {
      setLoading(false);
    }
  };

  // Viva comment: Start mission on component mount
  useEffect(() => {
    startNewGame();
    return () => clearInterval(timerRef.current);
  }, []);

  // Viva comment: 60-second countdown timer interval handler
  useEffect(() => {
    if (loading || isArrested || isVaultCracked || showDemotionModal) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, isArrested, isVaultCracked, showDemotionModal, level, alertCount, internalSolution]);

  // Viva comment: Triggered when 60s timer expires without an answer
  const handleTimeout = () => {
    cyberAudio.playAlert();
    submitSolution('TIMEOUT');
  };

  // Viva comment: Handle virtual keypad number click
  const handleKeyClick = (num) => {
    if (enteredCode.length < 6 && !isArrested && !isVaultCracked) {
      cyberAudio.playClick();
      setEnteredCode((prev) => prev + num);
    }
  };

  // Viva comment: Clear entered keypad input
  const handleClear = () => {
    cyberAudio.playClick();
    setEnteredCode('');
  };

  // Viva comment: Submit answer to server and handle game events
  const submitSolution = async (forcedAnswer = null) => {
    const answerToSubmit = forcedAnswer !== null ? forcedAnswer : enteredCode;
    if (!answerToSubmit && forcedAnswer === null) return;

    try {
      const response = await fetch('/api/game/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: answerToSubmit,
          expectedSolution: internalSolution,
          currentLevel: level,
          alertCount: alertCount,
          agentId: agent?.id || 9999
        })
      });

      const data = await response.json();
      setEnteredCode('');

      if (data.correct) {
        cyberAudio.playSuccess();
        if (data.vaultCracked) {
          // All 3 levels cracked!
          setIsVaultCracked(true);
          setStatusMessage(data.message);
        } else {
          // Advanced to next level
          setLevel(data.level);
          setPuzzle(data.puzzle);
          setInternalSolution(data._internalSolution);
          setTimeLeft(60);
          setStatusMessage(data.message);
        }
      } else {
        // Incorrect answer or timeout
        cyberAudio.playAlert();
        setAlertCount(data.alertCount);

        if (data.arrested) {
          // Alert 3 triggered: Operative arrested
          setIsArrested(true);
          setStatusMessage(data.message);
        } else if (data.alertCount === 2) {
          // Alert 2 triggered: Level demoted and show popup modal
          setLevel(data.level);
          setPuzzle(data.puzzle);
          setInternalSolution(data._internalSolution);
          setTimeLeft(60);
          setShowDemotionModal(true);
          setStatusMessage(data.message);
        } else {
          // Alert 1 triggered: Warning strike
          setPuzzle(data.puzzle);
          setInternalSolution(data._internalSolution);
          setTimeLeft(60);
          setStatusMessage(data.message);
        }
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };

  // Viva comment: Keyboard listener for direct number typing and Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showDemotionModal || isArrested || isVaultCracked) return;
      if (e.key >= '0' && e.key <= '9') {
        handleKeyClick(e.key);
      } else if (e.key === 'Backspace') {
        handleClear();
      } else if (e.key === 'Enter') {
        submitSolution();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enteredCode, internalSolution, level, alertCount, showDemotionModal, isArrested, isVaultCracked]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 font-mono animate-fadeIn py-4">
      {/* Top Navigation & Exit Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            cyberAudio.playClick();
            onExit();
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>ABORT TO DASHBOARD</span>
        </button>

        <span className="text-[11px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          HEIST PROTOCOL ENGAGED
        </span>
      </div>

      {/* Main Terminal Box */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Header: Level Status & Countdown Timer */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
          {/* Level Tracker */}
          <div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
              SECURITY LAYER
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-white tracking-wider">
                LEVEL {level} <span className="text-zinc-600 text-sm font-normal">/ 3</span>
              </span>
            </div>
          </div>

          {/* 60s Countdown Timer */}
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold flex items-center justify-end gap-1">
              <TimerIcon className="w-3 h-3 text-zinc-400" /> TIME REMAINING
            </span>
            <span className={`text-xl sm:text-2xl font-black tracking-widest ${
              timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'
            }`}>
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Security Alert Strikes Indicator (3-Alert System) */}
        <div className="mb-6 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Siren className={`w-4 h-4 ${alertCount > 0 ? 'text-red-500 animate-bounce' : 'text-zinc-500'}`} />
            SECURITY STRIKES:
          </span>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((strike) => (
              <div
                key={strike}
                className={`px-2.5 py-1 rounded text-xs font-black transition-all ${
                  alertCount >= strike
                    ? 'bg-red-600 text-white shadow-md scale-105'
                    : 'bg-zinc-800 text-zinc-600 border border-zinc-700/50'
                }`}
              >
                ALERT {strike}
              </div>
            ))}
          </div>
        </div>

        {/* Easy Decryption Puzzle Screen */}
        <div className="mb-6 p-5 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-1">
            SOLVE CIPHER TO UNLOCK LAYER {level}
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-widest my-2">
            {puzzle.question || '4 + 3 = ?'}
          </div>
          <span className="text-[11px] text-zinc-500 block">
            Tip: {puzzle.hint || 'Calculate code and enter below'}
          </span>
        </div>

        {/* Keypad Display Input */}
        <div className="mb-5">
          <div className="w-full h-14 rounded-xl bg-black border border-zinc-700 flex items-center justify-between px-4">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
              INPUT CODE:
            </span>
            <span className="text-2xl font-black tracking-widest text-white">
              {enteredCode || <span className="text-zinc-700">_ _</span>}
            </span>
          </div>
        </div>

        {/* Interactive Keypad Grid (1-9, Clear, 0, Submit) */}
        <div className="grid grid-cols-3 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyClick(String(digit))}
              className="h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 hover:border-zinc-700 text-white font-black text-lg transition-all active:scale-95 flex items-center justify-center shadow-sm"
            >
              {digit}
            </button>
          ))}

          {/* Clear Key */}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center"
          >
            CLEAR
          </button>

          {/* Zero Key */}
          <button
            type="button"
            onClick={() => handleKeyClick('0')}
            className="h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 hover:border-zinc-700 text-white font-black text-lg transition-all active:scale-95 flex items-center justify-center shadow-sm"
          >
            0
          </button>

          {/* Submit Key */}
          <button
            type="button"
            onClick={() => submitSolution()}
            disabled={!enteredCode}
            className="h-12 rounded-xl bg-white hover:bg-zinc-200 active:bg-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed text-black font-black text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center shadow-md"
          >
            SUBMIT
          </button>
        </div>

        {/* Operational Status Log */}
        {statusMessage && (
          <div className="mt-5 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80 text-center">
            <p className="text-[11px] text-zinc-400 font-mono tracking-wide">
              {statusMessage}
            </p>
          </div>
        )}
      </div>

      {/* POPUP MODAL 1: Alert 2 Level Demotion Warning Modal */}
      {showDemotionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-red-600/80 p-6 sm:p-8 shadow-2xl text-center font-mono">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-950/60 border border-red-500 text-red-500 mb-4 animate-bounce">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-2">
              SECURITY ALERT 2!
            </h3>
            <p className="text-xs text-red-400 font-bold tracking-widest uppercase mb-4">
              LEVEL DEMOTED & COUNTERMEASURES ACTIVATED
            </p>

            <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-left text-xs text-zinc-300 space-y-2 mb-6">
              <p>
                ⚠️ <strong>PENALTY APPLIED:</strong> Your infiltration layer has been demoted by 1 level due to repeated breaches.
              </p>
              <p className="text-red-300 font-bold">
                🚨 CRITICAL WARNING: You only have 1 CHANCE LEFT before maximum lockdown and arrest!
              </p>
              <p className="text-[11px] text-zinc-400">
                (තව එක chance එකයි තියෙන්නේ! Next failure will trigger operative arrest.)
              </p>
            </div>

            <button
              onClick={() => {
                cyberAudio.playClick();
                setShowDemotionModal(false);
              }}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
            >
              RESUME INFILTRATION [CONTINUE]
            </button>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: Alert 3 Arrested / Busted Modal */}
      {isArrested && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border-2 border-red-600 p-6 sm:p-8 shadow-2xl text-center font-mono">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white mb-4 animate-pulse">
              <Siren className="w-9 h-9" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-1">
              OPERATIVE ARRESTED!
            </h2>
            <p className="text-xs text-red-500 font-bold uppercase tracking-widest mb-4">
              MAXIMUM SECURITY LOCKDOWN TRIGGERED (3/3 ALERTS)
            </p>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 space-y-2 mb-6 text-left">
              <p>
                The bank's automated defenses detected unauthorized frequency manipulation. The vault doors have engaged titanium deadbolts and syndicate signals are severed.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  cyberAudio.playClick();
                  startNewGame();
                }}
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RETRY INFILTRATION (NEW ATTEMPT)</span>
              </button>

              <button
                onClick={() => {
                  cyberAudio.playClick();
                  onExit();
                }}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all"
              >
                RETURN TO DASHBOARD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL 3: Vault Cracked (Victory Modal) */}
      {isVaultCracked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border-2 border-white p-6 sm:p-8 shadow-2xl text-center font-mono">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-black mb-4">
              <Unlock className="w-9 h-9" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-1">
              VAULT CRACKED!
            </h2>
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-4">
              MISSION ACCOMPLISHED // ALL 3 LAYERS BREACHED
            </p>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-2 mb-6 text-left">
              <p>
                Congratulations Operative <strong className="text-white">[{agent?.nick_name || 'GHOST'}]</strong>! All 3 security layers decrypted successfully.
              </p>
              <div className="p-2.5 rounded bg-black/60 border border-zinc-800 flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-400">BOUNTY REWARD:</span>
                <span className="text-white">+100 SYNDICATE CREDITS</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  cyberAudio.playClick();
                  startNewGame();
                }}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>INFILTRATE NEXT VAULT</span>
              </button>

              <button
                onClick={() => {
                  cyberAudio.playClick();
                  onExit();
                }}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all"
              >
                RETURN TO DASHBOARD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

