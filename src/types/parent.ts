export type ParentNavTab = 
  | 'dashboard' 
  | 'children' 
  | 'grades' 
  | 'homework' 
  | 'attendance' 
  | 'payments' 
  | 'communication' 
  | 'events';

export interface ChildSummary {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  className: string;
  level: string;
  photo: string;
  generalAverage: number;
  classRank: number;
  totalStudents: number;
  absencesCount: number;
  delaysCount: number;
  pendingHomeworkCount: number;
  feesDueGnf: number;
  feesPaidGnf: number;
  bloodGroup: string;
  mainTeacher: string;
}

export interface ParentPaymentItem {
  id: string;
  receiptNumber: string;
  date: string;
  childName: string;
  childMatricule: string;
  feeType: string;
  amountGnf: number;
  method: 'Orange Money' | 'MTN MoMo' | 'Espèces' | 'Virement';
  status: 'paye' | 'en_attente' | 'echec';
  transactionRef: string;
}

export interface ParentNotification {
  id: string;
  date: string;
  title: string;
  message: string;
  sender: string;
  category: 'Note' | 'Absence' | 'Devoir' | 'Paiement' | 'Événement' | 'Urgence';
  read: boolean;
}

export interface ParentProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  profession: string;
  relationship: 'Père' | 'Mère' | 'Tuteur légal';
  photo: string;
  schoolName: string;
}
