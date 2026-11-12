import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { DisciplinaryIncident } from '../../types/director';
import { 
  ShieldAlert, 
  Search, 
  Check, 
  X, 
  AlertTriangle, 
  Gavel, 
  CheckCircle2, 
  Clock, 
  User, 
  FileText,
  Lock
} from 'lucide-react';

export const DisciplinaryView: React.FC = () => {
  const { disciplineIncidents, validateIncidentSanction, rejectIncident } = useDirector();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncidentForSanction, setSelectedIncidentForSanction] = useState<DisciplinaryIncident | null>(null);
  const [chosenSanction, setChosenSanction] = useState<string>('Avertissement écrit');
  const [directorNotes, setDirectorNotes] = useState('');

  const filteredIncidents = disciplineIncidents.filter(inc => 
    inc.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.incidentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = disciplineIncidents.filter(i => i.directorStatus === 'en_attente').length;

  const handleOpenSanctionModal = (inc: DisciplinaryIncident) => {
    setSelectedIncidentForSanction(inc);
    setChosenSanction(inc.proposedSanction);
    setDirectorNotes(inc.directorNotes || '');
  };

  const handleConfirmSanction = () => {
    if (selectedIncidentForSanction) {
      validateIncidentSanction(selectedIncidentForSanction.id, chosenSanction, directorNotes);
      setSelectedIncidentForSanction(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Vie Scolaire & Conseil de Discipline
            </span>
            <span className="text-xs text-slate-400">Rapports du Surveillant Général</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>Discipline, Rapports d'Incidents & Sanctions</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Arbitrage officiel du Directeur sur les propositions de sanctions formulées par le corps éducatif.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
          <span className="text-[10px] uppercase font-semibold text-rose-300 block">Dossiers en attente de visa</span>
          <span className="text-lg font-bold text-white font-mono">{pendingCount} rapports</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un rapport par nom d'élève, type d'infraction ou classe..."
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden"
        />
      </div>

      {/* Incidents Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Date & Heure</th>
                <th className="py-3 px-3">Élève Impliqué</th>
                <th className="py-3 px-3">Classe</th>
                <th className="py-3 px-3">Type d'Infraction</th>
                <th className="py-3 px-3">Rapporteur</th>
                <th className="py-3 px-3">Sanction Proposée</th>
                <th className="py-3 px-3">Statut Direction</th>
                <th className="py-3 px-4 text-right">Décision Directeur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredIncidents.map(inc => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {inc.date}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={inc.studentPhoto} 
                        alt="" 
                        className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0" 
                      />
                      <span className="font-bold text-white">{inc.studentName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-medium">
                    {inc.className}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      inc.severity === 'critique' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                      inc.severity === 'grave' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {inc.incidentType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    <div>{inc.reportedByName}</div>
                    <div className="text-[10px] text-slate-500">{inc.reportedByRole}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-200 text-[11px]">
                    {inc.proposedSanction}
                  </td>
                  <td className="py-3 px-3">
                    {inc.directorStatus === 'validee' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Validée ({inc.finalSanction})
                      </span>
                    ) : inc.directorStatus === 'rejetee' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        Classé sans suite
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        En attente visa Directeur
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {inc.directorStatus === 'en_attente' ? (
                      <button
                        onClick={() => handleOpenSanctionModal(inc)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 flex items-center gap-1.5 ml-auto"
                        title="Statuer sur la sanction (PIN/2FA)"
                      >
                        <Gavel className="w-3.5 h-3.5" />
                        <span>Statuer</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Décision arrêtée</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sanction Validation Modal */}
      {selectedIncidentForSanction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-rose-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Délibération Disciplinaire du Directeur
                  </h3>
                  <p className="text-xs text-slate-400">Dossier de {selectedIncidentForSanction.studentName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedIncidentForSanction(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Incident Summary */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Infraction : <strong className="text-white">{selectedIncidentForSanction.incidentType}</strong></span>
                <span>Signalé par : {selectedIncidentForSanction.reportedByName}</span>
              </div>
              <p className="text-slate-200 mt-1 leading-relaxed">
                "{selectedIncidentForSanction.description}"
              </p>
            </div>

            {/* Sanction Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sanction Définitive Adoptée par la Direction :
              </label>
              <select
                value={chosenSanction}
                onChange={(e) => setChosenSanction(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
              >
                <option value="Avertissement verbal">Avertissement verbal</option>
                <option value="Avertissement écrit">Avertissement écrit consigné</option>
                <option value="Blâme avec mention au dossier">Blâme avec mention au dossier</option>
                <option value="Retenue 2 heures le samedi matin">Retenue 2 heures le samedi matin</option>
                <option value="Exclusion temporaire (3 jours)">Exclusion temporaire (3 jours)</option>
                <option value="Exclusion temporaire (8 jours)">Exclusion temporaire (8 jours)</option>
                <option value="Convocation du Conseil de Discipline">Convocation du Conseil de Discipline</option>
              </select>
            </div>

            {/* Director Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Motivations & Mesures d'accompagnement éducatif :
              </label>
              <textarea
                rows={3}
                value={directorNotes}
                onChange={(e) => setDirectorNotes(e.target.value)}
                placeholder="Indiquez ici les conditions de retour ou le travail réparateur..."
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>La validation de cette sanction requiert votre code PIN 6 chiffres et 2FA.</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  rejectIncident(selectedIncidentForSanction.id, 'Classé sans suite après entretien.');
                  setSelectedIncidentForSanction(null);
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Classer Sans Suite
              </button>
              <button
                type="button"
                onClick={handleConfirmSanction}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20"
              >
                <Gavel className="w-4 h-4" />
                <span>Valider la Sanction (PIN/2FA)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
