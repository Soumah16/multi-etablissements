/**
 * SmartSchool ERP - National School ERP for Republic of Guinea (MEPU-A / MESRSI)
 * Advanced Role-Based Access Control (RBAC) & Multi-Tenant Architecture
 */

export type RoleType = 
  | 'SUPER_ADMIN_NATIONAL'
  | 'ADMIN_ECOLE'
  | 'DIRECTEUR'
  | 'CENSEUR'
  | 'ENSEIGNANT'
  | 'SECRETAIRE'
  | 'COMPTABLE'
  | 'SURVEILLANT'
  | 'BIBLIOTHECAIRE'
  | 'PARENT'
  | 'ELEVE';

export type AccountStatus = 'actif' | 'desactive' | 'verrouille' | 'en_attente';

export interface UserAccount {
  id: string; // e.g. "USR-001"
  matricule: string; // e.g. "ADM-EXC-001", "ENS-EXC-015"
  ecoleId: string; // e.g. "ECOLE-001" or "NATIONAL" for Super Admin
  schoolName: string;
  role: RoleType | any;
  title: string;
  name?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo: string;
  password?: string;
  passwordHash?: string;
  plainPassword?: string; // Stored securely in demo/local vault
  status: AccountStatus;
  mustChangePassword: boolean;
  failedLoginAttempts: number;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  badgeNumber: string;
  nationalUid: string; // Cryptographic unique national identity hash
  permissions: PermissionKey[];
}

export type PermissionKey =
  // Pilotage National & Multi-Établissements
  | 'MANAGE_ALL_SCHOOLS'
  | 'MANAGE_SAAS_SUBSCRIPTIONS'
  | 'CREATE_SCHOOL_ADMINS'
  | 'VIEW_NATIONAL_ANALYTICS'
  | 'MANAGE_GLOBAL_SETTINGS'
  // Pilotage Établissement (Admin École)
  | 'MANAGE_SCHOOL_CONFIG'
  | 'CREATE_SCHOOL_STAFF'
  | 'MANAGE_CLASSES_ROOMS'
  | 'MANAGE_SUBJECTS_COEFFICIENTS'
  | 'ISSUE_SCHOOL_BADGES'
  // Direction Pédagogique & Censure
  | 'VALIDATE_REPORT_CARDS'
  | 'SUPERVISE_TEACHERS'
  | 'MANAGE_EXAMS_SEALS'
  | 'MANAGE_TIMETABLE'
  | 'VIEW_PEDAGOGICAL_STATS'
  // Secrétariat Général
  | 'ENROLL_STUDENTS'
  | 'ISSUE_CERTIFICATES'
  | 'MANAGE_STUDENT_DOSSIERS'
  | 'ARCHIVE_DOCUMENTS'
  // Corps Professoral
  | 'INPUT_STUDENT_GRADES'
  | 'MANAGE_LOGBOOK'
  | 'ASSIGN_HOMEWORK'
  | 'MARK_ATTENDANCE'
  // Vie Scolaire & Discipline
  | 'MANAGE_DISCIPLINE_INCIDENTS'
  | 'ISSUE_ADMISSION_SLIPS'
  | 'CONVOKE_PARENTS'
  // Gestion Financière & Comptabilité
  | 'COLLECT_SCHOOL_FEES'
  | 'ISSUE_PAYMENT_RECEIPTS'
  | 'MANAGE_PAYROLL'
  | 'VIEW_FINANCIAL_REPORTS'
  // Bibliothèque & Médiathèque
  | 'MANAGE_PHYSICAL_BOOKS'
  | 'MANAGE_EBOOKS_READER'
  | 'PROCESS_BOOK_LOANS'
  // Espace Parent (Consultation)
  | 'VIEW_CHILD_GRADES'
  | 'VIEW_CHILD_ATTENDANCE'
  | 'PAY_FEES_MOBILE_MONEY'
  // Espace Élève (Apprenant)
  | 'VIEW_OWN_REPORT_CARD'
  | 'DOWNLOAD_COURSES'
  | 'SUBMIT_HOMEWORK'
  | 'READ_DIGITAL_LIBRARY';

