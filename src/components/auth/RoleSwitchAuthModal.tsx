import React, { useState, useMemo } from 'react';
import { WorkspaceMode } from '../../App';
import { AuthenticatedUser } from './AuthPortal';
import { getAccountByRole, getStoredAccounts, authenticateUser, normalizeSchoolId, DemoAccount } from '../../data/accountsData';
import { loadSuperAdminSecurityConfig } from '../security/SecurityView';
import { loadSchoolSecurityConfig } from '../../context/SchoolAdminContext';
import { verifyTotpCode } from '../../utils/totp';
import { requestServerOtp, verifyServerOtp, maskDestinationLabel } from '../../utils/otpClient';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  X,
  LogOut,
  Building2,
  Smartphone,
  Mail,
  Send
} from 'lucide-react';

interface RoleSwitchAuthModalProps {
  targetRole: WorkspaceMode;
  targetSchoolId?: string;
  currentUser: AuthenticatedUser;
  onSuccess: (newUser: AuthenticatedUser) => void;
  onCancel: () => void;
  onLogout: () => void;
}

export const RoleSwitchAuthModal: React.FC<RoleSwitchAuthModalProps> = ({
  targetRole,
  targetSchoolId,
  currentUser,
  onSuccess,
  onCancel,
  onLogout
}) => {
  const effectiveSchoolId =
    targetSchoolId ||
    (currentUser.ecoleId && currentUser.ecoleId !== 'NATIONAL' ? currentUser.ecoleId : undefined);

  const matchingAccounts = useMemo(() => {
    const all = getStoredAccounts().filter(a => a.role === targetRole);
    if (effectiveSchoolId && effectiveSchoolId !== 'NATIONAL' && effectiveSchoolId !== 'ALL') {
      const canonical = normalizeSchoolId(effectiveSchoolId);
      const scoped = all.filter(a => normalizeSchoolId(a.ecoleId) === canonical);
      if (scoped.length > 0) return scoped;
    }
    return all;
  }, [targetRole, effectiveSchoolId]);

  const defaultAccount = getAccountByRole(targetRole, effectiveSchoolId) || matchingAccounts[0];
  const [selectedAccountId, setSelectedAccountId] = useState<string>(defaultAccount?.id || '');
  const targetAccount =
    matchingAccounts.find(a => a.id === selectedAccountId) || defaultAccount;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2FA challenge step when switching to super_admin or school_admin
  const [pending2faAccount, setPending2faAccount] = useState<DemoAccount | null>(null);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'authenticator' | 'sms' | 'email'>('authenticator');
  const [totpSecret, setTotpSecret] = useState('');
  const [smsDestination, setSmsDestination] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpDispatch, setOtpDispatch] = useState<{
    challengeToken: string;
    method: 'sms' | 'email';
    maskedDestination: string;
    message: string;
    sentAt: string;
  } | null>(null);

  if (!targetAccount) {
    return null;
  }

  const completeSwitch = (acc: DemoAccount) => {
    onSuccess({
      role: acc.role,
      name: acc.name,
      email: acc.email,
      matricule: acc.matricule,
      schoolName: acc.schoolName,
      photo: acc.photo,
      ecoleId: acc.ecoleId,
      nationalUid: acc.nationalUid,
      badgeNumber: acc.badgeNumber,
      status: acc.status,
      mustChangePassword: acc.mustChangePassword
    });
  };

  const handleSend2faOtp = async (channel: 'sms' | 'email') => {
    if (!pending2faAccount) return;
    setErrorMessage(null);
    const destination =
      channel === 'email'
        ? pending2faAccount.email
        : smsDestination || pending2faAccount.phone || '+224 624 00 11 22';
    setSendingOtp(true);
    try {
      const res = await requestServerOtp({
        channel,
        destination,
        purpose: `Bascule Rôle ${pending2faAccount.role}`
      });
      if (!res.ok || !res.challengeToken) {
        setErrorMessage(res.error || "Impossible d'envoyer le code 2FA.");
        return;
      }
      setOtpDispatch({
        challengeToken: res.challengeToken,
        method: channel,
        maskedDestination: res.maskedDestination || maskDestinationLabel(channel, destination),
        message: res.message || 'Code envoyé.',
        sentAt: res.sentAt || new Date().toLocaleTimeString('fr-FR')
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (pending2faAccount) {
      const clean = twoFactorCode.trim();
      if (!/^\d{6}$/.test(clean)) {
        setErrorMessage('Veuillez saisir un code 2FA à 6 chiffres.');
        return;
      }
      setIsLoading(true);
      try {
        let ok = false;
        let verifyErr: string | undefined;
        if (twoFactorMethod === 'authenticator') {
          ok = await verifyTotpCode(totpSecret, clean, 1);
          if (!ok && otpDispatch?.challengeToken) {
            const res = await verifyServerOtp({ challengeToken: otpDispatch.challengeToken, code: clean });
            ok = res.ok;
            verifyErr = res.error;
          }
        } else if (otpDispatch?.challengeToken) {
          const res = await verifyServerOtp({ challengeToken: otpDispatch.challengeToken, code: clean });
          ok = res.ok;
          verifyErr = res.error;
        }
        if (!ok) {
          setErrorMessage(
            verifyErr ||
              (twoFactorMethod === 'authenticator'
                ? 'Code 2FA Authenticator incorrect ou expiré.'
                : 'Code OTP incorrect. Cliquez d’abord sur « Recevoir code par SMS / Email ».')
          );
          return;
        }
        completeSwitch(pending2faAccount);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Strict multi-school isolation check (canonical IDs normalized):
    if (
      effectiveSchoolId &&
      currentUser.ecoleId &&
      currentUser.ecoleId !== 'NATIONAL' &&
      normalizeSchoolId(effectiveSchoolId) !== normalizeSchoolId(currentUser.ecoleId) &&
      currentUser.role !== 'super_admin'
    ) {
      setErrorMessage(
        "Accès refusé. Isolation stricte : Vous n'avez pas l'autorisation d'accéder à l'établissement d'un autre administrateur."
      );
      return;
    }

    const auth = authenticateUser(targetAccount.email, password, effectiveSchoolId || 'ALL');
    if (!auth.success || !auth.user) {
      setErrorMessage(
        auth.errorMessage ||
          'Mot de passe incorrect pour ce compte. Veuillez saisir le mot de passe officiel assigné à ce rôle.'
      );
      return;
    }

    if (auth.user.role === 'super_admin') {
      const superCfg = loadSuperAdminSecurityConfig();
      if (superCfg.twoFactorEnabled) {
        setTwoFactorMethod(superCfg.twoFactorMethod);
        setTotpSecret(superCfg.totpSecret);
        setSmsDestination(superCfg.twoFactorPhone || auth.user.phone || '+224 624 00 11 22');
        setTwoFactorCode('');
        setOtpDispatch(null);
        setPending2faAccount(auth.user);
        return;
      }
    }

    if (auth.user.role === 'school_admin') {
      const schoolCfg = loadSchoolSecurityConfig(auth.user.ecoleId || effectiveSchoolId);
      if (schoolCfg.twoFactorEnabled) {
        setTwoFactorMethod(schoolCfg.twoFactorMethod);
        setTotpSecret(schoolCfg.totpSecret);
        setSmsDestination(auth.user.phone || '+224 622 00 00 00');
        setTwoFactorCode('');
        setOtpDispatch(null);
        setPending2faAccount(auth.user);
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      completeSwitch(auth.user!);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl bg-white border border-blue-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-blue-100 bg-blue-50/70 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-blue-950 flex flex-wrap items-center gap-1.5">
                <span className="truncate">
                  {pending2faAccount ? 'Double Facteur 2FA Requis' : 'Authentification Obligatoire'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 shrink-0">
                  Accès Restreint
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 truncate">
                {pending2faAccount
                  ? 'Validation 2FA obligatoire pour ce compte administrateur'
                  : "Confirmation d'identité requise pour basculer de rôle"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-950 hover:bg-blue-100 transition-colors shrink-0"
            title="Annuler et rester sur ma session"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleVerify} className="flex-1 flex flex-col min-h-0 text-xs">
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
            {/* Security Notice */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-slate-700 space-y-1">
              <div className="font-bold text-amber-900 text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Cloisonnement Strict des Données Scolaires</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Pour empêcher toute intrusion non autorisée, chaque changement d'espace exige la vérification complète d'identité (et 2FA pour les administrateurs).
              </p>
            </div>

            {!pending2faAccount && matchingAccounts.length > 1 && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Sélectionner le compte ({matchingAccounts.length} comptes disponibles)
                </label>
                <select
                  value={targetAccount.id}
                  onChange={e => {
                    setSelectedAccountId(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-blue-950 font-semibold focus:outline-hidden focus:border-blue-600"
                >
                  {matchingAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} · {acc.matricule} ({acc.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Target Account Badge */}
            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2.5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center justify-between gap-2">
                <span>Compte cible demandé :</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${targetAccount.badgeColor}`}>
                  {targetAccount.matricule}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={targetAccount.photo}
                  alt={targetAccount.name}
                  className="w-10 h-10 rounded-full object-cover border border-blue-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-blue-950 text-xs truncate">
                    {targetAccount.name}
                  </div>
                  <div className="text-[11px] text-blue-700 font-semibold truncate">
                    {targetAccount.title}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{targetAccount.schoolName}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-slate-600">
                <div className="truncate">
                  <span className="text-slate-400">Email : </span>
                  <span className="text-slate-800 font-mono">{targetAccount.email}</span>
                </div>
                <div className="truncate">
                  <span className="text-slate-400">Délivré par : </span>
                  <span className="text-slate-800">{targetAccount.provisionedBy}</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="text-[11px] leading-tight">{errorMessage}</span>
              </div>
            )}

            {!pending2faAccount ? (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Mot de passe officiel du compte cible *
                </label>

                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Saisissez le mot de passe officiel..."
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-blue-950 block">
                    Code 2FA à 6 chiffres ({twoFactorMethod === 'authenticator' ? 'Authenticator TOTP' : twoFactorMethod.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    required
                    value={twoFactorCode}
                    onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-blue-200 text-blue-950 font-mono text-center text-lg font-black tracking-[0.35em]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={sendingOtp}
                    onClick={() => { void handleSend2faOtp('sms'); }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-100 border border-blue-200 text-blue-700 font-semibold text-[11px] cursor-pointer"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>{sendingOtp ? 'Envoi...' : `OTP SMS (${maskDestinationLabel('sms', smsDestination)})`}</span>
                  </button>
                  <button
                    type="button"
                    disabled={sendingOtp}
                    onClick={() => { void handleSend2faOtp('email'); }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold text-[11px] cursor-pointer"
                  >
                    <Mail className="w-3 h-3" />
                    <span>OTP Email</span>
                  </button>
                </div>

                {otpDispatch && (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 space-y-0.5">
                    <div className="flex items-center gap-1 font-semibold">
                      <Send className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{otpDispatch.method.toUpperCase()} → {otpDispatch.maskedDestination} ({otpDispatch.sentAt})</span>
                    </div>
                    <div className="text-[10px] text-emerald-700">{otpDispatch.message}</div>
                  </div>
                )}
              </div>
            )}

            <div className="text-[10px] text-slate-500 text-center">
              Session actuelle active : <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role})
            </div>
          </div>

          {/* Modal Footer with Strict Choices */}
          <div className="px-4 sm:px-5 py-3 border-t border-blue-100 bg-blue-50/50 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onLogout}
              className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1.5 text-[11px] text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-3 h-3 text-slate-400" />
              <span>Quitter et se déconnecter</span>
            </button>

            <div className="w-full sm:w-auto flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading || (!pending2faAccount ? !password : twoFactorCode.length !== 6)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{pending2faAccount ? 'Confirmer 2FA & Basculer' : 'Valider & Basculer'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
