import { useEffect, useState } from 'react';
import { loadLocalStorage, saveDualStorage, subscribeStorageKey } from './storage';
import { normalizeSchoolId } from '../data/accountsData';

export type HubRole =
  | 'super_admin'
  | 'school_admin'
  | 'director'
  | 'secretary'
  | 'teacher'
  | 'accountant'
  | 'supervisor'
  | 'librarian'
  | 'parent'
  | 'student';

export const HUB_ROLE_LABELS: Record<HubRole, string> = {
  super_admin: 'Super Admin National',
  school_admin: 'Admin École',
  director: 'Directeur des Études',
  secretary: 'Secrétariat Général',
  teacher: 'Corps Enseignant',
  accountant: 'Comptabilité & Économat',
  supervisor: 'Vie Scolaire / Surveillant',
  librarian: 'Bibliothèque',
  parent: "Parent d'Élève",
  student: 'Élève'
};

export interface SharedMessageReply {
  id: string;
  authorName: string;
  authorRole: HubRole;
  content: string;
  createdAt: string;
}

export interface SharedMessage {
  id: string;
  schoolId: string;
  senderRole: HubRole;
  senderName: string;
  recipientRoles: HubRole[];
  recipientLabel: string;
  subject: string;
  content: string;
  channel: 'in_app' | 'email' | 'sms' | 'whatsapp';
  priority: 'normal' | 'urgent' | 'officiel';
  createdAt: string;
  readByRoles: HubRole[];
  replies: SharedMessageReply[];
}

export type SharedRequestCategory =
  | 'rendez_vous'
  | 'certificat'
  | 'transfert'
  | 'justificatif'
  | 'finance'
  | 'support_admin'
  | 'pedagogie'
  | 'autre';

export type SharedRequestStatus = 'en_attente' | 'en_cours' | 'approuve' | 'rejete';

export interface SharedRequest {
  id: string;
  schoolId: string;
  category: SharedRequestCategory;
  title: string;
  description: string;
  requesterName: string;
  requesterRole: HubRole;
  targetRoles: HubRole[];
  status: SharedRequestStatus;
  createdAt: string;
  updatedAt: string;
  handledBy?: string;
  resolutionNote?: string;
}

export interface SharedHomeworkSubmission {
  id: string;
  homeworkId: string;
  homeworkTitle: string;
  subject: string;
  studentId: string;
  studentName: string;
  studentMatricule: string;
  submittedAt: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileNote?: string;
  maxScore: number;
  grade?: number;
  teacherComment?: string;
  status: 'rendu' | 'corrige' | 'en_retard';
}

export const SHARED_MESSAGES_KEY = 'smartschool_shared_messages_v1';
export const SHARED_REQUESTS_KEY = 'smartschool_shared_requests_v1';
export const SHARED_HOMEWORK_SUBMISSIONS_KEY = 'smartschool_shared_homework_submissions_v1';

const initialSharedMessages: SharedMessage[] = [
  {
    id: 'smsg-init-1',
    schoolId: 'sch-gn-ck-001',
    senderRole: 'director',
    senderName: 'Dr. Ibrahima Sory Bangoura',
    recipientRoles: ['school_admin', 'secretary', 'teacher', 'parent', 'student'],
    recipientLabel: 'Toute la communauté éducative',
    subject: 'Calendrier officiel des compositions du 1er Trimestre',
    content:
      'Chers collègues, parents et élèves, les compositions du 1er trimestre débuteront le lundi 17 novembre. Veuillez consulter vos emplois du temps actualisés.',
    channel: 'in_app',
    priority: 'officiel',
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    readByRoles: ['director'],
    replies: []
  }
];

