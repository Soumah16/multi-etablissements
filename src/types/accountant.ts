export type AccountantNavTab = 
  | 'dashboard'
  | 'fees'
  | 'payments'
  | 'debtors'
  | 'expenses'
  | 'salaries'
  | 'scholarships'
  | 'reports'
  | 'security';

export type PaymentMethod = 
  | 'especes' 
  | 'orange_money' 
  | 'mtn_momo' 
  | 'virement' 
  | 'carte' 
  | 'cheque';

export type PaymentStatus = 'valide' | 'en_attente' | 'annule';

export type FeeCategory = 
  | 'inscription' 
  | 'scolarite' 
  | 'examen' 
  | 'bibliotheque' 
  | 'transport' 
  | 'cantine' 
  | 'uniforme' 
  | 'special' 
  | 'autre';

export interface FeeConfiguration {
  id: string;
  name: string;
  category: FeeCategory;
  amountGnf: number;
  level: string; // e.g., "Tous les niveaux", "Lycée", "Collège", "Terminale"
  className?: string;
  dueDate: string;
  description: string;
  status: 'actif' | 'inactif';
}

export interface PaymentRecord {
  id: string;
  reference: string;
  studentId: string;
  studentName: string;
  studentMatricule: string;
  className: string;
  parentName: string;
  parentPhone: string;
  feeType: string;
  totalFeeGnf: number;
  amountPaidGnf: number;
  balanceRemainingGnf: number;
  percentagePaid: number;
  paymentType: 'total' | 'partiel' | 'echelonne';
  method: PaymentMethod;
  date: string;
  time: string;
  status: PaymentStatus;
  cashierName: string;
  notes?: string;
  cancellationReason?: string;
  qrCodeToken: string;
}

export interface DebtorStudent {
  studentId: string;
  studentName: string;
  studentMatricule: string;
  className: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  totalDueGnf: number;
  amountPaidGnf: number;
  balanceRemainingGnf: number;
  overdueDays: number;
  dueDate: string;
  lastReminderDate?: string;
  remindersCount: number;
  status: 'en_retard' | 'relance_envoyee' | 'contentieux';
}

export type ExpenseCategory = 
  | 'salaires' 
  | 'fournitures' 
  | 'maintenance' 
  | 'transport' 
  | 'electricite' 
  | 'internet' 
  | 'cantine' 
  | 'equipements' 
  | 'charges_diverses';

export interface ExpenseRecord {
  id: string;
  reference: string;
  category: ExpenseCategory;
  title: string;
  amountGnf: number;
  beneficiary: string;
  date: string;
  description: string;
  proofDocumentUrl?: string; // photo/invoice
  paymentMethod: PaymentMethod;
  approvedBy: string;
  status: 'valide' | 'en_attente';
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: 'Enseignant' | 'Personnel administratif' | 'Surveillant' | 'Bibliothécaire' | 'Comptable' | 'Secrétaire';
  month: string; // e.g. "Octobre 2026"
  baseSalaryGnf: number;
  bonusGnf: number;
  deductionsGnf: number;
  netSalaryGnf: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  status: 'paye' | 'en_attente';
  payslipRef: string;
}

export interface ScholarshipRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentMatricule: string;
  className: string;
  type: 'bourse_excellence' | 'reduction_fratrie' | 'aide_sociale' | 'enfant_personnel' | 'remise_speciale';
  title: string;
  discountPercentage?: number;
  fixedAmountGnf?: number;
  reason: string;
  grantedBy: string;
  grantedDate: string;
  validUntil: string;
  status: 'active' | 'expiree';
}

export interface AccountantProfile {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo: string;
  schoolName: string;
  schoolId: string;
  title: string;
  hireDate: string;
  twoFactorEnabled: boolean;
  pinHash: string; // default 6-digit PIN "123456"
  dailyCashRegisterStatus: 'ouvert' | 'cloture';
}

export interface FinancialAuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  amountGnf?: number;
  date: string;
  ipAddress: string;
  status: 'success' | 'alert' | 'failed';
}
