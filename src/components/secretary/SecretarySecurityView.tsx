import React, { useState } from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  Mail, 
  History, 
  CheckCircle2, 
  Check, 
  AlertTriangle,
  Lock,
  XCircle,
  Info
} from 'lucide-react';

export const SecretarySecurityView: React.FC = () => {
  const { profile, updateProfile, securityLogs, showToast } = useSecretary();
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email' | 'app'>(profile.twoFactorMethod);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave2fa = (m: 'sms' | 'email' | 'app') => {
    setSelectedMethod(m);
    updateProfile({ twoFactorMethod: m });
    showToast(`Méthode 2FA mise à jour : ${m.toUpperCase()}`);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      showToast('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Contrôle d'Accès & Traçabilité
            </span>
            <span className="text-xs text-slate-400">Sécurité du Guichet Administratif</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
            <span>Sécurité, Double Authentification & Journal d'Accès</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Protection des données personnelles des familles, paramètres de double authentification et journal des connexions.
          </p>
        </div>
      </div>

      {/* Permissions & Boundaries Notice (User Requirement Checklist) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ce que la secrétaire peut voir et faire */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Prérogatives Administratives de la Secrétaire</span>
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>✅ Inscription et gestion complète des élèves</li>
            <li>✅ Gestion des comptes et dossiers des parents d'élèves</li>
            <li>✅ Génération automatique des cartes scolaires & QR Codes</li>
            <li>✅ Délivrance des certificats et attestations officielles</li>
            <li>✅ Enregistrement des transferts scolaires entrants et sortants</li>
            <li>✅ Planification des rendez-vous au guichet et communication</li>
          </ul>
        </div>

        {/* Ce que la secrétaire NE PEUT PAS faire */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/30 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            <span>Limites Strictes (Séparation des Rôles)</span>
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>❌ Ne peut pas ajouter ou modifier des notes d'élèves</li>
            <li>❌ Ne peut pas viser ni valider des bulletins scolaires (Directeur)</li>
            <li>❌ Ne peut pas valider ni publier des examens académiques</li>
            <li>❌ Ne peut pas modifier la comptabilité ni encaisser les paiements (Comptable)</li>
            <li>❌ Ne peut pas créer de professeurs ni d'administrateurs (Admin École)</li>
            <li>❌ Aucun accès aux données des autres établissements (Isolation Multi-Tenant)</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2FA Config */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Double Authentification (2FA)</h3>
                <p className="text-xs text-slate-400">Requis lors de la connexion sur nouvel appareil</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Actif
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { id: 'sms', label: 'SMS Sécurisé', desc: `Code temporaire envoyé au ${profile.phone}`, icon: <Smartphone className="w-4 h-4 text-teal-400" /> },
              { id: 'email', label: 'Email Institutionnel', desc: `Code temporaire envoyé au ${profile.email}`, icon: <Mail className="w-4 h-4 text-blue-400" /> },
              { id: 'app', label: 'Application Authenticator (TOTP)', desc: 'Google Authenticator / Microsoft Authenticator', icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> }
            ].map(method => (
              <div
                key={method.id}
                onClick={() => handleSave2fa(method.id as any)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedMethod === method.id
                    ? 'bg-teal-600/15 border-teal-500 text-white'
                    : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {method.icon}
                  <div>
                    <div className="font-bold text-xs">{method.label}</div>
                    <div className="text-[11px] text-slate-400">{method.desc}</div>
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Mot de Passe du Secrétariat</h3>
                <p className="text-xs text-slate-400">Modifiez votre mot de passe d'accès administratif</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            {passwordChangeSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Mot de passe mis à jour avec succès !</span>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mot de passe actuel</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Confirmer</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
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
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <History className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-bold text-white">Journal d'Audit du Secrétariat Général</h3>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
            <tr>
              <th className="py-2.5 px-4">Horodatage</th>
              <th className="py-2.5 px-3">Action Réalisée</th>
              <th className="py-2.5 px-3">Adresse IP</th>
              <th className="py-2.5 px-3">Terminal Utilisé</th>
              <th className="py-2.5 px-4 text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {securityLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{log.timestamp}</td>
                <td className="py-3 px-3 font-semibold text-white">{log.action}</td>
                <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{log.ip}</td>
                <td className="py-3 px-3 text-slate-400 text-[11px]">{log.device}</td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
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
  );
};
