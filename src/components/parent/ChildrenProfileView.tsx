import React from 'react';
import { useParent } from '../../context/ParentContext';
import { 
  User, 
  GraduationCap, 
  Heart, 
  Phone, 
  Calendar, 
  Award, 
  Clock, 
  FileCheck2,
  CheckCircle2,
  MapPin,
  QrCode
} from 'lucide-react';

export const ChildrenProfileView: React.FC = () => {
  const { selectedChild, childrenList, setSelectedChildId, formatGnf } = useParent();

  return (
    <div className="space-y-6">
      {/* Header and Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950">Dossier Scolaire & Identité de l'Élève</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Informations académiques, tuteur légal, suivi médical et emploi du temps de la classe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {childrenList.map(child => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                child.id === selectedChild.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-blue-50 text-slate-500 border border-blue-100'
              }`}
            >
              {child.firstName} ({child.className})
            </button>
          ))}
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Child Identity Card */}
        <div className="p-6 rounded-2xl bg-white border border-blue-100 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={selectedChild.photo}
              alt={selectedChild.firstName}
              className="w-28 h-32 rounded-2xl object-cover border-4 border-blue-200 shadow-xl bg-slate-50"
            />
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black text-blue-950">
              {selectedChild.firstName} {selectedChild.lastName}
            </h2>
            <div className="text-xs text-blue-600 font-bold mt-0.5">{selectedChild.className}</div>
            <div className="text-xs text-slate-500 font-mono mt-1">Matricule : {selectedChild.matricule}</div>
          </div>

          <div className="w-full pt-4 border-t border-blue-100 space-y-2 text-xs text-left">
            <div className="flex justify-between py-1 border-b border-blue-100">
              <span className="text-slate-500">Niveau d'études</span>
              <span className="font-semibold text-blue-950">{selectedChild.level}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-blue-100">
              <span className="text-slate-500">Groupe Sanguin</span>
              <span className="font-bold text-rose-600">{selectedChild.bloodGroup}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-blue-100">
              <span className="text-slate-500">Prof. Principal</span>
              <span className="font-medium text-slate-900">{selectedChild.mainTeacher}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Effectif de la classe</span>
              <span className="font-semibold text-blue-950">{selectedChild.totalStudents} élèves</span>
            </div>
          </div>
        </div>

        {/* Academic Performance & Timetable Snapshot (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white border border-blue-100 text-center">
              <div className="text-[11px] text-slate-500 font-semibold">Moyenne Trimestre 1</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">{selectedChild.generalAverage} / 20</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Rang : {selectedChild.classRank}ème de la classe</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-blue-100 text-center">
              <div className="text-[11px] text-slate-500 font-semibold">Total Retards / Absences</div>
              <div className="text-2xl font-black text-blue-950 mt-1">{selectedChild.absencesCount}h / {selectedChild.delaysCount}</div>
              <div className="text-[10px] text-emerald-600 mt-0.5">Assiduité exemplaire</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-blue-100 text-center">
              <div className="text-[11px] text-slate-500 font-semibold">Reste à Payer (GNF)</div>
              <div className="text-xl font-black text-rose-600 mt-1">{formatGnf(selectedChild.feesDueGnf)}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Date limite : 30 Nov 2026</div>
            </div>
          </div>

          {/* Timetable / Emploi du Temps Hebdomadaire (Aperçu) */}
          <div className="p-5 rounded-2xl bg-white border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-blue-950">Planning de Cours de la Semaine ({selectedChild.className})</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Lycée d'Excellence Conakry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-slate-200 space-y-1">
                <div className="font-bold text-blue-600 text-[11px]">LUNDI</div>
                <div className="text-[10px] text-blue-950 font-medium">08:00 - 10:00</div>
                <div className="text-slate-700 font-bold">Mathématiques</div>
                <div className="text-[10px] text-slate-500">Salle 12 · M. Diallo</div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-slate-200 space-y-1">
                <div className="font-bold text-blue-600 text-[11px]">MARDI</div>
                <div className="text-[10px] text-blue-950 font-medium">08:00 - 10:00</div>
                <div className="text-slate-700 font-bold">Physique-Chimie</div>
                <div className="text-[10px] text-slate-500">Labo 2 · M. Traoré</div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-slate-200 space-y-1">
                <div className="font-bold text-blue-600 text-[11px]">MERCREDI</div>
                <div className="text-[10px] text-blue-950 font-medium">10:00 - 12:00</div>
                <div className="text-slate-700 font-bold">Philosophie</div>
                <div className="text-[10px] text-slate-500">Salle 12 · Mme Camara</div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-slate-200 space-y-1">
                <div className="font-bold text-blue-600 text-[11px]">JEUDI</div>
                <div className="text-[10px] text-blue-950 font-medium">14:00 - 16:00</div>
                <div className="text-slate-700 font-bold">SVT / Biologie</div>
                <div className="text-[10px] text-slate-500">Salle 8 · M. Bah</div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-slate-200 space-y-1">
                <div className="font-bold text-blue-600 text-[11px]">VENDREDI</div>
                <div className="text-[10px] text-blue-950 font-medium">08:00 - 12:00</div>
                <div className="text-slate-700 font-bold">Devoir Surveillé</div>
                <div className="text-[10px] text-rose-600 font-bold">Évaluation TSM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
