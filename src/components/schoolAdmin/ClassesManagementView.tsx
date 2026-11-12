import React, { useState } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { SchoolClass } from '../../types';
import { 
  Building2, 
  Plus, 
  Search, 
  DoorOpen, 
  UserCheck, 
  Edit3, 
  Trash2, 
  Archive, 
  Users, 
  CheckCircle2, 
  X,
  Layers
} from 'lucide-react';

export const ClassesManagementView: React.FC = () => {
  const { 
    classes, 
    rooms, 
    staff, 
    createClass, 
    updateClass, 
    deleteClass, 
    archiveClass, 
    currentSchool 
  } = useSchoolAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<SchoolClass | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Lycée (Terminale)');
  const [section, setSection] = useState('Sciences Mathématiques (SM)');
  const [capacity, setCapacity] = useState(45);
  const [mainRoomId, setMainRoomId] = useState(rooms[0]?.id || '');
  const [principalTeacherId, setPrincipalTeacherId] = useState('');

  const teachers = staff.filter(s => s.role === 'Enseignant');

  const filteredClasses = classes.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mainRoomName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = filterLevel === 'all' || c.level.includes(filterLevel);

    return matchesSearch && matchesLevel;
  });

  const handleOpenCreate = () => {
    setClassToEdit(null);
    setName('');
    setLevel('Lycée (Terminale)');
    setSection('Sciences Mathématiques (SM)');
    setCapacity(45);
    setMainRoomId(rooms[0]?.id || '');
    setPrincipalTeacherId('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls: SchoolClass) => {
    setClassToEdit(cls);
    setName(cls.name);
    setLevel(cls.level);
    setSection(cls.section);
    setCapacity(cls.capacity);
    setMainRoomId(cls.mainRoomId);
    setPrincipalTeacherId(cls.principalTeacherId || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const room = rooms.find(r => r.id === mainRoomId);
    const mainRoomName = room ? room.name : 'Salle non définie';
    const teacher = staff.find(s => s.id === principalTeacherId);
    const principalTeacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : undefined;

    if (classToEdit) {
      updateClass(classToEdit.id, {
        name,
        level,
        section,
        capacity,
        mainRoomId,
        mainRoomName,
        principalTeacherId,
        principalTeacherName
      });
    } else {
      createClass({
        schoolId: currentSchool.id,
        name,
        level,
        section,
        capacity,
        studentsCount: 0,
        mainRoomId,
        mainRoomName,
        principalTeacherId,
        principalTeacherName,
        archived: false
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Gestion des Classes & Sections ({classes.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Définition des divisions pédagogiques, capacités d'accueil, salles associées et professeurs principaux
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une Classe</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par nom de classe, section ou salle..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filterLevel}
          onChange={e => setFilterLevel(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tous les cycles d'études</option>
          <option value="Lycée">Lycée</option>
          <option value="Collège">Collège</option>
          <option value="Primaire">Primaire</option>
        </select>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => {
          const occupancyRate = Math.round((cls.studentsCount / cls.capacity) * 100);
          return (
            <div 
              key={cls.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                cls.archived 
                  ? 'bg-slate-900/40 border-slate-800 opacity-60' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
                      {cls.level}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {cls.name}
                    </h3>
                    <div className="text-xs text-slate-400">{cls.section}</div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    cls.archived ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {cls.archived ? 'Archivée' : 'Ouverte'}
                  </span>
                </div>

                {/* Quotas & Occupancy */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      Effectif Élèves :
                    </span>
                    <span className="font-mono font-bold text-white">
                      {cls.studentsCount} / {cls.capacity} places ({occupancyRate}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${Math.min(100, occupancyRate)}%` }}
                    />
                  </div>

                  {/* Room */}
                  <div className="flex items-center gap-2 pt-2 text-slate-300">
                    <DoorOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Salle : <strong className="text-white">{cls.mainRoomName}</strong></span>
                  </div>

                  {/* Principal Teacher */}
                  <div className="flex items-center gap-2 text-slate-300">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">
                      Prof. Principal : <strong className="text-white">{cls.principalTeacherName || 'Non assigné'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => archiveClass(cls.id)}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px]"
                >
                  <Archive className="w-3 h-3" />
                  <span>{cls.archived ? 'Désarchiver' : 'Archiver'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cls)}
                    className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800"
                    title="Modifier"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteClass(cls.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded bg-slate-800"
                    title="Supprimer (Code PIN requis)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">
                {classToEdit ? "Modifier la Classe" : "Créer une Nouvelle Classe"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Nom officiel de la classe *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Terminale SM 1, 10ème A..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Niveau d'études *</label>
                  <select
                    value={level}
                    onChange={e => setLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Lycée (Terminale)">Lycée (Terminale)</option>
                    <option value="Lycée (1ère Année)">Lycée (1ère Année)</option>
                    <option value="Lycée (11ème Année)">Lycée (11ème Année)</option>
                    <option value="Collège">Collège</option>
                    <option value="Primaire">Primaire</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Capacité max *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Section / Filière</label>
                <input
                  type="text"
                  placeholder="Sciences Mathématiques, Littéraire..."
                  value={section}
                  onChange={e => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Salle principale de cours</label>
                <select
                  value={mainRoomId}
                  onChange={e => setMainRoomId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.capacity} pl.)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Professeur Principal assigné</label>
                <select
                  value={principalTeacherId}
                  onChange={e => setPrincipalTeacherId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Sélectionner plus tard</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.department})</option>
                  ))}
                </select>
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
                  {classToEdit ? "Enregistrer" : "Créer la classe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
