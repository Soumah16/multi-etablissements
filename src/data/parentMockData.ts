import { ChildSummary, ParentPaymentItem, ParentNotification, ParentProfile } from '../types/parent';

export const initialParentProfile: ParentProfile = {
  id: 'par-001',
  name: 'Elhadj Amadou Diallo',
  phone: '+224 628 33 44 55',
  email: 'amadou.diallo.parent@gmail.com',
  address: 'Quartier Almamya, Kaloum, Conakry, Guinée',
  profession: 'Ingénieur Télécoms & Énergies',
  relationship: 'Père',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  schoolName: "Lycée d'Excellence de Conakry"
};

export const initialChildren: ChildSummary[] = [
  {
    id: 'child-001',
    firstName: 'Fatoumata Binta',
    lastName: 'Diallo',
    matricule: 'MAT-2026-TSM-018',
    className: 'Terminale SM',
    level: 'Lycée (Série Scientifique)',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    generalAverage: 16.85,
    classRank: 2,
    totalStudents: 42,
    absencesCount: 1,
    delaysCount: 2,
    pendingHomeworkCount: 2,
    feesDueGnf: 6500000,
    feesPaidGnf: 5000000,
    bloodGroup: 'O+',
    mainTeacher: 'M. Mamadou Lamarana Diallo'
  },
  {
    id: 'child-002',
    firstName: 'Mamadou Alpha',
    lastName: 'Diallo',
    matricule: 'MAT-2026-10A-042',
    className: '10ème Année A',
    level: 'Collège (Préparation Brevet BEPC)',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    generalAverage: 15.40,
    classRank: 4,
    totalStudents: 48,
    absencesCount: 0,
    delaysCount: 1,
    pendingHomeworkCount: 1,
    feesDueGnf: 4500000,
    feesPaidGnf: 4500000,
    bloodGroup: 'A+',
    mainTeacher: 'Mme Fatoumata Camara'
  }
];

export const initialParentPayments: ParentPaymentItem[] = [
  {
    id: 'pay-001',
    receiptNumber: 'REC-2026-0891',
    date: '2026-10-05',
    childName: 'Fatoumata Binta Diallo',
    childMatricule: 'MAT-2026-TSM-018',
    feeType: 'Tranche 1 Scolarité + Inscription',
    amountGnf: 3500000,
    method: 'Orange Money',
    status: 'paye',
    transactionRef: 'OM-GN-98451203'
  },
  {
    id: 'pay-002',
    receiptNumber: 'REC-2026-0924',
    date: '2026-10-05',
    childName: 'Mamadou Alpha Diallo',
    childMatricule: 'MAT-2026-10A-042',
    feeType: 'Scolarité Annuelle Totale (BEPC)',
    amountGnf: 4500000,
    method: 'Orange Money',
    status: 'paye',
    transactionRef: 'OM-GN-98451388'
  },
  {
    id: 'pay-003',
    receiptNumber: 'REC-2026-1145',
    date: '2026-11-02',
    childName: 'Fatoumata Binta Diallo',
    childMatricule: 'MAT-2026-TSM-018',
    feeType: 'Tranche 2 Scolarité (Acompte)',
    amountGnf: 1500000,
    method: 'MTN MoMo',
    status: 'paye',
    transactionRef: 'MTN-GN-45120892'
  }
];

export const initialParentNotifications: ParentNotification[] = [
  {
    id: 'notif-001',
    date: 'Aujourd’hui à 08:35',
    title: 'Note enregistrée en Mathématiques',
    message: 'Fatoumata Binta a obtenu la note de 18.5/20 au Devoir N°2 d’Algèbre.',
    sender: 'M. Diallo (Prof. Mathématiques)',
    category: 'Note',
    read: false
  },
  {
    id: 'notif-002',
    date: 'Hier à 14:15',
    title: 'Rappel Échéance : Solde Scolarité Tranche 2',
    message: 'Le solde restant de 1 500 000 GNF pour Fatoumata Binta est payable avant le 30 Novembre 2026.',
    sender: 'Comptabilité Centrale',
    category: 'Paiement',
    read: false
  },
  {
    id: 'notif-003',
    date: '02 Novembre 2026',
    title: 'Réunion Parents-Professeurs Trimestre 1',
    message: 'La réunion générale se tiendra le Samedi 14 Novembre 2026 à 09h00 dans la grande salle de conférence.',
    sender: 'Direction des Études',
    category: 'Événement',
    read: true
  }
];
