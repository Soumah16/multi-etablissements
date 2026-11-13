import React, { useState } from 'react';
import { useSupervisor } from '../../context/SupervisorContext';
import { SupervisorNavTab } from '../../types/supervisor';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  FileCheck, 
  Gavel, 
  Eye, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  Lock, 
  Menu, 
  X, 
  CheckCircle2, 
  ChevronDown,
  Building2,
  Sparkles,
  ArrowRightLeft,
  LogOut
} from 'lucide-react';
import { SupervisorDashboardView } from './SupervisorDashboardView';
import { SupervisorAttendanceView } from './SupervisorAttendanceView';
import { SupervisorAdmissionSlipsView } from './SupervisorAdmissionSlipsView';
import { SupervisorDisciplineView } from './SupervisorDisciplineView';
import { SupervisorWatchlistView } from './SupervisorWatchlistView';
import { SupervisorPatrolsView } from './SupervisorPatrolsView';
import { SupervisorMeetingsView } from './SupervisorMeetingsView';
import { SupervisorBadgeView } from './SupervisorBadgeView';
import { SupervisorSecurityView } from './SupervisorSecurityView';

interface SupervisorLayoutProps {
  onReturnToSchoolAdmin: () => void;
  onReturnToDirector: () => void;
  onReturnToSecretary: () => void;
  onReturnToTeacher: () => void;
  onReturnToAccountant: () => void;
  onReturnToSuperAdmin: () => void;
  onLogout?: () => void;
}

export const SupervisorLayout: React.FC<SupervisorLayoutProps> = ({
  onReturnToSchoolAdmin,
  onReturnToDirector,
  onReturnToSecretary,
  onReturnToTeacher,
  onReturnToAccountant,
  onReturnToSuperAdmin,
  onLogout
}) => {
  const { 
    activeSupervisorTab, 
    setActiveSupervisorTab, 
    profile, 
    attendanceRecords,
    incidents,
    watchlist,
    toastMessage 
  } = useSupervisor();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const pendingAttendanceCount = attendanceRecords.filter(r => r.status === 'non_justifie').length;
  const activeIncidentsCount = incidents.filter(i => i.status === 'en_cours').length;
  const watchlistCount = watchlist.length;

  // Categorized Navigation Groups to prevent crowding
  const navigationGroups: {
    groupTitle: string;
    items: {
      tab: SupervisorNavTab;
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
      groupTitle: 'PRÉSENCES & CONTRÔLE D\'ACCÈS',
      items: [
        { 
          tab: 'attendance', 
          label: 'Absences & Retards', 
          icon: <ClipboardCheck className="w-4 h-4 text-emerald-600" />,
          badge: pendingAttendanceCount,
          badgeColor: 'bg-rose-100 text-rose-800 border border-rose-200'
        },
        { 
          tab: 'admission_slips', 
          label: 'Billets de Rentrée', 
          icon: <FileCheck className="w-4 h-4 text-red-600" />
        }
      ]
    },
    {
      groupTitle: 'DISCIPLINE & SURVEILLANCE',
      items: [
        { 
          tab: 'incidents', 
          label: 'Incidents & Sanctions', 
          icon: <Gavel className="w-4 h-4 text-amber-600" />,
          badge: activeIncidentsCount,
          badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200'
        },
        { 
          tab: 'watchlist', 
          label: 'Élèves sous Surveillance', 
          icon: <Eye className="w-4 h-4 text-cyan-600" />,
          badge: watchlistCount,
          badgeColor: 'bg-cyan-100 text-cyan-800 border border-cyan-200'
        },
        { 
          tab: 'patrols', 
          label: 'Rondes & Objets Consignés', 
          icon: <ShieldCheck className="w-4 h-4 text-blue-600" />
        }
      ]
    },
    {
      groupTitle: 'RELATIONS & SÉCURITÉ',
      items: [
        { 
          tab: 'parent_meetings', 
          label: 'Convocations Parents', 
          icon: <Calendar className="w-4 h-4 text-purple-600" />
        },
        { 
          tab: 'badge', 
          label: 'Badge Professionnel', 
          icon: <CreditCard className="w-4 h-4" />
        },
        { 
          tab: 'security', 
          label: 'Sécurité & Code PIN', 
          icon: <Lock className="w-4 h-4" />
        }
      ]
    }
  ];

  const renderActiveView = () => {
    switch (activeSupervisorTab) {
      case 'dashboard': return <SupervisorDashboardView />;
      case 'attendance': return <SupervisorAttendanceView />;
      case 'admission_slips': return <SupervisorAdmissionSlipsView />;
      case 'incidents': return <SupervisorDisciplineView />;
      case 'watchlist': return <SupervisorWatchlistView />;
      case 'patrols': return <SupervisorPatrolsView />;
      case 'parent_meetings': return <SupervisorMeetingsView />;
      case 'badge': return <SupervisorBadgeView />;
      case 'security': return <SupervisorSecurityView />;
      default: return <SupervisorDashboardView />;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#F0F5FA] via-[#E8F1FB] to-[#DFEDFA] text-slate-800 flex flex-col md:flex-row">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-red-200 shrink-0" />
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

      {/* Sidebar for Supervisor */}
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white font-black text-base shadow-sm shrink-0">
              S
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm text-blue-950 tracking-tight leading-none truncate">
                SmartSchool
              </div>
              <div className="text-[10px] text-rose-700 font-bold uppercase tracking-wider mt-0.5 truncate">
                Module Surveillant
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
        <div className="px-4 py-2.5 bg-blue-50/60 border-b border-blue-100">
          <div className="text-[9px] uppercase font-bold text-slate-500">Établissement</div>
          <div className="text-xs font-bold text-blue-950 truncate">{profile.schoolName}</div>
          <div className="text-[10px] text-rose-700 font-mono mt-0.5 truncate">{profile.department}</div>
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
                  const isActive = activeSupervisorTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => {
                        setActiveSupervisorTab(item.tab);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive 
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
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
                            ? 'bg-white text-red-600' 
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

        {/* Compact Workspace Role Switcher */}
        <div className="p-3 border-t border-blue-100 bg-blue-50/50 relative">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-blue-50 text-blue-950 border border-blue-200 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-2 truncate">
              <ArrowRightLeft className="w-3.5 h-3.5 text-rose-600" />
              <span>Changer d'espace</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-white border border-blue-100 rounded-xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-bottom-2 text-xs max-h-72 overflow-y-auto">
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
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToSecretary(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-teal-50 text-teal-800 font-medium flex items-center justify-between"
              >
                <span>Espace Secrétariat</span>
                <span className="text-[10px] text-teal-600">Dossiers</span>
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToTeacher(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-800 font-medium flex items-center justify-between"
              >
                <span>Espace Enseignant</span>
                <span className="text-[10px] text-blue-600">Cours & Notes</span>
              </button>
              <button
                onClick={() => { setRoleSwitcherOpen(false); onReturnToAccountant(); }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-800 font-medium flex items-center justify-between"
              >
                <span>Espace Comptabilité</span>
                <span className="text-[10px] text-emerald-600">Finances</span>
              </button>
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
                <span className="truncate">{profile.firstName} {profile.lastName}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 hidden sm:inline-block">
                  {profile.roleTitle}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {profile.schoolName} · Matricule {profile.matricule}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Vie Scolaire Active</span>
            </span>

            <button
              onClick={() => setActiveSupervisorTab('badge')}
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-rose-400 transition-all"
              title="Voir mon badge de surveillant"
            >
              <img 
                src={profile.photo} 
                alt="" 
                className="w-8 h-8 rounded-full object-cover border-2 border-rose-400" 
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
