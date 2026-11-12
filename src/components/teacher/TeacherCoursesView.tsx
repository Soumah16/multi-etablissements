import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { CourseModuleItem, CourseResource } from '../../types/teacher';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  FileText, 
  Video, 
  Headphones, 
  FileSpreadsheet, 
  FileArchive, 
  Image, 
  Download, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Search,
  UploadCloud
} from 'lucide-react';

export const TeacherCoursesView: React.FC = () => {
  const { courses, addCourse, deleteCourse, classes, subjects, triggerToast } = useTeacher();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseModuleItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [classId, setClassId] = useState('cls-tsm');
  const [subject, setSubject] = useState('Mathématiques');
  const [description, setDescription] = useState('');
  const [objectiveInput, setObjectiveInput] = useState('');
  const [objectives, setObjectives] = useState<string[]>([]);
  
  // Resource inputs
  const [resourceName, setResourceName] = useState('');
  const [resourceType, setResourceType] = useState<'pdf' | 'docx' | 'pptx' | 'xlsx' | 'zip' | 'jpg' | 'png' | 'video' | 'audio'>('pdf');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceSize, setResourceSize] = useState('2.5 MB');
  const [resources, setResources] = useState<CourseResource[]>([]);

  const handleAddObjective = () => {
    if (objectiveInput.trim()) {
      setObjectives([...objectives, objectiveInput.trim()]);
      setObjectiveInput('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleAddResource = () => {
    if (resourceName.trim()) {
      setResources([...resources, {
        name: resourceName.trim(),
        type: resourceType,
        url: resourceUrl.trim() || 'https://smartschool.gn/docs/ressource-cours.pdf',
        size: resourceSize || '1.8 MB'
      }]);
      setResourceName('');
      setResourceUrl('');
    }
  };

  const handleRemoveResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chapterTitle.trim()) return;

    const targetClass = classes.find(c => c.id === classId);

    addCourse({
      title,
      chapterTitle,
      moduleName: moduleName || 'Module Pédagogique Standard',
      classId,
      className: targetClass ? targetClass.name : 'Terminale SM',
      subject,
      description,
      objectives: objectives.length > 0 ? objectives : ['Acquérir les concepts fondamentaux du chapitre.'],
      resources,
      isPublished: true
    });

    setModalOpen(false);
    // Reset form
    setTitle('');
    setChapterTitle('');
    setModuleName('');
    setDescription('');
    setObjectives([]);
    setResources([]);
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-rose-400" />;
      case 'audio': return <Headphones className="w-4 h-4 text-purple-400" />;
      case 'xlsx': return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'zip': return <FileArchive className="w-4 h-4 text-amber-400" />;
      case 'jpg':
      case 'png': return <Image className="w-4 h-4 text-cyan-400" />;
      default: return <FileText className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <span>Gestion des Cours, Chapitres & Unités Pédagogiques</span>
          </h1>
          <p className="text-xs text-slate-400">
            Conception et publication de cours interactifs avec pièces jointes multimédias
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Filtrer les cours..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un Cours</span>
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div 
            key={course.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {course.className}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {course.publishedDate}
                </span>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                  {course.moduleName}
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                  {course.title}
                </h3>
                <div className="text-xs text-slate-300 font-medium mt-1">
                  {course.chapterTitle}
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                {course.description}
              </p>

              {/* Objectives */}
              {course.objectives && course.objectives.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Objectifs pédagogiques :
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {course.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Multimedia Attachments */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Supports & Fichiers ({course.resources.length}) :</span>
                </div>
                <div className="space-y-1.5">
                  {course.resources.map((res, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {getResourceIcon(res.type)}
                        <span className="truncate font-medium">{res.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono">{res.size}</span>
                        <button 
                          onClick={() => triggerToast(`Téléchargement de ${res.name}...`)}
                          className="p-1 hover:text-white text-slate-400"
                          title="Télécharger"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                En ligne pour les élèves
              </span>
              <button
                onClick={() => deleteCourse(course.id)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Course Creation */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Créer un Nouveau Cours</h3>
                  <p className="text-xs text-slate-400">Renseignez le contenu, les objectifs et les supports multimédias</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Classe ciblée *</label>
                  <select 
                    value={classId}
                    onChange={e => setClassId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Matière *</label>
                  <select 
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Sciences Physiques">Sciences Physiques</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Module / Unité Pédagogique *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Module 1 : Analyse Fonctionnelle & Suites"
                  value={moduleName}
                  onChange={e => setModuleName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Titre de la leçon / cours *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Étude des Suites Récurrentes et Limites"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Chapitre officiel *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Chapitre 3 : Suites & Convergence Monotone"
                  value={chapterTitle}
                  onChange={e => setChapterTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description & Résumé de la leçon *</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Synthèse du cours, notions abordées, théorèmes clés..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Objectives Builder */}
              <div className="space-y-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <label className="block text-slate-300 font-semibold">Compétences visées & Objectifs pédagogiques</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Ajouter un objectif pédagogique..."
                    value={objectiveInput}
                    onChange={e => setObjectiveInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Ajouter
                  </button>
                </div>
                {objectives.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {objectives.map((obj, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-slate-200 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                        <span>• {obj}</span>
                        <button type="button" onClick={() => handleRemoveObjective(i)} className="text-rose-400 hover:text-white">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Attachments Builder (Multi-format) */}
              <div className="space-y-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <label className="block text-slate-300 font-semibold">
                  Supports Multimédias (PDF, Word, Excel, PowerPoint, ZIP, Image, Vidéo, Audio)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input 
                    type="text"
                    placeholder="Nom du fichier (ex: Polycopié_Cours.pdf)"
                    value={resourceName}
                    onChange={e => setResourceName(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                  <select
                    value={resourceType}
                    onChange={e => setResourceType(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="pdf">Document PDF</option>
                    <option value="docx">Fichier Word (.docx)</option>
                    <option value="pptx">Présentation (.pptx)</option>
                    <option value="xlsx">Tableur Excel (.xlsx)</option>
                    <option value="zip">Archive ZIP (.zip)</option>
                    <option value="jpg">Image JPG/PNG</option>
                    <option value="video">Vidéo de cours (.mp4)</option>
                    <option value="audio">Podcast audio (.mp3)</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="URL directe du document ou laisser vide pour fichier simulé"
                    value={resourceUrl}
                    onChange={e => setResourceUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                  <input 
                    type="text"
                    placeholder="Taille (ex: 3.5 MB)"
                    value={resourceSize}
                    onChange={e => setResourceSize(e.target.value)}
                    className="w-28 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddResource}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Joindre
                  </button>
                </div>

                {resources.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {resources.map((res, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-slate-200 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                        <span className="truncate">📎 {res.name} ({res.type.toUpperCase()} · {res.size})</span>
                        <button type="button" onClick={() => handleRemoveResource(i)} className="text-rose-400 hover:text-white">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Publier le Cours Immédiatement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
