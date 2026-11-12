import React from 'react';
import { useStudent } from '../../context/StudentContext';
import { triggerPrint, exportPrintableDocument } from '../../utils/printHelper';
import { 
  FileCheck2, 
  Printer, 
  QrCode, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Building2,
  Download
} from 'lucide-react';

export const StudentReportCardView: React.FC = () => {
  const { profile } = useStudent();

  const subjects = [
    { name: 'Mathématiques', coef: 5, devoir: 18.0, compo: 18.5, avg: 18.25, rank: 1, teacher: 'M. Diallo', comments: 'Excellente maîtrise analytique.' },
    { name: 'Physique-Chimie', coef: 4, devoir: 16.5, compo: 17.0, avg: 16.75, rank: 2, teacher: 'M. Traoré', comments: 'Très bons résultats expérimentaux.' },
    { name: 'SVT', coef: 2, devoir: 15.5, compo: 16.0, avg: 15.75, rank: 3, teacher: 'M. Bah', comments: 'Régulier et appliqué.' },
    { name: 'Philosophie', coef: 2, devoir: 15.0, compo: 14.5, avg: 14.75, rank: 4, teacher: 'Mme Camara', comments: 'Pensée critique claire et argumentée.' },
    { name: 'Français', coef: 2, devoir: 16.0, compo: 15.5, avg: 15.75, rank: 2, teacher: 'Mme Sylla', comments: 'Excellente culture littéraire.' },
    { name: 'Anglais', coef: 2, devoir: 17.5, compo: 18.0, avg: 17.75, rank: 1, teacher: 'M. Soumah', comments: 'Très à l’aise en expression orale.' },
    { name: 'Histoire-Géo', coef: 2, devoir: 15.0, compo: 15.0, avg: 15.00, rank: 5, teacher: 'M. Condé', comments: 'Bonnes connaissances des programmes.' },
    { name: 'ECM', coef: 1, devoir: 19.0, compo: 18.5, avg: 18.75, rank: 1, teacher: 'M. Keïta', comments: 'Conduite irréprochable.' },
    { name: 'EPS', coef: 1, devoir: 17.0, compo: 16.0, avg: 16.50, rank: 3, teacher: 'M. Bangoura', comments: 'Bonne participation.' }
  ];

  const totalCoefs = subjects.reduce((a, b) => a + b.coef, 0);
  const totalWeighted = subjects.reduce((a, b) => a + (b.avg * b.coef), 0);
  const genAvg = (totalWeighted / totalCoefs).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Mon Bulletin Scolaire Officiel</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Document officiel certifié avec signature électronique de la Direction des Études et QR Code de vérification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const el = document.getElementById('student-bulletin-printable');
              if (el) {
                exportPrintableDocument(`Bulletin_${profile.lastName}_${profile.matricule}`, el.innerHTML);
              }
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Télécharger (HTML/PDF)</span>
          </button>
          <button
            onClick={() => triggerPrint('student-bulletin-printable')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Printable Bulletin Document (Paper look) */}
      <div 
        id="student-bulletin-printable"
        className="max-w-4xl mx-auto rounded-2xl bg-white text-slate-950 p-6 md:p-8 font-serif shadow-2xl border border-slate-200 space-y-6 printable-document"
      >
        {/* Header MEPU-A */}
        <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start font-sans">
          <div className="text-center font-semibold text-xs">
            <div>RÉPUBLIQUE DE GUINÉE</div>
            <div className="text-[10px] text-slate-600">Travail - Justice - Solidarité</div>
            <div className="text-[10px] font-bold mt-1 text-slate-800">MEPU-A · DIRECTION NATIONALE</div>
          </div>

          <div className="text-center">
            <div className="text-base font-black uppercase tracking-tight text-slate-900">
              {profile.schoolName}
            </div>
            <div className="text-[10px] text-slate-600">Commune de Ratoma · Conakry, Guinée</div>
            <div className="text-xs font-bold uppercase mt-1 px-3 py-1 bg-slate-100 rounded inline-block text-slate-800">
              BULLETIN DU 1ER TRIMESTRE · ANNÉE 2026-2027
            </div>
          </div>

          <div className="w-16 h-16 border border-slate-300 flex items-center justify-center p-1">
            <QrCode className="w-14 h-14 text-slate-900" />
          </div>
        </div>

        {/* Student details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans p-3 bg-slate-50 border border-slate-200 rounded">
          <div>
            <span className="text-slate-500 text-[10px] block">Élève :</span>
            <strong>{profile.firstName} {profile.lastName}</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Matricule :</span>
            <strong className="font-mono">{profile.matricule}</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Classe :</span>
            <strong>{profile.className} ({profile.totalStudentsInClass} élèves)</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Tuteur Légal :</span>
            <strong>{profile.parentName}</strong>
          </div>
        </div>

        {/* Grades Table */}
        <table className="w-full text-xs font-sans border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-[10px] uppercase font-bold text-slate-700">
              <th className="border border-slate-300 p-2 text-left">Disciplines</th>
              <th className="border border-slate-300 p-2 text-center">Coef</th>
              <th className="border border-slate-300 p-2 text-center">Devoir</th>
              <th className="border border-slate-300 p-2 text-center">Compo</th>
              <th className="border border-slate-300 p-2 text-center">Moyenne</th>
              <th className="border border-slate-300 p-2 text-center">Rang</th>
              <th className="border border-slate-300 p-2 text-left">Appréciation de l'Enseignant</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s, idx) => (
              <tr key={idx} className="border-b border-slate-200">
                <td className="border border-slate-300 p-2 font-bold">{s.name}</td>
                <td className="border border-slate-300 p-2 text-center font-bold">{s.coef}</td>
                <td className="border border-slate-300 p-2 text-center">{s.devoir.toFixed(1)}</td>
                <td className="border border-slate-300 p-2 text-center">{s.compo.toFixed(1)}</td>
                <td className="border border-slate-300 p-2 text-center font-black text-blue-900">{s.avg.toFixed(2)}</td>
                <td className="border border-slate-300 p-2 text-center">{s.rank}er</td>
                <td className="border border-slate-300 p-2 italic text-[11px]">{s.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Statistics & Decision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans pt-4 border-t-2 border-slate-900">
          <div className="p-3 border border-slate-300 rounded text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">Moyenne Trimestrielle</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{genAvg} / 20</div>
            <div className="text-xs font-bold text-emerald-700 mt-0.5">Rang : {profile.classRank}ère sur {profile.totalStudentsInClass}</div>
          </div>

          <div className="p-3 border border-slate-300 rounded text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">Décision du Conseil</div>
            <div className="text-xs font-bold text-emerald-800 mt-2 uppercase">FÉLICITATIONS & TABLEAU D'HONNEUR</div>
          </div>

          <div className="p-3 border border-slate-300 rounded text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">Le Directeur des Études</div>
            <div className="text-xs font-bold text-slate-900 mt-2">Dr. Ibrahima Sory Bangoura</div>
            <div className="text-[9px] text-blue-700 font-mono mt-1">[Signature Électronique Certifiée]</div>
          </div>
        </div>
      </div>
    </div>
  );
};
