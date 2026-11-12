import React, { useState, useRef } from 'react';
import { useStudent } from '../../context/StudentContext';
import { StudentHomeworkSubmission } from '../../types/student';
import { 
  FileText, 
  Upload, 
  Download, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Award,
  Send,
  X,
  Eye,
  FileCheck,
  Image as ImageIcon,
  File,
  Trash2
} from 'lucide-react';

export const StudentHomeworkView: React.FC = () => {
  const { homeworks, submitHomework, showToast } = useStudent();
  const [selectedHomework, setSelectedHomework] = useState<StudentHomeworkSubmission | null>(null);
  const [previewSubmissionHw, setPreviewSubmissionHw] = useState<StudentHomeworkSubmission | null>(null);

  // Form State
  const [submissionFileName, setSubmissionFileName] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [selectedFileData, setSelectedFileData] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<string>('');
  const [selectedFileSize, setSelectedFileSize] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenSubmitModal = (hw: StudentHomeworkSubmission) => {
    setSelectedHomework(hw);
    setSubmissionFileName(hw.submittedFile || `${hw.subject.substring(0, 4)}_Devoir_DialloFB.pdf`);
    setSubmissionNote(hw.submissionNote || '');
    setSelectedFileData(hw.submittedFileData || null);
    setSelectedFileType(hw.submittedFileType || '');
    setSelectedFileSize(hw.submittedFileSize || '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Check file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      showToast('Le fichier dépasse la limite maximale autorisée (25 Mo).');
      return;
    }

    const formattedSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(2)} Mo`
      : `${(file.size / 1024).toFixed(1)} Ko`;

    setSubmissionFileName(file.name);
    setSelectedFileType(file.type);
    setSelectedFileSize(formattedSize);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFileData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHomework) return;
    
    // Fallback if no file picked
    const finalName = submissionFileName || 'Copie_Devoir.pdf';
    submitHomework(
      selectedHomework.id, 
      finalName, 
      submissionNote, 
      selectedFileData || undefined, 
      selectedFileType || undefined, 
      selectedFileSize || undefined
    );
    setSelectedHomework(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white">Devoirs à Rendre & Dépôt des Copies</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Téléchargez les énoncés de devoirs, déposez vos copies numérisées (fichiers PDF réels, photos de copies ou documents Word) et suivez les corrections.
        </p>
      </div>

      {/* Homework Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {homeworks.map(hw => {
          const isPending = hw.status === 'en_attente';
          const isSubmitted = hw.status === 'soumis';
          const isGraded = hw.status === 'corrige';

          return (
            <div key={hw.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-800 text-blue-300 border border-slate-700">
                    {hw.subject}
                  </span>

                  {isGraded && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Note : {hw.score} / {hw.maxScore}
                    </span>
                  )}
                  {isSubmitted && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Copie Transmise</span>
                    </span>
                  )}
                  {isPending && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>À rendre</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white">{hw.title}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">Professeur : {hw.teacherName}</div>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span>Donné le : {hw.assignedDate}</span>
                  <span className="font-mono text-amber-400 font-bold">Échéance : {hw.dueDate}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                  {hw.description}
                </p>

                {/* Submitted file information */}
                {hw.submittedFile && (
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
                    <div className="flex items-center justify-between text-xs text-cyan-200">
                      <div className="flex items-center gap-2">
                        {hw.submittedFileType?.includes('image') ? (
                          <ImageIcon className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-cyan-400" />
                        )}
                        <span className="font-mono font-bold text-[11px] truncate max-w-[190px]">
                          {hw.submittedFile}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{hw.submissionDate}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-cyan-500/20 text-[11px]">
                      <span className="text-slate-400">{hw.submittedFileSize || 'Document enregistré'}</span>
                      <button
                        onClick={() => setPreviewSubmissionHw(hw)}
                        className="text-cyan-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Consulter ma copie</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Teacher feedback if graded */}
                {hw.teacherFeedback && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 space-y-1">
                    <div className="font-bold text-[10px] uppercase text-emerald-400">Retour du professeur :</div>
                    <p className="italic">{hw.teacherFeedback}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => showToast(`Téléchargement de l'énoncé officiel « ${hw.title} »...`)}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Énoncé PDF</span>
                </button>

                {isPending ? (
                  <button
                    onClick={() => handleOpenSubmitModal(hw)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Déposer ma copie (PDF / Image)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenSubmitModal(hw)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Remplacer la copie</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive File Submission Modal */}
      {selectedHomework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
            {/* Pinned Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900">
              <div>
                <h3 className="text-sm font-bold text-white">Déposer ma copie de devoir</h3>
                <div className="text-[11px] text-slate-400">Téléversement réel de fichier PDF, image de copie ou document</div>
              </div>
              <button
                onClick={() => setSelectedHomework(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmission} className="flex-1 flex flex-col min-h-0">
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
                  <div className="font-bold text-white">{selectedHomework.title}</div>
                  <div className="text-slate-400 text-[11px]">
                    Discipline : <strong className="text-blue-400">{selectedHomework.subject}</strong> · Destinataire : {selectedHomework.teacherName}
                  </div>
                  <div className="text-amber-400 font-mono text-[10px]">
                    Date limite : {selectedHomework.dueDate}
                  </div>
                </div>

                {/* REAL File Selection Input & Drag and Drop Zone */}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".pdf,image/*,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-4 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer space-y-2 ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-500/20' 
                      : selectedFileData 
                      ? 'border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10' 
                      : 'border-slate-700 bg-slate-800/40 hover:border-blue-500/50 hover:bg-slate-800/60'
                  }`}
                >
                  {selectedFileData ? (
                    <div className="space-y-1.5">
                      {selectedFileType.includes('image') ? (
                        <div className="relative inline-block">
                          <img 
                            src={selectedFileData} 
                            alt="Aperçu copie" 
                            className="max-h-36 rounded-xl object-contain mx-auto border border-emerald-500/30 shadow-md"
                          />
                          <div className="absolute top-2 right-2 p-1 rounded-full bg-emerald-600 text-white shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                          <FileCheck className="w-7 h-7" />
                        </div>
                      )}
                      <div className="text-xs font-bold text-white truncate max-w-xs mx-auto">
                        {submissionFileName}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-medium">
                        Fichier chargé ({selectedFileSize}) · Cliquez pour remplacer
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          Cliquez ici ou glissez-déposez votre copie
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Fichiers acceptés : <strong>PDF, Photos (JPG, PNG), Word</strong> (Max 25 Mo)
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs"
                      >
                        Parcourir les fichiers
                      </button>
                    </>
                  )}
                </div>

                {/* File Name Field */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Intitulé du document remis *</label>
                  <input
                    type="text"
                    required
                    value={submissionFileName}
                    onChange={(e) => setSubmissionFileName(e.target.value)}
                    placeholder="ex: Maths_DM_Diallo_Fatoumata.pdf"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>

                {/* Note for Teacher */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Message / Note pour le professeur (Optionnel)</label>
                  <textarea
                    rows={2}
                    value={submissionNote}
                    onChange={(e) => setSubmissionNote(e.target.value)}
                    placeholder="ex: Bonjour Monsieur, j'ai rédigé les 3 exercices sur feuille double avec les graphiques détaillés..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              {/* Pinned Modal Footer */}
              <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedHomework(null)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shadow-md shadow-blue-600/30"
                >
                  Valider et transmettre la copie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal to view submitted copy */}
      {previewSubmissionHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Copie Déposée : {previewSubmissionHw.submittedFile}</h3>
                  <div className="text-[11px] text-slate-400">Remis le {previewSubmissionHw.submissionDate} · {previewSubmissionHw.subject}</div>
                </div>
              </div>
              <button
                onClick={() => setPreviewSubmissionHw(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 bg-slate-950 flex-1">
              {previewSubmissionHw.submittedFileData && previewSubmissionHw.submittedFileType?.includes('image') ? (
                <div className="text-center">
                  <img 
                    src={previewSubmissionHw.submittedFileData} 
                    alt="Copie remise" 
                    className="max-h-[500px] mx-auto rounded-xl shadow-lg border border-slate-800"
                  />
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
                  <FileText className="w-16 h-16 text-cyan-400 mx-auto" />
                  <div className="font-bold text-white text-base">{previewSubmissionHw.submittedFile}</div>
                  <div className="text-xs text-slate-400 max-w-md mx-auto">
                    Le document a été scellé et enregistré sur le serveur académique avec horodatage certifié.
                  </div>
                  {previewSubmissionHw.submissionNote && (
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-left max-w-md mx-auto">
                      <strong className="text-slate-300 block mb-1">Votre note d'accompagnement :</strong>
                      <span className="text-slate-400 italic">{previewSubmissionHw.submissionNote}</span>
                    </div>
                  )}
                  {previewSubmissionHw.submittedFileData && (
                    <a
                      href={previewSubmissionHw.submittedFileData}
                      download={previewSubmissionHw.submittedFile}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer mt-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger le fichier original</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-900 flex justify-end shrink-0">
              <button
                onClick={() => setPreviewSubmissionHw(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Fermer l'aperçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
