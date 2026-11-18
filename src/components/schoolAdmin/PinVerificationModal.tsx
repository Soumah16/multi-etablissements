import React, { useState } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { KeyRound, X, AlertTriangle } from 'lucide-react';

export const PinVerificationModal: React.FC = () => {
  const { 
    pinModalOpen, 
    setPinModalOpen, 
    pendingPinAction, 
    verifyAndExecutePin, 
    isTemporarilyBlocked
  } = useSchoolAdmin();

  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  if (!pinModalOpen) return null;

  const handleClose = () => {
    setPinModalOpen(false);
    setPin('');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) {
      setErrorMsg("Le code PIN doit comporter exactement 6 chiffres.");
      return;
    }

    setVerifying(true);
    setErrorMsg(null);
    try {
      const res = await verifyAndExecutePin(pin);
      if (!res.ok) {
        setErrorMsg(res.error || 'Vérification refusée.');
        setPin('');
      } else {
        setPin('');
        setErrorMsg(null);
      }
    } finally {
      setVerifying(false);
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
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-amber-200 shadow-2xl p-6 text-center max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-blue-950 cursor-pointer"
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
          {pendingPinAction?.description || "Cette opération est hautement sensible et nécessite une confirmation par code PIN."}
        </p>

        {isTemporarilyBlocked ? (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Compte temporairement bloqué suite à 5 tentatives erronées. Réessayez dans 5 minutes.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* PIN Dots Display */}
            <div className="flex items-center justify-center gap-2.5">
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

            {/* Quick Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => {
                    if (btn === 'C') setPin('');
                    else if (btn === '⌫') handleBackspace();
                    else handleDigitClick(btn);
                  }}
                  className="h-9 rounded-lg bg-slate-50 hover:bg-blue-100 border border-slate-200 text-blue-950 font-mono text-sm font-semibold active:scale-95 transition-transform cursor-pointer"
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Code PIN par défaut : <span className="text-amber-700 font-bold">123456</span>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium animate-in fade-in">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={verifying || pin.length !== 6}
              className="w-full py-2.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 transition-colors shadow-md cursor-pointer"
            >
              {verifying ? 'Vérification...' : "Valider l'Opération"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
