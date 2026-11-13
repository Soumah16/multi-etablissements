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
    activeSchoolsCount: 3
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
    activeSchoolsCount: 7
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
    activeSchoolsCount: 5
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
    activeSchoolsCount: 2
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
  },
  {
    id: 'sch-gn-kk-002',
    code: 'UKAN-NAB',
    name: "Université Julius Nyerere de Kankan",
    type: 'Université',
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    address: "Quartier Université, Route Nationale 1",
    city: "Kankan",
    prefecture: "Kankan",
    country: "Guinée",
    phone: "+224 624 88 12 30",
    email: "rectorat@ujnk-kankan.edu.gn",
    website: "https://ujnk-kankan.edu.gn",
    currency: "GNF",
    primaryLanguage: "fr",
    createdAt: "2024-10-15",
    subscriptionTier: "entreprise",
    subscriptionExpiresAt: "2027-10-15",
    status: "active",
    adminId: "adm-002",
    stats: {
      studentsCount: 6420,
      parentsCount: 4100,
      teachersCount: 320,
      employeesCount: 95,
      classesCount: 140,
      storageUsedMb: 420000,
      monthlyRevenueGnf: 12000000,
      activityScore: 92
    }
  },
  {
    id: 'sch-gn-kd-003',
    code: 'CSK-KND',
    name: "Complexe Scolaire Sainte-Marie de Kindia",
    type: 'Collège',
    logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    address: "Avenue Kolié, Quartier Tafory",
    city: "Kindia",
    prefecture: "Kindia",
    country: "Guinée",
    phone: "+224 628 45 67 89",
    email: "direction@stemarie-kindia.gn",
    website: "https://stemarie-kindia.gn",
    currency: "GNF",
    primaryLanguage: "fr",
    createdAt: "2025-01-10",
    subscriptionTier: "standard",
    subscriptionExpiresAt: "2027-01-10",
    status: "active",
    adminId: "adm-003",
    stats: {
      studentsCount: 650,
      parentsCount: 580,
      teachersCount: 42,
      employeesCount: 18,
      classesCount: 18,
      storageUsedMb: 18200,
      monthlyRevenueGnf: 1500000,
      activityScore: 84
    }
  },
  {
    id: 'sch-gn-lb-004',
    code: 'IPC-LBE',
    name: "Institut Polytechnique du Fouta de Labé",
    type: 'Institut professionnel',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    address: "Quartier Daka, En face du stade régional",
    city: "Labé",
    prefecture: "Labé",
    country: "Guinée",
    phone: "+224 620 12 34 56",
    email: "admissions@ipf-labe.edu.gn",
    website: "https://ipf-labe.edu.gn",
    currency: "GNF",
    primaryLanguage: "fr",
    createdAt: "2025-02-18",
    subscriptionTier: "standard",
    subscriptionExpiresAt: "2027-02-18",
    status: "active",
    adminId: "adm-004",
    stats: {
      studentsCount: 480,
      parentsCount: 310,
      teachersCount: 38,
      employeesCount: 14,
      classesCount: 14,
      storageUsedMb: 24500,
      monthlyRevenueGnf: 1500000,
      activityScore: 78
    }
  },
  {
    id: 'sch-gn-ck-005',
    code: 'EPB-MAT',
    name: "École Primaire Bilingue Franco-Arabe de Matam",
    type: 'Primaire',
    logo: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    address: "Carrefour Constantin, Matam Centre",
    city: "Conakry",
    prefecture: "Matam",
    country: "Guinée",
    phone: "+224 622 77 99 00",
    email: "direction@bilingue-matam.gn",
    website: "https://bilingue-matam.gn",
    currency: "GNF",
    primaryLanguage: "ar",
    createdAt: "2025-03-05",
    subscriptionTier: "standard",
    subscriptionExpiresAt: "2026-12-31",
    status: "active",
    adminId: "adm-005",
    stats: {
      studentsCount: 420,
      parentsCount: 390,
      teachersCount: 26,
      employeesCount: 10,
      classesCount: 12,
      storageUsedMb: 11200,
      monthlyRevenueGnf: 1500000,
      activityScore: 88
    }
  },
  {
    id: 'sch-gn-nz-006',
    code: 'CFP-NZR',
    name: "Centre de Formation Professionnelle en Forêt",
    type: 'Centre de formation',
    logo: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    address: "Quartier Mohomou, Sortie Beyla",
    city: "Nzérékoré",
    prefecture: "Nzérékoré",
    country: "Guinée",
    phone: "+224 625 33 44 55",
    email: "contact@cfp-foret.gn",
    website: "https://cfp-foret.gn",
    currency: "GNF",
    primaryLanguage: "fr",
    createdAt: "2025-05-12",
    subscriptionTier: "gratuit",
    subscriptionExpiresAt: "2026-11-12",
    status: "suspended",
    adminId: "adm-006",
    stats: {
      studentsCount: 140,
      parentsCount: 90,
      teachersCount: 12,
      employeesCount: 5,
      classesCount: 6,
      storageUsedMb: 3400,
      monthlyRevenueGnf: 0,
      activityScore: 22
    }
  },
  {
    id: 'sch-gn-ck-007',
    code: 'LMA-RTN',
    name: "Lycée Moderne de Ratoma",
    type: 'Lycée',
    logo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
    address: "Carrefour Kipé, Ratoma",
    city: "Conakry",
    prefecture: "Ratoma",
    country: "Guinée",
    phone: "+224 627 66 11 00",
    email: "administration@lycee-ratoma.edu.gn",
    website: "https://lycee-ratoma.edu.gn",
    currency: "GNF",
    primaryLanguage: "fr",
    createdAt: "2024-08-20",
    subscriptionTier: "premium",
    subscriptionExpiresAt: "2027-08-20",
    status: "active",
    adminId: "adm-007",
    stats: {
      studentsCount: 2150,
      parentsCount: 1940,
      teachersCount: 128,
      employeesCount: 40,
      classesCount: 48,
      storageUsedMb: 84000,
      monthlyRevenueGnf: 4500000,
      activityScore: 94
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
  },
  {
    id: 'adm-002',
    schoolId: 'sch-gn-kk-002',
    schoolName: "Université Julius Nyerere de Kankan",
    firstName: "Pr. Sekou",
    lastName: "Condé",
    email: "s.conde@ujnk-kankan.edu.gn",
    phone: "+224 624 55 66 77",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2024-10-16",
    lastLogin: "Aujourd'hui à 06:12"
  },
  {
    id: 'adm-003',
    schoolId: 'sch-gn-kd-003',
    schoolName: "Complexe Scolaire Sainte-Marie de Kindia",
    firstName: "Sœur Hélène",
    lastName: "Guilavogui",
    email: "h.guilavogui@stemarie-kindia.gn",
    phone: "+224 628 33 22 11",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2025-01-11",
    lastLogin: "Hier à 16:40"
  },
  {
    id: 'adm-004',
    schoolId: 'sch-gn-lb-004',
    schoolName: "Institut Polytechnique du Fouta de Labé",
    firstName: "Thierno Amadou",
    lastName: "Bah",
    email: "ta.bah@ipf-labe.edu.gn",
    phone: "+224 620 77 88 99",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2025-02-19",
    lastLogin: "Hier à 11:05"
  },
  {
    id: 'adm-005',
    schoolId: 'sch-gn-ck-005',
    schoolName: "École Primaire Bilingue Franco-Arabe de Matam",
    firstName: "Cheick Mohamed",
    lastName: "Soumah",
    email: "m.soumah@bilingue-matam.gn",
    phone: "+224 622 99 88 77",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2025-03-06",
    lastLogin: "Aujourd'hui à 05:45"
  },
  {
    id: 'adm-006',
    schoolId: 'sch-gn-nz-006',
    schoolName: "Centre de Formation Professionnelle en Forêt",
    firstName: "Gouly",
    lastName: "Koivogui",
    email: "g.koivogui@cfp-foret.gn",
    phone: "+224 625 11 44 22",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    status: "suspended",
    createdAt: "2025-05-13",
    lastLogin: "Il y a 45 jours"
  },
  {
    id: 'adm-007',
    schoolId: 'sch-gn-ck-007',
    schoolName: "Lycée Moderne de Ratoma",
    firstName: "Mariama",
    lastName: "Barry",
    email: "m.barry@lycee-ratoma.edu.gn",
    phone: "+224 627 55 44 33",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2024-08-21",
    lastLogin: "Il y a 32 minutes"
  }
];

