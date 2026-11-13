import React, { useState } from 'react';
import { useSupervisor } from '../../context/SupervisorContext';
import { WatchlistStudent } from '../../types/supervisor';
import { 
  Eye, 
  Search, 
  Phone, 
  ShieldAlert, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  AlertTriangle,
  User,
  Sparkles
} from 'lucide-react';

export const SupervisorWatchlistView: React.FC = () => {
  const { watchlist, addWatchlistNote, setActiveSupervisorTab, triggerToast } = useSupervisor();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<WatchlistStudent | null>(watchlist[0] || null);
  const [newNote, setNewNote] = useState('');

  const filteredWatchlist = watchlist.filter(w => 
    w.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.studentMatricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !newNote.trim()) return;

    addWatchlistNote(selectedStudent.studentId, newNote.trim());
    setSelectedStudent(prev => prev ? {
      ...prev,
      supervisorNotes: [...prev.supervisorNotes, newNote.trim()]
    } : null);
    setNewNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <Eye className="w-6 h-6 text-cyan-600" />
            <span>Élèves sous Surveillance Spéciale (Dossiers Comportement)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Suivi individualisé des récidivistes, historique disciplinaire et liaison directe avec les familles
          </p>
        </div>

        <button
          onClick={() => setActiveSupervisorTab('parent_meetings')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span>Convoquer les Parents</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Rechercher un élève..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-blue-100 text-xs text-blue-950 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2.5">
            {filteredWatchlist.map(std => {
              const isSelected = selectedStudent?.studentId === std.studentId;
              return (
                <div
                  key={std.studentId}
                  onClick={() => setSelectedStudent(std)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected 
                      ? 'bg-slate-50 border-cyan-500 shadow-lg' 
                      : 'bg-white border-blue-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={std.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'} 
                        alt="" 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                      />
                      <div>
                        <div className="font-bold text-blue-950 text-sm">{std.studentName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{std.className}</div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      std.riskLevel === 'eleve' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {std.riskLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1 border-t border-blue-100">
                    <div className="p-1 rounded bg-blue-50/70">
                      <div className="text-slate-500">Absences</div>
                      <div className="font-bold text-rose-600">{std.totalAbsences}</div>
                    </div>
                    <div className="p-1 rounded bg-blue-50/70">
                      <div className="text-slate-500">Retards</div>
                      <div className="font-bold text-amber-700">{std.totalLate}</div>
                    </div>
                    <div className="p-1 rounded bg-blue-50/70">
                      <div className="text-slate-500">Note Cond.</div>
                      <div className="font-bold text-cyan-600">{std.behaviorScore}/20</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Dossier */}
        <div className="lg:col-span-2 space-y-6">
          {selectedStudent ? (
            <div className="rounded-2xl bg-white border border-blue-100 p-6 space-y-6">
              {/* Header Profile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedStudent.photo} 
                    alt="" 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-md" 
                  />
                  <div>
                    <h2 className="text-lg font-black text-blue-950">{selectedStudent.studentName}</h2>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {selectedStudent.className} · Matricule : <span className="font-mono text-slate-700">{selectedStudent.studentMatricule}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tuteur légal : <strong className="text-slate-900">{selectedStudent.parentName}</strong> ({selectedStudent.parentPhone})</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 border border-slate-200 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Note de Conduite</div>
                  <div className="text-xl font-black text-cyan-600 font-mono mt-0.5">
                    {selectedStudent.behaviorScore} / 20
                  </div>
                </div>
              </div>

              {/* Behavior History & Notes */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-600" />
                  <span>Observations & Faits Consignés par la Vie Scolaire</span>
                </h3>

                <div className="space-y-2">
                  {selectedStudent.supervisorNotes.map((note, i) => (
                    <div key={i} className="p-3 rounded-xl bg-blue-50/60 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      • {note}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Note Form */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Ajouter un fait ou une consigne pour {selectedStudent.studentName}
                </h4>

                <form onSubmit={handleAddNote} className="space-y-3 text-xs">
                  <textarea 
                    rows={2}
                    required
                    placeholder="Ex: Élève convoqué ce matin pour rappel au règlement. Engagement signé..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-blue-950 focus:outline-none focus:border-cyan-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                    >
                      Enregistrer au Dossier
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-blue-100 text-xs">
              Sélectionnez un élève dans la liste pour consulter sa fiche disciplinaire.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
