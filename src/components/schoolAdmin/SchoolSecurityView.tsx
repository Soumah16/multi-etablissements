import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useSchoolAdmin, School2FAMethod } from '../../context/SchoolAdminContext';
import { buildOtpAuthUri, generateTotpCode } from '../../utils/totp';
import { 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle2, 
  Laptop,
  Copy,
  RefreshCw,
  Send,
  Mail,
  AlertCircle
} from 'lucide-react';

export const SchoolSecurityView: React.FC = () => {
  const { 
    schoolLogs, 
    updateAdminPin, 
    failedPinAttempts, 
    isTemporarilyBlocked, 
    currentSchool,
    twoFactorEnabled,
    twoFactorMethod,
    totpSecret,
    last2faVerifiedAt,
    lastSentOtp,
    toggleTwoFactor,
    setTwoFactorMethod,
    regenerateTotpSecret,
    sendSchool2faOtp,
    verifySchool2faCode
  } = useSchoolAdmin();

  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Live TOTP QR Code & 6-digit timer
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [liveTotpCode, setLiveTotpCode] = useState<string>('------');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(30);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Interactive 2FA verification test state
  const [testCode, setTestCode] = useState('');
  const [testing2fa, setTesting2fa] = useState(false);
  const [verifyFeedback, setVerifyFeedback] = useState<{ text: string; error: boolean } | null>(null);

  useEffect(() => {
    const label = `${currentSchool.email || currentSchool.code} (Admin École)`;
    const uri = buildOtpAuthUri(totpSecret, label, `SmartSchool ${currentSchool.code || 'ERP'}`);
    QRCode.toDataURL(uri, {
      width: 170,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    })
      .then(url => setQrDataUrl(url))
      .catch(() => setQrDataUrl(''));
  }, [totpSecret, currentSchool.email, currentSchool.code]);

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      try {
        const res = await generateTotpCode(totpSecret);
        if (mounted) {
          setLiveTotpCode(res.code);
          setRemainingSeconds(res.remainingSeconds);
        }
      } catch {
        // ignore subtle unavailable errors
      }
    };
    refresh();
    const timer = setInterval(refresh, 1000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [totpSecret]);

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      setPinChangeMsg({ text: "Le nouveau code PIN doit comporter exactement 6 chiffres numériques.", error: true });
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeMsg({ text: "La confirmation ne correspond pas au nouveau code PIN.", error: true });
      return;
    }

    const ok = updateAdminPin(oldPin, newPin);
    if (!ok) {
      setPinChangeMsg({ text: "Code PIN actuel incorrect.", error: true });
    } else {
      setPinChangeMsg({ text: "Code PIN Administrateur mis à jour avec succès !", error: false });
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
    }
  };

  const handleCopySecret = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(totpSecret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleVerifyTestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyFeedback(null);
    setTesting2fa(true);
    try {
      const res = await verifySchool2faCode(testCode);
      if (res.ok) {
        setVerifyFeedback({ text: "Code 2FA valide ! La double authentification est opérationnelle.", error: false });
        setTestCode('');
      } else {
        setVerifyFeedback({ text: res.error || "Code 2FA invalide.", error: true });
      }
    } finally {
      setTesting2fa(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950">
            Sécurité & Authentification École
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestion du code PIN à 6 chiffres pour les opérations sensibles, politique 2FA active et journal de connexion
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>Cloisonnement Tenant {currentSchool.code} Strict</span>
        </div>
      </div>

      {(failedPinAttempts > 0 || isTemporarilyBlocked) && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            {isTemporarilyBlocked
              ? "Compte verrouillé temporairement suite à 5 tentatives PIN erronées."
              : `Attention : ${failedPinAttempts}/5 tentative(s) PIN échouée(s) détectée(s).`}
          </span>
        </div>
      )}

      {/* Grid of Security Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 6-Digit PIN Config & Real 2FA */}
        <div className="lg:col-span-5 space-y-4">
          {/* PIN Card */}
          <div className="p-5 rounded-xl bg-white border border-blue-100 space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-blue-100">
              <KeyRound className="w-5 h-5 text-amber-700" />
              <div>
                <h3 className="font-bold text-blue-950 text-sm">
                  Code PIN Administrateur (6 Chiffres)
                </h3>
                <span className="text-[10px] text-slate-500">Requis pour suppression, réinitialisation de mot de passe & paramètres</span>
              </div>
            </div>

            <form onSubmit={handleChangePin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Ancien Code PIN (par défaut : 123456)</label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="••••••"
                  value={oldPin}
                  onChange={e => setOldPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono tracking-widest text-center"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Nouveau PIN (6 chiffres)</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono tracking-widest text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Confirmer PIN</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono tracking-widest text-center"
                  />
                </div>
              </div>

              {pinChangeMsg && (
                <p className={`text-xs font-medium ${pinChangeMsg.error ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {pinChangeMsg.text}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2 font-semibold text-xs rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
              >
                Mettre à Jour le Code PIN
              </button>
            </form>
          </div>

          {/* 2FA Card (Functional & Interactive) */}
          <div className="p-5 rounded-xl bg-white border border-blue-100 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-blue-100 gap-2">
              <span className="font-bold text-blue-950 flex items-center gap-2 text-sm">
                <Smartphone className="w-4 h-4 text-blue-600" />
                Double Authentification Obligatoire
              </span>
              <button
                type="button"
                onClick={() => toggleTwoFactor()}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  twoFactorEnabled
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                }`}
                title="Cliquer pour activer ou désactiver la double authentification"
              >
                {twoFactorEnabled ? 'Active · Désactiver' : 'Désactivée · Activer'}
              </button>
            </div>

            <p className="text-slate-600 text-[11px] leading-relaxed">
              Lorsque la 2FA est active, chaque connexion Admin École et chaque validation PIN sensible exige un code à 6 chiffres :
            </p>

            <div className="space-y-1.5">
              {[
                { id: 'authenticator', label: 'Google / Microsoft Authenticator (Recommandé)' },
                { id: 'sms', label: `SMS Sécurisé (${currentSchool.phone || 'Orange Guinée / MTN'})` },
                { id: 'email', label: `Code temporaire par Email (${currentSchool.email})` }
              ].map(m => (
                <label
                  key={m.id}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    twoFactorMethod === m.id
                      ? 'bg-blue-50 border-blue-400 text-blue-950 font-semibold'
                      : 'bg-blue-50/40 border-slate-200 text-slate-700 hover:border-blue-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="2fa"
                    checked={twoFactorMethod === m.id}
                    onChange={() => {
                      setTwoFactorMethod(m.id as School2FAMethod);
                      setVerifyFeedback(null);
                    }}
                    className="text-blue-600 focus:ring-0 bg-slate-100"
                  />
                  <span className="truncate">{m.label}</span>
                </label>
              ))}
            </div>

            {twoFactorEnabled && (
              <div className="space-y-3 pt-2 border-t border-blue-100">
                {/* Method-specific Configuration */}
                {twoFactorMethod === 'authenticator' ? (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-blue-950 text-[11px]">
                        Appairage QR Code Authenticator (TOTP)
                      </span>
                      <button
                        type="button"
                        onClick={regenerateTotpSecret}
                        className="flex items-center gap-1 text-[11px] text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Nouvelle clé</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="p-1.5 rounded-xl bg-white border border-slate-200 shrink-0">
                        {qrDataUrl ? (
                          <img
                            src={qrDataUrl}
                            alt="QR Code Authenticator Admin École"
                            className="w-32 h-32 object-contain"
                          />
                        ) : (
                          <div className="w-32 h-32 flex items-center justify-center text-[11px] text-slate-400">
                            QR...
                          </div>
                        )}
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1.5">
                          <code className="font-mono text-[10px] font-bold text-blue-950 flex-1 truncate">
                            {totpSecret}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopySecret}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                            title="Copier la clé secrète"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {copiedSecret && (
                          <div className="text-[10px] text-emerald-600 font-semibold">Clé copiée !</div>
                        )}

                        <div className="p-2 rounded-lg bg-white border border-blue-200 space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-500 font-semibold">Code en direct :</span>
                            <span className="font-mono font-bold text-blue-700">{remainingSeconds}s</span>
                          </div>
                          <div className="text-lg font-black font-mono tracking-[0.25em] text-blue-950 text-center">
                            {liveTotpCode}
                          </div>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all duration-500"
                              style={{ width: `${(remainingSeconds / 30) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-blue-200 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-blue-950 text-[11px] flex items-center gap-1.5">
                        {twoFactorMethod === 'sms' ? (
                          <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <Mail className="w-3.5 h-3.5 text-indigo-600" />
                        )}
                        <span>
                          {twoFactorMethod === 'sms'
                            ? `Téléphone : ${currentSchool.phone}`
                            : `Email : ${currentSchool.email}`}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => sendSchool2faOtp(twoFactorMethod)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Envoyer code de test</span>
                      </button>
                    </div>

                    {lastSentOtp && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-[11px] text-emerald-900">
                        <span>
                          Code envoyé ({lastSentOtp.method.toUpperCase()}) à {lastSentOtp.sentAt} :
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white border border-emerald-300 font-mono font-black text-emerald-800">
                          {lastSentOtp.code}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Interactive Code Verification Test */}
                <form onSubmit={handleVerifyTestCode} className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-blue-950 text-[11px]">
                      Tester & Vérifier un code 2FA (6 chiffres)
                    </label>
                    {last2faVerifiedAt && (
                      <span className="text-[10px] font-semibold text-emerald-700">
                        Vérifié le {last2faVerifiedAt}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={testCode}
                      onChange={e => setTestCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Ex: 123456"
                      className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950 font-mono text-center tracking-[0.3em] font-bold"
                    />
                    <button
                      type="submit"
                      disabled={testing2fa || testCode.length !== 6}
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs cursor-pointer"
                    >
                      {testing2fa ? '...' : 'Vérifier'}
                    </button>
                  </div>

                  {verifyFeedback && (
                    <div
                      className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                        verifyFeedback.error ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {verifyFeedback.error ? (
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>{verifyFeedback.text}</span>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right: Connection Logs */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-white border border-blue-100">
          <div className="flex items-center justify-between pb-3 border-b border-blue-100">
            <h3 className="font-bold text-blue-950 text-xs uppercase tracking-wider">
              Historique des Connexions de l'Établissement ({currentSchool.name})
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Isolation locale</span>
          </div>

          <div className="mt-3 divide-y divide-blue-100 text-xs">
            {schoolLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-50 text-blue-600 mt-0.5">
                    <Laptop className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-950">{log.userName}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {log.device} · {log.location}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    log.status === 'succes' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {log.status === 'succes' ? 'Succès (2FA)' : 'Tentative Rejetée'}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-blue-100 text-[11px] text-slate-500">
            Protection WAF : Blocage automatique du compte après 5 tentatives échouées de mot de passe ou code PIN.
          </div>
        </div>
      </div>
    </div>
  );
};
