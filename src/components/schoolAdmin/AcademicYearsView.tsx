import React, { useState } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { AcademicYear } from '../../types';
import { Calendar, Plus, CheckCircle2, Lock, Clock, AlertTriangle, X } from 'lucide-react';

export const AcademicYearsView: React.FC = () => {
  const { academicYears, openNewAcademicYear, closeAcademicYear } = useSchoolAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [yearLabel, setYearLabel] = useState('2027-2028');
  const [startDate, setStartDate] = useState('2027-09-15');
  const [endDate, setEndDate] = useState('2028-06-30');

  const handleOpenYearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openNewAcademicYear(yearLabel, startDate, endDate);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Gestion des Années Scolaires & Périodes ({academicYears.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ouverture, clôture et archivage des années académiques, trimestres et sessions d'examens
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ouvrir une Nouvelle Année</span>
        </button>
      </div>

      {/* Years list */}
      <div className="space-y-4">
        {academicYears.map((ay) => {
          const isActive = ay.status === 'active';
          return (
            <div 
              key={ay.id} 
              className={`p-6 rounded-2xl border transition-all ${
                isActive 
                  ? 'bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/5' 
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${
                    isActive ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-extrabold text-white font-mono">
                        Année Scolaire {ay.yearLabel}
                      </h2>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                        isActive 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {isActive ? 'Actuellement Ouverte' : 'Clôturée & Archivée'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 font-mono">
                      Période officielle : {ay.startDate} au {ay.endDate}
                    </div>
                  </div>
                </div>

                {isActive && (
                  <button
                    onClick={() => closeAcademicYear(ay.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-colors whitespace-nowrap self-start sm:self-auto"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Clôturer cette Année</span>
                  </button>
                )}
              </div>

              {/* Trimestres / Semestres */}
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Découpage en Périodes Pédagogiques
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ay.terms.map((term, idx) => (
                    <div 
                      key={term.id}
                      className={`p-3.5 rounded-xl border text-xs ${
                        term.isCurrent 
                          ? 'bg-blue-950/40 border-blue-500/40 text-blue-200' 
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{term.name}</span>
                        {term.isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500 text-white font-semibold">
                            En cours
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-2">
                        Du {term.startDate} au {term.endDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Open Year */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">
                Ouvrir une Nouvelle Année Scolaire
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOpenYearSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Libellé de l'année (Format: YYYY-YYYY) *</label>
                <input
                  type="text"
                  required
                  placeholder="2027-2028"
                  value={yearLabel}
                  onChange={e => setYearLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Date de début des cours *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Date de clôture annuelle *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-slate-300 text-[11px]">
                <strong className="text-amber-400">Attention (Sécurité) :</strong>
                <p className="mt-0.5">
                  L'ouverture d'une nouvelle année passera l'année actuelle en statut clôturé. Un code PIN à 6 chiffres vous sera demandé.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
                >
                  Confirmer avec Code PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
