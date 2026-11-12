import React, { createContext, useContext, useState } from 'react';
import { 
  AccountantNavTab, 
  AccountantProfile, 
  FeeConfiguration, 
  PaymentRecord, 
  DebtorStudent, 
  ExpenseRecord, 
  SalaryRecord, 
  ScholarshipRecord, 
  FinancialAuditLog,
  PaymentMethod
} from '../types/accountant';
import { 
  initialAccountantProfile, 
  initialFeeConfigurations, 
  initialPayments, 
  initialDebtors, 
  initialExpenses, 
  initialSalaries, 
  initialScholarships, 
  initialFinancialAuditLogs 
} from '../data/accountantMockData';

interface PinActionPending {
  type: 'cancel_payment' | 'delete_expense' | 'modify_fee';
  id: string;
  callback: () => void;
  title: string;
}

interface AccountantContextType {
  activeAccountantTab: AccountantNavTab;
  setActiveAccountantTab: (tab: AccountantNavTab) => void;
  profile: AccountantProfile;
  updateProfile: (updated: Partial<AccountantProfile>) => void;
  fees: FeeConfiguration[];
  addFee: (fee: Omit<FeeConfiguration, 'id'>) => void;
  updateFee: (id: string, updated: Partial<FeeConfiguration>) => void;
  toggleFeeStatus: (id: string) => void;
  payments: PaymentRecord[];
  addPayment: (paymentData: {
    studentId: string;
    studentName: string;
    studentMatricule: string;
    className: string;
    parentName: string;
    parentPhone: string;
    feeType: string;
    totalFeeGnf: number;
    amountPaidGnf: number;
    method: PaymentMethod;
    notes?: string;
  }) => PaymentRecord;
  cancelPayment: (paymentId: string, reason: string) => void;
  debtors: DebtorStudent[];
  sendDebtorReminder: (studentId: string, channel: 'SMS' | 'WhatsApp' | 'Email' | 'App') => void;
  expenses: ExpenseRecord[];
  addExpense: (expense: Omit<ExpenseRecord, 'id' | 'reference' | 'status'>) => void;
  salaries: SalaryRecord[];
  paySalary: (salaryId: string) => void;
  scholarships: ScholarshipRecord[];
  addScholarship: (scholarship: Omit<ScholarshipRecord, 'id' | 'grantedDate' | 'status'>) => void;
  auditLogs: FinancialAuditLog[];
  formatGnf: (amount: number) => string;
  toastMessage: string | null;
  triggerToast: (msg: string) => void;
  // PIN Verification
  pinModalOpen: boolean;
  setPinModalOpen: (open: boolean) => void;
  pinActionPending: PinActionPending | null;
  requirePinAction: (action: PinActionPending) => void;
  verifyPinAndExecute: (pin: string) => boolean;
}

const AccountantContext = createContext<AccountantContextType | undefined>(undefined);

