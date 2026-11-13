import React, { useState } from 'react';
import { useLibrarian } from '../../context/LibrarianContext';
import { ImageUploadField } from '../common/ImageUploadField';
import { 
  CreditCard, 
  QrCode, 
  Printer, 
  Sparkles, 
  ShieldCheck, 
  Edit3, 
  Building2, 
  CheckCircle2,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const LibrarianBadgeView: React.FC = () => {
  const { profile, updateProfile, showToast } = useLibrarian();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
    photo: profile.photo,
    librarySection: profile.librarySection
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950">Badge & Carte Professionnelle Bibliothécaire</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Carte d'accréditation ISO-7810 ID-1 avec QR Code d'authentification et puce RFID virtuelle.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{editing ? 'Annuler modification' : 'Modifier ma fiche'}</span>
          </button>
          <button
            onClick={() => triggerPrint('librarian-badge-printable-area', `Badge_Bibliothecaire_${profile.firstName}_${profile.lastName}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer la Carte</span>
          </button>
        </div>
      </div>

      <div id="librarian-badge-printable-area" className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        {/* ISO-7810 ID-1 Professional Card (Front & Back Preview) */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Aperçu Recto (Format Standard Carte Bancaire 85.60 × 53.98 mm)
          </div>

          {/* Front Face */}
          <div className="w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border-2 border-indigo-400/40 shadow-2xl p-5 flex flex-col justify-between text-white relative overflow-hidden">
            {/* Holographic Watermark effect */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
            <div className="absolute top-2 right-4 text-[9px] font-mono tracking-widest text-indigo-300/60 uppercase">
              REPUBLIQUE DE GUINEE · MEPU-A
            </div>

            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-sm shadow-md">
                  B
                </div>
                <div>
                  <div className="text-xs font-black tracking-tight leading-none">SmartSchool ERP</div>
                  <div className="text-[10px] text-indigo-300 font-semibold mt-0.5">{profile.schoolName}</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                Bibliothécaire
              </span>
            </div>

            {/* Center Info */}
            <div className="flex items-center gap-4 my-auto">
              <div className="relative shrink-0">
                <img
                  src={profile.photo}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-20 h-24 rounded-xl object-cover border-2 border-indigo-400 shadow-md bg-slate-800"
                />
                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-indigo-300">Responsable Médiathèque</div>
                <div className="text-base font-black text-white truncate leading-tight">
                  {profile.firstName} {profile.lastName}
                </div>
                <div className="text-xs font-mono font-bold text-amber-300 mt-1">
                  Matricule : {profile.matricule}
                </div>
                <div className="text-[10px] text-slate-300 mt-1">
                  Affectation : <span className="text-white font-medium">{profile.librarySection}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Validité : 2026 - 2027
                </div>
              </div>
            </div>

            {/* Bottom Bar with QR Code */}
            <div className="pt-2 border-t border-indigo-500/30 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-white p-0.5 flex items-center justify-center text-slate-900 shadow-xs">
                  <QrCode className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-mono text-[9px] text-indigo-200">ID: {profile.id}</div>
                  <div className="text-[9px] text-slate-400">Scan sécurisé signature ERP</div>
                </div>
              </div>
              <div className="text-right font-mono text-[9px] text-indigo-300">
                AUTORITÉ ÉTABLISSEMENT
              </div>
            </div>
          </div>
        </div>

        {/* Profile Modification Form */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-blue-950">Coordonnées du Titulaire</h2>
            <span className="text-xs text-indigo-600 font-mono font-semibold">ID: {profile.matricule}</span>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Prénom</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Photo Upload with dual URL and local PC file selector */}
              <ImageUploadField
                label="Photo d'identité pour le badge officiel"
                value={formData.photo}
                onChange={(photo) => setFormData({ ...formData, photo })}
                aspectRatio="square"
                helperText="Téléversez un fichier PNG/JPG depuis votre PC ou collez une URL sécurisée."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Téléphone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Section de Bibliothèque</label>
                <input
                  type="text"
                  value={formData.librarySection}
                  onChange={(e) => setFormData({ ...formData, librarySection: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-950 bg-slate-100 hover:bg-blue-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-2">
                <span className="text-slate-500">Établissement</span>
                <span className="font-bold text-blue-950 text-right">{profile.schoolName}</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-2">
                <span className="text-slate-500">Date d'embauche</span>
                <span className="font-bold text-blue-950">{profile.hireDate}</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-2">
                <span className="text-slate-500">Téléphone de contact</span>
                <span className="font-mono text-slate-800">{profile.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-2">
                <span className="text-slate-500">Email académique</span>
                <span className="font-mono text-indigo-700 truncate">{profile.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-2">
                <span className="text-slate-500">Adresse</span>
                <span className="text-slate-800 text-right">{profile.address}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
