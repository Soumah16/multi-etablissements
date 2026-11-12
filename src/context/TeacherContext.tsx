import React, { createContext, useContext, useState } from 'react';
import { 
  TeacherNavTab, 
  TeacherProfile, 
  AssignedClass, 
  TeacherSubject,
  CourseModuleItem,
  PedagogicalResource,
  HomeworkItem,
  HomeworkSubmission,
  EvaluationSession, 
  LogbookEntry, 
  AttendanceSession, 
  StudentPedagogicalProfile,
  SchoolCalendarEvent,
  ScheduleSlot, 
  TeacherMessage 
} from '../types/teacher';
import { 
  initialTeacherProfile, 
  initialTeacherClasses, 
  initialTeacherSubjects,
  initialCourses,
  initialLibraryResources,
  initialHomeworkList,
  initialEvaluations, 
  initialLogbookEntries, 
  initialAttendanceSession, 
  initialStudentProfiles,
  initialSchoolCalendarEvents,
  initialTeacherSchedule, 
  initialTeacherMessages 
} from '../data/teacherMockData';

interface TeacherContextType {
  activeTeacherTab: TeacherNavTab;
  setActiveTeacherTab: (tab: TeacherNavTab) => void;
  profile: TeacherProfile;
  updateProfile: (updated: Partial<TeacherProfile>) => void;
  classes: AssignedClass[];
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  
  // Mes Matières
  subjects: TeacherSubject[];
  
  // Gestion des Cours
  courses: CourseModuleItem[];
  addCourse: (course: Omit<CourseModuleItem, 'id' | 'publishedDate'>) => void;
  deleteCourse: (id: string) => void;
  
  // Bibliothèque E-Learning
  libraryResources: PedagogicalResource[];
  addLibraryResource: (res: Omit<PedagogicalResource, 'id' | 'downloadCount' | 'uploadedAt'>) => void;
  deleteLibraryResource: (id: string) => void;
  incrementDownloadCount: (id: string) => void;

  // Évaluations & Notes
  evaluations: EvaluationSession[];
  addEvaluation: (evalData: Omit<EvaluationSession, 'id' | 'grades' | 'status' | 'isProvisionalPublished'> & { 
    students: { id: string; matricule: string; fullName: string }[];
    status?: EvaluationSession['status'];
    isProvisionalPublished?: boolean;
  }) => void;
  updateStudentGrade: (evalId: string, studentId: string, field: 'interro1' | 'interro2' | 'devoir' | 'composition', val: number) => void;
  updateStudentAppreciation: (evalId: string, studentId: string, text: string) => void;
  deleteStudentGrade: (evalId: string, studentId: string) => void;
  submitEvaluationToDirector: (evalId: string) => void;
  togglePublishProvisionalGrades: (evalId: string) => void;

  // Cahier de Textes
  logbookEntries: LogbookEntry[];
  addLogbookEntry: (entry: Omit<LogbookEntry, 'id' | 'isSigned' | 'status'>) => void;
  signLogbookEntry: (id: string) => void;
  archiveLogbookEntry: (id: string) => void;

  // Présences
  attendanceSession: AttendanceSession;
  updateAttendanceStatus: (studentId: string, status: 'present' | 'absent' | 'retard' | 'justifie', minutesLate?: number, motif?: string) => void;
  completeAttendanceSession: () => void;

  // Devoirs & Remises
  homeworkList: HomeworkItem[];
  addHomework: (hw: Omit<HomeworkItem, 'id' | 'totalSubmissions' | 'evaluatedCount' | 'submissions'>) => void;
  gradeHomeworkSubmission: (homeworkId: string, submissionId: string, grade: number, comment: string) => void;

  // Suivi Pédagogique & Élèves en difficulté
  studentProfiles: StudentPedagogicalProfile[];
  reportStudentToDirection: (studentId: string, reason: string) => void;
  addStudentObservation: (studentId: string, observation: string, recommendation: string) => void;

  // Événements & Examens
  calendarEvents: SchoolCalendarEvent[];
  addCalendarEvent: (evt: Omit<SchoolCalendarEvent, 'id'>) => void;

  // Emploi du temps
  schedule: ScheduleSlot[];

  // Communication
  messages: TeacherMessage[];
  sendMessage: (msg: Omit<TeacherMessage, 'id' | 'sentAt' | 'isRead'>) => void;
  markMessageRead: (id: string) => void;

