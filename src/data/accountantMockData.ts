import { 
  AccountantProfile, 
  FeeConfiguration, 
  PaymentRecord, 
  DebtorStudent, 
  ExpenseRecord, 
  SalaryRecord, 
  ScholarshipRecord, 
  FinancialAuditLog 
} from '../types/accountant';

export const initialAccountantProfile: AccountantProfile = {
  id: 'cpt-001',
  matricule: 'CPT-GN-2026-015',
  firstName: 'Ibrahima Kalil',
  lastName: 'Camara',
  email: 'ik.camara@smartschool.gn',
  phone: '+224 624 88 99 00',
  photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
  schoolName: 'Lycée d\'Excellence de Conakry',
  schoolId: 'school-001',
  title: 'Chef Comptable & Trésorier Général',
  hireDate: '2020-09-15',
  twoFactorEnabled: true,
  pinHash: '123456',
  dailyCashRegisterStatus: 'ouvert'
};

export const initialFeeConfigurations: FeeConfiguration[] = [
  {
    id: 'fee-001',
    name: 'Frais de Scolarité Annuelle - Lycée (TSM, 1SE, 11S)',
    category: 'scolarite',
    amountGnf: 2400000,
    level: 'Lycée',
    dueDate: '2026-11-30',
    description: 'Scolarité complète payable en 3 tranches (800 000 GNF par trimestre)',
    status: 'actif'
  },
  {
    id: 'fee-002',
    name: 'Frais d\'Inscription & Réinscription',
    category: 'inscription',
    amountGnf: 350000,
    level: 'Tous les niveaux',
    dueDate: '2026-10-15',
    description: 'Frais d\'ouverture de dossier, carte biométrique et assurance scolaire',
    status: 'actif'
  },
  {
    id: 'fee-003',
    name: 'Frais d\'Examen National (Baccalauréat Unique & BEPC)',
    category: 'examen',
    amountGnf: 250000,
    level: 'Terminale & 10ème',
    dueDate: '2027-01-15',
    description: 'Dossier d\'inscription officiel MEPU-A et épreuves blanches',
    status: 'actif'
  },
  {
    id: 'fee-004',
    name: 'Abonnement Transport Scolaire (Bus Mensuel)',
    category: 'transport',
    amountGnf: 300000,
    level: 'Tous les niveaux',
    dueDate: '2026-11-05',
    description: 'Ramassage scolaire matin et soir sur les axes Kaloum - Ratoma - Matoto',
    status: 'actif'
  },
  {
    id: 'fee-005',
    name: 'Service Demi-Pension & Cantine (Mensuel)',
    category: 'cantine',
    amountGnf: 250000,
    level: 'Tous les niveaux',
    dueDate: '2026-11-05',
    description: 'Déjeuner chaud complet préparé par le service de restauration',
    status: 'actif'
  },
  {
    id: 'fee-006',
    name: 'Pack Tenue & Uniforme Scolaire Réglementaire',
    category: 'uniforme',
    amountGnf: 180000,
    level: 'Tous les niveaux',
    dueDate: '2026-10-10',
    description: 'Deux chemises brodées au blason du lycée et pantalon/jupe',
    status: 'actif'
  },
  {
    id: 'fee-007',
    name: 'Cotisation Bibliothèque & Laboratoire Numérique',
    category: 'bibliotheque',
    amountGnf: 100000,
    level: 'Tous les niveaux',
    dueDate: '2026-10-31',
    description: 'Accès aux manuels scolaires CIAM et ordinateurs connectés',
    status: 'actif'
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: 'pay-001',
    reference: 'REC-2026-8941',
    studentId: 'std-001',
    studentName: 'Mamadou Alpha Diallo',
    studentMatricule: 'LEC-2026-001',
    className: 'Terminale Sciences Mathématiques (TSM)',
    parentName: 'M. Thierno Diallo',
    parentPhone: '+224 621 11 22 33',
    feeType: 'Frais de Scolarité Annuelle',
    totalFeeGnf: 2400000,
    amountPaidGnf: 800000,
    balanceRemainingGnf: 1600000,
    percentagePaid: 33.3,
    paymentType: 'echelonne',
    method: 'orange_money',
    date: '2026-11-03',
    time: '08:45',
    status: 'valide',
    cashierName: 'Ibrahima Kalil Camara',
    notes: 'Tranche 1/3 réglée par Orange Money Guinée (Transaction OM-GN-98421)',
    qrCodeToken: 'SMARTSCHOOL-REC-2026-8941-VERIFIED-MEPUA'
  },
  {
    id: 'pay-002',
    reference: 'REC-2026-8942',
    studentId: 'std-002',
    studentName: 'Fatoumata Binta Bah',
    studentMatricule: 'LEC-2026-002',
    className: 'Terminale Sciences Mathématiques (TSM)',
    parentName: 'Mme Aissatou Bah',
    parentPhone: '+224 622 44 55 66',
    feeType: 'Frais de Scolarité Annuelle',
    totalFeeGnf: 2400000,
    amountPaidGnf: 2400000,
    balanceRemainingGnf: 0,
    percentagePaid: 100,
    paymentType: 'total',
    method: 'virement',
    date: '2026-11-02',
    time: '14:20',
    status: 'valide',
    cashierName: 'Ibrahima Kalil Camara',
    notes: 'Paiement intégral anticipé via Banque UBA Guinée',
    qrCodeToken: 'SMARTSCHOOL-REC-2026-8942-VERIFIED-MEPUA'
  },
  {
    id: 'pay-003',
    reference: 'REC-2026-8943',
    studentId: 'std-003',
    studentName: 'Ibrahima Sory Bangoura',
    studentMatricule: 'LEC-2026-003',
    className: 'Terminale Sciences Mathématiques (TSM)',
    parentName: 'M. Sékou Bangoura',
    parentPhone: '+224 628 77 88 99',
    feeType: 'Frais d\'Inscription & Uniforme',
    totalFeeGnf: 530000,
    amountPaidGnf: 530000,
    balanceRemainingGnf: 0,
    percentagePaid: 100,
    paymentType: 'total',
    method: 'especes',
    date: '2026-11-03',
    time: '09:10',
    status: 'valide',
    cashierName: 'Ibrahima Kalil Camara',
    notes: 'Encaissement en espèces au guichet comptable',
    qrCodeToken: 'SMARTSCHOOL-REC-2026-8943-VERIFIED-MEPUA'
  },
  {
    id: 'pay-004',
    reference: 'REC-2026-8944',
    studentId: 'std-004',
    studentName: 'Mariama Camara',
    studentMatricule: 'LEC-2026-004',
    className: 'Terminale Sciences Mathématiques (TSM)',
    parentName: 'Dr. Lansana Camara',
    parentPhone: '+224 620 99 00 11',
    feeType: 'Abonnement Transport Scolaire (Bus)',
    totalFeeGnf: 300000,
    amountPaidGnf: 300000,
    balanceRemainingGnf: 0,
    percentagePaid: 100,
    paymentType: 'total',
    method: 'mtn_momo',
    date: '2026-11-03',
    time: '10:05',
    status: 'valide',
    cashierName: 'Ibrahima Kalil Camara',
    notes: 'Règlement MTN Mobile Money (Tx ID: MOMO-88219)',
    qrCodeToken: 'SMARTSCHOOL-REC-2026-8944-VERIFIED-MEPUA'
  },
  {
    id: 'pay-005',
    reference: 'REC-2026-8945',
    studentId: 'std-005',
    studentName: 'Ousmane Barry',
    studentMatricule: 'LEC-2026-005',
    className: 'Terminale Sciences Mathématiques (TSM)',
    parentName: 'M. Amadou Barry',
    parentPhone: '+224 624 33 22 11',
    feeType: 'Frais de Scolarité Annuelle',
    totalFeeGnf: 2400000,
    amountPaidGnf: 400000,
    balanceRemainingGnf: 2000000,
    percentagePaid: 16.7,
    paymentType: 'partiel',
    method: 'especes',
    date: '2026-10-28',
    time: '11:30',
    status: 'valide',
    cashierName: 'Ibrahima Kalil Camara',
    notes: 'Acompte scolarité T1',
    qrCodeToken: 'SMARTSCHOOL-REC-2026-8945-VERIFIED-MEPUA'
  }
];

