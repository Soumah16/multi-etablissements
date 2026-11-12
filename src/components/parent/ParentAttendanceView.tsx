import React, { useState } from 'react';
import { useParent } from '../../context/ParentContext';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Send, 
  FileText,
  ShieldCheck
} from 'lucide-react';

export const ParentAttendanceView: React.FC = () => {
  const { selectedChild, showToast } = useParent();
  const [justifyModalOpen, setJustifyModalOpen] = useState(false);
  const [justificationReason, setJustificationReason] = useState('');
  const [selectedAbsenceDate, setSelectedAbsenceDate] = useState('28 Oct 2026');

  const attendanceLogs = [
    {
      id: 'att-1',
      date: '28 Oct 2026',
      period: '08:00 - 10:00 (2h)',
      subject: 'Mathématiques TSM',
      type: 'Absence',
      status: 'justifiee',
      reason: 'Rendez-vous médical dentaire certifié (ordonnance transmise au surveillant général).'
    },
    {
      id: 'att-2',
      date: '22 Oct 2026',
      period: '08:00 (15 min)',
      subject: 'Physique-Chimie',
      type: 'Retard',
      status: 'justifiee',
      reason: 'Embouteillages exceptionnels axe Cosa - Bambéto.'
    },
    {
      id: 'att-3',
      date: '14 Oct 2026',
      period: '08:00 (10 min)',
      subject: 'Français',
      type: 'Retard',
      status: 'tolere',
      reason: 'Pluie diluvienne matinale.'
    }
  ];

  const handleJustifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Justification pour le ${selectedAbsenceDate} transmise à la Vie Scolaire.`);
    setJustifyModalOpen(false);
    setJustificationReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Vie Scolaire & Présences
            </span>
            <span className="text-xs text-slate-400">Élève : {selectedChild.firstName} {selectedChild.lastName} ({selectedChild.className})</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white mt-1">Relevé des Absences & des Retards</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Historique officiel enregistré par les surveillants et transmission en ligne des justificatifs d'absence.
          </p>
        </div>

        <button
          onClick={() => setJustifyModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          <span>Transmettre un Justificatif</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 font-semibold">Total Heures d'Absence</div>
          <div className="text-2xl font-black text-white mt-1">{selectedChild.absencesCount}h</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">100% justifiées</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 font-semibold">Retards Enregistrés</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{selectedChild.delaysCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Moyenne trimestrielle basse</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 font-semibold">Statut Discipline</div>
          <div className="text-lg font-bold text-emerald-400 mt-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-5 h-5" />
            <span>Exemplaire</span>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase font-semibold bg-slate-800/40">
                <th className="py-3 px-4">Date & Créneau</th>
                <th className="py-3 px-4">Matière Concernée</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Motif & Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {attendanceLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white text-xs">{log.date}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{log.period}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-200 font-medium">{log.subject}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.type === 'Absence' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Justifiée</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-[11px] leading-relaxed max-w-md">
                    {log.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Justify Absence Modal */}
      {justifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Transmettre un motif d'absence</h3>
            <p className="text-xs text-slate-400">
              Envoyez un justificatif directement au Surveillant Général et à la Direction des Études.
            </p>

            <form onSubmit={handleJustifySubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Date concernée</label>
                <input
                  type="date"
                  required
                  value={selectedAbsenceDate}
                  onChange={(e) => setSelectedAbsenceDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Motif de l'absence / retard *</label>
                <textarea
                  rows={3}
                  required
                  value={justificationReason}
                  onChange={(e) => setJustificationReason(e.target.value)}
                  placeholder="ex: Maladie (paludisme), rendez-vous médical ou cas de force majeure familiale..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="p-3 rounded-lg border-2 border-dashed border-slate-700 bg-slate-800/40 text-center text-xs text-slate-400">
                Pièce jointe (Certificat médical ou ordonnance) : <strong className="text-blue-400">Optionnelle</strong>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setJustifyModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                >
                  Envoyer au secrétariat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
