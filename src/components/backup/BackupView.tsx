import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BackupArchive } from '../../types';
import { 
  Database, 
  Download, 
  RotateCcw, 
  Calendar, 
  HardDrive, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Play, 
  AlertTriangle,
  X
} from 'lucide-react';

export const BackupView: React.FC = () => {
  const { backups, triggerBackup, restoreBackup, schools, t, showToast } = useApp();

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoreModalBackup, setRestoreModalBackup] = useState<BackupArchive | null>(null);

  const handleStartManualBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(10);

    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            triggerBackup();
            setIsBackingUp(false);
            setBackupProgress(0);
          }, 400);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const handleDownloadBackup = (backup: BackupArchive) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      version: "3.4.1",
      archiveId: backup.id,
      timestamp: backup.createdAt,
      checksum: backup.checksum,
      schoolsCount: backup.schoolsCount,
      tenants: schools.map(s => ({
        id: s.id,
        name: s.name,
        code: s.code,
        subscriptionTier: s.subscriptionTier,
        studentsCount: s.stats.studentsCount
      }))
    }, null, 2));

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", backup.filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Téléchargement de ${backup.filename} démarré`);
  };

  const handleConfirmRestore = () => {
    if (!restoreModalBackup) return;
    restoreBackup(restoreModalBackup.id);
    setRestoreModalBackup(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {t.backups.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.backups.subtitle} · Chiffrement AES-256 avec contrôle d'intégrité SHA-256
          </p>
        </div>

        <button
          onClick={handleStartManualBackup}
          disabled={isBackingUp}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isBackingUp ? `Sauvegarde en cours (${backupProgress}%)` : t.backups.backupNow}</span>
        </button>
      </div>

      {/* Backup in progress indicator */}
      {isBackingUp && (
        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-blue-300">
            <span className="font-semibold">Snapshot de la base de données multi-tenant en cours...</span>
            <span className="font-mono">{backupProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${backupProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Agrégation et chiffrement des tables isolées des {schools.length} établissements scolaires.
          </p>
        </div>
      )}

      {/* Schedule Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Quotidienne</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-base font-bold text-white mt-2">
            Chaque nuit à 02:00 GMT
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Actif · Rétention 30 jours
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Hebdomadaire</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-base font-bold text-white mt-2">
            Chaque Dimanche à 03:00 GMT
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Actif · Rétention 12 semaines
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Mensuelle</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-base font-bold text-white mt-2">
            1er du mois à 00:00 GMT
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Actif · Archive permanente (3 ans)
          </div>
        </div>
      </div>

      {/* Backups List Table */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">
            Archives des Sauvegardes Disponibles ({backups.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Espace consommé : {(backups.reduce((acc, b) => acc + b.sizeMb, 0) / 1024).toFixed(2)} Go
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Fichier Archive</th>
                <th className="py-2.5 px-3">Date & Heure</th>
                <th className="py-2.5 px-3">Taille</th>
                <th className="py-2.5 px-3">Écoles Incluses</th>
                <th className="py-2.5 px-3">Empreinte SHA-256</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 text-slate-200">
              {backups.map(b => (
                <tr key={b.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{b.filename}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-300">
                    {b.createdAt}
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-300">
                    {b.sizeMb} Mo
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-white font-medium">{b.schoolsCount} établissements</span>
                    <div className="text-[10px] text-slate-400">({b.recordsCount.toLocaleString('fr-FR')} enregistrements)</div>
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                    {b.checksum}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDownloadBackup(b)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                        title="Télécharger l'archive complète"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger</span>
                      </button>

                      <button
                        onClick={() => setRestoreModalBackup(b)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-colors"
                        title="Restaurer l'état de la plateforme"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restaurer</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      {restoreModalBackup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl bg-slate-900 border border-rose-500/50 shadow-2xl p-6">
            <div className="flex items-center gap-3 text-rose-400 pb-3 border-b border-slate-800">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold text-white text-sm">
                  Confirmation de Restauration Globale
                </h3>
                <span className="text-xs text-rose-400">Opération d'infrastructure critique</span>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-300 space-y-3">
              <p>
                Vous êtes sur le point de restaurer l'état de la plateforme à partir du snapshot :
              </p>
              <div className="p-2.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-white">
                {restoreModalBackup.filename} ({restoreModalBackup.createdAt})
              </div>
              <p className="text-[11px] text-amber-300">
                Attention : Toutes les modifications créées après cette date seront écrasées. Cette action est réservée au Super Administrateur en cas de sinistre ou d'audit majeur.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRestoreModalBackup(null)}
                className="px-4 py-2 text-slate-400 hover:text-white rounded bg-slate-800"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmRestore}
                className="px-4 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded"
              >
                Confirmer la Restauration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
