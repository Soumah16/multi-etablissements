import { 
  SecretaryProfile, 
  StudentEnrollment, 
  ParentRecord, 
  DeliveredCertificate, 
  SchoolTransfer, 
  SecretaryAppointment, 
  SecretaryMessage, 
  SecretarySecurityLog 
} from '../types/secretary';

export const initialSecretaryProfile: SecretaryProfile = {
  name: 'Mme Kadiatou Diallo',
  title: 'Secrétaire Générale & Responsable des Admissions',
  matricule: 'SEC-EXC-2026-002',
  email: 'secretariat@lycee-excellence.gn',
  phone: '+224 624 55 66 77',
  schoolId: 'sch-001',
  schoolName: 'Lycée d\'Excellence de Conakry',
  photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  officeRoom: 'Bureau des Admissions · Bâtiment Administratif RDC',
  twoFactorEnabled: true,
  twoFactorMethod: 'sms'
};

export const initialStudents: StudentEnrollment[] = [
  {
    id: 'stu-101',
    matricule: 'LEC-2026-045',
    firstName: 'Mamadou Bhoye',
    lastName: 'Diallo',
    dateOfBirth: '2008-05-14',
    gender: 'M',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    nationality: 'Guinéenne',
    address: 'Kipé, Ratoma, Conakry',
    phone: '+224 622 11 22 33',
    email: 'mb.diallo@eleve.lycee-excellence.gn',
    classId: 'cls-001',
    className: 'Terminale Sciences Mathématiques 1',
    bloodGroup: 'O+',
    medicalNotes: 'Aucune allergie connue. Apte à toute activité sportive.',
    parentId: 'par-01',
    parentName: 'Elhadj Amadou Diallo',
    parentPhone: '+224 622 11 22 33',
    parentEmail: 'amadou.diallo@gmail.com',
    registrationDate: '2026-09-02',
    status: 'actif',
    dossierStatus: 'complet',
    missingDocuments: [],
    credentials: {
      username: 'eleve.mb.diallo',
      tempPassword: 'LEC-2026-MB#99',
      sentViaEmail: true,
      sentViaSms: true
    },
    qrToken: 'QR-STU-LEC-2026-045-AUTH'
  },
  {
    id: 'stu-102',
    matricule: 'LEC-2026-088',
    firstName: 'Aissatou',
    lastName: 'Barry',
    dateOfBirth: '2008-09-21',
    gender: 'F',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    nationality: 'Guinéenne',
    address: 'Camayenne, Dixinn, Conakry',
    phone: '+224 628 44 55 66',
    email: 'aissatou.barry@eleve.lycee-excellence.gn',
    classId: 'cls-001',
    className: 'Terminale Sciences Mathématiques 1',
    bloodGroup: 'A+',
    medicalNotes: 'Asthme d\'effort modéré. Inhalateur autorisé en classe.',
    parentId: 'par-02',
    parentName: 'Mamadou Saliou Barry',
    parentPhone: '+224 628 44 55 66',
    parentEmail: 'ms.barry@conakry-port.gn',
    registrationDate: '2026-09-05',
    status: 'actif',
    dossierStatus: 'complet',
    missingDocuments: [],
    credentials: {
      username: 'eleve.aissatou.barry',
      tempPassword: 'LEC-2026-AB#74',
      sentViaEmail: true,
      sentViaSms: true
    },
    qrToken: 'QR-STU-LEC-2026-088-AUTH'
  },
  {
    id: 'stu-103',
    matricule: 'LEC-2026-112',
    firstName: 'Sekouba',
    lastName: 'Keita',
    dateOfBirth: '2007-11-03',
    gender: 'M',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    nationality: 'Guinéenne',
    address: 'Minière, Dixinn, Conakry',
    phone: '+224 621 77 88 99',
    email: 'sekouba.keita@eleve.lycee-excellence.gn',
    classId: 'cls-001',
    className: 'Terminale Sciences Mathématiques 1',
    bloodGroup: 'B+',
    medicalNotes: 'Aucune contre-indication.',
    parentId: 'par-03',
    parentName: 'Ansoumane Keita',
    parentPhone: '+224 621 77 88 99',
    parentEmail: 'ansoumane.keita@gmail.com',
    registrationDate: '2026-09-12',
    status: 'actif',
    dossierStatus: 'incomplet',
    missingDocuments: ['Extrait de naissance légalisé', 'Certificat de visite médicale'],
    credentials: {
      username: 'eleve.sekouba.keita',
      tempPassword: 'LEC-2026-SK#18',
      sentViaEmail: true,
      sentViaSms: false
    },
    qrToken: 'QR-STU-LEC-2026-112-AUTH'
  },
  {
    id: 'stu-104',
    matricule: 'LEC-2026-140',
    firstName: 'Ibrahima Kalil',
    lastName: 'Camara',
    dateOfBirth: '2011-02-18',
    gender: 'M',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    nationality: 'Guinéenne',
    address: 'Lambanyi, Ratoma, Conakry',
    phone: '+224 624 33 22 11',
    email: 'ik.camara@eleve.lycee-excellence.gn',
    classId: 'cls-002',
    className: '10ème Année A',
    bloodGroup: 'O+',
    medicalNotes: 'Port de lunettes de vue correctrices.',
    parentId: 'par-04',
    parentName: 'Mme Fatou Camara',
    parentPhone: '+224 624 33 22 11',
    parentEmail: 'fatou.camara@topmail.gn',
    registrationDate: '2026-09-08',
    status: 'actif',
    dossierStatus: 'incomplet',
    missingDocuments: ['Certificat de vaccination à jour'],
    credentials: {
      username: 'eleve.ik.camara',
      tempPassword: 'LEC-2026-IK#55',
      sentViaEmail: true,
      sentViaSms: true
    },
    qrToken: 'QR-STU-LEC-2026-140-AUTH'
  },
  {
    id: 'stu-105',
    matricule: 'LEC-2026-215',
    firstName: 'Kadiatou',
    lastName: 'Touré',
    dateOfBirth: '2008-07-30',
    gender: 'F',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    nationality: 'Guinéenne',
    address: 'Coléah, Matam, Conakry',
    phone: '+224 664 99 88 77',
    email: 'kadiatou.toure@eleve.lycee-excellence.gn',
    classId: 'cls-003',
    className: 'Terminale Sciences Expérimentales',
    bloodGroup: 'AB+',
    medicalNotes: 'R.A.S.',
    parentId: 'par-05',
    parentName: 'M. Oumar Touré',
    parentPhone: '+224 664 99 88 77',
    parentEmail: 'oumar.toure@orange-guinee.com',
    registrationDate: '2026-09-15',
    status: 'actif',
    dossierStatus: 'complet',
    missingDocuments: [],
    credentials: {
      username: 'eleve.kadiatou.toure',
      tempPassword: 'LEC-2026-KT#31',
      sentViaEmail: true,
      sentViaSms: true
    },
    qrToken: 'QR-STU-LEC-2026-215-AUTH'
  },
  {
    id: 'stu-106',
    matricule: 'LEC-2026-302',
    firstName: 'Mohamed Lamine',
    lastName: 'Soumah',
    dateOfBirth: '2011-04-10',
    gender: 'M',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    nationality: 'Guinéenne',
    address: 'Nongo, Ratoma, Conakry',
    phone: '+224 625 12 34 56',
    email: 'ml.soumah@eleve.lycee-excellence.gn',
    classId: 'cls-002',
    className: '10ème Année A',
    bloodGroup: 'O-',
    medicalNotes: 'Aucun antécédent particulier.',
    parentId: 'par-06',
    parentName: 'Alseny Soumah',
    parentPhone: '+224 625 12 34 56',
    parentEmail: 'alseny.soumah@gmail.com',
    registrationDate: '2026-09-20',
    status: 'actif',
    dossierStatus: 'complet',
    missingDocuments: [],
    credentials: {
      username: 'eleve.ml.soumah',
      tempPassword: 'LEC-2026-MLS#82',
      sentViaEmail: true,
      sentViaSms: true
    },
    qrToken: 'QR-STU-LEC-2026-302-AUTH'
  }
];

