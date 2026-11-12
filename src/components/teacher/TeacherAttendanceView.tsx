import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  Send, 
  Printer, 
  DoorOpen, 
  Users, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const TeacherAttendanceView: React.FC = () => {
  const { 
    attendanceSession, 
    updateAttendanceStatus, 
    completeAttendanceSession 
  } = useTeacher();

  const [filter, setFilter] = useState<'all' | 'present' | 'absent' | 'retard'>('all');

  const records = attendanceSession.records;
  const presentsCount = records.filter(r => r.status === 'present').length;
  const absentsCount = records.filter(r => r.status === 'absent').length;
  const retardsCount = records.filter(r => r.status === 'retard').length;
  const justifieCount = records.filter(r => r.status === 'justifie').length;
  const total = records.length;
  const presenceRate = total > 0 ? Math.round(((presentsCount + retardsCount) / total) * 100) : 0;

  const filteredRecords = records.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ClipboardCheck className="w-6 h-6 text-emerald-400" />
            <span>Feuille d'Appel & Présences Numériques</span>
          </h1>
          <p className="text-xs text-slate-400">
            Émargement en direct des élèves et signalement instantané des absences
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => triggerPrint('teacher-attendance-printable-list', `Feuille_Presence_${attendanceSession.className}`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer feuille d'appel</span>
          </button>
          {!attendanceSession.isCompleted ? (
            <button
              onClick={completeAttendanceSession}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Clôturer & Transmettre</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Appel transmis à la Vie Scolaire</span>
            </div>
          )}
        </div>
      </div>

      {/* Session Information Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-white text-sm">{attendanceSession.className}</span>
            <span className="text-slate-600">·</span>
            <span className="text-blue-400 font-mono">{attendanceSession.subject}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {attendanceSession.date}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {attendanceSession.startTime} - {attendanceSession.endTime}
            </span>
            <span className="flex items-center gap-1">
              <DoorOpen className="w-3.5 h-3.5 text-slate-500" />
              {attendanceSession.room}
            </span>
          </div>
        </div>

        {/* Counter badges */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="text-[10px] text-slate-400">Présents</div>
            <div className="text-base font-bold text-emerald-400">{presentsCount}</div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="text-[10px] text-slate-400">Retards</div>
            <div className="text-base font-bold text-amber-400">{retardsCount}</div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <div className="text-[10px] text-slate-400">Absents</div>
            <div className="text-base font-bold text-rose-400">{absentsCount}</div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
            <div className="text-[10px] text-slate-400">Assiduité</div>
            <div className="text-base font-bold text-blue-400">{presenceRate}%</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
            filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Tous les élèves ({total})
        </button>
        <button
          onClick={() => setFilter('present')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
            filter === 'present' ? 'bg-emerald-600/30 text-emerald-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          Présents ({presentsCount})
        </button>
        <button
          onClick={() => setFilter('retard')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
            filter === 'retard' ? 'bg-amber-600/30 text-amber-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          Retards ({retardsCount})
        </button>
        <button
          onClick={() => setFilter('absent')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
            filter === 'absent' ? 'bg-rose-600/30 text-rose-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          Absents ({absentsCount})
        </button>
      </div>

      {/* Roll Call Student Cards */}
      <div id="teacher-attendance-printable-list" className="space-y-3">
        {filteredRecords.map(student => (
          <div 
            key={student.studentId}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            {/* Student info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                {student.fullName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-sm text-white">{student.fullName}</div>
                <div className="text-xs text-slate-500 font-mono">{student.matricule}</div>
              </div>
            </div>

            {/* Attendance Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => updateAttendanceStatus(student.studentId, 'present')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  student.status === 'present'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Présent</span>
              </button>

              <button
                onClick={() => updateAttendanceStatus(student.studentId, 'retard', 10, 'Arrivée tardive')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  student.status === 'retard'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-amber-500/10 hover:text-amber-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Retard</span>
              </button>

              <button
                onClick={() => updateAttendanceStatus(student.studentId, 'absent', undefined, 'Non justifié')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  student.status === 'absent'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Absent</span>
              </button>

              <button
                onClick={() => updateAttendanceStatus(student.studentId, 'justifie', undefined, 'Absence justifiée')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  student.status === 'justifie'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>Justifié</span>
              </button>
            </div>

            {/* Note / Motif details if absent or late */}
            {(student.status === 'retard' || student.status === 'absent') && (
              <div className="w-full md:w-56 text-xs">
                <input 
                  type="text" 
                  value={student.motif || ''}
                  placeholder="Motif (ex: Embouteillage, Maladie)..."
                  onChange={e => updateAttendanceStatus(
                    student.studentId, 
                    student.status as any, 
                    student.minutesLate, 
                    e.target.value
                  )}
                  className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
