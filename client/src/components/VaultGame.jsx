import React, { useState, useEffect, useRef } from 'react';
import { 
  Key, 
  RotateCcw, 
  ArrowLeft, 
  AlertTriangle, 
  Unlock, 
  Siren, 
  Timer as TimerIcon,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { cyberAudio } from '../utils/audio';

/**
 * Event-Driven Vault Game Component
 * Powered by Marc Conrad's Banana REST API (Module 2: Interoperability)
 * Features:
 * - Live Visual Banana Cipher Image from external Banana REST API
 * - 3 Progressive security levels to crack the vault
 * - 60-second countdown timer per puzzle (pauses on modal)
 * - 3-Alert Security Strike System:
 *     Alert 1: Warning + new Banana puzzle + 60s reset
 *     Alert 2: Level demotion (-1 level) + Warning Modal (1 chance left!) + 60s reset
 *     Alert 3: Maximum breach -> Operative Arrested
 */
export default function VaultGame({ agent, onExit }) {
  // Game states
  const [level, setLevel] = useState(1);
  const [alertCount, setAlertCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [enteredCode, setEnteredCode] = useState('');
  const [puzzleImage, setPuzzleImage] = useState('');
  const [internalSolution, setInternalSolution] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  
  // Status and modal states
  const [loading, setLoading] = useState(true);
  const [showDemotionModal, setShowDemotionModal] = useState(false);
  const [isArrested, setIsArrested] = useState(false);
  const [isVaultCracked, setIsVaultCracked] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const timerRef = useRef(null);

  // Viva comment: Fetch a live puzzle image from backend or directly from Banana REST API
  const fetchNewBananaPuzzle = async () => {
    setImageLoading(true);
    setShowHint(false);

    try {
      // Direct call to Marc Conrad Banana API (with full CORS support)
      const res = await fetch('https://marcconrad.com/uob/banana/api.php?out=json');
      if (res.ok) {
        const data = await res.json();
        return {
          imageUrl: data.question,
          solution: String(data.solution)
        };
      }
    } catch (e) {
      console.warn('Direct Banana API call failed, trying backend proxy:', e);
    }

    try {
      // Backend API proxy fallback
      const res = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent?.id || 9999 })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.puzzle) {
          return {
            imageUrl: data.puzzle.imageUrl,
            solution: String(data._internalSolution)
          };
        }
      }
    } catch (e) {
      console.warn('Backend proxy failed, using offline fallback:', e);
    }

    // Offline failsafe puzzle
    return {
      imageUrl: 'https://www.sanfoh.com/uob/banana/data/te3ddfde2fa63216d10fb60d0edn90.png',
      solution: '0'
    };
  };

  // Viva comment: Initialize new game mission on start
  const startNewGame = async () => {
    setLoading(true);
    setIsArrested(false);
    setIsVaultCracked(false);
    setShowDemotionModal(false);
    setEnteredCode('');
    setAlertCount(0);
    setLevel(1);
    setTimeLeft(60);
    setStatusMessage('INFILTRATION ONLINE. ENTER DECRYPTION CODE.');

    const puzzle = await fetchNewBananaPuzzle();
    setPuzzleImage(puzzle.imageUrl);
    setInternalSolution(puzzle.solution);
    setImageLoading(false);
    setLoading(false);
  };

  // Start on mount
  useEffect(() => {
    startNewGame();
    return () => clearInterval(timerRef.current);
  }, []);

  // Viva comment: 60-second countdown timer. Pauses when any modal is open!
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

  // Viva comment: 60s Timer expired without answer -> triggers alert strike
  const handleTimeout = () => {
    if (cyberAudio?.playAlert) cyberAudio.playAlert();
    processAnswer('TIMEOUT');
  };

  // Viva comment: Virtual keypad click - single digit input (0-9)
  const handleKeyClick = (digit) => {
    if (!isArrested && !isVaultCracked && !showDemotionModal) {
      if (cyberAudio?.playClick) cyberAudio.playClick();
      setEnteredCode(String(digit)); // Direct single digit entry
    }
  };

  // Viva comment: Clear entered digit
  const handleClear = () => {
    if (cyberAudio?.playClick) cyberAudio.playClick();
    setEnteredCode('');
  };

  // Viva comment: Core Game Engine - evaluates answer and triggers level up, alerts, demotion or arrest
  const processAnswer = async (forcedValue = null) => {
    const valueToCheck = forcedValue !== null ? forcedValue : enteredCode;
    if (!valueToCheck && forcedValue === null) return;

    const isCorrect = String(valueToCheck).trim() === String(internalSolution).trim();
    setEnteredCode('');

    // Case 1: Operative Solved Correctly!
    if (isCorrect) {
      if (cyberAudio?.playSuccess) cyberAudio.playSuccess();

      if (level === 1) {
        // Advance to Level 2
        setLevel(2);
        setTimeLeft(60);
        setStatusMessage('LAYER 1 DECRYPTED! ADVANCING TO LAYER 2.');
        const nextPuzzle = await fetchNewBananaPuzzle();
        setPuzzleImage(nextPuzzle.imageUrl);
        setInternalSolution(nextPuzzle.solution);
        setImageLoading(false);
      } else if (level === 2) {
        // Advance to Level 3
        setLevel(3);
        setTimeLeft(60);
        setStatusMessage('LAYER 2 DECRYPTED! ADVANCING TO FINAL LAYER 3.');
        const nextPuzzle = await fetchNewBananaPuzzle();
        setPuzzleImage(nextPuzzle.imageUrl);
        setInternalSolution(nextPuzzle.solution);
        setImageLoading(false);
      } else {
        // Level 3 Solved -> Vault Cracked!
        setIsVaultCracked(true);
        setStatusMessage('ALL 3 LAYERS BREACHED! VAULT CRACKED!');
      }

      // Notify backend API
      fetch('/api/game/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: valueToCheck,
          expectedSolution: internalSolution,
          currentLevel: level,
          alertCount: alertCount,
          agentId: agent?.id || 9999
        })
      }).catch(() => {});

      return;
    }

    // Case 2: Wrong Answer or 60s Timeout (Alert Strike System)
    if (cyberAudio?.playAlert) cyberAudio.playAlert();
    const newAlertCount = alertCount + 1;
    setAlertCount(newAlertCount); // Updates [ALERT 1], [ALERT 2], [ALERT 3] indicators immediately!

    if (newAlertCount === 1) {
      // Alert 1: First Strike Warning
      setTimeLeft(60);
      setStatusMessage('SECURITY ALERT 1/3 TRIGGERED! CIPHER MISMATCH.');
      const nextPuzzle = await fetchNewBananaPuzzle();
      setPuzzleImage(nextPuzzle.imageUrl);
      setInternalSolution(nextPuzzle.solution);
      setImageLoading(false);
    } else if (newAlertCount === 2) {
      // Alert 2: Second Strike - Level Demoted & Popup Warning Modal!
      const newLvl = level > 1 ? level - 1 : 1;
      setLevel(newLvl); // Demotes level if level was 2 or 3!
      setTimeLeft(60);
      setShowDemotionModal(true); // Popup modal
      setStatusMessage(
        level > 1 
          ? `SECURITY ALERT 2/3! LEVEL DEMOTED TO LAYER ${newLvl}!`
          : 'SECURITY ALERT 2/3! 1 CHANCE LEFT BEFORE ARREST!'
      );
      const nextPuzzle = await fetchNewBananaPuzzle();
      setPuzzleImage(nextPuzzle.imageUrl);
      setInternalSolution(nextPuzzle.solution);
      setImageLoading(false);
    } else {
      // Alert 3: Third Strike - Maximum Security Lockdown & Operative Arrested!
      setIsArrested(true);
      setStatusMessage('SECURITY LOCKDOWN! OPERATIVE ARRESTED (3/3 ALERTS)!');
    }

    // Notify backend API
    fetch('/api/game/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answer: valueToCheck,
        expectedSolution: internalSolution,
        currentLevel: level,
        alertCount: newAlertCount,
        agentId: agent?.id || 9999
      })
    }).catch(() => {});
  };

  // Keyboard listener for typing 0-9, Backspace, and Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showDemotionModal || isArrested || isVaultCracked) return;
      if (e.key >= '0' && e.key <= '9') {
        handleKeyClick(e.key);
      } else if (e.key === 'Backspace') {
        handleClear();
      } else if (e.key === 'Enter') {
        processAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enteredCode, internalSolution, level, alertCount, showDemotionModal, isArrested, isVaultCracked]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 font-mono animate-fadeIn py-2">
      {/* Top Header: Return Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (cyberAudio?.playClick) cyberAudio.playClick();
            onExit();
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO DASHBOARD</span>
        </button>
      </div>

      {/* Status Bar: Level, Countdown Timer (60s), Security Strikes (Alerts 1-3) */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Layer Level */}
        <div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">
            SECURITY LAYER
          </span>
          <span className="text-xl sm:text-2xl font-black text-white tracking-wider">
            LEVEL {level} <span className="text-zinc-600 text-sm font-normal">/ 3</span>
          </span>
        </div>

        {/* 60s Countdown Timer */}
        <div className="text-center sm:text-right">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold flex items-center justify-center sm:justify-end gap-1">
            <TimerIcon className="w-3 h-3 text-zinc-400" /> TIME REMAINING
          </span>
          <span className={`text-xl sm:text-2xl font-black tracking-widest ${
            timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'
          }`}>
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
          </span>
        </div>

        {/* 3-Alert Security Strikes (Alert 1, Alert 2, Alert 3) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Siren className={`w-4 h-4 ${alertCount > 0 ? 'text-red-500 animate-bounce' : 'text-zinc-600'}`} />
            STRIKES:
          </span>
          {[1, 2, 3].map((strike) => (
            <div
              key={strike}
              className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all duration-300 border ${
                alertCount >= strike
                  ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.7)] scale-105'
                  : 'bg-zinc-900 text-zinc-600 border-zinc-800'
              }`}
            >
              ALERT {strike}
            </div>
          ))}
        </div>
      </div>

      {/* Main Game Interface: 2-Column Clean Heist Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols): Clean Banana API Visual Puzzle Image */}
        <div className="lg:col-span-7 rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Screen Header with Discrete Intel Hint Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                LAYER {level} CIPHER DECRYPTION
              </span>

              {/* Discrete Hint Button */}
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-400 hover:text-white transition-all font-mono"
                title="Toggle Decryption Clue"
              >
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                <span>{showHint ? `HINT: [ ${internalSolution} ]` : 'CIPHER HINT'}</span>
              </button>
            </div>

            {/* Visual Puzzle Image Display */}
            <div className="relative rounded-xl bg-white p-3 min-h-[230px] flex items-center justify-center overflow-hidden shadow-inner">
              {imageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white z-10 text-zinc-600">
                  <Loader2 className="w-8 h-8 animate-spin text-zinc-700" />
                  <span className="text-xs font-mono font-bold">FETCHING CIPHER...</span>
                </div>
              )}
              {puzzleImage ? (
                <img
                  src={puzzleImage}
                  alt="Banana Cipher Puzzle"
                  className={`max-h-[260px] w-auto object-contain mx-auto transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              ) : (
                <div className="text-xs text-zinc-500 font-mono">NO CIPHER RECEIVED</div>
              )}
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="mt-4 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-center">
              <p className="text-[11px] text-zinc-400 font-mono tracking-wide">
                {statusMessage}
              </p>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): CIPHER TERMINAL (KEYPAD) */}
        <div className="lg:col-span-5 rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Terminal Header */}
            <div className="text-center pb-3 border-b border-zinc-800/80 mb-4">
              <span className="text-xs font-black text-white uppercase tracking-wider">
                CIPHER TERMINAL
              </span>
            </div>

            {/* Input Display Screen */}
            <div className="w-full h-14 rounded-xl bg-black border border-zinc-800 flex items-center justify-center mb-4 shadow-inner">
              <span className="text-3xl font-black tracking-widest text-white">
                {enteredCode || <span className="text-zinc-700">_</span>}
              </span>
            </div>

            {/* Interactive Keypad (1-9, CLEAR, 0, DECRYPT) */}
            <div className="grid grid-cols-3 gap-2">
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

              {/* Submit / Decrypt Key */}
              <button
                type="button"
                onClick={() => processAnswer()}
                disabled={!enteredCode}
                className="h-12 rounded-xl bg-white hover:bg-zinc-200 active:bg-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed text-black font-black text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center shadow-md"
              >
                DECRYPT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL 1: Clean & Minimal Alert 2 Demotion Warning Modal */}
      {showDemotionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-2xl bg-zinc-950 border border-red-500/80 p-6 sm:p-7 shadow-2xl text-center font-mono">
            {/* Minimal Alert Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-950/60 border border-red-500/80 text-red-500 mb-4 animate-bounce">
              <AlertTriangle className="w-7 h-7" />
            </div>

            {/* Clear, Minimal Header */}
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">
              SECURITY ALERT 2
            </h3>
            <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-4">
              LEVEL DEMOTED
            </p>

            {/* Clean 1-Line Warning Box (No verbose paragraphs, English only) */}
            <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-900/50 text-xs text-red-300 font-bold mb-5">
              1 CHANCE REMAINING BEFORE ARREST
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                if (cyberAudio?.playClick) cyberAudio.playClick();
                setShowDemotionModal(false);
              }}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: Clean & Minimal Alert 3 Arrested Modal */}
      {isArrested && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-2xl bg-zinc-950 border-2 border-red-600 p-6 sm:p-7 shadow-2xl text-center font-mono">
            {/* Siren Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-600 text-white mb-4 animate-pulse">
              <Siren className="w-7 h-7" />
            </div>

            {/* Minimal Header */}
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-1">
              OPERATIVE ARRESTED
            </h2>
            <p className="text-xs text-red-500 font-bold uppercase tracking-wider mb-5">
              MAXIMUM SECURITY LOCKDOWN (3/3 ALERTS)
            </p>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  if (cyberAudio?.playClick) cyberAudio.playClick();
                  startNewGame();
                }}
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>TRY AGAIN</span>
              </button>

              <button
                onClick={() => {
                  if (cyberAudio?.playClick) cyberAudio.playClick();
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

      {/* POPUP MODAL 3: Clean & Minimal Vault Cracked (Victory Modal) */}
      {isVaultCracked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-2xl bg-zinc-950 border-2 border-white p-6 sm:p-7 shadow-2xl text-center font-mono">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-black mb-4">
              <Unlock className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-1">
              VAULT CRACKED
            </h2>
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-5">
              MISSION ACCOMPLISHED // ACCESS GRANTED
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  if (cyberAudio?.playClick) cyberAudio.playClick();
                  startNewGame();
                }}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>NEXT HEIST</span>
              </button>

              <button
                onClick={() => {
                  if (cyberAudio?.playClick) cyberAudio.playClick();
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
