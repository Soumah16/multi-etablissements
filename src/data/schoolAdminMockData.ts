import { 
  StaffMember, 
  SchoolClass, 
  SchoolSubject, 
  SchoolRoom, 
  AcademicYear, 
  AdministrativeEvent, 
  AdministrativeDocumentTemplate,
  SchoolLoginLog
} from '../types';

export const initialStaffMembers: StaffMember[] = [
  {
    id: 'stf-001',
    matricule: 'DIR-EXC-002',
    schoolId: 'sch-gn-ck-001',
    firstName: 'Dr. Ibrahima Sory',
    lastName: 'Bangoura',
    email: 'directeur@smartschool.gn',
    phone: '+224 621 45 67 89',
    address: 'Quartier Minière, Dixinn, Conakry',
    role: 'Directeur',
    department: 'Direction des Études',
    hireDate: '2026-01-08',
    status: 'actif',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    username: 'directeur',
    temporaryPassword: 'Directeur2026!',
    credentialsSent: true,
    qrToken: 'QR-DIR-EXC-002-TOKEN'
  },
  {
    id: 'stf-002',
    matricule: 'SEC-EXC-008',
    schoolId: 'sch-gn-ck-001',
    firstName: 'Mme Kadiatou',
    lastName: 'Diallo',
    email: 'secretaire@smartschool.gn',
    phone: '+224 620 33 44 55',
    address: 'Camayenne, Dixinn, Conakry',
    role: 'Secrétaire',
    department: 'Secrétariat Général',
    hireDate: '2026-01-12',
    status: 'actif',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    username: 'secretaire',
    temporaryPassword: 'Secretaire2026!',
    credentialsSent: true,
    qrToken: 'QR-SEC-EXC-008-TOKEN'
  },
  {
    id: 'stf-003',
    matricule: 'CPT-EXC-2026-009',
    schoolId: 'sch-gn-ck-001',
    firstName: 'M. Ibrahima Kalil',
    lastName: 'Camara',
    email: 'comptable@smartschool.gn',
    phone: '+224 629 11 22 33',
    address: 'Kipé, Ratoma, Conakry',
    role: 'Comptable',
    department: 'Gestion Financière',
    hireDate: '2026-01-18',
    status: 'actif',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
    username: 'comptable',
    temporaryPassword: 'Comptable2026!',
    credentialsSent: true,
    qrToken: 'QR-CPT-EXC-2026-009-TOKEN'
  },
  {
    id: 'stf-004',
    matricule: 'ENS-EXC-015',
    schoolId: 'sch-gn-ck-001',
    firstName: 'M. Mamadou Lamarana',
    lastName: 'Diallo',
    email: 'prof.diallo@smartschool.gn',
    phone: '+224 628 90 12 34',
    address: 'Belle-Vue, Dixinn, Conakry',
    role: 'Enseignant',
    department: 'Sciences Exactes',
    hireDate: '2026-01-15',
    status: 'actif',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
    username: 'prof.diallo',
    temporaryPassword: 'Professeur2026!',
    credentialsSent: true,
    qrToken: 'QR-ENS-EXC-015-TOKEN',
    assignedClasses: ['cls-001', 'cls-002'],
    assignedSubjects: ['subj-001']
  },
  {
    id: 'stf-005',
    matricule: 'LEC-ENS-005',
    schoolId: 'sch-gn-ck-001',
    firstName: 'Dr. Mariama Ciré',
    lastName: 'Camara',
    email: 'mc.camara@excellence-conakry.edu.gn',
    phone: '+224 620 99 88 77',
    address: 'Almamya, Kaloum, Conakry',
    role: 'Enseignant',
    department: 'Sciences Naturelles',
    hireDate: '2023-02-15',
    status: 'actif',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    username: 'mc.camara',
    temporaryPassword: 'Mariama2026!',
    credentialsSent: true,
    qrToken: 'QR-LEC-ENS-005-TOKEN',
    assignedClasses: ['cls-003'],
    assignedSubjects: ['subj-002', 'subj-003']
  },
  {
    id: 'stf-006',
    matricule: 'BIB-EXC-2026-004',
    schoolId: 'sch-gn-ck-001',
    firstName: 'Mme Aïssatou',
    lastName: 'Sow',
    email: 'biblio@smartschool.gn',
    phone: '+224 625 44 55 66',
    address: 'Matam Centre, Conakry',
    role: 'Bibliothécaire',
    department: 'Centre de Documentation',
    hireDate: '2026-01-20',
    status: 'actif',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    username: 'biblio',
    temporaryPassword: 'Biblio2026!',
    credentialsSent: true,
    qrToken: 'QR-BIB-EXC-2026-004-TOKEN'
  },
  {
    id: 'stf-007',
    matricule: 'SURV-EXC-2026-015',
    schoolId: 'sch-gn-ck-001',
    firstName: 'M. Ibrahima Kalil',
    lastName: 'Keïta',
    email: 'surveillant@smartschool.gn',
    phone: '+224 627 55 66 77',
    address: 'Coleah, Matam, Conakry',
    role: 'Surveillant',
    department: 'Discipline & Sécurité',
    hireDate: '2026-01-15',
    status: 'actif',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
    username: 'surveillant',
    temporaryPassword: 'Surveillant2026!',
    credentialsSent: true,
    qrToken: 'QR-SURV-EXC-2026-015-TOKEN'
  },
  {
    id: 'stf-008',
    matricule: 'LEC-IT-008',
    schoolId: 'sch-gn-ck-001',
    firstName: 'Mohamed Lamine',
    lastName: 'Condé',
    email: 'it@excellence-conakry.edu.gn',
    phone: '+224 627 00 11 22',
    address: 'Nongo, Ratoma, Conakry',
    role: 'Responsable informatique',
    department: 'Systèmes & Réseaux',
    hireDate: '2023-09-10',
    status: 'actif',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    username: 'ml.conde',
    temporaryPassword: 'CondeIT2026!',
    credentialsSent: true,
    qrToken: 'QR-LEC-IT-008-TOKEN'
  }
];