export const initialTransactions: PaymentTransaction[] = [
  {
    id: 'tx-2026-11-001',
    invoiceNumber: 'FAC-2026-11-089',
    schoolId: 'sch-gn-kk-002',
    schoolName: "Université Julius Nyerere de Kankan",
    planId: 'entreprise',
    amountGnf: 12000000,
    date: '2026-11-01',
    dueDate: '2026-11-05',
    paymentMethod: 'Virement bancaire',
    reference: 'VIR-VISTA-98214',
    status: 'payé',
    notes: 'Abonnement Mensuel Plateforme Université (Campus Kankan)'
  },
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
  },
  {
    id: 'tx-2026-11-003',
    invoiceNumber: 'FAC-2026-11-091',
    schoolId: 'sch-gn-ck-007',
    schoolName: "Lycée Moderne de Ratoma",
    planId: 'premium',
    amountGnf: 4500000,
    date: '2026-11-01',
    dueDate: '2026-11-05',
    paymentMethod: 'MTN Mobile Money',
    reference: 'MTN-GN-4519280',
    status: 'payé',
    notes: 'Règlement mensuel formule Pro avec accès portail parents'
  },
  {
    id: 'tx-2026-11-004',
    invoiceNumber: 'FAC-2026-11-092',
    schoolId: 'sch-gn-kd-003',
    schoolName: "Complexe Scolaire Sainte-Marie de Kindia",
    planId: 'standard',
    amountGnf: 1500000,
    date: '2026-10-28',
    dueDate: '2026-11-02',
    paymentMethod: 'Orange Money Guinée',
    reference: 'OM-GN-7729103',
    status: 'payé',
    notes: 'Abonnement Standard Octobre/Novembre'
  },
  {
    id: 'tx-2026-11-005',
    invoiceNumber: 'FAC-2026-11-093',
    schoolId: 'sch-gn-lb-004',
    schoolName: "Institut Polytechnique du Fouta de Labé",
    planId: 'standard',
    amountGnf: 1500000,
    date: '2026-10-25',
    dueDate: '2026-10-30',
    paymentMethod: 'Virement bancaire',
    reference: 'VIR-BCRG-19401',
    status: 'payé',
    notes: 'Licence trimestrielle standard institut'
  },
  {
    id: 'tx-2026-11-006',
    invoiceNumber: 'FAC-2026-11-094',
    schoolId: 'sch-gn-ck-005',
    schoolName: "École Primaire Bilingue Franco-Arabe de Matam",
    planId: 'standard',
    amountGnf: 1500000,
    date: '2026-11-02',
    dueDate: '2026-11-07',
    paymentMethod: 'Orange Money Guinée',
    reference: 'OM-GN-1102948',
    status: 'en_attente',
    notes: 'Facture émise en attente de validation USSD Orange Money'
  }
];

