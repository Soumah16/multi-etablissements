import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { ImageUploadField } from '../common/ImageUploadField';
import { 
  CreditCard, 
  QrCode, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Sparkles, 
  Smartphone,
  Eye,
  Camera
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const DirectorBadgeModal: React.FC = () => {
  const { profile, updateProfile, showToast } = useDirector();
  const [photoEditOpen, setPhotoEditOpen] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState(profile.photo);
  const [isScanTested, setIsScanTested] = useState(false);

  const handleSavePhoto = () => {
    updateProfile({ photo: newPhotoUrl });
    setPhotoEditOpen(false);
    showToast('Photo du badge mise à jour avec succès.');
  };

  const handlePrint = () => {
    triggerPrint('director-badge-printable-area', `Badge_Directeur_${profile.name.replace(/\s+/g, '_')}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Format Standard ISO-7810 (ID-1)
            </span>
            <span className="text-xs text-slate-400">Puce Sécurisée & QR Code Cryptographique</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-400" />
            <span>Badge & Carte Professionnelle du Directeur</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Carte d'accréditation pédagogique avec signature numérique, sceau d'État et contrôle d'accès biométrique/QR.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPhotoEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Camera className="w-4 h-4 text-blue-400" />
            <span>Modifier la Photo</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le Badge</span>
          </button>
        </div>
      </div>

      {/* Badge Rendering Area */}
      <div id="director-badge-printable-area" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Front of Badge */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recto de la Carte Professionnelle</span>
          
          <div className="w-full max-w-[420px] aspect-[85.6/53.98] rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-2 border-amber-500/50 p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white print:border-black">
            {/* Watermark logo */}
            <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-full bg-blue-600/10 pointer-events-none blur-xl" />
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />

            {/* Top Bar of card */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 font-black text-sm flex items-center justify-center shadow-xs">
                  S
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-tight text-white leading-none">
                    Lycée d'Excellence de Conakry
                  </div>
                  <div className="text-[8px] text-blue-300 font-mono">République de Guinée · MEPU-A</div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                DIR · ACCRÉDITÉ
              </span>
            </div>

            {/* Middle Identity Zone */}
            <div className="flex items-center gap-4 my-auto">
              <img 
                src={profile.photo} 
                alt="" 
                className="w-20 h-24 rounded-xl object-cover border-2 border-amber-400/80 shadow-md shrink-0" 
              />
              <div className="space-y-1 min-w-0">
                <div className="text-sm font-black text-white leading-tight truncate">
                  {profile.name}
                </div>
                <div className="text-[11px] font-semibold text-amber-300 leading-tight">
                  {profile.title}
                </div>
                <div className="text-[9px] text-slate-300 font-mono pt-1">
                  Matricule : <span className="font-bold text-white">{profile.matricule}</span>
                </div>
                <div className="text-[9px] text-slate-300 font-mono">
                  Badge N° : <span className="text-blue-300">{profile.badgeNumber}</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[8px] text-slate-400">
              <div className="font-mono">Valide : 2026 - 2027</div>
              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                <span>Signature Numérique Certifiée</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back of Badge */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Verso de la Carte (QR Code de Contrôle)</span>
          
          <div className="w-full max-w-[420px] aspect-[85.6/53.98] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-slate-700 p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white">
            {/* Magnetic Stripe simulation */}
            <div className="absolute top-4 left-0 right-0 h-8 bg-slate-950 border-y border-slate-800" />

            <div className="pt-9 flex items-center justify-between gap-4">
              <div className="space-y-1.5 text-[9px] text-slate-300">
                <div className="font-bold text-white uppercase">Prérogatives du Titulaire :</div>
                <p className="text-[8px] text-slate-400 leading-tight">
                  Ce badge confère l'autorité pédagogique exclusive de supervision des classes, validation des examens et signature des bulletins scolaires officiels.
                </p>
                <div className="text-[8px] text-slate-400 font-mono">
                  En cas de perte, contacter la direction : {profile.phone}
                </div>
              </div>

              {/* QR Code Container */}
              <div className="p-2 rounded-xl bg-white text-black shrink-0 shadow-lg text-center flex flex-col items-center">
                <QrCode className="w-16 h-16" />
                <span className="text-[7px] font-mono font-bold mt-0.5">AUTH-DIR-QR</span>
              </div>
            </div>

            <div className="text-[8px] text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-800">
              <span>SmartSchool ERP Guinée</span>
              <span>ID: {profile.badgeNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Scanner Simulation */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Simulateur de Contrôle & Scan QR Code en Temps Réel
            </h3>
          </div>
          <button
            onClick={() => setIsScanTested(!isScanTested)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-xs"
          >
            {isScanTested ? 'Réinitialiser le test' : 'Tester le Scan QR Code'}
          </button>
        </div>

        {isScanTested && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4 text-xs animate-in fade-in">
            <div className="space-y-0.5">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>QR Code Vérifié avec Succès ! Titulaire Accrédité.</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Titulaire : <strong className="text-white">{profile.name}</strong> · Fonction : {profile.title}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Hash de validation : SHA256-LEC-DIR-2026-9812-OK
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase text-[10px] border border-emerald-500/30">
              Accès Autorisé
            </span>
          </div>
        )}
      </div>

      {/* Photo Edit Modal */}
      {photoEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Modifier la Photo du Badge</h3>
              <button onClick={() => setPhotoEditOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dual support: PC upload or URL via ImageUploadField */}
            <ImageUploadField
              label="Photo d'identité professionnelle"
              value={newPhotoUrl}
              onChange={setNewPhotoUrl}
              helperText="Téléversez depuis votre ordinateur (JPG/PNG) ou saisissez une URL directe."
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPhotoEditOpen(false)}
                className="px-3.5 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20"
              >
                Appliquer sur le Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
