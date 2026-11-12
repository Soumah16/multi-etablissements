import { WorkspaceMode } from '../App';
import React from 'react';
import { 
  ShieldCheck, 
  School, 
  Award, 
  FileCheck2, 
  GraduationCap, 
  Compass, 
  DollarSign, 
  BookOpen, 
  Users,
  Briefcase
} from 'lucide-react';
import { RoleType, AccountStatus, UserAccount, ROLE_PERMISSIONS_MATRIX, ROLE_LABELS } from '../types/rbac';

export interface DemoAccount extends Omit<UserAccount, 'role'> {
  role: WorkspaceMode;
  name: string;
  password: string;
  plainPassword: string;
  category: 'Direction & Administration' | 'Pédagogie & Encadrement' | 'Finances & Ressources' | 'Famille & Apprenant';
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  provisionedBy: string;
  permissionsSummary: string;
}

const RAW_DEMO_ACCOUNTS: Omit<DemoAccount, 'password'>[] = [
  {
    id: 'USR-SADM-001',
    role: 'super_admin',
    matricule: 'SADM-GN-001',
    ecoleId: 'NATIONAL',
    title: 'Super Administrateur Global',
    name: 'Mamadou Diallo',
    firstName: 'Mamadou',
    lastName: 'Diallo',
    email: 'superadmin@smartschool.gn',
    phone: '+224 624 00 11 22',
    schoolName: 'Ministère MEPU-A · Direction Nationale',
    plainPassword: 'AdminSuper2026!',
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'actif',
    mustChangePassword: false,
    failedLoginAttempts: 0,
    badgeNumber: 'BDG-SADM-2026-001',
    nationalUid: 'GN-MEPUA-SADM-001-9942',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    permissions: ROLE_PERMISSIONS_MATRIX['SUPER_ADMIN_NATIONAL'],
    category: 'Direction & Administration',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: ShieldCheck,
    description: 'Pilotage multi-écoles, abonnements SaaS, devises et gouvernance globale.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    provisionedBy: 'Ministère MEPU-A & Éditeur SmartSchool',
    permissionsSummary: 'Accès absolu à l\'ensemble du réseau national et création des écoles'
  },
  {
    id: 'USR-ADM-001',
    role: 'school_admin',
    matricule: 'ADM-EXC-001',
    ecoleId: 'ECOLE-001',
    title: 'Admin École (Fondateur)',
    name: 'Dr. Alpha Oumar Diallo',
    firstName: 'Alpha Oumar',
    lastName: 'Diallo',
    email: 'admin.conakry@smartschool.gn',
    phone: '+224 622 10 20 30',
    schoolName: 'Lycée d\'Excellence de Conakry',
    plainPassword: 'EcoleAdmin2026!',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    status: 'actif',
    mustChangePassword: false,
    failedLoginAttempts: 0,
    badgeNumber: 'BDG-ADM-2026-001',
    nationalUid: 'GN-MEPUA-ADM-001-8841',
    createdAt: '2026-01-05',
    updatedAt: '2026-01-05',
    permissions: ROLE_PERMISSIONS_MATRIX['ADMIN_ECOLE'],
    category: 'Direction & Administration',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: School,
    description: 'Gestion des classes, coefficients MEPU-A, effectifs et personnels.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    provisionedBy: 'Super Administrateur Global',
    permissionsSummary: 'Gestion souveraine de l\'établissement et délivrance des comptes de son personnel'
  },
  {
    id: 'USR-DIR-001',
    role: 'director',
    matricule: 'DIR-EXC-002',
    ecoleId: 'ECOLE-001',
    title: 'Directeur des Études',
    name: 'Dr. Ibrahima Sory Bangoura',
    firstName: 'Ibrahima Sory',
    lastName: 'Bangoura',
    email: 'directeur@smartschool.gn',
    phone: '+224 621 45 67 89',
    schoolName: 'Lycée d\'Excellence de Conakry',
    plainPassword: 'Directeur2026!',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    status: 'actif',
    mustChangePassword: false,
    failedLoginAttempts: 0,
    badgeNumber: 'BDG-DIR-2026-002',
    nationalUid: 'GN-MEPUA-DIR-002-7740',
    createdAt: '2026-01-08',
    updatedAt: '2026-01-08',
    permissions: ROLE_PERMISSIONS_MATRIX['DIRECTEUR'],
    category: 'Direction & Administration',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: Award,
    description: 'Validation souveraine des examens, proclamation des bulletins et conseil.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    provisionedBy: 'Admin École (Fondateur)',
    permissionsSummary: 'Supervision pédagogique, scellés des examens et signature des bulletins'
  },
  {
    id: 'USR-CEN-001',
    role: 'director', // maps to pedagogical leadership
    matricule: 'CEN-EXC-003',
    ecoleId: 'ECOLE-001',
    title: 'Censeur des Études',
    name: 'M. Sékouba Traoré',
    firstName: 'Sékouba',
    lastName: 'Traoré',
    email: 'censeur@smartschool.gn',
    phone: '+224 623 77 88 99',
    schoolName: 'Lycée d\'Excellence de Conakry',
    plainPassword: 'Censeur2026!',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    status: 'actif',
    mustChangePassword: false,
    failedLoginAttempts: 0,
    badgeNumber: 'BDG-CEN-2026-003',
    nationalUid: 'GN-MEPUA-CEN-003-6621',
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10',
    permissions: ROLE_PERMISSIONS_MATRIX['CENSEUR'],
    category: 'Direction & Administration',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    icon: Briefcase,
    description: 'Discipline pédagogique, contrôle des présences du personnel et emplois du temps.',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
    provisionedBy: 'Admin École (Fondateur)',
    permissionsSummary: 'Organisation des plannings, surveillance des épreuves et discipline générale'
  },
  {
    id: 'USR-SEC-001',
    role: 'secretary',
    matricule: 'SEC-EXC-008',
    ecoleId: 'ECOLE-001',
    title: 'Secrétaire Générale',
    name: 'Mme Kadiatou Diallo',
    firstName: 'Kadiatou',
    lastName: 'Diallo',
    email: 'secretaire@smartschool.gn',
    phone: '+224 620 33 44 55',
    schoolName: 'Lycée d\'Excellence de Conakry',
    plainPassword: 'Secretaire2026!',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    status: 'actif',
    mustChangePassword: false,
    failedLoginAttempts: 0,
    badgeNumber: 'BDG-SEC-2026-008',
    nationalUid: 'GN-MEPUA-SEC-008-5520',
    createdAt: '2026-01-12',
    updatedAt: '2026-01-12',
    permissions: ROLE_PERMISSIONS_MATRIX['SECRETAIRE'],
    category: 'Direction & Administration',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    icon: FileCheck2,
    description: 'Inscriptions, certificats de scolarité, cartes scolaires et archives.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    provisionedBy: 'Admin École (Fondateur)',
    permissionsSummary: 'Inscriptions, délivrance des identifiants élèves/parents et attestations'
  },
  {
    id: 'USR-ENS-001',
    role: 'teacher',
    matricule: 'ENS-EXC-015',
    ecoleId: 'ECOLE-001',
    title: 'Enseignant Titulaire',
    name: 'M. Mamadou Lamarana Diallo',
    firstName: 'Mamadou Lamarana',
    lastName: 'Diallo',
    email: 'prof.diallo@smartschool.gn',
    phone: '+224 628 90 12 34',
    schoolName: 'Lycée d\'Excellence de Conakry',
    plainPassword: 'Professeur2026!',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    status: 'actif',
    mustChangePassword: false,
    failedLoginAttempts: 0,
    badgeNumber: 'BDG-ENS-2026-015',
    nationalUid: 'GN-MEPUA-ENS-015-4419',
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15',
    permissions: ROLE_PERMISSIONS_MATRIX['ENSEIGNANT'],
    category: 'Pédagogie & Encadrement',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: GraduationCap,
    description: 'Cahier de textes, devoirs à la maison, saisie des notes et assiduité.',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
    provisionedBy: 'Direction des Études & Secrétariat',
    permissionsSummary: 'Accès strictement limité aux classes et matières attribuées'
  },
  {
    id: 'USR-SUR-001',
    role: 'supervisor',
    matricule: 'SURV-EXC-2026-015',
    ecoleId: 'ECOLE-001',
    title: 'Surveillant Général',
    name: 'M. Ibrahima Kalil Keïta',
    firstName: 'Ibrahima Kalil',
    lastName: 'Keïta',
    email: 'surveillant@smartschool.gn',
    phone: '+224 627 55 66 77',
    schoolName: 'Lycée d\'Excellence de Conakry',
    plainPassword: 'Surveillant2026!',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    status: 'actif',
    mustChangePassword: false,
    failedLoginAttempts: 0,
    badgeNumber: 'BDG-SUR-2026-010',
    nationalUid: 'GN-MEPUA-SUR-010-3318',
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15',
    permissions: ROLE_PERMISSIONS_MATRIX['SURVEILLANT'],
    category: 'Pédagogie & Encadrement',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: Compass,
    description: 'Pointage des entrées/sorties, gestion de la discipline, retards et billets.',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
    provisionedBy: 'Admin École (Fondateur)',
    permissionsSummary: 'Vie scolaire, pointages entrées/sorties, sanctions et assiduité'
  },
  {
    id: 'USR-CPT-001',
    role: 'accountant',
    matricule: 'CPT-EXC-2026-009',
    ecoleId: 'ECOLE-001',
    title: 'Chef Comptable',
    name: 'M. Ibrahima Kalil Camara',
    firstName: 'Ibrahima Kalil',
    lastName: 'Camara',
    email: 'comptable@smartschool.gn',
    phone: '+224 629 11 22 33',
    schoolName: 'Lycée d\'Excellence de Conakry',
    plainPassword: 'Comptable2026!',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    status: 'actif',
    mustChangePassword: false,
    failedLoginAttempts: 0,
    badgeNumber: 'BDG-CPT-2026-009',
    nationalUid: 'GN-MEPUA-CPT-009-2217',
    createdAt: '2026-01-18',
    updatedAt: '2026-01-18',
    permissions: ROLE_PERMISSIONS_MATRIX['COMPTABLE'],
    category: 'Finances & Ressources',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: DollarSign,
    description: 'Encaissements frais scolaires GNF, reçus numérotés, dépenses et salaires.',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
    provisionedBy: 'Admin École (Fondateur)',
    permissionsSummary: 'Encaissements, factures certifiées, dépenses et gestion de trésorerie'
  },
  {
    id: 'USR-BIB-001',
    role: 'librarian',
    matricule: 'BIB-EXC-2026-004',
    ecoleId: 'ECOLE-001',
    title: 'Bibliothécaire',
    name: 'Mme Aïssatou Sow',
    firstName: 'Aïssatou',
    lastName: 'Sow',
    email: 'biblio@smartschool.gn',
    phone: '+224 625 44 55 66',
    schoolName: 'Lycée d\'Excellence de Conakry',
    plainPassword: 'Biblio2026!',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    status: 'actif',
    mustChangePassword: false,
    failedLoginAttempts: 0,
    badgeNumber: 'BDG-BIB-2026-004',
    nationalUid: 'GN-MEPUA-BIB-004-1116',
    createdAt: '2026-01-20',
    updatedAt: '2026-01-20',
    permissions: ROLE_PERMISSIONS_MATRIX['BIBLIOTHECAIRE'],
    category: 'Finances & Ressources',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: BookOpen,
    description: 'Gestion des manuels physiques, liseuse e-books MEPU-A et suivi des prêts.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    provisionedBy: 'Admin École (Fondateur)',
    permissionsSummary: 'Catalogue des ouvrages, liseuse numérique, gestion des prêts et retours'
  },
  {
    id: 'USR-PAR-001',
    role: 'parent',
    matricule: 'PAR-2026-0042',
    ecoleId: 'ECOLE-001',
    title: 'Espace Parent (Tuteur)',
    name: 'Elhadj Amadou Diallo',
    firstName: 'Amadou',
    lastName: 'Diallo',
    email: 'parent.diallo@smartschool.gn',
    phone: '+224 626 77 88 99',
    schoolName: 'Lycée d\'Excellence de Conakry',
    plainPassword: 'Parent2026!',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    status: 'actif',
    mustChangePassword: false,
    failedLoginAttempts: 0,
    badgeNumber: 'BDG-PAR-2026-042',
    nationalUid: 'GN-MEPUA-PAR-042-9905',
    createdAt: '2026-01-22',
    updatedAt: '2026-01-22',
    permissions: ROLE_PERMISSIONS_MATRIX['PARENT'],
    category: 'Famille & Apprenant',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: Users,
    description: 'Consultation des moyennes, assiduité et paiement Orange/MTN Money.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    provisionedBy: 'Secrétariat Général de l\'établissement',
    permissionsSummary: 'Consultation exclusive des dossiers de ses propres enfants (notes, absences, reçus)'
  },
  {
    id: 'USR-ELV-001',
    role: 'student',
    matricule: 'ELV-EXC-120',
    ecoleId: 'ECOLE-001',
    title: 'Espace Élève (Apprenant)',
    name: 'Fatoumata Binta Diallo',
    firstName: 'Fatoumata Binta',
    lastName: 'Diallo',
    email: 'fatoumata.diallo@smartschool.gn',
    phone: '+224 620 12 34 56',
    schoolName: 'Lycée d\'Excellence de Conakry (TSM)',
    plainPassword: 'Eleve2026!',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    status: 'actif',
    mustChangePassword: false,
    failedLoginAttempts: 0,
    badgeNumber: 'BDG-ELV-2026-120',
    nationalUid: 'GN-MEPUA-ELV-120-8804',
    createdAt: '2026-01-25',
    updatedAt: '2026-01-25',
    permissions: ROLE_PERMISSIONS_MATRIX['ELEVE'],
    category: 'Famille & Apprenant',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    icon: GraduationCap,
    description: 'Dépôt de devoirs (PDF/image), emploi du temps, bibliothèque et badge.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    provisionedBy: 'Secrétariat Général lors de l\'inscription',
    permissionsSummary: 'Consultation des cours, dépôt des devoirs, notes et bibliothèque personnelle'
  }
];

