import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Monitor, Apple, Share, PlusSquare, MoreVertical, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'hero' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeDeviceTab, setActiveDeviceTab] = useState<'android' | 'ios' | 'desktop'>('desktop');

  useEffect(() => {
    if (isIOS) setActiveDeviceTab('ios');
    else if (isAndroid) setActiveDeviceTab('android');
    else setActiveDeviceTab('desktop');
  }, [isIOS, isAndroid]);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) return;
    }
    setShowGuideModal(true);
  };

  const buttonClasses =
    variant === 'hero'
      ? 'px-5 py-3 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer'
      : variant === 'compact'
        ? 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer'
        : 'px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={buttonClasses}
        title="Installer SmartSchool ERP sur Android, iPhone ou Ordinateur"
      >
        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span className={variant === 'compact' ? 'hidden md:inline' : ''}>
          {isInstallable ? "Installer l'App" : 'Installer Mobile / PC'}
        </span>
      </button>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white border border-blue-100 shadow-2xl overflow-hidden text-left">
            {/* Header */}
            <div className="px-5 py-4 border-b border-blue-100 bg-blue-50/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-blue-950">
                    Installer SmartSchool ERP Guinée
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Application installable sur Android, iPhone/iPad et Ordinateur
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-blue-100/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Device Selector Tabs */}
            <div className="px-5 pt-4 pb-2 bg-white border-b border-slate-100 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveDeviceTab('android')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeDeviceTab === 'android'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDeviceTab('ios')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeDeviceTab === 'ios'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDeviceTab('desktop')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeDeviceTab === 'desktop'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Ordinateur</span>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-700">
              {isInstallable && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-emerald-900">Installation directe prête !</div>
                    <div className="text-[11px] text-emerald-700">Votre navigateur supporte l'installation en 1 clic.</div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const ok = await install();
                      if (ok) setShowGuideModal(false);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Installer maintenant
                  </button>
                </div>
              )}

              {activeDeviceTab === 'android' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2.5">
                    <h4 className="font-bold text-blue-950 text-xs">Installation sur Téléphone Android (Chrome / Edge / Samsung)</h4>
                    <ol className="space-y-2 list-decimal list-inside text-slate-700">
                      <li>
                        Ouvrez le site hébergé en <strong>HTTPS</strong> dans <strong>Google Chrome</strong>.
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold text-blue-700">2.</span>
                        <span>
                          Appuyez sur le menu <MoreVertical className="w-3.5 h-3.5 inline text-slate-800" /> en haut à droite du navigateur.
                        </span>
                      </li>
                      <li>
                        Sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>, puis validez.
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              {activeDeviceTab === 'ios' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2.5">
                    <h4 className="font-bold text-blue-950 text-xs">Installation sur iPhone / iPad (Safari obligatoire)</h4>
                    <ol className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-blue-700">1.</span>
                        <span>Ouvrez cette page dans le navigateur <strong>Safari</strong> sur votre iPhone ou iPad.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-blue-700">2.</span>
                        <span>
                          Appuyez sur le bouton <strong>Partager</strong> <Share className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> dans la barre d'outils en bas de Safari.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-blue-700">3.</span>
                        <span>
                          Faites défiler et appuyez sur <strong>« Sur l'écran d'accueil »</strong> <PlusSquare className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" />, puis sur <strong>Ajouter</strong>.
                        </span>
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              {activeDeviceTab === 'desktop' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2.5">
                    <h4 className="font-bold text-blue-950 text-xs">Installation sur Ordinateur (Windows, Mac, Linux)</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li>
                        <strong>Google Chrome / Microsoft Edge :</strong> Cliquez sur l'icône d'installation <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px]">⊕ Installer</span> à droite de la barre d'adresse (ou menu ⋮ → <em>Caster, enregistrer et partager → Installer SmartSchool ERP</em>).
                      </li>
                      <li>
                        <strong>Safari sur Mac :</strong> Dans la barre de menus en haut, cliquez sur <em>Fichier → Ajouter au Dock…</em>.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-2 text-[11px] text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>L'application s'ouvre en plein écran autonome sans barre navigateur et met en cache les images pour une ouverture rapide.</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-blue-100 bg-slate-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
