import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { StudentPedagogicalProfile } from '../../types/teacher';
import { 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Send, 
  Plus, 
  Phone, 
  Search, 
  Sparkles, 
  Filter,
  TrendingDown,
  Clock,
  HelpCircle,
  FileText
} from 'lucide-react';

export const TeacherMonitoringView: React.FC = () => {
  const { studentProfiles, reportStudentToDirection, addStudentObservation, classes, triggerToast } = useTeacher();
  const [filterMode, setFilterMode] = useState<'all' | 'difficulty'>('difficulty');
  const [selectedStudent, setSelectedStudent] = useState<StudentPedagogicalProfile | null>(
    studentProfiles.find(s => s.isDifficulty) || studentProfiles[0] || null
  );

  // New observation state
  const [obsText, setObsText] = useState('');
  const [recomText, setRecomText] = useState('');
  const [signalReason, setSignalReason] = useState('');
  const [signalModalOpen, setSignalModalOpen] = useState(false);

  const displayedStudents = studentProfiles.filter(s => {
    if (filterMode === 'difficulty') return s.isDifficulty || s.average < 12 || s.attendanceRate < 85;
    return true;
  });

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !obsText.trim()) return;

    addStudentObservation(
      selectedStudent.studentId, 
      obsText.trim(), 
      recomText.trim() || 'Poursuivre le suivi régulier.'
    );

    setObsText('');
    setRecomText('');
  };

  const handleSignalDirection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !signalReason.trim()) return;

    reportStudentToDirection(selectedStudent.studentId, signalReason.trim());
    setSignalModalOpen(false);
    setSignalReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <span>Suivi Pédagogique & Élèves en Difficulté</span>
          </h1>
          <p className="text-xs text-slate-400">
            Détection automatique des seuils d'alerte (Moyenne &lt; 10, Assiduité &lt; 85%, Retards répétés) et remédiation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('difficulty')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterMode === 'difficulty' 
                ? 'bg-amber-500 text-slate-950 shadow-md' 
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Élèves en Alerte uniquement
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterMode === 'all' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Tous les profils
          </button>
        </div>
      </div>

      {/* Main Layout: List on Left, Active Profile on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Cards */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Effectif sous surveillance ({displayedStudents.length})
          </div>

          <div className="space-y-2.5">
            {displayedStudents.map(std => {
              const isSelected = selectedStudent?.studentId === std.studentId;
              return (
                <div
                  key={std.studentId}
                  onClick={() => setSelectedStudent(std)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected 
                      ? 'bg-slate-800 border-amber-500/80 shadow-lg' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={std.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                        alt="" 
                        className="w-9 h-9 rounded-full object-cover border border-slate-700" 
                      />
                      <div>
                        <div className="font-bold text-sm text-white">{std.studentName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{std.studentMatricule}</div>
                      </div>
                    </div>

                    {std.isDifficulty && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Alerte
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1 border-t border-slate-800/80">
                    <div className="p-1.5 rounded bg-slate-950/60">
                      <div className="text-slate-400">Moyenne</div>
                      <div className={`font-bold font-mono ${std.average < 12 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {std.average}/20
                      </div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-950/60">
                      <div className="text-slate-400">Assiduité</div>
                      <div className={`font-bold font-mono ${std.attendanceRate < 85 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {std.attendanceRate}%
                      </div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-950/60">
                      <div className="text-slate-400">Retards</div>
                      <div className="font-bold text-slate-200 font-mono">
                        {std.lateCount}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Pedagogical Sheet */}
        <div className="lg:col-span-2 space-y-6">
          {selectedStudent ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedStudent.photo} 
                    alt="" 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-white">{selectedStudent.studentName}</h2>
                      {selectedStudent.reportedToDirection && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Signalé à la Direction
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {selectedStudent.className} · Matricule : <span className="font-mono text-slate-300">{selectedStudent.studentMatricule}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>Tuteur : {selectedStudent.parentName} ({selectedStudent.parentPhone})</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSignalModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Signaler à la Direction</span>
                </button>
              </div>

              {/* Status Diagnostic Card */}
              {selectedStudent.difficultyReason && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Motif du diagnostic de difficulté</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedStudent.difficultyReason}
                  </p>
                </div>
              )}

              {/* Observations History */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Observations & Faits Pédagogiques Notés</span>
                </h3>

                <div className="space-y-2">
                  {selectedStudent.observations.map((obs, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
                      • {obs}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations and Remediation */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Plan de Remédiation & Recommandations Proposées</span>
                </h3>

                <div className="space-y-2">
                  {selectedStudent.recommendations.map((rec, i) => (
                    <div key={i} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Observation & Recommendation Form */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
                  Ajouter une note de suivi pour {selectedStudent.studentName}
                </h4>

                <form onSubmit={handleAddObservation} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Constat pédagogique / observation</label>
                    <textarea 
                      rows={2}
                      required
                      placeholder="Ex: Amélioration notable sur le calcul des limites après la séance de tutorat..."
                      value={obsText}
                      onChange={e => setObsText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Action corrective / recommandation</label>
                    <input 
                      type="text"
                      placeholder="Ex: Donner 3 exercices d'entraînement ciblés pour vendredi..."
                      value={recomText}
                      onChange={e => setRecomText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                    >
                      Enregistrer l'Observation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
              Sélectionnez un élève dans la liste pour consulter sa fiche de suivi individualisée.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Report to Direction */}
      {signalModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Signalement Officiel à la Direction</h3>
              <button onClick={() => setSignalModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Vous signalez le dossier de <strong className="text-white">{selectedStudent.studentName}</strong> au Directeur des Études et au Conseiller Principal d'Éducation (CPE).
            </p>

            <form onSubmit={handleSignalDirection} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Motif formel du signalement *</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Décrivez précisément les défaillances constatées (chute des résultats, absentéisme, attitude)..."
                  value={signalReason}
                  onChange={e => setSignalReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSignalModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Transmettre à la Direction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
