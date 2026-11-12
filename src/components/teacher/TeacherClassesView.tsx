import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  FileSpreadsheet, 
  ClipboardCheck, 
  BookOpen, 
  ArrowRight, 
  Search,
  Printer,
  Sparkles,
  Award,
  Calendar
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const TeacherClassesView: React.FC = () => {
  const { classes, setSelectedClassId, setActiveTeacherTab } = useTeacher();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-blue-400" />
            <span>Classes Assignées & Groupes Pédagogiques</span>
          </h1>
          <p className="text-xs text-slate-400">
            Gestion des promotions confiées, trombinoscopes et suivis de classe
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Rechercher une classe..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => triggerPrint('teacher-classes-printable-grid', 'Listes_Classes_Enseignant')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer listes</span>
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      <div id="teacher-classes-printable-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredClasses.map(cls => (
          <div 
            key={cls.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg space-y-5"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-base shrink-0">
                  {cls.name.charAt(0)}
                </div>
                {cls.isMainTeacher ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>Professeur Principal</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                    Enseignant Titulaire
                  </span>
                )}
              </div>

              <h2 className="text-lg font-black text-white tracking-tight">{cls.name}</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{cls.room}</p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Effectif</div>
                  <div className="text-lg font-black text-white flex items-center gap-1 mt-0.5">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>{cls.studentsCount}</span>
                    <span className="text-xs text-slate-400 font-normal">élèves</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Moyenne Classe</div>
                  <div className="text-lg font-black text-emerald-400 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>{cls.averageGrade}</span>
                    <span className="text-xs text-slate-400 font-normal">/20</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Délégué de classe :</span>
                  <span className="font-semibold text-slate-200">{cls.classDelegate}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Taux de présence :</span>
                  <span className="font-semibold text-indigo-400">{cls.attendanceRate}%</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSelectedClassId(cls.id);
                  setActiveTeacherTab('attendance');
                }}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-colors"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Appel</span>
              </button>
              <button
                onClick={() => {
                  setSelectedClassId(cls.id);
                  setActiveTeacherTab('gradebook');
                }}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Notes</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
