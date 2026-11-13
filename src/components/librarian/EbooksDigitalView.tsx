import React, { useState } from 'react';
import { useLibrarian } from '../../context/LibrarianContext';
import { EbookItem } from '../../types/librarian';
import { BookReaderModal } from './BookReaderModal';
import { 
  FileText, 
  Search, 
  Upload, 
  Download, 
  Eye, 
  Video, 
  Music, 
  FileCheck, 
  Layers, 
  BookMarked,
  X,
  Play,
  BookOpen
} from 'lucide-react';

export const EbooksDigitalView: React.FC = () => {
  const { ebooks, addEbook, showToast } = useLibrarian();
  const [search, setSearch] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewEbook, setPreviewEbook] = useState<EbookItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<EbookItem, 'id' | 'downloadCount'>>({
    title: '',
    author: '',
    format: 'PDF',
    level: 'Lycée',
    targetClass: 'Terminale SM',
    subject: 'Mathématiques',
    fileSize: '4.8 Mo',
    url: '#',
    description: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80'
  });

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

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEbook(formData);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950">E-Books & Bibliothèque Numérique</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manuels dématérialisés MEPU-A, cours interactifs, capsules vidéo et supports audio téléchargeables.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Téléverser une Ressource</span>
        </button>
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
        {filteredEbooks.map(eb => (
          <div key={eb.id} className="rounded-2xl bg-white border border-blue-100 p-5 flex flex-col justify-between hover:border-purple-200 transition-all group">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {getFormatBadge(eb.format)}
                  <span className="text-[10px] text-slate-500 font-medium">{eb.fileSize}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 px-2 py-0.5 rounded bg-slate-50">
                  {eb.targetClass}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-blue-950 group-hover:text-purple-700 transition-colors line-clamp-2">
                  {eb.title}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  Par <span className="text-slate-700 font-medium">{eb.author}</span> · {eb.subject}
                </div>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {eb.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-blue-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-purple-600" />
                <span>{eb.downloadCount} téléchargements</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewEbook(eb)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-100 text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-600" />
                  <span>Consulter</span>
                </button>
                <button
                  onClick={() => showToast(`Téléchargement lancé : « ${eb.title} »`)}
                  className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200 transition-colors cursor-pointer"
                  title="Télécharger le fichier"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload E-book Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <h3 className="text-base font-bold text-blue-950">Téléverser une Ressource Numérique</h3>
            <p className="text-xs text-slate-500">
              Ajoutez un document PDF, EPUB, DOCX, PPTX ou un contenu multimédia au portail élève & enseignant.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
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
                    onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
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
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
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
                    Contenu texte / Chapitres complets (Pour lecture directe)
                  </label>
                  <label className="text-[10px] text-purple-600 hover:text-purple-700 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Charger un fichier (.txt, .md, .pdf)</span>
                    <input
                      type="file"
                      accept=".txt,.md,.pdf,.epub"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setFormData(prev => ({
                                ...prev,
                                content: reader.result as string,
                                fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} Mo`,
                                description: prev.description || `Document numérique importé : ${file.name}`
                              }));
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Collez ici le cours ou les chapitres pour permettre la lecture interactive..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 font-serif"
                />
              </div>

              <div className="p-3 rounded-lg border-2 border-dashed border-purple-200 bg-purple-50 text-center">
                <Upload className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                <div className="text-xs font-semibold text-slate-900">Ressource prête à l'intégration</div>
                <div className="text-[10px] text-slate-500">Prêt pour streaming & consultation hors-ligne sur les tablettes élèves</div>
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
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
                >
                  Mettre en ligne
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
