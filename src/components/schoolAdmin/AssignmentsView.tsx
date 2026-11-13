import React, { useState } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { 
  Shuffle, 
  UserCheck, 
  BookOpen, 
  Building2, 
  DoorOpen, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const { 
    staff, 
    classes, 
    subjects, 
    rooms, 
    assignTeacherToClass, 
    assignTeacherToSubject, 
    assignPrincipalTeacher, 
    assignRoomToClass 
  } = useSchoolAdmin();

  const teachers = staff.filter(s => s.role === 'Enseignant');
  const supervisors = staff.filter(s => s.role === 'Surveillant');

  // Form states
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');

  const [principalClassId, setPrincipalClassId] = useState(classes[0]?.id || '');
  const [principalTeacherId, setPrincipalTeacherId] = useState(teachers[0]?.id || '');

  const [roomClassId, setRoomClassId] = useState(classes[0]?.id || '');
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '');

  const handleAssignTeacherSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId || !selectedSubjectId) return;
    assignTeacherToSubject(selectedTeacherId, selectedSubjectId);
  };

  const handleAssignTeacherClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId || !selectedClassId) return;
    assignTeacherToClass(selectedTeacherId, selectedClassId);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950">
            Affectations Administratives & Pédagogiques
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Attribution des enseignants aux matières, classes, professeurs principaux et salles de cours
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
              className="w-full py-2 font-semibold text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
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
              className="w-full py-2 font-semibold text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
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
              className="w-full py-2 font-semibold text-xs rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
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
              className="w-full py-2 font-semibold text-xs rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors"
            >
              Attribuer la Salle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