export const DEMO_ACCOUNTS: DemoAccount[] = RAW_DEMO_ACCOUNTS.map(a => ({
  ...a,
  password: a.plainPassword
}));

export const getIconForRole = (role: WorkspaceMode): React.ComponentType<{ className?: string }> => {
  switch (role) {
    case 'super_admin': return ShieldCheck;
    case 'school_admin': return School;
    case 'director': return Award;
    case 'secretary': return FileCheck2;
    case 'teacher': return GraduationCap;
    case 'supervisor': return Compass;
    case 'accountant': return DollarSign;
    case 'librarian': return BookOpen;
    case 'parent': return Users;
    case 'student': return GraduationCap;
    default: return ShieldCheck;
  }
};

export const getBadgeColorForRole = (role: WorkspaceMode): string => {
  switch (role) {
    case 'super_admin': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'school_admin': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'director': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case 'secretary': return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
    case 'teacher': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    case 'supervisor': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    case 'accountant': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'librarian': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'parent': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    case 'student': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
    default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  }
};

export const getCategoryForRole = (role: WorkspaceMode): DemoAccount['category'] => {
  switch (role) {
    case 'super_admin':
    case 'school_admin':
    case 'director':
    case 'secretary':
      return 'Direction & Administration';
    case 'teacher':
    case 'supervisor':
      return 'Pédagogie & Encadrement';
    case 'accountant':
    case 'librarian':
      return 'Finances & Ressources';
    case 'parent':
    case 'student':
    default:
      return 'Famille & Apprenant';
  }
};

