import React, { useState } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { ShieldAlert, KeyRound, X, AlertTriangle } from 'lucide-react';

export const PinVerificationModal: React.FC = () => {
  const { 
    pinModalOpen, 
    setPinModalOpen, 
    pendingPinAction, 
    verifyAndExecutePin, 
    failedPinAttempts, 
    isTemporarilyBlocked 
  } = useSchoolAdmin();

  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!pinModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) {
      setErrorMsg("Le code PIN doit comporter exactement 6 chiffres.");
      return;
    }

    const success = verifyAndExecutePin(pin);
    if (!success) {
      setErrorMsg(`Code PIN incorrect. Tentative ${failedPinAttempts + 1}/5.`);
      setPin('');
    } else {
      setPin('');
      setErrorMsg(null);
    }
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + digit);
      setErrorMsg(null);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-2xl bg-white border border-amber-200 shadow-2xl p-6 text-center max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <button
          onClick={() => {
            setPinModalOpen(false);
            setPin('');
            setErrorMsg(null);
          }}
          className="absolute top-4 right-4 text-slate-500 hover:text-blue-950"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center mb-3">
          <KeyRound className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-blue-950">
          Code PIN Administrateur Requis
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          {pendingPinAction?.description || "Cette opération est hautement sensible et nécessite une confirmation de sécurité."}
        </p>

        {isTemporarilyBlocked ? (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Compte temporairement bloqué suite à 5 tentatives erronées. Réessayez dans 5 minutes.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* PIN Dots Display */}
            <div className="flex items-center justify-center gap-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={`w-9 h-11 rounded-lg border flex items-center justify-center text-lg font-mono font-bold transition-all ${
                    pin.length > index
                      ? 'border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  {pin.length > index ? '•' : ''}
                </div>
              ))}
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium animate-in fade-in">
                {errorMsg}
              </p>
            )}

            {/* Quick Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => {
                    if (btn === 'C') setPin('');
                    else if (btn === '⌫') handleBackspace();
                    else handleDigitClick(btn);
                  }}
                  className="h-10 rounded-lg bg-slate-50 hover:bg-blue-100 border border-slate-200 text-blue-950 font-mono text-sm font-semibold active:scale-95 transition-transform"
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 font-mono pt-1">
              Code PIN par défaut : <span className="text-amber-700">123456</span>
            </div>

            <button
              type="submit"
              disabled={pin.length !== 6}
              className="w-full py-2.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 transition-colors shadow-md"
            >
              Valider l'Opération
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
