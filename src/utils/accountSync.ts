import { WorkspaceMode } from '../App';
import {
  AccountMatchCriteria,
  DemoAccount,
  getStoredAccounts,
  matchesAccountCriteria,
  normalizeSchoolId,
  removeAccountByMatch,
  saveStoredAccounts,
  upsertUserAccount
} from '../data/accountsData';
import { initialAccountantProfile } from '../data/accountantMockData';
import { DirectorProfile, initialDirectorProfile } from '../data/directorMockData';
import { initialLibrarianProfile } from '../data/librarianMockData';
import { initialAdmins, initialSuperAdminProfile } from '../data/mockData';
import { initialParentProfile } from '../data/parentMockData';
import { initialSecretaryProfile } from '../data/secretaryMockData';
import { initialStudentProfile } from '../data/studentMockData';
import { initialSupervisorProfile } from '../data/supervisorMockData';
import { initialTeacherProfile } from '../data/teacherMockData';
import {
  School,
  SchoolAdmin,
  StaffMember,
  StaffRole,
  SuperAdminProfile
} from '../types';
import { AccountantProfile } from '../types/accountant';
import { LibrarianProfile } from '../types/librarian';
import { ParentProfile } from '../types/parent';
import { AccountStatus } from '../types/rbac';
import { ParentRecord, SecretaryProfile, StudentEnrollment } from '../types/secretary';
import { StudentProfile } from '../types/student';
import { SupervisorProfile } from '../types/supervisor';
import { TeacherProfile } from '../types/teacher';
import {
  getLocalTimestamp,
  getMonotonicWriteTimestamp,
  loadLocalStorage,
  saveDualStorage,
  StorageWriteSource
} from './storage';

export interface CurrentSessionUserLike {
  role: WorkspaceMode;
  name: string;
  email: string;
  matricule?: string;
  schoolName?: string;
  photo?: string;
  ecoleId?: string;
  nationalUid?: string;
  badgeNumber?: string;
  status?: string;
  mustChangePassword?: boolean;
}

export const CURRENT_USER_UPDATED_EVENT = 'smartschool-current-user-updated';

export const STAFF_ROLE_TO_WORKSPACE: Record<StaffRole, WorkspaceMode> = {
  Directeur: 'director',
  Secrétaire: 'secretary',
  Comptable: 'accountant',
  Enseignant: 'teacher',
  Bibliothécaire: 'librarian',
  Surveillant: 'supervisor',
  'Personnel administratif': 'secretary',
  'Responsable informatique': 'school_admin'
};

export const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
  const cleaned = fullName.trim().replace(/\s+/g, ' ');
  if (!cleaned) return { firstName: '', lastName: '' };
  const parts = cleaned.split(' ');
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  const lastName = parts[parts.length - 1];
  const firstName = parts.slice(0, -1).join(' ');
  return { firstName, lastName };
};

const writeProfileIfChanged = <T extends Record<string, any>>(
  key: string,
  nextValue: T,
  source: StorageWriteSource = 'local',
  explicitTimestamp?: number
): void => {
  if (typeof window === 'undefined') return;
  try {
    const current = loadLocalStorage<T | null>(key, null);
    if (current && JSON.stringify(current) === JSON.stringify(nextValue)) {
      return;
    }
  } catch {
    // ignore parse error and write fresh
  }
  const ts =
    typeof explicitTimestamp === 'number' && Number.isFinite(explicitTimestamp) && explicitTimestamp > 0
      ? explicitTimestamp
      : getMonotonicWriteTimestamp();
  saveDualStorage(key, nextValue, ts, source);
};

export const syncCurrentUserSession = (
  criteria: AccountMatchCriteria,
  updates: Partial<CurrentSessionUserLike>
): void => {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('smartschool_current_user');
    if (!raw) return;
    const current = JSON.parse(raw) as CurrentSessionUserLike;
    if (!current || !current.role) return;

    let matches = false;
    if (criteria.role === 'super_admin' && current.role === 'super_admin') {
      matches = true;
    }
    if (!matches && criteria.email && current.email?.toLowerCase() === criteria.email.trim().toLowerCase()) {
      matches = true;
    }
    if (
      !matches &&
      criteria.matricule &&
      current.matricule &&
      current.matricule.toLowerCase() === criteria.matricule.trim().toLowerCase()
    ) {
      matches = true;
    }
    if (!matches && criteria.role && current.role === criteria.role) {
      if (!criteria.ecoleId || normalizeSchoolId(current.ecoleId) === normalizeSchoolId(criteria.ecoleId)) {
        matches = true;
      }
    }

    if (!matches) return;

    const next: CurrentSessionUserLike = {
      ...current,
      ...Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined))
    };

    if (JSON.stringify(next) === JSON.stringify(current)) return;

    localStorage.setItem('smartschool_current_user', JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(CURRENT_USER_UPDATED_EVENT, { detail: next }));
  } catch {
    // ignore
  }
};

