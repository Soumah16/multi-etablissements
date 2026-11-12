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
  Power
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';

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
      sessionTimeoutMinutes
    });
    showToast("Paramètres globaux sauvegardés avec succès !");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t.nav.settings}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Contrôle global de l'infrastructure, marque blanche, passerelles SMS/Email et internationalisation
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Platform Branding */}
        <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60">
            <Palette className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold text-white">
              Identité & Marque Blanche Plateforme
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Nom public de la plateforme *</label>
              <input
                type="text"
                required
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
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
              <span className="text-xs text-slate-300">Couleur d'accentuation principale :</span>
              <input
                type="color"
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-400">{primaryColor}</span>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <span className="text-xs text-slate-300">Délai d'inactivité avant déconnexion :</span>
              <input
                type="number"
                value={sessionTimeoutMinutes}
                onChange={e => setSessionTimeoutMinutes(Number(e.target.value))}
                className="w-20 px-2 py-1 text-xs rounded bg-slate-900 border border-slate-700 text-white font-mono"
              />
              <span className="text-xs text-slate-400">minutes</span>
            </div>
          </div>
        </div>

        {/* Section 2: Gateways & Notifications */}
        <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60">
            <Mail className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">
              Passerelles de Notification & Envois de Messages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Email expéditeur système (SMTP)</label>
              <input
                type="email"
                value={systemEmail}
                onChange={e => setSystemEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Serveur SMTP Hôte</label>
              <input
                type="text"
                value={smtpHost}
                onChange={e => setSmtpHost(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Port SMTP</label>
              <input
                type="number"
                value={smtpPort}
                onChange={e => setSmtpPort(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>

          {/* Toggles for SMS & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Passerelle SMS Guinée</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{smsProvider}</div>
              </div>
              <input
                type="checkbox"
                checked={smsGatewayEnabled}
                onChange={e => setSmsGatewayEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-800"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">WhatsApp Business API</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Envoi automatique de notifications de présence</div>
              </div>
              <input
                type="checkbox"
                checked={whatsAppEnabled}
                onChange={e => setWhatsAppEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-green-600 bg-slate-800"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Notifications Push Web/Mobile</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Alertes instantanées sur smartphones</div>
              </div>
              <input
                type="checkbox"
                checked={pushNotificationsEnabled}
                onChange={e => setPushNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Multi-Language Configuration */}
        <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">
              Gestion des Langues Internationales & Support Arabe RTL
            </h2>
          </div>

          <p className="text-xs text-slate-300">
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
                className="p-3 rounded-lg bg-slate-900 border border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-white">{l.flag}</div>
                  <div className="text-[11px] text-slate-300 mt-1 font-medium">{l.label}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className={`text-[10px] font-semibold ${enabledLanguages[l.code] ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {enabledLanguages[l.code] ? 'Actif' : 'Désactivé'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleLanguageStatus(l.code)}
                    disabled={l.code === 'fr'}
                    className="text-[10px] text-slate-400 hover:text-white underline disabled:opacity-40"
                  >
                    Basculer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Maintenance Mode */}
        <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between text-xs">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-sm">
                Mode Maintenance Plateforme
              </div>
              <p className="text-slate-300 mt-0.5">
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
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
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
