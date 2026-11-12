import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { TeacherPedagogicalProfile } from '../../types/director';
import { 
  GraduationCap, 
  Search, 
  Star, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  X, 
  Check, 
  TrendingUp,
  UserCheck
} from 'lucide-react';

export const TeacherSupervisionView: React.FC = () => {
  const { teacherProfiles, updateTeacherObservation } = useDirector();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacherForEval, setSelectedTeacherForEval] = useState<TeacherPedagogicalProfile | null>(null);
  const [evalRemarks, setEvalRemarks] = useState('');
  const [evalRating, setEvalRating] = useState(5);

  const filteredTeachers = teacherProfiles.filter(t => 
    t.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEvaluationModal = (t: TeacherPedagogicalProfile) => {
    setSelectedTeacherForEval(t);
    setEvalRemarks(t.directorObservation);
    setEvalRating(t.pedagogicalRating);
  };

  const handleSaveEvaluation = () => {
    if (selectedTeacherForEval) {
      updateTeacherObservation(selectedTeacherForEval.id, evalRemarks, evalRating);
      setSelectedTeacherForEval(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Supervision du Corps Professoral
            </span>
            <span className="text-xs text-slate-400">Suivi des Syllabi & Assiduité</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
            <span>Supervision des Enseignants & Évaluations</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Suivi de la progression des cours, ponctualité, remplissage des cahiers de texte et inspections formatives.
          </p>
        </div>

        {/* Global summary indicator */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Taux Assiduité Moyen</span>
            <span className="text-lg font-black text-emerald-400 font-mono">96.8%</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Progression Globale</span>
            <span className="text-lg font-black text-blue-400 font-mono">86.2%</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un professeur par nom, matière ou matricule..."
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden"
        />
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeachers.map(teacher => (
          <div 
            key={teacher.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img 
                  src={teacher.photo} 
                  alt="" 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 shadow-md"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{teacher.teacherName}</h3>
                  <div className="text-xs text-blue-400 font-medium">{teacher.subject}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{teacher.matricule} · {teacher.department}</div>
                </div>
              </div>

              {/* Rating stars */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    className={`w-3.5 h-3.5 ${
                      star <= teacher.pedagogicalRating 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-600'
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Syllabus</span>
                <span className="text-sm font-black text-emerald-400 font-mono">
                  {teacher.syllabusProgressPct}%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Heures Réalisées</span>
                <span className="text-sm font-black text-white font-mono">
                  {teacher.hoursCompleted}/{teacher.hoursScheduled}h
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Cahier Rempli</span>
                <span className="text-sm font-black text-purple-400 font-mono">
                  {teacher.logbookFilledPct}%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Ponctualité</span>
                <span className={`text-sm font-black font-mono ${
                  teacher.attendanceRate >= 95 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {teacher.attendanceRate}%
                </span>
              </div>
            </div>

            {/* Assigned Classes */}
            <div className="text-xs text-slate-300">
              <span className="text-slate-400">Classes prises en charge : </span>
              <span className="font-medium text-slate-200">{teacher.assignedClasses.join(', ')}</span>
            </div>

            {/* Director Inspection Observation */}
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-semibold uppercase text-slate-300">Avis d'Inspection du Directeur :</span>
                <span>Dernière inspection : {teacher.lastInspectionDate}</span>
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "{teacher.directorObservation}"
              </p>
            </div>

            {/* Action */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 font-mono">
                {teacher.homeworksAssigned} devoirs publiés ce trimestre
              </span>
              <button
                onClick={() => handleOpenEvaluationModal(teacher)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Évaluer & Annoter</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation Modal */}
      {selectedTeacherForEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Fiche d'Inspection Pédagogique
                  </h3>
                  <p className="text-xs text-slate-400">{selectedTeacherForEval.teacherName} · {selectedTeacherForEval.subject}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTeacherForEval(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rating Stars Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Note d'Appréciation Globale du Directeur :
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEvalRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= evalRating 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-slate-600'
                      }`} 
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-300 ml-2 font-mono">
                  {evalRating} / 5 étoiles
                </span>
              </div>
            </div>

            {/* Observations Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Observations, Conseils Pédagogiques & Recommandations :
              </label>
              <textarea
                rows={4}
                value={evalRemarks}
                onChange={(e) => setEvalRemarks(e.target.value)}
                placeholder="Indiquez ici vos remarques sur la rigueur, le respect du syllabus et la gestion de classe..."
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTeacherForEval(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveEvaluation}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer l'Évaluation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