export const hydrateActiveRoleProfileOnLogin = (
  sessionUser: CurrentSessionUserLike | DemoAccount,
  source: StorageWriteSource = 'local',
  options?: { seedOnlyIfEmpty?: boolean; explicitTimestamp?: number }
): void => {
  if (typeof window === 'undefined') return;
  const seedOnlyIfEmpty = Boolean(options?.seedOnlyIfEmpty);
  const resolveWriteMode = (targetKey: string): { shouldSkip: boolean; writeSource: StorageWriteSource; writeTs?: number } => {
    if (seedOnlyIfEmpty) {
      if (getLocalTimestamp(targetKey) > 0) {
        return { shouldSkip: true, writeSource: 'remote' };
      }
      // Hydration on login from seed/cached user must NOT stamp Date.now() as a local edit
      return { shouldSkip: false, writeSource: 'remote', writeTs: 1 };
    }
    return {
      shouldSkip: false,
      writeSource: source,
      writeTs: options?.explicitTimestamp
    };
  };

  const writeHydratedProfile = <T extends Record<string, any>>(targetKey: string, nextValue: T): void => {
    const mode = resolveWriteMode(targetKey);
    if (mode.shouldSkip) return;
    writeProfileIfChanged(targetKey, nextValue, mode.writeSource, mode.writeTs);
  };

  const accounts = getStoredAccounts();
  const matchedAcc = accounts.find(
    a =>
      a.email.toLowerCase() === (sessionUser.email || '').toLowerCase() ||
      (sessionUser.matricule && a.matricule.toLowerCase() === sessionUser.matricule.toLowerCase()) ||
      (a.role === sessionUser.role &&
        normalizeSchoolId(a.ecoleId) === normalizeSchoolId(sessionUser.ecoleId))
  );

  const resolvedName = sessionUser.name || matchedAcc?.name || '';
  const resolvedEmail = sessionUser.email || matchedAcc?.email || '';
  const resolvedMatricule = sessionUser.matricule || matchedAcc?.matricule || '';
  const resolvedPhone = matchedAcc?.phone;
  const resolvedPhoto = sessionUser.photo !== undefined ? sessionUser.photo : matchedAcc?.photo;
  const resolvedTitle = matchedAcc?.title;
  const resolvedSchoolName = sessionUser.schoolName || matchedAcc?.schoolName;
  const resolvedSchoolId = normalizeSchoolId(sessionUser.ecoleId || matchedAcc?.ecoleId) || 'ECOLE-001';
  const split = splitFullName(resolvedName);
  const firstName = matchedAcc?.firstName || split.firstName;
  const lastName = matchedAcc?.lastName || split.lastName;

  switch (sessionUser.role) {
    case 'super_admin': {
      const current = loadLocalStorage<SuperAdminProfile>('smartschool_profile', initialSuperAdminProfile);
      const next: SuperAdminProfile = {
        ...current,
        name: resolvedName || current.name,
        email: resolvedEmail || current.email,
        ...(resolvedPhone ? { phone: resolvedPhone } : {}),
        ...(resolvedPhoto !== undefined ? { photo: resolvedPhoto || undefined } : {})
      };
      writeHydratedProfile('smartschool_profile', next);
      break;
    }
    case 'director': {
      const current = loadLocalStorage<DirectorProfile>('smartschool_director_profile_v1', initialDirectorProfile);
      const next: DirectorProfile = {
        ...current,
        name: resolvedName || current.name,
        title: resolvedTitle || current.title,
        matricule: resolvedMatricule || current.matricule,
        email: resolvedEmail || current.email,
        phone: resolvedPhone || current.phone,
        schoolId: resolvedSchoolId || current.schoolId,
        schoolName: resolvedSchoolName || current.schoolName,
        photo: resolvedPhoto || current.photo,
        badgeNumber: sessionUser.badgeNumber || matchedAcc?.badgeNumber || current.badgeNumber
      };
      writeHydratedProfile('smartschool_director_profile_v1', next);
      break;
    }
    case 'secretary': {
      const current = loadLocalStorage<SecretaryProfile>('smartschool_secretary_profile_v1', initialSecretaryProfile);
      const next: SecretaryProfile = {
        ...current,
        name: resolvedName || current.name,
        title: resolvedTitle || current.title,
        matricule: resolvedMatricule || current.matricule,
        email: resolvedEmail || current.email,
        phone: resolvedPhone || current.phone,
        schoolId: resolvedSchoolId || current.schoolId,
        schoolName: resolvedSchoolName || current.schoolName,
        photo: resolvedPhoto || current.photo
      };
      writeHydratedProfile('smartschool_secretary_profile_v1', next);
      break;
    }
    case 'teacher': {
      const current = loadLocalStorage<TeacherProfile>('smartschool_teacher_profile_v1', initialTeacherProfile);
      const next: TeacherProfile = {
        ...current,
        firstName: firstName || current.firstName,
        lastName: lastName || current.lastName,
        matricule: resolvedMatricule || current.matricule,
        email: resolvedEmail || current.email,
        phone: resolvedPhone || current.phone,
        schoolId: resolvedSchoolId || current.schoolId,
        schoolName: resolvedSchoolName || current.schoolName,
        photo: resolvedPhoto || current.photo
      };
      writeHydratedProfile('smartschool_teacher_profile_v1', next);
      break;
    }
    case 'supervisor': {
      const current = loadLocalStorage<SupervisorProfile>('smartschool_supervisor_profile_v1', initialSupervisorProfile);
      const next: SupervisorProfile = {
        ...current,
        firstName: firstName || current.firstName,
        lastName: lastName || current.lastName,
        matricule: resolvedMatricule || current.matricule,
        email: resolvedEmail || current.email,
        phone: resolvedPhone || current.phone,
        roleTitle: resolvedTitle || current.roleTitle,
        schoolId: resolvedSchoolId || current.schoolId,
        schoolName: resolvedSchoolName || current.schoolName,
        photo: resolvedPhoto || current.photo
      };
      writeHydratedProfile('smartschool_supervisor_profile_v1', next);
      break;
    }
    case 'accountant': {
      const current = loadLocalStorage<AccountantProfile>('smartschool_accountant_profile_v1', initialAccountantProfile);
      const next: AccountantProfile = {
        ...current,
        firstName: firstName || current.firstName,
        lastName: lastName || current.lastName,
        matricule: resolvedMatricule || current.matricule,
        email: resolvedEmail || current.email,
        phone: resolvedPhone || current.phone,
        title: resolvedTitle || current.title,
        schoolId: resolvedSchoolId || current.schoolId,
        schoolName: resolvedSchoolName || current.schoolName,
        photo: resolvedPhoto || current.photo
      };
      writeHydratedProfile('smartschool_accountant_profile_v1', next);
      break;
    }
    case 'librarian': {
      const libKey = `smartschool_lib_profile_${resolvedSchoolId || 'ECOLE-001'}`;
      const current = loadLocalStorage<LibrarianProfile>(libKey, initialLibrarianProfile);
      const next: LibrarianProfile = {
        ...current,
        firstName: firstName || current.firstName,
        lastName: lastName || current.lastName,
        matricule: resolvedMatricule || current.matricule,
        email: resolvedEmail || current.email,
        phone: resolvedPhone || current.phone,
        schoolName: resolvedSchoolName || current.schoolName,
        photo: resolvedPhoto || current.photo
      };
      writeHydratedProfile(libKey, next);
      break;
    }
    case 'parent': {
      const current = loadLocalStorage<ParentProfile>('smartschool_parent_profile_v1', initialParentProfile);
      const next: ParentProfile = {
        ...current,
        name: resolvedName || current.name,
        email: resolvedEmail || current.email,
        phone: resolvedPhone || current.phone,
        schoolName: resolvedSchoolName || current.schoolName,
        photo: resolvedPhoto || current.photo
      };
      writeHydratedProfile('smartschool_parent_profile_v1', next);
      break;
    }
    case 'student': {
      const current = loadLocalStorage<StudentProfile>('smartschool_student_profile_v1', initialStudentProfile);
      const next: StudentProfile = {
        ...current,
        firstName: firstName || current.firstName,
        lastName: lastName || current.lastName,
        matricule: resolvedMatricule || current.matricule,
        schoolName: resolvedSchoolName || current.schoolName,
        photo: resolvedPhoto || current.photo
      };
      writeHydratedProfile('smartschool_student_profile_v1', next);
      break;
    }
    default:
      break;
  }
};

