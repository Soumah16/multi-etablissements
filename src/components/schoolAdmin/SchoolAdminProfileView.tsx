import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import {
  getAccountByRole,
  normalizeSchoolId,
  updateAccountPassword
} from '../../data/accountsData';
import { verifySaltedPasswordHash } from '../../utils/passwordCrypto';
import { propagateSchoolAdminChange, syncCurrentUserSession } from '../../utils/accountSync';
import { recordGlobalAuditLog } from '../../utils/auditLogger';
import { ImageUploadField } from '../common/ImageUploadField';
import {
  Building2,
  Check,
  KeyRound,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  X
} from 'lucide-react';

export const SchoolAdminProfileView: React.FC = () => {
  const { admins, updateAdmin, showToast } = useApp();
  const { currentSchool } = useSchoolAdmin();

  const assignedAdmin = admins.find(
    a => normalizeSchoolId(a.schoolId) === normalizeSchoolId(currentSchool.id)
  );
  const storedAccount = getAccountByRole('school_admin', currentSchool.id);

  const initialFirstName = assignedAdmin?.firstName || storedAccount?.firstName || 'Admin';
  const initialLastName = assignedAdmin?.lastName || storedAccount?.lastName || 'École';
  const initialEmail = assignedAdmin?.email || storedAccount?.email || currentSchool.email || '';
  const initialPhone = assignedAdmin?.phone || storedAccount?.phone || currentSchool.phone || '';
  const initialAvatar = assignedAdmin?.avatar || storedAccount?.photo || '';

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [avatar, setAvatar] = useState(initialAvatar);

  // Password Change Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    setFirstName(assignedAdmin?.firstName || storedAccount?.firstName || 'Admin');
    setLastName(assignedAdmin?.lastName || storedAccount?.lastName || 'École');
    setEmail(assignedAdmin?.email || storedAccount?.email || currentSchool.email || '');
    setPhone(assignedAdmin?.phone || storedAccount?.phone || currentSchool.phone || '');
    setAvatar(assignedAdmin?.avatar || storedAccount?.photo || '');
  }, [
    assignedAdmin?.id,
    assignedAdmin?.firstName,
    assignedAdmin?.lastName,
    assignedAdmin?.email,
    assignedAdmin?.phone,
    assignedAdmin?.avatar,
    storedAccount?.firstName,
    storedAccount?.lastName,
    storedAccount?.email,
    storedAccount?.phone,
    storedAccount?.photo,
    currentSchool.id,
    currentSchool.email,
    currentSchool.phone
  ]);

  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'Admin École';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanFirst || !cleanLast || !cleanEmail) {
      showToast('Prénom, nom et email sont obligatoires.');
      return;
    }

    const oldEmail = assignedAdmin?.email || storedAccount?.email || cleanEmail;

    if (assignedAdmin) {
      updateAdmin(assignedAdmin.id, {
        firstName: cleanFirst,
        lastName: cleanLast,
        email: cleanEmail,
        phone: cleanPhone,
        avatar
      });
    } else {
      propagateSchoolAdminChange({
        oldEmail,
        oldSchoolId: currentSchool.id,
        admin: {
          id: storedAccount?.id || `adm-${Date.now()}`,
          schoolId: currentSchool.id,
          schoolName: currentSchool.name,
          firstName: cleanFirst,
          lastName: cleanLast,
          email: cleanEmail,
          phone: cleanPhone,
          avatar,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: new Date().toISOString().split('T')[0]
        }
      });
    }

    syncCurrentUserSession(
      { role: 'school_admin', email: oldEmail, ecoleId: currentSchool.id },
      {
        name: `${cleanFirst} ${cleanLast}`.trim(),
        email: cleanEmail,
        schoolName: currentSchool.name,
        ...(avatar ? { photo: avatar } : {})
      }
    );

    recordGlobalAuditLog({
      action: `Modification du profil Admin École (${cleanFirst} ${cleanLast})`,
      actorName: `${cleanFirst} ${cleanLast}`,
      actorRole: 'school_admin',
      schoolName: currentSchool.name,
      target: `${currentSchool.name} (${cleanEmail})`,
      type: 'admin',
      severity: 'info',
      operation: 'update'
    });

    showToast('Profil Admin École enregistré et synchronisé sur tout le site !');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    const acc = getAccountByRole('school_admin', currentSchool.id);
    const expectedPlain = String(acc?.plainPassword || acc?.password || '');
    const currentMatches =
      !acc ||
      (acc.passwordHash && verifySaltedPasswordHash(currentPassword.trim(), acc.passwordHash)) ||
      (expectedPlain && currentPassword.trim() === expectedPlain.trim());

    if (!currentMatches) {
      setPasswordError('Le mot de passe actuel est incorrect.');
      showToast('Le mot de passe actuel est incorrect.');
      return;
    }
    if (newPassword.trim().length < 8) {
      setPasswordError('Le nouveau mot de passe doit comporter au moins 8 caractères.');
      showToast('Mot de passe trop court (8 caractères minimum).');
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setPasswordError('Les deux mots de passe ne correspondent pas.');
      showToast('Confirmation de mot de passe différente.');
      return;
    }

    updateAccountPassword(
      {
        id: acc?.id,
        role: 'school_admin',
        email: email.trim() || assignedAdmin?.email || acc?.email,
        matricule: acc?.matricule
      },
      newPassword.trim(),
      false
    );

    if (assignedAdmin && assignedAdmin.passwordResetRequired) {
      updateAdmin(assignedAdmin.id, { passwordResetRequired: false });
    }

    recordGlobalAuditLog({
      action: `Modification du mot de passe Admin École (${fullName})`,
      actorName: fullName,
      actorRole: 'school_admin',
      schoolName: currentSchool.name,
      target: email.trim() || currentSchool.name,
      type: 'securite',
      severity: 'warning'
    });

    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Mot de passe Admin École modifié et synchronisé avec succès !');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>Mon Profil Admin École</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Modifiez vos informations personnelles, votre photo et votre mot de passe · Changements visibles instantanément dans tout l'établissement et chez le Super Admin
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPasswordModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto shadow-xs cursor-pointer"
        >
          <KeyRound className="w-4 h-4 text-amber-600" />
          <span>Changer mon mot de passe</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Summary Card */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-white border border-blue-100 text-xs text-center flex flex-col items-center shadow-xs">
            {avatar ? (
              <img
                src={avatar}
                alt={fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-400 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-emerald-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg border-4 border-emerald-200">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}

            <h2 className="text-base font-bold text-blue-950 mt-3">{fullName}</h2>
            <div className="text-emerald-700 font-mono text-[11px] font-semibold mt-0.5">
              {storedAccount?.title || 'Admin École (Fondateur)'}
            </div>
            {storedAccount?.matricule && (
              <div className="mt-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100 font-mono text-[10px]">
                Matricule : {storedAccount.matricule}
              </div>
            )}

            <div className="w-full mt-5 pt-4 border-t border-blue-100 text-left space-y-2.5 text-slate-700">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-semibold text-blue-950">{currentSchool.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{email || 'Non renseigné'}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{phone || 'Non renseigné'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-semibold text-emerald-800">Synchronisation Temps Réel Active</div>
              <div className="text-[11px] text-slate-700 mt-0.5">
                Toute modification de votre nom, email, téléphone ou photo met automatiquement à jour vos identifiants de connexion et la vue globale.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-white border border-blue-100 space-y-4 text-xs shadow-xs">
            <h3 className="font-bold text-blue-950 text-sm pb-2 border-b border-blue-100">
              Modifier mes Informations Personnelles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Prénom *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Nom de famille *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Email de connexion *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Téléphone direct</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+224 6XX XX XX XX"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <ImageUploadField
              label="Photo de Profil Admin École"
              value={avatar}
              onChange={setAvatar}
              aspectRatio="square"
              placeholder="https://.../photo.jpg"
              helperText="Importez une photo depuis votre appareil ou collez un lien d'image."
            />

            <div className="pt-3 border-t border-blue-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors text-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer Mon Profil</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl bg-white border border-slate-200 shadow-2xl p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Changer mon Mot de Passe Admin École</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-500 hover:text-blue-950 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="mt-4 space-y-3.5 text-xs">
              {passwordError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                  {passwordError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Mot de passe actuel *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Nouveau mot de passe (8+ caractères) *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Confirmer le nouveau mot de passe *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                />
              </div>

              <div className="pt-3 border-t border-blue-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-blue-950 rounded-lg bg-slate-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
