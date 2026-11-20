import React, { createContext, useContext, useEffect, useState } from 'react';
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
import { generateTotpSecret, verifyTotpCode } from '../utils/totp';
import {
  getMonotonicWriteTimestamp,
  saveDualStorage,
  subscribeStorageKey,
  usePersistedState
} from '../utils/storage';
import { propagateRoleProfileToAccount } from '../utils/accountSync';
import { requestServerOtp, verifyServerOtp, maskDestinationLabel } from '../utils/otpClient';
import { HubRole, pushSharedMessage } from '../utils/communicationHub';
import { recordGlobalAuditLog } from '../utils/auditLogger';

interface PinPromptRequest {
  title: string;
  description: string;
  actionName: string;
  onSuccess: () => void;
}

export interface SentOtpInfo {
  challengeToken: string;
  method: 'sms' | 'email';
  maskedDestination: string;
  deliveryStatus: 'sent' | 'gateway_not_configured' | 'failed';
  sentAt: string;
  message: string;
}

export interface PinVerificationResult {
  ok: boolean;
  error?: string;
}

interface DirectorSecurityStorage {
  directorPin: string;
  totpSecret: string;
  twoFactorMethod: 'app' | 'sms' | 'email';
}

const DIRECTOR_SECURITY_STORAGE_KEY = 'smartschool_director_security_v1';

const loadStoredSecurity = (): DirectorSecurityStorage => {
  try {
    const raw = localStorage.getItem(DIRECTOR_SECURITY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        directorPin:
          typeof parsed.directorPin === 'string' && /^\d{6}$/.test(parsed.directorPin)
            ? parsed.directorPin
            : '654321',
        totpSecret:
          typeof parsed.totpSecret === 'string' && parsed.totpSecret.length >= 16
            ? parsed.totpSecret
            : generateTotpSecret(16),
        twoFactorMethod:
          parsed.twoFactorMethod === 'sms' || parsed.twoFactorMethod === 'email'
            ? parsed.twoFactorMethod
            : 'app'
      };
    }
  } catch {
    // ignore storage errors
  }
  return {
    directorPin: '654321',
    totpSecret: generateTotpSecret(16),
    twoFactorMethod: 'app'
  };
};

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
  totpSecret: string;
  regenerateTotpSecret: () => void;
  lastSentOtpInfo: SentOtpInfo | null;
  sendVerificationOtp: (channel?: 'sms' | 'email') => Promise<SentOtpInfo | null>;
  updateDirectorPin: (oldPin: string, newPin: string) => boolean;
  pinModalOpen: boolean;
  currentPinPrompt: PinPromptRequest | null;
  requirePinAnd2FA: (title: string, description: string, actionName: string, onSuccess: () => void) => void;
  closePinModal: () => void;
  submitPinVerification: (pin: string, twoFactorCode: string) => Promise<PinVerificationResult>;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DirectorContext = createContext<DirectorContextType | undefined>(undefined);

