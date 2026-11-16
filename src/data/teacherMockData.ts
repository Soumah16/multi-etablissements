import { 
  TeacherProfile, 
  AssignedClass, 
  TeacherStudentRosterItem,
  TeacherSubject,
  CourseModuleItem,
  PedagogicalResource,
  HomeworkItem,
  EvaluationSession, 
  LogbookEntry, 
  AttendanceSession, 
  StudentPedagogicalProfile,
  SchoolCalendarEvent,
  ScheduleSlot, 
  TeacherMessage 
} from '../types/teacher';

export const initialTeacherProfile: TeacherProfile = {
  id: 'teacher-001',
  matricule: 'ENS-GN-2026-042',
  firstName: 'Mamadou Lamarana',
  lastName: 'Diallo',
  gender: 'M',
  email: 'm.lamarana.diallo@smartschool.gn',
  phone: '+224 622 34 56 78',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  address: 'Quartier Kipé, Commune de Ratoma, Conakry, Guinée',
  diploma: 'Master 2 Didactique des Mathématiques & Physique (ISSEG Maneah)',
  mainSubject: 'Mathématiques',
  department: 'Département des Sciences Exactes',
  subjects: ['Mathématiques', 'Sciences Physiques'],
  schoolName: 'Lycée d\'Excellence de Conakry',
  schoolId: 'school-001',
  isMainTeacherOf: 'Terminale Sciences Mathématiques (TSM)',
  weeklyHours: 18,
  hireDate: '2019-10-01',
  status: 'active',
  twoFactorEnabled: true
};

