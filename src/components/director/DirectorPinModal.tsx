import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { ShieldCheck, Lock, KeyRound, AlertCircle, CheckCircle2, X } from 'lucide-react';

export const DirectorPinModal: React.FC = () => {
  const { 
    pinModalOpen, 
    currentPinPrompt, 
    closePinModal, 
    submitPinVerification,
    directorPin,
    profile 
  } = useDirector();

  const [enteredPin, setEnteredPin] = useState('');
  const [entered2FA, setEntered2FA] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!pinModalOpen || !currentPinPrompt) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (enteredPin.length !== 6) {
      setError('Veuillez saisir votre code PIN à 6 chiffres.');
      return;
    }

    if (enteredPin !== directorPin) {
      setError('Code PIN incorrect. Veuillez réessayer.');
      return;
    }

    if (!entered2FA || entered2FA.length < 4) {
      setError('Veuillez saisir le code de vérification 2FA reçu.');
      return;
    }

    const ok = submitPinVerification(enteredPin, entered2FA);
    if (!ok) {
      setError('Échec de la validation de sécurité. Vérifiez vos identifiants.');
    } else {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEnteredPin('');
        setEntered2FA('');
      }, 500);
    }
  };

  const handleFillDemoCode = () => {
    setEnteredPin(directorPin);
    setEntered2FA('849201');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600/20 via-slate-900 to-amber-600/10 p-5 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Vérification de Sécurité</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                  PIN + 2FA
                </span>
              </h3>
              <p className="text-xs text-slate-400">Action sensible du Directeur Pédagogique</p>
            </div>
          </div>
          <button
            onClick={closePinModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
            <p className="font-semibold text-amber-300 mb-1">{currentPinPrompt.title}</p>
            <p className="text-[11px] text-slate-300">{currentPinPrompt.description}</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Autorisation accordée ! Exécution en cours...</span>
            </div>
          )}

          {/* 6-Digit PIN Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Code PIN Directeur (6 chiffres)
              </span>
              <button
                type="button"
                onClick={handleFillDemoCode}
                className="text-[10px] text-amber-400 hover:text-amber-300 underline"
              >
                Auto-remplir démo ({directorPin})
              </button>
            </label>
            <input
              type="password"
              maxLength={6}
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              className="w-full text-center tracking-[0.5em] text-lg font-mono px-4 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition-colors"
              autoFocus
            />
          </div>

          {/* 2FA Code Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                Code 2FA Authenticator ({profile.twoFactorMethod === 'app' ? 'Application TOTP' : 'SMS'})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Ex: 849201</span>
            </label>
            <input
              type="text"
              maxLength={6}
              value={entered2FA}
              onChange={(e) => setEntered2FA(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center tracking-[0.3em] text-base font-mono px-4 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closePinModal}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Valider & Signer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