export const initialClasses: SchoolClass[] = [
  {
    id: 'cls-001',
    schoolId: 'sch-gn-ck-001',
    name: 'Terminale Sciences Mathématiques 1',
    level: 'Lycée (Terminale)',
    section: 'Sciences Mathématiques (SM)',
    capacity: 45,
    studentsCount: 42,
    mainRoomId: 'room-101',
    mainRoomName: 'Salle 101 (Bâtiment A)',
    principalTeacherId: 'stf-004',
    principalTeacherName: 'Pr. Mamadou Lamarana Bah',
    archived: false
  },
  {
    id: 'cls-002',
    schoolId: 'sch-gn-ck-001',
    name: 'Terminale Sciences Mathématiques 2',
    level: 'Lycée (Terminale)',
    section: 'Sciences Mathématiques (SM)',
    capacity: 45,
    studentsCount: 40,
    mainRoomId: 'room-102',
    mainRoomName: 'Salle 102 (Bâtiment A)',
    principalTeacherId: 'stf-004',
    principalTeacherName: 'Pr. Mamadou Lamarana Bah',
    archived: false
  },
  {
    id: 'cls-003',
    schoolId: 'sch-gn-ck-001',
    name: 'Terminale Sciences Expérimentales',
    level: 'Lycée (Terminale)',
    section: 'Sciences Expérimentales (SE)',
    capacity: 45,
    studentsCount: 44,
    mainRoomId: 'room-103',
    mainRoomName: 'Salle 103 (Bâtiment B)',
    principalTeacherId: 'stf-005',
    principalTeacherName: 'Dr. Mariama Ciré Camara',
    archived: false
  },
  {
    id: 'cls-004',
    schoolId: 'sch-gn-ck-001',
    name: 'Terminale Sciences Sociales',
    level: 'Lycée (Terminale)',
    section: 'Sciences Sociales (SS)',
    capacity: 50,
    studentsCount: 48,
    mainRoomId: 'room-104',
    mainRoomName: 'Salle 104 (Bâtiment B)',
    archived: false
  },
  {
    id: 'cls-005',
    schoolId: 'sch-gn-ck-001',
    name: '10ème Année A (Brevet)',
    level: 'Collège',
    section: 'Enseignement Général',
    capacity: 50,
    studentsCount: 46,
    mainRoomId: 'room-201',
    mainRoomName: 'Salle 201 (Bâtiment C)',
    archived: false
  }
];

