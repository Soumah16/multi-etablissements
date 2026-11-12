export type SchoolType = 
  | 'Primaire' 
  | 'Collège' 
  | 'Lycée' 
  | 'Université' 
  | 'Institut professionnel' 
  | 'Centre de formation';

export type SubscriptionTierId = 'gratuit' | 'standard' | 'premium' | 'entreprise';

export type LanguageCode = 'fr' | 'en' | 'ar' | 'es' | 'pt';

export interface SchoolStats {
  studentsCount: number;
  parentsCount: number;
  teachersCount: number;
  employeesCount: number;
  classesCount: number;
  storageUsedMb: number;
  monthlyRevenueGnf: number;
  activityScore: number; // 0-100
}

export interface School {
  id: string; // school_id
  code: string;
  name: string;
  type: SchoolType;
  logo: string;
  banner?: string;
  address: string;
  city: string;
  prefecture: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  currency: string; // "GNF"
  primaryLanguage: LanguageCode;
  createdAt: string;
  subscriptionTier: SubscriptionTierId;
  subscriptionExpiresAt: string;
  status: 'active' | 'suspended' | 'archived';
  stats: SchoolStats;
  adminId?: string;
}

export interface SchoolAdmin {
  id: string;
  schoolId: string;
  schoolName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin: string;
  passwordResetRequired?: boolean;
}

export interface SuperAdminProfile {
  name: string;
  title: string;
  phone: string;
  email: string;
  address: string;
  enterprise: string;
  enterpriseLogo: string;
  signatureUrl: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'app' | 'sms';
  lastLogin: string;
  loginHistory: {
    id: string;
    date: string;
    ip: string;
    device: string;
    location: string;
    status: 'success' | 'failed';
  }[];
}

export interface SubscriptionPlan {
  id: SubscriptionTierId;
  name: string;
  badge: string;
  priceMonthlyGnf: number;
  priceAnnualGnf: number;
  maxStudents: number;
  maxTeachers: number;
  storageGb: number;
  modules: string[];
  supportLevel: string;
  backupFrequency: string;
  features: string[];
  activeSchoolsCount: number;
}

export interface PaymentTransaction {
  id: string;
  invoiceNumber: string;
  schoolId: string;
  schoolName: string;
  planId: SubscriptionTierId;
  amountGnf: number;
  date: string;
  dueDate: string;
  paymentMethod: 'Orange Money Guinée' | 'MTN Mobile Money' | 'Virement bancaire' | 'Carte bancaire';
  reference: string;
  status: 'payé' | 'en_attente' | 'échoué' | 'remboursé';
  notes?: string;
}

export interface GlobalAnnouncement {
  id: string;
  title: string;
  content: string;
  target: 'all_schools' | 'selected_schools' | 'all_admins';
  targetSchoolIds?: string[];
  type: 'info' | 'urgent' | 'maintenance' | ' mise_a_jour';
  channels: ('in_app' | 'email' | 'sms' | 'whatsapp')[];
  createdAt: string;
  sentBy: string;
  deliveryCount: number;
}

export interface SecuritySession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  target: string;
  ip: string;
  type: 'connexion' | 'ecole' | 'admin' | 'securite' | 'finance' | 'sauvegarde';
  severity: 'info' | 'warning' | 'critical';
}

export interface BackupArchive {
  id: string;
  filename: string;
  createdAt: string;
  sizeMb: number;
  checksum: string;
  schoolsCount: number;
  recordsCount: number;
  type: 'manuel' | 'quotidien' | 'hebdomadaire' | 'mensuel';
  status: 'success' | 'warning';
}

export interface GlobalSettings {
  platformName: string;
  platformLogo: string;
  favicon: string;
  primaryColor: string;
  systemEmail: string;
  smtpHost: string;
  smtpPort: number;
  smsGatewayEnabled: boolean;
  smsProvider: string;
  whatsAppEnabled: boolean;
  pushNotificationsEnabled: boolean;
  maintenanceMode: boolean;
  sessionTimeoutMinutes: number;
  backupSchedule: 'daily' | 'weekly' | 'monthly';
  backupTime: string;
}

export interface BadgeTemplateConfig {
  schoolId?: string; // empty means platform default
  templateType: 'student' | 'teacher' | 'staff';
  title: string;
  themeColor: string;
  textColor: string;
  showQrCode: boolean;
  qrPayloadType: 'vcard' | 'verification_url' | 'matricule_uuid';
  showBarcode: boolean;
  barcodeFormat: 'CODE128' | 'EAN13';
  showPhoto: boolean;
  showSignature: boolean;
  showValidityYear: boolean;
  validityYear: string;
  orientation: 'vertical' | 'horizontal';
}

// ==========================================
// SCHOOL ADMIN MODULE TYPES
// ==========================================

export type StaffRole = 
  | 'Directeur'
  | 'Secrétaire'
  | 'Comptable'
  | 'Enseignant'
  | 'Bibliothécaire'
  | 'Surveillant'
  | 'Personnel administratif'
  | 'Responsable informatique';

export interface StaffMember {
  id: string;
  matricule: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: StaffRole;
  department: string;
  hireDate: string;
  status: 'actif' | 'suspendu' | 'conge';
  photo: string;
  username: string;
  temporaryPassword?: string;
  credentialsSent: boolean;
  qrToken: string;
  assignedClasses?: string[];
  assignedSubjects?: string[];
}

export interface SchoolClass {
  id: string;
  schoolId: string;
  name: string; // e.g. "Terminale SM 1"
  level: string; // "Lycée", "Collège", "Primaire"
  section: string; // "Sciences Mathématiques", "Sciences Expérimentales", "Littéraire"
  capacity: number;
  studentsCount: number;
  mainRoomId: string;
  mainRoomName: string;
  principalTeacherId?: string;
  principalTeacherName?: string;
  archived: boolean;
}

export interface SchoolSubject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  coefficient: number;
  department: string;
  active: boolean;
}

export type FacilityType = 'Salle de cours' | 'Laboratoire' | 'Bibliothèque' | 'Salle informatique';

export interface SchoolRoom {
  id: string;
  schoolId: string;
  name: string;
  capacity: number;
  type: FacilityType;
  equipments: string[]; // e.g. "Projecteur", "Wi-Fi", "Climatisation", "30 PC"
  currentOccupation?: string; // Class using it
}

export interface AcademicTerm {
  id: string;
  name: string; // e.g. "1er Trimestre", "2ème Trimestre"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface AcademicYear {
  id: string;
  schoolId: string;
  yearLabel: string; // e.g. "2026-2027"
  status: 'active' | 'cloturee' | 'archivée';
  startDate: string;
  endDate: string;
  terms: AcademicTerm[];
}

export interface AdministrativeEvent {
  id: string;
  schoolId: string;
  title: string;
  type: 'Reunion' | 'Convocation' | 'Formation' | 'Note de service' | 'Communique';
  date: string;
  time: string;
  location: string;
  targetAudience: string; // "Tout le personnel", "Enseignants", "Administration"
  content: string;
  published: boolean;
}

export interface AdministrativeDocumentTemplate {
  id: string;
  schoolId: string;
  title: string;
  type: 'certificat_scolarite' | 'attestation_inscription' | 'modele_bulletin' | 'badge_personnel' | 'carte_scolaire';
  headerText: string;
  footerText: string;
  signatoryTitle: string;
  signatoryName: string;
  includeStamp: boolean;
  themeColor: string;
}

export interface SchoolLoginLog {
  id: string;
  schoolId: string;
  userName: string;
  role: string;
  ip: string;
  device: string;
  timestamp: string;
  status: 'succes' | 'echec';
  location: string;
}
