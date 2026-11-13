import React, { useState } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { StaffMember, StaffRole } from '../../types';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  KeyRound, 
  QrCode, 
  Send, 
  Edit3, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ShieldAlert,
  X
} from 'lucide-react';
import { StaffBadgeModal } from './StaffBadgeModal';
import { ImageUploadField } from '../common/ImageUploadField';

export const StaffManagementView: React.FC = () => {
  const { 
    staff, 
    createStaff, 
    updateStaff, 
    toggleStaffStatus, 
    resetStaffPassword, 
    deleteStaff, 
    sendStaffCredentials, 
    selectedStaffForBadge, 
    setSelectedStaffForBadge,
    currentSchool 
  } = useSchoolAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<StaffMember | null>(null);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+224 ');
  const [address, setAddress] = useState('Conakry');
  const [role, setRole] = useState<StaffRole>('Enseignant');
  const [department, setDepartment] = useState('Sciences Exactes');
  const [hireDate, setHireDate] = useState(new Date().toISOString().split('T')[0]);
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80');

  const filteredStaff = staff.filter(s => {
    const matchesSearch = 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || s.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleOpenCreate = () => {
    setStaffToEdit(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('+224 ');
    setAddress('Conakry');
    setRole('Enseignant');
    setDepartment('Sciences Exactes');
    setHireDate(new Date().toISOString().split('T')[0]);
    setPhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80');
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (member: StaffMember) => {
    setStaffToEdit(member);
    setFirstName(member.firstName);
    setLastName(member.lastName);
    setEmail(member.email);
    setPhone(member.phone);
    setAddress(member.address);
    setRole(member.role);
    setDepartment(member.department);
    setHireDate(member.hireDate);
    setPhoto(member.photo);
    setIsFormModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    if (staffToEdit) {
      updateStaff(staffToEdit.id, {
        firstName,
        lastName,
        email,
        phone,
        address,
        role,
        department,
        hireDate,
        photo
      });
    } else {
      createStaff({
        schoolId: currentSchool.id,
        firstName,
        lastName,
        email,
        phone,
        address,
        role,
        department,
        hireDate,
        status: 'actif',
        photo
      });
    }

    setIsFormModalOpen(false);
  };

  const allRoles: StaffRole[] = [
    'Directeur',
    'Secrétaire',
    'Comptable',
    'Enseignant',
    'Bibliothécaire',
    'Surveillant',
    'Personnel administratif',
    'Responsable informatique'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950">
            Gestion du Personnel & Comptes ({staff.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Création des collaborateurs, badges professionnels, QR codes de pointage et expédition d'identifiants
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Employé</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par nom, matricule, fonction ou email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-white border border-slate-200 text-blue-950 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
        >
          <option value="all">Toutes les fonctions ({staff.length})</option>
          {allRoles.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Staff Table */}
      <div className="rounded-xl border border-blue-100 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-blue-100 bg-blue-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Employé</th>
                <th className="py-3 px-4">Fonction & Service</th>
                <th className="py-3 px-4">Identifiants & QR</th>
                <th className="py-3 px-4">Contacts</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100 text-slate-900">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    Aucun collaborateur ne correspond aux critères.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-blue-50 transition-colors">
                    {/* Photo & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={member.photo} 
                          alt={member.firstName} 
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-blue-950 text-xs">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-[11px] font-mono text-blue-600">
                            {member.matricule}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Department */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900">{member.role}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">{member.department}</div>
                    </td>

                    {/* Automated Username & Temporary Password */}
                    <td className="py-3 px-4">
                      <div className="text-[11px] font-mono text-slate-700">
                        user : <strong className="text-blue-950">{member.username}</strong>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => setSelectedStaffForBadge(member)}
                          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                          title="Voir le badge & QR Code"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>Badge QR</span>
                        </button>

                        <button
                          onClick={() => sendStaffCredentials(member.id)}
                          className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded transition-colors ${
                            member.credentialsSent
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-slate-50 text-slate-700 hover:text-blue-950 border border-slate-200'
                          }`}
                          title="Transmettre par Email & SMS"
                        >
                          <Send className="w-3 h-3" />
                          <span>{member.credentialsSent ? 'Envoyé ✓' : 'Envoyer SMS/Mail'}</span>
                        </button>
                      </div>
                    </td>

                    {/* Contacts */}
                    <td className="py-3 px-4 text-slate-700 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-slate-500 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{member.phone}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                        member.status === 'actif' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          member.status === 'actif' ? 'bg-emerald-400' : 'bg-rose-400'
                        }`} />
                        {member.status === 'actif' ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => resetStaffPassword(member.id)}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-blue-50 rounded transition-colors"
                          title="Réinitialiser le mot de passe (Code PIN requis)"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-1.5 text-slate-500 hover:text-blue-950 hover:bg-blue-50 rounded transition-colors"
                          title="Modifier"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => toggleStaffStatus(member.id)}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-blue-50 rounded transition-colors"
                          title={member.status === 'actif' ? "Désactiver l'employé" : "Réactiver l'employé"}
                        >
                          {member.status === 'actif' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => deleteStaff(member.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-blue-50 rounded transition-colors"
                          title="Supprimer (Code PIN requis)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Staff Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-bold text-blue-950 text-sm">
                {staffToEdit ? "Modifier l'Employé" : "Créer un Nouveau Membre du Personnel"}
              </h3>
              <button onClick={() => setIsFormModalOpen(false)} className="text-slate-500 hover:text-blue-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Nom de famille *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Fonction / Rôle *</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as StaffRole)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                  >
                    {allRoles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Département / Service *</label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="Ex: Sciences Exactes, Secrétariat..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Email professionnel *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Téléphone mobile *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Date d'embauche</label>
                  <input
                    type="date"
                    value={hireDate}
                    onChange={e => setHireDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Adresse géographique</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Photo d'identité du collaborateur"
                value={photo}
                onChange={setPhoto}
                aspectRatio="circle"
                placeholder="https://.../photo.jpg"
                helperText="Importez depuis votre PC ou collez un lien. Cette photo figure sur le badge professionnel imprimable."
              />

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-slate-700 text-[11px]">
                <strong className="text-blue-700">Génération automatique SmartSchool :</strong>
                <p className="mt-0.5">
                  Un matricule officiel, un identifiant de connexion, un mot de passe temporaire et un QR code unique de badge seront automatiquement attribués.
                </p>
              </div>

              <div className="pt-3 border-t border-blue-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-blue-950 rounded-lg bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
                >
                  {staffToEdit ? "Enregistrer" : "Créer l'employé"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Badge Inspection Modal */}
      {selectedStaffForBadge && (
        <StaffBadgeModal
          staff={selectedStaffForBadge}
          onClose={() => setSelectedStaffForBadge(null)}
        />
      )}
    </div>
  );
};