export const initialSubjects: SchoolSubject[] = [
  { id: 'subj-001', schoolId: 'sch-gn-ck-001', name: 'Mathématiques', code: 'MATH-SM', coefficient: 7, department: 'Sciences Exactes', active: true },
  { id: 'subj-002', schoolId: 'sch-gn-ck-001', name: 'Physique', code: 'PHYS-SM', coefficient: 5, department: 'Sciences Physiques', active: true },
  { id: 'subj-003', schoolId: 'sch-gn-ck-001', name: 'Chimie', code: 'CHIM-SE', coefficient: 4, department: 'Sciences Physiques', active: true },
  { id: 'subj-004', schoolId: 'sch-gn-ck-001', name: 'Français & Littérature', code: 'FR-LIT', coefficient: 4, department: 'Lettres & Langues', active: true },
  { id: 'subj-005', schoolId: 'sch-gn-ck-001', name: 'Philosophie', code: 'PHILO', coefficient: 3, department: 'Sciences Humaines', active: true },
  { id: 'subj-006', schoolId: 'sch-gn-ck-001', name: 'Histoire & Géographie', code: 'HIST-GEO', coefficient: 3, department: 'Sciences Humaines', active: true },
  { id: 'subj-007', schoolId: 'sch-gn-ck-001', name: 'Anglais', code: 'ANG', coefficient: 2, department: 'Lettres & Langues', active: true },
  { id: 'subj-008', schoolId: 'sch-gn-ck-001', name: 'Biologie (SVT)', code: 'SVT-SE', coefficient: 6, department: 'Sciences Naturelles', active: true },
  { id: 'subj-009', schoolId: 'sch-gn-ck-001', name: 'Informatique & Algorithmique', code: 'INFO', coefficient: 2, department: 'Technologies', active: true }
];

export const initialRooms: SchoolRoom[] = [
  { id: 'room-101', schoolId: 'sch-gn-ck-001', name: 'Salle 101 (Bâtiment A)', capacity: 48, type: 'Salle de cours', equipments: ['Vidéoprojecteur', 'Wi-Fi Fibre', 'Climatisation'], currentOccupation: 'Terminale SM 1' },
  { id: 'room-102', schoolId: 'sch-gn-ck-001', name: 'Salle 102 (Bâtiment A)', capacity: 48, type: 'Salle de cours', equipments: ['Tableau Blanc Interactif', 'Climatisation'], currentOccupation: 'Terminale SM 2' },
  { id: 'room-103', schoolId: 'sch-gn-ck-001', name: 'Salle 103 (Bâtiment B)', capacity: 48, type: 'Salle de cours', equipments: ['Projecteur', 'Ventilateurs'], currentOccupation: 'Terminale SE' },
  { id: 'room-104', schoolId: 'sch-gn-ck-001', name: 'Salle 104 (Bâtiment B)', capacity: 55, type: 'Salle de cours', equipments: ['Vidéoprojecteur', 'Climatisation'], currentOccupation: 'Terminale SS' },
  { id: 'room-201', schoolId: 'sch-gn-ck-001', name: 'Salle 201 (Bâtiment C)', capacity: 50, type: 'Salle de cours', equipments: ['Tableau Blanc', 'Éclairage LED'], currentOccupation: '10ème Année A' },
  { id: 'room-lab-01', schoolId: 'sch-gn-ck-001', name: 'Laboratoire de Physique-Chimie Lavoisier', capacity: 36, type: 'Laboratoire', equipments: ['20 Paillasses avec arrivées gaz', 'Verrerie complète', 'Hotte aspirante', 'Extincteurs CO2'] },
  { id: 'room-lab-02', schoolId: 'sch-gn-ck-001', name: 'Salle Informatique Claude Shannon', capacity: 35, type: 'Salle informatique', equipments: ['35 PC Core i5 tout-en-un', 'Réseau LAN Gigabit', 'Serveur Local SmartSchool', 'Climatisation 24k BTU'] },
  { id: 'room-bib-01', schoolId: 'sch-gn-ck-001', name: 'Bibliothèque Centrale Cheikh Anta Diop', capacity: 80, type: 'Bibliothèque', equipments: ['Zone de lecture silencieuse', '4 500 ouvrages répertoriés', 'Bornes de scan QR emprunt'] }
];

