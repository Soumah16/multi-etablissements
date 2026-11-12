import React, { useState } from 'react';
import { useSupervisor } from '../../context/SupervisorContext';
import { SecurityPatrol, ConfiscatedItem } from '../../types/supervisor';
import { 
  ShieldCheck, 
  Smartphone, 
  Plus, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Package, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';

export const SupervisorPatrolsView: React.FC = () => {
  const { patrols, addPatrol, confiscatedItems, addConfiscatedItem, returnConfiscatedItem, profile, triggerToast } = useSupervisor();
  const [patrolModalOpen, setPatrolModalOpen] = useState(false);
  const [confiscateModalOpen, setConfiscateModalOpen] = useState(false);

  // Patrol Form
  const [zone, setZone] = useState<SecurityPatrol['zone']>('Cour Centrale');
  const [patrolTime, setPatrolTime] = useState('10:00 - 10:30');
  const [observations, setObservations] = useState('');
  const [incidentDetected, setIncidentDetected] = useState(false);

  // Confiscated Form
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('Terminale Sciences Mathématiques (TSM)');
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState<ConfiscatedItem['itemType']>('Smartphone');
  const [location, setLocation] = useState('Armoire sécurisée Vie Scolaire (Casier N°04)');

  const handleCreatePatrol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observations.trim()) return;

    addPatrol({
      zone,
      time: patrolTime,
      date: new Date().toISOString().substring(0, 10),
      supervisorName: `${profile.firstName} ${profile.lastName}`,
      observations,
      incidentDetected
    });

    setPatrolModalOpen(false);
    setObservations('');
  };

  const handleCreateConfiscate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !itemName.trim()) return;

    addConfiscatedItem({
      studentName,
      className,
      itemName,
      itemType,
      confiscatedDate: new Date().toISOString().substring(0, 10),
      location
    });

    setConfiscateModalOpen(false);
    setStudentName('');
    setItemName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <span>Rondes de Surveillance & Objets Confisqués</span>
          </h1>
          <p className="text-xs text-slate-400">
            Contrôle des zones sensibles (portails, cour, couloirs) et registre sécurisé des objets consignés
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setPatrolModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Inscrire une Ronde</span>
          </button>
          <button
            onClick={() => setConfiscateModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Consigner un Objet</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Rondes de Surveillance */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Registre des Rondes de Surveillance ({patrols.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Quotidien</span>
          </div>

          <div className="space-y-3">
            {patrols.map(p => (
              <div 
                key={p.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs hover:border-slate-700 transition-all shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <span>{p.zone}</span>
                    {p.incidentDetected && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Incident signalé
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-slate-400">{p.date} · {p.time}</span>
                </div>

                <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                  {p.observations}
                </p>

                <div className="text-[10px] text-slate-500 font-mono">
                  Agent responsable : {p.supervisorName}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Registre des Objets Confisqués */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span>Objets Confisqués en Consigne ({confiscatedItems.length})</span>
            </h3>
            <span className="text-[11px] text-amber-400 font-mono">Armoire Sécurisée</span>
          </div>

          <div className="space-y-3">
            {confiscatedItems.map(item => (
              <div 
                key={item.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs hover:border-slate-700 transition-all shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{item.itemName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'consigne' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {item.status === 'consigne' ? 'En consigne' : 'Restitué au parent'}
                  </span>
                </div>

                <div className="space-y-1 text-slate-300">
                  <div>Élève : <strong className="text-white">{item.studentName}</strong> ({item.className})</div>
                  <div className="text-[11px] text-slate-400">Emplacement : {item.location}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Confisqué le {item.confiscatedDate}</div>
                </div>

                {item.status === 'consigne' && (
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => returnConfiscatedItem(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Restituer au Parent (Décharge signée)</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: New Patrol */}
      {patrolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Inscrire une Ronde de Surveillance</h3>
              <button onClick={() => setPatrolModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreatePatrol} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Zone inspectée *</label>
                <select 
                  value={zone}
                  onChange={e => setZone(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="Portail Principal">Portail Principal</option>
                  <option value="Cour Centrale">Cour Centrale & Terrains</option>
                  <option value="Couloirs Bâtiment Lycée">Couloirs Bâtiment Lycée</option>
                  <option value="Couloirs Collège">Couloirs Collège</option>
                  <option value="Laboratoires & Salle Info">Laboratoires & Salle Info</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Plage horaire *</label>
                <input 
                  type="text" 
                  value={patrolTime}
                  onChange={e => setPatrolTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Observations & Faits constatés *</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Décrivez l'ambiance, les éventuels rassemblements suspects, l'état des lieux..."
                  value={observations}
                  onChange={e => setObservations(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="inc"
                  checked={incidentDetected}
                  onChange={e => setIncidentDetected(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-0"
                />
                <label htmlFor="inc" className="text-slate-300 font-semibold cursor-pointer">
                  Incident disciplinaire détecté durant la ronde
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPatrolModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Enregistrer la Ronde
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Consign Item */}
      {confiscateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Consigner un Objet Interdit</h3>
              <button onClick={() => setConfiscateModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateConfiscate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Élève *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Ousmane Barry"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Classe *</label>
                <input 
                  type="text" 
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description de l'objet confisqué *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Smartphone iPhone 11 Noir avec écouteurs"
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Lieu de stockage sous clé *</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfiscateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Consigner sous Clé
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
