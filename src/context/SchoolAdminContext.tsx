import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { resolveSchoolForContext } from '../utils/whatsapp';
import { generateTotpSecret, verifyTotpCode } from '../utils/totp';
import { loadLocalStorage, saveDualStorage, subscribeStorageKey, usePersistedState } from '../utils/storage';
import { propagateStaffMemberChange } from '../utils/accountSync';
import { getStoredAccounts } from '../data/accountsData';
import { readCurrentSessionSnapshot, recordGlobalAuditLog } from '../utils/auditLogger';
import { 
  AuditOperationType,
  StaffMember, 
  SchoolClass, 
  SchoolSubject, 
  SchoolRoom, 
  AcademicYear, 
  AdministrativeEvent, 
  AdministrativeDocumentTemplate,
  SchoolLoginLog,
  School
} from '../types';
import { 
  initialStaffMembers, 
  initialClasses, 
  initialSubjects, 
  initialRooms, 
  initialAcademicYears, 
  initialAdministrativeEvents, 
  initialDocumentTemplates, 
  initialSchoolLoginLogs 
} from '../data/schoolAdminMockData';

import { requestServerOtp, verifyServerOtp, maskDestinationLabel } from '../utils/otpClient';

export type SchoolAdminNavTab = 
  | 'dashboard'
  | 'staff'
  | 'classes'
  | 'subjects'
  | 'rooms'
  | 'years'
  | 'assignments'
  | 'documents'
  | 'events'
  | 'communication'
  | 'reports'
  | 'security'
  | 'settings'
  | 'profile';

export type School2FAMethod = 'authenticator' | 'sms' | 'email';

export interface SchoolSecurityConfig {
  adminPin: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: School2FAMethod;
  totpSecret: string;
  lastVerifiedAt?: string;
}

export interface SentSchoolOtp {
  challengeToken: string;
  method: 'sms' | 'email';
  maskedDestination: string;
  deliveryStatus: 'sent' | 'gateway_not_configured' | 'failed';
  sentAt: string;
  message: string;
}

export interface StaffCredentialReceipt {
  member: StaffMember;
  password: string;
  action: 'created' | 'reset' | 'updated';
}

const LEGACY_STAFF_EMAILS: Record<string, string> = {
  'stf-001': 'direction@excellence-conakry.edu.gn',
  'stf-002': 'secretariat@excellence-conakry.edu.gn',
  'stf-003': 'comptabilite@excellence-conakry.edu.gn',
  'stf-004': 'ml.bah@excellence-conakry.edu.gn',
  'stf-006': 'bibliotheque@excellence-conakry.edu.gn',
  'stf-007': 'surveillance@excellence-conakry.edu.gn'
};

function reconcilePersistedStaff(loaded: StaffMember[]): StaffMember[] {
  if (!Array.isArray(loaded) || loaded.length === 0) return initialStaffMembers;
  const accounts = getStoredAccounts();

  return loaded.map((member) => {
    const legacyEmail = LEGACY_STAFF_EMAILS[member.id];
    const seedMatch = initialStaffMembers.find(s => s.id === member.id);
    const migrated =
      legacyEmail && seedMatch && member.email.toLowerCase() === legacyEmail
        ? {
            ...seedMatch,
            status: member.status || seedMatch.status,
            assignedClasses: member.assignedClasses ?? seedMatch.assignedClasses,
            assignedSubjects: member.assignedSubjects ?? seedMatch.assignedSubjects
          }
        : member;

    const matchedAccount = accounts.find(
      (a) =>
        a.email.toLowerCase() === migrated.email.toLowerCase() ||
        a.matricule.toLowerCase() === migrated.matricule.toLowerCase() ||
        (migrated.username && a.username && a.username.toLowerCase() === migrated.username.toLowerCase()) ||
        (migrated.id === 'stf-001' && a.role === 'director')
    );

    const syncedPassword = matchedAccount?.plainPassword || matchedAccount?.password || migrated.temporaryPassword || seedMatch?.temporaryPassword;
    if (syncedPassword && migrated.temporaryPassword !== syncedPassword) {
      return { ...migrated, temporaryPassword: syncedPassword };
    }
    return migrated;
  });
}

const SCHOOL_ALIAS_TO_ID: Record<string, string> = {
  'ECOLE-001': 'sch-gn-ck-001',
  'ECOLE-002': 'sch-gn-kd-003',
  'ECOLE-003': 'sch-gn-ck-005'
};

export function getCanonicalSchoolId(schoolIdOrAlias?: string): string {
  if (!schoolIdOrAlias) return 'sch-gn-ck-001';
  return SCHOOL_ALIAS_TO_ID[schoolIdOrAlias] || schoolIdOrAlias;
}

function securityStorageKey(schoolIdOrAlias?: string): string {
  return `smartschool_school_security_${getCanonicalSchoolId(schoolIdOrAlias)}`;
}

function logsStorageKey(schoolIdOrAlias?: string): string {
  return `smartschool_school_logs_${getCanonicalSchoolId(schoolIdOrAlias)}`;
}

function pinLockStorageKey(schoolIdOrAlias?: string): string {
  return `smartschool_pin_lock_${getCanonicalSchoolId(schoolIdOrAlias)}`;
}

export function loadSchoolSecurityConfig(schoolIdOrAlias?: string): SchoolSecurityConfig {
  const key = securityStorageKey(schoolIdOrAlias);
  try {
    const parsed = loadLocalStorage<Partial<SchoolSecurityConfig> | null>(key, null);
    if (parsed && typeof parsed === 'object') {
      return {
        adminPin:
          typeof parsed.adminPin === 'string' && /^\d{6}$/.test(parsed.adminPin)
            ? parsed.adminPin
            : '123456',
        twoFactorEnabled: false,
        twoFactorMethod:
          parsed.twoFactorMethod === 'sms' || parsed.twoFactorMethod === 'email'
            ? parsed.twoFactorMethod
            : 'authenticator',
        totpSecret:
          typeof parsed.totpSecret === 'string' && parsed.totpSecret.length >= 16
            ? parsed.totpSecret
            : generateTotpSecret(16),
        lastVerifiedAt: typeof parsed.lastVerifiedAt === 'string' ? parsed.lastVerifiedAt : undefined
      };
    }
  } catch {
    // ignore storage read errors
  }

  return {
    adminPin: '123456',
    twoFactorEnabled: false,
    twoFactorMethod: 'authenticator',
    totpSecret: generateTotpSecret(16)
  };
}

