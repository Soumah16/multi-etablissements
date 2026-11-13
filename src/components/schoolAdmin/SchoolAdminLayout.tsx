import React, { useState } from 'react';
import { useSchoolAdmin, SchoolAdminNavTab } from '../../context/SchoolAdminContext';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BookOpen, 
  DoorOpen, 
  Calendar, 
  Shuffle, 
  FileText, 
  Megaphone, 
  BarChart3, 
  ShieldCheck, 
  Sliders, 
  ArrowLeft, 
  School as SchoolIcon,
  Menu,
  X,
  Lock,
  Globe
} from 'lucide-react';
import { SchoolAdminDashboard } from './SchoolAdminDashboard';
import { StaffManagementView } from './StaffManagementView';
import { ClassesManagementView } from './ClassesManagementView';
import { SubjectsManagementView } from './SubjectsManagementView';
import { RoomsManagementView } from './RoomsManagementView';
import { AcademicYearsView } from './AcademicYearsView';
import { AssignmentsView } from './AssignmentsView';
import { AdministrativeDocumentsView } from './AdministrativeDocumentsView';
import { AdministrativeEventsView } from './AdministrativeEventsView';
import { SchoolReportsView } from './SchoolReportsView';
import { SchoolSecurityView } from './SchoolSecurityView';
import { SchoolSettingsView } from './SchoolSettingsView';
import { PinVerificationModal } from './PinVerificationModal';
import { ArrowRightLeft, ChevronDown, LogOut } from 'lucide-react';

interface SchoolAdminLayoutProps {
  onReturnToSuperAdmin: () => void;
  onLogout?: () => void;
  onSwitchToDirector?: () => void;
  onSwitchToSecretary?: () => void;
  onSwitchToTeacher?: () => void;
  onSwitchToAccountant?: () => void;
  onSwitchToSupervisor?: () => void;
}