const initialSharedRequests: SharedRequest[] = [
  {
    id: 'sreq-init-1',
    schoolId: 'sch-gn-ck-001',
    category: 'certificat',
    title: 'Demande de certificat de scolarité (Bourse MEPU-A)',
    description:
      'Bonjour, merci de bien vouloir établir un certificat de scolarité pour Fatoumata Binta Diallo (Terminale SM 1) pour son dossier universitaire.',
    requesterName: 'Elhadj Amadou Diallo',
    requesterRole: 'parent',
    targetRoles: ['secretary', 'school_admin', 'director'],
    status: 'en_attente',
    createdAt: new Date(Date.now() - 43_200_000).toISOString(),
    updatedAt: new Date(Date.now() - 43_200_000).toISOString()
  }
];

export function loadSharedMessages(): SharedMessage[] {
  const list = loadLocalStorage<SharedMessage[]>(SHARED_MESSAGES_KEY, initialSharedMessages);
  return Array.isArray(list) ? list : initialSharedMessages;
}

export function loadSharedRequests(): SharedRequest[] {
  const list = loadLocalStorage<SharedRequest[]>(SHARED_REQUESTS_KEY, initialSharedRequests);
  return Array.isArray(list) ? list : initialSharedRequests;
}

export function loadHomeworkSubmissionRecords(): SharedHomeworkSubmission[] {
  const list = loadLocalStorage<SharedHomeworkSubmission[]>(SHARED_HOMEWORK_SUBMISSIONS_KEY, []);
  return Array.isArray(list) ? list : [];
}

export async function dispatchServerNotification(payload: {
  channel: 'in_app' | 'email' | 'sms' | 'whatsapp';
  to?: string;
  subject?: string;
  body: string;
}): Promise<void> {
  if (typeof window === 'undefined' || !payload.body.trim()) return;
  try {
    await fetch('/api/notifications/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    // Offline or non-blocking fallback
  }
}

export function pushSharedMessage(input: {
  schoolId?: string;
  senderRole: HubRole;
  senderName: string;
  recipientRoles: HubRole[];
  recipientLabel?: string;
  subject: string;
  content: string;
  channel?: 'in_app' | 'email' | 'sms' | 'whatsapp';
  priority?: 'normal' | 'urgent' | 'officiel';
  notifyTo?: string;
}): SharedMessage {
  const item: SharedMessage = {
    id: `smsg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    schoolId: input.schoolId || 'NATIONAL',
    senderRole: input.senderRole,
    senderName: input.senderName.trim() || HUB_ROLE_LABELS[input.senderRole],
    recipientRoles: input.recipientRoles.length > 0 ? input.recipientRoles : ['school_admin'],
    recipientLabel:
      input.recipientLabel?.trim() ||
      input.recipientRoles.map(r => HUB_ROLE_LABELS[r]).join(', '),
    subject: input.subject.trim(),
    content: input.content.trim(),
    channel: input.channel || 'in_app',
    priority: input.priority || 'normal',
    createdAt: new Date().toISOString(),
    readByRoles: [input.senderRole],
    replies: []
  };

  const current = loadSharedMessages();
  const next = [item, ...current.filter(m => m.id !== item.id)].slice(0, 300);
  saveDualStorage(SHARED_MESSAGES_KEY, next, Date.now(), 'local');

  if (typeof window !== 'undefined') {
    void fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).catch(() => undefined);

    if (item.channel === 'email' || item.channel === 'sms') {
      void dispatchServerNotification({
        channel: item.channel,
        to: input.notifyTo,
        subject: item.subject,
        body: `[${item.senderName}] ${item.content}`
      });
    }
  }

  return item;
}

export function isSameSchoolScope(itemSchoolId?: string, viewerSchoolId?: string): boolean {
  if (!itemSchoolId || itemSchoolId === 'NATIONAL' || !viewerSchoolId || viewerSchoolId === 'NATIONAL') {
    return true;
  }
  return normalizeSchoolId(itemSchoolId) === normalizeSchoolId(viewerSchoolId);
}

export function isMessageUnreadForRole(msg: SharedMessage, role: HubRole): boolean {
  if (msg.readByRoles?.includes(role)) return false;
  const replies = Array.isArray(msg.replies) ? msg.replies : [];
  if (replies.length > 0) {
    const lastReply = replies[replies.length - 1];
    return lastReply.authorRole !== role;
  }
  return msg.senderRole !== role;
}

export function replyToSharedMessage(
  messageId: string,
  authorName: string,
  authorRole: HubRole,
  content: string
): void {
  const clean = content.trim();
  if (!clean) return;

  const reply: SharedMessageReply = {
    id: `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    authorName: authorName.trim() || HUB_ROLE_LABELS[authorRole],
    authorRole,
    content: clean,
    createdAt: new Date().toISOString()
  };

  const current = loadSharedMessages();
  const next = current.map(m => {
    if (m.id !== messageId) return m;
    // Mark unread for other thread participants so sender & recipients see new reply alerts
    const nextRead: HubRole[] = [authorRole];
    return {
      ...m,
      replies: [...(m.replies || []), reply],
      readByRoles: nextRead
    };
  });

  saveDualStorage(SHARED_MESSAGES_KEY, next, Date.now(), 'local');

  if (typeof window !== 'undefined') {
    const target = next.find(m => m.id === messageId);
    void fetch(`/api/messages/${encodeURIComponent(messageId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply, readByRoles: target?.readByRoles })
    }).catch(() => undefined);
  }
}

export function markSharedMessageRead(messageId: string, role: HubRole): void {
  const current = loadSharedMessages();
  let changed = false;
  const next = current.map(m => {
    if (m.id !== messageId || m.readByRoles.includes(role)) return m;
    changed = true;
    return {
      ...m,
      readByRoles: [...m.readByRoles, role]
    };
  });
  if (!changed) return;

  saveDualStorage(SHARED_MESSAGES_KEY, next, Date.now(), 'local');
  if (typeof window !== 'undefined') {
    const target = next.find(m => m.id === messageId);
    void fetch(`/api/messages/${encodeURIComponent(messageId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ readByRoles: target?.readByRoles })
    }).catch(() => undefined);
  }
}

