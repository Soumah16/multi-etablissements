import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  StudentNavTab, 
  StudentProfile, 
  StudentCourseResource, 
  StudentHomeworkSubmission, 
  StudentGradeRecord, 
  StudentAttendanceItem 
} from '../types/student';
import { 
  initialStudentProfile, 
  initialStudentCourses, 
  initialStudentHomeworks, 
  initialStudentGrades, 
  initialStudentAttendance 
} from '../data/studentMockData';
import { subscribeStorageKey, usePersistedState } from '../utils/storage';
import { propagateRoleProfileToAccount } from '../utils/accountSync';
import {
  HubRole,
  SHARED_HOMEWORK_SUBMISSIONS_KEY,
  SHARED_MESSAGES_KEY,
  SharedHomeworkSubmission,
  SharedMessage,
  loadHomeworkSubmissionRecords,
  loadSharedMessages,
  pushHomeworkSubmissionRecord,
  pushSharedMessage
} from '../utils/communicationHub';
import { recordGlobalAuditLog } from '../utils/auditLogger';

interface StudentContextType {
  activeStudentTab: StudentNavTab;
  setActiveStudentTab: (tab: StudentNavTab) => void;
  profile: StudentProfile;
  updateProfilePhoto: (newPhotoUrl: string) => void;
  courses: StudentCourseResource[];
  homeworks: StudentHomeworkSubmission[];
  submitHomework: (
    homeworkId: string, 
    fileName: string, 
    fileNote?: string, 
    fileData?: string, 
    fileType?: string, 
    fileSize?: string
  ) => void;
  grades: StudentGradeRecord[];
  attendances: StudentAttendanceItem[];
  messages: { id: string; sender: string; text: string; time: string; isStudent: boolean }[];
  sendMessage: (text: string, recipient: string) => void;
  notifications: { id: string; title: string; text: string; time: string; type: string; read: boolean }[];
  markNotificationRead: (id: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStudentTab, setActiveStudentTab] = useState<StudentNavTab>('dashboard');
  const [profile, setProfile] = usePersistedState<StudentProfile>('smartschool_student_profile_v1', initialStudentProfile);
  const [courses] = useState<StudentCourseResource[]>(initialStudentCourses);
  const [homeworks, setHomeworks] = usePersistedState<StudentHomeworkSubmission[]>('smartschool_student_homeworks_v1', initialStudentHomeworks);
  const [grades] = useState<StudentGradeRecord[]>(initialStudentGrades);
  const [attendances] = useState<StudentAttendanceItem[]>(initialStudentAttendance);
  const [messages, setMessages] = usePersistedState<{ id: string; sender: string; text: string; time: string; isStudent: boolean }[]>(
    'smartschool_student_messages_v1',
    [
      {
        id: 'm-1',
        sender: 'M. Mamadou Lamarana Diallo (Maths)',
        text: 'Bonjour Fatoumata, n’hésite pas à revoir l’exercice 4 sur les intégrales pour la composition de vendredi.',
        time: 'Hier 16:30',
        isStudent: false
      },
      {
        id: 'm-2',
        sender: 'Fatoumata Binta Diallo',
        text: 'Merci beaucoup M. Diallo, j’ai appliqué la formule d’intégration par parties et j’ai téléversé ma copie sur le portail.',
        time: 'Hier 21:15',
        isStudent: true
      }
    ],
    loaded => (Array.isArray(loaded) && loaded.length > 0 ? loaded : [
      {
        id: 'm-1',
        sender: 'M. Mamadou Lamarana Diallo (Maths)',
        text: 'Bonjour Fatoumata, n’hésite pas à revoir l’exercice 4 sur les intégrales pour la composition de vendredi.',
        time: 'Hier 16:30',
        isStudent: false
      },
      {
        id: 'm-2',
        sender: 'Fatoumata Binta Diallo',
        text: 'Merci beaucoup M. Diallo, j’ai appliqué la formule d’intégration par parties et j’ai téléversé ma copie sur le portail.',
        time: 'Hier 21:15',
        isStudent: true
      }
    ])
  );
  const [notifications, setNotifications] = usePersistedState(
    'smartschool_student_notifications_v1',
    [
      {
        id: 'not-1',
        title: 'Nouvelle note disponible',
        text: 'Composition de Mathématiques Trimestre 1 : 18.5/20',
        time: 'Il y a 2 heures',
        type: 'grade',
        read: false
      },
      {
        id: 'not-2',
        title: 'Nouveau support de cours publié',
        text: 'Dr. Traoré a publié : Chapitre 3 Physique - Champs B',
        time: 'Hier',
        type: 'course',
        read: false
      },
      {
        id: 'not-3',
        title: 'Rappel Devoir Maison',
        text: 'Devoir de Physique à rendre avant le 08 Novembre',
        time: 'Il y a 2 jours',
        type: 'homework',
        read: true
      }
    ]
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const syncIncomingMessages = (list: SharedMessage[]) => {
      const relevant = list.filter(
        m => m.senderRole !== 'student' && m.recipientRoles.includes('student')
      );
      if (relevant.length === 0) return;
      setNotifications(prev => {
        const ids = new Set(prev.map(n => n.id));
        const additions = relevant
          .filter(m => !ids.has(`smsg-${m.id}`))
          .map(m => ({
            id: `smsg-${m.id}`,
            title: m.subject,
            text: `${m.senderName} : ${m.content}`,
            time: new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            type: 'course',
            read: false
          }));
        return additions.length > 0 ? [...additions, ...prev].slice(0, 60) : prev;
      });
      setMessages(prev => {
        const ids = new Set(prev.map(m => m.id));
        const additions = relevant
          .filter(m => m.senderRole === 'teacher' && !ids.has(`smsg-${m.id}`))
          .map(m => ({
            id: `smsg-${m.id}`,
            sender: m.senderName,
            text: `${m.subject} — ${m.content}`,
            time: new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            isStudent: false
          }));
        return additions.length > 0 ? [...prev, ...additions] : prev;
      });
    };

    const syncGradedHomeworks = (subs: SharedHomeworkSubmission[]) => {
      const mine = subs.filter(
        s =>
          s.status === 'corrige' &&
          s.studentMatricule.toLowerCase() === profile.matricule.toLowerCase()
      );
      if (mine.length === 0) return;
      setHomeworks(prev =>
        prev.map(hw => {
          const match = mine.find(
            s =>
              s.homeworkId === hw.id ||
              (s.subject.toLowerCase() === hw.subject.toLowerCase() &&
                s.homeworkTitle.toLowerCase() === hw.title.toLowerCase())
          );
          if (!match) return hw;
          return {
            ...hw,
            status: 'corrige',
            score: match.grade,
            teacherFeedback: match.teacherComment || hw.teacherFeedback
          };
        })
      );
    };

    syncIncomingMessages(loadSharedMessages());
    syncGradedHomeworks(loadHomeworkSubmissionRecords());

    const unsubMsgs = subscribeStorageKey(SHARED_MESSAGES_KEY, data => {
      if (Array.isArray(data)) syncIncomingMessages(data as SharedMessage[]);
    });
    const unsubHw = subscribeStorageKey(SHARED_HOMEWORK_SUBMISSIONS_KEY, data => {
      if (Array.isArray(data)) syncGradedHomeworks(data as SharedHomeworkSubmission[]);
    });

    return () => {
      unsubMsgs();
      unsubHw();
    };
  }, [profile.matricule, setHomeworks, setMessages, setNotifications]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const updateProfilePhoto = (newPhotoUrl: string) => {
    const nextProfile: StudentProfile = { ...profile, photo: newPhotoUrl };
    setProfile(nextProfile);
    propagateRoleProfileToAccount(
      'student',
      nextProfile,
      { matricule: profile.matricule }
    );
    recordGlobalAuditLog({
      action: 'Mise à jour photo de profil Élève',
      target: `${profile.firstName} ${profile.lastName}`,
      actorName: `${profile.firstName} ${profile.lastName}`,
      actorRole: 'student',
      actorMatricule: profile.matricule,
      type: 'admin',
      severity: 'info'
    });
    showToast('Photo de profil élève mise à jour.');
  };

