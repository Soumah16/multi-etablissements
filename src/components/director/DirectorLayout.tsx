import React, { useState } from 'react';
import { useDirector } from '../../context/DirectorContext';
import { DirectorNavTab } from '../../types/director';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileSignature, 
  FileCheck2, 
  GraduationCap, 
  Users, 
  ShieldAlert, 
  Megaphone, 
  Newspaper, 
  Calendar, 
  Wallet, 
  BarChart3, 
  ShieldCheck, 
  CreditCard, 
  ArrowLeft, 
  Menu, 
  X, 
  CheckCircle2, 
  Lock,
  Building2,
  Sparkles,
  ArrowRightLeft,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { DirectorDashboardView } from './DirectorDashboardView';
import { ReportCardValidationView } from './ReportCardValidationView';
import { ExamValidationView } from './ExamValidationView';
import { PedagogicalSupervisionView } from './PedagogicalSupervisionView';
import { TeacherSupervisionView } from './TeacherSupervisionView';
import { StudentMonitoringView } from './StudentMonitoringView';
import { DisciplinaryView } from './DisciplinaryView';
import { DirectorCommunicationView } from './DirectorCommunicationView';
import { DirectorNewsView } from './DirectorNewsView';
import { DirectorCalendarView } from './DirectorCalendarView';
import { DirectorFinancesView } from './DirectorFinancesView';
import { DirectorReportsView } from './DirectorReportsView';
import { DirectorSecurityView } from './DirectorSecurityView';
import { DirectorBadgeModal } from './DirectorBadgeModal';
import { DirectorPinModal } from './DirectorPinModal';

interface DirectorLayoutProps {
  onReturnToSchoolAdmin: () => void;
  onReturnToSuperAdmin: () => void;
  onLogout?: () => void;
  onSwitchToSecretary?: () => void;
  onSwitchToTeacher?: () => void;
  onSwitchToAccountant?: () => void;
  onSwitchToSupervisor?: () => void;
  onSwitchToLibrarian?: () => void;
  onSwitchToParent?: () => void;
  onSwitchToStudent?: () => void;
}

