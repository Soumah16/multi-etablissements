import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  DoorOpen, 
  FileText, 
  Check, 
  Sparkles,
  Search,
  Printer
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const TeacherLogbookView: React.FC = () => {
  const { 
    logbookEntries, 
    addLogbookEntry, 
    signLogbookEntry, 
    classes, 
    profile 
  } = useTeacher();

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [formClassId, setFormClassId] = useState('cls-tsm');
  const [formSubject, setFormSubject] = useState('Mathématiques');
  const [formDate, setFormDate] = useState(new Date().toISOString().substring(0, 10));
  const [formStart, setFormStart] = useState('08:00');
  const [formEnd, setFormEnd] = useState('10:00');
  const [formRoom, setFormRoom] = useState('Salle 102');
  const [formChapter, setFormChapter] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formObjectives, setFormObjectives] = useState('');
  const [formHomework, setFormHomework] = useState('');
  const [formDueDate, setFormDueDate] = useState('');

  const filteredEntries = logbookEntries.filter(e => 
    selectedClassFilter === 'all' ? true : e.classId === selectedClassFilter
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formChapter.trim() || !formContent.trim()) return;

    const targetClass = classes.find(c => c.id === formClassId);
    const objArray = formObjectives
      .split('\n')
      .map(o => o.trim())
      .filter(o => o.length > 0);

    addLogbookEntry({
      classId: formClassId,
      className: targetClass ? targetClass.name : 'Terminale SM',
      subject: formSubject,
      date: formDate,
      startTime: formStart,
      endTime: formEnd,
      room: formRoom,
      chapterTitle: formChapter,
      lessonContent: formContent,
      pedagogicalObjectives: objArray.length > 0 ? objArray : ['Acquérir les notions fondamentales du chapitre'],
      assignedHomework: formHomework.trim() || undefined,
      homeworkDueDate: formDueDate || undefined
    });

    setModalOpen(false);
    setFormChapter('');
    setFormContent('');
    setFormObjectives('');
    setFormHomework('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <span>Cahier de Textes Numérique & Émargement</span>
          </h1>
          <p className="text-xs text-slate-500">
            Journal de bord pédagogique conforme aux directives du MEPU-A
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Inscrire une séance</span>
          </button>
          <button
            onClick={() => triggerPrint('teacher-logbook-printable-list', 'Cahier_de_Textes')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-100 text-slate-900 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Class filter tabs */}
      <div className="flex items-center gap-2 pb-2 border-b border-blue-100 overflow-x-auto">
        <button
          onClick={() => setSelectedClassFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedClassFilter === 'all'
              ? 'bg-purple-600 text-white'
              : 'text-slate-500 hover:bg-blue-50 hover:text-blue-950'
          }`}
        >
          Toutes les classes
        </button>
        {classes.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedClassFilter(c.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedClassFilter === c.id
                ? 'bg-purple-600 text-white'
                : 'text-slate-500 hover:bg-blue-50 hover:text-blue-950'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Entries List */}
      <div id="teacher-logbook-printable-list" className="space-y-4">
        {filteredEntries.map(entry => (
          <div 
            key={entry.id}
            className="rounded-2xl bg-white border border-blue-100 p-5 md:p-6 shadow-md hover:border-slate-200 transition-all space-y-4"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
                  {entry.className}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium">
                  {entry.subject}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {entry.date}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {entry.startTime} - {entry.endTime}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <DoorOpen className="w-3.5 h-3.5 text-slate-500" />
                  {entry.room}
                </span>
              </div>

              {/* Signature badge */}
              <div>
                {entry.isSigned ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Émargement signé électroniquement</span>
                  </div>
                ) : (
                  <button
                    onClick={() => signLogbookEntry(entry.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold transition-colors"
                  >
                    <span>Viser & Émarger</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chapter title & Content */}
            <div className="space-y-2">
              <h2 className="text-base font-bold text-blue-950 tracking-tight">{entry.chapterTitle}</h2>
              <p className="text-xs text-slate-700 leading-relaxed bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                {entry.lessonContent}
              </p>
            </div>

            {/* Objectives */}
            {entry.pedagogicalObjectives && entry.pedagogicalObjectives.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] uppercase font-bold text-slate-500">Objectifs Pédagogiques :</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {entry.pedagogicalObjectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-blue-50/60 p-2 rounded-lg border border-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Homework assigned */}
            {entry.assignedHomework && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                <div className="font-bold text-amber-700 flex items-center justify-between">
                  <span>Devoir de maison assigné :</span>
                  {entry.homeworkDueDate && (
                    <span className="text-[10px] text-amber-700 font-mono">À rendre le : {entry.homeworkDueDate}</span>
                  )}
                </div>
                <p className="text-slate-700">{entry.assignedHomework}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: New Logbook Entry */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-blue-100 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-bold text-base text-blue-950">Inscrire une nouvelle séance de cours</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-blue-950">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Classe *</label>
                  <select 
                    value={formClassId}
                    onChange={e => setFormClassId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Matière *</label>
                  <input 
                    type="text" 
                    value={formSubject}
                    onChange={e => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date *</label>
                  <input 
                    type="date" 
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Début *</label>
                  <input 
                    type="time" 
                    value={formStart}
                    onChange={e => setFormStart(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fin *</label>
                  <input 
                    type="time" 
                    value={formEnd}
                    onChange={e => setFormEnd(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Salle *</label>
                  <input 
                    type="text" 
                    value={formRoom}
                    onChange={e => setFormRoom(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Titre du chapitre / Notion abordée *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Chapitre 4 : Calcul différentiel et limites"
                  value={formChapter}
                  onChange={e => setFormChapter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contenu détaillé & Déroulement de la séance *</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Résumez les théorèmes abordés, les démonstrations effectuées et les exercices traités en classe..."
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Objectifs Pédagogiques (1 par ligne)</label>
                <textarea 
                  rows={2}
                  placeholder="Ex: Déterminer la limite d'une fonction rationnelle en l'infini&#10;Appliquer la règle de l'Hospital"
                  value={formObjectives}
                  onChange={e => setFormObjectives(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Devoir de maison (Optionnel)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Exercices 18 et 19 page 92"
                    value={formHomework}
                    onChange={e => setFormHomework(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date limite de remise</label>
                  <input 
                    type="date" 
                    value={formDueDate}
                    onChange={e => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none"
                  />
                </div>
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
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Enregistrer & Émarger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
