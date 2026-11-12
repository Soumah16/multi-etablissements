import React, { useState } from 'react';
import { useParent } from '../../context/ParentContext';
import { triggerPrint, exportPrintableDocument } from '../../utils/printHelper';
import { 
  FileCheck2, 
  Printer, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  QrCode, 
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';

export const ParentGradesReportCardView: React.FC = () => {
  const { selectedChild } = useParent();
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // Sample grades for the selected child
  const subjectsData = [
    { name: 'Mathématiques', coef: 5, interro: 18.5, devoir: 17.5, compo: 18.0, average: 17.8, rank: 1, appreciation: 'Excellent travail, rigueur exemplaire et maîtrise des démonstrations analytiques.' },
    { name: 'Physique-Chimie', coef: 4, interro: 16.0, devoir: 17.0, compo: 16.5, average: 16.6, rank: 2, appreciation: 'Très bons résultats en optique et mécanique, participation active aux TP.' },
    { name: 'SVT (Sciences de la Vie)', coef: 2, interro: 15.0, devoir: 16.0, compo: 15.5, average: 15.6, rank: 3, appreciation: 'Bonne assimilation des concepts génétiques, travail soigné.' },
    { name: 'Philosophie', coef: 2, interro: 14.5, devoir: 15.0, compo: 14.0, average: 14.4, rank: 4, appreciation: 'Pensée critique claire, continuez ainsi pour la dissertation de Bac.' },
    { name: 'Français & Littérature', coef: 2, interro: 15.0, devoir: 16.0, compo: 15.5, average: 15.6, rank: 2, appreciation: 'Bonne culture littéraire et excellente expression écrite.' },
    { name: 'Anglais', coef: 2, interro: 17.0, devoir: 18.0, compo: 17.5, average: 17.6, rank: 1, appreciation: 'Fluide à l’oral comme à l’écrit. Félicitations.' },
    { name: 'Histoire-Géographie', coef: 2, interro: 14.0, devoir: 15.0, compo: 15.0, average: 14.8, rank: 5, appreciation: 'Régulier, connaissances historiques solides.' },
    { name: 'Éducation Civique & Morale', coef: 1, interro: 18.0, devoir: 19.0, compo: 18.5, average: 18.6, rank: 1, appreciation: 'Comportement exemplaire et esprit républicain.' },
    { name: 'Éducation Physique (EPS)', coef: 1, interro: 16.0, devoir: 17.0, compo: 16.0, average: 16.4, rank: 3, appreciation: 'Bonne endurance et esprit d’équipe.' }
  ];

  const totalCoefficients = subjectsData.reduce((acc, s) => acc + s.coef, 0);
  const totalWeightedPoints = subjectsData.reduce((acc, s) => acc + (s.average * s.coef), 0);
  const calculatedGeneralAverage = (totalWeightedPoints / totalCoefficients).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Title & Print Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Trimestre 1 · Validé par la Direction
            </span>
            <span className="text-xs text-slate-400">Élève : {selectedChild.firstName} {selectedChild.lastName} ({selectedChild.className})</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white mt-1">Relevé de Notes & Bulletin Scolaire</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Détail des notes par matière, pondération par coefficient, appréciation des professeurs et aperçu d'impression.
          </p>
        </div>

        <button
          onClick={() => setPrintModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer le Bulletin Officiel (PDF)</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold">Moyenne Générale</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{calculatedGeneralAverage} / 20</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Félicitations du Conseil</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold">Rang dans la Classe</div>
          <div className="text-2xl font-black text-white mt-1">{selectedChild.classRank}ème</div>
          <div className="text-[10px] text-slate-400 mt-0.5">sur {selectedChild.totalStudents} élèves</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold">Total Coefficients</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{totalCoefficients}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">9 disciplines notées</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold">Assiduité Trimestrielle</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">100%</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Zéro absence injustifiée</div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase font-semibold bg-slate-800/40">
                <th className="py-3 px-4">Discipline</th>
                <th className="py-3 px-4 text-center">Coef</th>
                <th className="py-3 px-4 text-center">Interro /20</th>
                <th className="py-3 px-4 text-center">Devoir /20</th>
                <th className="py-3 px-4 text-center">Compo /20</th>
                <th className="py-3 px-4 text-center">Moyenne</th>
                <th className="py-3 px-4 text-center">Rang</th>
                <th className="py-3 px-4">Appréciation de l'Enseignant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {subjectsData.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white text-xs">{sub.name}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-300 font-bold">{sub.coef}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-300">{sub.interro.toFixed(1)}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-300">{sub.devoir.toFixed(1)}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-300">{sub.compo.toFixed(1)}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">{sub.average.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-300">{sub.rank}er</td>
                  <td className="py-3 px-4 text-slate-300 italic text-[11px] max-w-xs">{sub.appreciation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Printable Report Card Modal (Bulletin Officiel MEPU-A) */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col max-h-[92vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Aperçu du Bulletin Trimestriel Officiel</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('parent-bulletin-printable');
                    if (el) {
                      exportPrintableDocument(`Bulletin_${selectedChild.lastName}_T1`, el.innerHTML);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold cursor-pointer"
                  title="Télécharger une version imprimable propre"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </button>
                <button
                  onClick={() => triggerPrint('parent-bulletin-printable')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer</span>
                </button>
                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Fermer
                </button>
              </div>
            </div>

            {/* Printable Bulletin Sheet */}
            <div 
              id="parent-bulletin-printable"
              className="flex-1 p-6 overflow-y-auto bg-white text-slate-950 font-serif space-y-4 printable-document"
            >
              {/* Header République de Guinée */}
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start text-xs font-sans">
                <div className="text-center font-semibold">
                  <div>RÉPUBLIQUE DE GUINÉE</div>
                  <div className="text-[10px] text-slate-600">Travail - Justice - Solidarité</div>
                  <div className="text-[10px] font-bold mt-1 text-slate-800">MEPU-A · DIRECTION NATIONALE</div>
                </div>

                <div className="text-center">
                  <div className="text-base font-black uppercase tracking-tight text-slate-900">
                    LYCÉE D'EXCELLENCE DE CONAKRY
                  </div>
                  <div className="text-[10px] text-slate-600">Commune de Ratoma · Conakry, Guinée</div>
                  <div className="text-xs font-bold uppercase mt-1 px-3 py-0.5 bg-slate-100 rounded inline-block">
                    BULLETIN DU 1ER TRIMESTRE 2026-2027
                  </div>
                </div>

                <div className="w-16 h-16 border border-slate-300 flex items-center justify-center p-1">
                  <QrCode className="w-14 h-14 text-slate-900" />
                </div>
              </div>

              {/* Student Metadata Bar */}
              <div className="grid grid-cols-4 gap-2 text-xs font-sans p-3 bg-slate-50 border border-slate-200 rounded">
                <div>
                  <span className="text-slate-500 text-[10px] block">Nom & Prénom :</span>
                  <strong>{selectedChild.firstName} {selectedChild.lastName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Matricule :</span>
                  <strong className="font-mono">{selectedChild.matricule}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Classe :</span>
                  <strong>{selectedChild.className} ({selectedChild.totalStudents} élèves)</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Prof. Principal :</span>
                  <strong>{selectedChild.mainTeacher}</strong>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-xs font-sans border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-[10px] uppercase font-bold text-slate-700">
                    <th className="border border-slate-300 p-1.5 text-left">Matières</th>
                    <th className="border border-slate-300 p-1.5 text-center">Coef</th>
                    <th className="border border-slate-300 p-1.5 text-center">Moyenne</th>
                    <th className="border border-slate-300 p-1.5 text-center">Rang</th>
                    <th className="border border-slate-300 p-1.5 text-left">Appréciation</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectsData.map((sub, i) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="border border-slate-300 p-1.5 font-bold">{sub.name}</td>
                      <td className="border border-slate-300 p-1.5 text-center font-bold">{sub.coef}</td>
                      <td className="border border-slate-300 p-1.5 text-center font-bold text-blue-900">{sub.average.toFixed(2)}</td>
                      <td className="border border-slate-300 p-1.5 text-center">{sub.rank}er</td>
                      <td className="border border-slate-300 p-1.5 italic text-[11px]">{sub.appreciation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Decision & Signatures */}
              <div className="grid grid-cols-3 gap-3 text-xs font-sans pt-3 border-t-2 border-slate-900">
                <div className="p-2 border border-slate-300 rounded text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Moyenne Trimestrielle</div>
                  <div className="text-xl font-black text-slate-900 mt-1">{calculatedGeneralAverage} / 20</div>
                  <div className="text-[10px] font-bold text-emerald-700 mt-0.5">Rang : {selectedChild.classRank}er / {selectedChild.totalStudents}</div>
                </div>

                <div className="p-2 border border-slate-300 rounded text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Mention du Conseil</div>
                  <div className="text-xs font-bold text-emerald-800 mt-2 uppercase">TABLEAU D'HONNEUR AVEC FÉLICITATIONS</div>
                </div>

                <div className="p-2 border border-slate-300 rounded text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Le Directeur des Études</div>
                  <div className="text-[11px] font-bold text-slate-900 mt-2">Dr. Ibrahima Sory Bangoura</div>
                  <div className="text-[9px] text-blue-700 font-mono">[Signature Numérique Certifiée]</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
