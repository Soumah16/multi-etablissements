import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  TeacherNavTab, 
  TeacherProfile, 
  AssignedClass, 
  TeacherStudentRosterItem,
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
  initialTeacherStudents,
  initialTeacherSubjects,
  initialCourses,
  initialLibraryResources,
  initialHomeworkList,
  initialEvaluations, 
  initialLogbookEntries, 
  initialAttendanceSessions, 
  initialStudentProfiles,
  initialSchoolCalendarEvents,
  initialTeacherSchedule, 
  initialTeacherMessages 
} from '../data/teacherMockData';
import { usePersistedState } from '../utils/storage';

interface TeacherContextType {
  activeTeacherTab: TeacherNavTab;
  setActiveTeacherTab: (tab: TeacherNavTab) => void;
  profile: TeacherProfile;
  updateProfile: (updated: Partial<TeacherProfile>) => void;
  classes: AssignedClass[];
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  
  // Tous les élèves des classes du professeur (cloisonnement strict)
  students: TeacherStudentRosterItem[];
  getStudentsByClass: (classId: string) => TeacherStudentRosterItem[];
  getSubjectsForClass: (className: string) => TeacherSubject[];

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
  const [profile, setProfile] = usePersistedState<TeacherProfile>('smartschool_teacher_profile_v1', initialTeacherProfile);
  const [classes] = useState<AssignedClass[]>(initialTeacherClasses);
  const [selectedClassId, setSelectedClassId] = usePersistedState<string>('smartschool_teacher_selected_class_v1', 'cls-tsm');
  const [subjects] = useState<TeacherSubject[]>(initialTeacherSubjects);
  const [rawStudents] = useState<TeacherStudentRosterItem[]>(initialTeacherStudents);
  const [rawCourses, setCourses] = usePersistedState<CourseModuleItem[]>('smartschool_teacher_courses_v1', initialCourses);
  const [libraryResources, setLibraryResources] = usePersistedState<PedagogicalResource[]>('smartschool_teacher_resources_v1', initialLibraryResources);
  const [rawEvaluations, setEvaluations] = usePersistedState<EvaluationSession[]>('smartschool_teacher_evaluations_v1', initialEvaluations);
  const [rawLogbookEntries, setLogbookEntries] = usePersistedState<LogbookEntry[]>('smartschool_teacher_logbook_v1', initialLogbookEntries);
  const [attendanceByClass, setAttendanceByClass] = usePersistedState<Record<string, AttendanceSession>>('smartschool_teacher_attendance_v1', initialAttendanceSessions);
  const [rawHomeworkList, setHomeworkList] = usePersistedState<HomeworkItem[]>('smartschool_teacher_homework_v1', initialHomeworkList);
  const [rawStudentProfiles, setStudentProfiles] = usePersistedState<StudentPedagogicalProfile[]>('smartschool_teacher_student_profiles_v1', initialStudentProfiles);
  const [calendarEvents, setCalendarEvents] = usePersistedState<SchoolCalendarEvent[]>('smartschool_teacher_calendar_v1', initialSchoolCalendarEvents);
  const [rawSchedule] = useState<ScheduleSlot[]>(initialTeacherSchedule);

  // Strict Teacher Scoping: only assigned classes, assigned subjects, and enrolled students in those classes
  const allowedClassIds = new Set(classes.map(c => c.id));
  const allowedClassNames = new Set(classes.map(c => c.name));
  const allowedSubjectNames = new Set(subjects.map(s => s.name));

  const students = rawStudents.filter(s => allowedClassIds.has(s.classId));
  const getStudentsByClass = (classId: string) => students.filter(s => s.classId === classId);
  const getSubjectsForClass = (className: string) => subjects.filter(s => s.classNames.includes(className));

  const courses = rawCourses.filter(c => allowedClassIds.has(c.classId) && allowedSubjectNames.has(c.subject));
  const evaluations = rawEvaluations.filter(e => allowedClassIds.has(e.classId) && allowedSubjectNames.has(e.subject));
  const logbookEntries = rawLogbookEntries.filter(l => allowedClassIds.has(l.classId) && allowedSubjectNames.has(l.subject));
  const homeworkList = rawHomeworkList.filter(h => allowedClassIds.has(h.classId) && allowedSubjectNames.has(h.subject));
  const studentProfiles = rawStudentProfiles.filter(p => allowedClassNames.has(p.className));
  const schedule = rawSchedule.filter(s => allowedClassNames.has(s.className) && allowedSubjectNames.has(s.subject));

  const activeAttendanceClassId = allowedClassIds.has(selectedClassId) ? selectedClassId : (classes[0]?.id || 'cls-tsm');
  const attendanceSession = attendanceByClass[activeAttendanceClassId] || Object.values(attendanceByClass)[0];
  const [messages, setMessages] = usePersistedState<TeacherMessage[]>(
    'smartschool_teacher_messages_v1',
    initialTeacherMessages,
    loaded => (Array.isArray(loaded) && loaded.length > 0 ? loaded : initialTeacherMessages)
  );
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

  // Library (Read-only for Teachers — modifications strictly reserved to school Librarian Admin)
  const addLibraryResource = (_res: Omit<PedagogicalResource, 'id' | 'downloadCount' | 'uploadedAt'>) => {
    triggerToast("Accès refusé : Seul l'Admin de la Bibliothèque de l'école peut ajouter des ressources.");
  };

  const deleteLibraryResource = (_id: string) => {
    triggerToast("Accès refusé : Seul l'Admin de la Bibliothèque de l'école peut supprimer des ressources.");
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

  // Attendance (per-class roll call with all enrolled students)
  const updateAttendanceStatus = (
    studentId: string, 
    status: 'present' | 'absent' | 'retard' | 'justifie', 
    minutesLate?: number, 
    motif?: string
  ) => {
    setAttendanceByClass(prev => {
      const current = prev[activeAttendanceClassId];
      if (!current) return prev;
      return {
        ...prev,
        [activeAttendanceClassId]: {
          ...current,
          records: current.records.map(rec => {
            if (rec.studentId !== studentId) return rec;
            return {
              ...rec,
              status,
              minutesLate: status === 'retard' ? (minutesLate || 10) : undefined,
              motif: motif || (status === 'absent' ? 'Non justifié' : undefined)
            };
          })
        }
      };
    });
  };

  const completeAttendanceSession = () => {
    setAttendanceByClass(prev => {
      const current = prev[activeAttendanceClassId];
      if (!current) return prev;
      return {
        ...prev,
        [activeAttendanceClassId]: {
          ...current,
          isCompleted: true
        }
      };
    });
    triggerToast(`Feuille d'appel de ${attendanceSession?.className || ''} clôturée et transmise à la Vie Scolaire.`);
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
        students,
        getStudentsByClass,
        getSubjectsForClass,
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