export const initialTeacherStudents: TeacherStudentRosterItem[] = [
  // === Terminale Sciences Mathématiques (TSM) - 14 élèves ===
  { id: 'std-001', matricule: 'LEC-2026-001', firstName: 'Mamadou Alpha', lastName: 'Diallo', fullName: 'Mamadou Alpha Diallo', gender: 'M', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 18.4, attendanceRate: 98.5, absenceCount: 0, lateCount: 0, parentName: 'M. Thierno Diallo', parentPhone: '+224 621 11 22 33', bloodGroup: 'O+', medicalNote: 'Aucune contre-indication', observation: 'Délégué de classe, excellent niveau analytique.', status: 'actif' },
  { id: 'std-002', matricule: 'LEC-2026-002', firstName: 'Fatoumata Binta', lastName: 'Bah', fullName: 'Fatoumata Binta Bah', gender: 'F', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 17.1, attendanceRate: 96.0, absenceCount: 1, lateCount: 0, parentName: 'Mme Aissatou Bah', parentPhone: '+224 622 44 55 66', bloodGroup: 'A+', medicalNote: 'Asthme modéré (Ventoline)', observation: 'Très rigoureuse et proactive en cours.', status: 'actif' },
  { id: 'std-003', matricule: 'LEC-2026-003', firstName: 'Ibrahima Sory', lastName: 'Bangoura', fullName: 'Ibrahima Sory Bangoura', gender: 'M', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 15.1, attendanceRate: 94.0, absenceCount: 1, lateCount: 2, parentName: 'M. Sékou Bangoura', parentPhone: '+224 628 77 88 99', bloodGroup: 'B+', medicalNote: 'RAS', observation: 'Bon potentiel en mathématiques et physique.', status: 'actif' },
  { id: 'std-004', matricule: 'LEC-2026-004', firstName: 'Mariama', lastName: 'Camara', fullName: 'Mariama Camara', gender: 'F', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 13.4, attendanceRate: 91.0, absenceCount: 2, lateCount: 1, parentName: 'Dr. Lansana Camara', parentPhone: '+224 620 99 00 11', bloodGroup: 'O-', medicalNote: 'Allergie pénicilline', observation: 'En nette progression sur la géométrie dans l\'espace.', status: 'actif' },
  { id: 'std-005', matricule: 'LEC-2026-005', firstName: 'Ousmane', lastName: 'Barry', fullName: 'Ousmane Barry', gender: 'M', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 10.4, attendanceRate: 83.5, absenceCount: 3, lateCount: 4, parentName: 'M. Amadou Barry', parentPhone: '+224 624 33 22 11', bloodGroup: 'AB+', medicalNote: 'RAS', observation: 'Soutien pédagogique recommandé en analyse numérique.', status: 'suivi' },
  { id: 'std-006', matricule: 'LEC-2026-006', firstName: 'Kadiatou', lastName: 'Touré', fullName: 'Kadiatou Touré', gender: 'F', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 16.2, attendanceRate: 98.0, absenceCount: 0, lateCount: 1, parentName: 'M. Oumar Touré', parentPhone: '+224 664 99 88 77', bloodGroup: 'A+', medicalNote: 'RAS', observation: 'Très appliquée en travaux dirigés.', status: 'actif' },
  { id: 'std-007', matricule: 'LEC-2026-007', firstName: 'Abdoulaye', lastName: 'Condé', fullName: 'Abdoulaye Condé', gender: 'M', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 14.5, attendanceRate: 95.5, absenceCount: 1, lateCount: 0, parentName: 'M. Moussa Condé', parentPhone: '+224 622 55 44 33', bloodGroup: 'O+', medicalNote: 'RAS', observation: 'Bonne participation orale.', status: 'actif' },
  { id: 'std-008', matricule: 'LEC-2026-008', firstName: 'Hawa', lastName: 'Keita', fullName: 'Hawa Keita', gender: 'F', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 13.8, attendanceRate: 97.0, absenceCount: 1, lateCount: 0, parentName: 'Mme Aminata Keita', parentPhone: '+224 621 88 77 66', bloodGroup: 'B+', medicalNote: 'RAS', observation: 'Régulière et sérieuse dans ses devoirs.', status: 'actif' },
  { id: 'std-009', matricule: 'LEC-2026-009', firstName: 'Thierno Sadou', lastName: 'Diallo', fullName: 'Thierno Sadou Diallo', gender: 'M', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 12.9, attendanceRate: 93.0, absenceCount: 2, lateCount: 1, parentName: 'M. Boubacar Diallo', parentPhone: '+224 628 12 34 56', bloodGroup: 'O+', medicalNote: 'RAS', observation: 'Doit renforcer la rapidité en calcul matriciel.', status: 'actif' },
  { id: 'std-010t', matricule: 'LEC-2026-010', firstName: 'Nafissatou', lastName: 'Sylla', fullName: 'Nafissatou Sylla', gender: 'F', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 15.7, attendanceRate: 99.0, absenceCount: 0, lateCount: 0, parentName: 'M. Aly Sylla', parentPhone: '+224 623 45 67 89', bloodGroup: 'A-', medicalNote: 'RAS', observation: 'Excellente maîtrise des nombres complexes.', status: 'actif' },
  { id: 'std-011t', matricule: 'LEC-2026-011', firstName: 'Mohamed Lamine', lastName: 'Sylla', fullName: 'Mohamed Lamine Sylla', gender: 'M', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 14.0, attendanceRate: 96.5, absenceCount: 0, lateCount: 1, parentName: 'M. Ibrahima Sylla', parentPhone: '+224 625 90 12 34', bloodGroup: 'O+', medicalNote: 'RAS', observation: 'Nouvel élève transféré, bonne intégration.', status: 'actif' },
  { id: 'std-012t', matricule: 'LEC-2026-012', firstName: 'Djenabou', lastName: 'Baldé', fullName: 'Djenabou Baldé', gender: 'F', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 11.8, attendanceRate: 92.0, absenceCount: 2, lateCount: 1, parentName: 'Mme Mariama Baldé', parentPhone: '+224 627 33 44 55', bloodGroup: 'B-', medicalNote: 'RAS', observation: 'Progrès réguliers, poursuivre les exercices CIAM.', status: 'actif' },
  { id: 'std-013t', matricule: 'LEC-2026-013', firstName: 'Alpha Oumar', lastName: 'Kouyaté', fullName: 'Alpha Oumar Kouyaté', gender: 'M', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 14.9, attendanceRate: 97.5, absenceCount: 0, lateCount: 1, parentName: 'M. Djibril Kouyaté', parentPhone: '+224 620 11 99 88', bloodGroup: 'O+', medicalNote: 'RAS', observation: 'Très bon esprit de synthèse en physique.', status: 'actif' },
  { id: 'std-014t', matricule: 'LEC-2026-014', firstName: 'Salimatou', lastName: 'Souaré', fullName: 'Salimatou Souaré', gender: 'F', classId: 'cls-tsm', className: 'Terminale Sciences Mathématiques (TSM)', average: 15.3, attendanceRate: 98.0, absenceCount: 0, lateCount: 0, parentName: 'M. Mamadou Souaré', parentPhone: '+224 624 66 77 88', bloodGroup: 'A+', medicalNote: 'RAS', observation: 'Travail très soigné et régulier.', status: 'actif' },

  // === 1ère Sciences Expérimentales (1SE) - 12 élèves ===
  { id: 'std-010', matricule: 'LEC-2026-101', firstName: 'Aissatou', lastName: 'Sow', fullName: 'Aissatou Sow', gender: 'F', classId: 'cls-1se', className: '1ère Sciences Expérimentales (1SE)', average: 15.4, attendanceRate: 97.5, absenceCount: 0, lateCount: 1, parentName: 'M. Alpha Sow', parentPhone: '+224 622 33 44 55', bloodGroup: 'O+', medicalNote: 'RAS', observation: 'Très bon investissement en Mathématiques.', status: 'actif' },
  { id: 'std-011', matricule: 'LEC-2026-102', firstName: 'Cherif', lastName: 'Haidara', fullName: 'Cherif Haidara', gender: 'M', classId: 'cls-1se', className: '1ère Sciences Expérimentales (1SE)', average: 12.7, attendanceRate: 94.0, absenceCount: 1, lateCount: 1, parentName: 'M. Cheick Haidara', parentPhone: '+224 621 22 33 44', bloodGroup: 'A+', medicalNote: 'RAS', observation: 'Travail régulier, consolider la dérivation.', status: 'actif' },
  { id: 'std-012', matricule: 'LEC-2026-103', firstName: 'Fatoumata Binta', lastName: 'Camara', fullName: 'Fatoumata Binta Camara', gender: 'F', classId: 'cls-1se', className: '1ère Sciences Expérimentales (1SE)', average: 16.5, attendanceRate: 99.0, absenceCount: 0, lateCount: 0, parentName: 'Mme Hadja Camara', parentPhone: '+224 628 55 66 77', bloodGroup: 'B+', medicalNote: 'RAS', observation: 'Déléguée de classe exemplaire.', status: 'actif' },
  { id: 'std-013', matricule: 'LEC-2026-104', firstName: 'Mamadou Bobo', lastName: 'Diallo', fullName: 'Mamadou Bobo Diallo', gender: 'M', classId: 'cls-1se', className: '1ère Sciences Expérimentales (1SE)', average: 13.9, attendanceRate: 95.0, absenceCount: 1, lateCount: 0, parentName: 'M. Ousmane Diallo', parentPhone: '+224 623 11 22 33', bloodGroup: 'O+', medicalNote: 'RAS', observation: 'Bonne compréhension des fonctions rationnelles.', status: 'actif' },
  { id: 'std-014', matricule: 'LEC-2026-105', firstName: 'Bintou', lastName: 'Kourouma', fullName: 'Bintou Kourouma', gender: 'F', classId: 'cls-1se', className: '1ère Sciences Expérimentales (1SE)', average: 11.4, attendanceRate: 91.5, absenceCount: 2, lateCount: 1, parentName: 'M. Lansana Kourouma', parentPhone: '+224 624 77 88 99', bloodGroup: 'AB+', medicalNote: 'RAS', observation: 'Participation timide, à encourager.', status: 'actif' },
  { id: 'std-015', matricule: 'LEC-2026-106', firstName: 'Alseny', lastName: 'Fofana', fullName: 'Alseny Fofana', gender: 'M', classId: 'cls-1se', className: '1ère Sciences Expérimentales (1SE)', average: 14.2, attendanceRate: 96.0, absenceCount: 1, lateCount: 0, parentName: 'M. Morlaye Fofana', parentPhone: '+224 626 44 55 66', bloodGroup: 'O-', medicalNote: 'RAS', observation: 'Rigoureux dans les exercices d\'application.', status: 'actif' },
  { id: 'std-016', matricule: 'LEC-2026-107', firstName: 'Ramatoulaye', lastName: 'Diallo', fullName: 'Ramatoulaye Diallo', gender: 'F', classId: 'cls-1se', className: '1ère Sciences Expérimentales (1SE)', average: 14.8, attendanceRate: 98.0, absenceCount: 0, lateCount: 0, parentName: 'Mme Kadiatou Diallo', parentPhone: '+224 625 11 44 77', bloodGroup: 'A+', medicalNote: 'RAS', observation: 'Très appliquée en travaux dirigés.', status: 'actif' },
  { id: 'std-017', matricule: 'LEC-2026-108', firstName: 'Souleymane', lastName: 'Sacko', fullName: 'Souleymane Sacko', gender: 'M', classId: 'cls-1se', className: '1ère Sciences Expérimentales (1SE)', average: 9.8, attendanceRate: 84.0, absenceCount: 3, lateCount: 3, parentName: 'M. Karamo Sacko', parentPhone: '+224 629 22 11 00', bloodGroup: 'B+', medicalNote: 'RAS', observation: 'Baisse en algèbre, tutorat conseillé.', status: 'suivi' },
  { id: 'std-018', matricule: 'LEC-2026-109', firstName: 'Maimouna', lastName: 'Bah', fullName: 'Maimouna Bah', gender: 'F', classId: 'cls-1se', className: '1ère Sciences Expérimentales (1SE)', average: 13.5, attendanceRate: 95.5, absenceCount: 1, lateCount: 0, parentName: 'M. Mamadou Bah', parentPhone: '+224 622 99 00 11', bloodGroup: 'O+', medicalNote: 'RAS', observation: 'Résultats homogènes et sérieux.', status: 'actif' },
  { id: 'std-019', matricule: 'LEC-2026-110', firstName: 'Aboubacar Sidiki', lastName: 'Cissé', fullName: 'Aboubacar Sidiki Cissé', gender: 'M', classId: 'cls-1se', className: '1ère Sciences Expérimentales (1SE)', average: 12.1, attendanceRate: 92.5, absenceCount: 1, lateCount: 2, parentName: 'M. Ibrahim Cissé', parentPhone: '+224 621 55 33 22', bloodGroup: 'A-', medicalNote: 'RAS', observation: 'Peut mieux faire en soignant ses brouillons.', status: 'actif' },
  { id: 'std-020', matricule: 'LEC-2026-111', firstName: 'Oumou', lastName: 'Diakité', fullName: 'Oumou Diakité', gender: 'F', classId: 'cls-1se', className: '1ère Sciences Expérimentales (1SE)', average: 15.1, attendanceRate: 97.0, absenceCount: 0, lateCount: 1, parentName: 'Mme Fatou Diakité', parentPhone: '+224 627 88 99 00', bloodGroup: 'O+', medicalNote: 'RAS', observation: 'Très vive d\'esprit en trigonométrie.', status: 'actif' },
  { id: 'std-021', matricule: 'LEC-2026-112', firstName: 'Lansana', lastName: 'Bangoura', fullName: 'Lansana Bangoura', gender: 'M', classId: 'cls-1se', className: '1ère Sciences Expérimentales (1SE)', average: 11.9, attendanceRate: 93.0, absenceCount: 1, lateCount: 1, parentName: 'M. Aboubacar Bangoura', parentPhone: '+224 624 12 45 78', bloodGroup: 'B-', medicalNote: 'RAS', observation: 'Progrès encourageants depuis octobre.', status: 'actif' },

  // === 10ème Année A (Brevet BEPC) - 12 élèves ===
  { id: 'std-030', matricule: 'LEC-2026-301', firstName: 'Ibrahima Sory', lastName: 'Soumah', fullName: 'Ibrahima Sory Soumah', gender: 'M', classId: 'cls-10a', className: '10ème Année A (Brevet BEPC)', average: 15.8, attendanceRate: 98.5, absenceCount: 0, lateCount: 0, parentName: 'M. Saïd Soumah', parentPhone: '+224 625 12 34 56', bloodGroup: 'O+', medicalNote: 'RAS', observation: 'Délégué de classe, excellent niveau en géométrie.', status: 'actif' },
  { id: 'std-031', matricule: 'LEC-2026-302', firstName: 'Mohamed Lamine', lastName: 'Soumah', fullName: 'Mohamed Lamine Soumah', gender: 'M', classId: 'cls-10a', className: '10ème Année A (Brevet BEPC)', average: 14.3, attendanceRate: 96.0, absenceCount: 0, lateCount: 1, parentName: 'M. Alseny Soumah', parentPhone: '+224 625 12 34 56', bloodGroup: 'O-', medicalNote: 'RAS', observation: 'Très assidu dans la préparation du BEPC.', status: 'actif' },
  { id: 'std-032', matricule: 'LEC-2026-303', firstName: 'Aissatou', lastName: 'Camara', fullName: 'Aissatou Camara', gender: 'F', classId: 'cls-10a', className: '10ème Année A (Brevet BEPC)', average: 13.7, attendanceRate: 95.0, absenceCount: 1, lateCount: 0, parentName: 'Mme Mariama Camara', parentPhone: '+224 622 66 55 44', bloodGroup: 'A+', medicalNote: 'RAS', observation: 'Bonne maîtrise du théorème de Thalès.', status: 'actif' },
  { id: 'std-033', matricule: 'LEC-2026-304', firstName: 'Sékou', lastName: 'Doumbouya', fullName: 'Sékou Doumbouya', gender: 'M', classId: 'cls-10a', className: '10ème Année A (Brevet BEPC)', average: 11.5, attendanceRate: 90.0, absenceCount: 2, lateCount: 2, parentName: 'M. Mamady Doumbouya', parentPhone: '+224 621 77 66 55', bloodGroup: 'B+', medicalNote: 'RAS', observation: 'Doit relire attentivement les énoncés.', status: 'actif' },
  { id: 'std-034', matricule: 'LEC-2026-305', firstName: 'Kadiatou', lastName: 'Diallo', fullName: 'Kadiatou Diallo', gender: 'F', classId: 'cls-10a', className: '10ème Année A (Brevet BEPC)', average: 14.9, attendanceRate: 97.5, absenceCount: 0, lateCount: 0, parentName: 'M. Abdoulaye Diallo', parentPhone: '+224 623 99 88 77', bloodGroup: 'O+', medicalNote: 'RAS', observation: 'Cahiers impeccables, élève sérieuse.', status: 'actif' },
  { id: 'std-035', matricule: 'LEC-2026-306', firstName: 'Fodé', lastName: 'Bangoura', fullName: 'Fodé Bangoura', gender: 'M', classId: 'cls-10a', className: '10ème Année A (Brevet BEPC)', average: 12.2, attendanceRate: 93.0, absenceCount: 1, lateCount: 1, parentName: 'M. Naby Bangoura', parentPhone: '+224 628 33 11 22', bloodGroup: 'A+', medicalNote: 'RAS', observation: 'Bon calcul littéral, géométrie à consolider.', status: 'actif' },
  { id: 'std-036', matricule: 'LEC-2026-307', firstName: 'Mariama Cire', lastName: 'Bah', fullName: 'Mariama Cire Bah', gender: 'F', classId: 'cls-10a', className: '10ème Année A (Brevet BEPC)', average: 13.1, attendanceRate: 94.5, absenceCount: 1, lateCount: 0, parentName: 'Mme Fatoumata Bah', parentPhone: '+224 624 55 66 00', bloodGroup: 'O+', medicalNote: 'RAS', observation: 'Participe activement aux exercices au tableau.', status: 'actif' },
  { id: 'std-037', matricule: 'LEC-2026-308', firstName: 'Moussa', lastName: 'Kaba', fullName: 'Moussa Kaba', gender: 'M', classId: 'cls-10a', className: '10ème Année A (Brevet BEPC)', average: 9.4, attendanceRate: 83.0, absenceCount: 3, lateCount: 2, parentName: 'M. Lamine Kaba', parentPhone: '+224 627 11 00 99', bloodGroup: 'B+', medicalNote: 'RAS', observation: 'Difficultés sur les équations du 1er degré, soutien activé.', status: 'suivi' },
  { id: 'std-038', matricule: 'LEC-2026-309', firstName: 'Saran', lastName: 'Keita', fullName: 'Saran Keita', gender: 'F', classId: 'cls-10a', className: '10ème Année A (Brevet BEPC)', average: 12.8, attendanceRate: 95.0, absenceCount: 1, lateCount: 0, parentName: 'M. Famoro Keita', parentPhone: '+224 629 44 33 22', bloodGroup: 'O+', medicalNote: 'RAS', observation: 'Bonne progression ce mois-ci.', status: 'actif' },
  { id: 'std-039', matricule: 'LEC-2026-310', firstName: 'Amadou Tidiane', lastName: 'Barry', fullName: 'Amadou Tidiane Barry', gender: 'M', classId: 'cls-10a', className: '10ème Année A (Brevet BEPC)', average: 11.9, attendanceRate: 92.0, absenceCount: 1, lateCount: 1, parentName: 'M. Yéro Barry', parentPhone: '+224 620 77 55 33', bloodGroup: 'A-', medicalNote: 'RAS', observation: 'Attentif en classe, doit rendre ses DM à temps.', status: 'actif' },
  { id: 'std-040', matricule: 'LEC-2026-311', firstName: 'Hadja', lastName: 'Condé', fullName: 'Hadja Condé', gender: 'F', classId: 'cls-10a', className: '10ème Année A (Brevet BEPC)', average: 14.0, attendanceRate: 96.5, absenceCount: 0, lateCount: 1, parentName: 'Mme Binta Condé', parentPhone: '+224 622 10 20 30', bloodGroup: 'O+', medicalNote: 'RAS', observation: 'Très régulière et motivée pour le BEPC.', status: 'actif' },
  { id: 'std-041', matricule: 'LEC-2026-312', firstName: 'Naby', lastName: 'Touré', fullName: 'Naby Touré', gender: 'M', classId: 'cls-10a', className: '10ème Année A (Brevet BEPC)', average: 10.7, attendanceRate: 89.5, absenceCount: 2, lateCount: 1, parentName: 'M. Sory Touré', parentPhone: '+224 626 88 77 66', bloodGroup: 'AB+', medicalNote: 'RAS', observation: 'Résultats en hausse, encourager la révision des formules.', status: 'actif' }
];

