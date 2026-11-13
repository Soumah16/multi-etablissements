import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { StudentReportCard } from '../../types/director';
import { 
  FileSignature, 
  Search, 
  Filter, 
  Check, 
  X, 
  RotateCcw, 
  Eye, 
  Printer, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Send,
  Download
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const ReportCardValidationView: React.FC = () => {
  const { 
    reportCards, 
    approveReportCard, 
    rejectReportCard, 
    requestCorrectionReportCard,
    profile 
  } = useDirector();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'en_attente' | 'approuve' | 'correction_demandee' | 'rejete'>('all');
  const [classFilter, setClassFilter] = useState('all');
  const [selectedCardForView, setSelectedCardForView] = useState<StudentReportCard | null>(null);
  
  // Observation modal
  const [observationModalCard, setObservationModalCard] = useState<StudentReportCard | null>(null);
  const [customObservation, setCustomObservation] = useState('');
  const [rejectionModalCard, setRejectionModalCard] = useState<StudentReportCard | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [correctionModalCard, setCorrectionModalCard] = useState<StudentReportCard | null>(null);
  const [correctionNotes, setCorrectionNotes] = useState('');

  const uniqueClasses = Array.from(new Set(reportCards.map(c => c.className)));

  const filteredCards = reportCards.filter(c => {
    const matchesSearch = 
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentMatricule.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.directorStatus === statusFilter;
    const matchesClass = classFilter === 'all' || c.className === classFilter;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const pendingCount = reportCards.filter(c => c.directorStatus === 'en_attente').length;
  const approvedCount = reportCards.filter(c => c.directorStatus === 'approuve').length;
  const correctionCount = reportCards.filter(c => c.directorStatus === 'correction_demandee').length;

  const handlePrint = () => {
    triggerPrint(
      'director-bulletin-printable-paper', 
      selectedCardForView ? `Bulletin_${selectedCardForView.studentName.replace(/\s+/g, '_')}` : 'Bulletin_Scolaire'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-blue-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Autorité Exclusive du Directeur
            </span>
            <span className="text-xs text-slate-500">1er Trimestre 2026-2027</span>
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
            <FileSignature className="w-6 h-6 text-amber-700" />
            <span>Validation Officielle des Bulletins Scolaires</span>
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Contrôle des notes, des moyennes et des rangs avant application du visa et de la signature électronique certifiée.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-center">
            <div className="text-[10px] uppercase font-semibold text-blue-600">En attente</div>
            <div className="text-lg font-bold text-blue-950">{pendingCount}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-[10px] uppercase font-semibold text-emerald-600">Approuvés</div>
            <div className="text-lg font-bold text-blue-950">{approvedCount}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <div className="text-[10px] uppercase font-semibold text-amber-700">Corrections</div>
            <div className="text-lg font-bold text-blue-950">{correctionCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-white border border-blue-100">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par élève ou matricule..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
          >
            <option value="all">Toutes les classes</option>
            {uniqueClasses.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente de visa</option>
            <option value="approuve">Approuvés & Signés</option>
            <option value="correction_demandee">Correction demandée</option>
            <option value="rejete">Rejetés</option>
          </select>
        </div>
      </div>

      {/* Report Cards Table */}
      <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-50/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Élève & Matricule</th>
                <th className="py-3 px-3">Classe</th>
                <th className="py-3 px-3 text-center">Moyenne Générale</th>
                <th className="py-3 px-3 text-center">Rang</th>
                <th className="py-3 px-3">Assiduité</th>
                <th className="py-3 px-3">Avis Conseil</th>
                <th className="py-3 px-3">Statut Signature</th>
                <th className="py-3 px-4 text-right">Actions Directeur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredCards.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    Aucun bulletin trouvé avec ces critères de filtrage.
                  </td>
                </tr>
              ) : (
                filteredCards.map(card => (
                  <tr key={card.id} className="hover:bg-blue-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={card.studentPhoto} 
                          alt="" 
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" 
                        />
                        <div>
                          <div className="font-bold text-blue-950">{card.studentName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{card.studentMatricule}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700">
                      {card.className}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`text-sm font-mono font-black ${
                        card.generalAverage >= 14 ? 'text-emerald-600' :
                        card.generalAverage >= 10 ? 'text-blue-600' : 'text-rose-600'
                      }`}>
                        {card.generalAverage.toFixed(2)}/20
                      </span>
                      <div className="text-[10px] text-slate-500">Moy. classe: {card.classAverage.toFixed(2)}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">
                      {card.classRank}e <span className="text-[10px] text-slate-500 font-normal">/ {card.totalStudentsInClass}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      <div>{card.absencesHours}h absences</div>
                      <div className="text-[10px] text-slate-500">{card.delaysCount} retards</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        card.councilDecision === 'Tableau d\'Honneur' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        card.councilDecision === 'Compliments' || card.councilDecision === 'Encouragements' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-slate-50 text-slate-500 border border-slate-200'
                      }`}>
                        {card.councilDecision}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      {card.directorStatus === 'approuve' ? (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Approuvé & Signé
                          </span>
                          <span className="text-[9px] text-emerald-400/80 font-mono mt-0.5">
                            {card.signatureHash?.substring(0, 16)}...
                          </span>
                        </div>
                      ) : card.directorStatus === 'correction_demandee' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Correction demandée
                        </span>
                      ) : card.directorStatus === 'rejete' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          Rejeté
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          En attente de visa
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCardForView(card)}
                          className="p-1.5 rounded-lg text-slate-700 hover:text-blue-950 hover:bg-blue-50 transition-colors"
                          title="Examiner le bulletin complet"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>

                        {card.directorStatus === 'en_attente' && (
                          <>
                            <button
                              onClick={() => {
                                setObservationModalCard(card);
                                setCustomObservation(card.directorObservation || 'Travail satisfaisant. Poursuivez dans cette dynamique.');
                              }}
                              className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs flex items-center gap-1"
                              title="Valider avec observation et signature (PIN/2FA)"
                            >
                              <Check className="w-3 h-3" />
                              <span>Valider</span>
                            </button>
                            <button
                              onClick={() => {
                                setCorrectionModalCard(card);
                                setCorrectionNotes('');
                              }}
                              className="px-2 py-1 rounded-md text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-50 border border-amber-200"
                              title="Demander une correction d'un professeur"
                            >
                              Révision
                            </button>
                            <button
                              onClick={() => {
                                setRejectionModalCard(card);
                                setRejectionReason('');
                              }}
                              className="p-1 rounded-md text-rose-600 hover:bg-rose-50"
                              title="Rejeter le bulletin"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {card.directorStatus === 'approuve' && (
                          <button
                            onClick={() => setSelectedCardForView(card)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-50 border border-emerald-200 flex items-center gap-1"
                          >
                            <FileCheck className="w-3 h-3" />
                            <span>PDF Officiel</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulletin Detail / Official Specimen Modal */}
      {selectedCardForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Bar */}
            <div className="p-4 bg-blue-50/60 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-amber-700" />
                <h3 className="text-sm font-bold text-blue-950">
                  Spécimen Officiel de Bulletin Scolaire · {selectedCardForView.termName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer</span>
                </button>
                <button
                  onClick={() => setSelectedCardForView(null)}
                  className="p-1.5 text-slate-500 hover:text-blue-950 rounded-lg hover:bg-blue-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Paper Body */}
            <div id="director-bulletin-printable-paper" className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F0F5FA] text-slate-900 font-sans print:bg-white print:text-black">
              {/* Official Letterhead */}
              <div className="border-b-2 border-blue-100 pb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                    LEC
                  </div>
                  <div>
                    <h2 className="text-base font-black uppercase tracking-tight text-blue-950">
                      Lycée d'Excellence de Conakry
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Ministère de l'Enseignement Pré-Universitaire et de l'Alphabétisation (MEPU-A)
                    </p>
                    <p className="text-[10px] text-blue-600 font-mono">
                      République de Guinée · Travail - Justice - Solidarité
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-bold text-blue-950">BULLETIN TRIMESTRIEL DE NOTES</div>
                  <div className="text-[11px] text-slate-500">{selectedCardForView.termName} · Année {selectedCardForView.academicYear}</div>
                  <div className="text-[10px] font-mono text-emerald-600 mt-0.5">
                    Document Officiel Certifié
                  </div>
                </div>
              </div>

              {/* Student Identification Badge Area */}
              <div className="p-3.5 rounded-xl bg-white border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedCardForView.studentPhoto} 
                    alt="" 
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-sm font-black text-blue-950">{selectedCardForView.studentName}</div>
                    <div className="text-xs text-slate-700">
                      Classe : <span className="font-bold text-blue-600">{selectedCardForView.className}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">Matricule : {selectedCardForView.studentMatricule}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-2 rounded-lg bg-blue-50/60">
                    <span className="text-[10px] text-slate-500 block">Moyenne</span>
                    <span className="text-base font-black text-emerald-600 font-mono">
                      {selectedCardForView.generalAverage.toFixed(2)}/20
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50/60">
                    <span className="text-[10px] text-slate-500 block">Rang</span>
                    <span className="text-base font-black text-blue-950 font-mono">
                      {selectedCardForView.classRank}e / {selectedCardForView.totalStudentsInClass}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50/60 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-500 block">Moyenne Classe</span>
                    <span className="text-base font-bold text-slate-700 font-mono">
                      {selectedCardForView.classAverage.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grades Table */}
              <div className="rounded-xl border border-blue-100 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white text-slate-500 uppercase text-[10px] tracking-wider border-b border-blue-100">
                    <tr>
                      <th className="py-2.5 px-3">Matière</th>
                      <th className="py-2.5 px-2 text-center">Coef</th>
                      <th className="py-2.5 px-2 text-center">Devoirs /20</th>
                      <th className="py-2.5 px-2 text-center">Examen /20</th>
                      <th className="py-2.5 px-2 text-center font-bold text-blue-950">Moyenne /20</th>
                      <th className="py-2.5 px-3">Appréciation de l'Enseignant</th>
                      <th className="py-2.5 px-3">Professeur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    {selectedCardForView.grades.map(grade => (
                      <tr key={grade.id} className="hover:bg-white/90">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {grade.subjectName}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-slate-500">
                          {grade.coefficient}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-slate-700">
                          {grade.continuousNote.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-slate-700">
                          {grade.examNote.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-emerald-600 bg-emerald-50">
                          {grade.finalNote.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 text-[11px] italic">
                          "{grade.appreciation}"
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                          {grade.teacherName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Behavior & Council Decision */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-blue-100 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Vie Scolaire & Assiduité
                  </span>
                  <div className="text-slate-700">
                    <span className="font-semibold">Absences totales :</span> {selectedCardForView.absencesHours} heures 
                    <span className="text-slate-500 ml-1">({selectedCardForView.unjustifiedAbsencesHours}h non justifiées)</span>
                  </div>
                  <div className="text-slate-700">
                    <span className="font-semibold">Retards :</span> {selectedCardForView.delaysCount} retards
                  </div>
                  <div className="text-slate-500 text-[11px] italic pt-1 border-t border-blue-100">
                    "{selectedCardForView.conductAppreciation}"
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-blue-100 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Délibération du Conseil de Classe
                  </span>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-700" />
                    <span className="text-sm font-bold text-amber-700">
                      {selectedCardForView.councilDecision}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Plus haute moyenne : {selectedCardForView.highestClassAverage.toFixed(2)} · Plus basse : {selectedCardForView.lowestClassAverage.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Director's Certification & Digital Signature Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-white via-blue-50 to-blue-50/80 border-2 border-dashed border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                      Visa & Signature Officielle de la Direction des Études
                    </span>
                  </div>
                  {selectedCardForView.directorStatus === 'approuve' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Certifié & Archivé
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      En attente de signature numérique
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">Observation du Directeur : </span>
                  <span className="italic">
                    {selectedCardForView.directorObservation || 'Aucune observation saisie pour l\'instant.'}
                  </span>
                </div>

                {selectedCardForView.directorStatus === 'approuve' ? (
                  <div className="pt-2 border-t border-blue-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div>
                      <div>Signé par : <span className="font-bold text-blue-950">{selectedCardForView.validatedBy}</span></div>
                      <div>Date & Heure : {selectedCardForView.validatedAt}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[10px] text-emerald-600">{selectedCardForView.signatureHash}</div>
                      <div className="text-[9px] text-slate-500">Horodatage cryptographique SmartSchool</div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => {
                        setSelectedCardForView(null);
                        approveReportCard(selectedCardForView.id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approuver & Signer Maintenant (PIN/2FA)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Observation Modal */}
      {observationModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-emerald-600" />
                <span>Observation & Validation du Bulletin</span>
              </h3>
              <button onClick={() => setObservationModalCard(null)} className="text-slate-500 hover:text-blue-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-700">
              Élève : <span className="font-bold text-blue-950">{observationModalCard.studentName}</span> ({observationModalCard.className})
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observation officielle du Directeur des Études :
              </label>
              <textarea
                rows={3}
                value={customObservation}
                onChange={(e) => setCustomObservation(e.target.value)}
                placeholder="Ajouter une observation pédagogique..."
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setObservationModalCard(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-blue-950 hover:bg-blue-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  const cardId = observationModalCard.id;
                  setObservationModalCard(null);
                  approveReportCard(cardId, customObservation);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Confirmer & Signer (PIN/2FA)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Correction Modal */}
      {correctionModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-amber-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-700 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>Demander une Correction d'Enseignant</span>
              </h3>
              <button onClick={() => setCorrectionModalCard(null)} className="text-slate-500 hover:text-blue-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700">
              Précisez le motif du retour pour révision au professeur principal :
            </p>

            <textarea
              rows={3}
              value={correctionNotes}
              onChange={(e) => setCorrectionNotes(e.target.value)}
              placeholder="Ex: Merci de revérifier la note de physique suite à réclamation..."
              className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCorrectionModalCard(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-blue-950 hover:bg-blue-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (correctionNotes.trim()) {
                    requestCorrectionReportCard(correctionModalCard.id, correctionNotes);
                    setCorrectionModalCard(null);
                  }
                }}
                disabled={!correctionNotes.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Transmettre la Demande</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-rose-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Rejet Définitif du Bulletin</span>
              </h3>
              <button onClick={() => setRejectionModalCard(null)} className="text-slate-500 hover:text-blue-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700">
              Veuillez consigner le motif de non-validation du bulletin de {rejectionModalCard.studentName} :
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Motif de rejet..."
              className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectionModalCard(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-blue-950 hover:bg-blue-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (rejectionReason.trim()) {
                    rejectReportCard(rejectionModalCard.id, rejectionReason);
                    setRejectionModalCard(null);
                  }
                }}
                disabled={!rejectionReason.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                <span>Rejeter</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
