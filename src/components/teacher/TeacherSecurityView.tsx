import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileCheck2,
  Sparkles,
  Ban,
  ShieldAlert,
  Laptop
} from 'lucide-react';

export const TeacherSecurityView: React.FC = () => {
  const { profile, triggerToast } = useTeacher();
  const [currentPin, setCurrentPin] = useState('1234');
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
    setNewPin('');
    setConfirmPin('');
    triggerToast('Code PIN de signature numérique mis à jour avec succès.');
  };

  const loginSessions = [
    { id: 'sess-1', device: 'Chrome sur macOS · MacBook Pro M3', ip: '197.149.208.45', location: 'Ratoma, Conakry, Guinée', time: 'Aujourd\'hui à 07:40', current: true },
    { id: 'sess-2', device: 'SmartSchool Mobile · Samsung Galaxy S23', ip: '197.149.208.78', location: 'Dixinn, Conakry, Guinée', time: 'Hier à 18:22', current: false },
    { id: 'sess-3', device: 'Firefox sur Windows 11 · Labo Informatique', ip: '196.224.12.10', location: 'Kaloum, Conakry, Guinée', time: '01 Nov 2026 à 09:15', current: false }
  ];

  const logs = [
    { id: 'log-1', action: 'Émargement de séance', details: 'Terminale SM (Chapitre 3 : Suites récurrentes)', time: '2026-11-03 10:05', status: 'success' },
    { id: 'log-2', action: 'Appel clôturé', details: 'Feuille d\'appel transmise à la Vie Scolaire', time: '2026-11-03 08:15', status: 'success' },
    { id: 'log-3', action: 'Dépôt sujet d\'examen', details: 'Baccalauréat Blanc Session 1 scellé sous pli numérique', time: '2026-11-02 16:35', status: 'success' },
    { id: 'log-4', action: 'Soumission des notes', details: 'Évaluation N°1 transmise au Directeur des Études', time: '2026-10-31 16:40', status: 'success' },
    { id: 'log-5', action: 'Connexion réussie 2FA', details: 'Ratoma, Conakry, Guinée (IP 197.149.208.45)', time: '2026-11-03 07:40', status: 'success' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <span>Sécurité du Compte, Droits & Historique d'Accès</span>
        </h1>
        <p className="text-xs text-slate-400">
          Double authentification (2FA), code confidentiel de visa pédagogique et frontière stricte des attributions
        </p>
      </div>

      {/* Strict Role Segregation Card: Ce qu'il peut faire VS Interdictions formelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ce qu'il peut faire */}
        <div className="rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
              Ce que l'Enseignant peut faire
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Enseigner uniquement dans les classes et matières qui lui sont attribuées par l'école.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Publier des cours, chapitres, modules et ressources multimédias (PDF, Word, Vidéos, Audios).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Émarger et signer numériquement les séances dans le Cahier de Textes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Créer des devoirs, recevoir les copies d'élèves, noter, annoter et retourner le corrigé.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Saisir les notes d'évaluations et publier les notes provisoires.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Faire l'appel en direct et transmettre la feuille d'absence à la Vie Scolaire.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Signaler les élèves en difficulté pédagogique à la Direction des Études.</span>
            </li>
          </ul>
        </div>

        {/* Ce qui lui est strictement interdit */}
        <div className="rounded-2xl bg-rose-950/20 border border-rose-500/30 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-rose-400">
            <Ban className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
              Ce qui lui est strictement interdit (Garde-fous)
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span><strong className="text-white">Accéder aux données d'autres écoles :</strong> L'isolation des données multi-écoles est totale et absolue.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span><strong className="text-white">Valider ou publier les bulletins scolaires officiels :</strong> Réservé exclusivement au Directeur des Études.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span><strong className="text-white">Créer ou modifier des classes ou des élèves :</strong> Prérogative exclusive du Secrétariat et de l'Admin École.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span><strong className="text-white">Intervenir sur la comptabilité :</strong> Aucun accès aux paiements, salaires ou frais de scolarité.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span><strong className="text-white">Modifier les paramètres techniques de l'établissement :</strong> Réservé à l'Admin École.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* PIN Signature Code & 2FA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PIN Signature Code */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Code PIN de Signature Électronique</h2>
              <p className="text-xs text-slate-400">Ce code certifie votre identité lors du visa des notes et de l'émargement</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-400">Statut du PIN actuel :</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
              Configuré (••••)
            </span>
          </div>

          <form onSubmit={handleUpdatePin} className="space-y-3 text-xs pt-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nouveau PIN (4 chiffres) *</label>
              <input 
                type="password" 
                maxLength={4}
                required
                placeholder="Ex: 5821"
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono tracking-widest text-center text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Confirmer le nouveau PIN *</label>
              <input 
                type="password" 
                maxLength={4}
                required
                placeholder="Ex: 5821"
                value={confirmPin}
                onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono tracking-widest text-center text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-md shadow-blue-600/30"
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
              <h2 className="text-base font-bold text-white">Authentification à Deux Facteurs (2FA)</h2>
              <p className="text-xs text-slate-400">Protection du compte enseignant par code SMS à chaque connexion</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-white">Validation 2FA par SMS</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Numéro certifié : {profile.phone}</div>
            </div>
            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                triggerToast(twoFactorEnabled ? '2FA désactivé' : '2FA activé avec succès');
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

          <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/40 text-[11px] text-slate-400 leading-relaxed">
            🔐 En activant la double authentification, une demande de confirmation est automatiquement envoyée sur votre téléphone certifié à chaque nouvelle session sur un appareil inconnu.
          </div>
        </div>
      </div>

      {/* Connexions Récentes & Sessions Actives */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-lg space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Laptop className="w-4 h-4 text-blue-400" />
          <span>Sessions Récentes & Historique de Connexion (IP & Appareils)</span>
        </h2>

        <div className="space-y-2.5">
          {loginSessions.map(sess => (
            <div 
              key={sess.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{sess.device}</span>
                    {sess.current && (
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Session actuelle
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    IP : {sess.ip} · {sess.location}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {sess.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-lg space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Journal d'Audit Pédagogique & Émargements</span>
        </h2>

        <div className="space-y-2.5">
          {logs.map(log => (
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
