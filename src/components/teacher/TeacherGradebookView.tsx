import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { 
  FileSpreadsheet, 
  Plus, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Calculator, 
  Printer, 
  Download, 
  Search, 
  Award, 
  Eye, 
  EyeOff, 
  Trash2, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const TeacherGradebookView: React.FC = () => {
  const { 
    evaluations, 
    updateStudentGrade, 
    updateStudentAppreciation, 
    deleteStudentGrade,
    submitEvaluationToDirector,
    togglePublishProvisionalGrades,
    classes,
    addEvaluation 
  } = useTeacher();

  const [selectedEvalId, setSelectedEvalId] = useState<string>(evaluations[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [newEvalModalOpen, setNewEvalModalOpen] = useState(false);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<{ id: string; name: string } | null>(null);

  // New evaluation form state
  const [newEvalTitle, setNewEvalTitle] = useState('');
  const [newEvalClassId, setNewEvalClassId] = useState('cls-tsm');
  const [newEvalSubject, setNewEvalSubject] = useState('Mathématiques');
  const [newEvalTerm, setNewEvalTerm] = useState<'Trimestre 1' | 'Trimestre 2' | 'Trimestre 3'>('Trimestre 1');
  const [newEvalType, setNewEvalType] = useState<'controle_continu' | 'examen' | 'test' | 'quiz'>('controle_continu');
  const [newEvalCoef, setNewEvalCoef] = useState(5);
  const [newEvalDuration, setNewEvalDuration] = useState(120);

  const currentEval = evaluations.find(e => e.id === selectedEvalId) || evaluations[0];

  const handleCreateEval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvalTitle.trim()) return;

    const targetClass = classes.find(c => c.id === newEvalClassId);
    
    // Default student list based on class
    const sampleStudents = [
      { id: 'std-001', matricule: 'LEC-2026-001', fullName: 'Mamadou Alpha Diallo' },
      { id: 'std-002', matricule: 'LEC-2026-002', fullName: 'Fatoumata Binta Bah' },
      { id: 'std-003', matricule: 'LEC-2026-003', fullName: 'Ibrahima Sory Bangoura' },
      { id: 'std-004', matricule: 'LEC-2026-004', fullName: 'Mariama Camara' },
      { id: 'std-005', matricule: 'LEC-2026-005', fullName: 'Ousmane Barry' }
    ];

    addEvaluation({
      title: newEvalTitle,
      classId: newEvalClassId,
      className: targetClass ? targetClass.name : 'Terminale SM',
      subject: newEvalSubject,
      term: newEvalTerm,
      coefficient: newEvalCoef,
      maxScore: 20,
      durationMinutes: newEvalDuration,
      type: newEvalType,
      date: new Date().toISOString().substring(0, 10),
      students: sampleStudents
    });

    setNewEvalModalOpen(false);
    setNewEvalTitle('');
  };

  const filteredGrades = currentEval?.grades.filter(g => 
    g.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getScoreColor = (val?: number) => {
    if (val === undefined || isNaN(val)) return 'text-slate-500';
    if (val >= 14) return 'text-emerald-400 font-bold';
    if (val >= 10) return 'text-blue-400 font-semibold';
    return 'text-rose-400 font-bold';
  };

  const averageOfSession = currentEval?.grades.length 
    ? (currentEval.grades.reduce((acc, g) => acc + (g.average || 0), 0) / currentEval.grades.length).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            <span>Carnet de Notes & Évaluations Pédagogiques</span>
          </h1>
          <p className="text-xs text-slate-400">
            Saisie des interrogations, calcul automatique des coefficients et rangs, publication provisoire
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setNewEvalModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Évaluation</span>
          </button>
          <button
            onClick={() => triggerPrint('teacher-grades-printable-table', `Grille_Notes_${currentEval?.title ? currentEval.title.replace(/\s+/g, '_') : 'Evaluations'}`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer Grille</span>
          </button>
        </div>
      </div>

      {/* Evaluation Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800">
        {evaluations.map(ev => {
          const isSelected = ev.id === currentEval?.id;
          return (
            <button
              key={ev.id}
              onClick={() => setSelectedEvalId(ev.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                isSelected 
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>{ev.className.split('(')[0]}</span>
              <span className="opacity-70">· Coef {ev.coefficient}</span>
              {ev.status === 'soumis_direction' ? (
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/30 text-amber-200">
                  Soumis
                </span>
              ) : ev.status === 'valide' ? (
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/30 text-emerald-200">
                  Validé
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-700 text-slate-300">
                  En cours
                </span>
              )}
            </button>
          );
        })}
      </div>

      {currentEval && (
        <div className="space-y-4">
          {/* Active Evaluation Banner */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                  {currentEval.subject}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  {currentEval.term}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentEval.durationMinutes || 90} min
                </span>
                <span className="text-xs font-mono text-slate-400">Date : {currentEval.date}</span>
              </div>
              <h2 className="text-base font-bold text-white">{currentEval.title}</h2>
              <div className="text-xs text-slate-400">
                {currentEval.className} · Coefficient : <strong className="text-slate-200">{currentEval.coefficient}</strong> · Barème : <strong className="text-slate-200">sur {currentEval.maxScore}</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Moyenne Session</div>
                <div className="text-xl font-black text-emerald-400">{averageOfSession} / 20</div>
              </div>

              {/* Toggle Provisional Visibility */}
              <button
                onClick={() => togglePublishProvisionalGrades(currentEval.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border ${
                  currentEval.isProvisionalPublished 
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 hover:bg-blue-600/30' 
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Rendre visible les notes provisoires aux élèves avant validation officielle"
              >
                {currentEval.isProvisionalPublished ? <Eye className="w-4 h-4 text-blue-400" /> : <EyeOff className="w-4 h-4" />}
                <span>{currentEval.isProvisionalPublished ? 'Notes visibles (Provisoire)' : 'Notes masquées'}</span>
              </button>

              {currentEval.status === 'soumis_direction' ? (
                <div className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Transmis au Directeur</span>
                </div>
              ) : (
                <button
                  onClick={() => submitEvaluationToDirector(currentEval.id)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Soumettre au Directeur</span>
                </button>
              )}
            </div>
          </div>

          {/* Search bar inside table */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrer un élève ou matricule..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="text-xs text-slate-400">
              {filteredGrades.length} élèves évalués · Formule : <span className="font-mono text-slate-300">(Int1 + Int2 + Dev + Comp×2) / 5</span>
            </div>
          </div>

          {/* Table of Grades */}
          <div id="teacher-grades-printable-table" className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3 text-center">Rang</th>
                  <th className="py-3 px-4">Élève & Matricule</th>
                  <th className="py-3 px-3 text-center">Interro 1 (/20)</th>
                  <th className="py-3 px-3 text-center">Interro 2 (/20)</th>
                  <th className="py-3 px-3 text-center">Devoir (/20)</th>
                  <th className="py-3 px-3 text-center">Composition (/20)</th>
                  <th className="py-3 px-3 text-center">Moyenne (/20)</th>
                  <th className="py-3 px-4">Appréciation Pédagogique</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredGrades.map((student) => (
                  <tr key={student.studentId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-200">
                        {student.rank ? `${student.rank}e` : '-'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {student.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{student.fullName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{student.matricule}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input 
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={student.interro1 ?? ''}
                        onChange={e => updateStudentGrade(currentEval.id, student.studentId, 'interro1', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input 
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={student.interro2 ?? ''}
                        onChange={e => updateStudentGrade(currentEval.id, student.studentId, 'interro2', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input 
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={student.devoir ?? ''}
                        onChange={e => updateStudentGrade(currentEval.id, student.studentId, 'devoir', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input 
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={student.composition ?? ''}
                        onChange={e => updateStudentGrade(currentEval.id, student.studentId, 'composition', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-center font-mono text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`text-sm font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 ${getScoreColor(student.average)}`}>
                        {student.average.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <input 
                        type="text"
                        value={student.appreciation}
                        placeholder="Ex: Très bon trimestre, poursuivre ainsi..."
                        onChange={e => updateStudentAppreciation(currentEval.id, student.studentId, e.target.value)}
                        className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-800/60 border border-slate-750 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setDeleteConfirmStudent({ id: student.studentId, name: student.fullName })}
                        className="p-1 hover:text-rose-400 text-slate-500 transition-colors"
                        title="Réinitialiser les notes de l'élève"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Resetting Student Notes */}
      {deleteConfirmStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base text-white">Confirmation Sécurisée</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Êtes-vous certain de vouloir effacer l'ensemble des notes enregistrées pour l'élève <strong className="text-white">{deleteConfirmStudent.name}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setDeleteConfirmStudent(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  deleteStudentGrade(currentEval.id, deleteConfirmStudent.id);
                  setDeleteConfirmStudent(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirmer l'effacement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Evaluation Session */}
      {newEvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Créer une session d'évaluation</h3>
              <button 
                onClick={() => setNewEvalModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEval} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Titre de l'évaluation *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Devoir Surveillé N°2 - Calcul Intégral"
                  value={newEvalTitle}
                  onChange={e => setNewEvalTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Type d'épreuve *</label>
                <select 
                  value={newEvalType}
                  onChange={e => setNewEvalType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="controle_continu">Devoir Surveillé / Écrit</option>
                  <option value="quiz">Interrogation Écrite (Flash)</option>
                  <option value="test">Interrogation Orale / TP</option>
                  <option value="examen">Composition Trimestrielle</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Classe concernée *</label>
                <select 
                  value={newEvalClassId}
                  onChange={e => setNewEvalClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Période *</label>
                  <select 
                    value={newEvalTerm}
                    onChange={e => setNewEvalTerm(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Trimestre 1">Trimestre 1</option>
                    <option value="Trimestre 2">Trimestre 2</option>
                    <option value="Trimestre 3">Trimestre 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Coefficient *</label>
                  <input 
                    type="number" 
                    min="1"
                    max="10"
                    value={newEvalCoef}
                    onChange={e => setNewEvalCoef(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Durée (minutes) *</label>
                <input 
                  type="number" 
                  min="30"
                  max="240"
                  value={newEvalDuration}
                  onChange={e => setNewEvalDuration(parseInt(e.target.value) || 90)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewEvalModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Initialiser la Grille
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