export const initialTeacherClasses: AssignedClass[] = [
  {
    id: 'cls-tsm',
    name: 'Terminale Sciences Mathématiques (TSM)',
    level: 'Terminale',
    room: 'Salle 102 - Bâtiment Scientifique',
    studentsCount: 14,
    isMainTeacher: true,
    classDelegate: 'Mamadou Alpha Diallo',
    averageGrade: 14.85,
    attendanceRate: 95.4
  },
  {
    id: 'cls-1se',
    name: '1ère Sciences Expérimentales (1SE)',
    level: '1ère',
    room: 'Salle 104 - Labo Physique',
    studentsCount: 12,
    isMainTeacher: false,
    classDelegate: 'Fatoumata Binta Camara',
    averageGrade: 13.20,
    attendanceRate: 94.8
  },
  {
    id: 'cls-10a',
    name: '10ème Année A (Brevet BEPC)',
    level: '10ème Année',
    room: 'Salle 201 - Bâtiment Collège',
    studentsCount: 12,
    isMainTeacher: false,
    classDelegate: 'Ibrahima Sory Soumah',
    averageGrade: 12.65,
    attendanceRate: 92.8
  }
];

export const initialTeacherSubjects: TeacherSubject[] = [
  {
    id: 'subj-math-tsm',
    name: 'Mathématiques',
    coefficient: 5,
    level: 'Terminale',
    classNames: ['Terminale Sciences Mathématiques (TSM)'],
    progressionPercent: 68,
    chaptersCount: 12,
    hoursCompleted: 54,
    hoursTotal: 80,
    officialSyllabusSummary: 'Programme national MEPU-A & CIAM Terminale SM : Analyse, Nombres Complexes, Calcul Intégral, Suites Numériques, Probabilités, Géométrie dans l\'espace.'
  },
  {
    id: 'subj-sp-tsm',
    name: 'Sciences Physiques',
    coefficient: 4,
    level: 'Terminale',
    classNames: ['Terminale Sciences Mathématiques (TSM)'],
    progressionPercent: 62,
    chaptersCount: 10,
    hoursCompleted: 44,
    hoursTotal: 70,
    officialSyllabusSummary: 'Programme MEPU-A Bac SM : Cinématique, Lois de Newton, Électromagnétisme, Optique ondulatoire, Réactions acide-base et cinétique chimique.'
  },
  {
    id: 'subj-math-1se',
    name: 'Mathématiques',
    coefficient: 4,
    level: '1ère',
    classNames: ['1ère Sciences Expérimentales (1SE)'],
    progressionPercent: 60,
    chaptersCount: 10,
    hoursCompleted: 42,
    hoursTotal: 70,
    officialSyllabusSummary: 'Programme MEPU-A 1ère SE : Polynômes, Dérivation, Limites, Statistiques, Trigonométrie, Produit scalaire.'
  },
  {
    id: 'subj-math-10a',
    name: 'Mathématiques',
    coefficient: 3,
    level: '10ème Année',
    classNames: ['10ème Année A (Brevet BEPC)'],
    progressionPercent: 72,
    chaptersCount: 8,
    hoursCompleted: 48,
    hoursTotal: 65,
    officialSyllabusSummary: 'Programme officiel du Brevet (BEPC Guinée) : Calcul algébrique, Théorème de Pythagore & Thalès, Équations et Inéquations, Statistiques descriptives.'
  }
];