export const initialDebtors: DebtorStudent[] = [
  {
    studentId: 'std-005',
    studentName: 'Ousmane Barry',
    studentMatricule: 'LEC-2026-005',
    className: 'Terminale Sciences Mathématiques (TSM)',
    parentName: 'M. Amadou Barry',
    parentPhone: '+224 624 33 22 11',
    parentEmail: 'a.barry@gmail.com',
    totalDueGnf: 2400000,
    amountPaidGnf: 400000,
    balanceRemainingGnf: 2000000,
    overdueDays: 14,
    dueDate: '2026-10-20',
    lastReminderDate: '2026-11-01',
    remindersCount: 2,
    status: 'en_retard'
  },
  {
    studentId: 'std-012',
    studentName: 'Abdoulaye Soumah',
    studentMatricule: 'LEC-2026-012',
    className: '1ère Sciences Expérimentales (1SE)',
    parentName: 'M. Fodé Soumah',
    parentPhone: '+224 623 55 44 33',
    parentEmail: 'fode.soumah@hotmail.com',
    totalDueGnf: 2400000,
    amountPaidGnf: 0,
    balanceRemainingGnf: 2400000,
    overdueDays: 22,
    dueDate: '2026-10-12',
    lastReminderDate: '2026-10-29',
    remindersCount: 3,
    status: 'contentieux'
  },
  {
    studentId: 'std-015',
    studentName: 'Kadiatou Touré',
    studentMatricule: 'LEC-2026-015',
    className: '10ème Année A',
    parentName: 'Mme Mariama Touré',
    parentPhone: '+224 627 99 88 11',
    parentEmail: 'mariama.toure@yahoo.fr',
    totalDueGnf: 1800000,
    amountPaidGnf: 600000,
    balanceRemainingGnf: 1200000,
    overdueDays: 8,
    dueDate: '2026-10-26',
    lastReminderDate: '2026-11-02',
    remindersCount: 1,
    status: 'relance_envoyee'
  }
];