export const initialParents: ParentRecord[] = [
  {
    id: 'par-01',
    firstName: 'Elhadj Amadou',
    lastName: 'Diallo',
    phone: '+224 622 11 22 33',
    email: 'amadou.diallo@gmail.com',
    address: 'Kipé Centre, Conakry',
    profession: 'Opérateur Économique / Import-Export',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    childrenIds: ['stu-101'],
    childrenNames: ['Mamadou Bhoye Diallo'],
    status: 'actif',
    credentials: {
      username: 'parent.amadou.diallo',
      tempPassword: 'PAR-DIALLO-2026!',
      sent: true
    }
  },
  {
    id: 'par-02',
    firstName: 'Mamadou Saliou',
    lastName: 'Barry',
    phone: '+224 628 44 55 66',
    email: 'ms.barry@conakry-port.gn',
    address: 'Camayenne, Dixinn',
    profession: 'Cadre Supérieur Port Autonome de Conakry',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    childrenIds: ['stu-102'],
    childrenNames: ['Aissatou Barry'],
    status: 'actif',
    credentials: {
      username: 'parent.msaliou.barry',
      tempPassword: 'PAR-BARRY-2026!',
      sent: true
    }
  },
  {
    id: 'par-03',
    firstName: 'Ansoumane',
    lastName: 'Keita',
    phone: '+224 621 77 88 99',
    email: 'ansoumane.keita@gmail.com',
    address: 'Minière, Conakry',
    profession: 'Ingénieur des Travaux Publics',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    childrenIds: ['stu-103'],
    childrenNames: ['Sekouba Keita'],
    status: 'actif',
    credentials: {
      username: 'parent.ansoumane.keita',
      tempPassword: 'PAR-KEITA-2026!',
      sent: true
    }
  },
  {
    id: 'par-04',
    firstName: 'Mme Fatou',
    lastName: 'Camara',
    phone: '+224 624 33 22 11',
    email: 'fatou.camara@topmail.gn',
    address: 'Lambanyi, Ratoma',
    profession: 'Pharmacienne d\'Officine',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    childrenIds: ['stu-104'],
    childrenNames: ['Ibrahima Kalil Camara'],
    status: 'actif',
    credentials: {
      username: 'parent.fatou.camara',
      tempPassword: 'PAR-CAMARA-2026!',
      sent: true
    }
  },
  {
    id: 'par-05',
    firstName: 'M. Oumar',
    lastName: 'Touré',
    phone: '+224 664 99 88 77',
    email: 'oumar.toure@orange-guinee.com',
    address: 'Coléah, Matam',
    profession: 'Directeur Réseau Télécoms',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    childrenIds: ['stu-105'],
    childrenNames: ['Kadiatou Touré'],
    status: 'actif',
    credentials: {
      username: 'parent.oumar.toure',
      tempPassword: 'PAR-TOURE-2026!',
      sent: true
    }
  }
];