export const initialCourses: CourseModuleItem[] = [
  {
    id: 'crs-001',
    title: 'Analyse Avancée : Suites Numériques & Limites Finies',
    chapterTitle: 'Chapitre 3 : Suites Récurrentes & Convergence Bornée',
    moduleName: 'Module 1 : Analyse Fonctionnelle & Suites',
    classId: 'cls-tsm',
    className: 'Terminale Sciences Mathématiques (TSM)',
    subject: 'Mathématiques',
    description: 'Étude rigoureuse des suites arithmétiques, géométriques et des suites récurrentes u_{n+1} = f(u_n). Démonstrations par récurrence double et convergence des suites monotones.',
    objectives: [
      'Maîtriser le principe de récurrence forte et les encadrements de suites',
      'Calculer des limites indéterminées à l\'aide du théorème d\'encadrement des gendarmes',
      'Étudier les points fixes et le comportement asymptotique'
    ],
    resources: [
      {
        name: 'Polycopié_Cours_Suites_TSM.pdf',
        type: 'pdf',
        url: 'https://smartschool.gn/docs/cours-suites-tsm.pdf',
        size: '2.4 MB'
      },
      {
        name: 'Diapositives_Synthese_Chapitre3.pptx',
        type: 'pptx',
        url: 'https://smartschool.gn/docs/diapo-suites.pptx',
        size: '4.8 MB'
      },
      {
        name: 'Capsule_Video_Demonstration_Gendarmes.mp4',
        type: 'video',
        url: 'https://smartschool.gn/media/video-gendarmes.mp4',
        size: '18.5 MB'
      }
    ],
    publishedDate: '2026-10-18',
    isPublished: true
  },
  {
    id: 'crs-002',
    title: 'Nombres Complexes & Géométrie dans le Plan Complexe',
    chapterTitle: 'Chapitre 2 : Forme Trigonométrique et Exponentielle',
    moduleName: 'Module 2 : Algèbre & Géométrie Vectorielle',
    classId: 'cls-tsm',
    className: 'Terminale Sciences Mathématiques (TSM)',
    subject: 'Mathématiques',
    description: 'Représentation géométrique d\'un nombre complexe, module et argument, formules de Moivre et d\'Euler. Applications directes aux rotations et homothéties.',
    objectives: [
      'Calculer l\'affixe d\'un vecteur et l\'angle entre deux droites',
      'Déterminer des lieux géométriques dans le plan d\'Argand-Cauchy',
      'Résoudre des équations de degré 3 et 4 dans C'
    ],
    resources: [
      {
        name: 'Cours_Complet_Complexes_CIAM.pdf',
        type: 'pdf',
        url: 'https://smartschool.gn/docs/complexes-ciam.pdf',
        size: '3.1 MB'
      },
      {
        name: 'Fiche_TD_Applications_Geometriques.docx',
        type: 'docx',
        url: 'https://smartschool.gn/docs/td-complexes.docx',
        size: '850 KB'
      }
    ],
    publishedDate: '2026-10-05',
    isPublished: true
  },
  {
    id: 'crs-003',
    title: 'Dérivation et Extrema Locaux des Fonctions Rationnelles',
    chapterTitle: 'Chapitre 4 : Calcul Différentiel Élémentaire',
    moduleName: 'Module 1 : Fonctions & Analyse',
    classId: 'cls-1se',
    className: '1ère Sciences Expérimentales (1SE)',
    subject: 'Mathématiques',
    description: 'Règles opératoires de la dérivation des fonctions polynômes et quotients. Étude du signe de f\'(x) et tableau de variation avec recherche d\'asymptotes.',
    objectives: [
      'Calculer les dérivées usuelles et composées',
      'Interpréter géométriquement la pente de la tangente en un point'
    ],
    resources: [
      {
        name: 'Support_Cours_Derivation_1SE.pdf',
        type: 'pdf',
        url: 'https://smartschool.gn/docs/derivation-1se.pdf',
        size: '1.9 MB'
      }
    ],
    publishedDate: '2026-10-22',
    isPublished: true
  }
];