export const propagateSuperAdminProfileChange = (
  nextProfile: SuperAdminProfile,
  previousEmail?: string
): void => {
  const { firstName, lastName } = splitFullName(nextProfile.name);
  const existing = getStoredAccounts().find(
    a =>
      a.role === 'super_admin' ||
      (previousEmail && a.email.toLowerCase() === previousEmail.toLowerCase()) ||
      a.email.toLowerCase() === nextProfile.email.toLowerCase()
  );

  const resolvedPhoto =
    nextProfile.photo !== undefined ? nextProfile.photo : existing?.photo;

  upsertUserAccount(
    {
      id: existing?.id || 'USR-SADM-001',
      role: 'super_admin',
      firstName: firstName || nextProfile.name,
      lastName: lastName || '',
      name: nextProfile.name,
      email: nextProfile.email,
      phone: nextProfile.phone,
      matricule: existing?.matricule || 'SADM-GN-001',
      ecoleId: 'NATIONAL',
      schoolName: nextProfile.enterprise || existing?.schoolName || 'Ministère MEPU-A · Direction Nationale',
      title: nextProfile.title || existing?.title,
      photo: resolvedPhoto,
      mustChangePassword: existing?.mustChangePassword ?? false,
      status: existing?.status || 'actif'
    },
    {
      id: existing?.id || 'USR-SADM-001',
      role: 'super_admin',
      ...(previousEmail ? { email: previousEmail } : {})
    }
  );

  syncCurrentUserSession(
    { role: 'super_admin', email: previousEmail || nextProfile.email },
    {
      name: nextProfile.name,
      email: nextProfile.email,
      schoolName: nextProfile.enterprise || undefined,
      ...(resolvedPhoto !== undefined ? { photo: resolvedPhoto } : {})
    }
  );
};

