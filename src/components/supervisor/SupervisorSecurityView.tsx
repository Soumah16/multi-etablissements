import React, { useState } from 'react';
import { useSupervisor } from '../../context/SupervisorContext';
import { 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  Ban, 
  Laptop, 
  Sparkles 
} from 'lucide-react';

export const SupervisorSecurityView: React.FC = () => {
  const { profile, updateProfile, triggerToast } = useSupervisor();
  const [currentPin, setCurrentPin] = useState(profile.pinCode || '7412');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(profile.twoFactorEnabled ?? true);

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      triggerToast('Le code PIN doit comporter exactement 4 chiffres.');
      return;
    }
    if (newPin !== confirmPin) {
      triggerToast('Les codes PIN ne correspondent pas.');
      return;
    }
    setCurrentPin(newPin);
    updateProfile({ pinCode: newPin });
    setNewPin('');
    setConfirmPin('');
    triggerToast('Code PIN de visa Vie Scolaire mis à jour avec succès.');
  };

  const loginSessions = [
    { id: 'sess-1', device: 'Terminal Mobile Surveillant · Samsung A54', ip: '197.149.208.12', location: 'Lambanyi, Conakry, Guinée', time: 'Aujourd\'hui à 07:15', current: true },
    { id: 'sess-2', device: 'Poste de Contrôle Portail · PC Windows 11', ip: '197.149.208.55', location: 'Ratoma, Conakry, Guinée', time: 'Hier à 17:30', current: false }
  ];

  const auditLogs = [
    { id: 'log-1', action: 'Billet de rentrée délivré', details: 'Billet N°103 pour Aboubacar Sidiki Camara (10ème A)', time: '2026-11-04 08:28' },
    { id: 'log-2', action: 'Incident consigné', details: 'Bagarre cour de récréation (Mohamed Lamine Camara)', time: '2026-11-04 10:20' },
    { id: 'log-3', action: 'Ronde de surveillance enregistrée', details: 'Portail Principal - Contrôle des uniformes et cartes', time: '2026-11-04 08:15' },
    { id: 'log-4', action: 'Connexion 2FA réussie', details: 'Portail Vie Scolaire Conakry (IP 197.149.208.12)', time: '2026-11-04 07:15' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-red-400" />
          <span>Sécurité, Code PIN & Droits Réglementaires</span>
        </h1>
        <p className="text-xs text-slate-400">
          Code confidentiel pour billets de rentrée, 2FA et étanchéité stricte des fonctions
        </p>
      </div>

      {/* Role Guardrails: Ce qu'il peut faire VS Interdictions formelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ce qu'il peut faire */}
        <div className="rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
              Ce que le Surveillant peut faire
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Superviser la discipline générale, les entrées, sorties et récréations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Enregistrer et vérifier les absences et retards remontés par les professeurs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Délivrer les billets de rentrée en classe après justification.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Consigner les infractions au règlement intérieur et appliquer les sanctions initiales.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Convoquer les parents d'élèves pour entretien disciplinaire.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Consigner les objets interdits confisqués (smartphones, etc.) sous clé.</span>
            </li>
          </ul>
        </div>

        {/* Ce qui lui est strictement interdit */}
        <div className="rounded-2xl bg-rose-950/20 border border-rose-500/30 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-rose-400">
            <Ban className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
              Ce qui lui est formellement interdit
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span><strong className="text-white">Intervenir dans la pédagogie :</strong> Ne peut ni noter, ni corriger, ni modifier les moyennes des élèves.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span><strong className="text-white">Modifier les bulletins scolaires :</strong> Prérogative exclusive du Directeur des Études.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span><strong className="text-white">Toucher à la gestion financière :</strong> Aucun accès aux paiements, scolarités ou encaissements.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span><strong className="text-white">Prononcer une exclusion définitive :</strong> Réservé au Conseil de Discipline et au Directeur.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span><strong className="text-white">Accéder aux données d'autres écoles :</strong> Étanchéité absolue inter-établissements.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* PIN & 2FA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PIN Code */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Code PIN de Signature des Billets</h2>
              <p className="text-xs text-slate-400">Code requis pour certifier électroniquement les billets de rentrée</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-400">Statut du PIN :</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
              Actif (••••)
            </span>
          </div>

          <form onSubmit={handleUpdatePin} className="space-y-3 text-xs pt-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nouveau PIN (4 chiffres) *</label>
              <input 
                type="password" 
                maxLength={4}
                required
                placeholder="Ex: 8520"
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono tracking-widest text-center text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Confirmer le PIN *</label>
              <input 
                type="password" 
                maxLength={4}
                required
                placeholder="Ex: 8520"
                value={confirmPin}
                onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono tracking-widest text-center text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors shadow-md shadow-red-600/30"
            >
              Mettre à jour le code PIN
            </button>
          </form>
        </div>

        {/* 2FA Protection */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Double Authentification (2FA)</h2>
              <p className="text-xs text-slate-400">Sécurité du compte surveillant par SMS</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-white">Validation 2FA par SMS</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Numéro : {profile.phone}</div>
            </div>
            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                triggerToast(twoFactorEnabled ? '2FA désactivé' : '2FA activé');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                twoFactorEnabled 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {twoFactorEnabled ? 'Actif ✓' : 'Inactif'}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/40 text-[11px] text-slate-400 leading-relaxed">
            🔐 Protège l'intégrité du registre des sanctions et empêche toute usurpation de signature sur les billets de rentrée.
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-lg space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Journal d'Audit & Historique Récent des Opérations</span>
        </h2>

        <div className="space-y-2.5">
          {auditLogs.map(log => (
            <div 
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">{log.action}</div>
                  <div className="text-[11px] text-slate-400">{log.details}</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {log.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
