import React, { useState } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Smartphone, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  X,
  Laptop
} from 'lucide-react';

export const SchoolSecurityView: React.FC = () => {
  const { 
    schoolLogs, 
    updateAdminPin, 
    failedPinAttempts, 
    isTemporarilyBlocked, 
    currentSchool 
  } = useSchoolAdmin();

  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ text: string; error: boolean } | null>(null);

  const [twoFactorMethod, setTwoFactorMethod] = useState<'authenticator' | 'sms' | 'email'>('authenticator');

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Sécurité & Authentification École
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestion du code PIN à 6 chiffres pour les opérations sensibles, politique 2FA et journal de connexion
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>Cloisonnement Tenant {currentSchool.code} Strict</span>
        </div>
      </div>

      {/* Grid of Security Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 6-Digit PIN Config & 2FA */}
        <div className="lg:col-span-5 space-y-4">
          {/* PIN Card */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-white text-sm">
                  Code PIN Administrateur (6 Chiffres)
                </h3>
                <span className="text-[10px] text-slate-400">Requis pour suppression, réinitialisation de mot de passe & paramètres</span>
              </div>
            </div>

            <form onSubmit={handleChangePin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Ancien Code PIN (par défaut : 123456)</label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="••••••"
                  value={oldPin}
                  onChange={e => setOldPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono tracking-widest text-center"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Nouveau PIN (6 chiffres)</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono tracking-widest text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Confirmer PIN</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono tracking-widest text-center"
                  />
                </div>
              </div>

              {pinChangeMsg && (
                <p className={`text-xs font-medium ${pinChangeMsg.error ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {pinChangeMsg.text}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2 font-semibold text-xs rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
              >
                Mettre à Jour le Code PIN
              </button>
            </form>
          </div>

          {/* 2FA Card */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                Double Authentification Obligatoire
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>

            <p className="text-slate-400 text-[11px]">
              Chaque connexion de l'Admin École exige un second facteur conformément aux directives de sécurité :
            </p>

            <div className="space-y-1.5 pt-1">
              {[
                { id: 'authenticator', label: 'Google / Microsoft Authenticator (Recommandé)' },
                { id: 'sms', label: 'SMS Sécurisé (Orange Guinée / MTN)' },
                { id: 'email', label: 'Code temporaire par Email' }
              ].map(m => (
                <label key={m.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="2fa"
                    checked={twoFactorMethod === m.id}
                    onChange={() => setTwoFactorMethod(m.id as any)}
                    className="text-blue-600 focus:ring-0 bg-slate-700"
                  />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Connection Logs */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              Historique des Connexions de l'Établissement ({currentSchool.name})
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Isolation locale</span>
          </div>

          <div className="mt-3 divide-y divide-slate-800 text-xs">
            {schoolLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-blue-400 mt-0.5">
                    <Laptop className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{log.userName}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {log.device} · {log.location}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    log.status === 'succes' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {log.status === 'succes' ? 'Succès (2FA)' : 'Tentative Rejetée'}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            Protection WAF : Blocage automatique du compte après 5 tentatives échouées de mot de passe ou code PIN.
          </div>
        </div>
      </div>
    </div>
  );
};
