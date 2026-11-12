import React, { createContext, useContext, useState } from 'react';
import { 
  SecretaryNavTab, 
  SecretaryProfile, 
  StudentEnrollment, 
  ParentRecord, 
  DeliveredCertificate, 
  SchoolTransfer, 
  SecretaryAppointment, 
  SecretaryMessage, 
  SecretarySecurityLog,
  DocumentCertificateType
} from '../types/secretary';
import { 
  initialSecretaryProfile, 
  initialStudents, 
  initialParents, 
  initialCertificates, 
  initialTransfers, 
  initialAppointments, 
  initialSecretaryMessages, 
  initialSecretarySecurityLogs 
} from '../data/secretaryMockData';

interface SecretaryContextType {
  activeSecretaryTab: SecretaryNavTab;
  setActiveSecretaryTab: (tab: SecretaryNavTab) => void;
  profile: SecretaryProfile;
  updateProfile: (partial: Partial<SecretaryProfile>) => void;
  
  // Students
  students: StudentEnrollment[];
  createStudent: (data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'M' | 'F';
    photo: string;
    nationality: string;
    address: string;
    phone: string;
    email: string;
    classId: string;
    className: string;
    bloodGroup: string;
    medicalNotes: string;
    parentId: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    dossierStatus: 'complet' | 'incomplet';
    missingDocuments: string[];
  }) => StudentEnrollment;
  updateStudent: (id: string, partial: Partial<StudentEnrollment>) => void;
  archiveStudent: (id: string) => void;
  restoreStudent: (id: string) => void;
  transferStudent: (id: string, targetSchool: string, reason: string) => void;
  sendStudentCredentials: (id: string) => void;
  
  // Parents
  parents: ParentRecord[];
  createParent: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    profession: string;
    photo: string;
    childrenIds: string[];
  }) => ParentRecord;
  updateParent: (id: string, partial: Partial<ParentRecord>) => void;
  toggleParentStatus: (id: string) => void;
  sendParentCredentials: (id: string) => void;
  linkChildToParent: (parentId: string, studentId: string) => void;
  
  // Certificates & Official Docs
  certificates: DeliveredCertificate[];
  generateCertificate: (
    studentId: string, 
    type: DocumentCertificateType, 
    purpose: string
  ) => DeliveredCertificate;
  
  // Transfers
  transfers: SchoolTransfer[];
  createTransfer: (data: {
    type: 'entrant' | 'sortant';
    studentName: string;
    matricule: string;
    className: string;
    previousSchool: string;
    targetSchool: string;
    reason: string;
  }) => SchoolTransfer;
  updateTransferStatus: (id: string, status: 'approuve' | 'rejete') => void;
  
  // Appointments
  appointments: SecretaryAppointment[];
  createAppointment: (data: {
    title: string;
    visitorName: string;
    visitorRole: SecretaryAppointment['visitorRole'];
    visitorPhone: string;
    type: SecretaryAppointment['type'];
    date: string;
    time: string;
    location: string;
    notes: string;
  }) => SecretaryAppointment;
  updateAppointmentStatus: (id: string, status: 'termine' | 'annule') => void;
  
  // Messages / Communication
  messages: SecretaryMessage[];
  sendMessage: (data: {
    title: string;
    content: string;
    target: SecretaryMessage['target'];
    targetDetail?: string;
    channels: ('app' | 'email' | 'sms' | 'whatsapp')[];
  }) => void;
  
  // Security Logs
  securityLogs: SecretarySecurityLog[];
  addSecurityLog: (action: string) => void;
  
  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const SecretaryContext = createContext<SecretaryContextType | undefined>(undefined);