export const ROLE_PERMISSIONS_MATRIX: Record<RoleType, PermissionKey[]> = {
  SUPER_ADMIN_NATIONAL: [
    'MANAGE_ALL_SCHOOLS',
    'MANAGE_SAAS_SUBSCRIPTIONS',
    'CREATE_SCHOOL_ADMINS',
    'VIEW_NATIONAL_ANALYTICS',
    'MANAGE_GLOBAL_SETTINGS',
    'MANAGE_SCHOOL_CONFIG',
    'CREATE_SCHOOL_STAFF',
    'VALIDATE_REPORT_CARDS',
    'VIEW_FINANCIAL_REPORTS',
    'ISSUE_SCHOOL_BADGES'
  ],
  ADMIN_ECOLE: [
    'MANAGE_SCHOOL_CONFIG',
    'CREATE_SCHOOL_STAFF',
    'MANAGE_CLASSES_ROOMS',
    'MANAGE_SUBJECTS_COEFFICIENTS',
    'ISSUE_SCHOOL_BADGES',
    'VALIDATE_REPORT_CARDS',
    'VIEW_FINANCIAL_REPORTS',
    'ENROLL_STUDENTS',
    'ISSUE_CERTIFICATES',
    'MANAGE_STUDENT_DOSSIERS',
    'MANAGE_DISCIPLINE_INCIDENTS',
    'COLLECT_SCHOOL_FEES'
  ],
  DIRECTEUR: [
    'VALIDATE_REPORT_CARDS',
    'SUPERVISE_TEACHERS',
    'MANAGE_EXAMS_SEALS',
    'MANAGE_TIMETABLE',
    'VIEW_PEDAGOGICAL_STATS',
    'MANAGE_STUDENT_DOSSIERS',
    'ISSUE_CERTIFICATES'
  ],
  CENSEUR: [
    'MANAGE_TIMETABLE',
    'SUPERVISE_TEACHERS',
    'VIEW_PEDAGOGICAL_STATS',
    'MANAGE_EXAMS_SEALS',
    'MANAGE_DISCIPLINE_INCIDENTS',
    'MANAGE_CLASSES_ROOMS'
  ],
  ENSEIGNANT: [
    'INPUT_STUDENT_GRADES',
    'MANAGE_LOGBOOK',
    'ASSIGN_HOMEWORK',
    'MARK_ATTENDANCE'
  ],
  SECRETAIRE: [
    'ENROLL_STUDENTS',
    'ISSUE_CERTIFICATES',
    'MANAGE_STUDENT_DOSSIERS',
    'ARCHIVE_DOCUMENTS',
    'ISSUE_SCHOOL_BADGES'
  ],
  COMPTABLE: [
    'COLLECT_SCHOOL_FEES',
    'ISSUE_PAYMENT_RECEIPTS',
    'MANAGE_PAYROLL',
    'VIEW_FINANCIAL_REPORTS'
  ],
  SURVEILLANT: [
    'MANAGE_DISCIPLINE_INCIDENTS',
    'ISSUE_ADMISSION_SLIPS',
    'CONVOKE_PARENTS',
    'MARK_ATTENDANCE'
  ],
  BIBLIOTHECAIRE: [
    'MANAGE_PHYSICAL_BOOKS',
    'MANAGE_EBOOKS_READER',
    'PROCESS_BOOK_LOANS'
  ],
  PARENT: [
    'VIEW_CHILD_GRADES',
    'VIEW_CHILD_ATTENDANCE',
    'PAY_FEES_MOBILE_MONEY'
  ],
  ELEVE: [
    'VIEW_OWN_REPORT_CARD',
    'DOWNLOAD_COURSES',
    'SUBMIT_HOMEWORK',
    'READ_DIGITAL_LIBRARY'
  ]
};

export const ROLE_LABELS: Record<RoleType, string> = {
  SUPER_ADMIN_NATIONAL: 'Super Administrateur National (MEPU-A)',
  ADMIN_ECOLE: 'Administrateur d\'Établissement (Fondateur)',
  DIRECTEUR: 'Directeur des Études (Pédagogie)',
  CENSEUR: 'Censeur des Études (Discipline & Emplois du Temps)',
  ENSEIGNANT: 'Enseignant Titulaire (Corps Professoral)',
  SECRETAIRE: 'Secrétaire Générale (Scolarité & Registres)',
  COMPTABLE: 'Chef Comptable (Finances & Trésorerie)',
  SURVEILLANT: 'Surveillant Général (Vie Scolaire & Discipline)',
  BIBLIOTHECAIRE: 'Bibliothécaire (Médiathèque & Livres)',
  PARENT: 'Espace Parent d\'Élève (Tuteur Légal)',
  ELEVE: 'Espace Élève (Apprenant)'
};
