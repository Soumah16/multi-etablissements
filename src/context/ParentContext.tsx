import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  ParentNavTab, 
  ChildSummary, 
  ParentPaymentItem, 
  ParentNotification, 
  ParentProfile 
} from '../types/parent';
import { 
  initialParentProfile, 
  initialChildren, 
  initialParentPayments, 
  initialParentNotifications 
} from '../data/parentMockData';
import { usePersistedState } from '../utils/storage';

interface ParentContextType {
  activeParentTab: ParentNavTab;
  setActiveParentTab: (tab: ParentNavTab) => void;
  profile: ParentProfile;
  childrenList: ChildSummary[];
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
  selectedChild: ChildSummary;
  payments: ParentPaymentItem[];
  initiateMobilePayment: (childId: string, feeType: string, amountGnf: number, method: 'Orange Money' | 'MTN MoMo', phone: string) => void;
  notifications: ParentNotification[];
  markNotificationRead: (id: string) => void;
  sentMessages: { id: string; recipient: string; subject: string; message: string; date: string }[];
  sendMessageToStaff: (recipient: string, subject: string, message: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  formatGnf: (amount: number) => string;
}

const ParentContext = createContext<ParentContextType | undefined>(undefined);

export const ParentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeParentTab, setActiveParentTab] = useState<ParentNavTab>('dashboard');
  const [profile] = useState<ParentProfile>(initialParentProfile);
  const [childrenList, setChildrenList] = usePersistedState<ChildSummary[]>('smartschool_parent_children_v1', initialChildren);
  const [selectedChildId, setSelectedChildId] = usePersistedState<string>('smartschool_parent_selected_child_v1', initialChildren[0].id);
  const [payments, setPayments] = usePersistedState<ParentPaymentItem[]>('smartschool_parent_payments_v1', initialParentPayments);
  const [notifications, setNotifications] = usePersistedState<ParentNotification[]>('smartschool_parent_notifications_v1', initialParentNotifications);
  const [sentMessages, setSentMessages] = usePersistedState<{ id: string; recipient: string; subject: string; message: string; date: string }[]>(
    'smartschool_parent_messages_v1',
    [
      {
        id: 'msg-001',
        recipient: 'M. Mamadou Lamarana Diallo (Prof. Principal TSM)',
        subject: 'Demande de rendez-vous orientation Bac',
        message: 'Bonjour Monsieur, je souhaiterais échanger avec vous sur les choix d’orientation universitaire de Fatoumata Binta en France et au Maroc.',
        date: '01 Nov 2026'
      }
    ],
    loaded => (Array.isArray(loaded) && loaded.length > 0 ? loaded : [
      {
        id: 'msg-001',
        recipient: 'M. Mamadou Lamarana Diallo (Prof. Principal TSM)',
        subject: 'Demande de rendez-vous orientation Bac',
        message: 'Bonjour Monsieur, je souhaiterais échanger avec vous sur les choix d’orientation universitaire de Fatoumata Binta en France et au Maroc.',
        date: '01 Nov 2026'
      }
    ])
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedChild = childrenList.find(c => c.id === selectedChildId) || childrenList[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatGnf = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', { maximumFractionDigits: 0 }).format(amount) + ' GNF';
  };

  const initiateMobilePayment = (
    childId: string, 
    feeType: string, 
    amountGnf: number, 
    method: 'Orange Money' | 'MTN MoMo', 
    phone: string
  ) => {
    const targetChild = childrenList.find(c => c.id === childId);
    if (!targetChild) return;

    const newPayment: ParentPaymentItem = {
      id: `pay-${Date.now()}`,
      receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      childName: `${targetChild.firstName} ${targetChild.lastName}`,
      childMatricule: targetChild.matricule,
      feeType,
      amountGnf,
      method,
      status: 'paye',
      transactionRef: `${method === 'Orange Money' ? 'OM' : 'MTN'}-GN-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    setPayments(prev => [newPayment, ...prev]);
    // Update child fees
    setChildrenList(prev => prev.map(c => {
      if (c.id === childId) {
        return {
          ...c,
          feesPaidGnf: c.feesPaidGnf + amountGnf
        };
      }
      return c;
    }));

    showToast(`Paiement de ${formatGnf(amountGnf)} par ${method} (${phone}) validé avec succès.`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const sendMessageToStaff = (recipient: string, subject: string, message: string) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      recipient,
      subject,
      message,
      date: 'Aujourd’hui'
    };
    setSentMessages(prev => [newMsg, ...prev]);
    showToast(`Message transmis à « ${recipient} ».`);
  };

  return (
    <ParentContext.Provider value={{
      activeParentTab,
      setActiveParentTab,
      profile,
      childrenList,
      selectedChildId,
      setSelectedChildId,
      selectedChild,
      payments,
      initiateMobilePayment,
      notifications,
      markNotificationRead,
      sentMessages,
      sendMessageToStaff,
      toastMessage,
      showToast,
      formatGnf
    }}>
      {children}
    </ParentContext.Provider>
  );
};

export const useParent = () => {
  const context = useContext(ParentContext);
  if (!context) {
    throw new Error('useParent must be used within a ParentProvider');
  }
  return context;
};
