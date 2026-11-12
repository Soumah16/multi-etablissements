import React from 'react';
import { useParent } from '../../context/ParentContext';
import { 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download, 
  AlertCircle,
  Award
} from 'lucide-react';

export const ParentHomeworkView: React.FC = () => {
  const { selectedChild } = useParent();

  const homeworkList = [
    {
      id: 'hw-1',
      subject: 'Mathématiques',
      title: 'Devoir Maison : Intégrales définies et calcul d’aires',
      teacher: 'M. Mamadou Lamarana Diallo',
      assignedDate: '01 Nov 2026',
      dueDate: '10 Nov 2026',
      status: 'soumis',
      score: 19,
      maxScore: 20,
      teacherComment: 'Excellente rédaction, méthode rigoureuse sur les primitives complexes.'
    },
    {
      id: 'hw-2',
      subject: 'Physique-Chimie',
      title: 'TD Optique : Réfraction et lentilles convergentes minces',
      teacher: 'M. Ousmane Traoré',
      assignedDate: '03 Nov 2026',
      dueDate: '12 Nov 2026',
      status: 'en_attente',
      teacherComment: 'À rendre sur feuille double ou via le portail élève avant 18h.'
    },
    {
      id: 'hw-3',
      subject: 'Philosophie',
      title: 'Dissertation : La liberté consiste-t-elle à faire tout ce qui nous plaît ?',
      teacher: 'Mme Aminata Camara',
      assignedDate: '28 Oct 2026',
      dueDate: '05 Nov 2026',
      status: 'corrige',
      score: 16.5,
      maxScore: 20,
      teacherComment: 'Introduction très bien problématisée et argumentation équilibrée.'
    },
    {
      id: 'hw-4',
      subject: 'SVT',
      title: 'Schéma bilan de la méiose et brassage interchromosomique',
      teacher: 'M. Thierno Bah',
      assignedDate: '02 Nov 2026',
      dueDate: '14 Nov 2026',
      status: 'en_attente',
      teacherComment: 'Dessin à légender soigneusement avec code couleur.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Cahier de Textes & Devoirs
          </span>
          <span className="text-xs text-slate-400">Élève : {selectedChild.firstName} {selectedChild.lastName} ({selectedChild.className})</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-white mt-1">Suivi des Devoirs & Travaux Personnels</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Consultez les devoirs assignés par les enseignants, les échéances de remise et les retours de correction.
        </p>
      </div>

      {/* Grid of Homework items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {homeworkList.map(hw => (
          <div key={hw.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-800 text-blue-300 border border-slate-700">
                  {hw.subject}
                </span>

                {hw.status === 'corrige' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Corrigé : {hw.score} / {hw.maxScore}
                  </span>
                )}
                {hw.status === 'soumis' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Copie remise
                  </span>
                )}
                {hw.status === 'en_attente' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    À rendre
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-white">{hw.title}</h3>
              <div className="text-xs text-slate-400">Enseignant : {hw.teacher}</div>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Donné le : {hw.assignedDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Échéance : {hw.dueDate}</span>
                </div>
              </div>
            </div>

            {hw.teacherComment && (
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 italic">
                <strong className="not-italic text-slate-400 text-[10px] uppercase font-bold block mb-0.5">
                  Remarque enseignant :
                </strong>
                {hw.teacherComment}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