export const AccountantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeAccountantTab, setActiveAccountantTab] = useState<AccountantNavTab>('dashboard');
  const [profile, setProfile] = useState<AccountantProfile>(initialAccountantProfile);
  const [fees, setFees] = useState<FeeConfiguration[]>(initialFeeConfigurations);
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [debtors, setDebtors] = useState<DebtorStudent[]>(initialDebtors);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(initialExpenses);
  const [salaries, setSalaries] = useState<SalaryRecord[]>(initialSalaries);
  const [scholarships, setScholarships] = useState<ScholarshipRecord[]>(initialScholarships);
  const [auditLogs, setAuditLogs] = useState<FinancialAuditLog[]>(initialFinancialAuditLogs);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sensitive action with 6-digit PIN protection
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinActionPending, setPinActionPending] = useState<PinActionPending | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const formatGnf = (amount: number): string => {
    return new Intl.NumberFormat('fr-GN', {
      maximumFractionDigits: 0
    }).format(amount) + ' GNF';
  };

  const updateProfile = (updated: Partial<AccountantProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
    triggerToast('Profil comptable mis à jour.');
  };

  const addFee = (feeData: Omit<FeeConfiguration, 'id'>) => {
    const newFee: FeeConfiguration = {
      ...feeData,
      id: `fee-${Date.now()}`
    };
    setFees(prev => [newFee, ...prev]);
    addAuditLog('Configuration de frais', `Création du frais ${feeData.name} (${formatGnf(feeData.amountGnf)})`, feeData.amountGnf);
    triggerToast(`Frais "${feeData.name}" configuré avec succès.`);
  };

  const updateFee = (id: string, updated: Partial<FeeConfiguration>) => {
    setFees(prev => prev.map(f => f.id === id ? { ...f, ...updated } : f));
    addAuditLog('Modification de frais', `Mise à jour du tarif de frais ID ${id}`);
    triggerToast('Frais scolaire mis à jour.');
  };

  const toggleFeeStatus = (id: string) => {
    setFees(prev => prev.map(f => {
      if (f.id !== id) return f;
      const nextStatus = f.status === 'actif' ? 'inactif' : 'actif';
      return { ...f, status: nextStatus };
    }));
    triggerToast('Statut du frais modifié.');
  };

  const addAuditLog = (action: string, details: string, amountGnf?: number) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newLog: FinancialAuditLog = {
      id: `log-f-${Date.now()}`,
      userId: profile.id,
      userName: `${profile.firstName} ${profile.lastName}`,
      action,
      details,
      amountGnf,
      date: now,
      ipAddress: '197.149.192.42',
      status: 'success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addPayment = (data: {
    studentId: string;
    studentName: string;
    studentMatricule: string;
    className: string;
    parentName: string;
    parentPhone: string;
    feeType: string;
    totalFeeGnf: number;
    amountPaidGnf: number;
    method: PaymentMethod;
    notes?: string;
  }): PaymentRecord => {
    const remaining = Math.max(0, data.totalFeeGnf - data.amountPaidGnf);
    const percentage = Number(((data.amountPaidGnf / data.totalFeeGnf) * 100).toFixed(1));
    const paymentType = remaining === 0 ? 'total' : (percentage < 50 ? 'partiel' : 'echelonne');
    const refNumber = Math.floor(1000 + Math.random() * 9000);
    const ref = `REC-2026-${refNumber}`;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      reference: ref,
      studentId: data.studentId,
      studentName: data.studentName,
      studentMatricule: data.studentMatricule,
      className: data.className,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      feeType: data.feeType,
      totalFeeGnf: data.totalFeeGnf,
      amountPaidGnf: data.amountPaidGnf,
      balanceRemainingGnf: remaining,
      percentagePaid: percentage,
      paymentType,
      method: data.method,
      date: new Date().toISOString().substring(0, 10),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'valide',
      cashierName: `${profile.firstName} ${profile.lastName}`,
      notes: data.notes || `Paiement reçu via ${data.method}`,
      qrCodeToken: `SMARTSCHOOL-${ref}-VERIFIED-MEPUA`
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update or remove from debtors if applicable
    setDebtors(prev => {
      const existing = prev.find(d => d.studentId === data.studentId);
      if (!existing) return prev;
      const newBalance = Math.max(0, existing.balanceRemainingGnf - data.amountPaidGnf);
      if (newBalance === 0) {
        return prev.filter(d => d.studentId !== data.studentId);
      }
      return prev.map(d => d.studentId === data.studentId ? {
        ...d,
        amountPaidGnf: d.amountPaidGnf + data.amountPaidGnf,
        balanceRemainingGnf: newBalance
      } : d);
    });

    addAuditLog('Encaissement de paiement', `Émission du reçu ${ref} pour ${data.studentName} (${formatGnf(data.amountPaidGnf)})`, data.amountPaidGnf);
    triggerToast(`Paiement de ${formatGnf(data.amountPaidGnf)} enregistré. Reçu ${ref} généré !`);
    return newPayment;
  };

  const cancelPayment = (paymentId: string, reason: string) => {
    setPayments(prev => prev.map(p => {
      if (p.id !== paymentId) return p;
      return {
        ...p,
        status: 'annule',
        cancellationReason: reason
      };
    }));
    addAuditLog('Annulation de paiement', `Paiement ${paymentId} annulé après vérification PIN. Motif: ${reason}`);
    triggerToast('Paiement annulé avec succès.');
  };

  const sendDebtorReminder = (studentId: string, channel: 'SMS' | 'WhatsApp' | 'Email' | 'App') => {
    setDebtors(prev => prev.map(d => {
      if (d.studentId !== studentId) return d;
      return {
        ...d,
        remindersCount: d.remindersCount + 1,
        lastReminderDate: new Date().toISOString().substring(0, 10),
        status: 'relance_envoyee'
      };
    }));
    addAuditLog('Relance d\'impayé', `Rappel envoyé à l'élève ${studentId} par ${channel}`);
    triggerToast(`Rappel de paiement envoyé au parent par ${channel} avec succès.`);
  };

  const addExpense = (expenseData: Omit<ExpenseRecord, 'id' | 'reference' | 'status'>) => {
    const refNumber = Math.floor(1000 + Math.random() * 9000);
    const newExpense: ExpenseRecord = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      reference: `DEP-2026-${refNumber}`,
      status: 'valide'
    };
    setExpenses(prev => [newExpense, ...prev]);
    addAuditLog('Enregistrement de dépense', `${expenseData.title} (${formatGnf(expenseData.amountGnf)})`, expenseData.amountGnf);
    triggerToast(`Dépense de ${formatGnf(expenseData.amountGnf)} enregistrée.`);
  };

  const paySalary = (salaryId: string) => {
    setSalaries(prev => prev.map(s => {
      if (s.id !== salaryId) return s;
      return {
        ...s,
        status: 'paye',
        paymentDate: new Date().toISOString().substring(0, 10)
      };
    }));
    triggerToast('Salaire validé et viré.');
  };

  const addScholarship = (scholarshipData: Omit<ScholarshipRecord, 'id' | 'grantedDate' | 'status'>) => {
    const newSch: ScholarshipRecord = {
      ...scholarshipData,
      id: `sch-${Date.now()}`,
      grantedDate: new Date().toISOString().substring(0, 10),
      status: 'active'
    };
    setScholarships(prev => [newSch, ...prev]);
    addAuditLog('Attribution de bourse/remise', `${scholarshipData.title} accordée à ${scholarshipData.studentName}`);
    triggerToast('Bourse / Réduction accordée avec succès.');
  };

  const requirePinAction = (action: PinActionPending) => {
    setPinActionPending(action);
    setPinModalOpen(true);
  };

  const verifyPinAndExecute = (enteredPin: string): boolean => {
    if (enteredPin === profile.pinHash) {
      if (pinActionPending) {
        pinActionPending.callback();
        setPinActionPending(null);
      }
      setPinModalOpen(false);
      return true;
    }
    return false;
  };

  return (
    <AccountantContext.Provider
      value={{
        activeAccountantTab,
        setActiveAccountantTab,
        profile,
        updateProfile,
        fees,
        addFee,
        updateFee,
        toggleFeeStatus,
        payments,
        addPayment,
        cancelPayment,
        debtors,
        sendDebtorReminder,
        expenses,
        addExpense,
        salaries,
        paySalary,
        scholarships,
        addScholarship,
        auditLogs,
        formatGnf,
        toastMessage,
        triggerToast,
        pinModalOpen,
        setPinModalOpen,
        pinActionPending,
        requirePinAction,
        verifyPinAndExecute
      }}
    >
      {children}
    </AccountantContext.Provider>
  );
};

export const useAccountant = () => {
  const context = useContext(AccountantContext);
  if (!context) {
    throw new Error('useAccountant must be used within an AccountantProvider');
  }
  return context;
};