const ACCOUNTS_STORAGE_KEY = 'smartschool_accounts_v3';
const DEMO_MODE_STORAGE_KEY = 'smartschool_mode_demo_flag';

export const isDemoModeActive = (): boolean => {
  return false;
};

export const setDemoModeActive = (_active: boolean): void => {
  try {
    localStorage.setItem(DEMO_MODE_STORAGE_KEY, 'false');
  } catch {
    // ignore
  }
};

export const getStoredAccounts = (): DemoAccount[] => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: any) => ({
          ...item,
          name: item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim(),
          password: item.password || item.plainPassword,
          plainPassword: item.plainPassword || item.password,
          icon: getIconForRole(item.role)
        }));
      }
    }
  } catch (err) {
    console.error('Error loading stored accounts:', err);
  }
  return DEMO_ACCOUNTS;
};

export const saveStoredAccounts = (accounts: DemoAccount[]) => {
  try {
    const serializable = accounts.map(({ icon, ...rest }) => rest);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(serializable));
  } catch (err) {
    console.error('Error saving accounts to localStorage:', err);
  }
};

export const getAccountByRole = (role: WorkspaceMode): DemoAccount | undefined => {
  const all = getStoredAccounts();
  return all.find(a => a.role === role);
};

export const getAccountByIdentifier = (identifier: string): DemoAccount | undefined => {
  const clean = identifier.trim().toLowerCase();
  const all = getStoredAccounts();
  return all.find(
    a => a.email.toLowerCase() === clean || a.matricule.toLowerCase() === clean
  );
};