  // Toast
  toastMessage: string | null;
  triggerToast: (msg: string) => void;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const TeacherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTeacherTab, setActiveTeacherTab] = useState<TeacherNavTab>('dashboard');
  const [profile, setProfile] = useState<TeacherProfile>(initialTeacherProfile);
  const [classes] = useState<AssignedClass[]>(initialTeacherClasses);
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-tsm');
  const [subjects] = useState<TeacherSubject[]>(initialTeacherSubjects);
  const [courses, setCourses] = useState<CourseModuleItem[]>(initialCourses);
  const [libraryResources, setLibraryResources] = useState<PedagogicalResource[]>(initialLibraryResources);
  const [evaluations, setEvaluations] = useState<EvaluationSession[]>(initialEvaluations);
  const [logbookEntries, setLogbookEntries] = useState<LogbookEntry[]>(initialLogbookEntries);
  const [attendanceSession, setAttendanceSession] = useState<AttendanceSession>(initialAttendanceSession);
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>(initialHomeworkList);
  const [studentProfiles, setStudentProfiles] = useState<StudentPedagogicalProfile[]>(initialStudentProfiles);
  const [calendarEvents, setCalendarEvents] = useState<SchoolCalendarEvent[]>(initialSchoolCalendarEvents);
  const [schedule] = useState<ScheduleSlot[]>(initialTeacherSchedule);
  const [messages, setMessages] = useState<TeacherMessage[]>(initialTeacherMessages);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const updateProfile = (updated: Partial<TeacherProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
    triggerToast('Profil enseignant mis à jour avec succès.');
  };

  // Courses
  const addCourse = (course: Omit<CourseModuleItem, 'id' | 'publishedDate'>) => {
    const newCourse: CourseModuleItem = {
      ...course,
      id: `crs-${Date.now()}`,
      publishedDate: new Date().toISOString().substring(0, 10)
    };
    setCourses(prev => [newCourse, ...prev]);
    triggerToast(`Cours "${course.title}" publié avec succès.`);
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    triggerToast('Cours supprimé.');
  };

  // Library
  const addLibraryResource = (res: Omit<PedagogicalResource, 'id' | 'downloadCount' | 'uploadedAt'>) => {
    const newRes: PedagogicalResource = {
      ...res,
      id: `lib-${Date.now()}`,
      downloadCount: 0,
      uploadedAt: new Date().toISOString().substring(0, 10)
    };
    setLibraryResources(prev => [newRes, ...prev]);
    triggerToast(`Ressource "${res.title}" ajoutée à la bibliothèque.`);
  };

  const deleteLibraryResource = (id: string) => {
    setLibraryResources(prev => prev.filter(r => r.id !== id));
    triggerToast('Ressource supprimée de la bibliothèque.');
  };

  const incrementDownloadCount = (id: string) => {
    setLibraryResources(prev => prev.map(r => r.id === id ? { ...r, downloadCount: r.downloadCount + 1 } : r));
  };

  // Evaluations
  const addEvaluation = (
    evalData: Omit<EvaluationSession, 'id' | 'grades' | 'status' | 'isProvisionalPublished'> & { 
      students: { id: string; matricule: string; fullName: string }[];
      status?: EvaluationSession['status'];
      isProvisionalPublished?: boolean;
    }
  ) => {
    const newEvalId = `eval-${Date.now()}`;
    const initialGrades = evalData.students.map(s => ({
      studentId: s.id,
      matricule: s.matricule,
      fullName: s.fullName,
      average: 0,
      appreciation: ''
    }));

    const newSession: EvaluationSession = {
      id: newEvalId,
      title: evalData.title,
      classId: evalData.classId,
      className: evalData.className,
      subject: evalData.subject,
      term: evalData.term,
      coefficient: evalData.coefficient,
      maxScore: evalData.maxScore,
      date: evalData.date,
      durationMinutes: evalData.durationMinutes || 90,
      type: evalData.type,
      status: 'en_cours',
      isProvisionalPublished: false,
      grades: initialGrades
    };

    setEvaluations(prev => [newSession, ...prev]);
    triggerToast(`Session d'évaluation créée pour ${evalData.className}`);
  };

  const updateStudentGrade = (
    evalId: string, 
    studentId: string, 
    field: 'interro1' | 'interro2' | 'devoir' | 'composition', 
    val: number
  ) => {
    setEvaluations(prev => prev.map(ev => {
      if (ev.id !== evalId) return ev;
      const updatedGrades = ev.grades.map(g => {
        if (g.studentId !== studentId) return g;
        const updatedStudent = { ...g, [field]: val };
        
        const scores: number[] = [];
        if (updatedStudent.interro1 !== undefined) scores.push(updatedStudent.interro1);
        if (updatedStudent.interro2 !== undefined) scores.push(updatedStudent.interro2);
        if (updatedStudent.devoir !== undefined) scores.push(updatedStudent.devoir);
        if (updatedStudent.composition !== undefined) {
          scores.push(updatedStudent.composition);
          scores.push(updatedStudent.composition); // coefficient x2 pour composition
        }

        const avg = scores.length > 0 
          ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)) 
          : 0;

        return {
          ...updatedStudent,
          average: avg
        };
      });

      // Recalculate ranks
      const sortedByAvg = [...updatedGrades].sort((a, b) => b.average - a.average);
      const rankedGrades = updatedGrades.map(g => {
        const rankIndex = sortedByAvg.findIndex(item => item.studentId === g.studentId);
        return {
          ...g,
          rank: rankIndex + 1
        };
      });

      return {
        ...ev,
        grades: rankedGrades
      };
    }));
  };

  const updateStudentAppreciation = (evalId: string, studentId: string, text: string) => {
    setEvaluations(prev => prev.map(ev => {
      if (ev.id !== evalId) return ev;
      return {
        ...ev,
        grades: ev.grades.map(g => g.studentId === studentId ? { ...g, appreciation: text } : g)
      };
    }));
  };

  const deleteStudentGrade = (evalId: string, studentId: string) => {
    setEvaluations(prev => prev.map(ev => {
      if (ev.id !== evalId) return ev;
      return {
        ...ev,
        grades: ev.grades.map(g => {
          if (g.studentId !== studentId) return g;
          return {
            ...g,
            interro1: undefined,
            interro2: undefined,
            devoir: undefined,
            composition: undefined,
            average: 0,
            appreciation: ''
          };
        })
      };
    }));
    triggerToast('Notes de l\'élève réinitialisées.');
  };

  const submitEvaluationToDirector = (evalId: string) => {
    setEvaluations(prev => prev.map(ev => {
      if (ev.id !== evalId) return ev;
      return { ...ev, status: 'soumis_direction' };
    }));
    triggerToast('Notes soumises à la validation du Directeur des Études.');
  };

  const togglePublishProvisionalGrades = (evalId: string) => {
    setEvaluations(prev => prev.map(ev => {
      if (ev.id !== evalId) return ev;
      const nextState = !ev.isProvisionalPublished;
      return { ...ev, isProvisionalPublished: nextState };
    }));
    triggerToast('Visibilité des notes provisoires mise à jour.');
  };

  // Logbook
  const addLogbookEntry = (entry: Omit<LogbookEntry, 'id' | 'isSigned' | 'status'>) => {
    const newEntry: LogbookEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      isSigned: true,
      signedAt: new Date().toISOString(),
      status: 'actif'
    };
    setLogbookEntries(prev => [newEntry, ...prev]);
    triggerToast('Séance inscrite au Cahier de textes et signée numériquement.');
  };

  const signLogbookEntry = (id: string) => {
    setLogbookEntries(prev => prev.map(item => {
      if (item.id !== id) return item;
      return {
        ...item,
        isSigned: true,
        signedAt: new Date().toISOString()
      };
    }));
    triggerToast('Séance visée et signée.');
  };

  const archiveLogbookEntry = (id: string) => {
    setLogbookEntries(prev => prev.map(item => item.id === id ? { ...item, status: 'archive' } : item));
    triggerToast('Séance archivée dans l\'historique.');
  };

  // Attendance
  const updateAttendanceStatus = (
    studentId: string, 
    status: 'present' | 'absent' | 'retard' | 'justifie', 
    minutesLate?: number, 
    motif?: string
  ) => {
    setAttendanceSession(prev => ({
      ...prev,
      records: prev.records.map(rec => {
        if (rec.studentId !== studentId) return rec;
        return {
          ...rec,
          status,
          minutesLate: status === 'retard' ? (minutesLate || 10) : undefined,
          motif: motif || (status === 'absent' ? 'Non justifié' : undefined)
        };
      })
    }));
  };

  const completeAttendanceSession = () => {
    setAttendanceSession(prev => ({
      ...prev,
      isCompleted: true
    }));
    triggerToast('Feuille d\'appel clôturée et transmise à la Vie Scolaire.');
  };

  // Homework
  const addHomework = (hw: Omit<HomeworkItem, 'id' | 'totalSubmissions' | 'evaluatedCount' | 'submissions'>) => {
    const newItem: HomeworkItem = {
      ...hw,
      id: `hw-${Date.now()}`,
      totalSubmissions: 0,
      evaluatedCount: 0,
      submissions: []
    };
    setHomeworkList(prev => [newItem, ...prev]);
    triggerToast(`Devoir "${hw.title}" publié avec succès.`);
  };

  const gradeHomeworkSubmission = (homeworkId: string, submissionId: string, grade: number, comment: string) => {
    setHomeworkList(prev => prev.map(hw => {
      if (hw.id !== homeworkId) return hw;
      const updatedSubmissions = hw.submissions.map(sub => {
        if (sub.id !== submissionId) return sub;
        return {
          ...sub,
          grade,
          teacherComment: comment,
          status: 'corrige' as const
        };
      });
      const evaluatedCount = updatedSubmissions.filter(s => s.status === 'corrige').length;
      return {
        ...hw,
        submissions: updatedSubmissions,
        evaluatedCount
      };
    }));
    triggerToast('Copie notée et corrigé renvoyé à l\'élève.');
  };

  // Student difficulty monitoring
  const reportStudentToDirection = (studentId: string, reason: string) => {
    setStudentProfiles(prev => prev.map(prof => {
      if (prof.studentId !== studentId) return prof;
      return {
        ...prof,
        reportedToDirection: true,
        difficultyReason: reason,
        isDifficulty: true
      };
    }));
    triggerToast('Signalement transmis au Directeur des Études & Vie Scolaire.');
  };

  const addStudentObservation = (studentId: string, observation: string, recommendation: string) => {
    setStudentProfiles(prev => prev.map(prof => {
      if (prof.studentId !== studentId) return prof;
      return {
        ...prof,
        observations: [...prof.observations, observation],
        recommendations: [...prof.recommendations, recommendation]
      };
    }));
    triggerToast('Observation et recommandation enregistrées.');
  };

  // Calendar
  const addCalendarEvent = (evt: Omit<SchoolCalendarEvent, 'id'>) => {
    const newEvent: SchoolCalendarEvent = {
      ...evt,
      id: `evt-${Date.now()}`
    };
    setCalendarEvents(prev => [newEvent, ...prev]);
    triggerToast(`Événement "${evt.title}" programmé.`);
  };

  // Messaging
  const sendMessage = (msg: Omit<TeacherMessage, 'id' | 'sentAt' | 'isRead'>) => {
    const newMsg: TeacherMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: true
    };
    setMessages(prev => [newMsg, ...prev]);
    triggerToast(`Message envoyé avec succès via ${msg.channel}.`);
  };

  const markMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  return (
    <TeacherContext.Provider
      value={{
        activeTeacherTab,
        setActiveTeacherTab,
        profile,
        updateProfile,
        classes,
        selectedClassId,
        setSelectedClassId,
        subjects,
        courses,
        addCourse,
        deleteCourse,
        libraryResources,
        addLibraryResource,
        deleteLibraryResource,
        incrementDownloadCount,
        evaluations,
        addEvaluation,
        updateStudentGrade,
        updateStudentAppreciation,
        deleteStudentGrade,
        submitEvaluationToDirector,
        togglePublishProvisionalGrades,
        logbookEntries,
        addLogbookEntry,
        signLogbookEntry,
        archiveLogbookEntry,
        attendanceSession,
        updateAttendanceStatus,
        completeAttendanceSession,
        homeworkList,
        addHomework,
        gradeHomeworkSubmission,
        studentProfiles,
        reportStudentToDirection,
        addStudentObservation,
        calendarEvents,
        addCalendarEvent,
        schedule,
        messages,
        sendMessage,
        markMessageRead,
        toastMessage,
        triggerToast
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error('useTeacher must be used within a TeacherProvider');
  }
  return context;
};
