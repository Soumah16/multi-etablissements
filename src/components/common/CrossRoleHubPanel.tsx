import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Inbox,
  MessageSquare,
  Plus,
  Search,
  Send,
  XCircle
} from 'lucide-react';
import {
  HUB_ROLE_LABELS,
  HubRole,
  SharedRequestCategory,
  isMessageUnreadForRole,
  isSameSchoolScope,
  markAllSharedMessagesRead,
  markSharedMessageRead,
  pushSharedMessage,
  pushSharedRequest,
  replyToSharedMessage,
  updateSharedRequestStatus,
  useSharedMessages,
  useSharedRequests
} from '../../utils/communicationHub';
import { useApp } from '../../context/AppContext';

interface CrossRoleHubPanelProps {
  role: HubRole;
  userName: string;
  schoolId?: string;
  schoolName?: string;
  canManageRequests?: boolean;
  defaultRecipientRoles?: HubRole[];
  compact?: boolean;
}

const REQUEST_CATEGORIES: { id: SharedRequestCategory; label: string }[] = [
  { id: 'certificat', label: 'Certificat / Attestation' },
  { id: 'rendez_vous', label: 'Demande de Rendez-vous' },
  { id: 'transfert', label: 'Transfert / Dossier' },
  { id: 'justificatif', label: 'Justificatif Absence / Retard' },
  { id: 'finance', label: 'Scolarité / Paiement' },
  { id: 'pedagogie', label: 'Suivi Pédagogique' },
  { id: 'support_admin', label: 'Support Administratif' },
  { id: 'autre', label: 'Autre Demande' }
];

const SELECTABLE_ROLES: HubRole[] = [
  'super_admin',
  'school_admin',
  'director',
  'secretary',
  'teacher',
  'accountant',
  'supervisor',
  'librarian',
  'parent',
  'student'
];

