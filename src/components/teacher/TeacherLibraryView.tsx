import React, { useMemo, useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { useLibrarian } from '../../context/LibrarianContext';
import { BookReaderModal } from '../librarian/BookReaderModal';
import { BookItem, EbookItem } from '../../types/librarian';
import { downloadLibraryResourcePdf } from '../../utils/exportDocuments';
import {
  BookMarked,
  Search,
  Download,
  FileText,
  Video,
  Headphones,
  BookOpen,
  Lock,
  Eye
} from 'lucide-react';

export const TeacherLibraryView: React.FC = () => {
  const { libraryResources, incrementDownloadCount, triggerToast } = useTeacher();
  const { ebooks, incrementEbookDownload } = useLibrarian();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [previewBook, setPreviewBook] = useState<BookItem | EbookItem | null>(null);

  const combinedResources = useMemo(() => {
    const mappedEbooks = ebooks.map(eb => ({
      id: `lib-${eb.id}`,
      rawEbook: eb,
      title: eb.title,
      type:
        eb.format === 'Vidéo'
          ? 'video'
          : eb.format === 'Audio'
          ? 'audio'
          : eb.format === 'PDF'
          ? 'pdf'
          : 'ebook',
      subject: eb.subject,
      level: eb.level,
      className: eb.targetClass,
      size: eb.fileSize,
      description: eb.description,
      downloadCount: eb.downloadCount,
      fileUrl: (eb.url && eb.url !== '#' ? eb.url : eb.fileData) || eb.url,
      fileName: eb.fileName
    }));

    const existingTitles = new Set(mappedEbooks.map(m => m.title.toLowerCase()));
    const teacherItems = libraryResources
      .filter(r => !existingTitles.has(r.title.toLowerCase()))
      .map(r => ({
        ...r,
        rawEbook: null as EbookItem | null,
        fileName: undefined as string | undefined
      }));

    return [...mappedEbooks, ...teacherItems];
  }, [ebooks, libraryResources]);

  const filteredResources = combinedResources.filter(res => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || res.type === selectedType;
    const matchesSubject = selectedSubject === 'all' || res.subject === selectedSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const getTypeBadge = (resourceType: string) => {
    switch (resourceType) {
      case 'ebook':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Manuel / E-Book</span>;
      case 'video':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Vidéo de cours</span>;
      case 'audio':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Podcast Audio</span>;
      case 'tp':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">Travaux Pratiques</span>;
      case 'corrige':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Corrigé Type</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Document PDF</span>;
    }
  };

  const getTypeIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'ebook':
        return <BookOpen className="w-5 h-5 text-amber-700" />;
      case 'video':
        return <Video className="w-5 h-5 text-rose-600" />;
      case 'audio':
        return <Headphones className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <BookMarked className="w-6 h-6 text-amber-700" />
            <span>Bibliothèque Pédagogique &amp; E-Learning</span>
          </h1>
          <p className="text-xs text-slate-500">
            Consultation des manuels officiels CIAM, annales corrigées, PDFs déposés par la bibliothèque &amp; ressources multimédias.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Lecture seule · Gérée par l'Admin Bibliothèque</span>
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un manuel, corrigé..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-blue-950 focus:outline-none"
          >
            <option value="all">Tous les types de média</option>
            <option value="ebook">E-Books &amp; Manuels CIAM</option>
            <option value="pdf">Documents &amp; Annales PDF</option>
            <option value="tp">Travaux Pratiques (TP)</option>
            <option value="corrige">Corrigés Types</option>
            <option value="video">Vidéos de Cours</option>
            <option value="audio">Podcasts Audio</option>
          </select>

          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-blue-950 focus:outline-none"
          >
            <option value="all">Toutes les matières</option>
            <option value="Mathématiques">Mathématiques</option>
            <option value="Sciences Physiques">Sciences Physiques</option>
          </select>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <div
            key={resource.id}
            className="rounded-2xl bg-white border border-blue-100 p-5 flex flex-col justify-between hover:border-slate-200 transition-all shadow-xl space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {getTypeBadge(resource.type)}
                <span className="text-[10px] font-mono text-slate-500">
                  {resource.size}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
                  {getTypeIcon(resource.type)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-950 tracking-tight leading-snug">
                    {resource.title}
                  </h3>
                  <div className="text-[11px] text-amber-700 font-medium mt-1">
                    {resource.subject} · {resource.level}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                {resource.description}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Classe : {resource.className.split('(')[0]}</span>
                <span>Téléchargé {resource.downloadCount} fois</span>
              </div>
            </div>

            <div className="pt-3 border-t border-blue-100 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Lecture seule</span>
              </span>

              <div className="flex items-center gap-1.5">
                {resource.rawEbook && (
                  <button
                    onClick={() => setPreviewBook(resource.rawEbook)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-100 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Lire</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (resource.rawEbook) {
                      incrementEbookDownload(resource.rawEbook.id);
                    } else {
                      incrementDownloadCount(resource.id);
                    }
                    const file = downloadLibraryResourcePdf({
                      title: resource.title,
                      author: resource.rawEbook?.author,
                      subject: resource.subject,
                      level: resource.level,
                      description: resource.description,
                      content: resource.rawEbook?.content,
                      fileUrl: resource.fileUrl,
                      fileName: resource.fileName
                    });
                    triggerToast(`Document téléchargé : ${file}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewBook && (
        <BookReaderModal
          book={previewBook}
          onClose={() => setPreviewBook(null)}
        />
      )}
    </div>
  );
};
