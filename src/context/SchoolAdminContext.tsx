import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { 
  StaffMember, 
  SchoolClass, 
  SchoolSubject, 
  SchoolRoom, 
  AcademicYear, 
  AdministrativeEvent, 
  AdministrativeDocumentTemplate,
  SchoolLoginLog,
  School
} from '../types';
import { 
  initialStaffMembers, 
  initialClasses, 
  initialSubjects, 
  initialRooms, 
  initialAcademicYears, 
  initialAdministrativeEvents, 
  initialDocumentTemplates, 
  initialSchoolLoginLogs 
} from '../data/schoolAdminMockData';

export type SchoolAdminNavTab = 
  | 'dashboard'
  | 'staff'
  | 'classes'
  | 'subjects'
  | 'rooms'
  | 'years'
  | 'assignments'
  | 'documents'
  | 'events'
  | 'reports'
  | 'security'
  | 'settings';

interface SchoolAdminContextType {
  activeSchoolTab: SchoolAdminNavTab;
  setActiveSchoolTab: (tab: SchoolAdminNavTab) => void;
  currentSchool: School;
  setCurrentSchoolId: (id: string) => void;
  
  // PIN Security Modal
  pinModalOpen: boolean;
  setPinModalOpen: (open: boolean) => void;
  pendingPinAction: { description: string; callback: () => void } | null;
  executeWithPin: (actionDescription: string, callback: () => void) => void;
  verifyAndExecutePin: (inputPin: string) => boolean;
  failedPinAttempts: number;
  isTemporarilyBlocked: boolean;
  updateAdminPin: (oldPin: string, newPin: string) => boolean;
  
  // Staff
  staff: StaffMember[];
  createStaff: (member: Omit<StaffMember, 'id' | 'matricule' | 'qrToken' | 'credentialsSent' | 'username'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  toggleStaffStatus: (id: string) => void;
  resetStaffPassword: (id: string) => void;
  deleteStaff: (id: string) => void;
  sendStaffCredentials: (id: string) => void;
  selectedStaffForBadge: StaffMember | null;
  setSelectedStaffForBadge: (staff: StaffMember | null) => void;

  // Classes
  classes: SchoolClass[];
  createClass: (cls: Omit<SchoolClass, 'id'>) => void;
  updateClass: (id: string, updates: Partial<SchoolClass>) => void;
  deleteClass: (id: string) => void;
  archiveClass: (id: string) => void;

  // Subjects
  subjects: SchoolSubject[];
  createSubject: (sub: Omit<SchoolSubject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<SchoolSubject>) => void;
  toggleSubjectActive: (id: string) => void;

  // Rooms
  rooms: SchoolRoom[];
  createRoom: (room: Omit<SchoolRoom, 'id'>) => void;
  updateRoom: (id: string, updates: Partial<SchoolRoom>) => void;
  deleteRoom: (id: string) => void;

  // Academic Years
  academicYears: AcademicYear[];
  openNewAcademicYear: (yearLabel: string, startDate: string, endDate: string) => void;
  closeAcademicYear: (id: string) => void;

  // Assignments
  assignTeacherToClass: (teacherId: string, classId: string) => void;
  assignTeacherToSubject: (teacherId: string, subjectId: string) => void;
  assignPrincipalTeacher: (classId: string, teacherId: string) => void;
  assignRoomToClass: (classId: string, roomId: string) => void;

  // Documents
  documentTemplates: AdministrativeDocumentTemplate[];
  updateDocumentTemplate: (id: string, updates: Partial<AdministrativeDocumentTemplate>) => void;
  viewingDocumentTemplate: AdministrativeDocumentTemplate | null;
  setViewingDocumentTemplate: (doc: AdministrativeDocumentTemplate | null) => void;

  // Events
  events: AdministrativeEvent[];
  createEvent: (ev: Omit<AdministrativeEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;

  // Logs
  schoolLogs: SchoolLoginLog[];
}

const SchoolAdminContext = createContext<SchoolAdminContextType | undefined>(undefined);

export const SchoolAdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { schools, showToast } = useApp();

  const [activeSchoolTab, setActiveSchoolTab] = useState<SchoolAdminNavTab>('dashboard');
  const [currentSchoolId, setCurrentSchoolId] = useState<string>(schools[0]?.id || 'sch-gn-ck-001');

  // Find active school
  const currentSchool = schools.find(s => s.id === currentSchoolId) || schools[0];

  // PIN security states
  const [adminPin, setAdminPin] = useState('123456');
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pendingPinAction, setPendingPinAction] = useState<{ description: string; callback: () => void } | null>(null);
  const [failedPinAttempts, setFailedPinAttempts] = useState(0);
  const [isTemporarilyBlocked, setIsTemporarilyBlocked] = useState(false);