export const initialCertificates: DeliveredCertificate[] = [
  {
    id: 'cert-001',
    certificateNumber: 'LEC-CERT-2026-0041',
    type: 'certificat_scolarite',
    studentId: 'stu-101',
    studentName: 'Mamadou Bhoye Diallo',
    matricule: 'LEC-2026-045',
    className: 'Terminale Sciences Mathématiques 1',
    issueDate: '2026-10-15',
    purpose: 'Dossier de candidature bourses d\'excellence d\'État',
    signedBy: 'Mme Kadiatou Diallo (Secrétaire Générale)',
    qrVerificationUrl: 'https://smartschool-verify.gn/cert/LEC-CERT-2026-0041',
    status: 'delivre'
  },
  {
    id: 'cert-002',
    certificateNumber: 'LEC-ATT-2026-0089',
    type: 'attestation_inscription',
    studentId: 'stu-102',
    studentName: 'Aissatou Barry',
    matricule: 'LEC-2026-088',
    className: 'Terminale Sciences Mathématiques 1',
    issueDate: '2026-10-18',
    purpose: 'Assurance santé et mutuelle familiale',
    signedBy: 'Mme Kadiatou Diallo (Secrétaire Générale)',
    qrVerificationUrl: 'https://smartschool-verify.gn/cert/LEC-ATT-2026-0089',
    status: 'delivre'
  },
  {
    id: 'cert-003',
    certificateNumber: 'LEC-FREQ-2026-0112',
    type: 'attestation_frequentation',
    studentId: 'stu-106',
    studentName: 'Mohamed Lamine Soumah',
    matricule: 'LEC-2026-302',
    className: '10ème Année A',
    issueDate: '2026-10-24',
    purpose: 'Formalités administratives et demande de visa de voyage',
    signedBy: 'Mme Kadiatou Diallo (Secrétaire Générale)',
    qrVerificationUrl: 'https://smartschool-verify.gn/cert/LEC-FREQ-2026-0112',
    status: 'delivre'
  },
  {
    id: 'cert-004',
    certificateNumber: 'LEC-CERT-2026-0155',
    type: 'certificat_scolarite',
    studentId: 'stu-105',
    studentName: 'Kadiatou Touré',
    matricule: 'LEC-2026-215',
    className: 'Terminale Sciences Expérimentales',
    issueDate: '2026-11-01',
    purpose: 'Renouvellement d\'allocation familiale',
    signedBy: 'Mme Kadiatou Diallo (Secrétaire Générale)',
    qrVerificationUrl: 'https://smartschool-verify.gn/cert/LEC-CERT-2026-0155',
    status: 'delivre'
  }
];

