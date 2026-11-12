import { 
  StudentProfile, 
  StudentCourseResource, 
  StudentHomeworkSubmission, 
  StudentGradeRecord, 
  StudentAttendanceItem 
} from '../types/student';

export const initialStudentProfile: StudentProfile = {
  id: 'stu-001',
  firstName: 'Fatoumata Binta',
  lastName: 'Diallo',
  matricule: 'MAT-2026-TSM-018',
  className: 'Terminale Sciences Mathématiques',
  level: 'Lycée - Année du Baccalauréat',
  birthDate: '14 Mai 2008',
  gender: 'Féminin',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  schoolName: "Lycée d'Excellence de Conakry",
  qrCodeToken: 'SMARTSCHOOL-STUDENT-MAT-2026-TSM-018-SECURE-KEY',
  generalAverage: 16.85,
  classRank: 2,
  totalStudentsInClass: 42,
  parentName: 'Elhadj Amadou Diallo',
  parentPhone: '+224 628 33 44 55'
};

export const initialStudentCourses: StudentCourseResource[] = [
  {
    id: 'res-001',
    subject: 'Mathématiques',
    title: 'Chapitre 4 : Intégrales Multiples et Primitives Complexes',
    teacherName: 'M. Mamadou Lamarana Diallo',
    type: 'PDF',
    fileSize: '4.8 Mo',
    date: '02 Nov 2026',
    description: 'Cours complet théorique, théorèmes fondamentaux et 30 exercices d’application résolus.',
    downloadUrl: '#'
  },
  {
    id: 'res-002',
    subject: 'Physique-Chimie',
    title: 'Chapitre 3 : Mouvement d’une Particule Chargée dans un Champ B',
    teacherName: 'Dr. Sékou Traoré',
    type: 'PowerPoint',
    fileSize: '12.1 Mo',
    date: '31 Oct 2026',
    description: 'Diaporama animé avec trajectoires hélicoïdales et vitesse relativiste.',
    downloadUrl: '#'
  },
  {
    id: 'res-003',
    subject: 'Français & Philosophie',
    title: 'Fiche Méthodologique : La Dissertation Philosophique au Bac',
    teacherName: 'Mme Kadiatou Diallo',
    type: 'PDF',
    fileSize: '1.9 Mo',
    date: '28 Oct 2026',
    description: 'Structure thèse / antithèse / synthèse, exemples de transitions et pièges à éviter.',
    downloadUrl: '#'
  },
  {
    id: 'res-004',
    subject: 'Anglais',
    title: 'Audio Listening : Science, Technology and Ethics in Modern West Africa',
    teacherName: 'Mr. David Soumah',
    type: 'Audio',
    fileSize: '28 Mo',
    date: '25 Oct 2026',
    description: 'Enregistrement de compréhension orale pour la préparation de l’épreuve écrite du Bac.',
    downloadUrl: '#'
  }
];

export const initialStudentHomeworks: StudentHomeworkSubmission[] = [
  {
    id: 'hw-001',
    subject: 'Mathématiques',
    title: 'Devoir Maison N°4 : Équations Différentielles & Intégration par Parties',
    teacherName: 'M. Mamadou Lamarana Diallo',
    assignedDate: '28 Oct 2026',
    dueDate: '06 Nov 2026 (Dans 2 jours)',
    status: 'soumis',
    description: 'Résoudre les problèmes 1 à 4 de la page 84. Démontrer l’unicité de la solution.',
    subjectFileUrl: '#',
    submittedFile: 'Devoir_Maths_DM4_Fatoumata_Diallo.pdf',
    submissionDate: '03 Nov 2026 à 21:14',
    score: undefined,
    maxScore: 20,
    teacherFeedback: 'Copie bien reçue, en cours de correction par M. Diallo.'
  },
  {
    id: 'hw-002',
    subject: 'Physique-Chimie',
    title: 'TP N°2 : Dosage Acido-Basique par pH-métrie & Colorimétrie',
    teacherName: 'Dr. Sékou Traoré',
    assignedDate: '01 Nov 2026',
    dueDate: '08 Nov 2026 (Dans 4 jours)',
    status: 'en_attente',
    description: 'Tracer la courbe de pH en fonction du volume versé et déterminer le point d’équivalence.',
    subjectFileUrl: '#',
    maxScore: 20
  },
  {
    id: 'hw-003',
    subject: 'Philosophie',
    title: 'Dissertation N°1 : La liberté est-elle l’absence de toute contrainte ?',
    teacherName: 'Pr. Lansana Conté',
    assignedDate: '15 Oct 2026',
    dueDate: '25 Oct 2026',
    status: 'corrige',
    description: 'Rédiger une introduction complète avec problématique et plan détaillé.',
    submittedFile: 'Dissertation_Philosophie_Fatoumata.docx',
    submissionDate: '24 Oct 2026',
    score: 16.5,
    maxScore: 20,
    teacherFeedback: 'Excellente analyse conceptuelle. Bonne mobilisation des auteurs (Rousseau, Spinoza).'
  }
];

