import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { StudentCourseResource } from '../../types/student';
import { BookReaderModal } from '../librarian/BookReaderModal';
import { 
  BookOpen, 
  Search, 
  Download, 
  Eye, 
  FileText, 
  Video, 
  Music, 
  Layers, 
  CheckCircle2,
  X
} from 'lucide-react';

export const StudentCoursesView: React.FC = () => {
  const { courses, showToast } = useStudent();
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [viewerModalCourse, setViewerModalCourse] = useState<StudentCourseResource | null>(null);

  const subjects = ['all', 'Mathématiques', 'Physique-Chimie', 'Philosophie', 'SVT', 'Français'];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || c.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getBadgeType = (type: StudentCourseResource['type']) => {
    switch (type) {
      case 'PDF':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">PDF</span>;
      case 'Vidéo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">VIDÉO</span>;
      case 'PowerPoint':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">PPTX</span>;
      case 'Audio':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">AUDIO</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">{type}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white">Supports de Cours & Ressources Pédagogiques</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Téléchargez les polycopiés, fiches de révision, exercices d'entraînement et capsules vidéo mis en ligne par vos enseignants.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par chapitre, notion ou nom du professeur..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubject === s 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {s === 'all' ? 'Toutes les matières' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Course Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map(course => (
          <div key={course.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-blue-500/40 transition-all group space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getBadgeType(course.type)}
                  <span className="text-[10px] text-slate-400 font-medium">{course.fileSize}</span>
                </div>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {course.subject}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <div className="text-xs text-slate-400 mt-1">
                  Déposé par <strong className="text-slate-200">{course.teacherName}</strong> · {course.date}
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">Format : {course.type}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewerModalCourse(course)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  <span>Aperçu</span>
                </button>
                <button
                  onClick={() => showToast(`Téléchargement lancé : « ${course.title} » (${course.fileSize})`)}
                  className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-colors cursor-pointer"
                  title="Télécharger sur mon appareil"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Reader for Students */}
      {viewerModalCourse && (
        <BookReaderModal
          book={{
            id: viewerModalCourse.id,
            title: viewerModalCourse.title,
            author: viewerModalCourse.teacherName,
            isbn: 'REF-MEPUA-2026',
            category: 'Manuel Scolaire',
            type: 'numerique',
            description: viewerModalCourse.description,
            totalQuantity: 1,
            availableQuantity: 1,
            shelfLocation: 'Médiathèque Numérique',
            state: 'Neuf',
            yearPublished: 2026,
            qrCodeId: `QR-MEPUA-${viewerModalCourse.id}`,
            content: `${viewerModalCourse.description}\n\nPROGRAMME ACADÉMIQUE OFFICIEL MEPU-A\nLycée d'Excellence de Conakry · Année 2026-2027\nMatière : ${viewerModalCourse.subject} · Titulaire : ${viewerModalCourse.teacherName}\n\nCe document officiel comprend le cours magistral complet, les théorèmes fondamentaux et les séries d'exercices à préparer pour le prochain TD sous la direction de l'enseignant titulaire.\n\nConsultez l'ensemble des modules pour votre niveau académique.`
          }}
          onClose={() => setViewerModalCourse(null)}
        />
      )}
    </div>
  );
};