export const CrossRoleHubPanel: React.FC<CrossRoleHubPanelProps> = ({
  role,
  userName,
  schoolId = 'sch-gn-ck-001',
  schoolName,
  canManageRequests = false,
  defaultRecipientRoles = ['director', 'secretary'],
  compact = false
}) => {
  const { schools } = useApp();
  const messages = useSharedMessages(role === 'super_admin' ? undefined : schoolId);
  const requests = useSharedRequests(role === 'super_admin' ? undefined : schoolId);

  const [activeSubTab, setActiveSubTab] = useState<'messages' | 'requests'>('messages');
  const [searchQuery, setSearchQuery] = useState('');

  // Message composer state
  const [composerOpen, setComposerOpen] = useState(false);
  const [recipientRole, setRecipientRole] = useState<HubRole>(defaultRecipientRoles[0] || 'school_admin');
  const [targetSchoolId, setTargetSchoolId] = useState<string>('NATIONAL');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState<'in_app' | 'email' | 'sms'>('in_app');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'officiel'>('normal');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  // Request composer state
  const [requestComposerOpen, setRequestComposerOpen] = useState(false);
  const [reqCategory, setReqCategory] = useState<SharedRequestCategory>('certificat');
  const [reqTargetRole, setReqTargetRole] = useState<HubRole>(defaultRecipientRoles[0] || 'secretary');
  const [reqTitle, setReqTitle] = useState('');
  const [reqDescription, setReqDescription] = useState('');
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const scopedMessages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return messages.filter(m => {
      const sameSchool =
        role === 'super_admin' || isSameSchoolScope(m.schoolId, schoolId);
      const involved =
        role === 'super_admin' ||
        m.senderRole === role ||
        m.recipientRoles.includes(role);
      if (!sameSchool || !involved) return false;
      if (!q) return true;
      return (
        m.subject.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q) ||
        m.senderName.toLowerCase().includes(q) ||
        m.recipientLabel.toLowerCase().includes(q)
      );
    });
  }, [messages, role, schoolId, searchQuery]);

  const scopedRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return requests.filter(r => {
      const sameSchool =
        role === 'super_admin' || isSameSchoolScope(r.schoolId, schoolId);
      const involved =
        role === 'super_admin' ||
        canManageRequests ||
        r.requesterRole === role ||
        r.targetRoles.includes(role);
      if (!sameSchool || !involved) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.requesterName.toLowerCase().includes(q)
      );
    });
  }, [requests, role, schoolId, canManageRequests, searchQuery]);

  const unreadCount = useMemo(
    () => scopedMessages.filter(m => isMessageUnreadForRole(m, role)).length,
    [scopedMessages, role]
  );

  const pendingRequestsCount = useMemo(
    () => scopedRequests.filter(r => r.status === 'en_attente' || r.status === 'en_cours').length,
    [scopedRequests]
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;
    const effectiveSchoolId = role === 'super_admin' ? targetSchoolId : schoolId;
    pushSharedMessage({
      schoolId: effectiveSchoolId,
      senderRole: role,
      senderName: userName,
      recipientRoles: [recipientRole],
      recipientLabel: HUB_ROLE_LABELS[recipientRole],
      subject,
      content,
      channel,
      priority
    });
    setSubject('');
    setContent('');
    setComposerOpen(false);
    showFeedback(`Message transmis en temps réel à « ${HUB_ROLE_LABELS[recipientRole]} ».`);
  };

  const handleReply = (messageId: string) => {
    const draft = (replyDrafts[messageId] || '').trim();
    if (!draft) return;
    replyToSharedMessage(messageId, userName, role, draft);
    setReplyDrafts(prev => ({ ...prev, [messageId]: '' }));
    showFeedback('Réponse ajoutée et synchronisée.');
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqDescription.trim()) return;
    pushSharedRequest({
      schoolId: role === 'super_admin' ? 'NATIONAL' : schoolId,
      category: reqCategory,
      title: reqTitle,
      description: reqDescription,
      requesterName: userName,
      requesterRole: role,
      targetRoles: [reqTargetRole, 'school_admin']
    });
    setReqTitle('');
    setReqDescription('');
    setRequestComposerOpen(false);
    showFeedback(`Requête enregistrée et transmise à « ${HUB_ROLE_LABELS[reqTargetRole]} ».`);
  };

  return (
    <section className="rounded-2xl bg-white border border-blue-100 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-blue-100 bg-slate-50/70 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm sm:text-base font-bold text-blue-950">
              Messagerie & Requêtes Inter-Rôles Synchronisées
            </h2>
          </div>
          <p className="text-[11px] text-slate-600 mt-0.5">
            {schoolName ? `${schoolName} · ` : ''}Échanges bidirectionnels en temps réel entre direction, administration, enseignants, parents et élèves.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('messages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'messages'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50'
            }`}
          >
            Messages ({scopedMessages.length}{unreadCount > 0 ? ` · ${unreadCount} non lu(s)` : ''})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('requests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'requests'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50'
            }`}
          >
            Requêtes & Demandes ({pendingRequestsCount} en cours)
          </button>
        </div>
      </div>

      {feedback && (
        <div className="mx-4 sm:mx-5 mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="p-4 sm:p-5 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                activeSubTab === 'messages'
                  ? 'Filtrer les messages inter-rôles...'
                  : 'Rechercher une requête ou un demandeur...'
              }
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-blue-950 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeSubTab === 'messages' && unreadCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  markAllSharedMessagesRead(role, schoolId);
                  showFeedback('Tous les messages ont été marqués comme lus.');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tout marquer lu</span>
              </button>
            )}
            {activeSubTab === 'messages' ? (
              <button
                type="button"
                onClick={() => setComposerOpen(v => !v)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{composerOpen ? 'Fermer le formulaire' : 'Nouveau Message Inter-Rôles'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setRequestComposerOpen(v => !v)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{requestComposerOpen ? 'Fermer le formulaire' : 'Nouvelle Requête Officielle'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Message Composer */}
        {activeSubTab === 'messages' && composerOpen && (
          <form onSubmit={handleSendMessage} className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destinataire (Rôle)</label>
                <select
                  value={recipientRole}
                  onChange={e => setRecipientRole(e.target.value as HubRole)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950"
                >
                  {SELECTABLE_ROLES.filter(r => r !== role).map(r => (
                    <option key={r} value={r}>
                      {HUB_ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Canal</label>
                <select
                  value={channel}
                  onChange={e => setChannel(e.target.value as 'in_app' | 'email' | 'sms')}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950"
                >
                  <option value="in_app">Messagerie Interne</option>
                  <option value="email">Interne + Email</option>
                  <option value="sms">Interne + SMS</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priorité</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as 'normal' | 'urgent' | 'officiel')}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950"
                >
                  <option value="normal">Normale</option>
                  <option value="officiel">Officielle</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>
            {role === 'super_admin' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Établissement ciblé</label>
                <select
                  value={targetSchoolId}
                  onChange={e => setTargetSchoolId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950"
                >
                  <option value="NATIONAL">Toutes les écoles (Diffusion Nationale)</option>
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code || s.id})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Objet *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Objet du message..."
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Message *</label>
              <textarea
                rows={3}
                required
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Rédigez votre message..."
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
              >
                Envoyer Maintenant
              </button>
            </div>
          </form>
        )}

        {/* Request Composer */}
        {activeSubTab === 'requests' && requestComposerOpen && (
          <form onSubmit={handleSubmitRequest} className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catégorie de requête</label>
                <select
                  value={reqCategory}
                  onChange={e => setReqCategory(e.target.value as SharedRequestCategory)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950"
                >
                  {REQUEST_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service / Destinataire principal</label>
                <select
                  value={reqTargetRole}
                  onChange={e => setReqTargetRole(e.target.value as HubRole)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950"
                >
                  {(['secretary', 'director', 'school_admin', 'accountant', 'supervisor', 'super_admin'] as HubRole[]).map(r => (
                    <option key={r} value={r}>
                      {HUB_ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Titre de la demande *</label>
              <input
                type="text"
                required
                value={reqTitle}
                onChange={e => setReqTitle(e.target.value)}
                placeholder="Ex: Demande d'attestation d'inscription ou rendez-vous..."
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Détails de la requête *</label>
              <textarea
                rows={3}
                required
                value={reqDescription}
                onChange={e => setReqDescription(e.target.value)}
                placeholder="Précisez les informations nécessaires au traitement..."
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-950"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
              >
                Soumettre la Requête
              </button>
            </div>
          </form>
        )}

        {/* Messages Thread List */}
        {activeSubTab === 'messages' && (
          <div className={`space-y-3 ${compact ? 'max-h-[420px]' : 'max-h-[540px]'} overflow-y-auto pr-1`}>
            {scopedMessages.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                Aucun message inter-rôles correspondant à votre espace.
              </div>
            ) : (
              scopedMessages.map(msg => {
                const isUnread = isMessageUnreadForRole(msg, role);
                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      if (isUnread) markSharedMessageRead(msg.id, role);
                    }}
                    className={`p-4 rounded-xl border text-xs space-y-2.5 transition-colors ${
                      isUnread
                        ? 'bg-blue-50/70 border-blue-300'
                        : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-blue-950">{msg.subject}</span>
                        {isUnread && (
                          <span className="text-[10px] font-bold text-blue-700 uppercase">· Nouveau</span>
                        )}
                        {msg.priority !== 'normal' && (
                          <span
                            className={`text-[10px] font-bold uppercase ${
                              msg.priority === 'urgent' ? 'text-rose-700' : 'text-amber-700'
                            }`}
                          >
                            · {msg.priority}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(msg.createdAt).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600">
                      De <strong className="text-slate-900">{msg.senderName}</strong> ({HUB_ROLE_LABELS[msg.senderRole]}) →{' '}
                      <strong className="text-slate-900">{msg.recipientLabel}</strong>
                    </div>

                    <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                      {msg.content}
                    </p>

                    {msg.replies && msg.replies.length > 0 && (
                      <div className="pl-3 border-l-2 border-blue-200 space-y-1.5">
                        {msg.replies.map(rep => (
                          <div key={rep.id} className="p-2 rounded-lg bg-white border border-slate-200 text-[11px]">
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                              <span>
                                <strong className="text-blue-950">{rep.authorName}</strong> ({HUB_ROLE_LABELS[rep.authorRole]})
                              </span>
                              <span>
                                {new Date(rep.createdAt).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-slate-800">{rep.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={replyDrafts[msg.id] || ''}
                        onChange={e => setReplyDrafts(prev => ({ ...prev, [msg.id]: e.target.value }))}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleReply(msg.id);
                          }
                        }}
                        placeholder="Répondre dans ce fil..."
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] text-blue-950 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleReply(msg.id)}
                        disabled={!(replyDrafts[msg.id] || '').trim()}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-[11px] font-bold cursor-pointer"
                      >
                        Répondre
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Requests List */}
        {activeSubTab === 'requests' && (
          <div className={`space-y-3 ${compact ? 'max-h-[420px]' : 'max-h-[540px]'} overflow-y-auto pr-1`}>
            {scopedRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                Aucune requête enregistrée pour le moment.
              </div>
            ) : (
              scopedRequests.map(req => (
                <div key={req.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 text-xs space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-blue-950">{req.title}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        req.status === 'approuve'
                          ? 'text-emerald-700'
                          : req.status === 'rejete'
                          ? 'text-rose-700'
                          : req.status === 'en_cours'
                          ? 'text-blue-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {req.status === 'approuve'
                        ? 'Approuvée'
                        : req.status === 'rejete'
                        ? 'Rejetée'
                        : req.status === 'en_cours'
                        ? 'En traitement'
                        : 'En attente'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-3">
                    <span>
                      Demandeur : <strong className="text-slate-900">{req.requesterName}</strong> (
                      {HUB_ROLE_LABELS[req.requesterRole]})
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                    {req.description}
                  </p>

                  {req.resolutionNote && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
                      <strong>Suivi ({req.handledBy || 'Administration'}) :</strong> {req.resolutionNote}
                    </div>
                  )}

                  {canManageRequests && (req.status === 'en_attente' || req.status === 'en_cours') && (
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <input
                        type="text"
                        value={resolutionDrafts[req.id] || ''}
                        onChange={e =>
                          setResolutionDrafts(prev => ({ ...prev, [req.id]: e.target.value }))
                        }
                        placeholder="Note de réponse / motif (optionnel)..."
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] text-blue-950"
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        {req.status === 'en_attente' && (
                          <button
                            type="button"
                            onClick={() => {
                              updateSharedRequestStatus(
                                req.id,
                                'en_cours',
                                userName,
                                resolutionDrafts[req.id] || 'Prise en charge en cours.'
                              );
                              showFeedback('Requête marquée en cours de traitement.');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold cursor-pointer"
                          >
                            Prendre en charge
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            updateSharedRequestStatus(
                              req.id,
                              'approuve',
                              userName,
                              resolutionDrafts[req.id] || 'Demande validée et traitée.'
                            );
                            showFeedback('Requête approuvée.');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approuver</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateSharedRequestStatus(
                              req.id,
                              'rejete',
                              userName,
                              resolutionDrafts[req.id] || 'Demande refusée.'
                            );
                            showFeedback('Requête rejetée.');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Rejeter</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};
