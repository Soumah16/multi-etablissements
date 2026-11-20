import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Cloud,
  CloudOff,
  Copy,
  ExternalLink,
  KeyRound,
  LogOut,
  RefreshCw,
  Share2,
  ShieldCheck,
  Smartphone,
  Users,
  X,
} from 'lucide-react';
import { useFirebase } from '../../context/FirebaseContext';
import { firebaseConfig } from '../../firebase';
import { DEFAULT_WORKSPACE_ID, parseInviteAccessInput } from '../../utils/cloudSync';
import { syncNowWithServer } from '../../utils/serverSync';

export const CloudSyncButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { firebaseUser, syncStatus, setShowCloudModal } = useFirebase();

  const isConnected = Boolean(firebaseUser && firebaseUser.emailVerified);
  const isSyncing = syncStatus === 'syncing' || syncStatus === 'connecting';

  return (
    <button
      type="button"
      onClick={() => setShowCloudModal(true)}
      className={`flex items-center gap-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
        compact ? 'px-2.5 py-1.5' : 'px-3 py-2 rounded-xl'
      } ${
        isConnected
          ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
          : 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900'
      }`}
      title="Partage et synchronisation Cloud en temps réel multi-appareils"
    >
      {isSyncing ? (
        <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
      ) : isConnected ? (
        <Cloud className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      ) : (
        <CloudOff className="w-3.5 h-3.5 text-blue-600 shrink-0" />
      )}
      {compact && (
        <span className="sm:hidden">
          {isSyncing ? 'Sync...' : isConnected ? 'Cloud' : 'Sync'}
        </span>
      )}
      <span className={compact ? 'hidden sm:inline' : ''}>
        {isSyncing
          ? 'Sync...'
          : isConnected
          ? 'Cloud Temps Réel'
          : 'Sync Multi-Appareils'}
      </span>
    </button>
  );
};

