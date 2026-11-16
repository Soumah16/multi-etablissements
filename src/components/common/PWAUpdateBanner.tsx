import React, { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { applyPendingPWAUpdate, PWA_UPDATE_READY_EVENT } from '../../utils/pwaUpdates';

export const PWAUpdateBanner: React.FC = () => {
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    const handleUpdateReady = () => {
      setUpdateReady(true);
    };

    window.addEventListener(PWA_UPDATE_READY_EVENT, handleUpdateReady);
    return () => {
      window.removeEventListener(PWA_UPDATE_READY_EVENT, handleUpdateReady);
    };
  }, []);

  if (!updateReady) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[90] max-w-sm rounded-2xl bg-slate-900 text-white p-4 shadow-2xl border border-blue-400/40 flex items-start gap-3 animate-in fade-in"
    >
      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
        <RefreshCw className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-extrabold text-white">
          Nouvelle mise à jour disponible
        </p>
        <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
          La dernière version de SmartSchool ERP a été téléchargée automatiquement.
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={applyPendingPWAUpdate}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Actualiser maintenant</span>
          </button>
          <button
            type="button"
            onClick={() => setUpdateReady(false)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Plus tard
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setUpdateReady(false)}
        aria-label="Fermer la notification de mise à jour"
        className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