export const initialLibraryResources: PedagogicalResource[] = [
  {
    id: 'lib-001',
    title: 'Manuel Officiel CIAM - Mathématiques Terminale SM (MEPU-A)',
    type: 'ebook',
    subject: 'Mathématiques',
    level: 'Terminale',
    className: 'Terminale Sciences Mathématiques (TSM)',
    fileUrl: 'https://smartschool.gn/biblio/ciam-terminale-sm.pdf',
    size: '14.2 MB',
    downloadCount: 142,
    uploadedAt: '2026-09-15',
    description: 'Manuel scolaire de référence officiel pour les lycées de la République de Guinée, conforme aux programmes interafricains.'
  },
  {
    id: 'lib-002',
    title: 'Recueil des 100 Problèmes de Synthèse du Baccalauréat Guinéen (2015-2025)',
    type: 'pdf',
    subject: 'Mathématiques',
    level: 'Terminale',
    className: 'Terminale Sciences Mathématiques (TSM)',
    fileUrl: 'https://smartschool.gn/biblio/annales-bac-guinee-maths.pdf',
    size: '8.6 MB',
    downloadCount: 295,
    uploadedAt: '2026-09-20',
    description: 'Annales officielles corrigées avec barèmes détaillés et commentaires méthodologiques pour les candidats au Baccalauréat Unique.'
  },
  {
    id: 'lib-003',
    title: 'Fascicule de Travaux Pratiques : Mécanique & Cinématique du Point',
    type: 'tp',
    subject: 'Sciences Physiques',
    level: 'Terminale',
    className: 'Terminale Sciences Mathématiques (TSM)',
    fileUrl: 'https://smartschool.gn/biblio/tp-mecanique-labo.pdf',
    size: '4.1 MB',
    downloadCount: 88,
    uploadedAt: '2026-10-02',
    description: 'Protocoles expérimentaux pour les séances au Laboratoire Scientifique (chute libre, pendule simple, frottements).'
  },
  {
    id: 'lib-004',
    title: 'Corrigé Type Officiel : Devoir Surveillé N°1 Nombres Complexes',
    type: 'corrige',
    subject: 'Mathématiques',
    level: 'Terminale',
    className: 'Terminale Sciences Mathématiques (TSM)',
    fileUrl: 'https://smartschool.gn/biblio/corrige-ds1-complexes.pdf',
    size: '1.2 MB',
    downloadCount: 76,
    uploadedAt: '2026-10-28',
    description: 'Corrigé intégral commenté avec critères de notation point par point distribué aux élèves après l\'épreuve.'
  },
  {
    id: 'lib-005',
    title: 'Podcast Pédagogique : Réussir l\'épreuve de Mathématiques au BEPC',
    type: 'audio',
    subject: 'Mathématiques',
    level: '10ème Année',
    className: '10ème Année A (Brevet BEPC)',
    fileUrl: 'https://smartschool.gn/biblio/podcast-conseils-bepc.mp3',
    size: '12.4 MB',
    downloadCount: 110,
    uploadedAt: '2026-10-12',
    description: 'Enregistrement audio explicatif dispensant les astuces de rédaction et la gestion du temps pour les élèves de 10ème.'
  }
];

