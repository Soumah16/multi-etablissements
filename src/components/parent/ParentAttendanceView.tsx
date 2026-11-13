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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
              Vie Scolaire & Présences
            </span>
            <span className="text-xs text-slate-500">Élève : {selectedChild.firstName} {selectedChild.lastName} ({selectedChild.className})</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950 mt-1">Relevé des Absences & des Retards</h1>
          <p className="text-xs text-slate-500 mt-0.5">
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
        <div className="p-4 rounded-xl bg-white border border-blue-100 text-center">
          <div className="text-[11px] text-slate-500 font-semibold">Total Heures d'Absence</div>
          <div className="text-2xl font-black text-blue-950 mt-1">{selectedChild.absencesCount}h</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">100% justifiées</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 text-center">
          <div className="text-[11px] text-slate-500 font-semibold">Retards Enregistrés</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{selectedChild.delaysCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Moyenne trimestrielle basse</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 text-center">
          <div className="text-[11px] text-slate-500 font-semibold">Statut Discipline</div>
          <div className="text-lg font-bold text-emerald-600 mt-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-5 h-5" />
            <span>Exemplaire</span>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-blue-100 text-[11px] text-slate-500 uppercase font-semibold bg-blue-50/60">
                <th className="py-3 px-4">Date & Créneau</th>
                <th className="py-3 px-4">Matière Concernée</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Motif & Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {attendanceLogs.map(log => (
                <tr key={log.id} className="hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-blue-950 text-xs">{log.date}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{log.period}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-medium">{log.subject}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.type === 'Absence' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Justifiée</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-[11px] leading-relaxed max-w-md">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <h3 className="text-base font-bold text-blue-950">Transmettre un motif d'absence</h3>
            <p className="text-xs text-slate-500">
              Envoyez un justificatif directement au Surveillant Général et à la Direction des Études.
            </p>

            <form onSubmit={handleJustifySubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Date concernée</label>
                <input
                  type="date"
                  required
                  value={selectedAbsenceDate}
                  onChange={(e) => setSelectedAbsenceDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Motif de l'absence / retard *</label>
                <textarea
                  rows={3}
                  required
                  value={justificationReason}
                  onChange={(e) => setJustificationReason(e.target.value)}
                  placeholder="ex: Maladie (paludisme), rendez-vous médical ou cas de force majeure familiale..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                />
              </div>

              <div className="p-3 rounded-lg border-2 border-dashed border-slate-200 bg-blue-50/60 text-center text-xs text-slate-500">
                Pièce jointe (Certificat médical ou ordonnance) : <strong className="text-blue-600">Optionnelle</strong>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setJustifyModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-500 hover:text-blue-950"
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