export const initialExpenses: ExpenseRecord[] = [
  {
    id: 'exp-001',
    reference: 'DEP-2026-0412',
    category: 'electricite',
    title: 'Facture Électricité EDG (Électricité de Guinée) - Octobre',
    amountGnf: 4850000,
    beneficiary: 'EDG Agence Kipé',
    date: '2026-11-02',
    description: 'Alimentation réseau du campus, salles informatiques et climatisation',
    proofDocumentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    paymentMethod: 'cheque',
    approvedBy: 'Dr. Ibrahima Sory Bangoura (Directeur)',
    status: 'valide'
  },
  {
    id: 'exp-002',
    reference: 'DEP-2026-0413',
    category: 'internet',
    title: 'Abonnement Internet Fibre Optique Dédiée - Orange Guinée',
    amountGnf: 1800000,
    beneficiary: 'Orange Guinée B2B',
    date: '2026-11-01',
    description: 'Liaison internet haut débit 100 Mbps pour le campus et serveurs',
    proofDocumentUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=400',
    paymentMethod: 'virement',
    approvedBy: 'Dr. Ibrahima Sory Bangoura (Directeur)',
    status: 'valide'
  },
  {
    id: 'exp-003',
    reference: 'DEP-2026-0414',
    category: 'fournitures',
    title: 'Achat de cartons de rames de papier A4 et marqueurs effaçables',
    amountGnf: 3200000,
    beneficiary: 'Papeterie Centrale Madina',
    date: '2026-10-29',
    description: 'Fournitures pédagogiques pour les devoirs surveillés et cours',
    paymentMethod: 'especes',
    approvedBy: 'Ibrahima Kalil Camara',
    status: 'valide'
  },
  {
    id: 'exp-004',
    reference: 'DEP-2026-0415',
    category: 'maintenance',
    title: 'Entretien & Carburant Groupe Électrogène 150 kVA',
    amountGnf: 5600000,
    beneficiary: 'Station TotalEnergies Bambeto',
    date: '2026-10-27',
    description: 'Vidange complète, filtres et 400 litres de gasoil pour relais énergie',
    paymentMethod: 'especes',
    approvedBy: 'Dr. Ibrahima Sory Bangoura (Directeur)',
    status: 'valide'
  }
];

