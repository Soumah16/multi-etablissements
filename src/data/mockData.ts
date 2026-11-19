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
  BadgeTemplateConfig
} from '../types';

export const initialSuperAdminProfile: SuperAdminProfile = {
  name: "Dr. Mamadou Cellou Diallo",
  title: "Super Administrateur & Architecte Système",
  phone: "+224 622 90 44 11",
  email: "superadmin@smartschool.gn",
  address: "Immeuble Palm Camayenne, Corniche Nord, Dixinn, Conakry, Guinée",
  enterprise: "SmartSchool Technologies SARL",
  enterpriseLogo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&auto=format&fit=crop&q=80",
  signatureUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='70'><path d='M20,45 Q60,10 90,40 T150,30 T200,45' stroke='%233b82f6' stroke-width='3' fill='none'/><text x='110' y='60' font-family='sans-serif' font-size='10' fill='%2364748b'>SmartSchool Tech Signature Certifiée</text></svg>",
  twoFactorEnabled: true,
  twoFactorMethod: 'app',
  lastLogin: "Aujourd'hui à 07:04 GMT (Conakry)",
  loginHistory: [
    { id: 'lh-1', date: "2026-11-02 07:04:12", ip: "197.149.198.42", device: "MacBook Pro M3 (Chrome 131)", location: "Conakry, Guinée", status: 'success' },
    { id: 'lh-2', date: "2026-11-01 19:22:45", ip: "197.149.198.42", device: "MacBook Pro M3 (Chrome 131)", location: "Conakry, Guinée", status: 'success' },
    { id: 'lh-3', date: "2026-11-01 11:15:02", ip: "41.223.119.80", device: "iPhone 16 Pro (Safari)", location: "Conakry, Guinée", status: 'success' },
    { id: 'lh-4', date: "2026-10-31 08:40:19", ip: "197.149.198.42", device: "MacBook Pro M3 (Chrome 131)", location: "Conakry, Guinée", status: 'success' },
    { id: 'lh-5', date: "2026-10-30 22:11:00", ip: "185.220.101.5", device: "Automated Bot Probe", location: "Francfort, Allemagne", status: 'failed' }
  ]
};

export const initialSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'gratuit',
    name: 'Formule Découverte (Gratuit)',
    badge: 'Essai & Découverte',
    priceMonthlyGnf: 0,
    priceAnnualGnf: 0,
    maxStudents: 150,
    maxTeachers: 15,
    storageGb: 5,
    modules: ['Gestion Élèves', 'Emploi du temps de base', 'Relevé de notes simple'],
    supportLevel: 'Support Communautaire',
    backupFrequency: 'Mensuelle',
    features: [
      'Jusqu\'à 150 élèves enregistrés',
      'Accès pour 15 enseignants',
      'Portail directeur simplifié',
      'Stockage 5 Go documents',
      'Sauvegarde mensuelle standard'
    ],
    activeSchoolsCount: 0
  },
  {
    id: 'standard',
    name: 'Formule Standard',
    badge: 'Écoles Primaires & Collèges',
    priceMonthlyGnf: 1500000,
    priceAnnualGnf: 15000000,
    maxStudents: 800,
    maxTeachers: 60,
    storageGb: 50,
    modules: ['Gestion Élèves & Parents', 'Comptabilité & Frais Scolaires', 'Bulletins Automatisés', 'Portail Enseignants', 'Emploi du Temps Avancé'],
    supportLevel: 'Support Email & Téléphone (Heures ouvrables)',
    backupFrequency: 'Hebdomadaire',
    features: [
      'Jusqu\'à 800 élèves et 60 enseignants',
      'Comptabilité & paiements scolaires',
      'Génération automatique des bulletins',
      'Générateur de cartes scolaires avec QR Code',
      'Stockage 50 Go cloud dédié'
    ],
    activeSchoolsCount: 0
  },
  {
    id: 'premium',
    name: 'Formule Premium Pro',
    badge: 'Lycées & Grands Complexes',
    priceMonthlyGnf: 4500000,
    priceAnnualGnf: 45000000,
    maxStudents: 2500,
    maxTeachers: 200,
    storageGb: 250,
    modules: ['Tout le Standard', 'Passerelle SMS & WhatsApp', 'Application Mobile Parents/Élèves', 'Module Biométrie & Badge QR', 'Analyses Pédagogiques Avancées', 'Gestion Examens Nationaux'],
    supportLevel: 'Support Prioritaire 7j/7 avec Responsable Dédié',
    backupFrequency: 'Quotidienne (Chiffrée)',
    features: [
      'Jusqu\'à 2 500 élèves et 200 enseignants',
      'Passerelle SMS/WhatsApp Orange & MTN intégrée',
      'Application Mobile native pour les familles',
      'Pointage biométrique et scan QR badges',
      'Stockage 250 Go haute vitesse'
    ],
    activeSchoolsCount: 1
  },
  {
    id: 'entreprise',
    name: 'Formule Entreprise & Universités',
    badge: 'Universités & Instituts Supérieurs',
    priceMonthlyGnf: 12000000,
    priceAnnualGnf: 120000000,
    maxStudents: 10000,
    maxTeachers: 800,
    storageGb: 1000,
    modules: ['Accès Illimité à tous les modules', 'Multi-Campus / Multi-Facultés', 'API Ouverte & Intégrations sur mesure', 'Assistance Technique Dédiée 24/7', 'Sauvegardes en Continu', 'Serveur Dédié Partitionné'],
    supportLevel: 'Support Technique 24/7 avec SLA 99.9%',
    backupFrequency: 'Instantanée / Continue',
    features: [
      'Capacité 10 000+ étudiants et 800+ enseignants',
      'Gestion multi-campus & départements',
      'Accès API ERP et Webhooks sur mesure',
      'Stockage 1 To extensible',
      'Hébergement dédié avec isolation physique'
    ],
    activeSchoolsCount: 0
  }
];

