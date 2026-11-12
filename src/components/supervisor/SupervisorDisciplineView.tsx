import React, { useState } from 'react';
import { useSupervisor } from '../../context/SupervisorContext';
import { DisciplinaryIncident } from '../../types/supervisor';
import { 
  Gavel, 
  AlertTriangle, 
  Plus, 
  Search, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Clock, 
  User, 
  Printer,
  ChevronDown
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const SupervisorDisciplineView: React.FC = () => {
  const { incidents, addIncident, resolveIncident, reportIncidentToDirector, triggerToast } = useSupervisor();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'mineure' | 'moyenne' | 'grave'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [resolveModalIncident, setResolveModalIncident] = useState<DisciplinaryIncident | null>(null);
  const [appliedSanction, setAppliedSanction] = useState<DisciplinaryIncident['sanctionType']>('Avertissement écrit');

  // Form states
  const [studentName, setStudentName] = useState('');
  const [studentMatricule, setStudentMatricule] = useState('');
  const [className, setClassName] = useState('1ère Sciences Expérimentales (1SE)');
  const [location, setLocation] = useState<DisciplinaryIncident['location']>('Cour de récréation');
  const [infractionType, setInfractionType] = useState<DisciplinaryIncident['infractionType']>('Usage interdit du smartphone');
  const [severity, setSeverity] = useState<DisciplinaryIncident['severity']>('moyenne');
  const [witnesses, setWitnesses] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [sanctionType, setSanctionType] = useState<DisciplinaryIncident['sanctionType']>('Heures de retenue / TIG');
  const [sanctionDuration, setSanctionDuration] = useState('2 heures');

  const filteredIncidents = incidents.filter(i => {
    const matchesSearch = i.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.className.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (severityFilter === 'all') return true;
    return i.severity === severityFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !reportDetails.trim()) return;

    const now = new Date();
    addIncident({
      studentId: `std-${Date.now()}`,
      studentName,
      studentMatricule: studentMatricule || 'LEC-2026-X',
      className,
      date: now.toISOString().substring(0, 10),
      time: now.toTimeString().substring(0, 5),
      location,
      infractionType,
      severity,
      witnesses,
      reportDetails,
      reportedBy: 'Surveillant de permanence',
      sanctionType,
      sanctionDuration,
      parentNotified: true,
      reportedToDirector: severity === 'grave',
      status: severity === 'grave' ? 'transmis_direction' : 'en_cours'
    });

    setModalOpen(false);
    setStudentName('');
    setStudentMatricule('');
    setReportDetails('');
    setWitnesses('');
  };

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveModalIncident) return;
    resolveIncident(resolveModalIncident.id, appliedSanction);
    setResolveModalIncident(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Gavel className="w-6 h-6 text-red-400" />
            <span>Registre Officiel des Incidents & Sanctions Disciplinaires</span>
          </h1>
          <p className="text-xs text-slate-400">
            Enregistrement circonstancié, échelle des sanctions MEPU-A et liaisons avec le Directeur
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Enregistrer un Incident</span>
          </button>
          <button
            onClick={() => triggerPrint('supervisor-discipline-printable-list', 'Registre_Incidents_Disciplinaires')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer Registre</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Rechercher par numéro, élève, infraction..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSeverityFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              severityFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tous ({incidents.length})
          </button>
          <button
            onClick={() => setSeverityFilter('mineure')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              severityFilter === 'mineure' ? 'bg-slate-900 text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mineurs
          </button>
          <button
            onClick={() => setSeverityFilter('moyenne')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              severityFilter === 'moyenne' ? 'bg-slate-900 text-orange-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Moyens
          </button>
          <button
            onClick={() => setSeverityFilter('grave')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              severityFilter === 'grave' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Graves
          </button>
        </div>
      </div>

      {/* Incident Cards */}
      <div id="supervisor-discipline-printable-list" className="space-y-4">
        {filteredIncidents.map(inc => (
          <div 
            key={inc.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl hover:border-slate-700 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  {inc.incidentNumber}
                </span>
                <span className="font-bold text-white text-base">{inc.studentName}</span>
                <span className="text-xs text-slate-400">({inc.className})</span>
                <span className="text-[10px] font-mono text-slate-500">Matricule : {inc.studentMatricule}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  inc.severity === 'grave'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : inc.severity === 'moyenne'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  Infraction {inc.severity}
                </span>

                {inc.status === 'transmis_direction' ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Send className="w-3 h-3" />
                    <span>Transmis Direction</span>
                  </span>
                ) : inc.status === 'resolu' ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Résolu</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    En cours de traitement
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="text-red-400">Nature :</span>
                  <span>{inc.infractionType}</span>
                </div>
                <p className="text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                  {inc.reportDetails}
                </p>
                {inc.witnesses && (
                  <div className="text-[11px] text-slate-400">
                    Témoins constatés : <strong className="text-slate-300">{inc.witnesses}</strong>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-1.5 text-xs">
                  <div className="text-slate-400">Sanction appliquée :</div>
                  <div className="font-bold text-purple-300 text-sm">{inc.sanctionType || 'En attente de décision'}</div>
                  {inc.sanctionDuration && (
                    <div className="text-[11px] text-slate-300 font-mono">{inc.sanctionDuration}</div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-700 flex flex-col gap-1.5">
                  {inc.status !== 'resolu' && (
                    <button
                      onClick={() => {
                        setResolveModalIncident(inc);
                        setAppliedSanction(inc.sanctionType || 'Avertissement écrit');
                      }}
                      className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                    >
                      Clôturer / Sanctionner
                    </button>
                  )}
                  {inc.status !== 'transmis_direction' && (
                    <button
                      onClick={() => reportIncidentToDirector(inc.id)}
                      className="w-full py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold text-xs transition-colors"
                    >
                      Signaler au Directeur
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Lieu : <strong className="text-slate-300">{inc.location}</strong> · Le {inc.date} à {inc.time}</span>
              <span>Rapporteur : {inc.reportedBy}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Incident */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Enregistrer un Incident Disciplinaire</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nom et Prénom de l'élève mis en cause *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Mohamed Lamine Camara"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Matricule</label>
                  <input 
                    type="text" 
                    placeholder="Ex: LEC-2026-019"
                    value={studentMatricule}
                    onChange={e => setStudentMatricule(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Classe *</label>
                  <select 
                    value={className}
                    onChange={e => setClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Terminale Sciences Mathématiques (TSM)">Terminale SM (TSM)</option>
                    <option value="1ère Sciences Expérimentales (1SE)">1ère Sci. Exp. (1SE)</option>
                    <option value="10ème Année A (Brevet BEPC)">10ème Année A</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lieu de l'incident *</label>
                  <select 
                    value={location}
                    onChange={e => setLocation(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Cour de récréation">Cour de récréation</option>
                    <option value="Salle de classe">Salle de classe</option>
                    <option value="Couloir">Couloir</option>
                    <option value="Portail d'entrée">Portail d'entrée</option>
                    <option value="Sanitaires">Sanitaires</option>
                    <option value="Autre">Autre lieu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Degré de gravité *</label>
                  <select 
                    value={severity}
                    onChange={e => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="mineure">Infraction Mineure</option>
                    <option value="moyenne">Infraction Moyenne</option>
                    <option value="grave">Infraction Majeure / Grave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nature de l'infraction (Règlement MEPU-A) *</label>
                <select 
                  value={infractionType}
                  onChange={e => setInfractionType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="Usage interdit du smartphone">Usage interdit du smartphone en classe</option>
                  <option value="Tenue non réglementaire (Uniforme)">Tenue non réglementaire / Manque d'écusson</option>
                  <option value="Bagarre / Violence physique">Bagarre / Violence physique</option>
                  <option value="Insolence / Manque de respect">Insolence / Manque de respect envers le personnel</option>
                  <option value="Bavardage / Perturbation de cours">Bavardage / Perturbation de cours</option>
                  <option value="Retards répétés">Retards répétés non justifiés</option>
                  <option value="Dégradation de matériel scolaire">Dégradation de matériel scolaire</option>
                  <option value="Fraude / Tricherie">Fraude / Tricherie</option>
                  <option value="Absence non autorisée (Fugue)">Absence non autorisée (Fugue du portail)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rapport circonstancié des faits *</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Décrivez précisément les faits, les propos tenus et les mesures d'urgence prises..."
                  value={reportDetails}
                  onChange={e => setReportDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sanction proposée</label>
                  <select 
                    value={sanctionType}
                    onChange={e => setSanctionType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Rappel à l'ordre">Rappel à l'ordre</option>
                    <option value="Avertissement écrit">Avertissement écrit</option>
                    <option value="Blâme disciplinaire">Blâme disciplinaire</option>
                    <option value="Heures de retenue / TIG">Heures de retenue / TIG</option>
                    <option value="Exclusion temporaire (1-3 jours)">Exclusion temporaire (1-3 jours)</option>
                    <option value="Convocation du Conseil de Discipline">Convocation du Conseil de Discipline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Durée / Modalité</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 2 heures le samedi"
                    value={sanctionDuration}
                    onChange={e => setSanctionDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Consigner l'Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Resolve Incident */}
      {resolveModalIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Clôturer l'Incident Disciplinaire</h3>
              <button onClick={() => setResolveModalIncident(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Élève concerné : <strong className="text-white">{resolveModalIncident.studentName}</strong> ({resolveModalIncident.className})
            </p>

            <form onSubmit={handleResolve} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sanction définitive appliquée</label>
                <select 
                  value={appliedSanction}
                  onChange={e => setAppliedSanction(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="Rappel à l'ordre">Rappel à l'ordre</option>
                  <option value="Avertissement écrit">Avertissement écrit</option>
                  <option value="Blâme disciplinaire">Blâme disciplinaire</option>
                  <option value="Heures de retenue / TIG">Heures de retenue / TIG</option>
                  <option value="Exclusion temporaire (1-3 jours)">Exclusion temporaire (1-3 jours)</option>
                  <option value="Convocation du Conseil de Discipline">Convocation du Conseil de Discipline</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolveModalIncident(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Marquer comme Résolu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
