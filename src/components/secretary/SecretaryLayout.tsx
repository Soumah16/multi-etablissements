import React, { useState } from 'react';
import { useSecretary } from '../../context/SecretaryContext';
import { SecretaryNavTab } from '../../types/secretary';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CreditCard, 
  FolderArchive, 
  FileCheck, 
  ArrowRightLeft, 
  Calendar, 
  Megaphone, 
  Archive, 
  ShieldCheck, 
  ArrowLeft, 
  Menu, 
  X, 
  CheckCircle2, 
  GraduationCap,
  Building2,
  Lock,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { SecretaryDashboardView } from './SecretaryDashboardView';
import { StudentEnrollmentView } from './StudentEnrollmentView';
import { ParentManagementView } from './ParentManagementView';
import { StudentCardView } from './StudentCardView';
import { StudentDossiersView } from './StudentDossiersView';
import { CertificatesView } from './CertificatesView';
import { TransfersView } from './TransfersView';
import { AppointmentsView } from './AppointmentsView';
import { SecretaryCommunicationView } from './SecretaryCommunicationView';
import { SecretaryArchivesView } from './SecretaryArchivesView';
import { SecretarySecurityView } from './SecretarySecurityView';

interface SecretaryLayoutProps {
  onReturnToSchoolAdmin: () => void;
  onReturnToDirector: () => void;
  onReturnToSuperAdmin: () => void;
  onLogout?: () => void;
  onSwitchToTeacher?: () => void;
  onSwitchToAccountant?: () => void;
  onSwitchToSupervisor?: () => void;
}

export const SecretaryLayout: React.FC<SecretaryLayoutProps> = ({ 
  onReturnToSchoolAdmin, 
  onReturnToDirector, 
  onReturnToSuperAdmin,
  onLogout,
  onSwitchToTeacher,
  onSwitchToAccountant,
  onSwitchToSupervisor
}) => {
  const { 
    activeSecretaryTab, 
    setActiveSecretaryTab, 
    profile, 
    students, 
    appointments, 
    toastMessage 
  } = useSecretary();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const incompleteDossiersCount = students.filter(s => s.dossierStatus === 'incomplet').length;
  const todayAppointmentsCount = appointments.filter(a => a.date === '2026-11-03').length;

  // Cleanly categorized navigation groups for Secretary
  const navigationGroups: {
    groupTitle: string;
    items: {
      tab: SecretaryNavTab;
      label: string;
      icon: React.ReactNode;
      badge?: number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      groupTitle: 'VUE GÉNÉRALE',
      items: [
        { tab: 'dashboard', label: 'Tableau de Bord', icon: <LayoutDashboard className="w-4 h-4" /> }
      ]
    },
    {
      groupTitle: 'ÉLÈVES & FAMILLES',
      items: [
        { tab: 'students', label: 'Gestion des Élèves', icon: <Users className="w-4 h-4" /> },
        { tab: 'parents', label: 'Gestion des Parents', icon: <UserCheck className="w-4 h-4 text-cyan-400" /> },
        { 
          tab: 'dossiers', 
          label: 'Dossiers & Pièces', 
          icon: <FolderArchive className="w-4 h-4 text-amber-400" />, 
          badge: incompleteDossiersCount,
          badgeColor: 'bg-amber-500/20 text-amber-300'
        },
        { tab: 'transfers', label: 'Transferts d\'Élèves', icon: <ArrowRightLeft className="w-4 h-4 text-indigo-400" /> }
      ]
    },
    {
      groupTitle: 'DOCUMENTS & CARTES',
      items: [
        { tab: 'cards', label: 'Cartes Scolaires & QR', icon: <CreditCard className="w-4 h-4 text-teal-400" /> },
        { tab: 'certificates', label: 'Certificats & Attestations', icon: <FileCheck className="w-4 h-4 text-emerald-400" /> },
        { tab: 'archives', label: 'Archives Scolaires', icon: <Archive className="w-4 h-4 text-slate-400" /> }
      ]
    },
    {
      groupTitle: 'ACCUEIL & SÉCURITÉ',
      items: [
        { 
          tab: 'appointments', 
          label: 'Rendez-vous du Jour', 
          icon: <Calendar className="w-4 h-4 text-purple-400" />, 
          badge: todayAppointmentsCount,
          badgeColor: 'bg-purple-500/20 text-purple-300'
        },
        { tab: 'communication', label: 'Communication Familles', icon: <Megaphone className="w-4 h-4 text-blue-400" /> },
        { tab: 'security', label: 'Sécurité & Journal', icon: <ShieldCheck className="w-4 h-4" /> }
      ]
    }
  ];

  const renderActiveView = () => {
    switch (activeSecretaryTab) {
      case 'dashboard': return <SecretaryDashboardView />;
      case 'students': return <StudentEnrollmentView />;
      case 'parents': return <ParentManagementView />;
      case 'cards': return <StudentCardView />;
      case 'dossiers': return <StudentDossiersView />;
      case 'certificates': return <CertificatesView />;
      case 'transfers': return <TransfersView />;
      case 'appointments': return <AppointmentsView />;
      case 'communication': return <SecretaryCommunicationView />;
      case 'archives': return <SecretaryArchivesView />;
      case 'security': return <SecretarySecurityView />;
      default: return <SecretaryDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-teal-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar for Secretary */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-200
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Area */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white font-black text-base shadow-sm">
              S
            </div>
            <div>
              <div className="font-black text-sm text-white tracking-tight leading-none">
                SmartSchool
              </div>
              <div className="text-[10px] text-teal-400 font-bold uppercase tracking-wider mt-0.5">
                Module Secrétaire
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* School Identifier */}
        <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400">Établissement</div>
          <div className="text-xs font-bold text-white truncate">{profile.schoolName}</div>
          <div className="text-[10px] text-teal-400 font-mono mt-0.5">{profile.officeRoom}</div>
        </div>

        {/* Categorized Navigation list - ORDERLY & ELEGANT */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.groupTitle}
              </div>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const isActive = activeSecretaryTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => {
                        setActiveSecretaryTab(item.tab);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive 
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' 
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono ${
                          isActive 
                            ? 'bg-white text-teal-600' 
                            : (item.badgeColor || 'bg-rose-500/20 text-rose-300 border border-rose-500/30')
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

        {/* Compact Workspace Role Switcher Popover */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 relative">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <ArrowRightLeft className="w-3.5 h-3.5 text-teal-400" />
              <span>Changer d'espace</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-bottom-2 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Basculer vers un rôle
              </div>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToDirector(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-500/10 text-amber-300 flex items-center justify-between"
              >
                <span>Espace Directeur</span>
                <span className="text-[10px] text-amber-400">Pédagogie</span>
              </button>
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
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSchoolAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
              >
                <span>Espace Admin École</span>
                <span className="text-[10px] text-slate-400">Admin</span>
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSuperAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400 border-t border-slate-800 mt-1 pt-1.5"
              >
                Portail Super Admin
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{profile.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Secrétaire Générale
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {profile.schoolName} · Matricule {profile.matricule}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Guichet Admissions Ouvert</span>
            </span>

            <img 
              src={profile.photo} 
              alt="" 
              className="w-8 h-8 rounded-full object-cover border border-teal-500/50" 
            />

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

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-[1560px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