export const initialHomeworkList: HomeworkItem[] = [
  {
    id: 'hw-001',
    classId: 'cls-tsm',
    className: 'Terminale Sciences Mathématiques (TSM)',
    subject: 'Mathématiques',
    title: 'DM N°2 : Étude des suites récurrentes et intégrales',
    description: 'Devoir maison sur feuille double ou fichier PDF numérisé. Résolution complète des exercices 42 et 45 page 118 du manuel CIAM. Rigueur de la démonstration par récurrence requise.',
    givenDate: '2026-11-01',
    dueDate: '2026-11-06',
    maxScore: 20,
    totalSubmissions: 31,
    evaluatedCount: 18,
    totalStudents: 38,
    status: 'en_cours',
    submissions: [
      {
        id: 'sub-001',
        homeworkId: 'hw-001',
        studentId: 'std-001',
        studentName: 'Mamadou Alpha Diallo',
        studentMatricule: 'LEC-2026-001',
        submittedAt: '2026-11-04 18:20',
        fileName: 'Copie_DM2_Diallo_Mamadou_Alpha.pdf',
        fileUrl: 'https://smartschool.gn/devoirs/dm2-std001.pdf',
        fileType: 'pdf',
        grade: 19,
        maxScore: 20,
        teacherComment: 'Excellente rédaction, raisonnement par récurrence impeccable.',
        status: 'corrige'
      },
      {
        id: 'sub-002',
        homeworkId: 'hw-001',
        studentId: 'std-002',
        studentName: 'Fatoumata Binta Bah',
        studentMatricule: 'LEC-2026-002',
        submittedAt: '2026-11-04 20:15',
        fileName: 'Devoir2_Fatoumata_Binta.pdf',
        fileUrl: 'https://smartschool.gn/devoirs/dm2-std002.pdf',
        fileType: 'pdf',
        grade: 18,
        maxScore: 20,
        teacherComment: 'Très bonne copie, soigner le tracé des courbes limites.',
        status: 'corrige'
      },
      {
        id: 'sub-003',
        homeworkId: 'hw-001',
        studentId: 'std-005',
        studentName: 'Ousmane Barry',
        studentMatricule: 'LEC-2026-005',
        submittedAt: '2026-11-05 09:30',
        fileName: 'DM_Suites_Barry_Ousmane.pdf',
        fileUrl: 'https://smartschool.gn/devoirs/dm2-std005.pdf',
        fileType: 'pdf',
        grade: 11,
        maxScore: 20,
        teacherComment: 'Attention aux erreurs de signe à l\'étape d\'hérédité. Reprendre l\'exercice 42.',
        status: 'corrige'
      },
      {
        id: 'sub-004',
        homeworkId: 'hw-001',
        studentId: 'std-004',
        studentName: 'Mariama Camara',
        studentMatricule: 'LEC-2026-004',
        submittedAt: '2026-11-05 14:45',
        fileName: 'Devoir_Maison_Mariama.pdf',
        fileUrl: 'https://smartschool.gn/devoirs/dm2-std004.pdf',
        fileType: 'pdf',
        maxScore: 20,
        status: 'rendu'
      }
    ]
  },
  {
    id: 'hw-002',
    classId: 'cls-1se',
    className: '1ère Sciences Expérimentales (1SE)',
    subject: 'Mathématiques',
    title: 'Exercices d\'entraînement : Dérivation des quotients rationnels',
    description: 'Traiter les 4 fonctions rationnelles du polycopié N°3 et déterminer les équations des tangentes aux points d\'inflexion.',
    givenDate: '2026-10-25',
    dueDate: '2026-10-31',
    maxScore: 20,
    totalSubmissions: 40,
    evaluatedCount: 40,
    totalStudents: 42,
    status: 'cloture',
    submissions: []
  },
  {
    id: 'hw-003',
    classId: 'cls-10a',
    className: '10ème Année A (Brevet BEPC)',
    subject: 'Mathématiques',
    title: 'Problème de géométrie métrique : Réciproque de Thalès',
    description: 'Exercices 14 et 16 du cahier d\'activités de 10ème année. Justifications géométriques claires et schémas cotés obligatoires.',
    givenDate: '2026-10-31',
    dueDate: '2026-11-04',
    maxScore: 20,
    totalSubmissions: 36,
    evaluatedCount: 25,
    totalStudents: 45,
    status: 'en_cours',
    submissions: []
  }
];

export const initialEvaluations: EvaluationSession[] = [
  {
    id: 'eval-001',
    title: 'Évaluation N°1 : Nombres Complexes & Géométrie dans le Plan',
    classId: 'cls-tsm',
    className: 'Terminale Sciences Mathématiques (TSM)',
    subject: 'Mathématiques',
    term: 'Trimestre 1',
    coefficient: 5,
    maxScore: 20,
    date: '2026-10-24',
    durationMinutes: 120,
    type: 'controle_continu',
    status: 'soumis_direction',
    isProvisionalPublished: true,
    grades: initialTeacherStudents
      .filter(s => s.classId === 'cls-tsm')
      .map((s, idx) => ({
        studentId: s.id,
        matricule: s.matricule,
        fullName: s.fullName,
        interro1: Number(Math.min(20, Math.max(7, s.average - 0.5)).toFixed(1)),
        interro2: Number(Math.min(20, Math.max(7, s.average)).toFixed(1)),
        devoir: Number(Math.min(20, Math.max(7, s.average + 0.5)).toFixed(1)),
        composition: s.average,
        average: s.average,
        rank: idx + 1,
        appreciation: s.observation
      }))
      .sort((a, b) => b.average - a.average)
      .map((g, idx) => ({ ...g, rank: idx + 1 }))
  },
  {
    id: 'eval-002',
    title: 'Devoir Surveillé N°1 : Fonctions Exponentielles & Logarithmes',
    classId: 'cls-1se',
    className: '1ère Sciences Expérimentales (1SE)',
    subject: 'Mathématiques',
    term: 'Trimestre 1',
    coefficient: 4,
    maxScore: 20,
    date: '2026-10-30',
    durationMinutes: 90,
    type: 'controle_continu',
    status: 'en_cours',
    isProvisionalPublished: false,
    grades: initialTeacherStudents
      .filter(s => s.classId === 'cls-1se')
      .map((s, idx) => ({
        studentId: s.id,
        matricule: s.matricule,
        fullName: s.fullName,
        interro1: Number(Math.min(20, Math.max(7, s.average - 0.4)).toFixed(1)),
        interro2: s.average,
        devoir: Number(Math.min(20, Math.max(7, s.average + 0.3)).toFixed(1)),
        composition: s.average,
        average: s.average,
        rank: idx + 1,
        appreciation: s.observation
      }))
      .sort((a, b) => b.average - a.average)
      .map((g, idx) => ({ ...g, rank: idx + 1 }))
  }
];