export const initialTransfers: SchoolTransfer[] = [
  {
    id: 'tr-001',
    type: 'entrant',
    studentName: 'Abdoulaye Condé',
    matricule: 'LEC-2026-410',
    className: '1ère Sciences Mathématiques',
    previousSchool: 'Lycée 2 Octobre (Kaloum)',
    targetSchool: 'Lycée d\'Excellence de Conakry',
    transferDate: '2026-09-28',
    reason: 'Mutation professionnelle du père à Kipé',
    status: 'approuve',
    certificateNumber: 'TRANS-IN-2026-04'
  },
  {
    id: 'tr-002',
    type: 'sortant',
    studentName: 'Saran Kaba',
    matricule: 'LEC-2026-198',
    className: '10ème Année B',
    previousSchool: 'Lycée d\'Excellence de Conakry',
    targetSchool: 'Groupe Scolaire Saint-Georges (Kamsar)',
    transferDate: '2026-10-14',
    reason: 'Déménagement de la famille pour le projet minier',
    status: 'approuve',
    certificateNumber: 'TRANS-OUT-2026-09'
  },
  {
    id: 'tr-003',
    type: 'entrant',
    studentName: 'Ousmane Fofana',
    matricule: 'LEC-2026-444',
    className: '9ème Année Collège',
    previousSchool: 'Collège Donka (Dixinn)',
    targetSchool: 'Lycée d\'Excellence de Conakry',
    transferDate: '2026-10-29',
    reason: 'Rapprochement du domicile',
    status: 'en_cours'
  }
];

