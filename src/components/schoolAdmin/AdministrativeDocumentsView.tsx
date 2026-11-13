import React, { useState } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { AdministrativeDocumentTemplate } from '../../types';
import { 
  FileText, 
  Printer, 
  Check, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  Award, 
  X,
  FileCheck
} from 'lucide-react';
import { triggerPrint } from '../../utils/printHelper';

export const AdministrativeDocumentsView: React.FC = () => {
  const { documentTemplates, updateDocumentTemplate, currentSchool } = useSchoolAdmin();

  const [selectedDocId, setSelectedDocId] = useState(documentTemplates[0]?.id || '');
  const activeTemplate = documentTemplates.find(d => d.id === selectedDocId) || documentTemplates[0];

  const [headerText, setHeaderText] = useState(activeTemplate.headerText);
  const [footerText, setFooterText] = useState(activeTemplate.footerText);
  const [signatoryTitle, setSignatoryTitle] = useState(activeTemplate.signatoryTitle);
  const [signatoryName, setSignatoryName] = useState(activeTemplate.signatoryName);
  const [includeStamp, setIncludeStamp] = useState(activeTemplate.includeStamp);
  const [themeColor, setThemeColor] = useState(activeTemplate.themeColor);

  const handleSelectDoc = (doc: AdministrativeDocumentTemplate) => {
    setSelectedDocId(doc.id);
    setHeaderText(doc.headerText);
    setFooterText(doc.footerText);
    setSignatoryTitle(doc.signatoryTitle);
    setSignatoryName(doc.signatoryName);
    setIncludeStamp(doc.includeStamp);
    setThemeColor(doc.themeColor);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDocumentTemplate(activeTemplate.id, {
      headerText,
      footerText,
      signatoryTitle,
      signatoryName,
      includeStamp,
      themeColor
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950">
            Documents Administratifs & Modèles Officiels
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gabarits paramétrables pour certificats de scolarité, attestations d'inscription et modèles de bulletins
          </p>
        </div>

        <button
          onClick={() => triggerPrint('admin-specimen-printable', `Document_${activeTemplate.title.replace(/\s+/g, '_')}`)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4 text-blue-950" />
          <span>Imprimer Spécimen Officiel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Select & Form */}
        <div className="lg:col-span-5 space-y-4">
          {/* Doc Type Selector */}
          <div className="p-4 rounded-xl bg-white border border-blue-100 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Modèle de Document à Personnaliser
            </span>
            <div className="space-y-1.5">
              {documentTemplates.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleSelectDoc(doc)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left text-xs transition-colors ${
                    selectedDocId === doc.id
                      ? 'bg-blue-50 border-blue-500 text-blue-950 font-bold'
                      : 'bg-blue-50/60 border-slate-200 text-slate-700 hover:text-blue-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>{doc.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Prêt</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-5 rounded-xl bg-white border border-blue-100 space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-slate-700 font-medium">En-tête officiel / République *</label>
              <textarea
                rows={2}
                required
                value={headerText}
                onChange={e => setHeaderText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Titre du signataire</label>
                <input
                  type="text"
                  value={signatoryTitle}
                  onChange={e => setSignatoryTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">Nom du signataire</label>
                <input
                  type="text"
                  value={signatoryName}
                  onChange={e => setSignatoryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Mentions de bas de page (Pied de document)</label>
              <textarea
                rows={2}
                value={footerText}
                onChange={e => setFooterText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-700 font-medium">Apposer le tampon rond officiel</span>
              <input
                type="checkbox"
                checked={includeStamp}
                onChange={e => setIncludeStamp(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-50 border-slate-200"
              />
            </div>

            <div className="pt-3 border-t border-blue-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-xs shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer les Modifications</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Printable Specimen View */}
        <div className="lg:col-span-7 space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Aperçu Direct du Document Certifié Conforme
          </div>

          <div id="admin-specimen-printable" className="p-8 rounded-xl bg-white text-slate-900 shadow-2xl border border-slate-300 min-h-[500px] flex flex-col justify-between relative select-none">
            {/* Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <div className="w-72 h-72 rounded-full border-8 border-slate-900 flex items-center justify-center font-extrabold text-2xl text-center p-4">
                SMARTSCHOOL GUINÉE
              </div>
            </div>

            {/* Document Header */}
            <div>
              <div className="text-center pb-4 border-b-2 border-slate-900">
                <div className="text-[10px] font-bold tracking-widest text-slate-800 uppercase">
                  {headerText}
                </div>
                <div className="mt-1 text-sm font-extrabold uppercase text-slate-900">
                  {currentSchool.name}
                </div>
                <div className="text-[10px] text-slate-600">
                  {currentSchool.address} · Tel : {currentSchool.phone} · Conakry, Guinée
                </div>
              </div>

              {/* Document Title Banner */}
              <div className="my-6 text-center">
                <span className="inline-block px-6 py-1.5 border-2 border-slate-900 font-extrabold text-sm uppercase tracking-wider bg-slate-50">
                  {activeTemplate.title}
                </span>
                <div className="text-[11px] text-slate-500 font-mono mt-2">
                  Réf : {currentSchool.code}-2026-DOC-0849
                </div>
              </div>

              {/* Body prose specimen */}
              <div className="text-xs text-slate-800 leading-relaxed space-y-3 px-4">
                <p>
                  Le Directeur des Études de l'établissement soussigné certifie par la présente que l'élève :
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-900 space-y-1 font-mono text-[11px]">
                  <div>Nom & Prénom : <strong>CAMARA Mohamed Sékou</strong></div>
                  <div>Matricule Établissement : <strong>{currentSchool.code}-2026-9042</strong></div>
                  <div>Inscrit en classe de : <strong>Terminale Sciences Mathématiques 1</strong></div>
                  <div>Année Scolaire : <strong>2026-2027</strong></div>
                </div>
                <p>
                  Est régulièrement inscrit sur les registres scolaires de notre établissement pour l'année en cours et s'acquitte scrupuleusement de ses obligations académiques.
                </p>
              </div>
            </div>

            {/* Document Footer: Stamp & Signature */}
            <div className="mt-8 pt-4 border-t border-slate-300 flex items-end justify-between px-4 text-xs">
              <div className="text-[10px] text-slate-500 max-w-xs">
                {footerText}
              </div>

              <div className="text-center relative">
                {includeStamp && (
                  <div className="absolute -top-10 -left-6 w-24 h-24 rounded-full border-2 border-red-700/60 text-red-700 flex flex-col items-center justify-center rotate-[-12deg] pointer-events-none text-[8px] font-bold p-1 uppercase opacity-85">
                    <span>* SMARTSCHOOL *</span>
                    <span>TAMPON OFFICIEL</span>
                    <span>{currentSchool.code}</span>
                  </div>
                )}
                <div className="text-[11px] font-bold text-slate-900">
                  {signatoryTitle}
                </div>
                <div className="h-10 flex items-center justify-center font-serif text-sm italic text-blue-900">
                  {signatoryName}
                </div>
                <div className="text-[9px] text-slate-500">
                  Cachet et signature
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
