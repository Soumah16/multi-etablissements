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
import { LibrarianProvider } from './context/LibrarianContext';
import { LibrarianLayout } from './components/librarian/LibrarianLayout';
import { ParentProvider } from './context/ParentContext';
import { ParentLayout } from './components/parent/ParentLayout';
import { StudentProvider } from './context/StudentContext';
import { StudentLayout } from './components/student/StudentLayout';
import { AuthPortal, AuthenticatedUser } from './components/auth/AuthPortal';
import { RoleSwitchAuthModal } from './components/auth/RoleSwitchAuthModal';
import { SuperAdminUsersView } from './components/users/SuperAdminUsersView';
import { CheckCircle2, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';

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

  // Authentication gate state
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(() => {
    try {
      const saved = sessionStorage.getItem('smartschool_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Mode switcher across all workspaces
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>(() => {
    return currentUser?.role || 'super_admin';
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Security gate: Pending role switch requiring authentication
  const [pendingRoleSwitch, setPendingRoleSwitch] = useState<{
    role: WorkspaceMode;
    schoolId?: string;
  } | null>(null);

  const handleLogin = (user: AuthenticatedUser) => {
    setCurrentUser(user);
    setWorkspaceMode(user.role);
    if (user.ecoleId && user.ecoleId !== 'NATIONAL') {
      setCurrentSchoolId(user.ecoleId);
    }
    try {
      sessionStorage.setItem('smartschool_current_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  // Keep school synchronized with logged-in user
  React.useEffect(() => {
    if (currentUser?.ecoleId && currentUser.ecoleId !== 'NATIONAL') {
      setCurrentSchoolId(currentUser.ecoleId);
    }
  }, [currentUser?.ecoleId, setCurrentSchoolId]);

  const handleLogout = () => {
    setCurrentUser(null);
    setPendingRoleSwitch(null);
    try {
      sessionStorage.removeItem('smartschool_current_user');
    } catch {
      // ignore
    }
  };

  // Safe Role Switch Request: Always demands credentials verification & school isolation
  const requestRoleSwitch = (targetRole: WorkspaceMode, schoolId?: string) => {
    // Multi-School Isolation Guarantee:
    // An admin or user CANNOT access another admin's school!
    if (currentUser?.role !== 'super_admin' && schoolId && currentUser?.ecoleId && schoolId !== currentUser.ecoleId) {
      if (showToast) {
        showToast("Accès refusé : Cloisonnement strict. Un administrateur ne peut pas accéder à l'école d'un autre administrateur.");
      }
      return;
    }

    // If target role is identical to current and no school change, stay
    if (targetRole === workspaceMode && (!schoolId || schoolId === currentSchool?.id)) {
      return;
    }
    setPendingRoleSwitch({ role: targetRole, schoolId });
  };

  const handleRoleSwitchSuccess = (newUser: AuthenticatedUser) => {
    if (pendingRoleSwitch?.schoolId) {
      setCurrentSchoolId(pendingRoleSwitch.schoolId);
    }
    setCurrentUser(newUser);
    setWorkspaceMode(newUser.role);
    try {
      sessionStorage.setItem('smartschool_current_user', JSON.stringify(newUser));
    } catch {
      // ignore
    }
    setPendingRoleSwitch(null);
    if (showToast) {
      showToast(`Session sécurisée ouverte : ${newUser.name} (${newUser.role})`);
    }
  };

  if (!currentUser) {
    return <AuthPortal onLogin={handleLogin} />;
  }

  const handleSwitchToSuperAdmin = () => requestRoleSwitch('super_admin');
  const handleSwitchToSchoolAdmin = (schoolId?: string) => requestRoleSwitch('school_admin', schoolId);
  const handleSwitchToDirector = () => requestRoleSwitch('director');
  const handleSwitchToSecretary = () => requestRoleSwitch('secretary');
  const handleSwitchToTeacher = () => requestRoleSwitch('teacher');
  const handleSwitchToAccountant = () => requestRoleSwitch('accountant');
  const handleSwitchToSupervisor = () => requestRoleSwitch('supervisor');
  const handleSwitchToLibrarian = () => requestRoleSwitch('librarian');
  const handleSwitchToParent = () => requestRoleSwitch('parent');
  const handleSwitchToStudent = () => requestRoleSwitch('student');

  const renderCurrentWorkspace = () => {
    if (workspaceMode === 'student') {
      return (
        <StudentLayout 
          onLogout={handleLogout}
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
          onLogout={handleLogout}
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
          onLogout={handleLogout}
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
          onLogout={handleLogout}
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
          onLogout={handleLogout}
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
          onLogout={handleLogout}
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
          onLogout={handleLogout}
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
          onLogout={handleLogout}
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
          onLogout={handleLogout}
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
            onLogout={handleLogout}
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
  );
}
