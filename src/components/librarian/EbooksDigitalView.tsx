import React, { useRef, useState } from 'react';
import { useLibrarian } from '../../context/LibrarianContext';
import { EbookItem } from '../../types/librarian';
import { BookReaderModal } from './BookReaderModal';
import { downloadLibraryResourcePdf } from '../../utils/exportDocuments';
import {
  Search,
  Upload,
  Download,
  Eye,
  Trash2,
  FileText,
  CheckCircle2,
  X
} from 'lucide-react';

const INITIAL_FORM_DATA: Omit<EbookItem, 'id' | 'downloadCount'> = {
  title: '',
  author: '',
  format: 'PDF',
  level: 'Lycée',
  targetClass: 'Terminale SM',
  subject: 'Mathématiques',
  fileSize: '4.8 Mo',
  url: '#',
  description: '',
  thumbnailUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
  content: '',
  fileName: ''
};

function detectFormatFromFile(fileName: string): EbookItem['format'] {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.epub')) return 'EPUB';
  if (lower.endsWith('.docx') || lower.endsWith('.doc')) return 'DOCX';
  if (lower.endsWith('.pptx') || lower.endsWith('.ppt')) return 'PPTX';
  if (/\.(mp4|webm|mov|mkv)$/i.test(lower)) return 'Vidéo';
  if (/\.(mp3|wav|m4a|ogg)$/i.test(lower)) return 'Audio';
  return 'PDF';
}

