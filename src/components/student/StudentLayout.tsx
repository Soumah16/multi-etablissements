import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { StudentNavTab } from '../../types/student';
import { StudentDashboardView } from './StudentDashboardView';
import { StudentProfileCardView } from './StudentProfileCardView';
import { StudentCoursesView } from './StudentCoursesView';
import { StudentHomeworkView } from './StudentHomeworkView';
import { StudentGradesView } from './StudentGradesView';
import { StudentReportCardView } from './StudentReportCardView';
import { StudentScheduleView } from './StudentScheduleView';
import { StudentAttendanceView } from './StudentAttendanceView';
import { StudentMessagingView } from './StudentMessagingView';
import { 
  GraduationCap, 
  Home, 
  CreditCard, 
  BookOpen, 
  FileText, 
  Award, 
  FileCheck2, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Menu, 
  X, 
  CheckCircle2, 
  ChevronDown, 
  ArrowLeftRight,
  QrCode,
  LogOut
} from 'lucide-react';

interface StudentLayoutProps {
  onReturnToSuperAdmin: () => void;
  onReturnToSchoolAdmin: () => void;
  onLogout?: () => void;
  onSwitchToDirector?: () => void;
  onSwitchToSecretary?: () => void;
  onSwitchToTeacher?: () => void;
  onSwitchToAccountant?: () => void;
  onSwitchToSupervisor?: () => void;
  onSwitchToLibrarian?: () => void;
  onSwitchToParent?: () => void;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({
  onReturnToSuperAdmin,
  onReturnToSchoolAdmin,
  onLogout,
  onSwitchToDirector,
  onSwitchToSecretary,
  onSwitchToTeacher,
  onSwitchToAccountant,
  onSwitchToSupervisor,
  onSwitchToLibrarian,
  onSwitchToParent
}) => {
  const { activeStudentTab, setActiveStudentTab, profile, homeworks, toastMessage } = useStudent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const pendingHomeworkCount = homeworks.filter(h => h.status === 'en_attente').length;

  const navigationGroups: {
    groupTitle: string;
    items: {
      tab: StudentNavTab;
      label: string;
      icon: React.ReactNode;
      badge?: number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      groupTitle: 'VUE GÉNÉRALE',
      items: [
        { tab: 'dashboard', label: 'Tableau de Bord', icon: <Home className="w-4 h-4 text-blue-400" /> },
        { tab: 'profile', label: 'Carte Scolaire & QR Code', icon: <CreditCard className="w-4 h-4 text-cyan-400" /> }
      ]
    },
    {
      groupTitle: 'COURS & DEVOIRS',
      items: [
        { tab: 'courses', label: 'Supports de Cours', icon: <BookOpen className="w-4 h-4 text-purple-400" /> },
        { 
          tab: 'homework', 
          label: 'Devoirs & Dépôt Copies', 
          icon: <FileText className="w-4 h-4 text-amber-400" />,
          badge: pendingHomeworkCount,
          badgeColor: 'bg-amber-500/20 text-amber-300'
        }
      ]
    },
    {
      groupTitle: 'ÉVALUATIONS & BULLETINS',
      items: [
        { tab: 'grades', label: 'Notes & Coefficients', icon: <Award className="w-4 h-4 text-emerald-400" /> },
        { tab: 'report_card', label: 'Bulletin Trimestriel', icon: <FileCheck2 className="w-4 h-4 text-teal-400" /> }
      ]
    },
    {
      groupTitle: 'VIE SCOLAIRE & ÉCHANGES',
      items: [
        { tab: 'schedule', label: 'Emploi du Temps', icon: <Calendar className="w-4 h-4 text-indigo-400" /> },
        { tab: 'attendance', label: 'Assiduité & Présences', icon: <Clock className="w-4 h-4 text-rose-400" /> },
        { tab: 'messages', label: 'Messagerie Enseignants', icon: <MessageSquare className="w-4 h-4 text-blue-400" /> }
      ]
    }
  ];

  const renderActiveView = () => {
    switch (activeStudentTab) {
      case 'dashboard': return <StudentDashboardView />;
      case 'profile': return <StudentProfileCardView />;
      case 'courses': return <StudentCoursesView />;
      case 'homework': return <StudentHomeworkView />;
      case 'grades': return <StudentGradesView />;
      case 'report_card': return <StudentReportCardView />;
      case 'schedule': return <StudentScheduleView />;
      case 'attendance': return <StudentAttendanceView />;
      case 'messages': return <StudentMessagingView />;
      default: return <StudentDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-blue-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-200
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Area */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm">
              É
            </div>
            <div>
              <div className="font-black text-sm text-white tracking-tight leading-none">SmartSchool</div>
              <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-0.5">
                Espace Apprenant
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

        {/* Student card info */}
        <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800 flex items-center gap-3">
          <img
            src={profile.photo}
            alt={profile.firstName}
            className="w-10 h-10 rounded-xl object-cover border border-blue-400/40"
          />
          <div className="min-w-0">
            <div className="font-bold text-xs text-white truncate">{profile.firstName} {profile.lastName}</div>
            <div className="text-[10px] text-blue-400 font-bold">{profile.className}</div>
            <div className="text-[9px] text-slate-400 font-mono truncate">{profile.matricule}</div>
          </div>
        </div>

        {/* Categorized Navigation */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.groupTitle}
              </div>
              {group.items.map(item => {
                const isActive = activeStudentTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActiveStudentTab(item.tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.badgeColor || 'bg-slate-700 text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Switcher */}
        <div className="p-3 border-t border-slate-800 relative bg-slate-900/90">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-semibold"
          >
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
              <span>Changer d'espace</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute bottom-16 left-3 right-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-1 text-xs max-h-72 overflow-y-auto">
              <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-500">Bascule de rôle</div>
              {onSwitchToParent && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToParent(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-cyan-300"
                >
                  Espace Parent
                </button>
              )}
              {onSwitchToTeacher && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToTeacher(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-blue-300"
                >
                  Espace Enseignant
                </button>
              )}
              {onSwitchToLibrarian && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToLibrarian(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-indigo-300"
                >
                  Espace Bibliothécaire
                </button>
              )}
              {onSwitchToDirector && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToDirector(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-amber-300"
                >
                  Directeur des Études
                </button>
              )}
              {onSwitchToSecretary && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToSecretary(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-teal-300"
                >
                  Secrétaire Générale
                </button>
              )}
              {onSwitchToAccountant && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToAccountant(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-emerald-300"
                >
                  Chef Comptable
                </button>
              )}
              {onSwitchToSupervisor && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToSupervisor(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-rose-300"
                >
                  Surveillant Général
                </button>
              )}
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSchoolAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-emerald-400 border-t border-slate-800 mt-1 pt-1.5"
              >
                Admin École
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSuperAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                Super Admin
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
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
                <span>{profile.firstName} {profile.lastName}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {profile.className}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {profile.schoolName} · Matricule {profile.matricule}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveStudentTab('profile')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono hover:bg-blue-500/20 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span>Badge Scolaire</span>
            </button>

            <button
              onClick={() => setActiveStudentTab('profile')}
              className="flex items-center gap-2 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <img 
                src={profile.photo} 
                alt="" 
                className="w-7 h-7 rounded-full object-cover border border-blue-500/50" 
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

        <main className="flex-1 p-4 md:p-8 max-w-[1560px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
