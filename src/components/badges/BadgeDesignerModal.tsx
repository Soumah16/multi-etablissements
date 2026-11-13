import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BadgeTemplateConfig } from '../../types';
import { 
  QrCode, 
  Printer, 
  Check, 
  Sparkles, 
  Sliders, 
  Building2, 
  CreditCard, 
  UserCheck, 
  GraduationCap, 
  Briefcase,
  Layers,
  Palette
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const BadgeDesignerModal: React.FC = () => {
  const { badgeTemplate, updateBadgeTemplate, schools, showToast, t } = useApp();

  const [templateType, setTemplateType] = useState<BadgeTemplateConfig['templateType']>(badgeTemplate.templateType);
  const [themeColor, setThemeColor] = useState(badgeTemplate.themeColor);
  const [showQrCode, setShowQrCode] = useState(badgeTemplate.showQrCode);
  const [qrPayloadType, setQrPayloadType] = useState(badgeTemplate.qrPayloadType);
  const [showBarcode, setShowBarcode] = useState(badgeTemplate.showBarcode);
  const [showPhoto, setShowPhoto] = useState(badgeTemplate.showPhoto);
  const [showSignature, setShowSignature] = useState(badgeTemplate.showSignature);
  const [validityYear, setValidityYear] = useState(badgeTemplate.validityYear);
  const [selectedSchoolPreviewId, setSelectedSchoolPreviewId] = useState(schools[0]?.id || '');

  const previewSchool = schools.find(s => s.id === selectedSchoolPreviewId) || schools[0];

  const handleSaveTemplate = () => {
    updateBadgeTemplate({
      templateType,
      themeColor,
      showQrCode,
      qrPayloadType,
      showBarcode,
      showPhoto,
      showSignature,
      validityYear
    });
    showToast("Gabarit officiel des badges enregistré pour les écoles");
  };

  const colorPresets = [
    { label: "Bleu Marine République", value: "#1e3a8a" },
    { label: "Vert Syli National", value: "#047857" },
    { label: "Bordeaux Académique", value: "#881337" },
    { label: "Violet Royal Université", value: "#581c87" },
    { label: "Noir Anthracite Direction", value: "#0f172a" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950">
            {t.badges.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.badges.subtitle} · Standardisé pour l'ensemble des établissements
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => triggerPrint('badge-designer-printable-card', 'Badge_Officiel_SmartSchool')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>{t.badges.printCard}</span>
          </button>

          <button
            onClick={handleSaveTemplate}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Check className="w-4 h-4" />
            <span>Enregistrer le Modèle National</span>
          </button>
        </div>
      </div>

      {/* Main 2-column layout: Configuration on left, Live Specimen Preview on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Options */}
        <div className="lg:col-span-6 space-y-5">
          {/* Card Type Selector */}
          <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-xs space-y-3">
            <label className="text-xs font-semibold text-blue-950 uppercase tracking-wider">
              Type de Carte à Configurer
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemplateType('student')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  templateType === 'student'
                    ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-950'
                }`}
              >
                <GraduationCap className="w-4 h-4 mb-1 text-blue-600" />
                <div className="font-bold text-xs">{t.badges.studentCard}</div>
                <div className="text-[10px] text-slate-500">Élèves / Étudiants</div>
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('teacher')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  templateType === 'teacher'
                    ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-950'
                }`}
              >
                <UserCheck className="w-4 h-4 mb-1 text-emerald-600" />
                <div className="font-bold text-xs">{t.badges.teacherBadge}</div>
                <div className="text-[10px] text-slate-500">Corps professoral</div>
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('staff')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  templateType === 'staff'
                    ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-950'
                }`}
              >
                <Briefcase className="w-4 h-4 mb-1 text-purple-600" />
                <div className="font-bold text-xs">{t.badges.staffCard}</div>
                <div className="text-[10px] text-slate-500">Personnel administratif</div>
              </button>
            </div>
          </div>

          {/* Color & Theme */}
          <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-xs space-y-3 text-xs">
            <label className="font-semibold text-blue-950 uppercase tracking-wider text-[11px]">
              Palette & Thème Couleur
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {colorPresets.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setThemeColor(c.value)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] transition-all ${
                    themeColor === c.value
                      ? 'border-blue-600 bg-blue-50 text-blue-950 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.value }} />
                  <span>{c.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <span className="text-slate-600">Couleur personnalisée :</span>
              <input 
                type="color" 
                value={themeColor} 
                onChange={e => setThemeColor(e.target.value)} 
                className="w-8 h-8 rounded border border-slate-300 cursor-pointer bg-transparent"
              />
              <span className="font-mono text-slate-700">{themeColor}</span>
            </div>
          </div>

          {/* QR Code & Barcode Security Options */}
          <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-xs space-y-3.5 text-xs">
            <label className="font-semibold text-blue-950 uppercase tracking-wider text-[11px]">
              Paramètres QR Code & Authentification Numérique
            </label>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-700">
                <span>Afficher le QR Code sécurisé</span>
                <input 
                  type="checkbox" 
                  checked={showQrCode} 
                  onChange={e => setShowQrCode(e.target.checked)} 
                  className="rounded text-blue-600 focus:ring-0 w-4 h-4 bg-white border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span>Afficher le Code-Barres officiel (Format CODE128)</span>
                <input 
                  type="checkbox" 
                  checked={showBarcode} 
                  onChange={e => setShowBarcode(e.target.checked)} 
                  className="rounded text-blue-600 focus:ring-0 w-4 h-4 bg-white border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span>Emplacement Photo d'identité certifiée</span>
                <input 
                  type="checkbox" 
                  checked={showPhoto} 
                  onChange={e => setShowPhoto(e.target.checked)} 
                  className="rounded text-blue-600 focus:ring-0 w-4 h-4 bg-white border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span>Signature électronique de la direction d'école</span>
                <input 
                  type="checkbox" 
                  checked={showSignature} 
                  onChange={e => setShowSignature(e.target.checked)} 
                  className="rounded text-blue-600 focus:ring-0 w-4 h-4 bg-white border-slate-300"
                />
              </div>
            </div>

            <div className="pt-2 space-y-1">
              <label className="text-slate-600 font-medium">Contenu encodé dans le QR Code :</label>
              <select
                value={qrPayloadType}
                onChange={e => setQrPayloadType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
              >
                <option value="verification_url">URL de vérification en ligne (https://verify.smartschool.gn/qr/...)</option>
                <option value="matricule_uuid">Matricule cryptographique unique (UUIDv5 + school_id)</option>
                <option value="vcard">Carte de visite vCard certifiée</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-medium">Année Scolaire d'application :</label>
              <input
                type="text"
                value={validityYear}
                onChange={e => setValidityYear(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Printable Card Specimen Preview */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-blue-950">
              Aperçu en Direct du Badge Spécimen
            </span>
            <select
              value={selectedSchoolPreviewId}
              onChange={e => setSelectedSchoolPreviewId(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white border border-blue-200 text-blue-950 font-medium"
            >
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Interactive Card Canvas (Standard Credit Card Size 85.6mm x 53.98mm ISO/IEC 7810 ID-1) */}
          <div className="p-4 sm:p-8 rounded-2xl bg-white border border-blue-100 shadow-xs flex items-center justify-center overflow-x-auto">
            <div 
              id="badge-designer-printable-card"
              style={{ borderColor: themeColor }}
              className="w-72 sm:w-80 h-[440px] sm:h-[480px] rounded-2xl bg-white text-slate-900 shadow-2xl border-4 overflow-hidden flex flex-col justify-between relative select-none shrink-0"
            >
              {/* Header Header Brand */}
              <div 
                style={{ backgroundColor: themeColor }}
                className="p-4 text-white text-center flex flex-col items-center justify-center relative"
              >
                <div className="text-[10px] tracking-widest uppercase font-semibold text-white/90">
                  RÉPUBLIQUE DE GUINÉE
                </div>
                <div className="text-[9px] uppercase tracking-wider text-white/80">
                  Travail - Justice - Solidarité
                </div>
                <div className="mt-2 text-xs font-extrabold uppercase tracking-tight text-white leading-tight">
                  {previewSchool?.name || "Lycée d'Excellence de Conakry"}
                </div>
                <div className="text-[10px] text-white/80 mt-0.5">
                  {templateType === 'student' ? "CARTE SCOLAIRE OFFICIELLE" : templateType === 'teacher' ? "BADGE DU CORPS PROFESSORAL" : "CARTE DU PERSONNEL ADMINISTRATIF"}
                </div>
              </div>

              {/* Card Center: Photo & Identification */}
              <div className="px-5 py-3 flex-1 flex flex-col items-center justify-around text-center">
                {/* Photo frame */}
                {showPhoto && (
                  <div className="w-24 h-28 rounded-lg border-2 border-slate-300 overflow-hidden shadow-sm bg-slate-100 flex items-center justify-center">
                    <img 
                      src={templateType === 'student' 
                        ? "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"
                        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                      }
                      alt="Identité"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Name & Academic info */}
                <div className="mt-1 space-y-0.5">
                  <div className="text-sm font-extrabold text-slate-900 tracking-tight">
                    {templateType === 'student' ? "DIALLO Alpha Oumar" : templateType === 'teacher' ? "Pr. Sékou CONDÉ" : "Mme BARRY Aissatou"}
                  </div>
                  <div className="text-[11px] font-semibold text-blue-700">
                    {templateType === 'student' ? "Terminale Sciences Mathématiques" : templateType === 'teacher' ? "Professeur de Physique-Chimie" : "Secrétaire Générale"}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Matricule : <strong>{previewSchool?.code}-2026-9042</strong>
                  </div>
                </div>

                {/* QR Code and Barcode specimen */}
                <div className="w-full flex items-center justify-around pt-2 border-t border-slate-200 mt-2">
                  {showQrCode && (
                    <div className="flex flex-col items-center">
                      <div className="p-1 rounded bg-white border border-slate-300">
                        {/* SVG QR code specimen */}
                        <svg className="w-14 h-14" viewBox="0 0 100 100">
                          <rect width="100" height="100" fill="white" />
                          <path d="M10,10 h30 v30 h-30 z M15,15 h20 v20 h-20 z M20,20 h10 v10 h-10 z" fill={themeColor} />
                          <path d="M60,10 h30 v30 h-30 z M65,15 h20 v20 h-20 z M70,20 h10 v10 h-10 z" fill={themeColor} />
                          <path d="M10,60 h30 v30 h-30 z M15,65 h20 v20 h-20 z M20,70 h10 v10 h-10 z" fill={themeColor} />
                          <rect x="45" y="45" width="10" height="10" fill={themeColor} />
                          <rect x="65" y="65" width="15" height="15" fill={themeColor} />
                          <rect x="45" y="75" width="10" height="15" fill={themeColor} />
                          <rect x="75" y="45" width="15" height="10" fill={themeColor} />
                        </svg>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 mt-0.5">Scan Certifié</span>
                    </div>
                  )}

                  {showBarcode && (
                    <div className="flex flex-col items-center">
                      {/* Barcode specimen */}
                      <div className="h-10 flex items-center gap-0.5 px-2">
                        <span className="w-1 h-8 bg-slate-900 inline-block" />
                        <span className="w-0.5 h-8 bg-slate-900 inline-block" />
                        <span className="w-1.5 h-8 bg-slate-900 inline-block" />
                        <span className="w-0.5 h-8 bg-slate-900 inline-block" />
                        <span className="w-2 h-8 bg-slate-900 inline-block" />
                        <span className="w-0.5 h-8 bg-slate-900 inline-block" />
                        <span className="w-1 h-8 bg-slate-900 inline-block" />
                        <span className="w-1.5 h-8 bg-slate-900 inline-block" />
                        <span className="w-0.5 h-8 bg-slate-900 inline-block" />
                        <span className="w-2 h-8 bg-slate-900 inline-block" />
                        <span className="w-1 h-8 bg-slate-900 inline-block" />
                      </div>
                      <span className="text-[9px] font-mono text-slate-600">*{previewSchool?.code}9042*</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Validity & Seal */}
              <div 
                style={{ backgroundColor: themeColor }}
                className="px-4 py-2 text-white flex items-center justify-between text-[10px]"
              >
                <span>Année : <strong>{validityYear}</strong></span>
                <span className="font-mono text-[9px] text-white/80">SmartSchool ERP Secure ID</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