export const initialStudentGrades: StudentGradeRecord[] = [
  {
    id: 'grd-001',
    subject: 'Mathématiques',
    title: 'Composition Trimestre 1 - Épreuve Complète',
    score: 18.5,
    maxScore: 20,
    coefficient: 5,
    type: 'Composition',
    date: '28 Oct 2026',
    classAverage: 12.4,
    comments: 'Très brillant travail, rigueur irréprochable.'
  },
  {
    id: 'grd-002',
    subject: 'Physique-Chimie',
    title: 'Contrôle Continu : Cinématique & Dynamique Newtonienne',
    score: 17.0,
    maxScore: 20,
    coefficient: 4,
    type: 'Interrogation',
    date: '22 Oct 2026',
    classAverage: 11.8,
    comments: 'Très bon raisonnement sur les équations horaires.'
  },
  {
    id: 'grd-003',
    subject: 'Philosophie',
    title: 'Dissertation N°1 : Liberté et Nécessité',
    score: 16.5,
    maxScore: 20,
    coefficient: 3,
    type: 'Devoir',
    date: '25 Oct 2026',
    classAverage: 10.9,
    comments: 'Style élégant, références philosophiques bien exploitées.'
  },
  {
    id: 'grd-004',
    subject: 'Français',
    title: 'Commentaire Composé : Poésie Négro-Africaine',
    score: 15.5,
    maxScore: 20,
    coefficient: 2,
    type: 'Devoir',
    date: '18 Oct 2026',
    classAverage: 11.2,
    comments: 'Bonne sensibilité stylistique.'
  },
  {
    id: 'grd-005',
    subject: 'Anglais',
    title: 'Reading Comprehension & Essay Writing',
    score: 17.5,
    maxScore: 20,
    coefficient: 2,
    type: 'Interrogation',
    date: '14 Oct 2026',
    classAverage: 13.1,
    comments: 'Fluent writing and rich vocabulary.'
  },
  {
    id: 'grd-006',
    subject: 'Histoire-Géographie',
    title: 'Contrôle : Les mutations socio-économiques de l’Afrique',
    score: 15.0,
    maxScore: 20,
    coefficient: 2,
    type: 'Devoir',
    date: '10 Oct 2026',
    classAverage: 10.5,
    comments: 'Cartographie soignée et connaissances solides.'
  }
];

export const initialStudentAttendance: StudentAttendanceItem[] = [
  {
    id: 'att-001',
    date: '2026-10-24',
    period: '08:00 - 10:00',
    subject: 'Mathématiques',
    status: 'retard',
    justified: true,
    reason: 'Embouteillages majeurs axe autoroute Hamdallaye - Kaloum (Billet de rentrée validé)'
  },
  {
    id: 'att-002',
    date: '2026-10-18',
    period: '14:00 - 16:00',
    subject: 'Éducation Civique',
    status: 'absent',
    justified: true,
    reason: 'Rendez-vous médical dentaire justifié avec certificat présenté au secrétariat'
  },
  {
    id: 'att-003',
    date: '2026-11-03',
    period: '08:00 - 12:00',
    subject: 'Mathématiques & Physique',
    status: 'present',
    justified: true
  }
];
