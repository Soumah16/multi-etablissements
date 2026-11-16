import React, { useState } from 'react';
import { useLibrarian } from '../../context/LibrarianContext';
import {
  ShieldCheck,
  Lock,
  AlertOctagon,
  ShieldX,
  Smartphone,
  Eye,
  EyeOff,
  History,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LibrarianSecurityView: React.FC = () => {
  const { profile, updateProfile, showToast, canManageLibrary, libraryAuditLogs } = useLibrarian();
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [twoFactor, setTwoFactor] = useState(profile.twoFactorEnabled);

  if (!canManageLibrary) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-rose-200 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-base font-black text-blue-950">Accès Refusé — Administration Bibliothèque</h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Seul l'<strong>Admin de la Bibliothèque de l'école</strong> connecté avec son compte bibliothécaire peut accéder aux paramètres de sécurité, au code PIN et au journal d'audit.
        </p>
      </div>
    );
  }

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      showToast('Le code PIN doit comporter exactement 6 chiffres.');
      return;
    }
    if (newPin !== confirmPin) {
      showToast('Les deux codes PIN ne correspondent pas.');
      return;
    }
    updateProfile({ pinCode: newPin });
    setNewPin('');
    setConfirmPin('');
    showToast('Code PIN de sécurité mis à jour.');
  };

  const handleToggle2fa = () => {
    const nextVal = !twoFactor;
    setTwoFactor(nextVal);
    updateProfile({ twoFactorEnabled: nextVal });
    showToast(nextVal ? 'Double authentification (2FA) activée.' : '2FA désactivée.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-blue-950">Sécurité, Habilitations &amp; Audit Bibliothèque</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Gestion du code PIN 6 chiffres, authentification double facteur et journal complet des connexions et modifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* PIN & Authentication Settings */}
        <div className="p-6 rounded-2xl bg-white border border-blue-100 space-y-5">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-blue-950">Code PIN Rapide (6 chiffres)</h2>
          </div>
          <p className="text-xs text-slate-500">
            Utilisé par l'Admin de la Bibliothèque pour valider les opérations sensibles (clôture d'emprunt litigieux, déclaration de perte, radiation d'ouvrage).
          </p>

          <form onSubmit={handleUpdatePin} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Nouveau Code PIN (6 chiffres)</label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-blue-950 font-mono tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-950"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Confirmer le Nouveau Code PIN</label>
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-blue-950 font-mono tracking-widest"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Enregistrer le nouveau code PIN
            </button>
          </form>

          {/* 2FA Toggle */}
          <div className="pt-4 border-t border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-blue-950">Double Authentification (2FA)</div>
                <div className="text-[11px] text-slate-500">Code SMS Orange / MTN à la connexion</div>
              </div>
            </div>
            <button
              onClick={handleToggle2fa}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                twoFactor 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-50 text-slate-500 hover:text-blue-950'
              }`}
            >
              {twoFactor ? 'Activée' : 'Désactivée'}
            </button>
          </div>
        </div>

        {/* Strict Functional Prohibitions */}
        <div className="p-6 rounded-2xl bg-white border border-blue-100 space-y-4">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertOctagon className="w-4 h-4" />
            <h2 className="text-sm font-bold text-blue-950">Séparation des Pouvoirs &amp; Règles Bibliothèque</h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            La bibliothèque applique un cloisonnement strict : chaque visiteur se connecte avec son compte personnel, et <strong>seul l'Admin de la Bibliothèque de l'école</strong> peut modifier le fonds documentaire.
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-emerald-700">Exclusivité de Modification (Admin Biblio)</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Aucun élève, enseignant, parent, directeur, comptable, admin école ou super admin ne peut modifier, ajouter ou supprimer un livre ou prêt.
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <ShieldX className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-rose-700">Interdiction de Gérer les Notes &amp; Finances</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Aucun accès aux relevés de notes, bulletins ni aux caisses de scolarité.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Library Access & Modifications Audit Table */}
      <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden">
        <div className="p-5 border-b border-blue-100 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-sm font-bold text-blue-950">Journal des Connexions &amp; Modifications Bibliothèque</h3>
            <p className="text-xs text-slate-500">Historique des comptes connectés, modifications autorisées et tentatives bloquées.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-blue-50/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Date &amp; Heure</th>
                <th className="py-2.5 px-3">Compte Utilisateur</th>
                <th className="py-2.5 px-3">Rôle</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-4 text-right">Décision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {libraryAuditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-xs text-slate-500">
                    Aucune activité récente enregistrée dans cette session.
                  </td>
                </tr>
              ) : (
                libraryAuditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-blue-50">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-semibold text-blue-950">
                      {log.userName} <span className="text-[10px] font-mono text-slate-500">({log.userMatricule})</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{log.userRole}</td>
                    <td className="py-2.5 px-3 text-slate-800">{log.action}</td>
                    <td className="py-2.5 px-4 text-right">
                      {log.status === 'autorise' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Autorisé</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertCircle className="w-3 h-3" />
                          <span>Bloqué</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
