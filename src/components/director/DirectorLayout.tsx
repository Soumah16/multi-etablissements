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
        { tab: 'teachers', label: 'Supervision Enseignants', icon: <GraduationCap className="w-4 h-4 text-blue-600" /> },
        { tab: 'students', label: 'Suivi des Élèves & Alertes', icon: <Users className="w-4 h-4 text-cyan-600" /> }
      ]
    },
    {
      groupTitle: 'EXAMENS & VALIDATION',
      items: [
        { 
          tab: 'bulletins', 
          label: 'Validation Bulletins', 
          icon: <FileSignature className="w-4 h-4 text-emerald-600" />, 
          badge: pendingBulletinsCount,
          badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200'
        },
        { 
          tab: 'exams', 
          label: 'Validation Examens', 
          icon: <FileCheck2 className="w-4 h-4 text-amber-600" />, 
          badge: pendingExamsCount,
          badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200'
        },
        { 
          tab: 'discipline', 
          label: 'Discipline & Sanctions', 
          icon: <ShieldAlert className="w-4 h-4 text-rose-600" />, 
          badge: pendingIncidentsCount,
          badgeColor: 'bg-rose-100 text-rose-800 border border-rose-200'
        }
      ]
    },
    {
      groupTitle: 'COMMUNICATION & CONTRÔLE',
      items: [
        { tab: 'communication', label: 'Communication Omnicanale', icon: <Megaphone className="w-4 h-4" /> },
        { tab: 'news', label: 'Actualités & Publications', icon: <Newspaper className="w-4 h-4" /> },
        { tab: 'calendar', label: 'Calendrier & Événements', icon: <Calendar className="w-4 h-4" /> },
        { tab: 'finances', label: 'Finances (Consultation)', icon: <Wallet className="w-4 h-4 text-emerald-600" /> },
        { tab: 'reports', label: 'Rapports & Statistiques', icon: <BarChart3 className="w-4 h-4 text-teal-600" /> },
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
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#F0F5FA] via-[#E8F1FB] to-[#DFEDFA] text-slate-800 flex flex-col md:flex-row">
      {/* PIN & 2FA Modal */}
      <DirectorPinModal />

      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
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

      {/* Sidebar for Director */}
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-base shadow-sm shrink-0">
              D
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm text-blue-950 tracking-tight leading-none truncate">
                SmartSchool
              </div>
              <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mt-0.5 truncate">
                Espace Directeur
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
          <div className="text-[10px] text-blue-600 font-mono mt-0.5">Conakry, Guinée</div>
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
                            ? 'bg-white text-blue-600' 
                            : (item.badgeColor || 'bg-amber-100 text-amber-800 border border-amber-200')
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
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
              <span>Changer d'espace</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-white border border-blue-100 rounded-xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-bottom-2 text-xs max-h-72 overflow-y-auto">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-blue-100">
                Basculer vers un rôle
              </div>
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
              {onSwitchToLibrarian && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToLibrarian(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 text-indigo-800 font-medium flex items-center justify-between"
                >
                  <span>Espace Bibliothécaire</span>
                  <span className="text-[10px] text-indigo-600">Médiathèque</span>
                </button>
              )}
              {onSwitchToParent && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToParent(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-50 text-cyan-800 font-medium flex items-center justify-between"
                >
                  <span>Espace Parent</span>
                  <span className="text-[10px] text-cyan-600">Consultation</span>
                </button>
              )}
              {onSwitchToStudent && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToStudent(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-pink-50 text-pink-800 font-medium flex items-center justify-between"
                >
                  <span>Espace Élève</span>
                  <span className="text-[10px] text-pink-600">Apprenant</span>
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
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 hidden sm:inline-block">
                  Directeur des Études
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {profile.schoolName} · Matricule {profile.matricule}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* PIN Indicator */}
            <button
              onClick={() => setActiveDirectorTab('security')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-semibold hover:bg-amber-100 transition-colors"
              title="Code PIN 6 chiffres et 2FA opérationnels"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>PIN 6 Chiffres</span>
            </button>

            {/* Quick Badge Button */}
            <button
              onClick={() => setActiveDirectorTab('badge')}
              className="flex items-center gap-2 p-1 rounded-full text-slate-600 hover:bg-blue-50 transition-colors"
              title="Voir mon badge professionnel ISO-7810"
            >
              <img 
                src={profile.photo} 
                alt="" 
                className="w-7 h-7 rounded-full object-cover border-2 border-amber-400" 
              />
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
