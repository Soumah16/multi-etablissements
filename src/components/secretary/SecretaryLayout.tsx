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
        { tab: 'parents', label: 'Gestion des Parents', icon: <UserCheck className="w-4 h-4 text-cyan-600" /> },
        { 
          tab: 'dossiers', 
          label: 'Dossiers & Pièces', 
          icon: <FolderArchive className="w-4 h-4 text-amber-600" />, 
          badge: incompleteDossiersCount,
          badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200'
        },
        { tab: 'transfers', label: 'Transferts d\'Élèves', icon: <ArrowRightLeft className="w-4 h-4 text-indigo-600" /> }
      ]
    },
    {
      groupTitle: 'DOCUMENTS & CARTES',
      items: [
        { tab: 'cards', label: 'Cartes Scolaires & QR', icon: <CreditCard className="w-4 h-4 text-teal-600" /> },
        { tab: 'certificates', label: 'Certificats & Attestations', icon: <FileCheck className="w-4 h-4 text-emerald-600" /> },
        { tab: 'archives', label: 'Archives Scolaires', icon: <Archive className="w-4 h-4 text-slate-600" /> }
      ]
    },
    {
      groupTitle: 'ACCUEIL & SÉCURITÉ',
      items: [
        { 
          tab: 'appointments', 
          label: 'Rendez-vous du Jour', 
          icon: <Calendar className="w-4 h-4 text-purple-600" />, 
          badge: todayAppointmentsCount,
          badgeColor: 'bg-purple-100 text-purple-800 border border-purple-200'
        },
        { tab: 'communication', label: 'Communication Familles', icon: <Megaphone className="w-4 h-4 text-blue-600" /> },
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
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#F0F5FA] via-[#E8F1FB] to-[#DFEDFA] text-slate-800 flex flex-col md:flex-row">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-teal-200 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar for Secretary */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-[270px] sm:w-64 max-w-[85vw] bg-white/95 backdrop-blur-md border-r border-blue-100 flex flex-col z-50 transition-transform duration-200 shadow-xl md:shadow-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Tricolor Guinean top strip */}
        <div className="h-1 w-full grid grid-cols-3 shrink-0">
          <div className="bg-[#CE1126]" />
          <div className="bg-[#FCD116]" />
          <div className="bg-[#009460]" />
        </div>

        {/* Brand Area */}
        <div className="p-4 border-b border-blue-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white font-black text-base shadow-sm shrink-0">
              S
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm text-blue-950 tracking-tight leading-none truncate">
                SmartSchool
              </div>
              <div className="text-[10px] text-teal-700 font-bold uppercase tracking-wider mt-0.5 truncate">
                Module Secrétaire
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

        {/* School Identifier */}
        <div className="px-4 py-3 bg-blue-50/60 border-b border-blue-100">
          <div className="text-[10px] uppercase font-bold text-slate-500">Établissement</div>
          <div className="text-xs font-bold text-blue-950 truncate">{profile.schoolName}</div>
          <div className="text-[10px] text-teal-700 font-mono mt-0.5 truncate">{profile.officeRoom}</div>
        </div>

        {/* Categorized Navigation list */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                          : 'text-slate-600 hover:text-blue-950 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isActive ? '[&>svg]:text-white text-white' : ''}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isActive 
                            ? 'bg-white text-teal-700' 
                            : (item.badgeColor || 'bg-rose-100 text-rose-800 border border-rose-200')
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
        <div className="p-3 border-t border-blue-100 bg-blue-50/50 relative">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-blue-50 text-blue-950 border border-blue-200 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-2 truncate">
              <ArrowRightLeft className="w-3.5 h-3.5 text-teal-600" />
              <span>Changer d'espace</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-white border border-blue-100 rounded-xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-bottom-2 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-blue-100">
                Basculer vers un rôle
              </div>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToDirector(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 text-amber-800 font-medium flex items-center justify-between"
              >
                <span>Espace Directeur</span>
                <span className="text-[10px] text-amber-600">Pédagogie</span>
              </button>
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
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSchoolAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-900 font-semibold flex items-center justify-between border-t border-blue-100 mt-1 pt-1.5"
              >
                <span>Espace Admin École</span>
                <span className="text-[10px] text-slate-500">Admin</span>
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSuperAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-slate-600 border-t border-blue-100 mt-1 pt-1.5 font-medium"
              >
                Portail Super Admin
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-5 md:px-8 py-2.5 sm:py-3 bg-white/95 backdrop-blur-md border-b border-blue-100 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-blue-950 rounded-lg hover:bg-blue-50 shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="text-xs font-bold text-blue-950 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="truncate">{profile.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200 hidden sm:inline-block">
                  Secrétaire Générale
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {profile.schoolName} · Matricule {profile.matricule}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Guichet Admissions Ouvert</span>
            </span>

            <img 
              src={profile.photo} 
              alt="" 
              className="w-8 h-8 rounded-full object-cover border-2 border-teal-400" 
            />

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

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-[1560px] w-full mx-auto min-w-0">
          {renderActiveView()}
        </main>

        <footer className="mt-auto px-3 sm:px-6 py-3.5 text-center text-[11px] sm:text-xs text-slate-600 border-t border-blue-100 bg-white/75">
          <span className="break-words">SmartSchool ERP Guinée · Conçu et développé par <strong className="text-blue-950">Saïd Soumah</strong> (<a href="mailto:saidsoumah23@gmail.com" className="text-blue-600 hover:underline font-medium">saidsoumah23@gmail.com</a>)</span>
        </footer>
      </div>
    </div>
  );
};