export const propagateSchoolAdminChange = (params: {
  oldEmail?: string;
  oldSchoolId?: string;
  admin: SchoolAdmin;
  plainPassword?: string;
  mustChangePassword?: boolean;
  removed?: boolean;
}): void => {
  const { oldEmail, oldSchoolId, admin, plainPassword, mustChangePassword, removed } = params;
  const canonicalSchoolId = normalizeSchoolId(admin.schoolId) || admin.schoolId;

  if (removed) {
    removeAccountByMatch({
      email: oldEmail || admin.email,
      role: 'school_admin',
      ecoleId: canonicalSchoolId
    });
    return;
  }

  const fullName = `${admin.firstName} ${admin.lastName}`.trim();
  const mappedStatus: AccountStatus = admin.status === 'suspended' ? 'desactive' : 'actif';

  const accounts = getStoredAccounts();
  const matched = accounts.find(
    a =>
      (oldEmail && a.email.toLowerCase() === oldEmail.toLowerCase()) ||
      a.email.toLowerCase() === admin.email.toLowerCase() ||
      (a.role === 'school_admin' &&
        normalizeSchoolId(a.ecoleId) === normalizeSchoolId(oldSchoolId || canonicalSchoolId))
  );

  const upserted = upsertUserAccount(
    {
      id: matched?.id,
      role: 'school_admin',
      firstName: admin.firstName,
      lastName: admin.lastName,
      name: fullName,
      email: admin.email,
      username: admin.email.split('@')[0],
      phone: admin.phone,
      matricule: matched?.matricule || `ADM-${canonicalSchoolId.replace(/[^A-Z0-9]/gi, '').slice(-4).toUpperCase() || '001'}`,
      ecoleId: canonicalSchoolId,
      schoolName: admin.schoolName,
      title: matched?.title || 'Admin École (Fondateur)',
      photo: admin.avatar || matched?.photo,
      plainPassword,
      mustChangePassword: mustChangePassword ?? (admin.passwordResetRequired ? true : matched?.mustChangePassword),
      status: mappedStatus,
      provisionedBy: 'Super Administrateur Global'
    },
    matched
      ? { id: matched.id }
      : {
          email: oldEmail || admin.email,
          role: 'school_admin',
          ecoleId: oldSchoolId || canonicalSchoolId
        }
  );

  syncCurrentUserSession(
    {
      email: oldEmail || admin.email,
      role: 'school_admin',
      ecoleId: oldSchoolId || canonicalSchoolId
    },
    {
      name: fullName,
      email: upserted.email,
      schoolName: admin.schoolName,
      photo: admin.avatar,
      ecoleId: canonicalSchoolId,
      status: mappedStatus,
      mustChangePassword: upserted.mustChangePassword
    }
  );
};

const syncStaffToRoleProfile = (
  workspaceRole: WorkspaceMode,
  member: StaffMember,
  schoolId: string,
  schoolName: string
): void => {
  const fullName = `${member.firstName} ${member.lastName}`.trim();
  const canonicalSchoolId = normalizeSchoolId(schoolId) || schoolId;

  if (workspaceRole === 'director') {
    const current = loadLocalStorage<DirectorProfile>('smartschool_director_profile_v1', initialDirectorProfile);
    if (
      current.matricule.toLowerCase() === member.matricule.toLowerCase() ||
      current.email.toLowerCase() === member.email.toLowerCase() ||
      normalizeSchoolId(current.schoolId) === canonicalSchoolId
    ) {
      writeProfileIfChanged('smartschool_director_profile_v1', {
        ...current,
        name: fullName,
        matricule: member.matricule,
        email: member.email,
        phone: member.phone,
        schoolId: canonicalSchoolId,
        schoolName,
        photo: member.photo || current.photo
      });
    }
  } else if (workspaceRole === 'secretary') {
    const current = loadLocalStorage<SecretaryProfile>('smartschool_secretary_profile_v1', initialSecretaryProfile);
    if (
      current.matricule.toLowerCase() === member.matricule.toLowerCase() ||
      current.email.toLowerCase() === member.email.toLowerCase() ||
      normalizeSchoolId(current.schoolId) === canonicalSchoolId
    ) {
      writeProfileIfChanged('smartschool_secretary_profile_v1', {
        ...current,
        name: fullName,
        matricule: member.matricule,
        email: member.email,
        phone: member.phone,
        schoolId: canonicalSchoolId,
        schoolName,
        photo: member.photo || current.photo
      });
    }
  } else if (workspaceRole === 'teacher') {
    const current = loadLocalStorage<TeacherProfile>('smartschool_teacher_profile_v1', initialTeacherProfile);
    if (
      current.matricule.toLowerCase() === member.matricule.toLowerCase() ||
      current.email.toLowerCase() === member.email.toLowerCase()
    ) {
      writeProfileIfChanged('smartschool_teacher_profile_v1', {
        ...current,
        firstName: member.firstName,
        lastName: member.lastName,
        matricule: member.matricule,
        email: member.email,
        phone: member.phone,
        address: member.address || current.address,
        department: member.department || current.department,
        schoolId: canonicalSchoolId,
        schoolName,
        photo: member.photo || current.photo
      });
    }
  } else if (workspaceRole === 'supervisor') {
    const current = loadLocalStorage<SupervisorProfile>('smartschool_supervisor_profile_v1', initialSupervisorProfile);
    if (
      current.matricule.toLowerCase() === member.matricule.toLowerCase() ||
      current.email.toLowerCase() === member.email.toLowerCase()
    ) {
      writeProfileIfChanged('smartschool_supervisor_profile_v1', {
        ...current,
        firstName: member.firstName,
        lastName: member.lastName,
        matricule: member.matricule,
        email: member.email,
        phone: member.phone,
        address: member.address || current.address,
        department: member.department || current.department,
        schoolId: canonicalSchoolId,
        schoolName,
        photo: member.photo || current.photo
      });
    }
  } else if (workspaceRole === 'accountant') {
    const current = loadLocalStorage<AccountantProfile>('smartschool_accountant_profile_v1', initialAccountantProfile);
    if (
      current.matricule.toLowerCase() === member.matricule.toLowerCase() ||
      current.email.toLowerCase() === member.email.toLowerCase()
    ) {
      writeProfileIfChanged('smartschool_accountant_profile_v1', {
        ...current,
        firstName: member.firstName,
        lastName: member.lastName,
        matricule: member.matricule,
        email: member.email,
        phone: member.phone,
        schoolId: canonicalSchoolId,
        schoolName,
        photo: member.photo || current.photo
      });
    }
  } else if (workspaceRole === 'librarian') {
    const key = `smartschool_lib_profile_${canonicalSchoolId || 'ECOLE-001'}`;
    const current = loadLocalStorage<LibrarianProfile>(key, initialLibrarianProfile);
    if (
      current.matricule.toLowerCase() === member.matricule.toLowerCase() ||
      current.email.toLowerCase() === member.email.toLowerCase()
    ) {
      writeProfileIfChanged(key, {
        ...current,
        firstName: member.firstName,
        lastName: member.lastName,
        matricule: member.matricule,
        email: member.email,
        phone: member.phone,
        address: member.address || current.address,
        schoolName,
        photo: member.photo || current.photo
      });
    }
  }
};

