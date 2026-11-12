import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Smartphone, 
  AlertCircle, 
  CheckCircle2, 
  History, 
  UserCheck, 
  Check, 
  X,
  FileSignature
} from 'lucide-react';

export const DirectorSecurityView: React.FC = () => {
  const { 
    directorPin, 
    updateDirectorPin, 
    profile, 
    updateProfile, 
    auditLogs, 
    showToast 
  } = useDirector();

  // Pin form
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState(false);

  // 2FA method
  const [selectedMethod, setSelectedMethod] = useState<'app' | 'sms' | 'email'>(profile.twoFactorMethod);

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    setPinSuccess(false);

    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      setPinError('Le nouveau code PIN doit comporter exactement 6 chiffres.');
      return;
    }

    if (newPin !== confirmPin) {
      setPinError('Les deux nouveaux codes PIN ne correspondent pas.');
      return;
    }

    const ok = updateDirectorPin(oldPin, newPin);
    if (!ok) {
      setPinError('L\'ancien code PIN est incorrect.');
    } else {
      setPinSuccess(true);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => setPinSuccess(false), 4000);
    }
  };

  const handleSave2faMethod = (m: 'app' | 'sms' | 'email') => {
    setSelectedMethod(m);
    updateProfile({ twoFactorMethod: m });
    showToast(`Méthode 2FA mise à jour : ${m === 'app' ? 'Application TOTP (Google Authenticator)' : m === 'sms' ? 'SMS Téléphone' : 'Email de secours'}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Protection Cryptographique & Signature
            </span>
            <span className="text-xs text-slate-400">Code PIN 6 Chiffres + 2FA Obligatoire</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span>Sécurité, Code PIN & Journal d'Audit</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Gestion du coffre-fort de signature du Directeur et traçabilité inviolable de toutes les actions académiques.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Change 6-Digit PIN */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Code PIN Directeur (6 chiffres)</h3>
                <p className="text-xs text-slate-400">Requis pour viser les bulletins et valider les examens</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Actif (••••••)
            </span>
          </div>

          <form onSubmit={handleUpdatePin} className="space-y-3 text-xs">
            {pinError && (
              <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {pinSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Votre code PIN 6 chiffres a été renouvelé avec succès !</span>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Ancien code PIN actuel
              </label>
              <input
                type="password"
                maxLength={6}
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Ex: 654321"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono tracking-widest text-center focus:outline-hidden focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nouveau PIN (6 chiffres)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono tracking-widest text-center focus:outline-hidden focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Confirmer le nouveau PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono tracking-widest text-center focus:outline-hidden focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-md shadow-amber-600/20"
            >
              Mettre à Jour le Code PIN Directeur
            </button>
          </form>
        </div>

        {/* Box 2: 2FA Configuration */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Double Authentification (2FA)</h3>
                <p className="text-xs text-slate-400">Protection renforcée contre les signatures non autorisées</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Obligatoire
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-300">
              Choisissez le canal de délivrance du code temporaire à 6 chiffres (OTP) :
            </p>

            {[
              { id: 'app', title: 'Application Authenticator (Google / Microsoft)', desc: 'Code généré localement hors-ligne (Recommandé)', active: selectedMethod === 'app' },
              { id: 'sms', title: 'SMS Sécurisé Guinée', desc: `Code envoyé au ${profile.phone}`, active: selectedMethod === 'sms' },
              { id: 'email', title: 'Email Institutionnel', desc: `Code envoyé au ${profile.email}`, active: selectedMethod === 'email' }
            ].map(method => (
              <div 
                key={method.id}
                onClick={() => handleSave2faMethod(method.id as any)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  method.active 
                    ? 'bg-blue-600/15 border-blue-500 text-white' 
                    : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-xs">{method.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{method.desc}</div>
                </div>
                {method.active && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Audit Trail Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden space-y-2">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Journal d'Audit de Sécurité du Directeur des Études
              </h3>
              <p className="text-xs text-slate-400">
                Traçabilité horodatée de toutes les connexions, signatures de bulletins et publications d'examens.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-2.5 px-4">Horodatage</th>
                <th className="py-2.5 px-3">Action Réalisée</th>
                <th className="py-2.5 px-3">Cible / Objet</th>
                <th className="py-2.5 px-3">Adresse IP</th>
                <th className="py-2.5 px-3">Appareil</th>
                <th className="py-2.5 px-3">Niveau</th>
                <th className="py-2.5 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {log.action}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {log.target}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                    {log.ip}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {log.device}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                      log.securityLevel === 'critique' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                      log.securityLevel === 'sensible' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      'bg-blue-500/10 text-blue-300 border-blue-500/20'
                    }`}>
                      {log.securityLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Succès</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
