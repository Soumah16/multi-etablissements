import React, { useState } from 'react';
import { useAccountant } from '../../context/AccountantContext';
import { ShieldAlert, KeyRound, X, CheckCircle2 } from 'lucide-react';

export const AccountantPinModal: React.FC = () => {
  const { 
    pinModalOpen, 
    setPinModalOpen, 
    pinActionPending, 
    verifyPinAndExecute, 
    triggerToast 
  } = useAccountant();

  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!pinModalOpen) return null;

  const handleDigit = (digit: string) => {
    if (enteredPin.length < 6) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      setErrorMsg(null);
      if (nextPin.length === 6) {
        submitPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const submitPin = (pinToVerify: string) => {
    const success = verifyPinAndExecute(pinToVerify);
    if (!success) {
      setErrorMsg('Code PIN incorrect. Veuillez réessayer (Défaut : 123456).');
      setEnteredPin('');
    } else {
      triggerToast('Opération financière validée par PIN avec succès.');
      setEnteredPin('');
      setErrorMsg(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border-2 border-amber-500/50 p-6 shadow-2xl space-y-5 text-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-sm">Autorisation Sécurisée Requise</h3>
          </div>
          <button 
            onClick={() => {
              setPinModalOpen(false);
              setEnteredPin('');
              setErrorMsg(null);
            }} 
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center space-y-1">
          <p className="text-xs text-slate-300">
            Opération sensible : <strong className="text-amber-300">{pinActionPending?.title || 'Validation financière'}</strong>
          </p>
          <p className="text-[11px] text-slate-400">
            Veuillez saisir votre code PIN comptable à 6 chiffres pour valider cette opération.
          </p>
        </div>

        {/* PIN Dots Display */}
        <div className="flex justify-center items-center gap-3 py-2">
          {[0, 1, 2, 3, 4, 5].map(idx => (
            <div 
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                idx < enteredPin.length 
                  ? 'bg-amber-400 scale-110 shadow-sm shadow-amber-400/50' 
                  : 'bg-slate-800 border border-slate-700'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs text-center font-medium animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
            <button
              key={d}
              type="button"
              onClick={() => handleDigit(d)}
              className="w-16 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-lg transition-colors flex items-center justify-center border border-slate-700 active:scale-95"
            >
              {d}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setEnteredPin('');
              setErrorMsg(null);
            }}
            className="w-16 h-12 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center border border-slate-800"
          >
            Effacer
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="w-16 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-lg transition-colors flex items-center justify-center border border-slate-700 active:scale-95"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="w-16 h-12 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white text-sm font-semibold transition-colors flex items-center justify-center border border-slate-800"
          >
            ⌫
          </button>
        </div>

        <div className="text-center text-[10px] text-slate-500 pt-1">
          Code PIN par défaut : <strong className="text-slate-400 font-mono">123456</strong>
        </div>
      </div>
    </div>
  );
};
