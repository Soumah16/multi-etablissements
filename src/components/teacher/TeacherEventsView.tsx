import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { SchoolCalendarEvent } from '../../types/teacher';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileCheck2, 
  Plus, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Users, 
  FileText,
  Download
} from 'lucide-react';

export const TeacherEventsView: React.FC = () => {
  const { calendarEvents, addCalendarEvent, classes, triggerToast } = useTeacher();
  const [modalOpen, setModalOpen] = useState(false);
  const [examModalOpen, setExamModalOpen] = useState(false);

  // New Event form
  const [title, setTitle] = useState('');
  const [type, setType] = useState<SchoolCalendarEvent['type']>('reunion');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('Salle des Professeurs');
  const [description, setDescription] = useState('');
  const [teacherRole, setTeacherRole] = useState('Participant');

  // Exam Subject submission form
  const [examTitle, setExamTitle] = useState('');
  const [examClass, setExamClass] = useState('Terminale Sciences Mathématiques (TSM)');
  const [examSubject, setExamSubject] = useState('Mathématiques');
  const [examDuration, setExamDuration] = useState('4 heures');
  const [examFileUrl, setExamFileUrl] = useState('');

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    addCalendarEvent({
      title,
      type,
      date,
      time: time || '14:00 - 16:00',
      location,
      description,
      teacherRole
    });

    setModalOpen(false);
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
  };

  const handleDepositExamSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) return;

    triggerToast(`Sujet d'épreuve "${examTitle}" scellé et transmis à la Direction des Études.`);
    setExamModalOpen(false);
    setExamTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-purple-400" />
            <span>Événements, Réunions & Dépôt des Sujets d'Examens</span>
          </h1>
          <p className="text-xs text-slate-400">
            Calendrier académique, conseils de classe, réunions de département et protocole d'examen
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setExamModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Déposer un Sujet d'Examen</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Date</span>
          </button>
        </div>
      </div>

      {/* Strict Role Guard Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Règle de Gouvernance Pédagogique MEPU-A :</strong> L'enseignant conçoit les épreuves, rédige les barèmes détaillés et soumet les corrigés types. Seul le <strong>Directeur des Études</strong> dispose de l'autorité pour valider, sceller et autoriser l'impression officielle des épreuves d'examen.
        </div>
      </div>

      {/* Events Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calendarEvents.map(evt => {
          const isExamen = evt.type === 'examen';
          const isReunion = evt.type === 'reunion';
          return (
            <div 
              key={evt.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all shadow-xl space-y-4 ${
                isExamen 
                  ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border-purple-500/40' 
                  : isReunion 
                    ? 'bg-slate-900 border-blue-500/30' 
                    : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isExamen ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {evt.type.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.date}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{evt.title}</h3>

                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Horaire : <strong className="text-slate-200">{evt.time}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Lieu : <strong className="text-slate-200">{evt.location}</strong></span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                  {evt.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Rôle assigné à l'enseignant :</div>
                  <div className="font-bold text-slate-200 mt-0.5">{evt.teacherRole}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Conforme calendrier scolaire</span>
                </span>
                <button
                  onClick={() => triggerToast(`Synchronisation de l'événement "${evt.title}" avec votre agenda...`)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  Ajouter à l'agenda →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Deposit Exam Subject */}
      {examModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Dépôt Sécurisé d'un Sujet d'Examen</h3>
                  <p className="text-xs text-slate-400">Transmission sous pli scellé numérique au Directeur des Études</p>
                </div>
              </div>
              <button onClick={() => setExamModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleDepositExamSubject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Intitulé de l'épreuve *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Épreuve de Mathématiques - Baccalauréat Blanc Session 1"
                  value={examTitle}
                  onChange={e => setExamTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Classe ciblée *</label>
                  <select 
                    value={examClass}
                    onChange={e => setExamClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Durée de l'épreuve *</label>
                  <input 
                    type="text" 
                    value={examDuration}
                    onChange={e => setExamDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document de l'épreuve (Sujet + Barème + Corrigé type) *</label>
                <input 
                  type="text" 
                  required
                  placeholder="URL du document chiffré ou lien PDF du dossier d'examen"
                  value={examFileUrl}
                  onChange={e => setExamFileUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-[11px] text-slate-300">
                🔒 Le sujet sera scellé numériquement et horodaté. Le Directeur des Études recevra une notification immédiate pour examen et validation.
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setExamModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Sceller et Déposer l'Épreuve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Event */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Ajouter un Événement Pédagogique</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Titre de l'événement *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Réunion de concertation sur les devoirs communs"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Type *</label>
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="reunion">Réunion / Concertation</option>
                    <option value="examen">Examen / Épreuve blanche</option>
                    <option value="calendrier">Échéance administrative</option>
                    <option value="activite">Activité parascolaire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date *</label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Horaires</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 14:00 - 16:30"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lieu</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Votre rôle</label>
                <input 
                  type="text" 
                  value={teacherRole}
                  onChange={e => setTeacherRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
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
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
