import React, { useEffect, useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { ImageUploadField } from '../common/ImageUploadField';
import { triggerPrint } from '../../utils/printHelper';
import { RealQrCode, downloadQrCodePng } from '../common/RealQrCode';
import { downloadPvcBadgePdf, downloadPvcBadgeA4Pdf, PvcRenderData } from '../../utils/pvcCardRenderer';
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
  const { profile, updateProfilePhoto, showToast } = useStudent();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState(profile.photo);

  useEffect(() => {
    setNewPhoto(profile.photo);
  }, [profile.photo]);

  const qrPayload = profile.qrCodeToken || `STUDENT|${profile.matricule}|${profile.firstName} ${profile.lastName}|${profile.className}`;

  const getPvcData = (): PvcRenderData => ({
    schoolName: profile.schoolName,
    schoolCode: 'ELV',
    categoryLabel: 'CARTE SCOLAIRE',
    fullName: `${profile.firstName} ${profile.lastName}`,
    title: profile.className,
    matricule: profile.matricule,
    nationalUid: qrPayload,
    bloodGroup: 'O+',
    validityPeriod: '2026 - 2027',
    photoUrl: profile.photo,
    phone: profile.parentPhone,
    themeColor: '#2563eb',
    accentBg: '',
    isDarkTheme: true,
    showNationalArms: true,
    showTricolorBanner: true,
    showOfficialStamp: true,
    showMicrotext: true,
    showWatermark: true,
    showBarcode: true
  });

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfilePhoto(newPhoto);
    setPhotoModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-blue-950">Carte Scolaire Numérique & Badge ISO-7810</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Carte d'identité scolaire officielle avec QR Code multi-services (cantine, bibliothèque, émargement).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => { setNewPhoto(profile.photo); setPhotoModalOpen(true); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer"
          >
            <span>Modifier ma photo</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              await downloadQrCodePng(qrPayload, `QR_Eleve_${profile.matricule}`, '#0f172a');
              showToast('Code QR téléchargé en PNG.');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-950 border border-slate-200 text-xs font-semibold cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
            <span>QR PNG</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              const fn = await downloadPvcBadgePdf(getPvcData(), 'both', `Carte_Scolaire_${profile.matricule}`);
              showToast(`PDF PVC CR-80 (85.6 × 53.98 mm) téléchargé : ${fn}`);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF PVC (CR-80)</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              const fn = await downloadPvcBadgeA4Pdf(getPvcData(), 'both', `Planche_A4_Eleve_${profile.matricule}`);
              showToast(`PDF A4 taille PVC 100% téléchargé : ${fn}`);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-950 border border-slate-200 text-xs font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>PDF A4 (100%)</span>
          </button>
          <button
            type="button"
            onClick={() => triggerPrint('student-id-card-printable', `Carte_Scolaire_${profile.matricule}`, 'landscape')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer PVC</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        {/* ISO-7810 Digital Card Display */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Aperçu Carte d'Élève Officielle (Format PVC CR-80 · 85.60 × 53.98 mm)
          </div>

          <div 
            id="student-id-card-printable"
            className="pvc-card w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border-2 border-blue-400/40 shadow-2xl p-5 flex flex-col justify-between text-white relative overflow-hidden printable-document"
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
                <div className="w-10 h-10 rounded bg-white p-0.5 flex items-center justify-center text-slate-900 shrink-0">
                  <RealQrCode value={qrPayload} size={36} fgColor="#0f172a" alt={`QR ${profile.matricule}`} />
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
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-blue-950">Services Activés sur cette Carte</h2>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Carte Active</span>
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-blue-950">Pointage à l'Entrée & Emargement</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Présentez ce QR Code au scanner du portail principal pour notifier automatiquement vos parents de votre arrivée.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-blue-950">Prêts en Bibliothèque Numérique & Physique</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Valable pour l'emprunt de manuels MEPU-A jusqu'à 3 ouvrages simultanés auprès du bibliothécaire.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-blue-950">Accès aux Évaluations & Examens Blancs</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Requis pour l'accès aux salles d'examen du Bac Unique et la vérification des copies anonymisées.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Update Modal with ImageUploadField */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-blue-100 shadow-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-blue-950">Modifier la Photo de Profil Élève</h3>
            <p className="text-xs text-slate-500">
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

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-950 bg-slate-100 hover:bg-blue-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
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
