import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { buildOtpAuthUri, generateTotpCode, generateTotpSecret, verifyTotpCode } from '../../utils/totp';
import {
  ShieldCheck,
  Smartphone,
  Laptop,
  LogOut,
  Ban,
  CheckCircle2,
  Lock,
  Search,
  Copy,
  RefreshCw,
  AlertCircle,
  Send,
  Mail,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';

import { saveDualStorage, subscribeStorageKey } from '../../utils/storage';
import { maskDestinationLabel, requestServerOtp, verifyServerOtp } from '../../utils/otpClient';

const SUPERADMIN_2FA_STORAGE_KEY = 'smartschool_superadmin_security_v1';

export type SuperAdmin2FAMethod = 'authenticator' | 'sms' | 'email';

export interface SuperAdminSecurityStorage {
  twoFactorEnabled: boolean;
  twoFactorMethod: SuperAdmin2FAMethod;
  twoFactorPhone: string;
  totpSecret: string;
}

export function loadSuperAdminSecurityConfig(): SuperAdminSecurityStorage {
  try {
    const raw = localStorage.getItem(SUPERADMIN_2FA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        twoFactorEnabled: typeof parsed.twoFactorEnabled === 'boolean' ? parsed.twoFactorEnabled : true,
        twoFactorMethod:
          parsed.twoFactorMethod === 'sms' || parsed.twoFactorMethod === 'email'
            ? parsed.twoFactorMethod
            : 'authenticator',
        twoFactorPhone:
          typeof parsed.twoFactorPhone === 'string' && parsed.twoFactorPhone.trim().length >= 6
            ? parsed.twoFactorPhone.trim()
            : '+224 624 00 11 22',
        totpSecret:
          typeof parsed.totpSecret === 'string' && parsed.totpSecret.length >= 16
            ? parsed.totpSecret
            : generateTotpSecret(16)
      };
    }
  } catch {
    // ignore storage errors
  }
  const fresh: SuperAdminSecurityStorage = {
    twoFactorEnabled: true,
    twoFactorMethod: 'authenticator',
    twoFactorPhone: '+224 624 00 11 22',
    totpSecret: generateTotpSecret(16)
  };
  try {
    localStorage.setItem(SUPERADMIN_2FA_STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    // ignore
  }
  return fresh;
}

export function saveSuperAdminSecurityConfig(cfg: SuperAdminSecurityStorage): void {
  saveDualStorage(SUPERADMIN_2FA_STORAGE_KEY, cfg, Date.now(), 'local');
}

export const SecurityView: React.FC = () => {
  const {
    profile,
    updateProfile,
    auditLogs,
    sessions,
    terminateSession,
    blockedIps,
    toggleBlockIp,
    t,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sessions' | 'logs' | 'ip_blocklist' | '2fa'>('sessions');
  const [logTypeFilter, setLogTypeFilter] = useState('all');
  const [logSearch, setLogSearch] = useState('');
  const [newIpToBlock, setNewIpToBlock] = useState('');

  // Persisted Super Admin 2FA state
  const [initialCfg] = useState<SuperAdminSecurityStorage>(() => loadSuperAdminSecurityConfig());
  const [totpSecret, setTotpSecret] = useState<string>(initialCfg.totpSecret);
  const [twoFactorMethod, setTwoFactorMethod] = useState<SuperAdmin2FAMethod>(initialCfg.twoFactorMethod);
  const [twoFactorPhone, setTwoFactorPhone] = useState<string>(initialCfg.twoFactorPhone || profile.phone || '+224 624 00 11 22');
  const [twoFactorPhoneDraft, setTwoFactorPhoneDraft] = useState<string>(initialCfg.twoFactorPhone || profile.phone || '+224 624 00 11 22');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [showTotpSecrets, setShowTotpSecrets] = useState(false);

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [liveTotpCode, setLiveTotpCode] = useState('------');
  const [remainingSeconds, setRemainingSeconds] = useState(30);
  const [testCode, setTestCode] = useState('');
  const [testing2fa, setTesting2fa] = useState(false);
  const [sendingTestOtp, setSendingTestOtp] = useState(false);
  const [testChallengeToken, setTestChallengeToken] = useState<string | null>(null);
  const [testOtpStatus, setTestOtpStatus] = useState<{ method: 'sms' | 'email'; maskedDestination: string; message: string; sentAt: string } | null>(null);
  const [testFeedback, setTestFeedback] = useState<{ text: string; error: boolean } | null>(null);
  const mounted2faRef = React.useRef(false);
  const remote2faUpdateRef = React.useRef(false);

  useEffect(() => {
    return subscribeStorageKey(SUPERADMIN_2FA_STORAGE_KEY, (data, _ts, source) => {
      if (source !== 'remote' || !data || typeof data !== 'object') return;
      const incoming = data as Partial<SuperAdminSecurityStorage>;
      remote2faUpdateRef.current = true;
      if (typeof incoming.totpSecret === 'string' && incoming.totpSecret.length >= 16) {
        setTotpSecret(incoming.totpSecret);
      }
      if (incoming.twoFactorMethod === 'authenticator' || incoming.twoFactorMethod === 'sms' || incoming.twoFactorMethod === 'email') {
        setTwoFactorMethod(incoming.twoFactorMethod);
      }
      if (typeof incoming.twoFactorPhone === 'string' && incoming.twoFactorPhone.trim()) {
        setTwoFactorPhone(incoming.twoFactorPhone.trim());
        setTwoFactorPhoneDraft(incoming.twoFactorPhone.trim());
      }
      if (typeof incoming.twoFactorEnabled === 'boolean' && incoming.twoFactorEnabled !== profile.twoFactorEnabled) {
        updateProfile({ twoFactorEnabled: incoming.twoFactorEnabled });
      }
    });
  }, [profile.twoFactorEnabled, updateProfile]);

  useEffect(() => {
    if (!mounted2faRef.current) {
      mounted2faRef.current = true;
      return;
    }
    if (remote2faUpdateRef.current) {
      remote2faUpdateRef.current = false;
      return;
    }
    saveSuperAdminSecurityConfig({
      twoFactorEnabled: profile.twoFactorEnabled,
      twoFactorMethod,
      twoFactorPhone,
      totpSecret
    });
  }, [profile.twoFactorEnabled, twoFactorMethod, twoFactorPhone, totpSecret]);

  useEffect(() => {
    const uri = buildOtpAuthUri(totpSecret, profile.email || 'superadmin@smartschool.gn', 'SmartSchool SuperAdmin');
    QRCode.toDataURL(uri, { width: 170, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''));
  }, [totpSecret, profile.email]);

  useEffect(() => {
    let mounted = true;
    const tick = async () => {
      try {
        const res = await generateTotpCode(totpSecret);
        if (mounted) {
          setLiveTotpCode(res.code);
          setRemainingSeconds(res.remainingSeconds);
        }
      } catch {
        // ignore
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [totpSecret]);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.actor.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.ip.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.target.toLowerCase().includes(logSearch.toLowerCase());

    const matchesType = logTypeFilter === 'all' || log.type === logTypeFilter;

    return matchesSearch && matchesType;
  });

  const handleToggle2fa = () => {
    const nextState = !profile.twoFactorEnabled;
    updateProfile({ twoFactorEnabled: nextState });
    showToast(`Double Authentification (2FA) Super Admin ${nextState ? 'activée' : 'désactivée'}`);
  };

  const handleSave2faPhone = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    const cleaned = twoFactorPhoneDraft.trim();
    const digitsCount = cleaned.replace(/\D/g, '').length;
    if (digitsCount < 8 || digitsCount > 15 || !/^[+\d\s().-]+$/.test(cleaned)) {
      setPhoneError('Veuillez saisir un numéro de téléphone valide (ex: +224 624 00 11 22).');
      return;
    }
    setTwoFactorPhone(cleaned);
    showToast(`Numéro 2FA Super Admin enregistré : ${cleaned}`);
  };

  const handleRegenerateSecret = () => {
    setTotpSecret(generateTotpSecret(16));
    setTestFeedback(null);
    showToast('Nouvelle clé secrète 2FA générée.');
  };

  const handleSendTestOtp = async (channel: 'sms' | 'email') => {
    setTestFeedback(null);
    const destination = channel === 'sms' ? twoFactorPhone : profile.email;
    if (channel === 'sms' && !destination.trim()) {
      setTestFeedback({ text: 'Configurez d’abord un numéro de téléphone 2FA ci-contre.', error: true });
      return;
    }
    setSendingTestOtp(true);
    try {
      const res = await requestServerOtp({
        channel,
        destination,
        purpose: 'Test 2FA Super Admin'
      });
      if (!res.ok || !res.challengeToken) {
        setTestFeedback({ text: res.error || 'Échec d’envoi du code OTP.', error: true });
        return;
      }
      setTestChallengeToken(res.challengeToken);
      setTestOtpStatus({
        method: channel,
        maskedDestination: res.maskedDestination || maskDestinationLabel(channel, destination),
        message: res.message || 'Code envoyé.',
        sentAt: res.sentAt || new Date().toLocaleTimeString('fr-FR')
      });
      showToast(`Demande OTP transmise (${channel.toUpperCase()})`);
    } finally {
      setSendingTestOtp(false);
    }
  };

  const handleVerifyTestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = testCode.trim();
    if (!/^\d{6}$/.test(clean)) {
      setTestFeedback({ text: 'Le code 2FA doit contenir exactement 6 chiffres.', error: true });
      return;
    }
    setTesting2fa(true);
    try {
      let ok = await verifyTotpCode(totpSecret, clean, 1);
      if (!ok && testChallengeToken) {
        const otpRes = await verifyServerOtp({ challengeToken: testChallengeToken, code: clean });
        ok = otpRes.ok;
      }
      if (ok) {
        setTestFeedback({ text: 'Code 2FA validé avec succès !', error: false });
        setTestCode('');
      } else {
        setTestFeedback({ text: 'Code invalide ou expiré. Vérifiez votre application Authenticator ou le code reçu.', error: true });
      }
    } finally {
      setTesting2fa(false);
    }
  };

  const handleAddBlockIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpToBlock.trim()) return;
    toggleBlockIp(newIpToBlock.trim());
    setNewIpToBlock('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950">
            {t.security.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.security.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Chiffrement AES-256 & TLS 1.3 Actifs</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 overflow-x-auto border-b border-blue-100 text-xs">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-3 font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'sessions'
              ? 'text-blue-600 border-blue-500'
              : 'text-slate-500 hover:text-slate-900 border-transparent'
          }`}
        >
          Sessions & Appareils Actifs ({sessions.length})
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'logs'
              ? 'text-blue-600 border-blue-500'
              : 'text-slate-500 hover:text-slate-900 border-transparent'
          }`}
        >
          Journaux d'Audit & Sécurité ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('ip_blocklist')}
          className={`pb-3 font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'ip_blocklist'
              ? 'text-blue-600 border-blue-500'
              : 'text-slate-500 hover:text-slate-900 border-transparent'
          }`}
        >
          Pare-feu & Adresses IP Bloquées ({blockedIps.length})
        </button>

        <button
          onClick={() => setActiveTab('2fa')}
          className={`pb-3 font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === '2fa'
              ? 'text-blue-600 border-blue-500'
              : 'text-slate-500 hover:text-slate-900 border-transparent'
          }`}
        >
          Authentification 2FA & Accès
        </button>
      </div>

      {/* Content 1: Sessions */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-slate-200">
            <h3 className="text-sm font-bold text-blue-950 mb-1">
              Appareils Actuellement Connectés à la Console Super Admin
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Vous pouvez révoquer instantanément n'importe quelle session distante pour forcer la déconnexion.
            </p>

            <div className="space-y-3">
              {sessions.map((sess) => (
                <div 
                  key={sess.id}
                  className="p-3.5 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 text-blue-600 mt-0.5">
                      {sess.device.includes('iPhone') || sess.device.includes('Android') ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Laptop className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-950 text-xs">{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            Session actuelle
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                        <span>{sess.browser}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-700">IP: {sess.ip}</span>
                        <span>·</span>
                        <span>{sess.location}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Dernière activité : {sess.lastActive}
                      </div>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      onClick={() => terminateSession(sess.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors whitespace-nowrap self-end sm:self-auto cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.security.forceLogout}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content 2: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filtrer les journaux par mot-clé, acteur, IP..."
                value={logSearch}
                onChange={e => setLogSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-blue-50/60 border border-slate-200 text-blue-950 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={logTypeFilter}
              onChange={e => setLogTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg bg-blue-50/60 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Tous les types d'événements</option>
              <option value="connexion">Connexions & Authentification</option>
              <option value="ecole">Établissements (Création/Suspension)</option>
              <option value="admin">Administrateurs d'écoles</option>
              <option value="securite">Sécurité & Pare-feu WAF</option>
              <option value="finance">Finances & Abonnements</option>
              <option value="sauvegarde">Sauvegardes de base</option>
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-blue-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Horodatage (GMT)</th>
                  <th className="py-2.5 px-3">Action Enregistrée</th>
                  <th className="py-2.5 px-3">Acteur / Déclencheur</th>
                  <th className="py-2.5 px-3">Adresse IP</th>
                  <th className="py-2.5 px-3">Gravité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-900">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-blue-100">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      {log.action}
                      <div className="text-[10px] text-slate-500 mt-0.5">Cible : {log.target}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 text-[11px]">
                      {log.actor}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {log.ip}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        log.severity === 'critical'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : log.severity === 'warning'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-600'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content 3: IP Blocklist */}
      {activeTab === 'ip_blocklist' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-slate-200">
            <h3 className="text-sm font-bold text-blue-950 mb-1">
              Liste Noire du Pare-feu WAF (Adresses IP Bannies)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Toute tentative de connexion ou de requête API issue de ces adresses est immédiatement rejetée avec HTTP 403.
            </p>

            {/* Add IP form */}
            <form onSubmit={handleAddBlockIp} className="flex gap-2 max-w-md mb-4">
              <input
                type="text"
                placeholder="Ex: 198.51.100.25"
                value={newIpToBlock}
                onChange={e => setNewIpToBlock(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-white border border-slate-200 text-blue-950 font-mono focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Bloquer l'IP</span>
              </button>
            </form>

            <div className="divide-y divide-slate-200">
              {blockedIps.map(ip => (
                <div key={ip} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span className="font-mono text-slate-900 font-semibold">{ip}</span>
                    <span className="text-[11px] text-slate-500">(Trafic malveillant / Tentatives non autorisées)</span>
                  </div>
                  <button
                    onClick={() => toggleBlockIp(ip)}
                    className="px-2.5 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors cursor-pointer"
                  >
                    Débloquer
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content 4: 2FA Settings (Phone Number + Channel + TOTP QR Code + Interactive Server Test) */}
      {activeTab === '2fa' && (
        <div className="p-5 rounded-xl bg-blue-50/60 border border-slate-200 space-y-5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-blue-950 text-sm">
                Double Facteur d'Authentification (2FA Super Admin)
              </h3>
              <p className="text-slate-500 mt-0.5">
                Exige la saisie d'un code à 6 chiffres (Application Authenticator, SMS sur votre numéro dédié ou Email) à chaque connexion Super Admin.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggle2fa}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                profile.twoFactorEnabled
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {profile.twoFactorEnabled ? 'Désactiver le 2FA' : 'Activer le 2FA'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left column: Method & Phone Number configuration */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-4">
              <div className="font-semibold text-blue-950 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Numéro SMS 2FA & Canal Principal</span>
              </div>

              <div className="space-y-1.5">
                {[
                  { id: 'authenticator', label: 'Google / Microsoft Authenticator (TOTP · Recommandé)' },
                  { id: 'sms', label: `SMS Sécurisé (${twoFactorPhone || 'Numéro non défini'})` },
                  { id: 'email', label: `Code temporaire par Email (${profile.email})` }
                ].map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      twoFactorMethod === opt.id
                        ? 'bg-blue-50 border-blue-400 text-blue-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="superadmin_2fa_method"
                      checked={twoFactorMethod === opt.id}
                      onChange={() => {
                        setTwoFactorMethod(opt.id as SuperAdmin2FAMethod);
                        setTestFeedback(null);
                        showToast(`Canal 2FA Super Admin défini : ${opt.id.toUpperCase()}`);
                      }}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span className="truncate">{opt.label}</span>
                  </label>
                ))}
              </div>

              <form onSubmit={handleSave2faPhone} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="font-bold text-blue-950 text-[11px]">
                    Numéro de téléphone recevant les codes 2FA SMS :
                  </label>
                  {profile.phone && (
                    <button
                      type="button"
                      onClick={() => {
                        setTwoFactorPhoneDraft(profile.phone);
                        setPhoneError(null);
                      }}
                      className="text-[10px] font-semibold text-blue-700 hover:underline cursor-pointer"
                    >
                      Utiliser le téléphone du profil
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="tel"
                    value={twoFactorPhoneDraft}
                    onChange={e => {
                      setTwoFactorPhoneDraft(e.target.value);
                      setPhoneError(null);
                    }}
                    placeholder="+224 624 00 11 22"
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-200 font-mono text-xs text-blue-950 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer whitespace-nowrap"
                  >
                    Enregistrer le numéro
                  </button>
                </div>

                {phoneError && (
                  <p className="text-[11px] font-semibold text-rose-600">{phoneError}</p>
                )}

                <p className="text-[11px] text-slate-500">
                  Numéro actif enregistré : <strong className="font-mono text-blue-950">{twoFactorPhone}</strong>
                </p>
              </form>

              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-semibold text-slate-600">
                  Tester l'envoi d'un code OTP serveur vers votre numéro ou email :
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={sendingTestOtp}
                    onClick={() => handleSendTestOtp('sms')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-[11px] cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Envoyer OTP au {maskDestinationLabel('sms', twoFactorPhone)}</span>
                  </button>
                  <button
                    type="button"
                    disabled={sendingTestOtp}
                    onClick={() => handleSendTestOtp('email')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-[11px] cursor-pointer"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Envoyer OTP Email</span>
                  </button>
                </div>

                {testOtpStatus && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 space-y-0.5">
                    <div className="font-bold">
                      {testOtpStatus.method.toUpperCase()} → {testOtpStatus.maskedDestination} ({testOtpStatus.sentAt})
                    </div>
                    <div className="text-emerald-700">{testOtpStatus.message}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column: TOTP QR Pairing & Verification Test */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-blue-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Statut Actuel & Appairage QR
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTotpSecrets(s => !s)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-blue-950 cursor-pointer"
                    >
                      {showTotpSecrets ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showTotpSecrets ? 'Masquer clé' : 'Révéler clé'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRegenerateSecret}
                      className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:underline cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Nouvelle clé</span>
                    </button>
                  </div>
                </div>
                <p className="text-slate-700">
                  La protection 2FA est actuellement <strong className={profile.twoFactorEnabled ? 'text-emerald-600' : 'text-rose-600'}>{profile.twoFactorEnabled ? 'ACTIVÉE' : 'DÉSACTIVÉE'}</strong> sur votre compte Super Administrateur.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  {qrDataUrl && (
                    <img src={qrDataUrl} alt="QR Code 2FA Super Admin" className="w-28 h-28 rounded-lg bg-white p-1 border border-slate-200 shrink-0" />
                  )}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-2 py-1">
                      <code className="font-mono text-[10px] font-bold text-blue-950 flex-1 truncate">
                        {showTotpSecrets ? totpSecret : '••••••••••••••••'}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(totpSecret);
                          showToast('Clé secrète 2FA copiée.');
                        }}
                        className="text-blue-600 p-0.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-2 rounded bg-white border border-blue-200 text-center">
                      <div className="text-[10px] text-slate-500">Code TOTP de secours ({remainingSeconds}s)</div>
                      <div className="font-mono text-base font-black tracking-[0.25em] text-blue-950">
                        {showTotpSecrets ? liveTotpCode : '••••••'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-3">
                <div className="font-semibold text-blue-950 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Tester & Vérifier votre Code 2FA
                </div>
                <p className="text-slate-700">
                  Déconnexion automatique après <strong className="text-blue-950">45 minutes</strong> d'inactivité continue. Vérifiez votre code Authenticator ou OTP ci-dessous :
                </p>

                <form onSubmit={handleVerifyTestCode} className="space-y-2 pt-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={testCode}
                      onChange={e => setTestCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Code à 6 chiffres"
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-center tracking-[0.3em] font-bold text-blue-950"
                    />
                    <button
                      type="submit"
                      disabled={testing2fa || testCode.length !== 6}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold cursor-pointer"
                    >
                      {testing2fa ? '...' : 'Vérifier'}
                    </button>
                  </div>
                  {testFeedback && (
                    <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${testFeedback.error ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {testFeedback.error ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{testFeedback.text}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
