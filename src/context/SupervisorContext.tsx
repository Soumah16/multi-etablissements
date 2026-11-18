import React, { createContext, useContext, useState } from 'react';
import { 
  SupervisorNavTab, 
  SupervisorProfile, 
  AttendanceRecordItem, 
  AdmissionSlip, 
  DisciplinaryIncident, 
  WatchlistStudent, 
  ConfiscatedItem, 
  SecurityPatrol, 
  DisciplinaryParentMeeting 
} from '../types/supervisor';
import { 
  initialSupervisorProfile, 
  initialAttendanceRecords, 
  initialAdmissionSlips, 
  initialDisciplinaryIncidents, 
  initialWatchlist, 
  initialConfiscatedItems, 
  initialSecurityPatrols, 
  initialDisciplinaryMeetings 
} from '../data/supervisorMockData';
import { usePersistedState } from '../utils/storage';
import { propagateRoleProfileToAccount } from '../utils/accountSync';

interface SupervisorContextType {
  activeSupervisorTab: SupervisorNavTab;
  setActiveSupervisorTab: (tab: SupervisorNavTab) => void;
  profile: SupervisorProfile;
  updateProfile: (updated: Partial<SupervisorProfile>) => void;
  
  // Attendance & Late tracking
  attendanceRecords: AttendanceRecordItem[];
  justifyAttendanceRecord: (id: string, reason: string) => void;
  notifyParentSms: (id: string) => void;

  // Admission slips (Billets de rentrée)
  admissionSlips: AdmissionSlip[];
  issueAdmissionSlip: (slip: Omit<AdmissionSlip, 'id' | 'slipNumber' | 'supervisorSignature'>) => void;

  // Disciplinary Incidents & Sanctions
  incidents: DisciplinaryIncident[];
  addIncident: (inc: Omit<DisciplinaryIncident, 'id' | 'incidentNumber'>) => void;
  resolveIncident: (id: string, sanctionApplied?: string) => void;
  reportIncidentToDirector: (id: string) => void;

  // Watchlist & Behavior
  watchlist: WatchlistStudent[];
  addWatchlistNote: (studentId: string, note: string) => void;

  // Confiscated Items & Patrols
  confiscatedItems: ConfiscatedItem[];
  addConfiscatedItem: (item: Omit<ConfiscatedItem, 'id' | 'status'>) => void;
  returnConfiscatedItem: (id: string) => void;
  patrols: SecurityPatrol[];
  addPatrol: (patrol: Omit<SecurityPatrol, 'id'>) => void;

  // Parent Meetings
  meetings: DisciplinaryParentMeeting[];
  scheduleMeeting: (meeting: Omit<DisciplinaryParentMeeting, 'id' | 'status'>) => void;

  // Toast
  toastMessage: string | null;
  triggerToast: (msg: string) => void;
}

const SupervisorContext = createContext<SupervisorContextType | undefined>(undefined);

