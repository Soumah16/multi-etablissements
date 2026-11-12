import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { HomeworkItem, HomeworkSubmission } from '../../types/teacher';
import { 
  FileText, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  BookOpen, 
  Search,
  Check,
  AlertCircle,
  Download,
  Eye,
  MessageSquare,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const TeacherHomeworkView: React.FC = () => {
  const { homeworkList, addHomework, gradeHomeworkSubmission, classes, triggerToast } = useTeacher();
  const [modalOpen, setModalOpen] = useState(false);
  const [gradingDrawerOpen, setGradingDrawerOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<HomeworkItem | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<HomeworkSubmission | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formClassId, setFormClassId] = useState('cls-tsm');
  const [formSubject, setFormSubject] = useState('Mathématiques');
  const [formDesc, setFormDesc] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formMaxScore, setFormMaxScore] = useState(20);

  // Grading state
  const [gradingScore, setGradingScore] = useState<number>(15);
  const [gradingComment, setGradingComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const targetClass = classes.find(c => c.id === formClassId);

    addHomework({
      classId: formClassId,
      className: targetClass ? targetClass.name : 'Terminale SM',
      subject: formSubject,
      title: formTitle,
      description: formDesc,
      givenDate: new Date().toISOString().substring(0, 10),
      dueDate: formDueDate || new Date(Date.now() + 4 * 86400000).toISOString().substring(0, 10),
      maxScore: Number(formMaxScore) || 20,
      totalStudents: targetClass ? targetClass.studentsCount : 38,
      status: 'en_cours'
    });

    setModalOpen(false);
    setFormTitle('');
    setFormDesc('');
    setFormDueDate('');
  };

  const handleOpenGrading = (hw: HomeworkItem, sub?: HomeworkSubmission) => {
    setSelectedHomework(hw);
    if (sub) {
      setSelectedSubmission(sub);
      setGradingScore(sub.grade !== undefined ? sub.grade : 14);
      setGradingComment(sub.teacherComment || '');
    } else if (hw.submissions && hw.submissions.length > 0) {
      setSelectedSubmission(hw.submissions[0]);
      setGradingScore(hw.submissions[0].grade !== undefined ? hw.submissions[0].grade : 14);
      setGradingComment(hw.submissions[0].teacherComment || '');
    } else {
      setSelectedSubmission(null);
    }
    setGradingDrawerOpen(true);
  };

  const handleSaveGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHomework || !selectedSubmission) return;

    gradeHomeworkSubmission(
      selectedHomework.id, 
      selectedSubmission.id, 
      Number(gradingScore), 
      gradingComment
    );

    // Update local state
    setSelectedSubmission(prev => prev ? {
      ...prev,
      grade: Number(gradingScore),
      teacherComment: gradingComment,
      status: 'corrige'
    } : null);

    triggerToast(`Copie de ${selectedSubmission.studentName} notée : ${gradingScore}/${selectedSubmission.maxScore}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-amber-400" />
            <span>Devoirs de Maison, Projets & Remise des Copies</span>
          </h1>
          <p className="text-xs text-slate-400">
            Diffusion des travaux personnels, réception des copies d'élèves, correction et retour annoté
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Devoir</span>
        </button>
      </div>

      {/* Homework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeworkList.map(hw => {
          const submissionPercent = Math.round((hw.totalSubmissions / hw.totalStudents) * 100);
          return (
            <div 
              key={hw.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                    {hw.className}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    hw.status === 'en_cours' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {hw.status === 'en_cours' ? 'En cours' : 'Clôturé'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{hw.title}</h3>
                  <div className="text-[11px] text-amber-400 font-medium mt-0.5">
                    Matière : {hw.subject} · Barème : sur {hw.maxScore || 20} pts
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  {hw.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Donné le : {hw.givenDate}</span>
                  <span className="text-amber-400 font-bold">À rendre : {hw.dueDate}</span>
                </div>
              </div>

              {/* Progress of submissions */}
              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Remises reçues :</span>
                  <span className="font-bold text-white">{hw.totalSubmissions} / {hw.totalStudents} ({submissionPercent}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-300" 
                    style={{ width: `${submissionPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Copies corrigées : {hw.evaluatedCount}</span>
                  <span className="text-emerald-400">Reste à noter : {hw.totalSubmissions - hw.evaluatedCount}</span>
                </div>

                <button
                  onClick={() => handleOpenGrading(hw)}
                  className="w-full mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Consulter & Corriger les Copies ({hw.submissions ? hw.submissions.length : 0})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer / Modal: Grading and Submissions */}
      {gradingDrawerOpen && selectedHomework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                  Espace Correction & Notation
                </span>
                <h3 className="font-bold text-lg text-white">{selectedHomework.title}</h3>
                <div className="text-xs text-slate-400">{selectedHomework.className} · Barème : sur {selectedHomework.maxScore} pts</div>
              </div>
              <button onClick={() => setGradingDrawerOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Submissions List */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Copies Soumises ({selectedHomework.submissions?.length || 0})</span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {selectedHomework.submissions && selectedHomework.submissions.length > 0 ? (
                    selectedHomework.submissions.map(sub => {
                      const isSelected = selectedSubmission?.id === sub.id;
                      return (
                        <div
                          key={sub.id}
                          onClick={() => {
                            setSelectedSubmission(sub);
                            setGradingScore(sub.grade !== undefined ? sub.grade : 14);
                            setGradingComment(sub.teacherComment || '');
                          }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                            isSelected 
                              ? 'bg-amber-500/20 border-amber-500 text-white' 
                              : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold truncate">{sub.studentName}</span>
                            {sub.grade !== undefined ? (
                              <span className="font-mono text-emerald-400 font-bold">{sub.grade}/{sub.maxScore}</span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">À noter</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {sub.fileName}
                          </div>
                          <div className="text-[9px] text-slate-500 mt-1">
                            Remis le {sub.submittedAt}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-800/30 text-xs text-slate-400 text-center">
                      Aucune copie soumise en ligne pour le moment.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Active Submission Grading Form */}
              <div className="md:col-span-2 space-y-4">
                {selectedSubmission ? (
                  <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white">{selectedSubmission.studentName}</div>
                        <div className="text-xs text-slate-400 font-mono">Matricule : {selectedSubmission.studentMatricule}</div>
                      </div>

                      <button
                        onClick={() => triggerToast(`Téléchargement de la copie "${selectedSubmission.fileName}"...`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger le devoir</span>
                      </button>
                    </div>

                    <form onSubmit={handleSaveGrading} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Note attribuée (Barème sur {selectedSubmission.maxScore}) *
                        </label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            min="0"
                            max={selectedSubmission.maxScore}
                            step="0.5"
                            required
                            value={gradingScore}
                            onChange={e => setGradingScore(Number(e.target.value))}
                            className="w-32 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-lg font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                          />
                          <span className="text-slate-400 text-base font-bold">/ {selectedSubmission.maxScore}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Commentaires & Annotations pédagogiques *
                        </label>
                        <textarea 
                          rows={4}
                          required
                          placeholder="Indiquez les points forts, erreurs récurrentes et conseils pour progresser..."
                          value={gradingComment}
                          onChange={e => setGradingComment(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                        <span className="text-[11px] text-slate-400">
                          {selectedSubmission.status === 'corrige' ? '✅ Copie déjà corrigée' : '⏳ En attente de notation'}
                        </span>
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Enregistrer & Renvoyer la Correction</span>
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="p-8 rounded-xl bg-slate-800/20 border border-slate-800 text-center text-slate-400 text-xs">
                    Sélectionnez une copie dans la liste de gauche pour la noter et annoter les retours.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Homework */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Créer un Devoir de Maison</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Classe ciblée *</label>
                <select 
                  value={formClassId}
                  onChange={e => setFormClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Matière *</label>
                <select 
                  value={formSubject}
                  onChange={e => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="Mathématiques">Mathématiques</option>
                  <option value="Sciences Physiques">Sciences Physiques</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Titre du devoir *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: DM N°3 : Dérivation et optimisation économique"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date limite de rendu *</label>
                  <input 
                    type="date" 
                    required
                    value={formDueDate}
                    onChange={e => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Barème (sur combien) *</label>
                  <input 
                    type="number" 
                    min="10"
                    max="100"
                    required
                    value={formMaxScore}
                    onChange={e => setFormMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Consignes et énoncé *</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Détaillez les exercices à faire, le barème indicatif et les consignes de rédaction..."
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
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
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Publier aux Élèves
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
