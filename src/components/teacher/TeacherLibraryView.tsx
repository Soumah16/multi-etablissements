import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { PedagogicalResource } from '../../types/teacher';
import { 
  BookMarked, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  FileText, 
  Video, 
  Headphones, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  Trash2,
  Eye,
  BookOpen
} from 'lucide-react';

export const TeacherLibraryView: React.FC = () => {
  const { libraryResources, addLibraryResource, deleteLibraryResource, incrementDownloadCount, triggerToast, classes } = useTeacher();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PedagogicalResource['type']>('pdf');
  const [subject, setSubject] = useState('Mathématiques');
  const [level, setLevel] = useState('Terminale');
  const [className, setClassName] = useState('Terminale Sciences Mathématiques (TSM)');
  const [fileUrl, setFileUrl] = useState('');
  const [size, setSize] = useState('4.5 MB');
  const [description, setDescription] = useState('');

  const filteredResources = libraryResources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || res.type === selectedType;
    const matchesSubject = selectedSubject === 'all' || res.subject === selectedSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addLibraryResource({
      title,
      type,
      subject,
      level,
      className,
      fileUrl: fileUrl || 'https://smartschool.gn/biblio/document-ressource.pdf',
      size: size || '3.2 MB',
      description
    });

    setModalOpen(false);
    setTitle('');
    setDescription('');
    setFileUrl('');
  };

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
      case 'ebook': return <BookOpen className="w-5 h-5 text-amber-700" />;
      case 'video': return <Video className="w-5 h-5 text-rose-600" />;
      case 'audio': return <Headphones className="w-5 h-5 text-purple-600" />;
      default: return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <BookMarked className="w-6 h-6 text-amber-700" />
            <span>Bibliothèque Pédagogique & E-Learning</span>
          </h1>
          <p className="text-xs text-slate-500">
            Fonds documentaire numérique : manuels officiels CIAM, annales corrigées, fiches TP, podcasts & capsules vidéo
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Ressource</span>
        </button>
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
            <option value="ebook">E-Books & Manuels CIAM</option>
            <option value="pdf">Documents & Annales PDF</option>
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

            <div className="pt-3 border-t border-blue-100 flex items-center justify-between">
              <button
                onClick={() => deleteLibraryResource(resource.id)}
                className="text-xs text-slate-500 hover:text-rose-600 transition-colors p-1"
                title="Supprimer la ressource"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    incrementDownloadCount(resource.id);
                    triggerToast(`Ouverture de la ressource "${resource.title}"...`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Consulter / Télécharger</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Resource */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-blue-100 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-bold text-base text-blue-950">Ajouter une Ressource Pédagogique</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-blue-950">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Titre de la ressource *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Fascicule d'exercices d'Arithmétique CIAM"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Type de document *</label>
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  >
                    <option value="pdf">Document / Annales PDF</option>
                    <option value="ebook">E-Book / Manuel scolaire</option>
                    <option value="tp">Fiche de Travaux Pratiques</option>
                    <option value="corrige">Corrigé d'Examen</option>
                    <option value="video">Vidéo explicative</option>
                    <option value="audio">Podcast audio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Matière *</label>
                  <select 
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  >
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Sciences Physiques">Sciences Physiques</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Niveau *</label>
                  <select 
                    value={level}
                    onChange={e => setLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  >
                    <option value="Terminale">Terminale</option>
                    <option value="1ère">1ère</option>
                    <option value="10ème Année">10ème Année</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Taille estimée *</label>
                  <input 
                    type="text" 
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Classe ciblée *</label>
                <select 
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description / Contexte d'utilisation *</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Expliquez aux élèves à quel moment réviser cette ressource..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-blue-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-blue-950 bg-slate-50 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Ajouter au Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
