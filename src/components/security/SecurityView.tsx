import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Smartphone, 
  Laptop, 
  LogOut, 
  Ban, 
  CheckCircle2, 
  AlertTriangle, 
  KeyRound, 
  Lock, 
  Search,
  Filter,
  Plus,
  X
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    auditLogs, 
    sessions, 
    terminateSession, 
    blockedIps, 
    toggleBlockIp, 
    t, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sessions' | 'logs' | 'ip_blocklist' | '2fa'>('sessions');
  const [logTypeFilter, setLogTypeFilter] = useState('all');
  const [logSearch, setLogSearch] = useState('');
  const [newIpToBlock, setNewIpToBlock] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.actor.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.ip.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.target.toLowerCase().includes(logSearch.toLowerCase());

    const matchesType = logTypeFilter === 'all' || log.type === logTypeFilter;

    return matchesSearch && matchesType;
  });

  const handleToggle2fa = () => {
    const nextState = !profile.twoFactorEnabled;
    updateProfile({ twoFactorEnabled: nextState });
    showToast(`2FA ${nextState ? 'activé' : 'désactivé'}`);
  };

  const handleAddBlockIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpToBlock.trim()) return;
    toggleBlockIp(newIpToBlock.trim());
    setNewIpToBlock('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-950">
            {t.security.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.security.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Chiffrement AES-256 & TLS 1.3 Actifs</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-blue-100 text-xs">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'sessions'
              ? 'text-blue-600 border-blue-500'
              : 'text-slate-500 hover:text-slate-900 border-transparent'
          }`}
        >
          Sessions & Appareils Actifs ({sessions.length})
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'logs'
              ? 'text-blue-600 border-blue-500'
              : 'text-slate-500 hover:text-slate-900 border-transparent'
          }`}
        >
          Journaux d'Audit & Sécurité ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('ip_blocklist')}
          className={`pb-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'ip_blocklist'
              ? 'text-blue-600 border-blue-500'
              : 'text-slate-500 hover:text-slate-900 border-transparent'
          }`}
        >
          Pare-feu & Adresses IP Bloquées ({blockedIps.length})
        </button>

        <button
          onClick={() => setActiveTab('2fa')}
          className={`pb-3 font-semibold transition-colors border-b-2 ${
            activeTab === '2fa'
              ? 'text-blue-600 border-blue-500'
              : 'text-slate-500 hover:text-slate-900 border-transparent'
          }`}
        >
          Authentification 2FA & Accès
        </button>
      </div>

      {/* Content 1: Sessions */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-slate-200">
            <h3 className="text-sm font-bold text-blue-950 mb-1">
              Appareils Actuellement Connectés à la Console Super Admin
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Vous pouvez révoquer instantanément n'importe quelle session distante pour forcer la déconnexion.
            </p>

            <div className="space-y-3">
              {sessions.map((sess) => (
                <div 
                  key={sess.id}
                  className="p-3.5 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 text-blue-600 mt-0.5">
                      {sess.device.includes('iPhone') || sess.device.includes('Android') ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Laptop className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-950 text-xs">{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            Session actuelle
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                        <span>{sess.browser}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-700">IP: {sess.ip}</span>
                        <span>·</span>
                        <span>{sess.location}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Dernière activité : {sess.lastActive}
                      </div>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      onClick={() => terminateSession(sess.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors whitespace-nowrap self-end sm:self-auto"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.security.forceLogout}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content 2: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filtrer les journaux par mot-clé, acteur, IP..."
                value={logSearch}
                onChange={e => setLogSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-blue-50/60 border border-slate-200 text-blue-950 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={logTypeFilter}
              onChange={e => setLogTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg bg-blue-50/60 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Tous les types d'événements</option>
              <option value="connexion">Connexions & Authentification</option>
              <option value="ecole">Établissements (Création/Suspension)</option>
              <option value="admin">Administrateurs d'écoles</option>
              <option value="securite">Sécurité & Pare-feu WAF</option>
              <option value="finance">Finances & Abonnements</option>
              <option value="sauvegarde">Sauvegardes de base</option>
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-blue-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Horodatage (GMT)</th>
                  <th className="py-2.5 px-3">Action Enregistrée</th>
                  <th className="py-2.5 px-3">Acteur / Déclencheur</th>
                  <th className="py-2.5 px-3">Adresse IP</th>
                  <th className="py-2.5 px-3">Gravité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-900">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-blue-100">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      {log.action}
                      <div className="text-[10px] text-slate-500 mt-0.5">Cible : {log.target}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 text-[11px]">
                      {log.actor}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {log.ip}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        log.severity === 'critical'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : log.severity === 'warning'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-600'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content 3: IP Blocklist */}
      {activeTab === 'ip_blocklist' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-slate-200">
            <h3 className="text-sm font-bold text-blue-950 mb-1">
              Liste Noire du Pare-feu WAF (Adresses IP Bannies)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Toute tentative de connexion ou de requête API issue de ces adresses est immédiatement rejetée avec HTTP 403.
            </p>

            {/* Add IP form */}
            <form onSubmit={handleAddBlockIp} className="flex gap-2 max-w-md mb-4">
              <input
                type="text"
                placeholder="Ex: 198.51.100.25"
                value={newIpToBlock}
                onChange={e => setNewIpToBlock(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-white border border-slate-200 text-blue-950 font-mono focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Bloquer l'IP</span>
              </button>
            </form>

            <div className="divide-y divide-slate-200">
              {blockedIps.map(ip => (
                <div key={ip} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span className="font-mono text-slate-900 font-semibold">{ip}</span>
                    <span className="text-[11px] text-slate-500">(Trafic malveillant / Tentatives non autorisées)</span>
                  </div>
                  <button
                    onClick={() => toggleBlockIp(ip)}
                    className="px-2.5 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors"
                  >
                    Débloquer
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content 4: 2FA Settings */}
      {activeTab === '2fa' && (
        <div className="p-5 rounded-xl bg-blue-50/60 border border-slate-200 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-blue-950 text-sm">
                Double Facteur d'Authentification (2FA TOTP)
              </h3>
              <p className="text-slate-500 mt-0.5">
                Oblige la saisie d'un code à 6 chiffres généré par Google Authenticator ou Twilio Authy à chaque ouverture de session Super Admin.
              </p>
            </div>
            <button
              onClick={handleToggle2fa}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-colors ${
                profile.twoFactorEnabled 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-50' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {profile.twoFactorEnabled ? 'Désactiver le 2FA' : 'Activer le 2FA'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2">
              <div className="font-semibold text-blue-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Statut Actuel
              </div>
              <p className="text-slate-700">
                La protection 2FA est actuellement <strong className={profile.twoFactorEnabled ? 'text-emerald-600' : 'text-rose-600'}>{profile.twoFactorEnabled ? 'ACTIVÉE' : 'DÉSACTIVÉE'}</strong> sur votre compte administrateur.
              </p>
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                Méthode : Application d'authentification (TOTP RFC 6238)
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2">
              <div className="font-semibold text-blue-950 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                Politique d'Expiration de Session
              </div>
              <p className="text-slate-700">
                Déconnexion automatique après <strong className="text-blue-950">45 minutes</strong> d'inactivité continue sur le navigateur pour éviter tout accès indu.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
