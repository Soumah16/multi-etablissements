import React, { createContext, useContext, useState } from 'react';
import { 
  DirectorNavTab, 
  StudentReportCard, 
  DirectorExam, 
  TeacherPedagogicalProfile, 
  StudentMonitoringRecord, 
  DisciplinaryIncident, 
  DirectorAnnouncement, 
  DirectorNewsItem, 
  DirectorCalendarEvent, 
  DirectorFinancialSummary, 
  DirectorAuditLog 
} from '../types/director';
import { 
  DirectorProfile, 
  initialDirectorProfile, 
  initialReportCards, 
  initialExams, 
  initialTeacherProfiles, 
  initialStudentMonitoring, 
  initialDisciplineIncidents, 
  initialDirectorAnnouncements, 
  initialDirectorNews, 
  initialCalendarEvents, 
  initialFinancialOverview, 
  initialDirectorAuditLogs 
} from '../data/directorMockData';

interface PinPromptRequest {
  title: string;
  description: string;
  actionName: string;
  onSuccess: () => void;
}

interface DirectorContextType {
  activeDirectorTab: DirectorNavTab;
  setActiveDirectorTab: (tab: DirectorNavTab) => void;
  profile: DirectorProfile;
  updateProfile: (partial: Partial<DirectorProfile>) => void;
  
  // Bulletins
  reportCards: StudentReportCard[];
  approveReportCard: (id: string, observation?: string) => void;
  rejectReportCard: (id: string, observation: string) => void;
  requestCorrectionReportCard: (id: string, observation: string) => void;
  
  // Exams
  exams: DirectorExam[];
  approveExam: (id: string, notes?: string) => void;
  publishExam: (id: string, notes?: string) => void;
  rejectExam: (id: string, notes: string) => void;
  
  // Teachers
  teacherProfiles: TeacherPedagogicalProfile[];
  updateTeacherObservation: (id: string, observation: string, rating: number) => void;
  
  // Students
  studentRecords: StudentMonitoringRecord[];
  
  // Discipline
  disciplineIncidents: DisciplinaryIncident[];
  validateIncidentSanction: (id: string, finalSanction: string, notes?: string) => void;
  rejectIncident: (id: string, notes: string) => void;
  
  // Communication
  announcements: DirectorAnnouncement[];
  createAnnouncement: (item: Omit<DirectorAnnouncement, 'id' | 'createdAt' | 'author' | 'readsCount'>) => void;
  
  // News
  newsItems: DirectorNewsItem[];
  createNews: (item: Omit<DirectorNewsItem, 'id' | 'viewsCount'>) => void;
  deleteNews: (id: string) => void;
  
  // Calendar
  calendarEvents: DirectorCalendarEvent[];
  createCalendarEvent: (event: Omit<DirectorCalendarEvent, 'id'>) => void;
  
  // Finances (Read-only)
  financialOverview: DirectorFinancialSummary;
  
  // Audit Logs
  auditLogs: DirectorAuditLog[];
  addAuditLog: (entry: Omit<DirectorAuditLog, 'id' | 'timestamp'>) => void;
  