export const initialAcademicYears: AcademicYear[] = [
  {
    id: 'ay-2026-2027',
    schoolId: 'sch-gn-ck-001',
    yearLabel: '2026-2027',
    status: 'active',
    startDate: '2026-09-15',
    endDate: '2027-06-30',
    terms: [
      { id: 't1', name: '1er Trimestre (Évaluation Initiale)', startDate: '2026-09-15', endDate: '2026-12-22', isCurrent: true },
      { id: 't2', name: '2ème Trimestre (Consolidation)', startDate: '2027-01-05', endDate: '2027-03-31', isCurrent: false },
      { id: 't3', name: '3ème Trimestre (Examens & Bilans)', startDate: '2027-04-12', endDate: '2027-06-30', isCurrent: false }
    ]
  },
  {
    id: 'ay-2025-2026',
    schoolId: 'sch-gn-ck-001',
    yearLabel: '2025-2026',
    status: 'cloturee',
    startDate: '2025-09-15',
    endDate: '2026-06-30',
    terms: [
      { id: 't1-prev', name: '1er Trimestre', startDate: '2025-09-15', endDate: '2025-12-20', isCurrent: false },
      { id: 't2-prev', name: '2ème Trimestre', startDate: '2026-01-06', endDate: '2026-03-28', isCurrent: false },
      { id: 't3-prev', name: '3ème Trimestre', startDate: '2026-04-08', endDate: '2026-06-30', isCurrent: false }
    ]
  }
];

export const initialAdministrativeEvents: AdministrativeEvent[] = [
  {
    id: 'ev-01',
    schoolId: 'sch-gn-ck-001',
    title: 'Conseil de Direction et Rentrée Pédagogique',
    type: 'Reunion',
    date: '2026-11-05',
    time: '10:00 - 12:30',
    location: 'Salle de Conférence Bâtiment A',
    targetAudience: 'Directeur, Secrétaire, Surveillant, IT',
    content: 'Revue des effectifs d\'inscription, validation des emplois du temps et contrôle de l\'attribution des badges du personnel.',
    published: true
  },
  {
    id: 'ev-02',
    schoolId: 'sch-gn-ck-001',
    title: 'Note de Service N° 014 : Règle de Sécurité et Port des Badges QR',
    type: 'Note de service',
    date: '2026-11-02',
    time: '08:00',
    location: 'Affichage Général & Application SmartSchool',
    targetAudience: 'Tout le personnel',
    content: 'Le port du badge officiel SmartSchool avec QR code certifié est strictement obligatoire pour l\'accès aux salles informatiques et laboratoires.',
    published: true
  },
  {
    id: 'ev-03',
    schoolId: 'sch-gn-ck-001',
    title: 'Formation sur la Nouvelle Plateforme d\'Émargement Biométrique',
    type: 'Formation',
    date: '2026-11-12',
    time: '14:30 - 16:30',
    location: 'Salle Informatique Claude Shannon',
    targetAudience: 'Enseignants et Surveillants',
    content: 'Session pratique de prise en main du scan QR code pour le pointage des présences quotidiennes des élèves et du personnel.',
    published: true
  }
];