export const propagateStaffMemberChange = (params: {
  oldEmail?: string;
  oldMatricule?: string;
  member: StaffMember;
  schoolId: string;
  schoolName: string;
  removed?: boolean;
}): void => {
  const { oldEmail, oldMatricule, member, schoolId, schoolName, removed } = params;
  const workspaceRole = STAFF_ROLE_TO_WORKSPACE[member.role] || 'teacher';
  const canonicalSchoolId = normalizeSchoolId(schoolId || member.schoolId) || 'ECOLE-001';

  if (removed) {
    removeAccountByMatch({
      email: oldEmail || member.email,
      matricule: oldMatricule || member.matricule
    });
    return;
  }

  const mappedStatus: AccountStatus = member.status === 'suspendu' ? 'desactive' : 'actif';
  const fullName = `${member.firstName} ${member.lastName}`.trim();

  const upserted = upsertUserAccount(
    {
      role: workspaceRole,
      firstName: member.firstName,
      lastName: member.lastName,
      name: fullName,
      email: member.email,
      username: member.username,
      phone: member.phone,
      matricule: member.matricule,
      ecoleId: canonicalSchoolId,
      schoolName,
      title: member.role,
      photo: member.photo,
      ...(member.temporaryPassword ? { plainPassword: member.temporaryPassword, mustChangePassword: false } : {}),
      status: mappedStatus,
      provisionedBy: "Admin École"
    },
    {
      email: oldEmail || member.email,
      matricule: oldMatricule || member.matricule,
      username: member.username,
      ...(member.id === 'stf-001' ? { role: 'director' as WorkspaceMode, ecoleId: canonicalSchoolId } : {})
    }
  );

  syncStaffToRoleProfile(workspaceRole, member, canonicalSchoolId, schoolName);

  syncCurrentUserSession(
    {
      email: oldEmail || member.email,
      matricule: oldMatricule || member.matricule
    },
    {
      name: fullName,
      email: upserted.email,
      matricule: member.matricule,
      schoolName,
      photo: member.photo,
      ecoleId: canonicalSchoolId,
      status: mappedStatus,
      mustChangePassword: upserted.mustChangePassword
    }
  );
};

export const propagateStudentRecordChange = (params: {
  oldEmail?: string;
  oldMatricule?: string;
  student: StudentEnrollment;
  schoolId: string;
  schoolName: string;
  removed?: boolean;
}): void => {
  const { oldEmail, oldMatricule, student, schoolId, schoolName, removed } = params;
  const canonicalSchoolId = normalizeSchoolId(schoolId) || 'ECOLE-001';
  const username = student.credentials?.username?.trim().toLowerCase() || student.matricule.toLowerCase();
  const resolvedEmail = student.email?.trim() ? student.email.trim().toLowerCase() : `${username}@smartschool.gn`;

  if (removed) {
    removeAccountByMatch({
      email: oldEmail || resolvedEmail,
      matricule: oldMatricule || student.matricule
    });
    return;
  }

  const fullName = `${student.firstName} ${student.lastName}`.trim();
  const mappedStatus: AccountStatus = student.status === 'actif' ? 'actif' : 'desactive';

  const upserted = upsertUserAccount(
    {
      role: 'student',
      firstName: student.firstName,
      lastName: student.lastName,
      name: fullName,
      email: resolvedEmail,
      username,
      phone: student.phone,
      matricule: student.matricule,
      ecoleId: canonicalSchoolId,
      schoolName: `${schoolName} (${student.className})`,
      title: `Élève · ${student.className}`,
      photo: student.photo,
      ...(student.credentials?.tempPassword ? { plainPassword: student.credentials.tempPassword, mustChangePassword: true } : {}),
      status: mappedStatus,
      provisionedBy: 'Secrétariat Général'
    },
    {
      email: oldEmail || resolvedEmail,
      matricule: oldMatricule || student.matricule,
      username
    }
  );

  const currentStudentProfile = loadLocalStorage<StudentProfile>('smartschool_student_profile_v1', initialStudentProfile);
  if (
    currentStudentProfile.matricule.toLowerCase() === (oldMatricule || student.matricule).toLowerCase()
  ) {
    writeProfileIfChanged('smartschool_student_profile_v1', {
      ...currentStudentProfile,
      firstName: student.firstName,
      lastName: student.lastName,
      matricule: student.matricule,
      className: student.className,
      photo: student.photo || currentStudentProfile.photo,
      schoolName,
      parentName: student.parentName || currentStudentProfile.parentName,
      parentPhone: student.parentPhone || currentStudentProfile.parentPhone
    });
  }

  syncCurrentUserSession(
    {
      email: oldEmail || resolvedEmail,
      matricule: oldMatricule || student.matricule
    },
    {
      name: fullName,
      email: upserted.email,
      matricule: student.matricule,
      schoolName: upserted.schoolName,
      photo: student.photo,
      ecoleId: canonicalSchoolId,
      status: mappedStatus
    }
  );
};