/**
 * Enterprise Authentication Verification
 * Checks: Identifier + Password + Account Status + School Isolation
 * Returns strict user-specified error messages on failure:
 * - "Identifiant ou mot de passe incorrect."
 * - "Compte désactivé."
 * - "Compte verrouillé."
 */
export interface AuthResult {
  success: boolean;
  user?: DemoAccount;
  errorMessage?: string;
  mustChangePassword?: boolean;
}

export const authenticateUser = (
  identifier: string,
  rawPassword: string,
  targetSchoolId?: string
): AuthResult => {
  const accounts = getStoredAccounts();
  const cleanId = identifier.trim().toLowerCase();
  
  const user = accounts.find(
    a => a.email.toLowerCase() === cleanId || a.matricule.toLowerCase() === cleanId
  );

  // 1. Check if user exists
  if (!user) {
    return {
      success: false,
      errorMessage: 'Identifiant ou mot de passe incorrect.'
    };
  }

  // 2. Check if account is locked
  if (user.status === 'verrouille' || (user.failedLoginAttempts && user.failedLoginAttempts >= 5)) {
    return {
      success: false,
      errorMessage: 'Compte verrouillé.'
    };
  }

  // 3. Check if account is deactivated
  if (user.status === 'desactive') {
    return {
      success: false,
      errorMessage: 'Compte désactivé.'
    };
  }

  // 4. Check password
  const passwordMatches = 
    user.plainPassword === rawPassword || 
    (rawPassword === 'Smart@2026' && user.mustChangePassword);

  if (!passwordMatches) {
    // Increment failed login attempts
    const updatedAttempts = (user.failedLoginAttempts || 0) + 1;
    const shouldLock = updatedAttempts >= 5;
    
    const updatedAccounts = accounts.map(a => {
      if (a.id === user.id) {
        return {
          ...a,
          failedLoginAttempts: updatedAttempts,
          status: shouldLock ? ('verrouille' as AccountStatus) : a.status
        };
      }
      return a;
    });
    saveStoredAccounts(updatedAccounts);

    if (shouldLock) {
      return {
        success: false,
        errorMessage: 'Compte verrouillé.'
      };
    }

    return {
      success: false,
      errorMessage: 'Identifiant ou mot de passe incorrect.'
    };
  }

  // 5. Check school isolation (if a specific school was chosen and not a national super admin)
  if (targetSchoolId && targetSchoolId !== 'ALL' && user.ecoleId !== 'NATIONAL' && user.ecoleId !== targetSchoolId) {
    return {
      success: false,
      errorMessage: 'Établissement non autorisé pour ce compte. Vous ne pouvez pas accéder à un autre établissement.'
    };
  }

  // 6. Reset failed attempts on success and record last login
  const now = new Date().toISOString();
  const updatedAccounts = accounts.map(a => {
    if (a.id === user.id) {
      return {
        ...a,
        failedLoginAttempts: 0,
        lastLogin: now
      };
    }
    return a;
  });
  saveStoredAccounts(updatedAccounts);

  return {
    success: true,
    user,
    mustChangePassword: user.mustChangePassword
  };
};