export const initialDocumentTemplates: AdministrativeDocumentTemplate[] = [
  {
    id: 'doc-01',
    schoolId: 'sch-gn-ck-001',
    title: 'Certificat de Scolarité Officiel',
    type: 'certificat_scolarite',
    headerText: 'RÉPUBLIQUE DE GUINÉE - MINISTÈRE DE L\'ENSEIGNEMENT PRÉ-UNIVERSITAIRE ET DE L\'ALPHABÉTISATION',
    footerText: 'Le présent certificat est délivré pour servir et valoir ce que de droit.',
    signatoryTitle: 'Le Directeur des Études',
    signatoryName: 'M. Ibrahima Sory Bangoura',
    includeStamp: true,
    themeColor: '#1e3a8a'
  },
  {
    id: 'doc-02',
    schoolId: 'sch-gn-ck-001',
    title: 'Attestation d\'Inscription et de Régularité',
    type: 'attestation_inscription',
    headerText: 'LYCÉE D\'EXCELLENCE DE CONAKRY - DIRECTION DES ADMISSIONS',
    footerText: 'Document certifié conforme par le secrétariat général de l\'établissement.',
    signatoryTitle: 'La Secrétaire Générale',
    signatoryName: 'Mme Fatoumata Binta Diallo',
    includeStamp: true,
    themeColor: '#047857'
  },
  {
    id: 'doc-03',
    schoolId: 'sch-gn-ck-001',
    title: 'Gabarit Officiel du Bulletin Trimestriel',
    type: 'modele_bulletin',
    headerText: 'BULLETIN DE NOTES TRIMESTRIEL CONFORME AUX DIRECTIVES NATIONALES',
    footerText: 'Les notes et appréciations sont saisies sous la responsabilité exclusive du corps professoral.',
    signatoryTitle: 'Le Chef d\'Établissement',
    signatoryName: 'M. Ibrahima Sory Bangoura',
    includeStamp: true,
    themeColor: '#1e3a8a'
  }
];

export const initialSchoolLoginLogs: SchoolLoginLog[] = [
  {
    id: 'slog-01',
    schoolId: 'sch-gn-ck-001',
    userName: 'o.camara (Admin École)',
    role: 'Admin École',
    ip: '197.149.198.42',
    device: 'MacBook Pro M3 (Chrome 131)',
    timestamp: '2026-11-02 07:15:22',
    status: 'succes',
    location: 'Conakry, Guinée'
  },
  {
    id: 'slog-02',
    schoolId: 'sch-gn-ck-001',
    userName: 'is.bangoura (Directeur)',
    role: 'Directeur',
    ip: '197.149.198.42',
    device: 'HP ProBook 450 (Chrome)',
    timestamp: '2026-11-02 06:40:10',
    status: 'succes',
    location: 'Conakry, Guinée'
  },
  {
    id: 'slog-03',
    schoolId: 'sch-gn-ck-001',
    userName: 'fb.diallo (Secrétaire)',
    role: 'Secrétaire',
    ip: '41.223.119.80',
    device: 'Dell OptiPlex (Firefox)',
    timestamp: '2026-11-01 16:30:45',
    status: 'succes',
    location: 'Conakry, Guinée'
  },
  {
    id: 'slog-04',
    schoolId: 'sch-gn-ck-001',
    userName: 'inconnu (Tentative brute-force)',
    role: 'Tentative',
    ip: '102.68.22.14',
    device: 'Python Requests Script',
    timestamp: '2026-10-31 23:14:02',
    status: 'echec',
    location: 'Kindia, Guinée'
  }
];
