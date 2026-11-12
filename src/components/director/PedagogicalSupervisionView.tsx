import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { 
  BookOpen, 
  Building2, 
  Users, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Clock, 
  Info, 
  Search,
  Eye,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';

export const PedagogicalSupervisionView: React.FC = () => {
  const [selectedSubTab, setSelectedSubTab] = useState<'classes' | 'schedules' | 'logbooks' | 'homeworks'>('classes');
  const [selectedClassName, setSelectedClassName] = useState('Terminale Sciences Mathématiques 1');

  // Sample classes data
  const classesList = [
    { name: 'Terminale Sciences Mathématiques 1', level: 'Lycée', section: 'Sciences Mathématiques', students: 42, mainTeacher: 'M. Alpha Camara', room: 'Salle 12 (Bâtiment Scientifique)', syllabusRate: 92 },
    { name: 'Terminale Sciences Expérimentales', level: 'Lycée', section: 'Sciences de la Nature', students: 38, mainTeacher: 'Dr. Mariama Bah', room: 'Labo 02', syllabusRate: 88 },
    { name: '10ème Année A', level: 'Collège', section: 'Enseignement Général', students: 48, mainTeacher: 'M. Ibrahima Soumah', room: 'Salle 06', syllabusRate: 90 },
    { name: '1ère Sciences Mathématiques', level: 'Lycée', section: 'Sciences Mathématiques', students: 44, mainTeacher: 'M. Cherif Haidara', room: 'Salle 14', syllabusRate: 84 },
    { name: 'Terminale Sciences Sociales', level: 'Lycée', section: 'Sciences Sociales & Économiques', students: 40, mainTeacher: 'M. Ousmane Barry', room: 'Salle 09', syllabusRate: 78 },
    { name: '9ème Année B', level: 'Collège', section: 'Enseignement Général', students: 45, mainTeacher: 'Mme Fatoumata Sylla', room: 'Salle 04', syllabusRate: 89 }
  ];

  // Sample weekly timetable
  const timetableDays = [
    { day: 'Lundi', slots: [
      { time: '08h00 - 10h00', subject: 'Mathématiques', teacher: 'M. Alpha Camara', room: 'Salle 12' },
      { time: '10h15 - 12h15', subject: 'Physique-Chimie', teacher: 'Dr. Mariama Bah', room: 'Labo 02' },
      { time: '14h00 - 16h00', subject: 'Français-Philosophie', teacher: 'M. Ousmane Barry', room: 'Salle 12' }
    ]},
    { day: 'Mardi', slots: [
      { time: '08h00 - 10h00', subject: 'SVT (Biologie)', teacher: 'Dr. Mariama Bah', room: 'Labo 01' },
      { time: '10h15 - 12h15', subject: 'Anglais', teacher: 'Mme Fatoumata Sylla', room: 'Salle 12' },
      { time: '14h00 - 16h00', subject: 'Mathématiques (TD)', teacher: 'M. Alpha Camara', room: 'Salle 12' }
    ]},
    { day: 'Mercredi', slots: [
      { time: '08h00 - 10h00', subject: 'Histoire-Géographie', teacher: 'M. Cherif Haidara', room: 'Salle 12' },
      { time: '10h15 - 12h15', subject: 'Informatique & Algorithmique', teacher: 'M. Mohamed Lamine', room: 'Salle Info 1' }
    ]},
    { day: 'Jeudi', slots: [
      { time: '08h00 - 10h00', subject: 'Physique (TP Optique)', teacher: 'Dr. Mariama Bah', room: 'Labo 02' },
      { time: '10h15 - 12h15', subject: 'Mathématiques', teacher: 'M. Alpha Camara', room: 'Salle 12' },
      { time: '14h00 - 16h00', subject: 'Éducation Civique & Éthique', teacher: 'M. Cherif Haidara', room: 'Salle 12' }
    ]},
    { day: 'Vendredi', slots: [
      { time: '08h00 - 10h00', subject: 'Anglais Renforcé', teacher: 'Mme Fatoumata Sylla', room: 'Salle 12' },
      { time: '10h15 - 12h15', subject: 'Devoir Hebdomadaire Harmonisé', teacher: 'Surveillant Général', room: 'Amphi' }
    ]}
  ];

  // Sample Cahier de texte (Lesson Logbook) entries
  const logbookEntries = [
    {
      date: 'Vendredi 31 Octobre 2026',
      subject: 'Mathématiques',
      teacher: 'M. Alpha Camara',
      chapter: 'Chapitre 4 : Fonctions Logarithmes Néperiennes',
      content: 'Étude des limites remarquables et dérivées successives. Résolution d\'équations transcendantes avec ln(x).',
      homeworkGiven: 'Exercices 42 et 45 page 118 à rendre le mardi 4 novembre.',
      signedAt: '31/10/2026 12:10',
      status: 'conforme'
    },
    {
      date: 'Jeudi 30 Octobre 2026',
      subject: 'Physique-Chimie',
      teacher: 'Dr. Mariama Bah',
      chapter: 'Partie 2 : Oscillations Électriques Libres (Circuit RLC)',
      content: 'Mise en équation différentielle du second ordre, régime pseudo-périodique et amortissement.',
      homeworkGiven: 'Préparation du compte-rendu de TP sur oscilloscope numérique.',
      signedAt: '30/10/2026 16:05',
      status: 'conforme'
    },
    {
      date: 'Mardi 28 Octobre 2026',
      subject: 'Français-Philosophie',
      teacher: 'M. Ousmane Barry',
      chapter: 'Thème : La Liberté et le Déterminisme chez Spinoza',
      content: 'Lecture méthodique d\'un extrait de l\'Éthique. Problématique de l\'illusion du libre arbitre.',
      homeworkGiven: 'Plan détaillé de dissertation pour le vendredi suivant.',
      signedAt: '28/10/2026 16:15',
      status: 'conforme'
    }
  ];

  // Sample homeworks
  const homeworksList = [
    { title: 'Devoir surveillé de Mathématiques N°3', subject: 'Mathématiques', class: 'Terminale SM 1', deadline: '04 Nov 2026', teacher: 'M. Alpha Camara', submissions: '40/42', coefficient: 7 },
    { title: 'Dissertation de Philosophie - Thème Liberté', subject: 'Français & Philo', class: 'Terminale SM 1', deadline: '07 Nov 2026', teacher: 'M. Ousmane Barry', submissions: '36/42', coefficient: 4 },
    { title: 'Compte-rendu de Travaux Pratiques de Chimie', subject: 'Physique-Chimie', class: 'Terminale SE', deadline: '05 Nov 2026', teacher: 'Dr. Mariama Bah', submissions: '38/38', coefficient: 5 },
    { title: 'Reading Comprehension & Essay', subject: 'Anglais', class: '10ème Année A', deadline: '03 Nov 2026', teacher: 'Mme Fatoumata Sylla', submissions: '47/48', coefficient: 3 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Consultation Pédagogique Intégrale
            </span>
            <span className="text-xs text-slate-400">Accès Réflexif & Supervision</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <span>Gestion Pédagogique & Vie Académique</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Inspection en temps réel des classes, emplois du temps, cahiers de texte et devoirs sans intervention technique.
          </p>
        </div>

        {/* Read-only reminder pill */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Mode Consultation Pédagogique (Lecture Seule)</span>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 w-fit overflow-x-auto">
        <button
          onClick={() => setSelectedSubTab('classes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            selectedSubTab === 'classes' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Classes & Effectifs ({classesList.length})</span>
        </button>
        <button
          onClick={() => setSelectedSubTab('schedules')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            selectedSubTab === 'schedules' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Emplois du Temps</span>
        </button>
        <button
          onClick={() => setSelectedSubTab('logbooks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            selectedSubTab === 'logbooks' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Cahiers de Texte Remplis</span>
        </button>
        <button
          onClick={() => setSelectedSubTab('homeworks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            selectedSubTab === 'homeworks' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Devoirs & Évaluations ({homeworksList.length})</span>
        </button>
      </div>

      {/* SubTab 1: Classes Overview */}
      {selectedSubTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classesList.map(c => (
            <div key={c.name} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {c.level} · {c.section}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">{c.students} élèves</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-tight">{c.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Prof. Principal : <span className="text-slate-200 font-medium">{c.mainTeacher}</span></p>
                <p className="text-[11px] text-slate-400">Salle : {c.room}</p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Avancement du Syllabus :</span>
                  <span className="font-bold text-emerald-400 font-mono">{c.syllabusRate}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${c.syllabusRate}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    setSelectedClassName(c.name);
                    setSelectedSubTab('schedules');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Emploi du temps</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedClassName(c.name);
                    setSelectedSubTab('logbooks');
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Cahier de texte</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SubTab 2: Timetable (Emploi du temps) */}
      {selectedSubTab === 'schedules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Grille Hebdomadaire des Enseignements</h3>
                <p className="text-xs text-slate-400">Sélectionnez la classe pour visualiser la répartition horaire</p>
              </div>
            </div>

            <select
              value={selectedClassName}
              onChange={(e) => setSelectedClassName(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            >
              {classesList.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {timetableDays.map(td => (
              <div key={td.day} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider pb-2 border-b border-slate-800">
                  {td.day}
                </div>
                <div className="space-y-2.5">
                  {td.slots.map((s, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-1">
                      <div className="text-[10px] font-mono text-slate-400">{s.time}</div>
                      <div className="text-xs font-bold text-slate-100">{s.subject}</div>
                      <div className="text-[11px] text-slate-300">{s.teacher}</div>
                      <div className="text-[10px] text-blue-400">{s.room}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 3: Lesson Logbook (Cahier de texte) */}
      {selectedSubTab === 'logbooks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Cahier de Texte Électronique Officiel</h3>
                <p className="text-xs text-slate-400">Contrôle de la conformité pédagogique et des leçons dispensées</p>
              </div>
            </div>

            <select
              value={selectedClassName}
              onChange={(e) => setSelectedClassName(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
            >
              {classesList.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {logbookEntries.map((entry, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{entry.subject}</span>
                    <span className="text-xs text-slate-400">· Enseignant : {entry.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{entry.date}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Signé {entry.signedAt}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-blue-300">{entry.chapter}</h4>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">{entry.content}</p>
                </div>

                {entry.homeworkGiven && (
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                    <span className="font-bold text-amber-400 block mb-0.5">Travail prescrit / Devoir :</span>
                    {entry.homeworkGiven}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 4: Homeworks & Evaluations */}
      {selectedSubTab === 'homeworks' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Devoirs & Évaluations Programmées</h3>
            <span className="text-xs text-slate-400">{homeworksList.length} devoirs récents</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Titre de l'évaluation</th>
                <th className="py-2.5 px-3">Matière</th>
                <th className="py-2.5 px-3">Classe</th>
                <th className="py-2.5 px-3">Enseignant</th>
                <th className="py-2.5 px-3">Échéance</th>
                <th className="py-2.5 px-3 text-center">Copies Rentrées</th>
                <th className="py-2.5 px-3 text-center">Coef</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {homeworksList.map((hw, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">{hw.title}</td>
                  <td className="py-3 px-3 text-slate-300">{hw.subject}</td>
                  <td className="py-3 px-3 text-blue-400 font-medium">{hw.class}</td>
                  <td className="py-3 px-3 text-slate-400">{hw.teacher}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{hw.deadline}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400">
                      {hw.submissions}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">{hw.coefficient}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
