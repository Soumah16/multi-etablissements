import React, { useState } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { 
  UserCheck, 
  BookOpen, 
  Building2, 
  DoorOpen, 
  Search,
  X,
  Award,
  Table2
} from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const { 
    staff, 
    classes, 
    subjects, 
    rooms, 
    assignTeacherToClass, 
    unassignTeacherFromClass,
    assignTeacherToSubject, 
    unassignTeacherFromSubject,
    assignPrincipalTeacher, 
    assignRoomToClass 
  } = useSchoolAdmin();

  const teachers = staff.filter(s => s.role === 'Enseignant');

  // Form states
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');
  const [selectedClassTeacherId, setSelectedClassTeacherId] = useState(teachers[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');

  const [principalClassId, setPrincipalClassId] = useState(classes[0]?.id || '');
  const [principalTeacherId, setPrincipalTeacherId] = useState(teachers[0]?.id || '');

  const [roomClassId, setRoomClassId] = useState(classes[0]?.id || '');
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '');

  // Matrix filter state
  const [matrixSearch, setMatrixSearch] = useState('');
  const [matrixClassFilter, setMatrixClassFilter] = useState<string>('all');

  const handleAssignTeacherSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId || !selectedSubjectId) return;
    assignTeacherToSubject(selectedTeacherId, selectedSubjectId);
  };

  const handleAssignTeacherClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassTeacherId || !selectedClassId) return;
    assignTeacherToClass(selectedClassTeacherId, selectedClassId);
  };

  const handleAssignPrincipal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!principalClassId || !principalTeacherId) return;
    assignPrincipalTeacher(principalClassId, principalTeacherId);
  };

  const handleAssignRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomClassId || !selectedRoomId) return;
    assignRoomToClass(roomClassId, selectedRoomId);
  };

  // Filtered teachers for the summary matrix
  const filteredTeachers = teachers.filter(t => {
    const teacherSubjects = (t.assignedSubjects || [])
      .map(id => subjects.find(s => s.id === id)?.name || '')
      .join(' ');
    const teacherClasses = (t.assignedClasses || [])
      .map(id => classes.find(c => c.id === id)?.name || '')
      .join(' ');

    const matchesSearch = !matrixSearch.trim() ||
      `${t.firstName} ${t.lastName}`.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      t.matricule.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      teacherSubjects.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      teacherClasses.toLowerCase().includes(matrixSearch.toLowerCase());

    const matchesClass = matrixClassFilter === 'all' ||
      (t.assignedClasses || []).includes(matrixClassFilter);

    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950">
            Affectations Administratives & Pédagogiques
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Attribution et suivi en direct des enseignants par matière, classe, professeur principal et salle de cours
          </p>
        </div>
      </div>

      {/* Grid of 4 Interactive Assignment Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel 1: Enseignant -> Matière */}
        <div className="p-5 rounded-xl bg-white border border-blue-100 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-blue-100">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-blue-950 text-xs uppercase tracking-wider">
              1. Enseignant → Matière
            </h3>
          </div>

          <form onSubmit={handleAssignTeacherSubject} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-medium">Sélectionner l'Enseignant :</label>
              <select
                value={selectedTeacherId}
                onChange={e => setSelectedTeacherId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.department})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-medium">Matière à Enseigner :</label>
              <select
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} (Coef. {s.coefficient}) - {s.department}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 font-semibold text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
            >
              Affecter la Matière
            </button>
          </form>
        </div>

        {/* Panel 2: Enseignant -> Classe */}
        <div className="p-5 rounded-xl bg-white border border-blue-100 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-blue-100">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-blue-950 text-xs uppercase tracking-wider">
              2. Enseignant → Classe
            </h3>
          </div>

          <form onSubmit={handleAssignTeacherClass} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-medium">Sélectionner l'Enseignant :</label>
              <select
                value={selectedClassTeacherId}
                onChange={e => setSelectedClassTeacherId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.department})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-medium">Classe Cible :</label>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 font-semibold text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
            >
              Affecter à la Classe
            </button>
          </form>
        </div>

        {/* Panel 3: Professeur Principal -> Classe */}
        <div className="p-5 rounded-xl bg-white border border-blue-100 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-blue-100">
            <UserCheck className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-blue-950 text-xs uppercase tracking-wider">
              3. Professeur Principal → Classe
            </h3>
          </div>

          <form onSubmit={handleAssignPrincipal} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-medium">Sélectionner la Classe :</label>
              <select
                value={principalClassId}
                onChange={e => setPrincipalClassId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - Actuel : {c.principalTeacherName || 'Non défini'}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-medium">Enseignant Nommé :</label>
              <select
                value={principalTeacherId}
                onChange={e => setPrincipalTeacherId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.department})</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 font-semibold text-xs rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
            >
              Désigner Professeur Principal
            </button>
          </form>
        </div>

        {/* Panel 4: Salle -> Classe */}
        <div className="p-5 rounded-xl bg-white border border-blue-100 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-blue-100">
            <DoorOpen className="w-4 h-4 text-amber-700" />
            <h3 className="font-bold text-blue-950 text-xs uppercase tracking-wider">
              4. Salle Principale → Classe
            </h3>
          </div>

          <form onSubmit={handleAssignRoom} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-medium">Sélectionner la Classe :</label>
              <select
                value={roomClassId}
                onChange={e => setRoomClassId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} (Salle actuelle : {c.mainRoomName})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 font-medium">Salle / Bâtiment :</label>
              <select
                value={selectedRoomId}
                onChange={e => setSelectedRoomId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.capacity} places)</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 font-semibold text-xs rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer"
            >
              Attribuer la Salle
            </button>
          </form>
        </div>
      </div>

      {/* Live Summary Table: Which Teacher teaches which Subject in which Class */}
      <div className="rounded-2xl bg-white border border-blue-100 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-blue-50/40">
          <div>
            <h2 className="text-sm font-black text-blue-950 flex items-center gap-2">
              <Table2 className="w-4 h-4 text-blue-600" />
              <span>Tableau Récapitulatif : Quel Professeur dispense quel Cours et dans quelle Classe</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Vue consolidée en temps réel de toutes les matières et classes attribuées à chaque enseignant (cliquez sur × pour retirer).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={matrixSearch}
                onChange={e => setMatrixSearch(e.target.value)}
                placeholder="Prof, matière ou classe..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={matrixClassFilter}
              onChange={e => setMatrixClassFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-blue-950 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Toutes les classes ({classes.length})</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-50/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-blue-100">
              <tr>
                <th className="py-3 px-4">Professeur & Matricule</th>
                <th className="py-3 px-4">Matière(s) Dispensée(s)</th>
                <th className="py-3 px-4">Classe(s) Attribuée(s)</th>
                <th className="py-3 px-4">Professeur Principal de</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 text-xs">
                    Aucun enseignant ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map(teacher => {
                  const assignedSubs = (teacher.assignedSubjects || [])
                    .map(id => subjects.find(s => s.id === id))
                    .filter((s): s is NonNullable<typeof s> => Boolean(s));
                  const assignedCls = (teacher.assignedClasses || [])
                    .map(id => classes.find(c => c.id === id))
                    .filter((c): c is NonNullable<typeof c> => Boolean(c));
                  const principalOf = classes.filter(c => c.principalTeacherId === teacher.id);

                  return (
                    <tr key={teacher.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={teacher.photo}
                            alt={teacher.firstName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-blue-950">{teacher.firstName} {teacher.lastName}</div>
                            <div className="text-[10px] font-mono text-blue-600">{teacher.matricule} · {teacher.department}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {assignedSubs.length === 0 ? (
                            <span className="text-[11px] text-slate-400 italic">Aucune matière assignée</span>
                          ) : (
                            assignedSubs.map(sub => (
                              <span
                                key={sub.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-semibold"
                              >
                                <BookOpen className="w-3 h-3 text-blue-600" />
                                <span>{sub.name} (Coef {sub.coefficient})</span>
                                <button
                                  type="button"
                                  onClick={() => unassignTeacherFromSubject(teacher.id, sub.id)}
                                  className="ml-0.5 text-blue-400 hover:text-rose-600 cursor-pointer"
                                  title={`Retirer ${sub.name}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {assignedCls.length === 0 ? (
                            <span className="text-[11px] text-slate-400 italic">Aucune classe assignée</span>
                          ) : (
                            assignedCls.map(cls => (
                              <span
                                key={cls.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold"
                              >
                                <Building2 className="w-3 h-3 text-emerald-600" />
                                <span>{cls.name}</span>
                                <button
                                  type="button"
                                  onClick={() => unassignTeacherFromClass(teacher.id, cls.id)}
                                  className="ml-0.5 text-emerald-500 hover:text-rose-600 cursor-pointer"
                                  title={`Retirer de ${cls.name}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {principalOf.length === 0 ? (
                          <span className="text-[11px] text-slate-400">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {principalOf.map(c => (
                              <span key={c.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-bold">
                                <Award className="w-3 h-3 text-purple-600" />
                                <span>{c.name}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
