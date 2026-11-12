import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolAdmin } from '../../types';
import { 
  Users, 
  Plus, 
  Search, 
  KeyRound, 
  Building2, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  Edit3, 
  Phone, 
  Mail, 
  Check, 
  Copy, 
  X,
  Shuffle,
  LogIn
} from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';

interface SchoolAdminsViewProps {
  onSwitchToSchoolAdmin?: (schoolId: string) => void;
}

export const SchoolAdminsView: React.FC<SchoolAdminsViewProps> = ({ onSwitchToSchoolAdmin }) => {
  const { 
    admins, 
    schools, 
    createAdmin, 
    updateAdmin, 
    suspendAdmin, 
    reactivateAdmin, 
    resetAdminPassword, 
    changeAdminSchool, 
    deleteAdmin, 
    t,
    showToast 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState<SchoolAdmin | null>(null);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+224 ');
  const [schoolId, setSchoolId] = useState('');
  const [avatar, setAvatar] = useState('');

  // Password reset feedback modal
  const [resetModalData, setResetModalData] = useState<{ adminName: string; tempPass: string } | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);

  // Transfer School Modal
  const [transferAdmin, setTransferAdmin] = useState<SchoolAdmin | null>(null);
  const [targetTransferSchoolId, setTargetTransferSchoolId] = useState('');

  const filteredAdmins = admins.filter(a => {
    const matchesSearch = 
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.schoolName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSchool = filterSchool === 'all' || a.schoolId === filterSchool;

    return matchesSearch && matchesSchool;
  });

  const handleOpenCreate = () => {
    setAdminToEdit(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('+224 ');
    setSchoolId(schools[0]?.id || '');
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (admin: SchoolAdmin) => {
    setAdminToEdit(admin);
    setFirstName(admin.firstName);
    setLastName(admin.lastName);
    setEmail(admin.email);
    setPhone(admin.phone);
    setSchoolId(admin.schoolId);
    setAvatar(admin.avatar);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    const selectedSchool = schools.find(s => s.id === schoolId);
    const schoolName = selectedSchool?.name || 'Établissement non assigné';

    if (adminToEdit) {
      updateAdmin(adminToEdit.id, {
        firstName,
        lastName,
        email,
        phone,
        schoolId,
        schoolName,
        avatar
      });
    } else {
      createAdmin({
        firstName,
        lastName,
        email,
        phone,
        schoolId,
        schoolName,
        avatar,
        status: 'active'
      });
    }

    setIsModalOpen(false);
  };

  const handleResetPassword = (admin: SchoolAdmin) => {
    const tempPass = resetAdminPassword(admin.id);
    setResetModalData({
      adminName: `${admin.firstName} ${admin.lastName}`,
      tempPass
    });
  };

  const handleExecuteTransfer = () => {
    if (!transferAdmin || !targetTransferSchoolId) return;
    changeAdminSchool(transferAdmin.id, targetTransferSchoolId);
    setTransferAdmin(null);
  };

  const copyPassword = () => {
    if (!resetModalData) return;
    navigator.clipboard.writeText(resetModalData.tempPass);
    setCopiedPass(true);
    showToast("Mot de passe copié !");
    setTimeout(() => setCopiedPass(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t.admins.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.admins.subtitle}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.admins.createAdmin}</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone ou établissement..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filterSchool}
          onChange={e => setFilterSchool(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tous les établissements ({schools.length})</option>
          {schools.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Admins Table */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Administrateur</th>
                <th className="py-3 px-4">Établissement Rattaché</th>
                <th className="py-3 px-4">Contacts</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Dernière Connexion</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 text-slate-200">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Aucun administrateur d'école trouvé.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-700/30 transition-colors">
                    {/* Admin Avatar & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={admin.avatar}
                          alt={admin.firstName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-600 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-xs">
                            {admin.firstName} {admin.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            ID: {admin.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* School */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-200">
                        <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{admin.schoolName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Tenant: {admin.schoolId}
                      </div>
                    </td>

                    {/* Contacts */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{admin.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{admin.phone}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                        admin.status === 'active' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          admin.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'
                        }`} />
                        {admin.status === 'active' ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {admin.lastLogin}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onSwitchToSchoolAdmin && admin.schoolId && (
                          <button
                            onClick={() => onSwitchToSchoolAdmin(admin.schoolId)}
                            className="p-1.5 text-emerald-400 hover:text-white hover:bg-emerald-600/30 rounded-md transition-colors"
                            title="Se connecter au portail Admin École"
                          >
                            <LogIn className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleResetPassword(admin)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 rounded-md transition-colors"
                          title="Réinitialiser le mot de passe"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setTransferAdmin(admin);
                            setTargetTransferSchoolId(admin.schoolId);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/60 rounded-md transition-colors"
                          title="Changer d'école (Mutation)"
                        >
                          <Shuffle className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(admin)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-md transition-colors"
                          title="Modifier"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {admin.status === 'active' ? (
                          <button
                            onClick={() => suspendAdmin(admin.id)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 rounded-md transition-colors"
                            title="Suspendre"
                          >
                            <PauseCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => reactivateAdmin(admin.id)}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/60 rounded-md transition-colors"
                            title="Réactiver"
                          >
                            <PlayCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm(`Confirmez-vous la suppression du compte de ${admin.firstName} ${admin.lastName} ?`)) {
                              deleteAdmin(admin.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-md transition-colors"
                          title="Supprimer"
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

      {/* Create / Edit Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 shrink-0 bg-slate-900">
              <h2 className="text-base font-bold text-white">
                {adminToEdit ? 'Modifier Admin École' : 'Créer un Admin École'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 text-xs">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Nom de famille *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Téléphone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Établissement scolaire associé *</label>
                  <select
                    value={schoolId}
                    onChange={e => setSchoolId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-blue-500"
                  >
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                    ))}
                  </select>
                </div>

                <ImageUploadField
                  label="Photo / Avatar de l'Administrateur"
                  value={avatar}
                  onChange={setAvatar}
                  aspectRatio="circle"
                  placeholder="https://.../avatar.jpg"
                  helperText="Importez depuis votre PC ou indiquez un lien web."
                />
              </div>

              <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold shadow-md shadow-blue-600/30"
                >
                  {adminToEdit ? 'Enregistrer' : 'Créer l\'administrateur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Notification Modal */}
      {resetModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl bg-slate-900 border border-amber-500/40 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400 pb-3 border-b border-slate-800">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">
                Nouveau Mot de Passe Temporaire
              </h3>
            </div>

            <div className="mt-4 text-xs text-slate-300 space-y-3">
              <p>
                Le mot de passe de l'administrateur <strong className="text-white">{resetModalData.adminName}</strong> a été réinitialisé.
              </p>
              
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-between font-mono text-sm text-emerald-400">
                <span>{resetModalData.tempPass}</span>
                <button
                  onClick={copyPassword}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Copier le mot de passe"
                >
                  {copiedPass ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Transmettez ce mot de passe à l'administrateur. Il sera invité à le changer dès sa prochaine connexion.
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setResetModalData(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
              >
                J'ai noté le mot de passe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer School Modal */}
      {transferAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl bg-slate-900 border border-indigo-500/40 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-indigo-400 pb-3 border-b border-slate-800">
              <Shuffle className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">
                Mutation d'Établissement Scolaire
              </h3>
            </div>

            <div className="mt-4 text-xs text-slate-300 space-y-3">
              <p>
                Transférer l'administrateur <strong className="text-white">{transferAdmin.firstName} {transferAdmin.lastName}</strong> vers un autre établissement :
              </p>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Nouvelle école d'affectation :</label>
                <select
                  value={targetTransferSchoolId}
                  onChange={e => setTargetTransferSchoolId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                >
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setTransferAdmin(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                Annuler
              </button>
              <button
                onClick={handleExecuteTransfer}
                className="px-4 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
              >
                Confirmer la mutation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
