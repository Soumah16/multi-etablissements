import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import {
  buildDirectorReportDataset,
  downloadDirectorReportExcel,
  downloadDirectorReportPdf,
  DirectorReportDataset
} from '../../utils/exportDocuments';
import {
  BarChart3,
  FileText,
  FileSpreadsheet,
  Eye,
  X,
  Download,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export const DirectorReportsView: React.FC = () => {
  const {
    showToast,
    profile,
    reportCards,
    teacherProfiles,
    exams,
    studentRecords,
    disciplineIncidents
  } = useDirector();
  const { currentSchool } = useSchoolAdmin();

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewDataset, setPreviewDataset] = useState<DirectorReportDataset | null>(null);
  const [previewMeta, setPreviewMeta] = useState<{ id: string; title: string; category: string } | null>(null);

  const liveData = {
    reportCards,
    teacherProfiles,
    exams,
    studentRecords,
    disciplineIncidents
  };

  const reportsList = [
    {
      id: 'rep-01',
      title: 'Rapport Trimestriel de Synthèse Pédagogique · Trimestre 1',
      description:
        'Analyse détaillée des moyennes générales, classements par filière, taux de réussite et délibérations du conseil de classe.',
      category: 'Résultats Scolaires',
      date: 'Novembre 2026',
      recordsCount: `${reportCards.length} bulletins`
    },
    {
      id: 'rep-02',
      title: "Bilan d'Avancement des Programmes Ministériels (Syllabus)",
      description:
        'Pourcentage d’heures assurées par discipline, leçons consignées au cahier de texte et retards identifiés.',
      category: 'Progression Pédagogique',
      date: 'Novembre 2026',
      recordsCount: `${teacherProfiles.length} enseignants`
    },
    {
      id: 'rep-03',
      title: 'Procès-Verbal Officiel des Résultats des Examens',
      description:
        'Palmarès des sessions, taux d’admissibilité et moyennes générales par niveau et classe.',
      category: 'Examens Harmoniques',
      date: 'Octobre 2026',
      recordsCount: `${exams.length} sessions`
    },
    {
      id: 'rep-04',
      title: "Rapport Général d'Assiduité, Ponctualité & Discipline Scolaire",
      description:
        'Heures d’absences injustifiées, élèves en situation d’absentéisme critique et conduite disciplinaire.',
      category: 'Vie Scolaire',
      date: 'Novembre 2026',
      recordsCount: `${studentRecords.length} dossiers`
    }
  ];

  const handlePreview = (rep: { id: string; title: string; category: string }) => {
    const ds = buildDirectorReportDataset(rep.id, rep.title, rep.category, liveData);
    setPreviewDataset(ds);
    setPreviewMeta(rep);
  };

  const handleDownload = (
    rep: { id: string; title: string; category: string },
    format: 'PDF' | 'Excel'
  ) => {
    const key = `${rep.id}-${format}`;
    setDownloadingId(key);
    try {
      const schoolName = currentSchool?.name || profile.schoolName;
      if (format === 'PDF') {
        const filename = downloadDirectorReportPdf({
          reportId: rep.id,
          title: rep.title,
          category: rep.category,
          schoolName,
          directorName: profile.name,
          data: liveData
        });
        showToast(`PDF généré et téléchargé : ${filename}`);
      } else {
        const filename = downloadDirectorReportExcel({
          reportId: rep.id,
          title: rep.title,
          category: rep.category,
          schoolName,
          directorName: profile.name,
          data: liveData
        });
        showToast(`Classeur Excel (.xlsx) généré : ${filename}`);
      }
    } catch {
      showToast(`Erreur lors de la génération du fichier ${format}. Veuillez réessayer.`);
    } finally {
      setTimeout(() => setDownloadingId(null), 350);
    }
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
            <span className="text-xs text-slate-500">Exports PDF & Excel (.xlsx) certifiés</span>
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Rapports & Statistiques Pédagogiques</span>
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Génération en direct des bilans académiques officiels en PDF et Microsoft Excel (.xlsx) à partir des données de {currentSchool?.name || profile.schoolName}.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map(rep => {
          const isPdfBusy = downloadingId === `${rep.id}-PDF`;
          const isXlsBusy = downloadingId === `${rep.id}-Excel`;

          return (
            <div
              key={rep.id}
              className="p-5 rounded-2xl bg-white border border-blue-100 hover:border-blue-200 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
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

              <div className="pt-3 border-t border-blue-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Données réelles ({rep.recordsCount})</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePreview(rep)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                    title="Consulter le rapport à l'écran"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Aperçu</span>
                  </button>

                  <button
                    type="button"
                    disabled={isPdfBusy}
                    onClick={() => handleDownload(rep, 'PDF')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-60 shadow-xs transition-colors cursor-pointer"
                    title="Télécharger le document PDF officiel"
                  >
                    {isPdfBusy ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                    <span>PDF</span>
                  </button>

                  <button
                    type="button"
                    disabled={isXlsBusy}
                    onClick={() => handleDownload(rep, 'Excel')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 shadow-xs transition-colors cursor-pointer"
                    title="Télécharger le classeur Excel (.xlsx)"
                  >
                    {isXlsBusy ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    )}
                    <span>Excel (.xlsx)</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Preview Modal */}
      {previewDataset && previewMeta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 bg-blue-50/70 border-b border-blue-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                  {previewDataset.category} · {currentSchool?.name || profile.schoolName}
                </div>
                <h3 className="text-base font-black text-blue-950">{previewDataset.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(previewMeta, 'PDF')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(previewMeta, 'Excel')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Télécharger Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewDataset(null);
                    setPreviewMeta(null);
                  }}
                  className="p-1.5 text-slate-500 hover:text-blue-950 rounded-lg hover:bg-blue-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {/* Summary pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {previewDataset.summaryLines.map((line, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs font-semibold text-blue-950"
                  >
                    {line}
                  </div>
                ))}
              </div>

              {/* Preview Table */}
              <div className="rounded-xl border border-blue-100 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-blue-600 text-white text-[11px] uppercase tracking-wider">
                    <tr>
                      {previewDataset.headers.map((h, i) => (
                        <th key={i} className="py-2.5 px-3 whitespace-nowrap font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    {previewDataset.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-blue-50/60">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
