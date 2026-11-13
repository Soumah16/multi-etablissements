import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg border border-amber-400">
      <WifiOff className="w-3.5 h-3.5 shrink-0 animate-pulse" />
      <span>Mode hors-ligne — Ressources locales en cache actives</span>
    </div>
  );
};