/**
 * Generate Deterministic Unique MEPU-A Identifier
 * e.g. ADM-EXC-001, DIR-EXC-002, CEN-EXC-003, ENS-EXC-015, SEC-EXC-008, ELV-EXC-120
 */
export const generateUniqueMatricule = (
  role: WorkspaceMode,
  schoolCode: string = 'EXC'
): string => {
  const prefixMap: Record<WorkspaceMode, string> = {
    super_admin: 'SADM-GN',
    school_admin: `ADM-${schoolCode}`,
    director: `DIR-${schoolCode}`,
    secretary: `SEC-${schoolCode}`,
    teacher: `ENS-${schoolCode}`,
    supervisor: `SUR-${schoolCode}`,
    accountant: `CPT-${schoolCode}`,
    librarian: `BIB-${schoolCode}`,
    parent: `PAR-${schoolCode}`,
    student: `ELV-${schoolCode}`
  };

  const prefix = prefixMap[role] || `USR-${schoolCode}`;
  const accounts = getStoredAccounts();
  const existingNumbers = accounts
    .filter(a => a.matricule.startsWith(prefix))
    .map(a => {
      const parts = a.matricule.split('-');
      const last = parseInt(parts[parts.length - 1], 10);
      return isNaN(last) ? 0 : last;
    });

  const nextNum = (existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0) + 1;
  const formatted = String(nextNum).padStart(3, '0');
  return `${prefix}-${formatted}`;
};