export const initialLogbookEntries: LogbookEntry[] = [
  {
    id: 'log-001',
    classId: 'cls-tsm',
    className: 'Terminale Sciences Mathématiques (TSM)',
    subject: 'Mathématiques',
    date: '2026-11-03',
    startTime: '08:00',
    endTime: '10:00',
    room: 'Salle 102',
    chapterTitle: 'Chapitre 3 : Étude des suites récurrentes et convergence bornée',
    lessonContent: 'Démonstration du théorème de convergence monotone. Exercices d\'application sur la méthode par récurrence double et encadrement par des intégrales.',
    pedagogicalObjectives: [
      'Maîtriser le raisonnement par récurrence sur les suites définies par u(n+1) = f(u(n))',
      'Calculer les limites de suites à l\'aide du théorème des gendarmes',
      'Identifier les points fixes d\'une fonction continue f'
    ],
    observations: 'Participation très active. 5 élèves sont passés au tableau pour la démonstration.',
    assignedHomework: 'Exercices 42 et 45 page 118 du manuel CIAM Terminale SM. Rendre le DM sur feuille double.',
    homeworkDueDate: '2026-11-06',
    isSigned: true,
    signedAt: '2026-11-03T10:05:00Z',
    status: 'actif'
  },
  {
    id: 'log-002',
    classId: 'cls-1se',
    className: '1ère Sciences Expérimentales (1SE)',
    subject: 'Mathématiques',
    date: '2026-11-02',
    startTime: '10:15',
    endTime: '12:15',
    room: 'Salle 104',
    chapterTitle: 'Chapitre 4 : Dérivation et sens de variation des fonctions rationnelles',
    lessonContent: 'Formule de dérivation d\'un quotient u/v. Recherche des extrema locaux et tracé du tableau de variation avec asymptotes.',
    pedagogicalObjectives: [
      'Calculer la dérivée d\'un quotient rationnel de degré 2',
      'Dresser un tableau de variation complet avec signes de la dérivée'
    ],
    observations: 'Prévoir un rappel sur la factorisation du trinôme du second degré.',
    assignedHomework: 'Problème de synthèse N°3 polycopié distribué.',
    homeworkDueDate: '2026-11-05',
    isSigned: true,
    signedAt: '2026-11-02T12:20:00Z',
    status: 'actif'
  },
  {
    id: 'log-003',
    classId: 'cls-10a',
    className: '10ème Année A (Brevet BEPC)',
    subject: 'Mathématiques',
    date: '2026-10-31',
    startTime: '14:00',
    endTime: '16:00',
    room: 'Salle 201',
    chapterTitle: 'Chapitre 2 : Théorème de Thalès et applications métriques',
    lessonContent: 'Énoncé du théorème direct et de la réciproque de Thalès dans un triangle. Résolution de problèmes de calcul de longueurs métriques.',
    pedagogicalObjectives: [
      'Appliquer le rapport de proportionnalité de Thalès',
      'Démontrer que deux droites sont parallèles par la réciproque'
    ],
    observations: 'Bonne compréhension des figures de base en papillon.',
    assignedHomework: 'Exercices N° 14 et 16 du cahier d\'activités.',
    homeworkDueDate: '2026-11-04',
    isSigned: true,
    signedAt: '2026-10-31T16:05:00Z',
    status: 'archive'
  }
];

export const initialAttendanceSessions: Record<string, AttendanceSession> = {
  'cls-tsm': {
    id: 'att-session-tsm',
    classId: 'cls-tsm',
    className: 'Terminale Sciences Mathématiques (TSM)',
    subject: 'Mathématiques',
    date: '2026-11-03',
    startTime: '08:00',
    endTime: '10:00',
    room: 'Salle 102 - Bâtiment Scientifique',
    isCompleted: false,
    records: initialTeacherStudents
      .filter(s => s.classId === 'cls-tsm')
      .map(s => ({
        studentId: s.id,
        matricule: s.matricule,
        fullName: s.fullName,
        status: s.id === 'std-003' ? 'retard' : s.id === 'std-004' ? 'absent' : 'present',
        minutesLate: s.id === 'std-003' ? 12 : undefined,
        motif: s.id === 'std-003' ? 'Embouteillages carrefour Cosa' : s.id === 'std-004' ? 'Maladie - Certificat en attente' : undefined
      }))
  },
  'cls-1se': {
    id: 'att-session-1se',
    classId: 'cls-1se',
    className: '1ère Sciences Expérimentales (1SE)',
    subject: 'Mathématiques',
    date: '2026-11-03',
    startTime: '10:15',
    endTime: '12:15',
    room: 'Salle 104 - Labo Physique',
    isCompleted: false,
    records: initialTeacherStudents
      .filter(s => s.classId === 'cls-1se')
      .map(s => ({
        studentId: s.id,
        matricule: s.matricule,
        fullName: s.fullName,
        status: s.id === 'std-017' ? 'absent' : 'present',
        motif: s.id === 'std-017' ? 'Absence non justifiée' : undefined
      }))
  },
  'cls-10a': {
    id: 'att-session-10a',
    classId: 'cls-10a',
    className: '10ème Année A (Brevet BEPC)',
    subject: 'Mathématiques',
    date: '2026-11-03',
    startTime: '14:00',
    endTime: '16:00',
    room: 'Salle 201 - Bâtiment Collège',
    isCompleted: false,
    records: initialTeacherStudents
      .filter(s => s.classId === 'cls-10a')
      .map(s => ({
        studentId: s.id,
        matricule: s.matricule,
        fullName: s.fullName,
        status: s.id === 'std-037' ? 'retard' : 'present',
        minutesLate: s.id === 'std-037' ? 8 : undefined,
        motif: s.id === 'std-037' ? 'Transport' : undefined
      }))
  }
};

export const initialAttendanceSession: AttendanceSession = initialAttendanceSessions['cls-tsm'];

export const initialStudentProfiles: StudentPedagogicalProfile[] = [
  {
    studentId: 'std-005',
    studentName: 'Ousmane Barry',
    studentMatricule: 'LEC-2026-005',
    className: 'Terminale Sciences Mathématiques (TSM)',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    average: 10.4,
    rank: 5,
    attendanceRate: 83.5,
    lateCount: 4,
    absenceCount: 3,
    isDifficulty: true,
    difficultyReason: 'Baisse sensible des résultats en Analyse, 4 retards ce mois et taux d\'assiduité sous le seuil de 85%.',
    observations: [
      'Difficultés avec les théorèmes d\'encadrement et le calcul littéral poussé.',
      'Manque de régularité dans la restitution des devoirs maison.'
    ],
    recommendations: [
      'Séance de tutorat hebdomadaire avec le délégué Mamadou Alpha.',
      'Soutien pédagogique obligatoire le mercredi après-midi (14h-16h).',
      'Entretien avec les parents pour suivi à domicile.'
    ],
    reportedToDirection: true,
    parentName: 'M. Amadou Barry',
    parentPhone: '+224 621 11 22 33'
  },
  {
    studentId: 'std-004',
    studentName: 'Mariama Camara',
    studentMatricule: 'LEC-2026-004',
    className: 'Terminale Sciences Mathématiques (TSM)',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    average: 13.4,
    rank: 4,
    attendanceRate: 88.0,
    lateCount: 1,
    absenceCount: 2,
    isDifficulty: false,
    observations: [
      'Élève sérieuse, bonne participation orale.',
      'Absences récentes justifiées par certificat médical.'
    ],
    recommendations: [
      'Rattrapage des séances de cours du chapitre 3.'
    ],
    reportedToDirection: false,
    parentName: 'Mme Aissata Camara',
    parentPhone: '+224 624 99 88 77'
  },
  {
    studentId: 'std-001',
    studentName: 'Mamadou Alpha Diallo',
    studentMatricule: 'LEC-2026-001',
    className: 'Terminale Sciences Mathématiques (TSM)',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    average: 18.4,
    rank: 1,
    attendanceRate: 98.5,
    lateCount: 0,
    absenceCount: 0,
    isDifficulty: false,
    observations: [
      'Élève d\'élite, tête de promotion au niveau préfectoral.',
      'Aide activement ses camarades lors des séances de TD.'
    ],
    recommendations: [
      'Proposer pour les Olympiades Nationales de Mathématiques Conakry 2027.'
    ],
    reportedToDirection: false,
    parentName: 'M. Boubacar Diallo',
    parentPhone: '+224 622 77 66 55'
  }
];

