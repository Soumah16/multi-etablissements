import React, { useState } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { SchoolRoom, FacilityType } from '../../types';
import { DoorOpen, Plus, Search, Edit3, Trash2, CheckCircle2, X, Laptop, BookOpen, FlaskConical } from 'lucide-react';

export const RoomsManagementView: React.FC = () => {
  const { rooms, createRoom, updateRoom, deleteRoom, currentSchool } = useSchoolAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<SchoolRoom | null>(null);

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(45);
  const [type, setType] = useState<FacilityType>('Salle de cours');
  const [equipmentsStr, setEquipmentsStr] = useState('Vidéoprojecteur, Climatisation, Wi-Fi');

  const facilityTypes: FacilityType[] = [
    'Salle de cours',
    'Laboratoire',
    'Bibliothèque',
    'Salle informatique'
  ];

  const filteredRooms = rooms.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.equipments.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'all' || r.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleOpenCreate = () => {
    setRoomToEdit(null);
    setName('');
    setCapacity(45);
    setType('Salle de cours');
    setEquipmentsStr('Vidéoprojecteur, Climatisation, Wi-Fi');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: SchoolRoom) => {
    setRoomToEdit(room);
    setName(room.name);
    setCapacity(room.capacity);
    setType(room.type);
    setEquipmentsStr(room.equipments.join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const equipments = equipmentsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (roomToEdit) {
      updateRoom(roomToEdit.id, {
        name,
        capacity,
        type,
        equipments
      });
    } else {
      createRoom({
        schoolId: currentSchool.id,
        name,
        capacity,
        type,
        equipments
      });
    }

    setIsModalOpen(false);
  };

  const getIconForType = (t: FacilityType) => {
    switch (t) {
      case 'Laboratoire': return <FlaskConical className="w-4 h-4 text-purple-400" />;
      case 'Salle informatique': return <Laptop className="w-4 h-4 text-cyan-400" />;
      case 'Bibliothèque': return <BookOpen className="w-4 h-4 text-amber-400" />;
      default: return <DoorOpen className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Gestion des Salles & Infrastructures ({rooms.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inventaire des salles de cours, laboratoires scientifiques, bibliothèque et salles informatiques
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Salle</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par nom, équipement ou type d'installation..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tous les types d'espaces</option>
          {facilityTypes.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <div key={room.id} className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                    {getIconForType(room.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{room.name}</h3>
                    <div className="text-[11px] text-blue-400 font-mono mt-0.5">{room.type}</div>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {room.capacity} places
                </span>
              </div>

              {/* Occupation */}
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs">
                <div className="text-slate-400 text-[11px]">Affectation actuelle :</div>
                <div className="font-semibold text-white mt-0.5">
                  {room.currentOccupation || "Libre / Multiusage"}
                </div>
              </div>

              {/* Equipments Tags */}
              <div className="mt-3">
                <div className="text-[10px] font-semibold uppercase text-slate-500 mb-1.5">Équipements installés</div>
                <div className="flex flex-wrap gap-1.5">
                  {room.equipments.map((eq, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-end gap-1 text-xs">
              <button
                onClick={() => handleOpenEdit(room)}
                className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 transition-colors"
                title="Modifier"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => deleteRoom(room.id)}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded bg-slate-800 transition-colors"
                title="Supprimer (Code PIN requis)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">
                {roomToEdit ? "Modifier la Salle" : "Ajouter une Salle / Espace"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Nom de la salle *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Salle 105, Labo Informatique..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Type d'espace *</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as FacilityType)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  >
                    {facilityTypes.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Capacité (personnes) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={500}
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Équipements (séparés par des virgules)</label>
                <textarea
                  rows={2}
                  placeholder="Projecteur, Climatisation, 30 PC..."
                  value={equipmentsStr}
                  onChange={e => setEquipmentsStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
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
                  {roomToEdit ? "Enregistrer" : "Créer la salle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
