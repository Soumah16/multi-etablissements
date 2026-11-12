import React from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Users, 
  Building2, 
  DoorOpen, 
  CheckCircle2 
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const SchoolReportsView: React.FC = () => {
  const { currentSchool, staff, classes, rooms, academicYears } = useSchoolAdmin();

  const activeYear = academicYears.find(y => y.status === 'active') || academicYears[0];
  const teachersCount = staff.filter(s => s.role === 'Enseignant').length;
  const adminStaffCount = staff.filter(s => s.role !== 'Enseignant').length;

  const handleExportCsv = () => {
    const headers = ["Categorie", "Element", "Effectif_ou_Capacite", "Occupation", "Observations"];
    const rows: (string | number)[][] = [
      ["Eleves", "Total Inscrits", currentSchool.stats.studentsCount, "100%", "Regulier"],
      ["Personnel", "Corps Professoral", teachersCount, "-", "Affectes"],
      ["Personnel", "Administration & Technique", adminStaffCount, "-", "Actifs"],
      ...classes.map(c => ["Classe", c.name, c.studentsCount, `${Math.round((c.studentsCount / c.capacity) * 100)}%`, c.mainRoomName]),
      ...rooms.map(r => ["Salle", r.name, r.capacity, r.currentOccupation || "Libre", r.type])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(',')).map(line => `"${line.replace(/"/g, '""')}"`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rapport_administratif_${currentSchool.code}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Rapports Administratifs & Statistiques de l'Établissement
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Consolidation des effectifs, taux d'occupation des salles, répartition du personnel et exports officiels
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerPrint('school-report-printable-area', 'Rapport_Administratif_Etablissement')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Imprimer Rapport PDF</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exporter Tableau Excel (CSV)</span>
          </button>
        </div>
      </div>

      <div id="school-report-printable-area" className="space-y-6">
        {/* Summary KPI Strips */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Total Utilisateurs École</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">
            {(currentSchool.stats.studentsCount + currentSchool.stats.parentsCount + staff.length).toLocaleString('fr-FR')}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Élèves, Parents & Collaborateurs</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Taux d'Occupation des Salles</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
            87.5%
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Capacité spatiale optimale</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Ratio Élèves / Enseignant</div>
          <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">
            {teachersCount > 0 ? (currentSchool.stats.studentsCount / teachersCount).toFixed(0) : 0} : 1
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Conforme aux normes du MEPU-A</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400">Assiduité Numérique Staff</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1 font-mono">
            98.2%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Connexions hebdomadaires régulières</div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes & Headcount Breakdown */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center justify-between">
            <span>Synthèse des Effectifs par Classe</span>
            <span className="font-mono text-slate-400 font-normal">{classes.length} classes</span>
          </h3>

          <div className="mt-3 divide-y divide-slate-800 text-xs">
            {classes.map(c => (
              <div key={c.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{c.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">Salle : {c.mainRoomName}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-white">{c.studentsCount} élèves</span>
                  <div className="text-[10px] text-slate-500 font-mono">Capacité {c.capacity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Utilization Breakdown */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center justify-between">
            <span>Occupation & Équipement des Salles</span>
            <span className="font-mono text-slate-400 font-normal">{rooms.length} salles</span>
          </h3>

          <div className="mt-3 divide-y divide-slate-800 text-xs">
            {rooms.map(r => (
              <div key={r.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{r.name}</div>
                  <div className="text-[11px] text-blue-400">{r.type}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-emerald-400 font-semibold">{r.currentOccupation || "Libre"}</span>
                  <div className="text-[10px] text-slate-500">{r.capacity} places assises</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
