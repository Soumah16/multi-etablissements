import React, { createContext, useContext, useEffect, useState } from 'react';
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
import { useSchoolAdmin } from './SchoolAdminContext';
import { usePersistedState } from '../utils/storage';
import {
  propagateParentRecordChange,
  propagateRoleProfileToAccount,
  propagateStudentRecordChange
} from '../utils/accountSync';
import {
  HubRole,
  pushSharedMessage,
  pushSharedRequest,
  updateSharedRequestStatus
} from '../utils/communicationHub';

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
    purpose: string,
    customFields?: {
      studentName?: string;
      matricule?: string;
      className?: string;
      schoolName?: string;
      issueDate?: string;
    }
  ) => DeliveredCertificate;
  updateCertificate: (id: string, partial: Partial<DeliveredCertificate>) => void;
  
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
  const { currentSchool } = useSchoolAdmin();
  const [activeSecretaryTab, setActiveSecretaryTab] = useState<SecretaryNavTab>('dashboard');
  const [profile, setProfile] = usePersistedState<SecretaryProfile>('smartschool_secretary_profile_v1', initialSecretaryProfile);
  const [students, setStudents] = usePersistedState<StudentEnrollment[]>('smartschool_secretary_students_v1', initialStudents);
  const [parents, setParents] = usePersistedState<ParentRecord[]>('smartschool_secretary_parents_v1', initialParents);
  const [certificates, setCertificates] = usePersistedState<DeliveredCertificate[]>('smartschool_secretary_certificates_v1', initialCertificates);
  const [transfers, setTransfers] = usePersistedState<SchoolTransfer[]>('smartschool_secretary_transfers_v1', initialTransfers);
  const [appointments, setAppointments] = usePersistedState<SecretaryAppointment[]>('smartschool_secretary_appointments_v1', initialAppointments);
  const [messages, setMessages] = usePersistedState<SecretaryMessage[]>(
    'smartschool_secretary_messages_v1',
    initialSecretaryMessages,
    loaded => (Array.isArray(loaded) && loaded.length > 0 ? loaded : initialSecretaryMessages)
  );
  const [securityLogs, setSecurityLogs] = usePersistedState<SecretarySecurityLog[]>('smartschool_secretary_logs_v1', initialSecretarySecurityLogs);
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
    const nextProfile: SecretaryProfile = { ...profile, ...partial };
    setProfile(nextProfile);
    propagateRoleProfileToAccount(
      'secretary',
      nextProfile,
      { email: profile.email, matricule: profile.matricule },
      nextProfile.schoolId || currentSchool?.id
    );
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

    propagateStudentRecordChange({
      student: newStudent,
      schoolId: currentSchool?.id || profile.schoolId,
      schoolName: currentSchool?.name || profile.schoolName
    });
    
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
    const existing = students.find(s => s.id === id);
    if (!existing) return;
    const updatedStudent: StudentEnrollment = { ...existing, ...partial };
    const updatedName = `${updatedStudent.firstName} ${updatedStudent.lastName}`.trim();

    setStudents(prev => prev.map(s => (s.id === id ? updatedStudent : s)));
    propagateStudentRecordChange({
      oldEmail: existing.email,
      oldMatricule: existing.matricule,
      student: updatedStudent,
      schoolId: currentSchool?.id || profile.schoolId,
      schoolName: currentSchool?.name || profile.schoolName
    });

    if (partial.parentId !== undefined) {
      setParents(prev => prev.map(p => {
        const idx = p.childrenIds.indexOf(id);
        const filteredIds = p.childrenIds.filter(cid => cid !== id);
        const filteredNames = idx >= 0
          ? p.childrenNames.filter((_, i) => i !== idx)
          : p.childrenNames.filter(n => n !== `${existing?.firstName} ${existing?.lastName}`);

        if (partial.parentId && p.id === partial.parentId) {
          return {
            ...p,
            childrenIds: [...filteredIds, id],
            childrenNames: [...filteredNames, updatedName || 'Élève']
          };
        }
        return {
          ...p,
          childrenIds: filteredIds,
          childrenNames: filteredNames
        };
      }));
    }

    showToast('Dossier élève mis à jour.');
  };

  const archiveStudent = (id: string) => {
    const existing = students.find(s => s.id === id);
    if (!existing) return;
    const updatedStudent: StudentEnrollment = { ...existing, status: 'archive' };
    setStudents(prev => prev.map(s => (s.id === id ? updatedStudent : s)));
    propagateStudentRecordChange({
      oldEmail: existing.email,
      oldMatricule: existing.matricule,
      student: updatedStudent,
      schoolId: currentSchool?.id || profile.schoolId,
      schoolName: currentSchool?.name || profile.schoolName
    });
    addSecurityLog(`Archivage du dossier élève #${id}`);
    showToast('Élève archivé.');
  };

  const restoreStudent = (id: string) => {
    const existing = students.find(s => s.id === id);
    if (!existing) return;
    const updatedStudent: StudentEnrollment = { ...existing, status: 'actif' };
    setStudents(prev => prev.map(s => (s.id === id ? updatedStudent : s)));
    propagateStudentRecordChange({
      oldEmail: existing.email,
      oldMatricule: existing.matricule,
      student: updatedStudent,
      schoolId: currentSchool?.id || profile.schoolId,
      schoolName: currentSchool?.name || profile.schoolName
    });
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
    propagateParentRecordChange({
      parent: newParent,
      schoolId: currentSchool?.id || profile.schoolId,
      schoolName: currentSchool?.name || profile.schoolName
    });
    addSecurityLog(`Création compte parent : ${newParent.firstName} ${newParent.lastName}`);
    showToast(`Compte parent créé pour ${newParent.firstName} ${newParent.lastName}.`);
    return newParent;
  };

  const updateParent = (id: string, partial: Partial<ParentRecord>) => {
    const existing = parents.find(p => p.id === id);
    if (!existing) return;
    const updatedParent: ParentRecord = { ...existing, ...partial };
    setParents(prev => prev.map(p => (p.id === id ? updatedParent : p)));
    propagateParentRecordChange({
      oldEmail: existing.email,
      oldUsername: existing.credentials?.username,
      parent: updatedParent,
      schoolId: currentSchool?.id || profile.schoolId,
      schoolName: currentSchool?.name || profile.schoolName
    });
    showToast('Informations parent mises à jour.');
  };

  const toggleParentStatus = (id: string) => {
    const existing = parents.find(p => p.id === id);
    if (!existing) return;
    const nextStatus = existing.status === 'actif' ? 'desactive' : 'actif';
    const updatedParent: ParentRecord = { ...existing, status: nextStatus };
    setParents(prev => prev.map(p => (p.id === id ? updatedParent : p)));
    propagateParentRecordChange({
      oldEmail: existing.email,
      oldUsername: existing.credentials?.username,
      parent: updatedParent,
      schoolId: currentSchool?.id || profile.schoolId,
      schoolName: currentSchool?.name || profile.schoolName
    });
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

  // Certificates Generation (per-school model & editable student details)
  const generateCertificate = (
    studentId: string, 
    type: DocumentCertificateType, 
    purpose: string,
    customFields?: {
      studentName?: string;
      matricule?: string;
      className?: string;
      schoolName?: string;
      issueDate?: string;
    }
  ): DeliveredCertificate => {
    const student = studentId !== 'custom' ? students.find(s => s.id === studentId) : undefined;
    const resolvedName = customFields?.studentName?.trim() || (student ? `${student.firstName} ${student.lastName}` : '');
    if (!resolvedName) throw new Error('Nom de l\'élève requis');

    const schoolShortCode = (currentSchool?.code || 'LEC').split('-')[0].toUpperCase();
    const resolvedMatricule = customFields?.matricule?.trim() || student?.matricule || `${schoolShortCode}-2026-${Math.floor(100 + Math.random() * 900)}`;
    const resolvedClassName = customFields?.className?.trim() || student?.className || 'Classe non précisée';
    const resolvedSchoolName = customFields?.schoolName?.trim() || currentSchool?.name || profile.schoolName;
    const resolvedIssueDate = customFields?.issueDate || new Date().toISOString().split('T')[0];

    const typeTag = 
      type === 'certificat_scolarite' ? 'CERT' :
      type === 'attestation_inscription' ? 'ATT-INS' :
      type === 'attestation_frequentation' ? 'FREQ' :
      type === 'attestation_reussite' ? 'REUSS' : 'TRANS';
    
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const certNum = `${schoolShortCode}-${typeTag}-2026-${randomNum}`;
    const qrUrl = `https://smartschool-verify.gn/cert/${certNum}?m=${encodeURIComponent(resolvedMatricule)}&s=${encodeURIComponent(currentSchool?.code || 'LEC-CKY')}`;

    const newDoc: DeliveredCertificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
      type,
      studentId: student?.id || `custom-${Date.now()}`,
      studentName: resolvedName,
      matricule: resolvedMatricule,
      className: resolvedClassName,
      issueDate: resolvedIssueDate,
      purpose,
      signedBy: `${profile.name} (${profile.title})`,
      qrVerificationUrl: qrUrl,
      status: 'delivre',
      schoolId: currentSchool?.id || 'sch-gn-ck-001',
      schoolName: resolvedSchoolName,
      schoolCode: currentSchool?.code || 'LEC-CKY',
      schoolType: currentSchool?.type || 'Lycée',
      schoolCity: currentSchool?.city || 'Conakry',
      schoolAddress: currentSchool?.address || 'Boulevard Diallo Telli, Kaloum',
      schoolPhone: currentSchool?.phone || '+224 621 34 56 78',
      schoolLogo: currentSchool?.logo
    };

    setCertificates(prev => [newDoc, ...prev]);
    addSecurityLog(`Délivrance document officiel (${currentSchool?.code || 'LEC'}) : ${certNum} pour ${resolvedName} (${resolvedMatricule})`);
    showToast(`Document ${certNum} délivré pour ${resolvedSchoolName} !`);
    return newDoc;
  };

  const updateCertificate = (id: string, partial: Partial<DeliveredCertificate>) => {
    setCertificates(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, ...partial };
      return {
        ...updated,
        qrVerificationUrl: `https://smartschool-verify.gn/cert/${updated.certificateNumber}?m=${encodeURIComponent(updated.matricule)}&s=${encodeURIComponent(updated.schoolCode || currentSchool?.code || 'LEC')}`
      };
    }));
    addSecurityLog(`Modification certificat #${id} (Élève / Matricule / Classe mis à jour)`);
    showToast('Certificat mis à jour avec succès !');
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
    pushSharedRequest({
      id: newTransfer.id,
      schoolId: currentSchool?.id || profile.schoolId,
      category: 'transfert',
      title: `Transfert ${data.type} : ${data.studentName} (${data.className})`,
      description: `De ${data.previousSchool} vers ${data.targetSchool}. Motif : ${data.reason}`,
      requesterName: profile.name,
      requesterRole: 'secretary',
      targetRoles: ['director', 'school_admin'],
      status: 'approuve'
    });
    addSecurityLog(`Enregistrement transfert ${data.type} pour ${data.studentName}`);
    showToast(`Transfert ${data.type} enregistré pour ${data.studentName}.`);
    return newTransfer;
  };

  const updateTransferStatus = (id: string, status: 'approuve' | 'rejete') => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    updateSharedRequestStatus(id, status, profile.name, `Transfert ${status} par le secrétariat.`);
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
    pushSharedRequest({
      id: newApp.id,
      schoolId: currentSchool?.id || profile.schoolId,
      category: 'rendez_vous',
      title: `RDV : ${data.title} (${data.visitorName})`,
      description: `Prévu le ${data.date} à ${data.time} (${data.location}). ${data.notes || ''}`.trim(),
      requesterName: data.visitorName,
      requesterRole: 'parent',
      targetRoles: ['secretary', 'director', 'school_admin'],
      status: 'en_cours'
    });
    showToast('Rendez-vous planifié au secrétariat.');
    return newApp;
  };

  const updateAppointmentStatus = (id: string, status: 'termine' | 'annule') => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    updateSharedRequestStatus(
      id,
      status === 'termine' ? 'approuve' : 'rejete',
      profile.name,
      status === 'termine' ? 'Rendez-vous honoré.' : 'Rendez-vous annulé.'
    );
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
    const recipientRoles: HubRole[] =
      data.target === 'all_students' ? ['student'] : ['parent', 'director', 'school_admin'];
    pushSharedMessage({
      schoolId: currentSchool?.id || profile.schoolId,
      senderRole: 'secretary',
      senderName: profile.name,
      recipientRoles,
      recipientLabel: data.targetDetail || (data.target === 'all_students' ? 'Élèves' : "Parents d'élèves"),
      subject: data.title,
      content: data.content,
      channel: data.channels.includes('email') ? 'email' : data.channels.includes('sms') ? 'sms' : 'in_app',
      priority: 'officiel'
    });
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
      updateCertificate,
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