export const DirectorLayout: React.FC<DirectorLayoutProps> = ({ 
  onReturnToSchoolAdmin, 
  onReturnToSuperAdmin,
  onLogout,
  onSwitchToSecretary,
  onSwitchToTeacher,
  onSwitchToAccountant,
  onSwitchToSupervisor,
  onSwitchToLibrarian,
  onSwitchToParent,
  onSwitchToStudent
}) => {
  const { 
    activeDirectorTab, 
    setActiveDirectorTab, 
    profile, 
    reportCards, 
    exams, 
    disciplineIncidents,
    toastMessage 
  } = useDirector();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const pendingBulletinsCount = reportCards.filter(b => b.directorStatus === 'en_attente').length;
  const pendingExamsCount = exams.filter(e => e.status === 'en_attente').length;
  const pendingIncidentsCount = disciplineIncidents.filter(i => i.directorStatus === 'en_attente').length;

  // Cleanly categorized navigation groups for Director
  const navigationGroups: {
    groupTitle: string;
    items: {
      tab: DirectorNavTab;
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
      groupTitle: 'PILOTAGE PÉDAGOGIQUE',
      items: [
        { tab: 'pedagogy', label: 'Gestion Pédagogique', icon: <BookOpen className="w-4 h-4" /> },
        { tab: 'teachers', label: 'Supervision Enseignants', icon: <GraduationCap className="w-4 h-4 text-blue-400" /> },
        { tab: 'students', label: 'Suivi des Élèves & Alertes', icon: <Users className="w-4 h-4 text-cyan-400" /> }
      ]
    },
    {
      groupTitle: 'EXAMENS & VALIDATION',
      items: [
        { 
          tab: 'bulletins', 
          label: 'Validation Bulletins', 
          icon: <FileSignature className="w-4 h-4 text-emerald-400" />, 
          badge: pendingBulletinsCount,
          badgeColor: 'bg-emerald-500/20 text-emerald-300'
        },
        { 
          tab: 'exams', 
          label: 'Validation Examens', 
          icon: <FileCheck2 className="w-4 h-4 text-amber-400" />, 
          badge: pendingExamsCount,
          badgeColor: 'bg-amber-500/20 text-amber-300'
        },
        { 
          tab: 'discipline', 
          label: 'Discipline & Sanctions', 
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />, 
          badge: pendingIncidentsCount,
          badgeColor: 'bg-rose-500/20 text-rose-300'
        }
      ]
    },
    {
      groupTitle: 'COMMUNICATION & CONTRÔLE',
      items: [
        { tab: 'communication', label: 'Communication Omnicanale', icon: <Megaphone className="w-4 h-4" /> },
        { tab: 'news', label: 'Actualités & Publications', icon: <Newspaper className="w-4 h-4" /> },
        { tab: 'calendar', label: 'Calendrier & Événements', icon: <Calendar className="w-4 h-4" /> },
        { tab: 'finances', label: 'Finances (Consultation)', icon: <Wallet className="w-4 h-4 text-emerald-400" /> },
        { tab: 'reports', label: 'Rapports & Statistiques', icon: <BarChart3 className="w-4 h-4 text-teal-400" /> },
        { tab: 'security', label: 'Sécurité & Code PIN', icon: <ShieldCheck className="w-4 h-4" /> },
        { tab: 'badge', label: 'Badge & Carte Pro', icon: <CreditCard className="w-4 h-4" /> }
      ]
    }
  ];

  const renderActiveView = () => {
    switch (activeDirectorTab) {
      case 'dashboard': return <DirectorDashboardView />;
      case 'pedagogy': return <PedagogicalSupervisionView />;
      case 'bulletins': return <ReportCardValidationView />;
      case 'exams': return <ExamValidationView />;
      case 'teachers': return <TeacherSupervisionView />;
      case 'students': return <StudentMonitoringView />;
      case 'discipline': return <DisciplinaryView />;
      case 'communication': return <DirectorCommunicationView />;
      case 'news': return <DirectorNewsView />;
      case 'calendar': return <DirectorCalendarView />;
      case 'finances': return <DirectorFinancesView />;
      case 'reports': return <DirectorReportsView />;
      case 'security': return <DirectorSecurityView />;
      case 'badge': return <DirectorBadgeModal />;
      default: return <DirectorDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* PIN & 2FA Modal */}
      <DirectorPinModal />

      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
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

      {/* Sidebar for Director */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-200
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Area */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-base shadow-sm">
              D
            </div>
            <div>
              <div className="font-black text-sm text-white tracking-tight leading-none">
                SmartSchool
              </div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                Espace Directeur
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
          <div className="text-[10px] text-blue-400 font-mono mt-0.5">Conakry, Guinée</div>
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
                  const isActive = activeDirectorTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => {
                        setActiveDirectorTab(item.tab);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
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
                            ? 'bg-white text-blue-600' 
                            : (item.badgeColor || 'bg-amber-500/20 text-amber-300 border border-amber-500/30')
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
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Changer d'espace</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-bottom-2 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Basculer vers un rôle
              </div>
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
              {onSwitchToLibrarian && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToLibrarian(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/10 text-indigo-300 flex items-center justify-between"
                >
                  <span>Espace Bibliothécaire</span>
                  <span className="text-[10px] text-indigo-400">Médiathèque</span>
                </button>
              )}
              {onSwitchToParent && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToParent(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/10 text-cyan-300 flex items-center justify-between"
                >
                  <span>Espace Parent</span>
                  <span className="text-[10px] text-cyan-400">Consultation</span>
                </button>
              )}
              {onSwitchToStudent && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToStudent(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-pink-500/10 text-pink-300 flex items-center justify-between"
                >
                  <span>Espace Élève</span>
                  <span className="text-[10px] text-pink-400">Apprenant</span>
                </button>
              )}
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSchoolAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between border-t border-slate-800 mt-1 pt-1.5"
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
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Directeur des Études
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {profile.schoolName} · Matricule {profile.matricule}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* PIN Indicator */}
            <button
              onClick={() => setActiveDirectorTab('security')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono hover:bg-amber-500/20 transition-colors"
              title="Code PIN 6 chiffres et 2FA opérationnels"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>PIN 6 Chiffres Configuré</span>
            </button>

            {/* Quick Badge Button */}
            <button
              onClick={() => setActiveDirectorTab('badge')}
              className="flex items-center gap-2 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Voir mon badge professionnel ISO-7810"
            >
              <img 
                src={profile.photo} 
                alt="" 
                className="w-7 h-7 rounded-full object-cover border border-amber-500/50" 
              />
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

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-[1560px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
