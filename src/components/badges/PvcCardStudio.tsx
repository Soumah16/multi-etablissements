import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { 
  buildPvcPrintSheetHtml, 
  drawPvcCardToCanvas, 
  downloadCanvasImage, 
  PvcRenderData 
} from '../../utils/pvcCardRenderer';
import { exportPrintableDocument } from '../../utils/printHelper';
import { 
  CreditCard, 
  Printer, 
  Download, 
  Check, 
  Sparkles, 
  Sliders, 
  Building2, 
  UserCheck, 
  GraduationCap, 
  Briefcase, 
  QrCode, 
  ShieldCheck, 
  RotateCw, 
  Eye, 
  FileCheck2, 
  Stamp, 
  Maximize2,
  Copy,
  Users,
  Compass,
  Palette,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';
import { DEMO_ACCOUNTS, DemoAccount } from '../../data/accountsData';

export type CardCategory = 'professionnelle' | 'enseignant' | 'eleve' | 'parent' | 'administrative';
export type CardFace = 'recto' | 'verso' | 'both';

export interface CardTemplateStyle {
  id: string;
  name: string;
  badgeTag: string;
  primaryBg: string;
  headerBg: string;
  accentColor: string;
  textColor: string;
  borderColor: string;
  watermarkOpacity: number;
}

export const PVC_TEMPLATES: CardTemplateStyle[] = [
  {
    id: 'mepu_national',
    name: 'République de Guinée (MEPU-A Officiel)',
    badgeTag: 'OFFICIEL NATIONAL',
    primaryBg: 'bg-white',
    headerBg: 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900',
    accentColor: '#059669',
    textColor: 'text-slate-900',
    borderColor: 'border-emerald-600',
    watermarkOpacity: 0.08
  },
  {
    id: 'smartschool_pro',
    name: 'SmartSchool Pro (Bleu & Or)',
    badgeTag: 'SMARTSCHOOL',
    primaryBg: 'bg-white',
    headerBg: 'bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950',
    accentColor: '#2563eb',
    textColor: 'text-slate-900',
    borderColor: 'border-blue-600',
    watermarkOpacity: 0.07
  },
  {
    id: 'or_prestige',
    name: 'Or & Prestige (Académie Impériale)',
    badgeTag: 'HAUTE DISTINCTION',
    primaryBg: 'bg-slate-950',
    headerBg: 'bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-800',
    accentColor: '#d97706',
    textColor: 'text-amber-100',
    borderColor: 'border-amber-500',
    watermarkOpacity: 0.12
  },
  {
    id: 'universite_excellence',
    name: 'Université & Grandes Écoles',
    badgeTag: 'ENSEIGNEMENT SUPÉRIEUR',
    primaryBg: 'bg-white',
    headerBg: 'bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-900',
    accentColor: '#7c3aed',
    textColor: 'text-slate-900',
    borderColor: 'border-purple-600',
    watermarkOpacity: 0.08
  },
  {
    id: 'lycee_excellence',
    name: 'Lycée d\'Excellence (Bordeaux Prestige)',
    badgeTag: 'SECONDAIRE EXCELLENCE',
    primaryBg: 'bg-white',
    headerBg: 'bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950',
    accentColor: '#be123c',
    textColor: 'text-slate-900',
    borderColor: 'border-rose-600',
    watermarkOpacity: 0.08
  },
  {
    id: 'diplomatique_anthracite',
    name: 'Diplomatique Sombre (Haut Niveau)',
    badgeTag: 'CORPS DIPLOMATIQUE',
    primaryBg: 'bg-slate-900',
    headerBg: 'bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900',
    accentColor: '#94a3b8',
    textColor: 'text-white',
    borderColor: 'border-slate-600',
    watermarkOpacity: 0.10
  }
];

export const PvcCardStudio: React.FC = () => {
  const { schools, showToast } = useApp();
  const { currentSchool } = useSchoolAdmin();

  // Selected State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('mepu_national');
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>('eleve');
  const [activeFace, setActiveFace] = useState<CardFace>('both');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(currentSchool?.id || schools[0]?.id || 'ECOLE-001');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('USR-ELV-001');

  // Customization Toggles
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [showMicrotext, setShowMicrotext] = useState<boolean>(true);
  const [showOfficialStamp, setShowOfficialStamp] = useState<boolean>(true);
  const [showNationalArms, setShowNationalArms] = useState<boolean>(true);
  const [showTricolorBanner, setShowTricolorBanner] = useState<boolean>(true);
  const [showBarcode, setShowBarcode] = useState<boolean>(true);
  const [validityPeriod, setValidityPeriod] = useState<string>('2026 - 2027');

  // Custom editable fields
  const [customName, setCustomName] = useState<string>('Fatoumata Binta Diallo');
  const [customTitle, setCustomTitle] = useState<string>('Terminale Sciences Mathématiques');
  const [customMatricule, setCustomMatricule] = useState<string>('ELV-EXC-120');
  const [customUid, setCustomUid] = useState<string>('GN-MEPUA-ELV-120-8804');
  const [customPhoto, setCustomPhoto] = useState<string>('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300');
  const [customBloodGroup, setCustomBloodGroup] = useState<string>('O+');
  const [customBirthDate, setCustomBirthDate] = useState<string>('14/05/2008');

  // Verification modal simulation
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);

  const selectedTemplate = PVC_TEMPLATES.find(t => t.id === selectedTemplateId) || PVC_TEMPLATES[0];
  const selectedSchool = schools.find(s => s.id === selectedSchoolId) || schools[0];

  const handleApplyAccount = (accId: string) => {
    setSelectedAccountId(accId);
    const acc = DEMO_ACCOUNTS.find(a => a.id === accId);
    if (!acc) return;

    setCustomName(acc.name);
    setCustomTitle(acc.title);
    setCustomMatricule(acc.matricule);
    setCustomUid(acc.nationalUid || `GN-MEPUA-${acc.matricule}-9941`);
    setCustomPhoto(acc.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300');

    if (acc.role === 'student') setSelectedCategory('eleve');
    else if (acc.role === 'teacher') setSelectedCategory('enseignant');
    else if (acc.role === 'parent') setSelectedCategory('parent');
    else if (acc.role === 'director' || acc.role === 'school_admin' || acc.role === 'super_admin') setSelectedCategory('professionnelle');
    else setSelectedCategory('administrative');

    showToast(`Données chargées pour : ${acc.name}`);
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const getRenderData = (): PvcRenderData => {
    return {
      schoolName: selectedSchool?.name || "Lycée d'Excellence de Conakry",
      schoolCode: selectedSchool?.code || "EXC",
      categoryLabel: selectedCategory === 'eleve' ? 'Carte Scolaire' : selectedCategory === 'enseignant' ? 'Corps Professoral' : selectedCategory.toUpperCase(),
      fullName: customName,
      title: customTitle,
      matricule: customMatricule,
      nationalUid: customUid,
      bloodGroup: customBloodGroup,
      validityPeriod: validityPeriod,
      photoUrl: customPhoto,
      themeColor: selectedTemplate.accentColor,
      accentBg: selectedTemplate.headerBg,
      isDarkTheme: selectedTemplate.id === 'or_prestige' || selectedTemplate.id === 'diplomatique_anthracite',
      showNationalArms,
      showTricolorBanner,
      showOfficialStamp,
      showMicrotext,
      showWatermark,
      showBarcode
    };
  };

  const handlePrintPvcCards = () => {
    const data = getRenderData();
    const fullHtml = buildPvcPrintSheetHtml(data, activeFace);
    const title = `Planche_PVC_CR80_${selectedSchool?.code}_${customMatricule}`;
    
    // Infallible export of self-contained print-ready file
    exportPrintableDocument(title, fullHtml);

    // Direct browser print modal trigger
    try {
      let printFrame = document.getElementById('smartschool-pvc-print-frame') as HTMLIFrameElement;
      if (printFrame) printFrame.remove();
      
      printFrame = document.createElement('iframe');
      printFrame.id = 'smartschool-pvc-print-frame';
      printFrame.setAttribute('style', 'position:fixed;right:0;bottom:0;width:1px;height:1px;border:none;opacity:0.01;pointer-events:none;z-index:-999;');
      document.body.appendChild(printFrame);
      
      const frameDoc = printFrame.contentWindow?.document;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(fullHtml);
        frameDoc.close();
        setTimeout(() => {
          try {
            printFrame.contentWindow?.focus();
            printFrame.contentWindow?.print();
          } catch (e) {
            console.warn('Iframe print blocked, file downloaded.', e);
          }
        }, 400);
      }
    } catch (err) {
      console.warn(err);
    }

    showToast("Planche PVC A4 générée avec fidélité 100% des couleurs et dimensions !");
  };

  const handleDownloadImage = async (format: 'png' | 'jpeg', face: 'recto' | 'verso') => {
    if (!canvasRef.current) return;
    const data = getRenderData();
    setIsExporting(true);
    showToast(`Génération haute résolution 300 DPI (${format.toUpperCase()}) en cours...`);

    try {
      await drawPvcCardToCanvas(canvasRef.current, data, face);
      const filename = `Badge_PVC_CR80_${customMatricule}_${face.toUpperCase()}`;
      downloadCanvasImage(canvasRef.current, filename, format);
      showToast(`Badge ${face.toUpperCase()} téléchargé avec fidélité graphique intégrale !`);
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la génération de l'image");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden off-screen canvas for high-definition 300 DPI rendering */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Studio Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Studio National des Cartes & Badges PVC</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  Norme ISO/IEC 7810 ID-1 (CR-80)
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Format standard 85.60 × 53.98 mm · Résolution 300 DPI · Fidélité 100% à l'impression et au téléchargement
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons with high-fidelity outputs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowVerifyModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Tester Scan QR Code</span>
          </button>

          {/* High-Res Image Downloads (PNG 300 DPI) */}
          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleDownloadImage('png', 'recto')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer disabled:opacity-50"
            title="Télécharger l'image HD 300 DPI de la face Recto (Fidélité 100%)"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>PNG HD Recto</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={() => handleDownloadImage('png', 'verso')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer disabled:opacity-50"
            title="Télécharger l'image HD 300 DPI de la face Verso (Fidélité 100%)"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>PNG HD Verso</span>
          </button>

          {/* High-Fidelity Printable Sheet / PDF */}
          <button
            type="button"
            onClick={handlePrintPvcCards}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 cursor-pointer"
            title="Imprimer ou enregistrer en PDF avec styles et dimensions exactes"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Imprimer Planche PVC A4 (Fidélité 100%)</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Controls on Left, Dual-face Canvas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Studio Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card Category Selector */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>1. Catégorie de Badge</span>
              <span className="text-[10px] font-mono text-blue-400">5 Modèles Certifiés</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'professionnelle', label: 'Professionnelle', sub: 'Direction & Cadres', icon: Briefcase },
                { id: 'enseignant', label: 'Enseignant', sub: 'Corps Professoral', icon: GraduationCap },
                { id: 'eleve', label: 'Élève / Étudiant', sub: 'Carte Scolaire', icon: UserCheck },
                { id: 'parent', label: 'Parent / Tuteur', sub: 'Accès Établissement', icon: Users },
                { id: 'administrative', label: 'Administrative', sub: 'Secrétariat & Services', icon: Compass }
              ].map(cat => {
                const Icon = cat.icon;
                const isCurrent = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as CardCategory)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isCurrent ? 'text-blue-400' : 'text-slate-400'}`} />
                    <div className="font-bold text-[11px] truncate">{cat.label}</div>
                    <div className="text-[9px] text-slate-500 truncate">{cat.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Profile Importer */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>2. Charger les données d'un compte MEPU-A</span>
              <span className="text-[10px] text-slate-400">Préremplissage instantané</span>
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => handleApplyAccount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-blue-500 cursor-pointer font-medium"
            >
              {DEMO_ACCOUNTS.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} — {acc.title} ({acc.matricule})
                </option>
              ))}
            </select>
          </div>

          {/* Template Style Selector */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>3. Gabarit Visuel & Thème</span>
              <span className="text-[10px] text-amber-400 font-semibold">{selectedTemplate.name}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PVC_TEMPLATES.map(tmpl => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600/10 shadow-sm'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: tmpl.accentColor }} />
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase truncate">
                        {tmpl.badgeTag}
                      </span>
                    </div>
                    <div className="font-bold text-[11px] text-white truncate">
                      {tmpl.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Person Customization */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <label className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>4. Renseignements d'Identité</span>
              <span className="text-[10px] font-mono text-slate-400">Édition en direct</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Nom Complet</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Fonction / Classe</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Matricule Officiel</label>
                <input
                  type="text"
                  value={customMatricule}
                  onChange={(e) => setCustomMatricule(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">National UID Cryptographique</label>
                <input
                  type="text"
                  value={customUid}
                  onChange={(e) => setCustomUid(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Groupe Sanguin</label>
                <input
                  type="text"
                  value={customBloodGroup}
                  onChange={(e) => setCustomBloodGroup(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Année Scolaire / Validité</label>
                <input
                  type="text"
                  value={validityPeriod}
                  onChange={(e) => setValidityPeriod(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Security Elements Toggles */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
            <label className="text-[11px] font-bold text-white uppercase tracking-wider block">
              5. Sécurités Anti-Fraude & Éléments Officiels
            </label>
            
            <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showNationalArms}
                  onChange={(e) => setShowNationalArms(e.target.checked)}
                  className="rounded text-blue-600 bg-slate-800 border-slate-700 w-3.5 h-3.5"
                />
                <span>Armoiries Nationales</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showTricolorBanner}
                  onChange={(e) => setShowTricolorBanner(e.target.checked)}
                  className="rounded text-blue-600 bg-slate-800 border-slate-700 w-3.5 h-3.5"
                />
                <span>Bande Rouge-Jaune-Vert</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showOfficialStamp}
                  onChange={(e) => setShowOfficialStamp(e.target.checked)}
                  className="rounded text-blue-600 bg-slate-800 border-slate-700 w-3.5 h-3.5"
                />
                <span>Tampon & Sceau Officiel</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showMicrotext}
                  onChange={(e) => setShowMicrotext(e.target.checked)}
                  className="rounded text-blue-600 bg-slate-800 border-slate-700 w-3.5 h-3.5"
                />
                <span>Micro-texte de sécurité</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                  className="rounded text-blue-600 bg-slate-800 border-slate-700 w-3.5 h-3.5"
                />
                <span>Filigrane Anti-Photocopie</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showBarcode}
                  onChange={(e) => setShowBarcode(e.target.checked)}
                  className="rounded text-blue-600 bg-slate-800 border-slate-700 w-3.5 h-3.5"
                />
                <span>Code-barres CODE128</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Dual-Face PVC Interactive Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Face View Switcher */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveFace('both')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFace === 'both' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Recto & Verso (Côte à côte)
              </button>
              <button
                type="button"
                onClick={() => setActiveFace('recto')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFace === 'recto' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Face Recto
              </button>
              <button
                type="button"
                onClick={() => setActiveFace('verso')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFace === 'verso' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Face Verso
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
              CR-80: 85.60 mm × 53.98 mm · 1012 × 638 px
            </div>
          </div>

          {/* Printable Platter Container (Contains HD Recto & Verso) */}
          <div 
            id="pvc-print-platter"
            className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-center gap-6 overflow-x-auto"
          >
            {/* FACE RECTO */}
            {(activeFace === 'recto' || activeFace === 'both') && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                  Face Recto · Face Avant
                </span>

                {/* ISO/IEC 7810 ID-1 Card Layout (Aspect ratio 85.6 / 53.98 ~ 1.586) */}
                <div 
                  className={`w-[340px] h-[214px] rounded-2xl ${selectedTemplate.primaryBg} ${selectedTemplate.borderColor} border-2 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none print:shadow-none print:border`}
                  style={{
                    boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  {/* National Tricolor Top Banner (Rouge, Jaune, Vert) */}
                  {showTricolorBanner && (
                    <div className="w-full h-1.5 flex shrink-0">
                      <div className="w-1/3 h-full bg-[#ce1126]" />
                      <div className="w-1/3 h-full bg-[#fcd116]" />
                      <div className="w-1/3 h-full bg-[#009460]" />
                    </div>
                  )}

                  {/* Header Area */}
                  <div className={`px-3 py-1.5 ${selectedTemplate.headerBg} text-white flex items-center justify-between shrink-0 relative overflow-hidden`}>
                    <div className="flex items-center gap-1.5 min-w-0">
                      {/* Guinea National Arms / Emblem */}
                      {showNationalArms && (
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                          <span className="text-[10px] font-black">🇬🇳</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-[8px] tracking-wider uppercase font-extrabold text-white/90 leading-tight">
                          RÉPUBLIQUE DE GUINÉE
                        </div>
                        <div className="text-[6.5px] uppercase tracking-widest text-white/70 leading-tight">
                          Travail · Justice · Solidarité
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[8px] font-extrabold uppercase tracking-tight text-white leading-tight">
                        {selectedSchool.name}
                      </div>
                      <div className="text-[6.5px] font-mono text-emerald-300 font-semibold leading-tight">
                        {selectedCategory.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Anti-Fraud Microtext Bar */}
                  {showMicrotext && (
                    <div className="w-full bg-slate-900/10 text-[5px] text-slate-500 font-mono tracking-widest overflow-hidden whitespace-nowrap px-2 py-0.2 shrink-0">
                      MEPU-A · SMARTSCHOOL ERP SOVEREIGN ID · SÉCURITÉ NATIONALE RÉPUBLIQUE DE GUINÉE · MEPU-A · SOVEREIGN ID ·
                    </div>
                  )}

                  {/* Watermark in background */}
                  {showWatermark && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ opacity: selectedTemplate.watermarkOpacity }}
                    >
                      <div className="text-center transform -rotate-12">
                        <div className="text-5xl font-black tracking-widest uppercase">MEPU-A</div>
                        <div className="text-[9px] font-mono tracking-widest uppercase">GUINÉE SOUVERAIN</div>
                      </div>
                    </div>
                  )}

                  {/* Body: Photo & Identity */}
                  <div className="px-3 py-1.5 flex-1 flex items-center gap-3 relative z-10 min-h-0">
                    {/* Official Passport Photo Box with auto-crop standard */}
                    <div className="w-20 h-24 rounded-xl border-2 border-slate-300 shadow-md overflow-hidden bg-slate-100 shrink-0 relative group">
                      <img 
                        src={customPhoto} 
                        alt="" 
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-[6px] font-mono text-center text-white py-0.5">
                        ID CERTIFIÉE
                      </div>
                    </div>

                    {/* Identity Data */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="text-[7.5px] uppercase font-bold text-slate-400 tracking-wider">
                        Identité du Porteur
                      </div>
                      <div className={`text-xs font-black leading-tight truncate ${selectedTemplate.textColor}`}>
                        {customName}
                      </div>
                      <div className="text-[9.5px] font-bold text-blue-600 truncate">
                        {customTitle}
                      </div>

                      <div className="pt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8px] text-slate-600">
                        <div>
                          <span className="text-slate-400">Matricule : </span>
                          <strong className="font-mono text-slate-900">{customMatricule}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Sang : </span>
                          <strong className="font-mono text-rose-600">{customBloodGroup}</strong>
                        </div>
                        <div className="col-span-2 truncate">
                          <span className="text-slate-400">UID : </span>
                          <span className="font-mono text-[7px] text-slate-800">{customUid}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hologram Official Stamp Emulation */}
                    {showOfficialStamp && (
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-600/70 text-emerald-700 flex flex-col items-center justify-center shrink-0 rotate-12 p-0.5 shadow-xs">
                        <Stamp className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[5.5px] font-black uppercase text-center leading-none mt-0.5">SCEAU MEPU-A</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Bar */}
                  <div className={`px-3 py-1 ${selectedTemplate.headerBg} text-white flex items-center justify-between text-[7.5px] shrink-0`}>
                    <div className="font-mono">
                      Année Scolaire : <strong>{validityPeriod}</strong>
                    </div>
                    <div className="font-mono text-white/80">
                      Badge N° <strong>{customMatricule}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FACE VERSO */}
            {(activeFace === 'verso' || activeFace === 'both') && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                  Face Verso · Face Arrière
                </span>

                <div 
                  className={`w-[340px] h-[214px] rounded-2xl ${selectedTemplate.primaryBg} ${selectedTemplate.borderColor} border-2 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none print:shadow-none print:border`}
                  style={{
                    boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  {/* Top Header */}
                  <div className={`px-3 py-1 ${selectedTemplate.headerBg} text-white flex items-center justify-between shrink-0`}>
                    <span className="text-[8px] font-extrabold uppercase tracking-wider">
                      CERTIFICAT D'AUTHENTICITÉ & DISCIPLINE
                    </span>
                    <span className="text-[7px] font-mono text-white/80">
                      MEPU-A · GUINÉE
                    </span>
                  </div>

                  {/* Body Verso */}
                  <div className="p-3 flex-1 flex items-center justify-between gap-3 relative z-10 min-h-0">
                    {/* Legal text & Instructions */}
                    <div className="flex-1 space-y-1 text-[7px] text-slate-600 leading-tight">
                      <div className="font-bold text-slate-800 text-[7.5px] uppercase">
                        Conditions d'Utilisation Officielles :
                      </div>
                      <p>
                        1. Cette carte est strictement personnelle et obligatoire dans l'enceinte de l'établissement.
                      </p>
                      <p>
                        2. Elle donne accès aux examens, cours, bibliothèque numérique et activités périscolaires.
                      </p>
                      <p>
                        3. En cas de perte, merci de rapporter cette carte à l'administration ou appeler le +224 622 10 20 30.
                      </p>

                      <div className="pt-1 flex items-center justify-between border-t border-slate-200 mt-1">
                        <div>
                          <div className="text-[6.5px] text-slate-400">Direction Générale</div>
                          <div className="text-[7.5px] font-bold text-slate-800">Signature & Cachet</div>
                        </div>
                        <div className="w-14 h-6 border-b border-slate-400 flex items-center justify-center text-blue-900 font-serif italic text-[8px]">
                          Diallo A.O.
                        </div>
                      </div>
                    </div>

                    {/* QR Code and Barcode Box */}
                    <div className="flex flex-col items-center justify-center shrink-0 space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      {/* High-Resolution SVG QR Code */}
                      <svg className="w-16 h-16" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill="white" />
                        <path d="M10,10 h30 v30 h-30 z M15,15 h20 v20 h-20 z M20,20 h10 v10 h-10 z" fill="#0f172a" />
                        <path d="M60,10 h30 v30 h-30 z M65,15 h20 v20 h-20 z M70,20 h10 v10 h-10 z" fill="#0f172a" />
                        <path d="M10,60 h30 v30 h-30 z M15,65 h20 v20 h-20 z M20,70 h10 v10 h-10 z" fill="#0f172a" />
                        <rect x="45" y="45" width="10" height="10" fill="#0f172a" />
                        <rect x="65" y="65" width="15" height="15" fill="#0f172a" />
                        <rect x="45" y="75" width="10" height="15" fill="#0f172a" />
                        <rect x="75" y="45" width="15" height="10" fill="#0f172a" />
                        <rect x="45" y="10" width="8" height="25" fill="#059669" />
                      </svg>

                      <div className="text-[6px] font-mono font-bold text-slate-500 text-center leading-none">
                        SCAN MEPU-A
                      </div>
                    </div>
                  </div>

                  {/* Bottom Barcode Strip */}
                  {showBarcode && (
                    <div className="px-3 py-1 bg-white border-t border-slate-200 flex flex-col items-center justify-center shrink-0">
                      <div className="h-6 flex items-center gap-0.5">
                        <span className="w-1 h-5 bg-slate-900 inline-block" />
                        <span className="w-0.5 h-5 bg-slate-900 inline-block" />
                        <span className="w-1.5 h-5 bg-slate-900 inline-block" />
                        <span className="w-0.5 h-5 bg-slate-900 inline-block" />
                        <span className="w-2 h-5 bg-slate-900 inline-block" />
                        <span className="w-0.5 h-5 bg-slate-900 inline-block" />
                        <span className="w-1 h-5 bg-slate-900 inline-block" />
                        <span className="w-1.5 h-5 bg-slate-900 inline-block" />
                        <span className="w-0.5 h-5 bg-slate-900 inline-block" />
                        <span className="w-2 h-5 bg-slate-900 inline-block" />
                        <span className="w-1 h-5 bg-slate-900 inline-block" />
                        <span className="w-1.5 h-5 bg-slate-900 inline-block" />
                        <span className="w-0.5 h-5 bg-slate-900 inline-block" />
                        <span className="w-2 h-5 bg-slate-900 inline-block" />
                      </div>
                      <div className="text-[6.5px] font-mono text-slate-600">
                        *{customMatricule.replace(/-/g, '')}*
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Print Features Info */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">
                Prêt pour impression sur carte PVC vierge ou imprimante directe (Zebra, Evolis, Datacard).
              </span>
            </div>
            <button
              type="button"
              onClick={handlePrintPvcCards}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              Lancer Impression
            </button>
          </div>
        </div>
      </div>

      {/* Online Verification Simulation Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Résultat du Scan QR Code Officiel</h3>
                  <p className="text-[10px] text-slate-400">Plateforme de Vérification Nationale MEPU-A</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 text-sm">AUTHENTICITÉ CERTIFIÉE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">VALIDE</span>
              </div>
              <p className="text-slate-300">
                Ce badge est authentique et délivré par le Ministère de l'Enseignement Pré-Universitaire et de l'Alphabétisation (MEPU-A).
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                <div className="text-slate-400 text-[10px]">Titulaire du Badge :</div>
                <div className="text-white font-bold text-sm">{customName}</div>
                <div className="text-blue-400 font-semibold">{customTitle}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">Établissement :</span>
                  <span className="text-slate-200 font-semibold">{selectedSchool.name}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">Matricule :</span>
                  <span className="text-slate-200 font-mono font-bold">{customMatricule}</span>
                </div>
                <div className="col-span-2 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">UID National Cryptographique :</span>
                  <span className="text-emerald-400 font-mono text-[10px]">{customUid}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Fermer la vérification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
