export type StudentNavTab = 
  | 'dashboard' 
  | 'profile' 
  | 'courses' 
  | 'library' 
  | 'homework' 
  | 'grades' 
  | 'report_card' 
  | 'schedule' 
  | 'attendance' 
  | 'events' 
  | 'messages' 
  | 'notifications';

export interface StudentCourseResource {
  id: string;
  subject: string;
  title: string;
  teacherName: string;
  type: 'PDF' | 'Word' | 'PowerPoint' | 'Vidéo' | 'Audio' | 'E-book';
  fileSize: string;
  date: string;
  description: string;
  downloadUrl: string;
}

export interface StudentHomeworkSubmission {
  id: string;
  subject: string;
  title: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  status: 'en_attente' | 'soumis' | 'corrige' | 'en_retard';
  description: string;
  subjectFileUrl?: string;
  submittedFile?: string;
  submittedFileData?: string;
  submittedFileType?: string;
  submittedFileSize?: string;
  submissionDate?: string;
  submissionNote?: string;
  score?: number;
  maxScore: number;
  teacherFeedback?: string;
}

export interface StudentGradeRecord {
  id: string;
  subject: string;
  title: string;
  score: number;
  maxScore: number;
  coefficient: number;
  type: 'Devoir' | 'Interrogation' | 'Composition' | 'Examen';
  date: string;
  classAverage: number;
  comments: string;
}

export interface StudentAttendanceItem {
  id: string;
  date: string;
  period: string; // e.g. 08:00 - 10:00
  subject: string;
  status: 'present' | 'absent' | 'retard';
  justified: boolean;
  reason?: string;
}

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  className: string;
  level: string;
  birthDate: string;
  gender: string;
  photo: string;
  schoolName: string;
  qrCodeToken: string;
  generalAverage: number;
  classRank: number;
  totalStudentsInClass: number;
  parentName: string;
  parentPhone: string;
}