export const EbooksDigitalView: React.FC = () => {
  const { ebooks, addEbook, deleteEbook, incrementEbookDownload, showToast, canManageLibrary } =
    useLibrarian();
  const [search, setSearch] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewEbook, setPreviewEbook] = useState<EbookItem | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dropzoneInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<EbookItem, 'id' | 'downloadCount'>>(INITIAL_FORM_DATA);

  const formats = ['all', 'PDF', 'EPUB', 'DOCX', 'PPTX', 'Vidéo', 'Audio'];
  const levels = ['all', 'Lycée', 'Collège', 'Tous niveaux'];

  const filteredEbooks = ebooks.filter(eb => {
    const matchesSearch = eb.title.toLowerCase().includes(search.toLowerCase()) ||
      eb.author.toLowerCase().includes(search.toLowerCase()) ||
      eb.subject.toLowerCase().includes(search.toLowerCase()) ||
      eb.targetClass.toLowerCase().includes(search.toLowerCase());
    const matchesFormat = selectedFormat === 'all' || eb.format === selectedFormat;
    const matchesLevel = selectedLevel === 'all' || eb.level === selectedLevel;
    return matchesSearch && matchesFormat && matchesLevel;
  });

  const handleFileSelected = (file: File) => {
    const sizeLabel = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} Mo`
      : `${Math.max(0.1, file.size / 1024).toFixed(1)} Ko`;
    const isTextFile = /\.(txt|md|csv)$/i.test(file.name);
    const detectedFormat = detectFormatFromFile(file.name);
    const baseTitle = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();

    setIsReadingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const resultStr = reader.result;
        setFormData(prev => ({
          ...prev,
          title: prev.title.trim() ? prev.title : baseTitle,
          format: isTextFile ? prev.format : detectedFormat,
          ...(isTextFile
            ? { content: resultStr }
            : { url: resultStr, fileData: undefined }),
          fileName: file.name,
          fileSize: sizeLabel,
          description: prev.description || `Document numérique importé : ${file.name}`
        }));
      }
      setIsReadingFile(false);
    };
    reader.onerror = () => {
      setIsReadingFile(false);
      showToast(`Impossible de lire le fichier « ${file.name} ».`);
    };
    if (isTextFile) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleOpenUploadModal = () => {
    setFormData(INITIAL_FORM_DATA);
    setIsReadingFile(false);
    setIsDragging(false);
    setUploadModalOpen(true);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageLibrary || isReadingFile) return;
    addEbook(formData);
    // Reset filters so the newly added book appears immediately at the top
    setSearch('');
    setSelectedFormat('all');
    setSelectedLevel('all');
    setFormData(INITIAL_FORM_DATA);
    setUploadModalOpen(false);
  };

  const getFormatBadge = (fmt: EbookItem['format']) => {
    switch (fmt) {
      case 'PDF':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">PDF</span>;
      case 'EPUB':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">EPUB</span>;
      case 'Vidéo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">VIDÉO</span>;
      case 'Audio':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">AUDIO</span>;
      case 'PPTX':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">PPTX</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">{fmt}</span>;
    }
  };

  const hasAttachedFile = Boolean((formData.url && formData.url !== '#') || formData.fileData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950">E-Books &amp; Bibliothèque Numérique</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {canManageLibrary
              ? 'Manuels dématérialisés MEPU-A, cours interactifs, capsules vidéo et supports audio téléchargeables.'
              : 'Consultation et téléchargement des supports numériques (publication réservée à l’Admin de la Bibliothèque).'}
          </p>
        </div>

        {canManageLibrary && (
          <button
            onClick={handleOpenUploadModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Téléverser une Ressource</span>
          </button>
        )}
      </div>

      {/* Filter and Format Selectors */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un manuel numérique, sujet d'examen ou capsule vidéo..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-blue-100 text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-blue-100 text-xs text-slate-700 focus:outline-hidden"
          >
            {formats.map(f => (
              <option key={f} value={f}>{f === 'all' ? 'Tous formats' : f}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-blue-100 text-xs text-slate-700 focus:outline-hidden"
          >
            {levels.map(l => (
              <option key={l} value={l}>{l === 'all' ? 'Tous niveaux' : l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEbooks.map(eb => {
          const hasRealFile = Boolean((eb.url && eb.url !== '#') || eb.fileData);
          return (
            <div key={eb.id} className="rounded-2xl bg-white border border-blue-100 p-5 flex flex-col justify-between hover:border-purple-200 transition-all group">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getFormatBadge(eb.format)}
                    <span className="text-[10px] text-slate-500 font-medium">{eb.fileSize}</span>
                    {hasRealFile && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                        <FileText className="w-2.5 h-2.5" />
                        <span>Fichier joint</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 px-2 py-0.5 rounded bg-slate-50 shrink-0">
                    {eb.targetClass}
                  </span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setPreviewEbook(eb)}
                    className="text-left font-bold text-sm text-blue-950 group-hover:text-purple-700 transition-colors line-clamp-2 cursor-pointer"
                  >
                    {eb.title}
                  </button>
                  <div className="text-xs text-slate-500 mt-1">
                    Par <span className="text-slate-700 font-medium">{eb.author}</span> · {eb.subject}
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {eb.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-blue-100 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-purple-600" />
                  <span>{eb.downloadCount} téléchargements</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewEbook(eb)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-100 text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-600" />
                    <span>{hasRealFile && eb.format === 'PDF' ? 'Lire le PDF' : 'Consulter'}</span>
                  </button>
                  <button
                    onClick={() => {
                      incrementEbookDownload(eb.id);
                      const file = downloadLibraryResourcePdf({
                        title: eb.title,
                        author: eb.author,
                        subject: eb.subject,
                        level: eb.level,
                        description: eb.description,
                        content: eb.content,
                        fileUrl: (eb.url && eb.url !== '#' ? eb.url : eb.fileData) || eb.url,
                        fileName: eb.fileName
                      });
                      showToast(`Téléchargement terminé : « ${file} »`);
                    }}
                    className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200 transition-colors cursor-pointer"
                    title="Télécharger le fichier"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {canManageLibrary && (
                    <button
                      onClick={() => deleteEbook(eb.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 transition-colors cursor-pointer"
                      title="Supprimer cette ressource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload E-book Modal (Librarian Admin only) */}
      {canManageLibrary && uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <h3 className="text-base font-bold text-blue-950">Téléverser une Ressource Numérique</h3>
            <p className="text-xs text-slate-500">
              Déposez un document PDF, EPUB, DOCX, PPTX ou un contenu multimédia pour les élèves et enseignants.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              {/* Interactive Dropzone */}
              <div
                onClick={() => dropzoneInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const droppedFile = e.dataTransfer.files?.[0];
                  if (droppedFile) {
                    handleFileSelected(droppedFile);
                  }
                }}
                className={`p-3.5 rounded-xl border-2 border-dashed text-center transition-colors cursor-pointer ${
                  isDragging
                    ? 'border-purple-600 bg-purple-100/70'
                    : hasAttachedFile
                    ? 'border-emerald-300 bg-emerald-50/70'
                    : 'border-purple-200 bg-purple-50 hover:border-purple-400 hover:bg-purple-100/50'
                }`}
              >
                <input
                  ref={dropzoneInputRef}
                  type="file"
                  accept=".pdf,.epub,.docx,.pptx,.txt,.md,.mp4,.mp3"
                  className="hidden"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) {
                      handleFileSelected(selected);
                    }
                    e.target.value = '';
                  }}
                />
                {isReadingFile ? (
                  <div className="text-xs font-semibold text-purple-800 py-1">
                    Chargement du fichier en cours...
                  </div>
                ) : hasAttachedFile ? (
                  <div className="flex items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-emerald-950 truncate">
                          {formData.fileName || 'Fichier prêt'}
                        </div>
                        <div className="text-[10px] text-emerald-700">
                          Format {formData.format} · {formData.fileSize} · Cliquez pour remplacer
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, url: '#', fileData: undefined, fileName: '' }));
                      }}
                      className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-200/70 cursor-pointer"
                      title="Retirer le fichier"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                    <div className="text-xs font-semibold text-slate-900">
                      Déposez votre livre PDF ici ou cliquez pour parcourir
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Formats acceptés : PDF, EPUB, DOCX, PPTX, TXT, MP4, MP3
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Titre de la ressource *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ex: Annales Bac Mathématiques SM 2026 Corrigées"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Auteur / Source *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="ex: MEPU-A / Inspection Générale"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Format</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value as EbookItem['format'] })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                  >
                    <option value="PDF">PDF</option>
                    <option value="EPUB">EPUB</option>
                    <option value="DOCX">DOCX</option>
                    <option value="PPTX">PPTX</option>
                    <option value="Vidéo">Vidéo (MP4)</option>
                    <option value="Audio">Audio (MP3)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Niveau</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as EbookItem['level'] })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                  >
                    <option value="Lycée">Lycée</option>
                    <option value="Collège">Collège</option>
                    <option value="Tous niveaux">Tous niveaux</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Classe cible</label>
                  <input
                    type="text"
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    placeholder="ex: Terminale SM"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Matière</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="ex: Mathématiques"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">
                  Ou lien URL gratuit du document (Google Drive, Archive.org, lien PDF direct)
                </label>
                <input
                  type="url"
                  value={
                    formData.url &&
                    formData.url !== '#' &&
                    !formData.url.startsWith('data:')
                      ? formData.url
                      : ''
                  }
                  onChange={(e) => {
                    const nextUrl = e.target.value.trim();
                    setFormData(prev => ({
                      ...prev,
                      url: nextUrl || '#',
                      fileData: undefined,
                      fileName: nextUrl
                        ? prev.fileName || nextUrl.split('/').pop()?.split('?')[0] || 'Lien externe'
                        : ''
                    }));
                  }}
                  placeholder="https://drive.google.com/file/d/... ou https://archive.org/..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Points clés ou chapitres abordés..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Contenu texte / Chapitres (Optionnel si un PDF est joint)
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Collez ici le cours ou les chapitres pour permettre la lecture texte..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 font-serif"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-500 hover:text-blue-950"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isReadingFile}
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {isReadingFile ? 'Lecture du fichier...' : 'Mettre en ligne'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real Interactive Book/Ebook Reader */}
      {previewEbook && (
        <BookReaderModal
          book={previewEbook}
          onClose={() => setPreviewEbook(null)}
        />
      )}
    </div>
  );
};
