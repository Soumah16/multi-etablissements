import React, { useState } from 'react';
import { useSchoolAdmin } from '../../context/SchoolAdminContext';
import { useApp } from '../../context/AppContext';
import { Building2, Save, KeyRound, Globe, Phone, Mail, MapPin, Check } from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';

export const SchoolSettingsView: React.FC = () => {
  const { currentSchool, executeWithPin } = useSchoolAdmin();
  const { updateSchool, showToast } = useApp();

  const [name, setName] = useState(currentSchool.name);
  const [logo, setLogo] = useState(currentSchool.logo);
  const [banner, setBanner] = useState(currentSchool.banner || '');
  const [address, setAddress] = useState(currentSchool.address);
  const [phone, setPhone] = useState(currentSchool.phone);
  const [email, setEmail] = useState(currentSchool.email);
  const [website, setWebsite] = useState(currentSchool.website);
  const [language, setLanguage] = useState(currentSchool.primaryLanguage);
  const [currency, setCurrency] = useState('GNF');
  const [timezone, setTimezone] = useState('Africa/Conakry');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    executeWithPin("Modifier les paramètres officiels de l'établissement", () => {
      updateSchool(currentSchool.id, {
        name,
        logo,
        banner,
        address,
        phone,
        email,
        website,
        primaryLanguage: language,
        currency
      });
      showToast("Paramètres de l'école mis à jour avec succès !");
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Paramètres de l'Établissement ({currentSchool.name})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configuration institutionnelle, coordonnées de contact, langue, devise légale et fuseau horaire
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-xs max-w-4xl">
        {/* Identité */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2">
            1. Identité Officielle de l'Établissement
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Nom de l'école *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Code Unique de l'Établissement</label>
              <input
                type="text"
                readOnly
                value={currentSchool.code}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700 text-slate-500 font-mono cursor-not-allowed"
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

        {/* Contacts */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2">
            2. Coordonnées & Localisation
          </h3>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Adresse physique complète</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Téléphone standard</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Email institutionnel</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Site Web officiel</label>
              <input
                type="text"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Régionalisation */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2">
            3. Paramètres Régionaux (Par Défaut)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Langue principale</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="fr">Français (Par défaut)</option>
                <option value="en">English</option>
                <option value="ar">العربية (Franco-Arabe)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Devise de l'école</label>
              <input
                type="text"
                readOnly
                value="GNF (Franc Guinéen)"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700 text-emerald-400 font-mono font-bold cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Fuseau horaire</label>
              <input
                type="text"
                readOnly
                value="Africa/Conakry (GMT)"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700 text-blue-300 font-mono cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-2.5">
          <KeyRound className="w-4 h-4 shrink-0" />
          <span>Sécurité : La modification des paramètres de l'école exige la saisie de votre code PIN Administrateur à 6 chiffres.</span>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Valider avec Code PIN</span>
          </button>
        </div>
      </form>
    </div>
  );
};