  // Entities states with local storage caching
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('smartschool_staff');
    return saved ? JSON.parse(saved) : initialStaffMembers;
  });

  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('smartschool_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [subjects, setSubjects] = useState<SchoolSubject[]>(() => {
    const saved = localStorage.getItem('smartschool_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [rooms, setRooms] = useState<SchoolRoom[]>(() => {
    const saved = localStorage.getItem('smartschool_rooms');
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() => {
    const saved = localStorage.getItem('smartschool_academic_years');
    return saved ? JSON.parse(saved) : initialAcademicYears;
  });

  const [events, setEvents] = useState<AdministrativeEvent[]>(initialAdministrativeEvents);
  const [documentTemplates, setDocumentTemplates] = useState<AdministrativeDocumentTemplate[]>(initialDocumentTemplates);
  const [schoolLogs, setSchoolLogs] = useState<SchoolLoginLog[]>(initialSchoolLoginLogs);

  const [selectedStaffForBadge, setSelectedStaffForBadge] = useState<StaffMember | null>(null);
  const [viewingDocumentTemplate, setViewingDocumentTemplate] = useState<AdministrativeDocumentTemplate | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('smartschool_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('smartschool_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('smartschool_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('smartschool_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('smartschool_academic_years', JSON.stringify(academicYears));
  }, [academicYears]);

  // Execute with PIN modal trigger
  const executeWithPin = (actionDescription: string, callback: () => void) => {
    if (isTemporarilyBlocked) {
      alert("Accès verrouillé temporairement après 5 tentatives échouées. Patientez 5 minutes.");
      return;
    }
    setPendingPinAction({ description: actionDescription, callback });
    setPinModalOpen(true);
  };

  const verifyAndExecutePin = (inputPin: string): boolean => {
    if (inputPin === adminPin) {
      setFailedPinAttempts(0);
      setPinModalOpen(false);
      if (pendingPinAction) {
        pendingPinAction.callback();
        setPendingPinAction(null);
      }
      return true;
    } else {
      const nextFailed = failedPinAttempts + 1;
      setFailedPinAttempts(nextFailed);
      if (nextFailed >= 5) {
        setIsTemporarilyBlocked(true);
        setTimeout(() => {
          setIsTemporarilyBlocked(false);
          setFailedPinAttempts(0);
        }, 300000); // 5 min
      }
      return false;
    }
  };

  const updateAdminPin = (oldPin: string, newPin: string): boolean => {
    if (oldPin === adminPin && newPin.length === 6 && /^\d+$/.test(newPin)) {
      setAdminPin(newPin);
      showToast("Code PIN Administrateur mis à jour avec succès !");
      return true;
    }
    return false;
  };

  // Staff CRUD
  const createStaff = (memberData: Omit<StaffMember, 'id' | 'matricule' | 'qrToken' | 'credentialsSent' | 'username'>) => {
    const rolePrefix = memberData.role.substring(0, 3).toUpperCase();
    const matricule = `${currentSchool.code || 'LEC'}-${rolePrefix}-${String(staff.length + 1).padStart(3, '0')}`;
    const username = `${memberData.firstName.charAt(0).toLowerCase()}.${memberData.lastName.toLowerCase().replace(/\s+/g, '')}`;
    const tempPassword = `SmartPass#${Math.floor(1000 + Math.random() * 9000)}`;

    const newStaff: StaffMember = {
      ...memberData,
      id: `stf-${Date.now()}`,
      matricule,
      username,
      temporaryPassword: tempPassword,
      credentialsSent: false,
      qrToken: `QR-${matricule}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      assignedClasses: [],
      assignedSubjects: []
    };

    setStaff(prev => [newStaff, ...prev]);
    showToast(`Employé ${newStaff.firstName} ${newStaff.lastName} créé (${newStaff.role})`);
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast("Profil employé mis à jour");
  };

  const toggleStaffStatus = (id: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'actif' ? 'suspendu' : 'actif';
        showToast(`Statut employé changé : ${nextStatus.toUpperCase()}`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const resetStaffPassword = (id: string) => {
    executeWithPin("Réinitialiser le mot de passe de l'employé", () => {
      const tempPassword = `SmartPass#${Math.floor(1000 + Math.random() * 9000)}`;
      setStaff(prev => prev.map(s => s.id === id ? { ...s, temporaryPassword: tempPassword } : s));
      showToast(`Nouveau mot de passe temporaire : ${tempPassword}`);
    });
  };

  const deleteStaff = (id: string) => {
    executeWithPin("Supprimer définitivement cet employé du personnel", () => {
      setStaff(prev => prev.filter(s => s.id !== id));
      showToast("Employé supprimé du registre de l'école");
    });
  };

  const sendStaffCredentials = (id: string) => {
    const member = staff.find(s => s.id === id);
    if (!member) return;

    setStaff(prev => prev.map(s => s.id === id ? { ...s, credentialsSent: true } : s));
    showToast(`Identifiants transmis avec succès à ${member.email} et par SMS au ${member.phone} !`);
  };

  // Classes CRUD
  const createClass = (clsData: Omit<SchoolClass, 'id'>) => {
    const newClass: SchoolClass = {
      ...clsData,
      id: `cls-${Date.now()}`
    };
    setClasses(prev => [...prev, newClass]);
    showToast(`Classe « ${newClass.name} » créée`);
  };

  const updateClass = (id: string, updates: Partial<SchoolClass>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast("Classe mise à jour");
  };

  const deleteClass = (id: string) => {
    executeWithPin("Supprimer définitivement la classe", () => {
      setClasses(prev => prev.filter(c => c.id !== id));
      showToast("Classe supprimée");
    });
  };

  const archiveClass = (id: string) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, archived: !c.archived } : c));
    showToast("État d'archivage de la classe modifié");
  };

  // Subjects CRUD
  const createSubject = (subData: Omit<SchoolSubject, 'id'>) => {
    const newSub: SchoolSubject = {
      ...subData,
      id: `subj-${Date.now()}`
    };
    setSubjects(prev => [...prev, newSub]);
    showToast(`Matière « ${newSub.name} » créée (Coef ${newSub.coefficient})`);
  };

  const updateSubject = (id: string, updates: Partial<SchoolSubject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast("Matière mise à jour");
  };

  const toggleSubjectActive = (id: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    showToast("Statut de la matière modifié");
  };

  // Rooms CRUD
  const createRoom = (roomData: Omit<SchoolRoom, 'id'>) => {
    const newRoom: SchoolRoom = {
      ...roomData,
      id: `room-${Date.now()}`
    };
    setRooms(prev => [...prev, newRoom]);
    showToast(`Salle « ${newRoom.name} » créée`);
  };

  const updateRoom = (id: string, updates: Partial<SchoolRoom>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    showToast("Salle mise à jour");
  };

  const deleteRoom = (id: string) => {
    executeWithPin("Supprimer la salle / installation", () => {
      setRooms(prev => prev.filter(r => r.id !== id));
      showToast("Salle retirée de l'établissement");
    });
  };

  // Academic Years
  const openNewAcademicYear = (yearLabel: string, startDate: string, endDate: string) => {
    executeWithPin(`Ouvrir la nouvelle année scolaire ${yearLabel}`, () => {
      // Deactivate current
      setAcademicYears(prev => [
        {
          id: `ay-${yearLabel.replace('-', '_')}`,
          schoolId: currentSchool.id,
          yearLabel,
          status: 'active',
          startDate,
          endDate,
          terms: [
            { id: `t1-${Date.now()}`, name: '1er Trimestre', startDate, endDate: '2027-12-22', isCurrent: true },
            { id: `t2-${Date.now()}`, name: '2ème Trimestre', startDate: '2028-01-05', endDate: '2028-03-31', isCurrent: false },
            { id: `t3-${Date.now()}`, name: '3ème Trimestre', startDate: '2028-04-12', endDate, isCurrent: false }
          ]
        },
        ...prev.map(y => ({ ...y, status: 'cloturee' as const }))
      ]);
      showToast(`Année scolaire ${yearLabel} déclarée active !`);
    });
  };

  const closeAcademicYear = (id: string) => {
    executeWithPin("Clôturer officiellement l'année scolaire", () => {
      setAcademicYears(prev => prev.map(y => y.id === id ? { ...y, status: 'cloturee' } : y));
      showToast("Année scolaire clôturée avec succès");
    });
  };

  // Assignments
  const assignTeacherToClass = (teacherId: string, classId: string) => {
    const teacher = staff.find(s => s.id === teacherId);
    const cls = classes.find(c => c.id === classId);
    if (!teacher || !cls) return;

    setStaff(prev => prev.map(s => {
      if (s.id === teacherId) {
        const assigned = s.assignedClasses || [];
        if (!assigned.includes(classId)) {
          return { ...s, assignedClasses: [...assigned, classId] };
        }
      }
      return s;
    }));
    showToast(`${teacher.firstName} ${teacher.lastName} affecté à la classe ${cls.name}`);
  };

  const assignTeacherToSubject = (teacherId: string, subjectId: string) => {
    const teacher = staff.find(s => s.id === teacherId);
    const sub = subjects.find(s => s.id === subjectId);
    if (!teacher || !sub) return;

    setStaff(prev => prev.map(s => {
      if (s.id === teacherId) {
        const assigned = s.assignedSubjects || [];
        if (!assigned.includes(subjectId)) {
          return { ...s, assignedSubjects: [...assigned, subjectId] };
        }
      }
      return s;
    }));
    showToast(`${teacher.firstName} ${teacher.lastName} enseigne désormais ${sub.name}`);
  };

  const assignPrincipalTeacher = (classId: string, teacherId: string) => {
    const teacher = staff.find(s => s.id === teacherId);
    const cls = classes.find(c => c.id === classId);
    if (!teacher || !cls) return;

    setClasses(prev => prev.map(c => c.id === classId ? {
      ...c,
      principalTeacherId: teacherId,
      principalTeacherName: `${teacher.firstName} ${teacher.lastName}`
    } : c));
    showToast(`${teacher.firstName} ${teacher.lastName} nommé Professeur Principal de ${cls.name}`);
  };

  const assignRoomToClass = (classId: string, roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    const cls = classes.find(c => c.id === classId);
    if (!room || !cls) return;

    setClasses(prev => prev.map(c => c.id === classId ? {
      ...c,
      mainRoomId: roomId,
      mainRoomName: room.name
    } : c));
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, currentOccupation: cls.name } : r));
    showToast(`Salle ${room.name} attribuée à la classe ${cls.name}`);
  };

  // Documents
  const updateDocumentTemplate = (id: string, updates: Partial<AdministrativeDocumentTemplate>) => {
    setDocumentTemplates(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    showToast("Modèle de document administratif sauvegardé");
  };

  // Events
  const createEvent = (evData: Omit<AdministrativeEvent, 'id'>) => {
    const newEv: AdministrativeEvent = {
      ...evData,
      id: `ev-${Date.now()}`
    };
    setEvents(prev => [newEv, ...prev]);
    showToast(`Événement « ${newEv.title} » publié pour le personnel`);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast("Événement administratif supprimé");
  };

  const value: SchoolAdminContextType = {
    activeSchoolTab,
    setActiveSchoolTab,
    currentSchool,
    setCurrentSchoolId,
    pinModalOpen,
    setPinModalOpen,
    pendingPinAction,
    executeWithPin,
    verifyAndExecutePin,
    failedPinAttempts,
    isTemporarilyBlocked,
    updateAdminPin,
    staff,
    createStaff,
    updateStaff,
    toggleStaffStatus,
    resetStaffPassword,
    deleteStaff,
    sendStaffCredentials,
    selectedStaffForBadge,
    setSelectedStaffForBadge,
    classes,
    createClass,
    updateClass,
    deleteClass,
    archiveClass,
    subjects,
    createSubject,
    updateSubject,
    toggleSubjectActive,
    rooms,
    createRoom,
    updateRoom,
    deleteRoom,
    academicYears,
    openNewAcademicYear,
    closeAcademicYear,
    assignTeacherToClass,
    assignTeacherToSubject,
    assignPrincipalTeacher,
    assignRoomToClass,
    documentTemplates,
    updateDocumentTemplate,
    viewingDocumentTemplate,
    setViewingDocumentTemplate,
    events,
    createEvent,
    deleteEvent,
    schoolLogs
  };

  return <SchoolAdminContext.Provider value={value}>{children}</SchoolAdminContext.Provider>;
};

export const useSchoolAdmin = () => {
  const context = useContext(SchoolAdminContext);
  if (!context) {
    throw new Error('useSchoolAdmin must be used within a SchoolAdminProvider');
  }
  return context;
};
