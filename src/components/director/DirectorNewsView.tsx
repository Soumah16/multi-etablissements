import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { DirectorNewsItem } from '../../types/director';
import { ImageUploadField } from '../common/ImageUploadField';
import { 
  Newspaper, 
  Plus, 
  FileText, 
  Eye, 
  Download, 
  Trash2, 
  Calendar, 
  User, 
  X, 
  Check, 
  Paperclip,
  Share2
} from 'lucide-react';

export const DirectorNewsView: React.FC = () => {
  const { newsItems, createNews, deleteNews, profile } = useDirector();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DirectorNewsItem['category']>('Pedagogique');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80');
  const [pdfFilename, setPdfFilename] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) return;

    createNews({
      title,
      category,
      date: new Date().toISOString().split('T')[0],
      summary,
      content,
      imageUrl,
      pdfFilename: pdfFilename.trim() || undefined,
      pdfUrl: pdfUrl.trim() || undefined,
      author: profile.name,
      published: true
    });

    setTitle('');
    setSummary('');
    setContent('');
    setPdfFilename('');
    setPdfUrl('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-blue-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Espace Info & Publications Pédagogiques
            </span>
            <span className="text-xs text-slate-500">Diffusion Interne aux Familles & Élèves</span>
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-purple-600" />
            <span>Actualités & Publications Scolaires</span>
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Publication d'articles, guides pédagogiques téléchargeables en PDF et reportages d'événements.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publier une Actualité</span>
        </button>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map(item => (
          <div 
            key={item.id}
            className="rounded-2xl bg-white border border-blue-100 overflow-hidden flex flex-col justify-between hover:border-slate-200 transition-all group"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-50">
                <img 
                  src={item.imageUrl} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50/70 backdrop-blur-xs text-purple-700 border border-purple-200">
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50/70 text-[10px] font-mono text-slate-700">
                  <Eye className="w-3 h-3 text-slate-500" />
                  <span>{item.viewsCount} vues</span>
                </div>
              </div>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                  <span>{item.author}</span>
                </div>

                <h3 className="text-base font-bold text-blue-950 leading-snug group-hover:text-purple-700 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>

                {item.pdfFilename && (
                  <div className="p-2 rounded-lg bg-blue-50/60 border border-slate-200 flex items-center justify-between text-xs mt-3">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="font-medium text-slate-900 truncate">{item.pdfFilename}</span>
                    </div>
                    <a
                      href={item.pdfUrl || '#'}
                      download={item.pdfFilename}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-500 hover:text-blue-950 shrink-0"
                      title="Télécharger la pièce jointe PDF"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50/70 border-t border-blue-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-emerald-600 font-medium">Visible sur les portails parents & élèves</span>
              <button
                onClick={() => deleteNews(item.id)}
                className="text-slate-500 hover:text-rose-600 p-1"
                title="Supprimer l'actualité"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-blue-950">Nouvelle Publication de l'Établissement</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-blue-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Titre de l'Article
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Concours National de Physique : Nos élèves distingués"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  >
                    <option value="Pedagogique">Pédagogique</option>
                    <option value="Evenement">Événement</option>
                    <option value="Vie scolaire">Vie Scolaire</option>
                    <option value="Orientation">Orientation & Post-Bac</option>
                    <option value="Succès">Succès & Distinction</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Auteur
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    disabled
                    className="w-full px-3 py-2 rounded-lg bg-blue-50/60 border border-slate-200 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Dual image upload with PC file or URL support */}
              <ImageUploadField
                label="Photo d'illustration de l'article"
                value={imageUrl}
                onChange={setImageUrl}
                helperText="Importez une photo depuis votre PC ou collez une URL web."
              />

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Résumé introductif (chapeau)
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Bref résumé accrocheur affiché sur les cartes..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Contenu détaillé de la publication
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Rédigez l'article complet..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-purple-500"
                  required
                />
              </div>

              {/* PDF Attachment Fields */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-slate-200 space-y-3">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-purple-600" />
                  Pièce Jointe PDF (Optionnelle)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Nom du fichier PDF affiché</label>
                    <input
                      type="text"
                      value={pdfFilename}
                      onChange={(e) => setPdfFilename(e.target.value)}
                      placeholder="Ex: Reglement_Interieur_2027.pdf"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Lien / URL du document PDF</label>
                    <input
                      type="text"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      placeholder="https://.../document.pdf"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-500 hover:text-blue-950"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30"
                >
                  <Check className="w-4 h-4" />
                  <span>Publier l'Actualité</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
