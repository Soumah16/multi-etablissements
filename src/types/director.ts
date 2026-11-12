export type DirectorNavTab = 
  | 'dashboard'
  | 'pedagogy'
  | 'bulletins'
  | 'exams'
  | 'teachers'
  | 'students'
  | 'discipline'
  | 'communication'
  | 'news'
  | 'calendar'
  | 'finances'
  | 'reports'
  | 'security'
  | 'badge';

export type BulletinStatus = 'en_attente' | 'approuve' | 'rejete' | 'correction_demandee';

export type ExamValidationStatus = 'brouillon' | 'en_attente' | 'valide' | 'publie' | 'rejete';

export interface SubjectGrade {
  id: string;
  subjectName: string;
  code: string;
  coefficient: number;
  continuousNote: number; // Note de cours / devoirs (sur 20)
  examNote: number; // Note de composition (sur 20)
  finalNote: number; // Moyenne calculée (sur 20)
  appreciation: string;
  teacherName: string;
}

export interface StudentReportCard {
  id: string;
  studentId: string;
  studentName: string;
  studentMatricule: string;
  studentPhoto: string;
  classId: string;
  className: string;
  level: string;
  termId: string;
  termName: string; // "1er Trimestre"
  academicYear: string; // "2026-2027"
  grades: SubjectGrade[];
  generalAverage: number;
  classRank: number;
  totalStudentsInClass: number;
  classAverage: number;
  highestClassAverage: number;
  lowestClassAverage: number;
  conductAppreciation: string;
  absencesHours: number;
  unjustifiedAbsencesHours: number;
  delaysCount: number;
  councilDecision: 'Tableau d\'Honneur' | 'Encouragements' | 'Compliments' | 'Avertissement Travail' | 'Passage sous réserve' | 'Normal';
  directorStatus: BulletinStatus;
  directorObservation?: string;
  validatedAt?: string;
  validatedBy?: string;
  signatureHash?: string;
  pdfGenerated: boolean;
}

export interface DirectorExam {
  id: string;
  schoolId: string;
  title: string;
  session: string; // e.g. "Session Ordinaire 2026-2027"
  termName: string;
  level: string; // "Terminale", "10ème Année", "Tous Lycée"
  date: string;
  targetClasses: string[];
  subjectsCount: number;
  candidatesCount: number;
  presentCount: number;
  passedCount: number;
  successRate: number; // %
  highestAverage: number;
  lowestAverage: number;
  classAverage: number;
  status: ExamValidationStatus;
  directorNotes?: string;
  publishedAt?: string;
  publishedBy?: string;
  signatureHash?: string;
}

export interface TeacherPedagogicalProfile {
  id: string;
  teacherId: string;
  teacherName: string;
  matricule: string;
  photo: string;
  subject: string;
  department: string;
  assignedClasses: string[];
  syllabusProgressPct: number; // 0-100%
  hoursScheduled: number;
  hoursCompleted: number;
  homeworksAssigned: number;
  logbookFilledPct: number; // 0-100%
  attendanceRate: number; // %
  delaysCount: number;
  pedagogicalRating: number; // 1 to 5 stars
  directorObservation: string;
  lastInspectionDate: string;
}

export type StudentRiskCategory = 
  | 'tous'
  | 'excellent' 
  | 'regulier' 
  | 'en_difficulte' 
  | 'a_risque' 
  | 'absenteisme_critique';

export interface StudentMonitoringRecord {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  photo: string;
  classId: string;
  className: string;
  generalAverage: number;
  previousAverage: number;
  rank: number;
  absencesHours: number;
  unjustifiedAbsencesHours: number;
  delaysCount: number;
  conductScore: number; // /20
  riskCategory: StudentRiskCategory;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  pedagogicalNotes: string;
  honorRoll: boolean;
}

export interface DisciplinaryIncident {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  studentPhoto: string;
  className: string;
  reportedByRole: string; // "Surveillant Général", "Enseignant", "Censeur"
  reportedByName: string;
  incidentType: 
    | 'Bagarre / Violence' 
    | 'Fraude lors d\'un examen' 
    | 'Insolence caractérisée' 
    | 'Retards et absences chroniques' 
    | 'Dégradation de matériel' 
    | 'Usage de téléphone en cours' 
    | 'Refus d\'obtempérer';
  severity: 'faible' | 'moyenne' | 'grave' | 'critique';
  description: string;
  proposedSanction: 
    | 'Avertissement verbal'
    | 'Avertissement écrit'
    | 'Blâme'
    | 'Retenue 2 heures le samedi'
    | 'Exclusion temporaire (3 jours)'
    | 'Exclusion temporaire (8 jours)'
    | 'Convocation du Conseil de Discipline';
  directorStatus: 'en_attente' | 'validee' | 'modifiee' | 'rejetee';
  finalSanction?: string;
  directorNotes?: string;
  decisionDate?: string;
  requiresPin2FA?: boolean;
}

export interface DirectorAnnouncement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'teachers' | 'parents' | 'students' | 'specific_class';
  targetClassName?: string;
  channels: ('in_app' | 'email' | 'sms' | 'whatsapp')[];
  createdAt: string;
  author: string;
  isOfficialCommunique: boolean;
  priority: 'normal' | 'urgent' | 'officiel';
  readsCount: number;
}

export interface DirectorNewsItem {
  id: string;
  title: string;
  category: 'Pedagogique' | 'Evenement' | 'Vie scolaire' | 'Orientation' | 'Succès';
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
  pdfUrl?: string;
  pdfFilename?: string;
  author: string;
  viewsCount: number;
  published: boolean;
}

export interface DirectorCalendarEvent {
  id: string;
  title: string;
  type: 
    | 'Reunion Parents' 
    | 'Conseil de Classe' 
    | 'Examen Blanc' 
    | 'Journee Culturelle' 
    | 'Formation Pedagogique' 
    | 'Ceremonie de Remise' 
    | 'Competition Sportive'
    | 'Vacances & Conges';
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  location: string;
  targetAudience: string;
  description: string;
  organizer: string;
}

export interface DirectorDebtorRecord {
  id: string;
  studentName: string;
  matricule: string;
  className: string;
  amountDueGnf: number;
  dueDate: string;
  parentName: string;
  parentPhone: string;
  status: 'retard_leger' | 'retard_critique';
}

export interface DirectorFinancialSummary {
  currency: string;
  totalRevenueGnf: number;
  totalExpensesGnf: number;
  netTreasuryGnf: number;
  tuitionExpectedGnf: number;
  tuitionCollectedGnf: number;
  collectionRatePct: number;
  totalDebtorsCount: number;
  totalDebtAmountGnf: number;
  debtorsList: DirectorDebtorRecord[];
  monthlyBreakdown: { month: string; collectedGnf: number; expensesGnf: number }[];
}

export interface DirectorAuditLog {
  id: string;
  timestamp: string;
  action: string;
  target: string;
  userRole: string;
  ip: string;
  device: string;
  securityLevel: 'normale' | 'sensible' | 'critique';
  status: 'succes' | 'echec';
}
