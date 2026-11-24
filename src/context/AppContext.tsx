import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from 'react';
import { 
  School, 
  SchoolAdmin, 
  SuperAdminProfile, 
  SubscriptionPlan, 
  PaymentTransaction, 
  GlobalAnnouncement, 
  SecuritySession, 
  SecurityAuditLog, 
  BackupArchive, 
  GlobalSettings,
  BadgeTemplateConfig,
  LanguageCode,
  SubscriptionTierId,
  AuditOperationType
} from '../types';
import { 
  initialSuperAdminProfile, 
  initialSubscriptionPlans, 
  initialSchools, 
  initialAdmins, 
  initialTransactions, 
  initialAuditLogs, 
  initialBackups, 
  initialSessions, 
  initialAnnouncements, 
  initialSettings, 
  initialBadgeTemplate 
} from '../data/mockData';
import { translations, Translations } from '../i18n/translations';
import { usePersistedState } from '../utils/storage';
import {
  propagateSchoolAdminChange,
  propagateSchoolRename,
  propagateSuperAdminProfileChange
} from '../utils/accountSync';
import { dispatchServerNotification, HubRole, pushSharedMessage } from '../utils/communicationHub';
import { readCurrentSessionSnapshot, recordGlobalAuditLog } from '../utils/auditLogger';

const EXTRA_MOCK_SCHOOL_IDS = new Set([
  'sch-gn-kk-002',
  'sch-gn-kd-003',
  'sch-gn-lb-004',
  'sch-gn-ck-005',
  'sch-gn-nz-006',
  'sch-gn-ck-007',
]);
const EXTRA_MOCK_ADMIN_IDS = new Set([
  'adm-002',
  'adm-003',
  'adm-004',
  'adm-005',
  'adm-006',
  'adm-007',
]);
const EXTRA_MOCK_TX_IDS = new Set([
  'tx-2026-11-001',
  'tx-2026-11-003',
  'tx-2026-11-004',
  'tx-2026-11-005',
  'tx-2026-11-006',
]);
const SINGLE_SCHOOL_MIGRATION_KEY = 'smartschool_single_school_test_v1';

function isSingleSchoolMigrated(): boolean {
  try {
    return localStorage.getItem(SINGLE_SCHOOL_MIGRATION_KEY) === 'done';
  } catch {
    return false;
  }
}

function markSingleSchoolMigrated(): void {
  try {
    localStorage.setItem(SINGLE_SCHOOL_MIGRATION_KEY, 'done');
  } catch {
    // ignore
  }
}

