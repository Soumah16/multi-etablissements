import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { 
  BarChart3, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  CheckCircle2, 
  Printer, 
  TrendingUp, 
  Award, 
  Users, 
  BookOpen
} from 'lucide-react';

export const DirectorReportsView: React.FC = () => {
  const { showToast, profile } = useDirector();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const reportsList = [
    {
      id: 'rep-01',
      title: 'Rapport Trimestriel de Synthèse Pédagogique · Trimestre 1',
      description: 'Analyse détaillée des moyennes générales, classements par filière, taux de réussite et délibérations du conseil de classe.',
      category: 'Résultats Scolaires',
      date: 'Novembre 2026',
      sizePdf: '1.8 Mo',
      sizeCsv: '240 Ko'
    },
    {
      id: 'rep-02',
      title: 'Bilan d\'Avancement des Programmes Ministériels (Syllabus)',
      description: 'Pourcentage d\'heures assurées par discipline, leçons consignées au cahier de texte et retards identifiés.',
      category: 'Progression Pédagogique',
      date: 'Novembre 2026',
      sizePdf: '950 Ko',
      sizeCsv: '110 Ko'
    },
    {
      id: 'rep-03',
      title: 'Procès-Verbal Officiel des Résultats du Baccalauréat Blanc (Session 1)',
      description: 'Palmarès des lauréats, distribution des mentions et statistiques d\'admissibilité par matière obligatoire.',
      category: 'Examens Harmoniques',
      date: 'Octobre 2026',
      sizePdf: '2.4 Mo',
      sizeCsv: '380 Ko'
    },
    {
      id: 'rep-04',
      title: 'Rapport Général d\'Assiduité, Ponctualité & Discipline Scolaire',
      description: 'Heures d\'absences injustifiées, élèves en situation d\'absentéisme critique et sanctions prononcées.',
      category: 'Vie Scolaire',
      date: 'Novembre 2026',
      sizePdf: '1.2 Mo',
      sizeCsv: '190 Ko'
    }
  ];

  const handleDownload = (reportTitle: string, format: 'PDF' | 'Excel') => {
    setDownloadingId(reportTitle + format);
    setTimeout(() => {
      setDownloadingId(null);
      // Create instant simulated file download
      const filename = `${reportTitle.replace(/\s+/g, '_')}.${format === 'PDF' ? 'pdf' : 'csv'}`;
      const dummyContent = format === 'PDF' 
        ? `%PDF-1.4\n1 0 obj\n<< /Title (${reportTitle}) /Author (${profile.name}) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`
        : `Rapport;${reportTitle}\nAuteur;${profile.name}\nDate;${new Date().toISOString()}\nStatut;Certifié`;
      
      const blob = new Blob([dummyContent], { type: format === 'PDF' ? 'application/pdf' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(`Téléchargement de "${reportTitle}" au format ${format} terminé !`);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-blue-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Direction des Études · Données Pédagogiques
            </span>
            <span className="text-xs text-slate-500">Formats PDF & Tableur Excel</span>
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Rapports & Statistiques Pédagogiques</span>
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Génération des bilans académiques officiels pour l'inspection d'académie, la direction et les conseils pédagogiques.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map(rep => (
          <div 
            key={rep.id}
            className="p-5 rounded-2xl bg-white border border-blue-100 hover:border-slate-200 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {rep.category}
                </span>
                <span className="text-xs font-mono text-slate-500">{rep.date}</span>
              </div>

              <h3 className="text-base font-bold text-blue-950 leading-snug">
                {rep.title}
              </h3>

              <p className="text-xs text-slate-700 leading-relaxed">
                {rep.description}
              </p>
            </div>

            <div className="pt-3 border-t border-blue-100 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 font-mono">
                Certifié conforme SmartSchool
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(rep.title, 'PDF')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-xs transition-colors"
                  title="Exporter au format PDF certifié"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF ({rep.sizePdf})</span>
                </button>

                <button
                  onClick={() => handleDownload(rep.title, 'Excel')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs transition-colors"
                  title="Exporter au format Excel / CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Excel ({rep.sizeCsv})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