  // PIN & 2FA Security System
  directorPin: string;
  updateDirectorPin: (oldPin: string, newPin: string) => boolean;
  pinModalOpen: boolean;
  currentPinPrompt: PinPromptRequest | null;
  requirePinAnd2FA: (title: string, description: string, actionName: string, onSuccess: () => void) => void;
  closePinModal: () => void;
  submitPinVerification: (pin: string, twoFactorCode: string) => boolean;
  
  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DirectorContext = createContext<DirectorContextType | undefined>(undefined);

export const DirectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDirectorTab, setActiveDirectorTab] = useState<DirectorNavTab>('dashboard');
  const [profile, setProfile] = useState<DirectorProfile>(initialDirectorProfile);
  const [reportCards, setReportCards] = useState<StudentReportCard[]>(initialReportCards);
  const [exams, setExams] = useState<DirectorExam[]>(initialExams);
  const [teacherProfiles, setTeacherProfiles] = useState<TeacherPedagogicalProfile[]>(initialTeacherProfiles);
  const [studentRecords] = useState<StudentMonitoringRecord[]>(initialStudentMonitoring);
  const [disciplineIncidents, setDisciplineIncidents] = useState<DisciplinaryIncident[]>(initialDisciplineIncidents);
  const [announcements, setAnnouncements] = useState<DirectorAnnouncement[]>(initialDirectorAnnouncements);
  const [newsItems, setNewsItems] = useState<DirectorNewsItem[]>(initialDirectorNews);
  const [calendarEvents, setCalendarEvents] = useState<DirectorCalendarEvent[]>(initialCalendarEvents);
  const [financialOverview] = useState<DirectorFinancialSummary>(initialFinancialOverview);
  const [auditLogs, setAuditLogs] = useState<DirectorAuditLog[]>(initialDirectorAuditLogs);
  
  const [directorPin, setDirectorPin] = useState<string>('654321');
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [currentPinPrompt, setCurrentPinPrompt] = useState<PinPromptRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addAuditLog = (entry: Omit<DirectorAuditLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const formatted = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    const newLog: DirectorAuditLog = {
      ...entry,
      id: `aud-${Date.now()}`,
      timestamp: formatted
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateProfile = (partial: Partial<DirectorProfile>) => {
    setProfile(prev => ({ ...prev, ...partial }));
    showToast('Profil Directeur mis à jour avec succès');
  };

  const updateDirectorPin = (oldPin: string, newPin: string): boolean => {
    if (oldPin !== directorPin) {
      return false;
    }
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      return false;
    }
    setDirectorPin(newPin);
    addAuditLog({
      action: 'Modification Code PIN Directeur (6 chiffres)',
      target: 'Sécurité Directeur',
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'MacBook Pro / Chrome',
      securityLevel: 'critique',
      status: 'succes'
    });
    showToast('Code PIN Directeur (6 chiffres) modifié avec succès');
    return true;
  };

  const requirePinAnd2FA = (
    title: string, 
    description: string, 
    actionName: string, 
    onSuccess: () => void
  ) => {
    setCurrentPinPrompt({
      title,
      description,
      actionName,
      onSuccess
    });
    setPinModalOpen(true);
  };

  const closePinModal = () => {
    setPinModalOpen(false);
    setCurrentPinPrompt(null);
  };

  const submitPinVerification = (pin: string, twoFactorCode: string): boolean => {
    // Check PIN (must match directorPin)
    if (pin !== directorPin) {
      return false;
    }
    // Check 2FA (accept any 6-digit number or 123456 as valid OTP)
    if (!twoFactorCode || twoFactorCode.length < 4) {
      return false;
    }

    if (currentPinPrompt) {
      currentPinPrompt.onSuccess();
      addAuditLog({
        action: `Autorisation PIN/2FA : ${currentPinPrompt.actionName}`,
        target: currentPinPrompt.title,
        userRole: 'Directeur des Études',
        ip: '197.149.214.33',
        device: 'MacBook Pro / Chrome',
        securityLevel: 'critique',
        status: 'succes'
      });
    }

    closePinModal();
    return true;
  };

  // Report Card Actions
  const approveReportCard = (id: string, observation?: string) => {
    requirePinAnd2FA(
      'Validation Numérique du Bulletin Scolaire',
      'Cette action génère la signature électronique infalsifiable du Directeur et archive officiellement les notes.',
      'Validation de bulletin',
      () => {
        setReportCards(prev => prev.map(bc => {
          if (bc.id === id) {
            const now = new Date();
            const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;
            return {
              ...bc,
              directorStatus: 'approuve',
              directorObservation: observation || bc.directorObservation || 'Validé et certifié par la Direction des Études.',
              validatedAt: dateStr,
              validatedBy: profile.name,
              signatureHash: `CERT-DIR-LEC-${Math.floor(100000 + Math.random() * 900000)}-S27`,
              pdfGenerated: true
            };
          }
          return bc;
        }));
        showToast('Bulletin approuvé et signé électroniquement ! Spécimen officiel prêt.');
      }
    );
  };

  const rejectReportCard = (id: string, observation: string) => {
    setReportCards(prev => prev.map(bc => {
      if (bc.id === id) {
        return {
          ...bc,
          directorStatus: 'rejete',
          directorObservation: observation
        };
      }
      return bc;
    }));
    addAuditLog({
      action: 'Rejet du Bulletin Scolaire',
      target: `Bulletin #${id}`,
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'MacBook Pro / Chrome',
      securityLevel: 'sensible',
      status: 'succes'
    });
    showToast('Bulletin rejeté. Motif consigné pour le professeur principal.');
  };

  const requestCorrectionReportCard = (id: string, observation: string) => {
    setReportCards(prev => prev.map(bc => {
      if (bc.id === id) {
        return {
          ...bc,
          directorStatus: 'correction_demandee',
          directorObservation: observation
        };
      }
      return bc;
    }));
    addAuditLog({
      action: 'Demande de Correction sur Bulletin',
      target: `Bulletin #${id}`,
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'MacBook Pro / Chrome',
      securityLevel: 'sensible',
      status: 'succes'
    });
    showToast('Demande de révision envoyée aux enseignants concernés.');
  };

  // Exam Actions
  const approveExam = (id: string, notes?: string) => {
    requirePinAnd2FA(
      'Validation Académique des Résultats de l\'Examen',
      'Cette action valide les moyennes, les pourcentages de réussite et les délibérations de l\'examen.',
      'Validation d\'examen',
      () => {
        setExams(prev => prev.map(ex => {
          if (ex.id === id) {
            return {
              ...ex,
              status: 'valide',
              directorNotes: notes || ex.directorNotes,
              publishedBy: profile.name
            };
          }
          return ex;
        }));
        showToast('Examen validé avec succès par le Directeur des Études.');
      }
    );
  };

  const publishExam = (id: string, notes?: string) => {
    requirePinAnd2FA(
      'Publication Officielle des Résultats de l\'Examen',
      'ATTENTION : La publication officielle rend les résultats immédiatement visibles aux élèves, parents et enseignants avec le sceau de l\'établissement.',
      'Publication officielle d\'examen',
      () => {
        setExams(prev => prev.map(ex => {
          if (ex.id === id) {
            const now = new Date();
            const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;
            return {
              ...ex,
              status: 'publie',
              directorNotes: notes || ex.directorNotes,
              publishedAt: dateStr,
              publishedBy: profile.name,
              signatureHash: `CERT-EXAM-PUB-${Math.floor(100000 + Math.random() * 900000)}`
            };
          }
          return ex;
        }));
        showToast('Résultats officiellement proclamés et publiés !');
      }
    );
  };

  const rejectExam = (id: string, notes: string) => {
    setExams(prev => prev.map(ex => {
      if (ex.id === id) {
        return {
          ...ex,
          status: 'rejete',
          directorNotes: notes
        };
      }
      return ex;
    }));
    addAuditLog({
      action: 'Rejet de la session d\'examen',
      target: `Examen #${id}`,
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'MacBook Pro / Chrome',
      securityLevel: 'sensible',
      status: 'succes'
    });
    showToast('Résultats d\'examen rejetés pour audit approfondi.');
  };

  // Teacher supervision
  const updateTeacherObservation = (id: string, observation: string, rating: number) => {
    setTeacherProfiles(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          directorObservation: observation,
          pedagogicalRating: rating,
          lastInspectionDate: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    }));
    showToast('Évaluation pédagogique de l\'enseignant enregistrée.');
  };

  // Discipline
  const validateIncidentSanction = (id: string, finalSanction: string, notes?: string) => {
    requirePinAnd2FA(
      'Validation de Décision Disciplinaire Majeure',
      'La validation du Directeur officialise la sanction d\'exclusion ou de conseil de discipline inscrite au dossier scolaire.',
      'Validation disciplinaire',
      () => {
        setDisciplineIncidents(prev => prev.map(inc => {
          if (inc.id === id) {
            return {
              ...inc,
              directorStatus: 'validee',
              finalSanction,
              directorNotes: notes,
              decisionDate: new Date().toISOString().split('T')[0]
            };
          }
          return inc;
        }));
        showToast('Décision disciplinaire officialisée.');
      }
    );
  };

  const rejectIncident = (id: string, notes: string) => {
    setDisciplineIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          directorStatus: 'rejetee',
          directorNotes: notes,
          decisionDate: new Date().toISOString().split('T')[0]
        };
      }
      return inc;
    }));
    showToast('Rapport disciplinaire classé sans suite / rejeté.');
  };

  // Announcements
  const createAnnouncement = (item: Omit<DirectorAnnouncement, 'id' | 'createdAt' | 'author' | 'readsCount'>) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;
    const newAnn: DirectorAnnouncement = {
      ...item,
      id: `ann-${Date.now()}`,
      createdAt: dateStr,
      author: profile.name,
      readsCount: 0
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    addAuditLog({
      action: 'Diffusion de Message Omnicanal',
      target: item.title,
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'MacBook Pro / Chrome',
      securityLevel: 'normale',
      status: 'succes'
    });
    showToast('Message diffusé sur tous les canaux sélectionnés !');
  };

  // News
  const createNews = (item: Omit<DirectorNewsItem, 'id' | 'viewsCount'>) => {
    const newNews: DirectorNewsItem = {
      ...item,
      id: `news-${Date.now()}`,
      viewsCount: 1
    };
    setNewsItems(prev => [newNews, ...prev]);
    showToast('Actualité scolaire publiée avec succès.');
  };

  const deleteNews = (id: string) => {
    setNewsItems(prev => prev.filter(n => n.id !== id));
    showToast('Actualité supprimée.');
  };

  // Calendar
  const createCalendarEvent = (event: Omit<DirectorCalendarEvent, 'id'>) => {
    const newEv: DirectorCalendarEvent = {
      ...event,
      id: `ev-${Date.now()}`
    };
    setCalendarEvents(prev => [...prev, newEv]);
    showToast('Événement académique programmé avec succès.');
  };

  return (
    <DirectorContext.Provider value={{
      activeDirectorTab,
      setActiveDirectorTab,
      profile,
      updateProfile,
      reportCards,
      approveReportCard,
      rejectReportCard,
      requestCorrectionReportCard,
      exams,
      approveExam,
      publishExam,
      rejectExam,
      teacherProfiles,
      updateTeacherObservation,
      studentRecords,
      disciplineIncidents,
      validateIncidentSanction,
      rejectIncident,
      announcements,
      createAnnouncement,
      newsItems,
      createNews,
      deleteNews,
      calendarEvents,
      createCalendarEvent,
      financialOverview,
      auditLogs,
      addAuditLog,
      directorPin,
      updateDirectorPin,
      pinModalOpen,
      currentPinPrompt,
      requirePinAnd2FA,
      closePinModal,
      submitPinVerification,
      toastMessage,
      showToast
    }}>
      {children}
    </DirectorContext.Provider>
  );
};

export const useDirector = () => {
  const context = useContext(DirectorContext);
  if (!context) {
    throw new Error('useDirector must be used within a DirectorProvider');
  }
  return context;
};
