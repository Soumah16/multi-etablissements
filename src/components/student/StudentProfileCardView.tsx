import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { ImageUploadField } from '../common/ImageUploadField';
import { triggerPrint, exportPrintableDocument } from '../../utils/printHelper';
import { 
  CreditCard, 
  QrCode, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Phone, 
  User, 
  GraduationCap,
  Calendar,
  Building2,
  Download
} from 'lucide-react';

export const StudentProfileCardView: React.FC = () => {
  const { profile, updateProfilePhoto } = useStudent();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState(profile.photo);

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfilePhoto(newPhoto);
    setPhotoModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Carte Scolaire Numérique & Badge ISO-7810</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Carte d'identité scolaire officielle avec QR Code multi-services (cantine, bibliothèque, émargement).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setNewPhoto(profile.photo); setPhotoModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer"
          >
            <span>Mettre à jour ma photo</span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('student-id-card-printable');
              if (el) {
                exportPrintableDocument(`Carte_Scolaire_${profile.matricule}`, el.innerHTML);
              }
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer"
            title="Télécharger version imprimable propre"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Télécharger</span>
          </button>
          <button
            onClick={() => triggerPrint('student-id-card-printable')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ISO-7810 Digital Card Display */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Aperçu Carte d'Élève Officielle (Format Portefeuille ID-1)
          </div>

          <div 
            id="student-id-card-printable"
            className="w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border-2 border-blue-400/40 shadow-2xl p-5 flex flex-col justify-between text-white relative overflow-hidden printable-document"
          >
            {/* Hologram aesthetic */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
            <div className="absolute top-2 right-4 text-[9px] font-mono tracking-widest text-blue-300/60 uppercase">
              REPUBLIQUE DE GUINEE · CARTE SCOLAIRE
            </div>

            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm shadow-md">
                  S
                </div>
                <div>
                  <div className="text-xs font-black tracking-tight leading-none">{profile.schoolName}</div>
                  <div className="text-[10px] text-blue-300 font-semibold mt-0.5">Année 2026-2027</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-200 border border-blue-400/30">
                {profile.className}
              </span>
            </div>

            {/* Middle Info */}
            <div className="flex items-center gap-4 my-auto">
              <div className="relative shrink-0">
                <img
                  src={profile.photo}
                  alt={profile.firstName}
                  className="w-20 h-24 rounded-xl object-cover border-2 border-blue-400 shadow-md bg-slate-800"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-slate-900" />
              </div>

              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-blue-300">Élève Régulier</div>
                <div className="text-base font-black text-white truncate leading-tight">
                  {profile.firstName} {profile.lastName}
                </div>
                <div className="text-xs font-mono font-bold text-emerald-300 mt-1">
                  Matricule : {profile.matricule}
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  Née le : {profile.birthDate} ({profile.gender})
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  Tuteur : <span className="font-semibold">{profile.parentName}</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar with Multi-Service QR Code */}
            <div className="pt-2 border-t border-blue-500/30 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-white p-0.5 flex items-center justify-center text-slate-900">
                  <QrCode className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-mono text-[9px] text-blue-200">TOKEN: {profile.qrCodeToken}</div>
                  <div className="text-[9px] text-slate-400">Accès Cantine · Bibliothèque · Pointage</div>
                </div>
              </div>
              <div className="text-right font-mono text-[9px] text-blue-300">
                VALIDÉ MINISTÈRE
              </div>
            </div>
          </div>
        </div>

        {/* Student Details & Usage Instructions */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Services Activés sur cette Carte</h2>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Carte Active</span>
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">Pointage à l'Entrée & Emargement</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Présentez ce QR Code au scanner du portail principal pour notifier automatiquement vos parents de votre arrivée.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">Prêts en Bibliothèque Numérique & Physique</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Valable pour l'emprunt de manuels MEPU-A jusqu'à 3 ouvrages simultanés auprès du bibliothécaire.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">Accès aux Évaluations & Examens Blancs</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Requis pour l'accès aux salles d'examen du Bac Unique et la vérification des copies anonymisées.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Update Modal with ImageUploadField */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Modifier la Photo de Profil Élève</h3>
            <p className="text-xs text-slate-400">
              Téléversez une photo nette depuis votre ordinateur ou saisissez une URL.
            </p>

            <form onSubmit={handleSavePhoto} className="space-y-4">
              <ImageUploadField
                label="Photo officielle"
                value={newPhoto}
                onChange={setNewPhoto}
                aspectRatio="square"
                helperText="Format carré recommandé, fond neutre."
              />

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                >
                  Valider la photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
