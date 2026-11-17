import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { resolveSchoolForContext } from '../utils/whatsapp';
import { generateTotpSecret, verifyTotpCode } from '../utils/totp';
import { saveDualStorage, usePersistedState } from '../utils/storage';
import { 
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
  | 'reports'
  | 'security'
  | 'settings';

export type School2FAMethod = 'authenticator' | 'sms' | 'email';

export interface SchoolSecurityConfig {
  adminPin: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: School2FAMethod;
  totpSecret: string;
  lastVerifiedAt?: string;
}

export interface SentSchoolOtp {
  method: 'sms' | 'email';
  destination: string;
  code: string;
  sentAt: string;
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

export function loadSchoolSecurityConfig(schoolIdOrAlias?: string): SchoolSecurityConfig {
  const key = securityStorageKey(schoolIdOrAlias);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        adminPin:
          typeof parsed.adminPin === 'string' && /^\d{6}$/.test(parsed.adminPin)
            ? parsed.adminPin
            : '123456',
        twoFactorEnabled: typeof parsed.twoFactorEnabled === 'boolean' ? parsed.twoFactorEnabled : true,
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

  const fresh: SchoolSecurityConfig = {
    adminPin: '123456',
    twoFactorEnabled: true,
    twoFactorMethod: 'authenticator',
    totpSecret: generateTotpSecret(16)
  };
  try {
    localStorage.setItem(key, JSON.stringify(fresh));
  } catch {
    // ignore storage write errors
  }
  return fresh;
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
    const raw = localStorage.getItem(key);
    const existing: SchoolLoginLog[] = raw ? JSON.parse(raw) : initialSchoolLoginLogs;
    localStorage.setItem(key, JSON.stringify([newLog, ...existing].slice(0, 40)));
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
  sendSchool2faOtp: (channel?: 'sms' | 'email') => SentSchoolOtp;
  verifySchool2faCode: (code: string) => Promise<{ ok: boolean; error?: string }>;
  
  // Staff
  staff: StaffMember[];
  createStaff: (member: Omit<StaffMember, 'id' | 'matricule' | 'qrToken' | 'credentialsSent' | 'username'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  toggleStaffStatus: (id: string) => void;
  resetStaffPassword: (id: string) => void;
  deleteStaff: (id: string) => void;
  sendStaffCredentials: (id: string) => void;
  selectedStaffForBadge: StaffMember | null;
  setSelectedStaffForBadge: (staff: StaffMember | null) => void;

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
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>(null);
  const [lastSentOtp, setLastSentOtp] = useState<SentSchoolOtp | null>(null);

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pendingPinAction, setPendingPinAction] = useState<{ description: string; callback: () => void } | null>(null);
  const [failedPinAttempts, setFailedPinAttempts] = useState(0);
  const [isTemporarilyBlocked, setIsTemporarilyBlocked] = useState(false);

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
    setActiveOtpCode(null);
    setLastSentOtp(null);
    try {
      const raw = localStorage.getItem(logsStorageKey(canonicalSchoolId));
      setSchoolLogs(raw ? JSON.parse(raw) : initialSchoolLoginLogs);
    } catch {
      setSchoolLogs(initialSchoolLoginLogs);
    }
  }, [canonicalSchoolId]);

  useEffect(() => {
    saveSchoolSecurityConfig(canonicalSchoolId, securityConfig);
  }, [canonicalSchoolId, securityConfig]);

  // Entities states with dual localStorage + IndexedDB persistence
  const [staff, setStaff] = usePersistedState<StaffMember[]>('smartschool_staff', initialStaffMembers);
  const [classes, setClasses] = usePersistedState<SchoolClass[]>('smartschool_classes', initialClasses);
  const [subjects, setSubjects] = usePersistedState<SchoolSubject[]>('smartschool_subjects', initialSubjects);
  const [rooms, setRooms] = usePersistedState<SchoolRoom[]>('smartschool_rooms', initialRooms);
  const [academicYears, setAcademicYears] = usePersistedState<AcademicYear[]>('smartschool_academic_years', initialAcademicYears);
  const [events, setEvents] = usePersistedState<AdministrativeEvent[]>('smartschool_school_events_v1', initialAdministrativeEvents);
  const [documentTemplates, setDocumentTemplates] = usePersistedState<AdministrativeDocumentTemplate[]>('smartschool_doc_templates_v1', initialDocumentTemplates);

  const [selectedStaffForBadge, setSelectedStaffForBadge] = useState<StaffMember | null>(null);
  const [viewingDocumentTemplate, setViewingDocumentTemplate] = useState<AdministrativeDocumentTemplate | null>(null);

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
      return { ...prev, twoFactorEnabled: nextEnabled };
    });
  };

  const setTwoFactorMethod = (method: School2FAMethod) => {
    setSecurityConfig(prev => ({ ...prev, twoFactorMethod: method }));
    setActiveOtpCode(null);
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
    setSecurityConfig(prev => ({
      ...prev,
      totpSecret: nextSecret,
      lastVerifiedAt: undefined
    }));
    recordLog('Admin École (Renouvellement clé TOTP)', 'succes', 'Console Sécurité École');
    showToast('Nouvelle clé QR Authenticator générée. Scannez-la dans votre application.');
  };

  const sendSchool2faOtp = (channel?: 'sms' | 'email'): SentSchoolOtp => {
    const chosen: 'sms' | 'email' =
      channel || (securityConfig.twoFactorMethod === 'email' ? 'email' : 'sms');
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const destination = chosen === 'sms' ? currentSchool.phone : currentSchool.email;
    const sentAt = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const info: SentSchoolOtp = { method: chosen, destination, code, sentAt };
    setActiveOtpCode(code);
    setLastSentOtp(info);
    showToast(`Code 2FA envoyé par ${chosen === 'sms' ? 'SMS' : 'Email'} à ${destination}`);
    return info;
  };

  const verifySchool2faCode = async (code: string): Promise<{ ok: boolean; error?: string }> => {
    const clean = code.trim();
    if (!/^\d{6}$/.test(clean)) {
      return { ok: false, error: 'Le code 2FA doit contenir exactement 6 chiffres.' };
    }

    let valid = false;
    if (securityConfig.twoFactorMethod === 'authenticator') {
      const totpOk = await verifyTotpCode(securityConfig.totpSecret, clean, 1);
      const otpFallbackOk = activeOtpCode !== null && clean === activeOtpCode;
      valid = totpOk || otpFallbackOk;
    } else {
      valid = activeOtpCode !== null && clean === activeOtpCode;
    }

    if (!valid) {
      recordLog('Vérification Test 2FA Admin École', 'echec', 'Console Sécurité École');
      return {
        ok: false,
        error:
          securityConfig.twoFactorMethod === 'authenticator'
            ? 'Code Authenticator incorrect ou expiré. Vérifiez le code à 6 chiffres généré.'
            : 'Code OTP incorrect. Cliquez d’abord sur « Envoyer un code de test ».'
      };
    }

    const verifiedAt = new Date().toLocaleString('fr-FR');
    setSecurityConfig(prev => ({ ...prev, lastVerifiedAt: verifiedAt }));
    recordLog('Vérification 2FA Admin École confirmée', 'succes', 'Console Sécurité École');
    showToast('Double Authentification (2FA) vérifiée et opérationnelle !');
    return { ok: true };
  };

  // Execute with PIN (+ 2FA when enabled) modal trigger
  const executeWithPin = (actionDescription: string, callback: () => void) => {
    if (isTemporarilyBlocked) {
      showToast("Accès verrouillé temporairement après 5 tentatives échouées. Patientez 5 minutes.");
      return;
    }
    setActiveOtpCode(null);
    setLastSentOtp(null);
    setPendingPinAction({ description: actionDescription, callback });
    setPinModalOpen(true);
  };

  const verifyAndExecutePin = async (
    inputPin: string,
    twoFactorCode?: string
  ): Promise<{ ok: boolean; error?: string }> => {
    if (inputPin !== securityConfig.adminPin) {
      const nextFailed = failedPinAttempts + 1;
      setFailedPinAttempts(nextFailed);
      recordLog(`Échec PIN (${pendingPinAction?.description || 'Action sensible'})`, 'echec', 'Validation PIN Admin');
      if (nextFailed >= 5) {
        setIsTemporarilyBlocked(true);
        setTimeout(() => {
          setIsTemporarilyBlocked(false);
          setFailedPinAttempts(0);
        }, 300000); // 5 min
      }
      return { ok: false, error: `Code PIN incorrect. Tentative ${nextFailed}/5.` };
    }

    if (securityConfig.twoFactorEnabled) {
      const clean2FA = (twoFactorCode || '').trim();
      if (!/^\d{6}$/.test(clean2FA)) {
        return { ok: false, error: 'Code 2FA à 6 chiffres requis car la double authentification est active.' };
      }
      const check2fa = await verifySchool2faCode(clean2FA);
      if (!check2fa.ok) {
        return { ok: false, error: check2fa.error };
      }
    }

    setFailedPinAttempts(0);
    setPinModalOpen(false);
    if (pendingPinAction) {
      recordLog(`Action autorisée (${pendingPinAction.description})`, 'succes', 'Validation PIN + 2FA');
      pendingPinAction.callback();
      setPendingPinAction(null);
    }
    return { ok: true };
  };

  const updateAdminPin = (oldPin: string, newPin: string): boolean => {
    if (oldPin === securityConfig.adminPin && newPin.length === 6 && /^\d+$/.test(newPin)) {
      setSecurityConfig(prev => ({ ...prev, adminPin: newPin }));
      recordLog('Modification du Code PIN Admin École', 'succes', 'Console Sécurité École');
      showToast("Code PIN Administrateur mis à jour avec succès !");
      return true;
    }
    return false;
  };

  // Staff CRUD
  const createStaff = (memberData: Omit<StaffMember, 'id' | 'matricule' | 'qrToken' | 'credentialsSent' | 'username'>) => {
    const rolePrefix = memberData.role.substring(0, 3).toUpperCase();
    const matricule = `${currentSchool.code || 'LEC'}-${rolePrefix}-${String(staff.length + 1).padStart(3, '0')}`;
    const username = `${memberData.firstName.charAt(0).toLowerCase()}.${memberData.lastName.toLowerCase().replace(/\s+/g, '')}`;
    const tempPassword = `SmartPass#${Math.floor(1000 + Math.random() * 9000)}`;

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
    showToast(`Employé ${newStaff.firstName} ${newStaff.lastName} créé (${newStaff.role})`);
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast("Profil employé mis à jour");
  };

  const toggleStaffStatus = (id: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'actif' ? 'suspendu' : 'actif';
        showToast(`Statut employé changé : ${nextStatus.toUpperCase()}`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const resetStaffPassword = (id: string) => {
    executeWithPin("Réinitialiser le mot de passe de l'employé", () => {
      const tempPassword = `SmartPass#${Math.floor(1000 + Math.random() * 9000)}`;
      setStaff(prev => prev.map(s => s.id === id ? { ...s, temporaryPassword: tempPassword } : s));
      showToast(`Nouveau mot de passe temporaire : ${tempPassword}`);
    });
  };

  const deleteStaff = (id: string) => {
    executeWithPin("Supprimer définitivement cet employé du personnel", () => {
      setStaff(prev => prev.filter(s => s.id !== id));
      showToast("Employé supprimé du registre de l'école");
    });
  };

  const sendStaffCredentials = (id: string) => {
    const member = staff.find(s => s.id === id);
    if (!member) return;

    setStaff(prev => prev.map(s => s.id === id ? { ...s, credentialsSent: true } : s));
    showToast(`Identifiants transmis avec succès à ${member.email} et par SMS au ${member.phone} !`);
  };

  // Classes CRUD
  const createClass = (clsData: Omit<SchoolClass, 'id'>) => {
    const newClass: SchoolClass = {
      ...clsData,
      id: `cls-${Date.now()}`
    };
    setClasses(prev => [...prev, newClass]);
    showToast(`Classe « ${newClass.name} » créée`);
  };

  const updateClass = (id: string, updates: Partial<SchoolClass>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast("Classe mise à jour");
  };

  const deleteClass = (id: string) => {
    executeWithPin("Supprimer définitivement la classe", () => {
      setClasses(prev => prev.filter(c => c.id !== id));
      showToast("Classe supprimée");
    });
  };

  const archiveClass = (id: string) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, archived: !c.archived } : c));
    showToast("État d'archivage de la classe modifié");
  };

  // Subjects CRUD
  const createSubject = (subData: Omit<SchoolSubject, 'id'>) => {
    const newSub: SchoolSubject = {
      ...subData,
      id: `subj-${Date.now()}`
    };
    setSubjects(prev => [...prev, newSub]);
    showToast(`Matière « ${newSub.name} » créée (Coef ${newSub.coefficient})`);
  };

  const updateSubject = (id: string, updates: Partial<SchoolSubject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast("Matière mise à jour");
  };

  const toggleSubjectActive = (id: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    showToast("Statut de la matière modifié");
  };

  // Rooms CRUD
  const createRoom = (roomData: Omit<SchoolRoom, 'id'>) => {
    const newRoom: SchoolRoom = {
      ...roomData,
      id: `room-${Date.now()}`
    };
    setRooms(prev => [...prev, newRoom]);
    showToast(`Salle « ${newRoom.name} » créée`);
  };

  const updateRoom = (id: string, updates: Partial<SchoolRoom>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    showToast("Salle mise à jour");
  };

  const deleteRoom = (id: string) => {
    executeWithPin("Supprimer la salle / installation", () => {
      setRooms(prev => prev.filter(r => r.id !== id));
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
      showToast(`Année scolaire ${yearLabel} déclarée active !`);
    });
  };

  const closeAcademicYear = (id: string) => {
    executeWithPin("Clôturer officiellement l'année scolaire", () => {
      setAcademicYears(prev => prev.map(y => y.id === id ? { ...y, status: 'cloturee' } : y));
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
    showToast(`Salle ${room.name} attribuée à la classe ${cls.name}`);
  };

  // Documents
  const updateDocumentTemplate = (id: string, updates: Partial<AdministrativeDocumentTemplate>) => {
    setDocumentTemplates(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    showToast("Modèle de document administratif sauvegardé");
  };

  // Events
  const createEvent = (evData: Omit<AdministrativeEvent, 'id'>) => {
    const newEv: AdministrativeEvent = {
      ...evData,
      id: `ev-${Date.now()}`
    };
    setEvents(prev => [newEv, ...prev]);
    showToast(`Événement « ${newEv.title} » publié pour le personnel`);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
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
