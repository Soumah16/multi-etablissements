import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { DirectorCalendarEvent } from '../../types/director';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Check, 
  CalendarDays,
  FileText
} from 'lucide-react';

type CalendarViewMode = 'day' | 'week' | 'month' | 'year';

export const DirectorCalendarView: React.FC = () => {
  const { calendarEvents, createCalendarEvent } = useDirector();
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [currentDate] = useState(new Date('2026-11-01'));
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [type, setType] = useState<DirectorCalendarEvent['type']>('Reunion Parents');
  const [startDate, setStartDate] = useState('2026-11-12');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [location, setLocation] = useState('Salle Polyvalente');
  const [targetAudience, setTargetAudience] = useState('Parents des élèves de Terminale');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createCalendarEvent({
      title,
      type,
      startDate,
      startTime,
      endTime,
      location,
      targetAudience,
      description,
      organizer: 'Direction des Études'
    });

    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  const getEventBadgeColor = (type: DirectorCalendarEvent['type']) => {
    switch (type) {
      case 'Examen Blanc': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Reunion Parents': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Conseil de Classe': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Formation Pedagogique': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Journee Culturelle': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'Vacances & Conges': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Rythmes Scolaires & Échéances
            </span>
            <span className="text-xs text-slate-400">Année Académique 2026-2027</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-purple-400" />
            <span>Calendrier & Événements Pédagogiques</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Planification des conseils de classe, examens blancs, journées pédagogiques et rencontres parents-professeurs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* 4 Views Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700">
            {(['day', 'week', 'month', 'year'] as CalendarViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  viewMode === mode 
                    ? 'bg-purple-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'day' ? 'Jour' : mode === 'week' ? 'Semaine' : mode === 'month' ? 'Mois' : 'Année'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Planifier un Événement</span>
          </button>
        </div>
      </div>

      {/* Month View (Default & Most used) */}
      {viewMode === 'month' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-purple-400" />
              <span>Novembre 2026</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{calendarEvents.length} événements programmés ce mois</span>
            </div>
          </div>

          {/* Month Grid Simulation */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400 font-semibold mb-2">
            <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div><div>Dim</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, index) => {
              const dayNum = index + 1;
              const dateStr = `2026-11-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const dayEvents = calendarEvents.filter(e => e.startDate === dateStr);

              return (
                <div 
                  key={dayNum} 
                  className={`min-h-[90px] p-2 rounded-xl border text-left transition-colors flex flex-col justify-between ${
                    dayEvents.length > 0 
                      ? 'bg-purple-950/20 border-purple-500/40' 
                      : 'bg-slate-800/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <span className={`text-xs font-bold ${
                    dayNum === 2 ? 'text-purple-400 font-black' : 'text-slate-300'
                  }`}>
                    {dayNum} {dayNum === 2 && '• Aujourd\'hui'}
                  </span>

                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.map(ev => (
                      <div 
                        key={ev.id}
                        className={`p-1 rounded text-[10px] font-semibold border truncate ${getEventBadgeColor(ev.type)}`}
                        title={`${ev.title} (${ev.startTime} - ${ev.endTime})`}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">Semaine du 02 au 08 Novembre 2026</h2>
            <span className="text-xs text-slate-400">Trimestre 1 · Semaine 6</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {['Lundi 02', 'Mardi 03', 'Mercredi 04', 'Jeudi 05', 'Vendredi 06', 'Samedi 07', 'Dimanche 08'].map((day, i) => {
              const dateStr = `2026-11-0${i + 2}`;
              const dayEvents = calendarEvents.filter(e => e.startDate === dateStr);

              return (
                <div key={day} className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-300 pb-1 border-b border-slate-700">
                    {day}
                  </div>
                  {dayEvents.length === 0 ? (
                    <div className="text-[10px] text-slate-500 italic py-2">Aucun événement</div>
                  ) : (
                    dayEvents.map(ev => (
                      <div key={ev.id} className={`p-2 rounded-lg text-xs border ${getEventBadgeColor(ev.type)}`}>
                        <div className="font-bold text-white">{ev.title}</div>
                        <div className="text-[10px] text-slate-300 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{ev.startTime} - {ev.endTime}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{ev.location}</div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">Programme de la Journée : Jeudi 05 Novembre 2026</h2>
            <span className="text-xs text-purple-400 font-mono">1 Conseil Pédagogique au planning</span>
          </div>

          <div className="space-y-3">
            {[
              { time: '08h00 - 12h00', title: 'Cours réguliers de la matinée (Lycée & Collège)', loc: 'Toutes les salles', type: 'Cours' },
              { time: '14h00 - 16h00', title: 'Permanence du Directeur des Études & Réception des Délégués', loc: 'Bureau du Directeur', type: 'Permanence' },
              { time: '16h00 - 18h30', title: 'Conseil Pédagogique de Mi-Trimestre (Harmonisation des barèmes)', loc: 'Salle Polyvalente A', type: 'Formation Pedagogique' }
            ].map((slot, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-4">
                <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-xs font-mono font-bold text-purple-400 border border-slate-700 shrink-0">
                  {slot.time}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{slot.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{slot.loc}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Year View */}
      {viewMode === 'year' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">Grand Calendrier Annuel · 2026-2027</h2>
            <span className="text-xs text-slate-400">Ministère de l'Éducation Nationale</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Septembre 2026', desc: 'Rentrée des classes & Inscriptions' },
              { name: 'Octobre 2026', desc: 'Évaluations diagnostiques d\'automne' },
              { name: 'Novembre 2026', desc: 'Examen Blanc 1 & Conseils mi-trimestre' },
              { name: 'Décembre 2026', desc: 'Compositions T1 & Congés de fin d\'année' },
              { name: 'Janvier 2027', desc: 'Reprise T2 & Délibérations T1' },
              { name: 'Février 2027', desc: 'Olympiades régionales de sciences' },
              { name: 'Mars 2027', desc: 'Examen Blanc 2 & Compositions T2' },
              { name: 'Avril 2027', desc: 'Congés de Pâques & Conseils de classe' },
              { name: 'Mai 2027', desc: 'Révisions intensives Bac & Brevet' },
              { name: 'Juin 2027', desc: 'Examens Nationaux Officiels' },
              { name: 'Juillet 2027', desc: 'Proclamation des résultats & Cérémonie' },
              { name: 'Août 2027', desc: 'Vacances d\'été & Travaux d\'infrastructure' }
            ].map(m => (
              <div key={m.name} className="p-4 rounded-xl bg-slate-800/60 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white">{m.name}</div>
                <div className="text-[11px] text-slate-400">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Planifier un Événement Académique</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre de l'événement</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Réunion d'orientation des élèves de 10ème Année"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Type d'événement</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="Reunion Parents">Réunion Parents</option>
                    <option value="Conseil de Classe">Conseil de Classe</option>
                    <option value="Examen Blanc">Examen Blanc</option>
                    <option value="Formation Pedagogique">Formation Pédagogique</option>
                    <option value="Journee Culturelle">Journée Culturelle</option>
                    <option value="Ceremonie de Remise">Cérémonie de Remise</option>
                    <option value="Vacances & Conges">Vacances & Congés</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Heure Début</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Heure Fin</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Lieu</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Amphithéâtre Principal"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Public Cible</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Ex: Parents d'élèves de Terminale"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Ordre du jour / Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détails du programme..."
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer l'Événement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