export const initialSchoolCalendarEvents: SchoolCalendarEvent[] = [
  {
    id: 'evt-001',
    title: 'Conseil de Classe Mi-Trimestre 1 - Terminale SM',
    type: 'reunion',
    date: '2026-11-18',
    time: '15:30 - 17:30',
    location: 'Salle des Conférences (Bâtiment A)',
    description: 'Bilan d\'étape pédagogique, analyse des moyennes provisoires et validation des listes d\'élèves à convoquer en soutien.',
    teacherRole: 'Professeur Principal (Présentation du rapport de classe)'
  },
  {
    id: 'evt-002',
    title: 'Réunion Pédagogique du Département des Sciences Exactes',
    type: 'reunion',
    date: '2026-11-12',
    time: '14:00 - 16:00',
    location: 'Laboratoire de Physique-Chimie',
    description: 'Harmonisation des barèmes pour les épreuves du 1er Trimestre et validation de la commande de matériel pour les TP.',
    teacherRole: 'Co-animateur et rapporteur de séance'
  },
  {
    id: 'evt-003',
    title: 'Épreuves Blanches Pré-Baccalauréat 2027 (Session 1)',
    type: 'examen',
    date: '2026-12-08',
    time: '08:00 - 12:00',
    location: 'Centre d\'Examen Bâtiment Scientifique',
    description: 'Épreuve générale de Mathématiques Terminale SM coefficient 5. Sujets scellés sous enveloppe sécurisée.',
    teacherRole: 'Concepteur du sujet N°1 & Surveillance'
  },
  {
    id: 'evt-004',
    title: 'Clôture de la saisie des notes du 1er Trimestre',
    type: 'calendrier',
    date: '2026-11-25',
    time: '23:59',
    location: 'Plateforme SmartSchool ERP',
    description: 'Date limite absolue imposée par la Direction des Études avant génération automatisée des bulletins officiels.',
    teacherRole: 'Responsable de la saisie des notes de ses 3 classes'
  }
];

export const initialTeacherSchedule: ScheduleSlot[] = [
  // Lundi (strictement classes et matières attribuées au professeur)
  { id: 'sch-1', day: 'Lundi', startTime: '08:00', endTime: '10:00', className: 'Terminale Sciences Mathématiques (TSM)', subject: 'Mathématiques', room: 'Salle 102', color: 'blue' },
  { id: 'sch-2', day: 'Lundi', startTime: '10:15', endTime: '12:15', className: '1ère Sciences Expérimentales (1SE)', subject: 'Mathématiques', room: 'Salle 104', color: 'emerald' },
  // Mardi
  { id: 'sch-3', day: 'Mardi', startTime: '08:00', endTime: '10:00', className: 'Terminale Sciences Mathématiques (TSM)', subject: 'Sciences Physiques', room: 'Labo Sciences', color: 'purple' },
  { id: 'sch-4', day: 'Mardi', startTime: '14:00', endTime: '16:00', className: '10ème Année A (Brevet BEPC)', subject: 'Mathématiques', room: 'Salle 201', color: 'amber' },
  // Mercredi
  { id: 'sch-5', day: 'Mercredi', startTime: '08:00', endTime: '10:00', className: '1ère Sciences Expérimentales (1SE)', subject: 'Mathématiques', room: 'Salle 104', color: 'emerald' },
  { id: 'sch-6', day: 'Mercredi', startTime: '10:15', endTime: '12:15', className: 'Terminale Sciences Mathématiques (TSM)', subject: 'Mathématiques', room: 'Salle 102', color: 'blue' },
  // Jeudi
  { id: 'sch-7', day: 'Jeudi', startTime: '08:00', endTime: '10:00', className: '10ème Année A (Brevet BEPC)', subject: 'Mathématiques', room: 'Salle 201', color: 'amber' },
  { id: 'sch-8', day: 'Jeudi', startTime: '10:15', endTime: '12:15', className: 'Terminale Sciences Mathématiques (TSM)', subject: 'Sciences Physiques', room: 'Labo Sciences', color: 'purple' },
  // Vendredi
  { id: 'sch-9', day: 'Vendredi', startTime: '08:00', endTime: '11:00', className: 'Terminale Sciences Mathématiques (TSM)', subject: 'Mathématiques', room: 'Salle 102', color: 'rose' }
];

export const initialTeacherMessages: TeacherMessage[] = [
  {
    id: 'msg-001',
    sender: 'Dr. Ibrahima Sory Bangoura (Directeur des Études)',
    recipient: 'M. Mamadou Lamarana Diallo',
    recipientRole: 'Direction',
    subject: 'Validation du sujet d\'évaluation Trimestre 1 - TSM',
    content: 'Bonjour M. Diallo, votre sujet sur les Nombres Complexes pour la Terminale SM est conforme au programme officiel MEPU-A et a été validé. Les épreuves peuvent être dupliquées pour vendredi.',
    sentAt: '2026-11-02 16:30',
    isRead: true,
    channel: 'Application'
  },
  {
    id: 'msg-002',
    sender: 'Mme Kadiatou Diallo (Secrétariat Général)',
    recipient: 'M. Mamadou Lamarana Diallo',
    recipientRole: 'Direction',
    subject: 'Nouvel élève inscrit en Terminale SM',
    content: 'Un nouvel élève transféré du Collège Moderne de Dixinn vient d\'intégrer la TSM : Mohamed Lamine Sylla (Matricule LEC-2026-089). Veuillez l\'ajouter à votre feuille d\'émargement.',
    sentAt: '2026-11-03 07:45',
    isRead: false,
    channel: 'Application'
  },
  {
    id: 'msg-003',
    sender: 'M. Mamadou Lamarana Diallo',
    recipient: 'Parents d\'élèves - Terminale SM',
    recipientRole: 'Parents',
    subject: 'Rappel : Devoir Maison N°2 à rendre le vendredi 6 novembre',
    content: 'Chers parents, je vous prie de bien vouloir veiller à ce que vos enfants finalisent leur DM N°2 de Mathématiques sur les suites. C\'est un exercice préparatoire clé pour le Baccalauréat.',
    sentAt: '2026-11-03 09:15',
    isRead: true,
    channel: 'SMS'
  }
];
