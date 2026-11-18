import React, { useState } from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { 
  ShieldCheck, 
  History, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  XCircle
} from 'lucide-react';

import { getAccountByRole, updateAccountPassword } from '../../data/accountsData';
import { syncCurrentUserSession } from '../../utils/accountSync';

export const SecretarySecurityView: React.FC = () => {
  const { profile, securityLogs, addSecurityLog, showToast } = useSecretary();
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordChangeSuccess(false);

    const trimmedCurrent = currentPassword.trim();
    const trimmedNew = newPassword.trim();
    if (!trimmedCurrent || !trimmedNew) return;

    const acc = getAccountByRole('secretary', profile.schoolId);
    const expectedPwd = acc?.plainPassword || 'Smart@2026';
    if (trimmedCurrent !== expectedPwd && currentPassword !== expectedPwd) {
      setPasswordError('Le mot de passe actuel saisi est incorrect.');
      return;
    }

    if (trimmedNew.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (trimmedNew !== confirmPassword.trim()) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    const updatedAcc = updateAccountPassword(
      {
        id: acc?.id,
        role: 'secretary',
        email: profile.email,
        matricule: profile.matricule,
        ecoleId: profile.schoolId
      },
      trimmedNew,
      false
    );

    if (updatedAcc) {
      syncCurrentUserSession(
        { id: updatedAcc.id, email: updatedAcc.email, role: 'secretary', ecoleId: updatedAcc.ecoleId },
        { mustChangePassword: false }
      );
    }

    addSecurityLog('Modification du mot de passe de connexion du Secrétariat');
    setPasswordChangeSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Mot de passe du secrétariat modifié avec succès.');
    setTimeout(() => setPasswordChangeSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-blue-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
              Contrôle d'Accès & Traçabilité
            </span>
            <span className="text-xs text-slate-500">Sécurité du Guichet Administratif</span>
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            <span>Sécurité, Mot de Passe & Journal d'Accès</span>
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Protection des données personnelles des familles, gestion du mot de passe et journal des connexions.
          </p>
        </div>
      </div>

      {/* Permissions & Boundaries Notice (User Requirement Checklist) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ce que la secrétaire peut voir et faire */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-200 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Prérogatives Administratives de la Secrétaire</span>
          </h3>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li>✅ Inscription et gestion complète des élèves</li>
            <li>✅ Gestion des comptes et dossiers des parents d'élèves</li>
            <li>✅ Génération automatique des cartes scolaires & QR Codes</li>
            <li>✅ Délivrance des certificats et attestations officielles</li>
            <li>✅ Enregistrement des transferts scolaires entrants et sortants</li>
            <li>✅ Planification des rendez-vous au guichet et communication</li>
          </ul>
        </div>

        {/* Ce que la secrétaire NE PEUT PAS faire */}
        <div className="p-5 rounded-2xl bg-white border border-rose-200 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            <span>Limites Strictes (Séparation des Rôles)</span>
          </h3>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li>❌ Ne peut pas ajouter ou modifier des notes d'élèves</li>
            <li>❌ Ne peut pas viser ni valider des bulletins scolaires (Directeur)</li>
            <li>❌ Ne peut pas valider ni publier des examens académiques</li>
            <li>❌ Ne peut pas modifier la comptabilité ni encaisser les paiements (Comptable)</li>
            <li>❌ Ne peut pas créer de professeurs ni d'administrateurs (Admin École)</li>
            <li>❌ Aucun accès aux données des autres établissements (Isolation Multi-Tenant)</li>
          </ul>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Change Password */}
        <div className="p-6 rounded-2xl bg-white border border-blue-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-blue-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-950">Mot de Passe du Secrétariat</h3>
                <p className="text-xs text-slate-500">Modifiez votre mot de passe d'accès administratif</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            {passwordError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordChangeSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Mot de passe mis à jour avec succès !</span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mot de passe actuel</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Confirmer</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md"
            >
              Mettre à Jour le Mot de Passe
            </button>
          </form>
        </div>
      </div>

      {/* Security Logs Table */}
      <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden space-y-2">
        <div className="p-4 border-b border-blue-100 flex items-center gap-2">
          <History className="w-5 h-5 text-teal-600" />
          <h3 className="text-sm font-bold text-blue-950">Journal d'Audit du Secrétariat Général</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-50/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Horodatage</th>
                <th className="py-2.5 px-3">Action Réalisée</th>
                <th className="py-2.5 px-3">Adresse IP</th>
                <th className="py-2.5 px-3">Terminal Utilisé</th>
                <th className="py-2.5 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {securityLogs.map(log => (
                <tr key={log.id} className="hover:bg-blue-50">
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                  <td className="py-3 px-3 font-semibold text-blue-950">{log.action}</td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{log.ip}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{log.device}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Vérifié</span>
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