export function markAllSharedMessagesRead(role: HubRole, schoolId?: string): void {
  const current = loadSharedMessages();
  const updatedIds: Array<{ id: string; readByRoles: HubRole[] }> = [];
  const next = current.map(m => {
    const sameSchool = role === 'super_admin' || isSameSchoolScope(m.schoolId, schoolId);
    const involved =
      role === 'super_admin' || m.senderRole === role || m.recipientRoles.includes(role);
    if (!sameSchool || !involved || m.readByRoles.includes(role)) return m;
    const readByRoles: HubRole[] = [...m.readByRoles, role];
    updatedIds.push({ id: m.id, readByRoles });
    return { ...m, readByRoles };
  });

  if (updatedIds.length === 0) return;
  saveDualStorage(SHARED_MESSAGES_KEY, next, Date.now(), 'local');

  if (typeof window !== 'undefined') {
    for (const item of updatedIds) {
      void fetch(`/api/messages/${encodeURIComponent(item.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readByRoles: item.readByRoles })
      }).catch(() => undefined);
    }
  }
}

export async function syncSharedMessagesFromServer(schoolId?: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const url = schoolId
      ? `/api/messages?schoolId=${encodeURIComponent(schoolId)}`
      : '/api/messages';
    const resp = await fetch(url);
    if (!resp.ok) return;
    const data = (await resp.json()) as { ok?: boolean; messages?: SharedMessage[] };
    if (!data.ok || !Array.isArray(data.messages) || data.messages.length === 0) return;

    const local = loadSharedMessages();
    const byId = new Map<string, SharedMessage>();
    for (const m of local) byId.set(m.id, m);
    for (const remote of data.messages) {
      if (!remote || !remote.id) continue;
      const existing = byId.get(remote.id);
      if (!existing) {
        byId.set(remote.id, {
          ...remote,
          recipientRoles: Array.isArray(remote.recipientRoles) ? remote.recipientRoles : ['school_admin'],
          readByRoles: Array.isArray(remote.readByRoles) ? remote.readByRoles : [],
          replies: Array.isArray(remote.replies) ? remote.replies : []
        });
      } else {
        const mergedRepliesMap = new Map<string, SharedMessageReply>();
        for (const r of existing.replies || []) mergedRepliesMap.set(r.id, r);
        for (const r of remote.replies || []) mergedRepliesMap.set(r.id, r);
        const mergedReads = Array.from(
          new Set([...(existing.readByRoles || []), ...(remote.readByRoles || [])])
        );
        byId.set(remote.id, {
          ...existing,
          replies: Array.from(mergedRepliesMap.values()),
          readByRoles: mergedReads
        });
      }
    }
    const merged = Array.from(byId.values())
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .slice(0, 300);
    saveDualStorage(SHARED_MESSAGES_KEY, merged, Date.now(), 'remote');
  } catch {
    // Ignore transient network errors
  }
}

export function pushSharedRequest(input: {
  id?: string;
  schoolId?: string;
  category: SharedRequestCategory;
  title: string;
  description: string;
  requesterName: string;
  requesterRole: HubRole;
  targetRoles?: HubRole[];
  status?: SharedRequestStatus;
}): SharedRequest {
  const nowIso = new Date().toISOString();
  const item: SharedRequest = {
    id: input.id || `sreq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    schoolId: input.schoolId || 'NATIONAL',
    category: input.category,
    title: input.title.trim(),
    description: input.description.trim(),
    requesterName: input.requesterName.trim() || HUB_ROLE_LABELS[input.requesterRole],
    requesterRole: input.requesterRole,
    targetRoles:
      input.targetRoles && input.targetRoles.length > 0
        ? input.targetRoles
        : ['school_admin', 'secretary', 'director'],
    status: input.status || 'en_attente',
    createdAt: nowIso,
    updatedAt: nowIso
  };

  const current = loadSharedRequests();
  const next = [item, ...current.filter(r => r.id !== item.id)].slice(0, 300);
  saveDualStorage(SHARED_REQUESTS_KEY, next, Date.now(), 'local');

  if (typeof window !== 'undefined') {
    void fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).catch(() => undefined);
  }

  return item;
}

export function updateSharedRequestStatus(
  requestId: string,
  status: SharedRequestStatus,
  handledBy: string,
  resolutionNote?: string
): void {
  const current = loadSharedRequests();
  const nowIso = new Date().toISOString();
  const next = current.map(r => {
    if (r.id !== requestId) return r;
    return {
      ...r,
      status,
      handledBy,
      resolutionNote: resolutionNote !== undefined ? resolutionNote : r.resolutionNote,
      updatedAt: nowIso
    };
  });
  saveDualStorage(SHARED_REQUESTS_KEY, next, Date.now(), 'local');

  if (typeof window !== 'undefined') {
    void fetch(`/api/requests/${encodeURIComponent(requestId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, handledBy, resolutionNote })
    }).catch(() => undefined);
  }
}

export async function syncSharedRequestsFromServer(schoolId?: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const url = schoolId
      ? `/api/requests?schoolId=${encodeURIComponent(schoolId)}`
      : '/api/requests';
    const resp = await fetch(url);
    if (!resp.ok) return;
    const data = (await resp.json()) as { ok?: boolean; requests?: SharedRequest[] };
    if (!data.ok || !Array.isArray(data.requests) || data.requests.length === 0) return;

    const local = loadSharedRequests();
    const byId = new Map<string, SharedRequest>();
    for (const r of local) byId.set(r.id, r);
    for (const remote of data.requests) {
      if (!remote || !remote.id) continue;
      const existing = byId.get(remote.id);
      if (!existing || (remote.updatedAt || '') > (existing.updatedAt || '')) {
        byId.set(remote.id, {
          ...remote,
          targetRoles: Array.isArray(remote.targetRoles)
            ? remote.targetRoles
            : ['school_admin', 'secretary', 'director']
        });
      }
    }
    const merged = Array.from(byId.values())
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .slice(0, 300);
    saveDualStorage(SHARED_REQUESTS_KEY, merged, Date.now(), 'remote');
  } catch {
    // Ignore transient network errors
  }
}

export function pushHomeworkSubmissionRecord(sub: Omit<SharedHomeworkSubmission, 'id' | 'submittedAt' | 'status'> & {
  id?: string;
  submittedAt?: string;
  status?: SharedHomeworkSubmission['status'];
}): SharedHomeworkSubmission {
  const record: SharedHomeworkSubmission = {
    ...sub,
    id: sub.id || `hwsub-${sub.homeworkId}-${sub.studentMatricule}`,
    submittedAt: sub.submittedAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: sub.status || 'rendu'
  };

  const current = loadHomeworkSubmissionRecords();
  const next = [
    record,
    ...current.filter(
      item =>
        !(
          item.homeworkId === record.homeworkId &&
          item.studentMatricule.toLowerCase() === record.studentMatricule.toLowerCase()
        )
    )
  ].slice(0, 300);

  saveDualStorage(SHARED_HOMEWORK_SUBMISSIONS_KEY, next, Date.now(), 'local');
  return record;
}

export function gradeHomeworkSubmissionRecord(
  homeworkId: string,
  submissionId: string,
  grade: number,
  teacherComment: string
): void {
  const current = loadHomeworkSubmissionRecords();
  const next = current.map(item => {
    if (item.homeworkId === homeworkId && (item.id === submissionId || `hwsub-${item.homeworkId}-${item.studentMatricule}` === submissionId)) {
      return {
        ...item,
        grade,
        teacherComment,
        status: 'corrige' as const
      };
    }
    return item;
  });
  saveDualStorage(SHARED_HOMEWORK_SUBMISSIONS_KEY, next, Date.now(), 'local');
}

export function useSharedMessages(schoolId?: string): SharedMessage[] {
  const [messages, setMessages] = useState<SharedMessage[]>(() => loadSharedMessages());

  useEffect(() => {
    void syncSharedMessagesFromServer(schoolId);
    const unsub = subscribeStorageKey(SHARED_MESSAGES_KEY, data => {
      if (Array.isArray(data)) setMessages(data as SharedMessage[]);
    });
    const timer = setInterval(() => {
      void syncSharedMessagesFromServer(schoolId);
    }, 6_000);
    return () => {
      unsub();
      clearInterval(timer);
    };
  }, [schoolId]);

  return messages;
}

export function useUnreadSharedMessagesCount(role: HubRole, schoolId?: string): number {
  const messages = useSharedMessages(schoolId);
  return messages.filter(m => {
    const sameSchool = role === 'super_admin' || isSameSchoolScope(m.schoolId, schoolId);
    const involved =
      role === 'super_admin' || m.senderRole === role || m.recipientRoles.includes(role);
    return sameSchool && involved && isMessageUnreadForRole(m, role);
  }).length;
}

export function useSharedRequests(schoolId?: string): SharedRequest[] {
  const [requests, setRequests] = useState<SharedRequest[]>(() => loadSharedRequests());

  useEffect(() => {
    void syncSharedRequestsFromServer(schoolId);
    const unsub = subscribeStorageKey(SHARED_REQUESTS_KEY, data => {
      if (Array.isArray(data)) setRequests(data as SharedRequest[]);
    });
    const timer = setInterval(() => {
      void syncSharedRequestsFromServer(schoolId);
    }, 6_000);
    return () => {
      unsub();
      clearInterval(timer);
    };
  }, [schoolId]);

  return requests;
}
