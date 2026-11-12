import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  GraduationCap, 
  TrendingUp, 
  Sparkles,
  Search
} from 'lucide-react';

export const TeacherSubjectsView: React.FC = () => {
  const { subjects, profile, triggerToast } = useTeacher();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.classNames.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-purple-400" />
            <span>Mes Matières Attribuées & Programmes Officiels</span>
          </h1>
          <p className="text-xs text-slate-400">
            Coefficients officiels, programmes MEPU-A / CIAM et avancement pédagogique trimestriel
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Rechercher une matière..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Total Enseignements</div>
          <div className="text-2xl font-black text-white mt-1">{subjects.length} modules</div>
          <div className="text-[11px] text-purple-400 mt-0.5">Mathématiques & Sciences Physiques</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Heures dispensées</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {subjects.reduce((sum, s) => sum + s.hoursCompleted, 0)}h / {subjects.reduce((sum, s) => sum + s.hoursTotal, 0)}h
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Avancement conforme au calendrier scolaire</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Progression moyenne</div>
          <div className="text-2xl font-black text-blue-400 mt-1">
            {Math.round(subjects.reduce((sum, s) => sum + s.progressionPercent, 0) / subjects.length)}%
          </div>
          <div className="text-[11px] text-blue-400 mt-0.5">Trimestre 1 en phase de clôture</div>
        </div>
      </div>

      {/* Subject Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSubjects.map(subj => (
          <div 
            key={subj.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-white">{subj.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Coeff : {subj.coefficient}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Niveau : <strong className="text-slate-200">{subj.level}</strong>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {subj.progressionPercent}% complété
                </span>
              </div>

              {/* Classes taught */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Classes concernées :
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {subj.classNames.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Bar & Hours */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Progression du syllabus :</span>
                  <span className="font-mono font-bold text-white">{subj.hoursCompleted}h / {subj.hoursTotal}h</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${subj.progressionPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{subj.chaptersCount} chapitres au programme</span>
                  <span className="text-emerald-400">En avance de 1 semaine</span>
                </div>
              </div>

              {/* Syllabus Summary */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Programme officiel MEPU-A :
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {subj.officialSyllabusSummary}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">ID: {subj.id}</span>
              <button
                onClick={() => triggerToast(`Téléchargement du syllabus officiel MEPU-A pour ${subj.name}...`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Télécharger le Syllabus (PDF)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