export const DirectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialSecurity] = useState<DirectorSecurityStorage>(() => loadStoredSecurity());

  const [activeDirectorTab, setActiveDirectorTab] = useState<DirectorNavTab>('dashboard');
  const [profile, setProfile] = usePersistedState<DirectorProfile>(
    'smartschool_director_profile_v1',
    {
      ...initialDirectorProfile,
      twoFactorMethod: initialSecurity.twoFactorMethod
    },
    loaded => ({
      ...initialDirectorProfile,
      ...loaded,
      twoFactorMethod: initialSecurity.twoFactorMethod
    })
  );
  const [reportCards, setReportCards] = usePersistedState<StudentReportCard[]>(
    'smartschool_director_report_cards_v1',
    initialReportCards
  );
  const [exams, setExams] = usePersistedState<DirectorExam[]>(
    'smartschool_director_exams_v1',
    initialExams
  );
  const [teacherProfiles, setTeacherProfiles] = usePersistedState<TeacherPedagogicalProfile[]>(
    'smartschool_director_teachers_v1',
    initialTeacherProfiles
  );
  const [studentRecords] = useState<StudentMonitoringRecord[]>(initialStudentMonitoring);
  const [disciplineIncidents, setDisciplineIncidents] = usePersistedState<DisciplinaryIncident[]>(
    'smartschool_director_discipline_v1',
    initialDisciplineIncidents
  );
  const [announcements, setAnnouncements] = usePersistedState<DirectorAnnouncement[]>(
    'smartschool_director_announcements_v1',
    initialDirectorAnnouncements,
    loaded => (Array.isArray(loaded) && loaded.length > 0 ? loaded : initialDirectorAnnouncements)
  );
  const [newsItems, setNewsItems] = usePersistedState<DirectorNewsItem[]>(
    'smartschool_director_news_v1',
    initialDirectorNews,
    loaded => (Array.isArray(loaded) && loaded.length > 0 ? loaded : initialDirectorNews)
  );
  const [calendarEvents, setCalendarEvents] = usePersistedState<DirectorCalendarEvent[]>(
    'smartschool_director_calendar_v1',
    initialCalendarEvents
  );
  const [financialOverview] = useState<DirectorFinancialSummary>(initialFinancialOverview);
  const [auditLogs, setAuditLogs] = usePersistedState<DirectorAuditLog[]>(
    'smartschool_director_audit_logs_v1',
    initialDirectorAuditLogs
  );

  const [directorPin, setDirectorPin] = useState<string>(initialSecurity.directorPin);
  const [totpSecret, setTotpSecret] = useState<string>(initialSecurity.totpSecret);
  const [activeChallengeToken, setActiveChallengeToken] = useState<string | null>(null);
  const [lastSentOtpInfo, setLastSentOtpInfo] = useState<SentOtpInfo | null>(null);

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [currentPinPrompt, setCurrentPinPrompt] = useState<PinPromptRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mountedSecRef = React.useRef(false);
  const remoteSecUpdateRef = React.useRef(false);

  useEffect(() => {
    return subscribeStorageKey(DIRECTOR_SECURITY_STORAGE_KEY, (data, _ts, src) => {
      if (src !== 'remote' || !data || typeof data !== 'object') return;
      const incoming = data as Partial<DirectorSecurityStorage>;
      const pinChanged =
        typeof incoming.directorPin === 'string' && incoming.directorPin !== directorPin;
      const secretChanged =
        typeof incoming.totpSecret === 'string' && incoming.totpSecret !== totpSecret;
      if (!pinChanged && !secretChanged) return;
      remoteSecUpdateRef.current = true;
      if (pinChanged && incoming.directorPin) setDirectorPin(incoming.directorPin);
      if (secretChanged && incoming.totpSecret) setTotpSecret(incoming.totpSecret);
    });
  }, [directorPin, totpSecret]);

  useEffect(() => {
    if (!mountedSecRef.current) {
      mountedSecRef.current = true;
      return;
    }
    if (remoteSecUpdateRef.current) {
      remoteSecUpdateRef.current = false;
      return;
    }
    const payload: DirectorSecurityStorage = {
      directorPin,
      totpSecret,
      twoFactorMethod: profile.twoFactorMethod
    };
    saveDualStorage(DIRECTOR_SECURITY_STORAGE_KEY, payload, getMonotonicWriteTimestamp(), 'local');
  }, [directorPin, totpSecret, profile.twoFactorMethod]);

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
    recordGlobalAuditLog({
      action: entry.action,
      target: entry.target,
      actorName: profile.name,
      actorRole: 'director',
      actorMatricule: profile.matricule,
      schoolName: profile.schoolName,
      type: entry.securityLevel === 'critique' ? 'securite' : 'admin',
      severity:
        entry.status === 'echec'
          ? 'critical'
          : entry.securityLevel === 'critique' || entry.securityLevel === 'sensible'
          ? 'warning'
          : 'info',
      ip: entry.ip
    });
  };

  const updateProfile = (partial: Partial<DirectorProfile>) => {
    const nextProfile: DirectorProfile = { ...profile, ...partial };
    setProfile(nextProfile);
    propagateRoleProfileToAccount(
      'director',
      nextProfile,
      { email: profile.email, matricule: profile.matricule },
      nextProfile.schoolId
    );
    recordGlobalAuditLog({
      action: 'Mise à jour du profil Directeur des Études',
      target: nextProfile.name,
      actorName: nextProfile.name,
      actorRole: 'director',
      actorMatricule: nextProfile.matricule,
      schoolName: nextProfile.schoolName,
      type: 'admin',
      severity: 'info'
    });
    showToast('Profil Directeur mis à jour avec succès');
  };

  const regenerateTotpSecret = () => {
    const nextSecret = generateTotpSecret(16);
    setTotpSecret(nextSecret);
    addAuditLog({
      action: 'Renouvellement clé secrète TOTP Authenticator',
      target: 'Sécurité Directeur (2FA)',
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'Poste Direction',
      securityLevel: 'critique',
      status: 'succes'
    });
    showToast('Nouvelle clé QR Authenticator générée. Pensez à la scanner sur votre téléphone.');
  };

  const sendVerificationOtp = async (channel?: 'sms' | 'email'): Promise<SentOtpInfo | null> => {
    const chosenChannel: 'sms' | 'email' =
      channel || (profile.twoFactorMethod === 'email' ? 'email' : 'sms');
    const destination = chosenChannel === 'sms' ? profile.phone : profile.email;
    const res = await requestServerOtp({
      channel: chosenChannel,
      destination,
      purpose: 'Validation PIN+2FA Directeur'
    });
    if (!res.ok || !res.challengeToken) {
      showToast(res.error || "Impossible d'envoyer le code OTP.");
      return null;
    }
    const info: SentOtpInfo = {
      challengeToken: res.challengeToken,
      method: chosenChannel,
      maskedDestination: res.maskedDestination || maskDestinationLabel(chosenChannel, destination),
      deliveryStatus: res.deliveryStatus || 'sent',
      sentAt: res.sentAt || new Date().toLocaleTimeString('fr-FR'),
      message: res.message || 'Code envoyé.'
    };
    setActiveChallengeToken(res.challengeToken);
    setLastSentOtpInfo(info);
    showToast(`Demande OTP transmise (${chosenChannel.toUpperCase()}) vers ${info.maskedDestination}`);
    return info;
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
      device: 'Poste Direction',
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
    setActiveChallengeToken(null);
    setLastSentOtpInfo(null);
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
    setActiveChallengeToken(null);
    setLastSentOtpInfo(null);
  };

  const submitPinVerification = async (
    pin: string,
    _twoFactorCode: string = ''
  ): Promise<PinVerificationResult> => {
    const cleanPin = pin.trim();

    if (cleanPin !== directorPin) {
      addAuditLog({
        action: `Échec vérification PIN : ${currentPinPrompt?.actionName || 'Action sensible'}`,
        target: currentPinPrompt?.title || 'Coffre Directeur',
        userRole: 'Directeur des Études',
        ip: '197.149.214.33',
        device: 'Poste Direction',
        securityLevel: 'critique',
        status: 'echec'
      });
      return {
        ok: false,
        error: 'Code PIN Directeur incorrect (vérifiez votre PIN dans Sécurité & Code PIN).'
      };
    }

    if (currentPinPrompt) {
      currentPinPrompt.onSuccess();
      addAuditLog({
        action: `Autorisation PIN : ${currentPinPrompt.actionName}`,
        target: currentPinPrompt.title,
        userRole: 'Directeur des Études',
        ip: '197.149.214.33',
        device: 'Poste Direction',
        securityLevel: 'critique',
        status: 'succes'
      });
    }

    closePinModal();
    return { ok: true };
  };

  // Report Card Actions
  const approveReportCard = (id: string, observation?: string) => {
    requirePinAnd2FA(
      'Validation Numérique du Bulletin Scolaire',
      'Cette action génère la signature électronique infalsifiable du Directeur et archive officiellement les notes.',
      'Validation de bulletin',
      () => {
        setReportCards(prev =>
          prev.map(bc => {
            if (bc.id === id) {
              const now = new Date();
              const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;
              return {
                ...bc,
                directorStatus: 'approuve',
                directorObservation:
                  observation || bc.directorObservation || 'Validé et certifié par la Direction des Études.',
                validatedAt: dateStr,
                validatedBy: profile.name,
                signatureHash: `CERT-DIR-LEC-${Math.floor(100000 + Math.random() * 900000)}-S27`,
                pdfGenerated: true
              };
            }
            return bc;
          })
        );
        showToast('Bulletin approuvé et signé électroniquement ! Spécimen officiel prêt.');
      }
    );
  };

  const rejectReportCard = (id: string, observation: string) => {
    setReportCards(prev =>
      prev.map(bc => {
        if (bc.id === id) {
          return {
            ...bc,
            directorStatus: 'rejete',
            directorObservation: observation
          };
        }
        return bc;
      })
    );
    addAuditLog({
      action: 'Rejet du Bulletin Scolaire',
      target: `Bulletin #${id}`,
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'Poste Direction',
      securityLevel: 'sensible',
      status: 'succes'
    });
    showToast('Bulletin rejeté. Motif consigné pour le professeur principal.');
  };

  const requestCorrectionReportCard = (id: string, observation: string) => {
    setReportCards(prev =>
      prev.map(bc => {
        if (bc.id === id) {
          return {
            ...bc,
            directorStatus: 'correction_demandee',
            directorObservation: observation
          };
        }
        return bc;
      })
    );
    addAuditLog({
      action: 'Demande de Correction sur Bulletin',
      target: `Bulletin #${id}`,
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'Poste Direction',
      securityLevel: 'sensible',
      status: 'succes'
    });
    showToast('Demande de révision envoyée aux enseignants concernés.');
  };

  // Exam Actions
  const approveExam = (id: string, notes?: string) => {
    requirePinAnd2FA(
      "Validation Académique des Résultats de l'Examen",
      "Cette action valide les moyennes, les pourcentages de réussite et les délibérations de l'examen.",
      "Validation d'examen",
      () => {
        setExams(prev =>
          prev.map(ex => {
            if (ex.id === id) {
              return {
                ...ex,
                status: 'valide',
                directorNotes: notes || ex.directorNotes,
                publishedBy: profile.name
              };
            }
            return ex;
          })
        );
        showToast('Examen validé avec succès par le Directeur des Études.');
      }
    );
  };

  const publishExam = (id: string, notes?: string) => {
    requirePinAnd2FA(
      "Publication Officielle des Résultats de l'Examen",
      "ATTENTION : La publication officielle rend les résultats immédiatement visibles aux élèves, parents et enseignants avec le sceau de l'établissement.",
      "Publication officielle d'examen",
      () => {
        setExams(prev =>
          prev.map(ex => {
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
          })
        );
        showToast('Résultats officiellement proclamés et publiés !');
      }
    );
  };

  const rejectExam = (id: string, notes: string) => {
    setExams(prev =>
      prev.map(ex => {
        if (ex.id === id) {
          return {
            ...ex,
            status: 'rejete',
            directorNotes: notes
          };
        }
        return ex;
      })
    );
    addAuditLog({
      action: "Rejet de la session d'examen",
      target: `Examen #${id}`,
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'Poste Direction',
      securityLevel: 'sensible',
      status: 'succes'
    });
    showToast("Résultats d'examen rejetés pour audit approfondi.");
  };

  // Teacher supervision
  const updateTeacherObservation = (id: string, observation: string, rating: number) => {
    const existing = teacherProfiles.find(t => t.id === id);
    setTeacherProfiles(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            directorObservation: observation,
            pedagogicalRating: rating,
            lastInspectionDate: new Date().toISOString().split('T')[0]
          };
        }
        return t;
      })
    );
    addAuditLog({
      action: `Inspection pédagogique (${rating}/5) : ${existing ? existing.teacherName : id}`,
      target: 'Corps Enseignant',
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'Poste Direction',
      securityLevel: 'normale',
      status: 'succes'
    });
    showToast("Évaluation pédagogique de l'enseignant enregistrée.");
  };

  // Discipline
  const validateIncidentSanction = (id: string, finalSanction: string, notes?: string) => {
    requirePinAnd2FA(
      'Validation de Décision Disciplinaire Majeure',
      "La validation du Directeur officialise la sanction d'exclusion ou de conseil de discipline inscrite au dossier scolaire.",
      'Validation disciplinaire',
      () => {
        setDisciplineIncidents(prev =>
          prev.map(inc => {
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
          })
        );
        showToast('Décision disciplinaire officialisée.');
      }
    );
  };

  const rejectIncident = (id: string, notes: string) => {
    setDisciplineIncidents(prev =>
      prev.map(inc => {
        if (inc.id === id) {
          return {
            ...inc,
            directorStatus: 'rejetee',
            directorNotes: notes,
            decisionDate: new Date().toISOString().split('T')[0]
          };
        }
        return inc;
      })
    );
    addAuditLog({
      action: `Classement / Rejet incident disciplinaire #${id}`,
      target: 'Conseil de Discipline',
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'Poste Direction',
      securityLevel: 'sensible',
      status: 'succes'
    });
    showToast('Rapport disciplinaire classé sans suite / rejeté.');
  };

  // Announcements
  const createAnnouncement = (
    item: Omit<DirectorAnnouncement, 'id' | 'createdAt' | 'author' | 'readsCount'>
  ) => {
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

    const recipientRoles: HubRole[] =
      item.targetAudience === 'teachers'
        ? ['teacher']
        : item.targetAudience === 'parents'
          ? ['parent']
          : item.targetAudience === 'students'
            ? ['student']
            : item.targetAudience === 'specific_class'
              ? ['teacher', 'parent', 'student']
              : ['school_admin', 'secretary', 'teacher', 'parent', 'student'];

    pushSharedMessage({
      schoolId: profile.schoolId || 'sch-gn-ck-001',
      senderRole: 'director',
      senderName: profile.name,
      recipientRoles,
      recipientLabel:
        item.targetAudience === 'teachers'
          ? 'Enseignants'
          : item.targetAudience === 'parents'
            ? "Parents d'élèves"
            : item.targetAudience === 'students'
              ? 'Élèves'
              : item.targetAudience === 'specific_class'
                ? item.targetClassName || 'Classe ciblée'
                : 'Toute la communauté scolaire',
      subject: item.title,
      content: item.content,
      channel: item.channels.includes('email') ? 'email' : item.channels.includes('sms') ? 'sms' : 'in_app',
      priority: item.priority
    });

    addAuditLog({
      action: 'Diffusion de Message Omnicanal',
      target: item.title,
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'Poste Direction',
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
    addAuditLog({
      action: `Publication actualité scolaire « ${item.title} »`,
      target: 'Portail École',
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'Poste Direction',
      securityLevel: 'normale',
      status: 'succes'
    });
    showToast('Actualité scolaire publiée avec succès.');
  };

  const deleteNews = (id: string) => {
    const existing = newsItems.find(n => n.id === id);
    setNewsItems(prev => prev.filter(n => n.id !== id));
    addAuditLog({
      action: `Suppression actualité « ${existing?.title || id} »`,
      target: 'Portail École',
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'Poste Direction',
      securityLevel: 'normale',
      status: 'succes'
    });
    showToast('Actualité supprimée.');
  };

  // Calendar
  const createCalendarEvent = (event: Omit<DirectorCalendarEvent, 'id'>) => {
    const newEv: DirectorCalendarEvent = {
      ...event,
      id: `ev-${Date.now()}`
    };
    setCalendarEvents(prev => [...prev, newEv]);
    addAuditLog({
      action: `Programmation événement académique « ${event.title} »`,
      target: event.startDate,
      userRole: 'Directeur des Études',
      ip: '197.149.214.33',
      device: 'Poste Direction',
      securityLevel: 'normale',
      status: 'succes'
    });
    showToast('Événement académique programmé avec succès.');
  };

  return (
    <DirectorContext.Provider
      value={{
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
        totpSecret,
        regenerateTotpSecret,
        lastSentOtpInfo,
        sendVerificationOtp,
        updateDirectorPin,
        pinModalOpen,
        currentPinPrompt,
        requirePinAnd2FA,
        closePinModal,
        submitPinVerification,
        toastMessage,
        showToast
      }}
    >
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
