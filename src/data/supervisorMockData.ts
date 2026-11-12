import { 
  SupervisorProfile, 
  AttendanceRecordItem, 
  AdmissionSlip, 
  DisciplinaryIncident, 
  WatchlistStudent, 
  ConfiscatedItem, 
  SecurityPatrol, 
  DisciplinaryParentMeeting 
} from '../types/supervisor';

export const initialSupervisorProfile: SupervisorProfile = {
  id: 'srv-001',
  matricule: 'SRV-GN-2026-015',
  firstName: 'Ibrahima Kalil',
  lastName: 'Keïta',
  gender: 'M',
  email: 'i.kalil.keita@smartschool.gn',
  phone: '+224 620 12 34 56',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  address: 'Quartier Lambanyi, Commune de Ratoma, Conakry, Guinée',
  roleTitle: 'Surveillant Général & Responsable de la Vie Scolaire',
  department: 'Vie Scolaire & Discipline',
  schoolName: 'Lycée d\'Excellence de Conakry',
  schoolId: 'school-001',
  hireDate: '2021-09-01',
  status: 'active',
  twoFactorEnabled: true,
  pinCode: '7412'
};

export const initialAttendanceRecords: AttendanceRecordItem[] = [
  {
    id: 'att-rec-001',
    studentId: 'std-004',
    studentName: 'Mariama Camara',
    studentMatricule: 'LEC-2026-004',
    className: 'Terminale Sciences Mathématiques (TSM)',
    date: '2026-11-04',
    time: '08:00',
    type: 'absent',
    subjectTaught: 'Mathématiques',
    teacherName: 'M. Mamadou Lamarana Diallo',
    status: 'en_attente',
    justificationReason: 'Certificat médical transmis par le tuteur légal',
    notifiedParent: true
  },
  {
    id: 'att-rec-002',
    studentId: 'std-003',
    studentName: 'Ibrahima Sory Bangoura',
    studentMatricule: 'LEC-2026-003',
    className: 'Terminale Sciences Mathématiques (TSM)',
    date: '2026-11-04',
    time: '08:12',
    type: 'retard',
    minutesLate: 12,
    subjectTaught: 'Mathématiques',
    teacherName: 'M. Mamadou Lamarana Diallo',
    status: 'justifie',
    justificationReason: 'Embouteillage carrefour Cosa - Billet de rentrée N°102 délivré',
    justifiedAt: '2026-11-04 08:14',
    notifiedParent: true
  },
  {
    id: 'att-rec-003',
    studentId: 'std-015',
    studentName: 'Sekou Oumar Doumbouya',
    studentMatricule: 'LEC-2026-015',
    className: '1ère Sciences Expérimentales (1SE)',
    date: '2026-11-04',
    time: '08:00',
    type: 'absent',
    subjectTaught: 'Sciences Physiques',
    teacherName: 'M. Mamadou Lamarana Diallo',
    status: 'non_justifie',
    notifiedParent: true
  },
  {
    id: 'att-rec-004',
    studentId: 'std-022',
    studentName: 'Aboubacar Sidiki Camara',
    studentMatricule: 'LEC-2026-022',
    className: '10ème Année A (Brevet BEPC)',
    date: '2026-11-04',
    time: '08:25',
    type: 'retard',
    minutesLate: 25,
    subjectTaught: 'Français',
    teacherName: 'Mme Aissatou Barry',
    status: 'non_justifie',
    notifiedParent: true
  },
  {
    id: 'att-rec-005',
    studentId: 'std-005',
    studentName: 'Ousmane Barry',
    studentMatricule: 'LEC-2026-005',
    className: 'Terminale Sciences Mathématiques (TSM)',
    date: '2026-11-03',
    time: '14:00',
    type: 'retard',
    minutesLate: 15,
    subjectTaught: 'Sciences Physiques',
    teacherName: 'M. Mamadou Lamarana Diallo',
    status: 'justifie',
    justificationReason: 'Problème de transport communal',
    justifiedAt: '2026-11-03 14:05',
    notifiedParent: true
  }
];