export const SchoolAdminLayout: React.FC<SchoolAdminLayoutProps> = ({ 
  onReturnToSuperAdmin, 
  onLogout,
  onSwitchToDirector,
  onSwitchToSecretary,
  onSwitchToTeacher,
  onSwitchToAccountant,
  onSwitchToSupervisor
}) => {
  const { 
    activeSchoolTab, 
    setActiveSchoolTab, 
    currentSchool, 
    setCurrentSchoolId,
    staff,
    classes 
  } = useSchoolAdmin();
  const { schools, admins } = useApp();
  const assignedAdmin = admins.find(a => a.schoolId === currentSchool.id);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  // Cleanly categorized navigation groups for School Admin
  const navigationGroups: {
    groupTitle: string;
    items: {
      tab: SchoolAdminNavTab;
      label: string;
      icon: React.ReactNode;
      badge?: number;
    }[];
  }[] = [
    {
      groupTitle: 'PILOTAGE ÉCOLE',
      items: [
        { tab: 'dashboard', label: 'Tableau de Bord', icon: <LayoutDashboard className="w-4 h-4" /> },
        { tab: 'staff', label: 'Personnel & Badges', icon: <Users className="w-4 h-4 text-emerald-600" />, badge: staff.length },
        { tab: 'classes', label: 'Classes & Sections', icon: <Building2 className="w-4 h-4 text-blue-600" />, badge: classes.length },
        { tab: 'subjects', label: 'Matières & Coefs', icon: <BookOpen className="w-4 h-4 text-amber-600" /> }
      ]
    },
    {
      groupTitle: 'INFRASTRUCTURE & CADRE',
      items: [
        { tab: 'rooms', label: 'Salles & Espaces', icon: <DoorOpen className="w-4 h-4" /> },
        { tab: 'years', label: 'Années Scolaires', icon: <Calendar className="w-4 h-4 text-purple-600" /> },
        { tab: 'assignments', label: 'Affectations', icon: <Shuffle className="w-4 h-4 text-cyan-600" /> }
      ]
    },
    {
      groupTitle: 'ADMINISTRATION & RAPPORTS',
      items: [
        { tab: 'documents', label: 'Documents & Certificats', icon: <FileText className="w-4 h-4 text-teal-600" /> },
        { tab: 'events', label: 'Événements & Notes', icon: <Megaphone className="w-4 h-4 text-rose-600" /> },
        { tab: 'reports', label: 'Rapports & Exports', icon: <BarChart3 className="w-4 h-4 text-amber-600" /> }
      ]
    },
    {
      groupTitle: 'SÉCURITÉ & SYSTÈME',
      items: [
        { tab: 'security', label: 'Sécurité & Code PIN', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> },
        { tab: 'settings', label: 'Paramètres École', icon: <Sliders className="w-4 h-4" /> }
      ]
    }
  ];

  const renderContent = () => {
    switch (activeSchoolTab) {
      case 'dashboard': return <SchoolAdminDashboard />;
      case 'staff': return <StaffManagementView />;
      case 'classes': return <ClassesManagementView />;
      case 'subjects': return <SubjectsManagementView />;
      case 'rooms': return <RoomsManagementView />;
      case 'years': return <AcademicYearsView />;
      case 'assignments': return <AssignmentsView />;
      case 'documents': return <AdministrativeDocumentsView />;
      case 'events': return <AdministrativeEventsView />;
      case 'reports': return <SchoolReportsView />;
      case 'security': return <SchoolSecurityView />;
      case 'settings': return <SchoolSettingsView />;
      default: return <SchoolAdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#F0F5FA] via-[#E8F1FB] to-[#DFEDFA] text-slate-800 flex flex-col md:flex-row">
      {/* PIN Security Modal */}
      <PinVerificationModal />

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* School Admin Sidebar */}
      <aside className={`fixed md:sticky top-0 h-screen w-[270px] sm:w-64 max-w-[85vw] bg-white/95 backdrop-blur-md border-r border-blue-100 flex flex-col z-50 transition-transform duration-200 shrink-0 shadow-xl md:shadow-none ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Tricolor Guinean top strip */}
        <div className="h-1 w-full grid grid-cols-3 shrink-0">
          <div className="bg-[#CE1126]" />
          <div className="bg-[#FCD116]" />
          <div className="bg-[#009460]" />
        </div>

        {/* Top Header of Sidebar */}
        <div className="p-4 border-b border-blue-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm shadow-xs shrink-0">
              É
            </div>
            <div className="min-w-0">
              <div className="font-bold text-blue-950 text-xs truncate">
                {currentSchool.name}
              </div>
              <div className="text-[10px] text-emerald-700 font-mono font-semibold">
                Portail Admin École
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1 text-slate-500 hover:text-blue-950 rounded-lg hover:bg-blue-50 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* School Selector Dropdown */}
        <div className="p-3 border-b border-blue-100 bg-blue-50/50">
          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Établissement Administré
          </label>
          <select
            value={currentSchool.id}
            onChange={e => setCurrentSchoolId(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-blue-200 text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
          >
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
            ))}
          </select>
        </div>

        {/* Categorized Navigation list */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.groupTitle}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeSchoolTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => {
                        setActiveSchoolTab(item.tab);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'text-slate-600 hover:bg-blue-50 hover:text-blue-950'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isActive ? '[&>svg]:text-white text-white' : ''}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Compact Workspace Role Switcher Popover in Sidebar */}
        <div className="p-3 border-t border-blue-100 bg-blue-50/50 relative">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-blue-50 text-blue-950 border border-blue-200 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-2 truncate">
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
              <span>Changer d'espace</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-white border border-blue-100 rounded-xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-bottom-2 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-blue-100">
                Basculer vers un module
              </div>
              {onSwitchToDirector && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToDirector(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 text-amber-800 font-medium flex items-center justify-between"
                >
                  <span>Espace Directeur</span>
                  <span className="text-[10px] text-amber-600">Pédagogie</span>
                </button>
              )}
              {onSwitchToSecretary && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToSecretary(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-teal-50 text-teal-800 font-medium flex items-center justify-between"
                >
                  <span>Espace Secrétariat</span>
                  <span className="text-[10px] text-teal-600">Dossiers</span>
                </button>
              )}
              {onSwitchToTeacher && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToTeacher(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-800 font-medium flex items-center justify-between"
                >
                  <span>Espace Enseignant</span>
                  <span className="text-[10px] text-blue-600">Cours & Notes</span>
                </button>
              )}
              {onSwitchToSupervisor && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToSupervisor(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-800 font-medium flex items-center justify-between"
                >
                  <span>Espace Surveillant</span>
                  <span className="text-[10px] text-rose-600">Discipline</span>
                </button>
              )}
              {onSwitchToAccountant && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToAccountant(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-800 font-medium flex items-center justify-between"
                >
                  <span>Espace Comptabilité</span>
                  <span className="text-[10px] text-emerald-600">Finances</span>
                </button>
              )}
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSuperAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-slate-600 border-t border-blue-100 mt-1 pt-1.5 font-medium"
              >
                Console Super Admin
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-5 md:px-8 py-2.5 sm:py-3 bg-white/95 backdrop-blur-md border-b border-blue-100 sticky top-0 z-30 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-blue-950 hover:bg-blue-50 shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs min-w-0">
              <span className="font-bold text-blue-950 text-xs sm:text-sm truncate">{currentSchool.name}</span>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <span className="text-emerald-700 font-mono font-semibold hidden sm:inline whitespace-nowrap">Année 2026-2027</span>
              <span className="text-slate-300 hidden xl:inline">·</span>
              <span className="text-slate-500 font-mono hidden xl:inline whitespace-nowrap">Africa/Conakry (GMT)</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* School Isolation Lock Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-slate-500 text-[11px]">Établissement :</span>
              <span className="font-bold text-blue-950 text-xs truncate max-w-[140px]">{currentSchool.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                {currentSchool.code || currentSchool.id}
              </span>
            </div>

            {/* Admin identity badge */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                {assignedAdmin ? assignedAdmin.firstName.charAt(0) : 'A'}
              </div>
              <span className="font-semibold text-emerald-800 truncate max-w-[110px]">
                {assignedAdmin ? `${assignedAdmin.firstName} ${assignedAdmin.lastName}` : 'Admin École'}
              </span>
            </div>

            {/* Compact Modules Launcher Button in Header */}
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold transition-colors"
              title="Basculer vers un autre module"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Modules</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            <button
              onClick={onReturnToSuperAdmin}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              title="Quitter l'espace école et revenir à la gestion centrale"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Super Admin</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
          </div>
        </header>

        {/* View container */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-[1560px] w-full mx-auto min-w-0">
          {renderContent()}
        </main>

        <footer className="mt-auto px-3 sm:px-6 py-3.5 text-center text-[11px] sm:text-xs text-slate-600 border-t border-blue-100 bg-white/75">
          <span className="break-words">SmartSchool ERP Guinée · Conçu et développé par <strong className="text-blue-950">Saïd Soumah</strong> (<a href="mailto:saidsoumah23@gmail.com" className="text-blue-600 hover:underline font-medium">saidsoumah23@gmail.com</a>)</span>
        </footer>
      </div>
    </div>
  );
};
