import React, { useState } from 'react';
import { useSupervisor } from '../../context/SupervisorContext';
import { ImageUploadField } from '../common/ImageUploadField';
import { 
  CreditCard, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  ShieldAlert, 
  Edit3, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles 
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const SupervisorBadgeView: React.FC = () => {
  const { profile, updateProfile } = useSupervisor();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(profile.photo);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [roleTitle, setRoleTitle] = useState(profile.roleTitle);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      photo: photoUrl,
      firstName,
      lastName,
      phone,
      address,
      roleTitle
    });
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-red-400" />
            <span>Badge & Carte Professionnelle de Surveillant Général</span>
          </h1>
          <p className="text-xs text-slate-400">
            Carte d'autorité disciplinaire MEPU-A avec QR Code d'identification et protocole de sécurité
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modifier Photo & Infos</span>
          </button>
          <button
            onClick={() => triggerPrint('supervisor-badge-printable-area', `Badge_Surveillant_${profile.firstName}_${profile.lastName}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Carte</span>
          </button>
        </div>
      </div>

      {/* Visual Badge Display (Recto & Verso) */}
      <div id="supervisor-badge-printable-area" className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-2">
        {/* RECTO */}
        <div className="space-y-2">
          <div className="text-xs uppercase font-bold text-slate-400 text-center">Recto - Face Officielle</div>
          <div className="relative w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-slate-900 via-red-950/70 to-slate-900 border-2 border-red-500/40 p-5 shadow-2xl flex flex-col justify-between overflow-hidden text-white">
            {/* Top header */}
            <div className="flex items-center justify-between border-b border-red-500/30 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-sm shadow">
                  S
                </div>
                <div>
                  <div className="font-extrabold text-[12px] tracking-tight leading-none text-white">
                    {profile.schoolName}
                  </div>
                  <div className="text-[9px] text-red-300 font-mono tracking-wider mt-0.5 uppercase">
                    Rép. de Guinée · MEPU-A
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                  Vie Scolaire
                </span>
                <span className="text-[9px] font-mono text-slate-400 mt-0.5">2026 - 2027</span>
              </div>
            </div>

            {/* Badge Body */}
            <div className="flex items-center gap-4 my-auto">
              <div className="relative shrink-0">
                <img 
                  src={profile.photo} 
                  alt={profile.firstName} 
                  className="w-20 h-24 rounded-xl object-cover border-2 border-red-400 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 border-2 border-slate-900 flex items-center justify-center text-white">
                  <ShieldAlert className="w-3 h-3" />
                </div>
              </div>

              <div className="space-y-1 min-w-0">
                <div className="text-xs text-red-400 font-semibold uppercase tracking-wider">
                  {profile.roleTitle}
                </div>
                <div className="text-base font-black text-white leading-tight truncate">
                  {profile.firstName} {profile.lastName}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono font-bold">
                  Matricule : {profile.matricule}
                </div>
                <div className="text-[10px] text-slate-300">
                  Département : {profile.department}
                </div>
                <div className="text-[9px] text-slate-400 truncate">
                  Autorité de discipline & contrôle
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[9px] text-slate-400">
              <span>SmartSchool Security · Homologué MEPU-A</span>
              <span className="font-mono text-red-400">ID: {profile.id}</span>
            </div>

            {/* Tricolor stripe at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />
          </div>
        </div>

        {/* VERSO */}
        <div className="space-y-2">
          <div className="text-xs uppercase font-bold text-slate-400 text-center">Verso - Sécurité & Contacts</div>
          <div className="relative w-full aspect-[1.586/1] rounded-2xl bg-slate-900 border-2 border-slate-700/60 p-5 shadow-2xl flex flex-col justify-between overflow-hidden text-white">
            {/* Magnetic Stripe simulation */}
            <div className="w-full h-8 bg-slate-950 -mx-5 -mt-2 mb-3 border-y border-slate-800 flex items-center px-5">
              <div className="w-full h-2 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 opacity-60" />
            </div>

            {/* Content */}
            <div className="flex items-center justify-between gap-4 my-auto">
              <div className="space-y-1.5 text-[10px] text-slate-300">
                <p className="leading-tight">
                  Cette carte confère à son titulaire le plein pouvoir de contrôle et de surveillance au sein de l'établissement.
                </p>
                <div className="text-slate-400">
                  Téléphone : <strong className="text-white">{profile.phone}</strong>
                </div>
                <div className="text-slate-400">
                  Email : <strong className="text-white">{profile.email}</strong>
                </div>
                <div className="text-slate-400 truncate">
                  Adresse : {profile.address}
                </div>
                <div className="text-[9px] text-amber-300 font-mono">
                  En cas de perte, contacter la Direction des Études.
                </div>
              </div>

              {/* QR Code Specimen */}
              <div className="p-2 rounded-xl bg-white text-slate-950 shrink-0 text-center shadow-lg">
                <QrCode className="w-16 h-16 text-slate-950 mx-auto" />
                <span className="text-[7px] font-mono font-bold block mt-0.5">SCAN MEPU-A</span>
              </div>
            </div>

            {/* Signatures */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[9px] text-slate-400">
              <div>Signature du titulaire</div>
              <div className="text-right">Le Directeur des Études</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Mettre à Jour la Photo & Informations</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <ImageUploadField
                label="Photo professionnelle du Surveillant"
                value={photoUrl}
                onChange={setPhotoUrl}
                helperText="Importez depuis votre PC ou saisissez une URL directe d'image."
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prénom *</label>
                  <input 
                    type="text" 
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nom *</label>
                  <input 
                    type="text" 
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Téléphone *</label>
                <input 
                  type="text" 
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Adresse (Conakry) *</label>
                <input 
                  type="text" 
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Titre de fonction *</label>
                <input 
                  type="text" 
                  required
                  value={roleTitle}
                  onChange={e => setRoleTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Enregistrer & Actualiser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