export function saveSchoolSecurityConfig(schoolIdOrAlias: string | undefined, config: SchoolSecurityConfig): void {
  saveDualStorage(securityStorageKey(schoolIdOrAlias), config);
}

export function appendSchoolLoginLog(
  schoolIdOrAlias: string | undefined,
  entry: Omit<SchoolLoginLog, 'id' | 'timestamp'>
): SchoolLoginLog {
  const now = new Date();
  const formatted = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 8)}`;
  const newLog: SchoolLoginLog = {
    ...entry,
    id: `slog-${Date.now()}`,
    timestamp: formatted
  };
  try {
    const key = logsStorageKey(schoolIdOrAlias);
    const existing = loadLocalStorage<SchoolLoginLog[]>(key, initialSchoolLoginLogs);
    const list = Array.isArray(existing) ? existing : initialSchoolLoginLogs;
    saveDualStorage(key, [newLog, ...list].slice(0, 40));
  } catch {
    // ignore storage errors
  }
  return newLog;
}

interface SchoolAdminContextType {
  activeSchoolTab: SchoolAdminNavTab;
  setActiveSchoolTab: (tab: SchoolAdminNavTab) => void;
  currentSchool: School;
  setCurrentSchoolId: (id: string) => void;
  
  // PIN + 2FA Security Modal
  pinModalOpen: boolean;
  setPinModalOpen: (open: boolean) => void;
  pendingPinAction: { description: string; callback: () => void } | null;
  executeWithPin: (actionDescription: string, callback: () => void) => void;
  verifyAndExecutePin: (inputPin: string, twoFactorCode?: string) => Promise<{ ok: boolean; error?: string }>;
  failedPinAttempts: number;
  isTemporarilyBlocked: boolean;
  updateAdminPin: (oldPin: string, newPin: string) => boolean;

  // 2FA Controls
  twoFactorEnabled: boolean;
  twoFactorMethod: School2FAMethod;
  totpSecret: string;
  last2faVerifiedAt?: string;
  lastSentOtp: SentSchoolOtp | null;
  toggleTwoFactor: (enabled?: boolean) => void;
  setTwoFactorMethod: (method: School2FAMethod) => void;
  regenerateTotpSecret: () => void;
  sendSchool2faOtp: (channel?: 'sms' | 'email') => Promise<SentSchoolOtp | null>;
  verifySchool2faCode: (code: string) => Promise<{ ok: boolean; error?: string }>;
  
  // Staff
  staff: StaffMember[];
  createStaff: (member: Omit<StaffMember, 'id' | 'matricule' | 'qrToken' | 'credentialsSent' | 'username'>, initialPassword?: string) => StaffMember;
  updateStaff: (id: string, updates: Partial<StaffMember>, newPassword?: string) => void;
  toggleStaffStatus: (id: string) => void;
  resetStaffPassword: (id: string, customPassword?: string) => void;
  deleteStaff: (id: string) => void;
  sendStaffCredentials: (id: string, channel?: 'email' | 'whatsapp', recipient?: string) => void;
  selectedStaffForBadge: StaffMember | null;
  setSelectedStaffForBadge: (staff: StaffMember | null) => void;
  lastStaffCredentialReceipt: StaffCredentialReceipt | null;
  setLastStaffCredentialReceipt: (receipt: StaffCredentialReceipt | null) => void;

  // Classes
  classes: SchoolClass[];
  createClass: (cls: Omit<SchoolClass, 'id'>) => void;
  updateClass: (id: string, updates: Partial<SchoolClass>) => void;
  deleteClass: (id: string) => void;
  archiveClass: (id: string) => void;

  // Subjects
  subjects: SchoolSubject[];
  createSubject: (sub: Omit<SchoolSubject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<SchoolSubject>) => void;
  toggleSubjectActive: (id: string) => void;

  // Rooms
  rooms: SchoolRoom[];
  createRoom: (room: Omit<SchoolRoom, 'id'>) => void;
  updateRoom: (id: string, updates: Partial<SchoolRoom>) => void;
  deleteRoom: (id: string) => void;

  // Academic Years
  academicYears: AcademicYear[];
  openNewAcademicYear: (yearLabel: string, startDate: string, endDate: string) => void;
  closeAcademicYear: (id: string) => void;

  // Assignments
  assignTeacherToClass: (teacherId: string, classId: string) => void;
  unassignTeacherFromClass: (teacherId: string, classId: string) => void;
  assignTeacherToSubject: (teacherId: string, subjectId: string) => void;
  unassignTeacherFromSubject: (teacherId: string, subjectId: string) => void;
  assignPrincipalTeacher: (classId: string, teacherId: string) => void;
  assignRoomToClass: (classId: string, roomId: string) => void;

  // Documents
  documentTemplates: AdministrativeDocumentTemplate[];
  updateDocumentTemplate: (id: string, updates: Partial<AdministrativeDocumentTemplate>) => void;
  viewingDocumentTemplate: AdministrativeDocumentTemplate | null;
  setViewingDocumentTemplate: (doc: AdministrativeDocumentTemplate | null) => void;

  // Events
  events: AdministrativeEvent[];
  createEvent: (ev: Omit<AdministrativeEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;

  // Logs
  schoolLogs: SchoolLoginLog[];
}

const SchoolAdminContext = createContext<SchoolAdminContextType | undefined>(undefined);

function readPersistedPinLock(schoolId: string): { attempts: number; blockedUntil: number } {
  try {
    const raw = localStorage.getItem(pinLockStorageKey(schoolId));
    if (raw) {
      const parsed = JSON.parse(raw);
      const blockedUntil = Number(parsed.blockedUntil || 0);
      const attempts = Number(parsed.attempts || 0);
      if (blockedUntil > Date.now()) {
        return { attempts, blockedUntil };
      }
      if (blockedUntil > 0 && blockedUntil <= Date.now()) {
        localStorage.removeItem(pinLockStorageKey(schoolId));
        return { attempts: 0, blockedUntil: 0 };
      }
      return { attempts, blockedUntil: 0 };
    }
  } catch {
    // ignore
  }
  return { attempts: 0, blockedUntil: 0 };
}

export const SchoolAdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { schools, showToast } = useApp();

  const [activeSchoolTab, setActiveSchoolTab] = useState<SchoolAdminNavTab>('dashboard');
  const [currentSchoolId, setCurrentSchoolId] = usePersistedState<string>(
    'smartschool_current_school_id_v1',
    schools[0]?.id || 'sch-gn-ck-001'
  );

  // Find active school (supports both ECOLE-001 aliases and sch-gn-* IDs)
  const currentSchool = resolveSchoolForContext(schools, currentSchoolId) || schools[0];
  const canonicalSchoolId = getCanonicalSchoolId(currentSchool?.id || currentSchoolId);

  // PIN & 2FA security states (loaded & persisted per school)
  const [securityConfig, setSecurityConfig] = useState<SchoolSecurityConfig>(() =>
    loadSchoolSecurityConfig(canonicalSchoolId)
  );
  const [activeChallengeToken, setActiveChallengeToken] = useState<string | null>(null);
  const [lastSentOtp, setLastSentOtp] = useState<SentSchoolOtp | null>(null);

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pendingPinAction, setPendingPinAction] = useState<{ description: string; callback: () => void } | null>(null);
  const [failedPinAttempts, setFailedPinAttempts] = useState<number>(() => readPersistedPinLock(canonicalSchoolId).attempts);
  const [pinBlockedUntil, setPinBlockedUntil] = useState<number>(() => readPersistedPinLock(canonicalSchoolId).blockedUntil);
  const isTemporarilyBlocked = pinBlockedUntil > Date.now();

  // Sync security config & logs whenever active school switches
  const [schoolLogs, setSchoolLogs] = useState<SchoolLoginLog[]>(() => {
    try {
      const raw = localStorage.getItem(logsStorageKey(canonicalSchoolId));
      return raw ? JSON.parse(raw) : initialSchoolLoginLogs;
    } catch {
      return initialSchoolLoginLogs;
    }
  });

  useEffect(() => {
    setSecurityConfig(loadSchoolSecurityConfig(canonicalSchoolId));
    setActiveChallengeToken(null);
    setLastSentOtp(null);
    const lock = readPersistedPinLock(canonicalSchoolId);
    setFailedPinAttempts(lock.attempts);
    setPinBlockedUntil(lock.blockedUntil);
    setSchoolLogs(loadLocalStorage<SchoolLoginLog[]>(logsStorageKey(canonicalSchoolId), initialSchoolLoginLogs));

    const unsubSec = subscribeStorageKey(securityStorageKey(canonicalSchoolId), (data, _ts, src) => {
      if (src === 'remote' && data && typeof data === 'object') {
        setSecurityConfig(data as SchoolSecurityConfig);
      }
    });
    const unsubLogs = subscribeStorageKey(logsStorageKey(canonicalSchoolId), (data, _ts, src) => {
      if (src === 'remote' && Array.isArray(data)) {
        setSchoolLogs(data as SchoolLoginLog[]);
      }
    });
    return () => {
      unsubSec();
      unsubLogs();
    };
  }, [canonicalSchoolId]);

  useEffect(() => {
    if (pinBlockedUntil <= Date.now()) return;
    const ms = pinBlockedUntil - Date.now();
    const timer = setTimeout(() => {
      setPinBlockedUntil(0);
      setFailedPinAttempts(0);
      try {
        localStorage.removeItem(pinLockStorageKey(canonicalSchoolId));
      } catch {
        // ignore
      }
    }, ms);
    return () => clearTimeout(timer);
  }, [pinBlockedUntil, canonicalSchoolId]);

  // Entities states with dual localStorage + IndexedDB persistence
  const [staff, setStaff] = usePersistedState<StaffMember[]>('smartschool_staff', initialStaffMembers, reconcilePersistedStaff);
  const [classes, setClasses] = usePersistedState<SchoolClass[]>('smartschool_classes', initialClasses);
  const [subjects, setSubjects] = usePersistedState<SchoolSubject[]>('smartschool_subjects', initialSubjects);
  const [rooms, setRooms] = usePersistedState<SchoolRoom[]>('smartschool_rooms', initialRooms);
  const [academicYears, setAcademicYears] = usePersistedState<AcademicYear[]>('smartschool_academic_years', initialAcademicYears);
  const [events, setEvents] = usePersistedState<AdministrativeEvent[]>('smartschool_school_events_v1', initialAdministrativeEvents);
  const [documentTemplates, setDocumentTemplates] = usePersistedState<AdministrativeDocumentTemplate[]>('smartschool_doc_templates_v1', initialDocumentTemplates);

  const [selectedStaffForBadge, setSelectedStaffForBadge] = useState<StaffMember | null>(null);
  const [viewingDocumentTemplate, setViewingDocumentTemplate] = useState<AdministrativeDocumentTemplate | null>(null);
  const [lastStaffCredentialReceipt, setLastStaffCredentialReceipt] = useState<StaffCredentialReceipt | null>(null);

  const logAdminAudit = (
    action: string,
    target: string,
    type: 'admin' | 'securite' | 'ecole' | 'connexion' = 'admin',
    severity: 'info' | 'warning' | 'critical' = 'info',
    operation?: AuditOperationType
  ) => {
    const session = readCurrentSessionSnapshot();
    const resolvedActorName =
      session?.role === 'school_admin' && session.name
        ? session.name
        : currentSchool?.name
          ? `Admin ${currentSchool.code || 'École'}`
          : 'Admin École';
    recordGlobalAuditLog({
      action,
      target,
      actorName: resolvedActorName,
      actorRole: 'school_admin',
      actorMatricule: session?.role === 'school_admin' ? session.matricule : undefined,
      schoolName: currentSchool?.name || "Lycée d'Excellence de Conakry",
      type,
      severity,
      operation
    });
  };

  const recordLog = (userName: string, status: 'succes' | 'echec', deviceLabel: string) => {
    const entry = appendSchoolLoginLog(canonicalSchoolId, {
      schoolId: canonicalSchoolId,
      userName,
      role: 'Admin École',
      ip: '197.149.214.33',
      device: deviceLabel,
      location: currentSchool?.city || 'Conakry, Guinée',
      status
    });
    setSchoolLogs(prev => [entry, ...prev].slice(0, 40));
  };

  // 2FA Controls
  const toggleTwoFactor = (enabled?: boolean) => {
    setSecurityConfig(prev => {
      const nextEnabled = typeof enabled === 'boolean' ? enabled : !prev.twoFactorEnabled;
      const nextConfig: SchoolSecurityConfig = { ...prev, twoFactorEnabled: nextEnabled };
      saveSchoolSecurityConfig(canonicalSchoolId, nextConfig);
      showToast(
        nextEnabled
          ? 'Double Authentification (2FA) activée et exigée pour les connexions et validations.'
          : 'Double Authentification (2FA) désactivée pour cet établissement.'
      );
      recordLog(
        `Admin École (${nextEnabled ? 'Activation 2FA' : 'Désactivation 2FA'})`,
        'succes',
        'Console Sécurité École'
      );
      return nextConfig;
    });
  };

  const setTwoFactorMethod = (method: School2FAMethod) => {
    setSecurityConfig(prev => {
      const nextConfig: SchoolSecurityConfig = { ...prev, twoFactorMethod: method };
      saveSchoolSecurityConfig(canonicalSchoolId, nextConfig);
      return nextConfig;
    });
    setActiveChallengeToken(null);
    setLastSentOtp(null);
    const label =
      method === 'authenticator'
        ? 'Google / Microsoft Authenticator (TOTP)'
        : method === 'sms'
        ? 'SMS Sécurisé Guinée'
        : 'Code temporaire par Email';
    showToast(`Méthode 2FA définie sur : ${label}`);
  };

  const regenerateTotpSecret = () => {
    const nextSecret = generateTotpSecret(16);
    setSecurityConfig(prev => {
      const nextConfig: SchoolSecurityConfig = {
        ...prev,
        totpSecret: nextSecret,
        lastVerifiedAt: undefined
      };
      saveSchoolSecurityConfig(canonicalSchoolId, nextConfig);
      return nextConfig;
    });
    recordLog('Admin École (Renouvellement clé TOTP)', 'succes', 'Console Sécurité École');
    showToast('Nouvelle clé QR Authenticator générée. Scannez-la dans votre application.');
  };

  const sendSchool2faOtp = async (channel?: 'sms' | 'email'): Promise<SentSchoolOtp | null> => {
    const chosen: 'sms' | 'email' =
      channel || (securityConfig.twoFactorMethod === 'email' ? 'email' : 'sms');
    const destination = chosen === 'sms' ? currentSchool.phone : currentSchool.email;
    const res = await requestServerOtp({
      channel: chosen,
      destination,
      purpose: `Validation Admin École ${currentSchool.code || canonicalSchoolId}`
    });
    if (!res.ok || !res.challengeToken) {
      showToast(res.error || "Impossible d'envoyer le code OTP.");
      return null;
    }
    const info: SentSchoolOtp = {
      challengeToken: res.challengeToken,
      method: chosen,
      maskedDestination: res.maskedDestination || maskDestinationLabel(chosen, destination),
      deliveryStatus: res.deliveryStatus || 'sent',
      sentAt: res.sentAt || new Date().toLocaleTimeString('fr-FR'),
      message: res.message || 'Code envoyé.'
    };
    setActiveChallengeToken(res.challengeToken);
    setLastSentOtp(info);
    showToast(`Demande OTP transmise (${chosen.toUpperCase()}) vers ${info.maskedDestination}`);
    return info;
  };

  const verifySchool2faCode = async (code: string): Promise<{ ok: boolean; error?: string }> => {
    const clean = code.trim();
    if (!/^\d{6}$/.test(clean)) {
      return { ok: false, error: 'Le code 2FA doit contenir exactement 6 chiffres.' };
    }

    let valid = false;
    let verifyError: string | undefined;
    if (securityConfig.twoFactorMethod === 'authenticator') {
      valid = await verifyTotpCode(securityConfig.totpSecret, clean, 1);
      if (!valid && activeChallengeToken) {
        const otpRes = await verifyServerOtp({ challengeToken: activeChallengeToken, code: clean });
        valid = otpRes.ok;
        verifyError = otpRes.error;
      }
    } else if (activeChallengeToken) {
      const otpRes = await verifyServerOtp({ challengeToken: activeChallengeToken, code: clean });
      valid = otpRes.ok;
      verifyError = otpRes.error;
    }

    if (!valid) {
      recordLog('Vérification Test 2FA Admin École', 'echec', 'Console Sécurité École');
      return {
        ok: false,
        error:
          verifyError ||
          (securityConfig.twoFactorMethod === 'authenticator'
            ? 'Code Authenticator incorrect ou expiré. Vérifiez le code à 6 chiffres généré.'
            : 'Code OTP incorrect. Cliquez d’abord sur « Envoyer un code ».')
      };
    }

    const verifiedAt = new Date().toLocaleString('fr-FR');
    setSecurityConfig(prev => {
      const nextConfig: SchoolSecurityConfig = { ...prev, lastVerifiedAt: verifiedAt };
      saveSchoolSecurityConfig(canonicalSchoolId, nextConfig);
      return nextConfig;
    });
    setActiveChallengeToken(null);
    recordLog('Vérification 2FA Admin École confirmée', 'succes', 'Console Sécurité École');
    showToast('Double Authentification (2FA) vérifiée et opérationnelle !');
    return { ok: true };
  };

  // Execute with PIN (+ 2FA when enabled) modal trigger
  const executeWithPin = (actionDescription: string, callback: () => void) => {
    if (pinBlockedUntil > Date.now()) {
      showToast("Accès verrouillé temporairement après 5 tentatives échouées. Patientez 5 minutes.");
      return;
    }
    setActiveChallengeToken(null);
    setLastSentOtp(null);
    setPendingPinAction({ description: actionDescription, callback });
    setPinModalOpen(true);
  };

  const verifyAndExecutePin = async (
    inputPin: string,
    _twoFactorCode?: string
  ): Promise<{ ok: boolean; error?: string }> => {
    if (pinBlockedUntil > Date.now()) {
      return { ok: false, error: 'Compte temporairement verrouillé pendant 5 minutes suite à 5 échecs.' };
    }
    if (inputPin !== securityConfig.adminPin) {
      const nextFailed = failedPinAttempts + 1;
      setFailedPinAttempts(nextFailed);
      const nextBlockedUntil = nextFailed >= 5 ? Date.now() + 300000 : 0;
      if (nextBlockedUntil > 0) {
        setPinBlockedUntil(nextBlockedUntil);
      }
      try {
        localStorage.setItem(
          pinLockStorageKey(canonicalSchoolId),
          JSON.stringify({ attempts: nextFailed, blockedUntil: nextBlockedUntil })
        );
      } catch {
        // ignore
      }
      recordLog(`Échec PIN (${pendingPinAction?.description || 'Action sensible'})`, 'echec', 'Validation PIN Admin');
      return { ok: false, error: `Code PIN incorrect. Tentative ${nextFailed}/5.` };
    }

    setFailedPinAttempts(0);
    setPinBlockedUntil(0);
    try {
      localStorage.removeItem(pinLockStorageKey(canonicalSchoolId));
    } catch {
      // ignore
    }
    setPinModalOpen(false);
    if (pendingPinAction) {
      recordLog(`Action autorisée (${pendingPinAction.description})`, 'succes', 'Validation Code PIN');
      pendingPinAction.callback();
      setPendingPinAction(null);
    }
    return { ok: true };
  };

  const updateAdminPin = (oldPin: string, newPin: string): boolean => {
    if (oldPin === securityConfig.adminPin && newPin.length === 6 && /^\d+$/.test(newPin)) {
      setSecurityConfig(prev => {
        const nextConfig: SchoolSecurityConfig = { ...prev, adminPin: newPin };
        saveSchoolSecurityConfig(canonicalSchoolId, nextConfig);
        return nextConfig;
      });
      recordLog('Modification du Code PIN Admin École', 'succes', 'Console Sécurité École');
      logAdminAudit('Modification du Code PIN Administrateur École', currentSchool?.name || 'Établissement', 'securite', 'warning');
      showToast("Code PIN Administrateur mis à jour avec succès !");
      return true;
    }
    return false;
  };

  // Staff CRUD
  const createStaff = (
    memberData: Omit<StaffMember, 'id' | 'matricule' | 'qrToken' | 'credentialsSent' | 'username'>,
    initialPassword?: string
  ): StaffMember => {
    const rolePrefix = memberData.role.substring(0, 3).toUpperCase();
    const matricule = `${currentSchool.code || 'LEC'}-${rolePrefix}-${String(staff.length + 1).padStart(3, '0')}`;
    const username = `${memberData.firstName.charAt(0).toLowerCase()}.${memberData.lastName.toLowerCase().replace(/\s+/g, '')}`;
    const trimmedCustomPassword = initialPassword?.trim();
    const tempPassword = trimmedCustomPassword || `SmartPass#${Math.floor(1000 + Math.random() * 9000)}`;

    const newStaff: StaffMember = {
      ...memberData,
      id: `stf-${Date.now()}`,
      matricule,
      username,
      temporaryPassword: tempPassword,
      credentialsSent: false,
      qrToken: `QR-${matricule}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      assignedClasses: [],
      assignedSubjects: []
    };

    setStaff(prev => [newStaff, ...prev]);
    propagateStaffMemberChange({
      member: newStaff,
      schoolId: canonicalSchoolId,
      schoolName: currentSchool?.name || "Lycée d'Excellence de Conakry"
    });
    logAdminAudit(
      `Création collaborateur ${newStaff.firstName} ${newStaff.lastName} (${newStaff.role})`,
      `Matricule ${newStaff.matricule}`,
      'admin',
      'info',
      'create'
    );
    setLastStaffCredentialReceipt({
      member: newStaff,
      password: tempPassword,
      action: 'created'
    });
    showToast(`Employé ${newStaff.firstName} ${newStaff.lastName} créé (${newStaff.role})`);
    return newStaff;
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>, newPassword?: string) => {
    const existing = staff.find(s => s.id === id);
    if (!existing) return;
    const cleanNewPass = newPassword?.trim();
    const updatedMember: StaffMember = {
      ...existing,
      ...updates,
      ...(cleanNewPass ? { temporaryPassword: cleanNewPass } : {})
    };
    setStaff(prev => prev.map(s => (s.id === id ? updatedMember : s)));
    propagateStaffMemberChange({
      oldEmail: existing.email,
      oldMatricule: existing.matricule,
      member: updatedMember,
      schoolId: canonicalSchoolId,
      schoolName: currentSchool?.name || "Lycée d'Excellence de Conakry"
    });
    logAdminAudit(
      `Modification profil employé ${updatedMember.firstName} ${updatedMember.lastName}${cleanNewPass ? ' + mot de passe' : ''}`,
      `${updatedMember.role} · ${updatedMember.matricule}`,
      cleanNewPass ? 'securite' : 'admin',
      cleanNewPass ? 'warning' : 'info',
      'update'
    );
    if (cleanNewPass) {
      setLastStaffCredentialReceipt({
        member: updatedMember,
        password: cleanNewPass,
        action: 'updated'
      });
    }
    showToast(cleanNewPass ? "Profil et mot de passe de l'employé mis à jour" : "Profil employé mis à jour");
  };

  const toggleStaffStatus = (id: string) => {
    const existing = staff.find(s => s.id === id);
    if (!existing) return;
    const nextStatus = existing.status === 'actif' ? 'suspendu' : 'actif';
    const updatedMember: StaffMember = { ...existing, status: nextStatus };
    setStaff(prev => prev.map(s => (s.id === id ? updatedMember : s)));
    propagateStaffMemberChange({
      oldEmail: existing.email,
      oldMatricule: existing.matricule,
      member: updatedMember,
      schoolId: canonicalSchoolId,
      schoolName: currentSchool?.name || "Lycée d'Excellence de Conakry"
    });
    logAdminAudit(
      `Statut employé ${updatedMember.firstName} ${updatedMember.lastName} passé à ${nextStatus.toUpperCase()}`,
      updatedMember.matricule,
      'securite',
      nextStatus === 'suspendu' ? 'warning' : 'info',
      'update'
    );
    showToast(`Statut employé changé : ${nextStatus.toUpperCase()}`);
  };

  const resetStaffPassword = (id: string, customPassword?: string) => {
    const targetMember = staff.find(s => s.id === id);
    const label = targetMember
      ? `Définir / Réinitialiser le mot de passe de ${targetMember.firstName} ${targetMember.lastName}`
      : "Réinitialiser le mot de passe de l'employé";
    executeWithPin(label, () => {
      const currentList = loadLocalStorage<StaffMember[]>('smartschool_staff', staff, reconcilePersistedStaff);
      const existing = currentList.find(s => s.id === id);
      if (!existing) return;
      const tempPassword = customPassword?.trim() || `SmartPass#${Math.floor(1000 + Math.random() * 9000)}`;
      const updatedMember: StaffMember = { ...existing, temporaryPassword: tempPassword };
      setStaff(currentList.map(s => (s.id === id ? updatedMember : s)));
      propagateStaffMemberChange({
        oldEmail: existing.email,
        oldMatricule: existing.matricule,
        member: updatedMember,
        schoolId: canonicalSchoolId,
        schoolName: currentSchool?.name || "Lycée d'Excellence de Conakry"
      });
      logAdminAudit(
        `Réinitialisation mot de passe ${updatedMember.firstName} ${updatedMember.lastName} (${updatedMember.role})`,
        updatedMember.matricule,
        'securite',
        'warning',
        'update'
      );
      setLastStaffCredentialReceipt({
        member: updatedMember,
        password: tempPassword,
        action: 'reset'
      });
      showToast(`Mot de passe activé pour ${updatedMember.firstName} ${updatedMember.lastName} : ${tempPassword}`);
    });
  };

  const deleteStaff = (id: string) => {
    executeWithPin("Supprimer définitivement cet employé du personnel", () => {
      const currentList = loadLocalStorage<StaffMember[]>('smartschool_staff', staff, reconcilePersistedStaff);
      const existing = currentList.find(s => s.id === id);
      setStaff(currentList.filter(s => s.id !== id));
      if (existing) {
        propagateStaffMemberChange({
          oldEmail: existing.email,
          oldMatricule: existing.matricule,
          member: existing,
          schoolId: canonicalSchoolId,
          schoolName: currentSchool?.name || "Lycée d'Excellence de Conakry",
          removed: true
        });
        logAdminAudit(
          `Suppression définitive du collaborateur ${existing.firstName} ${existing.lastName} (${existing.role})`,
          existing.matricule,
          'securite',
          'critical',
          'delete'
        );
      }
      showToast("Employé supprimé du registre de l'école");
    });
  };

  const sendStaffCredentials = (id: string, channel: 'email' | 'whatsapp' = 'email', recipient?: string) => {
    const member = staff.find(s => s.id === id);
    if (!member) return;

    const target = recipient || (channel === 'whatsapp' ? member.phone : member.email);
    setStaff(prev => prev.map(s => s.id === id ? { ...s, credentialsSent: true } : s));
    logAdminAudit(
      `Envoi des identifiants de connexion (${channel === 'whatsapp' ? 'WhatsApp' : 'Email'}) à ${member.firstName} ${member.lastName}`,
      `${target} · ${member.matricule}`,
      'admin',
      'info'
    );
    showToast(`Identifiants prêts / transmis par ${channel === 'whatsapp' ? 'WhatsApp' : 'Email'} à ${target} !`);
  };

  // Classes CRUD
  const createClass = (clsData: Omit<SchoolClass, 'id'>) => {
    const newClass: SchoolClass = {
      ...clsData,
      id: `cls-${Date.now()}`
    };
    setClasses(prev => [...prev, newClass]);
    logAdminAudit(`Création de la classe « ${newClass.name} »`, newClass.level, 'admin', 'info', 'create');
    showToast(`Classe « ${newClass.name} » créée`);
  };

  const updateClass = (id: string, updates: Partial<SchoolClass>) => {
    const existing = classes.find(c => c.id === id);
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    logAdminAudit(`Modification de la classe « ${updates.name || existing?.name || id} »`, existing?.level || 'Classe', 'admin', 'info', 'update');
    showToast("Classe mise à jour");
  };

  const deleteClass = (id: string) => {
    const existing = classes.find(c => c.id === id);
    executeWithPin("Supprimer définitivement la classe", () => {
      setClasses(prev => prev.filter(c => c.id !== id));
      logAdminAudit(`Suppression de la classe « ${existing?.name || id} »`, existing?.level || 'Classe', 'securite', 'warning', 'delete');
      showToast("Classe supprimée");
    });
  };

  const archiveClass = (id: string) => {
    const existing = classes.find(c => c.id === id);
    setClasses(prev => prev.map(c => c.id === id ? { ...c, archived: !c.archived } : c));
    logAdminAudit(`Archivage / Désarchivage de la classe « ${existing?.name || id} »`, existing?.level || 'Classe', 'admin', 'info', 'update');
    showToast("État d'archivage de la classe modifié");
  };

  // Subjects CRUD
  const createSubject = (subData: Omit<SchoolSubject, 'id'>) => {
    const newSub: SchoolSubject = {
      ...subData,
      id: `subj-${Date.now()}`
    };
    setSubjects(prev => [...prev, newSub]);
    logAdminAudit(`Création matière « ${newSub.name} » (Coef ${newSub.coefficient})`, newSub.department, 'admin', 'info', 'create');
    showToast(`Matière « ${newSub.name} » créée (Coef ${newSub.coefficient})`);
  };

  const updateSubject = (id: string, updates: Partial<SchoolSubject>) => {
    const existing = subjects.find(s => s.id === id);
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logAdminAudit(`Modification matière « ${updates.name || existing?.name || id} »`, `Coef ${updates.coefficient ?? existing?.coefficient ?? '-'}`, 'admin', 'info', 'update');
    showToast("Matière mise à jour");
  };

  const toggleSubjectActive = (id: string) => {
    const existing = subjects.find(s => s.id === id);
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    logAdminAudit(`Changement statut matière « ${existing?.name || id} »`, existing?.department || 'Matière', 'admin', 'info', 'update');
    showToast("Statut de la matière modifié");
  };

  // Rooms CRUD
  const createRoom = (roomData: Omit<SchoolRoom, 'id'>) => {
    const newRoom: SchoolRoom = {
      ...roomData,
      id: `room-${Date.now()}`
    };
    setRooms(prev => [...prev, newRoom]);
    logAdminAudit(`Création salle « ${newRoom.name} »`, `${newRoom.capacity} places`, 'admin', 'info', 'create');
    showToast(`Salle « ${newRoom.name} » créée`);
  };

  const updateRoom = (id: string, updates: Partial<SchoolRoom>) => {
    const existing = rooms.find(r => r.id === id);
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    logAdminAudit(`Modification salle « ${updates.name || existing?.name || id} »`, existing?.type || 'Campus', 'admin', 'info', 'update');
    showToast("Salle mise à jour");
  };

  const deleteRoom = (id: string) => {
    const existing = rooms.find(r => r.id === id);
    executeWithPin("Supprimer la salle / installation", () => {
      setRooms(prev => prev.filter(r => r.id !== id));
      logAdminAudit(`Suppression salle « ${existing?.name || id} »`, existing?.type || 'Campus', 'securite', 'warning', 'delete');
      showToast("Salle retirée de l'établissement");
    });
  };

  // Academic Years
  const openNewAcademicYear = (yearLabel: string, startDate: string, endDate: string) => {
    executeWithPin(`Ouvrir la nouvelle année scolaire ${yearLabel}`, () => {
      setAcademicYears(prev => [
        {
          id: `ay-${yearLabel.replace('-', '_')}`,
          schoolId: currentSchool.id,
          yearLabel,
          status: 'active',
          startDate,
          endDate,
          terms: [
            { id: `t1-${Date.now()}`, name: '1er Trimestre', startDate, endDate: '2027-12-22', isCurrent: true },
            { id: `t2-${Date.now()}`, name: '2ème Trimestre', startDate: '2028-01-05', endDate: '2028-03-31', isCurrent: false },
            { id: `t3-${Date.now()}`, name: '3ème Trimestre', startDate: '2028-04-12', endDate, isCurrent: false }
          ]
        },
        ...prev.map(y => ({ ...y, status: 'cloturee' as const }))
      ]);
      logAdminAudit(`Ouverture année scolaire ${yearLabel}`, `${startDate} → ${endDate}`, 'admin', 'warning', 'create');
      showToast(`Année scolaire ${yearLabel} déclarée active !`);
    });
  };

  const closeAcademicYear = (id: string) => {
    const existing = academicYears.find(y => y.id === id);
    executeWithPin("Clôturer officiellement l'année scolaire", () => {
      setAcademicYears(prev => prev.map(y => y.id === id ? { ...y, status: 'cloturee' } : y));
      logAdminAudit(`Clôture année scolaire ${existing?.yearLabel || id}`, 'Archive académique', 'securite', 'warning', 'update');
      showToast("Année scolaire clôturée avec succès");
    });
  };

  // Assignments
  const assignTeacherToClass = (teacherId: string, classId: string) => {
    const teacher = staff.find(s => s.id === teacherId);
    const cls = classes.find(c => c.id === classId);
    if (!teacher || !cls) return;

    setStaff(prev => prev.map(s => {
      if (s.id === teacherId) {
        const assigned = s.assignedClasses || [];
        if (!assigned.includes(classId)) {
          return { ...s, assignedClasses: [...assigned, classId] };
        }
      }
      return s;
    }));
    logAdminAudit(`Affectation enseignant ${teacher.firstName} ${teacher.lastName} → ${cls.name}`, teacher.matricule, 'admin', 'info', 'update');
    showToast(`${teacher.firstName} ${teacher.lastName} affecté à la classe ${cls.name}`);
  };

  const unassignTeacherFromClass = (teacherId: string, classId: string) => {
    const teacher = staff.find(s => s.id === teacherId);
    const cls = classes.find(c => c.id === classId);
    setStaff(prev => prev.map(s => {
      if (s.id === teacherId) {
        return { ...s, assignedClasses: (s.assignedClasses || []).filter(id => id !== classId) };
      }
      return s;
    }));
    if (teacher && cls) {
      logAdminAudit(`Retrait enseignant ${teacher.firstName} ${teacher.lastName} de ${cls.name}`, teacher.matricule, 'admin', 'info', 'delete');
      showToast(`${teacher.firstName} ${teacher.lastName} retiré de la classe ${cls.name}`);
    }
  };

  const assignTeacherToSubject = (teacherId: string, subjectId: string) => {
    const teacher = staff.find(s => s.id === teacherId);
    const sub = subjects.find(s => s.id === subjectId);
    if (!teacher || !sub) return;

    setStaff(prev => prev.map(s => {
      if (s.id === teacherId) {
        const assigned = s.assignedSubjects || [];
        if (!assigned.includes(subjectId)) {
          return { ...s, assignedSubjects: [...assigned, subjectId] };
        }
      }
      return s;
    }));
    logAdminAudit(`Attribution matière ${sub.name} à ${teacher.firstName} ${teacher.lastName}`, teacher.matricule, 'admin', 'info', 'update');
    showToast(`${teacher.firstName} ${teacher.lastName} enseigne désormais ${sub.name}`);
  };

  const unassignTeacherFromSubject = (teacherId: string, subjectId: string) => {
    const teacher = staff.find(s => s.id === teacherId);
    const sub = subjects.find(s => s.id === subjectId);
    setStaff(prev => prev.map(s => {
      if (s.id === teacherId) {
        return { ...s, assignedSubjects: (s.assignedSubjects || []).filter(id => id !== subjectId) };
      }
      return s;
    }));
    if (teacher && sub) {
      logAdminAudit(`Retrait matière ${sub.name} de ${teacher.firstName} ${teacher.lastName}`, teacher.matricule, 'admin', 'info', 'delete');
      showToast(`Matière ${sub.name} retirée de ${teacher.firstName} ${teacher.lastName}`);
    }
  };

  const assignPrincipalTeacher = (classId: string, teacherId: string) => {
    const teacher = staff.find(s => s.id === teacherId);
    const cls = classes.find(c => c.id === classId);
    if (!teacher || !cls) return;

    setClasses(prev => prev.map(c => c.id === classId ? {
      ...c,
      principalTeacherId: teacherId,
      principalTeacherName: `${teacher.firstName} ${teacher.lastName}`
    } : c));
    logAdminAudit(`Nomination Professeur Principal ${teacher.firstName} ${teacher.lastName} (${cls.name})`, teacher.matricule, 'admin', 'info', 'update');
    showToast(`${teacher.firstName} ${teacher.lastName} nommé Professeur Principal de ${cls.name}`);
  };

  const assignRoomToClass = (classId: string, roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    const cls = classes.find(c => c.id === classId);
    if (!room || !cls) return;

    setClasses(prev => prev.map(c => c.id === classId ? {
      ...c,
      mainRoomId: roomId,
      mainRoomName: room.name
    } : c));
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, currentOccupation: cls.name } : r));
    logAdminAudit(`Attribution salle ${room.name} à ${cls.name}`, room.type || 'Campus', 'admin', 'info', 'update');
    showToast(`Salle ${room.name} attribuée à la classe ${cls.name}`);
  };

  // Documents
  const updateDocumentTemplate = (id: string, updates: Partial<AdministrativeDocumentTemplate>) => {
    const existing = documentTemplates.find(d => d.id === id);
    setDocumentTemplates(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    logAdminAudit(`Mise à jour modèle document « ${updates.title || existing?.title || id} »`, 'Documents Administratifs', 'admin', 'info', 'update');
    showToast("Modèle de document administratif sauvegardé");
  };

  // Events
  const createEvent = (evData: Omit<AdministrativeEvent, 'id'>) => {
    const newEv: AdministrativeEvent = {
      ...evData,
      id: `ev-${Date.now()}`
    };
    setEvents(prev => [newEv, ...prev]);
    logAdminAudit(`Publication événement administratif « ${newEv.title} »`, newEv.date, 'admin', 'info', 'create');
    showToast(`Événement « ${newEv.title} » publié pour le personnel`);
  };

  const deleteEvent = (id: string) => {
    const existing = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    logAdminAudit(`Suppression événement « ${existing?.title || id} »`, existing?.date || 'Calendrier', 'admin', 'info', 'delete');
    showToast("Événement administratif supprimé");
  };

  const value: SchoolAdminContextType = {
    activeSchoolTab,
    setActiveSchoolTab,
    currentSchool,
    setCurrentSchoolId,
    pinModalOpen,
    setPinModalOpen,
    pendingPinAction,
    executeWithPin,
    verifyAndExecutePin,
    failedPinAttempts,
    isTemporarilyBlocked,
    updateAdminPin,
    twoFactorEnabled: securityConfig.twoFactorEnabled,
    twoFactorMethod: securityConfig.twoFactorMethod,
    totpSecret: securityConfig.totpSecret,
    last2faVerifiedAt: securityConfig.lastVerifiedAt,
    lastSentOtp,
    toggleTwoFactor,
    setTwoFactorMethod,
    regenerateTotpSecret,
    sendSchool2faOtp,
    verifySchool2faCode,
    staff,
    createStaff,
    updateStaff,
    toggleStaffStatus,
    resetStaffPassword,
    deleteStaff,
    sendStaffCredentials,
    selectedStaffForBadge,
    setSelectedStaffForBadge,
    lastStaffCredentialReceipt,
    setLastStaffCredentialReceipt,
    classes,
    createClass,
    updateClass,
    deleteClass,
    archiveClass,
    subjects,
    createSubject,
    updateSubject,
    toggleSubjectActive,
    rooms,
    createRoom,
    updateRoom,
    deleteRoom,
    academicYears,
    openNewAcademicYear,
    closeAcademicYear,
    assignTeacherToClass,
    unassignTeacherFromClass,
    assignTeacherToSubject,
    unassignTeacherFromSubject,
    assignPrincipalTeacher,
    assignRoomToClass,
    documentTemplates,
    updateDocumentTemplate,
    viewingDocumentTemplate,
    setViewingDocumentTemplate,
    events,
    createEvent,
    deleteEvent,
    schoolLogs
  };

  return <SchoolAdminContext.Provider value={value}>{children}</SchoolAdminContext.Provider>;
};

export const useSchoolAdmin = () => {
  const context = useContext(SchoolAdminContext);
  if (!context) {
    throw new Error('useSchoolAdmin must be used within a SchoolAdminProvider');
  }
  return context;
};