export const initialSchools: School[] = [
  {
    id: 'sch-gn-ck-001',
    code: 'LEC-CKY',
    name: "Lycée d'Excellence de Conakry",
    type: 'Lycée',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
    address: "Boulevard Diallo Telli, Quartier Almamya",
    city: "Conakry",
    prefecture: "Kaloum",
    country: "Guinée",
    phone: "+224 621 34 56 78",
    whatsappNumber: "+224 621 34 56 78",
    email: "contact@excellence-conakry.edu.gn",
    website: "https://excellence-conakry.edu.gn",
    currency: "GNF",
    primaryLanguage: "fr",
    createdAt: "2024-09-01",
    subscriptionTier: "premium",
    subscriptionExpiresAt: "2027-09-01",
    status: "active",
    adminId: "adm-001",
    stats: {
      studentsCount: 1850,
      parentsCount: 1620,
      teachersCount: 110,
      employeesCount: 35,
      classesCount: 42,
      storageUsedMb: 68400,
      monthlyRevenueGnf: 4500000,
      activityScore: 96
    }
  }
];

export const initialAdmins: SchoolAdmin[] = [
  {
    id: 'adm-001',
    schoolId: 'sch-gn-ck-001',
    schoolName: "Lycée d'Excellence de Conakry",
    firstName: "Ousmane",
    lastName: "Camara",
    email: "o.camara@excellence-conakry.edu.gn",
    phone: "+224 621 11 22 33",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2024-09-02",
    lastLogin: "Il y a 14 minutes"
  }
];

export const initialTransactions: PaymentTransaction[] = [
  {
    id: 'tx-2026-11-002',
    invoiceNumber: 'FAC-2026-11-090',
    schoolId: 'sch-gn-ck-001',
    schoolName: "Lycée d'Excellence de Conakry",
    planId: 'premium',
    amountGnf: 4500000,
    date: '2026-11-01',
    dueDate: '2026-11-05',
    paymentMethod: 'Orange Money Guinée',
    reference: 'OM-GN-8839201',
    status: 'payé',
    notes: 'Renouvellement mensuel pack Premium + SMS passerelle'
  }
];

export const initialAuditLogs: SecurityAuditLog[] = [
  {
    id: 'log-admin-01',
    timestamp: '2026-11-02 09:42:18',
    action: "Création collaborateur Mamadou Lamarana Diallo (teacher)",
    actor: "Alpha Oumar Diallo (Admin École)",
    target: "Matricule LEC-CKY-TEA-004 · Lycée d'Excellence de Conakry",
    ip: '197.149.214.33 (Conakry, Guinée)',
    type: 'admin',
    severity: 'info',
    operation: 'create',
    actorRole: 'school_admin',
    schoolName: "Lycée d'Excellence de Conakry"
  },
  {
    id: 'log-admin-02',
    timestamp: '2026-11-02 09:18:05',
    action: "Modification de la classe « Terminale Sciences Mathématiques 1 »",
    actor: "Alpha Oumar Diallo (Admin École)",
    target: "Terminale · Lycée d'Excellence de Conakry",
    ip: '197.149.214.33 (Conakry, Guinée)',
    type: 'admin',
    severity: 'info',
    operation: 'update',
    actorRole: 'school_admin',
    schoolName: "Lycée d'Excellence de Conakry"
  },
  {
    id: 'log-admin-03',
    timestamp: '2026-11-02 08:50:44',
    action: "Suppression salle « Annexe Provisoire B »",
    actor: "Alpha Oumar Diallo (Admin École)",
    target: "Campus · Lycée d'Excellence de Conakry",
    ip: '197.149.214.33 (Conakry, Guinée)',
    type: 'securite',
    severity: 'warning',
    operation: 'delete',
    actorRole: 'school_admin',
    schoolName: "Lycée d'Excellence de Conakry"
  },
  {
    id: 'log-01',
    timestamp: '2026-11-02 07:04:12',
    action: 'Connexion Super Admin validée',
    actor: 'Dr. Mamadou Cellou Diallo (Super Admin)',
    target: 'Console Principale',
    ip: '197.149.198.42',
    type: 'connexion',
    severity: 'info',
    operation: 'security',
    actorRole: 'super_admin'
  },
  {
    id: 'log-02',
    timestamp: '2026-11-01 18:30:00',
    action: 'Renouvellement automatique abonnement Premium',
    actor: 'Système ERP Cron',
    target: "Lycée d'Excellence de Conakry",
    ip: '127.0.0.1 (Internal)',
    type: 'finance',
    severity: 'info',
    operation: 'update',
    schoolName: "Lycée d'Excellence de Conakry"
  },
  {
    id: 'log-03',
    timestamp: '2026-11-01 14:15:22',
    action: 'Génération de sauvegarde chiffrée multi-tenant',
    actor: 'Service de Sauvegarde Automatique',
    target: 'Snapshot-db-all-schools-20261101.sql.enc',
    ip: '10.0.4.15',
    type: 'sauvegarde',
    severity: 'info',
    operation: 'create'
  },
  {
    id: 'log-05',
    timestamp: '2026-10-30 22:11:00',
    action: 'Blocage automatique IP suspecte (Tentatives Brute-Force)',
    actor: 'Firewall WAF Plateforme',
    target: 'IP 185.220.101.5',
    ip: '185.220.101.5',
    type: 'securite',
    severity: 'critical',
    operation: 'delete'
  }
];

