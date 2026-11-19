import { AuditOperationType, SecurityAuditLog } from '../types';
import { initialAuditLogs } from '../data/mockData';
import { loadLocalStorage, saveDualStorage } from './storage';

export const AUDIT_LOGS_STORAGE_KEY = 'smartschool_audit_logs_v1';
const MAX_AUDIT_LOGS = 300;

const ROLE_LABELS_FR: Record<string, string> = {
  super_admin: 'Super Admin',
  school_admin: 'Admin École',
  director: 'Directeur',
  secretary: 'Secrétaire',
  teacher: 'Enseignant',
  supervisor: 'Surveillant',
  accountant: 'Comptable',
  librarian: 'Bibliothécaire',
  parent: 'Parent',
  student: 'Élève'
};

export interface StoredSessionSnapshot {
  role?: string;
  name?: string;
  email?: string;
  matricule?: string;
  schoolName?: string;
  ecoleId?: string;
}

export function readCurrentSessionSnapshot(): StoredSessionSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw =
      localStorage.getItem('smartschool_current_user') ||
      sessionStorage.getItem('smartschool_current_user');
    if (raw) {
      return JSON.parse(raw) as StoredSessionSnapshot;
    }
  } catch {
    // ignore
  }
  return null;
}

export function inferAuditOperation(
  action: string,
  type?: SecurityAuditLog['type']
): AuditOperationType {
  const lower = (action || '').toLowerCase();
  if (
    /\b(suppression|supprim|retirer|retrait|r[eé]vocation|blocage|d[eé]sactivation|cl[oô]ture|banni|effacement)\b/.test(lower)
  ) {
    return 'delete';
  }
  if (
    /\b(cr[eé]ation|cr[eé]er|nouvel|nouvelle|nouveau|ouverture|publication|publier|enregistrement|enregistr|attribution|d[eé]livrance|[eé]mission|ajout)\b/.test(lower)
  ) {
    return 'create';
  }
  if (
    /\b(modification|modifier|mise [aà] jour|changement|changer|affectation|nomination|archivage|r[eé]initialisation|renouvellement|mutation|suspension|r[eé]activation|personnalisation|restauration|pass[eé] [aà])\b/.test(lower)
  ) {
    return 'update';
  }
  if (type === 'connexion' || /\b(connexion|2fa|pin|authentification|mot de passe)\b/.test(lower)) {
    return 'security';
  }
  return 'other';
}

export function resolveAuditOperation(log: SecurityAuditLog): AuditOperationType {
  if (log.operation) return log.operation;
  return inferAuditOperation(log.action, log.type);
}

export function isSchoolAdminAuditLog(log: SecurityAuditLog): boolean {
  if (log.actorRole === 'school_admin') return true;
  const actorLower = (log.actor || '').toLowerCase();
  return actorLower.includes('admin école') || actorLower.includes('school_admin');
}

export interface GlobalAuditInput {
  action: string;
  target?: string;
  actorName?: string;
  actorRole?: string;
  actorMatricule?: string;
  schoolName?: string;
  type?: SecurityAuditLog['type'];
  severity?: SecurityAuditLog['severity'];
  operation?: AuditOperationType;
  ip?: string;
}

export function recordGlobalAuditLog(input: GlobalAuditInput): SecurityAuditLog {
  const session = readCurrentSessionSnapshot();

  const resolvedName = (input.actorName || session?.name || 'Utilisateur SmartSchool').trim();
  const rawRole = input.actorRole || session?.role || '';
  const resolvedRoleLabel = ROLE_LABELS_FR[rawRole] || rawRole || 'Système';
  const resolvedMatricule = (input.actorMatricule || session?.matricule || '').trim();
  const resolvedSchool = (input.schoolName || session?.schoolName || '').trim();

  const actorLabel = resolvedMatricule
    ? `${resolvedName} (${resolvedRoleLabel} · ${resolvedMatricule})`
    : `${resolvedName} (${resolvedRoleLabel})`;

  const baseTarget = (input.target || 'Plateforme SmartSchool').trim();
  const resolvedTarget =
    resolvedSchool && !baseTarget.toLowerCase().includes(resolvedSchool.toLowerCase())
      ? `${baseTarget} · ${resolvedSchool}`
      : baseTarget;

  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 8)}`;
  const resolvedType = input.type || 'admin';
  const resolvedOperation = input.operation || inferAuditOperation(input.action, resolvedType);

  const entry: SecurityAuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    action: input.action,
    actor: actorLabel,
    target: resolvedTarget,
    ip: input.ip || '197.149.198.42 (Conakry, Guinée)',
    type: resolvedType,
    severity: input.severity || 'info',
    operation: resolvedOperation,
    actorRole: rawRole || undefined,
    schoolName: resolvedSchool || undefined
  };

  try {
    const current = loadLocalStorage<SecurityAuditLog[]>(AUDIT_LOGS_STORAGE_KEY, initialAuditLogs);
    const list = Array.isArray(current) ? current : initialAuditLogs;
    const next = [entry, ...list].slice(0, MAX_AUDIT_LOGS);
    saveDualStorage(AUDIT_LOGS_STORAGE_KEY, next, Date.now(), 'local');
  } catch {
    // ignore storage failures
  }

  return entry;
}
