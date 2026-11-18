import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  X,
  HelpCircle,
  Send,
  Smartphone,
  Mail,
  Settings
} from 'lucide-react';

export const DirectorPinModal: React.FC = () => {
  const {
    pinModalOpen,
    currentPinPrompt,
    closePinModal,
    submitPinVerification,
    profile,
    sendVerificationOtp,
    lastSentOtpInfo,
    setActiveDirectorTab
  } = useDirector();

  const [enteredPin, setEnteredPin] = useState('');
  const [entered2FA, setEntered2FA] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);

  if (!pinModalOpen || !currentPinPrompt) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (enteredPin.length !== 6) {
      setError('Veuillez saisir votre code PIN Directeur à 6 chiffres.');
      return;
    }

    if (entered2FA.length !== 6) {
      setError('Veuillez saisir le code de vérification 2FA à 6 chiffres.');
      return;
    }

    setVerifying(true);
    try {
      const result = await submitPinVerification(enteredPin, entered2FA);
      if (!result.ok) {
        setError(result.error || 'Échec de la validation de sécurité. Vérifiez vos codes.');
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setEnteredPin('');
          setEntered2FA('');
        }, 400);
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleGoToSecuritySetup = () => {
    closePinModal();
    setActiveDirectorTab('security');
  };

  const handleSendOtp = async (channel: 'sms' | 'email') => {
    setError(null);
    await sendVerificationOtp(channel);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-amber-200 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-50 via-blue-50/40 to-amber-50 p-5 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <span>Vérification de Sécurité</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-mono">
                  PIN + 2FA
                </span>
              </h3>
              <p className="text-xs text-slate-500">Signature cryptographique du Directeur des Études</p>
            </div>
          </div>
          <button
            onClick={closePinModal}
            className="p-1.5 text-slate-500 hover:text-blue-950 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
            <p className="font-semibold text-amber-800 mb-1">{currentPinPrompt.title}</p>
            <p className="text-[11px] text-slate-700">{currentPinPrompt.description}</p>
          </div>

          {/* Clear "Who gives these codes?" guidance */}
          <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-[11px] text-slate-700 space-y-1.5 leading-relaxed">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-blue-950 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Qui fournit ces 2 codes ?</span>
              </span>
              <button
                type="button"
                onClick={handleGoToSecuritySetup}
                className="text-[10px] font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Settings className="w-3 h-3" />
                <span>Configurer / Voir QR</span>
              </button>
            </div>
            <p>
              <strong>1. PIN Directeur :</strong> Défini par le Directeur dans <em>Sécurité &amp; Code PIN</em> (initial par défaut : <code className="px-1 py-0.5 rounded bg-white border border-blue-200 font-mono font-bold text-amber-800">654321</code>).
            </p>
            <p>
              <strong>2. Code 2FA Authenticator :</strong> Généré par votre application <strong>Google / Microsoft Authenticator</strong> (QR Code dans <em>Sécurité &amp; Code PIN</em>) ou envoyé par SMS / Email ci-dessous.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Autorisation accordée ! Signature électronique en cours...</span>
            </div>
          )}

          {/* 6-Digit PIN Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                Code PIN Directeur (6 chiffres)
              </span>
              <span className="text-[10px] text-slate-500">Personnel Direction</span>
            </label>
            <input
              type="password"
              maxLength={6}
              value={enteredPin}
              onChange={e => setEnteredPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              className="w-full text-center tracking-[0.5em] text-lg font-mono px-4 py-2.5 rounded-lg bg-blue-50/60 border border-slate-200 text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-amber-500 transition-colors"
              autoFocus
            />
          </div>

          {/* 2FA Code Field */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                Code 2FA (
                {profile.twoFactorMethod === 'app'
                  ? 'Application Authenticator TOTP'
                  : profile.twoFactorMethod === 'sms'
                  ? 'SMS Téléphone'
                  : 'Email Institutionnel'}
                )
              </span>
            </label>
            <input
              type="text"
              maxLength={6}
              value={entered2FA}
              onChange={e => setEntered2FA(e.target.value.replace(/\D/g, ''))}
              placeholder="Code à 6 chiffres"
              className="w-full text-center tracking-[0.3em] text-base font-mono px-4 py-2.5 rounded-lg bg-blue-50/60 border border-slate-200 text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 transition-colors"
            />

            {/* Dispatch SMS / Email OTP option */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleSendOtp('sms')}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                <Smartphone className="w-3 h-3" />
                <span>Recevoir code par SMS</span>
              </button>
              <button
                type="button"
                onClick={() => handleSendOtp('email')}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                <Mail className="w-3 h-3" />
                <span>Recevoir par Email</span>
              </button>
            </div>

            {lastSentOtpInfo && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Envoyé ({lastSentOtpInfo.method.toUpperCase()}) à{' '}
                    <strong>{lastSentOtpInfo.maskedDestination}</strong> ({lastSentOtpInfo.sentAt})
                  </span>
                </div>
                <div className="text-[10px] text-emerald-700">{lastSentOtpInfo.message}</div>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closePinModal}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={verifying}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{verifying ? 'Vérification...' : 'Valider & Signer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
