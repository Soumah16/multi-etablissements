import React, { useState } from 'react';
import { useParent } from '../../context/ParentContext';
import { ParentNavTab } from '../../types/parent';
import { ParentDashboardView } from './ParentDashboardView';
import { ChildrenProfileView } from './ChildrenProfileView';
import { ParentGradesReportCardView } from './ParentGradesReportCardView';
import { ParentHomeworkView } from './ParentHomeworkView';
import { ParentAttendanceView } from './ParentAttendanceView';
import { ParentPaymentsView } from './ParentPaymentsView';
import { ParentCommunicationView } from './ParentCommunicationView';
import { ParentEventsView } from './ParentEventsView';
import { 
  Users, 
  Home, 
  UserCheck, 
  Award, 
  FileText, 
  Clock, 
  CreditCard, 
  Megaphone, 
  Calendar, 
  Menu, 
  X, 
  CheckCircle2, 
  ChevronDown, 
  ArrowLeftRight,
  ShieldCheck,
  LogOut
} from 'lucide-react';

interface ParentLayoutProps {
  onReturnToSuperAdmin: () => void;
  onReturnToSchoolAdmin: () => void;
  onLogout?: () => void;
  onSwitchToDirector?: () => void;
  onSwitchToSecretary?: () => void;
  onSwitchToTeacher?: () => void;
  onSwitchToAccountant?: () => void;
  onSwitchToSupervisor?: () => void;
  onSwitchToLibrarian?: () => void;
  onSwitchToStudent?: () => void;
}

export const ParentLayout: React.FC<ParentLayoutProps> = ({
  onReturnToSuperAdmin,
  onReturnToSchoolAdmin,
  onLogout,
  onSwitchToDirector,
  onSwitchToSecretary,
  onSwitchToTeacher,
  onSwitchToAccountant,
  onSwitchToSupervisor,
  onSwitchToLibrarian,
  onSwitchToStudent
}) => {
  const { 
    activeParentTab, 
    setActiveParentTab, 
    profile, 
    childrenList, 
    selectedChild, 
    setSelectedChildId, 
    toastMessage 
  } = useParent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const navigationGroups: {
    groupTitle: string;
    items: {
      tab: ParentNavTab;
      label: string;
      icon: React.ReactNode;
      badge?: number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      groupTitle: 'TABLEAU DE BORD',
      items: [
        { tab: 'dashboard', label: 'Vue Synthétique', icon: <Home className="w-4 h-4 text-blue-600" /> },
        { tab: 'children', label: 'Fiche de mes Enfants', icon: <UserCheck className="w-4 h-4 text-cyan-600" /> }
      ]
    },
    {
      groupTitle: 'SCOLARITÉ & SUIVI',
      items: [
        { tab: 'grades', label: 'Notes & Relevé Officiel', icon: <Award className="w-4 h-4 text-emerald-600" /> },
        { 
          tab: 'homework', 
          label: 'Devoirs & Cahier de Textes', 
          icon: <FileText className="w-4 h-4 text-amber-600" />,
          badge: selectedChild.pendingHomeworkCount,
          badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200'
        },
        { tab: 'attendance', label: 'Assiduité & Absences', icon: <Clock className="w-4 h-4 text-rose-600" /> }
      ]
    },
    {
      groupTitle: 'FINANCES & COMMUNICATION',
      items: [
        { tab: 'payments', label: 'Scolarité (Orange/MTN)', icon: <CreditCard className="w-4 h-4 text-orange-600" /> },
        { tab: 'communication', label: 'Messagerie Enseignants', icon: <Megaphone className="w-4 h-4 text-purple-600" /> },
        { tab: 'events', label: 'Agenda & Rencontres', icon: <Calendar className="w-4 h-4 text-teal-600" /> }
      ]
    }
  ];

  const renderActiveView = () => {
    switch (activeParentTab) {
      case 'dashboard': return <ParentDashboardView />;
      case 'children': return <ChildrenProfileView />;
      case 'grades': return <ParentGradesReportCardView />;
      case 'homework': return <ParentHomeworkView />;
      case 'attendance': return <ParentAttendanceView />;
      case 'payments': return <ParentPaymentsView />;
      case 'communication': return <ParentCommunicationView />;
      case 'events': return <ParentEventsView />;
      default: return <ParentDashboardView />;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#F0F5FA] via-[#E8F1FB] to-[#DFEDFA] text-slate-800 flex flex-col md:flex-row">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-blue-200 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar */}
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-black text-base shadow-sm shrink-0">
              P
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm text-blue-950 tracking-tight leading-none truncate">SmartSchool</div>
              <div className="text-[10px] text-cyan-700 font-bold uppercase tracking-wider mt-0.5 truncate">
                Portail Parents
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

        {/* Selected Child Selector inside sidebar */}
        <div className="p-3 bg-blue-50/60 border-b border-blue-100 space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-slate-500">Élève Actif :</div>
          <select
            value={selectedChild.id}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-xs font-bold text-blue-950 focus:outline-hidden"
          >
            {childrenList.map(c => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName} ({c.className})
              </option>
            ))}
          </select>
        </div>

        {/* Categorized Navigation */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.groupTitle}
              </div>
              {group.items.map(item => {
                const isActive = activeParentTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActiveParentTab(item.tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
                        isActive ? 'bg-white text-blue-600' : (item.badgeColor || 'bg-amber-100 text-amber-800 border border-amber-200')
                      }`}>
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
        <div className="p-3 border-t border-blue-100 relative bg-blue-50/50">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-950 border border-blue-200 transition-colors text-xs font-semibold shadow-xs"
          >
            <div className="flex items-center gap-2 truncate">
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
              <span>Changer d'espace</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-white border border-blue-100 rounded-xl shadow-2xl p-2 z-50 space-y-1 text-xs max-h-72 overflow-y-auto">
              <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-500 border-b border-blue-100">Bascule de rôle</div>
              {onSwitchToStudent && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToStudent(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-pink-50 text-pink-800 font-medium"
                >
                  Espace Élève
                </button>
              )}
              {onSwitchToTeacher && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToTeacher(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-800 font-medium"
                >
                  Espace Enseignant
                </button>
              )}
              {onSwitchToLibrarian && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToLibrarian(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 text-indigo-800 font-medium"
                >
                  Espace Bibliothécaire
                </button>
              )}
              {onSwitchToDirector && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToDirector(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 text-amber-800 font-medium"
                >
                  Directeur des Études
                </button>
              )}
              {onSwitchToSecretary && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToSecretary(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-teal-50 text-teal-800 font-medium"
                >
                  Secrétaire Générale
                </button>
              )}
              {onSwitchToAccountant && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToAccountant(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-800 font-medium"
                >
                  Chef Comptable
                </button>
              )}
              {onSwitchToSupervisor && (
                <button
                  onClick={() => { setRoleSwitcherOpen(false); onSwitchToSupervisor(); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-800 font-medium"
                >
                  Surveillant Général
                </button>
              )}
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSchoolAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-900 font-semibold border-t border-blue-100 mt-1 pt-1.5"
              >
                Admin École
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSuperAdmin(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-slate-600 font-medium"
              >
                Super Admin
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
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
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-200 hidden sm:inline-block">
                  {profile.relationship}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {profile.schoolName} · Contact : {profile.phone}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Read-Only Notice Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Consultation Parent Sécurisée</span>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-full">
              <img 
                src={profile.photo} 
                alt="" 
                className="w-7 h-7 rounded-full object-cover border-2 border-cyan-400" 
              />
            </div>

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
