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
  const totalCapacity = classes.reduce((acc, c) => acc + c.capacity, 0);
  const totalEnrolledInClasses = classes.reduce((acc, c) => acc + c.studentsCount, 0);
  const avgOccupation = totalCapacity > 0 ? Math.round((totalEnrolledInClasses / totalCapacity) * 100) : 0;

  const handleExportCsv = () => {
    const headers = ['Categorie', 'Element', 'Effectif_ou_Capacite', 'Occupation', 'Observations'];
    const rows: (string | number)[][] = [
      ['Eleves', 'Total Inscrits', currentSchool.stats.studentsCount, '100%', 'Regulier'],
      ['Personnel', 'Corps Professoral', teachersCount, '-', 'Affectes'],
      ['Personnel', 'Administration & Technique', adminStaffCount, '-', 'Actifs'],
      ...classes.map(c => [
        'Classe',
        c.name,
        `${c.studentsCount}/${c.capacity}`,
        `${Math.round((c.studentsCount / (c.capacity || 1)) * 100)}%`,
        c.mainRoomName
      ]),
      ...rooms.map(r => [
        'Salle',
        r.name,
        r.capacity,
        r.currentOccupation || 'Libre',
        r.type
      ])
    ];

    const escapeCsv = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;
    const csvLines = [headers.map(escapeCsv).join(','), ...rows.map(row => row.map(escapeCsv).join(','))];
    const blob = new Blob(['\uFEFF' + csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport_administratif_${currentSchool.code}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-blue-100 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Rapports Administratifs & Capacités
            </span>
            <span className="text-xs text-slate-500 font-mono">{activeYear?.yearLabel || '2026-2027'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600 shrink-0" />
            <span>Rapports & Statistiques de l'Établissement</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Synthèse administrative des effectifs, du taux d'occupation des classes, des salles et du personnel de {currentSchool.name}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exporter CSV</span>
          </button>
          <button
            onClick={() => triggerPrint('school-reports-printable-area', `Rapport_Administratif_${currentSchool.code}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le Rapport</span>
          </button>
        </div>
      </div>

      {/* Printable Report Content */}
      <div id="school-reports-printable-area" className="space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Élèves Inscrits</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-950 font-mono mt-1.5">
              {currentSchool.stats.studentsCount.toLocaleString('fr-FR')}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Effectif consolidé</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Corps Enseignant</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-blue-950 font-mono mt-1.5">{teachersCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{adminStaffCount} personnels admin/appui</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Classes Ouvertes</span>
              <Building2 className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-2xl font-black text-blue-950 font-mono mt-1.5">{classes.length}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Occupation moyenne : {avgOccupation}%</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Salles & Labos</span>
              <DoorOpen className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-blue-950 font-mono mt-1.5">{rooms.length}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Capacité totale : {totalCapacity} places</div>
          </div>
        </div>

        {/* Classes Occupation Table */}
        <div className="rounded-2xl bg-white border border-blue-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-blue-100 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-blue-950">Répartition & Taux d'Occupation des Classes</h2>
              <p className="text-[11px] text-slate-500">Capacités d'accueil et salles principales attribuées</p>
            </div>
            <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              {classes.length} classes actives
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-blue-50/70 text-slate-500 uppercase text-[10px] tracking-wider border-b border-blue-100">
                <tr>
                  <th className="py-3 px-4">Classe</th>
                  <th className="py-3 px-4">Niveau</th>
                  <th className="py-3 px-4">Salle Principale</th>
                  <th className="py-3 px-4 text-right">Inscrits / Capacité</th>
                  <th className="py-3 px-4">Taux d'Occupation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 text-slate-800">
                {classes.map(cls => {
                  const pct = cls.capacity > 0 ? Math.min(100, Math.round((cls.studentsCount / cls.capacity) * 100)) : 0;
                  return (
                    <tr key={cls.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-blue-950">{cls.name}</td>
                      <td className="py-3 px-4 text-slate-600">{cls.level}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{cls.mainRoomName}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        {cls.studentsCount} / {cls.capacity}
                      </td>
                      <td className="py-3 px-4 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-blue-100/80 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct >= 90 ? 'bg-amber-500' : 'bg-blue-600'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-slate-700 w-9 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rooms & Facilities Table */}
        <div className="rounded-2xl bg-white border border-blue-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-blue-100 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-blue-950">État du Parc Immobilier & Salles Spécialisées</h2>
              <p className="text-[11px] text-slate-500">Salles de classe, laboratoires et équipements</p>
            </div>
            <button
              onClick={handleExportCsv}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-blue-50/70 text-slate-500 uppercase text-[10px] tracking-wider border-b border-blue-100">
                <tr>
                  <th className="py-3 px-4">Salle</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Capacité</th>
                  <th className="py-3 px-4">Affectation Actuelle</th>
                  <th className="py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 text-slate-800">
                {rooms.map(room => (
                  <tr key={room.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-blue-950">{room.name}</td>
                    <td className="py-3 px-4 text-slate-600">{room.type}</td>
                    <td className="py-3 px-4 text-right font-mono">{room.capacity} places</td>
                    <td className="py-3 px-4 text-slate-700">{room.currentOccupation || 'Disponible'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          room.currentOccupation
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {room.currentOccupation ? 'Occupée' : 'Libre'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};