export const initialAuditLogs: SecurityAuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-11-02 07:04:12',
    action: 'Connexion Super Admin validée par 2FA',
    actor: 'Dr. Mamadou Cellou Diallo (Super Admin)',
    target: 'Console Principale',
    ip: '197.149.198.42',
    type: 'connexion',
    severity: 'info'
  },
  {
    id: 'log-02',
    timestamp: '2026-11-01 18:30:00',
    action: 'Renouvellement automatique abonnement Premium',
    actor: 'Système ERP Cron',
    target: "Lycée d'Excellence de Conakry",
    ip: '127.0.0.1 (Internal)',
    type: 'finance',
    severity: 'info'
  },
  {
    id: 'log-03',
    timestamp: '2026-11-01 14:15:22',
    action: 'Génération de sauvegarde chiffrée multi-tenant',
    actor: 'Service de Sauvegarde Automatique',
    target: 'Snapshot-db-all-schools-20261101.sql.enc',
    ip: '10.0.4.15',
    type: 'sauvegarde',
    severity: 'info'
  },
  {
    id: 'log-04',
    timestamp: '2026-10-31 16:45:10',
    action: 'Suspension temporaire pour non-renouvellement',
    actor: 'Dr. Mamadou Cellou Diallo',
    target: 'Centre de Formation Professionnelle en Forêt',
    ip: '197.149.198.42',
    type: 'ecole',
    severity: 'warning'
  },
  {
    id: 'log-05',
    timestamp: '2026-10-30 22:11:00',
    action: 'Blocage automatique IP suspecte (Tentatives Brute-Force)',
    actor: 'Firewall WAF Plateforme',
    target: 'IP 185.220.101.5',
    ip: '185.220.101.5',
    type: 'securite',
    severity: 'critical'
  }
];

export const initialBackups: BackupArchive[] = [
  {
    id: 'bk-20261102-0200',
    filename: 'smartschool-full-snapshot-20261102-0200.sql.gz',
    createdAt: '2026-11-02 02:00:15',
    sizeMb: 842.6,
    checksum: 'sha256:8f4c2e17a998b123f...',
    schoolsCount: 7,
    recordsCount: 48920,
    type: 'quotidien',
    status: 'success'
  },
  {
    id: 'bk-20261101-0200',
    filename: 'smartschool-full-snapshot-20261101-0200.sql.gz',
    createdAt: '2026-11-01 02:00:18',
    sizeMb: 839.1,
    checksum: 'sha256:3d1e99f012ba441c...',
    schoolsCount: 7,
    recordsCount: 48610,
    type: 'quotidien',
    status: 'success'
  },
  {
    id: 'bk-20261026-0300',
    filename: 'smartschool-weekly-archive-20261026-0300.tar.zst',
    createdAt: '2026-10-26 03:00:04',
    sizeMb: 2450.4,
    checksum: 'sha256:77bc09fa1249bce3...',
    schoolsCount: 7,
    recordsCount: 47890,
    type: 'hebdomadaire',
    status: 'success'
  },
  {
    id: 'bk-20261001-0000',
    filename: 'smartschool-monthly-archive-20261001-0000.tar.zst',
    createdAt: '2026-10-01 00:00:30',
    sizeMb: 2310.8,
    checksum: 'sha256:99ab12cd7734fe01...',
    schoolsCount: 7,
    recordsCount: 46200,
    type: 'mensuel',
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
    deliveryCount: 7
  },
  {
    id: 'ann-02',
    title: "Maintenance Programmée Serveurs Cloud - Nuit du 15 Novembre",
    content: "Une opération d'optimisation de l'infrastructure de stockage aura lieu entre 01:00 GMT et 03:00 GMT. Les portails resteront consultables en mode lecture seule pendant 45 minutes.",
    target: 'all_admins',
    type: 'maintenance',
    channels: ['in_app', 'email', 'sms'],
    createdAt: '2026-10-25 14:00',
    sentBy: 'Super Admin',
    deliveryCount: 7
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