export type NavTab = 
  | 'dashboard' 
  | 'users'
  | 'schools' 
  | 'admins' 
  | 'subscriptions' 
  | 'revenue' 
  | 'analytics' 
  | 'badges' 
  | 'communication' 
  | 'security' 
  | 'backups' 
  | 'settings' 
  | 'profile'
  | 'architecture';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isRtl: boolean;
  t: Translations;
  // Schools
  schools: School[];
  createSchool: (newSchool: Omit<School, 'id' | 'createdAt' | 'stats'>) => void;
  updateSchool: (id: string, updates: Partial<School>) => void;
  suspendSchool: (id: string) => void;
  reactivateSchool: (id: string) => void;
  archiveSchool: (id: string) => void;
  deleteSchool: (id: string) => void;
  selectedSchoolForAudit: School | null;
  setSelectedSchoolForAudit: (school: School | null) => void;
  // Admins
  admins: SchoolAdmin[];
  createAdmin: (
    admin: Omit<SchoolAdmin, 'id' | 'createdAt' | 'lastLogin'>,
    initialPassword?: string
  ) => { admin: SchoolAdmin; initialPassword: string };
  updateAdmin: (id: string, updates: Partial<SchoolAdmin>) => void;
  suspendAdmin: (id: string) => void;
  reactivateAdmin: (id: string) => void;
  resetAdminPassword: (id: string) => string;
  changeAdminSchool: (adminId: string, newSchoolId: string) => void;
  deleteAdmin: (id: string) => void;
  // Subscriptions
  plans: SubscriptionPlan[];
  updatePlan: (id: SubscriptionTierId, updates: Partial<SubscriptionPlan>) => void;
  assignPlanToSchool: (schoolId: string, planId: SubscriptionTierId) => void;
  renewSubscription: (schoolId: string) => void;
  // Revenue
  transactions: PaymentTransaction[];
  createTransaction: (tx: Omit<PaymentTransaction, 'id'>) => void;
  updateTransactionStatus: (id: string, status: PaymentTransaction['status']) => void;
  // Profile
  profile: SuperAdminProfile;
  updateProfile: (updates: Partial<SuperAdminProfile>) => void;
  // Security
  auditLogs: SecurityAuditLog[];
  addLog: (
    action: string,
    target?: string,
    type?: SecurityAuditLog['type'],
    severity?: SecurityAuditLog['severity'],
    operation?: AuditOperationType
  ) => void;
  sessions: SecuritySession[];
  terminateSession: (sessionId: string) => void;
  blockedIps: string[];
  toggleBlockIp: (ip: string) => void;
  // Backups
  backups: BackupArchive[];
  triggerBackup: () => void;
  restoreBackup: (backupId: string) => void;
  // Communications
  announcements: GlobalAnnouncement[];
  createAnnouncement: (announcement: Omit<GlobalAnnouncement, 'id' | 'createdAt' | 'sentBy' | 'deliveryCount'>) => void;
  // Settings
  settings: GlobalSettings;
  updateSettings: (updates: Partial<GlobalSettings>) => void;
  // Badges
  badgeTemplate: BadgeTemplateConfig;
  updateBadgeTemplate: (updates: Partial<BadgeTemplateConfig>) => void;
  // Feedback toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [language, setLanguageState] = usePersistedState<LanguageCode>('smartschool_language_v1', 'fr');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [schools, setSchools] = usePersistedState<School[]>(
    'smartschool_schools',
    initialSchools,
    loaded => {
      const migratedAlready = isSingleSchoolMigrated();
      const baseList = Array.isArray(loaded) && loaded.length > 0 ? loaded : initialSchools;
      const filtered = migratedAlready
        ? baseList
        : baseList.filter(s => !EXTRA_MOCK_SCHOOL_IDS.has(s.id));
      const finalSchools = filtered.length > 0 ? filtered : initialSchools;
      return finalSchools.map(s => {
        const fallback = initialSchools.find(init => init.id === s.id);
        return {
          ...s,
          whatsappNumber: s.whatsappNumber || fallback?.whatsappNumber || s.phone || ''
        };
      });
    }
  );

  const [admins, setAdmins] = usePersistedState<SchoolAdmin[]>(
    'smartschool_admins',
    initialAdmins,
    loaded => {
      const migratedAlready = isSingleSchoolMigrated();
      const baseList = Array.isArray(loaded) && loaded.length > 0 ? loaded : initialAdmins;
      const filtered = migratedAlready
        ? baseList
        : baseList.filter(a => !EXTRA_MOCK_ADMIN_IDS.has(a.id));
      return filtered.length > 0 ? filtered : initialAdmins;
    }
  );

  const [plans, setPlans] = usePersistedState<SubscriptionPlan[]>('smartschool_plans', initialSubscriptionPlans);

  const [transactions, setTransactions] = usePersistedState<PaymentTransaction[]>(
    'smartschool_transactions',
    initialTransactions,
    loaded => {
      const migratedAlready = isSingleSchoolMigrated();
      const baseList = Array.isArray(loaded) ? loaded : initialTransactions;
      return migratedAlready
        ? baseList
        : baseList.filter(tx => !EXTRA_MOCK_TX_IDS.has(tx.id));
    }
  );

  useEffect(() => {
    if (!isSingleSchoolMigrated()) {
      markSingleSchoolMigrated();
    }
  }, []);

  const [profile, setProfile] = usePersistedState<SuperAdminProfile>('smartschool_profile', initialSuperAdminProfile);

  const [auditLogs, setAuditLogs] = usePersistedState<SecurityAuditLog[]>(
    'smartschool_audit_logs_v1',
    () => {
      try {
        const legacy = localStorage.getItem('smartschool_audit_logs') || localStorage.getItem('smartschool_logs');
        if (legacy) return JSON.parse(legacy);
      } catch {
        // ignore
      }
      return initialAuditLogs;
    }
  );

  const [sessions, setSessions] = usePersistedState<SecuritySession[]>('smartschool_sessions', initialSessions);
  const [blockedIps, setBlockedIps] = usePersistedState<string[]>('smartschool_blocked_ips_v1', ['185.220.101.5', '91.240.118.2']);
  const [backups, setBackups] = usePersistedState<BackupArchive[]>('smartschool_backups_v1', initialBackups);
  const [announcements, setAnnouncements] = usePersistedState<GlobalAnnouncement[]>('smartschool_announcements_v1', initialAnnouncements);

  const [settings, setSettings] = usePersistedState<GlobalSettings>(
    'smartschool_global_settings',
    initialSettings,
    parsed => ({
      ...initialSettings,
      ...parsed,
      homepagePhotos: {
        hero: parsed?.homepagePhotos?.hero ?? initialSettings.homepagePhotos?.hero ?? '',
        classroom: parsed?.homepagePhotos?.classroom ?? initialSettings.homepagePhotos?.classroom ?? '',
        teacher: parsed?.homepagePhotos?.teacher ?? initialSettings.homepagePhotos?.teacher ?? '',
        library: parsed?.homepagePhotos?.library ?? initialSettings.homepagePhotos?.library ?? '',
      },
    })
  );

  const [badgeTemplate, setBadgeTemplate] = usePersistedState<BadgeTemplateConfig>(
    'smartschool_badge_template_v1',
    initialBadgeTemplate
  );
  const [selectedSchoolForAudit, setSelectedSchoolForAudit] = useState<School | null>(null);

  // Set RTL attribute and lang on html document element
  const isRtl = language === 'ar';
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  const toastTimerRef = useRef<number | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3500);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    showToast(`Langue changée : ${lang.toUpperCase()}`);
  };

  // Add an audit log entry helper (visible to Super Admin)
  const addLog = (
    action: string,
    target: string = 'Système MEPU-A',
    type: SecurityAuditLog['type'] = 'admin',
    severity: SecurityAuditLog['severity'] = 'info',
    operation?: AuditOperationType
  ) => {
    recordGlobalAuditLog({
      action,
      target,
      actorName: profile.name,
      actorRole: 'super_admin',
      type,
      severity,
      operation
    });
  };

  // School actions
  const createSchool = (newSchoolData: Omit<School, 'id' | 'createdAt' | 'stats'>) => {
    const newId = `sch-gn-${newSchoolData.city.toLowerCase().substring(0, 2)}-${String(schools.length + 1).padStart(3, '0')}`;
    const newSchool: School = {
      ...newSchoolData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      stats: {
        studentsCount: 0,
        parentsCount: 0,
        teachersCount: 0,
        employeesCount: 0,
        classesCount: 0,
        storageUsedMb: 120,
        monthlyRevenueGnf: plans.find(p => p.id === newSchoolData.subscriptionTier)?.priceMonthlyGnf || 0,
        activityScore: 50
      }
    };
    setSchools(prev => [newSchool, ...prev]);
    addLog(`Création d'un nouvel établissement [${newSchool.name}]`, newSchool.name, 'ecole', 'info', 'create');
    showToast(`Établissement « ${newSchool.name} » créé avec succès`);
  };

  const updateSchool = (id: string, updates: Partial<School>) => {
    const existingSchool = schools.find(s => s.id === id);
    const schoolLabel = updates.name || existingSchool?.name || id;
    setSchools(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    if (updates.name) {
      setAdmins(prev => prev.map(a => a.schoolId === id ? { ...a, schoolName: updates.name! } : a));
      propagateSchoolRename(id, updates.name);
    }
    const session = readCurrentSessionSnapshot();
    const isSchoolAdminActor = session?.role === 'school_admin';
    recordGlobalAuditLog({
      action: `Modification paramètres établissement [${schoolLabel}]`,
      target: schoolLabel,
      actorName: isSchoolAdminActor ? (session?.name || 'Admin École') : profile.name,
      actorRole: isSchoolAdminActor ? 'school_admin' : 'super_admin',
      actorMatricule: isSchoolAdminActor ? session?.matricule : undefined,
      schoolName: schoolLabel,
      type: 'ecole',
      severity: 'info',
      operation: 'update'
    });
    showToast("Établissement mis à jour");
  };

  const suspendSchool = (id: string) => {
    setSchools(prev => prev.map(s => s.id === id ? { ...s, status: 'suspended' } : s));
    const school = schools.find(s => s.id === id);
    addLog(`Suspension immédiate de l'accès plateforme pour [${school?.name || id}]`, school?.name || id, 'ecole', 'warning', 'update');
    showToast(`Accès suspendu pour ${school?.name || id}`);
  };

  const reactivateSchool = (id: string) => {
    setSchools(prev => prev.map(s => s.id === id ? { ...s, status: 'active' } : s));
    const school = schools.find(s => s.id === id);
    addLog(`Réactivation de l'accès plateforme pour [${school?.name || id}]`, school?.name || id, 'ecole', 'info', 'update');
    showToast(`Établissement ${school?.name || id} réactivé`);
  };

  const archiveSchool = (id: string) => {
    setSchools(prev => prev.map(s => s.id === id ? { ...s, status: 'archived' } : s));
    const school = schools.find(s => s.id === id);
    addLog(`Archivage des données de l'établissement [${school?.name || id}]`, school?.name || id, 'ecole', 'info', 'update');
    showToast(`Établissement archivé`);
  };

  const deleteSchool = (id: string) => {
    const school = schools.find(s => s.id === id);
    const removedAdmins = admins.filter(a => a.schoolId === id);
    setSchools(prev => prev.filter(s => s.id !== id));
    setAdmins(prev => prev.filter(a => a.schoolId !== id));
    removedAdmins.forEach(a => {
      propagateSchoolAdminChange({ oldEmail: a.email, oldSchoolId: a.schoolId, admin: a, removed: true });
    });
    addLog(`Suppression définitive de l'établissement [${school?.name || id}]`, school?.name || id, 'ecole', 'critical', 'delete');
    showToast(`Établissement supprimé`);
  };

  // School Admin actions
  const createAdmin = (
    adminData: Omit<SchoolAdmin, 'id' | 'createdAt' | 'lastLogin'>,
    initialPassword?: string
  ) => {
    const resolvedPassword = initialPassword?.trim() || `SmartPass#${Math.floor(100000 + Math.random() * 900000)}`;
    const newAdmin: SchoolAdmin = {
      ...adminData,
      id: `adm-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Jamais connecté (Compte neuf)',
      passwordResetRequired: true
    };
    setAdmins(prev => [newAdmin, ...prev]);
    // Link to school
    setSchools(prev => prev.map(s => s.id === adminData.schoolId ? { ...s, adminId: newAdmin.id } : s));
    propagateSchoolAdminChange({
      admin: newAdmin,
      plainPassword: resolvedPassword,
      mustChangePassword: true
    });
    addLog(`Création d'un Admin École [${newAdmin.firstName} ${newAdmin.lastName}] pour ${newAdmin.schoolName}`, newAdmin.email, 'admin', 'info', 'create');
    showToast(`Admin ${newAdmin.firstName} ${newAdmin.lastName} créé avec succès`);
    return { admin: newAdmin, initialPassword: resolvedPassword };
  };

  const updateAdmin = (id: string, updates: Partial<SchoolAdmin>) => {
    const existing = admins.find(a => a.id === id);
    const updatedAdmin: SchoolAdmin | undefined = existing ? { ...existing, ...updates } : undefined;
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    if (existing && updatedAdmin) {
      propagateSchoolAdminChange({
        oldEmail: existing.email,
        oldSchoolId: existing.schoolId,
        admin: updatedAdmin
      });
    }
    const session = readCurrentSessionSnapshot();
    const isSelfAdmin = session?.role === 'school_admin';
    const fullName = updatedAdmin
      ? `${updatedAdmin.firstName} ${updatedAdmin.lastName}`.trim()
      : id;
    if (!isSelfAdmin) {
      addLog(`Modification profil Admin École [${fullName}]`, updatedAdmin?.email || id, 'admin', 'info', 'update');
    }
    showToast("Profil administrateur d'école mis à jour");
  };

  const suspendAdmin = (id: string) => {
    const admin = admins.find(a => a.id === id);
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: 'suspended' } : a));
    if (admin) {
      propagateSchoolAdminChange({
        oldEmail: admin.email,
        oldSchoolId: admin.schoolId,
        admin: { ...admin, status: 'suspended' }
      });
    }
    addLog(`Suspension du compte Admin École [${admin?.firstName} ${admin?.lastName}]`, admin?.email || id, 'admin', 'warning', 'update');
    showToast(`Compte admin suspendu`);
  };

  const reactivateAdmin = (id: string) => {
    const admin = admins.find(a => a.id === id);
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: 'active' } : a));
    if (admin) {
      propagateSchoolAdminChange({
        oldEmail: admin.email,
        oldSchoolId: admin.schoolId,
        admin: { ...admin, status: 'active' }
      });
    }
    addLog(`Réactivation du compte Admin École [${admin?.firstName} ${admin?.lastName}]`, admin?.email || id, 'admin', 'info', 'update');
    showToast(`Compte admin réactivé`);
  };

  const resetAdminPassword = (id: string) => {
    const tempPassword = `SmartPass#${Math.floor(100000 + Math.random() * 900000)}`;
    const admin = admins.find(a => a.id === id);
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, passwordResetRequired: true } : a));
    if (admin) {
      propagateSchoolAdminChange({
        oldEmail: admin.email,
        oldSchoolId: admin.schoolId,
        admin: { ...admin, passwordResetRequired: true },
        plainPassword: tempPassword,
        mustChangePassword: true
      });
    }
    addLog(`Génération nouveau mot de passe temporaire pour [${admin?.email}]`, admin?.email || id, 'securite', 'info', 'update');
    showToast(`Mot de passe réinitialisé : ${tempPassword}`);
    return tempPassword;
  };

  const changeAdminSchool = (adminId: string, newSchoolId: string) => {
    const targetSchool = schools.find(s => s.id === newSchoolId);
    const existing = admins.find(a => a.id === adminId);
    if (!targetSchool) return;
    setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, schoolId: newSchoolId, schoolName: targetSchool.name } : a));
    setSchools(prev => prev.map(s => s.id === newSchoolId ? { ...s, adminId } : s));
    if (existing) {
      propagateSchoolAdminChange({
        oldEmail: existing.email,
        oldSchoolId: existing.schoolId,
        admin: { ...existing, schoolId: newSchoolId, schoolName: targetSchool.name }
      });
    }
    addLog(`Mutation Admin École [${existing ? `${existing.firstName} ${existing.lastName}` : adminId}] vers [${targetSchool.name}]`, targetSchool.name, 'admin', 'info', 'update');
    showToast(`Admin muté vers ${targetSchool.name}`);
  };

  const deleteAdmin = (id: string) => {
    const admin = admins.find(a => a.id === id);
    setAdmins(prev => prev.filter(a => a.id !== id));
    if (admin) {
      propagateSchoolAdminChange({
        oldEmail: admin.email,
        oldSchoolId: admin.schoolId,
        admin,
        removed: true
      });
    }
    addLog(`Suppression du compte Admin École [${admin?.firstName} ${admin?.lastName}]`, admin?.email || id, 'admin', 'warning', 'delete');
    showToast(`Compte admin supprimé`);
  };

  // Subscriptions
  const updatePlan = (id: SubscriptionTierId, updates: Partial<SubscriptionPlan>) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    addLog(`Mise à jour paramètres formule [${id.toUpperCase()}]`, id, 'finance', 'info');
    showToast("Formule d'abonnement mise à jour");
  };

  const assignPlanToSchool = (schoolId: string, planId: SubscriptionTierId) => {
    const plan = plans.find(p => p.id === planId);
    const school = schools.find(s => s.id === schoolId);
    if (!plan || !school) return;

    const nextExpiry = new Date();
    nextExpiry.setFullYear(nextExpiry.getFullYear() + 1);

    setSchools(prev => prev.map(s => s.id === schoolId ? {
      ...s,
      subscriptionTier: planId,
      subscriptionExpiresAt: nextExpiry.toISOString().split('T')[0],
      stats: {
        ...s.stats,
        monthlyRevenueGnf: plan.priceMonthlyGnf
      }
    } : s));

    // Also register transaction if paid plan
    if (plan.priceMonthlyGnf > 0) {
      const newTx: PaymentTransaction = {
        id: `tx-${Date.now()}`,
        invoiceNumber: `FAC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        schoolId,
        schoolName: school.name,
        planId,
        amountGnf: plan.priceMonthlyGnf,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        paymentMethod: 'Orange Money Guinée',
        reference: `OM-GN-${Math.floor(1000000 + Math.random() * 9000000)}`,
        status: 'payé',
        notes: `Attribution formule ${plan.name}`
      };
      setTransactions(prev => [newTx, ...prev]);
    }

    addLog(`Attribution de la formule ${plan.name} à [${school.name}]`, school.name, 'finance', 'info');
    showToast(`Formule ${plan.name} attribuée à ${school.name}`);
  };

  const renewSubscription = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    if (!school) return;
    const currentExpiry = new Date(school.subscriptionExpiresAt);
    const newDate = isNaN(currentExpiry.getTime()) ? new Date() : currentExpiry;
    newDate.setFullYear(newDate.getFullYear() + 1);
    
    setSchools(prev => prev.map(s => s.id === schoolId ? {
      ...s,
      subscriptionExpiresAt: newDate.toISOString().split('T')[0],
      status: 'active'
    } : s));

    const plan = plans.find(p => p.id === school.subscriptionTier);
    if (plan && plan.priceMonthlyGnf > 0) {
      const newTx: PaymentTransaction = {
        id: `tx-${Date.now()}`,
        invoiceNumber: `FAC-RNV-${Math.floor(1000 + Math.random() * 9000)}`,
        schoolId,
        schoolName: school.name,
        planId: school.subscriptionTier,
        amountGnf: plan.priceMonthlyGnf,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Orange Money Guinée',
        reference: `OM-RNV-${Math.floor(1000000 + Math.random() * 9000000)}`,
        status: 'payé',
        notes: `Renouvellement annuel pour ${school.name}`
      };
      setTransactions(prev => [newTx, ...prev]);
    }

    addLog(`Renouvellement abonnement annuel pour [${school.name}]`, school.name, 'finance', 'info');
    showToast(`Abonnement renouvelé pour 1 an jusqu'au ${newDate.toISOString().split('T')[0]}`);
  };

  // Transactions
  const createTransaction = (tx: Omit<PaymentTransaction, 'id'>) => {
    const newTx: PaymentTransaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);
    addLog(`Enregistrement nouveau paiement [${newTx.amountGnf.toLocaleString('fr-FR')} GNF]`, newTx.schoolName, 'finance', 'info');
    showToast(`Facture ${newTx.invoiceNumber} enregistrée`);
  };

  const updateTransactionStatus = (id: string, status: PaymentTransaction['status']) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status } : tx));
    addLog(`Mise à jour état facture [ID: ${id}] -> ${status}`, id, 'finance', 'info');
    showToast(`Statut facture mis à jour : ${status.toUpperCase()}`);
  };

  // Profile
  const updateProfile = (updates: Partial<SuperAdminProfile>) => {
    const previousEmail = profile.email;
    const nextProfile: SuperAdminProfile = { ...profile, ...updates };
    setProfile(nextProfile);
    propagateSuperAdminProfileChange(nextProfile, previousEmail);
    addLog(`Mise à jour profil Super Administrateur`, 'Profil', 'securite', 'info');
    showToast("Profil Super Admin sauvegardé");
  };

  // Security
  const terminateSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    addLog(`Déconnexion forcée de la session [ID: ${sessionId}]`, sessionId, 'securite', 'warning');
    showToast("Session distante révoquée avec succès");
  };

  const toggleBlockIp = (ip: string) => {
    const next = blockedIps.includes(ip)
      ? blockedIps.filter(item => item !== ip)
      : [...blockedIps, ip];
    setBlockedIps(next);
    if (typeof window !== 'undefined') {
      void fetch('/api/security/blocklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedIps: next })
      }).catch(() => undefined);
    }
    if (blockedIps.includes(ip)) {
      addLog(`Déblocage de l'adresse IP [${ip}]`, ip, 'securite', 'info');
      showToast(`IP ${ip} débloquée`);
    } else {
      addLog(`Blocage immédiat de l'adresse IP [${ip}]`, ip, 'securite', 'critical');
      showToast(`IP ${ip} ajoutée à la liste de blocage`);
    }
  };

  // Backups
  const triggerBackup = () => {
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14);
    const newBackup: BackupArchive = {
      id: `bk-${timestamp}`,
      filename: `smartschool-manual-snapshot-${timestamp}.sql.gz`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      sizeMb: parseFloat((840 + Math.random() * 20).toFixed(1)),
      checksum: `sha256:${Math.random().toString(36).substring(2, 15)}...`,
      schoolsCount: schools.length,
      recordsCount: schools.reduce((acc, s) => acc + s.stats.studentsCount + s.stats.teachersCount, 0),
      type: 'manuel',
      status: 'success'
    };
    setBackups(prev => [newBackup, ...prev]);
    addLog(`Sauvegarde manuelle intégrale de la plateforme exécutée`, newBackup.filename, 'sauvegarde', 'info');
    showToast("Nouvelle sauvegarde créée avec succès !");
  };

  const restoreBackup = (backupId: string) => {
    const backup = backups.find(b => b.id === backupId);
    addLog(`Restauration de la base de données depuis l'archive [${backup?.filename || backupId}]`, backupId, 'sauvegarde', 'critical');
    showToast(`Restauration terminée : état des données synchronisé`);
  };

  // Announcements
  const createAnnouncement = (data: Omit<GlobalAnnouncement, 'id' | 'createdAt' | 'sentBy' | 'deliveryCount'>) => {
    const newAnn: GlobalAnnouncement = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      sentBy: profile.name,
      deliveryCount: data.target === 'all_schools' ? schools.length : (data.targetSchoolIds?.length || 1)
    };
    setAnnouncements(prev => [newAnn, ...prev]);

    const recipientRoles: HubRole[] =
      data.target === 'all_admins'
        ? ['school_admin', 'director']
        : ['school_admin', 'director', 'secretary', 'teacher', 'parent', 'student'];
    const targetSchoolIds =
      data.target === 'selected_schools' && data.targetSchoolIds?.length
        ? data.targetSchoolIds
        : ['NATIONAL'];

    targetSchoolIds.forEach(sId => {
      pushSharedMessage({
        schoolId: sId,
        senderRole: 'super_admin',
        senderName: profile.name,
        recipientRoles,
        recipientLabel:
          data.target === 'all_admins'
            ? 'Administrateurs d’établissements'
            : 'Tous les établissements & utilisateurs',
        subject: data.title,
        content: data.content,
        channel: data.channels.includes('email') ? 'email' : data.channels.includes('sms') ? 'sms' : 'in_app',
        priority: data.type === 'urgent' ? 'urgent' : 'officiel'
      });
    });

    if (data.channels.includes('email') || data.channels.includes('sms')) {
      void dispatchServerNotification({
        channel: data.channels.includes('email') ? 'email' : 'sms',
        subject: data.title,
        body: `[Super Admin - ${profile.name}] ${data.content}`
      });
    }

    addLog(`Diffusion annonce globale [${newAnn.title}] vers ${newAnn.deliveryCount} établissements`, newAnn.title, 'admin', 'info');
    showToast("Annonce globale transmise aux destinataires");
  };

  // Settings
  const updateSettings = (updates: Partial<GlobalSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    addLog(`Mise à jour paramètres système globaux`, 'Configuration', 'securite', 'info');
    showToast("Paramètres globaux enregistrés");
  };

  // Badges
  const updateBadgeTemplate = (updates: Partial<BadgeTemplateConfig>) => {
    setBadgeTemplate(prev => ({ ...prev, ...updates }));
    addLog(`Modification modèle de badges & QR Codes officiels`, 'Badges', 'ecole', 'info');
    showToast("Modèle de carte mis à jour");
  };

  const value: AppContextType = {
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    isRtl,
    t: translations[language] || translations.fr,
    schools,
    createSchool,
    updateSchool,
    suspendSchool,
    reactivateSchool,
    archiveSchool,
    deleteSchool,
    selectedSchoolForAudit,
    setSelectedSchoolForAudit,
    admins,
    createAdmin,
    updateAdmin,
    suspendAdmin,
    reactivateAdmin,
    resetAdminPassword,
    changeAdminSchool,
    deleteAdmin,
    plans,
    updatePlan,
    assignPlanToSchool,
    renewSubscription,
    transactions,
    createTransaction,
    updateTransactionStatus,
    profile,
    updateProfile,
    auditLogs,
    addLog,
    sessions,
    terminateSession,
    blockedIps,
    toggleBlockIp,
    backups,
    triggerBackup,
    restoreBackup,
    announcements,
    createAnnouncement,
    settings,
    updateSettings,
    badgeTemplate,
    updateBadgeTemplate,
    toastMessage,
    showToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
