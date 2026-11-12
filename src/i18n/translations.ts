import { LanguageCode } from '../types';

export interface Translations {
  appName: string;
  superAdminTitle: string;
  ownerBadge: string;
  governanceBannerTitle: string;
  governanceBannerDesc: string;
  governanceRulesTitle?: string;
  governanceRulesList: string[];
  nav: {
    dashboard: string;
    schools: string;
    schoolAdmins: string;
    subscriptions: string;
    revenue: string;
    analytics: string;
    badges: string;
    communication: string;
    security: string;
    backups: string;
    settings: string;
    profile: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    totalSchools: string;
    totalStudents: string;
    totalParents: string;
    totalTeachers: string;
    totalEmployees: string;
    totalUsers: string;
    activeSchools: string;
    suspendedSchools: string;
    totalRevenue: string;
    monthlyRevenue: string;
    annualRevenue: string;
    activeSubs: string;
    expiredSubs: string;
    growthSchools: string;
    growthUsers: string;
    revenueTrend: string;
    subDistribution: string;
    systemAlerts: string;
    recentActivities: string;
    recentLogins: string;
  };
  schools: {
    title: string;
    subtitle: string;
    createSchool: string;
    searchPlaceholder: string;
    filterType: string;
    filterStatus: string;
    allTypes: string;
    allStatuses: string;
    schoolName: string;
    type: string;
    location: string;
    students: string;
    subscription: string;
    status: string;
    actions: string;
    details: string;
    edit: string;
    suspend: string;
    reactivate: string;
    archive: string;
    delete: string;
    viewAsTenant: string;
    tenantIsolationNotice: string;
    schoolIdLabel: string;
  };
  admins: {
    title: string;
    subtitle: string;
    createAdmin: string;
    name: string;
    school: string;
    contact: string;
    status: string;
    lastLogin: string;
    actions: string;
    resetPassword: string;
    changeSchool: string;
  };
  subscriptions: {
    title: string;
    subtitle: string;
    planName: string;
    price: string;
    maxStudents: string;
    maxTeachers: string;
    storage: string;
    modules: string;
    support: string;
    assignPlan: string;
    renewPlan: string;
  };
  revenue: {
    title: string;
    subtitle: string;
    gnfCurrencyNotice: string;
    allTransactions: string;
    exportReport: string;
    generateInvoice: string;
    invoiceNumber: string;
    amount: string;
    method: string;
    date: string;
    status: string;
  };
  security: {
    title: string;
    subtitle: string;
    twoFactorStatus: string;
    activeSessions: string;
    auditLogs: string;
    forceLogout: string;
    blockEntity: string;
  };
  backups: {
    title: string;
    subtitle: string;
    backupNow: string;
    autoSchedules: string;
    downloadBackup: string;
    restoreBackup: string;
  };
  badges: {
    title: string;
    subtitle: string;
    studentCard: string;
    teacherBadge: string;
    staffCard: string;
    qrFormat: string;
    generatePreview: string;
    printCard: string;
  };
  common: {
    active: string;
    suspended: string;
    archived: string;
    save: string;
    cancel: string;
    delete: string;
    confirm: string;
    close: string;
    success: string;
    error: string;
    gnf: string;
    perMonth: string;
    perYear: string;
  };
}