  const submitHomework = (
    homeworkId: string, 
    fileName: string, 
    fileNote?: string, 
    fileData?: string, 
    fileType?: string, 
    fileSize?: string
  ) => {
    const todayStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const targetHw = homeworks.find(h => h.id === homeworkId);
    setHomeworks(prev => prev.map(hw => {
      if (hw.id === homeworkId) {
        return {
          ...hw,
          status: 'soumis',
          submittedFile: fileName,
          submittedFileData: fileData,
          submittedFileType: fileType,
          submittedFileSize: fileSize,
          submissionDate: todayStr,
          submissionNote: fileNote,
          teacherFeedback: fileNote ? `Note de l'élève : « ${fileNote} ». En attente de correction.` : 'Copie déposée sur le portail. En attente de correction.'
        };
      }
      return hw;
    }));

    pushHomeworkSubmissionRecord({
      homeworkId,
      homeworkTitle: targetHw?.title || 'Devoir Maison',
      subject: targetHw?.subject || 'Matière',
      studentId: profile.id,
      studentName: `${profile.firstName} ${profile.lastName}`,
      studentMatricule: profile.matricule,
      fileName,
      fileUrl: fileData || '#',
      fileType: fileType || 'pdf',
      fileNote,
      maxScore: targetHw?.maxScore || 20
    });

    recordGlobalAuditLog({
      action: `Remise devoir élève : ${targetHw?.title || homeworkId}`,
      target: fileName,
      actorName: `${profile.firstName} ${profile.lastName}`,
      actorRole: 'student',
      actorMatricule: profile.matricule,
      type: 'admin',
      severity: 'info'
    });
    showToast(`Devoir « ${fileName} » remis avec succès.`);
  };

  const sendMessage = (text: string, recipient: string) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: `${profile.firstName} ${profile.lastName}`,
      text,
      time: 'À l’instant',
      isStudent: true
    };
    setMessages(prev => [...prev, newMsg]);
    const targetRole: HubRole = recipient.toLowerCase().includes('surveillant')
      ? 'supervisor'
      : 'teacher';
    pushSharedMessage({
      schoolId: 'sch-gn-ck-001',
      senderRole: 'student',
      senderName: `${profile.firstName} ${profile.lastName}`,
      recipientRoles: [targetRole],
      recipientLabel: recipient,
      subject: `Message élève pour ${recipient}`,
      content: text,
      channel: 'in_app',
      priority: 'normal'
    });
    recordGlobalAuditLog({
      action: `Message Élève envoyé à ${recipient}`,
      target: 'Messagerie Élève',
      actorName: `${profile.firstName} ${profile.lastName}`,
      actorRole: 'student',
      actorMatricule: profile.matricule,
      type: 'admin',
      severity: 'info'
    });
    showToast(`Message envoyé à « ${recipient} ».`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <StudentContext.Provider value={{
      activeStudentTab,
      setActiveStudentTab,
      profile,
      updateProfilePhoto,
      courses,
      homeworks,
      submitHomework,
      grades,
      attendances,
      messages,
      sendMessage,
      notifications,
      markNotificationRead,
      toastMessage,
      showToast
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
