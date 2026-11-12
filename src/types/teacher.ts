export type TeacherNavTab = 
  | 'dashboard'
  | 'classes'
  | 'subjects'
  | 'courses'
  | 'logbook'
  | 'homework'
  | 'gradebook'
  | 'library'
  | 'attendance'
  | 'monitoring'
  | 'events'
  | 'schedule'
  | 'communication'
  | 'badge'
  | 'security';

export interface TeacherProfile {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  email: string;
  phone: string;
  photo: string;
  address: string;
  diploma: string;
  mainSubject: string; // Matière principale
  specialty?: string;
  department: string;
  subjects: string[];
  schoolName: string;
  schoolId: string;
  isMainTeacherOf?: string; // e.g. "Terminale Sciences Mathématiques (TSM)"
  weeklyHours: number;
  hireDate: string;
  status: 'active' | 'leave';
  twoFactorEnabled: boolean;
}

export interface AssignedClass {
  id: string;
  name: string;
  level: string;
  room: string;
  studentsCount: number;
  isMainTeacher: boolean;
  classDelegate: string;
  averageGrade: number; // /20
  attendanceRate: number; // %
}

export interface TeacherSubject {
  id: string;
  name: string;
  coefficient: number;
  level: string;
  classNames: string[];
  progressionPercent: number; // 0-100%
  chaptersCount: number;
  hoursCompleted: number;
  hoursTotal: number;
  officialSyllabusSummary: string;
}

export interface CourseResource {
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'zip' | 'jpg' | 'png' | 'video' | 'audio';
  url: string;
  size: string;
}

export interface CourseModuleItem {
  id: string;
  title: string;
  chapterTitle: string;
  moduleName: string;
  classId: string;
  className: string;
  subject: string;
  description: string;
  objectives: string[];
  resources: CourseResource[];
  publishedDate: string;
  isPublished: boolean;
}

export interface PedagogicalResource {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'pptx' | 'ebook' | 'video' | 'audio' | 'tp' | 'corrige';
  subject: string;
  level: string;
  className: string;
  fileUrl: string;
  size: string;
  downloadCount: number;
  uploadedAt: string;
  description: string;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  studentMatricule: string;
  submittedAt: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  grade?: number;
  maxScore: number;
  teacherComment?: string;
  status: 'rendu' | 'corrige' | 'en_retard';
}

export interface HomeworkItem {
  id: string;
  classId: string;
  className: string;
  subject: string;
  title: string;
  description: string;
  givenDate: string;
  dueDate: string;
  maxScore: number;
  attachments?: { name: string; url: string; type: string }[];
  totalSubmissions: number;
  evaluatedCount: number;
  totalStudents: number;
  status: 'en_cours' | 'cloture';
  submissions: HomeworkSubmission[];
}

export interface StudentGradeItem {
  studentId: string;
  matricule: string;
  fullName: string;
  photo?: string;
  interro1?: number; // /20
  interro2?: number; // /20
  devoir?: number; // /20
  composition?: number; // /20
  average: number; // computed
  rank?: number;
  appreciation: string;
}

export interface EvaluationSession {
  id: string;
  title: string;
  classId: string;
  className: string;
  subject: string;
  term: 'Trimestre 1' | 'Trimestre 2' | 'Trimestre 3';
  coefficient: number;
  maxScore: number; // 20
  date: string;
  durationMinutes: number;
  type: 'controle_continu' | 'examen' | 'test' | 'quiz';
  status: 'brouillon' | 'en_cours' | 'soumis_direction' | 'valide';
  isProvisionalPublished: boolean;
  grades: StudentGradeItem[];
}

export interface LogbookEntry {
  id: string;
  classId: string;
  className: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  chapterTitle: string;
  lessonContent: string;
  pedagogicalObjectives: string[];
  observations?: string;
  assignedHomework?: string;
  homeworkDueDate?: string;
  isSigned: boolean;
  signedAt?: string;
  room: string;
  status: 'actif' | 'archive';
}

export interface AttendanceStudentRow {
  studentId: string;
  matricule: string;
  fullName: string;
  photo?: string;
  status: 'present' | 'absent' | 'retard' | 'justifie';
  minutesLate?: number;
  motif?: string;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  className: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  isCompleted: boolean;
  records: AttendanceStudentRow[];
}

export interface StudentPedagogicalProfile {
  studentId: string;
  studentName: string;
  studentMatricule: string;
  className: string;
  photo?: string;
  average: number;
  rank: number;
  attendanceRate: number;
  lateCount: number;
  absenceCount: number;
  isDifficulty: boolean;
  difficultyReason?: string;
  observations: string[];
  recommendations: string[];
  reportedToDirection: boolean;
  parentPhone: string;
  parentName: string;
}

export interface SchoolCalendarEvent {
  id: string;
  title: string;
  type: 'activite' | 'reunion' | 'calendrier' | 'examen';
  date: string;
  time: string;
  location: string;
  description: string;
  teacherRole: string; // e.g. "Encadrement épreuves", "Participant"
}

export interface ScheduleSlot {
  id: string;
  day: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';
  startTime: string;
  endTime: string;
  className: string;
  subject: string;
  room: string;
  color: string;
}

export interface TeacherMessage {
  id: string;
  sender: string;
  recipient: string;
  recipientRole: 'Direction' | 'Parents' | 'Élèves' | 'Collègues';
  subject: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  channel: 'Application' | 'Email' | 'SMS' | 'WhatsApp';
}
