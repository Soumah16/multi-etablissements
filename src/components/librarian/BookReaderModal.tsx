import React, { useState } from 'react';
import { BookItem, EbookItem, BookChapter } from '../../types/librarian';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Download, 
  Search, 
  Sun, 
  Moon, 
  Bookmark, 
  Maximize2, 
  Minimize2,
  Printer,
  List,
  Type
} from 'lucide-react';
import { triggerPrint, exportPrintableDocument } from '../../utils/printHelper';

interface BookReaderModalProps {
  book: BookItem | EbookItem;
  onClose: () => void;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({ book, onClose }) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('sepia');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Derive chapters or generate default chapter if only description/content exists
  const chapters: BookChapter[] = book.chapters && book.chapters.length > 0 
    ? book.chapters 
    : [
        {
          id: 'def-1',
          title: `Introduction & Texte Intégral : ${book.title}`,
          content: book.content || `${book.description}\n\nCet ouvrage officiel est référencé au sein de la Bibliothèque & Médiathèque Numérique de l'établissement sous la direction du Ministère de l'Enseignement Pré-Universitaire et de l'Alphabétisation (MEPU-A).\n\nConsultez l'ensemble des modules, travaux pratiques et séries d'exercices recommandés pour votre niveau académique.`
        }
      ];

  const currentChapter = chapters[selectedChapterIndex] || chapters[0];

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-amber-50/90 text-slate-900 border-amber-200';
      case 'sepia':
        return 'bg-[#fbf0d9] text-[#433422] border-[#e8d5b5]';
      case 'dark':
      default:
        return 'bg-slate-950 text-slate-200 border-slate-800';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-xs md:text-sm leading-relaxed';
      case 'lg': return 'text-base md:text-lg leading-loose';
      case 'xl': return 'text-lg md:text-xl leading-loose';
      case 'base':
      default: return 'text-sm md:text-base leading-relaxed';
    }
  };

  const handlePrintChapter = () => {
    const html = `
      <div style="font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="font-size: 24px; margin-bottom: 5px;">${book.title}</h1>
        <h3 style="font-size: 16px; color: #64748b; margin-top: 0;">Auteur : ${book.author}</h3>
        <hr style="border: 1px solid #cbd5e1; margin: 20px 0;" />
        <h2 style="font-size: 18px; color: #1e293b;">${currentChapter.title}</h2>
        <div style="font-size: 14px; line-height: 1.8; white-space: pre-line; margin-top: 15px;">
          ${currentChapter.content}
        </div>
      </div>
    `;
    exportPrintableDocument(`${book.title} - ${currentChapter.title}`, html);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
      <div className="w-full max-w-5xl h-[94vh] rounded-2xl bg-white border border-blue-100 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <header className="p-3 sm:p-3.5 border-b border-blue-100 bg-white flex items-center justify-between gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 transition-colors cursor-pointer shrink-0"
              title="Afficher la table des matières"
            >
              <List className="w-4 h-4" />
            </button>

            <div className="min-w-0">
              <h2 className="text-sm font-black text-blue-950 truncate max-w-[160px] sm:max-w-md">
                {book.title}
              </h2>
              <div className="text-[11px] text-slate-500 truncate">
                Par <strong className="text-slate-700">{book.author}</strong> · Chapitre {selectedChapterIndex + 1} / {chapters.length}
              </div>
            </div>
          </div>

          {/* Reader Preferences & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme selector */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={() => setTheme('light')}
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${theme === 'light' ? 'bg-amber-100 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-blue-950'}`}
                title="Thème Papier Blanc"
              >
                Clair
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${theme === 'sepia' ? 'bg-[#e8d5b5] text-[#433422] shadow-xs' : 'text-slate-600 hover:text-blue-950'}`}
                title="Thème Sépia (Confort de lecture)"
              >
                Sépia
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${theme === 'dark' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-blue-950'}`}
                title="Thème Nuit Sombre"
              >
                Nuit
              </button>
            </div>

            {/* Font size adjustments */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
              <button
                onClick={() => setFontSize(prev => prev === 'xl' ? 'lg' : prev === 'lg' ? 'base' : 'sm')}
                className="px-2 py-1 text-slate-700 hover:text-blue-950 font-bold"
                title="Réduire la police"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(prev => prev === 'sm' ? 'base' : prev === 'base' ? 'lg' : 'xl')}
                className="px-2 py-1 text-slate-700 hover:text-blue-950 font-bold"
                title="Agrandir la police"
              >
                A+
              </button>
            </div>

            {/* Print / Export Chapter */}
            <button
              onClick={handlePrintChapter}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
              title="Imprimer / Exporter ce chapitre"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-950 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Reader Core Body */}
        <div className="flex-1 flex min-h-0 relative">
          {/* Collapsible Chapters Sidebar */}
          {sidebarOpen && (
            <aside className="absolute md:static inset-y-0 left-0 w-72 max-w-[85vw] bg-white border-r border-blue-100 flex flex-col z-20 shrink-0 shadow-xl md:shadow-none animate-in slide-in-from-left duration-200">
              <div className="p-3 border-b border-blue-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Table des Matières
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {chapters.length} chapitres
                </span>
              </div>

              <div className="p-2 border-b border-blue-100">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Chercher un chapitre..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 text-xs text-slate-900 placeholder-slate-400 border border-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {chapters
                  .filter(ch => ch.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((ch, idx) => {
                    const isCurrent = idx === selectedChapterIndex;
                    return (
                      <button
                        key={ch.id || idx}
                        onClick={() => {
                          setSelectedChapterIndex(idx);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                          isCurrent 
                            ? 'bg-blue-600 text-white font-bold shadow-xs' 
                            : 'text-slate-700 hover:bg-blue-50 hover:text-blue-950'
                        }`}
                      >
                        <div className="text-[10px] opacity-75 mb-0.5">Chapitre {idx + 1}</div>
                        <div className="line-clamp-2">{ch.title}</div>
                      </button>
                    );
                  })}
              </div>
            </aside>
          )}

          {/* Reading Viewport */}
          <main className={`flex-1 overflow-y-auto p-4 sm:p-6 md:p-12 transition-colors ${getThemeClasses()} flex flex-col items-center`}>
            <article className={`max-w-2xl w-full mx-auto space-y-6 font-serif ${getFontSizeClass()}`}>
              {/* Chapter Header */}
              <header className="border-b pb-4 mb-6 border-current/20 text-center space-y-2">
                <div className="text-xs uppercase tracking-widest font-sans font-bold opacity-75">
                  {book.title} · {book.author}
                </div>
                <h1 className="text-xl md:text-2xl font-bold font-sans">
                  {currentChapter.title}
                </h1>
              </header>

              {/* Text content with preservation of paragraphs */}
              <div className="whitespace-pre-line leading-relaxed text-justify space-y-4">
                {currentChapter.content}
              </div>

              {/* Chapter Bottom Navigation */}
              <footer className="pt-8 border-t border-current/20 font-sans flex items-center justify-between text-xs not-italic">
                <button
                  disabled={selectedChapterIndex === 0}
                  onClick={() => setSelectedChapterIndex(prev => Math.max(0, prev - 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Chapitre précédent</span>
                </button>

                <span className="font-bold font-mono">
                  {selectedChapterIndex + 1} / {chapters.length}
                </span>

                <button
                  disabled={selectedChapterIndex >= chapters.length - 1}
                  onClick={() => setSelectedChapterIndex(prev => Math.min(chapters.length - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-all cursor-pointer"
                >
                  <span>Chapitre suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </footer>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
};
