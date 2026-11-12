import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Printer 
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const StudentScheduleView: React.FC = () => {
  const { profile } = useStudent();
  const [selectedDay, setSelectedDay] = useState<string>('all');

  const days = [
    { key: 'all', label: 'Toute la semaine' },
    { key: 'Lundi', label: 'Lundi' },
    { key: 'Mardi', label: 'Mardi' },
    { key: 'Mercredi', label: 'Mercredi' },
    { key: 'Jeudi', label: 'Jeudi' },
    { key: 'Vendredi', label: 'Vendredi' },
    { key: 'Samedi', label: 'Samedi' }
  ];

  const scheduleData = [
    // Lundi
    { day: 'Lundi', time: '08:00 - 10:00', subject: 'Mathématiques (Algèbre)', room: 'Salle 12', teacher: 'M. Mamadou Lamarana Diallo', color: 'border-blue-500/40 bg-blue-500/5' },
    { day: 'Lundi', time: '10:15 - 12:15', subject: 'Physique (Mécanique)', room: 'Salle 12', teacher: 'M. Ousmane Traoré', color: 'border-amber-500/40 bg-amber-500/5' },
    { day: 'Lundi', time: '14:00 - 16:00', subject: 'Français & Littérature', room: 'Salle 12', teacher: 'Mme Fatoumata Sylla', color: 'border-purple-500/40 bg-purple-500/5' },
    // Mardi
    { day: 'Mardi', time: '08:00 - 10:00', subject: 'Chimie Organique', room: 'Laboratoire 2', teacher: 'M. Ousmane Traoré', color: 'border-amber-500/40 bg-amber-500/5' },
    { day: 'Mardi', time: '10:15 - 12:15', subject: 'Mathématiques (Géométrie)', room: 'Salle 12', teacher: 'M. Mamadou Lamarana Diallo', color: 'border-blue-500/40 bg-blue-500/5' },
    { day: 'Mardi', time: '14:00 - 16:00', subject: 'Anglais Scientifique', room: 'Salle 12', teacher: 'M. Aboubacar Soumah', color: 'border-cyan-500/40 bg-cyan-500/5' },
    // Mercredi
    { day: 'Mercredi', time: '08:00 - 10:00', subject: 'Philosophie', room: 'Salle 12', teacher: 'Mme Aminata Camara', color: 'border-emerald-500/40 bg-emerald-500/5' },
    { day: 'Mercredi', time: '10:15 - 12:15', subject: 'SVT (Génétique)', room: 'Salle 8', teacher: 'M. Thierno Bah', color: 'border-teal-500/40 bg-teal-500/5' },
    // Jeudi
    { day: 'Jeudi', time: '08:00 - 10:00', subject: 'Mathématiques (Analyse)', room: 'Salle 12', teacher: 'M. Mamadou Lamarana Diallo', color: 'border-blue-500/40 bg-blue-500/5' },
    { day: 'Jeudi', time: '10:15 - 12:15', subject: 'Histoire-Géographie', room: 'Salle 12', teacher: 'M. Sekou Condé', color: 'border-orange-500/40 bg-orange-500/5' },
    { day: 'Jeudi', time: '14:00 - 16:00', subject: 'Éducation Civique & Morale', room: 'Salle 12', teacher: 'M. Ibrahima Keïta', color: 'border-indigo-500/40 bg-indigo-500/5' },
    // Vendredi
    { day: 'Vendredi', time: '08:00 - 12:00', subject: 'Devoir Surveillé / Évaluation Bac', room: 'Amphithéâtre A', teacher: 'Supervision Collégiale', color: 'border-rose-500/40 bg-rose-500/5' },
    // Samedi
    { day: 'Samedi', time: '08:00 - 10:00', subject: 'Éducation Physique (EPS)', room: 'Terrain de Sport', teacher: 'M. Ibrahima Bangoura', color: 'border-emerald-500/40 bg-emerald-500/5' },
    { day: 'Samedi', time: '10:15 - 12:15', subject: 'Travaux Dirigés & Soutien Bac', room: 'Salle 12', teacher: 'M. Diallo & M. Traoré', color: 'border-blue-500/40 bg-blue-500/5' }
  ];

  const filteredSchedule = selectedDay === 'all' 
    ? scheduleData 
    : scheduleData.filter(s => s.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Emploi du Temps Hebdomadaire</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Planning officiel des cours de la <strong className="text-white">{profile.className}</strong> (Année Scolaire 2026-2027).
          </p>
        </div>

        <button
          onClick={() => triggerPrint('student-schedule-printable-grid', `Emploi_du_Temps_${profile.className}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer le Planning</span>
        </button>
      </div>

      {/* Day Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {days.map(d => (
          <button
            key={d.key}
            onClick={() => setSelectedDay(d.key)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDay === d.key 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Schedule Grid */}
      <div id="student-schedule-printable-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchedule.map((slot, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border ${slot.color} space-y-3 flex flex-col justify-between`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-white">
                  {slot.day}
                </span>
                <span className="font-mono text-xs font-bold text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {slot.time}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white pt-1">{slot.subject}</h3>

              <div className="space-y-1 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{slot.room}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{slot.teacher}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
