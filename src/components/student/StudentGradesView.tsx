import React from 'react';
import { useStudent } from '../../context/StudentContext';
import { 
  Award, 
  TrendingUp, 
  FileCheck2, 
  Printer, 
  BookOpen, 
  CheckCircle2, 
  BarChart3,
  Calendar
} from 'lucide-react';

export const StudentGradesView: React.FC = () => {
  const { grades, profile, setActiveStudentTab } = useStudent();

  const totalPoints = grades.reduce((acc, g) => acc + (g.score * g.coefficient), 0);
  const totalCoefs = grades.reduce((acc, g) => acc + g.coefficient, 0);
  const currentAvg = totalCoefs > 0 ? (totalPoints / totalCoefs).toFixed(2) : profile.generalAverage.toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Mes Notes & Évaluations Pédagogiques</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Détail des devoirs surveillés, interrogations et moyennes trimestrielles pondérées.
          </p>
        </div>

        <button
          onClick={() => setActiveStudentTab('report_card')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Voir mon Bulletin Officiel</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold">Moyenne Pondérée Calculée</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{currentAvg} / 20</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Rang : {profile.classRank}ère de la classe</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold">Total Évaluations Rentrées</div>
          <div className="text-2xl font-black text-white mt-1">{grades.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Devoirs, compos et interrogations</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold">Mention du Trimestre</div>
          <div className="text-sm font-bold text-amber-300 mt-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Tableau d'Honneur (Félicitations)</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Lycée d'Excellence Conakry</div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase font-semibold bg-slate-800/40">
                <th className="py-3 px-4">Discipline</th>
                <th className="py-3 px-4">Évaluation & Titre</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-center">Coef</th>
                <th className="py-3 px-4 text-center">Ma Note</th>
                <th className="py-3 px-4 text-center">Moyenne Classe</th>
                <th className="py-3 px-4">Appréciation de l'Enseignant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {grades.map(grade => {
                const isAboveAverage = grade.score >= grade.classAverage;
                return (
                  <tr key={grade.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white text-xs">{grade.subject}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{grade.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{grade.date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {grade.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-300">{grade.coefficient}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-black text-sm text-emerald-400">
                        {grade.score} <span className="text-[10px] text-slate-500 font-normal">/{grade.maxScore}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400">
                      {grade.classAverage} / 20
                    </td>
                    <td className="py-3 px-4 text-slate-300 italic text-[11px] max-w-xs leading-relaxed">
                      {grade.comments}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
