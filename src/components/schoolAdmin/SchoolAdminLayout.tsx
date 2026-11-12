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
        { tab: 'staff', label: 'Personnel & Badges', icon: <Users className="w-4 h-4 text-emerald-400" />, badge: staff.length },
        { tab: 'classes', label: 'Classes & Sections', icon: <Building2 className="w-4 h-4 text-blue-400" />, badge: classes.length },
        { tab: 'subjects', label: 'Matières & Coefs', icon: <BookOpen className="w-4 h-4 text-amber-400" /> }
      ]
    },
    {
      groupTitle: 'INFRASTRUCTURE & CADRE',
      items: [
        { tab: 'rooms', label: 'Salles & Espaces', icon: <DoorOpen className="w-4 h-4" /> },
        { tab: 'years', label: 'Années Scolaires', icon: <Calendar className="w-4 h-4 text-purple-400" /> },
        { tab: 'assignments', label: 'Affectations', icon: <Shuffle className="w-4 h-4 text-cyan-400" /> }
      ]
    },
    {
      groupTitle: 'ADMINISTRATION & RAPPORTS',
      items: [
        { tab: 'documents', label: 'Documents & Certificats', icon: <FileText className="w-4 h-4 text-teal-400" /> },
        { tab: 'events', label: 'Événements & Notes', icon: <Megaphone className="w-4 h-4 text-rose-400" /> },
        { tab: 'reports', label: 'Rapports & Exports', icon: <BarChart3 className="w-4 h-4 text-yellow-400" /> }
      ]
    },
    {
      groupTitle: 'SÉCURITÉ & SYSTÈME',
      items: [
        { tab: 'security', label: 'Sécurité & Code PIN', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* PIN Security Modal */}
      <PinVerificationModal />

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* School Admin Sidebar */}
      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-200 shrink-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Top Header of Sidebar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm shadow-xs">
              É
            </div>
            <div>
              <div className="font-bold text-white text-xs truncate max-w-[150px]">
                {currentSchool.name}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                Portail Admin École
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* School Selector Dropdown */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/40">
          <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
            Établissement Administré
          </label>
          <select
            value={currentSchool.id}
            onChange={e => setCurrentSchoolId(e.target.value)}
            className="w-full px-2 py-1.5 text-xs rounded bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none"
          >
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
            ))}
          </select>
        </div>

        {/* Categorized Navigation list - ORDERLY & ELEGANT */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
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
                          : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-white text-emerald-700' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
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
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 relative">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Changer d'espace</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-bottom-2 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Basculer vers un module
              </div>
              {onSwitchToDirector && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToDirector(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-500/10 text-amber-300 flex items-center justify-between"
                >
                  <span>Espace Directeur</span>
                  <span className="text-[10px] text-amber-400">Pédagogie</span>
                </button>
              )}
              {onSwitchToSecretary && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToSecretary(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-teal-500/10 text-teal-300 flex items-center justify-between"
                >
                  <span>Espace Secrétariat</span>
                  <span className="text-[10px] text-teal-400">Dossiers</span>
                </button>
              )}
              {onSwitchToTeacher && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToTeacher(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10 text-blue-300 flex items-center justify-between"
                >
                  <span>Espace Enseignant</span>
                  <span className="text-[10px] text-blue-400">Cours & Notes</span>
                </button>
              )}
              {onSwitchToSupervisor && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToSupervisor(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 text-red-300 flex items-center justify-between"
                >
                  <span>Espace Surveillant</span>
                  <span className="text-[10px] text-red-400">Discipline</span>
                </button>
              )}
              {onSwitchToAccountant && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToAccountant(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-300 flex items-center justify-between"
                >
                  <span>Espace Comptabilité</span>
                  <span className="text-[10px] text-emerald-400">Finances</span>
                </button>
              )}
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSuperAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400 border-t border-slate-800 mt-1 pt-1.5"
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
        <header className="flex items-center justify-between gap-4 px-4 md:px-8 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-white text-sm">{currentSchool.name}</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-mono">Année 2026-2027 Active</span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="text-slate-400 font-mono hidden sm:inline">Africa/Conakry (GMT)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* School Isolation Lock Badge: An admin cannot access other schools */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 text-[11px]">Établissement Attribué :</span>
              <span className="font-bold text-white text-xs">{currentSchool.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                {currentSchool.code || currentSchool.id}
              </span>
            </div>

            {/* Admin identity badge */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-xs">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                {assignedAdmin ? assignedAdmin.firstName.charAt(0) : 'A'}
              </div>
              <span className="font-semibold text-emerald-300">
                {assignedAdmin ? `${assignedAdmin.firstName} ${assignedAdmin.lastName}` : 'Admin École'}
              </span>
            </div>

            {/* Compact Modules Launcher Button in Header */}
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              title="Basculer vers un autre module"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Modules</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={onReturnToSuperAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
              title="Quitter l'espace école et revenir à la gestion centrale multi-établissements"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Super Admin</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
          </div>
        </header>

        {/* View container */}
        <main className="flex-1 p-4 md:p-8 max-w-[1560px] w-full mx-auto">
          {renderContent()}
        </main>

        <footer className="mt-auto px-4 py-3 text-center text-xs text-slate-500 border-t border-slate-800/60">
          <span>SmartSchool ERP Guinée · Conçu et développé par <strong className="text-slate-300">Saïd Soumah</strong> (<a href="mailto:saidsoumah23@gmail.com" className="text-blue-400 hover:underline">saidsoumah23@gmail.com</a>)</span>
        </footer>
      </div>
    </div>
  );
};
