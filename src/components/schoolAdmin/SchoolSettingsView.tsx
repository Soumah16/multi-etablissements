import React, { useState, useEffect } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { useApp } from '../../context/AppContext';
import { Building2, Save, KeyRound, Globe, Phone, Mail, MapPin, Check, MessageCircle, ExternalLink } from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';
import { buildWhatsAppUrl, getSchoolWhatsAppNumber } from '../../utils/whatsapp';

export const SchoolSettingsView: React.FC = () => {
  const { currentSchool, executeWithPin } = useSchoolAdmin();
  const { updateSchool, showToast } = useApp();

  const [name, setName] = useState(currentSchool.name);
  const [logo, setLogo] = useState(currentSchool.logo);
  const [banner, setBanner] = useState(currentSchool.banner || '');
  const [address, setAddress] = useState(currentSchool.address);
  const [phone, setPhone] = useState(currentSchool.phone);
  const [whatsappNumber, setWhatsappNumber] = useState(getSchoolWhatsAppNumber(currentSchool));
  const [email, setEmail] = useState(currentSchool.email);
  const [website, setWebsite] = useState(currentSchool.website);
  const [language, setLanguage] = useState(currentSchool.primaryLanguage);
  const [currency, setCurrency] = useState('GNF');

  useEffect(() => {
    setName(currentSchool.name);
    setLogo(currentSchool.logo);
    setBanner(currentSchool.banner || '');
    setAddress(currentSchool.address);
    setPhone(currentSchool.phone);
    setWhatsappNumber(getSchoolWhatsAppNumber(currentSchool));
    setEmail(currentSchool.email);
    setWebsite(currentSchool.website);
    setLanguage(currentSchool.primaryLanguage);
  }, [currentSchool]);

  const testWaUrl = buildWhatsAppUrl(
    whatsappNumber,
    `Bonjour ${name}, test de redirection WhatsApp officiel de votre établissement sur SmartSchool ERP.`
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    executeWithPin("Modifier les paramètres officiels de l'établissement", () => {
      updateSchool(currentSchool.id, {
        name,
        logo,
        banner,
        address,
        phone,
        whatsappNumber: whatsappNumber.trim() || phone.trim(),
        email,
        website,
        primaryLanguage: language,
        currency
      });
      showToast("Paramètres et numéro WhatsApp de l'école mis à jour avec succès !");
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950">
            Paramètres de l'Établissement ({currentSchool.name})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configuration institutionnelle, coordonnées de contact, numéro WhatsApp dédié à votre école, langue et devise légale
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white border border-blue-100 space-y-6 text-xs max-w-4xl">
        {/* Identité */}
        <div className="space-y-4">
          <h3 className="font-bold text-blue-950 text-xs uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-2">
            1. Identité Officielle de l'Établissement
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Nom de l'école *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Code Unique de l'Établissement</label>
              <input
                type="text"
                readOnly
                value={currentSchool.code}
                className="w-full px-3 py-2 rounded-lg bg-blue-50/60 border border-slate-200 text-slate-500 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploadField
              label="Logo Officiel de l'École"
              value={logo}
              onChange={setLogo}
              aspectRatio="square"
              placeholder="https://.../logo.png"
              helperText="Importez depuis votre PC ou collez un lien. Apparaît sur vos documents et bulletins."
            />

            <ImageUploadField
              label="Bannière d'En-tête"
              value={banner}
              onChange={setBanner}
              aspectRatio="banner"
              placeholder="https://.../banner.jpg"
              helperText="Bannière panoramique officielle de votre établissement."
            />
          </div>
        </div>

        {/* Contacts & WhatsApp */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-blue-950 text-xs uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-2">
            2. Coordonnées, Localisation & WhatsApp de l'École
          </h3>

          <div className="space-y-1">
            <label className="text-slate-700 font-medium">Adresse physique complète</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Téléphone standard</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Email institutionnel</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Site Web officiel</label>
              <input
                type="text"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Dedicated WhatsApp Configuration Card */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-emerald-950">Numéro WhatsApp Officiel de {currentSchool.name}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold self-start sm:self-auto">
                Propre à cet établissement
              </span>
            </div>
            <p className="text-[11px] text-emerald-900/80">
              Chaque école dispose de son propre numéro WhatsApp défini par son Admin École. Tous les boutons WhatsApp destinés aux parents, élèves et personnels de <strong>{currentSchool.name}</strong> redirigent directement vers ce numéro.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="text"
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                placeholder="+224 6XX XX XX XX"
                className="flex-1 px-3 py-2 rounded-lg bg-white border border-emerald-300 text-emerald-950 font-mono font-bold focus:outline-none focus:border-emerald-600"
              />
              {testWaUrl ? (
                <a
                  href={testWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Tester dans WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[11px] text-amber-700 font-medium px-2">
                  Saisissez un numéro valide (ex: +224 622 10 20 30)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Régionalisation */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-blue-950 text-xs uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-2">
            3. Paramètres Régionaux (Par Défaut)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Langue principale</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              >
                <option value="fr">Français (Par défaut)</option>
                <option value="en">English</option>
                <option value="ar">العربية (Franco-Arabe)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Devise de l'école</label>
              <input
                type="text"
                readOnly
                value="GNF (Franc Guinéen)"
                className="w-full px-3 py-2 rounded-lg bg-blue-50/60 border border-slate-200 text-emerald-600 font-mono font-bold cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Fuseau horaire</label>
              <input
                type="text"
                readOnly
                value="Africa/Conakry (GMT)"
                className="w-full px-3 py-2 rounded-lg bg-blue-50/60 border border-slate-200 text-blue-700 font-mono cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center gap-2.5">
          <KeyRound className="w-4 h-4 shrink-0" />
          <span>Sécurité : La modification des paramètres de l'école exige la saisie de votre code PIN Administrateur à 6 chiffres.</span>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Valider avec Code PIN</span>
          </button>
        </div>
      </form>
    </div>
  );
};
