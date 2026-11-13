import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sliders, 
  Globe, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  Bell, 
  ShieldAlert, 
  Check, 
  Palette,
  Power,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';
import { LanguageCode, HomepagePhotosConfig } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';
import defaultHeroImg from '../../assets/images/guinea_school_hero_1794497471323.jpg';
import defaultClassroomImg from '../../assets/images/students_modern_classroom_1794497472286.jpg';
import defaultTeacherImg from '../../assets/images/teacher_excellence_portrait_1794497472066.jpg';
import defaultLibraryImg from '../../assets/images/library_students_reading_1794497472173.jpg';

const DEFAULT_HOMEPAGE_PREVIEWS: Record<keyof HomepagePhotosConfig, string> = {
  hero: defaultHeroImg,
  classroom: defaultClassroomImg,
  teacher: defaultTeacherImg,
  library: defaultLibraryImg,
};

export const GlobalSettingsView: React.FC = () => {
  const { settings, updateSettings, language, setLanguage, t, showToast } = useApp();

  const [platformName, setPlatformName] = useState(settings.platformName);
  const [platformLogo, setPlatformLogo] = useState(settings.platformLogo);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [systemEmail, setSystemEmail] = useState(settings.systemEmail);
  const [smtpHost, setSmtpHost] = useState(settings.smtpHost);
  const [smtpPort, setSmtpPort] = useState(settings.smtpPort);
  const [smsGatewayEnabled, setSmsGatewayEnabled] = useState(settings.smsGatewayEnabled);
  const [smsProvider, setSmsProvider] = useState(settings.smsProvider);
  const [whatsAppEnabled, setWhatsAppEnabled] = useState(settings.whatsAppEnabled);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(settings.pushNotificationsEnabled);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(settings.sessionTimeoutMinutes);
  const [homepagePhotos, setHomepagePhotos] = useState<HomepagePhotosConfig>({
    hero: settings.homepagePhotos?.hero || '',
    classroom: settings.homepagePhotos?.classroom || '',
    teacher: settings.homepagePhotos?.teacher || '',
    library: settings.homepagePhotos?.library || '',
  });

  // Active languages toggles
  const [enabledLanguages, setEnabledLanguages] = useState<Record<LanguageCode, boolean>>({
    fr: true,
    en: true,
    ar: true,
    es: true,
    pt: true
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      platformName,
      platformLogo,
      primaryColor,
      systemEmail,
      smtpHost,
      smtpPort,
      smsGatewayEnabled,
      smsProvider,
      whatsAppEnabled,
      pushNotificationsEnabled,
      maintenanceMode,
      sessionTimeoutMinutes,
      homepagePhotos,
    });
    showToast("Paramètres globaux et photos d'accueil sauvegardés avec succès !");
  };

  const handleSavePhotosOnly = () => {
    updateSettings({ homepagePhotos });
    showToast("Photos de la page d'accueil mises à jour et publiées !");
  };

  const handleResetAllPhotos = () => {
    const emptyPhotos: HomepagePhotosConfig = { hero: '', classroom: '', teacher: '', library: '' };
    setHomepagePhotos(emptyPhotos);
    updateSettings({ homepagePhotos: emptyPhotos });
    showToast("Photos d'accueil réinitialisées aux images officielles par défaut.");
  };

  const toggleLanguageStatus = (code: LanguageCode) => {
    if (code === 'fr') {
      alert("La langue principale française ne peut pas être désactivée.");
      return;
    }
    setEnabledLanguages(prev => ({ ...prev, [code]: !prev[code] }));
    showToast(`Langue ${code.toUpperCase()} ${!enabledLanguages[code] ? 'activée' : 'désactivée'}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950">
            {t.nav.settings}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Contrôle global de l'infrastructure, marque blanche, passerelles SMS/Email et internationalisation
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 0: Homepage Photos Manager (Super Admin Exclusive) */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-blue-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-blue-950">
                  Photos de la Page d'Accueil (Portail Public)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Modifiez les 4 images affichées aux visiteurs sur la page d'accueil et de connexion (depuis votre PC, téléphone ou via lien URL).
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetAllPhotos}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser par défaut</span>
              </button>
              <button
                type="button"
                onClick={handleSavePhotosOnly}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Publier les Photos</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(
              [
                {
                  key: 'hero' as const,
                  title: "Photo Principale (Bannière d'Accueil)",
                  hint: "Affichée en grand à droite du titre sur la page d'accueil.",
                },
                {
                  key: 'classroom' as const,
                  title: 'Carte 1 : Élèves & Pédagogie (Classe)',
                  hint: 'Affichée sur la carte « Saisie des Notes & Bulletins Officiels ».',
                },
                {
                  key: 'teacher' as const,
                  title: 'Carte 2 : Corps Enseignant & Cartes PVC',
                  hint: 'Affichée sur la carte « Cartes Scolaires PVC & Emplois du Temps ».',
                },
                {
                  key: 'library' as const,
                  title: 'Carte 3 : Bibliothèque & Savoir',
                  hint: 'Affichée sur la carte « Bibliothèque Numérique & Vrais Livres ».',
                },
              ]
            ).map((slot) => {
              const currentValue = homepagePhotos[slot.key];
              const previewSrc = currentValue?.trim() || DEFAULT_HOMEPAGE_PREVIEWS[slot.key];
              const isCustom = Boolean(currentValue?.trim());

              return (
                <div
                  key={slot.key}
                  className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-100 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-14 rounded-lg overflow-hidden border border-blue-200 bg-white shrink-0">
                      <img
                        src={previewSrc}
                        alt={slot.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-950 truncate">{slot.title}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                            isCustom
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isCustom ? 'Personnalisée' : 'Par défaut'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{slot.hint}</p>
                      {isCustom && (
                        <button
                          type="button"
                          onClick={() =>
                            setHomepagePhotos((prev) => ({ ...prev, [slot.key]: '' }))
                          }
                          className="text-[10px] text-blue-700 hover:underline font-semibold mt-1 cursor-pointer"
                        >
                          Revenir à l'image par défaut
                        </button>
                      )}
                    </div>
                  </div>

                  <ImageUploadField
                    label="Choisir une nouvelle photo"
                    value={currentValue}
                    onChange={(val) =>
                      setHomepagePhotos((prev) => ({ ...prev, [slot.key]: val }))
                    }
                    aspectRatio="banner"
                    placeholder="https://.../photo.jpg"
                    helperText="Importez une image depuis votre PC/Téléphone (compressée automatiquement) ou collez un lien HTTPS."
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 1: Platform Branding */}
        <div className="p-5 rounded-xl bg-blue-50/60 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Palette className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-blue-950">
              Identité & Marque Blanche Plateforme
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Nom public de la plateforme *</label>
              <input
                type="text"
                required
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950 focus:outline-none focus:border-blue-500"
              />
            </div>

            <ImageUploadField
              label="Logo Officiel de la Plateforme"
              value={platformLogo}
              onChange={setPlatformLogo}
              aspectRatio="square"
              placeholder="https://.../logo.png"
              helperText="Importez depuis votre PC ou saisissez un lien web."
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-700">Couleur d'accentuation principale :</span>
              <input
                type="color"
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                className="w-8 h-8 rounded border border-slate-200 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-500">{primaryColor}</span>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <span className="text-xs text-slate-700">Délai d'inactivité avant déconnexion :</span>
              <input
                type="number"
                value={sessionTimeoutMinutes}
                onChange={e => setSessionTimeoutMinutes(Number(e.target.value))}
                className="w-20 px-2 py-1 text-xs rounded bg-white border border-slate-200 text-blue-950 font-mono"
              />
              <span className="text-xs text-slate-500">minutes</span>
            </div>
          </div>
        </div>

        {/* Section 2: Gateways & Notifications */}
        <div className="p-5 rounded-xl bg-blue-50/60 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Mail className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-blue-950">
              Passerelles de Notification & Envois de Messages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Email expéditeur système (SMTP)</label>
              <input
                type="email"
                value={systemEmail}
                onChange={e => setSystemEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Serveur SMTP Hôte</label>
              <input
                type="text"
                value={smtpHost}
                onChange={e => setSmtpHost(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Port SMTP</label>
              <input
                type="number"
                value={smtpPort}
                onChange={e => setSmtpPort(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950 font-mono"
              />
            </div>
          </div>

          {/* Toggles for SMS & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-semibold text-blue-950">Passerelle SMS Guinée</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{smsProvider}</div>
              </div>
              <input
                type="checkbox"
                checked={smsGatewayEnabled}
                onChange={e => setSmsGatewayEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-50"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-semibold text-blue-950">WhatsApp Business API</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Envoi automatique de notifications de présence</div>
              </div>
              <input
                type="checkbox"
                checked={whatsAppEnabled}
                onChange={e => setWhatsAppEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-green-600 bg-slate-50"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-semibold text-blue-950">Notifications Push Web/Mobile</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Alertes instantanées sur smartphones</div>
              </div>
              <input
                type="checkbox"
                checked={pushNotificationsEnabled}
                onChange={e => setPushNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Multi-Language Configuration */}
        <div className="p-5 rounded-xl bg-blue-50/60 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Globe className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-blue-950">
              Gestion des Langues Internationales & Support Arabe RTL
            </h2>
          </div>

          <p className="text-xs text-slate-700">
            Le Super Admin peut activer ou désactiver chaque dictionnaire de traduction pour adapter la plateforme aux régions bilingues (Franco-Arabe, etc.) :
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {[
              { code: 'fr' as LanguageCode, label: 'Français (Guinée)', flag: '🇬🇳 FR' },
              { code: 'en' as LanguageCode, label: 'English (UK/US)', flag: '🇬🇧 EN' },
              { code: 'ar' as LanguageCode, label: 'العربية (RTL Complet)', flag: '🇸🇦 AR' },
              { code: 'es' as LanguageCode, label: 'Español', flag: '🇪🇸 ES' },
              { code: 'pt' as LanguageCode, label: 'Português', flag: '🇵🇹 PT' }
            ].map(l => (
              <div 
                key={l.code}
                className="p-3 rounded-lg bg-white border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-blue-950">{l.flag}</div>
                  <div className="text-[11px] text-slate-700 mt-1 font-medium">{l.label}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-blue-100 flex items-center justify-between">
                  <span className={`text-[10px] font-semibold ${enabledLanguages[l.code] ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {enabledLanguages[l.code] ? 'Actif' : 'Désactivé'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleLanguageStatus(l.code)}
                    disabled={l.code === 'fr'}
                    className="text-[10px] text-slate-500 hover:text-blue-950 underline disabled:opacity-40"
                  >
                    Basculer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Maintenance Mode */}
        <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-blue-950 text-sm">
                Mode Maintenance Plateforme
              </div>
              <p className="text-slate-700 mt-0.5">
                Lorsqu'il est activé, tous les élèves, enseignants et parents voient une page d'information. Seul le Super Admin conserve l'accès.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = !maintenanceMode;
              setMaintenanceMode(next);
              showToast(`Mode maintenance ${next ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`);
            }}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              maintenanceMode 
                ? 'bg-rose-600 text-white' 
                : 'bg-slate-50 hover:bg-blue-100 text-slate-700'
            }`}
          >
            {maintenanceMode ? 'Mode Maintenance Actif' : 'Activer Maintenance'}
          </button>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Enregistrer Tous les Paramètres Globaux</span>
          </button>
        </div>
      </form>
    </div>
  );
};
