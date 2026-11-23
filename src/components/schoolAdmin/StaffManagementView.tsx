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
  X,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { StaffBadgeModal } from './StaffBadgeModal';
import { ImageUploadField } from '../common/ImageUploadField';
import { EmailSendModal } from '../common/EmailSendModal';

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
    lastStaffCredentialReceipt,
    setLastStaffCredentialReceipt,
    currentSchool,
    classes,
    subjects
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
  const [initialPassword, setInitialPassword] = useState('');
  const [editNewPassword, setEditNewPassword] = useState('');
  const [copiedPwd, setCopiedPwd] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedRowId, setCopiedRowId] = useState<string | null>(null);
  const [passwordResetTarget, setPasswordResetTarget] = useState<StaffMember | null>(null);
  const [customResetPassword, setCustomResetPassword] = useState('');
  const [emailModalStaff, setEmailModalStaff] = useState<{ member: StaffMember; password?: string } | null>(null);

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
    setInitialPassword(`SmartPass#${Math.floor(1000 + Math.random() * 9000)}`);
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
    setEditNewPassword('');
    setIsFormModalOpen(true);
  };

  const handleOpenResetPassword = (member: StaffMember) => {
    setPasswordResetTarget(member);
    setCustomResetPassword(`SmartPass#${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleConfirmPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetTarget || !customResetPassword.trim()) return;
    const targetId = passwordResetTarget.id;
    const chosenPassword = customResetPassword.trim();
    setPasswordResetTarget(null);
    setCopiedPwd(false);
    resetStaffPassword(targetId, chosenPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    if (staffToEdit) {
      setCopiedPwd(false);
      updateStaff(
        staffToEdit.id,
        {
          firstName,
          lastName,
          email,
          phone,
          address,
          role,
          department,
          hireDate,
          photo
        },
        editNewPassword
      );
    } else {
      setCopiedPwd(false);
      createStaff(
        {
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
        },
        initialPassword
      );
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

                    {/* Role, Department & Teacher Assignments */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900">{member.role}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">{member.department}</div>
                      {member.role === 'Enseignant' && (
                        <div className="mt-1.5 space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {(member.assignedSubjects || []).length > 0 ? (
                              (member.assignedSubjects || []).map(subId => {
                                const sub = subjects.find(su => su.id === subId);
                                return sub ? (
                                  <span key={subId} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                                    {sub.name}
                                  </span>
                                ) : null;
                              })
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Aucune matière affectée</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(member.assignedClasses || []).length > 0 ? (
                              (member.assignedClasses || []).map(clsId => {
                                const cls = classes.find(c => c.id === clsId);
                                const isPrincipal = cls?.principalTeacherId === member.id;
                                return cls ? (
                                  <span key={clsId} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
                                    {cls.name}{isPrincipal ? ' ★ PP' : ''}
                                  </span>
                                ) : null;
                              })
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Aucune classe affectée</span>
                            )}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Automated Username & Temporary Password */}
                    <td className="py-3 px-4">
                      <div className="text-[11px] font-mono text-slate-700">
                        user : <strong className="text-blue-950">{member.username}</strong>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono">
                        <span className="text-slate-500">mdp :</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-blue-950 font-semibold">
                          {visiblePasswords[member.id]
                            ? member.temporaryPassword || 'Non défini'
                            : '••••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setVisiblePasswords(prev => ({
                              ...prev,
                              [member.id]: !prev[member.id]
                            }))
                          }
                          className="p-1 text-slate-500 hover:text-blue-700 rounded hover:bg-blue-50 cursor-pointer"
                          title={visiblePasswords[member.id] ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        >
                          {visiblePasswords[member.id] ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {member.temporaryPassword && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(member.temporaryPassword || '');
                              setCopiedRowId(member.id);
                              setTimeout(() => setCopiedRowId(null), 2000);
                            }}
                            className="p-1 text-slate-500 hover:text-emerald-600 rounded hover:bg-emerald-50 cursor-pointer"
                            title="Copier le mot de passe"
                          >
                            {copiedRowId === member.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => setSelectedStaffForBadge(member)}
                          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer"
                          title="Voir le badge & QR Code"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>Badge QR</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setEmailModalStaff({ member, password: member.temporaryPassword })}
                          className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded transition-colors cursor-pointer ${
                            member.credentialsSent
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-slate-50 text-slate-700 hover:text-blue-950 border border-slate-200'
                          }`}
                          title="Envoyer les identifiants par Email (Gmail / Mail) ou WhatsApp"
                        >
                          <Mail className="w-3 h-3" />
                          <span>{member.credentialsSent ? 'Envoyé ✓' : 'Envoyer Email'}</span>
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
                          onClick={() => handleOpenResetPassword(member)}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Définir / Réinitialiser le mot de passe (Code PIN requis)"
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

              {!staffToEdit ? (
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Mot de passe initial *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={initialPassword}
                      onChange={e => setInitialPassword(e.target.value)}
                      placeholder="Ex: SmartPass#2026"
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setInitialPassword(`SmartPass#${Math.floor(1000 + Math.random() * 9000)}`)}
                      className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Générer</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Nouveau mot de passe (optionnel)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editNewPassword}
                      onChange={e => setEditNewPassword(e.target.value)}
                      placeholder="Laisser vide pour conserver l'actuel"
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setEditNewPassword(`SmartPass#${Math.floor(1000 + Math.random() * 9000)}`)}
                      className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Générer</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-slate-700 text-[11px]">
                <strong className="text-blue-700">Génération automatique SmartSchool :</strong>
                <p className="mt-0.5">
                  Un matricule officiel, un identifiant de connexion, le mot de passe initial ci-dessus et un QR code unique de badge seront enregistrés immédiatement.
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

      {/* Custom Password Setup / Reset Modal (triggers PIN confirmation next) */}
      {passwordResetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-amber-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2 text-amber-700">
                <KeyRound className="w-5 h-5" />
                <h3 className="font-bold text-sm text-blue-950">Définir / Réinitialiser le Mot de Passe</h3>
              </div>
              <button
                type="button"
                onClick={() => setPasswordResetTarget(null)}
                className="text-slate-500 hover:text-blue-950 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPasswordReset} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-blue-950">
                  {passwordResetTarget.firstName} {passwordResetTarget.lastName}
                </div>
                <div className="text-slate-600">
                  {passwordResetTarget.role} · <span className="font-mono text-blue-700">{passwordResetTarget.matricule}</span>
                </div>
                <div className="text-slate-500 font-mono">{passwordResetTarget.email}</div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold block">Nouveau mot de passe à activer *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={customResetPassword}
                    onChange={e => setCustomResetPassword(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setCustomResetPassword(`SmartPass#${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Générer</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  À l'étape suivante, saisissez votre <strong>Code PIN Administrateur</strong> (par défaut <strong className="font-mono">123456</strong>). Le mot de passe sera aussitôt activé et affiché.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordResetTarget(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold cursor-pointer"
                >
                  Continuer vers Code PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unified Staff Credentials & Activated Password Receipt Modal */}
      {lastStaffCredentialReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-emerald-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-bold text-sm text-blue-950">
                  {lastStaffCredentialReceipt.action === 'created'
                    ? 'Identifiants de connexion créés'
                    : lastStaffCredentialReceipt.action === 'reset'
                    ? 'Nouveau mot de passe activé'
                    : 'Identifiants mis à jour'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLastStaffCredentialReceipt(null)}
                className="text-slate-500 hover:text-blue-950 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-slate-500">Employé :</span>{' '}
                <strong className="text-blue-950">
                  {lastStaffCredentialReceipt.member.firstName} {lastStaffCredentialReceipt.member.lastName}
                </strong>{' '}
                ({lastStaffCredentialReceipt.member.role})
              </div>
              <div>
                <span className="text-slate-500">Matricule :</span>{' '}
                <strong className="font-mono text-blue-700">{lastStaffCredentialReceipt.member.matricule}</strong>
              </div>
              <div>
                <span className="text-slate-500">Email / Identifiant :</span>{' '}
                <strong className="font-mono text-blue-950">{lastStaffCredentialReceipt.member.email}</strong>
              </div>
              <div>
                <span className="text-slate-500">Nom d'utilisateur :</span>{' '}
                <strong className="font-mono text-blue-950">{lastStaffCredentialReceipt.member.username}</strong>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <span className="text-slate-500 block">Mot de passe actif :</span>
                  <strong className="font-mono text-sm text-emerald-700">{lastStaffCredentialReceipt.password}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(lastStaffCredentialReceipt.password || '');
                    setCopiedPwd(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPwd ? 'Copié ✓' : 'Copier'}</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
              Ce collaborateur peut se connecter immédiatement sur le portail avec son email ou son matricule et ce mot de passe.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  const receipt = lastStaffCredentialReceipt;
                  setLastStaffCredentialReceipt(null);
                  setEmailModalStaff({ member: receipt.member, password: receipt.password });
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Envoyer par Email</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const m = lastStaffCredentialReceipt.member;
                    const summary = `SmartSchool Guinée - Identifiants ${m.role}\nNom: ${m.firstName} ${m.lastName}\nEmail: ${m.email}\nMatricule: ${m.matricule}\nMot de passe: ${lastStaffCredentialReceipt.password}`;
                    navigator.clipboard?.writeText(summary);
                    setCopiedPwd(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Copier la fiche
                </button>
                <button
                  type="button"
                  onClick={() => setLastStaffCredentialReceipt(null)}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email / Gmail / WhatsApp Staff Credentials Modal */}
      {emailModalStaff && (
        <EmailSendModal
          isOpen={Boolean(emailModalStaff)}
          onClose={() => setEmailModalStaff(null)}
          title="Envoyer les Identifiants Personnel par Email"
          subtitle={`${emailModalStaff.member.firstName} ${emailModalStaff.member.lastName} · ${emailModalStaff.member.role}`}
          recipientOptions={[
            { label: 'Email Pro', email: emailModalStaff.member.email }
          ]}
          defaultSubject={`Identifiants SmartSchool - ${emailModalStaff.member.firstName} ${emailModalStaff.member.lastName} (${emailModalStaff.member.role})`}
          defaultBody={[
            `Bonjour ${emailModalStaff.member.firstName} ${emailModalStaff.member.lastName},`,
            '',
            `Voici vos identifiants d'accès au portail SmartSchool (${currentSchool?.name || 'Établissement'}) en qualité de ${emailModalStaff.member.role} :`,
            `- Matricule : ${emailModalStaff.member.matricule}`,
            `- Identifiant : ${emailModalStaff.member.username || emailModalStaff.member.email}`,
            `- Email de connexion : ${emailModalStaff.member.email}`,
            `- Mot de passe : ${emailModalStaff.password || emailModalStaff.member.temporaryPassword || '(Défini lors de la création)'}`,
            '',
            `Lien de l'application : ${typeof window !== 'undefined' ? window.location.origin : ''}`,
            '',
            'Cordialement,',
            `L'Administration · ${currentSchool?.name || 'SmartSchool'}`
          ].join('\n')}
          whatsappPhone={emailModalStaff.member.phone}
          onDispatched={(channel, recipient) => {
            sendStaffCredentials(emailModalStaff.member.id, channel, recipient);
          }}
        />
      )}
    </div>
  );
};
