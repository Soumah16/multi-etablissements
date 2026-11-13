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
        <h1 className="text-xl md:text-2xl font-black text-blue-950">Mon Assiduité & Registre de Présence</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Suivi des pointages d'entrée, justificatifs d'absence validés par la Vie Scolaire et taux de ponctualité.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-blue-100 text-center">
          <div className="text-[11px] text-slate-500 font-semibold">Taux de Présence</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">98.5%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Sur 240 heures de cours dispensées</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 text-center">
          <div className="text-[11px] text-slate-500 font-semibold">Absences Enregistrées</div>
          <div className="text-2xl font-black text-blue-950 mt-1">1 absence (2h)</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Totalement justifiée par certificat médical</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 text-center">
          <div className="text-[11px] text-slate-500 font-semibold">Retards Tolérés</div>
          <div className="text-2xl font-black text-amber-700 mt-1">1 retard</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Moins de 15 minutes</div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-blue-100 text-[11px] text-slate-500 uppercase font-semibold bg-blue-50/60">
                <th className="py-3 px-4">Date & Créneau</th>
                <th className="py-3 px-4">Matière</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Justification</th>
                <th className="py-3 px-4">Commentaire Vie Scolaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {attendances.map(att => (
                <tr key={att.id} className="hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-blue-950 text-xs">{att.date}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{att.period}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">{att.subject}</td>
                  <td className="py-3 px-4">
                    {att.status === 'present' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Présent
                      </span>
                    )}
                    {att.status === 'absent' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Absente
                      </span>
                    )}
                    {att.status === 'retard' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Retard
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {att.justified ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Justifiée</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Non justifiée
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 italic text-[11px]">
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
