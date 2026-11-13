import React, { useState } from 'react';
import { useSupervisor } from '../../context/SupervisorContext';
import { 
  ClipboardCheck, 
  Clock, 
  Users, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  FileCheck, 
  Printer, 
  PhoneCall, 
  MessageSquare
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const SupervisorAttendanceView: React.FC = () => {
  const { 
    attendanceRecords, 
    justifyAttendanceRecord, 
    notifyParentSms, 
    setActiveSupervisorTab,
    triggerToast 
  } = useSupervisor();

  const [filterType, setFilterType] = useState<'all' | 'absent' | 'retard' | 'non_justifie'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecordForJustify, setSelectedRecordForJustify] = useState<string | null>(null);
  const [justifyReason, setJustifyReason] = useState('');

  const filteredRecords = attendanceRecords.filter(r => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.studentMatricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.className.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'absent') return r.type === 'absent';
    if (filterType === 'retard') return r.type === 'retard';
    if (filterType === 'non_justifie') return r.status === 'non_justifie';
    return true;
  });

  const handleConfirmJustify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordForJustify || !justifyReason.trim()) return;

    justifyAttendanceRecord(selectedRecordForJustify, justifyReason.trim());
    setSelectedRecordForJustify(null);
    setJustifyReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <ClipboardCheck className="w-6 h-6 text-red-600" />
            <span>Registre Central des Absences & Retards</span>
          </h1>
          <p className="text-xs text-slate-500">
            Remontées d'appels en direct des enseignants, pointage au portail et régularisation des absences
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveSupervisorTab('admission_slips')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            <span>Émettre un Billet de Rentrée</span>
          </button>
          <button
            onClick={() => triggerPrint('supervisor-attendance-printable-table', 'Registre_Assiduite_Vie_Scolaire')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-100 text-slate-900 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Rechercher par élève, classe ou matricule..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Clean Segmented Filter Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-blue-50/60 rounded-xl border border-slate-200 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'all' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-500 hover:text-blue-950'
            }`}
          >
            Tous ({attendanceRecords.length})
          </button>
          <button
            onClick={() => setFilterType('absent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'absent' ? 'bg-rose-50 text-rose-700 shadow-xs' : 'text-slate-500 hover:text-blue-950'
            }`}
          >
            Absents ({attendanceRecords.filter(r => r.type === 'absent').length})
          </button>
          <button
            onClick={() => setFilterType('retard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'retard' ? 'bg-amber-50 text-amber-700 shadow-xs' : 'text-slate-500 hover:text-blue-950'
            }`}
          >
            Retards ({attendanceRecords.filter(r => r.type === 'retard').length})
          </button>
          <button
            onClick={() => setFilterType('non_justifie')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === 'non_justifie' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-500 hover:text-blue-950'
            }`}
          >
            Non Justifiés ({attendanceRecords.filter(r => r.status === 'non_justifie').length})
          </button>
        </div>
      </div>

      {/* Table of Records */}
      <div id="supervisor-attendance-printable-table" className="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-xl">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-blue-50/70 text-[11px] uppercase font-bold text-slate-500 border-b border-blue-100">
            <tr>
              <th className="py-3 px-4">Élève & Classe</th>
              <th className="py-3 px-3">Date & Heure</th>
              <th className="py-3 px-3 text-center">Type</th>
              <th className="py-3 px-3">Matière & Enseignant</th>
              <th className="py-3 px-3">Statut de Justification</th>
              <th className="py-3 px-4 text-right">Actions Vie Scolaire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100 font-medium">
            {filteredRecords.map(rec => (
              <tr key={rec.id} className="hover:bg-blue-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-blue-950 text-xs">{rec.studentName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {rec.className} · {rec.studentMatricule}
                  </div>
                </td>

                <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                  {rec.date} à {rec.time}
                </td>

                <td className="py-3 px-3 text-center">
                  {rec.type === 'absent' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      Absent
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Retard {rec.minutesLate ? `(${rec.minutesLate} min)` : ''}
                    </span>
                  )}
                </td>

                <td className="py-3 px-3">
                  <div className="text-blue-950 font-medium">{rec.subjectTaught}</div>
                  <div className="text-[10px] text-slate-500">{rec.teacherName}</div>
                </td>

                <td className="py-3 px-3">
                  {rec.status === 'justifie' ? (
                    <div className="text-emerald-600 flex items-center gap-1 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[180px]" title={rec.justificationReason}>
                        {rec.justificationReason || 'Justifié'}
                      </span>
                    </div>
                  ) : rec.status === 'en_attente' ? (
                    <span className="text-amber-700 text-[11px]">
                      ⏳ En attente de justificatif
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold text-[11px]">
                      ✕ Non justifié
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {rec.status !== 'justifie' && (
                      <button
                        onClick={() => setSelectedRecordForJustify(rec.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold transition-colors"
                      >
                        Justifier
                      </button>
                    )}

                    <button
                      onClick={() => notifyParentSms(rec.id)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        rec.notifiedParent 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-blue-950'
                      }`}
                      title={rec.notifiedParent ? 'SMS déjà envoyé au parent' : 'Envoyer alerte SMS au tuteur'}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Justify Record */}
      {selectedRecordForJustify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-blue-100 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-bold text-base text-blue-950">Régulariser une Absence ou un Retard</h3>
              <button onClick={() => setSelectedRecordForJustify(null)} className="text-slate-500 hover:text-blue-950">✕</button>
            </div>

            <form onSubmit={handleConfirmJustify} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Motif formel de la justification *</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Ex: Certificat médical présenté par le tuteur, panne de transport régularisée..."
                  value={justifyReason}
                  onChange={e => setJustifyReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-3 border-t border-blue-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecordForJustify(null)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-blue-950 bg-slate-50 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Valider et Régulariser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
