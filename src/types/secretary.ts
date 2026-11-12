export type SecretaryNavTab = 
  | 'dashboard'
  | 'students'
  | 'parents'
  | 'cards'
  | 'dossiers'
  | 'certificates'
  | 'transfers'
  | 'appointments'
  | 'communication'
  | 'archives'
  | 'security';

export type DocumentCertificateType = 
  | 'certificat_scolarite'
  | 'attestation_inscription'
  | 'attestation_frequentation'
  | 'attestation_reussite'
  | 'attestation_transfert';

export interface StudentCredentials {
  username: string;
  tempPassword?: string;
  sentViaEmail: boolean;
  sentViaSms: boolean;
}

export interface StudentEnrollment {
  id: string;
  matricule: string; // e.g. "LEC-2026-045"
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  photo: string;
  nationality: string;
  address: string;
  phone: string;
  email: string;
  classId: string;
  className: string;
  bloodGroup: string; // "O+", "A+", "B+", etc.
  medicalNotes: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  registrationDate: string;
  status: 'actif' | 'archive' | 'transfere';
  dossierStatus: 'complet' | 'incomplet';
  missingDocuments: string[]; // e.g. ["Extrait de naissance original", "Certificat médical d'aptitude"]
  credentials: StudentCredentials;
  qrToken: string;
}

export interface ParentRecord {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  profession: string;
  photo: string;
  childrenIds: string[];
  childrenNames: string[];
  status: 'actif' | 'desactive' | 'archive';
  credentials: {
    username: string;
    tempPassword?: string;
    sent: boolean;
  };
}

export interface DeliveredCertificate {
  id: string;
  certificateNumber: string; // e.g. "CERT-2026-0182"
  type: DocumentCertificateType;
  studentId: string;
  studentName: string;
  matricule: string;
  className: string;
  issueDate: string;
  purpose: string; // e.g. "Dossier de bourse", "Consulat", "Changement de résidence"
  signedBy: string;
  qrVerificationUrl: string;
  status: 'delivre' | 'en_attente';
}

export interface SchoolTransfer {
  id: string;
  type: 'entrant' | 'sortant';
  studentName: string;
  matricule: string;
  className: string;
  previousSchool: string;
  targetSchool: string;
  transferDate: string;
  reason: string;
  status: 'approuve' | 'en_cours' | 'rejete';
  certificateNumber?: string;
}

export interface SecretaryAppointment {
  id: string;
  title: string;
  visitorName: string;
  visitorRole: 'Parent d\'élève' | 'Élève' | 'Tuteur' | 'Partenaire / Visiteur';
  visitorPhone: string;
  type: 'Rencontre parent' | 'Rencontre direction' | 'Retrait documents' | 'Réclamations' | 'Inscription';
  date: string;
  time: string;
  location: string;
  notes: string;
  status: 'programme' | 'termine' | 'annule';
}

export interface SecretaryMessage {
  id: string;
  title: string;
  content: string;
  target: 'all_parents' | 'class_parents' | 'single_parent' | 'all_students';
  targetDetail?: string;
  channels: ('app' | 'email' | 'sms' | 'whatsapp')[];
  date: string;
  status: 'envoye';
}

export interface SecretarySecurityLog {
  id: string;
  timestamp: string;
  ip: string;
  device: string;
  action: string;
  status: 'succes' | 'echec';
}

export interface SecretaryProfile {
  name: string;
  title: string;
  matricule: string;
  email: string;
  phone: string;
  schoolId: string;
  schoolName: string;
  photo: string;
  officeRoom: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'email' | 'app';
}
