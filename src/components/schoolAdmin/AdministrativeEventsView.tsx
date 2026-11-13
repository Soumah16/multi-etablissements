import React, { useState } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { AdministrativeEvent } from '../../types';
import { Calendar, Plus, Megaphone, Trash2, Clock, MapPin, Users, X, Send } from 'lucide-react';

export const AdministrativeEventsView: React.FC = () => {
  const { events, createEvent, deleteEvent, currentSchool } = useSchoolAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<AdministrativeEvent['type']>('Reunion');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 - 12:00');
  const [location, setLocation] = useState('Salle de Réunion Bâtiment A');
  const [targetAudience, setTargetAudience] = useState('Tout le personnel');
  const [content, setContent] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createEvent({
      schoolId: currentSchool.id,
      title,
      type,
      date,
      time,
      location,
      targetAudience,
      content,
      published: true
    });

    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950">
            Événements Administratifs & Notes de Service ({events.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publication des convocations officielles, réunions pédagogiques et notes internes de l'école
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publier un Événement / Note</span>
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => (
          <div key={ev.id} className="p-5 rounded-xl bg-white border border-blue-100 flex flex-col justify-between hover:border-slate-200 transition-colors">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                  ev.type === 'Note de service' 
                    ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                    : ev.type === 'Convocation' 
                      ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                }`}>
                  {ev.type}
                </span>

                <button
                  onClick={() => deleteEvent(ev.id)}
                  className="p-1 text-slate-500 hover:text-rose-600 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="font-bold text-blue-950 text-sm mt-2 leading-snug">
                {ev.title}
              </h3>

              <p className="text-slate-700 text-xs mt-2 leading-relaxed">
                {ev.content}
              </p>

              <div className="mt-4 pt-3 border-t border-blue-100 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{ev.date} · {ev.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{ev.location}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Public : {ev.targetAudience}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-blue-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="text-emerald-600 font-mono">✓ Diffusé sur les portails</span>
              <span>SmartSchool Notif</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-bold text-blue-950 text-sm">
                Publier un Événement ou Note de Service
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-blue-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Titre de l'événement / Note de service *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Réunion du personnel enseignant sur les examens blancs"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Catégorie *</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Reunion">Réunion administrative</option>
                    <option value="Convocation">Convocation individuelle/groupe</option>
                    <option value="Formation">Formation interne</option>
                    <option value="Note de service">Note de service officielle</option>
                    <option value="Communique">Communiqué général</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Public cible *</label>
                  <select
                    value={targetAudience}
                    onChange={e => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Tout le personnel">Tout le personnel de l'école</option>
                    <option value="Enseignants uniquement">Corps professoral uniquement</option>
                    <option value="Personnel administratif">Administration & Secrétariat</option>
                    <option value="Surveillants">Surveillants généraux</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Horaire</label>
                  <input
                    type="text"
                    placeholder="10:00 - 12:00"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Lieu de déroulement</label>
                <input
                  type="text"
                  placeholder="Ex: Salle de Conférence, Bibliothèque..."
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Contenu / Ordre du jour *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Détaillez les points à l'ordre du jour ou le texte de la note..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-blue-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-blue-950 rounded-lg bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
                >
                  Publier Maintenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
