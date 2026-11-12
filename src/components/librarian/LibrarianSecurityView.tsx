import React, { useState } from 'react';
import { useLibrarian } from '../../context/LibrarianContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldX, 
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';

export const LibrarianSecurityView: React.FC = () => {
  const { profile, updateProfile, showToast } = useLibrarian();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [twoFactor, setTwoFactor] = useState(profile.twoFactorEnabled);

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
    setCurrentPin('');
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
        <h1 className="text-xl md:text-2xl font-black text-white">Sécurité & Habilitations Bibliothécaire</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Gestion du code PIN 6 chiffres, authentification double facteur et strict respect du périmètre documentaire.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* PIN & Authentication Settings */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Code PIN Rapide (6 chiffres)</h2>
          </div>
          <p className="text-xs text-slate-400">
            Utilisé pour valider instantanément les opérations sensibles (clôture d'emprunt litigieux, déclaration de perte, radiation d'ouvrage).
          </p>

          <form onSubmit={handleUpdatePin} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Nouveau Code PIN (6 chiffres)</label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white font-mono tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Confirmer le Nouveau Code PIN</label>
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white font-mono tracking-widest"
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
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Double Authentification (2FA)</div>
                <div className="text-[11px] text-slate-400">Code SMS Orange / MTN à la connexion</div>
              </div>
            </div>
            <button
              onClick={handleToggle2fa}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                twoFactor 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {twoFactor ? 'Activée' : 'Désactivée'}
            </button>
          </div>
        </div>

        {/* Strict Functional Prohibitions (CE QUE LE BIBLIOTHÉCAIRE NE PEUT PAS FAIRE) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertOctagon className="w-4 h-4" />
            <h2 className="text-sm font-bold text-white">Séparation des Pouvoirs & Règles ERP</h2>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Pour garantir l'intégrité pédagogique et financière de l'établissement, le compte Bibliothécaire applique une politique d'isolation stricte (Role-Based Access Control) :
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-start gap-3">
              <ShieldX className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-rose-300">Interdiction de Gérer les Notes</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Aucun accès en écriture aux devoirs, interrogations, coefficients ou relevés de notes des élèves.
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-start gap-3">
              <ShieldX className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-rose-300">Interdiction d'Encaisser les Paiements</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Les frais de scolarité et salaires relèvent exclusivement du Chef Comptable. Seules les amendes de perte d'ouvrages sont tracées dans le registre de prêt.
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-start gap-3">
              <ShieldX className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-rose-300">Interdiction de Modifier les Bulletins</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  La délivrance et validation des bulletins officiels et attestations dépendent uniquement du Directeur des Études et de l'Admin École.
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-emerald-300">Pouvoirs Concédés au Bibliothécaire</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Gestion intégrale du fonds physique, téléversement de ressources numériques, attribution des QR Codes et enregistrement des emprunts/retours.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