export const initialSalaries: SalaryRecord[] = [
  {
    id: 'sal-001',
    employeeId: 'emp-001',
    employeeName: 'M. Mamadou Lamarana Diallo',
    role: 'Enseignant',
    month: 'Octobre 2026',
    baseSalaryGnf: 4500000,
    bonusGnf: 600000, // Prime prof principal + heures sup
    deductionsGnf: 350000, // CNSS & retenue fiscale
    netSalaryGnf: 4750000,
    paymentDate: '2026-10-31',
    paymentMethod: 'virement',
    status: 'paye',
    payslipRef: 'BS-2026-10-001'
  },
  {
    id: 'sal-002',
    employeeId: 'emp-002',
    employeeName: 'Mme Kadiatou Diallo',
    role: 'Secrétaire',
    month: 'Octobre 2026',
    baseSalaryGnf: 3800000,
    bonusGnf: 400000, // Prime accueil & rentrée
    deductionsGnf: 300000,
    netSalaryGnf: 3900000,
    paymentDate: '2026-10-31',
    paymentMethod: 'virement',
    status: 'paye',
    payslipRef: 'BS-2026-10-002'
  },
  {
    id: 'sal-003',
    employeeId: 'emp-003',
    employeeName: 'M. Ibrahima Kalil Camara',
    role: 'Comptable',
    month: 'Octobre 2026',
    baseSalaryGnf: 4800000,
    bonusGnf: 500000,
    deductionsGnf: 380000,
    netSalaryGnf: 4920000,
    paymentDate: '2026-10-31',
    paymentMethod: 'virement',
    status: 'paye',
    payslipRef: 'BS-2026-10-003'
  },
  {
    id: 'sal-004',
    employeeId: 'emp-004',
    employeeName: 'M. Ousmane Barry',
    role: 'Surveillant',
    month: 'Octobre 2026',
    baseSalaryGnf: 3200000,
    bonusGnf: 250000,
    deductionsGnf: 250000,
    netSalaryGnf: 3200000,
    paymentDate: '2026-10-31',
    paymentMethod: 'especes',
    status: 'paye',
    payslipRef: 'BS-2026-10-004'
  }
];

export const initialScholarships: ScholarshipRecord[] = [
  {
    id: 'sch-001',
    studentId: 'std-001',
    studentName: 'Mamadou Alpha Diallo',
    studentMatricule: 'LEC-2026-001',
    className: 'Terminale Sciences Mathématiques (TSM)',
    type: 'bourse_excellence',
    title: 'Bourse d\'Excellence Scientifique MEPU-A',
    discountPercentage: 50,
    reason: 'Major de promotion avec 18.4/20 de moyenne générale',
    grantedBy: 'Commission Mixte Direction & APEE',
    grantedDate: '2026-10-05',
    validUntil: '2027-06-30',
    status: 'active'
  },
  {
    id: 'sch-002',
    studentId: 'std-006',
    studentName: 'Fatoumata Zahra Bah',
    studentMatricule: 'LEC-2026-006',
    className: '1ère Sciences Expérimentales',
    type: 'reduction_fratrie',
    title: 'Réduction Fratrie (3 enfants inscrits)',
    discountPercentage: 20,
    reason: 'Famille nombreuse inscrite dans l\'établissement',
    grantedBy: 'Direction Générale',
    grantedDate: '2026-10-10',
    validUntil: '2027-06-30',
    status: 'active'
  }
];

export const initialFinancialAuditLogs: FinancialAuditLog[] = [
  {
    id: 'log-f-1',
    userId: 'cpt-001',
    userName: 'Ibrahima Kalil Camara',
    action: 'Encaissement Tranche Scolarité',
    details: 'Reçu REC-2026-8941 émis pour Mamadou Alpha Diallo (800 000 GNF)',
    amountGnf: 800000,
    date: '2026-11-03 08:45',
    ipAddress: '197.149.192.42',
    status: 'success'
  },
  {
    id: 'log-f-2',
    userId: 'cpt-001',
    userName: 'Ibrahima Kalil Camara',
    action: 'Enregistrement Dépense Énergie',
    details: 'Paiement Facture EDG Kipé (4 850 000 GNF)',
    amountGnf: 4850000,
    date: '2026-11-02 15:30',
    ipAddress: '197.149.192.42',
    status: 'success'
  },
  {
    id: 'log-f-3',
    userId: 'cpt-001',
    userName: 'Ibrahima Kalil Camara',
    action: 'Virement Salaires du Personnel',
    details: 'Exécution de la paie mensuelle d\'Octobre (16 770 000 GNF)',
    amountGnf: 16770000,
    date: '2026-10-31 17:00',
    ipAddress: '197.149.192.42',
    status: 'success'
  },
  {
    id: 'log-f-4',
    userId: 'cpt-001',
    userName: 'Ibrahima Kalil Camara',
    action: 'Relance Débiteurs par SMS',
    details: 'Campagne de rappels pour 3 élèves en retard de paiement',
    date: '2026-11-02 11:15',
    ipAddress: '197.149.192.42',
    status: 'success'
  }
];
