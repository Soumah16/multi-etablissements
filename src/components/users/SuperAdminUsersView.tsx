import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DemoAccount, 
  getStoredAccounts, 
  saveStoredAccounts, 
  getIconForRole, 
  getBadgeColorForRole, 
  getCategoryForRole,
  DEMO_ACCOUNTS
} from '../../data/accountsData';
import { WorkspaceMode } from '../../App';
import { 
  UserCheck, 
  UserPlus, 
  Search, 
  Filter, 
  Printer, 
  ShieldCheck, 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  QrCode, 
  Building2, 
  Trash2, 
  RotateCcw, 
  Lock, 
  Sparkles, 
  X, 
  ExternalLink,
  Download,
  AlertCircle
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

interface SuperAdminUsersViewProps {
  onSwitchToUser?: (user: any) => void;
}

export const SuperAdminUsersView: React.FC<SuperAdminUsersViewProps> = ({ onSwitchToUser }) => {
  const { schools, showToast, addLog } = useApp();
  const [accounts, setAccounts] = useState<DemoAccount[]>(() => getStoredAccounts());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showMasterPasswordsModal, setShowMasterPasswordsModal] = useState(false);
  const [showAllPasswordsInline, setShowAllPasswordsInline] = useState(false);
  const [selectedAccountForSlip, setSelectedAccountForSlip] = useState<DemoAccount | null>(null);
  const [passwordResetAccount, setPasswordResetAccount] = useState<DemoAccount | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<{ [email: string]: boolean }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New account form state
  const [newRole, setNewRole] = useState<WorkspaceMode>('teacher');
  const [newSchoolName, setNewSchoolName] = useState<string>(schools[0]?.name || "Lycée d'Excellence de Conakry");
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMatricule, setNewMatricule] = useState('');
  const [newPassword, setNewPassword] = useState('SmartPass2026!');
  const [newPhoto, setNewPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200');

  // Auto-generate matricule and email suggestion when role or names change
  useEffect(() => {
    const rolePrefixes: Record<WorkspaceMode, string> = {
      super_admin: 'SADM-GN',
      school_admin: 'ADM-EXC',
      director: 'DIR-EXC-2026',
      secretary: 'SEC-EXC-2026',
      teacher: 'ENS-EXC-2026',
      supervisor: 'SURV-EXC-2026',
      accountant: 'CPT-EXC-2026',
      librarian: 'BIB-EXC-2026',
      parent: 'PAR-2026',
      student: 'MAT-2026-TSM'
    };

    const randomNum = Math.floor(100 + Math.random() * 900);
    const prefix = rolePrefixes[newRole] || 'USR-2026';
    setNewMatricule(`${prefix}-${randomNum}`);

    if (newFirstName && newLastName) {
      const cleanFirst = newFirstName.toLowerCase().replace(/[^a-z]/g, '');
      const cleanLast = newLastName.toLowerCase().replace(/[^a-z]/g, '');
      setNewEmail(`${cleanFirst}.${cleanLast}@smartschool.gn`);
    }
  }, [newRole, newFirstName, newLastName]);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName || !newLastName || !newEmail) {
      if (showToast) showToast('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const fullName = `${newFirstName.trim()} ${newLastName.trim()}`;
    const roleTitles: Record<WorkspaceMode, string> = {
      super_admin: 'Super Administrateur Global',
      school_admin: 'Admin École (Fondateur)',
      director: 'Directeur des Études',
      secretary: 'Secrétaire Générale',
      teacher: 'Enseignant Titulaire',
      supervisor: 'Surveillant Général',
      accountant: 'Chef Comptable',
      librarian: 'Bibliothécaire',
      parent: 'Espace Parent (Tuteur)',
      student: 'Espace Élève (Apprenant)'
    };

    const newAcc: DemoAccount = {
      id: `USR-${Date.now()}`,
      ecoleId: (schools.find(s => s.name === newSchoolName)?.id || 'ECOLE-001'),
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      phone: '+224 620 00 00 00',
      role: newRole,
      title: roleTitles[newRole] || 'Utilisateur',
      name: fullName,
      email: newEmail.trim().toLowerCase(),
      matricule: newMatricule.trim().toUpperCase(),
      schoolName: newSchoolName,
      password: newPassword,
      plainPassword: newPassword,
      status: 'actif',
      mustChangePassword: true,
      failedLoginAttempts: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      badgeNumber: `BDG-${newMatricule.replace(/[^A-Z0-9]/g, '')}`,
      nationalUid: `GN-MEPUA-${newMatricule.replace(/[^A-Z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      permissions: [],
      category: getCategoryForRole(newRole),
      badgeColor: getBadgeColorForRole(newRole),
      icon: getIconForRole(newRole),
      description: `Compte officiel délivré par le Super Administrateur Global pour ${fullName}.`,
      photo: newPhoto,
      provisionedBy: 'Super Administrateur Global (Console Centrale)',
      permissionsSummary: `Accès habilité au portail ${roleTitles[newRole]} pour l'établissement ${newSchoolName}`
    };

    const updated = [newAcc, ...accounts];
    setAccounts(updated);
    saveStoredAccounts(updated);

    setIsCreateModalOpen(false);
    setSelectedAccountForSlip(newAcc);
    if (showToast) {
      showToast(`Compte créé avec succès pour ${fullName} ! Fiche d'accès générée.`);
    }
    if (addLog) {
      addLog(`Création du compte [${newAcc.matricule}] pour ${fullName} (${newAcc.title})`, newAcc.schoolName, 'admin', 'info');
    }

    // Reset inputs
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetAccount || !newPasswordValue.trim()) return;

    const updated = accounts.map(a => {
      if (a.email === passwordResetAccount.email) {
        return { 
          ...a, 
          password: newPasswordValue.trim(),
          plainPassword: newPasswordValue.trim(),
          mustChangePassword: true 
        };
      }
      return a;
    });

    setAccounts(updated);
    saveStoredAccounts(updated);
    if (showToast) {
      showToast(`Mot de passe réinitialisé pour ${passwordResetAccount.name}.`);
    }
    if (addLog) {
      addLog(`Réinitialisation du mot de passe pour ${passwordResetAccount.name} (${passwordResetAccount.matricule})`, passwordResetAccount.schoolName, 'securite', 'warning');
    }
    setPasswordResetAccount(null);
    setNewPasswordValue('');
  };

  const handleDeleteAccount = (accToDelete: DemoAccount) => {
    if (accToDelete.role === 'super_admin' && accToDelete.email === 'superadmin@smartschool.gn') {
      if (showToast) showToast('Impossible de supprimer le compte Super Admin Maître.');
      return;
    }

    if (confirm(`Confirmez-vous la révocation et la suppression du compte de ${accToDelete.name} (${accToDelete.role}) ?`)) {
      const updated = accounts.filter(a => a.email !== accToDelete.email);
      setAccounts(updated);
      saveStoredAccounts(updated);
      if (showToast) showToast(`Compte de ${accToDelete.name} supprimé avec succès.`);
      if (addLog) {
        addLog(`Révocation & Suppression définitive du compte [${accToDelete.matricule}] ${accToDelete.name}`, accToDelete.schoolName, 'securite', 'critical');
      }
    }
  };

  const exportAllAccountsCsv = () => {
    const headers = ['Nom', 'Prénom', 'Rôle', 'Matricule', 'Email', 'Mot de passe Initial', 'Établissement', 'Statut'];
    const rows = accounts.map(a => [
      `"${a.lastName || ''}"`,
      `"${a.firstName || ''}"`,
      `"${a.role}"`,
      `"${a.matricule}"`,
      `"${a.email}"`,
      `"${a.plainPassword || a.password || 'Smart@2026'}"`,
      `"${a.schoolName}"`,
      `"${a.status}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registre_comptes_mots_de_passe_smartschool_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast('Exportation CSV des comptes et mots de passe réussie !');
    if (addLog) {
      addLog('Exportation CSV du registre confidentiel de tous les comptes et mots de passe', 'Direction Nationale MEPU-A', 'securite', 'warning');
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const togglePasswordVisibility = (email: string) => {
    setVisiblePasswords(prev => ({ ...prev, [email]: !prev[email] }));
  };

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = 
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || acc.role === roleFilter;
    const matchesSchool = schoolFilter === 'all' || acc.schoolName === schoolFilter;

    return matchesSearch && matchesRole && matchesSchool;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-blue-100 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Autorité Centrale d'Authentification MEPU-A
            </span>
            <span className="text-xs text-slate-500">Gouvernance Super Admin</span>
          </div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
            <span>Gestion des Comptes & Authentification</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Conformément aux directives de sécurité, l'ensemble des comptes (Directeurs, Secrétaires, Enseignants, Surveillants, Comptables, Bibliothécaires, Parents, Élèves et Admins) sont exclusivement créés et habilités par le Super Administrateur.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowMasterPasswordsModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-50 border border-amber-200 transition-colors shadow-xs cursor-pointer"
            title="Consulter et exporter la liste intégrale des comptes et mots de passe"
          >
            <Key className="w-4 h-4 text-amber-700" />
            <span>Liste de Tous les Comptes & Mots de Passe</span>
          </button>

          <button
            type="button"
            onClick={exportAllAccountsCsv}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-slate-50 hover:bg-blue-100 border border-slate-200 transition-colors shadow-xs cursor-pointer"
            title="Télécharger fichier CSV complet"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={() => triggerPrint('master-users-list-printable', 'Registre_National_Comptes_Utilisateurs')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-slate-50 hover:bg-blue-100 border border-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Imprimer</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Créer un Compte</span>
          </button>
        </div>
      </div>

      {/* Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Comptes Enregistrés</div>
          <div className="text-2xl font-black text-blue-950 mt-1 font-mono">{accounts.length}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">100% Vérifiés & Actifs</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Directeurs & Secrétariat</div>
          <div className="text-2xl font-black text-amber-700 mt-1 font-mono">
            {accounts.filter(a => a.role === 'director' || a.role === 'secretary' || a.role === 'school_admin').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Administration souveraine</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Corps Enseignant & Vie Scolaire</div>
          <div className="text-2xl font-black text-indigo-600 mt-1 font-mono">
            {accounts.filter(a => a.role === 'teacher' || a.role === 'supervisor' || a.role === 'librarian').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Pédagogie & Encadrement</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Parents & Élèves</div>
          <div className="text-2xl font-black text-pink-600 mt-1 font-mono">
            {accounts.filter(a => a.role === 'parent' || a.role === 'student').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Portails Famille & Apprenant</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white border border-blue-100">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, email, matricule..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Rôle :</span>
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 focus:outline-hidden focus:border-blue-500"
          >
            <option value="all">Tous les Rôles ({accounts.length})</option>
            <option value="super_admin">Super Administrateurs</option>
            <option value="school_admin">Admins Écoles (Fondateurs)</option>
            <option value="director">Directeurs des Études</option>
            <option value="secretary">Secrétaires Générales</option>
            <option value="teacher">Enseignants Titulaires</option>
            <option value="supervisor">Surveillants Généraux</option>
            <option value="accountant">Chefs Comptables</option>
            <option value="librarian">Bibliothécaires</option>
            <option value="parent">Parents d'Élèves</option>
            <option value="student">Élèves (Apprenants)</option>
          </select>

          <select
            value={schoolFilter}
            onChange={e => setSchoolFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-950 focus:outline-hidden focus:border-blue-500 max-w-[200px]"
          >
            <option value="all">Toutes les Écoles</option>
            {schools.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Master Users Register Table */}
      <div id="master-users-list-printable" className="rounded-2xl border border-blue-100 bg-white overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-50/70 text-slate-500 uppercase text-[10px] tracking-wider border-b border-blue-100">
              <tr>
                <th className="py-3 px-4">Utilisateur & Rôle</th>
                <th className="py-3 px-3">Matricule Officiel</th>
                <th className="py-3 px-3">Établissement</th>
                <th className="py-3 px-3">Identifiant / Email</th>
                <th className="py-3 px-3">Mot de Passe & Accès</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-4 text-right">Actions Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredAccounts.map((acc, idx) => {
                const IconComponent = acc.icon || getIconForRole(acc.role);
                const isPasswordShown = !!visiblePasswords[acc.email];

                return (
                  <tr key={`${acc.email}-${idx}`} className="hover:bg-blue-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={acc.photo} 
                          alt="" 
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-blue-950 text-xs truncate flex items-center gap-1.5">
                            <span>{acc.name}</span>
                          </div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border mt-0.5 ${acc.badgeColor}`}>
                            {acc.title}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {acc.matricule}
                    </td>

                    <td className="py-3 px-3 text-slate-700">
                      <div className="truncate max-w-[180px]" title={acc.schoolName}>
                        {acc.schoolName}
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans">Délivré par Super Admin</div>
                    </td>

                    <td className="py-3 px-3 text-slate-700">
                      <div className="font-mono text-[11px] text-blue-600">{acc.email}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="bg-[#F0F5FA] px-2 py-1 rounded border border-blue-100 text-slate-900">
                          {isPasswordShown ? acc.password : '••••••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(acc.email)}
                          className="p-1 text-slate-500 hover:text-blue-950 rounded hover:bg-blue-50 transition-colors"
                          title={isPasswordShown ? "Masquer" : "Afficher"}
                        >
                          {isPasswordShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleCopy(acc.password, `pass-${acc.email}`)}
                          className="p-1 text-slate-500 hover:text-blue-950 rounded hover:bg-blue-50 transition-colors"
                          title="Copier le mot de passe"
                        >
                          {copiedKey === `pass-${acc.email}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Actif
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Imprimer Fiche d'Accès Officielle */}
                        <button
                          onClick={() => setSelectedAccountForSlip(acc)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-50 border border-amber-200 transition-colors cursor-pointer"
                          title="Imprimer la Fiche d'Accès & Identifiants Officiels"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-700" />
                          <span>Fiche d'Accès</span>
                        </button>

                        {/* Réinitialiser Mot de passe */}
                        <button
                          onClick={() => {
                            setPasswordResetAccount(acc);
                            setNewPasswordValue('');
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-950 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Réinitialiser le mot de passe"
                        >
                          <Key className="w-3.5 h-3.5 text-blue-600" />
                        </button>

                        {/* Supprimer (si non maître) */}
                        {acc.email !== 'superadmin@smartschool.gn' && (
                          <button
                            onClick={() => handleDeleteAccount(acc)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Révoquer et supprimer ce compte"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Créer un Compte Utilisateur */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-blue-950">
                  Création d'un Compte Utilisateur
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-500 hover:text-blue-950 rounded-lg hover:bg-blue-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs">
                <strong>Habilitation Super Admin :</strong> Ce compte sera immédiatement actif et enregistré dans la base des utilisateurs. Une fiche d'accès officielle imprimable avec QR Code sera automatiquement générée.
              </div>

              {/* Rôle */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Rôle et Niveau d'Habilitation *</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as WorkspaceMode)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-medium"
                >
                  <option value="director">Directeur des Études (Pédagogie & Validation Examens)</option>
                  <option value="secretary">Secrétaire Générale (Inscriptions & Dossiers)</option>
                  <option value="teacher">Enseignant Titulaire (Cahier de textes & Notes)</option>
                  <option value="supervisor">Surveillant Général (Vie Scolaire & Discipline)</option>
                  <option value="accountant">Chef Comptable (Finances GNF & Reçus)</option>
                  <option value="librarian">Bibliothécaire (Livres & Médiathèque Numérique)</option>
                  <option value="parent">Espace Parent (Consultation & Mobile Money)</option>
                  <option value="student">Espace Élève (Devoirs, Notes & Bibliothèque)</option>
                  <option value="school_admin">Admin École (Fondateur)</option>
                  <option value="super_admin">Super Administrateur Global</option>
                </select>
              </div>

              {/* Établissement */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Établissement Scolaire Assigné *</label>
                <select
                  value={newSchoolName}
                  onChange={e => setNewSchoolName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-medium"
                >
                  {schools.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.city})</option>
                  ))}
                </select>
              </div>

              {/* Nom & Prénom */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={e => setNewFirstName(e.target.value)}
                    placeholder="ex. Mariama"
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nom de Famille *</label>
                  <input
                    type="text"
                    required
                    value={newLastName}
                    onChange={e => setNewLastName(e.target.value)}
                    placeholder="ex. Camara"
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                  />
                </div>
              </div>

              {/* Email & Matricule */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email / Identifiant *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="m.camara@smartschool.gn"
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Matricule Officiel (Auto-Généré) *</label>
                  <input
                    type="text"
                    required
                    value={newMatricule}
                    onChange={e => setNewMatricule(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-amber-700 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Mot de Passe Temporaire */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-semibold">Mot de Passe Initial *</label>
                  <button
                    type="button"
                    onClick={() => {
                      const pass = `Smart${Math.floor(1000 + Math.random() * 9000)}!`;
                      setNewPassword(pass);
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-700 underline cursor-pointer"
                  >
                    Générer un mot de passe aléatoire
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-blue-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-50 text-slate-700 hover:text-blue-950"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer & Générer la Fiche</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Fiche d'Accès Officielle Imprimable */}
      {selectedAccountForSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header controls */}
            <div className="p-4 bg-blue-50/60 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-700" />
                <h3 className="text-sm font-bold text-blue-950">
                  Fiche d'Accès Officielle & Identifiants · {selectedAccountForSlip.matricule}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerPrint('official-credential-slip-printable', `Fiche_Acces_${selectedAccountForSlip.matricule}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer la Fiche A4</span>
                </button>
                <button
                  onClick={() => setSelectedAccountForSlip(null)}
                  className="p-1.5 text-slate-500 hover:text-blue-950 rounded-lg hover:bg-blue-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Paper */}
            <div id="official-credential-slip-printable" className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 font-sans space-y-6 select-none print:p-0 print:border-none">
              {/* Republic Header */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-700">
                    RÉPUBLIQUE DE GUINÉE
                  </div>
                  <div className="text-[9px] font-semibold text-amber-700 italic">
                    Travail - Justice - Solidarité
                  </div>
                  <div className="text-[11px] font-bold text-slate-900 uppercase mt-1">
                    Ministère de l'Enseignement Pré-Universitaire et de l'Alphabétisation (MEPU-A)
                  </div>
                  <div className="text-base font-black text-blue-900 tracking-tight mt-1">
                    {selectedAccountForSlip.schoolName}
                  </div>
                  <div className="text-[10px] text-slate-600 font-mono">
                    Direction Générale · SmartSchool ERP Guinée
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block px-3 py-1 rounded bg-blue-100 text-blue-900 font-mono font-bold text-xs border border-blue-300">
                    FICHE D'ACCÈS N° {selectedAccountForSlip.matricule}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Date d'émission : {new Date().toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center py-2 bg-slate-100 border border-slate-300 rounded-lg">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  NOTIFICATION OFFICIELLE DE CRÉATION DE COMPTE & PARAMÈTRES D'ACCÈS
                </h2>
                <div className="text-[11px] text-slate-600">
                  Délivré par le Super Administrateur Global pour usage strictement personnel
                </div>
              </div>

              {/* User Identity Details */}
              <div className="flex items-center gap-6 p-4 rounded-xl border border-slate-300 bg-slate-50">
                <img 
                  src={selectedAccountForSlip.photo} 
                  alt="" 
                  className="w-20 h-24 rounded-lg object-cover border-2 border-slate-400 shadow-sm shrink-0" 
                />
                <div className="space-y-1 text-xs">
                  <div>Nom & Prénom : <strong className="text-slate-900 text-sm">{selectedAccountForSlip.name}</strong></div>
                  <div>Rôle Habilité : <strong className="text-blue-900">{selectedAccountForSlip.title}</strong></div>
                  <div>Matricule National : <strong className="font-mono text-amber-800">{selectedAccountForSlip.matricule}</strong></div>
                  <div>Établissement : <span className="font-semibold">{selectedAccountForSlip.schoolName}</span></div>
                  <div>Délivré par : <span className="text-slate-600">{selectedAccountForSlip.provisionedBy}</span></div>
                </div>
              </div>

              {/* Credentials Zone */}
              <div className="p-4 rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/60 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-700" />
                  <span>Paramètres de Première Connexion</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-white rounded-lg border border-blue-200">
                    <span className="text-[10px] text-slate-500 block">Identifiant / Email de Connexion :</span>
                    <strong className="text-slate-900 text-sm select-all">{selectedAccountForSlip.email}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-blue-200">
                    <span className="text-[10px] text-slate-500 block">Mot de Passe Initial / Clé :</span>
                    <strong className="text-blue-700 text-sm select-all">{selectedAccountForSlip.password}</strong>
                  </div>
                </div>

                <div className="text-[10px] text-slate-600 leading-tight">
                  ⚠️ <strong>Consigne de sécurité MEPU-A :</strong> Ce mot de passe est strictement confidentiel. Il vous sera demandé de le modifier dès votre première session. Ne le communiquez à aucun tiers.
                </div>
              </div>

              {/* QR Code Quick Login */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <div className="space-y-1 max-w-sm">
                  <strong className="text-slate-900 block">Accès Instantané par QR Code :</strong>
                  <p className="text-[11px] text-slate-600">
                    Vous pouvez également présenter ce QR Code sur le portail d'identification SmartSchool ERP pour une authentification automatique sans saisie manuelle.
                  </p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-300 text-center">
                  <QrCode className="w-16 h-16 text-slate-900" />
                  <span className="text-[8px] font-mono text-slate-500">AUTH-{selectedAccountForSlip.matricule}</span>
                </div>
              </div>

              {/* Signatures & Stamps */}
              <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 text-center text-xs">
                <div className="space-y-12">
                  <div className="font-bold text-slate-700 uppercase text-[10px]">
                    Le Titulaire du Compte (Signature)
                  </div>
                  <div className="text-[10px] text-slate-500 italic">Lu et approuvé</div>
                </div>

                <div className="space-y-12">
                  <div className="font-bold text-slate-900 uppercase text-[10px]">
                    Le Super Administrateur Global (Cachet Officiel)
                  </div>
                  <div className="font-mono text-emerald-800 text-[10px] font-bold">
                    [SCEAU NUMÉRIQUE MEPU-A CERTIFIÉ]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Réinitialisation du mot de passe */}
      {passwordResetAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" />
                <span>Réinitialiser le Mot de Passe</span>
              </h3>
              <button onClick={() => setPasswordResetAccount(null)} className="text-slate-500 hover:text-blue-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-700">
              Utilisateur : <strong className="text-blue-950">{passwordResetAccount.name}</strong> ({passwordResetAccount.title})
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nouveau mot de passe *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newPasswordValue}
                    onChange={e => setNewPasswordValue(e.target.value)}
                    placeholder="Saisissez ou générez un mot de passe..."
                    className="flex-1 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPasswordValue(`Smart${Math.floor(1000 + Math.random() * 9000)}!`)}
                    className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold"
                  >
                    Générer
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordResetAccount(null)}
                  className="px-3 py-2 rounded-lg bg-slate-50 text-slate-700 hover:text-blue-950"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-xs cursor-pointer"
                >
                  Valider le nouveau mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Liste Complète de Tous les Comptes & Mots de Passe */}
      {showMasterPasswordsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-blue-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
                  <Key className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-blue-950">
                      Répertoire des Comptes & Mots de Passe
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-mono font-bold border border-amber-200">
                      SUPER ADMIN CONFIDENTIEL
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {accounts.length} comptes enregistrés avec leurs identifiants de connexion et mots de passe.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportAllAccountsCsv}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-100 text-xs font-semibold text-slate-900 border border-slate-200 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Exporter CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMasterPasswordsModal(false)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-blue-950 hover:bg-blue-50 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Table of all accounts */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Avis de sécurité ministériel :</strong> Ce registre contient les identifiants et mots de passe d'accès initiaux. Toute modification ou réinitialisation effectuée est tracée dans le journal d'audit de sécurité.
                </span>
              </div>

              <div className="rounded-2xl border border-blue-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F0F5FA] text-slate-500 uppercase text-[10px] font-mono border-b border-blue-100">
                      <tr>
                        <th className="p-3">Utilisateur / Fonction</th>
                        <th className="p-3">Rôle</th>
                        <th className="p-3">Établissement</th>
                        <th className="p-3">Identifiant / Email</th>
                        <th className="p-3">Matricule</th>
                        <th className="p-3 text-amber-700">Mot de Passe</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100 bg-white/90 font-sans">
                      {accounts.map(acc => {
                        const pass = acc.plainPassword || acc.password || 'Smart@2026';
                        return (
                          <tr key={acc.id} className="hover:bg-blue-50 transition-colors">
                            <td className="p-3">
                              <div className="font-bold text-blue-950 text-xs">{acc.name}</div>
                              <div className="text-[10px] text-slate-500">{acc.title}</div>
                            </td>
                            <td className="p-3">
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">
                                {acc.role}
                              </span>
                            </td>
                            <td className="p-3 text-slate-700 text-xs">
                              {acc.schoolName}
                            </td>
                            <td className="p-3 font-mono text-[11px] text-blue-700">
                              {acc.email}
                            </td>
                            <td className="p-3 font-mono text-[11px] text-slate-500">
                              {acc.matricule}
                            </td>
                            <td className="p-3 font-mono text-xs text-amber-700 font-bold bg-amber-50">
                              <code>{pass}</code>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleCopy(pass, `pass-${acc.id}`)}
                                className="px-2 py-1 rounded bg-slate-50 hover:bg-blue-100 text-slate-700 text-[10px] font-semibold border border-slate-200 cursor-pointer inline-flex items-center gap-1"
                              >
                                {copiedKey === `pass-${acc.id}` ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-600">Copié</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copier</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-blue-100 bg-white flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-mono">
                Total : {accounts.length} comptes certifiés MEPU-A
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportAllAccountsCsv}
                  className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-blue-100 text-slate-900 text-xs font-bold border border-slate-200 cursor-pointer sm:hidden"
                >
                  Télécharger CSV
                </button>
                <button
                  type="button"
                  onClick={() => setShowMasterPasswordsModal(false)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
