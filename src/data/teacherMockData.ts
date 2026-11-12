import { 
  TeacherProfile, 
  AssignedClass, 
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

export const initialTeacherClasses: AssignedClass[] = [
  {
    id: 'cls-tsm',
    name: 'Terminale Sciences Mathématiques (TSM)',
    level: 'Terminale',
    room: 'Salle 102 - Bâtiment Scientifique',
    studentsCount: 38,
    isMainTeacher: true,
    classDelegate: 'Mamadou Alpha Diallo',
    averageGrade: 14.85,
    attendanceRate: 97.4
  },
  {
    id: 'cls-1se',
    name: '1ère Sciences Expérimentales (1SE)',
    level: '1ère',
    room: 'Salle 104 - Labo Physique',
    studentsCount: 42,
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
    studentsCount: 45,
    isMainTeacher: false,
    classDelegate: 'Ibrahima Sory Soumah',
    averageGrade: 12.65,
    attendanceRate: 92.1
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
    grades: [
      {
        studentId: 'std-001',
        matricule: 'LEC-2026-001',
        fullName: 'Mamadou Alpha Diallo',
        photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
        interro1: 17.5,
        interro2: 18,
        devoir: 19,
        composition: 18.5,
        average: 18.4,
        rank: 1,
        appreciation: 'Excellente maîtrise analytique, rédaction impeccable.'
      },
      {
        studentId: 'std-002',
        matricule: 'LEC-2026-002',
        fullName: 'Fatoumata Binta Bah',
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
        interro1: 16,
        interro2: 16.5,
        devoir: 17,
        composition: 17.5,
        average: 17.1,
        rank: 2,
        appreciation: 'Très bon raisonnement, rigueur mathématique exemplaire.'
      },
      {
        studentId: 'std-003',
        matricule: 'LEC-2026-003',
        fullName: 'Ibrahima Sory Bangoura',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        interro1: 14.5,
        interro2: 15,
        devoir: 15.5,
        composition: 15,
        average: 15.1,
        rank: 3,
        appreciation: 'Bon travail d\'ensemble, consolider l\'argumentation géométrique.'
      },
      {
        studentId: 'std-004',
        matricule: 'LEC-2026-004',
        fullName: 'Mariama Camara',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        interro1: 12,
        interro2: 13,
        devoir: 14,
        composition: 13.5,
        average: 13.4,
        rank: 4,
        appreciation: 'Résultats satisfaisants en progrès constants.'
      },
      {
        studentId: 'std-005',
        matricule: 'LEC-2026-005',
        fullName: 'Ousmane Barry',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        interro1: 9.5,
        interro2: 10,
        devoir: 11,
        composition: 10.5,
        average: 10.4,
        rank: 5,
        appreciation: 'Doit approfondir les révisions et poser plus de questions.'
      }
    ]
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
    grades: [
      {
        studentId: 'std-010',
        matricule: 'LEC-2026-010',
        fullName: 'Aissatou Sow',
        interro1: 15,
        interro2: 14.5,
        devoir: 16,
        composition: 15.5,
        average: 15.4,
        rank: 1,
        appreciation: 'Très bon investissement.'
      },
      {
        studentId: 'std-011',
        matricule: 'LEC-2026-011',
        fullName: 'Cherif Haidara',
        interro1: 12,
        interro2: 13,
        devoir: 12.5,
        composition: 13,
        average: 12.7,
        rank: 2,
        appreciation: 'Travail régulier.'
      }
    ]
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

export const initialAttendanceSession: AttendanceSession = {
  id: 'att-session-today',
  classId: 'cls-tsm',
  className: 'Terminale Sciences Mathématiques (TSM)',
  subject: 'Mathématiques',
  date: '2026-11-03',
  startTime: '08:00',
  endTime: '10:00',
  room: 'Salle 102',
  isCompleted: true,
  records: [
    {
      studentId: 'std-001',
      matricule: 'LEC-2026-001',
      fullName: 'Mamadou Alpha Diallo',
      status: 'present'
    },
    {
      studentId: 'std-002',
      matricule: 'LEC-2026-002',
      fullName: 'Fatoumata Binta Bah',
      status: 'present'
    },
    {
      studentId: 'std-003',
      matricule: 'LEC-2026-003',
      fullName: 'Ibrahima Sory Bangoura',
      status: 'retard',
      minutesLate: 12,
      motif: 'Embouteillages carrefour Cosa'
    },
    {
      studentId: 'std-004',
      matricule: 'LEC-2026-004',
      fullName: 'Mariama Camara',
      status: 'absent',
      motif: 'Maladie - Certificat médical en attente'
    },
    {
      studentId: 'std-005',
      matricule: 'LEC-2026-005',
      fullName: 'Ousmane Barry',
      status: 'present'
    }
  ]
};

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
  // Lundi
  { id: 'sch-1', day: 'Lundi', startTime: '08:00', endTime: '10:00', className: 'Terminale SM', subject: 'Mathématiques', room: 'Salle 102', color: 'blue' },
  { id: 'sch-2', day: 'Lundi', startTime: '10:15', endTime: '12:15', className: '1ère SE', subject: 'Mathématiques', room: 'Salle 104', color: 'emerald' },
  // Mardi
  { id: 'sch-3', day: 'Mardi', startTime: '08:00', endTime: '10:00', className: 'Terminale SM', subject: 'Sciences Physiques', room: 'Labo Sciences', color: 'purple' },
  { id: 'sch-4', day: 'Mardi', startTime: '14:00', endTime: '16:00', className: '10ème Année A', subject: 'Mathématiques', room: 'Salle 201', color: 'amber' },
  // Mercredi
  { id: 'sch-5', day: 'Mercredi', startTime: '08:00', endTime: '10:00', className: '1ère SE', subject: 'Mathématiques', room: 'Salle 104', color: 'emerald' },
  { id: 'sch-6', day: 'Mercredi', startTime: '10:15', endTime: '12:15', className: 'Terminale SM', subject: 'Travaux Dirigés (TD)', room: 'Salle 102', color: 'blue' },
  // Jeudi
  { id: 'sch-7', day: 'Jeudi', startTime: '08:00', endTime: '10:00', className: '10ème Année A', subject: 'Mathématiques', room: 'Salle 201', color: 'amber' },
  { id: 'sch-8', day: 'Jeudi', startTime: '10:15', endTime: '12:15', className: '1ère SE', subject: 'Sciences Physiques', room: 'Labo Sciences', color: 'purple' },
  // Vendredi
  { id: 'sch-9', day: 'Vendredi', startTime: '08:00', endTime: '11:00', className: 'Terminale SM', subject: 'Devoir Surveillé / Évaluation', room: 'Salle 102', color: 'rose' }
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
