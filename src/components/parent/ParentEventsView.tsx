import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Award, 
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export const ParentEventsView: React.FC = () => {
  const events = [
    {
      id: 'ev-1',
      title: 'Rencontre Parents - Professeurs Trimestre 1',
      date: 'Samedi 21 Novembre 2026',
      time: '09:00 - 14:00',
      location: 'Grand Amphithéâtre & Salles de classe',
      type: 'Pédagogique',
      description: 'Remise en main propre des bulletins du premier trimestre et entretiens individuels avec les professeurs de Terminale et Collège.'
    },
    {
      id: 'ev-2',
      title: 'Session Baccalauréat Blanc N°1 (Terminales)',
      date: 'Du 07 au 11 Décembre 2026',
      time: '08:00 - 17:00',
      location: 'Salles d’examen MEPU-A',
      type: 'Examen',
      description: 'Mise en condition réelle pour le Bac Unique : Mathématiques, Physique, Chimie, Philosophie et Français.'
    },
    {
      id: 'ev-3',
      title: 'Conseils de Classe Mi-Trimestre',
      date: '15 - 18 Novembre 2026',
      time: '16:00 - 18:30',
      location: 'Salle des Professeurs',
      type: 'Conseil',
      description: 'Examen du comportement, de l’assiduité et des performances de chaque élève avec les délégués parents.'
    },
    {
      id: 'ev-4',
      title: 'Congés Scolaires de Fin d’Année (Noël / Nouvel An)',
      date: 'Du 23 Décembre 2026 au 04 Janvier 2027',
      time: 'Toute la journée',
      location: 'Établissement fermé',
      type: 'Vacances',
      description: 'Reprise des cours pour toutes les classes le Lundi 05 Janvier 2027 à 08h précises.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white">Agenda & Événements de l'Établissement</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Calendrier des rencontres pédagogiques, sessions d'examens blancs, congés et activités périscolaires.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map(ev => (
          <div key={ev.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  ev.type === 'Examen' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  ev.type === 'Pédagogique' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  ev.type === 'Vacances' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-purple-500/20 text-purple-300'
                }`}>
                  {ev.type}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  {ev.date}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white">{ev.title}</h3>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{ev.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{ev.location}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {ev.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
