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
    { day: 'Lundi', time: '08:00 - 10:00', subject: 'Mathématiques (Algèbre)', room: 'Salle 12', teacher: 'M. Mamadou Lamarana Diallo', color: 'border-blue-200 bg-blue-50' },
    { day: 'Lundi', time: '10:15 - 12:15', subject: 'Physique (Mécanique)', room: 'Salle 12', teacher: 'M. Ousmane Traoré', color: 'border-amber-200 bg-amber-50' },
    { day: 'Lundi', time: '14:00 - 16:00', subject: 'Français & Littérature', room: 'Salle 12', teacher: 'Mme Fatoumata Sylla', color: 'border-purple-200 bg-purple-50' },
    // Mardi
    { day: 'Mardi', time: '08:00 - 10:00', subject: 'Chimie Organique', room: 'Laboratoire 2', teacher: 'M. Ousmane Traoré', color: 'border-amber-200 bg-amber-50' },
    { day: 'Mardi', time: '10:15 - 12:15', subject: 'Mathématiques (Géométrie)', room: 'Salle 12', teacher: 'M. Mamadou Lamarana Diallo', color: 'border-blue-200 bg-blue-50' },
    { day: 'Mardi', time: '14:00 - 16:00', subject: 'Anglais Scientifique', room: 'Salle 12', teacher: 'M. Aboubacar Soumah', color: 'border-cyan-200 bg-cyan-50' },
    // Mercredi
    { day: 'Mercredi', time: '08:00 - 10:00', subject: 'Philosophie', room: 'Salle 12', teacher: 'Mme Aminata Camara', color: 'border-emerald-200 bg-emerald-50' },
    { day: 'Mercredi', time: '10:15 - 12:15', subject: 'SVT (Génétique)', room: 'Salle 8', teacher: 'M. Thierno Bah', color: 'border-teal-200 bg-teal-50' },
    // Jeudi
    { day: 'Jeudi', time: '08:00 - 10:00', subject: 'Mathématiques (Analyse)', room: 'Salle 12', teacher: 'M. Mamadou Lamarana Diallo', color: 'border-blue-200 bg-blue-50' },
    { day: 'Jeudi', time: '10:15 - 12:15', subject: 'Histoire-Géographie', room: 'Salle 12', teacher: 'M. Sekou Condé', color: 'border-orange-200 bg-orange-50' },
    { day: 'Jeudi', time: '14:00 - 16:00', subject: 'Éducation Civique & Morale', room: 'Salle 12', teacher: 'M. Ibrahima Keïta', color: 'border-indigo-200 bg-indigo-50' },
    // Vendredi
    { day: 'Vendredi', time: '08:00 - 12:00', subject: 'Devoir Surveillé / Évaluation Bac', room: 'Amphithéâtre A', teacher: 'Supervision Collégiale', color: 'border-rose-200 bg-rose-50' },
    // Samedi
    { day: 'Samedi', time: '08:00 - 10:00', subject: 'Éducation Physique (EPS)', room: 'Terrain de Sport', teacher: 'M. Ibrahima Bangoura', color: 'border-emerald-200 bg-emerald-50' },
    { day: 'Samedi', time: '10:15 - 12:15', subject: 'Travaux Dirigés & Soutien Bac', room: 'Salle 12', teacher: 'M. Diallo & M. Traoré', color: 'border-blue-200 bg-blue-50' }
  ];

  const filteredSchedule = selectedDay === 'all' 
    ? scheduleData 
    : scheduleData.filter(s => s.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950">Emploi du Temps Hebdomadaire</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Planning officiel des cours de la <strong className="text-blue-950">{profile.className}</strong> (Année Scolaire 2026-2027).
          </p>
        </div>

        <button
          onClick={() => triggerPrint('student-schedule-printable-grid', `Emploi_du_Temps_${profile.className}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-blue-100 text-slate-900 border border-slate-200 text-xs font-semibold cursor-pointer self-start sm:self-auto"
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
                : 'bg-white hover:bg-blue-50 text-slate-500 border border-blue-100'
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
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-50 text-blue-950">
                  {slot.day}
                </span>
                <span className="font-mono text-xs font-bold text-blue-950 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  {slot.time}
                </span>
              </div>

              <h3 className="font-bold text-sm text-blue-950 pt-1">{slot.subject}</h3>

              <div className="space-y-1 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>{slot.room}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
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
