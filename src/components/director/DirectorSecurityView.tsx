import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import {
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle2,
  History,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';

export const DirectorSecurityView: React.FC = () => {
  const {
    directorPin,
    updateDirectorPin,
    auditLogs
  } = useDirector();

  // Pin form
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState(false);
  const [revealCurrentPin, setRevealCurrentPin] = useState(false);

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
      setPinError("L'ancien code PIN est incorrect.");
    } else {
      setPinSuccess(true);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => setPinSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-blue-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Protection & Signature Électronique
            </span>
            <span className="text-xs text-slate-500">Code PIN Directeur 6 Chiffres</span>
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-700" />
            <span>Sécurité & Code PIN Directeur</span>
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Configurez ici votre Code PIN personnel du Directeur pour viser les bulletins et publier les résultats d'examens.
          </p>
        </div>
      </div>

      {/* Clear Explanation Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 space-y-1 leading-relaxed">
          <div className="font-bold text-blue-950">Code demandé lors des validations du Directeur</div>
          <p>
            • <strong>Code PIN Directeur (6 chiffres) :</strong> Défini par <strong>vous (le Directeur des Études)</strong> ci-dessous (code initial par défaut lors de la mise en service : <code className="px-1.5 py-0.5 rounded bg-white border border-blue-200 font-mono font-bold text-amber-800">654321</code> — à changer immédiatement).
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Change 6-Digit PIN */}
        <div className="p-6 rounded-2xl bg-white border border-blue-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-blue-100 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-950">Code PIN Directeur (6 chiffres)</h3>
                <p className="text-xs text-slate-500">Requis pour viser les bulletins et valider les examens</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRevealCurrentPin(!revealCurrentPin)}
              className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer shrink-0"
              title="Afficher ou masquer votre Code PIN actuel"
            >
              {revealCurrentPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>PIN : {revealCurrentPin ? directorPin : '••••••'}</span>
            </button>
          </div>

          <form onSubmit={handleUpdatePin} className="space-y-3 text-xs">
            {pinError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {pinSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Votre code PIN 6 chiffres a été renouvelé avec succès !</span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Ancien code PIN actuel
              </label>
              <input
                type="password"
                maxLength={6}
                value={oldPin}
                onChange={e => setOldPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Saisissez le PIN actuel"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono tracking-widest text-center focus:outline-hidden focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nouveau PIN (6 chiffres)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono tracking-widest text-center focus:outline-hidden focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Confirmer le nouveau PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono tracking-widest text-center focus:outline-hidden focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-md shadow-amber-600/20 cursor-pointer"
            >
              Mettre à Jour le Code PIN Directeur
            </button>
          </form>
        </div>
      </div>

      {/* Security Audit Trail Table */}
      <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden space-y-2">
        <div className="p-5 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="text-sm font-bold text-blue-950">
                Journal d'Audit de Sécurité du Directeur des Études
              </h3>
              <p className="text-xs text-slate-500">
                Traçabilité horodatée de toutes les connexions, signatures de bulletins et publications d'examens.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-50/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
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
            <tbody className="divide-y divide-blue-100">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-blue-50">
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 font-semibold text-blue-950">{log.action}</td>
                  <td className="py-3 px-3 text-slate-700">{log.target}</td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{log.ip}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{log.device}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                        log.securityLevel === 'critique'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : log.securityLevel === 'sensible'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {log.securityLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {log.status === 'echec' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600">
                        <AlertCircle className="w-3 h-3" />
                        <span>Refusé</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Succès</span>
                      </span>
                    )}
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
