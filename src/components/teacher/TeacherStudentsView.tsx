import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useTeacher } from '../../context/TeacherContext';
import { 
  Users, 
  Search, 
  Phone, 
  Printer, 
  Download, 
  LayoutList, 
  LayoutGrid, 
  HeartPulse, 
  BookOpen, 
  GraduationCap,
  ClipboardCheck,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const TeacherStudentsView: React.FC = () => {
  const { 
    classes, 
    students, 
    selectedClassId, 
    setSelectedClassId, 
    getSubjectsForClass, 
    setActiveTeacherTab,
    triggerToast,
    profile
  } = useTeacher();

  const [scopeFilter, setScopeFilter] = useState<string>(selectedClassId || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Keep synced when user arrives from another tab after picking a class
  React.useEffect(() => {
    if (selectedClassId) {
      setScopeFilter(selectedClassId);
    }
  }, [selectedClassId]);

  const activeClass = scopeFilter === 'all' ? null : classes.find(c => c.id === scopeFilter) || null;
  const classRoster = scopeFilter === 'all' ? students : students.filter(s => s.classId === scopeFilter);

  const filteredStudents = classRoster.filter(s => {
    const q = searchTerm.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.matricule.toLowerCase().includes(q) ||
      s.parentName.toLowerCase().includes(q) ||
      s.className.toLowerCase().includes(q)
    );
  });

  const handleSelectScope = (nextScope: string) => {
    setScopeFilter(nextScope);
    if (nextScope !== 'all') {
      setSelectedClassId(nextScope);
    }
  };

  const handleExportExcel = () => {
    const label = activeClass ? activeClass.name : 'Toutes_Mes_Classes';
    const headers = [
      'N°',
      'Matricule',
      'Nom & Prénom',
      'Genre',
      'Classe',
      'Matière(s) Enseignée(s)',
      'Moyenne (/20)',
      'Assiduité (%)',
      'Absences',
      'Retards',
      'Parent / Tuteur',
      'Téléphone Parent',
      'Observation Pédagogique'
    ];

    const rows = filteredStudents.map((st, idx) => {
      const subs = getSubjectsForClass(st.className).map(s => s.name).join(' / ');
      return [
        idx + 1,
        st.matricule,
        st.fullName,
        st.gender === 'F' ? 'Fille' : 'Garçon',
        st.className,
        subs,
        st.average,
        st.attendanceRate,
        st.absenceCount,
        st.lateCount,
        st.parentName,
        st.parentPhone,
        st.observation
      ];
    });

    const ws = XLSX.utils.aoa_to_sheet([
      [`Liste Complète des Élèves - ${profile.firstName} ${profile.lastName}`],
      [`Périmètre : ${label} (${filteredStudents.length} élèves)`],
      [],
      headers,
      ...rows
    ]);
    ws['!cols'] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 24 },
      { wch: 9 },
      { wch: 34 },
      { wch: 26 },
      { wch: 13 },
      { wch: 13 },
      { wch: 10 },
      { wch: 10 },
      { wch: 22 },
      { wch: 18 },
      { wch: 42 }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Eleves');
    XLSX.writeFile(wb, `Liste_Eleves_${label.replace(/[^a-zA-Z0-9]+/g, '_')}.xlsx`);
    triggerToast(`Liste Excel (${filteredStudents.length} élèves) exportée avec succès.`);
  };

  const activeSubjectsList = activeClass
    ? getSubjectsForClass(activeClass.name)
    : Array.from(new Map(classes.flatMap(c => getSubjectsForClass(c.name)).map(s => [s.id, s])).values());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>Tableau Complet des Élèves de mes Classes</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Périmètre strict de <strong className="text-blue-950">M. {profile.firstName} {profile.lastName}</strong> — uniquement vos classes attribuées, vos matières et l'intégralité de vos élèves inscrits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-950 text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
          >
            {viewMode === 'table' ? <LayoutGrid className="w-3.5 h-3.5 text-blue-600" /> : <LayoutList className="w-3.5 h-3.5 text-blue-600" />}
            <span>{viewMode === 'table' ? 'Vue Fiches' : 'Vue Tableau Complet'}</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter Excel ({filteredStudents.length})</span>
          </button>

          <button
            onClick={() => triggerPrint('teacher-roster-printable', `Tableau_Eleves_${activeClass ? activeClass.name : 'Toutes_Classes'}`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-100 text-slate-900 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer Tableau</span>
          </button>
        </div>
      </div>

      {/* Class Filter Tabs + Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-blue-100">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSelectScope('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              scopeFilter === 'all'
                ? 'bg-blue-950 text-white shadow-md'
                : 'bg-white text-slate-600 border border-blue-100 hover:text-blue-950'
            }`}
          >
            Toutes mes classes ({students.length} élèves)
          </button>
          {classes.map(c => {
            const count = students.filter(s => s.classId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => handleSelectScope(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  scopeFilter === c.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-600 border border-blue-100 hover:text-blue-950'
                }`}
              >
                {c.name.split('(')[0].trim()} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Filtrer par nom, matricule ou parent..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-blue-100 text-xs text-blue-950 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Active Class & Subjects Scope Banner */}
      <div className="p-4 rounded-2xl bg-white border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{filteredStudents.length} / {classRoster.length} élèves affichés (100% de l'effectif)</span>
            </span>
            {activeClass && (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-semibold">
                {activeClass.room}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-blue-950 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Matière(s) dispensée(s) ici :</span>
            </span>
            {activeSubjectsList.map(sub => (
              <span key={sub.id} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-bold">
                {sub.name} ({sub.level} · Coef {sub.coefficient})
              </span>
            ))}
          </div>
        </div>

        {activeClass && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setSelectedClassId(activeClass.id);
                setActiveTeacherTab('attendance');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold cursor-pointer"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Faire l'appel ({classRoster.length})</span>
            </button>
            <button
              onClick={() => {
                setSelectedClassId(activeClass.id);
                setActiveTeacherTab('gradebook');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Saisir les notes</span>
            </button>
          </div>
        )}
      </div>

      {/* Printable Roster View */}
      <div id="teacher-roster-printable">
        {viewMode === 'table' ? (
          <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-blue-50/70 text-slate-600 uppercase text-[10px] tracking-wider border-b border-blue-100">
                  <tr>
                    <th className="py-3 px-3 text-center">N°</th>
                    <th className="py-3 px-3">Matricule</th>
                    <th className="py-3 px-4">Élève (Nom & Prénom)</th>
                    <th className="py-3 px-3">Classe</th>
                    <th className="py-3 px-3">Matière(s) du Prof</th>
                    <th className="py-3 px-3 text-center">Moyenne</th>
                    <th className="py-3 px-3 text-center">Assiduité</th>
                    <th className="py-3 px-3">Parent & Contact</th>
                    <th className="py-3 px-4">Observation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-slate-500 text-xs">
                        Aucun élève trouvé pour cette recherche.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, index) => {
                      const classSubjects = getSubjectsForClass(student.className);
                      return (
                        <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="py-3 px-3 text-center font-mono text-slate-500 font-semibold">
                            {index + 1}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                            {student.matricule}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {student.firstName.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-blue-950 flex items-center gap-1.5">
                                  <span>{student.fullName}</span>
                                  {student.status === 'suivi' && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                      À suivre
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {student.gender === 'F' ? 'Fille' : 'Garçon'} · Gr. {student.bloodGroup}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px]">
                              <GraduationCap className="w-3 h-3 text-blue-600" />
                              <span>{student.className.split('(')[0].trim()}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex flex-wrap gap-1">
                              {classSubjects.map(sub => (
                                <span key={sub.id} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                                  {sub.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`font-mono font-black px-2 py-0.5 rounded ${
                              student.average >= 14
                                ? 'bg-emerald-50 text-emerald-700'
                                : student.average >= 10
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}>
                              {student.average.toFixed(1)}/20
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className={`font-mono font-bold ${
                              student.attendanceRate >= 90 ? 'text-emerald-600' : 'text-amber-700'
                            }`}>
                              {student.attendanceRate}%
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {student.absenceCount} abs · {student.lateCount} ret
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-800 text-[11px]">{student.parentName}</div>
                            <a
                              href={`tel:${student.parentPhone}`}
                              className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-600 hover:underline mt-0.5"
                            >
                              <Phone className="w-2.5 h-2.5" />
                              <span>{student.parentPhone}</span>
                            </a>
                          </td>
                          <td className="py-3 px-4 text-[11px] text-slate-600 max-w-[230px]">
                            {student.observation}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Student Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
              <div 
                key={student.id}
                className="rounded-2xl bg-white border border-blue-100 p-5 shadow-lg hover:border-slate-200 transition-all space-y-4"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-base shadow-md">
                      {student.fullName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-blue-950 leading-tight">{student.fullName}</h2>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{student.matricule}</div>
                      <div className="text-[10px] text-blue-600 font-semibold mt-0.5">{student.className}</div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200 font-mono">
                    {student.bloodGroup}
                  </span>
                </div>

                {/* Academic stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                    <div className="text-[10px] text-slate-500">Moyenne Matière</div>
                    <div className="text-base font-black text-emerald-600 mt-0.5">{student.average} / 20</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                    <div className="text-[10px] text-slate-500">Taux Présence</div>
                    <div className="text-base font-black text-indigo-600 mt-0.5">{student.attendanceRate}%</div>
                  </div>
                </div>

                {/* Medical Alert if any */}
                {student.medicalNote !== 'RAS' && student.medicalNote !== 'Aucune contre-indication' && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[11px]">
                    <HeartPulse className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{student.medicalNote}</span>
                  </div>
                )}

                {/* Pedagogical observation */}
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Observation de l'enseignant :</div>
                  <p className="text-slate-700 italic">"{student.observation}"</p>
                </div>

                {/* Parent contact */}
                <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="truncate">
                    <div className="text-[10px] text-slate-500">Contact Parent</div>
                    <div className="font-semibold text-slate-700 truncate">{student.parentName}</div>
                  </div>
                  <a 
                    href={`tel:${student.parentPhone}`}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold shrink-0"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Appeler</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
