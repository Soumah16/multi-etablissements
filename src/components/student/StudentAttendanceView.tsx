import React from 'react';
import { useStudent } from '../../context/StudentContext';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

export const StudentAttendanceView: React.FC = () => {
  const { attendances, profile } = useStudent();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white">Mon Assiduité & Registre de Présence</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Suivi des pointages d'entrée, justificatifs d'absence validés par la Vie Scolaire et taux de ponctualité.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 font-semibold">Taux de Présence</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">98.5%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sur 240 heures de cours dispensées</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 font-semibold">Absences Enregistrées</div>
          <div className="text-2xl font-black text-white mt-1">1 absence (2h)</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Totalement justifiée par certificat médical</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 font-semibold">Retards Tolérés</div>
          <div className="text-2xl font-black text-amber-400 mt-1">1 retard</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Moins de 15 minutes</div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase font-semibold bg-slate-800/40">
                <th className="py-3 px-4">Date & Créneau</th>
                <th className="py-3 px-4">Matière</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Justification</th>
                <th className="py-3 px-4">Commentaire Vie Scolaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {attendances.map(att => (
                <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white text-xs">{att.date}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{att.period}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200">{att.subject}</td>
                  <td className="py-3 px-4">
                    {att.status === 'present' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Présent
                      </span>
                    )}
                    {att.status === 'absent' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Absente
                      </span>
                    )}
                    {att.status === 'retard' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Retard
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {att.justified ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Justifiée</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Non justifiée
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400 italic text-[11px]">
                    {att.reason || 'Pointage normal par badge QR Code'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
