export type SupervisorNavTab = 
  | 'dashboard'
  | 'attendance'
  | 'admission_slips'
  | 'incidents'
  | 'watchlist'
  | 'patrols'
  | 'rules'
  | 'parent_meetings'
  | 'communication'
  | 'badge'
  | 'security';

export interface SupervisorProfile {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  email: string;
  phone: string;
  photo: string;
  address: string;
  roleTitle: string; // e.g. "Surveillant Général"
  department: string; // "Vie Scolaire & Discipline"
  schoolName: string;
  schoolId: string;
  hireDate: string;
  status: 'active' | 'leave';
  twoFactorEnabled: boolean;
  pinCode: string;
}

export interface AttendanceRecordItem {
  id: string;
  studentId: string;
  studentName: string;
  studentMatricule: string;
  className: string;
  date: string;
  time: string;
  type: 'absent' | 'retard';
  minutesLate?: number;
  subjectTaught: string;
  teacherName: string;
  status: 'non_justifie' | 'justifie' | 'en_attente';
  justificationReason?: string;
  justifiedAt?: string;
  notifiedParent: boolean;
}

export interface AdmissionSlip {
  id: string;
  slipNumber: string; // e.g. "BR-2026-104"
  studentId: string;
  studentName: string;
  studentMatricule: string;
  className: string;
  issuedDate: string;
  issuedTime: string;
  reason: 'retard_justifie' | 'retour_maladie' | 'convocation_parent' | 'motif_familial' | 'autre';
  comments: string;
  supervisorName: string;
  supervisorSignature: boolean;
  isAdmittedToClass: boolean;
}

export interface DisciplinaryIncident {
  id: string;
  incidentNumber: string; // e.g. "INC-2026-042"
  studentId: string;
  studentName: string;
  studentMatricule: string;
  className: string;
  date: string;
  time: string;
  location: 'Cour de récréation' | 'Salle de classe' | 'Couloir' | 'Portail d\'entrée' | 'Sanitaires' | 'Autre';
  infractionType: 
    | 'Retards répétés'
    | 'Insolence / Manque de respect'
    | 'Bavardage / Perturbation de cours'
    | 'Tenue non réglementaire (Uniforme)'
    | 'Usage interdit du smartphone'
    | 'Bagarre / Violence physique'
    | 'Dégradation de matériel scolaire'
    | 'Fraude / Tricherie'
    | 'Absence non autorisée (Fugue)';
  severity: 'mineure' | 'moyenne' | 'grave';
  witnesses?: string;
  reportDetails: string;
  reportedBy: string; // Enseignant, Surveillant, Délégué
  sanctionType?: 
    | 'Rappel à l\'ordre'
    | 'Avertissement écrit'
    | 'Blâme disciplinaire'
    | 'Heures de retenue / TIG'
    | 'Exclusion temporaire (1-3 jours)'
    | 'Convocation du Conseil de Discipline';
  sanctionDuration?: string; // e.g. "2 heures de retenue le samedi"
  parentNotified: boolean;
  reportedToDirector: boolean;
  status: 'en_cours' | 'resolu' | 'transmis_direction';
}

export interface WatchlistStudent {
  studentId: string;
  studentName: string;
  studentMatricule: string;
  className: string;
  photo?: string;
  parentName: string;
  parentPhone: string;
  totalAbsences: number;
  totalLate: number;
  totalIncidents: number;
  activeSanctionsCount: number;
  behaviorScore: number; // /20
  riskLevel: 'faible' | 'modere' | 'eleve';
  supervisorNotes: string[];
  lastMeetingDate?: string;
}

export interface ConfiscatedItem {
  id: string;
  studentName: string;
  className: string;
  itemName: string;
  itemType: 'Smartphone' | 'Écouteurs' | 'Objet tranchant' | 'Vêtement non conforme' | 'Autre';
  confiscatedDate: string;
  location: string;
  status: 'consigne' | 'restitue_parent';
  returnedDate?: string;
}

export interface SecurityPatrol {
  id: string;
  zone: 'Portail Principal' | 'Cour Centrale' | 'Couloirs Bâtiment Lycée' | 'Couloirs Collège' | 'Laboratoires & Salle Info';
  time: string;
  date: string;
  supervisorName: string;
  observations: string;
  incidentDetected: boolean;
}

export interface DisciplinaryParentMeeting {
  id: string;
  studentName: string;
  className: string;
  parentName: string;
  parentPhone: string;
  date: string;
  time: string;
  reason: string;
  status: 'programme' | 'confirme' | 'effectue' | 'reporte';
  meetingNotes?: string;
}