export const initialAdmissionSlips: AdmissionSlip[] = [
  {
    id: 'slip-001',
    slipNumber: 'BR-2026-101',
    studentId: 'std-003',
    studentName: 'Ibrahima Sory Bangoura',
    studentMatricule: 'LEC-2026-003',
    className: 'Terminale Sciences Mathématiques (TSM)',
    issuedDate: '2026-11-04',
    issuedTime: '08:14',
    reason: 'retard_justifie',
    comments: 'Retard de 12 min suite à un blocage de circulation routière à Cosa. Admis en cours de Mathématiques.',
    supervisorName: 'Ibrahima Kalil Keïta',
    supervisorSignature: true,
    isAdmittedToClass: true
  },
  {
    id: 'slip-002',
    slipNumber: 'BR-2026-102',
    studentId: 'std-012',
    studentName: 'Fatoumata Zahra Traoré',
    studentMatricule: 'LEC-2026-012',
    className: '1ère Sciences Expérimentales (1SE)',
    issuedDate: '2026-11-04',
    issuedTime: '08:20',
    reason: 'retour_maladie',
    comments: 'Reprise des cours avec certificat médical du Centre Médical de Ratoma. Admis.',
    supervisorName: 'Ibrahima Kalil Keïta',
    supervisorSignature: true,
    isAdmittedToClass: true
  },
  {
    id: 'slip-003',
    slipNumber: 'BR-2026-103',
    studentId: 'std-022',
    studentName: 'Aboubacar Sidiki Camara',
    studentMatricule: 'LEC-2026-022',
    className: '10ème Année A (Brevet BEPC)',
    issuedDate: '2026-11-04',
    issuedTime: '08:28',
    reason: 'retard_justifie',
    comments: 'Retard de 25 minutes. Avertissement oral noté. Admis avec avis de surveillance.',
    supervisorName: 'Ibrahima Kalil Keïta',
    supervisorSignature: true,
    isAdmittedToClass: true
  }
];

export const initialDisciplinaryIncidents: DisciplinaryIncident[] = [
  {
    id: 'inc-001',
    incidentNumber: 'INC-2026-014',
    studentId: 'std-019',
    studentName: 'Mohamed Lamine Camara',
    studentMatricule: 'LEC-2026-019',
    className: '1ère Sciences Expérimentales (1SE)',
    date: '2026-11-04',
    time: '10:20',
    location: 'Cour de récréation',
    infractionType: 'Bagarre / Violence physique',
    severity: 'grave',
    witnesses: 'Délégué de classe et 2 élèves de 10ème',
    reportDetails: 'Altercation physique lors de la récréation matinale près des terrains de sport. Séparation immédiate par le surveillant.',
    reportedBy: 'Surveillant de permanence (Ibrahima Kalil Keïta)',
    sanctionType: 'Exclusion temporaire (1-3 jours)',
    sanctionDuration: '2 jours d\'exclusion temporaire conservatoire',
    parentNotified: true,
    reportedToDirector: true,
    status: 'transmis_direction'
  },
  {
    id: 'inc-002',
    incidentNumber: 'INC-2026-015',
    studentId: 'std-005',
    studentName: 'Ousmane Barry',
    studentMatricule: 'LEC-2026-005',
    className: 'Terminale Sciences Mathématiques (TSM)',
    date: '2026-11-03',
    time: '11:15',
    location: 'Salle de classe',
    infractionType: 'Usage interdit du smartphone',
    severity: 'moyenne',
    witnesses: 'Classe TSM',
    reportDetails: 'Utilisation d\'écouteurs sans fil et consultation d\'un smartphone pendant le cours de Sciences Physiques.',
    reportedBy: 'M. Mamadou Lamarana Diallo (Enseignant)',
    sanctionType: 'Heures de retenue / TIG',
    sanctionDuration: '2 heures de retenue le samedi matin (08h-10h)',
    parentNotified: true,
    reportedToDirector: false,
    status: 'en_cours'
  },
  {
    id: 'inc-003',
    incidentNumber: 'INC-2026-016',
    studentId: 'std-031',
    studentName: 'Thierno Amadou Sow',
    studentMatricule: 'LEC-2026-031',
    className: '10ème Année A (Brevet BEPC)',
    date: '2026-11-02',
    time: '07:55',
    location: 'Portail d\'entrée',
    infractionType: 'Tenue non réglementaire (Uniforme)',
    severity: 'mineure',
    reportDetails: 'Port de chaussures de sport bariolées non autorisées et absence de l\'écusson officiel sur la chemise kaki réglementaire.',
    reportedBy: 'Surveillant général au portail',
    sanctionType: 'Avertissement écrit',
    parentNotified: true,
    reportedToDirector: false,
    status: 'resolu'
  }
];

