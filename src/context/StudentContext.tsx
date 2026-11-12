import React, { createContext, useContext, useState } from 'react';
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
  const [profile, setProfile] = useState<StudentProfile>(initialStudentProfile);
  const [courses] = useState<StudentCourseResource[]>(initialStudentCourses);
  const [homeworks, setHomeworks] = useState<StudentHomeworkSubmission[]>(initialStudentHomeworks);
  const [grades] = useState<StudentGradeRecord[]>(initialStudentGrades);
  const [attendances] = useState<StudentAttendanceItem[]>(initialStudentAttendance);
  const [messages, setMessages] = useState<{ id: string; sender: string; text: string; time: string; isStudent: boolean }[]>([
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
  ]);
  const [notifications, setNotifications] = useState([
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
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const updateProfilePhoto = (newPhotoUrl: string) => {
    setProfile(prev => ({ ...prev, photo: newPhotoUrl }));
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