export const CloudSyncModal: React.FC = () => {
  const {
    firebaseUser,
    syncStatus,
    lastSyncedAt,
    workspace,
    cloudError,
    domainCheck,
    recheckDomainAuthorization,
    showCloudModal,
    setShowCloudModal,
    signInWithGoogle,
    signOutGoogle,
    forceSyncNow,
    generateInviteCode,
    joinWorkspaceByInvite,
  } = useFirebase();

  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isError?: boolean } | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinWsId, setJoinWsId] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const isConnected = Boolean(firebaseUser && firebaseUser.emailVerified);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const wsParam = params.get('syncWs');
      const inviteParam = params.get('syncInvite');
      if (wsParam && inviteParam) {
        setJoinWsId(wsParam);
        setJoinCode(inviteParam.toUpperCase());
        setShowJoinForm(true);
        setShowCloudModal(true);
      }
    } catch {
      // ignore
    }
  }, [setShowCloudModal]);

  useEffect(() => {
    if (showCloudModal && !isConnected) {
      void recheckDomainAuthorization();
    }
  }, [showCloudModal, isConnected, recheckDomainAuthorization]);

  if (!showCloudModal) return null;

  const officialSharedDomain =
    domainCheck?.authorizedDomains.find(d => d.startsWith('ais-pre-')) ||
    domainCheck?.authorizedDomains.find(d => d.startsWith('ais-dev-')) ||
    '';

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGoogleSignIn = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      await signInWithGoogle();
      setFeedback({ text: 'Compte Google connecté. Synchronisation temps réel activée.' });
    } catch (err) {
      setFeedback({
        text:
          err instanceof Error && err.message
            ? err.message
            : 'Erreur lors de la connexion Google. Vérifiez votre navigateur et réessayez.',
        isError: true,
      });
    } finally {
      setBusy(false);
    }
  };

  const handleServerRefresh = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      const ok = await syncNowWithServer(5000);
      setFeedback({
        text: ok
          ? 'Données actualisées depuis le serveur de ce site !'
          : 'Serveur inaccessible momentanément. Vérifiez votre connexion Internet.',
        isError: !ok,
      });
    } finally {
      setBusy(false);
    }
  };

  const handleForceSync = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      await syncNowWithServer(4000);
      const count = await forceSyncNow();
      setFeedback({
        text:
          count > 0
            ? `${count} bloc(s) de données synchronisés sur le Cloud.`
            : 'Tous vos appareils sont déjà à jour en temps réel.',
      });
    } catch (err) {
      setFeedback({
        text: err instanceof Error ? err.message : 'Erreur lors de la synchronisation.',
        isError: true,
      });
    } finally {
      setBusy(false);
    }
  };

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setFeedback(null);
    try {
      const code = await generateInviteCode(inviteEmail.trim(), 'editor');
      setGeneratedCode(code);
      setInviteEmail('');
      setFeedback({ text: 'Code d’invitation prêt à être partagé sur un autre téléphone ou PC.' });
    } catch (err) {
      setFeedback({
        text: err instanceof Error ? err.message : 'Impossible de générer le code.',
        isError: true,
      });
    } finally {
      setBusy(false);
    }
  };

  const handleJoinFieldChange = (field: 'ws' | 'code', val: string) => {
    const parsed = parseInviteAccessInput(field === 'ws' ? val : joinWsId, field === 'code' ? val : joinCode);
    if (/ID\s*Espace\s*:/i.test(val) && /INV-/i.test(val)) {
      setJoinWsId(parsed.workspaceId);
      setJoinCode(parsed.inviteCode);
      return;
    }
    if (field === 'ws') {
      setJoinWsId(val);
    } else {
      setJoinCode(val.toUpperCase());
    }
  };

  const handleJoinWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setBusy(true);
    setFeedback(null);
    try {
      await joinWorkspaceByInvite(joinWsId.trim() || DEFAULT_WORKSPACE_ID, joinCode.trim());
      setShowJoinForm(false);
      setJoinCode('');
      setFeedback({ text: 'Cet appareil est maintenant synchronisé avec l’espace partagé !' });
    } catch (err) {
      setFeedback({
        text: err instanceof Error ? err.message : 'Code invalide ou expiré.',
        isError: true,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-blue-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-emerald-50/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-blue-950 truncate">
                Synchronisation Cloud Temps Réel
              </h3>
              <p className="text-[11px] text-slate-600 truncate">
                Partage instantané entre téléphones et ordinateurs
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCloudModal(false)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {(feedback || cloudError) && (
            <div
              className={`p-3 rounded-xl border font-medium ${
                feedback?.isError || cloudError
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              {feedback?.text || cloudError}
            </div>
          )}

          {!isConnected ? (
            <div className="space-y-4">
              {domainCheck && !domainCheck.authorized && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2.5 text-amber-950">
                  <div className="flex items-start gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Domaine non autorisé par Firebase ({domainCheck.currentHostname})
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Firebase affiche <strong>« The requested action is invalid »</strong> tant que l’adresse actuelle n’est pas dans la liste des domaines autorisés.
                  </p>
                  <div className="space-y-2 pt-1">
                    {officialSharedDomain && (
                      <div className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase text-amber-700">
                            Solution rapide : ouvrir l’URL officielle autorisée
                          </div>
                          <div className="font-mono text-[11px] text-slate-700 truncate">
                            https://{officialSharedDomain}
                          </div>
                        </div>
                        <a
                          href={`https://${officialSharedDomain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shrink-0"
                        >
                          <span>Ouvrir</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    <div className="p-2.5 rounded-xl bg-white border border-amber-200 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase text-slate-600">
                        Ou autoriser ce domaine dans Firebase Console → Authentication → Settings → Authorized domains
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-[11px] font-mono text-slate-800 truncate">
                          {domainCheck.currentHostname}
                        </code>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopy('host', domainCheck.currentHostname)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] cursor-pointer"
                          >
                            {copiedId === 'host' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === 'host' ? 'Copié' : 'Copier'}</span>
                          </button>
                          <a
                            href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px]"
                          >
                            <span>Firebase</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-blue-950">
                  <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Synchronisation PC ↔ Téléphone</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  • <strong>Même lien sur PC et téléphone :</strong> toutes vos modifications sont synchronisées automatiquement via le serveur sans compte Google.
                  <br />
                  • <strong>Deux liens différents</strong> (ex : aperçu éditeur <code>ais-dev</code> sur PC et lien partagé <code>ais-pre</code> sur téléphone) : utilisez le <strong>même lien partagé</strong> sur vos deux appareils ou connectez votre compte Google ci-dessous.
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleServerRefresh}
                  className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-blue-100/70 border border-blue-200 text-blue-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${busy ? 'animate-spin' : ''}`} />
                  <span>Actualiser les données depuis le serveur</span>
                </button>
              </div>

              <button
                type="button"
                disabled={busy}
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{busy ? 'Connexion en cours...' : 'Connecter le Cloud Google (multi-liens)'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Connected Google Account Summary */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center shrink-0">
                    {(firebaseUser?.displayName || firebaseUser?.email || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-emerald-950 truncate">
                      {firebaseUser?.displayName || 'Compte Google connecté'}
                    </div>
                    <div className="text-[11px] text-emerald-800 truncate">
                      {firebaseUser?.email}
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shrink-0">
                  {syncStatus === 'syncing' ? 'Sync...' : 'En ligne'}
                </span>
              </div>

              {/* Active Shared Workspace Info */}
              {workspace && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-800 truncate">{workspace.name}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                      <Users className="w-3 h-3" />
                      {workspace.memberUids.length} compte(s) relié(s)
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                    <span className="font-mono text-[11px] text-slate-700 truncate">
                      ID Espace : <strong>{workspace.id}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('ws', workspace.id)}
                      className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copiedId === 'ws' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'ws' ? 'Copié' : 'Copier'}</span>
                    </button>
                  </div>
                  {lastSyncedAt && (
                    <div className="text-[11px] text-slate-500">
                      Dernière synchronisation : {new Date(lastSyncedAt).toLocaleTimeString('fr-FR')}
                    </div>
                  )}
                </div>
              )}

              {/* Actions Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleForceSync}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
                  <span>Synchroniser maintenant</span>
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setShowJoinForm(prev => !prev)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Rejoindre un autre espace</span>
                </button>
              </div>

              {/* Join Another Workspace Form */}
              {showJoinForm && (
                <form
                  onSubmit={handleJoinWorkspace}
                  className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2.5"
                >
                  <div className="font-bold text-blue-950">Rejoindre avec un code d’invitation</div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Collez directement le texte copié via « Copier l’accès » sur l’autre appareil, ou saisissez l’ID de l’espace (ne mettez pas votre email) et le code.
                  </p>
                  <input
                    type="text"
                    value={joinWsId}
                    onChange={e => handleJoinFieldChange('ws', e.target.value)}
                    placeholder="ID de l’espace (ex: ws-... ou smartschool-guinee-main)"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs text-slate-800 font-mono"
                  />
                  <input
                    type="text"
                    value={joinCode}
                    onChange={e => handleJoinFieldChange('code', e.target.value)}
                    placeholder="Code d’invitation (ex: INV-XXXXXX)"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs font-mono text-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                  >
                    Valider et synchroniser cet appareil
                  </button>
                </form>
              )}

              {/* Share with Another Google Account */}
              <form
                onSubmit={handleGenerateInvite}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
              >
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Partager avec un collègue (autre compte Google)</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="Email Google du collègue (optionnel)"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold whitespace-nowrap cursor-pointer"
                  >
                    Créer un code
                  </button>
                </div>

                {generatedCode && workspace && (
                  <div className="p-3 rounded-xl bg-white border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="text-[11px] font-mono text-slate-700">
                        Espace : <strong className="text-slate-900">{workspace.id}</strong> · Code :{' '}
                        <strong className="text-emerald-700">{generatedCode}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            'invite',
                            `ID Espace: ${workspace.id} | Code d'invitation: ${generatedCode}`
                          )
                        }
                        className="text-emerald-700 font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === 'invite' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === 'invite' ? 'Copié' : 'Copier l’accès'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => void signOutGoogle()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-bold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnecter le Cloud Google</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