export const initialWatchlist: WatchlistStudent[] = [
  {
    studentId: 'std-019',
    studentName: 'Mohamed Lamine Camara',
    studentMatricule: 'LEC-2026-019',
    className: '1ère Sciences Expérimentales (1SE)',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    parentName: 'M. Lansana Camara',
    parentPhone: '+224 622 99 88 11',
    totalAbsences: 5,
    totalLate: 6,
    totalIncidents: 3,
    activeSanctionsCount: 1,
    behaviorScore: 8.5,
    riskLevel: 'eleve',
    supervisorNotes: [
      'Incidents répétés d\'indiscipline et bagarre le 04 nov.',
      'Dossier transmis au Directeur des Études pour convocation du tuteur.'
    ],
    lastMeetingDate: '2026-10-20'
  },
  {
    studentId: 'std-005',
    studentName: 'Ousmane Barry',
    studentMatricule: 'LEC-2026-005',
    className: 'Terminale Sciences Mathématiques (TSM)',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    parentName: 'M. Amadou Barry',
    parentPhone: '+224 621 11 22 33',
    totalAbsences: 3,
    totalLate: 4,
    totalIncidents: 2,
    activeSanctionsCount: 1,
    behaviorScore: 11.0,
    riskLevel: 'modere',
    supervisorNotes: [
      'Téléphone confisqué en cours de sciences.',
      'Entretien préventif réalisé sur l\'importance de l\'année du Bac.'
    ],
    lastMeetingDate: '2026-10-28'
  },
  {
    studentId: 'std-022',
    studentName: 'Aboubacar Sidiki Camara',
    studentMatricule: 'LEC-2026-022',
    className: '10ème Année A (Brevet BEPC)',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    parentName: 'Mme Mariame Touré',
    parentPhone: '+224 625 44 33 22',
    totalAbsences: 2,
    totalLate: 5,
    totalIncidents: 1,
    activeSanctionsCount: 0,
    behaviorScore: 12.5,
    riskLevel: 'faible',
    supervisorNotes: [
      'Retards fréquents le matin à cause de la distance du domicile (Cosa).'
    ]
  }
];

export const initialConfiscatedItems: ConfiscatedItem[] = [
  {
    id: 'cnf-001',
    studentName: 'Ousmane Barry (TSM)',
    className: 'Terminale Sciences Mathématiques (TSM)',
    itemName: 'Smartphone iPhone 11 Noir + Boîtier AirPods',
    itemType: 'Smartphone',
    confiscatedDate: '2026-11-03',
    location: 'Armoire sécurisée Vie Scolaire (Casier N°04)',
    status: 'consigne'
  },
  {
    id: 'cnf-002',
    studentName: 'Mamoudou Keita (10ème A)',
    className: '10ème Année A (Brevet BEPC)',
    itemName: 'Enceinte Bluetooth JBL Go',
    itemType: 'Autre',
    confiscatedDate: '2026-10-29',
    location: 'Armoire sécurisée Vie Scolaire (Casier N°11)',
    status: 'restitue_parent',
    returnedDate: '2026-11-02'
  }
];

export const initialSecurityPatrols: SecurityPatrol[] = [
  {
    id: 'pat-001',
    zone: 'Portail Principal',
    time: '07:30 - 08:15',
    date: '2026-11-04',
    supervisorName: 'Ibrahima Kalil Keïta',
    observations: 'Contrôle strict des uniformes réglementaires et des cartes scolaires. 14 retards enregistrés et régularisés.',
    incidentDetected: false
  },
  {
    id: 'pat-002',
    zone: 'Cour Centrale',
    time: '10:00 - 10:30',
    date: '2026-11-04',
    supervisorName: 'Ibrahima Kalil Keïta',
    observations: 'Surveillance de la récréation matinale. Intervention sur altercation entre 2 élèves de 1SE.',
    incidentDetected: true
  },
  {
    id: 'pat-003',
    zone: 'Couloirs Bâtiment Lycée',
    time: '11:30 - 12:00',
    date: '2026-11-04',
    supervisorName: 'Ibrahima Kalil Keïta',
    observations: 'Aucune anomalie. Élèves assidus en classe.',
    incidentDetected: false
  }
];

export const initialDisciplinaryMeetings: DisciplinaryParentMeeting[] = [
  {
    id: 'mtg-001',
    studentName: 'Mohamed Lamine Camara',
    className: '1ère Sciences Expérimentales (1SE)',
    parentName: 'M. Lansana Camara',
    parentPhone: '+224 622 99 88 11',
    date: '2026-11-05',
    time: '15:00',
    reason: 'Convocation suite à altercation physique et bagarre dans la cour',
    status: 'confirme',
    meetingNotes: 'Entretien avec le Directeur des Études et le Surveillant Général'
  },
  {
    id: 'mtg-002',
    studentName: 'Ousmane Barry',
    className: 'Terminale Sciences Mathématiques (TSM)',
    parentName: 'M. Amadou Barry',
    parentPhone: '+224 621 11 22 33',
    date: '2026-11-06',
    time: '10:30',
    reason: 'Restitution du smartphone confisqué et signature de l\'engagement de bonne conduite',
    status: 'programme'
  }
];
