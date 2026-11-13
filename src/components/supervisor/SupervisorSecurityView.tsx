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
        <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-red-600" />
          <span>Sécurité, Code PIN & Droits Réglementaires</span>
        </h1>
        <p className="text-xs text-slate-500">
          Code confidentiel pour billets de rentrée, 2FA et étanchéité stricte des fonctions
        </p>
      </div>

      {/* Role Guardrails: Ce qu'il peut faire VS Interdictions formelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ce qu'il peut faire */}
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-sm text-blue-950 uppercase tracking-wider">
              Ce que le Surveillant peut faire
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Superviser la discipline générale, les entrées, sorties et récréations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Enregistrer et vérifier les absences et retards remontés par les professeurs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Délivrer les billets de rentrée en classe après justification.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Consigner les infractions au règlement intérieur et appliquer les sanctions initiales.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Convoquer les parents d'élèves pour entretien disciplinaire.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Consigner les objets interdits confisqués (smartphones, etc.) sous clé.</span>
            </li>
          </ul>
        </div>

        {/* Ce qui lui est strictement interdit */}
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-rose-600">
            <Ban className="w-5 h-5" />
            <h3 className="font-bold text-sm text-blue-950 uppercase tracking-wider">
              Ce qui lui est formellement interdit
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong className="text-blue-950">Intervenir dans la pédagogie :</strong> Ne peut ni noter, ni corriger, ni modifier les moyennes des élèves.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong className="text-blue-950">Modifier les bulletins scolaires :</strong> Prérogative exclusive du Directeur des Études.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong className="text-blue-950">Toucher à la gestion financière :</strong> Aucun accès aux paiements, scolarités ou encaissements.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong className="text-blue-950">Prononcer une exclusion définitive :</strong> Réservé au Conseil de Discipline et au Directeur.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span><strong className="text-blue-950">Accéder aux données d'autres écoles :</strong> Étanchéité absolue inter-établissements.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* PIN & 2FA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PIN Code */}
        <div className="rounded-2xl bg-white border border-blue-100 p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-950">Code PIN de Signature des Billets</h2>
              <p className="text-xs text-slate-500">Code requis pour certifier électroniquement les billets de rentrée</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">Statut du PIN :</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
              Actif (••••)
            </span>
          </div>

          <form onSubmit={handleUpdatePin} className="space-y-3 text-xs pt-2">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nouveau PIN (4 chiffres) *</label>
              <input 
                type="password" 
                maxLength={4}
                required
                placeholder="Ex: 8520"
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 font-mono tracking-widest text-center text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Confirmer le PIN *</label>
              <input 
                type="password" 
                maxLength={4}
                required
                placeholder="Ex: 8520"
                value={confirmPin}
                onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 font-mono tracking-widest text-center text-sm focus:outline-none focus:border-red-500"
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
        <div className="rounded-2xl bg-white border border-blue-100 p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-950">Double Authentification (2FA)</h2>
              <p className="text-xs text-slate-500">Sécurité du compte surveillant par SMS</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-blue-950">Validation 2FA par SMS</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Numéro : {profile.phone}</div>
            </div>
            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                triggerToast(twoFactorEnabled ? '2FA désactivé' : '2FA activé');
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

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            🔐 Protège l'intégrité du registre des sanctions et empêche toute usurpation de signature sur les billets de rentrée.
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="rounded-2xl bg-white border border-blue-100 p-6 shadow-lg space-y-4">
        <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Journal d'Audit & Historique Récent des Opérations</span>
        </h2>

        <div className="space-y-2.5">
          {auditLogs.map(log => (
            <div 
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-blue-50/60 border border-slate-200 text-xs"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-blue-950">{log.action}</div>
                  <div className="text-[11px] text-slate-500">{log.details}</div>
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