export const propagateParentRecordChange = (params: {
  oldEmail?: string;
  oldUsername?: string;
  parent: ParentRecord;
  schoolId: string;
  schoolName: string;
  removed?: boolean;
}): void => {
  const { oldEmail, oldUsername, parent, schoolId, schoolName, removed } = params;
  const canonicalSchoolId = normalizeSchoolId(schoolId) || 'ECOLE-001';
  const username = parent.credentials?.username?.trim().toLowerCase() || `par.${parent.id}`;
  const resolvedEmail = parent.email?.trim() ? parent.email.trim().toLowerCase() : `${username}@smartschool.gn`;
  const matricule = `PAR-${parent.id.replace(/[^A-Z0-9]/gi, '').toUpperCase()}`;

  if (removed) {
    removeAccountByMatch({
      email: oldEmail || resolvedEmail,
      username: oldUsername || username,
      matricule
    });
    return;
  }

  const fullName = `${parent.firstName} ${parent.lastName}`.trim();
  const mappedStatus: AccountStatus = parent.status === 'actif' ? 'actif' : 'desactive';

  const upserted = upsertUserAccount(
    {
      role: 'parent',
      firstName: parent.firstName,
      lastName: parent.lastName,
      name: fullName,
      email: resolvedEmail,
      username,
      phone: parent.phone,
      matricule,
      ecoleId: canonicalSchoolId,
      schoolName,
      title: 'Espace Parent (Tuteur)',
      photo: parent.photo,
      ...(parent.credentials?.tempPassword ? { plainPassword: parent.credentials.tempPassword, mustChangePassword: true } : {}),
      status: mappedStatus,
      provisionedBy: 'Secrétariat Général'
    },
    {
      email: oldEmail || resolvedEmail,
      username: oldUsername || username,
      matricule
    }
  );

  const currentParentProfile = loadLocalStorage<ParentProfile>('smartschool_parent_profile_v1', initialParentProfile);
  if (
    currentParentProfile.email.toLowerCase() === (oldEmail || resolvedEmail).toLowerCase() ||
    currentParentProfile.name.toLowerCase() === fullName.toLowerCase()
  ) {
    writeProfileIfChanged('smartschool_parent_profile_v1', {
      ...currentParentProfile,
      name: fullName,
      phone: parent.phone || currentParentProfile.phone,
      email: resolvedEmail,
      address: parent.address || currentParentProfile.address,
      profession: parent.profession || currentParentProfile.profession,
      photo: parent.photo || currentParentProfile.photo,
      schoolName
    });
  }

  syncCurrentUserSession(
    {
      email: oldEmail || resolvedEmail,
      username: oldUsername || username,
      matricule
    },
    {
      name: fullName,
      email: upserted.email,
      schoolName,
      photo: parent.photo,
      ecoleId: canonicalSchoolId,
      status: mappedStatus
    }
  );
};