export const SupervisorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSupervisorTab, setActiveSupervisorTab] = useState<SupervisorNavTab>('dashboard');
  const [profile, setProfile] = usePersistedState<SupervisorProfile>('smartschool_supervisor_profile_v1', initialSupervisorProfile);
  const [attendanceRecords, setAttendanceRecords] = usePersistedState<AttendanceRecordItem[]>('smartschool_supervisor_attendance_v1', initialAttendanceRecords);
  const [admissionSlips, setAdmissionSlips] = usePersistedState<AdmissionSlip[]>('smartschool_supervisor_slips_v1', initialAdmissionSlips);
  const [incidents, setIncidents] = usePersistedState<DisciplinaryIncident[]>('smartschool_supervisor_incidents_v1', initialDisciplinaryIncidents);
  const [watchlist, setWatchlist] = usePersistedState<WatchlistStudent[]>('smartschool_supervisor_watchlist_v1', initialWatchlist);
  const [confiscatedItems, setConfiscatedItems] = usePersistedState<ConfiscatedItem[]>('smartschool_supervisor_confiscated_v1', initialConfiscatedItems);
  const [patrols, setPatrols] = usePersistedState<SecurityPatrol[]>('smartschool_supervisor_patrols_v1', initialSecurityPatrols);
  const [meetings, setMeetings] = usePersistedState<DisciplinaryParentMeeting[]>('smartschool_supervisor_meetings_v1', initialDisciplinaryMeetings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const updateProfile = (updated: Partial<SupervisorProfile>) => {
    const nextProfile: SupervisorProfile = { ...profile, ...updated };
    setProfile(nextProfile);
    propagateRoleProfileToAccount(
      'supervisor',
      nextProfile,
      { email: profile.email, matricule: profile.matricule },
      nextProfile.schoolId
    );
    triggerToast('Profil du Surveillant mis à jour avec succès.');
  };

  const justifyAttendanceRecord = (id: string, reason: string) => {
    setAttendanceRecords(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      return {
        ...rec,
        status: 'justifie',
        justificationReason: reason,
        justifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
    }));
    triggerToast('Absence/Retard régularisé avec succès.');
  };

  const notifyParentSms = (id: string) => {
    setAttendanceRecords(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      return { ...rec, notifiedParent: true };
    }));
    triggerToast('Alerte SMS transmise au tuteur de l\'élève.');
  };

  const issueAdmissionSlip = (slip: Omit<AdmissionSlip, 'id' | 'slipNumber' | 'supervisorSignature'>) => {
    const num = `BR-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newSlip: AdmissionSlip = {
      ...slip,
      id: `slip-${Date.now()}`,
      slipNumber: num,
      supervisorSignature: true
    };
    setAdmissionSlips(prev => [newSlip, ...prev]);
    triggerToast(`Billet de rentrée ${num} délivré pour ${slip.studentName}.`);
  };

  const addIncident = (inc: Omit<DisciplinaryIncident, 'id' | 'incidentNumber'>) => {
    const incNum = `INC-2026-${Math.floor(10 + Math.random() * 90)}`;
    const newInc: DisciplinaryIncident = {
      ...inc,
      id: `inc-${Date.now()}`,
      incidentNumber: incNum
    };
    setIncidents(prev => [newInc, ...prev]);
    triggerToast(`Incident disciplinaire ${incNum} enregistré au registre.`);
  };

  const resolveIncident = (id: string, sanctionApplied?: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== id) return inc;
      return {
        ...inc,
        status: 'resolu',
        sanctionType: (sanctionApplied as any) || inc.sanctionType
      };
    }));
    triggerToast('Incident marqué comme résolu.');
  };

  const reportIncidentToDirector = (id: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== id) return inc;
      return {
        ...inc,
        status: 'transmis_direction',
        reportedToDirector: true
      };
    }));
    triggerToast('Dossier d\'incident transmis en urgence au Directeur des Études.');
  };

  const addWatchlistNote = (studentId: string, note: string) => {
    setWatchlist(prev => prev.map(std => {
      if (std.studentId !== studentId) return std;
      return {
        ...std,
        supervisorNotes: [...std.supervisorNotes, note]
      };
    }));
    triggerToast('Note ajoutée au dossier de comportement de l\'élève.');
  };

  const addConfiscatedItem = (item: Omit<ConfiscatedItem, 'id' | 'status'>) => {
    const newItem: ConfiscatedItem = {
      ...item,
      id: `cnf-${Date.now()}`,
      status: 'consigne'
    };
    setConfiscatedItems(prev => [newItem, ...prev]);
    triggerToast(`Objet confisqué enregistré en consigne.`);
  };

  const returnConfiscatedItem = (id: string) => {
    setConfiscatedItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      return {
        ...item,
        status: 'restitue_parent',
        returnedDate: new Date().toISOString().substring(0, 10)
      };
    }));
    triggerToast('Objet restitué au parent avec décharge signée.');
  };

  const addPatrol = (patrol: Omit<SecurityPatrol, 'id'>) => {
    const newPatrol: SecurityPatrol = {
      ...patrol,
      id: `pat-${Date.now()}`
    };
    setPatrols(prev => [newPatrol, ...prev]);
    triggerToast('Ronde de surveillance inscrite au registre.');
  };

  const scheduleMeeting = (meeting: Omit<DisciplinaryParentMeeting, 'id' | 'status'>) => {
    const newMeeting: DisciplinaryParentMeeting = {
      ...meeting,
      id: `mtg-${Date.now()}`,
      status: 'confirme'
    };
    setMeetings(prev => [newMeeting, ...prev]);
    triggerToast(`Rendez-vous disciplinaire programmé pour ${meeting.studentName}.`);
  };

  return (
    <SupervisorContext.Provider
      value={{
        activeSupervisorTab,
        setActiveSupervisorTab,
        profile,
        updateProfile,
        attendanceRecords,
        justifyAttendanceRecord,
        notifyParentSms,
        admissionSlips,
        issueAdmissionSlip,
        incidents,
        addIncident,
        resolveIncident,
        reportIncidentToDirector,
        watchlist,
        addWatchlistNote,
        confiscatedItems,
        addConfiscatedItem,
        returnConfiscatedItem,
        patrols,
        addPatrol,
        meetings,
        scheduleMeeting,
        toastMessage,
        triggerToast
      }}
    >
      {children}
    </SupervisorContext.Provider>
  );
};

export const useSupervisor = () => {
  const context = useContext(SupervisorContext);
  if (!context) {
    throw new Error('useSupervisor must be used within a SupervisorProvider');
  }
  return context;
};
