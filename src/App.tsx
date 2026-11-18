import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SchoolAdminProvider, useSchoolAdmin } from './context/SchoolAdminContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { SchoolsManagementView } from './components/schools/SchoolsManagementView';
import { SchoolAdminsView } from './components/admins/SchoolAdminsView';
import { SubscriptionsView } from './components/subscriptions/SubscriptionsView';
import { RevenueView } from './components/revenue/RevenueView';
import { AnalyticsAiView } from './components/analytics/AnalyticsAiView';
import { PvcCardStudio } from './components/badges/PvcCardStudio';
import { SystemArchitectureDocsView } from './components/documentation/SystemArchitectureDocsView';
import { CommunicationView } from './components/communication/CommunicationView';
import { SecurityView } from './components/security/SecurityView';
import { BackupView } from './components/backup/BackupView';
import { GlobalSettingsView } from './components/settings/GlobalSettingsView';
import { SuperAdminProfileView } from './components/profile/SuperAdminProfileView';
import { SchoolAdminLayout } from './components/schoolAdmin/SchoolAdminLayout';
import { DirectorProvider } from './context/DirectorContext';
import { DirectorLayout } from './components/director/DirectorLayout';
import { SecretaryProvider } from './context/SecretaryContext';
import { SecretaryLayout } from './components/secretary/SecretaryLayout';
import { TeacherProvider } from './context/TeacherContext';
import { TeacherLayout } from './components/teacher/TeacherLayout';
import { AccountantProvider } from './context/AccountantContext';
import { AccountantLayout } from './components/accountant/AccountantLayout';
import { SupervisorProvider } from './context/SupervisorContext';
import { SupervisorLayout } from './components/supervisor/SupervisorLayout';
import { LibrarianProvider, useLibrarian } from './context/LibrarianContext';
import { LibrarianLayout } from './components/librarian/LibrarianLayout';
import { ParentProvider } from './context/ParentContext';
import { ParentLayout } from './components/parent/ParentLayout';
import { StudentProvider } from './context/StudentContext';
import { StudentLayout } from './components/student/StudentLayout';
import { AuthPortal, AuthenticatedUser } from './components/auth/AuthPortal';
import { RoleSwitchAuthModal } from './components/auth/RoleSwitchAuthModal';
import { SuperAdminUsersView } from './components/users/SuperAdminUsersView';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { PWAUpdateBanner } from './components/common/PWAUpdateBanner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { FirebaseProvider } from './context/FirebaseContext';
import { CloudSyncButton, CloudSyncModal } from './components/common/CloudSyncModal';
import { CheckCircle2, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';
import { ACCOUNTS_STORAGE_KEY, getStoredAccounts, normalizeSchoolId } from './data/accountsData';
import { subscribeStorageKey } from './utils/storage';
import { CURRENT_USER_UPDATED_EVENT, hydrateActiveRoleProfileOnLogin } from './utils/accountSync';

export type WorkspaceMode = 
  | 'super_admin' 
  | 'school_admin' 
  | 'director' 
  | 'secretary' 
  | 'teacher' 
  | 'accountant' 
  | 'supervisor'
  | 'librarian'
  | 'parent'
  | 'student';

const MainLayout: React.FC = () => {
  const { activeTab, toastMessage, isRtl, schools, showToast } = useApp();
  const { setCurrentSchoolId, currentSchool } = useSchoolAdmin();
  const {
    setActiveSchoolId,
    authorizeLibrarianSession,
    logoutFromLibrary
  } = useLibrarian();

  // Authentication gate state (persisted in localStorage so mobile/PWA sessions survive tab suspension)
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(() => {
    try {
      const saved =
        localStorage.getItem('smartschool_current_user') ||
        sessionStorage.getItem('smartschool_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Mode switcher across all workspaces
  const [workspaceMode, setWorkspaceModeState] = useState<WorkspaceMode>(() => {
    try {
      const savedMode = localStorage.getItem('smartschool_workspace_mode') as WorkspaceMode | null;
      if (savedMode) return savedMode;
    } catch {
      // ignore
    }
    return currentUser?.role || 'super_admin';
  });
  const setWorkspaceMode = (mode: WorkspaceMode) => {
    setWorkspaceModeState(mode);
    try {
      localStorage.setItem('smartschool_workspace_mode', mode);
    } catch {
      // ignore
    }
  };
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Security gate: Pending role switch requiring authentication
  const [pendingRoleSwitch, setPendingRoleSwitch] = useState<{
    role: WorkspaceMode;
    schoolId?: string;
  } | null>(null);

  const handleLogin = (user: AuthenticatedUser) => {
    try {
      localStorage.setItem('smartschool_current_user', JSON.stringify(user));
    } catch {
      // ignore
    }
    hydrateActiveRoleProfileOnLogin(user);
    setCurrentUser(user);
    setWorkspaceMode(user.role);
    if (user.ecoleId && user.ecoleId !== 'NATIONAL') {
      setCurrentSchoolId(user.ecoleId);
      setActiveSchoolId(user.ecoleId);
    }
    if (user.role === 'librarian') {
      authorizeLibrarianSession(user);
    } else {
      logoutFromLibrary();
    }
  };

  const handleLogout = React.useCallback((reason?: string | unknown) => {
    logoutFromLibrary();
    setCurrentUser(null);
    setPendingRoleSwitch(null);
    try {
      localStorage.removeItem('smartschool_current_user');
      localStorage.removeItem('smartschool_workspace_mode');
      localStorage.removeItem('smartschool_last_activity_v1');
      sessionStorage.removeItem('smartschool_current_user');
    } catch {
      // ignore
    }
    if (typeof reason === 'string' && reason && showToast) {
      showToast(reason);
    }
  }, [logoutFromLibrary, showToast]);

  // Live session enforcement: 45-minute inactivity auto-logout & live suspension check
  React.useEffect(() => {
    if (!currentUser) return;

    const INACTIVITY_MS = 45 * 60 * 1000;
    const ACTIVITY_KEY = 'smartschool_last_activity_v1';

    const updateActivity = () => {
      try {
        localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
      } catch {
        // ignore
      }
    };

    try {
      const lastRaw = localStorage.getItem(ACTIVITY_KEY);
      if (lastRaw && Date.now() - Number(lastRaw) > INACTIVITY_MS) {
        handleLogout('Session expirée après 45 minutes d’inactivité.');
        return;
      }
      updateActivity();
    } catch {
      // ignore
    }

    let throttleAt = 0;
    const onUserActivity = () => {
      const now = Date.now();
      if (now - throttleAt < 15000) return;
      throttleAt = now;
      updateActivity();
    };

    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'mousemove', 'touchstart', 'scroll'];
    events.forEach(ev => window.addEventListener(ev, onUserActivity, { passive: true }));

    const checker = setInterval(() => {
      try {
        const lastRaw = localStorage.getItem(ACTIVITY_KEY);
        if (lastRaw && Date.now() - Number(lastRaw) > INACTIVITY_MS) {
          handleLogout('Session expirée automatiquement après 45 minutes d’inactivité.');
        }
      } catch {
        // ignore
      }
    }, 30000);

    return () => {
      events.forEach(ev => window.removeEventListener(ev, onUserActivity));
      clearInterval(checker);
    };
  }, [currentUser, handleLogout]);

  // Live school/account suspension check
  React.useEffect(() => {
    if (!currentUser) return;
    const accounts = getStoredAccounts();
    const matched = accounts.find(
      a =>
        (currentUser.email && a.email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (currentUser.matricule && a.matricule.toLowerCase() === currentUser.matricule.toLowerCase())
    );
    if (matched && (matched.status === 'verrouille' || matched.status === 'desactive')) {
      handleLogout('Votre compte a été verrouillé ou suspendu par un administrateur.');
      return;
    }
    if (currentUser.role !== 'super_admin' && currentUser.ecoleId && currentUser.ecoleId !== 'NATIONAL') {
      const canonical = normalizeSchoolId(currentUser.ecoleId);
      const userSchool = schools.find(s => normalizeSchoolId(s.id) === canonical);
      if (userSchool && (userSchool.status === 'suspended' || userSchool.status === 'archived')) {
        handleLogout(`L'accès pour l'établissement « ${userSchool.name} » est actuellement suspendu.`);
      }
    }
  }, [currentUser, schools, handleLogout]);

  // Listen for cross-module updates to the logged-in user or accounts registry
  React.useEffect(() => {
    const handleSessionUpdated = (ev: Event) => {
      const detail = (ev as CustomEvent<AuthenticatedUser>).detail;
      if (detail) {
        setCurrentUser(prev => (JSON.stringify(prev) === JSON.stringify(detail) ? prev : detail));
      }
    };
    window.addEventListener(CURRENT_USER_UPDATED_EVENT, handleSessionUpdated);

    const unsubAccounts = subscribeStorageKey(ACCOUNTS_STORAGE_KEY, () => {
      setCurrentUser(prev => {
        if (!prev) return prev;
        const accounts = getStoredAccounts();
        const match = accounts.find(
          a =>
            (prev.email && a.email.toLowerCase() === prev.email.toLowerCase()) ||
            (prev.matricule && a.matricule.toLowerCase() === prev.matricule.toLowerCase())
        );
        if (!match) return prev;
        if (match.status === 'verrouille' || match.status === 'desactive') {
          setTimeout(() => handleLogout('Compte suspendu ou verrouillé.'), 0);
          return null;
        }
        const nextUser: AuthenticatedUser = {
          ...prev,
          name: match.name || prev.name,
          email: match.email || prev.email,
          matricule: match.matricule || prev.matricule,
          schoolName: match.schoolName || prev.schoolName,
          photo: match.photo || prev.photo,
          ecoleId: match.ecoleId || prev.ecoleId,
          status: match.status || prev.status,
          mustChangePassword: match.mustChangePassword
        };
        if (JSON.stringify(nextUser) === JSON.stringify(prev)) return prev;
        try {
          localStorage.setItem('smartschool_current_user', JSON.stringify(nextUser));
        } catch {
          // ignore
        }
        hydrateActiveRoleProfileOnLogin(nextUser);
        return nextUser;
      });
    });

    return () => {
      window.removeEventListener(CURRENT_USER_UPDATED_EVENT, handleSessionUpdated);
      unsubAccounts();
    };
  }, [handleLogout]);

  // Keep school & librarian session synchronized with logged-in user
  React.useEffect(() => {
    if (currentUser?.ecoleId && currentUser.ecoleId !== 'NATIONAL') {
      setCurrentSchoolId(currentUser.ecoleId);
      setActiveSchoolId(currentUser.ecoleId);
    } else if (currentSchool?.id) {
      setActiveSchoolId(currentSchool.id);
    }
    if (currentUser?.role === 'librarian') {
      authorizeLibrarianSession(currentUser);
    }
  }, [currentUser?.ecoleId, currentUser?.role, currentSchool?.id, setCurrentSchoolId, setActiveSchoolId]);

  // Safe Role Switch Request: Always demands credentials verification & school isolation
  const requestRoleSwitch = (targetRole: WorkspaceMode, schoolId?: string) => {
    // Multi-School Isolation Guarantee:
    // An admin or user CANNOT access another admin's school!
    if (
      currentUser?.role !== 'super_admin' &&
      schoolId &&
      currentUser?.ecoleId &&
      normalizeSchoolId(schoolId) !== normalizeSchoolId(currentUser.ecoleId)
    ) {
      if (showToast) {
        showToast("Accès refusé : Cloisonnement strict. Un administrateur ne peut pas accéder à l'école d'un autre administrateur.");
      }
      return;
    }

    // If target role is identical to current and no school change, stay
    if (
      targetRole === workspaceMode &&
      (!schoolId || normalizeSchoolId(schoolId) === normalizeSchoolId(currentSchool?.id))
    ) {
      return;
    }
    setPendingRoleSwitch({ role: targetRole, schoolId });
  };

  const handleRoleSwitchSuccess = (newUser: AuthenticatedUser) => {
    try {
      localStorage.setItem('smartschool_current_user', JSON.stringify(newUser));
    } catch {
      // ignore
    }
    hydrateActiveRoleProfileOnLogin(newUser);
    const nextSchoolId =
      pendingRoleSwitch?.schoolId ||
      (newUser.ecoleId && newUser.ecoleId !== 'NATIONAL' ? newUser.ecoleId : undefined);
    if (nextSchoolId) {
      setCurrentSchoolId(nextSchoolId);
      setActiveSchoolId(nextSchoolId);
    }
    setCurrentUser(newUser);
    setWorkspaceMode(newUser.role);
    if (newUser.role === 'librarian') {
      authorizeLibrarianSession(newUser);
    } else {
      logoutFromLibrary();
    }
    setPendingRoleSwitch(null);
    if (showToast) {
      showToast(`Session sécurisée ouverte : ${newUser.name} (${newUser.role})`);
    }
  };

  if (!currentUser) {
    return (
      <>
        <AuthPortal onLogin={handleLogin} />
        <OfflineIndicator />
        <PWAUpdateBanner />
        <CloudSyncModal />
      </>
    );
  }

  const handleSwitchToSuperAdmin = () => requestRoleSwitch('super_admin');
  const handleSwitchToSchoolAdmin = (schoolId?: string) => requestRoleSwitch('school_admin', schoolId);
  const handleSwitchToDirector = () => requestRoleSwitch('director');
  const handleSwitchToSecretary = () => requestRoleSwitch('secretary');
  const handleSwitchToTeacher = () => requestRoleSwitch('teacher');
  const handleSwitchToAccountant = () => requestRoleSwitch('accountant');
  const handleSwitchToSupervisor = () => requestRoleSwitch('supervisor');
  const handleSwitchToLibrarian = () => {
    // Every visitor entering the library must connect with their personal account;
    // only an already-signed-in school librarian keeps direct admin access.
    if (currentUser.role === 'librarian') {
      authorizeLibrarianSession(currentUser);
    } else {
      logoutFromLibrary();
    }
    setWorkspaceMode('librarian');
  };
  const handleSwitchToParent = () => requestRoleSwitch('parent');
  const handleSwitchToStudent = () => requestRoleSwitch('student');

  const renderCurrentWorkspace = () => {
    if (workspaceMode === 'student') {
      return (
        <StudentLayout 
          onLogout={() => handleLogout()}
          onReturnToSuperAdmin={handleSwitchToSuperAdmin}
          onReturnToSchoolAdmin={handleSwitchToSchoolAdmin}
          onSwitchToDirector={handleSwitchToDirector}
          onSwitchToSecretary={handleSwitchToSecretary}
          onSwitchToTeacher={handleSwitchToTeacher}
          onSwitchToAccountant={handleSwitchToAccountant}
          onSwitchToSupervisor={handleSwitchToSupervisor}
          onSwitchToLibrarian={handleSwitchToLibrarian}
          onSwitchToParent={handleSwitchToParent}
        />
      );
    }

    if (workspaceMode === 'parent') {
      return (
        <ParentLayout 
          onLogout={() => handleLogout()}
          onReturnToSuperAdmin={handleSwitchToSuperAdmin}
          onReturnToSchoolAdmin={handleSwitchToSchoolAdmin}
          onSwitchToDirector={handleSwitchToDirector}
          onSwitchToSecretary={handleSwitchToSecretary}
          onSwitchToTeacher={handleSwitchToTeacher}
          onSwitchToAccountant={handleSwitchToAccountant}
          onSwitchToSupervisor={handleSwitchToSupervisor}
          onSwitchToLibrarian={handleSwitchToLibrarian}
          onSwitchToStudent={handleSwitchToStudent}
        />
      );
    }

    if (workspaceMode === 'librarian') {
      return (
        <LibrarianLayout
          onLogout={() => handleLogout()}
          onExitLibrary={() => {
            if (currentUser.role !== 'librarian') {
              logoutFromLibrary();
            }
            setWorkspaceMode(currentUser.role);
          }}
          onReturnToSuperAdmin={handleSwitchToSuperAdmin}
          onReturnToSchoolAdmin={handleSwitchToSchoolAdmin}
          onSwitchToDirector={handleSwitchToDirector}
          onSwitchToSecretary={handleSwitchToSecretary}
          onSwitchToTeacher={handleSwitchToTeacher}
          onSwitchToAccountant={handleSwitchToAccountant}
          onSwitchToSupervisor={handleSwitchToSupervisor}
          onSwitchToParent={handleSwitchToParent}
          onSwitchToStudent={handleSwitchToStudent}
        />
      );
    }

    if (workspaceMode === 'supervisor') {
      return (
        <SupervisorLayout 
          onLogout={() => handleLogout()}
          onReturnToSchoolAdmin={handleSwitchToSchoolAdmin}
          onReturnToDirector={handleSwitchToDirector}
          onReturnToSecretary={handleSwitchToSecretary}
          onReturnToTeacher={handleSwitchToTeacher}
          onReturnToAccountant={handleSwitchToAccountant}
          onReturnToSuperAdmin={handleSwitchToSuperAdmin}
        />
      );
    }

    if (workspaceMode === 'accountant') {
      return (
        <AccountantLayout 
          onLogout={() => handleLogout()}
          onReturnToSchoolAdmin={handleSwitchToSchoolAdmin}
          onReturnToDirector={handleSwitchToDirector}
          onReturnToSecretary={handleSwitchToSecretary}
          onReturnToTeacher={handleSwitchToTeacher}
          onReturnToSuperAdmin={handleSwitchToSuperAdmin}
          onSwitchToSupervisor={handleSwitchToSupervisor}
        />
      );
    }

    if (workspaceMode === 'teacher') {
      return (
        <TeacherLayout 
          onLogout={() => handleLogout()}
          onReturnToSchoolAdmin={handleSwitchToSchoolAdmin}
          onReturnToDirector={handleSwitchToDirector}
          onReturnToSecretary={handleSwitchToSecretary}
          onReturnToSuperAdmin={handleSwitchToSuperAdmin}
          onSwitchToAccountant={handleSwitchToAccountant}
          onSwitchToSupervisor={handleSwitchToSupervisor}
        />
      );
    }

    if (workspaceMode === 'secretary') {
      return (
        <SecretaryLayout 
          onLogout={() => handleLogout()}
          onReturnToSchoolAdmin={handleSwitchToSchoolAdmin}
          onReturnToDirector={handleSwitchToDirector}
          onReturnToSuperAdmin={handleSwitchToSuperAdmin}
          onSwitchToTeacher={handleSwitchToTeacher}
          onSwitchToAccountant={handleSwitchToAccountant}
          onSwitchToSupervisor={handleSwitchToSupervisor}
        />
      );
    }

    if (workspaceMode === 'director') {
      return (
        <DirectorLayout 
          onLogout={() => handleLogout()}
          onReturnToSchoolAdmin={handleSwitchToSchoolAdmin}
          onReturnToSuperAdmin={handleSwitchToSuperAdmin}
          onSwitchToSecretary={handleSwitchToSecretary}
          onSwitchToTeacher={handleSwitchToTeacher}
          onSwitchToAccountant={handleSwitchToAccountant}
          onSwitchToSupervisor={handleSwitchToSupervisor}
          onSwitchToLibrarian={handleSwitchToLibrarian}
          onSwitchToParent={handleSwitchToParent}
          onSwitchToStudent={handleSwitchToStudent}
        />
      );
    }

    if (workspaceMode === 'school_admin') {
      return (
        <SchoolAdminLayout 
          onLogout={() => handleLogout()}
          onReturnToSuperAdmin={handleSwitchToSuperAdmin}
          onSwitchToDirector={handleSwitchToDirector}
          onSwitchToSecretary={handleSwitchToSecretary}
          onSwitchToTeacher={handleSwitchToTeacher}
          onSwitchToAccountant={handleSwitchToAccountant}
          onSwitchToSupervisor={handleSwitchToSupervisor}
        />
      );
    }

    const renderActiveView = () => {
      switch (activeTab) {
        case 'dashboard':
          return <DashboardView />;
        case 'users':
          return <SuperAdminUsersView onSwitchToUser={handleRoleSwitchSuccess} />;
        case 'schools':
          return <SchoolsManagementView onSwitchToSchoolAdmin={handleSwitchToSchoolAdmin} />;
        case 'admins':
          return <SchoolAdminsView onSwitchToSchoolAdmin={handleSwitchToSchoolAdmin} />;
        case 'subscriptions':
          return <SubscriptionsView />;
        case 'revenue':
          return <RevenueView />;
        case 'analytics':
          return <AnalyticsAiView />;
        case 'badges':
          return <PvcCardStudio />;
        case 'architecture':
          return <SystemArchitectureDocsView />;
        case 'communication':
          return <CommunicationView />;
        case 'security':
          return <SecurityView />;
        case 'backups':
          return <BackupView />;
        case 'settings':
          return <GlobalSettingsView />;
        case 'profile':
          return <SuperAdminProfileView />;
        default:
          return <DashboardView />;
      }
    };

    // Default Super Admin Main Layout
    return (
      <div className={`min-h-screen overflow-x-hidden bg-gradient-to-b from-[#F0F5FA] via-[#E8F1FB] to-[#DFEDFA] text-slate-800 flex ${isRtl ? 'rtl' : 'ltr'}`}>
        {/* Toast popup */}
        {toastMessage && (
          <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        )}

        {/* Sidebar */}
        <Sidebar 
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Header 
            currentUserRole={currentUser?.role}
            onToggleSidebarMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
            onLogout={() => handleLogout()}
            onSwitchToSchoolAdmin={(schoolId) => handleSwitchToSchoolAdmin(schoolId || schools[0]?.id)}
            onSwitchToDirector={handleSwitchToDirector}
            onSwitchToSecretary={handleSwitchToSecretary}
            onSwitchToTeacher={handleSwitchToTeacher}
            onSwitchToAccountant={handleSwitchToAccountant}
            onSwitchToSupervisor={handleSwitchToSupervisor}
            onSwitchToLibrarian={handleSwitchToLibrarian}
            onSwitchToParent={handleSwitchToParent}
            onSwitchToStudent={handleSwitchToStudent}
          />

          <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-[1560px] w-full mx-auto min-w-0">
            {renderActiveView()}
          </main>

          <footer className="mt-auto px-3 sm:px-6 py-4 text-center text-[11px] sm:text-xs text-slate-600 border-t border-blue-100 bg-white/75 backdrop-blur-xs">
            <span className="break-words">SmartSchool ERP Guinée · Conçu et développé par <strong className="text-blue-950">Saïd Soumah</strong> (<a href="mailto:saidsoumah23@gmail.com" className="text-blue-600 hover:underline font-medium">saidsoumah23@gmail.com</a>)</span>
          </footer>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderCurrentWorkspace()}
      <OfflineIndicator />
      <PWAUpdateBanner />
      {workspaceMode !== 'super_admin' && (
        <div className="fixed bottom-4 right-4 z-40 shadow-lg rounded-xl">
          <CloudSyncButton compact />
        </div>
      )}
      <CloudSyncModal />
      {pendingRoleSwitch && (
        <RoleSwitchAuthModal
          targetRole={pendingRoleSwitch.role}
          targetSchoolId={pendingRoleSwitch.schoolId}
          currentUser={currentUser}
          onSuccess={handleRoleSwitchSuccess}
          onCancel={() => setPendingRoleSwitch(null)}
          onLogout={() => {
            setPendingRoleSwitch(null);
            handleLogout();
          }}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <AppProvider>
          <SchoolAdminProvider>
            <DirectorProvider>
              <SecretaryProvider>
                <TeacherProvider>
                  <AccountantProvider>
                    <SupervisorProvider>
                      <LibrarianProvider>
                        <ParentProvider>
                          <StudentProvider>
                            <MainLayout />
                          </StudentProvider>
                        </ParentProvider>
                      </LibrarianProvider>
                    </SupervisorProvider>
                  </AccountantProvider>
                </TeacherProvider>
              </SecretaryProvider>
            </DirectorProvider>
          </SchoolAdminProvider>
        </AppProvider>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
