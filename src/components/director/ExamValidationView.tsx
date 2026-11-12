import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { DirectorExam } from '../../types/director';
import { 
  FileCheck2, 
  Search, 
  Award, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Share2, 
  ShieldCheck, 
  FileText, 
  Eye, 
  Check, 
  X,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const ExamValidationView: React.FC = () => {
  const { 
    exams, 
    approveExam, 
    publishExam, 
    rejectExam, 
    profile 
  } = useDirector();

  const [selectedExam, setSelectedExam] = useState<DirectorExam | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [palmaresModalExam, setPalmaresModalExam] = useState<DirectorExam | null>(null);

  // Palmarès mock for selected exam
  const mockHonorsList = [
    { rank: 1, name: 'Mamadou Bhoye Diallo', class: 'Terminale SM 1', average: 18.25, decision: 'Admis avec Félicitations du Jury' },
    { rank: 2, name: 'Kadiatou Bah', class: 'Terminale SM 2', average: 17.80, decision: 'Admis avec Félicitations du Jury' },
    { rank: 3, name: 'Aissatou Barry', class: 'Terminale SM 1', average: 17.15, decision: 'Admis avec Mention Très Bien' },
    { rank: 4, name: 'Mohamed Camara', class: 'Terminale SE', average: 16.90, decision: 'Admis avec Mention Très Bien' },
    { rank: 5, name: 'Fatoumata Binta Sow', class: 'Terminale SM 1', average: 16.50, decision: 'Admis avec Mention Bien' },
    { rank: 6, name: 'Ibrahima Sory Bangoura Jr.', class: 'Terminale SE', average: 16.20, decision: 'Admis avec Mention Bien' },
    { rank: 7, name: 'Aboubacar Somparé', class: 'Terminale SM 2', average: 15.95, decision: 'Admis avec Mention Bien' },
    { rank: 8, name: 'Mariama Ciré Diallo', class: 'Terminale SS', average: 15.60, decision: 'Admis avec Mention Assez Bien' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Contrôle Académique & Délibérations
            </span>
            <span className="text-xs text-slate-400">Sessions d'Évaluations Harmonnisées</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-purple-400" />
            <span>Validation des Examens & Publication Officielle</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Contrôle des taux d'admissibilité, validation des procès-verbaux et proclamation officielle par le Directeur des Études.
          </p>
        </div>
      </div>

      {/* Grid of Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {exams.map(exam => {
          const isPublished = exam.status === 'publie';
          const isValidated = exam.status === 'valide';
          const isPending = exam.status === 'en_attente';

          return (
            <div 
              key={exam.id}
              className={`p-5 rounded-2xl bg-slate-900 border transition-all flex flex-col justify-between ${
                isPublished ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' :
                isValidated ? 'border-blue-500/40' :
                'border-amber-500/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    isPublished ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    isValidated ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                    'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {isPublished ? 'Proclamé & Publié' : isValidated ? 'Validé par Direction' : 'En attente de visa'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{exam.session}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Niveau : <span className="font-semibold text-slate-200">{exam.level}</span> · {exam.subjectsCount} épreuves
                  </p>
                </div>

                {/* Performance stats mini-cards */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Taux de Réussite</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {exam.successRate.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {exam.passedCount} / {exam.presentCount} admis
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Moyenne Générale</span>
                    <span className="text-lg font-black text-blue-400 font-mono">
                      {exam.classAverage.toFixed(2)}/20
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Max: {exam.highestAverage} · Min: {exam.lowestAverage}
                    </span>
                  </div>
                </div>

                {/* Classes included */}
                <div className="text-xs text-slate-300">
                  <span className="text-slate-400">Classes cibles : </span>
                  <span className="font-semibold">{exam.targetClasses.join(', ')}</span>
                </div>

                {exam.directorNotes && (
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 text-[11px] text-slate-300 italic">
                    "{exam.directorNotes}"
                  </div>
                )}

                {isPublished && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 space-y-0.5 font-mono">
                    <div>Proclamé le : {exam.publishedAt}</div>
                    <div>Signataire : {exam.publishedBy}</div>
                    <div className="text-[9px] text-emerald-400/80">{exam.signatureHash}</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPalmaresModalExam(exam)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Palmarès des Lauréats</span>
                  </button>

                  <button
                    onClick={() => setSelectedExam(exam)}
                    className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                    title="Détails complets de la session"
                  >
                    <Eye className="w-4 h-4 text-blue-400" />
                  </button>
                </div>

                {isPending && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => approveExam(exam.id)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20"
                      title="Valider l'examen (PIN/2FA)"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Valider Délibération</span>
                    </button>
                    <button
                      onClick={() => publishExam(exam.id)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md"
                      title="Proclamer & Publier officiellement aux élèves et familles (PIN/2FA)"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Publier Officiellement</span>
                    </button>
                  </div>
                )}

                {isValidated && !isPublished && (
                  <button
                    onClick={() => publishExam(exam.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Proclamer & Publier Officiellement (PIN/2FA)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Palmarès Modal */}
      {palmaresModalExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Palmarès Officiel des Lauréats · Top 8
                  </h3>
                  <p className="text-xs text-slate-400">{palmaresModalExam.title}</p>
                </div>
              </div>
              <button onClick={() => setPalmaresModalExam(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3 text-center">Rang</th>
                    <th className="py-2.5 px-3">Candidat</th>
                    <th className="py-2.5 px-3">Classe</th>
                    <th className="py-2.5 px-3 text-center">Moyenne</th>
                    <th className="py-2.5 px-3">Mention & Décision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {mockHonorsList.map(h => (
                    <tr key={h.rank} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                          h.rank === 1 ? 'bg-amber-500 text-slate-950 shadow-md' :
                          h.rank === 2 ? 'bg-slate-300 text-slate-950' :
                          h.rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {h.rank}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-white">{h.name}</td>
                      <td className="py-2.5 px-3 text-slate-300">{h.class}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-400">
                        {h.average.toFixed(2)}/20
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {h.decision}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400">
                Certifié conforme aux délibérations du Jury Pédagogique.
              </div>
              <button
                onClick={() => setPalmaresModalExam(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Details Modal */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Procès-Verbal Académique</h3>
              </div>
              <button onClick={() => setSelectedExam(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-sm font-bold text-white">{selectedExam.title}</div>
                <div className="text-slate-400">{selectedExam.session} · Date : {selectedExam.date}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase">Candidats inscrits</div>
                  <div className="text-lg font-black text-white">{selectedExam.candidatesCount}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase">Présents</div>
                  <div className="text-lg font-black text-blue-400">{selectedExam.presentCount}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase">Taux réussite</div>
                  <div className="text-lg font-black text-emerald-400">{selectedExam.successRate.toFixed(1)}%</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
                <div className="text-slate-300"><span className="font-semibold">Moyenne de session :</span> {selectedExam.classAverage.toFixed(2)}/20</div>
                <div className="text-slate-300"><span className="font-semibold">Meilleure note :</span> {selectedExam.highestAverage.toFixed(2)}/20</div>
                <div className="text-slate-300"><span className="font-semibold">Note plancher :</span> {selectedExam.lowestAverage.toFixed(2)}/20</div>
              </div>

              {selectedExam.directorNotes && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                  <span className="font-semibold block mb-0.5">Observations du Directeur des Études :</span>
                  {selectedExam.directorNotes}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedExam(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
