import React, { useState } from 'react';
import { useAccountant } from '../../context/AccountantContext';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck2, 
  XCircle,
  Eye,
  Ban,
  Sparkles
} from 'lucide-react';

export const AccountantSecurityView: React.FC = () => {
  const { profile, updateProfile, auditLogs, triggerToast, formatGnf } = useAccountant();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(profile.twoFactorEnabled);

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 6) {
      triggerToast('Le code PIN comptable doit comporter exactement 6 chiffres.');
      return;
    }
    if (newPin !== confirmPin) {
      triggerToast('Les nouveaux codes PIN ne correspondent pas.');
      return;
    }
    updateProfile({ pinHash: newPin });
    setNewPin('');
    setConfirmPin('');
    setCurrentPin('');
    triggerToast('Code PIN comptable à 6 chiffres mis à jour avec succès.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <span>Sécurité Financière, Code PIN & Journal d'Audit</span>
        </h1>
        <p className="text-xs text-slate-500">
          Protection de la caisse par code PIN 6 chiffres, authentification 2FA et traçabilité inviolable
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 6-Digit Accounting PIN */}
        <div className="rounded-2xl bg-white border border-blue-100 p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-950">Code PIN Comptable (6 chiffres)</h2>
              <p className="text-xs text-slate-500">Requis pour l'annulation de reçu, la modification de paiement ou la suppression</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">Statut du PIN actuel :</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
              Actif (••••••)
            </span>
          </div>

          <form onSubmit={handleUpdatePin} className="space-y-3 text-xs pt-1">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nouveau PIN (6 chiffres) *</label>
              <input 
                type="password" 
                maxLength={6}
                required
                placeholder="Ex: 849201"
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 font-mono tracking-widest text-center text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Confirmer le nouveau PIN *</label>
              <input 
                type="password" 
                maxLength={6}
                required
                placeholder="Ex: 849201"
                value={confirmPin}
                onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 font-mono tracking-widest text-center text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow-md shadow-amber-500/20"
            >
              Mettre à jour le PIN 6 chiffres
            </button>
          </form>
        </div>

        {/* 2FA & Role Guardrails */}
        <div className="rounded-2xl bg-white border border-blue-100 p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-950">Authentification Forte à 2 Facteurs</h2>
              <p className="text-xs text-slate-500">Protection par SMS et Google Authenticator</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-blue-950">Validation 2FA par SMS</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Numéro vérifié : {profile.phone}</div>
            </div>
            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                updateProfile({ twoFactorEnabled: !twoFactorEnabled });
                triggerToast(!twoFactorEnabled ? '2FA activé avec succès' : '2FA désactivé');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                twoFactorEnabled 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-100 text-slate-500 hover:text-blue-950'
              }`}
            >
              {twoFactorEnabled ? 'Actif ✓' : 'Inactif'}
            </button>
          </div>

          {/* Strict Role Guardrails according to specifications */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ce que le Comptable peut faire</span>
              </div>
              <ul className="text-[10px] text-slate-700 space-y-1 list-disc list-inside">
                <li>Encaisser les frais scolaires</li>
                <li>Délivrer des reçus certifiés avec QR Code</li>
                <li>Gérer les dépenses et salaires</li>
                <li>Suivre les débiteurs et relancer</li>
                <li>Générer les rapports financiers</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
              <div className="font-bold text-rose-700 flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5 text-rose-600" />
                <span>Interdictions Strictes</span>
              </div>
              <ul className="text-[10px] text-slate-700 space-y-1 list-disc list-inside">
                <li>Modifier ou ajouter des notes</li>
                <li>Valider les bulletins ou examens</li>
                <li>Créer des enseignants ou élèves</li>
                <li>Modifier les paramètres système</li>
                <li>Accéder aux autres écoles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Audit Trail */}
      <div className="rounded-2xl bg-white border border-blue-100 p-6 shadow-lg space-y-4">
        <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Journal d'Audit Financier & Traçabilité Complète</span>
        </h2>

        <div className="space-y-2.5">
          {auditLogs.map(log => (
            <div 
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-blue-50/60 border border-slate-200 text-xs hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-blue-950 flex items-center gap-2">
                    <span>{log.action}</span>
                    {log.amountGnf && (
                      <span className="font-mono text-emerald-600 font-semibold">({formatGnf(log.amountGnf)})</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">{log.details}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono shrink-0">
                <span>IP: {log.ipAddress}</span>
                <span>·</span>
                <span>{log.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