export const propagateRoleProfileToAccount = (
  role: WorkspaceMode,
  nextProfile: Record<string, any>,
  previousIdentity?: { email?: string; matricule?: string },
  schoolId?: string
): void => {
  const canonicalSchoolId = normalizeSchoolId(schoolId || nextProfile.schoolId) || 'ECOLE-001';
  const email: string | undefined = nextProfile.email;
  const matricule: string | undefined = nextProfile.matricule;
  const phone: string | undefined = nextProfile.phone;
  const photo: string | undefined = nextProfile.photo;
  const schoolName: string | undefined = nextProfile.schoolName;
  const title: string | undefined = nextProfile.title || nextProfile.roleTitle;

  const fullName: string = nextProfile.name
    ? String(nextProfile.name).trim()
    : `${nextProfile.firstName || ''} ${nextProfile.lastName || ''}`.trim();
  const split = splitFullName(fullName);
  const firstName: string = nextProfile.firstName || split.firstName;
  const lastName: string = nextProfile.lastName || split.lastName;

  const accounts = getStoredAccounts();
  const idx = accounts.findIndex(a =>
    (previousIdentity?.email && a.email.toLowerCase() === previousIdentity.email.toLowerCase()) ||
    (previousIdentity?.matricule && a.matricule.toLowerCase() === previousIdentity.matricule.toLowerCase()) ||
    (email && a.email.toLowerCase() === email.toLowerCase()) ||
    (matricule && a.matricule.toLowerCase() === matricule.toLowerCase()) ||
    (a.role === role && normalizeSchoolId(a.ecoleId) === canonicalSchoolId)
  );

  if (idx >= 0) {
    const existing = accounts[idx];
    const updatedAcc: DemoAccount = {
      ...existing,
      name: fullName || existing.name,
      firstName: firstName || existing.firstName,
      lastName: lastName || existing.lastName,
      email: email ? email.trim().toLowerCase() : existing.email,
      phone: phone || existing.phone,
      matricule: matricule ? matricule.trim().toUpperCase() : existing.matricule,
      photo: photo || existing.photo,
      schoolName: schoolName || existing.schoolName,
      title: title || existing.title,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    const nextAccounts = accounts.map((a, i) => (i === idx ? updatedAcc : a));
    saveStoredAccounts(nextAccounts);
  }

  // Sync back into StaffMember list if this role belongs to school staff
  if (['director', 'secretary', 'teacher', 'supervisor', 'accountant', 'librarian'].includes(role)) {
    const staff = loadLocalStorage<StaffMember[]>('smartschool_staff', []);
    if (Array.isArray(staff) && staff.length > 0) {
      let changed = false;
      const nextStaff = staff.map(m => {
        const matches =
          (previousIdentity?.email && m.email.toLowerCase() === previousIdentity.email.toLowerCase()) ||
          (previousIdentity?.matricule && m.matricule.toLowerCase() === previousIdentity.matricule.toLowerCase()) ||
          (email && m.email.toLowerCase() === email.toLowerCase()) ||
          (matricule && m.matricule.toLowerCase() === matricule.toLowerCase());
        if (!matches) return m;
        changed = true;
        return {
          ...m,
          firstName: firstName || m.firstName,
          lastName: lastName || m.lastName,
          email: email || m.email,
          phone: phone || m.phone,
          matricule: matricule || m.matricule,
          photo: photo || m.photo,
          address: nextProfile.address || m.address
        };
      });
      if (changed) {
        saveDualStorage('smartschool_staff', nextStaff, getMonotonicWriteTimestamp(), 'local');
      }
    }
  }

  syncCurrentUserSession(
    {
      email: previousIdentity?.email || email,
      matricule: previousIdentity?.matricule || matricule,
      role,
      ecoleId: canonicalSchoolId
    },
    {
      ...(fullName ? { name: fullName } : {}),
      ...(email ? { email: email.trim().toLowerCase() } : {}),
      ...(matricule ? { matricule: matricule.trim().toUpperCase() } : {}),
      ...(schoolName ? { schoolName } : {}),
      ...(photo ? { photo } : {})
    }
  );
};

export const propagateAccountEditToDomain = (params: {
  oldEmail?: string;
  oldMatricule?: string;
  account: DemoAccount;
  removed?: boolean;
}): void => {
  const { oldEmail, oldMatricule, account, removed } = params;
  const canonicalSchoolId = normalizeSchoolId(account.ecoleId) || account.ecoleId;
  const fullName = account.name || `${account.firstName} ${account.lastName}`.trim();

  if (account.role === 'super_admin' && !removed) {
    const current = loadLocalStorage<SuperAdminProfile>('smartschool_profile', initialSuperAdminProfile);
    writeProfileIfChanged('smartschool_profile', {
      ...current,
      name: fullName,
      title: account.title || current.title,
      email: account.email,
      phone: account.phone || current.phone,
      ...(account.photo !== undefined ? { photo: account.photo || undefined } : {})
    });
  }

  if (account.role === 'school_admin') {
    const admins = loadLocalStorage<SchoolAdmin[]>('smartschool_admins', initialAdmins);
    if (Array.isArray(admins)) {
      if (removed) {
        const filtered = admins.filter(
          a =>
            !(
              (oldEmail && a.email.toLowerCase() === oldEmail.toLowerCase()) ||
              a.email.toLowerCase() === account.email.toLowerCase()
            )
        );
        if (filtered.length !== admins.length) {
          saveDualStorage('smartschool_admins', filtered, getMonotonicWriteTimestamp(), 'local');
        }
      } else {
        let matchedAny = false;
        const nextAdmins = admins.map(a => {
          const isMatch =
            (oldEmail && a.email.toLowerCase() === oldEmail.toLowerCase()) ||
            a.email.toLowerCase() === account.email.toLowerCase() ||
            normalizeSchoolId(a.schoolId) === canonicalSchoolId;
          if (!isMatch) return a;
          matchedAny = true;
          return {
            ...a,
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            phone: account.phone || a.phone,
            avatar: account.photo || a.avatar,
            schoolName: account.schoolName || a.schoolName,
            status: account.status === 'actif' ? ('active' as const) : ('suspended' as const),
            passwordResetRequired: account.mustChangePassword
          };
        });
        if (!matchedAny) {
          nextAdmins.unshift({
            id: `adm-${Date.now()}`,
            schoolId: canonicalSchoolId,
            schoolName: account.schoolName,
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            phone: account.phone,
            avatar: account.photo || '',
            status: account.status === 'actif' ? 'active' : 'suspended',
            createdAt: account.createdAt || new Date().toISOString().split('T')[0],
            lastLogin: 'Jamais connecté',
            passwordResetRequired: account.mustChangePassword
          });
        }
        saveDualStorage('smartschool_admins', nextAdmins, getMonotonicWriteTimestamp(), 'local');
      }
    }
  }

  // Sync StaffMember records
  if (['director', 'secretary', 'teacher', 'supervisor', 'accountant', 'librarian'].includes(account.role)) {
    const staff = loadLocalStorage<StaffMember[]>('smartschool_staff', []);
    if (Array.isArray(staff) && staff.length > 0) {
      let changed = false;
      const nextStaff = removed
        ? staff.filter(m => {
            const match =
              (oldEmail && m.email.toLowerCase() === oldEmail.toLowerCase()) ||
              (oldMatricule && m.matricule.toLowerCase() === oldMatricule.toLowerCase()) ||
              m.email.toLowerCase() === account.email.toLowerCase() ||
              m.matricule.toLowerCase() === account.matricule.toLowerCase();
            if (match) changed = true;
            return !match;
          })
        : staff.map(m => {
            const match =
              (oldEmail && m.email.toLowerCase() === oldEmail.toLowerCase()) ||
              (oldMatricule && m.matricule.toLowerCase() === oldMatricule.toLowerCase()) ||
              m.email.toLowerCase() === account.email.toLowerCase() ||
              m.matricule.toLowerCase() === account.matricule.toLowerCase() ||
              (account.id === 'USR-DIR-001' && m.id === 'stf-001');
            if (!match) return m;
            changed = true;
            return {
              ...m,
              firstName: account.firstName,
              lastName: account.lastName,
              email: account.email,
              phone: account.phone || m.phone,
              matricule: account.matricule,
              photo: account.photo || m.photo,
              status: account.status === 'actif' ? ('actif' as const) : ('suspendu' as const),
              ...(account.plainPassword || account.password
                ? { temporaryPassword: account.plainPassword || account.password }
                : {})
            };
          });
      if (changed) {
        saveDualStorage('smartschool_staff', nextStaff, getMonotonicWriteTimestamp(), 'local');
      }
    }
  }

  // Sync Secretary Student records
  if (account.role === 'student' && !removed) {
    const students = loadLocalStorage<StudentEnrollment[]>('smartschool_secretary_students_v1', []);
    if (Array.isArray(students) && students.length > 0) {
      let changed = false;
      const nextStudents = students.map(s => {
        const match =
          (oldEmail && s.email.toLowerCase() === oldEmail.toLowerCase()) ||
          (oldMatricule && s.matricule.toLowerCase() === oldMatricule.toLowerCase()) ||
          s.email.toLowerCase() === account.email.toLowerCase() ||
          s.matricule.toLowerCase() === account.matricule.toLowerCase();
        if (!match) return s;
        changed = true;
        return {
          ...s,
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          phone: account.phone || s.phone,
          matricule: account.matricule,
          photo: account.photo || s.photo,
          status: account.status === 'actif' ? ('actif' as const) : ('archive' as const),
          credentials: {
            ...s.credentials,
            tempPassword: account.plainPassword || s.credentials.tempPassword
          }
        };
      });
      if (changed) {
        saveDualStorage('smartschool_secretary_students_v1', nextStudents, getMonotonicWriteTimestamp(), 'local');
      }
    }
  }

  // Sync Secretary Parent records
  if (account.role === 'parent' && !removed) {
    const parents = loadLocalStorage<ParentRecord[]>('smartschool_secretary_parents_v1', []);
    if (Array.isArray(parents) && parents.length > 0) {
      let changed = false;
      const nextParents = parents.map(p => {
        const match =
          (oldEmail && p.email.toLowerCase() === oldEmail.toLowerCase()) ||
          p.email.toLowerCase() === account.email.toLowerCase();
        if (!match) return p;
        changed = true;
        return {
          ...p,
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          phone: account.phone || p.phone,
          photo: account.photo || p.photo,
          status: account.status === 'actif' ? ('actif' as const) : ('desactive' as const),
          credentials: {
            ...p.credentials,
            tempPassword: account.plainPassword || p.credentials.tempPassword
          }
        };
      });
      if (changed) {
        saveDualStorage('smartschool_secretary_parents_v1', nextParents, getMonotonicWriteTimestamp(), 'local');
      }
    }
  }

  // Hydrate target role profile if it belongs to this account
  if (!removed) {
    hydrateActiveRoleProfileOnLogin(account);
  }

  // Sync current logged-in session if matching
  syncCurrentUserSession(
    {
      email: oldEmail || account.email,
      matricule: oldMatricule || account.matricule,
      role: account.role,
      ecoleId: canonicalSchoolId
    },
    {
      name: fullName,
      email: account.email,
      matricule: account.matricule,
      schoolName: account.schoolName,
      photo: account.photo,
      ecoleId: canonicalSchoolId,
      status: account.status,
      mustChangePassword: account.mustChangePassword
    }
  );
};

export const propagateSchoolRename = (schoolId: string, newSchoolName: string): void => {
  const canonicalId = normalizeSchoolId(schoolId) || schoolId;
  const accounts = getStoredAccounts();
  let changed = false;
  const nextAccounts = accounts.map(acc => {
    if (normalizeSchoolId(acc.ecoleId) === canonicalId) {
      changed = true;
      return { ...acc, schoolName: newSchoolName };
    }
    return acc;
  });
  if (changed) {
    saveStoredAccounts(nextAccounts);
  }

  const schools = loadLocalStorage<School[]>('smartschool_schools', []);
  if (Array.isArray(schools) && schools.length > 0) {
    // Also update current session if signed in to this school
    try {
      const raw = localStorage.getItem('smartschool_current_user');
      if (raw) {
        const cur = JSON.parse(raw) as CurrentSessionUserLike;
        if (cur && normalizeSchoolId(cur.ecoleId) === canonicalId) {
          syncCurrentUserSession(
            { email: cur.email, role: cur.role, ecoleId: canonicalId },
            { schoolName: newSchoolName }
          );
        }
      }
    } catch {
      // ignore
    }
  }
};