export const SecretaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSecretaryTab, setActiveSecretaryTab] = useState<SecretaryNavTab>('dashboard');
  const [profile, setProfile] = useState<SecretaryProfile>(initialSecretaryProfile);
  const [students, setStudents] = useState<StudentEnrollment[]>(initialStudents);
  const [parents, setParents] = useState<ParentRecord[]>(initialParents);
  const [certificates, setCertificates] = useState<DeliveredCertificate[]>(initialCertificates);
  const [transfers, setTransfers] = useState<SchoolTransfer[]>(initialTransfers);
  const [appointments, setAppointments] = useState<SecretaryAppointment[]>(initialAppointments);
  const [messages, setMessages] = useState<SecretaryMessage[]>(initialSecretaryMessages);
  const [securityLogs, setSecurityLogs] = useState<SecretarySecurityLog[]>(initialSecretarySecurityLogs);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addSecurityLog = (action: string) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 8)}`;
    const newLog: SecretarySecurityLog = {
      id: `log-sec-${Date.now()}`,
      timestamp: dateStr,
      ip: '197.149.214.45 (Conakry, Kipé)',
      device: 'Desktop HP EliteBook / Chrome / Windows 11',
      action,
      status: 'succes'
    };
    setSecurityLogs(prev => [newLog, ...prev]);
  };

  const updateProfile = (partial: Partial<SecretaryProfile>) => {
    setProfile(prev => ({ ...prev, ...partial }));
    showToast('Profil Secrétariat mis à jour.');
  };

  // Student Creation with Auto Generated Credentials, Unique Matricule, QR Token & School Card
  const createStudent = (data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'M' | 'F';
    photo: string;
    nationality: string;
    address: string;
    phone: string;
    email: string;
    classId: string;
    className: string;
    bloodGroup: string;
    medicalNotes: string;
    parentId: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    dossierStatus: 'complet' | 'incomplet';
    missingDocuments: string[];
  }): StudentEnrollment => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const matricule = `LEC-2026-${randomSuffix}`;
    const cleanFirstName = data.firstName.toLowerCase().replace(/[^a-z]/g, '');
    const cleanLastName = data.lastName.toLowerCase().replace(/[^a-z]/g, '');
    const username = `eleve.${cleanFirstName}.${cleanLastName}`;
    const tempPassword = `LEC-2026-${data.lastName.substring(0, 2).toUpperCase()}#${Math.floor(10 + Math.random() * 90)}`;
    const qrToken = `QR-STU-${matricule}-${Date.now().toString(36).toUpperCase()}`;

    const newStudent: StudentEnrollment = {
      ...data,
      id: `stu-${Date.now()}`,
      matricule,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'actif',
      credentials: {
        username,
        tempPassword,
        sentViaEmail: true,
        sentViaSms: true
      },
      qrToken
    };

    setStudents(prev => [newStudent, ...prev]);
    
    // Automatically link to parent if parentId is known
    if (data.parentId) {
      setParents(prev => prev.map(p => {
        if (p.id === data.parentId && !p.childrenIds.includes(newStudent.id)) {
          return {
            ...p,
            childrenIds: [...p.childrenIds, newStudent.id],
            childrenNames: [...p.childrenNames, `${newStudent.firstName} ${newStudent.lastName}`]
          };
        }
        return p;
      }));
    }

    addSecurityLog(`Inscription nouvel élève : ${newStudent.firstName} ${newStudent.lastName} (${matricule})`);
    showToast(`Élève ${newStudent.firstName} ${newStudent.lastName} inscrit ! Identifiant et carte générés.`);
    return newStudent;
  };

  const updateStudent = (id: string, partial: Partial<StudentEnrollment>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...partial } : s));
    showToast('Dossier élève mis à jour.');
  };

  const archiveStudent = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'archive' } : s));
    addSecurityLog(`Archivage du dossier élève #${id}`);
    showToast('Élève archivé.');
  };

  const restoreStudent = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'actif' } : s));
    addSecurityLog(`Réactivation du dossier élève #${id}`);
    showToast('Élève réactivé avec succès.');
  };

  const transferStudent = (id: string, targetSchool: string, reason: string) => {
    const student = students.find(s => s.id === id);
    if (!student) return;

    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'transfere' } : s));

    const transferDoc: SchoolTransfer = {
      id: `tr-${Date.now()}`,
      type: 'sortant',
      studentName: `${student.firstName} ${student.lastName}`,
      matricule: student.matricule,
      className: student.className,
      previousSchool: profile.schoolName,
      targetSchool,
      transferDate: new Date().toISOString().split('T')[0],
      reason,
      status: 'approuve',
      certificateNumber: `TRANS-OUT-2026-${Math.floor(10 + Math.random() * 90)}`
    };

    setTransfers(prev => [transferDoc, ...prev]);
    addSecurityLog(`Transfert sortant de ${student.firstName} ${student.lastName} vers ${targetSchool}`);
    showToast(`Transfert sortant enregistré pour ${student.firstName} ${student.lastName}.`);
  };

  const sendStudentCredentials = (id: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          credentials: {
            ...s.credentials,
            sentViaEmail: true,
            sentViaSms: true
          }
        };
      }
      return s;
    }));
    showToast('Identifiants et QR Code renvoyés par SMS et Email.');
  };

  // Parent Management with Auto Credentials
  const createParent = (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    profession: string;
    photo: string;
    childrenIds: string[];
  }): ParentRecord => {
    const cleanFirstName = data.firstName.toLowerCase().replace(/[^a-z]/g, '');
    const cleanLastName = data.lastName.toLowerCase().replace(/[^a-z]/g, '');
    const username = `parent.${cleanFirstName}.${cleanLastName}`;
    const tempPassword = `PAR-${data.lastName.toUpperCase()}-2026!`;

    const childrenNames = students
      .filter(s => data.childrenIds.includes(s.id))
      .map(s => `${s.firstName} ${s.lastName}`);

    const newParent: ParentRecord = {
      ...data,
      id: `par-${Date.now()}`,
      childrenNames,
      status: 'actif',
      credentials: {
        username,
        tempPassword,
        sent: true
      }
    };

    setParents(prev => [newParent, ...prev]);
    addSecurityLog(`Création compte parent : ${newParent.firstName} ${newParent.lastName}`);
    showToast(`Compte parent créé pour ${newParent.firstName} ${newParent.lastName}.`);
    return newParent;
  };

  const updateParent = (id: string, partial: Partial<ParentRecord>) => {
    setParents(prev => prev.map(p => p.id === id ? { ...p, ...partial } : p));
    showToast('Informations parent mises à jour.');
  };

  const toggleParentStatus = (id: string) => {
    setParents(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'actif' ? 'desactive' : 'actif';
        return { ...p, status: nextStatus };
      }
      return p;
    }));
    showToast('Statut du compte parent modifié.');
  };

  const sendParentCredentials = (id: string) => {
    setParents(prev => prev.map(p => p.id === id ? { ...p, credentials: { ...p.credentials, sent: true } } : p));
    showToast('Identifiants de connexion réexpédiés au parent.');
  };

  const linkChildToParent = (parentId: string, studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setParents(prev => prev.map(p => {
      if (p.id === parentId && !p.childrenIds.includes(studentId)) {
        return {
          ...p,
          childrenIds: [...p.childrenIds, studentId],
          childrenNames: [...p.childrenNames, `${student.firstName} ${student.lastName}`]
        };
      }
      return p;
    }));

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const parent = parents.find(p => p.id === parentId);
        if (parent) {
          return {
            ...s,
            parentId: parent.id,
            parentName: `${parent.firstName} ${parent.lastName}`,
            parentPhone: parent.phone,
            parentEmail: parent.email
          };
        }
      }
      return s;
    }));

    showToast('Liaison parent-enfant enregistrée avec succès.');
  };

  // Certificates Generation
  const generateCertificate = (
    studentId: string, 
    type: DocumentCertificateType, 
    purpose: string
  ): DeliveredCertificate => {
    const student = students.find(s => s.id === studentId);
    if (!student) throw new Error('Élève introuvable');

    const prefix = 
      type === 'certificat_scolarite' ? 'LEC-CERT' :
      type === 'attestation_inscription' ? 'LEC-ATT-INS' :
      type === 'attestation_frequentation' ? 'LEC-FREQ' :
      type === 'attestation_reussite' ? 'LEC-REUSS' : 'LEC-TRANS';
    
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const certNum = `${prefix}-2026-${randomNum}`;
    const qrUrl = `https://smartschool-verify.gn/cert/${certNum}`;

    const newDoc: DeliveredCertificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
      type,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      matricule: student.matricule,
      className: student.className,
      issueDate: new Date().toISOString().split('T')[0],
      purpose,
      signedBy: `${profile.name} (${profile.title})`,
      qrVerificationUrl: qrUrl,
      status: 'delivre'
    };

    setCertificates(prev => [newDoc, ...prev]);
    addSecurityLog(`Délivrance de document officiel : ${certNum} pour ${student.firstName} ${student.lastName}`);
    showToast(`Document ${certNum} délivré avec succès ! Spécimen officiel prêt.`);
    return newDoc;
  };

  // Transfers
  const createTransfer = (data: {
    type: 'entrant' | 'sortant';
    studentName: string;
    matricule: string;
    className: string;
    previousSchool: string;
    targetSchool: string;
    reason: string;
  }): SchoolTransfer => {
    const newTransfer: SchoolTransfer = {
      ...data,
      id: `tr-${Date.now()}`,
      transferDate: new Date().toISOString().split('T')[0],
      status: 'approuve',
      certificateNumber: `TRANS-${data.type === 'entrant' ? 'IN' : 'OUT'}-2026-${Math.floor(10 + Math.random() * 90)}`
    };

    setTransfers(prev => [newTransfer, ...prev]);
    addSecurityLog(`Enregistrement transfert ${data.type} pour ${data.studentName}`);
    showToast(`Transfert ${data.type} enregistré pour ${data.studentName}.`);
    return newTransfer;
  };

  const updateTransferStatus = (id: string, status: 'approuve' | 'rejete') => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    showToast(`Statut du transfert mis à jour : ${status}`);
  };

  // Appointments
  const createAppointment = (data: {
    title: string;
    visitorName: string;
    visitorRole: SecretaryAppointment['visitorRole'];
    visitorPhone: string;
    type: SecretaryAppointment['type'];
    date: string;
    time: string;
    location: string;
    notes: string;
  }): SecretaryAppointment => {
    const newApp: SecretaryAppointment = {
      ...data,
      id: `app-${Date.now()}`,
      status: 'programme'
    };
    setAppointments(prev => [newApp, ...prev]);
    showToast('Rendez-vous planifié au secrétariat.');
    return newApp;
  };

  const updateAppointmentStatus = (id: string, status: 'termine' | 'annule') => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    showToast('Statut du rendez-vous mis à jour.');
  };

  // Messages
  const sendMessage = (data: {
    title: string;
    content: string;
    target: SecretaryMessage['target'];
    targetDetail?: string;
    channels: ('app' | 'email' | 'sms' | 'whatsapp')[];
  }) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;
    const newMsg: SecretaryMessage = {
      ...data,
      id: `msg-${Date.now()}`,
      date: dateStr,
      status: 'envoye'
    };
    setMessages(prev => [newMsg, ...prev]);
    addSecurityLog(`Diffusion message administratif : ${data.title}`);
    showToast('Message administratif transmis sur tous les canaux.');
  };

  return (
    <SecretaryContext.Provider value={{
      activeSecretaryTab,
      setActiveSecretaryTab,
      profile,
      updateProfile,
      students,
      createStudent,
      updateStudent,
      archiveStudent,
      restoreStudent,
      transferStudent,
      sendStudentCredentials,
      parents,
      createParent,
      updateParent,
      toggleParentStatus,
      sendParentCredentials,
      linkChildToParent,
      certificates,
      generateCertificate,
      transfers,
      createTransfer,
      updateTransferStatus,
      appointments,
      createAppointment,
      updateAppointmentStatus,
      messages,
      sendMessage,
      securityLogs,
      addSecurityLog,
      toastMessage,
      showToast
    }}>
      {children}
    </SecretaryContext.Provider>
  );
};

export const useSecretary = () => {
  const context = useContext(SecretaryContext);
  if (!context) {
    throw new Error('useSecretary must be used within a SecretaryProvider');
  }
  return context;
};