export const initialAppointments: SecretaryAppointment[] = [
  {
    id: 'app-001',
    title: 'Retrait du Certificat de Scolarité & Attestation de Bourse',
    visitorName: 'Elhadj Amadou Diallo',
    visitorRole: 'Parent d\'élève',
    visitorPhone: '+224 622 11 22 33',
    type: 'Retrait documents',
    date: '2026-11-03',
    time: '10:00',
    location: 'Guichet 1 · Secrétariat Général',
    notes: 'Dossier prêt sous pli cacheté.',
    status: 'programme'
  },
  {
    id: 'app-002',
    title: 'Dépôt des pièces manquantes (Extrait de naissance légalisé)',
    visitorName: 'Ansoumane Keita',
    visitorRole: 'Parent d\'élève',
    visitorPhone: '+224 621 77 88 99',
    type: 'Inscription',
    date: '2026-11-03',
    time: '11:30',
    location: 'Bureau des Admissions',
    notes: 'Rappel téléphonique effectué hier.',
    status: 'programme'
  },
  {
    id: 'app-003',
    title: 'Demande d\'audience avec le Directeur des Études',
    visitorName: 'M. Oumar Touré',
    visitorRole: 'Parent d\'élève',
    visitorPhone: '+224 664 99 88 77',
    type: 'Rencontre direction',
    date: '2026-11-04',
    time: '14:30',
    location: 'Secrétariat de Direction',
    notes: 'Objet : aménagement d\'horaire pour activités sportives de haut niveau.',
    status: 'programme'
  },
  {
    id: 'app-004',
    title: 'Renseignements pour transfert d\'élève en classe de Terminale',
    visitorName: 'Mme Mariama Camara',
    visitorRole: 'Partenaire / Visiteur',
    visitorPhone: '+224 620 99 88 11',
    type: 'Rencontre parent',
    date: '2026-11-05',
    time: '09:00',
    location: 'Accueil Visiteurs',
    notes: 'Remettre la plaquette de présentation du Lycée.',
    status: 'programme'
  }
];

export const initialSecretaryMessages: SecretaryMessage[] = [
  {
    id: 'msg-001',
    title: 'Rappel solennel : Dépôt impératif des pièces administratives manquantes',
    content: 'Chers parents d\'élèves dont le dossier d\'inscription est encore incomplet, nous vous prions de bien vouloir déposer les originaux ou copies légalisées des extraits de naissance avant le vendredi 14 novembre 17h.',
    target: 'all_parents',
    channels: ['app', 'sms', 'whatsapp'],
    date: '2026-11-01 09:30',
    status: 'envoye'
  },
  {
    id: 'msg-002',
    title: 'Disponibilité des Cartes Scolaires Numériques 2026-2027',
    content: 'Les badges et cartes scolaires équipées du QR Code d\'accès sont désormais disponibles au guichet du secrétariat aux heures ouvrables.',
    target: 'all_students',
    channels: ['app', 'email'],
    date: '2026-10-26 14:00',
    status: 'envoye'
  }
];

export const initialSecretarySecurityLogs: SecretarySecurityLog[] = [
  {
    id: 'log-sec-01',
    timestamp: '2026-11-03 08:05:12',
    ip: '197.149.214.45 (Conakry, Kipé)',
    device: 'Desktop HP EliteBook / Chrome 128 / Windows 11',
    action: 'Connexion réussie Espace Secrétariat Général (2FA SMS validé)',
    status: 'succes'
  },
  {
    id: 'log-sec-02',
    timestamp: '2026-11-02 16:40:20',
    ip: '197.149.214.45',
    device: 'Desktop HP EliteBook / Windows 11',
    action: 'Émission Certificat de Scolarité #LEC-CERT-2026-0155',
    status: 'succes'
  },
  {
    id: 'log-sec-03',
    timestamp: '2026-11-02 11:22:04',
    ip: '197.149.214.45',
    device: 'Desktop HP EliteBook / Windows 11',
    action: 'Inscription nouvel élève & Génération QR Code',
    status: 'succes'
  }
];
