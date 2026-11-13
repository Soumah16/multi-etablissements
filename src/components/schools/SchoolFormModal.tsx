import React, { useState, useEffect } from 'react';
import { School, SchoolType, SubscriptionTierId, LanguageCode } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Building2, Globe, Shield, Calendar, Image as ImageIcon } from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';

interface SchoolFormModalProps {
  schoolToEdit?: School | null;
  onClose: () => void;
}

export const SchoolFormModal: React.FC<SchoolFormModalProps> = ({ schoolToEdit, onClose }) => {
  const { createSchool, updateSchool, plans, t } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<SchoolType>('Lycée');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Conakry');
  const [prefecture, setPrefecture] = useState('Kaloum');
  const [country, setCountry] = useState('Guinée');
  const [phone, setPhone] = useState('+224 ');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('https://');
  const [currency, setCurrency] = useState('GNF');
  const [primaryLanguage, setPrimaryLanguage] = useState<LanguageCode>('fr');
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTierId>('standard');
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState('');
  const [status, setStatus] = useState<'active' | 'suspended' | 'archived'>('active');

  useEffect(() => {
    if (schoolToEdit) {
      setName(schoolToEdit.name);
      setCode(schoolToEdit.code);
      setType(schoolToEdit.type);
      setLogo(schoolToEdit.logo || '');
      setBanner(schoolToEdit.banner || '');
      setAddress(schoolToEdit.address);
      setCity(schoolToEdit.city);
      setPrefecture(schoolToEdit.prefecture);
      setCountry(schoolToEdit.country);
      setPhone(schoolToEdit.phone);
      setEmail(schoolToEdit.email);
      setWebsite(schoolToEdit.website);
      setCurrency(schoolToEdit.currency);
      setPrimaryLanguage(schoolToEdit.primaryLanguage);
      setSubscriptionTier(schoolToEdit.subscriptionTier);
      setSubscriptionExpiresAt(schoolToEdit.subscriptionExpiresAt);
      setStatus(schoolToEdit.status);
    } else {
      // Default expiry 1 year ahead
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setSubscriptionExpiresAt(nextYear.toISOString().split('T')[0]);
      setLogo('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80');
      setBanner('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80');
    }
  }, [schoolToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (schoolToEdit) {
      updateSchool(schoolToEdit.id, {
        name,
        code: code || name.substring(0, 4).toUpperCase(),
        type,
        logo,
        banner,
        address,
        city,
        prefecture,
        country,
        phone,
        email,
        website,
        currency,
        primaryLanguage,
        subscriptionTier,
        subscriptionExpiresAt,
        status
      });
    } else {
      createSchool({
        name,
        code: code || name.substring(0, 4).toUpperCase(),
        type,
        logo,
        banner,
        address,
        city,
        prefecture,
        country,
        phone,
        email,
        website,
        currency,
        primaryLanguage,
        subscriptionTier,
        subscriptionExpiresAt,
        status
      });
    }
    onClose();
  };

  const schoolTypes: SchoolType[] = [
    'Primaire',
    'Collège',
    'Lycée',
    'Université',
    'Institut professionnel',
    'Centre de formation'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/55 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-blue-100 bg-blue-50/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-950">
                {schoolToEdit ? 'Modifier l\'Établissement' : 'Créer un Nouvel Établissement'}
              </h2>
              <p className="text-xs text-slate-500">
                Configuration multi-tenant avec isolation automatique school_id
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-950 hover:bg-blue-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Section: Identité */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              1. Informations Générales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Nom officiel de l'école <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Complexe Scolaire Belle-Vue"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Code abrégé</label>
                <input
                  type="text"
                  placeholder="Ex: CS-BV"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 uppercase focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Type d'établissement</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as SchoolType)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                >
                  {schoolTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Langue principale</label>
                <select
                  value={primaryLanguage}
                  onChange={e => setPrimaryLanguage(e.target.value as LanguageCode)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="ar">Arabe (Franco-Arabe)</option>
                  <option value="es">Espagnol</option>
                  <option value="pt">Portugais</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Devise de facturation</label>
                <input
                  type="text"
                  value={currency}
                  readOnly
                  className="w-full px-3 py-2 text-xs rounded-lg bg-blue-50/60 border border-slate-200 text-slate-500 font-mono cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section: Localisation & Contact */}
          <div className="space-y-3 pt-3 border-t border-blue-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              2. Localisation & Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Ville</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Conakry, Kankan, Kindia, Labé..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Préfecture / Commune</label>
                <input
                  type="text"
                  value={prefecture}
                  onChange={e => setPrefecture(e.target.value)}
                  placeholder="Kaloum, Dixinn, Matam..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Pays</label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Adresse géographique complète</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Ex: Quartier Almamya, Rue KA-020"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Téléphone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+224 621 ..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Email institutionnel</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="direction@ecole.edu.gn"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Site Web</label>
                <input
                  type="text"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Abonnement & Statut */}
          <div className="space-y-3 pt-3 border-t border-blue-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              3. Abonnement & Gouvernance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Formule d'abonnement</label>
                <select
                  value={subscriptionTier}
                  onChange={e => setSubscriptionTier(e.target.value as SubscriptionTierId)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.priceMonthlyGnf === 0 ? 'Gratuit' : `${p.priceMonthlyGnf.toLocaleString('fr-FR')} GNF/mois`})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Date d'expiration</label>
                <input
                  type="date"
                  value={subscriptionExpiresAt}
                  onChange={e => setSubscriptionExpiresAt(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Statut d'accès</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
                >
                  <option value="active">Actif (Accès autorisé)</option>
                  <option value="suspended">Suspendu (Accès bloqué)</option>
                  <option value="archived">Archivé (Lecture seule)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Visuels */}
          <div className="space-y-4 pt-3 border-t border-blue-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              4. Visuels & Identité
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploadField
                label="Logo Officiel de l'École"
                value={logo}
                onChange={setLogo}
                aspectRatio="square"
                placeholder="https://.../logo.png"
                helperText="Affiché sur les badges, factures et documents officiels."
              />

              <ImageUploadField
                label="Bannière d'En-tête de l'Établissement"
                value={banner}
                onChange={setBanner}
                aspectRatio="banner"
                placeholder="https://.../banner.jpg"
                helperText="Bannière panoramique du portail et des fiches d'audit."
              />
            </div>
          </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-3.5 border-t border-blue-100 bg-white flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-blue-950 rounded-lg bg-slate-50 hover:bg-blue-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/30 transition-colors"
            >
              {schoolToEdit ? 'Enregistrer les modifications' : 'Créer l\'établissement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
