import React from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { 
  Calendar, 
  Clock, 
  DoorOpen, 
  Printer, 
  BookOpen, 
  Building2,
  Sparkles
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const TeacherScheduleView: React.FC = () => {
  const { schedule, profile } = useTeacher();

  const days: ('Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi')[] = [
    'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-indigo-400" />
            <span>Emploi du Temps Hebdomadaire</span>
          </h1>
          <p className="text-xs text-slate-400">
            Planning officiel des cours · Volume horaire réglementaire : {profile.weeklyHours}h / semaine
          </p>
        </div>

        <button
          onClick={() => triggerPrint('teacher-schedule-printable-grid', `Emploi_du_Temps_${profile.firstName}_${profile.lastName}`)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Imprimer planning</span>
        </button>
      </div>

      {/* Week Grid */}
      <div id="teacher-schedule-printable-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map(day => {
          const slotsOfDay = schedule.filter(s => s.day === day);
          return (
            <div 
              key={day}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-sm text-white">{day}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {slotsOfDay.length} cours
                </span>
              </div>

              {slotsOfDay.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 italic">
                  Aucun cours ce jour-là (Repos pédagogique / Préparation)
                </div>
              ) : (
                <div className="space-y-3">
                  {slotsOfDay.map(slot => (
                    <div 
                      key={slot.id}
                      className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800/70 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{slot.className}</span>
                        <span className="text-[10px] font-mono text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 font-medium">
                        {slot.subject}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                        <DoorOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span>{slot.room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
