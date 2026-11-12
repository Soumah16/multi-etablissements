import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  ShieldCheck, 
  KeyRound, 
  Building, 
  FileSignature, 
  Clock, 
  Smartphone, 
  Check, 
  X,
  Mail,
  Phone,
  MapPin,
  Lock
} from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';

export const SuperAdminProfileView: React.FC = () => {
  const { profile, updateProfile, t, showToast } = useApp();

  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [address, setAddress] = useState(profile.address);
  const [enterprise, setEnterprise] = useState(profile.enterprise);
  const [enterpriseLogo, setEnterpriseLogo] = useState(profile.enterpriseLogo);
  const [signatureUrl, setSignatureUrl] = useState(profile.signatureUrl);

  // Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      title,
      phone,
      email,
      address,
      enterprise,
      enterpriseLogo,
      signatureUrl
    });
    showToast("Profil Super Administrateur mis à jour avec succès !");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      alert("Le mot de passe doit comporter au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast("Mot de passe Super Admin modifié avec succès !");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t.nav.profile}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestion du compte propriétaire, identité d'entreprise et signature électronique
          </p>
        </div>

        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span>Changer mon mot de passe</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card & Signature */}
        <div className="lg:col-span-5 space-y-5">
          {/* Super Admin Card */}
          <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg border-2 border-blue-400">
              {profile.name.charAt(0)}
            </div>

            <h2 className="text-base font-bold text-white mt-3">{profile.name}</h2>
            <div className="text-blue-400 font-mono text-[11px] mt-0.5">{profile.title}</div>
            <div className="text-slate-400 text-[11px] mt-1">{profile.enterprise}</div>

            <div className="w-full mt-4 pt-4 border-t border-slate-700/60 text-left space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{profile.address}</span>
              </div>
            </div>
          </div>

          {/* Electronic Signature Box */}
          <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <FileSignature className="w-4 h-4 text-blue-400" />
                Signature Électronique Certifiée
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Vérifiée</span>
            </div>

            <p className="text-slate-400 text-[11px]">
              Cette signature est apposée automatiquement sur les factures officielles et contrats de licence des écoles.
            </p>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
              <img 
                src={profile.signatureUrl} 
                alt="Signature électronique" 
                className="max-h-16"
              />
            </div>
          </div>

          {/* 2FA Status summary */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-emerald-300">Sécurité 2FA Activée</div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Protection renforcée pour la gestion de l'infrastructure multi-tenant.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form & Connection History */}
        <div className="lg:col-span-7 space-y-5">
          {/* Edit Form */}
          <form onSubmit={handleSaveProfile} className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm pb-2 border-b border-slate-700/60">
              Modifier les Informations du Propriétaire
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Titre professionnel</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Téléphone direct</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Société éditrice (Entreprise propriétaire)</label>
              <input
                type="text"
                value={enterprise}
                onChange={e => setEnterprise(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Adresse du siège social</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-700/60 space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                Visuels & Signature Officielle
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploadField
                  label="Logo Entreprise Éditrice"
                  value={enterpriseLogo}
                  onChange={setEnterpriseLogo}
                  aspectRatio="square"
                  placeholder="https://.../logo.png"
                  helperText="Importez depuis votre PC ou entrez une URL."
                />

                <ImageUploadField
                  label="Signature Électronique Certifiée"
                  value={signatureUrl}
                  onChange={setSignatureUrl}
                  aspectRatio="banner"
                  placeholder="https://.../signature.png"
                  helperText="Apposée sur les factures et reçus de licence."
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/60 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors text-xs"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer le Profil</span>
              </button>
            </div>
          </form>

          {/* Login History */}
          <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <h3 className="font-bold text-white text-sm pb-2 border-b border-slate-700/60 flex items-center justify-between">
              <span>Historique Récent des Connexions Super Admin</span>
              <span className="text-[11px] text-slate-400 font-normal">Audit de sécurité</span>
            </h3>

            <div className="divide-y divide-slate-700/40 mt-2">
              {profile.loginHistory.map((lh) => (
                <div key={lh.id} className="py-2.5 flex items-center justify-between gap-3 text-[11px]">
                  <div>
                    <div className="font-medium text-slate-200">{lh.device}</div>
                    <div className="text-slate-400 text-[10px] flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-slate-300">{lh.ip}</span>
                      <span>·</span>
                      <span>{lh.location}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      lh.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {lh.status === 'success' ? 'Succès (2FA)' : 'Échec (Bloqué)'}
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{lh.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Changer le Mot de Passe Super Admin
              </h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="mt-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Mot de passe actuel</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Nouveau mot de passe (8+ caractères)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white rounded bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded"
                >
                  Mettre à jour le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
