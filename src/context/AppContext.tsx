import React, { createContext, useContext, useState, useEffect } from 'react';
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
  SubscriptionTierId
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
  createAdmin: (admin: Omit<SchoolAdmin, 'id' | 'createdAt' | 'lastLogin'>) => void;
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
  addLog: (action: string, target?: string, type?: SecurityAuditLog['type'], severity?: SecurityAuditLog['severity']) => void;
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
  const [language, setLanguageState] = useState<LanguageCode>('fr');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data states with persistence or initial mocks
  const [schools, setSchools] = useState<School[]>(() => {
    const saved = localStorage.getItem('smartschool_schools');
    return saved ? JSON.parse(saved) : initialSchools;
  });

  const [admins, setAdmins] = useState<SchoolAdmin[]>(() => {
    const saved = localStorage.getItem('smartschool_admins');
    return saved ? JSON.parse(saved) : initialAdmins;
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem('smartschool_plans');
    return saved ? JSON.parse(saved) : initialSubscriptionPlans;
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('smartschool_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [profile, setProfile] = useState<SuperAdminProfile>(() => {
    const saved = localStorage.getItem('smartschool_profile');
    return saved ? JSON.parse(saved) : initialSuperAdminProfile;
  });

  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(() => {
    const saved = localStorage.getItem('smartschool_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [sessions, setSessions] = useState<SecuritySession[]>(() => {
    const saved = localStorage.getItem('smartschool_sessions');
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [blockedIps, setBlockedIps] = useState<string[]>(['185.220.101.5', '91.240.118.2']);
  const [backups, setBackups] = useState<BackupArchive[]>(initialBackups);
  const [announcements, setAnnouncements] = useState<GlobalAnnouncement[]>(initialAnnouncements);
  const [settings, setSettings] = useState<GlobalSettings>(() => {
    try {
      const saved = localStorage.getItem('smartschool_global_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialSettings,
          ...parsed,
          homepagePhotos: {
            ...initialSettings.homepagePhotos,
            ...(parsed.homepagePhotos || {}),
          },
        };
      }
    } catch {
      // ignore parse errors
    }
    return initialSettings;
  });
  const [badgeTemplate, setBadgeTemplate] = useState<BadgeTemplateConfig>(initialBadgeTemplate);
  const [selectedSchoolForAudit, setSelectedSchoolForAudit] = useState<School | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('smartschool_schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem('smartschool_admins', JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    localStorage.setItem('smartschool_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('smartschool_global_settings', JSON.stringify(settings));
    } catch {
      // ignore storage quota errors gracefully
    }
  }, [settings]);

  // Set RTL attribute and lang on html document element
  const isRtl = language === 'ar';
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    showToast(`Langue changée : ${lang.toUpperCase()}`);
  };

  // Add an audit log entry helper (visible to Super Admin)
  const addLog = (
    action: string, 
    target: string = 'Système MEPU-A', 
    type: SecurityAuditLog['type'] = 'admin', 
    severity: SecurityAuditLog['severity'] = 'info'
  ) => {
    const newEntry: SecurityAuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action,
      actor: `${profile.name} (Super Admin)`,
      target,
      ip: '197.149.198.42 (Conakry, Guinée)',
      type,
      severity
    };
    setAuditLogs(prev => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem('smartschool_audit_logs', JSON.stringify(updated.slice(0, 150)));
      } catch {
        // ignore
      }
      return updated;
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
    addLog(`Création d'un nouvel établissement [${newSchool.name}]`, newSchool.name, 'ecole', 'info');
    showToast(`Établissement « ${newSchool.name} » créé avec succès`);
  };

  const updateSchool = (id: string, updates: Partial<School>) => {
    setSchools(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    addLog(`Modification paramètres établissement [ID: ${id}]`, id, 'ecole', 'info');
    showToast("Établissement mis à jour");
  };

  const suspendSchool = (id: string) => {
    setSchools(prev => prev.map(s => s.id === id ? { ...s, status: 'suspended' } : s));
    const school = schools.find(s => s.id === id);
    addLog(`Suspension immédiate de l'accès plateforme pour [${school?.name || id}]`, school?.name || id, 'ecole', 'warning');
    showToast(`Accès suspendu pour ${school?.name || id}`);
  };

  const reactivateSchool = (id: string) => {
    setSchools(prev => prev.map(s => s.id === id ? { ...s, status: 'active' } : s));
    const school = schools.find(s => s.id === id);
    addLog(`Réactivation de l'accès plateforme pour [${school?.name || id}]`, school?.name || id, 'ecole', 'info');
    showToast(`Établissement ${school?.name || id} réactivé`);
  };

  const archiveSchool = (id: string) => {
    setSchools(prev => prev.map(s => s.id === id ? { ...s, status: 'archived' } : s));
    const school = schools.find(s => s.id === id);
    addLog(`Archivage des données de l'établissement [${school?.name || id}]`, school?.name || id, 'ecole', 'info');
    showToast(`Établissement archivé`);
  };

  const deleteSchool = (id: string) => {
    const school = schools.find(s => s.id === id);
    setSchools(prev => prev.filter(s => s.id !== id));
    setAdmins(prev => prev.filter(a => a.schoolId !== id));
    addLog(`Suppression définitive de l'établissement [${school?.name || id}]`, school?.name || id, 'ecole', 'critical');
    showToast(`Établissement supprimé`);
  };

  // School Admin actions
  const createAdmin = (adminData: Omit<SchoolAdmin, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newAdmin: SchoolAdmin = {
      ...adminData,
      id: `adm-${String(admins.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Jamais connecté (Compte neuf)'
    };
    setAdmins(prev => [newAdmin, ...prev]);
    // Link to school
    setSchools(prev => prev.map(s => s.id === adminData.schoolId ? { ...s, adminId: newAdmin.id } : s));
    addLog(`Création d'un Admin École [${newAdmin.firstName} ${newAdmin.lastName}] pour ${newAdmin.schoolName}`, newAdmin.email, 'admin', 'info');
    showToast(`Admin ${newAdmin.firstName} ${newAdmin.lastName} créé avec succès`);
  };

  const updateAdmin = (id: string, updates: Partial<SchoolAdmin>) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    addLog(`Modification profil Admin École [ID: ${id}]`, id, 'admin', 'info');
    showToast("Profil administrateur d'école mis à jour");
  };

  const suspendAdmin = (id: string) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: 'suspended' } : a));
    const admin = admins.find(a => a.id === id);
    addLog(`Suspension du compte Admin École [${admin?.firstName} ${admin?.lastName}]`, admin?.email || id, 'admin', 'warning');
    showToast(`Compte admin suspendu`);
  };

  const reactivateAdmin = (id: string) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: 'active' } : a));
    const admin = admins.find(a => a.id === id);
    addLog(`Réactivation du compte Admin École [${admin?.firstName} ${admin?.lastName}]`, admin?.email || id, 'admin', 'info');
    showToast(`Compte admin réactivé`);
  };

  const resetAdminPassword = (id: string) => {
    const tempPassword = `SmartPass#${Math.floor(100000 + Math.random() * 900000)}`;
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, passwordResetRequired: true } : a));
    const admin = admins.find(a => a.id === id);
    addLog(`Génération nouveau mot de passe temporaire pour [${admin?.email}]`, admin?.email || id, 'securite', 'info');
    showToast(`Mot de passe réinitialisé : ${tempPassword}`);
    return tempPassword;
  };

  const changeAdminSchool = (adminId: string, newSchoolId: string) => {
    const targetSchool = schools.find(s => s.id === newSchoolId);
    if (!targetSchool) return;
    setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, schoolId: newSchoolId, schoolName: targetSchool.name } : a));
    setSchools(prev => prev.map(s => s.id === newSchoolId ? { ...s, adminId } : s));
    addLog(`Mutation Admin École [ID: ${adminId}] vers [${targetSchool.name}]`, targetSchool.name, 'admin', 'info');
    showToast(`Admin muté vers ${targetSchool.name}`);
  };

  const deleteAdmin = (id: string) => {
    const admin = admins.find(a => a.id === id);
    setAdmins(prev => prev.filter(a => a.id !== id));
    addLog(`Suppression du compte Admin École [${admin?.firstName} ${admin?.lastName}]`, admin?.email || id, 'admin', 'warning');
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
    setProfile(prev => ({ ...prev, ...updates }));
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
    if (blockedIps.includes(ip)) {
      setBlockedIps(prev => prev.filter(item => item !== ip));
      addLog(`Déblocage de l'adresse IP [${ip}]`, ip, 'securite', 'info');
      showToast(`IP ${ip} débloquée`);
    } else {
      setBlockedIps(prev => [...prev, ip]);
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
    addLog(`Diffusion annonce globale [${newAnn.title}] vers ${newAnn.deliveryCount} établissements`, newAnn.title, 'info' as any, 'info');
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
