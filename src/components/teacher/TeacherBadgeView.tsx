import React, { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { ImageUploadField } from '../common/ImageUploadField';
import { 
  CreditCard, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  Edit3, 
  GraduationCap, 
  CheckCircle2, 
  Download 
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const TeacherBadgeView: React.FC = () => {
  const { profile, updateProfile } = useTeacher();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(profile.photo);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [phone, setPhone] = useState(profile.phone);
  const [specialty, setSpecialty] = useState(profile.specialty);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      photo: photoUrl,
      firstName,
      lastName,
      phone,
      specialty
    });
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-blue-600 shrink-0" />
            <span>Badge & Carte Professionnelle Enseignant ISO-7810</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Carte d'accréditation officielle MEPU-A avec QR Code biométrique et signature
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modifier la photo / infos</span>
          </button>
          <button
            onClick={() => triggerPrint('teacher-badge-printable-area', `Badge_Enseignant_${profile.firstName}_${profile.lastName}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le badge</span>
          </button>
        </div>
      </div>

      {/* Visual Badge Display (Front & Back) */}
      <div id="teacher-badge-printable-area" className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto pt-2">
        {/* RECTO */}
        <div className="space-y-2">
          <div className="text-xs uppercase font-bold text-slate-500 text-center">Recto - Face Officielle</div>
          <div className="relative w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-2 border-blue-500/40 p-5 shadow-2xl flex flex-col justify-between overflow-hidden text-white">
            {/* Top header with Guinean flag stripe */}
            <div className="flex items-center justify-between border-b border-blue-500/30 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm shadow">
                  S
                </div>
                <div>
                  <div className="font-extrabold text-[12px] tracking-tight leading-none text-white">
                    {profile.schoolName}
                  </div>
                  <div className="text-[9px] text-blue-300 font-mono tracking-wider mt-0.5 uppercase">
                    Rép. de Guinée · MEPU-A
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                  Enseignant Titulaire
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
                  className="w-20 h-24 rounded-xl object-cover border-2 border-blue-400 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white">
                  <ShieldCheck className="w-3 h-3" />
                </div>
              </div>

              <div className="space-y-1 min-w-0">
                <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                  Professeur
                </div>
                <div className="text-base font-black text-white leading-tight truncate">
                  {profile.firstName} {profile.lastName}
                </div>
                <div className="text-[11px] text-slate-300 font-medium">
                  {profile.specialty}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono font-bold">
                  Matricule : {profile.matricule}
                </div>
                <div className="text-[9px] text-slate-400 truncate">
                  Matières : {profile.subjects.join(', ')}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[9px] text-slate-400">
              <span>SmartSchool Security Validated</span>
              <span className="font-mono text-blue-400">ID: {profile.id}</span>
            </div>

            {/* Tricolor stripe at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />
          </div>
        </div>

        {/* VERSO */}
        <div className="space-y-2">
          <div className="text-xs uppercase font-bold text-slate-500 text-center">Verso - Sécurité & Contacts</div>
          <div className="relative w-full aspect-[1.586/1] rounded-2xl bg-slate-900 border-2 border-slate-700/60 p-5 shadow-2xl flex flex-col justify-between overflow-hidden text-white">
            {/* Magnetic Stripe simulation */}
            <div className="w-full h-8 bg-slate-950 -mx-5 -mt-2 mb-3 border-y border-slate-800 flex items-center px-5">
              <div className="w-full h-2 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 opacity-60" />
            </div>

            {/* Content */}
            <div className="flex items-center justify-between gap-4 my-auto">
              <div className="space-y-1.5 text-[10px] text-slate-300">
                <p className="leading-tight">
                  Cette carte professionnelle est strictement personnelle. Elle confère à son titulaire le statut d'enseignant accrédité.
                </p>
                <div className="text-slate-400">
                  Téléphone : <strong className="text-white">{profile.phone}</strong>
                </div>
                <div className="text-slate-400">
                  Email : <strong className="text-white">{profile.email}</strong>
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

      {/* Edit Profile / Photo Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-blue-100 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-bold text-base text-blue-950">Mettre à jour la photo & informations</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-blue-950 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Photo with dual PC and URL upload */}
              <ImageUploadField
                label="Photo professionnelle de l'enseignant"
                value={photoUrl}
                onChange={setPhotoUrl}
                helperText="Vous pouvez importer une photo depuis votre PC ou renseigner une URL directe."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Prénom *</label>
                  <input 
                    type="text" 
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nom *</label>
                  <input 
                    type="text" 
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Téléphone de contact *</label>
                <input 
                  type="text" 
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Spécialité & Titre *</label>
                <input 
                  type="text" 
                  required
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-blue-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-blue-950 bg-slate-100 hover:bg-blue-50 text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
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