export const initialBackups: BackupArchive[] = [
  {
    id: 'bk-20261102-0200',
    filename: 'smartschool-full-snapshot-20261102-0200.sql.gz',
    createdAt: '2026-11-02 02:00:15',
    sizeMb: 842.6,
    checksum: 'sha256:8f4c2e17a998b123f...',
    schoolsCount: 1,
    recordsCount: 3580,
    type: 'quotidien',
    status: 'success'
  },
  {
    id: 'bk-20261101-0200',
    filename: 'smartschool-full-snapshot-20261101-0200.sql.gz',
    createdAt: '2026-11-01 02:00:18',
    sizeMb: 839.1,
    checksum: 'sha256:3d1e99f012ba441c...',
    schoolsCount: 1,
    recordsCount: 3550,
    type: 'quotidien',
    status: 'success'
  }
];

export const initialSessions: SecuritySession[] = [
  {
    id: 'sess-01',
    device: 'Apple MacBook Pro M3',
    browser: 'Google Chrome 131.0',
    ip: '197.149.198.42',
    location: 'Conakry, Guinée (Orange Guinée)',
    lastActive: 'Actif en ce moment',
    isCurrent: true
  },
  {
    id: 'sess-02',
    device: 'Apple iPhone 16 Pro',
    browser: 'Mobile Safari 18.2',
    ip: '41.223.119.80',
    location: 'Conakry, Guinée (MTN Areeba)',
    lastActive: 'Hier à 11:15',
    isCurrent: false
  }
];

export const initialAnnouncements: GlobalAnnouncement[] = [
  {
    id: 'ann-01',
    title: "Mise à jour v3.4 : Déploiement des Bulletins Trimestriels Automatisés",
    content: "Chers administrateurs d'écoles, le module de calcul automatique des moyennes pondérées et d'export PDF conforme au Ministère de l'Enseignement Pré-Universitaire est désormais actif pour tous vos enseignants.",
    target: 'all_schools',
    type: ' mise_a_jour',
    channels: ['in_app', 'email'],
    createdAt: '2026-10-29 09:30',
    sentBy: 'Super Admin',
    deliveryCount: 1
  }
];

export const initialSettings: GlobalSettings = {
  platformName: "SmartSchool ERP Guinée",
  platformLogo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&auto=format&fit=crop&q=80",
  favicon: "./pwa-192x192.png",
  primaryColor: "#2563eb",
  systemEmail: "notifications@smartschool.gn",
  smtpHost: "smtp.mailgun.org",
  smtpPort: 587,
  smsGatewayEnabled: true,
  smsProvider: "Orange Guinée SMS Gateway (API B2B)",
  whatsAppEnabled: true,
  pushNotificationsEnabled: true,
  maintenanceMode: false,
  sessionTimeoutMinutes: 45,
  backupSchedule: "daily",
  backupTime: "02:00 GMT",
  homepagePhotos: {
    hero: '',
    classroom: '',
    teacher: '',
    library: ''
  }
};

export const initialBadgeTemplate: BadgeTemplateConfig = {
  templateType: 'student',
  title: "CARTE D'IDENTITÉ SCOLAIRE OFFICIELLE",
  themeColor: "#1e3a8a",
  textColor: "#ffffff",
  showQrCode: true,
  qrPayloadType: 'verification_url',
  showBarcode: true,
  barcodeFormat: 'CODE128',
  showPhoto: true,
  showSignature: true,
  showValidityYear: true,
  validityYear: "2026 - 2027",
  orientation: 'vertical'
};