export const translations: Record<LanguageCode, Translations> = {
  fr: {
    appName: "SmartSchool ERP",
    superAdminTitle: "Console Super Administrateur",
    ownerBadge: "Propriétaire de la Plateforme (Multi-Tenant)",
    governanceBannerTitle: "Charte de Gouvernance & Périmètre Super Admin",
    governanceBannerDesc: "Le Super Admin administre l'infrastructure, les établissements, les abonnements et la sécurité globale. Il n'intervient jamais dans la gestion pédagogique quotidienne.",
    governanceRulesList: [
      "Interdiction d'ajouter ou modifier des élèves, enseignants ou parents au sein d'une école",
      "Interdiction de modifier des notes, saisir des présences ou corriger des devoirs",
      "Interdiction de valider des bulletins, des examens ou d'encaisser des frais scolaires internes",
      "Chaque établissement est strictement isolé par son identifiant unique school_id"
    ],
    nav: {
      dashboard: "Tableau de Bord",
      schools: "Établissements",
      schoolAdmins: "Admins Écoles",
      subscriptions: "Abonnements",
      revenue: "Revenus & Factures",
      analytics: "IA & Analyses",
      badges: "QR Code & Badges",
      communication: "Communication",
      security: "Sécurité & Journaux",
      backups: "Sauvegardes",
      settings: "Paramètres Globaux",
      profile: "Profil Super Admin"
    },
    dashboard: {
      title: "Supervision Globale de la Plateforme",
      subtitle: "Métriques en temps réel consolidées sur l'ensemble des établissements scolaires",
      totalSchools: "Total Écoles",
      totalStudents: "Total Élèves",
      totalParents: "Total Parents",
      totalTeachers: "Total Enseignants",
      totalEmployees: "Total Employés",
      totalUsers: "Utilisateurs Globaux",
      activeSchools: "Écoles Actives",
      suspendedSchools: "Écoles Suspendues",
      totalRevenue: "Revenus Totaux (GNF)",
      monthlyRevenue: "Revenus Mensuels",
      annualRevenue: "Revenus Annuels",
      activeSubs: "Abonnements Actifs",
      expiredSubs: "Abonnements Expirés",
      growthSchools: "Croissance des Établissements",
      growthUsers: "Évolution des Utilisateurs",
      revenueTrend: "Flux Financier (GNF)",
      subDistribution: "Répartition des Formules",
      systemAlerts: "Alertes Système & Sécurité",
      recentActivities: "Journal d'Activité Récente",
      recentLogins: "Dernières Connexions"
    },
    schools: {
      title: "Gestion des Établissements Scolaires",
      subtitle: "Création, paramétrage multi-tenant, suivi des quotas et contrôle d'accès",
      createSchool: "Nouvel Établissement",
      searchPlaceholder: "Rechercher par nom, code, ville, préfecture...",
      filterType: "Filtrer par type",
      filterStatus: "Filtrer par statut",
      allTypes: "Tous les types",
      allStatuses: "Tous les statuts",
      schoolName: "Établissement",
      type: "Type",
      location: "Localisation",
      students: "Effectif",
      subscription: "Formule",
      status: "Statut",
      actions: "Actions",
      details: "Consulter la fiche",
      edit: "Modifier",
      suspend: "Suspendre l'accès",
      reactivate: "Réactiver",
      archive: "Archiver",
      delete: "Supprimer",
      viewAsTenant: "Auditer l'espace école",
      tenantIsolationNotice: "Les données pédagogiques sont cloisonnées et cryptées sous l'ID :",
      schoolIdLabel: "Identifiant Système school_id"
    },
    admins: {
      title: "Administrateurs des Écoles",
      subtitle: "Gestion des accès des directeurs et coordinateurs informatiques par établissement",
      createAdmin: "Créer un Admin École",
      name: "Nom & Prénom",
      school: "Établissement Rattaché",
      contact: "Email & Téléphone",
      status: "Statut du Compte",
      lastLogin: "Dernière Connexion",
      actions: "Actions",
      resetPassword: "Réinitialiser mot de passe",
      changeSchool: "Changer d'école"
    },
    subscriptions: {
      title: "Formules & Abonnements SaaS",
      subtitle: "Gestion des plans Gratuit, Standard, Premium et Entreprise avec quotas et modules",
      planName: "Plan",
      price: "Tarif",
      maxStudents: "Élèves max",
      maxTeachers: "Enseignants max",
      storage: "Stockage alloué",
      modules: "Modules inclus",
      support: "Niveau de support",
      assignPlan: "Attribuer à une école",
      renewPlan: "Renouveler abonnement"
    },
    revenue: {
      title: "Gestion des Revenus & Facturation",
      subtitle: "Suivi des encaissements des abonnements en Franc Guinéen (GNF)",
      gnfCurrencyNotice: "Toutes les transactions plateformes sont opérées en Franc Guinéen (GNF).",
      allTransactions: "Historique des Règlements",
      exportReport: "Exporter le Rapport",
      generateInvoice: "Générer Facture",
      invoiceNumber: "N° Facture",
      amount: "Montant (GNF)",
      method: "Canal de Paiement",
      date: "Date",
      status: "État"
    },
    security: {
      title: "Sécurité & Infrastructure Globale",
      subtitle: "Contrôle 2FA, sessions actives, politique de blocage et journaux d'audit",
      twoFactorStatus: "Double Authentification (2FA)",
      activeSessions: "Sessions Actives Multi-Appareils",
      auditLogs: "Journal d'Audit Système",
      forceLogout: "Forcer la Déconnexion",
      blockEntity: "Bloquer l'IP / l'Accès"
    },
    backups: {
      title: "Sauvegardes & Restauration Système",
      subtitle: "Génération de snapshots chiffrés et planification automatique de la base multi-tenant",
      backupNow: "Sauvegarder Maintenant",
      autoSchedules: "Planifications Automatiques",
      downloadBackup: "Télécharger l'Archive",
      restoreBackup: "Restaurer un Snapshot"
    },
    badges: {
      title: "Générateur QR Codes & Modèles de Badges",
      subtitle: "Définition des gabarits officiels de cartes scolaires et badges du personnel",
      studentCard: "Modèle Carte Scolaire Élève",
      teacherBadge: "Modèle Badge Enseignant",
      staffCard: "Modèle Carte Personnel",
      qrFormat: "Format du QR Code Sécurisé",
      generatePreview: "Aperçu en Direct",
      printCard: "Imprimer / Exporter Spécimen"
    },
    common: {
      active: "Actif",
      suspended: "Suspendu",
      archived: "Archivé",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      confirm: "Confirmer",
      close: "Fermer",
      success: "Opération réussie",
      error: "Erreur détectée",
      gnf: "GNF",
      perMonth: "/ mois",
      perYear: "/ an"
    }
  },
  en: {
    appName: "SmartSchool ERP",
    superAdminTitle: "Super Admin Console",
    ownerBadge: "Platform Owner (Multi-Tenant)",
    governanceBannerTitle: "Governance Charter & Super Admin Scope",
    governanceBannerDesc: "The Super Admin manages infrastructure, schools, subscriptions, and platform security. The Super Admin never interferes in daily academic management.",
    governanceRulesList: [
      "Forbidden from adding or editing students, teachers, or parents inside a school",
      "Forbidden from modifying grades, recording attendance, or grading homework",
      "Forbidden from approving report cards, exams, or collecting internal school tuition",
      "Each school is strictly isolated by its unique school_id"
    ],
    nav: {
      dashboard: "Dashboard",
      schools: "Schools",
      schoolAdmins: "School Admins",
      subscriptions: "Subscriptions",
      revenue: "Revenue & Invoices",
      analytics: "AI & Analytics",
      badges: "QR Code & Badges",
      communication: "Communication",
      security: "Security & Logs",
      backups: "Backups",
      settings: "Global Settings",
      profile: "Super Admin Profile"
    },
    dashboard: {
      title: "Platform Overview",
      subtitle: "Real-time consolidated metrics across all educational institutions",
      totalSchools: "Total Schools",
      totalStudents: "Total Students",
      totalParents: "Total Parents",
      totalTeachers: "Total Teachers",
      totalEmployees: "Total Staff",
      totalUsers: "Global Users",
      activeSchools: "Active Schools",
      suspendedSchools: "Suspended Schools",
      totalRevenue: "Total Revenue (GNF)",
      monthlyRevenue: "Monthly Revenue",
      annualRevenue: "Annual Revenue",
      activeSubs: "Active Subscriptions",
      expiredSubs: "Expired Subscriptions",
      growthSchools: "School Growth",
      growthUsers: "User Evolution",
      revenueTrend: "Cash Flow (GNF)",
      subDistribution: "Subscription Breakdown",
      systemAlerts: "System & Security Alerts",
      recentActivities: "Recent Activity Log",
      recentLogins: "Recent Logins"
    },
    schools: {
      title: "School Management",
      subtitle: "Multi-tenant creation, quota monitoring, and access governance",
      createSchool: "New School",
      searchPlaceholder: "Search by name, code, city, prefecture...",
      filterType: "Filter by type",
      filterStatus: "Filter by status",
      allTypes: "All types",
      allStatuses: "All statuses",
      schoolName: "School",
      type: "Type",
      location: "Location",
      students: "Headcount",
      subscription: "Plan",
      status: "Status",
      actions: "Actions",
      details: "View Details",
      edit: "Edit",
      suspend: "Suspend Access",
      reactivate: "Reactivate",
      archive: "Archive",
      delete: "Delete",
      viewAsTenant: "Audit School Space",
      tenantIsolationNotice: "Academic data is strictly partitioned and encrypted under ID:",
      schoolIdLabel: "System Identifier school_id"
    },
    admins: {
      title: "School Administrators",
      subtitle: "Manage headmaster and coordinator platform accounts per school",
      createAdmin: "Create School Admin",
      name: "Full Name",
      school: "Assigned School",
      contact: "Email & Phone",
      status: "Account Status",
      lastLogin: "Last Login",
      actions: "Actions",
      resetPassword: "Reset Password",
      changeSchool: "Change School"
    },
    subscriptions: {
      title: "SaaS Subscription Plans",
      subtitle: "Configure Free, Standard, Premium, and Enterprise tiers with quotas",
      planName: "Plan",
      price: "Pricing",
      maxStudents: "Max Students",
      maxTeachers: "Max Teachers",
      storage: "Allocated Storage",
      modules: "Included Modules",
      support: "Support Level",
      assignPlan: "Assign to School",
      renewPlan: "Renew Subscription"
    },
    revenue: {
      title: "Revenue & Billing Management",
      subtitle: "Monitor platform subscription receipts in Guinean Franc (GNF)",
      gnfCurrencyNotice: "All platform transactions are billed in Guinean Franc (GNF).",
      allTransactions: "Payment History",
      exportReport: "Export Report",
      generateInvoice: "Generate Invoice",
      invoiceNumber: "Invoice #",
      amount: "Amount (GNF)",
      method: "Payment Method",
      date: "Date",
      status: "Status"
    },
    security: {
      title: "Platform Security & Logs",
      subtitle: "2FA status, active multi-device sessions, IP blocklists, and audit trail",
      twoFactorStatus: "Two-Factor Authentication (2FA)",
      activeSessions: "Active Device Sessions",
      auditLogs: "System Audit Logs",
      forceLogout: "Force Logout",
      blockEntity: "Block IP / Access"
    },
    backups: {
      title: "Backups & System Restore",
      subtitle: "Encrypted snapshot creation and automated backup schedule",
      backupNow: "Backup Now",
      autoSchedules: "Automated Schedules",
      downloadBackup: "Download Archive",
      restoreBackup: "Restore Snapshot"
    },
    badges: {
      title: "QR Codes & Badge Templates",
      subtitle: "Standardized templates for student ID cards and staff badges",
      studentCard: "Student Card Template",
      teacherBadge: "Teacher Badge Template",
      staffCard: "Staff Card Template",
      qrFormat: "Secure QR Code Format",
      generatePreview: "Live Preview",
      printCard: "Print / Export Specimen"
    },
    common: {
      active: "Active",
      suspended: "Suspended",
      archived: "Archived",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      confirm: "Confirm",
      close: "Close",
      success: "Operation successful",
      error: "Error encountered",
      gnf: "GNF",
      perMonth: "/ month",
      perYear: "/ year"
    }
  },
  ar: {
    appName: "SmartSchool ERP",
    superAdminTitle: "لوحة تحكم المشرف العام (سوبر أدمن)",
    ownerBadge: "مالك المنصة (متعدد المؤسسات)",
    governanceBannerTitle: "ميثاق الحوكمة ونطاق المشرف العام",
    governanceBannerDesc: "يدير المشرف العام البنية التحتية، المؤسسات، الاشتراكات والأمن الشامل. ولا يتدخل أبدًا في التسيير البيداغوجي اليومي.",
    governanceRulesList: [
      "ممنوع إضافة أو تعديل بيانات الطلاب، المعلمين أو الأولياء داخل المدارس",
      "ممنوع تعديل العلامات، تسجيل الحضور أو تصحيح الواجبات المدرسية",
      "ممنوع المصادقة على كشوف النقاط، الامتحانات أو تحصيل الرسوم المدرسية الداخلية",
      "كل مؤسسة تعليمية معزولة تماماً بمعرفها الفريد school_id"
    ],
    nav: {
      dashboard: "لوحة القيادة",
      schools: "المؤسسات التعليمية",
      schoolAdmins: "مدراء المدارس",
      subscriptions: "الاشتراكات",
      revenue: "الإيرادات والفواتير",
      analytics: "الذكاء الاصطناعي والتحليلات",
      badges: "رموز QR والبطاقات",
      communication: "التواصل العام",
      security: "الأمن وسجلات النظام",
      backups: "النسخ الاحتياطي",
      settings: "الإعدادات العامة",
      profile: "الملف الشخصي"
    },
    dashboard: {
      title: "المراقبة الشاملة للمنصة",
      subtitle: "إحصائيات مباشرة ومجمعة لجميع المؤسسات التعليمية",
      totalSchools: "إجمالي المؤسسات",
      totalStudents: "إجمالي التلاميذ",
      totalParents: "إجمالي الأولياء",
      totalTeachers: "إجمالي الأساتذة",
      totalEmployees: "إجمالي الموظفين",
      totalUsers: "مجموع المستخدمين",
      activeSchools: "المدارس النشطة",
      suspendedSchools: "المدارس المعلقة",
      totalRevenue: "إجمالي الإيرادات (GNF)",
      monthlyRevenue: "الإيرادات الشهرية",
      annualRevenue: "الإيرادات السنوية",
      activeSubs: "الاشتراكات النشطة",
      expiredSubs: "الاشتراكات المنتهية",
      growthSchools: "نمو المؤسسات",
      growthUsers: "تطور المستخدمين",
      revenueTrend: "التدفق المالي (فرنك غيني)",
      subDistribution: "توزيع باقات الاشتراكات",
      systemAlerts: "تنبيهات النظام والأمن",
      recentActivities: "سجل العمليات الأخير",
      recentLogins: "آخر تسجيلات الدخول"
    },
    schools: {
      title: "إدارة المؤسسات التعليمية",
      subtitle: "إنشاء المدارس وضبط العزل متعدد المستأجرين وتتبع الحصص",
      createSchool: "مؤسسة جديدة",
      searchPlaceholder: "البحث بالاسم، الرمز، المدينة، المحافظة...",
      filterType: "تصفية حسب النوع",
      filterStatus: "تصفية حسب الحالة",
      allTypes: "جميع الأنواع",
      allStatuses: "جميع الحالات",
      schoolName: "المؤسسة",
      type: "النوع",
      location: "الموقع الجغرافي",
      students: "عدد التلاميذ",
      subscription: "الباقة",
      status: "الحالة",
      actions: "الإجراءات",
      details: "عرض الملف",
      edit: "تعديل",
      suspend: "تعليق الوصول",
      reactivate: "إعادة التفعيل",
      archive: "أرشفة",
      delete: "حذف",
      viewAsTenant: "فحص فضاء المدرسة",
      tenantIsolationNotice: "البيانات الأكاديمية معزولة ومشفرة تحت المعرف:",
      schoolIdLabel: "معرف النظام school_id"
    },
    admins: {
      title: "مدراء المؤسسات",
      subtitle: "إدارة حسابات مدراء المدارس والمنسقين التقنيين",
      createAdmin: "إنشاء مدير مدرسة",
      name: "الاسم واللقب",
      school: "المؤسسة التابعة",
      contact: "البريد والهاتف",
      status: "حالة الحساب",
      lastLogin: "آخر دخول",
      actions: "الإجراءات",
      resetPassword: "إعادة ضبط كلمة المرور",
      changeSchool: "تغيير المدرسة"
    },
    subscriptions: {
      title: "باقات الاشتراكات السحابية",
      subtitle: "إدارة الباقات: مجاني، قياسي، متقدم ومؤسسي مع الميزات والحصص",
      planName: "الباقة",
      price: "السعر",
      maxStudents: "الحد الأقصى للطلاب",
      maxTeachers: "الحد الأقصى للمعلمين",
      storage: "مساحة التخزين",
      modules: "الوحدات المتضمنة",
      support: "مستوى الدعم",
      assignPlan: "تعيين لمؤسسة",
      renewPlan: "تجديد الاشتراك"
    },
    revenue: {
      title: "إدارة الإيرادات والفوترة",
      subtitle: "تتبع مدفوعات الاشتراكات بالفرنك الغيني (GNF)",
      gnfCurrencyNotice: "تتم جميع معاملات المنصة بالفرنك الغيني (GNF).",
      allTransactions: "سجل المدفوعات",
      exportReport: "تصدير التقرير",
      generateInvoice: "إنشاء فاتورة",
      invoiceNumber: "رقم الفاتورة",
      amount: "المبلغ (GNF)",
      method: "طريقة الدفع",
      date: "التاريخ",
      status: "الحالة"
    },
    security: {
      title: "الأمان والبنية التحتية",
      subtitle: "المصادقة الثنائية 2FA، الجلسات النشطة، وقائمة الحظر",
      twoFactorStatus: "المصادقة الثنائية (2FA)",
      activeSessions: "الجلسات النشطة عبر الأجهزة",
      auditLogs: "سجلات تدقيق النظام",
      forceLogout: "إنهاء الجلسة إجبارياً",
      blockEntity: "حظر عنوان IP / الحساب"
    },
    backups: {
      title: "النسخ الاحتياطي والاستعادة",
      subtitle: "إنشاء لقطات مشفرة وجدولة النسخ التلقائي لقواعد البيانات",
      backupNow: "نسخ احتياطي فوري",
      autoSchedules: "الجداول الزمنية التلقائية",
      downloadBackup: "تحميل الأرشيف",
      restoreBackup: "استعادة لقطة سابقة"
    },
    badges: {
      title: "رموز QR ونماذج البطاقات المدرسية",
      subtitle: "تحديد القوالب الرسمية لبطاقات الطلاب وشارات الموظفين",
      studentCard: "قالب بطاقة التلميذ",
      teacherBadge: "قالب بطاقة المعلم",
      staffCard: "قالب بطاقة الموظف",
      qrFormat: "تنسيق رمز QR المشفر",
      generatePreview: "معاينة مباشرة",
      printCard: "طباعة / تصدير النموذج"
    },
    common: {
      active: "نشط",
      suspended: "معلق",
      archived: "مؤرشف",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      confirm: "تأكيد",
      close: "إغلاق",
      success: "تمت العملية بنجاح",
      error: "حدث خطأ",
      gnf: "فرنك غيني",
      perMonth: "/ شهرياً",
      perYear: "/ سنوياً"
    }
  },
  es: {
    appName: "SmartSchool ERP",
    superAdminTitle: "Consola de Super Administrador",
    ownerBadge: "Propietario de la Plataforma (Multi-Inquilino)",
    governanceBannerTitle: "Estatuto de Gobernanza y Alcance del Super Admin",
    governanceBannerDesc: "El Super Admin administra la infraestructura, las escuelas, las suscripciones y la seguridad. Nunca interviene en la gestión pedagógica cotidiana.",
    governanceRulesList: [
      "Prohibido agregar o modificar estudiantes, profesores o padres dentro de una escuela",
      "Prohibido modificar calificaciones, registrar asistencias o calificar tareas",
      "Prohibido validar boletines, exámenes o cobrar colegiaturas internas escolares",
      "Cada institución está estrictamente aislada por su identificador único school_id"
    ],
    nav: {
      dashboard: "Panel de Control",
      schools: "Instituciones",
      schoolAdmins: "Admins de Escuelas",
      subscriptions: "Suscripciones",
      revenue: "Ingresos y Facturas",
      analytics: "IA y Análisis",
      badges: "Códigos QR y Credenciales",
      communication: "Comunicación",
      security: "Seguridad y Registros",
      backups: "Copias de Seguridad",
      settings: "Configuración Global",
      profile: "Perfil Super Admin"
    },
    dashboard: {
      title: "Supervisión Global de la Plataforma",
      subtitle: "Métricas consolidadas en tiempo real de todas las instituciones educativas",
      totalSchools: "Total Escuelas",
      totalStudents: "Total Estudiantes",
      totalParents: "Total Padres",
      totalTeachers: "Total Profesores",
      totalEmployees: "Total Personal",
      totalUsers: "Usuarios Globales",
      activeSchools: "Escuelas Activas",
      suspendedSchools: "Escuelas Suspendidas",
      totalRevenue: "Ingresos Totales (GNF)",
      monthlyRevenue: "Ingresos Mensuales",
      annualRevenue: "Ingresos Anuales",
      activeSubs: "Suscripciones Activas",
      expiredSubs: "Suscripciones Vencidas",
      growthSchools: "Crecimiento de Escuelas",
      growthUsers: "Evolución de Usuarios",
      revenueTrend: "Flujo Financiero (GNF)",
      subDistribution: "Distribución de Planes",
      systemAlerts: "Alertas del Sistema y Seguridad",
      recentActivities: "Registro de Actividad Reciente",
      recentLogins: "Últimos Inicios de Sesión"
    },
    schools: {
      title: "Gestión de Instituciones Educativas",
      subtitle: "Creación, configuración multi-inquilino y control de cuotas",
      createSchool: "Nueva Escuela",
      searchPlaceholder: "Buscar por nombre, código, ciudad, prefectura...",
      filterType: "Filtrar por tipo",
      filterStatus: "Filtrar por estado",
      allTypes: "Todos los tipos",
      allStatuses: "Todos los estados",
      schoolName: "Institución",
      type: "Tipo",
      location: "Ubicación",
      students: "Alumnos",
      subscription: "Plan",
      status: "Estado",
      actions: "Acciones",
      details: "Ver Ficha",
      edit: "Editar",
      suspend: "Suspender Acceso",
      reactivate: "Reactivar",
      archive: "Archivar",
      delete: "Eliminar",
      viewAsTenant: "Auditar espacio escolar",
      tenantIsolationNotice: "Los datos pedagógicos están aislados y cifrados bajo el ID:",
      schoolIdLabel: "Identificador del Sistema school_id"
    },
    admins: {
      title: "Administradores de Escuelas",
      subtitle: "Gestión de directores y coordinadores tecnológicos por institución",
      createAdmin: "Crear Admin de Escuela",
      name: "Nombre Completo",
      school: "Escuela Asignada",
      contact: "Correo y Teléfono",
      status: "Estado de Cuenta",
      lastLogin: "Último Acceso",
      actions: "Acciones",
      resetPassword: "Restablecer Contraseña",
      changeSchool: "Cambiar Escuela"
    },
    subscriptions: {
      title: "Planes de Suscripción SaaS",
      subtitle: "Gestión de planes Gratuito, Estándar, Premium y Empresarial",
      planName: "Plan",
      price: "Tarifa",
      maxStudents: "Máx Alumnos",
      maxTeachers: "Máx Profesores",
      storage: "Almacenamiento",
      modules: "Módulos Incluidos",
      support: "Nivel de Soporte",
      assignPlan: "Asignar a Escuela",
      renewPlan: "Renovar Suscripción"
    },
    revenue: {
      title: "Gestión de Ingresos y Facturación",
      subtitle: "Monitoreo de pagos de suscripciones en Franco Guineano (GNF)",
      gnfCurrencyNotice: "Todas las transacciones de la plataforma se realizan en Franco Guineano (GNF).",
      allTransactions: "Historial de Pagos",
      exportReport: "Exportar Informe",
      generateInvoice: "Generar Factura",
      invoiceNumber: "N° Factura",
      amount: "Monto (GNF)",
      method: "Método de Pago",
      date: "Fecha",
      status: "Estado"
    },
    security: {
      title: "Seguridad e Infraestructura",
      subtitle: "Control 2FA, sesiones activas multidispositivo y auditoría",
      twoFactorStatus: "Autenticación de Dos Factores (2FA)",
      activeSessions: "Sesiones Activas por Dispositivo",
      auditLogs: "Registros de Auditoría del Sistema",
      forceLogout: "Forzar Cierre de Sesión",
      blockEntity: "Bloquear IP / Acceso"
    },
    backups: {
      title: "Copias de Seguridad y Restauración",
      subtitle: "Generación de copias instantáneas cifradas y programación automática",
      backupNow: "Respaldar Ahora",
      autoSchedules: "Horarios Automáticos",
      downloadBackup: "Descargar Archivo",
      restoreBackup: "Restaurar Copia"
    },
    badges: {
      title: "Códigos QR y Plantillas de Credenciales",
      subtitle: "Modelos estándar para credenciales estudiantiles y de personal",
      studentCard: "Plantilla Carnet Estudiantil",
      teacherBadge: "Plantilla Credencial Docente",
      staffCard: "Plantilla Credencial Personal",
      qrFormat: "Formato QR Seguro",
      generatePreview: "Vista Previa en Vivo",
      printCard: "Imprimir / Exportar Muestra"
    },
    common: {
      active: "Activo",
      suspended: "Suspendido",
      archived: "Archivado",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      confirm: "Confirmar",
      close: "Cerrar",
      success: "Operación completada",
      error: "Error encontrado",
      gnf: "GNF",
      perMonth: "/ mes",
      perYear: "/ año"
    }
  },
  pt: {
    appName: "SmartSchool ERP",
    superAdminTitle: "Consola de Super Administrador",
    ownerBadge: "Proprietário da Plataforma (Multi-Tenant)",
    governanceBannerTitle: "Carta de Governança e Escopo do Super Admin",
    governanceBannerDesc: "O Super Admin gerencia infraestrutura, escolas, assinaturas e segurança global. Nunca interfere na gestão pedagógica diária.",
    governanceRulesList: [
      "Proibido adicionar ou alterar alunos, professores ou pais dentro de uma escola",
      "Proibido modificar notas, registrar presenças ou corrigir tarefas",
      "Proibido validar boletins, exames ou recolher mensalidades internas escolares",
      "Cada instituição é estritamente isolada pelo seu identificador exclusivo school_id"
    ],
    nav: {
      dashboard: "Painel Principal",
      schools: "Estabelecimentos",
      schoolAdmins: "Admins de Escolas",
      subscriptions: "Assinaturas",
      revenue: "Receitas e Faturas",
      analytics: "IA e Análises",
      badges: "QR Code e Crachás",
      communication: "Comunicação",
      security: "Segurança e Logs",
      backups: "Cópias de Segurança",
      settings: "Configurações Globais",
      profile: "Perfil Super Admin"
    },
    dashboard: {
      title: "Supervisão Global da Plataforma",
      subtitle: "Métricas consolidadas em tempo real de todas as instituições",
      totalSchools: "Total de Escolas",
      totalStudents: "Total de Alunos",
      totalParents: "Total de Pais",
      totalTeachers: "Total de Professores",
      totalEmployees: "Total de Funcionários",
      totalUsers: "Usuários Globais",
      activeSchools: "Escolas Ativas",
      suspendedSchools: "Escolas Suspensas",
      totalRevenue: "Receitas Totais (GNF)",
      monthlyRevenue: "Receitas Mensais",
      annualRevenue: "Receitas Anuais",
      activeSubs: "Assinaturas Ativas",
      expiredSubs: "Assinaturas Expiradas",
      growthSchools: "Crescimento de Escolas",
      growthUsers: "Evolução de Usuários",
      revenueTrend: "Fluxo Financeiro (GNF)",
      subDistribution: "Distribuição dos Planos",
      systemAlerts: "Alertas do Sistema e Segurança",
      recentActivities: "Registro de Atividade Recente",
      recentLogins: "Últimos Acessos"
    },
    schools: {
      title: "Gestão dos Estabelecimentos",
      subtitle: "Criação, configuração multi-tenant e monitoramento de limites",
      createSchool: "Nova Escola",
      searchPlaceholder: "Pesquisar por nome, código, cidade, prefeitura...",
      filterType: "Filtrar por tipo",
      filterStatus: "Filtrar por estado",
      allTypes: "Todos os tipos",
      allStatuses: "Todos os estados",
      schoolName: "Estabelecimento",
      type: "Tipo",
      location: "Localização",
      students: "Alunos",
      subscription: "Plano",
      status: "Estado",
      actions: "Ações",
      details: "Ver Ficha",
      edit: "Editar",
      suspend: "Suspender Acesso",
      reactivate: "Reativar",
      archive: "Arquivar",
      delete: "Excluir",
      viewAsTenant: "Auditar espaço da escola",
      tenantIsolationNotice: "Os dados pedagógicos estão isolados e criptografados sob o ID:",
      schoolIdLabel: "Identificador de Sistema school_id"
    },
    admins: {
      title: "Administradores das Escolas",
      subtitle: "Gestão de diretores e coordenadores tecnológicos por instituição",
      createAdmin: "Criar Admin de Escola",
      name: "Nome Completo",
      school: "Escola Vinculada",
      contact: "E-mail e Telefone",
      status: "Status da Conta",
      lastLogin: "Último Acesso",
      actions: "Ações",
      resetPassword: "Redefinir Senha",
      changeSchool: "Mudar Escola"
    },
    subscriptions: {
      title: "Planos de Assinatura SaaS",
      subtitle: "Gestão dos planos Gratuito, Padrão, Premium e Empresarial",
      planName: "Plano",
      price: "Preço",
      maxStudents: "Máx Alunos",
      maxTeachers: "Máx Professores",
      storage: "Armazenamento",
      modules: "Módulos Incluídos",
      support: "Nível de Suporte",
      assignPlan: "Atribuir à Escola",
      renewPlan: "Renovar Assinatura"
    },
    revenue: {
      title: "Gestão de Receitas e Faturamento",
      subtitle: "Monitoramento de pagamentos de assinaturas em Franco Guineense (GNF)",
      gnfCurrencyNotice: "Todas as transações da plataforma são cobradas em Franco Guineense (GNF).",
      allTransactions: "Histórico de Pagamentos",
      exportReport: "Exportar Relatório",
      generateInvoice: "Gerar Fatura",
      invoiceNumber: "N° Fatura",
      amount: "Valor (GNF)",
      method: "Método de Pagamento",
      date: "Data",
      status: "Status"
    },
    security: {
      title: "Segurança e Infraestrutura",
      subtitle: "Autenticação 2FA, sessões ativas multidispositivo e logs de auditoria",
      twoFactorStatus: "Autenticação em Duas Etapas (2FA)",
      activeSessions: "Sessões Ativas por Dispositivo",
      auditLogs: "Registros de Auditoria do Sistema",
      forceLogout: "Forçar Desconexão",
      blockEntity: "Bloquear IP / Acesso"
    },
    backups: {
      title: "Backups e Restauração",
      subtitle: "Criação de snapshots criptografados e agendamento automático",
      backupNow: "Fazer Backup Agora",
      autoSchedules: "Agendamentos Automáticos",
      downloadBackup: "Baixar Arquivo",
      restoreBackup: "Restaurar Cópia"
    },
    badges: {
      title: "QR Code e Modelos de Crachás",
      subtitle: "Modelos padronizados para cartões estudantis e crachás de funcionários",
      studentCard: "Modelo Cartão do Estudante",
      teacherBadge: "Modelo Crachá do Professor",
      staffCard: "Modelo Crachá do Funcionário",
      qrFormat: "Formato QR Seguro",
      generatePreview: "Visualização em Tempo Real",
      printCard: "Imprimir / Exportar Espécime"
    },
    common: {
      active: "Ativo",
      suspended: "Suspenso",
      archived: "Arquivado",
      save: "Salvar",
      cancel: "Cancelar",
      delete: "Excluir",
      confirm: "Confirmar",
      close: "Fechar",
      success: "Operação bem-sucedida",
      error: "Erro encontrado",
      gnf: "GNF",
      perMonth: "/ mês",
      perYear: "/ ano"
    }
  }
};
